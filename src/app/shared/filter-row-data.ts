import { IRowData } from "./interfaces/row-data";
import { SearchBy } from "./enums/search-by";
import { SearchScope } from "./enums/search-scope";

export class FilterRowData implements IRowData {
  public readonly fields: Map<string, any> = new Map<string, any>();

  public constructor(id: number, provider: string, element: string, attribute: string,
    searchBy: SearchBy, searchScope: SearchScope, keywords: string, timeout: number) {
    this.fields.set('#', id);
    this.fields.set('provider', provider);
    this.fields.set('element', element);
    this.fields.set('attribute', attribute);
    this.fields.set('search by', searchBy);
    this.fields.set('search scope', searchScope);
    this.fields.set('keywords', keywords);
    this.fields.set('timeout', timeout);
  }

  public readonly get = (field: string): string | number => {
    return this.fields.get(field.toLowerCase());
  }

  public readonly set = (field: string, value: string | number): void => {
    this.fields.set(field.toLowerCase(), value);
  }

  public readonly copy = (): FilterRowData => {
    return new FilterRowData(this.fields.get('#') as number, this.fields.get('provider') as string,
      this.fields.get('element') as string, this.fields.get('attribute') as string,
      this.fields.get('search by') as SearchBy, this.fields.get('search scope') as SearchScope,
      this.fields.get('keywords') as string, this.fields.get('timeout') as number);
  }

  public readonly type = (field: string): string => {
    switch (field.toLowerCase()) {
      case '#':
        return 'id';
      case 'timeout':
        return 'number';
      case 'search by':
        return 'SearchBy';
      case 'search scope':
        return 'SearchScope';
      case '':
        return 'none';
      default:
        return 'text';
    }
  }
}
