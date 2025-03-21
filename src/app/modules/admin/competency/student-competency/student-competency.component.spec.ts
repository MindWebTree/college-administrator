import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCompetencyComponent } from './student-competency.component';

describe('StudentCompetencyComponent', () => {
  let component: StudentCompetencyComponent;
  let fixture: ComponentFixture<StudentCompetencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCompetencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentCompetencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
