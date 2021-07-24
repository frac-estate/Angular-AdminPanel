import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingdatatableComponent } from './checkingdatatable.component';

describe('CheckingdatatableComponent', () => {
  let component: CheckingdatatableComponent;
  let fixture: ComponentFixture<CheckingdatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingdatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingdatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
