import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadPageComponent } from './pages/upload-page/upload-page.component';
import { ScannerPageComponent } from './pages/scanner-page/scanner-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { DropzoneComponent } from './components/dropzone/dropzone.component';
import { UrlInputComponent } from './components/url-input/url-input.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ScannerTableComponent } from './components/scanner-table/scanner-table.component';
import { FiltersTableComponent } from './components/filters-table/filters-table.component';
import { NotifyComponent } from './components/notify/notify.component';
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        AppComponent,
        UploadPageComponent,
        ScannerPageComponent,
        SettingsPageComponent,
        NotFoundPageComponent,
        DropzoneComponent,
        UrlInputComponent,
        NavbarComponent,
        ScannerTableComponent,
        FiltersTableComponent,
        NotifyComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
  ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
