import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from "@angular/core";
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, of, fromEvent, merge } from 'rxjs';
import { takeUntil, tap, catchError, finalize, debounceTime, distinctUntilChanged } from 'rxjs/operators';



import { ActivatedRoute, Router } from "@angular/router";



import { CommonModule, Location } from '@angular/common';

import { FuseConfirmationDialogComponent } from "@fuse/services/confirmation/dialog/dialog.component";
import { DataGuardService } from "app/core/auth/data.guard";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SitePreference } from "app/core/auth/app.configs";
import { CompetencyService } from "../../competency.service";
import { RubricFormComponent } from "../rubric-form/rubric-form.component";
import { GridFilter, RubricConstruction } from "../../competency.model";
import { ConfirmDialogComponent } from "app/modules/admin/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-rubric-list',
  standalone: true,
  imports: [MatIconModule,CommonModule, MatPaginatorModule, MatTableModule, MatInputModule ,FormsModule,ReactiveFormsModule,MatFormFieldModule],
  templateUrl: './rubric-list.component.html',
  styleUrl: './rubric-list.component.scss'
})
export class RubricListComponent  implements OnInit {

  @ViewChild('dialogContent', { static: true })
  tag: any;
  rubricConstruction: any
  dialogContent: TemplateRef<any>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogRef: any;
  subjectID: number;
  integrationType: number;
  _sitePreference: any = SitePreference;
  Title = "";
  paginationData: any;
  title: string = 'List of Integrations';
  dataSource: RubricDataSource;
  displayedColumns = ['Name', 'IsActive', 'buttons'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  // Private
  private _unsubscribeAll: Subject<any>;
  searchInput: FormControl;
  constructor(
    private _competencyService: CompetencyService,
    public _matDialog: MatDialog,
    private route: ActivatedRoute,
    private _router: Router,
    private _dataGuardService: DataGuardService

  ) {
    var self = this;
    // Set the defaults
    this.searchInput = new FormControl('');
    this._competencyService.setTitle(this.title);
    this._competencyService.setModuleTitle('Collections');
    // Set the private defaultsSubject
    this._unsubscribeAll = new Subject();
    this.route.params.subscribe(function (parram) {

      self.subjectID = self._dataGuardService.valueDecryption(parram.subjectid);
      // self.integrationType=0
    })
      self.Title = "Certifiable Competency skills	Management";
  }
  loadPage() {
    // this._commonService.onIntegrationChanged.next(this.integration);
  }

  ngOnInit(): void {
    var self = this;
    this.dataSource = new RubricDataSource(this._competencyService);

    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this._competencyService.onRubricListChanged.next(searchText);
      });


    this._competencyService.onRubricListChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {

        let gridFilter: any = {
          PageNumber: this.paginator?.pageIndex + 1,
          PageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator?.pageSize,
          Search: typeof search === "string" ? search : "",
          SortBy: this.sort?.active == null ? "IntegrationID" : "IntegrationID",
          SortOrder: this.sort?.direction == 'desc' ? this.sort.direction : 'desc',
          SubjectID: this.subjectID,
          IntegrationType: this.integrationType,
        };
        this.dataSource.loadData(gridFilter);

      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
  getNext(event: PageEvent) {
    this._competencyService.onRubricListChanged.next(this.rubricConstruction);

  }

  onSortData(sort: Sort) {

    this._competencyService.onRubricListChanged.next(this.rubricConstruction);
  }

  addintegration(): void {
    var self = this;
    var rubric = new RubricConstruction({});
    this.dialogRef = this._matDialog.open(RubricFormComponent, {
      panelClass: 'add-rubric',
      disableClose: true,
      data: {
        action: 'new',
        // integration: integration,
        // integrationtype: this.integrationType
      }
    });
    // this.integrationCrudOp(rubric);



  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Edit topic
   *
   * @param subject
   */

  editRubric(integration): void {
    var self = this;
    this._competencyService.getRubricConstructionbyid(integration.guid).then(response => {
      self.dialogRef = self._matDialog.open(RubricFormComponent, {
        panelClass: 'edit-rubric-form',
        disableClose: true,
        data: {
          integration: response,
          action: 'edit',
          integrationtype: this.integrationType
        }
      });
      // self.integrationCrudOp(integration);
    });

  }

  // integrationCrudOp(rubric: any) {
  //   this.dialogRef.afterClosed()

  //     .subscribe((response: any) => {
  //       if (!response) {
  //         return;
  //       }
  //       const actionType: string = response.actionType;
  //         var _rubricConstruction: any = response.rubricConstruction;
  //       // const _rubricConstruction: any = response.rubricConstruction;

  //       rubric.SubjectID = this.subjectID;
  //       rubric.IntegrationType = this.integrationType;
  //       rubric.IntegrationID = rubric.IntegrationID;
  //       switch (actionType) {
  //         /**
  //          * Save
  //          */
  //         case 'add':
            
  //           if (_rubricConstruction) {

  //             this._competencyService.createRubricConstructiongrid(_rubricConstruction)
  //           }
  //           break;

  //         case 'update':

  //           if (_rubricConstruction) {

  //             this._competencyService.updateRubricConstructiongrid(_rubricConstruction);
  //           }
  //           break;

  //         /**
  //          * Delete
  //          */
  //         case 'delete':

  //           this.deleteIntegration(rubric);

  //           break;
  //       }
  //     });


  // }



  /**
   * Delete Topic
   */
  deleteRubric(rubric): void {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      panelClass: 'delete-choice',
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._competencyService.deleteRubric(rubric.guid);
      }
      this.confirmDialogRef = null;
    });

  }
  NavigatetoSteps(row){
    this._router.navigate([`/competency/sections/${row.guid}`])
  }



}

export class RubricDataSource extends DataSource<RubricConstruction> {

  private loadingTopic = new BehaviorSubject<boolean>(false);
  public paginationData: any;
  public loading$ = this.loadingTopic.asObservable();
  public data: MatTableDataSource<RubricConstruction>;



  /**
   * Constructor
   *
   * @param {TopicService} _topicService
   */
  constructor(
    private _competencyService: CompetencyService

  ) {
    super();
  }


  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._competencyService.onRubricListChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }

  loadData(gridFilter: GridFilter) {
    var self = this;

    this._competencyService.getRubricConstructiongird(gridFilter)
      .pipe(
        catchError(() => of([])),
        finalize(() => {
          this.loadingTopic.next(false)
        })
      )
      .subscribe(response => {
        this.data = new MatTableDataSource(response);
        // self.paginationData = {
        //   count: response.Count,
        //   pageNumber: response.CurrentFilter.PageNumber
        // };


      });
  }
}