import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactsComponent } from './contacts/contacts.component';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { LeadsComponent } from './leads/leads.component';
import { CustomersComponent } from './customers/customers.component';
import { CrmdashboardComponent } from './crmdashboard/crmdashboard.component';

import { AlertsComponent } from './alerts/alerts.component';

import { RulesComponent } from './rules/rules.component';

import { SeeallresultComponent } from './seeallresult/seeallresult.component';

import { ReminderComponent } from './reminder/reminder.component';

import { MedicationadherenceComponent } from './medicationadherence/medicationadherence.component';

import { SecurityComponent } from './security/security.component';

import { CasemanagersComponent } from './casemanagers/casemanagers.component';

import { PatientsComponent } from './patients/patients.component';

import { AssignpatientComponent } from './assignpatient/assignpatient.component';

import { TermsComponent } from './terms/terms.component';

import { ImportcasemanagerComponent } from './importcasemanager/importcasemanager.component';

import { ImportpatientComponent } from './importpatient/importpatient.component';

import { AdherencealertComponent } from './adherencealert/adherencealert.component';

import { ImportfailurepatientComponent } from  './importfailurepatient/importfailurepatient.component';

import { ImportfailurecasemanagerComponent } from  './importfailurecasemanager/importfailurecasemanager.component';

import { CheckingdatatableComponent } from  './checkingdatatable/checkingdatatable.component';


const routes: Routes = [
    {
        path: 'patients',
        component: PatientsComponent
    },
    {
        path: 'contacts',
        component: ContactsComponent
    },
    {
        path: 'customers',
        component: CustomersComponent
    },
    {
        path: 'profile',
        component: CustomersComponent
    },
    {
        path: 'security',
        component: SecurityComponent
    },
    { 
        path: 'terms',
        component: TermsComponent
    }
];


/*
const routes: Routes = [
    {
        path: 'casemanagers',
        component: CasemanagersComponent
    },
    {
        path: 'patients',
        component: PatientsComponent
    },
    {
        path: 'assignpatient/:cmID',
        component: AssignpatientComponent
    },
    {
        path: 'contacts',
        component: ContactsComponent
    },
    {
        path: 'customers',
        component: CustomersComponent
    },
    {
        path: 'profile',
        component: CustomersComponent
    },
    {
        path: 'security',
        component: SecurityComponent
    },
    { 
            path: 'terms',
            component: TermsComponent
    },
    { 
            path: 'importcasemanager',
            component: ImportcasemanagerComponent
    },
    { 
            path: 'importpatient',
            component: ImportpatientComponent
    },
    { 
            path: 'adherencealert',
            component: AdherencealertComponent
    },
    { 
            path: 'importfailurecasemanager',
            component: ImportfailurecasemanagerComponent
    },
    { 
            path: 'importfailurepatient',
            component: ImportfailurepatientComponent
    },
    { 
            path: 'checkingdatatable',
            component: CheckingdatatableComponent
    },
];
*/

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CRMRoutingModule {}
