import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface PeriodicElement {
  studentname: string;
  rank: number;
  year: string;
  score: string;
  result: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {studentname:'Karthikeyan', rank: 1, year : 'First Year', score : '98%', result : 'Pass'},
  {studentname:'Karthikeyan', rank: 1, year : 'First Year', score : '98%', result : 'Pass'},
  {studentname:'Karthikeyan', rank: 1, year : 'First Year', score : '98%', result : 'Pass'},
  {studentname:'Karthikeyan', rank: 1, year : 'First Year', score : '98%', result : 'Pass'},
  {studentname:'Karthikeyan', rank: 1, year : 'First Year', score : '98%', result : 'Pass'}
];

@Component({
  selector: 'app-exam-report',
  standalone: true,
  imports: [MatTableModule,MatIconModule],
  templateUrl: './exam-report.component.html',
  styleUrl: './exam-report.component.scss'
})
export class ExamReportComponent implements OnInit {
  displayedColumns: string[] = ['studentname', 'rank', 'year', 'score','result'];
  dataSource = ELEMENT_DATA;
  constructor(private _formbuilder: FormBuilder, public matDialogRef: MatDialogRef<ExamReportComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.matDialogRef.close();
  }
}
