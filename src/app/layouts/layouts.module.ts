import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';

import { UIModule } from '../shared/ui/ui.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { FooterComponent } from './footer/footer.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';

import { NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LayoutComponent, SidebarComponent, TopbarComponent, FooterComponent, RightsidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    ClickOutsideModule,
    UIModule,
    NgbModalModule,    
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot(),
    NgbAlertModule
  ]
})
export class LayoutsModule { }
