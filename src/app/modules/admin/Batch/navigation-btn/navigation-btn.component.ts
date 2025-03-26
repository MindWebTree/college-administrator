import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BatchService } from '../batch.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';

@Component({
  selector: 'app-navigation-btn',
  standalone: true,
  imports: [MatIconModule,MatSelectModule,CommonModule, MatDatepickerModule,MatNativeDateModule,MatRadioModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, ReactiveFormsModule],
  templateUrl: './navigation-btn.component.html',
  styleUrl: './navigation-btn.component.scss',
  providers: [DatePipe]
})
export class NavigationBtnComponent implements OnInit {
  @ViewChild('createBatch') createBatch!: ElementRef;
  CreateBatch: FormGroup;
  futureBatches: string[] = [];

  constructor(
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _batchService: BatchService,
    private _navigationMockApi: NavigationMockApi,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.CreateBatch = this._formBuilder.group({
      BatchName: ['', Validators.required],
      FirstYearStartDate: ['', Validators.required],
      FirstYearEndDate: ['', Validators.required],
      SecondYearStartDate: ['', Validators.required],
      SecondYearEndDate: ['', Validators.required],
      PreFinalYearStartDate: ['', Validators.required],
      PreFinalYearEndDate: ['', Validators.required],
      FinalYearStartDate: ['', Validators.required],
      FinalYearEndDate: ['', Validators.required],
      CRRIStartDate: ['', Validators.required],
      CRRIEndDate: ['', Validators.required]
    });

    this._batchService.getfutureBatches().subscribe(res => {
      this.futureBatches = res;
      if (res.length > 0) {
        this.CreateBatch.get('BatchName')?.patchValue(res[0]);
        this.onBatchNameChange(res[0]);
      }
    });

    // Listen for changes in BatchName
    this.CreateBatch.get('BatchName')?.valueChanges.subscribe(
      batchName => this.onBatchNameChange(batchName)
    );
  }

  onBatchNameChange(batchName: string) {
    if (!batchName) return;

    // Extract the start year from the batch name
    const startYear = parseInt(batchName.split('-')[0]);

    // Create date objects for each year's start and end
    const firstYearStart = new Date(startYear, 9, 1);  // October
    const firstYearEnd = new Date(startYear + 1, 8, 30);  // September

    const secondYearStart = new Date(startYear + 1, 9, 1);
    const secondYearEnd = new Date(startYear + 2, 8, 30);

    const preFinalYearStart = new Date(startYear + 2, 9, 1);
    const preFinalYearEnd = new Date(startYear + 3, 8, 30);

    const finalYearStart = new Date(startYear + 3, 9, 1);
    const finalYearEnd = new Date(startYear + 4, 2, 31);  // March

    const crriStart = new Date(startYear + 4, 3, 1);
    const crriEnd = new Date(startYear + 5, 2, 31);  // March

    // Patch form values
    this.CreateBatch.patchValue({
      FirstYearStartDate: firstYearStart,
      FirstYearEndDate: firstYearEnd,
      SecondYearStartDate: secondYearStart,
      SecondYearEndDate: secondYearEnd,
      PreFinalYearStartDate: preFinalYearStart,
      PreFinalYearEndDate: preFinalYearEnd,
      FinalYearStartDate: finalYearStart,
      FinalYearEndDate: finalYearEnd,
      CRRIStartDate: crriStart,
      CRRIEndDate: crriEnd
    });
  }
  CreateBatchs() {
    if (this.CreateBatch.invalid) {

    } else {
      let req = {
        id: 0,
        name: this.CreateBatch.get('BatchName').value,
        years: [
          {
            id: 0,
            yearId: 1,
            startDate: this.CreateBatch.get('FirstYearStartDate').value,
            endDate: this.CreateBatch.get('FirstYearEndDate').value,
          },
          {
            id: 0,
            yearId: 2,
            startDate: this.CreateBatch.get('SecondYearStartDate').value,
            endDate: this.CreateBatch.get('SecondYearEndDate').value,
          },
          {
            id: 0,
            yearId: 3,
            startDate: this.CreateBatch.get('PreFinalYearStartDate').value,
            endDate: this.CreateBatch.get('PreFinalYearEndDate').value,
          },
          {
            id: 0,
            yearId: 4,
            startDate: this.CreateBatch.get('FinalYearStartDate').value,
            endDate: this.CreateBatch.get('FinalYearEndDate').value,
          },
          {
            id: 0,
            yearId: 5,
            startDate: this.CreateBatch.get('CRRIStartDate').value,
            endDate: this.CreateBatch.get('CRRIEndDate').value,
          },
        ]
      } 
      this._batchService.createBatch(req).subscribe(res => {
        this.matDialogClose();
        this._batchService.openSnackBar('Batch Created SuccessFully','close');
        setTimeout(() => {          
        this._navigationMockApi.registerHandlers();
        }, 100);
      })
    }
  }
  matDialogClose(){
    this.dialog.closeAll();
  }

  OpenDialog(templateRef: any): MatDialogRef<any> {
    return this.dialog.open(templateRef, {
      panelClass: 'create-batchs',
      // disableClose: true
    });
  }
}