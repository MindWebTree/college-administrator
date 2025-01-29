import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdrplexusQbankComponent } from './adrplexus-qbank.component';

describe('AdrplexusQbankComponent', () => {
  let component: AdrplexusQbankComponent;
  let fixture: ComponentFixture<AdrplexusQbankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdrplexusQbankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdrplexusQbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
