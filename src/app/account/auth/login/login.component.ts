import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../../core/services/cookie.service';

//import { environment } from '../../../../environments/environment';

import { ConfigService } from '../../../config.service';
import { AppConfig } from '../../../app-config';

import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  config: AppConfig;

  BaseURL = '';

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  loading = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService, private http: HttpClient, private cookieService: CookieService,private configService: ConfigService, private location: LocationStrategy) {

                 // preventing back button in browser implemented by "Samba Siva"  
                 history.pushState(null, null, window.location.href);  
                 this.location.onPopState(() => {
                   history.pushState(null, null, window.location.href);
                 });  

               }

  ngOnInit() {
    
    this.config = this.configService.readConfig();
    localStorage.setItem("SH360_API_URL",this.config.baseUrl);
    localStorage.setItem('SH360_WEBSOCKET_URL',this.config.websocketBaseUrl+'/socket/provider');
    localStorage.setItem('SH360_API_CHAT_URL',this.config.webbaseUrl);
    localStorage.setItem("SH360_API_PROVIDER_URL",this.config.providerbaseUrl);
    localStorage.setItem("SH360_API_CHAT_URL",this.config.chatbaseUrl);
    localStorage.setItem("SH360_API_SOCKET_URL",this.config.socketIOBaseUrl);
    console.log("this.config",this.config);
    /*    
    localStorage.setItem("SH360_API_URL",environment.baseUrl);
    localStorage.setItem('SH360_WEBSOCKET_URL',environment.websocketBaseUrl+'/socket/provider');
    localStorage.setItem('SH360_WEB_URL',environment.webbaseUrl);
    */  

    this.BaseURL = localStorage.getItem("SH360_API_URL");

    //this.BaseURL = 'http://3.94.31.236:11008/cm';

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
    //document.body.classList.add('authentication-bg-pattern');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) { 
      return;
    }
    else
    {
      this.loading = true;

 
      const headers = new HttpHeaders;
      headers.append('Content-Type', 'application/json');
  
      let postDataX = {
        "email": this.f.email.value,
        "password": this.f.password.value
      };

      let postData = {
        "username": this.f.email.value,
        "password": this.f.password.value
      }



      let apiurl = this.BaseURL+'/admin/validate';
     
    
    this.http.post(apiurl, postData, { headers: headers })
    .subscribe(
      data => {
        
        const dt = data;
        console.log('dt',dt)
       if(dt['payload']){
         console.log('payload', dt['payload']);

         const payload = dt['payload'];

         if(payload.questionsEnabled) {
          

          const loginUser = dt['payload'];
          const user = {"validUser":true};
          this.cookieService.setCookie('loginUser', JSON.stringify(user), 1);
          localStorage.setItem('loginUser',JSON.stringify(loginUser));
         
         if(payload.isTwoFactorEnabled) {
          this.router.navigate(['/account/verify']);
         } else {
          const currentUser = dt['payload'];
          const user = {"validUser":true};
          this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
          localStorage.setItem('currentUser',JSON.stringify(currentUser));
          this.router.navigate(["/crm/patients"]);
         }

          } else {

            localStorage.setItem('forgotloginUser',JSON.stringify(payload));
            this.error = 'You have not added security questions. Please add...';
            this.router.navigate(['/account/create-security']);

          }
          
         return;
         
         // store user details and jwt in cookie
        //this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
        //this.router.navigate([this.returnUrl]);

       }
       else
       {
        this.error = 'Invalid Login';
        this.error = dt['message'];
        
        this.loading = false;
       }

        return false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );

 

      /*

      let user = {
        "_id": "5f0450a4c75d0a426ebfc1fd",
        "mobile": "2424356721",
        "userId": "5efdc1f3c75d0a426eba036d",
        "entity": "5f312503e448f355fe86ed53",
        "validUser": true,
        "loggedUser": "0ffa67ed-397d-4940-9a32-03a2deb17647",
        "username": "bruce@gmail.com",
        "password": "70dbe131ebe4b2b7762a4b6d2f6fb5b6640b80716deffd0fdd608eb94f879e03",
        "activationCode": "224625",
        "createdAt": "2020-07-07T10:53:01.282Z",
        "updatedAt": "2020-07-07T10:53:01.282Z"
      };   

      this.cookieService.setCookie('loginUser', JSON.stringify(user), 1);
      this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);

      this.router.navigate(['/account/verify']);
      return;
      */

    }
 
    this.loading = true;
      
  }
}
