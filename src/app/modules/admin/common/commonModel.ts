export class ExamList {
    ExamName: string;
    Heading: string;
    QuestionTitle: string;
    NumberOfStudents: string;
    Question: string;
    ExamHours: string;
    Course: Array<Course>;
    Subject: Array<Subjects>;
    ExamCreater: string;
    QuestionType: string;
    ExamDate: string;
    constructor(examList) {
        this.ExamName = examList.ExamName;
        this.Heading = examList.Heading;
        this.QuestionTitle = examList.QuestionTitle;
        this.NumberOfStudents = examList.NumberOfStudents;
        this.Question = examList.Question;
        this.ExamHours = examList.ExamHours;
        this.Course = examList.Course;
        this.Subject = examList.Subject;
        this.ExamCreater = examList.ExamCreater;
        this.QuestionType = examList.QuestionType;
        this.ExamDate = examList.ExamDate;
    }

}


export class Subjects {
    id: number;
    qbankTypeID: number;
    subjectName: string;
    isActive: boolean;
    description: string;
    constructor(subject) {
        this.id = subject.id;
        this.qbankTypeID = subject.qbankTypeID;
        this.subjectName = subject.subjectName;
        this.isActive = subject.isActive;
        this.description = subject.description;

    }
}
export class Course {
   title:string;
   subTitle:string;
   description:string;
   noOfQuestions: number;
   nofOfStudents: number;
   id:string;
  count: any;
    constructor(course) {
         {
            this.title=course.title;
            this.subTitle=course.subTitle;
            this.description=course.description;
            this.noOfQuestions=course.noOfQuestions;
            this.nofOfStudents=course.nofOfStudents;
            this.id=course.id;
         }
    }
}


export class QbankType {
    title: string;
    id: number;
    IsActive: boolean;
    OrderNo: number;
    constructor(qbanktype) {
        {
            this.id = qbanktype.id; //|| UnisunUtils.generateGUID();
            this.title = qbanktype.title || '';

        }
    }
}

export class Topic {
    subjectID: number;
    id: number;
    OrderNo: number;
    title: string;
    isDeleted: boolean;
    isActive: boolean;
    // Modules: Array<Module>

    /**
     * Constructor
     *
     * @param topic
     */
    constructor(topic) {
        {
            this.subjectID = topic.subjectID || 0; 
            this.OrderNo = topic.OrderNo || 0;
            this.title = topic.title || '';
            this.id = topic.id || 0;
            this.isDeleted = topic.isDeleted;
            this.isActive = topic.isActive;
            // this.Modules = topic.Modules || '';

        }
    }

    
}
export class QbankcmbCode {
    id: number;
    title: string;
    code: string;
    OrderNo: number;
    noOfQuestionAttempted:number;
    noOfQuestions:number;
    topicId:number;
    description:string;
    examStatus:number;
    constructor(qbankcmbCode) {
        {
        this.id=qbankcmbCode.id;
        this.title=qbankcmbCode.title;
        this.code=qbankcmbCode.code;
        this.OrderNo=qbankcmbCode.OrderNo;
        this.noOfQuestionAttempted=qbankcmbCode.noOfQuestionAttempted;
        this.noOfQuestions=qbankcmbCode.noOfQuestions;
        this.examStatus=qbankcmbCode.examStatus;
this.topicId=qbankcmbCode.topicId;
this.description=qbankcmbCode.description;

        }
    }

    
}
export class CompetenecyLevel  {
    LevelID: number;
    Title: string;
    OrderNo: number;
    constructor(competenecyLevel) {
        {
        this.LevelID=competenecyLevel.LevelID;
        this.Title=competenecyLevel.Title;
        this.OrderNo=competenecyLevel.OrderNo


        }
    }
    
}

export class LevelQuestion  {
    LevelID: number;
    Title: string;
    OrderNo: number;

    constructor(levelQuestion) {
        {
        this.LevelID=levelQuestion.LevelID;
        this.Title=levelQuestion.Title;
        this.OrderNo=levelQuestion.OrderNo


        }
    }
}
export class GridFilter {
    Search: string;
    PageNumber: number;
    PageSize: number;
    SortBy: string;
    SortOrder: string;
}
export class LiveQuizGrid extends GridFilter{
    userId:string;
}
export class StudentFilter {
    pageNumber: number;
    pageSize: number;
    average:number;
    orderBy: string;
    courseId:string;
    sortOrder: string;
    keyword: string;
    averageBy:any
}
export class UserManagement {
    UserID: number;
    UserName: string;
    Password: string;
    Email: string;
    State: string;
    Country: string;
    College: string;
    Mobile: string;
    CategoryOfStudy: string;
    DateOfBirth: any;
    DateOfRegistration: string;
    IsVerified: boolean;
    Role: string;
    CategoryID: string;
    StateID: string;
    CountryID: string;
    CollegeID: string;
    RoleID: string;
    IsActive: boolean;
}
export class LecturerManagement {
    UserID: number;
    UserName: string;
    Password: string;
    Email: string;
    State: string;
    Country: string;
    College: string;
    Mobile: string;
    CategoryOfStudy: string;
    DateOfBirth: any;
    DateOfRegistration: string;
    IsVerified: boolean;
    Role: string;
    CategoryID: string;
    StateID: string;
    CountryID: string;
    CollegeID: string;
    RoleID: string;
    IsActive: boolean;
}