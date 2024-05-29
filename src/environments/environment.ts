export const environment = {
  production: false,
  apiUrl: 'cookie_scanner/api',
  apiVersion: 'v1',

  get apiDownloadXlsx() {
    return `${this.apiUrl}/${this.apiVersion}/download_xlsx`;
  },
  get apiUploadUrl() {
    return `${this.apiUrl}/${this.apiVersion}/upload_urls`;
  },
  get apiUploadXlsx() {
    return `${this.apiUrl}/${this.apiVersion}/upload_xlsx`;
  },
  get apiStartScanUrl() {
    return `${this.apiUrl}/${this.apiVersion}/start_scan`;
  },
  get apiStopScanUrl() {
    return `${this.apiUrl}/${this.apiVersion}/stop_scan`;
  },
  get apiScanStatusUrl() {
    return `${this.apiUrl}/${this.apiVersion}/scan_status`;
  },
  get apiScanUrl() {
    return `${this.apiUrl}/${this.apiVersion}/scan`;
  },
};
