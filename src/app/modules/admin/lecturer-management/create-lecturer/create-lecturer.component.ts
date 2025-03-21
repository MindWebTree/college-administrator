import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { lectureModel, QBankCategory } from '../lecturer-management.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LectureService } from '../lecturer-management.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { BehaviorSubject, combineLatest, filter, take, tap } from 'rxjs';
import { ApiErrorHandlerService } from '../../common/api-error-handler.service';

@Component({
  selector: 'app-create-lecturer',
  standalone: true,
  imports: [MatListModule, TextFieldModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatChipsModule, MatFormFieldModule, MatSlideToggleModule, MatInputModule],
  templateUrl: './create-lecturer.component.html',
  styleUrl: './create-lecturer.component.scss'
})
export class CreateLecturerComponent {

  lecturerForm: FormGroup;
  lecturer: lectureModel
  addLecturerError: Boolean = true;
  action: string;
  dialogTitle: string;
  IsActiveUser: boolean = false;
  lecture: lectureModel;
  cousreDetails: any = [];
  courses: any = [];
  subjectList: any = [];
  courseList: any = [];
  lecturerImage: any
  isEditing: boolean = true;
  subjectDetails: any = [];
  employeeNum: any;
  coursesLoaded: boolean = false;
  designationList:any;
  subjects:any;
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(
    private _formbuilder: FormBuilder,
    private _lecturerService: LectureService,
    public matDialogRef: MatDialogRef<CreateLecturerComponent>,
    private errorhandling: ApiErrorHandlerService,
    private _matSnockbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private _data: any,) {

    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit  Profile';
      this.isEditing = false;
      this.lecture = _data.lecturer;
    }
    else {
      this.dialogTitle = 'New Profile';
    }

  }
  ngOnInit(): void {
    const coursesLoaded$ = new BehaviorSubject<boolean>(false);
    const subjectsLoaded$ = new BehaviorSubject<boolean>(false);

    this.lecturerForm = this._formbuilder.group({
      lecturerImage: ['',],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      CourseYear: ['', Validators.required],
      Designation: ['', Validators.required],
      Subject: ['', Validators.required],
      Subjects: [''],
      EmployeeNo: ['', Validators.required],
      Qualification: ['', Validators.required],
      IsActive: [false],
      Description: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', this.action === 'edit' ? [] : [Validators.required, Validators.minLength(6)]]
    });
    this._lecturerService.getDesignation().subscribe(res=>{
      this.designationList =res;
    })
    this.lecturerForm.get('CourseYear').valueChanges.subscribe(res=>{
      this._lecturerService.getSubjectbyAcademicYear(res.guid).subscribe(res=>{
        this.subjects = res;
      })
    })
    

    // Load course list
    this._lecturerService.cousreList().subscribe((response: any) => {
      this.cousreDetails = response;
    });

    // Load subjects
    this._lecturerService.qbankTypeList(QBankCategory.General).pipe(
      tap(response => {
        this.subjectDetails = response;
        subjectsLoaded$.next(true);
      })
    ).subscribe();

    // Load course years
    this._lecturerService.getCourseYear().pipe(
      tap(response => {
        this.courses = response;
        coursesLoaded$.next(true);
      })
    ).subscribe();

    if (this.action === 'edit' && this._data.lecturer) {
      console.log(this._data)
      // Wait for both courses and subjects to load
      combineLatest([coursesLoaded$, subjectsLoaded$]).pipe(
        filter(([coursesLoaded, subjectsLoaded]) => coursesLoaded && subjectsLoaded),
        take(1)
      ).subscribe(() => {
        this.lecturerForm.get("Password").clearValidators();
        this.lecturerForm.get("Password").updateValueAndValidity();

        this.employeeNum = this._data.lecturer.rollNo;
        const course:any = this._data.lecturer.courses;

        const selectedCourse = this.courses.find(c => c.id === course[0]?.courseYearId) || null;
        // const selectedCourse = this._data.lecturer.courses.map(q => q.courseYearId);
        // console.log(this._data.lecturer.courses)
        // this.courseList = this._data.lecturer.courses.map(q => ({
        //   ID: q.courseYearId,
        //   courseTitle: q.courseYear
        // }));
        // Set the image URL separately
        this.lecturerImage = this._data.lecturer.imageUrl;

        // Set subjects
        // const subjectIds = this._data.lecturer.qBankTypes.map(q => q.id);
        const subjectIds = this._data.lecturer?.subjects[0]?.id;

        this.lecturerForm.patchValue({
          FirstName: this._data.lecturer.firstName,
          LastName: this._data.lecturer.lastName,
          CourseYear: selectedCourse,
          Subject: subjectIds,
          EmployeeNo: this.employeeNum,
          PhoneNumber: this._data.lecturer.phoneNumber,
          IsActive: this._data.lecturer.isActive,
          Email: this._data.lecturer.email,
          Description: this._data.lecturer.description,
          Qualification: this._data.lecturer.qualification,
          Designation: this._data.lecturer.designationId
        });

        // Set the chips list
        this.subjectList = this._data.lecturer.qBankTypes.map(q => ({
          ID: q.id,
          subjectTitle: q.title
        }));
      });
    }
  }
  // ngOnInit(): void {
  //   this.lecturerForm = this._formbuilder.group({
  //     LecturerImage: ['',],
  //     FirstName: ['', Validators.required],
  //     LastName: ['', Validators.required],
  //     CourseYear: ['', Validators.required],
  //     Subjects: ['', Validators.required],
  //     EmployeeNo: ['', Validators.required],
  //     IsActive: [false],
  //     Description: ['', Validators.required],
  //     PhoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
  //     Email: ['', [Validators.required, Validators.email]],
  //     Password: ['', this.action === 'edit' ? [] : [Validators.required, Validators.minLength(6)]]
  //   });
  //   this._lecturerService.cousreList().subscribe((responce: any) => {
  //     this.cousreDetails = responce;

  //   });
  //   this._lecturerService.qbankTypeList(QBankCategory.General).subscribe((responce: any) => {
  //     this.subjectDetails = responce;

  //   });

  //   this._lecturerService.getCourseYear().subscribe((responce: any) => {

  //     this.courses = responce;

  //     console.log(responce, "responce1")

  //   });
  //   // Patch the form if action is edit
  //   if (this.action === 'edit' && this._data.lecturer) {
  //     console.log(this._data.lecturer, "lecturer")
  //     this.lecturerForm.get("Password").clearValidators();
  //     this.lecturerForm.get("Password").updateValueAndValidity();

  //     this.employeeNum = this._data.lecturer.rollNo

  //     const course = this._data.lecturer.courses?.[0];
  //     console.log(this.courses, " this.courses2")
  //     const selectedCourse = this.courses.find(c => c.id === course?.courseYearId) || null;

  //     this.lecturerForm.patchValue({

  //       LecturerImage: this._data.lecturer.imageUrl,
  //       FirstName: this._data.lecturer.firstName,
  //       LastName: this._data.lecturer.lastName,

  //       CourseYear: selectedCourse,
  //       Subjects: this._data.lecturer.qBankTypes.map(q => q.id), // Extract only subject IDs
  //       EmployeeNo: this.employeeNum,
  //       PhoneNumber: this._data.lecturer.phoneNumber,
  //       IsActive: this._data.lecturer.isActive,
  //       Email: this._data.lecturer.email,
  //       Description: this._data.lecturer.description
  //     });
  //     this.lecturerImage = this._data.lecturer.imageUrl; // Update the local variable as well
  //     // Populate subjectList for chips display
  //     this.subjectList = this._data.lecturer.qBankTypes.map(q => ({
  //       ID: q.id,
  //       subjectTitle: q.title
  //     }));
  //   }
  //   // });
  // }


  // getCourseYear(guid) {
  //   this._lecturerService.getCourseYaerByCousreGuid(guid).then((response: any) => {

  //     this.courses = response;
  //     if (!this.courses.some(course => this.Student.courseYearId === course.id)) {
  //       this.lecturerForm.get('CourseYear').setValue('');
  //     }
  //   }, (error) => {
  //     this.errorhandling.handleHttpError(error);
  //   });
  // }



  onselectFile(e: any) {
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      const fileType = file.type;

      if (!validImageTypes.includes(fileType)) {
        alert("Invalid image type. Please select a JPEG or PNG file.");
        return;
      }

      const fileSizeKB = file.size / 1024;

      if (fileSizeKB > 700) {
        alert("File size exceeds the maximum limit of 700KB.");
        return;
      }
      this._lecturerService.uploadImage(file).subscribe((response: any) => {

        if (response) {

          this.lecturerImage = response.url
          // this.lecturerForm.get('LecturerImage').setValue(this.lecturerImage)
        }
        // Handle the API response as needed
      });

    }
  }
  CloseMatdilog() {
    this.matDialogRef.close();
  }
  removeSelectedFile() {
    this.lecturerImage = ''; // Reset the image URL

  }

  onSelectCourseYear(courseYear: any){
    const currentValues = this.lecturerForm.get('CourseYear').value || [];

    // Check if subject exists in subjectList
    const index = this.courseList.findIndex(i => i.ID === courseYear.id);

    if (index > -1) {
      // Remove from subjectList
      this.courseList.splice(index, 1);
      // Remove from form control
      const newValues = currentValues.filter(id => id !== courseYear.id);
      this.lecturerForm.get('CourseYear').setValue(newValues, { emitEvent: false });
    } else {
      // Add to subjectList
      this.courseList.push({ ID: courseYear.id, courseTitle: courseYear.name });
      // Add to form control if not already present
      if (!currentValues.includes(courseYear.id)) {
        this.lecturerForm.get('CourseYear').setValue([...currentValues, courseYear.id], { emitEvent: false });
      }
    }
  }
  removeCourseYear(index: number, id: any) {
    // Remove from subjectList
    this.courseList.splice(index, 1);

    // Remove from form control
    const currentValues = this.lecturerForm.get('CourseYear').value || [];
    const newValues = currentValues.filter(value => value !== id);
    this.lecturerForm.get('CourseYear').setValue(newValues);
  }
  onSelectSubject(subject: any) {
    // Get current form control values
    const currentValues = this.lecturerForm.get('Subjects').value || [];

    // Check if subject exists in subjectList
    const index = this.subjectList.findIndex(i => i.ID === subject.id);

    if (index > -1) {
      // Remove from subjectList
      this.subjectList.splice(index, 1);
      // Remove from form control
      const newValues = currentValues.filter(id => id !== subject.id);
      this.lecturerForm.get('Subjects').setValue(newValues, { emitEvent: false });
    } else {
      // Add to subjectList
      this.subjectList.push({ ID: subject.id, subjectTitle: subject.title });
      // Add to form control if not already present
      if (!currentValues.includes(subject.id)) {
        this.lecturerForm.get('Subjects').setValue([...currentValues, subject.id], { emitEvent: false });
      }
    }
  }

  removeSubjects(index: number, id: any) {
    // Remove from subjectList
    this.subjectList.splice(index, 1);

    // Remove from form control
    const currentValues = this.lecturerForm.get('Subjects').value || [];
    const newValues = currentValues.filter(value => value !== id);
    this.lecturerForm.get('Subjects').setValue(newValues);
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  onSave() {

    if (this.lecturerForm.invalid) {
      this.errorhandling.handleError(this.lecturerForm);
      this.addLecturerError = true;
      return;

    } else {
      var request: lectureModel = {
        id: this.action === 'edit' && this._data.lecturer?.id ? this._data.lecturer.id : 0,
        isActive: this.lecturerForm.get('IsActive').value,
        firstName: this.lecturerForm.get('FirstName').value,
        lastName: this.lecturerForm.get('LastName').value,
        email: this.lecturerForm.get('Email').value,
        phoneNumber: this.lecturerForm.get('PhoneNumber').value,
        imageUrl: this.lecturerImage,
        countryId: 0,
        stateId: 0,
        collegeId: 0,
        categoryId: 0,
        password: this.lecturerForm.get('Password').value || "",
        emailConfirmed: true,
        phoneNumberConfirmed: true,
        courseType: '',
        phoneCountryCode: '+91',
        description: this.lecturerForm.get('Description').value,
        // dateOfBirth: '',
        employeeNo: this.lecturerForm.get('EmployeeNo').value,
        designationId: this.lecturerForm.get('Designation').value,
        qualification: this.lecturerForm.get('Qualification').value,
        // courses: this.courseList.map(course => ({
        //   courseId: this.cousreDetails[0].id,
        //   courseYearId: course.ID || null,
        //   courseYear: course.courseTitle || '',
        //   courseName: course.name || ''
        // })),
        
        courses:[{
          courseId: this.cousreDetails[0].id,
          courseYearId: this.lecturerForm.get('CourseYear').value?.id || null,
          courseYear: this.lecturerForm.get('CourseYear').value?.name || '',
          courseName: this.lecturerForm.get('CourseYear').value?.name || ''
        }],
        qBankTypeIds: this.subjectList.map(subject => subject.ID),
        qBankTypes: [],
        subjectIds: [this.lecturerForm.get('Subject').value],
        rollNo: ''
      }
      if (this.action === 'edit') {
        // Call update API
        this._lecturerService.updateLecturer(request).then((res: any) => {
          if (res) {
            this.openSnackBar(res.details.message, "Close");
            this.matDialogRef.close(res); // Close the dialog and pass the response
          } else {
            this.openSnackBar("Failed to update tag.", "Close");
          }
        });
      } else {
        // Call create API
        this._lecturerService.createLecture(request).then((res: any) => {

          if (res) {

            this.openSnackBar(res.details.message, "Close");
            this.matDialogRef.close(res); // Close the dialog and pass the response

          } else {
            this.openSnackBar("Failed to add tag.", "Close");
          }
        });
      }
    }
  }
}
