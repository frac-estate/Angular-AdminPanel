import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '../../shared/ui/ui.module';
import { NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AlertRoutingModule } from './alert-routing.module';

import { AlertsComponent } from './alerts/alerts.component';
import { RulesComponent } from './rules/rules.component';
import { AlertdashboardComponent } from './alertdashboard/alertdashboard.component';

@NgModule({
  declarations: [AlertsComponent, RulesComponent, AlertdashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    NgbModalModule,
    NgbPaginationModule,
    NgApexchartsModule,
    NgbTypeaheadModule,
    AlertRoutingModule,
    Ng2SearchPipeModule
  ]
})
export class AlertModule { }
