import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHODComponent } from './list-hod.component';

describe('ListHODComponent', () => {
  let component: ListHODComponent;
  let fixture: ComponentFixture<ListHODComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHODComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListHODComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
