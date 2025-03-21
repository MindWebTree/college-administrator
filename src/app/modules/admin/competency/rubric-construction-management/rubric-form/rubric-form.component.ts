import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";

import { FormBuilder, FormControl, FormGroup, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RubricConstruction } from "../../competency.model";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSelectModule } from "@angular/material/select";
import { CompetencyService } from "../../competency.service";
import { flatMap } from "lodash";




@Component({
  selector: 'app-rubric-form',
  standalone: true,
  imports: [CommonModule,MatSelectModule, MatFormFieldModule, MatToolbarModule, ReactiveFormsModule, FormsModule,MatInputModule,MatIconModule, MatSlideToggleModule],
  templateUrl: './rubric-form.component.html',
  styleUrl: './rubric-form.component.scss'
})
export class RubricFormComponent implements OnInit {

  action: string;
  rubricConstruction: RubricConstruction;
  rubricForm: FormGroup;
  dialogTitle: string;
  ckeConfig: any;
  choiceType: any;
  scoreType: any;
  subjects : any;

  /**
   * Constructor
   *
   * @param {MatDialogRef<AddSubjectComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */

  constructor(
    public matDialogRef: MatDialogRef<RubricFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _competecyService: CompetencyService
  ) {
    var self = this;
    // Set the defaults
    this.ckeConfig = {
      allowedContent: false,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: true
    };
    this._competecyService.getSubjects().subscribe(res=>{
      this.subjects = res;
    })

    this.action = _data.action;
    console.log(_data,"_data")
    this.dialogTitle = 'Edit Rubric Construction';
    this.rubricConstruction = _data.integration;
    self.rubricForm = self.createrubricForm();
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create exam form
   *
   * @returns {FormGroup}
   */

  createrubricForm(): FormGroup {
    return this._formBuilder.group({
      Name: [this.rubricConstruction?.name],
      Subject: [this.rubricConstruction?.subjectId]
    });
  }
  addRubric() {
    let data = this.rubricForm.value
    let req = {
      id: 0,
      subjectId: data?.Subject,
      name: data?.Name,
      isDeleted: false
    }
    this._competecyService.createRubricConstruction(req).then(res => {
      this.matDialogRef.close();
    })
  }
  updateRubric(){
    console.log(this.rubricForm,"this.rubricForm")
    let data = this.rubricForm.value
    let req = {
      id: this._data.integration.id,
      subjectId: data?.Subject,
      name: data?.Name,
      isDeleted: false
    }
    this._competecyService.updateRubricConstruction(req).then(res=>{
      this.matDialogRef.close();
    })
  }

  ngOnInit(): void {
  }

}
