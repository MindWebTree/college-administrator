import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { studentAnalytics, studentModel } from './student-management.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { studentAnalyticGrid, studentGrid } from '../common/gridFilter';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NavigationService } from 'app/core/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  student: studentModel;
  onStudentManagementChanged: BehaviorSubject<any>;
  onStudentListChanged: BehaviorSubject<any>;
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar, private _navigationTypeService: NavigationService, private _navigationService: NavigationMockApi
  ) {
    this.onStudentManagementChanged = new BehaviorSubject([]);
    this.onStudentListChanged = new BehaviorSubject([]);
  }

  /**
   * Get student Grid
   *
   * @returns {Observable<any>}
   */
  getStudentForGrid(_gridFilter: studentGrid): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.post(`${environment.apiURL}/student/grid`, { ..._gridFilter }, { headers });

  }


  /**
        * Get student by Id
        *
        * @returns {Promise<any>}
        */

  getStudentDetailsById(id): Promise<studentModel> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('userId', id);
      const headers = new HttpHeaders({
        'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

      });
      this._httpClient.get(`${environment.apiURL}/student/get-by-id`, { params, headers })
        .subscribe((response: any) => {
          this.student = response;
          resolve(this.student);
        }, reject);
    }
    );
  }
  /**
     * Create student
     *
     * @param student
     * @returns {Promise<any>}
     */
  createStudent(student: studentModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/student/create`, { ...student })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onStudentManagementChanged.next(this.student);
              // Fetch new navigation dynamically   To refresh  count in navigation
              this._navigationService.fetchDynamicNavigation(this._navigationService._StudentNavigation).then(updatedNavigation => {

                // Explicitly trigger a navigation refresh
                this._navigationTypeService.refreshNavigation();

              });
              this.openSnackBar("Successfully added.", "Close");
              resolve(response);
            } else {
              this.openSnackBar("Failed to add subject.", "Close");
              reject("Failed to add subject");
            }
          },
          (error: any) => {
            const errorMessage = error.error?.exception || "An unexpected error occurred.";
            this.openSnackBar(`${errorMessage} `, "Close");
            reject(error);
          }
        );
    });

  }
  /**
     * update student
     *
     * @param student
     * @returns {Promise<any>}
     */
  updateStudent(student: studentModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/student/update`, { ...student })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onStudentManagementChanged.next(this.student);
              this.openSnackBar("Successfully added.", "Close");
              resolve(response);
            } else {
              this.openSnackBar("Failed to add subject.", "Close");
              reject("Failed to add subject");
            }
          },
          (error: any) => {
            const errorMessage = error.error?.exception || "An unexpected error occurred.";
            this.openSnackBar(`${errorMessage} `, "Close");
            reject(error);
          }
        );
    });
  }
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this._httpClient.post(`${environment.apiURL}/admin/s3fileupload/image`, formData)
      .pipe(
        map((response: any) => {
          return {
            fileName: response?.fileName || '',
            uploaded: response?.uploaded || 0,
            url: response?.url || ''
          };
        }),
        catchError(error => {
          console.error('Error uploading file:', error);
          console.error('Full Error Response:', error);
          throw error;
        })
      );
  }

  cousreList(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/list`);

  }
  getCourseYearName(guid) {
    return this._httpClient.get(`${environment.apiURL}/course/courseyear-by-guid?courseYearId=${guid}`, {});
  }
  getCourseYaerByCousreGuid(): Promise<any> {
    return new Promise((resolve, reject) => {
      // const params = new HttpParams().set('courseId', guid);
      this._httpClient.get(`${environment.apiURL}/course/courseyear`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getBatchYearbyBatchGuid(guid): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/batch/batchyears/${guid}`,{});
  }
  getBatches(): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/batch/list`,{})
  }

  /**
    * Delete Student
    *
    * @param user
    */
  deleteStudent(userId): Promise<any> {

    return new Promise(() => {
      const params = new HttpParams().set('userId', userId);
      const headers = new HttpHeaders({
        'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

      });

      this._httpClient.post(`${environment.apiURL}/student/delete`, {}, { params, headers })
        .subscribe(response => {
          if (response) {
            this.onStudentManagementChanged.next(this.student);
            // to refresh  count in navigation
            this._navigationService.fetchDynamicNavigation(this._navigationService._StudentNavigation).then(updatedNavigation => {

              // Explicitly trigger a navigation refresh
              this._navigationTypeService.refreshNavigation();

            });
            this.openSnackBar("Successfully removed.", "Close");
          }
          else {
            this.openSnackBar("Failed", "Close");
          }
        });
    });
  }
  studentExamAnalyticsListing(_gridFilter: studentAnalyticGrid): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.post<any>(`${environment.apiURL}/student/exam-summary-grid`, { ..._gridFilter }, { headers });

  }
  studentSubjectSummary(userId): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/student/subjectwiseaveragemarks/${userId}`, { });
  }
  studentAttendance(payload): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/attendence/get-grid-attendance-by-user/`, { ...payload});
  }
}


