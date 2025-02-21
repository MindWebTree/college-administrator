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
        id: "ADrPLEXUS Q'Bank",
        title: "ADrPLEXUS Q'Bank",
        type: 'basic',
        SubType: 'collapsable',
        // icon : 'heroicons_outline:chart-pie',
        link: '/qbank/adrplexus-qbank',
        roles: ["Lecturer", "CollegeAdministrator"]
    },
    {
        id: 'Exams',
        title: 'Exams',
        type: 'collapsable',
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Students',
        title: 'Students',
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
        children: [
            //     {
            //         id: 'createaccount',
            //         title: 'Create Account',
            //         type: 'basic',
            //         link: ''
            // },
        ],
        roles: ["CollegeAdministrator"]
    }
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
        id: "ADrPLEXUS Q'Bank",
        title: "ADrPLEXUS Q'Bank",
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
        title: 'QBanks',
        type: 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link: '/qbank/exam-list'
    },
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
        link: '/dashboard',
        roles: ["Lecturer", "CollegeAdministrator", "Student"]
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
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Lecturers',
        title: 'Lecturers',
        type: 'collapsable',
        link:'/lecturer/lecturer-bio/:userId/:courseYear',
        children: [],
        roles: ["CollegeAdministrator"]
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
    }

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
