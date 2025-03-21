export class GridFilter {
    keyword: string;
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;

}
export class competencyGrid extends GridFilter {
    batchId: number;
    academicYearId: number;
    status: number;
    conductedBy: string;
}
export class StudentGrid extends GridFilter {
    competencyAssignmentGuid: string;
}
export class studentGrid extends GridFilter {
    averageType: string;
    average: number;
    courseYearId: string;
} 
export class competency {
    id:number;
    guid?: string;
    isActive: boolean;
    batchId: number;
    academicYearId: string;
    name?: string;
    assignmentDate: string;
    submissionDate?: string;
    subjectId: 0;
    facultyId: string;
    notes: string;
    rubricConstructionId:string

}
export class RubricConstruction{
    id:number;
    guid:string;
    name:string;
    subjectId:number;
    constructor(rubric) {
        {
            this.name = rubric.name;
            this.subjectId = rubric.subjectId;
                }
    }
}
export class Step{
    sectionId:number;
    queueId:number;
    guid:string;
    name:string;
    description:string;
    rubricConstructionGuid:string;
    constructor(rubric) {
        {
            this.name = rubric.name;
            this.sectionId = rubric.sectionId;
            this.rubricConstructionGuid = rubric.rubricConstructionGuid;
            this.description = rubric.description;
            this.queueId = rubric.queueId;
        }
    }
}
export class criteria{
    id:number;
    queueId:number;
    guid:string;
    name:string;
    description:string;
    marks:number;
    isCritical:boolean;
    rubricConstructionSectionGuid:string;
    constructor(rubric) {
        {
            this.name = rubric.name;
            this.id = rubric.id;
            this.rubricConstructionSectionGuid = rubric.rubricConstructionSectionGuid;
            this.description = rubric.description;
            this.marks = rubric.marks;
            this.queueId = rubric.queueId;
            this.isCritical = rubric.isCritical || false ;
        }
    }
}
export class Steps{
    id:number;
    name:string;
    queueId:number;
    rubricId:number;
    IsActive:number;
} 
export class Criteria{
    id:number;
    name:string;
    queueId:number;
    criteriaId:number;
    IsActive:number;
} 
export enum CompetencyStatus
{
    New=1,
    Completed=3,
    Repeat=6,
    Remedial=7

}

export enum CompetencyRating
{
    None=0,
    'Exceeds Expectations' = 1,   // Score >9 with all critical steps correct
    'Meets Expectations' = 2,     // Score 7-9 with critical steps 7, 9 & 10 correct
    'Below Expectations' = 3,     // Score <7 with at least two of steps 5, 7, 9, 10 correct OR Score ≥7 but with critical steps 7, 9, 10 incorrect
    RepeatAttempt = 4,  
    RemedialTraining = 5       // Score <5 OR Score <7 with fewer than two of steps 5, 7, 9, 10 correct
}