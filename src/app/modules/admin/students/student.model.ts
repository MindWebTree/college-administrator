export class GridFilter {
    keyword: string;
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;

}
export class assessmentGrid extends GridFilter {
    subjectId:number;
    studentId:string;
}
export class AttendanceyearGrid extends GridFilter {
    subjectId:number;
    studentId:string;
}
export class yearGrid extends GridFilter {
    averageType:string;
    average:number;
    batchId:string;
    batchYearId:number;
}
export class importUser {
    UserName: string;
    Password: string;
    Email: string;
    Mobile: string;
    DateOfBirth: any;
    CategoryID: string;
    StateID: string;
    CountryID: string;
    CollegeID: string;
    RoleID: string;
    IsActive: boolean;
    TenantId: String;
    constructor(importUser) {
        this.UserName = importUser.UserName;
        this.Password = importUser.Password;
        this.Email = importUser.Email;
        this.Mobile = importUser.Mobile;
        this.DateOfBirth = importUser.DateOfBirth;
        this.CategoryID = importUser.CategoryID;
        this.StateID = importUser.StateID;
        this.CountryID = importUser.CountryID;
        this.CollegeID = importUser.CollegeID;
        this.RoleID = importUser.RoleID;
        this.IsActive = importUser.IsActive;
        this.TenantId = importUser.TenantId
    }
}
export class ExceluserFeild {
    UserName: string;
    Password: string;
    Email: string;
    Mobile: string;
    DateOfBirth: any;
    CategoryID: string;
    StateID: string;
    CountryID: string;
    CollegeID: string;
    RoleID: string;
    Active: boolean;
    TenantId: String;
}