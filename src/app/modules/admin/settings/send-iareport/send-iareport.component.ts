import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-send-iareport',
  standalone: true,
  imports: [MatDatepickerModule,MatNativeDateModule,MatRadioModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './send-iareport.component.html',
  styleUrl: './send-iareport.component.scss'
})
export class SendIAReportComponent {
  SendReport : FormGroup;
  constructor(
    private _formBuilder : FormBuilder,
    private _servicesService : ServicesService,

  ){
    this.SendReport = this._formBuilder.group({
      SelectDate : [''],
      UserType : [''],
      ReportType : ['']
    })
    this.SendReport.get('SelectDate').patchValue(new Date());
    this.SendReport.get('UserType').patchValue('3');
    this.SendReport.get('ReportType').patchValue('3');
  }
  sendReport(){
    const userType = this.SendReport.get('UserType').value;
    const reportType = this.SendReport.get('ReportType').value;
    let req = {
      date: this.SendReport.get('SelectDate').value,
      sendToParent: userType == 3 || userType == 2,
      sendToStudent: userType == 3 || userType == 1,
      isAttendenceEmail: reportType == 3 || reportType == 1 ,
      isMarksEmail: reportType == 3 || reportType == 2 ,
    }
    console.log(req)
    this._servicesService.sendReport(req).subscribe(res=>{
      this._servicesService.openSnackBar('Report Scheduled Sucessfully','close')
    })
  }
}
