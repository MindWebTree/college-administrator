import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { lectureModel, QBankCategory } from './lecturer-management.model';
import { environment } from 'environments/environment';
import { GridFilter, lecturerAnalyticGrid } from '../common/gridFilter';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  lecture: lectureModel;
  onLecturerGridChanged: BehaviorSubject<any>;
  onlectureManagementChanged: BehaviorSubject<any>;
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar, private _navigationTypeService: NavigationService, private _navigationService: NavigationMockApi
  ) {
    this.onlectureManagementChanged = new BehaviorSubject([]);
    this.onLecturerGridChanged = new BehaviorSubject([]);
  }

  /**
   * Get student Grid
   *
   * @returns {Observable<any>}
   */
  getlectureForGrid(_gridFilter: GridFilter): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/lecturer/grid`, { ..._gridFilter }, {});

  }
  /**
         * Get lecture by Id
         *
         * @returns {Promise<any>}
         */

  getLectureDetailsById(id): Promise<lectureModel> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('userId', id);
      this._httpClient.get(`${environment.apiURL}/lecturer/get-by-id`, { params })
        .subscribe((response: any) => {
          this.lecture = response;
          resolve(this.lecture);
        }, reject);
    }
    );
  }
  /**
     * Create leacture
     *
     * @param leacture
     * @returns {Promise<any>}
     */
  createLecture(lecture: lectureModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/lecturer/create`, { ...lecture })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onlectureManagementChanged.next(this.lecture);
              // to refresh  count in navigation
              this._navigationService.fetchDynamicNavigation(this._navigationService._StudentNavigation).then(updatedNavigation => {

                // Explicitly trigger a navigation refresh
                this._navigationTypeService.refreshNavigation();

              });
              this.openSnackBar("Successfully added.", "Close");
              resolve(response);
            } else {
              this.openSnackBar("Failed to Update", "Close");
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
     * update leacture
     *
     * @param leacture
     * @returns {Promise<any>}
     */
  updateLecturer(lecturer: lectureModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/lecturer/update`, { ...lecturer })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onlectureManagementChanged.next(this.lecture);
              // to refresh  count in navigation
              this._navigationService.fetchDynamicNavigation(this._navigationService._StudentNavigation).then(updatedNavigation => {

                // Explicitly trigger a navigation refresh
                this._navigationTypeService.refreshNavigation();

              });
              this.openSnackBar("Successfully added.", "Close");
              resolve(response);
            } else {
              this.openSnackBar("Failed to Update.", "Close");
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

  qbankTypeList(qbankCategory: QBankCategory): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-qbanktypes/${qbankCategory}`, {});

  }
  // getCourseYaerByCousreGuid(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     // const params = new HttpParams().set('courseId', guid);
  //     this._httpClient.get(`${environment.apiURL}/course/courseyear`)
  //       .subscribe((response: any) => {
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  getCourseYear(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/courseyear`)
  }
  getCourseYearName(guid) {
    return this._httpClient.get(`${environment.apiURL}/course/courseyear-by-guid?courseYearId=${guid}`, {});
  }

  cousreList(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/list`);

  }
  getDesignation(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/designations`);
  }
  getSubjectbyAcademicYear(guid): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects/academicyear/${guid}`);
  }
  getSubjects(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects`);
  }
  /**
    * Delete Student
    *
    * @param user
    */
  deleteLecture(userId): Promise<any> {

    return new Promise(() => {
      const params = new HttpParams().set('userId', userId);

      this._httpClient.post(`${environment.apiURL}/lecturer/delete`, {}, { params, })
        .subscribe(response => {
          if (response) {
            this.onlectureManagementChanged.next(this.lecture);
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
  lecturerAnalyticsListing(_gridFilter: lecturerAnalyticGrid): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/lecturer/exam-summary-grid`, { ..._gridFilter }, {});

  }
  lecturereQbankSummary(userId): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/qbank-summary/${userId}`, {});
  }
  getTeams(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/teammanagement/list`);
  }
  getYears(guid): Observable<any> {
    console.log('ssssss'+guid);
    return this._httpClient.post<any>(`${environment.apiURL}/batch/batchyears/${guid}`, {})
  }
  bulkUploadUsers(batchGuid, batchYearId, data: any[]): Promise<any> {
    var self = this;
    console.log(JSON.stringify(data))
    return new Promise((resolve, reject) => {

      this._httpClient.post(`${environment.apiURL}/student/bulk-create/${batchGuid}/${batchYearId}`, [...data])
        .subscribe((response: any) => {
          this.openSnackBar(response, "Close");
          resolve(response);
        }, reject);
    });
  }
  mapTeam(req): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/teammanagement/map-user-team`, { ...req });
  }
  promoteToNextYear(req: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/hod/promote-students`, req);
  }
  getHODStudentForGrid(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/lecturer/grid/`, { ..._gridFilter }, {});
  }


  // Method to get lecturers
  getLecturers(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/lecturer/list`);
  }
  getBatch(): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/batch/list`, {});
  }
  AssignTeam(AssignTeam: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/teammanagement/map-faculty-team/`, { ...AssignTeam }, {});
  }
  getHod(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/hod/get-by-id`,{});  }
}




