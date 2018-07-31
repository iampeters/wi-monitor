import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GidComponent } from './gid.component';

describe('GidComponent', () => {
  let component: GidComponent;
  let fixture: ComponentFixture<GidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
