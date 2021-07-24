import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportcasemanagerComponent } from './importcasemanager.component';

describe('ImportcasemanagerComponent', () => {
  let component: ImportcasemanagerComponent;
  let fixture: ComponentFixture<ImportcasemanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportcasemanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportcasemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
