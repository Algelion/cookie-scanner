import { Component } from '@angular/core';
import { NavbarService } from "../../services/navbar.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private _title: string = 'Cookie Scanner';

  public constructor(private _service: NavbarService) {}

  public get title(): string {
    return this._title;
  }

  public readonly onDownloadButtonClicked = (): void => {
    this._service.downloadButtonClicked$.next();
  }
  public readonly onUploadButtonChanged = (event: Event): void => {
    if (event.target instanceof HTMLInputElement) {
      this._service.uploadButtonChanged$.next(event.target.files?.item(0) as File);
    }
  }

  public readonly onStartScanButtonClicked = (): void => {
    this._service.startScanButtonClicked$.next();
  }
  public readonly onAbortScanButtonClicked = (): void => {
    this._service.abortScanButtonClicked$.next();
  }

  public get downloadButtonDisabled(): boolean {
    return this._service.downloadButtonDisabled;
  }
  public get uploadButtonDisabled(): boolean {
    return this._service.uploadButtonDisabled;
  }
  public get startScanButtonDisabled(): boolean {
    return this._service.startScanButtonDisabled;
  }
  public get abortScanButtonDisabled(): boolean {
    return this._service.abortScanButtonDisabled;
  }
  public get scanToolsVisible(): boolean {
    return this._service.scanToolsVisible;
  }
}
