import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportpatientComponent } from './importpatient.component';

describe('ImportpatientComponent', () => {
  let component: ImportpatientComponent;
  let fixture: ComponentFixture<ImportpatientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportpatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportpatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
