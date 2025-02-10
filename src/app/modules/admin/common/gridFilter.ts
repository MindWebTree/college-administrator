export class GridFilter {
    keyword: string;
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;

}
export class studentGrid extends GridFilter {
    averageType: string;
    average: number;
    courseYearId: string;
}
export class lecturerGrid extends GridFilter {
    courseYearId: string;
}
export class studentAnalyticGrid extends GridFilter {

    attendenceStatus: number;
    userId: string;
}
export class lecturerAnalyticGrid extends GridFilter {


    userId: string;
}
export class studentExamSummaryGrid extends GridFilter {
    attendenceStatus: number;
    userId: string;
}