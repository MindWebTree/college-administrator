import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCompetencyListComponent } from './student-competency-list.component';

describe('StudentCompetencyListComponent', () => {
  let component: StudentCompetencyListComponent;
  let fixture: ComponentFixture<StudentCompetencyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCompetencyListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentCompetencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
