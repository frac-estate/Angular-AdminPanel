import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationadherenceComponent } from './medicationadherence.component';

describe('MedicationadherenceComponent', () => {
  let component: MedicationadherenceComponent;
  let fixture: ComponentFixture<MedicationadherenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicationadherenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicationadherenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
