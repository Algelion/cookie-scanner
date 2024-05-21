import { Component } from '@angular/core';
import { UploaderService } from "../../services/uploader.service";

@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.scss']
})
export class UrlInputComponent {
  public urls: string = '';

  public constructor(private _uploader: UploaderService) {}

  public readonly onButtonClicked = (): void => {
    if(this.urls === '' || this.urls.length === 0) {
      return;
    }

    this._uploader.uploadedUrls(this.urls);
  }
}
