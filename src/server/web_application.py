from io import BytesIO
from os.path import join, dirname, realpath

import pandas as pd
from flask import Flask, jsonify, send_file, request
from flask_cors import CORS

from src.server.common import ResponseData, CookieFilter
from src.server.scanner_process import CookieScannerProcess


class WebApplication:
    def __init__(self, name: str, static_folder: str):
        self.static_folder = join(dirname(realpath(__file__)), static_folder)
        self.app = Flask(name, static_folder=self.static_folder)
        self.data = []
        self.search_filters = []
        self.scanner = None
        CORS(self.app)

    def __del__(self):
        if self.scanner is not None:
            self.scanner.abort_scan()

    def run(self):
        @self.app.route('/')
        def index():
            return self.app.send_static_file('index.html')

        @self.app.route('/<path:path>')
        def static_file(path):
            return self.app.send_static_file(f'{path}')

        @self.app.route('/cookie_scanner/api/v1/scan', methods=['GET'])
        def scan():
            self.__scan__()
            return jsonify({'data': self.data}), 200

        @self.app.route('/cookie_scanner/api/v1/start_scan', methods=['POST'])
        def start_scan():
            return self.__start_scan__()

        @self.app.route('/cookie_scanner/api/v1/abort_scan', methods=['GET'])
        def abort_scan():
            return self.__abort_scan__()

        @self.app.route('/cookie_scanner/api/v1/scan_status', methods=['GET'])
        def scan_status():
            return jsonify({'data': self.data}), 200

        @self.app.route('/cookie_scanner/api/v1/upload_urls', methods=['POST'])
        def upload_urls():
            return self.__upload_urls__()

        @self.app.route('/cookie-scanner/api/v1/upload_xlsx', methods=['POST'])
        def upload_xlsx():
            return self.__upload_xlsx__()

        @self.app.route('/cookie_scanner/api/v1/download_xlsx', methods=['GET'])
        def download_xlsx():
            return self.__download_xlsx__()

        return self.app

    def __scan__(self):
        page_urls = [data.url for data in self.data]

        self.scanner = CookieScannerProcess()
        self.scanner.start_scan(page_urls, self.search_filters)
        self.data = self.scanner.get_scan_status()

    def __start_scan__(self):
        if 'filters' not in request.json:
            return jsonify({'error': 'No filters provided'}), 400

        filters = request.json.get('filters')
        for i in range(len(filters)):
            keywords = filters[i].get('keywords')
            if keywords:
                keywords = [keyword.strip() for keyword in keywords.split(',')]
                keywords = [keyword for keyword in keywords if keyword]

            self.search_filters.append(
                CookieFilter(provider=filters[i].get('provider'),
                             attribute=filters[i].get('attribute'),
                             element=filters[i].get('element'),
                             keywords=keywords,
                             timeout=int(filters[i].get('timeout'))))

        for i in range(len(self.data)):
            self.data[i].status = 'Scanning'
            self.data[i].message = None
            self.data[i].provider = None
        return jsonify({'data': self.data, 'message': 'Scan started'}), 200

    def __abort_scan__(self):
        if self.scanner:
            self.scanner.abort_scan()
            results = self.scanner.get_scan_status()
            self.__process_response_data__(results)

        for i in range(len(self.data)):
            if self.data[i].status == 'Scanning' or self.data[i].status == 'Waiting':
                self.data[i].message = 'Scan aborted'
                self.data[i].status = 'Error'
        return jsonify({'data': self.data, 'message': 'Scan aborted'}), 200

    def __scan_status__(self):
        if self.scanner is None:
            return jsonify({'error': 'No scan started'}), 400
        results = self.scanner.get_scan_status()
        self.__process_response_data__(results)
        return jsonify({'data': self.data, 'finished': self.scanner.scan_finished}), 200

    def __upload_xlsx__(self):
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if file:
            self.data.clear()
            df = pd.read_excel(file)
            urls = df.get('URL').tolist()

            for url in urls:
                self.data.append(ResponseData(url=url, status='Waiting'))

            return jsonify({'data': self.data}), 200

    def __upload_urls__(self):
        if 'data' not in request.json:
            return jsonify({'error': 'No data provided'}), 400

        data = request.json.get('data')
        urls = [data.strip() for data in data.split(',')]
        urls = [url for url in urls if url]

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        self.data.clear()
        for url in urls:
            self.data.append(ResponseData(url=url, status='Waiting'))

        return jsonify({'data': self.data}), 200

    def __download_xlsx__(self):
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df = pd.DataFrame(self.data)
            df.to_excel(writer, index=False)
        output.seek(0)
        return send_file(output, download_name='result.xlsx', as_attachment=True)

    def __process_response_data__(self, response_data):
        for row in self.data:
            for result in response_data:
                if row.url == result.url:
                    row.message = result.message
                    row.status = result.status
