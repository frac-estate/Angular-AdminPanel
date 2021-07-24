import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasemanagersComponent } from './casemanagers.component';

describe('CasemanagersComponent', () => {
  let component: CasemanagersComponent;
  let fixture: ComponentFixture<CasemanagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasemanagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasemanagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
