import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScannerRowData } from "../../shared/scanner-row-data";
import { ITableHeader } from "../../shared/table-header";
import { ScannerService } from "../../services/scanner.service";
import { NavbarService } from "../../services/navbar.service";
import { NavigationService } from "../../services/navigation.service";
import { Subject, takeUntil } from "rxjs";
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-scanner-table',
  templateUrl: './scanner-table.component.html',
  styleUrls: ['./scanner-table.component.scss']
})
export class ScannerTableComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  public readonly headers : ITableHeader[] = [
    { name: '#', centered: true },
    { name: 'Website', centered: false },
    { name: 'Provider', centered: false },
    { name: 'Message', centered: false },
    { name: 'Status', centered: true },
    { name: '', centered: true }
  ];

  public constructor(private _scanner: ScannerService,
                     private _navbar: NavbarService,
                     private _navigation: NavigationService) {
    this._navbar.uploadButtonDisabled = false;
    this._navbar.downloadButtonDisabled = false;

    this._navbar.scanToolsVisible = true;
    this._navbar.startScanButtonDisabled = false;

    this._navigation.onNavigationStart(() => {
      this._scanner.data.length = 0;

      this._navbar.uploadButtonDisabled = true;
      this._navbar.downloadButtonDisabled = true;

      this._navbar.scanToolsVisible = false;
      this._navbar.startScanButtonDisabled = true;
      this._navbar.abortScanButtonDisabled = true;
    })
  }

  public ngOnInit(): void {
    this._navbar.downloadButtonClicked$.pipe(takeUntil(this._destroy$))
      .subscribe(() => {
      console.log('test')
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = environment.apiDownloadXlsx;
      link.click();
      link.remove();
    });

    this._navbar.uploadButtonChanged$.pipe(takeUntil(this._destroy$))
      .subscribe((file: File) => {
      this._scanner.upload(file)
        .catch(error => {
          console.error(error);
        });
    });

    this._navbar.startScanButtonClicked$.pipe(takeUntil(this._destroy$))
      .subscribe(() => {
      this._scanner.startScan()
        .then(() => {
          this._navbar.abortScanButtonDisabled = false;
          this._navbar.startScanButtonDisabled = true;
        })
        .then(() => this._scanner.scan())
        .then(response => {
          this._navbar.abortScanButtonDisabled = true;
          this._navbar.startScanButtonDisabled = false;
        })
        .catch(error => {
          console.error(error);
        });
    });

    this._navbar.abortScanButtonClicked$.pipe(takeUntil(this._destroy$))
      .subscribe(() => {
      this._scanner.abortScan()
        .then(() => {
          this._navbar.abortScanButtonDisabled = true;
          this._navbar.startScanButtonDisabled = false;
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public get data(): ScannerRowData[] {
    return this._scanner.data;
  }
}
