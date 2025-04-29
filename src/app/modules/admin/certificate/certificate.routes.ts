import { Routes } from '@angular/router';
import { DownloadCertificateComponent } from './download-certificate/download-certificate.component';
export default [
    {
        path: ':id',
        component: DownloadCertificateComponent,
    }
] as Routes;