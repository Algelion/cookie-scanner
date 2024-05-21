import { Component } from '@angular/core';
import { UploaderService } from "../../services/uploader.service";
import { ScannerService } from "../../services/scanner.service";
import { ScannerRowData } from "../../shared/scanner-row-data";
import { ScanStatus } from "../../shared/enums/scan-status";
import { Router } from "@angular/router";
import { NavigationService } from "../../services/navigation.service";

@Component({
    selector: 'app-upload-page',
    templateUrl: './upload-page.component.html',
    styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent {
    public constructor(private _uploader: UploaderService,
                       private _scanner: ScannerService,
                       private _navigation: NavigationService) {
      this._uploader.uploaded$.subscribe((file: File) => {
        this._scanner.upload(file)
          .then(response => {
            this._navigation.navigateToScannerPage();
          })
          .catch(error => {
            console.error(error);
          });
      });

      this._uploader.uploadedUrls$.subscribe((urls: string) => {
        this._scanner.uploadUrls(urls)
          .then(response => {
            this._navigation.navigateToScannerPage();
          })
          .catch(error => {
            console.error(error);
          });
      });
    }
}
