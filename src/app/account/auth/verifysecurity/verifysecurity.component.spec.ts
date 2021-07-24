import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifysecurityComponent } from './verifysecurity.component';

describe('VerifysecurityComponent', () => {
  let component: VerifysecurityComponent;
  let fixture: ComponentFixture<VerifysecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifysecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifysecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
