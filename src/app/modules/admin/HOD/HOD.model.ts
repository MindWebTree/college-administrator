export class HODModel {
    id: number;
    // "guid": string;
    // "userId": string;
    isActive: boolean;
    firstName: string;
    lastName: string;
    description: string;
    email: string;
    phoneNumber: string;
    countryId: number;
    stateId: number;
    collegeId: number;
    categoryId: number;
    designationId?: number;
    // dateOfBirth: string;
    password: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    imageUrl: string;
    signature: string;
    courseType: string;
    qualification: string;
    employeeNo: string;
    phoneCountryCode: string;
    courses: Array<coursesList>;
    qBankTypeIds: Array<any>;
    subjectIds: Array<any>;
    qBankTypes: Array<QBankType>;  // Instead of qBankTypeIds
    rollNo: string;
    constructor(lecture) {
        this.id = lecture.id;
        // this.guid = lecture.guid;
        // this.userId = lecture.userId;
        this.isActive = lecture.isActive;
        this.firstName = lecture.firstName;
        this.lastName = lecture.lastName;
        this.description = lecture.description;
        this.email = lecture.email;
        this.phoneNumber = lecture.phoneNumber;
        this.countryId = lecture.countryId;
        this.stateId = lecture.stateId;
        this.collegeId = lecture.collegeId;
        this.categoryId = lecture.categoryId;
        this.designationId = lecture.designationId;
        // this.dateOfBirth = lecture.dateOfBirth;
        this.password = lecture.password;
        this.emailConfirmed = lecture.emailConfirmed;
        this.phoneNumberConfirmed = lecture.phoneNumberConfirmed;
        this.imageUrl = lecture.imageUrl || '';
        this.signature = lecture.signature || '';
        this.courseType = lecture.courseType;
        this.qualification = lecture.qualification;
        this.phoneCountryCode = lecture.phoneCountryCode;
        this.employeeNo = lecture.employeeNo;
        this.courses = lecture.coursesList
        this.qBankTypeIds = lecture.qBankTypeIds
        this.subjectIds = lecture.subjectIds
    }
}

export class QBankType {
    title: string;
    id: number;

    constructor(qbankList) {
        this.title = qbankList.title;
        this.id = qbankList.id;


    }
}
export class coursesList {
    courseId: number;
    courseYearId: number;
    courseYear: string;
    courseName: string;
    constructor(cousreList) {
        this.courseId = cousreList.courseId;
        this.courseYearId = cousreList.courseYearId;
        this.courseYear = cousreList.courseYear;
        this.courseName = cousreList.courseName;

    }
}
export enum QBankCategory {
    General = "General",
    Owned = "Owned"
}