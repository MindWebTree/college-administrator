import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { helperService } from 'app/core/auth/helper';
import {
    AdminNavigation,
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation,
    LecturerNavigation,
    StudentNavigation,
} from 'app/mock-api/common/navigation/data';
import { CommanService } from 'app/modules/common/comman.service';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _compactNavigation: FuseNavigationItem[] =
        compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] =
        defaultNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] =
        futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] =
        horizontalNavigation;
    public readonly _AdminNavigation: FuseNavigationItem[] =
        AdminNavigation;
    private readonly _LecturerNavigation: FuseNavigationItem[] =
        LecturerNavigation;
    public readonly _StudentNavigation: FuseNavigationItem[] =
        StudentNavigation;
    userDetail: any;
    isnavigationalreadyexiest: boolean = false;
    latestNavigation: any = [];
    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _CommanService: CommanService,
        private _helpService: helperService
    ) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        this._fuseMockApiService.onGet('api/common/navigation').reply((data) => {
            return new Observable((observer) => {
                // Determine navigation based on user role
                this.userDetail = this._helpService.getUserDetail();
                let navigation: any;

                if (this.userDetail?.Roles == "CollegeAdministrator") {
                    navigation = this._AdminNavigation;
                } else if (this.userDetail?.Roles == "Lecturer") {
                    navigation = this._LecturerNavigation;
                } else if (this.userDetail?.Roles == "Student") {
                    navigation = this._StudentNavigation;
                }

                // Populate children for different navigation types
                this._compactNavigation.forEach((compactNavItem) => {
                    navigation?.forEach((defaultNavItem) => {
                        if (defaultNavItem.id === compactNavItem.id) {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fetch dynamic navigation
                this.fetchDynamicNavigation(navigation)
                    .then((dynamicNavigation) => {
                        console.log(navigation,"navigation")
                        observer.next([
                            200,
                            {
                                compact: cloneDeep(dynamicNavigation || navigation),
                                default: cloneDeep(dynamicNavigation || navigation),
                                futuristic: cloneDeep(dynamicNavigation || navigation),
                                horizontal: cloneDeep(dynamicNavigation || navigation)
                            }
                        ]);
                        observer.complete();
                    })
                    .catch((error) => {
                        console.error("Error in navigation handler:", error);
                        observer.next([
                            500,
                            { error: 'Failed to fetch navigation' }
                        ]);
                        observer.complete();
                    });
            });
        });
    }

    private async fetchNavigationItems(type: string): Promise<any[]> {
        switch (type) {
            case 'Exams':
                return await this._CommanService.getexamCategory().toPromise();
            case 'Students':
                return await this._CommanService.getstudentNavigationList().toPromise();
            case 'Lecturers':
                return await this._CommanService.getlecturerNavigationList().toPromise();
            default:
                return [];
        }
    }

    private getNavigationLink(type: string, category: any): string {
        switch (type) {
            case 'Exams':
                if (category.name == 'Waiting For Approval') {
                    return `/exam/list/waiting-for-approval`;
                } else {
                    return `/exam/list/${category.guid}`;
                }
            case 'Students':
                return `/student/list/${category.guid}`;
            case 'Lecturers':
                return `/lecturer/list/${category.guid}`;
            default:
                return '';
        }
    }

    fetchDynamicNavigation(navigation): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!navigation) {
                resolve(null);
                return;
            }

            try {
                const processedNavs = new Set();

                for (const nav of navigation) {
                    if ((nav.title === 'Exams' || nav.title === 'Students' || nav.title === 'Lecturers') &&
                        !processedNavs.has(nav.title)) {

                        processedNavs.add(nav.title);

                        // if (!this.isnavigationalreadyexiest) {
                        try {
                            const items = await this.fetchNavigationItems(nav.title);
                            nav.children = [];
                            items?.forEach(category => {
                                const existingNavItem = nav.children.find(child =>
                                    child.title === category.name);

                                if (!existingNavItem) {

                                    nav.children.push({
                                        id: category.name,
                                        title: category.name + ' ' + `(${category.count})`,
                                        type: 'basic',
                                        link: this.getNavigationLink(nav.title, category),
                                    });
                                }
                            });
                        } catch (error) {
                            console.error(`Error fetching ${nav.title} navigation:`, error);
                        }
                        // }
                    }
                }

                this.isnavigationalreadyexiest = true;
                resolve(navigation);
            } catch (error) {
                this.isnavigationalreadyexiest = false;
                reject(error);
            }
        });
    }
}
