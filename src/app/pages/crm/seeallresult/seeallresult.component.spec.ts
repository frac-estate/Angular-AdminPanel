import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeallresultComponent } from './seeallresult.component';

describe('SeeallresultComponent', () => {
  let component: SeeallresultComponent;
  let fixture: ComponentFixture<SeeallresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeallresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeallresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
