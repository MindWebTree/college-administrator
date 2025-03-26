import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendIAReportComponent } from './send-iareport.component';

describe('SendIAReportComponent', () => {
  let component: SendIAReportComponent;
  let fixture: ComponentFixture<SendIAReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendIAReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendIAReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
