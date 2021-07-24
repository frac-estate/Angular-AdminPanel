import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportfailurecasemanagerComponent } from './importfailurecasemanager.component';

describe('ImportfailurecasemanagerComponent', () => {
  let component: ImportfailurecasemanagerComponent;
  let fixture: ComponentFixture<ImportfailurecasemanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportfailurecasemanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportfailurecasemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
