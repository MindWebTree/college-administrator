import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CertificateService } from '../certificate.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-download-certificate',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './download-certificate.component.html',
  styleUrl: './download-certificate.component.scss'
})
export class DownloadCertificateComponent {
  student:any;
  // student = {
  //   name: 'John Doe',
  //   rollNo: 'MED202501',
  //   imageUrl: 'assets/student-photo.jpg', // You can dynamically set this
  //   marks: 87,
  //   examName: 'Basic Clinical Procedures',
  //   competencyCode: 'BP101',
  //   examDate: '2025-04-08',
  // };
  competencyId:any;
  constructor(
    private _certificateService : CertificateService,
    private _route : ActivatedRoute
  ){
    this._route.params.subscribe(res=>{
      this.competencyId = res?.id;
    });
    this.getCertificateDetails()
  }

  getCertificateDetails(){
    this._certificateService.getCertificateDetials(this.competencyId).subscribe(res=>{
      this.student = res;
    })
  }

  downloadCertificate() {
    const element = document.getElementById('certificate');
    const button = document.querySelector('.download-button') as HTMLElement;
  
    if (!element) return;
  
    // Hide the button
    if (button) button.style.display = 'none';
  
    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.student.name}_certificate.pdf`);
  
      // Show the button again
      if (button) button.style.display = 'block';
    });
  }


}
