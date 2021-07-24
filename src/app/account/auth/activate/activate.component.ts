import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';


import { CookieService } from '../../../core/services/cookie.service';

//import { environment } from '../../../../environments/environment';

import { ConfigService } from '../../../config.service';
import { AppConfig } from '../../../app-config';

import { LocationStrategy } from '@angular/common';
@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {

  config: AppConfig;
  
  BaseURL = '';

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  userEmail: any;
  
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,private http: HttpClient, private cookieService: CookieService,private configService: ConfigService, private location: LocationStrategy) { }

  ngOnInit() {
    
    this.config = this.configService.readConfig();
    localStorage.setItem("SH360_API_URL",this.config.baseUrl);
    localStorage.setItem('SH360_WEBSOCKET_URL',this.config.websocketBaseUrl+'/socket/provider');
    localStorage.setItem('SH360_API_CHAT_URL',this.config.webbaseUrl);
    localStorage.setItem("SH360_API_PROVIDER_URL",this.config.providerbaseUrl);
    localStorage.setItem("SH360_API_CHAT_URL",this.config.chatbaseUrl);
    localStorage.setItem("SH360_API_SOCKET_URL",this.config.socketIOBaseUrl);
    console.log("this.config",this.config);


    this.BaseURL = localStorage.getItem("SH360_API_URL");

    //this.BaseURL = 'http://3.94.31.236:11008/cm';
 
    this.userEmail = this.route.snapshot.queryParams['email'] || '/';

    console.log(this.userEmail);
  
    this.onSubmit();

  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
    //document.body.classList.add('authentication-bg-pattern');
  }

  // convenience getter for easy access to form fields
  get f() { return this.resetForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.success = '';
    this.submitted = true;
 
    this.loading = true;
 
    /* Dummy:start * /
    const forgotloginUser = {
      "_id": "6045c6e9bb279d36a0e2e6f9",
      "userId": "e3d0c2cd-6fd6-435c-99a0-07fd3c8dd1a6",
      "validUser": true
    };
    localStorage.setItem('forgotloginUser',JSON.stringify(forgotloginUser));
    this.router.navigate(['/account/verify-security']);
    /* Dummy:end */


    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
  
   const email = this.userEmail;
   const userType = 'Entity-Admin';
 
    //let apiurl = this.BaseURL+'/user/password/forgot';

    let apiurl = this.BaseURL+'/admin/validate/email?email='+email+'&userType='+userType+'&verifyEmail=yes';

    console.log('apiurl',apiurl);
      
    this.http.get(apiurl, { headers: headers })
    .subscribe(
      data => {
        const dt = data;
        console.log(dt);
        /*
        console.log(dt['errorCode']);
        console.log(dt['payload']);
        console.log(dt);
        */

       if(dt['errorCode']){
         this.error = dt['message'];
         this.success = '';
       } else if(dt['payload']){
         console.log(dt['payload']);

         const payload = dt['payload'];
         localStorage.setItem('forgotloginUser',JSON.stringify(payload));

          const status = payload.status;
          
          if(status && status === 'ACTIVATED') {

            this.error = 'User Already Exists';
            this.success = '';
            this.router.navigate(['/account/error']);
           
            /*
            if(payload.questionsEnabled) {
              this.error = 'User Already Exists';
              this.success = '';
              this.router.navigate(['/account/error']);
            } else {
              this.error = 'You have not added security questions. Please add...';
              this.success = '';
              this.router.navigate(['/account/create-security']);
            }
            */

          } else {

            this.error = '';
            this.success = 'An email has been sent with temporary password';
            this.router.navigate(['/account/create-password']);

          }

         
       }

       this.loading = false;
       return false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );
    

    /*
    console.log(this.resetForm.value);
    setTimeout(() => {
      this.loading = false;
      this.success = 'We have sent you an email containing a link to reset your password';
    }, 1000);
    */
  }
  


  onSubmitXYZ() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;

    console.log(this.resetForm.value);
    setTimeout(() => {
      this.loading = false;
      this.success = 'We have sent you an email containing a link to reset your password';
    }, 1000);
  }
}
