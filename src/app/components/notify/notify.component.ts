import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent {
  @Input('visible')
  private _visible: boolean = false;
  @Input('title')
  private _title: string = '';

  public get visible(): boolean {
    return this._visible;
  }

  public get title(): string {
    return this._title;
  }
}
