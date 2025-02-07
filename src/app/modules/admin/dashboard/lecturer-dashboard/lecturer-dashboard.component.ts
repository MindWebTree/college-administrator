import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexOptions, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DashboardService } from '../dashboard.service';
import { CommanService } from 'app/modules/common/comman.service';
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
  selector: 'app-lecturer-dashboard',
  standalone: true,
  imports: [MatTableModule, CarouselModule, CommonModule, MatFormFieldModule, MatIconModule, MatSelectModule, MatInputModule, MatChipsModule, NgApexchartsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lecturer-dashboard.component.html',
  styleUrl: './lecturer-dashboard.component.scss'
})
export class LecturerDashboardComponent implements OnInit {
  qBankTypes: any = [];
  courseYear: any = [];
  subject: any = [];
  today = new Date();
  TopSubjects: any = [];
  selectedTopSubjects: any;
  courseList: any[] = [];
  selectedExamOverviewGuidName: any;
  _userAccount: any
  @ViewChild("linearchart") linearChart: ChartComponent;
  public linearChartOptions: ApexOptions = {};
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ApexOptions = {};
  constructor(private _dashboard: DashboardService, private _commanService: CommanService, private _helperService: helperService) {

  }
  ngOnInit(): void {
    this._userAccount = this._helperService.getUserDetail();

    this._dashboard.getSubjectQbanksCoures().subscribe((responce) => {
      this.qBankTypes = responce.qBankTypes;
      this.courseYear = responce.courseYear;
      this.subject = responce.subject;
    })
    this.studentNaivgation();
  }
  studentNaivgation(): void {
    this._commanService.getstudentNavigationList().subscribe({
      next: (res) => {
        this.courseList = res;

        if (this.courseList.length > 0) {
          const defaultGuid = this.courseList[0].guid;
          this.selectedTopSubjects = defaultGuid;
          this.selectedExamOverviewGuidName = defaultGuid;
          this.fetchTopSubjectChartData(defaultGuid);
          this.fetchChartData(defaultGuid);
        }
      },
      error: (err) => console.error('Error loading courses:', err)
    });
  };
  //Top subjects Starts

  // Fetch subject-wise average marks using API
  fetchTopSubjectChartData(guid: string): void {
    this._dashboard.getLecturerSubjectWiseAvg(guid).subscribe({
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
          barHeight: "35%",
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
    this.fetchTopSubjectChartData(selectedGuid); // Fetch data for the selected course year
  }
  // top subjects ends

  // Fetch subject-wise average marks using API Ends

  // exam over flow apex chart and api
  onMonthSelected(event: any): void {
    const selectedGuid = event.value;
    if (selectedGuid) {
      this.fetchChartData(selectedGuid);
    }
  };

  fetchChartData(guid: string): void {
    this._dashboard.getLecturerOverView(guid).subscribe({
      next: (chartData) => {
        console.log('API Response:', chartData);
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
    const hasMultipleYears = new Set(chartData.map(item => item.yearCreated)).size > 1;
    const categories = sortedData.map(item => hasMultipleYears ?
      `${item.monthName} ${item.yearCreated}` : item.monthName);

    const dataPoints = sortedData.map(item => ({
      x: hasMultipleYears ? `${item.monthName} ${item.yearCreated}` : item.monthName,
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
          columnWidth: '60%',
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

    console.log('Updated Chart Options:', this.chartOptions);

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

  // --owl carosurl--ends

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1,
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

  ListSubject: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['<', '>'],
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
  // --owl carosoul ends--
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    // this._unsubscribeAll.next(true);
    // this._unsubscribeAll.complete();
  }
}
