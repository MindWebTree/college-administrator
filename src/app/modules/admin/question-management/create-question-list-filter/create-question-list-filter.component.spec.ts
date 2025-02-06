import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionListFilterComponent } from './create-question-list-filter.component';

describe('CreateQuestionListFilterComponent', () => {
  let component: CreateQuestionListFilterComponent;
  let fixture: ComponentFixture<CreateQuestionListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuestionListFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateQuestionListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
