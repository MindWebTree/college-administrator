import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceGameViewComponent } from './audience-game-view.component';

describe('AudienceGameViewComponent', () => {
  let component: AudienceGameViewComponent;
  let fixture: ComponentFixture<AudienceGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceGameViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudienceGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
