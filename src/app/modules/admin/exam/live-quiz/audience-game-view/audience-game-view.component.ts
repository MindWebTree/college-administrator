import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
// import { colorCodes, Choice } from '../live-quiz.model';
import { colorCodes, CountdownTimer, Choice, AppQuestionsResponse, AppReportRequest, ExamStatus, QuestionDetailMockTest, QuestionStatus, UserTestResult } from '../live-quiz.model';
import { connect, getInstanceByDom } from 'echarts';
import { FuseSplashScreenService } from '@fuse/services/splash-screen';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
// import { CoundownSplashScreenService } from 'app/add-on/coundown-splash-screen';
import { WebsocketService } from '../websocket.service';
import { helperService } from 'app/core/auth/helper';
import { Subscription } from 'rxjs';
import { AppSyncService } from '../app-sync.service';
import { StudentService } from '../student.service';
import { ApiErrorHandlerService } from 'app/modules/admin/common/api-error-handler.service';
import { CoundownSplashScreenService } from '../splash-screen.service';
import { LiveQuizExamService } from '../live-quiz.service';

@Component({
  selector: 'app-audience-game-view',
  standalone: true,
  imports: [],
  templateUrl: './audience-game-view.component.html',
  styleUrl: './audience-game-view.component.scss'
})
export class AudienceGameViewComponent implements OnInit {

  userName = 'default user';
  interval;

  // userAccount: UserAccount;
  userAccount: any;
  keyPreFix: string;

  type: any;
  typeID: any;
  examID: any;
  questionSet: any;

  appQuestionsResponse: AppQuestionsResponse;
  questions: Array<QuestionDetailMockTest>;

  question: QuestionDetailMockTest;
  currentQuestion: QuestionDetailMockTest;
  questionLength: number;
  EXAM_TYPE: number = 0;
  QUESTION_TYPE: number = 0;

  @Input() timeInSeconds: number;
  timer: CountdownTimer;
  timeControl: any;

  @Input() overTimeInSeconds: number;
  overTimer: CountdownTimer;
  overTimeControl: any;

  @ViewChild('dialogContent', { static: true })
  dialogContent: TemplateRef<any>;
  dialogRef: any;

  instructionPopup: FormGroup;
  examConfig: any;
  isSubmitted: boolean = false;
  isCorrect: boolean;
  hasStarted: boolean;
  isShowLeaderboard: boolean;
  isChecked: boolean = false;
  optionDetailID: number = 0;
  optionScore: number = 0;

  SlideTimeOut: number;
  showTimer: boolean;

  timeOut: boolean;
  AppTestReportAnalysis: any;
  owSubjectOptions: any;
  view: any[] = [700, 400];
  subjectwiseReport: UserTestResult;
  hasAudienceReport: boolean = false;
  options: any;
  colorScheme = {
      domain: []
  };
  TotalAudience: number;
  tempQuestion: QuestionDetailMockTest;
  public openSubscription: Subscription;
  public openwebsoketSubscription: Subscription;
  YourLeaderBoard:any = {};
  SumOfActualScore: number = 0;
  ExamTitle: string = "";
  SumOfPlayers: number = 0;
  presence$;
  Examstatus: any;
  private subscription?: Subscription;
  @HostListener('window:keyup', ['$event']) keyEvent(e: KeyboardEvent) {
      if (e.key == 'PrintScreen' || e.key == '44') {
          navigator.clipboard.writeText('');
          alert('Screenshots disabled!');
      }
   };
  @Input() uid;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild(AudienceGameViewComponent, { static: false }) ngxGlide: AudienceGameViewComponent;
  /**
   * Constructor
   *
   * @param {FuseNavigationService} _unisunSidebarService
   */
  constructor(
      private _unisunSidebarService: FuseNavigationService,
      private _route: ActivatedRoute,
      public _matDialog: MatDialog,
      private _changeDetectorRef: ChangeDetectorRef,
      private _coundownSplashScreenService: CoundownSplashScreenService,
      private flashBarLoading: FuseSplashScreenService,
      private _liveQuizExamService: LiveQuizExamService,
      private errorhandling: ApiErrorHandlerService,
      private websocketService: WebsocketService,
      private appSyncService: AppSyncService,
      private _studentService: StudentService,
      private _helperService: helperService,
      @Inject(DOCUMENT) private _document: any
  ) {
      this.userAccount = this._helperService.getUserDetail();
      this.uid = this.userAccount.Email;
      this._studentService.getProfile().subscribe((res:any)=>{
          this.userAccount.Name = res.firstName + res.lastName;
          this.userAccount.fullName = res.firstName + res.lastName;
      })
  

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
      this._unisunSidebarService.getNavigation(name);
  }

  ngOnInit(): void {
      this._liveQuizExamService.updateHeaderClass('data-div');
      var self = this;

      self._route.params.subscribe(function (parram) {

          self.type = 'LiveQuiz';
          self.typeID = 0;
          self.examID = parram.qbankID;
          self.questionSet = parram.questionid;

          self.keyPreFix = self.type + "-" + self.typeID + "-" + self.examID;
          // self.websocketService.connect(`wss://0z5q2gdiib.execute-api.ap-south-1.amazonaws.com/User?examId=${self.examID}`);
          // self.openwebsoketSubscription = self.websocketService.openSubject.subscribe(res => {
          //     self.handleVisibilityChange("online");
          // })
      });

      // self.openSubscription = self.websocketService.onMessage()
      //     .subscribe((question: string) => {
      //         this.getExamConfig(JSON.parse(question));
      //     });
      this.subscription = this.appSyncService.subscribeToLiveQuizUpdates(this.examID, this.examID)
      .subscribe({
        next: (update) => {
          this.getExamConfig(update);
        },
        error: (error) => {
          console.error('Subscription error:', error);
        }
      });

  }
  //for update user exam status 
  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event) {
      var self = this;
      if (document.visibilityState === 'hidden') {
          self.Examstatus = "away";
          self.handleVisibilityChange(self.Examstatus);
      } else {
          self.Examstatus = "online";
          self.handleVisibilityChange(self.Examstatus);
      }
  }

  handleVisibilityChange(examstatus: string) {
      var self = this;
      const req = {
          ExamID: self.examID,
          Email: self.userAccount.Email,
          UserName: self.userAccount.fullName,
          Mobile: self.userAccount.Mobile,
          Colleage: '',
          Userstatus: examstatus
      };
      // self._liveQuizExamService.SaveUserDetail(req).then(res => {
      // }, (error) => {
      //     self.errorhandling.handleError(error);
      // });
  }
  ngAfterViewInit(): void {
      //this.updateAudianceConfig(true);
  }

  getResultQuestion(response) {
      var self = this;
      // debugger

      let options = [];

      response.Choices.forEach(element => {
          options.push({ value: element.PollPercentage.toFixed(0), name: element.ChoiceText },);

          if (element.IsCorrect) {
              this.colorScheme.domain.push('#34a361');
          }
          else {
              this.colorScheme.domain.push('#e05f52');
          }

      });
      self.options = {

          tooltip: {
              trigger: 'item'
          },
          legend: {
              orient: 'vertical',
              left: 'left'
          },
          series: [
              {
                  name: '',
                  type: 'pie',
                  radius: '30%',
                  data: options,
                  emphasis: {
                      itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                  },
                  tooltip: {
                      formatter: function (params) { return params.name + " " + params.value + "%"; }
                  },
              }
          ]
      };

      setTimeout(() => {
          const chartElement1 = document.getElementById('chart1') as HTMLDivElement | null;
          const chart1 = getInstanceByDom(chartElement1);
          connect([chart1]);
      });
  }


  SaveAndContinue() {

      var self = this;

      if (self.question) {
          let q = self.question;
          let status = 0;
          if (self.question.QuestionType == 1 || self.question.QuestionType == 2) {
              status = self.question.Choices.filter(item => item.IsChecked).length == 0 ?
                  QuestionStatus.NOT_ANSWERED : QuestionStatus.ANSWERED
          }
          else if (self.question.QuestionType == 3) {
              status = (self.question.Choices.length == self.question.Choices.filter(item => item.MatchedValue != null).length) ?
                  QuestionStatus.ANSWERED : QuestionStatus.NOT_ANSWERED
          }
          //dynoDb....
          var req = {
              ExamID: self.examID,
              UserID: self.userAccount.Id,
              QuestionDetailID: q.QuestionDetailId.toString(),
              optionDetailID: self.optionDetailID,
              Score: self.isCorrect ? q.Mark : 0,
              Correct: self.isCorrect ? 1 : 0,
              Wrong: !self.isCorrect ? 1 : 0,
              SumOfActualScore: self.SumOfActualScore,
              ExamidUserid: self.examID + '-' + self.userAccount.Id, //// This field Added beacause we need to add multilpe data in answer-sheet Db 
          };
          self._liveQuizExamService.SaveQuestion(req, this.userAccount).then(() => {

              self._changeDetectorRef.detectChanges();
          }, (error) => {
              self.isSubmitted = false;
              this.errorhandling.handleError(error);
          });

      }
  }


  Clear() {
      var self = this;
      if (self.question) {
          self.question.Choices.forEach(element => {
              element.IsChecked = false;
              element.MatchedValue = null;
          });
      }
      self.isChecked = false;
      self.isCorrect = false;
      self.isSubmitted = false;
  }

  SetChoiceSelection(el: Choice, $event) {
      var self = this;
      if (self.question.QuestionType == 1 || self.question.QuestionType == 2) {
          if ($event.checked) {
              el.IsChecked = true;
          }
          else {
              el.IsChecked = false;
          }

          if (self.question.QuestionType == 1) {
              self.question.Choices.forEach(element => {
                  element.IsChecked = false;
              });

          }
          self.optionDetailID = 0;
          self.question.Choices.forEach(element => {

              if (element.ChoiceText == el.ChoiceText) {
                  if ($event.checked) {
                      element.IsChecked = true;
                      self.isCorrect = element.IsCorrect;
                  }
                  else {
                      element.IsChecked = false;
                  }

                  self.optionDetailID = element.ChoiceId;
              }
          });
      }
      else if (self.question.QuestionType == 3) {

          self.question.Choices.forEach(element => {
              if (element.ChoiceText == el.ChoiceText) {
                  element.MatchedValue = $event.value;
              }
          });
      }

      if (self.question.Choices.filter(r => r.IsChecked).length > 0) {
          self.isChecked = true;
      } else {
          self.isChecked = false;
      }
      self._changeDetectorRef.detectChanges();
  }
  Submit() {
      this.isSubmitted = true;
      this.SaveAndContinue();

      this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
  
      this.SmallonTimesUp();
      //this.updateAudianceConfig(false);
      // this.openSubscription.unsubscribe();
      // this.openwebsoketSubscription.unsubscribe();
      this.handleVisibilityChange("offline");
      // this.websocketService.close();
      this._liveQuizExamService.updateHeaderClass('');
      this.subscription.unsubscribe();
      // this._presenceService.updateOnDisconnect(this.examID);
  }

  getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }
  getExamConfig(response) {
      var self = this;
      self._route.params.subscribe(function (parram) {
          self.examID = parram.qbankID;
      });
      // self.isSubmitted = false;
      try {

          // this._angularFirestore.collection(`live-quiz`).doc(self.examID).valueChanges().subscribe((response: any) => {
          this.examConfig = response;
          self.showTimer = true;
       
          let config = self.examConfig;

          if (config) {
              window.scroll({
                  top: 0,
                  behavior: 'smooth' 
              });

              let timeOut = this.SlideTimeOut = config.SlideTimeOut;
              this.S_timeLeft = config.SlideTimeOut
              // console.log(config)
              self.hasStarted = config.Status == 2 ? true : false;
              self.isShowLeaderboard = config.Status == ExamStatus.COMPLETED;
              //self.hasStarted = (config.Status != ExamStatus.STOPPED) && (config.Status != ExamStatus.NOT_START);
              self.TotalAudience = config.TotalAudience != null ? config.TotalAudience : 0;
              self.hasAudienceReport = config.hasAudienceReport;
              self.SumOfActualScore = config.SumOfScore;
              self.ExamTitle = config.Title;
          
             
              // console.log(timeOut)
              const currentQuestion = JSON.parse(config.CurrentQuestion);
              if (self.tempQuestion == undefined || self.tempQuestion.QueueID != currentQuestion.QueueID) {
                  // self.SmalltriggerCountdown(timeOut);
                  self.isChecked = false; 
                  self.isCorrect = false;
                  self.isSubmitted = false;
                  self.tempQuestion = self.question = currentQuestion;
                  
              }
        
              if (self.isShowLeaderboard) {
                  self.question = undefined;
                  self.getLeaderboard();
              }

              else if (self.hasAudienceReport) {
                  var requestQ = {
                      ExamID: self.examID,
                      QuestionDetailID: self.question.QuestionDetailId,
                      UserID: self.userAccount.Id
                  };

                  if (!self.isSubmitted) {
                      self.Clear();
                  }
                  self._liveQuizExamService.getSavedUserQuestionResult(requestQ, self.question).then(resposne => {
                      self.question = resposne;
                      self.SmallonTimesUp();
                      self.getResultQuestion(self.question);
                      self.isChecked = false;
                      self.isCorrect = false;
                      this.S_timeLeft = 0;
                      self.isSubmitted = false;
                      self.tempQuestion = self.question;
                      self._changeDetectorRef.detectChanges();
                  }, (error) => {
                      this.errorhandling.handleError(error);
                  });

              } else {
                  if (self.hasStarted) {
                      // self.SmalltriggerCountdown(timeOut);
                      
                      self._coundownSplashScreenService.show();
                      // window.scrollTo(0, 0);
                      self._changeDetectorRef.markForCheck();
                  }
                  else{
                      self.SmallonTimesUp();
                      self.tempQuestion=undefined;
                  }

              }

          }
      }
      catch (e) {
          self.hasStarted = false;
          self.isChecked = false;
          self.isCorrect = false;
          self.isSubmitted = false;
      }

  }


  FULL_DASH_ARRAY = 283;
  WARNING_THRESHOLD = 10;
  ALERT_THRESHOLD = 5;

  COLOR_CODES = {
      info: {
          color: "green"
      },
      warning: {
          color: "orange",
          threshold: this.WARNING_THRESHOLD
      },
      alert: {
          color: "red",
          threshold: this.ALERT_THRESHOLD
      }
  };

  S_TIME_LIMIT: 0;
  S_timePassed: any;
  S_timeLeft: any;
  S_timerInterval: any;
  S_remainingPathColor: string;
  // SmalltriggerCountdown(SlideTimeOut) {
  //     this.S_TIME_LIMIT = SlideTimeOut;
  //     this.S_timePassed = 0;
  //     this.S_timeLeft = this.S_TIME_LIMIT;
  //     this.S_remainingPathColor = this.COLOR_CODES.info.color;
  //     this.SmallcountStartTimer();

  // }

  SmallonTimesUp() {
      // if (this.S_timerInterval) {
      //     clearInterval(this.S_timerInterval);
      //     this.S_timerInterval = null;
      // }
  }

  // SmallonTimesUp() {
  //     clearInterval(this.S_timerInterval);
  // }

  // SmallcountStartTimer() {
  //     this.showTimer = true;
  //     this.S_timerInterval = setInterval(() => {
  //         this.S_timePassed = this.S_timePassed += 1;
  //         this.S_timeLeft = this.S_TIME_LIMIT - this.S_timePassed;
  //         if (this.S_timeLeft > 0)
  //             this.setRemainingPathColor(this.S_timeLeft);


  //         if (this.S_timeLeft === 0) {
  //             this.SmallonTimesUp();
  //             this.showTimer = false;
  //             if (this._document.getElementById("small-countdown-loading-bar") != null)
  //                 this._document.getElementById("small-countdown-loading-bar").style.display = "none";
  //             this._changeDetectorRef.detectChanges();
  //         }
  //         else {
  //             if (this._document.getElementById("small-countdown-loading-bar") != null)
  //                 this._document.getElementById("small-countdown-loading-bar").style.display = "flex";
  //         }

  //     }, 1000);
  // }

  // SmallcountStartTimer() {
  //     this.showTimer = true;
  //     this.SmallonTimesUp(); // Ensure any existing timer is cleared
  //     this.S_timerInterval = setInterval(() => {
  //         this.S_timePassed += 1;
  //         this.S_timeLeft = this.S_TIME_LIMIT - this.S_timePassed;
          
  //         if (this.S_timeLeft > 0) {
  //             this.setRemainingPathColor(this.S_timeLeft);
  //         }
  
  //         if (this.S_timeLeft === 0) {
  //             this.SmallonTimesUp();
  //             this.showTimer = false;
  //             if (this._document.getElementById("small-countdown-loading-bar") != null) {
  //                 this._document.getElementById("small-countdown-loading-bar").style.display = "none";
  //             }
  //             this._changeDetectorRef.detectChanges();
  //         } else {
  //             if (this._document.getElementById("small-countdown-loading-bar") != null) {
  //                 this._document.getElementById("small-countdown-loading-bar").style.display = "flex";
  //             }
  //         }
  //     }, 1000);
  // }
  formatTime(time) {
      // const minutes = Math.floor(time / 60);
      // let seconds = time % 60;
      // let secondsText = `${seconds}`;
      // if (seconds < 10) {
      //     secondsText = `0${seconds}`;
      // }
      return time
      // return `${minutes}:${secondsText}`;
  }

  setRemainingPathColor(timeLeft) {
      const { alert, warning, info } = this.COLOR_CODES;
      if (this._document
          .getElementById("s-base-timer-path-remaining") != null)
          if (timeLeft <= alert.threshold) {
              this._document
                  .getElementById("s-base-timer-path-remaining")
                  .classList.remove(warning.color);
              this._document
                  .getElementById("s-base-timer-path-remaining")
                  .classList.add(alert.color);
          } else if (timeLeft <= warning.threshold) {
              this._document
                  .getElementById("s-base-timer-path-remaining")
                  .classList.remove(info.color);
              this._document
                  .getElementById("s-base-timer-path-remaining")
                  .classList.add(warning.color);
          }
  }

  calculateTimeFraction(timeLeft, TIME_LIMIT) {
      const rawTimeFraction = timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
  }

  setCircleDasharray(timeLeft, TIME_LIMIT) {
      const circleDasharray = `${(
          this.calculateTimeFraction(timeLeft, TIME_LIMIT) * this.FULL_DASH_ARRAY
      ).toFixed(0)} 283`;
      this._document
          .getElementById("s-base-timer-path-remaining") && this._document
              .getElementById("s-base-timer-path-remaining")
              .setAttribute("stroke-dasharray", circleDasharray);
  }

  /* Leaderboard */
  getLeaderboard() {
      var self = this;
      self.flashBarLoading.show();
      self.type = 'LiveQuiz';
      self.typeID = 0;
      self.examID = self.examID;
      self.keyPreFix = self.type + "-" + self.typeID + "-" + self.examID;
      let request: AppReportRequest = {
          Type: 9,
          TypeID: self.typeID,
          ExamID: self.examID,
      };

      try {
          //dynoDB...
          self._liveQuizExamService.getLeaderBoardResult(request).then((result) => {
              if (result && result.length > 0) {

                  var LeaderBoard = [];

                  var rank = 1;
                  var sortedArray = result.sort((n1, n2) => {
                      if (n1.Score > n2.Score) {
                          return -1;
                      }

                      if (n1.Score < n2.Score) {
                          return 1;
                      }

                      return 0;
                  });


                  sortedArray.forEach((element) => {

                      var user = {
                          Name: element.UserName,
                          Email: element.Email,
                          Score: element.Score,
                          RankPosition: rank,
                          Wrong: element.Wrong,
                          Correct: element.Correct,
                          PercentageOfScore: element.PercentageOfScore,
                          ColorCode: this.getColorCode(rank, element.PercentageOfScore)
                      };

                      LeaderBoard.push(user);
                      rank++;
                  });

                  self.AppTestReportAnalysis = LeaderBoard;
                  self.YourLeaderBoard = self.AppTestReportAnalysis.find(r => r.Email == self.userAccount.Email);
                  self.SumOfPlayers = self.AppTestReportAnalysis.length;
                  self.isShowLeaderboard = true;
                  self.flashBarLoading.hide();
                  self._changeDetectorRef.detectChanges();
                  let saveRankreq= {
                      livequizId: self.examID,
                      rank: self.YourLeaderBoard.RankPosition
                  }
                  self._liveQuizExamService.saveUserRank(saveRankreq).then(res=>{

                  })
              }
              else {
                  self.AppTestReportAnalysis = [];
                  self.SumOfPlayers = self.AppTestReportAnalysis.length;
                  self.isShowLeaderboard = true;
                  self.flashBarLoading.hide();
                  self._changeDetectorRef.detectChanges();
              }
          }, (error) => {
              this.errorhandling.handleError(error);
          })
      }
      catch (e) {
          this.getLeaderboard();
      }

  }
  getColorCode(rank: number, percentage: number): string {
      percentage = 100 - percentage;
      var obj = colorCodes.find(c => c.rank == rank);

      if (obj === null || obj === undefined) {

          obj = colorCodes.find(c => percentage >= c.min && percentage < c.max);
          if (obj === null || obj === undefined) {
          }

      }
      return (obj === null || obj === undefined) ? '#fff' : obj.colorcode;
  }

}
