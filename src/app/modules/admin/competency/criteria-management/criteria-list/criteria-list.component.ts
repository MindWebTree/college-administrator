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
import { RubricConstruction } from "../../competency.model";
import { ConfirmDialogComponent } from "app/modules/admin/confirm-dialog/confirm-dialog.component";
import { CriteriaFormComponent } from "../criteria-form/criteria-form.component";
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
  selector: 'app-criteria-list',
  standalone: true,
  imports: [MatIconModule,CommonModule, MatCheckboxModule, MatPaginatorModule, MatTableModule, MatInputModule ,FormsModule,ReactiveFormsModule,MatFormFieldModule],
  templateUrl: './criteria-list.component.html',
  styleUrl: './criteria-list.component.scss'
})
export class CriteriaListComponent implements OnInit {

  @ViewChild('dialogContent', { static: true })
  tag: any;
  criteria: any
  dialogContent: TemplateRef<any>;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogRef: any;
  subjectID: number;
  integrationType: number;
  _sitePreference: any = SitePreference;
  Title = "";
  paginationData: any;
  title: string = 'List of Integrations';
  dataSource: CriteriaDataSource;
  displayedColumns = ['Name', 'Marks', 'isCritical', 'buttons'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  criteriaId:string="";


  // Private
  private _unsubscribeAll: Subject<any>;
  searchInput: FormControl;
  constructor(
    private _competencyService: CompetencyService,
    public _matDialog: MatDialog,
    private route: ActivatedRoute,
    private _location: Location,
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
    this.route.params.subscribe(parram=> {
      this.criteriaId = parram.guid;
      // self.subjectID = self._dataGuardService.valueDecryption(parram.subjectid);
      // self.integrationType=0
    })
      self.Title = "Criteria Management";
  }
  loadPage() {
    // this._commonService.onIntegrationChanged.next(this.integration);
  }

  ngOnInit(): void {
    var self = this;
    this.dataSource = new CriteriaDataSource(this._competencyService);

    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this._competencyService.onCriteriaChanged.next(searchText);
      });


    this._competencyService.onCriteriaChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(search => {
        let gridFilter: any = {
          // PageNumber: this.paginator?.pageIndex + 1,
          // PageSize: this.paginator?.pageSize == undefined ? SitePreference.PAGE.GridRowViewCount : this.paginator?.pageSize,
          // Search: typeof search === "string" ? search : "",
          // SortBy: this.sort?.active == null ? "IntegrationID" : "IntegrationID",
          // SortOrder: this.sort?.direction == 'desc' ? this.sort.direction : 'desc',
          // SubjectID: this.subjectID,
          // IntegrationType: this.integrationType,
        };
        
        this.dataSource.loadData(this.criteriaId);

      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
  getNext(event: PageEvent) {
    this._competencyService.onCriteriaChanged.next(this.criteria);

  }

  onSortData(sort: Sort) {

    this._competencyService.onCriteriaChanged.next(this.criteria);
  }

  addintegration(): void {
    this.dialogRef = this._matDialog.open(CriteriaFormComponent, {
      panelClass: 'add-criteria',
      disableClose: true,
      data: {
        action: 'new',
        criteriaId : this.criteriaId
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

  editCriteria(integration): void {
    var self = this;
    this._competencyService.getCriteriabyid(integration.guid).then(response => {
      self.dialogRef = self._matDialog.open(CriteriaFormComponent, {
        panelClass: 'edit-criteria-form',
        disableClose: true,
        data: {
          integration: response,
          action: 'edit',
          criteriaId : this.criteriaId
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
  //         var _rubricConstruction: any = response.criteria;
  //       // const _rubricConstruction: any = response.criteria;

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
  deleteCriteria(criteria): void {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false,
      panelClass: 'delete-choice',
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._competencyService.deleteCriteria(criteria.guid);
      }
      this.confirmDialogRef = null;
    });

  }
  back(){
    this._location.back();
  }



}

export class CriteriaDataSource extends DataSource<RubricConstruction> {

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
    return this._competencyService.onCriteriaChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }

  loadData(rubricId:string) {
    var self = this;

    this._competencyService.getCriteriagrid(rubricId)
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
