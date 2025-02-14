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
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example',
        roles: ["Lecturer", "CollegeAdministrator", "Student"]
    },
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
        children: [],
        roles: ["CollegeAdministrator"]
    },
    {
        id: 'Lecturers',
        title: 'Lecturers',
        type: 'collapsable',
        children: [],
        roles: ["CollegeAdministrator"]
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
