import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerStudentListComponent } from './lecturer-student-list.component';

describe('LecturerStudentListComponent', () => {
  let component: LecturerStudentListComponent;
  let fixture: ComponentFixture<LecturerStudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LecturerStudentListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LecturerStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
