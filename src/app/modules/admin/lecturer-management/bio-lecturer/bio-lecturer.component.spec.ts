import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioLecturerComponent } from './bio-lecturer.component';

describe('BioLecturerComponent', () => {
  let component: BioLecturerComponent;
  let fixture: ComponentFixture<BioLecturerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BioLecturerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BioLecturerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
