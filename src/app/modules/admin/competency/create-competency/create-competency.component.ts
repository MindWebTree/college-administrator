import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CompetencyService } from '../competency.service';
import { CommonModule } from '@angular/common';
import { competency } from '../competency.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-competency',
  standalone: true,
  imports: [MatIconModule, MatRadioModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, FormsModule, MatSelectModule, MatInputModule, CommonModule],
  templateUrl: './create-competency.component.html',
  styleUrl: './create-competency.component.scss'
})
export class CreateCompetencyComponent  implements OnInit{
  CreateCompetency : FormGroup;
  CriteriaDaa : FormGroup;
  isQbankformHaserror:boolean=false;
  academicYears:any;
  batches:any;
  subjects:any;
  lecturers:any;
  rubricConstructions:any;
  criteria: any[] = [];
  FirstAnswerContent = "";
  SecondAnswerContent = "";
  ThirdanswerContent = "";
  FourthanswerContent = "";

  FirstAnswerMarks: number = 0;
  SecondAnswerMarks: number = 0;
  ThirdAnswerMarks: number = 0;
  FourthAnswerMarks: number = 0;
  defalutchoices: boolean = false;
  openSnackBar(message: string, action: string) {
    this._matSnackbar.open(message, action, {
      duration: 2000,
    });
  }
  private currentDialogRef: MatDialogRef<any>;  
  isSelectedChoice: boolean = true;
  errorInForm: boolean = false;
  editDeleteChoiceIndex: number;
  
  updatedanswer = "";
  updatedMarks = 0;
  assignmentid:string;
  assignmentDetails:any;

  constructor(
    private _formBuilder : FormBuilder,
    private _matSnackbar : MatSnackBar,
    private _router : Router,
    private _route : ActivatedRoute,
    private dialog: MatDialog,
    private _competencyService : CompetencyService
  ){
    this._route.params.subscribe(res=>{
      this.assignmentid = res.id;
      if(res.id){
        this._competencyService.getBatch().subscribe(batchres=>{          
          this.batches = res;
          if(batchres){
            this._competencyService.getAssignmentbyid(this.assignmentid).then(res=>{
              this.assignmentDetails = res;
              this._competencyService.getBatchYear(res?.batchGuid).subscribe(ress=>{
                this.academicYears = ress;
                if (ress) {
                  let AcademicGuid = this.academicYears.find(year => year.id == res?.academicYearId)?.guid;
                  this.getSubject(AcademicGuid, true);
                  this.getRubric(res?.subjectId);
                  this.criteria = res?.competencyCriteria;
    
                  this.CreateCompetency.patchValue({
                    Batch: res?.batchId,
                    Year: res?.academicYearId,
                    Team: "1",
                    // PracticalName: res?.name,
                    AssignmentDate: res?.assignmentDate,
                    // SubmissionDate: res?.submissionDate,
                    Subject: res?.subjectId,
                    Faculty: res?.facultyId,
                    Criteria: res?.competencyCriteria,
                    Rubric: res?.rubricConstructionId,
                    Note: res?.notes
                  })
                }
              });
              
              
              
            })
          }
        })
        
      }
    })
    this._competencyService.getBatch().subscribe(res=>{
      this.batches = res;
    })

    
    this._competencyService.getFaculty().subscribe(res=>{
      this.lecturers = res
    });

    this.CreateCompetency = this._formBuilder.group({
      Batch: ['', Validators.required],
      Year: ['', Validators.required],
      Team: ['', Validators.required],
      // PracticalName: ['', Validators.required],
      AssignmentDate: ['', [Validators.required, this.dateNotBeforeTodayValidator()]],
      // SubmissionDate: ['', [Validators.required, this.dateNotBeforeTodayValidator()]],
      Subject: ['', Validators.required],
      Rubric: ['', Validators.required],
      Faculty: ['', Validators.required],
      Criteria: [''],
      Note: ['', Validators.required]
    }, {  });
    // }, { validators: this.submissionDateAfterAssignmentDateValidator() });

  }
  dateNotBeforeTodayValidator(){
    return (control: any) => {
      if (!control.value) {
        return null;
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day
      
      const selectedDate = new Date(control.value);
      selectedDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      if (selectedDate < today) {
        return { 'dateBeforeToday': true };
      }
      return null;
    };
  }
  submissionDateAfterAssignmentDateValidator(){
    return (formGroup: FormGroup) => {
      const assignmentDate = formGroup.get('AssignmentDate').value;
      const submissionDate = formGroup.get('SubmissionDate').value;
      
      if (assignmentDate && submissionDate) {
        const assignDate = new Date(assignmentDate);
        const submitDate = new Date(submissionDate);
        
        if (submitDate < assignDate) {
          formGroup.get('SubmissionDate').setErrors({ 'submissionBeforeAssignment': true });
          return { 'submissionBeforeAssignment': true };
        }
      }
      return null;
    };
  }


  getRubric(subjectid){
    this._competencyService.getRubricConstruction(subjectid).subscribe(res=>{
      this.rubricConstructions = res;
    });
  }
  getBatchYear(batchGuid){
    this._competencyService.getBatchYear(batchGuid).subscribe(res=>{
      this.academicYears = res;
    });
  }
  getSubject(yearGuid,IsEdit:boolean=false){
    this._competencyService.getSubject(yearGuid).subscribe(res=>{
      this.subjects = res;
      if(!IsEdit){
        this.CreateCompetency.get('Rubric').patchValue('');
        this.rubricConstructions = [];
      }
    });
  }

  addAssignment() {
    if (this.CreateCompetency.invalid) {
    } else {
      if (this.assignmentid) {
        let req: competency = {
          id: this.assignmentDetails.id,
          // guid: '',
          isActive: true,
          batchId: 1,
          academicYearId: this.CreateCompetency.get('Year').value,
          // name: this.CreateCompetency.get('PracticalName').value,
          assignmentDate: this.CreateCompetency.get('AssignmentDate').value,
          // submissionDate: this.CreateCompetency.get('SubmissionDate').value,
          subjectId: this.CreateCompetency.get('Subject').value,
          facultyId: this.CreateCompetency.get('Faculty').value,
          notes: this.CreateCompetency.get('Note').value,
          rubricConstructionId: this.CreateCompetency.get('Rubric').value
        }
        this._competencyService.updateAssignment(req).then(res => {
          this.openSnackBar("Assignment Updated Successfully", "Close");
          this._router.navigate(['/competency/list']);
        })
      } else {
        let req: competency = {
          id: 0,
          // guid: '',
          isActive: true,
          batchId: 1,
          academicYearId: this.CreateCompetency.get('Year').value,
          // name: this.CreateCompetency.get('PracticalName').value,
          assignmentDate: this.CreateCompetency.get('AssignmentDate').value,
          // submissionDate: this.CreateCompetency.get('SubmissionDate').value,
          subjectId: this.CreateCompetency.get('Subject').value,
          facultyId: this.CreateCompetency.get('Faculty').value,
          notes: this.CreateCompetency.get('Note').value,
          rubricConstructionId: this.CreateCompetency.get('Rubric').value
        }
        this._competencyService.createAssignment(req).then(res => {
          this.openSnackBar("Assignment Created Successfully", "Close");
          this._router.navigate(['/competency/list']);
        })
      }
    }
  }
  ngOnInit(): void {
  
  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    const dialogConfig = new MatDialogConfig();
    // Set the panel class here
    dialogConfig.panelClass = 'add-criteria-panel';
    // this.currentDialogRef = this.dialog.open(templateRef, {
    //   panelClass: 'add-input-panel'
    // });
    if (this.criteria?.length > 0) {
      this.currentDialogRef = this.dialog.open(templateRef, dialogConfig);
      this.defalutchoices = false;
    } else {
      this.defalutchoices = true;
      this.currentDialogRef = this.dialog.open(templateRef, dialogConfig);
    }
  }
  addRadioButton(): void {

    // Check validation based on whether default choices are shown or not
    if (this.defalutchoices) {
      // Validate all 4 inputs when default choices are shown
      if (!this.FirstAnswerContent || !this.SecondAnswerContent || !this.ThirdanswerContent || !this.FourthanswerContent
          || this.FirstAnswerMarks <= 0 || this.SecondAnswerMarks <= 0 || this.ThirdAnswerMarks <= 0 || this.FourthAnswerMarks <= 0
      ) {
        this.openSnackBar("Please fill in all fields and Marks must be greater than 0", "Close");
        return;
      }

      if (!this.criteria) {
        this.criteria = [];
      }

      // Reset any previously selected choices
      if (this.criteria.length > 0) {
        this.criteria.forEach(choice => {
          choice.isCorrect = false;
        });
      }

      // Add all 4 choices with isCorrect set to false
      this.criteria.push({
        id: 0,
        name: this.FirstAnswerContent,
        weightage: this.FirstAnswerMarks,
        competencyId: 0,
      });
      this.criteria.push({
        choiceId: 0,
        name: this.SecondAnswerContent,
         weightage: this.SecondAnswerMarks,
        competencyId: 0,
      });
      this.criteria.push({
        choiceId: 0,
        name: this.ThirdanswerContent,
         weightage: this.ThirdAnswerMarks,
        competencyId: 0,
      });
      this.criteria.push({
        choiceId: 0,
        name: this.FourthanswerContent,
         weightage: this.FourthAnswerMarks,
        competencyId: 0,
      });
    } else {
      // Validate single input when only one choice is shown
      if (!this.FirstAnswerContent || this.FirstAnswerMarks <= 0) {
        this.openSnackBar("Please enter an answer and Marks must be greater than 0", "Close");
        return;
      }

      if (!this.criteria) {
        this.criteria = [];
      }

      // Reset any previously selected choices
      if (this.criteria.length > 0) {
        this.criteria.forEach(choice => {
          choice.isCorrect = false;
        });
      }

      // Add single choice with isCorrect set to false
      this.criteria.push({
        choiceId: 0,
        name: this.FirstAnswerContent,
         weightage: this.FirstAnswerMarks,
        competencyId: 0,
      });
    }

    // Update the form control
    this.CreateCompetency.get('Criteria')?.setValue(this.criteria);

    // Reset isSelectedChoice flag since no option is selected
    this.isSelectedChoice = false;

    // Reset input fields
    this.FirstAnswerContent = '';
    this.SecondAnswerContent = '';
    this.ThirdanswerContent = '';
    this.FourthanswerContent = '';

    this.FirstAnswerMarks = 0;
    this.SecondAnswerMarks = 0;
    this.ThirdAnswerMarks = 0;
    this.FourthAnswerMarks = 0;

    // Close the dialog
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
  }
  editQuestionAdditionalChoice(choisetext: any, index: any, templateRef: TemplateRef<any>) {
    const dialogConfig = new MatDialogConfig();

    // Set the panel class here
    dialogConfig.panelClass = 'add-criteria-panel';

    this.currentDialogRef = this.dialog.open(templateRef, dialogConfig);
    this.editDeleteChoiceIndex = index;
    this.updatedanswer = choisetext.name;
    this.updatedMarks = choisetext.weightage;
  }
  updateChoiceanswer(text: string, updatedMarks: number) {
    this.criteria[this.editDeleteChoiceIndex].name = text;
    this.criteria[this.editDeleteChoiceIndex].weightage = updatedMarks;
    // Close the dialog
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
  }
  //Delete Choises here 
  deleteQuestionAdditionalChoice(index: number) {
    this.editDeleteChoiceIndex = index;
    this.criteria.splice(this.editDeleteChoiceIndex, 1);
  }
}
