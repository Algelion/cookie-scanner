import json
import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
sys.path.insert(0, ROOT_DIR)

if __name__ == '__main__':
    from common import CookieFilter
    from cookie_scanner import CookieScanner
    from selenium.webdriver import Chrome

    urls = json.loads(sys.argv[1])
    cookie_filters_json = json.loads(sys.argv[2])

    cookie_filters = [CookieFilter(**cookie_filter) for cookie_filter in cookie_filters_json]

    scanner = CookieScanner(Chrome())
    scanner.start_scan(urls, cookie_filters)
    print(json.dumps([result.__dict__ for result in scanner.get_scan_status()]))
