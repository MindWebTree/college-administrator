import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RubricConstruction, Step } from "../../competency.model";
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
  selector: 'app-step-form',
  standalone: true,
  imports: [CommonModule,MatSelectModule, MatFormFieldModule, MatToolbarModule, ReactiveFormsModule, FormsModule,MatInputModule,MatIconModule, MatSlideToggleModule],
  templateUrl: './step-form.component.html',
  styleUrl: './step-form.component.scss'
})
export class StepFormComponent  implements OnInit {

  action: string;
  Steps: Step;
  stepForm: FormGroup;
  dialogTitle: string;
  ckeConfig: any;
  choiceType: any;
  scoreType: any;
  subjects : any;
  rubricId : string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<AddSubjectComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */

  constructor(
    public matDialogRef: MatDialogRef<StepFormComponent>,
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
    // this._competecyService.getSubject('').subscribe(res=>{
    //   this.subjects = res;
    // })

    this.action = _data.action;
    console.log(_data,"_data")
    this.dialogTitle = 'Edit Section';
    this.Steps = _data.integration;
    this.rubricId = _data.rubricId;
    self.stepForm = self.createstepForm();
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create exam form
   *
   * @returns {FormGroup}
   */

  createstepForm(): FormGroup {
    return this._formBuilder.group({
      Name: [this.Steps?.name],
      QueueID: [this.Steps?.queueId]
    });
  }
  addStep() {
    let data = this.stepForm.value
    let req = {
      sectionId: 0,
      queueId: data?.QueueID,
      name: data?.Name,
      isDeleted: false,
      rubricConstructionGuid: this.rubricId,
      description: "",
    }
    this._competecyService.createStep(req).then(res => {
      this.matDialogRef.close();
    })
  }
  updateStep(){
    console.log(this.stepForm,"this.stepForm")
    let data = this.stepForm.value
    let req = {
      sectionId: this._data.integration.sectionId,
      queueId: data?.QueueID,
      name: data?.Name,
      isDeleted: false,
      rubricConstructionGuid: this.rubricId,
      description: "",
    }
    this._competecyService.updateStep(req).then(res=>{
      this.matDialogRef.close();
    })
  }

  ngOnInit(): void {
  }

}
