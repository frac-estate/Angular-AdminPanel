import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitdetailmodalComponent } from './visitdetailmodal.component';

describe('VisitdetailmodalComponent', () => {
  let component: VisitdetailmodalComponent;
  let fixture: ComponentFixture<VisitdetailmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitdetailmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitdetailmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
