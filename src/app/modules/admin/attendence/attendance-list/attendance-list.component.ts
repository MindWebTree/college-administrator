// import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

// import { GridComponent, GridModule, ToolbarItems} from '@syncfusion/ej2-angular-grids';
// import { ClickEventArgs, ContextMenuAllModule, ToolbarAllModule, TreeViewModule } from '@syncfusion/ej2-angular-navigations';
// import { Query } from '@syncfusion/ej2-data';
// import { DataSource } from '@angular/cdk/collections';
// import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, finalize, Observable, of, Subject, takeUntil } from 'rxjs';
// import { MatTableDataSource } from '@angular/material/table';
// import { AttendanceService } from '../attendance.service';
// import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
// import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { MatSort, Sort } from '@angular/material/sort';
// import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
// import { MatInput } from '@angular/material/input';
// import moment from 'moment';
// import { SitePreference } from 'app/core/auth/app.configs';
// import { AttendanceGridFilter, AttendanceLogger } from '../attendance.model';
// import { CommonModule } from '@angular/common';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';


// @Component({
//   selector: 'app-attendance-list',
//   standalone: true,
//   imports: [CommonModule,
//         // ScheduleAllModule,
//         // RecurrenceEditorAllModule,
//         // NumericTextBoxAllModule,
//         // TextBoxAllModule,
//         // DatePickerAllModule,
//         // TimePickerAllModule,
//         // DateTimePickerAllModule,
//         // CheckBoxAllModule,
//         ToolbarAllModule,
//         // DropDownListAllModule,
//         ContextMenuAllModule,
//         // MaskedTextBoxModule,
//         // UploaderAllModule,
//         // MultiSelectAllModule,
//         TreeViewModule,
//         // ButtonAllModule,
//         // DropDownButtonAllModule,
//         // SwitchAllModule,
//         // ToastAllModule,
//         MatIconModule,
//         GridModule,
//         MatPaginatorModule,
//         // DateRangePickerModule,
//         MatDatepickerModule,
//         // MomentModule.forRoot({
//         //     relativeTimeThresholdOptions: {
//         //         'm': 59
//         //     }
//         // }),
//         MatFormFieldModule],
//   templateUrl: './attendance-list.component.html',
//   styleUrl: './attendance-list.component.scss'
// })
// export class AttendanceListComponent {
//   public toolbarOptions: ToolbarItems[];
//   public queryClone: any;
//   dataSource: AttendanceLoggerDataSource;
//   private _unsubscribeAll: Subject<any>;
//   _sitePreference: any = SitePreference;
//   search = '';
//   dStart = '';
//   dEnd = '';
  
//   @ViewChild('StartDate', { static: true }) StartDate: MatInput;
//   @ViewChild('grid', { static: true }) grid: GridComponent;

//   public presets = [
//       { label: 'Today', start: new Date(), end: new Date() },
//       { label: 'This Month', start: new Date(new Date().setDate(1)), end: new Date() }
//   ];

//   searchInput: FormControl;
//   gridData: any;

//   ngOnInit(): void {
//       var self = this;
//       this.toolbarOptions = ['PdfExport', 'ExcelExport'];
//       this.dataSource = new AttendanceLoggerDataSource(this._attendanceService);

      
//       this._attendanceService.onAttendanceLoggerChanged
//           .pipe(takeUntil(this._unsubscribeAll))
//           .subscribe(search => {
//               this.search = search;

//               let gridFilter: AttendanceGridFilter = {
//                   PageNumber: 1,
//                   PageSize: 1000,
//                   Search: typeof search === "string" ? search : "",
//                   SortBy: '',
//                   SortOrder: '',
//                   StartDate: this.dStart,
//                   EndDate: this.dEnd,
//                   Type: 0,
//                   TypeID: 0,
//                   ExamID: 0
//               };

//               //this.dataSource.loadData(gridFilter);
//               this.getAttendanceReport(gridFilter);
//           });

//   }
//   addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
//       this.dStart = moment(event.value).format("YYYY-MM-DD") + 'T00:00:00Z';
//       this.dEnd =  moment(event.value).format("YYYY-MM-DD") + 'T23:59:59Z';
//       this._attendanceService.onAttendanceLoggerChanged.next(type);
//   }


//   constructor(private _attendanceService: AttendanceService,
//       private fb: FormBuilder) {
//       var self = this;
//       // Set the defaults
//       this.searchInput = new FormControl('');

//       // Set the private defaults
//       this._unsubscribeAll = new Subject();
//   }

//   controlStatus(control: AbstractControl) {
//       return {
//           dirty: control.dirty,
//           pristine: control.pristine,
//           touched: control.touched,
//           valid: control.valid,
//           value: control.value,
//           errors: control.errors,
//       }
//   }

//   load() {
//       const rowHeight: number = this.grid.getRowHeight();  // height of the each row
//       const gridHeight: any = this.grid.height;  // grid height
//       const pageSize: number = this.grid.pageSettings.pageSize;   // initial page size
//       const pageResize: any = (gridHeight - (pageSize * rowHeight)) / rowHeight; // new page size is obtained here
//       this.grid.pageSettings.pageSize = pageSize + Math.round(pageResize);
//   }

//   loadPage() {
//       this._attendanceService.onAttendanceLoggerChanged.next(this._attendanceService.attendance);
//   }


//   getNext(event: PageEvent) {
//       this._attendanceService.onAttendanceLoggerChanged.next(this._attendanceService.attendance);

//   }


//   onSortData(sort: Sort) {

//       this._attendanceService.onAttendanceLoggerChanged.next(this._attendanceService.attendance);
//   }

//   toolbarClick(args: ClickEventArgs): void {
//       if (args.item.id === 'Grid_pdfexport') {
//           this.queryClone = this.grid.query;
//           this.grid.query = new Query().addParams('recordcount', '12');
//           this.grid.pdfExport();
//       } else if (args.item.id === 'Grid_excelexport') {
//           this.queryClone = this.grid.query;
//           this.grid.query = new Query().addParams('recordcount', '12');
//           this.grid.excelExport();
//       }
//   }

//   pdfExportComplete(): void {
//       this.grid.query = this.queryClone;
//   }
//   excelExportComplete(): void {
//       this.grid.query = this.queryClone;
//   }

//   getAttendanceReport(gridFilter) {
//       var self = this;
//       this._attendanceService.getAttendanceLoggerForGrid(gridFilter)
//           .pipe(
//               catchError(() => of([])),
//               finalize(() => {

//               })
//           )
//           .subscribe(response => {
//               self.gridData = response.data;
//           })
//   }
// }
// export class AttendanceLoggerDataSource extends DataSource<AttendanceLogger>
// {

//   private loadingSubject = new BehaviorSubject<boolean>(false);
//   public paginationData: any;
//   public loading$ = this.loadingSubject.asObservable();
//   public data: MatTableDataSource<AttendanceLogger>;
//   /**
//    * Constructor
//    *
//    * @param {AttendanceLoggersService} _attendanceService
//    */
//   constructor(
//       private _attendanceService: AttendanceService
//   ) {
//       super();
//   }

//   /**
//    * Connect function called by the table to retrieve one stream containing the data to render.
//    * @returns {Observable<any[]>}
//    */
//   connect(): Observable<any[]> {
//       return this._attendanceService.onAttendanceLoggerChanged;
//   }

//   /**
//    * Disconnect
//    */
//   disconnect(): void {
//   }

//   loadData(gridFilter: AttendanceGridFilter) {
//       var self = this;
      
//       this._attendanceService.getAttendanceLoggerForGrid(gridFilter)
//           .pipe(
//               catchError(() => of([])),
//               finalize(() => {
//                   this.loadingSubject.next(false)
//               })
//           )
//           .subscribe(response => {
//               this.data = new MatTableDataSource(response.data);


//               self.paginationData = {
//                   count: response.Data.Count || 0,
//                   pageNumber: response.Data.CurrentFilter == undefined ? 0 : response.Data.CurrentFilter.PageNumber,
//                   data: response.data
//               };


//           });
//   }
// }
