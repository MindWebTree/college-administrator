import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Optional, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { QuestionManagementService } from '../question-management.service';
import { QbankType, Subjects, Topic } from '../question-managemnet.model';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateQuestion } from '../question-management.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ApiErrorHandlerService } from '../../common/api-error-handler.service';
import { CKEDITOR_CONFIG } from '../../common/comman-ckeditor-config';
import { CKEditorModule } from 'ckeditor4-angular';
@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [MatListModule, CKEditorModule, MatStepperModule, MatButtonModule, MatCheckboxModule, MatRadioModule, FormsModule, TextFieldModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatChipsModule, MatFormFieldModule, MatSlideToggleModule, MatInputModule],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.scss'
})
export class CreateQuestionComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  CreateQuestionform: FormGroup;
  isLinear = true;
  addQbankError: boolean = true;
  qbanktype: Array<QbankType> = [];
  subjects: Array<Subjects> = [];
  topics: Array<Topic> = [];
  isMultiChoiceQuestion: boolean = false;
  Choices: any[] = [];
  ckeConfig: any;
  isSelectedChoice: boolean = true;
  FirstAnswerContent = "";
  SecondAnswerContent = "";
  ThirdanswerContent = "";
  FourthanswerContent = "";
  editDeleteChoiceIndex: number;
  updatedanswer = "";
  dialogRef: MatDialogRef<any>;
  QuestionDetailId: any;
  private currentDialogRef: MatDialogRef<any>;
  defalutchoices: boolean = false;
  cbmeId: any;
  QuestionId: any;
  questionDetail: any = [];
  isUpdate: boolean = false;
  questionLabelStatus: string = 'Create Question';
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _formBuilder: FormBuilder,
    @Optional() public matDialogRef: MatDialogRef<CreateQuestionComponent>,
    private dialog: MatDialog, private _questionManagementService: QuestionManagementService, private route: ActivatedRoute, private location: Location,
    private errorhandling: ApiErrorHandlerService,
    private _matSnockbar: MatSnackBar,) {
    this.ckeConfig = CKEDITOR_CONFIG;
    // getting questionDetailId From Url

    this.route.params.subscribe((parram) => {

      this.QuestionId = parram.questionDetailId;

    });
    // 

    this.CreateQuestionform = _formBuilder.group({
      QbankSetting: _formBuilder.group({
        QbankType: ['', Validators.required],
        Subject: ['', Validators.required],
        Topic: ['', Validators.required]

      }),
      CreateQuestion: _formBuilder.group({
        QuestionType: [1, Validators.required],
        QuestionTitle: ['', Validators.required],
        choices: [[], Validators.required]

      })
    })
  }
  ngOnInit(): void {
    this._questionManagementService.getQbankTypes('Free').subscribe((res) => {
      this.qbanktype = res;
    });

    if (this.QuestionId) {
      this.isUpdate = true;
      this.questionLabelStatus = 'Update Question'
      this._questionManagementService.getQuestionbyID(this.QuestionId).subscribe((responce: any) => {
        console.log(responce, "responce")
        this.questionDetail = responce;
        if (this.questionDetail.questionType == 2) {
          this.isMultiChoiceQuestion = true;
        }

        this.getQbanksubject(this.questionDetail.qBankTypeId);
        this.selectSubject(this.questionDetail.subjectId);

        this.qbanksetting.patchValue({
          QbankType: this.questionDetail.qBankTypeId > 0 ? this.questionDetail.qBankTypeId : '',
          Subject: this.questionDetail.subjectId > 0 ? this.questionDetail.subjectId : '',
          Topic: this.questionDetail.topicId > 0 ? this.questionDetail.topicId : '',
        });
        this.Choices = this.questionDetail?.choices != null ? this.questionDetail.choices : [],
          console.log(this.Choices)
        this.CreateQuestion.patchValue({
          QuestionType: this.questionDetail.questionType,
          QuestionTitle: this.questionDetail.questionTitle,
          choices: this.Choices  // Add this line to update the form control

        });

      });
    }


  }
  get qbanksetting() {
    return this.CreateQuestionform.get('QbankSetting') as FormGroup;
  }
  get CreateQuestion() {
    return this.CreateQuestionform.get('CreateQuestion') as FormGroup;
  }

  getQbanksubject(QbankTypeId: number) {
    this._questionManagementService.getSubjectsbyQbanktypeId(QbankTypeId, 'Free').subscribe((response: any) => {
      this.subjects = response;

      // if (!this.subjects.find(s => s.subjectID == this.qbanksetting.get('Subject').value)) {
      //   this.qbanksetting.get('Subject').setValue('');
      //   // this.subjects=[];
      //   this.topics = [];
      //   this.qbanksetting.get('Topic').setValue('');
      //   // this.qbanksetting.get('BankCode').setValue('');
      // }
    })
  }
  // get topic by subject id 
  selectSubject(subjectId: number,) {
    this._questionManagementService.getTopicsBySubjectId(subjectId, 'Free').subscribe(res => {
      this.topics = res;
      // if (!this.topics.find(t => t.topicID == this.qbanksetting.get('Topic').value)) {
      //   this.qbanksetting.get('Topic').setValue('');
      //   //  this.topics=[];
      // }

    })
  }

  // to get cbmde id 
  selectTopic(topicId) {
    this._questionManagementService.getCbmeCodeByTopicId(topicId).subscribe(res => {
      this.cbmeId = res[0];
      // if (!this.topics.find(t => t.topicID == this.qbanksetting.get('Topic').value)) {
      //   this.qbanksetting.get('Topic').setValue('');
      //   //  this.topics=[];
      // }

    })
  }

  //clear first form 
  clearqbanksetting() {
    this.qbanksetting.reset();
    this.errorhandling.handleError(this.qbanksetting);
    this.addQbankError = true;
  }
  // check qbank form error on save if invalid then rerun 
  qbanksettingForm() {
    if (this.qbanksetting.invalid) {
      this.errorhandling.handleError(this.qbanksetting);
      this.addQbankError = true;
      return;
    }
  }
  OnSelectQuestionType(QuestionType: any) {
    if (QuestionType == 2) {
      this.isMultiChoiceQuestion = true;
    }
    else {
      if (this.Choices) {
        this.Choices.forEach(choice => {
          choice.isCorrect = false;
        });
      }
      this.isMultiChoiceQuestion = false;
    }

  }
  openDialogWithTemplateRef(templateRef: TemplateRef<any>) {
    const dialogConfig = new MatDialogConfig();
    // Set the panel class here
    dialogConfig.panelClass = 'add-input-panel';
    // this.currentDialogRef = this.dialog.open(templateRef, {
    //   panelClass: 'add-input-panel'
    // });
    if (this.Choices?.length > 0) {
      this.currentDialogRef = this.dialog.open(templateRef, dialogConfig);
      this.defalutchoices = false;
    } else {
      this.defalutchoices = true;
      this.currentDialogRef = this.dialog.open(templateRef, dialogConfig);
    }
  }


  // Add Dynamic radio button
  addRadioButton(): void {

    // Check validation based on whether default choices are shown or not
    if (this.defalutchoices) {
      // Validate all 4 inputs when default choices are shown
      if (!this.FirstAnswerContent || !this.SecondAnswerContent || !this.ThirdanswerContent || !this.FourthanswerContent) {
        this.openSnackBar("Please fill in all answer fields", "Close");
        return;
      }

      if (!this.Choices) {
        this.Choices = [];
      }

      // Reset any previously selected choices
      if (this.Choices.length > 0) {
        this.Choices.forEach(choice => {
          choice.isCorrect = false;
        });
      }

      // Add all 4 choices with isCorrect set to false
      this.Choices.push({
        choiceId: 0,
        choiceText: this.FirstAnswerContent,
        isCorrect: false,
        questionDetailId: 0,
      });
      this.Choices.push({
        choiceId: 0,
        choiceText: this.SecondAnswerContent,
        isCorrect: false,
        questionDetailId: 0,
      });
      this.Choices.push({
        choiceId: 0,
        choiceText: this.ThirdanswerContent,
        isCorrect: false,
        questionDetailId: 0,
      });
      this.Choices.push({
        choiceId: 0,
        choiceText: this.FourthanswerContent,
        isCorrect: false,
        questionDetailId: 0,
      });
    } else {
      // Validate single input when only one choice is shown
      if (!this.FirstAnswerContent) {
        this.openSnackBar("Please enter an answer", "Close");
        return;
      }

      if (!this.Choices) {
        this.Choices = [];
      }

      // Reset any previously selected choices
      if (this.Choices.length > 0) {
        this.Choices.forEach(choice => {
          choice.isCorrect = false;
        });
      }

      // Add single choice with isCorrect set to false
      this.Choices.push({
        choiceId: 0,
        choiceText: this.FirstAnswerContent,
        isCorrect: false,
        questionDetailId: 0,
      });
    }

    // Update the form control
    this.CreateQuestionform.get('CreateQuestion')?.get('choices')?.setValue(this.Choices);

    // Reset isSelectedChoice flag since no option is selected
    this.isSelectedChoice = false;

    // Reset input fields
    this.FirstAnswerContent = '';
    this.SecondAnswerContent = '';
    this.ThirdanswerContent = '';
    this.FourthanswerContent = '';

    // Close the dialog
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
  }
  //Add checkbox
  // addCheckBox() {
  //   if (!this.Choices)
  //     this.Choices = [];
  //   this.Choices.push({
  //     choiceId: 0, choiceText: this.FirstAnswerContent, isCorrect: false,
  //     questionDetailId: 0,
  //   });
  //   this.Choices.push({
  //     choiceId: 0, choiceText: this.SecondAnswerContent, isCorrect: false,
  //     questionDetailId: 0,
  //   });
  //   this.Choices.push({
  //     choiceId: 0, choiceText: this.ThirdanswerContent, isCorrect: false,
  //     questionDetailId: 0,
  //   });
  //   this.Choices.push({
  //     choiceId: 0, choiceText: this.FourthanswerContent, isCorrect: false,
  //     questionDetailId: 0,
  //   });
  //   // Update the form control correctly
  //   this.CreateQuestionform.get('CreateQuestion')?.get('choices')?.setValue(this.Choices);

  //   // Reset the input fields
  //   this.FirstAnswerContent = '';
  //   this.SecondAnswerContent = '';
  //   this.ThirdanswerContent = '';
  //   this.FourthanswerContent = '';
  //   // Close the dialog
  //   if (this.currentDialogRef) {
  //     this.currentDialogRef.close();
  //   }
  // }
  addCheckBox() {
    // Validation for default choices mode
    if (this.defalutchoices) {
      if (!this.FirstAnswerContent || !this.SecondAnswerContent || !this.ThirdanswerContent || !this.FourthanswerContent) {
        this.openSnackBar("Please fill in all answer fields", "Close");
        return;
      }
    } else {
      // Validation for single choice mode
      if (!this.FirstAnswerContent) {
        this.openSnackBar("Please enter an answer", "Close");
        return;
      }
    }

    if (!this.Choices) {
      this.Choices = [];
    }

    // Reset existing selections
    this.Choices.forEach(choice => {
      choice.isCorrect = false;
    });

    // Add new choices based on mode
    if (this.defalutchoices) {
      // Add all four choices
      const newChoices = [
        this.FirstAnswerContent,
        this.SecondAnswerContent,
        this.ThirdanswerContent,
        this.FourthanswerContent
      ].map(text => ({
        choiceId: 0,
        choiceText: text,
        isCorrect: false,
        questionDetailId: 0
      }));

      this.Choices.push(...newChoices);
    } else {
      // Add single choice
      this.Choices.push({
        choiceId: 0,
        choiceText: this.FirstAnswerContent,
        isCorrect: false,
        questionDetailId: 0
      });
    }

    // Update form control
    this.CreateQuestionform.get('CreateQuestion')?.get('choices')?.setValue(this.Choices);

    // Reset selection state
    this.isSelectedChoice = false;

    // Reset input fields
    this.FirstAnswerContent = '';
    this.SecondAnswerContent = '';
    this.ThirdanswerContent = '';
    this.FourthanswerContent = '';

    // Close dialog
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
  }
  // on select redio true false of choices 
  selectRadio(index: any, data: any) {
    this.isSelectedChoice = true;
    if (data == false) {
      if (this.Choices) {
        if (!this.Choices[index].isCorrect) {
          for (let i = 0; i < this.Choices.length; i++) {
            this.Choices[i].isCorrect = i == index ? true : false;
          }

        }
      }
    }

    // this.CreateQuestionform.get('CreateQuestion')?.get('choices')?.setValue(this.Choices);
  }

  //Matcheck box true false here 
  onSelection(event: any) {

    var _isSelectedChoice = false;
    if (event.options[0]._selected != this.Choices[event.options[0]._value].isCorrect) {
      this.Choices[event.options[0]._value].isCorrect = event.options[0]._selected;
    }
    if (this.Choices) {
      for (let index = 0; index < this.Choices.length; index++) {
        if (this.Choices[index].isCorrect)
          _isSelectedChoice = true;
      }
    }
    console.log(this.Choices, "event.options[0]._selected")
    this.isSelectedChoice = _isSelectedChoice;
  }
  editQuestionAdditionalChoice(choisetext: string, index: any, templateRef: TemplateRef<any>) {
    const dialogConfig = new MatDialogConfig();

    // Set the panel class here
    dialogConfig.panelClass = 'add-input-panel';

    this.currentDialogRef = this.dialog.open(templateRef, dialogConfig);
    this.editDeleteChoiceIndex = index;
    this.updatedanswer = choisetext;
  }

  updateChoiceanswer(text: string, index: number) {
    this.Choices[this.editDeleteChoiceIndex].choiceText = text;
    // Close the dialog
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
  }
  //Delete Choises here 
  deleteQuestionAdditionalChoice(index: number) {
    this.editDeleteChoiceIndex = index;
    this.Choices.splice(this.editDeleteChoiceIndex, 1);
  }
  //go to next step
  gotoStatus() {
    this.stepper.next();
    this.ClearFormData();
    this.clearqbanksetting();
  }
  //go to step one when click on create Question 
  goToCreateQuestion() {
    this.stepper.selectedIndex = 0;
    this.isUpdate = false;
    this.questionLabelStatus = 'Create Question'
    this.ClearFormData();
    this.clearqbanksetting();
  }
  //Create Exam Here
  onSubmit(): void {

    if (this.CreateQuestion.invalid) {
      this.errorhandling.handleError(this.CreateQuestion);
      this.addQbankError = true;
    }
    // this.IsCreateQuestionFormHaserror = true;
    if (!this.Choices || this.Choices.length == 0 || !this
      .Choices.find(c => c.isCorrect)) {
      if (this.Choices) {
        if (!this.Choices.find(c => c.isCorrect)) {
          this.isSelectedChoice = false;
        }
      }
    }
    else if (this.CreateQuestion.valid) {
      var formData: CreateQuestion = {
        id: 0,
        isActive: true,
        questionDetailId: 0,
        questionType: this.CreateQuestion.get('QuestionType').value,
        levelIdOfQuestion: null,
        levelId: null,
        audioId: 0,
        cbmeId: this.cbmeId.id,
        chapterId: 0,
        queueId: 0,
        questionTitle: this.CreateQuestion.get('QuestionTitle').value,
        notes: '',
        typeOfQuestion: '',
        levelOfKnowledge: '',
        horizontalIntegration: [],
        verticalIntegration: [],
        tags: [],
        videos: [],
        choices: this.Choices,
        explanations: [],
        books: [],
        qBankCategoryId: 0
      }
      console.log(formData)
      this._questionManagementService.questionCreate(formData).subscribe((response: any) => {
        if (response) {

          this.openSnackBar(response.details.message, "Close");
          this.QuestionDetailId = response.id;
          this.gotoStatus();
          // this.matDialogRef.close(response); // Close the dialog and pass the response
        } else {
          this.openSnackBar("Failed to update tag.", "Close");
        }

      });

    }
  }
  // Update Question Here 
  onUpdate(): void {

    console.log(this.CreateQuestion.value, "this.CreateQuestion.invalid")
    if (this.CreateQuestion.invalid) {
      this.errorhandling.handleError(this.CreateQuestion);
      this.addQbankError = true;
    }
    if (!this.Choices || this.Choices.length == 0 || !this
      .Choices.find(c => c.isCorrect)) {
      if (this.Choices) {
        if (!this.Choices.find(c => c.isCorrect)) {
          this.isSelectedChoice = false;
        }
      }
    }
    else if (this.CreateQuestion.valid) {
      var formData: CreateQuestion = {
        id: 0,
        isActive: false,
        questionDetailId: this.QuestionId,
        questionType: this.CreateQuestion.get('QuestionType').value,
        levelIdOfQuestion: null,
        levelId: null,
        audioId: 0,
        cbmeId: this.cbmeId?.id || this.questionDetail.cbmeId, // Modified this line
        chapterId: 0,
        queueId: 0,
        questionTitle: this.CreateQuestion.get('QuestionTitle').value,
        notes: '',
        typeOfQuestion: '',
        levelOfKnowledge: '',
        horizontalIntegration: [],
        verticalIntegration: [],
        tags: [],
        videos: [],
        choices: this.Choices,
        explanations: [],
        books: [],
        qBankCategoryId: 0
      }
      this._questionManagementService.updateQuestion(formData).subscribe((response: any) => {
        if (response) {
          this.openSnackBar(response.details.message, "Close");
          this.QuestionDetailId = response.id;
          this.stepper.next();
          // this.location.back();
        }
      },
        //Catch api error with commants
        (error) => {
          console.error(error);
          // this._errorHandler.handleError(error);
        })

    }


  }
  ClearFormData() {
    this.CreateQuestion.reset();
    this.isMultiChoiceQuestion = false;

    this.Choices = [];

    setTimeout(() => {
      this.CreateQuestion.patchValue({
        QuestionType: 1,
        QuestionTitle: ''
      });
    }, 0);
  }
}
