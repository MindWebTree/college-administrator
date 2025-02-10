import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, TitleStrategy } from '@angular/router';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexOptions, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import { Subject } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommanService } from 'app/modules/common/comman.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { helperService } from 'app/core/auth/helper';
export type linearChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatTableModule, CarouselModule, CommonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatChipsModule, NgApexchartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  title = "Dashboard"
  @ViewChild("linearchart") linearChart: ChartComponent;
  @ViewChild("pieChart") pieChart: ChartComponent;
  @ViewChild("chart") chart: ChartComponent;
  public linearChartOptions: ApexOptions = {};
  public chartOptions: ApexOptions = {};
  pieChartOptions: ApexOptions = {};
  _userAccount: any;
  qbankTypes: any = [];
  questionCreator: any = [];
  dataSource = new MatTableDataSource<any>();
  // selected = '1';
  // course: any
  // data: any;
  TopSubjects: any = []; //for dummy data
  ExamsOverview: any = [];//for dummy data
  selectedTopSubjects: any //for dummy data
  selectedExamOverView: any //for dummy data
  // selectedProject: string = 'ACME Corp. Backend App';
  columns: string[] = ['Name', 'Qbank', 'ApprovedQst', 'Used.Quest', 'Status'];
  courseList: any[] = [];
  selectedExamOverview: any = '';
  selectedExamOverviewGuid: any
  courseYear: any = [];
  subject: any = [];
  today = new Date();
  ListSubject: OwlOptions
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _dashboard: DashboardService,
    private _commanService: CommanService,
    private _router: Router,
    private _helperService: helperService
  ) {

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._userAccount = this._helperService.getUserDetail();

    this._dashboard.getSubjectQbankTypesCourses().subscribe((responce: any) => {

      this.qbankTypes = responce.qBankTypes;
      this.courseYear = responce.courseYear;
      this.subject = responce.subject
      // Move the ListSubject assignment here
      this.ListSubject = {
        loop: this.subject.length > 1,  // Enable loop if more than 2 subjects
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        navSpeed: 700,
        navText: ['&rarr;', '&larr;'],
        responsive: {
          0: { items: 1 },
          400: { items: 2 },
          740: { items: 3 },
          1200: { items: 6 }
        },
        nav: true
      };
      this.updatePieChartOptions();
    });
    this._dashboard.getQuestionCreator().subscribe((res: any) => {

      this.dataSource.data = res;
    });
    this.studentNaivgation();

  }

  // donut pie chart starts
  updatePieChartOptions() {
    const totalQuestions = this.qbankTypes.reduce((total, item) => total + item.noOfQuestions, 0);

    const series = this.qbankTypes.map(item => (item.noOfQuestions / totalQuestions) * 100);
    const labels = this.qbankTypes.map(item => `${item.title} (${Math.round((item.noOfQuestions / totalQuestions) * 100)}%)`);

    this.pieChartOptions = {
      series: series,
      chart: {
        type: 'donut',
        height: 350,
        width: 350
      },
      labels: labels,
      colors: ['#c892f9', '#83efd1', '#f2ce6d'], // Optionally update based on your data
      responsive: [
        {
          breakpoint: 1920,
          options: {
            chart: {
              type: 'donut',
              height: 350,
              width: 1000  // Add explicit width
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };
  }
  // donut pie chart starts ends



  studentNaivgation(): void {
    this._commanService.getstudentNavigationList().subscribe({
      next: (res) => {
        this.courseList = res;
        if (this.courseList.length > 0) {
          const defaultGuid = this.courseList[0].guid;
          this.selectedTopSubjects = defaultGuid
          this.selectedExamOverviewGuid = defaultGuid;
          this.fetchLinerChartData(defaultGuid);
          this.fetchChartData(defaultGuid);

        }
      },
      error: (err) => console.error('Error loading courses:', err)
    });
  };

  // Fetch subject-wise average marks using API
  fetchLinerChartData(guid: string): void {
    this._dashboard.getSubjectWiseAvgMarks(guid).subscribe({
      next: (res) => {
        this.updateTopSubjectChart(res);
      },
      error: (err) => console.error('Error fetching chart data:', err)
    });
  }

  // Update the chart dynamically
  updateTopSubjectChart(data: any[]): void {
    const subjects = [];
    const subjectData = [];

    data.forEach(subject => {
      const fillColor =
        subject.averageMarks > 80
          ? "#7EE8CA"
          : subject.averageMarks > 60
            ? "#9BD7FF"
            : subject.averageMarks > 40
              ? "#FFDA9B"
              : "#FFB9AD";

      subjectData.push({
        x: subject.subjectName,
        y: Number(subject.averageMarks), // Ensure it's a number
        fillColor: fillColor
      });

      subjects.push(subject.subjectName);
    });

    this.linearChartOptions = {
      series: [
        {
          name: "Average Marks",
          data: subjectData,
        },
      ],
      chart: {
        type: "bar",
        height: 340,
        offsetY: -10,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
          barHeight: "10%",

        },
      },
      dataLabels: {
        enabled: true,
        offsetX: 25,
        formatter: function (val) {
          return val + "%";
        },
        style: {
          fontSize: "10px",
          colors: ["#505050"],
        },
      },
      xaxis: {
        categories: subjects,
      },
      yaxis: {
        min: 0,
        max: 100,
      },
    };
  }


  // Handle course selection change
  onYearSelected(selectedYear: any): void {
    const selectedGuid = selectedYear.value;
    this.fetchLinerChartData(selectedGuid); // Fetch data for the selected course year
  }

  // Fetch subject-wise average marks using API Ends

  // exam over flow apex chart and api
  onMonthSelected(event: any): void {
    const selectedGuid = event.value;
    if (selectedGuid) {
      this.fetchChartData(selectedGuid);
    }
  };

  fetchChartData(guid: string): void {
    this._dashboard.getExamByMonth(guid).subscribe({
      next: (chartData) => {

        if (Array.isArray(chartData)) {
          this.updateChartOptions(chartData);
        }
      },
      error: (err) => console.error('Error fetching chart data:', err)
    });
  };


  private updateChartOptions(chartData: any[]): void {
    // Sort data by yearCreated and monthName if needed
    const sortedData = [...chartData].sort((a, b) => {
      if (a.yearCreated !== b.yearCreated) {
        return a.yearCreated - b.yearCreated;
      }
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return months.indexOf(a.monthName) - months.indexOf(b.monthName);
    });

    // Format x-axis labels to include year if spans multiple years
    // const hasMultipleYears = new Set(chartData.map(item => item.yearCreated)).size > 1;
    // const categories = sortedData.map(item => hasMultipleYears ?
    //   `${item.monthName} ${item.yearCreated}` : item.monthName);
    // Always include year in x-axis labels

    const categories = sortedData.map(item => `${item.monthName} ${item.yearCreated}`);


    const dataPoints = sortedData.map(item => ({
      // x: hasMultipleYears ? `${item.monthName} ${item.yearCreated}` : item.monthName,
      x: `${item.monthName} ${item.yearCreated}`,
      y: item.count,
      fillColor: this.getColorByCount(item.count)
    }));

    this.chartOptions = {
      series: [{
        name: "Exams",
        data: dataPoints
      }],
      chart: {
        type: "bar",
        height: 350,
        width: '100%',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '10%',
          distributed: false
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 1
      },
      xaxis: {
        categories: categories,
        position: 'bottom',
        labels: {
          rotate: -45,
          rotateAlways: false,
          style: {
            fontSize: '12px'
          },
          trim: true
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        title: {
          // text: "Number of Exams"
        },
        labels: {
          formatter: function (val) {
            return Math.round(val).toString();
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return Math.round(val).toString() + " Exams";
          }
        }
      }
    };



    // Update chart
    if (this.chart && this.chart.updateOptions) {
      this.chart.updateOptions(this.chartOptions, true);
    }
  }


  private getColorByCount(count: number): string {
    if (count > 8) return '#7EE8CA';
    if (count > 6) return '#9BD7FF';
    if (count > 4) return '#FFDA9B';
    return '#FFB9AD';
  }
  // exam over flow apex chart and api ends


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['&rarr;', '&larr;'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      1200: {
        items: 5
      }
    },
    nav: true
  }
  // ListSubject: OwlOptions = {
  //   loop: true,
  //   mouseDrag: false,
  //   touchDrag: false,
  //   pullDrag: false,
  //   dots: false,
  //   navSpeed: 700,
  //   navText: ['<', '>'],
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     400: {
  //       items: 2
  //     },
  //     740: {
  //       items: 3
  //     },
  //     1200: {
  //       items: 5
  //     }
  //   },
  //   nav: true
  // }
}
