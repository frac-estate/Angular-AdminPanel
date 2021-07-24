import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 

import { Customers } from './customers.model';

import { customersData } from './data';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { TopbarComponent } from './../../../layouts/topbar/topbar.component';

import { ProfileService } from './../../../profile.service'

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

/**
 * Customers component - handling the customer with sidebar and content
 */
export class CustomersComponent implements OnInit {
 
  @ViewChild(TopbarComponent, {static: false}) topbar: TopbarComponent;

    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;
  
  BaseURL = '';
  userInfo: any = [];
  staffId: any;
  staffInfo: any;
  userId:any;

  errormsg:any;
  successmsg:any;
  error:any;
  loading:any;

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

  mobileform: FormGroup;
  mobileverifyform: FormGroup;
  mobileresendverifyform: FormGroup;

  emailform: FormGroup;
  emailverifyform: FormGroup;
  emailresendverifyform: FormGroup;

  profilepictureform: FormGroup;

  color = 'primary';
  mode = 'determinate';
  value = 50;

  
  emailview:any;
  emailedit:any;

  mobileview:any;
  mobileedit:any;
  

  constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private http: HttpClient, private profileservice:ProfileService,private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.loading = false;
    this.MessageBox0 = false;
    // tslint:disable-next-line: max-line-length
    this.breadCrumbItems = [{ label: 'UBold', path: '/' }, { label: 'CRM', path: '/' }, { label: 'Customers', path: '/', active: true }];
    
    /*
    this.validationform = this.formBuilder.group({
      mobilecodedisplay: ['', [Validators.required]],
      mobilecode: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    });
    */
   this.validationform = this.formBuilder.group({});
   
    this.mobileform = this.formBuilder.group({
      mobilecodechange: ['', [Validators.required]],
      mobilechange: ['', [Validators.required, Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
    });

    this.emailform = this.formBuilder.group({
      emailchange: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
    });

    
    this.emailverifyform = this.formBuilder.group({
      emailverificationcode: ['',  [Validators.required, Validators.pattern("[0-9]{6}"), Validators.maxLength(6)]],
    });

    this.mobileverifyform = this.formBuilder.group({
      mobileverificationcode: ['', [Validators.required, Validators.pattern("[0-9]{6}"), Validators.maxLength(6)]],
    });

        
    this.emailresendverifyform = this.formBuilder.group({
      emailverificationcode: ['',  [Validators.required, Validators.pattern("[0-9]{6}"), Validators.maxLength(6)]],
    });

    this.mobileresendverifyform = this.formBuilder.group({
      mobileverificationcode: ['', [Validators.required, Validators.pattern("[0-9]{6}"), Validators.maxLength(6)]],
    });

    this.profilepictureform = this.formBuilder.group({
      profilepicture: ['', [Validators.required]],
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

    
  this.emailview = true;
  this.emailedit = false;

  this.mobileview = true;
  this.mobileedit = false;
  
  }

  get form() {
    return this.validationform.controls;
  }

  get formE() {
    return this.emailform.controls;
  }
  
  get formM() {
    return this.mobileform.controls;
  }

  get formEV() {
    return this.emailverifyform.controls;
  }
  
  get formMV() {
    return this.mobileverifyform.controls;
  }

  
  get formREV() {
    return this.emailresendverifyform.controls;
  }
  
  get formRMV() {
    return this.mobileresendverifyform.controls;
  }

  
  get formPP() {
    return this.profilepictureform.controls;
  }

   email:any;
   emaildisplay:any;
   mobile:any;
   mobiledisplay:any;
   code:any;
   mobilecode:any;
   mobilecodedisplay:any;

   emailstatus:any;
   mobilestatus:any;

  openModal(content: string) {
    this.conmsg = false;
    this.confrm = true;
    
    let mobileexp = this.mobile.slice(-10);

    this.code =  this.mobile.replace(mobileexp,'');

    this.mobile = mobileexp;

    this.mobiledisplay = mobileexp;

    this.mobilecode = this.code;

    this.mobilecodedisplay = '+'+this.code;


    console.log(this.email+'::'+this.mobilecodedisplay+'::'+this.mobile);
    /*
    if(this.mobile!=''){
      //var last2 = member.slice(-2);
      alert(this.mobile);
    }
    */
    /*
    //console.log(this.mobile.substring(this.mobile.length - 10));
    let str = this.mobile;
    console.log("(1,2): "    + str.substring(1,2)); 
    console.log("(0,10): "   + str.substring(0, 10)); 
    console.log("(5): "      + str.substring(5));
    //console.log(this.mobile.substring(this.mobile.length - 10));
    */
    this.modalService.open(content, { centered: true });
  }

  /**
   * save the contacts data
   */
  saveData() {
    const name = this.validationform.get('name').value;
    const phone = this.validationform.get('phone').value;
    const location = this.validationform.get('location').value;
    const email = this.validationform.get('email').value;
    const currentDate = new Date();

    if (this.validationform.valid) {
      this.customersData.push({
        image: 'assets/images/users/user-1.jpg',
        name,
        phone,
        location,
        email,
        date: currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear(),
        status: 'Active'
      });
      this.validationform = this.formBuilder.group({
        name: '',
        phone: '',
        location: '',
        email: ''
      });
      this.modalService.dismissAll();
    }
    this.submitted = true;
    this.totalSize = this.customersData.length + 1;
    this.paginatedData = this.customersData.slice(this.startIndex, this.endIndex);
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

     this.email = this.staffInfo.email.address;

     this.emaildisplay = this.staffInfo.email.address;
      
     this.mobile = this.staffInfo.mobile.number;

     this.mobiledisplay = this.staffInfo.mobile.number;

     this.mobilecode = this.staffInfo.mobile.extn;

     this.emailstatus = this.staffInfo.email.isVerified;
      
     this.mobilestatus = this.staffInfo.mobile.isVerified;
         
     this.loading = true; 

     this.spinner.hide(); 
  },
  error => {
    console.log('ERROR ON SAVE')
 
    this.loading = true; 
    this.spinner.hide(); 
  });

  }


  saveContact(){
    this.submitted = true;
    console.log("saveContact");
    this.errormsg = ''; 
    
    const newEmail = this.validationform.get('email').value;
    const newMobile = this.validationform.get('mobile').value;
    const newMobileCode = this.validationform.get('mobilecode').value;
    const newMobileCodeDisplay = this.validationform.get('mobilecodedisplay').value;
 
    console.log("validationform", this.validationform);

    if (this.validationform.valid) {
      console.log('FORM SUBMIT');
    
      
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);

    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
   
    
    
var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', this.staffId)
    .set('sh360_requester_id', this.staffId)
}

 

   let postData = {
    "id": loginUser.id,
    "mobile": newMobileCode+newMobile,
    "email": newEmail
  };
  

   console.log('postData',postData);
 
    let apiurl = this.BaseURL+'/admin/staff/contact'; 
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

        this.email = newEmail;
        this.mobile =  newMobileCode+newMobile;
        this.code =  newMobileCode;
        this.mobilecode =  '+'+newMobileCode;

        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        //this.error = 'Invalid Login';

        //this.router.navigate(['/dashboard']);
        //this.modalService.dismissAll();
        //this.validationpasswordform.reset();
        this.submitted = false;

        this.confrm = false;
        this.conmsg = true;

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
      this.errormsg = 'Validation error / Please fill form data';
      console.log('ERROR ON FORM')
    }


  }

  openEmailEdit(){
    this.emailview = false;
    this.emailedit = true;
    console.log("openEmailEdit");
  }

  closeEmailEdit(){
    this.emailview = true;
    this.emailedit = false;
    this.email = this.emaildisplay;
    console.log("openEmailEdit");
  }

  openMobileEdit(){
    this.mobileview = false;
    this.mobileedit = true;
    console.log("openMobileEdit");
  }

  closeMobileEdit(){
    this.mobileview = true;
    this.mobileedit = false;
    this.mobile = this.mobiledisplay;
    console.log("closeMobileEdit");
  }

  isemailEntered: boolean = false;
  emailEntered()
  {
  this.isemailEntered = true;
  if(this.formE.emailchange.value=="") {
    this.isemailEntered = false;
  }
  }

  ismobileEntered: boolean = false;
  mobileEntered()
  {
  this.ismobileEntered = true;
  if(this.formM.mobilechange.value=="") {
    this.ismobileEntered = false;
  }
  }

  loadingbutton:any;
  newEmail:any;
  saveEmailContact(content: string){
    console.log("saveEmailContactXYZ");
    this.submitted = true;
    console.log("saveEmailContact");
    this.errormsg = '';  
    this.newEmail = this.emailform.get('emailchange').value; 
 
    console.log("emailform", this.emailform);

    if (this.emailform.valid) {
      console.log('FORM SUBMIT');
    } else {
      console.log('FORM ERROR');
      return false;
    }

      
    
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
    "id": loginUser.id,
    "type": "email",
    "value": this.newEmail
  };
  

   console.log('postData',postData);
  
    let apiurl = this.BaseURL+'/admin/staff/contact'; 
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
        this.submitted = false;

        //this.confrm = false;
        //this.conmsg = true;

        this.loadingbutton = false;
        this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });




       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        
        this.loading = true;
        this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
      }
    ); 
   
    return false;
  }

  newCode:any;
  newMobile:any;
  saveMobileContact(content: string){
    console.log("saveMobileContactXYZ");
    this.submitted = true;
    this.errormsg = '';  
    this.newCode = this.mobileform.get('mobilecodechange').value; 
    this.newMobile = this.mobileform.get('mobilechange').value; 
 
    console.log("mobileform", this.mobileform);

    if (this.mobileform.valid) {
      console.log('FORM SUBMIT');
    } else {
      console.log('FORM ERROR');
      return false;
    }

      
    
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
    "id": loginUser.id,
    "type": "mobile",
    "extn": this.newCode,
    "value": this.newMobile
  };
  

   console.log('postData',postData);
  
    let apiurl = this.BaseURL+'/admin/staff/contact'; 
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
        this.submitted = false;

        //this.confrm = false;
        //this.conmsg = true;

        this.loadingbutton = false;
        this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });

       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        
        this.loading = true;
        this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
      }
    ); 
   
    return false;
    return false;
  }

  emailverificationcode:any;
  saveEmailVerify(content: string){
    console.log("saveEmailVerify");
    this.submitted = true;
    this.errormsg = '';  
    this.emailverificationcode = this.emailverifyform.get('emailverificationcode').value; 
 
    console.log("emailverifyform", this.emailverifyform);

    if (this.emailverifyform.valid) {
      console.log('FORM SUBMIT');
    } else {
      console.log('FORM ERROR');
      return false;
    }

      
    
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
    "id": loginUser.id,
    "type": "email",
    "value": this.newEmail,
    "otp": this.emailverificationcode,
    "verify": true
  
  };
  

   console.log('postData',postData);
  
    let apiurl = this.BaseURL+'/admin/staff/contact'; 
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
         this.loading = false;
       }
       else
       {

        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        this.submitted = false;

        //this.confrm = false;
        //this.conmsg = true;

        this.emailverifyform.reset();
        this.modalService.dismissAll();
        this.loading = false;
        this.closeEmailEdit();
        this.closeEmailEdit();
        //this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
        this._fetchData();



       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        //this.loading = false;
      }
    ); 
   
    return false;
  }


  mobileverificationcode:any;
  saveMobileVerify(content: string){
    console.log("saveMobileVerify");
    this.submitted = true;
    this.errormsg = '';  
    this.mobileverificationcode = this.mobileverifyform.get('mobileverificationcode').value; 
 
    console.log("mobileverifyform", this.mobileverifyform);

    if (this.mobileform.valid) {
      console.log('FORM SUBMIT');
    } else {
      console.log('FORM ERROR');
      return false;
    }

      
    
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
    "id": loginUser.id,
    "type": "mobile",
    "extn": this.newCode,
    "value": this.newMobile,
    "otp": this.mobileverificationcode,
    "verify": true
  };
  

   console.log('postData',postData);
  
    let apiurl = this.BaseURL+'/admin/staff/contact'; 
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
         this.loading = false;
       }
       else
       {

        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        this.submitted = false;

        //this.confrm = false;
        //this.conmsg = true;

        this.mobileverifyform.reset();
        this.modalService.dismissAll();
        this.loading = false;
        this.closeEmailEdit();
        this.closeMobileEdit();
        //this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
        this._fetchData();

       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        //this.loading = false;
      }
    ); 
   
    return false;
  }

  
  saveEmailContactXYZ(content: string){
    this.submitted = true;
    console.log("saveEmailContact");
    this.errormsg = ''; 
 
    const newEmail = this.validationform.get('email').value;
    const newMobile = this.validationform.get('mobile').value;
    const newMobileCode = this.validationform.get('mobilecode').value;
    const newMobileCodeDisplay = this.validationform.get('mobilecodedisplay').value;
 
    console.log("validationform", this.validationform);

    if (this.validationform.valid) {
      console.log('FORM SUBMIT');
    
      
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
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
    "id": loginUser.id,
    "mobile": newMobileCode+newMobile,
    "email": newEmail
  };
  

   console.log('postData',postData);
 
    let apiurl = this.BaseURL+'/user/contact'; 
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

        this.email = newEmail;
        this.mobile =  newMobileCode+newMobile;
        this.code =  newMobileCode;
        this.mobilecode =  '+'+newMobileCode;

        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        //this.error = 'Invalid Login';

        //this.router.navigate(['/dashboard']);
        //this.modalService.dismissAll();
        //this.validationpasswordform.reset();
        this.submitted = false;

        this.confrm = false;
        this.conmsg = true;

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
      this.errormsg = 'Validation error / Please fill form data';
      console.log('ERROR ON FORM')
    }


  }

  

  saveMobileContactXYZ(content: string){
    this.submitted = true;
    console.log("saveContact");
    this.errormsg = ''; 
      const newEmail = this.validationform.get('email').value;
    const newMobile = this.validationform.get('mobile').value;
    const newMobileCode = this.validationform.get('mobilecode').value;
    const newMobileCodeDisplay = this.validationform.get('mobilecodedisplay').value;
 
    console.log("validationform", this.validationform);

    if (this.validationform.valid) {
      console.log('FORM SUBMIT');
    
      
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
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
    "id": loginUser.id,
    "mobile": newMobileCode+newMobile,
    "email": newEmail
  };
  

   console.log('postData',postData);
 
    let apiurl = this.BaseURL+'/user/contact'; 
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

        this.email = newEmail;
        this.mobile =  newMobileCode+newMobile;
        this.code =  newMobileCode;
        this.mobilecode =  '+'+newMobileCode;

        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        //this.error = 'Invalid Login';

        //this.router.navigate(['/dashboard']);
        //this.modalService.dismissAll();
        //this.validationpasswordform.reset();
        this.submitted = false;

        this.confrm = false;
        this.conmsg = true;

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
      this.errormsg = 'Validation error / Please fill form data';
      console.log('ERROR ON FORM')
    }


  }


  
  resendCodeMobile(content:string) {
    console.log('resendCode');
    this.error = '';
    this.submitted = false;
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
            
        this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
            
         });
           
  }

  
  resendCodeEmail(content:string) {
    console.log('resendCodeEmail');
    this.error = '';
    this.submitted = false;
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
            
            this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
            
         });
           
  }


  resendEmailVerify(content: string){
    console.log("resendEmailVerify");
    this.submitted = true;
    this.errormsg = '';  
    this.emailverificationcode = this.emailresendverifyform.get('emailverificationcode').value; 
 
    console.log("emailresendverifyform", this.emailresendverifyform);

    if (this.emailresendverifyform.valid) {
      console.log('FORM SUBMIT');
    } else {
      console.log('FORM ERROR');
      return false;
    }

      
    
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
    "userId": loginUser.id,
    "verificationCode": this.emailverificationcode,
    "sendTo":"email"
   };
  

   console.log('postData',postData);
   
    let apiurl = this.BaseURL+'/admin/verify/otp';
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
         this.loading = false;
       }
       else
       {

        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        this.submitted = false;

        //this.confrm = false;
        //this.conmsg = true;

        this.emailverifyform.reset();
        this.modalService.dismissAll();
        this.loading = false;
        this.closeEmailEdit();
        this.closeEmailEdit();
        //this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
        this._fetchData();



       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        //this.loading = false;
      }
    ); 
   
    return false;
  }


  resendMobileVerify(content: string){
    console.log("resendMobileVerify");
    this.submitted = true;
    this.errormsg = '';  
    this.mobileverificationcode = this.mobileresendverifyform.get('mobileverificationcode').value; 
 
    console.log("mobileresendverifyform", this.mobileresendverifyform);

    if (this.mobileresendverifyform.valid) {
      console.log('FORM SUBMIT');
    } else {
      console.log('FORM ERROR');
      return false;
    }

      
    
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
    "userId": loginUser.id,
    "verificationCode": this.mobileverificationcode,
    "sendTo":"mobile"
   };
  

   console.log('postData',postData);
  
    let apiurl = this.BaseURL+'/admin/verify/otp'; 
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
         this.loading = false;
       }
       else
       {

        this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        this.submitted = false;

        //this.confrm = false;
        //this.conmsg = true;

        this.mobileverifyform.reset();
        this.modalService.dismissAll();
        this.loading = false;
        this.closeEmailEdit();
        this.closeMobileEdit();
        //this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
        this._fetchData();

       }
       
        
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        //this.loading = false;
      }
    ); 
   
    return false;
    return false;
  }


  
  profileImageUpdate(content:string) {
    console.log('profileImageUpdate');
    this.submitted = false;
    this.imageError = null;
    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
                        
  }

  profilepictureFile:any; 
  saveProfilePicture(content: string){
    console.log("SaveProfilePicture");
    this.submitted = true;
    this.errormsg = '';  

    const formData = new FormData();
    formData.append('file', this.profilepictureform.get('profilepicture').value);

    console.log("formData", formData);
 
    if (this.profilepictureform.valid) {
      console.log('FORM SUBMIT');
    } else {
      console.log('FORM ERROR');
      return false;
    }
  

        
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
    "sh360Id": loginUser.sh360Id,
    "profilePicture": this.cardImageBase64, 
  };
  

   console.log('postData',postData);
  
    let apiurl = this.BaseURL+'/admin/upload/dp'; 
    this.http.post(apiurl, postData, header )
    .subscribe(
      data => {
        console.log('SUCCESS ON CHANGE')
        const dt = data;
        console.log(dt);
      
       if(dt['payload']){
         this.errormsg = ''; 
        this.successmsg =  dt['message']; 
        this.submitted = false;
 
        
        let loginUser = JSON.parse(localStorage.getItem("loginUser"));
        loginUser.profilePicture = this.cardImageBase64;

        this.profileservice.setPictures(this.cardImageBase64);

        //loginUser.profilePicture = './assets/images/sh360-logo.svg';
        //loginUser.lastName = this.cardImageBase64;
        localStorage.setItem('loginUser',JSON.stringify(loginUser));
        
        this.profilepictureform.reset();
        this.modalService.dismissAll();
        this.loading = false;
        //this.topbar.PageReload();
        //location.reload();   
       }
       else
       {

        console.log(dt['payload']);
        const user = dt['payload'];
        this.errormsg =  dt['message'];
        this.loading = false;

       }
       this._fetchData();
       this.loading = true; 
        return false;
      },
      error => {
        console.log('ERROR ON SAVE')
        this.errormsg = error;
        this.successmsg = '';
        this.error = error;
        //this.loading = false;
        this.loading = true;
      }
    ); 
 
    return false;
  }


  fileChangeEvent(fileInput: any) {
    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        //const max_size = 20971520;
        const max_size = 200000;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.imageError =
                'Maximum size allowed is ' + max_size / 1000 + 'Kb';
            this.profilepictureform.get('profilepicture').reset();
            return false;
        }
 
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.imageError =
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px';
                    
                    this.profilepictureform.get('profilepicture').reset();    
                    return false;
                } else {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
}


validateQty(event) {
  console.log(event);
  var key = window.event ? event.keyCode : event.which;
/* if (event.keyCode == 8 || event.keyCode == 46
|| event.keyCode == 37 || event.keyCode == 39) */  
if (event.keyCode == 8) {
  return true;
}
else if ( key < 48 || key > 57 ) {
  return false;
}
else return true;
}
 
}
