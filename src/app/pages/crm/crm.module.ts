import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '../../shared/ui/ui.module';
import { NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { CRMRoutingModule } from './crm-routing.module';

import { ContactsComponent } from './contacts/contacts.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { LeadsComponent } from './leads/leads.component';
import { CustomersComponent } from './customers/customers.component';
import { CrmdashboardComponent } from './crmdashboard/crmdashboard.component';

import { AlertsComponent } from './alerts/alerts.component';

import { RulesComponent } from './rules/rules.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { FileUploadModule } from '@iplab/ngx-file-upload';

import { FilterPipe} from './filter.pipe';


import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng5SliderModule } from 'ng5-slider';
import { SeeallresultComponent } from './seeallresult/seeallresult.component';
import { VisitdetailmodalComponent } from './visitdetailmodal/visitdetailmodal.component';
import { ReminderComponent } from './reminder/reminder.component';


import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting

import { Ng2GoogleChartsModule } from 'ng2-google-charts';

import { DataTablesModule } from 'angular-datatables';
import { MedicationadherenceComponent } from './medicationadherence/medicationadherence.component';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';


import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

//import {MatProgressBarModule} from '@angular/material';
import {ProgressBarModule} from 'angular-progress-bar';

import {Ng2TelInputModule} from 'ng2-tel-input';

import { DualListBoxModule } from 'ng2-dual-list-box';


import { SocketService } from './socket.service';

import { NgbCustomDateParserFormatter } from './ngb-custom-date-parser-formatter';

import { TooltipModule } from 'ng2-tooltip-directive';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { CountdownTimerModule } from 'ngx-countdown-timer';
import { SecurityComponent } from './security/security.component';
import { CasemanagersComponent } from './casemanagers/casemanagers.component';
import { PatientsComponent } from './patients/patients.component';
import { AssignpatientComponent } from './assignpatient/assignpatient.component';
import { TermsComponent } from './terms/terms.component';
import { ImportcasemanagerComponent } from './importcasemanager/importcasemanager.component';
import { ImportpatientComponent } from './importpatient/importpatient.component';
import { AdherencealertComponent } from './adherencealert/adherencealert.component';
import { ImportfailurepatientComponent } from './importfailurepatient/importfailurepatient.component';
import { ImportfailurecasemanagerComponent } from './importfailurecasemanager/importfailurecasemanager.component';
import { CheckingdatatableComponent } from './checkingdatatable/checkingdatatable.component';

@NgModule({
  declarations: [ContactsComponent, OpportunitiesComponent, LeadsComponent, CustomersComponent, CrmdashboardComponent, AlertsComponent, RulesComponent, FilterPipe, SeeallresultComponent, VisitdetailmodalComponent, ReminderComponent, MedicationadherenceComponent, SecurityComponent, CasemanagersComponent, PatientsComponent, AssignpatientComponent, TermsComponent, ImportcasemanagerComponent, ImportpatientComponent, AdherencealertComponent, ImportfailurepatientComponent, ImportfailurecasemanagerComponent, CheckingdatatableComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbModalModule,
    NgbPaginationModule,
    NgApexchartsModule,
    NgbTypeaheadModule,
    CRMRoutingModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    Ng5SliderModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    Ng2GoogleChartsModule,
    DataTablesModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbAlertModule,
    ProgressBarModule,
    Ng2TelInputModule,
    TooltipModule,
    CountdownTimerModule.forRoot(),
    DualListBoxModule.forRoot(),
    FileUploadModule,
    NgbModule,
  ],
  providers: [SocketService,{
    provide: NgbDateParserFormatter,
    useValue: new NgbCustomDateParserFormatter("MM-DD-YYYY") 
}],
})
export class CRMModule { }
