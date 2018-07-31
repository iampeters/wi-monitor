import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerloginComponent } from './viewerlogin.component';

describe('ViewerloginComponent', () => {
  let component: ViewerloginComponent;
  let fixture: ComponentFixture<ViewerloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
