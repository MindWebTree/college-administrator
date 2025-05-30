import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerViewComponent } from './answer-view.component';

describe('AnswerViewComponent', () => {
  let component: AnswerViewComponent;
  let fixture: ComponentFixture<AnswerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
