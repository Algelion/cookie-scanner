import { Injectable } from '@angular/core';
import { LocalStorageService } from "./local-storage.service";
import { FilterRowData } from "../shared/filter-row-data";
import { SearchBy } from "../shared/enums/search-by";
import { SearchScope } from "../shared/enums/search-scope";

@Injectable({
  providedIn: 'root'
})
export class FiltersRowLoaderService {
  public constructor(private localStorageService: LocalStorageService) { }

  public readonly load = (name: string): FilterRowData[] => {
    const rows: FilterRowData[] = [];

    this.localStorageService.get<[]>(name)?.forEach(row => {
      rows.push(new FilterRowData(row['#'] as number, row['provider'] as string,
        row['element'] as string, row['attribute'] as string,
        row['search by'] as SearchBy, row['search scope'] as SearchScope,
        row['keywords'] as string, row['timeout'] as number));
    });

    return rows;
  }

  public readonly save = (name: string, rows: FilterRowData[]): void => {
    const dataToSave = rows.map(row => Object.fromEntries(row.fields.entries()));
    this.localStorageService.set(name, dataToSave);
  }
}
