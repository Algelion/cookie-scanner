import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public readonly set = (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public readonly get = <T>(key: string): T | null => {
    const item: string | null = localStorage.getItem(key);

    if (item == null) {
      return null;
    }

    return JSON.parse(item);
  }

  public readonly remove = (key: string): void => {
    localStorage.removeItem(key);
  }
}
