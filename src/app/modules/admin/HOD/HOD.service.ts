import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { HODModel, QBankCategory } from './HOD.model';
import { environment } from 'environments/environment';
import { GridFilter, lecturerAnalyticGrid } from '../common/gridFilter';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { ApiErrorHandlerService } from '../common/api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class HODService {

  lecture: HODModel;
  onHODManagementChanged: BehaviorSubject<any>;
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar,private _errorHandling: ApiErrorHandlerService, private _navigationTypeService: NavigationService, private _navigationService: NavigationMockApi
  ) {
    this.onHODManagementChanged = new BehaviorSubject([]);
  }

  /**
   * Get student Grid
   *
   * @returns {Observable<any>}
   */
  getHODForGrid(_gridFilter: GridFilter): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/hod/grid`, { ..._gridFilter }, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  /**
         * Get lecture by Id
         *
         * @returns {Promise<any>}
         */

  getLectureDetailsById(id): Promise<HODModel> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('userId', id);
      this._httpClient.get(`${environment.apiURL}/hod/get-by-id`, { params })
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
  createLecture(lecture: HODModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/hod/create`, { ...lecture })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onHODManagementChanged.next(this.lecture);
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
  updateLecturer(lecturer: HODModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/hod/update`, { ...lecturer })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onHODManagementChanged.next(this.lecture);
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
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-qbanktypes/${qbankCategory}`, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
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
    return this._httpClient.get<any>(`${environment.apiURL}/course/courseyear`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getCourseYearName(guid) {
    return this._httpClient.get(`${environment.apiURL}/course/courseyear-by-guid?courseYearId=${guid}`, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

  cousreList(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/list`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getDesignation(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/designations`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getSubjectbyAcademicYear(guid): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects/academicyear/${guid}`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getSubjects(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  /**
    * Delete Student
    *
    * @param user
    */
  deleteLecture(userId): Promise<any> {

    return new Promise(() => {
      const params = new HttpParams().set('userId', userId);

      this._httpClient.post(`${environment.apiURL}/hod/delete`, {}, { params, })
        .subscribe(response => {
          if (response) {
            this.onHODManagementChanged.next(this.lecture);
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
    return this._httpClient.post<any>(`${environment.apiURL}/lecturer/exam-summary-grid`, { ..._gridFilter }, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  lecturereQbankSummary(userId): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/qbank-summary/${userId}`, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  bulkUploadHOD(data: any[]): Promise<any> {
    var self = this;
    console.log(JSON.stringify(data))
    return new Promise((resolve, reject) => {

      this._httpClient.post(`${environment.apiURL}/hod/bulk-create`, [...data])
        .subscribe((response: any) => {
          this.openSnackBar(response, "Close");
          resolve(response);
        }, reject);
    });
  }
}
