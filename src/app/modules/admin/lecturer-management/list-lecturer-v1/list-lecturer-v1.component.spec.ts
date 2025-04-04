import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLecturerV1Component } from './list-lecturer-v1.component';

describe('ListLecturerV1Component', () => {
  let component: ListLecturerV1Component;
  let fixture: ComponentFixture<ListLecturerV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLecturerV1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListLecturerV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
