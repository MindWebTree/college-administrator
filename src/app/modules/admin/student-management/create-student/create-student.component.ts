import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../student-management.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { studentModel } from '../student-management.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiErrorHandlerService } from '../../common/api-error-handler.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-student',
  standalone: true,
  imports: [MatListModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatChipsModule, MatFormFieldModule, MatSlideToggleModule, MatInputModule],
  templateUrl: './create-student.component.html',
  styleUrl: './create-student.component.scss'
})
export class CreateStudentComponent  {
  studentForm: FormGroup;
  addStudentError: Boolean = true;
  action: string;
  dialogTitle: string;
  IsActiveUser: boolean = false;
  Student: studentModel;
  cousreDetails: any = [];
  courses: any = [];
  batches: any = [];
  courseList: any = [];
  studentImage: any
  isEditing: boolean = true;
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(
    private _formbuilder: FormBuilder,
    private _studentService: StudentService,
    public matDialogRef: MatDialogRef<CreateStudentComponent>,
    private errorhandling: ApiErrorHandlerService,
    private _matSnockbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private _data: any,) {

    this.action = _data.action;
    this._studentService.getBatches().subscribe((res: any) => {
      this.batches = res;
    });
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit  Profile';
      this.isEditing = false;
      this.Student = _data.students;
    }
    else {
      this.dialogTitle = 'New student';
    }

  }
  ngOnInit(): void {
    this.studentForm = this._formbuilder.group({
      StudentImage: ['',],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Batch: ['', Validators.required],
      BatchYear: ['', Validators.required],
      ParentPhoneNumber: ['', Validators.required],
      ParentEmail: ['', Validators.required],
      RollNumber: ['', Validators.required],
      IsActive: [false],
      PhoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', this.action === 'edit' ? [] : [Validators.required, Validators.minLength(6)]]
    });

    this._studentService.cousreList().subscribe((responce: any) => {
      this.cousreDetails = responce;

    });

    
    // Patch the form if action is edit
    if (this.action === 'edit' && this._data.students) {

      this.studentForm.get("Password").clearValidators();
      this.studentForm.get("Password").updateValueAndValidity();
      console.log(this._data,"_data")
      this._studentService.getBatches().subscribe((batchRes: any) => {
        this.batches = batchRes;
        if (batchRes) {
          const batchGuid = this.batches.find(b => b.id == this._data.students?.batch?.batchId)?.guid
          this.SelectBatch(batchGuid);
          const course = this._data.students.course?.[0]; // Get the first course object from the array
          this.studentForm.patchValue({

            StudentImage: this._data.students.imageUrl,
            FirstName: this._data.students.firstName,
            LastName: this._data.students.lastName,
            Batch: this._data.students?.batch?.batchId,
            BatchYear: this._data.students?.batch?.batchYearId,
            ParentPhoneNumber: this._data.students.parentPhoneNumber,
            ParentEmail: this._data.students?.parentEmail,
            RollNumber: this._data.students.rollNo,
            PhoneNumber: this._data.students.phoneNumber,
            IsActive: this._data.students.isActive,
            Email: this._data.students.email,
            // Password: this._data.student.password
          });
          this.studentImage = this._data.students.imageUrl; // Update the local variable as well
        }
      });
      
    }
  }

  // getCourseYear(guid) {
  //   this._studentService.getCourseYaerByCousreGuid(guid).then((response: any) => {

  //     this.courses = response;
  //     if (!this.courses.some(course => this.Student.courseYearId === course.id)) {
  //       this.studentForm.get('CourseYear').setValue('');
  //     }
  //   }, (error) => {
  //     this.errorhandling.handleHttpError(error);
  //   });
  // }


  SelectBatch(batchGuid){
    this._studentService.getBatchYearbyBatchGuid(batchGuid).subscribe((responce: any) => {
      this.courses = responce;
    });
  }
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
      this._studentService.uploadImage(file).subscribe((response: any) => {

        if (response) {

          this.studentImage = response.url
          this.studentForm.get('StudentImage').setValue(this.studentImage)
        }
        // Handle the API response as needed
      });

    }
  }
  CloseMatdilog() {
    this.matDialogRef.close();
  }
  removeSelectedFile() {
    this.studentImage = ''; // Reset the image URL
    this.studentForm.get('StudentImage').setValue(''); // Clear the form control value


  }


  // onSelectCourse(course: any) {
  //   debugger
  //   console.log(course, "course")
  //   var index = this.courseList.findIndex(i => i.id == course.id);
  //   if (index > -1) {
  //     this.courseList.splice(index, 1)
  //   } else {

  //     this.courseList.push({ ID: course.id, CourseYear: course.name });
  //     console.log(this.courseList)
  //     // this.Student.courses.push(course)
  //   }
  // }
  // removeSubjects(index, text) {
  //   debugger
  //   this.courseList.splice(index, 1);
  //   const students = this.studentForm.get('CourseYear').value as string[];
  //   this.removeFirst(students, text);
  //   this.studentForm.get('CourseYear').setValue(students);
  // }
  // private removeFirst<T>(array: T[], toRemove: T): void {
  //   const index = array.indexOf(toRemove);
  //   if (index !== -1) {
  //     array.splice(index, 1);
  //   }
  // }

  onSave() {

    if (this.studentForm.invalid) {
      this.errorhandling.handleError(this.studentForm);
      this.addStudentError = true;
      return;

    } else {
      var request: studentModel = {
        id: this.action === 'edit' && this._data.students?.id ? this._data.students.id : 0,
        isActive: this.studentForm.get('IsActive').value,
        firstName: this.studentForm.get('FirstName').value,
        lastName: this.studentForm.get('LastName').value,
        email: this.studentForm.get('Email').value,
        phoneNumber: this.studentForm.get('PhoneNumber').value,
        courseYearId: this.studentForm.get('BatchYear').value,
        imageUrl: this.studentForm.get('StudentImage').value,
        rollNo: String(this.studentForm.get('RollNumber').value),
        countryId: 0,
        stateId: 0,
        collegeId: 0,
        courseId: this.cousreDetails[0].id,
        categoryId: 0,

        password: this.studentForm.get('Password').value || "",
        emailConfirmed: true,
        phoneNumberConfirmed: true,
        courseType: '',
        phoneCountryCode: '+91',
        year: 0,
        medicalCourseYear: '',
        batchId: this.studentForm.get('Batch').value,
        batchYearId: this.studentForm.get('BatchYear').value,
        parentEmail: this.studentForm.get('ParentEmail').value,
        parentPhoneNumber: this.studentForm.get('ParentPhoneNumber').value
      }
      if (this.action === 'edit') {
        // Call update API
        this._studentService.updateStudent(request).then((res: any) => {
          if (res) {
            this.openSnackBar(res.details.message, "Close");
            this.matDialogRef.close(res); // Close the dialog and pass the response
          } else {
            this.openSnackBar("Failed to update tag.", "Close");
          }
        });
      } else {
        // Call create API
        this._studentService.createStudent(request).then((res: any) => {

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

