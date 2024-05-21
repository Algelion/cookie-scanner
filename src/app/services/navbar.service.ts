import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private _downloadButtonDisabled: boolean = true;
  private _uploadButtonDisabled: boolean = true;

  private _startScanButtonDisabled: boolean = true;
  private _abortScanButtonDisabled: boolean = true;

  private _scanToolsVisible: boolean = false;

  public readonly downloadButtonClicked$: Subject<void> = new Subject<void>();
  public readonly uploadButtonChanged$: Subject<File> = new Subject<File>();

  public readonly startScanButtonClicked$: Subject<void> = new Subject<void>();
  public readonly abortScanButtonClicked$: Subject<void> = new Subject<void>();

  public get downloadButtonDisabled(): boolean {
    return this._downloadButtonDisabled;
  }
  public get uploadButtonDisabled(): boolean {
    return this._uploadButtonDisabled;
  }
  public get startScanButtonDisabled(): boolean {
    return this._startScanButtonDisabled;
  }
  public get abortScanButtonDisabled(): boolean {
    return this._abortScanButtonDisabled;
  }
  public get scanToolsVisible(): boolean {
    return this._scanToolsVisible;
  }

  public set downloadButtonDisabled(value: boolean) {
    this._downloadButtonDisabled = value;
  }
  public set uploadButtonDisabled(value: boolean) {
    this._uploadButtonDisabled = value;
  }
  public set startScanButtonDisabled(value: boolean) {
    this._startScanButtonDisabled = value;
  }
  public set abortScanButtonDisabled(value: boolean) {
    this._abortScanButtonDisabled = value;
  }
  public set scanToolsVisible(value: boolean) {
    this._scanToolsVisible = value;
  }
}
