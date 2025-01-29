/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
export const AdminNavigation: FuseNavigationItem[] = [
    {
        id   : 'Dashboard',
        title: 'Dashboard',
        type : 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : "ADrPLEXUS Q'Bank",
        title: "ADrPLEXUS Q'Bank",
        type: 'basic',
        SubType: 'collapsable', 
        // icon : 'heroicons_outline:chart-pie',
        link : '/qbank/adrplexus-qbank'
    },
    {
        id: 'Exams',
        title: 'Exams',
        type: 'collapsable',
        children: []
    },
    {
        id: 'Students',
        title: 'Students',
        type: 'collapsable',
        children: [
            {
                id: 'createaccount',
                title: 'Create Account',
                type: 'basic',
                link: ''
        },
        ]
    },
    {
        id: 'Lecturers',
        title: 'Lecturers',
        type: 'collapsable',
        children: [
            {
                id: 'createaccount',
                title: 'Create Account',
                type: 'basic',
                link: ''
        },
        ]
    }
];
export const LecturerNavigation: FuseNavigationItem[] = [
    {
        id   : 'Dashboard',
        title: 'Dashboard',
        type : 'basic',
        // icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id: 'exams management',
        title: 'Exams',
        type: 'collapsable',
        children: []
    }
];
export const StudentNavigation: FuseNavigationItem[] = [];
export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/examples'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
