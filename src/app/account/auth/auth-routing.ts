import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { VerifyComponent } from './verify/verify.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { VerifysecurityComponent } from './verifysecurity/verifysecurity.component';
import { ContactsupportComponent } from './contactsupport/contactsupport.component';

import { CreatePasswordComponent } from './create-password/create-password.component';
import { ActivateComponent } from './activate/activate.component';

import { CreateSecurityComponent } from './create-security/create-security.component';

import { ErrorComponent } from './error/error.component';

import { TermsComponent } from './terms/terms.component';
import { MainloginComponent } from './mainlogin/mainlogin.component';

const routes: Routes = [
    { 
        path: '', 
        component:MainloginComponent,
        children: [
                    {
                        path: 'login',
                        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
                    },
                    {
                        path: 'signup',
                        component: SignupComponent
                    },
                    {
                        path: 'confirm',
                        component: ConfirmComponent
                    },
                    {
                        path: 'reset-password',
                        component: PasswordresetComponent
                    },
                    {
                        path: 'verify-security',
                        component: VerifysecurityComponent
                    },
                    {
                        path: 'verify',
                        component: VerifyComponent
                    },
                    {
                        path: 'update-password',
                        component: UpdatePasswordComponent
                    },
                    {
                        path: 'contact-support',
                        component: ContactsupportComponent
                    },
                    {
                        path: 'activate',
                        component: ActivateComponent
                    },
                    {
                        path: 'create-password',
                        component: CreatePasswordComponent
                    },
                    {
                        path: 'create-security',
                        component: CreateSecurityComponent
                    },
                    {
                        path: 'error',
                        component: ErrorComponent
                    },
                    {
                        path: 'terms',
                        component: TermsComponent
                    },
                ]
            },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
