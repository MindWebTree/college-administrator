export class CreateQuestion{
    userID:any;
    questionDetailID:number;
    qbankTypeID: number;
    subjectID: number;
    topicID: number;
    questionType: string;
    questionTitle: string;  
    questionLevel:string;
    level:string;
    verticalIntegration:Array<any>;
    horizontalIntegration:Array<any>;
    choices: Array<Choices>
    notes:string;
    explanation:string;
    books:Array<any>;
    videos:Array<any>;
    explanations:Array<any>;
    tags:Array<any>;

    // Explanation: any;

}
export class Choices {
    
    choiceID: Number;
    choiceText: string;
    isCorrect: boolean;
    questionDetailID: Number
    QueueID: number;
    constructor(choiceID: Number, choiceText: string, isCorrect: boolean, questionDetailID: Number) {
        this.choiceID = choiceID;
        this.choiceText = choiceText;
        this.isCorrect = isCorrect;
        this.questionDetailID = questionDetailID;
    }
}
export class QbankSubject{
    subjectId:number;
    subjectImage:string;
    subjectName:string;
    totalNoOfCompletedModules:0
    totalNoOfModules:1
    constructor(values){
        this.subjectId=values.subjectId || 0;
        this.subjectImage=values.subjectImage || '';
        this.subjectName=values.subjectName || '';
        this.totalNoOfCompletedModules=values.totalNoOfCompletedModules || 0;
        this.totalNoOfModules=values.totalNoOfModules || 0;
    }
}
export class QuestionListFilter{
    Search: string;
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;
    userId: string;
    status: number;
    tagIds: Array<number>;
    qBankTypeId: Array<number>;
    levelOfQuestionID: number;
    levelId: number;
    qBankCategoryId: string;
    subjectIds:Array<number>;
    topicIds:Array<number>;
    cmbeCodeIds:Array<number>;

}
export class QuestionSearchList{

        keyword:string ;
        pageNumber: number;
        pageSize: number;
        orderBy: string;
        sortOrder: string;
        qBankTypeId: number;
        qBankCategory: string;
        subjectId: number;
        topicId: any;
        cbmeCodeId: any;
        competencyLevelId: number;
        levelofQuestionId: number;
        tags: number
}
export class QuestionListModel {
    BooksName:string;
    BookEdition:string;
    PageNumber:number;
    Question:string;
    CMBECode: string;
    CMBEDescription:string;
    // CQBANKQuestionStatus: number;
    Choices: Array<Choices>
    Correct:string;
    Pattern:string;
    VerticalIntegration:Array<any>;
    HorizontalIntegration:Array<any>;
    Explanations: Array<Explanations>;
    CompentencyLevel:string;
    LevelofQuestions:string;
    QBankType: string;
    QuestionBankID: number;
    // QuestionType: number;
    Explanation: string;
    Notes: string;
    Subject: string;
    userId: string;
    Tags: Array<Tags>
    Topic: string;
    Video: Array<Videos>
    
    constructor(questionListModel) {

        this.CMBECode = questionListModel.CMBECode;
        // this.CQBANKQuestionStatus = questionListModel.CQBANKQuestionStatus;
        this.Explanations = questionListModel.Explanations;
        this.VerticalIntegration = questionListModel.VerticalIntegration;
        this.HorizontalIntegration = questionListModel.HorizontalIntegration;
        this.QBankType = questionListModel.QbankType;
        this.QuestionBankID = questionListModel.QuestionDetailID;
        // this.QuestionType = questionListModel.QuestionType;
        this.Explanation = questionListModel.Explanation||'';
        this.Notes = questionListModel.Notes||'';
        this.Subject = questionListModel.Subject;
        this.Topic = questionListModel.Topic;
    }
}
export class Explanations {
    Content: string;
    ExplanationID: number;
    QueueID: number;
    constructor(explanations) {
        this.Content = explanations.Content;
        this.ExplanationID = explanations.ExplanationID;
    }
}
export class Tags {
    CanAccess: boolean;
    CreatedBy: string;
    CreatedOn: number;
    Email: string;
    IsActive: boolean
    IsDeleted: boolean
    IsHide: boolean
    name: string;
    OrderNo: number
    tagID: number
    UpdatedBy: string;
    UpdatedOn: number;
    UserID: number
    constructor(tags) {
        this.CanAccess = tags.CanAccess;
        this.CreatedBy = tags.CreatedBy;
        this.CreatedOn = tags.CreatedOn;
        this.Email = tags.Email;
        this.IsActive = tags.IsActive;
        this.IsDeleted = tags.IsDeleted;
        this.IsHide = tags.IsHide;
        this.name = tags.name;
        this.OrderNo = tags.OrderNo;
        this.tagID = tags.tagID;
        this.UpdatedBy = tags.UpdatedBy;
        this.UpdatedOn = tags.UpdatedOn;
        this.UserID = tags.UserID;
    }
}
export class Videos {
    VideoID: number;
    VideoLink: string;
    QueueID: number;
    constructor(video) {
        this.VideoID = video.VideoID;
        this.VideoLink = video.VideoLink;
    }
}
export class QuestionActivaty {
    activityId: string;
    examDuration: any;
    duration: number;
    constructor(questionActivaty) {
        this.activityId = questionActivaty.activityId;
        this.examDuration = questionActivaty.examDuration;
        this.duration = questionActivaty.duration;
    }
}
export class CompetenecyLevel  {
    levelID: number;
    title: string;
    orderNo: number;
    constructor(competenecyLevel) {
        {
        this.levelID=competenecyLevel.levelID;
        this.title=competenecyLevel.title;
        this.orderNo=competenecyLevel.orderNo


        }
    }
}
export class QuestionReponse {
    choices: Array<choices>;
    cmbeCode: any;
    cmbeDescription: any;
    cmbeid: number;
    cqbankQuestionStatus: number;
    createdOn: string;
    explanation: any;
    explanations: any[];
    horizontalIntegration: any[];
    isDeleted: boolean;
    level: any;
    levelID: number;
    levelIDOfQuestion: number;
    notes: string;
    qbankType: any;
    qbankTypeID: number;
    questionDetailID: number;
    questionLevel: any;
    questionTitle: string;
    questionType: number;
    selectedHorizontalIntegration: any;
    selectedTags: any;
    selectedVerticalIntegration: any;
    subject: any;
    subjectID: number;
    tags: any[];
    topic: any;
    topicID: number;
    updatedON: string;
    isMarkedReview:boolean;
    isCalculateRisk:boolean;
    userID: number;
    verticalIntegration: any[];
    videos: any[];
    isChecked: boolean;
    isCorrect: boolean;
    isBoomarked:boolean;
    unAttempt:boolean;
    duration:number;
}
export class choices {
    questionSetID: number | null;
    questionDetailID: number;
    choiceId: number;
    choiceText: string;
    isCorrect: boolean;
    validAdditionalValue: any | null;
    matchedValue: any | null;
    additionalChoice: any | null;
    isChecked: boolean | null;
    pollPercentage: number;
    pollCount: number;
    noOfUsersSelectedThisOption:number;
}
export class customExam {
    examId: string;
    startTime: number; // Updated to lowercase "number"
    endTime: number;   // Updated to lowercase "number"
    isExamManully: boolean;

    constructor(customExam) {
        this.examId = customExam.examId;
        this.startTime = customExam.startTime;
        this.endTime = customExam.endTime;
        this.isExamManully = customExam.isExamManully;
    }
}
export class LevelQuestion  {
    levelID: number;
    title: string;
    orderNo: number;

    constructor(levelQuestion) {
        {
        this.levelID=levelQuestion.levelID;
        this.title=levelQuestion.title;
        this.orderNo=levelQuestion.orderNo


        }
    }
}
export class Tag {
    Name: string;
    TagID: number;
    IsActive: boolean;
    orderNo: number;
    Modules: Array<Module> //sandeep kumar 02/01/2023 modules add start and end

    /**
     * Constructor
     *
     * @param subject
     */
    constructor(tag) {
        {
            this.TagID = tag.TagID; //|| UnisunUtils.generateGUID();
            this.Name = tag.SubjectName || '';
            this.Modules = tag.Modules || '';

        }
    }
}
export class Module {
    ModuleID: number;
    Name: string;
    isSelected: boolean;
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
export class Subjects {
    subjectID: number;
    qbankTypeID: number;
    subjectName: string;
    isActive: boolean;
    description: string;
    constructor(subject) {
        this.subjectID = subject.subjectID;
        this.qbankTypeID = subject.qbankTypeID;
        this.subjectName = subject.subjectName;
        this.isActive = subject.isActive;
        this.description = subject.description;

    }
}
export class Topic {
    subjectID: number;
    topicID: number;
    OrderNo: number;
    topicName: string;
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
            this.topicName = topic.topicName || '';
            this.topicID = topic.topicID || 0;
            this.isDeleted = topic.isDeleted;
            this.isActive = topic.isActive;
            // this.Modules = topic.Modules || '';

        }
    }

    
}
export class QbankcmbCode {
    cmbeid: number;
    title: string;
    Code: string;
    OrderNo: number;
    noOfQuestionAttempted:number;
    noOfQuestions:number;
    topicID:number;
    description:string;
    examStatus:number;
    constructor(qbankcmbCode) {
        {
        this.cmbeid=qbankcmbCode.cmbeid;
        this.title=qbankcmbCode.title;
        this.Code=qbankcmbCode.Code;
        this.OrderNo=qbankcmbCode.OrderNo;
        this.noOfQuestionAttempted=qbankcmbCode.noOfQuestionAttempted;
        this.noOfQuestions=qbankcmbCode.noOfQuestions;
        this.examStatus=qbankcmbCode.examStatus;
this.topicID=qbankcmbCode.topicID;
this.description=qbankcmbCode.description;

        }
    }

    
}
export class  QBankFilter {
    QbankType?: number;
    Subject?: number;
    Topic?: number;
    CBMECode?: number;
  }