import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportfailurepatientComponent } from './importfailurepatient.component';

describe('ImportfailurepatientComponent', () => {
  let component: ImportfailurepatientComponent;
  let fixture: ComponentFixture<ImportfailurepatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportfailurepatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportfailurepatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
