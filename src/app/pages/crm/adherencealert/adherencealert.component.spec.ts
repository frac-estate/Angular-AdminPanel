import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdherencealertComponent } from './adherencealert.component';

describe('AdherencealertComponent', () => {
  let component: AdherencealertComponent;
  let fixture: ComponentFixture<AdherencealertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdherencealertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdherencealertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
