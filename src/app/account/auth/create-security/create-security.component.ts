
  import { Component, OnInit, AfterViewInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { HttpClient, HttpHeaders } from '@angular/common/http';

  import { CookieService } from '../../../core/services/cookie.service';

@Component({
  selector: 'app-create-security',
  templateUrl: './create-security.component.html',
  styleUrls: ['./create-security.component.scss']
})
export class CreateSecurityComponent implements OnInit {

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
  
  
    constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,private http: HttpClient, private cookieService: CookieService) { }
  
    ngOnInit() {
  
      this.BaseURL = localStorage.getItem("SH360_API_URL");
  
      //this.BaseURL = 'http://3.94.31.236:11008/cm';
  
      //const forgotloginUser = localStorage.getItem('forgotloginUser');
      let forgotloginUser = JSON.parse(localStorage.getItem("forgotloginUser"));
  
      console.log('forgotloginUser',forgotloginUser);
      this.userID = forgotloginUser.sh360Id;
  
      this._fetchData();
      //this._fetchUserData();
    
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
  
      this.submitted = false;
  
      let quesion1value = this.f.question1.value;
      let quesion2value = this.f.question2.value;
      let quesion3value = this.f.question3.value;
  
      let answer1value = this.f.answer1.value;
      let answer2value = this.f.answer2.value;
      let answer3value = this.f.answer3.value;
  
      this.loading = true;
   
    
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
    
  
    var arr = [ quesion1value, quesion2value, quesion3value ];
  
    console.log(arr);
    
    if (this.hasDuplicates(arr)) {
      this.error = 'Duplicate security questions are not allowed';
        console.log("Duplicate elements found.");
        return;
    }
    else {
        console.log("No Duplicates found.");
    }
     console.log('postData',postData); 
      
      //let apiurl = this.BaseURL+'/user/security/validate';
      //let apiurl = 'http://localhost:11008/user/security/validate';
      
      let apiurl = this.BaseURL+'/admin/security/response';
  
      console.log("apiurl",apiurl);
  
      this.http.post(apiurl, postData, {headers :headers})
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
           this.error = 'Invalid security answers';
           this.success = '';
         } else if(dt['payload']){
           this.error = '';
           this.success = 'Successfully updated security answers';  
           //this.router.navigate(['/account/login']);        

           let currentUser = JSON.parse(localStorage.getItem("forgotloginUser"));
           let loginUser = JSON.parse(localStorage.getItem("forgotloginUser"));
           
           const user = {"validUser":true};
           
           this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
           localStorage.setItem('currentUser',JSON.stringify(currentUser));
           
           this.cookieService.setCookie('loginUser', JSON.stringify(user), 1);
           localStorage.setItem('loginUser',JSON.stringify(loginUser));

           this.router.navigate(["/crm/patients"]);
         }
         
         this.loading = true;
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
     let apiurl = this.BaseURL+'/admin/security/questions';
   
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

    private hasDuplicates(arr)
{
    return new Set(arr).size !== arr.length; 
}
  

  }
  