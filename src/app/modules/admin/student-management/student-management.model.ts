export class studentModel {

    id: number;
    // guid: string;
    // userId: string;
    isActive: boolean;
    // isDeleted: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryId: number;
    stateId: number;
    collegeId: number;
    courseId: number;
    courseYearId: number;
    rollNo: string;
    categoryId: number;
    // dateOfBirth: string;
    password: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    imageUrl: string;
    courseType: string;
    phoneCountryCode: string;
    year: number;
    medicalCourseYear: string;
    constructor(student) {
        this.id = student.id;
        // this.guid = student.guid;
        // this.userId = student.userId;
        this.isActive = student.isActive;
        this.firstName = student.firstName;
        this.lastName = student.lastName;
        this.email = student.email;
        this.phoneNumber = student.phoneNumber;
        this.countryId = student.countryId;
        this.stateId = student.stateId;
        this.collegeId = student.collegeId;
        this.courseId = student.courseId;
        this.courseYearId = student.courseYearId;
        this.rollNo = student.rollNo;
        this.categoryId = student.categoryId;
        // this.dateOfBirth = student.dateOfBirth;
        this.password = student.password;
        this.emailConfirmed = student.emailConfirmed;
        this.phoneNumberConfirmed = student.phoneNumberConfirmed;
        this.imageUrl = student.imageUrl || '';
        this.courseType = student.courseType;
        this.phoneCountryCode = student.phoneCountryCode;
        this.year = student.year;
        this.medicalCourseYear = student.medicalCourseYear;


    }

}
export class StudentReportCard {
    id: number;
    // guid: string;
    // userId: string;
    isActive: boolean;
    // isDeleted: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryId: number;
    stateId: number;
    collegeId: number;
    courseId: number;
    courseYearId: number;
    rollNo: string;
    categoryId: number;
    // dateOfBirth: string;
    password: string;
    emailConfirmed: boolean;
    phoneNumberConfirmed: boolean;
    imageUrl: string;
    courseType: string;
    phoneCountryCode: string;
    year: number;
    medicalCourseYear: string;
    course: Array<coursesList>;
    averageMarks: any
    attendedExam: any
    constructor(studentReportCard) {
        this.id = studentReportCard.id;
        // this.guid = studentReportCard.guid;
        // this.userId = studentReportCard.userId;
        this.isActive = studentReportCard.isActive;
        this.firstName = studentReportCard.firstName;
        this.lastName = studentReportCard.lastName;
        this.email = studentReportCard.email;
        this.phoneNumber = studentReportCard.phoneNumber;
        this.countryId = studentReportCard.countryId;
        this.stateId = studentReportCard.stateId;
        this.collegeId = studentReportCard.collegeId;
        this.courseId = studentReportCard.courseId;
        this.courseYearId = studentReportCard.courseYearId;
        this.rollNo = studentReportCard.rollNo;
        this.categoryId = studentReportCard.categoryId;
        // this.dateOfBirth = studentReportCard.dateOfBirth;
        this.password = studentReportCard.password;
        this.emailConfirmed = studentReportCard.emailConfirmed;
        this.phoneNumberConfirmed = studentReportCard.phoneNumberConfirmed;
        this.imageUrl = studentReportCard.imageUrl || '';
        this.courseType = studentReportCard.courseType;
        this.phoneCountryCode = studentReportCard.phoneCountryCode;
        this.year = studentReportCard.year;
        this.medicalCourseYear = studentReportCard.medicalCourseYear;
        this.averageMarks = studentReportCard.averageMarks
        this.attendedExam = studentReportCard.attendedExam
        this.course = studentReportCard.courses;

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
export class ExamList {
    ExamDate: string;
    ExamName: string;
    Subject: string;
    Rank: number;
    Percentage: string;
    ResultStatus: string;
    constructor(examList) {
        this.ExamDate = examList.ExamDate;
        this.ExamName = examList.ExamName;
        this.Subject = examList.Subject;
        this.Rank = examList.examList;
        this.Percentage = examList.Percentage;
        this.ResultStatus = examList.ResultStatus;
    }
}

export enum studentAnalytics {
    attendedExam = 1,
    nonAttendedExam = 0
}