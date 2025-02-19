export class GridFilter {
    Search: string;
    PageNumber: number;
    PageSize: number;
    SortBy: string;
    SortOrder: string;
}

export class AttendanceGridFilter extends GridFilter {
    Type: number = 0;
    TypeID: number = 0;
    ExamID: number = 0;
    StartDate: string;
    EndDate: string;
}
export class AttendanceLogger {
    LoggerID: string
    RollNo: string
    Name: string
    DepartmentID: string
    DepartmentName: string
    CheckIn: string
    CheckOut: string
    Availablity: string
    Status: string
}