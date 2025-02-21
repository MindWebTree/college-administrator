import { formatDate } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SitePreference } from 'app/core/config/app.config';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { LiveQuiz } from '../Models/live-quiz/live-quiz';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  LiveQuizGrid } from '../Models/commonModels/commonModel';
import { QuestionSet } from '../Models/live-quiz/qbank';
import { QuestionDetailMockTest } from '../Models/live-quiz/game-view';

@Injectable({
    providedIn: 'root'
})
export class LiveQuizExamService {
    getQuestionByQid(QuestionSetID: any, questionDetailID: any, TrnExamActID: any) {
        throw new Error('Method not implemented.');
    }
    onLiveQuizChanged: BehaviorSubject<any>;
    onQuestionSetChanged: BehaviorSubject<any>;
    exam: LiveQuiz[];
    user: any;
    selectedLiveQuiz: string[] = [];
    qbank: QuestionSet[];
    searchText: string;
    questions: Array<QuestionDetailMockTest>;
    filterBy: string;
    liveQuizHeaderClass = new BehaviorSubject<string>('');
    openSnackBar(message: string, action: string) {
        this._matSnockbar.open(message, action, {
            duration: 2000,
        });
    }
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _matSnockbar: MatSnackBar,
        @Inject(LOCALE_ID) public locale: string

    ) {
        // Set the defaults
        this.onLiveQuizChanged = new BehaviorSubject([]);
        this.onQuestionSetChanged = new BehaviorSubject([]);
    }
    updateHeaderClass(cssClass: string) {
        this.liveQuizHeaderClass.next(cssClass);
      }
    

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} exam
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, exam: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            let gridFilter: LiveQuizGrid = {
                PageNumber: 0,
                PageSize: SitePreference.PAGE.GridRowViewCount,
                Search: '',
                SortBy: '',
                SortOrder: '',
                userId: ''
            };
            Promise.all([
                this.getLiveQuizForGrid(gridFilter)
            ]).then(
                ([files]) => {

                    resolve(null);

                },
                reject
            );
        });
    }
    // getQuestions(request: AppQuestionsRequest): Promise<AppQuestionsResponse> {
    //     var self = this;
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.post(`${environment.apiURL}/api/user/get-questions/`, { ...request })
    //             .subscribe((response: any) => {
    //                 self.questions = response.Data;
    //                 resolve(response.Data);
    //             }, reject);
    //     });
    // }

    getQuestions(id): Promise<any> {
        
        let params = new HttpParams();
        params = params.append('guid', id.toString());
        return this._httpClient.get(`${environment.apiURL}/livequiz/questions`, { params })
        .toPromise()
            .then((response: any) => {
                return response; // Return the response to the caller
            })
            .catch(error => {
                throw error; // Rethrow the error for the caller to handle
            });
            
    }
    /**
     * Get exam
     *
     * @returns {Promise<any>}
     */
    getLiveQuiz(search: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiURL}/live-quiz/get-live-quiz/`)
                .subscribe((response: any) => {

                    this.exam = response;
                    resolve(this.exam);
                }, reject);
        }
        );
    }
    /**
     * Get exam
     *
     * @returns {Promise<any>}
     */
    getLiveQuizForGrid(_gridFilter: LiveQuizGrid): Observable<any> {

        return this._httpClient.post(`${environment.apiURL}/livequiz/list`, { ..._gridFilter });
    }

    /**
     * Update exam
     *
     * @param exam
     * @returns {Promise<any>}
     */
    createLiveQuiz(exam: any): Promise<any> {
        let self = this;
        return new Promise((resolve, reject) => {

            exam.WhenAt = formatDate(exam.WhenAt.toString()
                , 'yyyy-MM-dd hh:mm:ss', self.locale);



            this._httpClient.post(`${environment.apiURL}/livequiz/create-update/`, { ...exam })
                .subscribe(response => {
                    if (response) {
                        // this.openSnackBar("Successfully added.", "Close");
                        resolve(response);
                    }
                    else {
                        this.openSnackBar("Failed", "Close");
                    }
                });
        });
    }

    /**
     * Update exam
     *      
     * @param exam
     * @returns {Promise<any>}
     */
    CreateupdateLiveQuiz(exam: any): Observable<any> {
        return  this._httpClient.post<any>(`${environment.apiURL}/livequiz/create-update/`, { ...exam })
    }

    /**
     * Delete exam
     *
     * @param exam
     */
    // deleteLiveQuiz(exam): Promise<any> {
    //     return new Promise((resolve, reject) => {

    //         this._httpClient.delete(`${environment.apiURL}/live-quiz/delete-live-quiz/` + exam.LiveQuizID, {})
    //             .subscribe(response => {
    //                 if (response) {
    //                     resolve(response);
    //                     this.openSnackBar("Successfully removed.", "Close");
    //                 }
    //                 else {
    //                     this.openSnackBar("Failed", "Close");
    //                 }
    //             });
    //     });
    // }
    deleteLiveQuiz(id): Promise<any> {
        
        let params = new HttpParams();
        params = params.append('guid', id.toString());
        return this._httpClient.delete(`${environment.apiURL}/livequiz/delete`, { params })
        .toPromise()
            .then((response: any) => {
                return response; // Return the response to the caller
            })
            .catch(error => {
                throw error; // Rethrow the error for the caller to handle
            });
            
    }
    /**
     * Get Choice Type
     *
     * @returns {Promise<any>}
     */
    getChoiceType(): Promise<any> {
        var self = this;

        return new Promise((resolve, reject) => {

            resolve([
                {
                    'Key': 1,
                    'Value': 'Single',
                },
                {
                    'Key': 2,
                    'Value': 'Multiple',
                },
                {
                    'Key': 3,
                    'Value': 'Various',
                }
            ])
        });
    }

    /**
     * Get Score Type
     *
     * @returns {Promise<any>}
     */
    getScoreType(): Promise<any> {
        return new Promise((resolve, reject) => {


            resolve([
                {
                    'Key': 1,
                    'Value': 'REGULARE',
                },
                {
                    'Key': 2,
                    'Value': 'PGI',
                },
                {
                    'Key': 3,
                    'Value': 'AIIMS',
                }
            ]);

        });

    }

    /**
     * Update exam
     *
     * @param exam
     * @returns {Promise<any>}
     */
    updateLiveQuizStatus(exam): Promise<any> {
        // exam.LiveQuizID = exam.ExamID;
        return new Promise((resolve, reject) => {

            this._httpClient.post(`${environment.apiURL}/livequiz/update-status/`, { ...exam })
                .subscribe(response => {
                });
        });
    }

    getQuestionSet(): Promise<QuestionSet[]> {
        return new Promise((resolve, reject) => {
            this._httpClient.get(`${environment.apiURL}/predefinedexam/question-sets`)
                .subscribe((response: any) => {

                    this.qbank = response;

                    this.onQuestionSetChanged.next(this.qbank);
                    resolve(this.qbank);
                }, reject);
        }
        );




    }

    saveUserRank(request: any): Promise<any> {
        const params = new HttpParams()
            .set('livequizId', request.livequizId)
            .set('rank', request.rank);
    
        return new Promise((resolve, reject) => {
            this._httpClient.post(`${environment.apiURL}/livequiz/save-user-rank`, null, { params }).subscribe(
                response => {
                    resolve(response);
                },
                error => {
                    reject(error);
                }
            );
        });
    }
 

    //dynodb
    //get Question result on admin game view 
    getSavedUserQuestionResult(request, question: QuestionDetailMockTest): Promise<any> {
        return new Promise((resolve, reject) => {
            // debugger
            var self = this;
            let params = new HttpParams();
            params = params.append('ExamID', request.ExamID);
            params = params.append('QuestionDetailID', request.QuestionDetailID.toString());
            this._httpClient.get(`${environment.dynmoDB}/answer-sheet`, { params })
                .subscribe((response: any[]) => {
                    var data = [];
                    response.forEach(detail => {
                        data.push(detail)
                    })
                    var sumOfCount = 0;
                    question.Choices.forEach(function (doc) {
                        doc.PollCount = data.filter(ch => ch.optionDetailID == doc.ChoiceId).length;
                        sumOfCount += doc.PollCount;
                            if (data.filter(ch =>(ch.ExamID+'-'+ch.UserID)===(request.ExamID+'-'+request.UserID) && ch.optionDetailID == doc.ChoiceId && ch.UserID == request.UserID).length > 0) {
                                doc.IsChecked = true;
                       
                        }
                       
                    });
                    question.Choices.forEach(function (doc) {
                        doc.PollPercentage = self.GetCalculatePercentage(doc.PollCount, sumOfCount);
                    });
                    resolve(question);
                }, reject);
        });
    }

    GetCalculatePercentage(minValue: number, maxValue: number) {

        if (maxValue <= 0)
            return 0;
        else
            return parseFloat(((minValue / maxValue) * 100).toFixed(2));
    }
//get Leaderboard
getLeaderBoardResult(request: any): Promise<any> {
    let params = new HttpParams();
    params = params.append('ExamID', request.ExamID.toString());
    return new Promise((resolve, reject) => {
        return this._httpClient.get(`${environment.dynmoDB}/leaderboard`, { params }).subscribe(response=>{
            if(response){
                resolve(response)
            }
        },reject)
    });
}
//get question details for report 
getquestionlivequiz(id): Promise<any> {
        
    let params = new HttpParams();
    params = params.append('ExamID', id.toString());
    params = params.append('TitleExamID', id.toString());

    return this._httpClient.get(`${environment.dynmoDB}/live-quiz`, { params })
    .toPromise()
        .then((response: any) => {
            console.log(response,"")
            return response; // Return the response to the caller
        })
        .catch(error => {
            throw error; // Rethrow the error for the caller to handle
        });
        
}
//ansewesheet
getAnswerredSheetResult(request: any, questions: QuestionDetailMockTest[]): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
        let params = new HttpParams();
        // params = params.append('ExamidUserid', request.ExamID + '-' + request.UserID.toString());
         params = params.append('ExamID', request.ExamID.toString());
        return this._httpClient.get(`${environment.dynmoDB}/answer-sheet`, { params }).subscribe((resp:any[])=>{
            if(resp){
                var data = [];
                var questionsResult = [];
                resp.forEach(details=>{
                    data.push(details);
                });
                questions.forEach(question => {
                    var sumOfCount = 0;
                    question.Choices.forEach(function (doc) {
                        doc.PollCount = data.filter(ch => ch.optionDetailID == doc.ChoiceId).length;
                        sumOfCount += doc.PollCount;
                        // if (data.filter(ch => ch.optionDetailID == doc.ChoiceId && ch.UserID == request.UserID).length > 0) {
                        //     doc.IsChecked = true;
                        // }

                        if (data.filter(ch => ch.optionDetailID == doc.ChoiceId && ch.UserID == request.UserID).length > 0) {
                            doc.IsChecked = true;
                        }
                    });

                    question.Choices.forEach(function (doc) {
                        doc.PollPercentage = self.GetCalculatePercentage(doc.PollCount, sumOfCount);
                    });
                    questionsResult.push(question);
                });
                resolve(questionsResult);
            }
        },reject)
    });
}
getquestionlivequizquestion(id): Promise<any> {
    // const params = new HttpParams().set('id', id.toString());
    let params = new HttpParams();
    params = params.append('ExamID', id.toString());
    // params = params.append('Title', id.toString());
    return this._httpClient.get(`${environment.dynmoDB}/live-quiz-question`, { params })
        .toPromise()
        .then((response: any) => {
            return response; // Return the response to the caller
        })
        .catch(error => {
            throw error; // Rethrow the error for the caller to handle
        });
}


pushdatatolivequiz(exam: any): Promise<any> {
    const headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    });

    return new Promise((resolve, reject) => {
        this._httpClient.post(`${environment.dynmoDB}/live-quiz`, { ...exam, headers },)
            .subscribe(response => {
                if (response) {
                    // this.openSnackBar("Successfully added.", "Close");
                    resolve(response);
                } else {
                    this.openSnackBar("Failed", "Close");
                }
            });
    });
}

pushdatatolivequizquestion(exam: any): Promise<any> {
    const headers = new HttpHeaders({
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    });
    return new Promise((resolve, reject) => {

        this._httpClient.post(`${environment.dynmoDB}/live-quiz-question`, exam, { headers })
            .subscribe(response => {
                if (response) {
                    // this.openSnackBar("Successfully added.", "Close");
                    resolve(response);
                }
                else {
                    this.openSnackBar("Failed", "Close");
                }
            });
    });
}
SaveQuestion(request: any, userInfo: any): Promise<any> {
    const requestBody = [{ ...request}, {... userInfo }];
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.dynmoDB}/answer-sheet`, requestBody)
        .subscribe((res) => {
          resolve(res)
        }, reject);
      // this.calcuateSavedUserScore(request, userInfo);
    });
  }
calcuateSavedUserScore(request, userInfo): Promise<any> {
    return new Promise((resolve, reject) => {
        let params = new HttpParams();
        params = params.append('ExamidUserid', request.ExamID + '-' + request.UserID.toString());
        return this._httpClient.get(`${environment.dynmoDB}/answer-sheet`, { params })
            .subscribe((response: any[]) => {
                    var data = [];
                    response.forEach(details => {
                        data.push(details);
                    });
                    var sumOfCount = 0;
                    var sumOfCorrect = 0;
                    var sumOfWrong = 0;

                    data.forEach(function (doc) {
                        sumOfCount += doc.Score;
                        sumOfCorrect += doc.Correct;
                        sumOfWrong += doc.Wrong;
                    });

                // this.setScorePresence(userInfo, request.ExamID, sumOfCount, sumOfCorrect, sumOfWrong, request.SumOfActualScore);

        
            }, reject);
    });
}
setScorePresence(userInfo: any, ExamID, score: number, Correct: number, Wrong: number, SumOfActualScore: number) {
    
    let data: any = {
        UserID: userInfo.Id.toString(),
        ExamID: ExamID,
        UserName: userInfo.fullName,
        Email: userInfo.Email,
        Mobile: userInfo.Mobile,
        College: userInfo.College,
        Correct: Correct,
        Wrong: Wrong,
        Score: score,
        PercentageOfScore: (score / SumOfActualScore) * 100
    }
    return new Promise((resolve, reject) => {

        this._httpClient.post(`${environment.dynmoDB}/leaderboard`, { ...data })
            .subscribe(response => {
                if (response) {
                    // this.openSnackBar("Successfully added.", "Close");
                    resolve(response);
                }
                else {
                    this.openSnackBar("Failed", "Close");
                }
            }, reject);
    });

}
updatedatatolivequiz(exam: any): Promise<any> {
    return new Promise((resolve, reject) => {

        this._httpClient.patch(`${environment.dynmoDB}/live-quiz`, { ...exam })
            .subscribe(response => {
                if (response) {
                    // this.openSnackBar("Successfully added.", "Close");
                    resolve(response);
                }
                else {
                    this.openSnackBar("Failed", "Close");
                }
            },reject);
    });
}
SaveUserDetail(request: any): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient.post(`${environment.dynmoDB}/status`, { ...request })
            .subscribe((res) => {
                resolve(res);
            },reject);
    });
}
getUserDetails(id): Promise<any> {
    let params = new HttpParams();
    params = params.append('ExamID', id.toString());
    return this._httpClient.get(`${environment.dynmoDB}/status`, { params })
        .toPromise()
        .then((response: any) => {
            return response; // Return the response to the caller
        })
        .catch(error => {
            throw error; // Rethrow the error for the caller to handle
        });
}
getLiveQuizbyId(id): Promise<any> {
    let params = new HttpParams();
    params = params.append('guid', id.toString());
    return this._httpClient.get(`${environment.apiURL}/livequiz/getlivequizbyid`, { params })
        .toPromise()
        .then((response: any) => {
            return response; // Return the response to the caller
        })
        .catch(error => {
            throw error; // Rethrow the error for the caller to handle
        });
}
}
