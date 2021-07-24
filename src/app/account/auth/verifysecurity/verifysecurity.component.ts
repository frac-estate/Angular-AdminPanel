import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-verifysecurity',
  templateUrl: './verifysecurity.component.html',
  styleUrls: ['./verifysecurity.component.scss']
})
export class VerifysecurityComponent implements OnInit, AfterViewInit {

  BaseURL = '';
  userID = '';
  verifysecurityForm: FormGroup;
  submitted = false;
  error = '';
  success = '';
  loading = false;

  answer1 = 1;
  answer2 = 2;
  answer3 = 3;


  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,private http: HttpClient) { }

  ngOnInit() {

    this.BaseURL = localStorage.getItem("SH360_API_URL");

    //this.BaseURL = 'http://3.94.31.236:11008/cm';

    //const forgotloginUser = localStorage.getItem('forgotloginUser');
    let forgotloginUser = JSON.parse(localStorage.getItem("forgotloginUser"));

    console.log('forgotloginUser',forgotloginUser);
    this.userID = forgotloginUser.sh360Id;

    //this._fetchData();
    this._fetchUserData();
  
    this.verifysecurityForm = this.formBuilder.group({
      question1: [null, Validators.required],
      answer1: ['', Validators.required],
      question2: [null, Validators.required],
      answer2: ['', Validators.required],
      question3: [null, Validators.required],
      answer3: ['', Validators.required],
    });

    this.loading = true;


  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
  }

  get f() { return this.verifysecurityForm.controls; }

  onSubmit() {
    this.success = '';
    this.submitted = true;
    console.log("ONSUBMIT");
    
    if (this.verifysecurityForm.invalid) {
      console.log("this.verifysecurityForm",this.verifysecurityForm);
      return;
    }
    console.log("ONSUBMIT VALID"); 

    let quesion1value = this.f.question1.value;
    let quesion2value = this.f.question2.value;
    let quesion3value = this.f.question3.value;

    let answer1value = this.f.answer1.value;
    let answer2value = this.f.answer2.value;
    let answer3value = this.f.answer3.value;

    this.loading = true;
    console.log(this.f.answer1.value);
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
 
   let postData = {
    "sh360Id": this.userID,
    "answers": [{
        "questionId": quesion1value,
        "answer":  answer1value,
      },
      {
        "questionId": quesion2value,
        "answer": answer2value,
      },
      {
        "questionId": quesion3value,
        "answer": answer3value,
      }
    ]
  };
  

   console.log('postData',postData); 
   
    //let apiurl = this.BaseURL+'/user/security/validate';
    //let apiurl = 'http://localhost:11008/user/security/validate';
    
    let apiurl = this.BaseURL+'/admin/security/validate';

    console.log("apiurl",apiurl);

    this.http.post(apiurl, postData, { headers: headers })
    .subscribe(
      data => {
        const dt = data;
        console.log(dt['payload']);
        /*
        console.log(dt['errorCode']);
        console.log(dt['payload']);
        console.log(dt);
        */
        
       if(dt['errorCode']){
         this.error = dt['message'];
         this.success = '';
       } else if(dt['payload']){
         let validuser = dt['payload'].validUser;
         if(validuser) {
          this.error = '';
          this.success = 'Successfully validated responses';
          this.router.navigate(['/account/update-password']);
         } else {
          this.error = 'Invalid security answers';
          this.success = '';
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

 
userquestions:any;  
private _fetchUserData() {

  const headers = new HttpHeaders;
  headers.append('Content-Type', 'application/json');
 
   
   //let apiurl = this.BaseURL+'/user/security/response?userId=e3d0c2cd-6fd6-435c-99a0-07fd3c8dd1a6';
   //let apiurl = 'http://localhost:11008/user/security/response?userId=e3d0c2cd-6fd6-435c-99a0-07fd3c8dd1a6';
 
   let apiurl = this.BaseURL+'/admin/security/response?userId='+this.userID;
   
   console.log(apiurl);

   this.http.get(apiurl,{headers :headers}).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);
     this.userquestions = dt['payload'];
 
    });  
  
 }

  onSubmitXYZ() {
    this.success = '';
    this.submitted = true;

    // stop here if form is invalid
    if (this.verifysecurityForm.invalid) {
      return;
    }

    this.loading = true;

    console.log(this.verifysecurityForm.value);
    setTimeout(() => {
      this.loading = false;
      this.success = 'We have sent you an email containing a link to reset your password';
    }, 1000);
  }
}
