import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricFormComponent } from './rubric-form.component';

describe('RubricFormComponent', () => {
  let component: RubricFormComponent;
  let fixture: ComponentFixture<RubricFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubricFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RubricFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
