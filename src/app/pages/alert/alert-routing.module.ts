import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RulesComponent } from './rules/rules.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AlertdashboardComponent } from './alertdashboard/alertdashboard.component';

const routes: Routes = [
    {
        path: 'dashboard',
    component: AlertdashboardComponent
    },
    {
        path: 'rules',
        component: RulesComponent
    },
    {
        path: 'alerts',
        component: AlertsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AlertRoutingModule {}
