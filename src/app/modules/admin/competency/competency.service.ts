import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { studentAnalyticGrid, studentGrid } from '../common/gridFilter';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { studentModel } from '../student-management/student-management.model';
import { competency, competencyGrid, studentCompetecyGrid, StudentGrid } from './competency.model';
import { ApiErrorHandlerService } from '../common/api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {
  student: studentModel;
  onStudentManagementChanged: BehaviorSubject<any>;
  onStudentListChanged: BehaviorSubject<any>;
  onCompletedAssignment: BehaviorSubject<any>;
  onUpcomingAssignment: BehaviorSubject<any>;
  onRubricListChanged: BehaviorSubject<any>;
  onStepsChanged: BehaviorSubject<any>;
  onCriteriaChanged: BehaviorSubject<any>;
  onSubjectGridChanged: BehaviorSubject<any>;
  onCompetencyStudentChanged: BehaviorSubject<any>;
  onHistoryGridChanged: BehaviorSubject<any>;
  onStudentCompetecyGridChanged: BehaviorSubject<any>;

  private titleSubject = new BehaviorSubject<string>('');
  public title$ = this.titleSubject.asObservable();  
  private ModuleTitle = new BehaviorSubject<string>('');
  public Moduletitle$ = this.ModuleTitle.asObservable();

  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  setTitle(newTitle: string) {
    this.titleSubject.next(newTitle);
}
  setModuleTitle(newTitle: string) {
      this.ModuleTitle.next(newTitle);
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar, private _errorHandling: ApiErrorHandlerService, private _navigationTypeService: NavigationService, private _navigationService: NavigationMockApi
  ) {
    this.onStudentManagementChanged = new BehaviorSubject([]);
    this.onRubricListChanged = new BehaviorSubject([]);
    this.onStepsChanged = new BehaviorSubject([]);
    this.onCriteriaChanged = new BehaviorSubject([]);
    this.onStudentListChanged = new BehaviorSubject([]);
    this.onCompletedAssignment = new BehaviorSubject([]);
    this.onUpcomingAssignment = new BehaviorSubject([]);
    this.onSubjectGridChanged = new BehaviorSubject([]);
    this.onCompetencyStudentChanged = new BehaviorSubject([]);
    this.onHistoryGridChanged = new BehaviorSubject([]);
    this.onStudentCompetecyGridChanged = new BehaviorSubject([]);
  }

  /**
   * Get student Grid
   *
   * @returns {Observable<any>}
   */
  getBatch(): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/batch/list/`,{}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getBatchYear(guid): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/batch/batchyears/${guid}`,{}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  createAssignment(req: competency): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/competency/create`, { ...req }).subscribe(res => {
          resolve(res);
      }),
      catchError((error)=>{
        this._errorHandling.handleError(error);
        return throwError(()=> error)
      })

    })
  }
  updateAssignment(req: competency): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/competency/update`, { ...req }).subscribe(res => {
          resolve(res);
      }),
      catchError((error)=>{
        this._errorHandling.handleError(error);
        return throwError(()=> error)
      })

    })
  }
  getAssignmentGrid(req: competencyGrid): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/competency/grid`, { ...req }).subscribe(res => {
        resolve(res);
      }),
      catchError((error)=>{
        this._errorHandling.handleError(error);
        return throwError(()=> error)
      })

    })
  }
  getStudentCompetencyGrid(req: studentCompetecyGrid): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/student/competency-grid`, { ...req }).subscribe(res => {
        resolve(res);
      }),
      catchError((error)=>{
        this._errorHandling.handleError(error);
        return throwError(()=> error)
      })

    })
  }
  getAssignmentbyid(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/competency/get-by-guid/${id}`, { }).subscribe(res => {
        resolve(res);
      }),
      catchError((error)=>{
        this._errorHandling.handleError(error);
        return throwError(()=> error)
      })

    })
  }
  getSubject(guid): Observable<any> {
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
  getRubricConstruction(): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/rubricconstruction/list`, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getFaculty(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/lecturer/list`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getRubricConstructiongird(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/rubricconstruction/list`, { }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getTeams(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/teammanagement/faculty-team`, { ..._gridFilter }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getRubricConstructionbyid(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiURL}/rubricconstruction/get-by-guid/${id}`, { }).subscribe(res => {
        resolve(res);
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })

    })
  }
  createRubricConstruction(rubric: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/create/`, { ...rubric }).pipe(
        catchError(error => {
          if (error.status == 409) {
            this.openSnackBar(error.error, "Close");
            return throwError(error);
          }
          // Handle the error here
        })
      )
        .subscribe(response => {
          if (response) {
            this.onRubricListChanged.next(true);
            this.openSnackBar("Successfully added..", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            resolve(response);
          }

        });
    });
  }
  updateRubricConstruction(rubric: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/update/`, { ...rubric }).pipe(
        catchError(error => {
          if (error.status == 409) {
            this.openSnackBar(error.error, "Close");
            return throwError(error);
          }
          // Handle the error here
        })
      )
        .subscribe(response => {
          if (response) {
            this.onRubricListChanged.next(true);
            this.openSnackBar("Successfully added..", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            resolve(response);
          }

        });
    });
  }
  deleteRubric(guid): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/delete/${guid}`, {})
        .subscribe(response => {
          if (response) {
            this.onRubricListChanged.next(true);
            this.openSnackBar("Successfully removed.", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            reject(response);
          }
        });
    });
  }

  getStepgrid(guid): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/rubricconstruction/get-sections/${guid}`, { }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getStepbyid(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiURL}/rubricconstruction/get-section-by-guid/${id}`, { }).subscribe(res => {
        resolve(res);
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })

    })
  }
  createStep(rubric: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/create-section/`, { ...rubric }).pipe(
        catchError(error => {
          if (error.status == 409) {
            this.openSnackBar(error.error, "Close");
            return throwError(error);
          }
          // Handle the error here
        })
      )
        .subscribe(response => {
          if (response) {
            this.onStepsChanged.next(true);
            this.openSnackBar("Successfully added..", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            resolve(response);
          }

        });
    });
  }
  updateStep(rubric: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/update-section/`, { ...rubric }).pipe(
        catchError(error => {
          if (error.status == 409) {
            this.openSnackBar(error.error, "Close");
            return throwError(error);
          }
          // Handle the error here
        })
      )
        .subscribe(response => {
          if (response) {
            this.onStepsChanged.next(true);
            this.openSnackBar("Successfully added..", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            resolve(response);
          }

        });
    });
  }
  deleteStep(guid): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/delete-section/${guid}`, {})
        .subscribe(response => {
          if (response) {
            this.onStepsChanged.next(true);
            this.openSnackBar("Successfully removed.", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            reject(response);
          }
        });
    });
  }

  getCriteriagrid(guid): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/rubricconstruction/get-criteria-list/${guid}`, { }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getCriteriabyid(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiURL}/rubricconstruction/get-criteria-by-guid/${id}`, { }).subscribe(res => {
        resolve(res);
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })

    })
  }
  createCriteria(rubric: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/create-criteria/`, { ...rubric }).pipe(
        catchError(error => {
          if (error.status == 409) {
            this.openSnackBar(error.error, "Close");
            return throwError(error);
          }
          // Handle the error here
        })
      )
        .subscribe(response => {
          if (response) {
            this.onCriteriaChanged.next(true);
            this.openSnackBar("Successfully added..", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            resolve(response);
          }

        });
    });
  }
  updateCriteria(rubric: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/update-criteria/`, { ...rubric }).pipe(
        catchError(error => {
          if (error.status == 409) {
            this.openSnackBar(error.error, "Close");
            return throwError(error);
          }
          // Handle the error here
        })
      )
        .subscribe(response => {
          if (response) {
            this.onCriteriaChanged.next(true);
            this.openSnackBar("Successfully added..", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            resolve(response);
          }

        });
    });
  }
  deleteCriteria(guid): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/rubricconstruction/delete-criteria/${guid}`, {})
        .subscribe(response => {
          if (response) {
            this.onCriteriaChanged.next(true);
            this.openSnackBar("Successfully removed.", "Close");
            resolve(response);
          }
          else {
            this.openSnackBar("Failed", "Close");
            reject(response);
          }
        });
    });
  }

  getStudentGrid(req: StudentGrid): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/competency/student/grid`, { ...req }).subscribe(res => {
        resolve(res);
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })

    })
  }

  getRubricListbyid(guid): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiURL}/rubricconstruction/detail/get-by-guid/${guid}`, { }).subscribe(res => {
        resolve(res);
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })

    })
  }

  SubmitAssignment(req: any, competencyGuid: string, studentId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/competency/submit/${competencyGuid}/${studentId}`, { ...req })
        .pipe(
          catchError((error) => {
            this._errorHandling.handleError(error);
            reject(error); // Reject the Promise
            return throwError(() => error); // Still return the error to complete observable
          })
        )
        .subscribe({
          next: (res) => resolve(res),
          error: (err) => {
            // Optional: fallback rejection if something slips past catchError
            reject(err);
          }
        });
    });
  }

  getHistoryAssignment(req: any,competencyGuid ,studentId ): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/competency/submission-history/${competencyGuid}/${studentId}`, { ...req }).subscribe(res => {
        resolve(res);
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })

    })
  }


  // grading rules
   getQuestionbyGuid(guid:string): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/rubricconstruction/get-criteria-list/${guid}`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getGradingRules(guid:string): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/rubricconstruction/get-rule?rubriceId=${guid}`,{}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  createGradingRules(rubric: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/rubricconstruction/create-rule`, rubric).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  updateGradingRules(rubric: any): Observable<any> {
    return this._httpClient.patch(`${environment.apiURL}/rubricconstruction/update-rule`, rubric).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

}


