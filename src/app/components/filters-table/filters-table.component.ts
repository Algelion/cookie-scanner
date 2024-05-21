import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ITableHeader } from "../../shared/table-header";
import { FilterRowData } from "../../shared/filter-row-data";
import { SearchBy } from "../../shared/enums/search-by";
import { SearchScope } from "../../shared/enums/search-scope";
import { FiltersRowLoaderService } from "../../services/filters-row-loader.service";
import { NavbarService } from "../../services/navbar.service";
import { XlsxLoaderService } from "../../services/xlsx-loader.service";
import { NavigationService } from "../../services/navigation.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'app-filters-table',
  templateUrl: './filters-table.component.html',
  styleUrls: ['./filters-table.component.scss']
})
export class FiltersTableComponent implements OnInit, OnDestroy {
  private _currentAscending: boolean = true;
  private _currentSortField: string = '';

  private _destroy$: Subject<void> = new Subject<void>();

  public readonly searchByOptions: string[] = Object.values(SearchBy);
  public readonly searchScopeOptions: string[] = Object.values(SearchScope);

  public readonly headers: ITableHeader[] = [
    { name: '#', centered: true },
    { name: 'Provider', centered: true },
    { name: 'Element', centered: true },
    { name: 'Attribute', centered: true },
    { name: 'Search By', centered: true },
    { name: 'Search Scope', centered: true },
    { name: 'Keywords', centered: true },
    { name: 'Timeout', centered: true },
    { name: '', centered: true }
  ];

  public readonly data: FilterRowData[] = [];

  public constructor(private _loader: FiltersRowLoaderService,
                     private _service: NavbarService,
                     private _xlsxLoader: XlsxLoaderService,
                     private _navigation: NavigationService) {
    this.data = this._loader.load('filters');

    this._navigation.onNavigationStart(() => {
      this._loader.save('filters', this.data);

      this._service.downloadButtonDisabled = true;
      this._service.uploadButtonDisabled = true;
    });

    if (this.data.length <= 0) {
      this.addEmptyRow();
    }

    this._service.downloadButtonDisabled = false;
    this._service.uploadButtonDisabled = false;

  }

  public ngOnInit(): void {
    this._service.downloadButtonClicked$.pipe(takeUntil(this._destroy$))
      .subscribe(() => {
      const sheetData = this.data.map(row => Object.fromEntries(row.fields.entries()));
      this._xlsxLoader.download(sheetData, 'filters');
    });

    this._service.uploadButtonChanged$.pipe(takeUntil(this._destroy$))
      .subscribe((file: File) => {
      this._xlsxLoader.upload(file)
        .then((data) => {
          this.data.length = 0;
          data.forEach(row => {
            this.data.push(row);
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  @HostListener('window:beforeunload', ['$event'])
  public readonly onBeforeUnload = (event: Event): void => {
    this._loader.save('filters', this.data);
  }

  public readonly addEmptyRow = (): void => {
    this.data.push(new FilterRowData(this.data.length + 1, '', 'div', 'class',
      SearchBy.ClassName, SearchScope.All, '', 0));
  }

  public readonly removeRow = (index: number): void => {
    this.data.splice(index, 1);

    this.data.forEach((row, i) => {
      row.set('#', i + 1);
    });
  }

  public readonly removeLastRow = (): void => {
    this.removeRow(this.data.length - 1);
  }

  public readonly sort = (field: string): void => {
    if (field === '' || this.data.length === 0) {
      return;
    }

    if (this._currentSortField === field) {
      this._currentAscending = !this._currentAscending;
    } else {
      this._currentAscending = false;
    }

    this._currentSortField = field;
    this.data.sort((a, b) => {
      if (a.get(field) === b.get(field)) {
        return 0;
      }

      if (this._currentAscending) {
        return a.get(field) > b.get(field) ? 1 : -1;
      } else {
        return a.get(field) < b.get(field) ? 1 : -1;
      }
    });
  }

  public readonly onCellChange = (rowIndex: number, filedName: string, event: Event): void => {
    if (event.target == null) {
      return;
    }

    if (event.target instanceof HTMLSelectElement ||
      event.target instanceof HTMLInputElement) {
      this.data[rowIndex].set(filedName, event.target.value);
    }
  }

  public get removeButtonDisabled(): boolean {
    return this.data.length <= 1;
  }
}
