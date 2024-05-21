import { ScanStatus } from "./enums/scan-status";
import { IRowData } from "./interfaces/row-data";

export class ScannerRowData implements IRowData {
  public readonly id: number;
  public readonly website: string;
  public readonly provider: string;
  public readonly message: string;
  public readonly status: ScanStatus;

  public constructor(id: number, website: string, provider: string, message: string, status: ScanStatus) {
    this.id = id;
    this.website = website;
    this.provider = provider;
    this.message = message;
    this.status = status;
  }

  public readonly get = (field: string): string | number => {
    switch (field) {
      case '#':
        return this.id;
      case 'website':
        return this.website;
      case 'provider':
        return this.provider;
      case 'message':
        return this.message;
      case 'status':
        return this.status;
      default:
        return '';
    }
  }

  public readonly type = (field: string): string => {
    switch (field) {
      case '#':
        return 'number';
      case 'status':
        return 'ScanStatus';
      default:
        return 'string';
    }
  }

  public get isDone(): boolean {
    return this.status === ScanStatus.Done;
  }

  public get isWaiting(): boolean {
    return this.status === ScanStatus.Waiting;
  }

  public get isError(): boolean {
    return this.status === ScanStatus.Error
      || this.status === ScanStatus.Aborted;
  }

  public get isScanning(): boolean {
    return this.status === ScanStatus.Scanning;
  }
}


