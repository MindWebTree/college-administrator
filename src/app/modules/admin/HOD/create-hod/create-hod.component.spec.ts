import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHODComponent } from './create-hod.component';

describe('CreateHODComponent', () => {
  let component: CreateHODComponent;
  let fixture: ComponentFixture<CreateHODComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHODComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateHODComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
