export class ExamList{

    keyword:string ;
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;
    examStatus: number;
    courseYearId?: string
}
export class CreateExam{
    // name:string;
    // description: string;
    // qbankCategory:string;
    // qbankTypeId: number;
    // subjectId: number;
    // topics: Array<number>;
    // cmbeCodes: Array<number>;
    // levelId:number;
    // levelIdOfQuestion:string;
    // noOfQuestions:number;
    // examQuestions:Array<number>;
    // courses:Array<number>;
    // examType:string;
    // examStatus:number;
    // startOn:string;
    // endOn:string;
    // duration:any;
    // shuffleAnswers:boolean;
    // shuffleQuestions:boolean;
    // canUserViewResults:boolean;
    // // Percentage:number;
    // evaluationPeriodRequired:boolean;
    // evaluationCompleteOn:number;
    // certificateProvision: boolean;
    // giftProvision:boolean;

    id: number;
    guid?: string;
    isActive?: boolean;
    mcqCode: string;
    cbmeCodeId: number;
    qBankTypeId: number;
    competencyLevelId: number;
    levelOfQuestionId: number;
    noOfQuestions: number;
    examDuration: number;
    examMode: number;
    subjectId: number;
    topics: [];
    name: string;
    description: string;
    tags: Array<any>;
    configuration: string;
    questions: Array<any>;
    examDate: string;
    examEndDate: string;
    examStatus: number;
    qbankCategoryId: number;
    shuffleAnswer: true;
    shuffleQuestion: true;
    canViewResult: true;
    percentagePassMarks: number;
    evaluationCompleteOn: string;
    noOfStudents: number;
    courses: Array<Course>;
    numberOfAttendees: number;
    averageDuration: number

}
export class Course {
  courseId: number;
  courseYearId: number;
  courseYear: string;
  courseName: string
}

export class Qbank{
    
       name:string;
       id:string;
       userID: number;
       isActive: boolean;
       isDeleted: boolean;
      constructor(qbank){
        this.name=qbank.name;
        this.id=qbank.id;
        this.userID= qbank.userID;
        this.isActive= qbank.isActive;
        this.isDeleted= qbank.isDeleted;

      }
}
export class ReportStudentList{
  
}
export enum ExamStatus {
    All = -1,
    WaitingForApproval = 0,
    New = 1,
    InProgress = 2,
    Completed = 3,
    Cancelled = 4,
    Pause = 5,
  }
