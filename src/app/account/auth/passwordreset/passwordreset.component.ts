import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})
export class PasswordresetComponent implements OnInit, AfterViewInit {

  BaseURL = '';

  resetForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,private http: HttpClient) { }

  ngOnInit() {

    this.BaseURL = localStorage.getItem("SH360_API_URL");

    //this.BaseURL = 'http://3.94.31.236:11008/cm';

    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
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

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

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
  
   const email = this.f.email.value;
   const userType = 'Entity-Admin';
 
    //let apiurl = this.BaseURL+'/user/password/forgot';

    let apiurl = this.BaseURL+'/admin/validate/email?email='+email+'&userType='+userType;

    console.log('apiurl',apiurl);
      
    this.http.get(apiurl, { headers: headers })
    .subscribe(
      data => {
        const dt = data;
        console.log(dt);
       

       if(dt['errorCode']){
         this.error = dt['message'];
         this.success = '';
       } else if(dt['payload']){
         console.log(dt['payload']);
         
          const forgotloginUser = dt['payload'];
          localStorage.setItem('forgotloginUser',JSON.stringify(forgotloginUser));

          const payload = dt['payload'];
  
          if(payload.status==="ACTIVATED" && payload.questionsEnabled) {
         
              this.error = '';
              this.success = 'An email has been sent with temporary password';
              this.router.navigate(['/account/verify-security']);

         } else  {

          //return;
          this.error = '';
          this.success = 'An email has been sent with temporary password';
          this.router.navigate(['/account/create-security']);

        } 
         
        
       /* 
       if(dt['errorCode']){
         this.error = dt['message'];
         this.success = '';
       } else if(dt['payload']){
         console.log(dt['payload']);

         if(dt['payload'].status==="ACTIVATED") {
          //const forgotloginUser = dt['payload']; 
          const forgotloginUser = dt['payload'];
          localStorage.setItem('forgotloginUser',JSON.stringify(forgotloginUser));

          //return;
          this.error = '';
          this.success = 'An email has been sent with temporary password';
          this.router.navigate(['/account/verify-security']);
     } else {

          this.error = 'An email is not availble';
          this.success = '';
      
     }
     */
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
