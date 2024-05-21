import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  public constructor(private _router: Router) { }

  public readonly navigateToScannerPage = (): void => {
    this._router.navigate(['/scanner']);
  }

  public readonly onNavigationStart = (callback: (url: string) => void): void => {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        callback(event.url);
      }
    });
  }
}
