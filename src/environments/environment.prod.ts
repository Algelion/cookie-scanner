export const environment = {
  production: true,
  apiUrl: 'cookie_scanner/api/',
  apiVersion: 'v1',

  get apiDownloadUrl() {
    return `${this.apiUrl}${this.apiVersion}/download/`;
  },
  get apiUploadUrl() {
    return `${this.apiUrl}${this.apiVersion}/upload/`;
  },
  get apiStartScanUrl() {
    return `${this.apiUrl}${this.apiVersion}/start_scan/`;
  },
  get apiStopScanUrl() {
    return `${this.apiUrl}${this.apiVersion}/stop_scan/`;
  },
  get apiScanStatusUrl() {
    return `${this.apiUrl}${this.apiVersion}/scan_status/`;
  },
  get apiScanUrl() {
    return `${this.apiUrl}${this.apiVersion}/scan/`;
  },
};
