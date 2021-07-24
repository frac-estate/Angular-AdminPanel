import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UIModule } from '../../../shared/ui/ui.module';
import { LoginComponent } from '../login/login.component';
import { LoginRoutingModule } from './login-routing';

/*
import { SignupComponent } from './signup/signup.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { VerifyComponent } from './verify/verify.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
*/

import { NumberDirective } from '../numbers-only.directive';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


import { CountdownTimerModule } from 'ngx-countdown-timer';
import { CountdownModule } from 'ngx-countdown';

/*
import { VerifysecurityComponent } from './verifysecurity/verifysecurity.component';
import { ContactsupportComponent } from './contactsupport/contactsupport.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { ActivateComponent } from './activate/activate.component';
import { CreateSecurityComponent } from './create-security/create-security.component';
import { ErrorComponent } from './error/error.component';
import { TermsComponent } from './terms/terms.component';
import { MainloginComponent } from './mainlogin/mainlogin.component';
import { MainloginComponent } from './mainlogin/mainlogin.component';
*/

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule,
    UIModule,
    LoginRoutingModule,    
    CountdownTimerModule.forRoot(),
    CountdownModule,
    NgSelectModule,
    NgbDropdownModule,
  ]
})
export class LoginModule { }
