from dataclasses import dataclass

from selenium.webdriver.common.by import By


@dataclass
class ResponseData:
    url: str = ''
    provider: str = ''
    message: str = ''
    status: str = ''


@dataclass
class CookieFilter:
    provider: str
    keywords: list[str]
    element: str
    attribute: str = None
    timeout: int = 0

    def is_in(self, text: str) -> bool:
        return any(keyword in text for keyword in self.keywords)


@dataclass
class SearchResult:
    url: str
    provider: str = None
    message: str = None
    status: str = None


def to_search_by(attribute: str):
    match attribute:
        case 'src':
            return By.TAG_NAME
        case 'href':
            return By.TAG_NAME
        case 'id':
            return By.ID
        case 'class':
            return By.CLASS_NAME
        case _:
            raise ValueError(f"Attribute ({attribute}) not supported now")
