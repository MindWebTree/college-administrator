import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedExamListComponent } from './created-exam-list.component';

describe('CreatedExamListComponent', () => {
  let component: CreatedExamListComponent;
  let fixture: ComponentFixture<CreatedExamListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedExamListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatedExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
