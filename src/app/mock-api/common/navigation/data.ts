/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
export const AdminNavigation: FuseNavigationItem[] = [
    {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/dashboard',
        roles: ["Lecturer", "CollegeAdministrator"]
    },
    {
        id: "ADRQbank",
        title: "ADR Qbank",
        type: 'basic',
        SubType: 'collapsable',
        // icon : 'heroicons_outline:chart-pie',
        link: '/qbank/adrplexus-qbank',
        roles: ["Lecturer", "CollegeAdministrator"]
    },
    {
        id: 'HOD',
        title: 'HOD',
        type: 'basic',
        link: '/hod/list',
        roles: ["CollegeAdministrator","HOD"]
    },
    // {
    //     id: 'Lecturers',
    //     title: 'Lecturers',
    //     type: 'collapsable',
    //     children: []
    // },
    {
        id: 'Student',
        title: 'Student',
        type: 'collapsable',
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Batch',
        title: 'Batch',
        type: 'collapsable',
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Exams',
        title: 'Exams',
        type: 'collapsable',
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Competency',
        title: 'Competency',
        type: 'collapsable',
        children: [
            {
                id: 'List Competency',
                title: 'List Competency',
                type: 'basic',
                link: 'competency/list'
            }
        ],
        roles: ["CollegeAdministrator"]
    },
];
export const LecturerNavigation: FuseNavigationItem[] = [
    {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    {
        id: "ADRQbank",
        title: "ADR Qbank",
        type: 'basic',
        SubType: 'collapsable',
        link: '/qbank/adrplexus-qbank',
        roles: ["Lecturer", "CollegeAdministrator"]
    },
    {
        id: 'mcq',
        title: "Faculty-Framed MCQs",
        type: 'collapsable',
        children: [
            {
                id: 'createqbank',
                title: 'Create New Question',
                type: 'basic',
                link: '/qbank/create',
                roles: ["Lecturer"]
            },
            {
                id: 'qbanklist',
                title: 'Created Questions',
                type: 'basic',
                link: '/qbank/question-list',
                roles: ["Lecturer"]
            },
        ],
        roles: ["Lecturer"]
    },
    {
        id: 'Exam',
        title: 'Exam',
        type: 'collapsable',
        children: [
            {
                id: 'createexam',
                title: 'Create Exam',
                type: 'basic',
                link: '/exam/create',
                roles: ["Lecturer"]
            },
            {
                id: 'examlist',
                title: 'Exam List',
                type: 'basic',

                link: '/exam/created-examlist',
                roles: ["Lecturer"]

            },
        ],
        roles: ["Lecturer"]
    },
    {
        id: 'Competency',
        title: 'Competency',
        type: 'collapsable',
        children: [
            {
                id: 'List Competency',
                title: 'List Competency',
                type: 'basic',
                link: 'competency/list'
            }
        ],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Assigned Student',
        title: 'Assigned Student',
        type: 'collapsable',
        children: [],
        roles: ["CollegeAdministrator"]
    },
];
export const StudentNavigation: FuseNavigationItem[] = [
    {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/dashboard'
    },
    {
        id: 'qbank',
        title: 'Assignments',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/qbank/exam-list'
    },
    {
        id: 'Competency',
        title: 'Competency',
        type: 'collapsable',
        children: [
            {
                id: 'List Competency',
                title: 'List Competency',
                type: 'basic',
                link: 'competency/student'
            }
        ],
        roles: ["CollegeAdministrator"]
    },
];
export const HODNavigation: FuseNavigationItem[] = [
    {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/dashboard',
        roles: ["Lecturer", "CollegeAdministrator"]
    },
    {
            id: 'Student',
            title: 'Student',
            type: 'collapsable',
            children: [
                //     {
                //         id: 'createaccount',
                //         title: 'Create Account',
                //         type: 'basic',
                //         link: ''
                // },
            ],
            roles: ["CollegeAdministrator"]
    },
    {
        id: 'Subgroup',
        title: 'Subgroup',
        type: 'collapsable',
        children: [
            //     {
            //         id: 'createaccount',
            //         title: 'Create Account',
            //         type: 'basic',
            //         link: ''
            // },
        ],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Lecturers',
        title: 'Lecturers',
        type: 'collapsable',
        children: []
    },
    {
        id: 'Competency',
        title: 'Competency',
        type: 'collapsable',
        children: [
            {
                id: 'Create Competency',
                title: 'Create Competency',
                type: 'basic',
                link: 'competency/create'
            },
            {
                id: 'List Competency',
                title: 'List Competency',
                type: 'basic',
                link: 'competency/list'
            },
            {
                id: 'RubricConstructionManagement',
                title: 'Certifiable Competency skills Management',
                type: 'basic',
                link: 'competency/rubric-sections'
            },
        ],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Settings',
        title: 'Settings',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/setting',
        roles: ["CollegeAdministrator","HOD"]
    }
];
export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id: 'example',
    //     title: 'Example',
    //     type: 'basic',
    //     icon: 'heroicons_outline:chart-pie',
    //     link: '/example',
    //     roles: ["Lecturer", "CollegeAdministrator", "Student"]
    // },
    {
        id: 'dashboard',
        title: 'dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/certificate/:id',
        roles: ["Lecturer", "CollegeAdministrator", "Student","HOD"]
    },  
    {
        id: 'dashboard',
        title: 'dashboard',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/dashboard',
        roles: ["Lecturer", "CollegeAdministrator", "Student","HOD"]
    },  
    {
        id: "ADrPLEXUS Q'Bank",
        title: "ADrPLEXUS Q'Bank",
        type: 'basic',
        SubType: 'collapsable',
        link: '/qbank/adrplexus-qbank',
        roles: ["Lecturer","CollegeAdministrator"]
    },
    {
        id: "ADrPLEXUS Q'Bank",
        title: "ADrPLEXUS Q'Bank",
        type: 'basic',
        SubType: 'collapsable',
        link: '/qbank/adrplexus-qbank',
        roles: ["Lecturer","CollegeAdministrator"]
    },
    {
        id: 'Exams',
        title: 'Exams',
        type: 'collapsable',
        link: '/exam/list/waiting-for-approval',
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Exams',
        title: 'Exams',
        type: 'collapsable',
        link: '/exam/list/:guid',
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Exams',
        title: 'Exams',
        type: 'collapsable',
        link: '/exam/edit/:id',
        roles: ["CollegeAdministrator","Lecturer"]
    },
    {
        id: 'Students',
        title: 'Students',
        type: 'collapsable',
        link:'/student/list/:guid',
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Students',
        title: 'Students',
        type: 'collapsable',
        link:'/student/student-report-card/:userId/:courseYear',
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Lecturers',
        title: 'Lecturers',
        type: 'collapsable',
        link:'/lecturer/list/:guid',
        children: [],
        roles: ["CollegeAdministrator","HOD"]
    },
    {
        id: 'Lecturers',
        title: 'Lecturers',
        type: 'collapsable',
        link:'/lecturer/lecturer-bio/:userId',
        children: [],
        roles: ["CollegeAdministrator","HOD"]
    },
    {
        id: 'competency',
        title: 'competency',
        type: 'collapsable',
        link:'/competency/create',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'competency',
        title: 'competency',
        type: 'collapsable',
        link:'/competency/edit/:id',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'competencylist',
        title: 'competency',
        type: 'collapsable',
        link:'/competency/list',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'competencylist',
        title: 'competency',
        type: 'collapsable',
        link:'/competency/student',
        children: [],
        roles: ["Student"]
    },
    {
        id: 'competency-student-grid',
        title: 'competency-student-grid',
        type: 'collapsable',
        link:'/competency/student-grid/:guid',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'rubric-sections',
        title: 'rubric-sections',
        type: 'collapsable',
        link:'/competency/rubric-sections',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'sections',
        title: 'sections',
        type: 'collapsable',
        link:'/competency/sections/:guid',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'grading',
        title: 'grading',
        type: 'collapsable',
        link:'/competency/grading/:id',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'rubric-criteria-list',
        title: 'rubric-criteria-list',
        type: 'collapsable',
        link:'/competency/rubric-criteria-list/:guid',
        children: [],
        roles: ["CollegeAdministrator","Lecturer","HOD"]
    },
    {
        id: 'batch',
        title: 'batch',
        type: 'collapsable',
        link:'/batch/:guid',
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'subgroup',
        title: 'subgroup',
        type: 'collapsable',
        link:'/batch/sub-group/:guid',
        children: [],
        roles: ["CollegeAdministrator","HOD"]
    },
    {
        id: 'CreateQuestion',
        title: 'CreateQuestion',
        type: 'collapsable',
        link:'/qbank/create',
        children: [],
        roles: ["Lecturer"]
    },
    {
        id: 'ListQuestion',
        title: 'List Question',
        type: 'collapsable',
        link:'/qbank/Edit/:questionDetailId',
        children: [],
        roles: ["Lecturer"]
    },
    {
        id: 'ListQuestion',
        title: 'List Question',
        type: 'collapsable',
        link:'/qbank/question-list',
        children: [],
        roles: ["Lecturer"]
    },
    {
        id: 'CreateQuestion',
        title: 'Create Question',
        type: 'collapsable',
        link:'/exam/create',
        children: [],
        roles: ["Lecturer"]
    },
    {
        id: 'QuestionList',
        title: 'Question List',
        type: 'collapsable',
        link:'/exam/created-examlist',
        children: [],
        roles: ["Lecturer"]
    },
    {
        id: 'ExamList',
        title: 'Exam List',
        type: 'collapsable',
        link:'/qbank/exam-list',
        children: [],
        roles: ["Student"]
    },
    {
        id: 'Subjects',
        title: 'Subjects',
        type: 'collapsable',
        link:'/qbank/subjects',
        children: [],
        roles: ["Student"]
    },
    {
        id: 'ExamDetails',
        title: 'ExamDetails',
        type: 'collapsable',
        link:'/qbank/exam-details/:guid',
        children: [],
        roles: ["Student"]
    },
    {
        id: 'Gameview',
        title: 'Gameview',
        type: 'collapsable',
        link:'/qbank/game-view/:guid',
        children: [],
        roles: ["Student"]
    },
    {
        id: 'GameReview',
        title: 'GameReview',
        type: 'collapsable',
        link:'/qbank/game-review/:guid',
        children: [],
        roles: ["Student"]
    },
    {
        id: 'GameAnalytics',
        title: 'GameAnalytics',
        type: 'collapsable',
        link:'/qbank/game-analytics/:guid',
        children: [],
        roles: ["Student"]
    },
    {
        id: 'Students-List',
        title: 'Students-List',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/students/:guid',
        roles: ["CollegeAdministrator","HOD","Lecturer"]
    },
    {
        id: 'Students-List',
        title: 'Students-List',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/students/lecturer/:guid',
        roles: ["CollegeAdministrator","HOD","Lecturer"]
    },
    {
        id: 'Students-Report',
        title: 'Students-Report',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/students/:guid/:batchYearId/:id',
        roles: ["CollegeAdministrator","HOD","Lecturer"]
    },
    {
        id: 'Setting',
        title: 'Setting',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/setting',
        roles: ["CollegeAdministrator","HOD"]
    },
    {
        id: 'ListofHOD',
        title: 'ListofHOD',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/hod/list',
        roles: ["CollegeAdministrator","HOD"]
    },

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
