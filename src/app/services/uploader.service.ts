import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  public readonly uploaded$: Subject<File> = new Subject<File>();
  public readonly uploadedUrls$: Subject<string> = new Subject<string>();

  public readonly uploaded = (file: File): void => {
    this.uploaded$.next(file);
  }

  public readonly uploadedUrls = (urls: string): void => {
    this.uploadedUrls$.next(urls);
  }
}
