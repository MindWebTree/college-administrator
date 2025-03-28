import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadtoS3Component } from './uploadto-s3.component';

describe('UploadtoS3Component', () => {
  let component: UploadtoS3Component;
  let fixture: ComponentFixture<UploadtoS3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadtoS3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadtoS3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
