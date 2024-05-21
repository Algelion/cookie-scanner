import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { FilterRowData } from "../shared/filter-row-data";
import { SearchBy } from "../shared/enums/search-by";
import { SearchScope } from "../shared/enums/search-scope";

@Injectable({
  providedIn: 'root'
})
export class XlsxLoaderService {
  public readonly download = (data: any[], name: string): void => {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
    XLSX.writeFile(workbook, `${name}.xlsx`);
  }

  public readonly upload = (file: File): Promise<FilterRowData[]> => {
    return new Promise<FilterRowData[]>((resolve, reject) => {
      const reader: FileReader = new FileReader();
      const data: FilterRowData[] = [];
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const workbook: XLSX.WorkBook = XLSX.read(event.target?.result as string);
          const worksheet: XLSX.WorkSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows: any[] = XLSX.utils.sheet_to_json(worksheet);
          rows.forEach((row, index) => {
            data.push(new FilterRowData(index + 1, row['provider'], row['element'], row['attribute'],
              row['search by'] as SearchBy, row['search scope'] as SearchScope,
              row['keywords'], row['timeout']));
          });
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (event: ProgressEvent<FileReader>) => {
        reject(event);
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
