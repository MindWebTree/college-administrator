import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CompetencyService } from '../competency.service';

@Component({
  selector: 'app-submission-form',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatCheckboxModule, ReactiveFormsModule, FormsModule, MatFormFieldModule],
  templateUrl: './submission-form.component.html',
  styleUrl: './submission-form.component.scss'
})
export class SubmissionFormComponent implements OnInit {
  AssignmentForm: FormGroup;
  steps:any;
  // steps:any=[
  //   {
  //     StepName: "PART 1. OPENING THE CONSULTATION",
  //     Criteria: [
  //       {
  //         CriteriaName: "Introduce yourself",
  //         Marks: 1,
  //         IsCritical: true
  //       },
  //       {
  //         CriteriaName: "Ensure PEAK FLOW METER is set to zero",
  //         Marks: 2,
  //         IsCritical: false
  //       }
  //     ]
  //   },
  //   {
  //     StepName: "PART 2. MEASURING PEFR - DEMONSTRATE AND OBSERVE",
  //     Criteria: [
  //       {
  //         CriteriaName: 'Exhale as forcefully as you are able to – "ONE FAST HARD BLAST"',
  //         Marks: 1,
  //         IsCritical: true
  //       },
  //       {
  //         CriteriaName: 'The highest reading of the 3 attempts should be used as the final result – "YOUR PERSONAL BEST"',
  //         Marks: 2,
  //         IsCritical: false
  //       }
  //     ]
  //   }
  // ];
  rubricConstructionGuid:string;
  studentid:string;
  competencyGuid:string;
  dataLoaded:boolean=false;
  SelectedCriteria:any=[];
  actionType:string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matdialog: MatDialog,
    private dialogRef: MatDialogRef<SubmissionFormComponent>,
    private _competencyService: CompetencyService,
  ){
    console.log(_data,"s");
    if (_data.rubricConstructionGuid) {
      this.actionType = 'submit';
      this.rubricConstructionGuid = _data.rubricConstructionGuid;
      this.studentid = _data.id;
      this.competencyGuid = _data.competencyGuid;
      this._competencyService.getRubricListbyid(this.rubricConstructionGuid).then(res=>{
        this.steps =res?.sections;
        this.dataLoaded = true;
      })
    }else{
      this.actionType = 'history';
      this.steps = _data?.rubricationDetails?.sections;      
      this.dataLoaded = true;
    }
    
  }


  ngOnInit(): void {
    
  }
  submitAssignment(){
    let data = this.steps.flatMap(step =>
      step.criteria
        .filter((criteria: any) => criteria.selected) // Only selected criteria
        .map((criteria: any) => criteria.id) // Extract only CriteriaID
    );
    this.SelectedCriteria = data;
    let req = {
      criteria : this.SelectedCriteria
    }
    this._competencyService.SubmitAssignment(req,this.competencyGuid,this.studentid).then(res=>{
      if(res){
        this._competencyService.openSnackBar('Assignment Submitted Sucessfully','close')
      }
      this.CloseMatdilog();
      this._competencyService.onSubjectGridChanged.next(true);
      this._competencyService.onCompetencyStudentChanged.next(true);
    })
  }
  getTotalMarks() {
    let data = this.steps.flatMap(step =>
      step.criteria
        .filter((criteria: any) => criteria.selected) // Only selected criteria
        .map((criteria: any) => ({
          isSelected: true,
          CriteriaID: criteria.id // Assuming CriteriaID exists
        }))
    );
    return this.steps.reduce((sum: number, step: any) => 
      sum + step.criteria.filter((criteria: any) => criteria.selected)
                        .reduce((stepSum: number, criteria: any) => stepSum + criteria.marks, 0)
    , 0);
  }

  CloseMatdilog(){
    this.SelectedCriteria = [];
    this.dialogRef.close();
  }
}
