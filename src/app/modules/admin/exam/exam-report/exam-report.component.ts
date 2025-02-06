import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ExamService } from '../exam.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { CommonModule } from '@angular/common';
import { ReportStudentList } from '../exam.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-exam-report',
  standalone: true,
  imports: [MatTableModule, MatIconModule, DurationPipe, CommonModule],
  templateUrl: './exam-report.component.html',
  styleUrl: './exam-report.component.scss'
})
export class ExamReportComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['studentname', 'rank', 'year', 'score', 'result'];
  dataSource = new MatTableDataSource<ReportStudentList>([]);
  examReport: any;
  exam: any;
  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _formbuilder: FormBuilder,
    private _examService: ExamService,
    public matDialogRef: MatDialogRef<ExamReportComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
  ) {
    this.exam = _data;
  }

  ngOnInit(): void {
    // Initial data load
    this.loadExamReport();

    // Subscribe to changes
    this._examService.onExamReportListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.loadExamReport();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  private loadExamReport(): void {
    this._examService.getExamReport(this.exam.guid).subscribe(res => {
      this.examReport = res;
      this.dataSource.data = res.students || [];
    });
  }

  onNoClick(): void {
    this.matDialogRef.close();
  }
}