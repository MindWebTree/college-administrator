import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [MatIconModule, MatStepperModule],
  templateUrl: './exam-list.component.html',
  styleUrl: './exam-list.component.scss'
})
export class ExamListComponent {
  deleteExam(){}
  openReportCard(){}
}
