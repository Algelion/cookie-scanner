import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UploaderService } from "../../services/uploader.service";

@Component({
    selector: 'app-dropzone',
    templateUrl: './dropzone.component.html',
    styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent {
    @ViewChild('inputElement') private _inputElement: ElementRef;
    @ViewChild('dropzoneElement') private _dropzoneElement: ElementRef;

    private _dragOver: boolean = false;

    public constructor(private _uploader: UploaderService) { }

    public get dragOver(): boolean {
        return this._dragOver;
    }

    @HostListener('dragover', ['$event'])
    public readonly onDragOver = (event: DragEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        this._dropzoneElement.nativeElement.classList.add('dragover');
        this._dragOver = true;
    }

    @HostListener('dragleave', ['$event'])
    public readonly onDragLeave = (event: DragEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        this._dropzoneElement.nativeElement.classList.remove('dragover');
        this._dragOver = false;
    }

    @HostListener('drop', ['$event'])
    public readonly onDrop = (event: DragEvent): void => {
        event.preventDefault();
        event.stopPropagation();

        this._dropzoneElement.nativeElement.classList.remove('dragover');
        this._dragOver = false;

        if (event.dataTransfer == null) {
          return;
        }

        const files: FileList | null = event.dataTransfer.files;
        if (files != null && files.length > 0) {
          this._uploader.uploaded(files[0]);
        }
    }

    @HostListener('click')
    public readonly onClick = (): void => {
        this._inputElement.nativeElement.click();
    }

    public readonly onChange = (event: Event): void => {
        const files: FileList | null = (event.target as HTMLInputElement).files;
        if (files != null && files.length > 0) {
          this._uploader.uploaded(files[0]);
        }
    }
}
