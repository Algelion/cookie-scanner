import { Injectable } from '@angular/core';
import { ScannerRowData } from "../shared/scanner-row-data";
import { FiltersRowLoaderService } from "./filters-row-loader.service";
import { FilterRowData } from "../shared/filter-row-data";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  public readonly data: ScannerRowData[] = [];

  public constructor(private _filtersLoader: FiltersRowLoaderService) { }

  public readonly upload = async (file: File): Promise<any> => {
    if (!file) {
      return Promise.reject('No file provided');
    }

    const formData: FormData = new FormData();
    formData.append('file', file);

    try {
      const response: Response = await fetch(environment.apiUploadXlsx, {
        method: 'POST',
        body: formData
      });
      return await this.handleResponse(response);
    } catch (error) {
      return error;
    }
  }

  public readonly uploadUrls = async (urls: string): Promise<any> => {
    if (!urls) {
      return Promise.reject('No urls provided');
    }

    try {
      const response: Response = await fetch(environment.apiUploadUrl, {
        method: 'POST',
        body: JSON.stringify({ data: urls }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      return await this.handleResponse(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public readonly startScan = async (): Promise<any> => {
    try {
      if (this.data.length === 0) {
        return Promise.reject('No data to scan');
      }

      const filters: FilterRowData[] = this._filtersLoader.load('filters');
      if (filters.length === 0) {
        return Promise.reject('No filters to scan');
      }

      const filtersData = filters.map(row => Object.fromEntries(row.fields.entries()));
      const response: Response = await fetch(environment.apiStartScanUrl, {
        method: 'POST',
        body: JSON.stringify({ filters: filtersData }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      return await this.handleResponse(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public readonly abortScan = async (): Promise<any> => {
    try {
      const response: Response = await fetch(environment.apiStopScanUrl, {
        method: 'GET'
      });
      return await this.handleResponse(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public readonly scan = async (): Promise<any> => {
    try {
      const response: Response = await fetch(environment.apiScanUrl, {
        method: 'GET'
      });
      return await this.handleResponse(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private readonly handleResponse = async (response: Response): Promise<any> => {
    if (!response.ok) {
      return Promise.reject(response.statusText);
    }

    const responseJson = await response.json();
    const data = responseJson.data;

    this.data.length = 0;

    for (let i: number = 0; i < data.length; i++) {
      this.data.push(new ScannerRowData(
        i + 1,
        data[i].url,
        data[i].provider ?? '',
        data[i].message ?? '',
        data[i].status));
    }

    return responseJson;
  }
}
