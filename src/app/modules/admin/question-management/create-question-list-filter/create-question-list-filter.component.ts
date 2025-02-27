import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { QbankType, Subjects } from '../question-managemnet.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionManagementService } from '../question-management.service';
@Component({
  selector: 'app-create-question-list-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-question-list-filter.component.html',
  styleUrl: './create-question-list-filter.component.scss'
})
export class CreateQuestionListFilterComponent implements OnInit {
  qbanktype: Array<QbankType> = [];
  subjects: Array<Subjects> = [];
  QuestionListingFilter: FormGroup;
  showSection: boolean = false;
  constructor(
    private _questionManagementService: QuestionManagementService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formBuilder: FormBuilder,

  ) {
    if(this._router.url == '/qbank/question-list'){
      this.showSection = true
    }
    this.QuestionListingFilter = _formBuilder.group({
      QbankType: [''],
      Subject: [''],
      Topic: [''],
      CBMECode: ['']
    })
  }

  ngOnInit(): void {
    this._questionManagementService.getQbankTypesLecturer('Owned').subscribe(res => {
      this.qbanktype = res;
    })
  }
  getQbanksubject(QbankTypeID: number) {
    this._questionManagementService.getSubjectsbyQbanktypeIdLecturer(QbankTypeID, 'Owned').subscribe((response: any) => {
      this.subjects = response;
    })
  }
  sendQuestionFilterValues(): void {   
    const filterValues = this.QuestionListingFilter.value;
    this._questionManagementService.setQbanksfilterValues(filterValues);
  }
  clearall() {
    this.QuestionListingFilter.get('QbankType').setValue('');
    this.QuestionListingFilter.get('Subject').setValue('');
    this.subjects = [];
    const filterValues = this.QuestionListingFilter.value;
    this._questionManagementService.setQbanksfilterValues(filterValues);
  }
}
