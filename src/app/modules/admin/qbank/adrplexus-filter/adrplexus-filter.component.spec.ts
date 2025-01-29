import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrplexusFilterComponent } from './adrplexus-filter.component';

describe('AdrplexusFilterComponent', () => {
  let component: AdrplexusFilterComponent;
  let fixture: ComponentFixture<AdrplexusFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdrplexusFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdrplexusFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
