import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { criteria} from "../../competency.model";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSelectModule } from "@angular/material/select";
import { CompetencyService } from "../../competency.service";
import { flatMap } from "lodash";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-criteria-form',
  standalone: true,
  imports: [CommonModule,MatSelectModule, MatSlideToggleModule, MatFormFieldModule, MatToolbarModule, ReactiveFormsModule, FormsModule,MatInputModule,MatIconModule, MatSlideToggleModule],
  templateUrl: './criteria-form.component.html',
  styleUrl: './criteria-form.component.scss'
})
export class CriteriaFormComponent  implements OnInit {

  action: string;
  Criteria: criteria;
  criteriaForm: FormGroup;
  dialogTitle: string;
  ckeConfig: any;
  choiceType: any;
  scoreType: any;
  subjects : any;
  stepId : string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<AddSubjectComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */

  constructor(
    public matDialogRef: MatDialogRef<CriteriaFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _competecyService: CompetencyService
  ) {
    var self = this;
    // Set the defaults
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    this._competecyService.getSubject('').subscribe(res=>{
      this.subjects = res;
    })

    this.action = _data.action;
    console.log(_data,"_data")
    this.dialogTitle = 'Edit Criteria';
    this.Criteria = _data.integration;
    console.log(this.stepId,"_data")
    this.stepId = _data.criteriaId;
    console.log(this.stepId,"_data1")
    self.criteriaForm = self.createcriteriaForm();
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create exam form
   *
   * @returns {FormGroup}
   */

  createcriteriaForm(): FormGroup {
    return this._formBuilder.group({
      Description: [this.Criteria?.description],
      QueueID: [this.Criteria?.queueId],
      Marks: [this.Criteria?.marks],
      IsCritical: [this.Criteria?.isCritical ?? false]
    });
  }
  addCriteria() {
    let data = this.criteriaForm.value
    let req = {
      id: 0,
      queueId: data?.QueueID,
      marks: data?.Marks,
      isCritical: data?.IsCritical,
      isDeleted: false,
      rubricConstructionSectionGuid: this.stepId,
      description: data?.Description,
    }
    this._competecyService.createCriteria(req).then(res => {
      this.matDialogRef.close();
    })
  }
  updateCriteria(){
    console.log(this.criteriaForm,"this.criteriaForm")
    let data = this.criteriaForm.value
    let req = {
      id: this._data.integration.id,
      queueId: data?.QueueID,
      description: data?.Description,
      marks: data?.Marks,
      isCritical: data?.IsCritical,
      isDeleted: false,
      rubricConstructionSectionGuid: this.stepId,
    }
    this._competecyService.updateCriteria(req).then(res=>{
      this.matDialogRef.close();
    })
  }

  ngOnInit(): void {
  }

}
