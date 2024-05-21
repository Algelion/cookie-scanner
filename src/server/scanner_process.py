import json
from subprocess import Popen, PIPE

from src.server.common import CookieFilter, SearchResult


class CookieScannerProcess:
    def __init__(self):
        self.scanner = None
        self.process = None

    def start_scan(self, urls: list[str], cookie_filters: list[CookieFilter]):
        cookie_filters_json = json.dumps([cookie_filter.__dict__ for cookie_filter in cookie_filters])
        self.process = Popen(
            ['python', 'src/server/scanner_worker.py', json.dumps(urls), cookie_filters_json],
            stdout=PIPE)
        self.process.wait()

    def abort_scan(self):
        if self.process:
            self.process.terminate()
            self.process.wait()

    def get_scan_status(self):
        if self.process and self.process.poll() is not None:
            output, _ = self.process.communicate()
            results = [SearchResult(**result) for result in json.loads(output.decode())]
            return results
        return []
