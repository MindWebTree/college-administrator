// upload-to-s3.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { UploadService } from './upload.service';

interface UploadState {
  uploading: boolean;
  progress: number;
  error?: string;
}
@Component({
  selector: 'app-uploadto-s3',
  standalone: true,
  imports: [CommonModule, 
        ReactiveFormsModule, 
        FormsModule, 
        MatFormFieldModule,
        MatProgressBarModule],
  templateUrl: './uploadto-s3.component.html',
  styleUrl: './uploadto-s3.component.scss'
})
// @Component({
//   selector: 'app-upload-to-s3',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     ReactiveFormsModule, 
//     FormsModule, 
//     MatFormFieldModule,
//     MatProgressBarModule
//   ],
//   template: `
//     <form [formGroup]="uploadForm" class="max-w-md">
//       <div class="flex flex-col gap-4 p-6">
//         <!-- File Input Area -->
//         <div 
//           class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
//           [class.border-primary]="isDragging"
//           (dragover)="onDragOver($event)"
//           (dragleave)="onDragLeave($event)"
//           (drop)="onDrop($event)">
          
//           <label class="block cursor-pointer">
//             <input
//               type="file"
//               class="hidden"
//               (change)="onSelectFile($event)"
//               [accept]="acceptedFileTypes.join(',')"
//               formControlName="uploadInput"
//               aria-label="Choose file to upload">
            
//             <span class="text-lg font-medium text-gray-700">
//               Drop files here or click to upload
//             </span>
//           </label>

//           <p class="mt-2 text-sm text-gray-500">
//             Accepted files: JPG, PNG, PDF, PPT, PPTX (max 5MB)
//           </p>
//         </div>

//         <!-- Upload Progress -->
//         <div *ngIf="uploadState.uploading" class="mt-4">
//           <mat-progress-bar
//             [value]="uploadState.progress"
//             mode="determinate">
//           </mat-progress-bar>
//           <p class="text-sm text-gray-600 mt-2">
//             Uploading... {{uploadState.progress}}%
//           </p>
//         </div>

//         <!-- Error Message -->
//         <div *ngIf="uploadState.error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
//           {{ uploadState.error }}
//         </div>

//         <!-- File Preview -->
//         <div *ngIf="uploadedFileUrl" class="mt-4">
//           <p class="text-sm font-medium">Uploaded File:</p>
//           <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
//             <span class="truncate">{{ uploadedFileUrl }}</span>
//             <button
//               type="button"
//               class="ml-4 text-red-600 hover:text-red-800"
//               (click)="removeSelectedFile()"
//               aria-label="Remove uploaded file">
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   `,
//   styles: [`
//     :host {
//       display: block;
//     }
//   `]
// })
export class UploadtoS3Component implements OnInit {
  uploadForm: FormGroup;
  uploadedFileUrl: string = '';
  isDragging = false;
  
  uploadState: UploadState = {
    uploading: false,
    progress: 0
  };

  readonly acceptedFileTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  readonly maxFileSizeMB = 5;

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService
  ) {
    this.uploadForm = this.formBuilder.group({
      uploadInput: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFileUpload(files[0]);
    }
  }

  onSelectFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleFileUpload(file);
    }
  }

  private handleFileUpload(file: File): void {
    // Reset state
    this.uploadState = { uploading: false, progress: 0 };
    
    // Validate file type
    if (!this.acceptedFileTypes.includes(file.type)) {
      this.uploadState.error = 'Invalid file type. Please select a JPEG, PNG, PPT, or PDF file.';
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > this.maxFileSizeMB) {
      this.uploadState.error = `File size exceeds the maximum limit of ${this.maxFileSizeMB}MB.`;
      return;
    }

    // Start upload
    this.uploadState.uploading = true;
    
    this.uploadService.uploadDoc(file).subscribe({
      next: (response: any) => {
        if (response.type === 'progress') {
          this.uploadState.progress = response.progress;
        } else if (response.url) {
          this.uploadedFileUrl = response.url;
          this.uploadForm.get('uploadInput')?.setValue(response.url);
          this.uploadState = { uploading: false, progress: 100 };
        }
      },
      error: (error) => {
        this.uploadState = {
          uploading: false,
          progress: 0,
          error: 'Failed to upload file. Please try again.'
        };
        console.error('Upload error:', error);
      }
    });
  }

  removeSelectedFile(): void {
    this.uploadedFileUrl = '';
    this.uploadForm.get('uploadInput')?.setValue('');
    this.uploadState = { uploading: false, progress: 0 };
  }
}