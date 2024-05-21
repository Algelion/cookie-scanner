import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadPageComponent } from "./pages/upload-page/upload-page.component";
import { SettingsPageComponent } from "./pages/settings-page/settings-page.component";
import { ScannerPageComponent } from "./pages/scanner-page/scanner-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";

const routes: Routes = [
    {
        path: '',
        component: UploadPageComponent
    },
    {
        path: 'settings',
        component: SettingsPageComponent
    },
    {
        path: 'scanner',
        component: ScannerPageComponent
    },
    {
        path: '**',
        component: NotFoundPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
