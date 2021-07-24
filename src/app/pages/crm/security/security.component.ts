import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Customers } from './security.model';

import { customersData } from './data';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MustMatch } from './security.mustmatch';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {


  
  BaseURL = '';
  userId: any;
  userInfo: any = [];
  staffId: any;
  staffInfo: any;
 
  errormsg:any;
  successmsg:any;
  error:any;
  loading:any;

  pwdfrm = true;
  pwdmsg = false;

  secfrm = true;
  secmsg = false;

  passwordVaildationOld = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

  passwordVaildation = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  

  validationpasswordform: FormGroup;


  conmsg: any;
  confrm: any;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  paginatedData: Array<Customers>;
  customersData: Customers[];
  submitted: boolean;

  MessageBox0: boolean;
  // page number
  page = 1;
  // default page size
  pageSize = 10;

  // start and end index
  startIndex = 1;
  endIndex = 10;
  totalSize = 0;

  // validation form
  validationform: FormGroup;
  verifysecurityForm: FormGroup;

  color = 'primary';
  mode = 'determinate';
  value = 50;

  constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private http: HttpClient,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.loading = false;
    this.MessageBox0 = false;
    // tslint:disable-next-line: max-line-length
    this.breadCrumbItems = [{ label: 'UBold', path: '/' }, { label: 'CRM', path: '/' }, { label: 'Customers', path: '/', active: true }];
 
    this.validationpasswordform = this.formBuilder.group({
      cpassword: ['', [Validators.required]],
      npassword: ['', [Validators.required, Validators.pattern(this.passwordVaildation)]],
      cnpassword: ['', [Validators.required]],
    },{
      validator: MustMatch('npassword', 'cnpassword'),
    });

    this.verifysecurityForm = this.formBuilder.group({
      question1: [null, Validators.required],
      answer1: ['', Validators.required],
      question2: [null, Validators.required],
      answer2: ['', Validators.required],
      question3: [null, Validators.required],
      answer3: ['', Validators.required],
    });



    this.BaseURL = localStorage.getItem("SH360_API_URL");

    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log("loginUser",loginUser);
    this.userInfo = loginUser;
    this.userId = loginUser.sh360Id;
    this.staffId = loginUser.id;

    /**
     * fetches data
     */
    this._fetchData();
  } 
  /**
   * Modal Open
   * @param content modal content
   */

  
  openModal(content: string) {
    this.submitted = false;
    this.pwdfrm = true;
    this.pwdmsg = false; 
    this.validationpasswordform.reset();
    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  }

  openModalSecurity(content: string) {

    this._fetchSecurityData()
    this._fetchUserSecurityData();

    this.submitted = false;
    this.secfrm = true;
    this.secmsg = false; 

    this.success = '';
    this.error = '';
    this.validationpasswordform.reset();
    this.modalService.open(content,  { centered: true, backdrop : 'static', keyboard : false });
  }


  
 get form() {
  return this.validationpasswordform.controls;
 }

  savePassword(){
    this.submitted = true;
    console.log("savePassword");
    this.errormsg = ''; 
    const currentPassword = this.validationpasswordform.get('cpassword').value;
    const newPassword = this.validationpasswordform.get('npassword').value;
    const confirmnewPassword = this.validationpasswordform.get('cnpassword').value; 
    
    console.log("validationpasswordform", this.validationpasswordform);

    if (this.validationpasswordform.valid) {
      console.log('FORM SUBMIT');
    
      
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);

    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
  
    var header =  { headers: headers };

   
    
var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', this.userId)
    .set('sh360_requester_id', this.userId)
}

  

   let postData = {
    "id": loginUser.id,
    "currentPassword": currentPassword,
    "newPassword": newPassword
  };
  

   console.log('postData',postData);
 
    let apiurl = this.BaseURL+'/admin/password'; 
    this.http.put(apiurl, postData, header )
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

        this.pwdfrm = false;
        this.pwdmsg = true;
       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        //this.loading = false;
        this.submitted = false;
      }
    );

    } else {
      this.errormsg = '';
      console.log('ERROR ON FORM')
    }


  }
  /**
   * paginatio onchange event
   * @param page page
   */
  onPageChange(page: any): void {
    this.startIndex = (page - 1) * this.pageSize;
    this.endIndex = (page - 1) * this.pageSize + this.pageSize;
    this.paginatedData = this.customersData.slice(this.startIndex, this.endIndex);
  }
  /**
   * fetches the customer value
   */
  private _fetchData() {

    this.spinner.show(); 

    this.loading = false;

    /*
    this.customersData = customersData;

    // apply pagination
    this.startIndex = 0;
    this.endIndex = this.pageSize;

    this.paginatedData = this.customersData.slice(this.startIndex, this.endIndex);
    this.totalSize = this.customersData.length;
    */
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');

   
var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', this.userId)
    .set('sh360_requester_id', this.userId)
}



   let apiurl = this.BaseURL+'/admin/staff?id='+this.staffId;


   console.log("getCMInfo API", apiurl);

   this.http.get(apiurl,header).subscribe((data) => {
   
     const dt = data;
     const userData = dt['payload'];
     
     console.log("userData",userData);

     this.staffInfo = userData;
    
     this.loading = true; 

     this.spinner.hide(); 
  },
  error => {
    console.log('ERROR ON SAVE')
 
    this.loading = true; 
    this.spinner.hide(); 
  });

  }


  get f() { return this.verifysecurityForm.controls; }

  success:any;
  
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
    console.log(this.f.answer1.value);

    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');

   
var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', this.userId)
    .set('sh360_requester_id', this.userId)
}

   
   let postData = {
    "sh360Id": this.userId,
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

    this.http.put(apiurl, postData, header)
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
private _fetchSecurityData() {

  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');

     
var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', this.userId)
    .set('sh360_requester_id', this.userId)
}


   //let apiurl = this.BaseURL+'/user/security/questions';
   //let apiurl = 'http://localhost:11008/user/security/questions';
   let apiurl = this.BaseURL+'/admin/security/questions';

   console.log(apiurl);

   this.http.get(apiurl,header).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);
     this.questions = dt['payload'];
 
    });  
  
 }

userData:any=false;
userquestion1:any;
userquestion2:any;
userquestion3:any;

useranswer1:any;
useranswer2:any;
useranswer3:any;

userquestions:any;  
private _fetchUserSecurityData() {

  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');

    
var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', this.userId)
    .set('sh360_requester_id', this.userId)
}


   //let apiurl = this.BaseURL+'/user/security/response?userId=e3d0c2cd-6fd6-435c-99a0-07fd3c8dd1a6';
   //let apiurl = 'http://localhost:11008/user/security/response?userId=e3d0c2cd-6fd6-435c-99a0-07fd3c8dd1a6';
 
   //this.userId = 'e3d0c2cd-6fd6-435c-99a0-07fd3c8dd1a6';

   let apiurl = this.BaseURL+'/admin/security/response?userId='+this.userId;
   

   this.http.get(apiurl,header).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);
     if(dt['payload']) {
      this.userquestions = dt['payload'];

      
this.userquestion1=this.userquestions[0].securityQuestionId._id;
this.userquestion2=this.userquestions[1].securityQuestionId._id;
this.userquestion3=this.userquestions[2].securityQuestionId._id;

this.useranswer1=this.userquestions[0].answer;
this.useranswer2=this.userquestions[1].answer;
this.useranswer3=this.userquestions[2].answer;

this.questions.push(this.userquestions[0].securityQuestionId);
this.questions.push(this.userquestions[1].securityQuestionId);
this.questions.push(this.userquestions[2].securityQuestionId);


this.userData = true;
     } else {
      this.userquestions;

      
this.userquestion1='';
this.userquestion2='';
this.userquestion3='';

this.useranswer1='';
this.useranswer2='';
this.useranswer3='';

this.userData = true;
     }
     
 
    });  
  
 }

private hasDuplicates(arr)
{
    return new Set(arr).size !== arr.length; 
}
  
 
}
