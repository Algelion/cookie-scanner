import { Type } from "@angular/compiler";

export interface IRowData {
  get(field: string): string | number;
  type(field: string): string;
}
