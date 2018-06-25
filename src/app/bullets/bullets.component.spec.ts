import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletsComponent } from './bullets.component';

describe('BulletsComponent', () => {
  let component: BulletsComponent;
  let fixture: ComponentFixture<BulletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
