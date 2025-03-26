import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentAttendenceReportComponent } from './assessment-attendence-report.component';

describe('AssessmentAttendenceReportComponent', () => {
  let component: AssessmentAttendenceReportComponent;
  let fixture: ComponentFixture<AssessmentAttendenceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentAttendenceReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentAttendenceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
