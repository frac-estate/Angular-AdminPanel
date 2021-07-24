import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../../core/services/cookie.service';
import { User } from '../../../core/models/auth.models';

import { LocationStrategy } from '@angular/common';

import {CountdownComponent} from 'ngx-countdown';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {

  BaseURL = '';

  user: User;
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  info = '';
  loading = false;

  UserInfo: any;

  ExpireTime: any;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  showResend: any;
  otpType:any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService, private http: HttpClient, private cookieService: CookieService, private location: LocationStrategy) {

                // preventing back button in browser implemented by "Samba Siva"  
                history.pushState(null, null, window.location.href);  
                this.location.onPopState(() => {
                  history.pushState(null, null, window.location.href);
                });  
                
               }

  ngOnInit() {
  
   
    this.UserInfo = JSON.parse(localStorage.getItem("loginUser"));

    this.BaseURL = localStorage.getItem("SH360_API_URL");

    //this.BaseURL = 'http://3.94.31.236:11008/cm';

    this.loginForm = this.formBuilder.group({
      verificationCode: ['', Validators.required],
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.ExpireTime = this.convertDateTodayDisplay();

    this.showResend = false;


    this.otpType = 'mobile';
  
  }

questions:any;  
private _fetchData() {

  const headers = new HttpHeaders;
  headers.append('Content-Type', 'application/json');
 
  
   //console.log(this.BaseURL+'/user/security/questions');
   //let apiurl = this.BaseURL+'/user/security/questions';
   let apiurl = 'http://localhost:11008/user/security/questions';
 
   console.log(apiurl);

   this.http.get(apiurl,{headers :headers}).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);
     this.questions = dt['payload'];
 
    });  
  
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
    this.error = '';
    this.info = '';
    console.log('VERIFY');
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);

    /*
    this.cookieService.setCookie('currentUser', JSON.stringify(loginUser), 1);
    localStorage.setItem('currentUser',JSON.stringify(loginUser)); 
    this.router.navigate(["/crm/seeallresult"]);
    */

    
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');

    var header =  { headers: headers };
    
  
    var header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization',  'Bearer '+loginUser.token)
    } 

  let postData = {
    "userId": loginUser.id,
    "verificationCode": this.f.verificationCode.value
   };
  

   console.log('postData',postData);

    //let apiurl = 'http://18.213.144.230:11006/api/user/validate/sms';

    //let apiurl = this.BaseURL+'/admin/validate/sms';

    let apiurl = this.BaseURL+'/admin/verify/otp';
     
    this.http.post(apiurl, postData, header)
    .subscribe(
      data => {
        
        const dt = data;
        console.log(dt);
        
       if(dt['payload']){
         console.log(dt['payload']);
         const currentUser = dt['payload'];
         const user = {"validUser":true};
         this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
         localStorage.setItem('currentUser',JSON.stringify(currentUser));
         //this.router.navigate(['/crm/messages']);
         //this.router.navigate(["/crm/dashboard"]);

         this.router.navigate(["/crm/patients"]);

     
       }
       else
       {
        this.error = 'Please enter the valid OTP';
        this.loading = false;
        this.submitted = false;
        this.f.verificationCode.setValue('');
       }
 
         
        return false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );
      
    this.loading = true;
   }

 
   resendCode() {
    this.otpType = 'mobile';

    console.log('resendCode');
    this.error = '';
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));    
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));

    console.log('loginUser',loginUser);
    console.log('Bearer','Bearer '+loginUser.token);
 
    let apiurl = this.BaseURL+'/admin/otp?userId='+loginUser.id+'&sendTo=mobile';

    
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
    
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  'Bearer '+loginUser.token)
    }
    console.log(apiurl);

       this.http.get(apiurl, header)
       .subscribe(
         data => {
            console.log(data);
            const dt = data; 
            const user = dt['payload'];
            this.info = dt['message'];
            this.showResend = false;
            this.restart();
           
         });
           
  }

  
  resendCodeEmail() {
    this.otpType = 'email';
    console.log('resendCodeEmail');
    this.error = '';
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));    
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));

    console.log('loginUser',loginUser);
    console.log('Bearer','Bearer '+loginUser.token);

    let apiurl = this.BaseURL+'/admin/otp?userId='+loginUser.id+'&sendTo=email';

    
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
    
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  'Bearer '+loginUser.token)
    }
    console.log(apiurl);

       this.http.get(apiurl, header)
       .subscribe(
         data => {
            console.log(data);
            const dt = data; 
            const user = dt['payload'];
            this.info = dt['message'];
            this.showResend = false;
            this.restart();
           
         });
           
  }


  

  convertDateTodayDisplay() {
     
    var cdate = new Date();
    var date = new Date(cdate.getTime() + (1 * 60 * 1000));
    var years = date.getFullYear();
    var months = ("0" + (date.getMonth()+1)).slice(-2);
    var days  = ("0" + date.getDate()).slice(-2);
    
    var hours  = ("0" + date.getHours()).slice(-2);
    //var minutes = ("0" + date.getMinutes()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var seconds = ("0" + date.getSeconds()).slice(-2);
     
    var strTime = years+'-'+months+'-'+days+' '+hours+':'+minutes+':'+seconds;
    return strTime;
  
  }

  handleEvent(event){
    console.log(event.action);
    if(event.action === 'notify'){
      console.log('Hi!');
    }
    if(event.action == 'finished'){
      console.log('Finished!');
      this.showResend = true;
    }
  }
 
  restart(){
    this.countdown.restart();
  }

  


}

