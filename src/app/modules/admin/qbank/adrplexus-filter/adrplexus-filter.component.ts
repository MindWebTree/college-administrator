

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommanService } from 'app/modules/common/comman.service';
import { QuestionService } from '../question.service';
import { QbankcmbCode, QBankFilter, QbankType, Subjects, Topic } from '../QuestionModel';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-adrplexus-filter',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './adrplexus-filter.component.html',
  // providers:[QuestionService],
  styleUrl: './adrplexus-filter.component.scss'
})
export class AdrplexusFilterComponent implements OnInit {
  qbanktype: Array<QbankType> = [];
  subjects: Array<Subjects> = [];
  topics: Array<Topic> = [];
  cbmecode: Array<QbankcmbCode> = [];
  AdrPlexusQBankFilter: FormGroup;
  constructor(
    private _commonService: CommanService,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _questionservice: QuestionService
  ) {
    this.AdrPlexusQBankFilter = _formBuilder.group({
      QbankType: [''],
      Subject: [''],
      Topic: [''],
      CBMECode: ['']
    })
  }

  ngOnInit(): void {
    this._commonService.getQBankTypes('General').subscribe(res => {
      this.qbanktype = res;
    });
  }
  getQbanksubject(QbankTypeID: number) {
    this._commonService.getSubjects(QbankTypeID,"General").subscribe((response: any) => {
      this.subjects = response;
      if (!this.subjects.find(s => s.subjectID == this.AdrPlexusQBankFilter.get('Subject').value)) {
        this.AdrPlexusQBankFilter.get('Subject').setValue('');
        this.AdrPlexusQBankFilter.get('CBMECode').setValue('');
        this.cbmecode = [];
        this.topics = [];
        this.AdrPlexusQBankFilter.get('Topic').setValue('');
      }
    })
  }
  selectSubject(subjectID: number, onload: boolean = false) {
    this._commonService.getTopics(subjectID,"General").subscribe(res => {
      this.topics = res;
      if (!this.topics.find(t => t.topicID == this.AdrPlexusQBankFilter.get('Topic').value)) {
        this.AdrPlexusQBankFilter.get('Topic').setValue('');
        this.cbmecode = [];
      }

    })
  }
  selectTopic(topicID: number, onload: boolean = false) {
    this._commonService.getCBMECode(topicID,"General").subscribe(res => {
      this.cbmecode = res;
      if (!this.cbmecode.find(t => t.cmbeid == this.AdrPlexusQBankFilter.get('CBMECode').value)) {
        this.AdrPlexusQBankFilter.get('CBMECode').setValue('');
      }

    })
  }
  sendQbankFilterValues(): void {
    // const filterValues: number[] = Object.values(this.AdrPlexusQBankFilter.value).map(Number);
    const filterValues = this.AdrPlexusQBankFilter.value;
    // console.log(filterValues);
    this._questionservice.setQbanksfilterValues(filterValues);
    // this._questionservice.onQuestionSetChanged.next(filterValues);
  }
  clearall() {
    this.AdrPlexusQBankFilter.get('QbankType').setValue('');
    this.AdrPlexusQBankFilter.get('Subject').setValue('');
    this.subjects = [];
    this.AdrPlexusQBankFilter.get('Topic').setValue('');
    this.topics = [];
    this.AdrPlexusQBankFilter.get('CBMECode').setValue('');
    this.cbmecode = [];
    const filterValues = this.AdrPlexusQBankFilter.value;
    this._questionservice.setQbanksfilterValues(filterValues);
  }

}