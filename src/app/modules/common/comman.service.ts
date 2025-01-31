import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tenantDetails } from 'app/core/tenantModels';
import { User } from 'app/core/user/user.types';
// import { QuestionListFilter, QuestionListModel, Tag } from 'app/modules/admin/Models/QuestionModel/QuestionModel';
// import { CompetenecyLevel, Course, GridFilter, LevelQuestion, QbankType, QbankcmbCode, StudentFilter, Subjects, Topic } from 'app/modules/admin/Models/commonModels/commonModel';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { QuestionListFilter, QuestionListModel, QuestionSearchList } from '../admin/qbank/QuestionModel';
// import * as FileSaver from 'file-saver';
// import * as XLSX from 'xlsx';
// import { gameCourse } from 'app/modules/admin/Models/courseModels/courseModel';
// import { StudentList } from 'app/modules/admin/Models/StudentModels/studentModel';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class CommanService {
  getTenantDetails: BehaviorSubject<any> = new BehaviorSubject<any>(new tenantDetails({}));
//   private qbanktype: BehaviorSubject<QbankType[] | null> = new BehaviorSubject(null);
//   private _subjects: BehaviorSubject<Subjects[] | null> = new BehaviorSubject(null);
//   private _cmbcode: BehaviorSubject<QbankcmbCode[] | null> = new BehaviorSubject(null);
//   private _competenecyLevel: BehaviorSubject<CompetenecyLevel[] | null> = new BehaviorSubject(null);
//   private _levelofquestion: BehaviorSubject<LevelQuestion[] | null> = new BehaviorSubject(null);
//   private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
//   private _courses: BehaviorSubject<Course[] | null> = new BehaviorSubject(null);
  private Coursefilter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public courseIdvalue$: Observable<string> = this.Coursefilter.asObservable();
  onUserManagementChanged: BehaviorSubject<any>;
  onLecturerManagementChanged: BehaviorSubject<any>;
  onCoursesChanged: BehaviorSubject<any>;
  onUserChanged: BehaviorSubject<any>;
  user: any;
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  question_list: BehaviorSubject<any>;
  constructor(
    private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar) {
    this.onCoursesChanged = new BehaviorSubject({});
    this.question_list = new BehaviorSubject([]);
    this.onUserManagementChanged = new BehaviorSubject([]);
    this.onLecturerManagementChanged = new BehaviorSubject([]);
  }
  setCourseId(values: any): void {
    this.Coursefilter.next(values);
  }
    getexamCategory(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/exam-navigation/`).pipe(
      tap((response: any) => {
      })
    );
  }
  getLevel(): Observable<any> {    
    return this._httpClient.get<any>(`${environment.apiURL}/common/levels/`, {  });
  }
  getLevelofQuestions(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-levelofquestion`, {  });
  }
  geTags(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/tags`, {  });
  }
  getQBankTypes(qBankCategory): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-qbanktypes/`+ qBankCategory );
  }
  getSubjects(qbanktypeId,qBankCategory): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects/${qbanktypeId}/${qBankCategory}`, {  });
  }
  getTopics(subjectId,qBankCategory): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-topics/${subjectId}/${qBankCategory}`, {  });
  }
  getCBMECode(topicId,qBankCategory): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/cbmecode/${topicId}/${qBankCategory}`, {  });
  }


  //For exelFile
//   public exportAsExcelFile(json: any[], excelFileName: string): void {

//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
//     // console.log('worksheet',worksheet);
//     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
//     this.saveAsExcelFile(excelBuffer, excelFileName);
//   }

//   private saveAsExcelFile(buffer: any, fileName: string): void {
//     const data: Blob = new Blob([buffer], {
//       type: EXCEL_TYPE
//     });
//     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//   }



//   //end ExelFile

  getQuestion(_gridFilter: QuestionSearchList): Observable<QuestionListModel[]> {
    return this._httpClient.post<QuestionListModel[]>(`${environment.apiURL}/qbank/search/`, { ..._gridFilter });
  }
  getQuestionbyID(questionDetailID: number): Observable<QuestionListModel[]> {
    return this._httpClient.get<QuestionListModel[]>(`${environment.apiURL}/qbank/` + questionDetailID, {});
  }
//   deleteQuestion(questionDetailID: number): Observable<QuestionListModel[]> {
//     return this._httpClient.post<QuestionListModel[]>(`${environment.apiURL}/qbank/search/delete/` + questionDetailID, {});
//   }
//   get _qbanktype$(): Observable<QbankType[]> {
//     return this.qbanktype.asObservable();
//   }
//   get _subjects$(): Observable<Subjects[]> {
//     return this._subjects.asObservable();
//   }
//   get _cmbcode$(): Observable<QbankcmbCode[]> {
//     return this._cmbcode.asObservable();
//   }
//   get _competenecyLevel$(): Observable<CompetenecyLevel[]> {
//     return this._competenecyLevel.asObservable();
//   }
//   get _levelofquestion$(): Observable<LevelQuestion[]> {
//     return this._levelofquestion.asObservable();
//   }
//   get _tags$(): Observable<Tag[]> {
//     return this._tags.asObservable();
//   }
//   get courses$(): Observable<Course[]> {
//     return this._courses.asObservable();
//   }
//   //
//   //Get QbankTypes
//   getQbankType(): Observable<QbankType[]> {
//     return this._httpClient.get<QbankType[]>(`${environment.apiURL}/common/qbanktypes`).pipe(
//       tap((response: any) => {
//         this.qbanktype.next(response.Data);
//       })
//     );
//   }
//   //Get Subject 
//   getSubjectsbyQbanktypeid(modulename: string, QBANKtypeID: number): Observable<Subjects[]> {
//     return this._httpClient.get<Subjects[]>(`${environment.apiURL}/common/get-subjects/${modulename}/${QBANKtypeID}`).pipe(
//       tap((response: any) => {
//         this._subjects.next(response);
//       })
//     );
//   }
//   //get subjects topic 
//   getsubjectTopics(subjectId): Promise<Topic[]> {
//     return new Promise((resolve, reject) => {
//       this._httpClient.get(`${environment.apiURL}/common/get-topics/${subjectId}/Custom QBank`)
//         .subscribe((response: any) => {
//           resolve(response);
//         }, reject);
//     });
//   }
//   // get cbme code 
//   getQbankCmbCode(Topicid): Promise<QbankcmbCode[]> {
//     return new Promise((resolve, reject) => {
//       this._httpClient.get<QbankcmbCode[]>(`${environment.apiURL}/common/get-qbankcbmecodes/${Topicid}`)
//         .subscribe((response: any) => {
//           resolve(response);
//         }, reject);
//     });
//   }
//   //get  Competenecylevel
//   getCompetenecylevel(): Observable<CompetenecyLevel[]> {
//     return this._httpClient.get<CompetenecyLevel[]>(`${environment.apiURL}/common/get-qbanklevels`).pipe(
//       tap((response: any) => {
//         this._competenecyLevel.next(response);
//       })
//     );
//   }
//   //get Level Of Question
//   getLevelOfQuestion(): Observable<LevelQuestion[]> {
//     return this._httpClient.get<LevelQuestion[]>(`${environment.apiURL}/common/get-qbanklevelquestions`).pipe(
//       tap((response: any) => {
//         this._levelofquestion.next(response);
//       })
//     );
//   }
//   //get tags 
//   getTags(modulename: string): Observable<Tag[]> {
//     return this._httpClient.get<Tag[]>(`${environment.apiURL}/common/get-tags/${modulename}`).pipe(
//       tap((response: any) => {
//         this._tags.next(response);
//       })
//     );
//   }

//   getCourses(): Observable<any> {
//     return this._httpClient.get(`${environment.apiURL}/course/list`);
//   }

//   getUserManagementForGrid(_gridFilter: StudentFilter): Observable<any> {
//     return this._httpClient.post(`${environment.apiURL}/course/students/`, { ..._gridFilter });
//   }
//   //12-15 by harsh
//   getUsers(): Observable<any> {
//     return this._httpClient.get(`${environment.externalApiURL}/api/users`, {});
//   }
//   getUserDetailsbyID(id: string): Observable<any> {
//     return this._httpClient.get(`${environment.apiURL}/student/details?UserId=` + id, {});
//   }
//   // to edit user 12-15 
//   editUser(): Observable<any> {
//     return this._httpClient.get(`${environment.apiURL}/api/users/student-register`);
//   }

//   getBookmarkList(): Observable<any> {
//     return this._httpClient.get(`${environment.apiURL}/common/bookmarklist`);
//   }
//   updateUser(user: StudentList): Promise<any> {
//     return new Promise((resolve, reject) => {

//       this._httpClient.put(`${environment.apiURL}/student/update/`, { ...user })
//         .subscribe(response => {
//           resolve(response);
//           if (response) {
//             this.onUserChanged?.next(this.user);
//             this.openSnackBar("Successfully updated.", "Close");
//           }
//           else {
//             this.openSnackBar("Failed", "Close");
//           }

//         }, reject);
//     });
//   }

//   getLecturerManagementForGrid(_gridFilter: GridFilter): Observable<any> {
//     return this._httpClient.post(`${environment.apiURL}/user/get-grid-users`, { ..._gridFilter });
//   }

//   getCoursesBriefInfo(): Observable<any> {
//     return this._httpClient.get<any>(`${environment.apiURL}/course/courses-brief-info`).pipe(
//       tap((response: any) => {
//         this._courses.next(response);
//       })
//     );
//   }
//   getexamCategory(): Observable<any> {
//     return this._httpClient.get<any>(`${environment.apiURL}/test/categories`).pipe(
//       tap((response: any) => {
//         this._courses.next(response);
//       })
//     );
//   }

//   bookmark(request: any): Observable<any> {
//     return this._httpClient.post<any>(`${environment.apiURL}/common/bookmark`, { ...request })
//   }
//   getEntrance(): Observable<any> {
//     return this._httpClient.get<any>(`${environment.apiURL}/modules/entrance`).pipe(
//       tap((response: any) => {
//         this._courses.next(response);
//       })
//     );
//   }
//   gettrendingVideo(): Observable<any> {
//     return this._httpClient.get<any>(`${environment.apiURL}/modules/promotion/videos`).pipe(
//       tap((response: any) => {
//         this._courses.next(response);
//       })
//     );
//   }
//   //live quiz 
//   getCoursesfInfo(): Observable<any> {
//     return this._httpClient.post<any>(`${environment.apiURL}/course/for-tenant`,{}).pipe(
//         tap((response: any) => {
//             this._courses.next(response);
//         })
//     );
// }
// getCountryCode() {
//   return this._httpClient.get<any>(`${environment.apiURL}/common/countries`);
// }
}

