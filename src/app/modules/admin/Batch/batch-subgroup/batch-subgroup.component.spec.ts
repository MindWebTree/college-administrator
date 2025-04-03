import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchSubgroupComponent } from './batch-subgroup.component';

describe('BatchSubgroupComponent', () => {
  let component: BatchSubgroupComponent;
  let fixture: ComponentFixture<BatchSubgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchSubgroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatchSubgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
