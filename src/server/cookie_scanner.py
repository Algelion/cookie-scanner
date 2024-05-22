import time

from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from selenium.common.exceptions import TimeoutException

from src.server.common import SearchResult, CookieFilter, to_search_by


class CookieScanner:
    def __init__(self, driver: WebDriver):
        self.driver: WebDriver = driver

        self.abort: bool = False
        self.results: list[SearchResult] = []
        self.urls: list[str] = []
        self.filters: list[CookieFilter] = []
        self.scan_finished: bool = False

    def __del__(self):
        if self.driver is not None:
            self.driver.quit()

    def start_scan(self, urls: list[str], filters: list[CookieFilter]):
        self.scan_finished = False
        self.abort = False

        self.urls: list[str] = urls
        self.filters: list[CookieFilter] = filters
        self.results = [SearchResult(url=url, status='Scanning') for url in urls]
        return self.__start_scan__()

    def abort_scan(self):
        self.abort = True
        if self.driver is not None:
            self.driver.quit()

    def get_scan_status(self):
        return self.results

    def __start_scan__(self):
        if self.driver is None:
            raise ValueError("Driver is not initialized")
        if self.urls is None or len(self.urls) == 0:
            raise ValueError("No page URLs provided")
        if self.filters is None or len(self.filters) == 0:
            raise ValueError("No filters provided")

        for url in self.urls:
            self.__scan_url__(url)

        self.scan_finished = True
        return self.results

    def __scan_url__(self, url):
        if self.abort:
            return
        self.driver.get(f"https://{url}")
        result = self.__scan_page__(url)
        self.__update_result__(url, result)

    def __scan_page__(self, url):
        print('[INFO] Scanning page:', url)

        for cookie_filter in self.filters:
            search_by = to_search_by(cookie_filter.attribute)

            page_elements = self.__get_page_elements__(search_by, cookie_filter)
            for page_element in page_elements:

                attributes = self.__get_all_attributes__(page_element)

                for attr_name, attr_value in attributes.items():
                    if ((attr_name and cookie_filter.is_in(attr_name))
                            or (attr_value and cookie_filter.is_in(attr_value))):
                        message = f'Found {cookie_filter.provider} cookie banner'
                        return SearchResult(url=url, provider=cookie_filter.provider, message=message, status='Done')

        return SearchResult(url=url, provider='None', message='Nothing found', status='Done')

    def __get_all_attributes__(self, element):
        script = ("var items = {}; "
                  "for (index = 0; index < arguments[0].attributes.length; ++index) {"
                  "     items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value "
                  "}; "
                  "return items;")
        return self.driver.execute_script(script, element)

    def __get_page_elements__(self, search_by, cookie_filter):
        if cookie_filter.timeout > 0:
            if search_by == By.TAG_NAME:
                return self.__presence_of_all_page_elements_by_tag_name_located__(cookie_filter)
            else:
                return self.__presence_of_page_element_by_keywords_located__(search_by, cookie_filter)
        else:
            if search_by == By.TAG_NAME:
                return self.__get_page_elements_by_tag_name__(cookie_filter)
            else:
                return self.__get_page_elements_by_keywords__(search_by, cookie_filter)

    def __presence_of_all_page_elements_by_tag_name_located__(self, cookie_filter):
        try:
            return WebDriverWait(self.driver, cookie_filter.timeout).until(
                ec.presence_of_all_elements_located((By.TAG_NAME, cookie_filter.element)),
                message=f"Could not find elements by tag name ({cookie_filter.element})")
        except TimeoutException:
            return []

    def __presence_of_page_element_by_keywords_located__(self, search_by, cookie_filter):
        start_time = time.time()

        while True:
            if time.time() - start_time > cookie_filter.timeout:
                return []
            for keyword in cookie_filter.keywords:
                try:
                    return WebDriverWait(self.driver, cookie_filter.timeout - (time.time() - start_time)).until(
                        ec.presence_of_all_elements_located((search_by, keyword)),
                        message=f"Could not find elements by keyword ({keyword})")
                except TimeoutException:
                    continue

    def __get_page_elements_by_tag_name__(self, cookie_filter):
        return self.driver.find_elements(By.TAG_NAME, cookie_filter.element)

    def __get_page_elements_by_keywords__(self, search_by, cookie_filter):
        for keyword in cookie_filter.keywords:
            page_elements = self.driver.find_elements(search_by, keyword)
            if page_elements and len(page_elements) > 0:
                return page_elements

        return []

    def __update_result__(self, url, result):
        for i in range(len(self.results)):
            if self.results[i].url == url:
                self.results[i] = result
                break
