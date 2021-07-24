import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { CookieService } from '../../../core/services/cookie.service';
import { User } from '../../../core/models/auth.models';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MustMatch } from './update-password.mustmatch';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  
  BaseURL = '';
  userId: any;
  userInfo: any = [];
  staffId: any;
  staffInfo: any;
 
  errormsg:any;
  successmsg:any;
  error:any;
  loading:any;

  user: User;
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string; 

  
  passwordVaildationOld = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

  passwordVaildation = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  

  validationpasswordform: FormGroup;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private http: HttpClient,
              private authenticationService: AuthenticationService, private cookieService: CookieService) { }

  ngOnInit() {

    this.BaseURL = localStorage.getItem("SH360_API_URL");

    //this.BaseURL = 'http://3.94.31.236:11008/cm';

    //const forgotloginUser = localStorage.getItem('forgotloginUser');
    let forgotloginUser = JSON.parse(localStorage.getItem("forgotloginUser"));

    console.log('forgotloginUser',forgotloginUser);
    this.userId = forgotloginUser.sh360Id;
    this.staffId = forgotloginUser.id;
 
     
    this.validationpasswordform = this.formBuilder.group({
      npassword: ['', [Validators.required, Validators.pattern(this.passwordVaildation)]],
      cnpassword: ['', [Validators.required]],
    },{
      validator: MustMatch('npassword', 'cnpassword'),
    });


    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
    document.body.classList.add('authentication-bg-pattern');
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;
    console.log('VERIFY');
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    
    this.loading = true;

    //const user = { id: '123', username: 'Alagirivimal', password: '123456', firstName: 'Alagirivimal', lastName: "K", token: '123123123', email: 'avimal@hlth360.net'};

    //this.user = user;

    //this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
    //this.router.navigate(['/dashboards/dashboard-1']);
    /*
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
    */
   this.loading = false;
  }

  get form() {
    return this.validationpasswordform.controls;
   }
  
  savePassword(){
    this.submitted = true;
    console.log("savePassword");
    this.errormsg = ''; 
    const newPassword = this.validationpasswordform.get('npassword').value;
    const confirmnewPassword = this.validationpasswordform.get('cnpassword').value; 
    
    console.log("validationpasswordform", this.validationpasswordform);

    if (this.validationpasswordform.valid) {
      console.log('FORM SUBMIT');
     
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
  
    var header =  { headers: headers };

   /* 
    var header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization',  'Bearer '+loginUser.token)
    }
  */

   let postData = {
    "id": this.staffId,
    "password": newPassword
  };
 
  

   console.log('postData',postData);
 
    let apiurl = this.BaseURL+'/admin/password/reset'; 
    this.http.post(apiurl, postData, header )
    .subscribe(
      data => {
        console.log('SUCCESS ON CHANGE')
        const dt = data;
        console.log(dt);
        
      
       if(dt['errorCode']){
         console.log(dt['payload']);
         const user = dt['payload'];
         this.errormsg =  dt['message'];
         
       }
       else
       {
        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        //this.error = 'Invalid Login';

        //this.router.navigate(['/dashboard']);
        //this.modalService.dismissAll();
        this.validationpasswordform.reset();
        this.submitted = false;
        this.router.navigate(['/account/login']);
       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        this.loading = false;
      }
    );

    } else {
      this.errormsg = '';
      console.log('ERROR ON FORM')
    }


  }
}


