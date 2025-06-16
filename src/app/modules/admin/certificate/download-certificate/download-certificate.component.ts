import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateService } from '../certificate.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-download-certificate',
  standalone: true,
  imports: [DatePipe,CommonModule],
  templateUrl: './download-certificate.component.html',
  styleUrl: './download-certificate.component.scss'
})
export class DownloadCertificateComponent {
  student: any;
  competencyId: any;
  certificate: SafeResourceUrl | null = null;
  certificateUrl: string = ''; // Store the original URL for download

  constructor(
    private _certificateService: CertificateService,
    private sanitizer: DomSanitizer,
    private _route: ActivatedRoute
  ) {
    this._route.params.subscribe(res => {
      this.competencyId = res?.id;
    });

    // Get certificate
    this._certificateService.getCertificate(this.competencyId).then(res => {
      if (res) {
        this.certificateUrl = res; // Store original URL
        this.certificate = this.sanitizer.bypassSecurityTrustResourceUrl(res);
      }
    }).catch(error => {
      console.error('Error loading certificate:', error);
    });
  }

  getCertificateDetails() {
    this._certificateService.getCertificateDetials(this.competencyId).subscribe(res => {
      this.student = res;
    });
  }

  downloadCertificate() {
    if (this.certificateUrl) {
      const link = document.createElement('a');
      link.href = this.certificateUrl; // Use original URL, not sanitized one
      link.download = `certificate-${this.competencyId || 'download'}.pdf`;
      link.target = '_blank'; // Optional: open in new tab if download fails
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No certificate URL available for download');
    }
  }

  // Alternative method using fetch for better browser compatibility
  async downloadCertificateAlt() {
    if (this.certificateUrl) {
      try {
        const response = await fetch(this.certificateUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `certificate-${this.competencyId || 'download'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading certificate:', error);
      }
    }
  }
}