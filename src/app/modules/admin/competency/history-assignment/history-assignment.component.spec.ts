import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAssignmentComponent } from './history-assignment.component';

describe('HistoryAssignmentComponent', () => {
  let component: HistoryAssignmentComponent;
  let fixture: ComponentFixture<HistoryAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryAssignmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
