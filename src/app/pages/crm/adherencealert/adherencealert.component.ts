  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, Validators, FormGroup } from '@angular/forms';
  
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  
   
  import { HttpClient, HttpHeaders } from '@angular/common/http';
   
  import { NgxSpinnerService } from "ngx-spinner";

  @Component({
    selector: 'app-adherencealert',
    templateUrl: './adherencealert.component.html',
    styleUrls: ['./adherencealert.component.scss']
  })
  export class AdherencealertComponent implements OnInit {  
  
    
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
    
  
    remindervalidationform: FormGroup;
  
    alertInfo: any;

    /*

  alertthresholdList = [
  {id: 1, name: 'Weekly', type:"week", value:"1"},
  {id: 2, name: 'Monthly', type:"month", value:"1"},
  {id: 3, name: 'Year', type:"year", value:"1"},
  {id: 4, name: 'Life Time', type:"life", value:"1"}
  ];

  
  alertratingList = [
    {id: 50, name: '50%', type:"percentage", value:"50"},
    {id: 60, name: '60%', type:"percentage", value:"60"},
    {id: 70, name: '70%', type:"percentage", value:"70"},
    {id: 80, name: '80%', type:"percentage", value:"80"},
    {id: 90, name: '90%', type:"percentage", value:"90"}
    ];
    */

  alertthresholdList = [
  {id: 1, name: 'Weekly', type:"week", value:"1"},
  {id: 2, name: 'Monthly', type:"month", value:"1"}
  ];

  
  alertratingList = [
    {id: 25, name: '25%', type:"percentage", value:"25"},
    {id: 50, name: '50%', type:"percentage", value:"50"},
    {id: 75, name: '75%', type:"percentage", value:"75"},
    {id: 100, name: 'Custom', type:"percentage", value:"100"}
    ];
  
    alertratingListArray =[25,50,75,100];

    conmsg: any;
    confrm: any;
  
    // bread crumb items
    breadCrumbItems: Array<{}>;
    paginatedData: Array<{}>;
    customersData: [];
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
   
      this.remindervalidationform = this.formBuilder.group({
        reminderset: [''],
        alertthreshold: ['',[Validators.required]],
        alertrating: ['',[Validators.required]],
        alertratinginput: ['',[Validators.max(100), Validators.min(0)]],
      });
    
      this.BaseURL = localStorage.getItem("SH360_API_URL");
  
      let loginUser = JSON.parse(localStorage.getItem("loginUser"));
      console.log("loginUser",loginUser);
      this.userInfo = loginUser;
      this.userId = loginUser.sh360Id;
      this.staffId = loginUser.id;
  
      this.spinner.show();
      /**
       * fetches data
       */
      this._fetchData();
      this._fetchAlertData();
    } 
    /**
     * Modal Open
     * @param content modal content
     */
  
    
    openModal(content: string) {
      this.submitted = false;
      this.pwdfrm = true;
      this.pwdmsg = false; 
      this.remindervalidationform.reset();
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
      this.remindervalidationform.reset();
      this.modalService.open(content,  { centered: true, backdrop : 'static', keyboard : false });
    }
  
  
    
   get form() {
    return this.remindervalidationform.controls;
   }
  
   reminderset:any;
   alertthreshold:any;
   alertrating:any;
   alertthresholdtype:any;
   
   alertthresholdvalue:any;
   alertratingvalue:any;

   alertthresholdinput:any;
   alertratinginput:any;

   alertthresholdinputvalue:any;
   alertratinginputvalue:any;

   saveReminderAlertData(){
      this.submitted = true;
      console.log("savePassword");
      this.successmsg = ''; 
      this.errormsg = ''; 
      this.reminderset = this.remindervalidationform.get('reminderset').value;
      this.alertthreshold = this.remindervalidationform.get('alertthreshold').value;
      this.alertrating = this.remindervalidationform.get('alertrating').value; 
      if(this.alertrating=="100") {
        this.alertrating = this.remindervalidationform.get('alertratinginput').value; 
      }
      
      console.log("remindervalidationform", this.remindervalidationform);

      console.log("reminderset", this.reminderset);
      console.log("alertthreshold", this.alertthreshold);
      console.log("alertrating", this.alertrating);
     
      if (this.remindervalidationform.valid) {
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
    
      this.alertthresholdtype = '';
      if(this.alertthreshold==1) {
        this.alertthresholdtype = 'Week';
      } else if(this.alertthreshold==2) {
        this.alertthresholdtype = 'Month';
      } else if(this.alertthreshold==3) {
        this.alertthresholdtype = 'Year';
      } else if(this.alertthreshold==4) {
        this.alertthresholdtype = 'Life';
      } else {
        this.alertthresholdtype = '';
      }
   
     let postData = {
      "entityId": loginUser.entityId,
      "alertThresholdValue": this.alertthreshold,
      "alertThresholdType": this.alertthresholdtype,
      "alertPercentage": this.alertrating
    };
    
  
     console.log('postData',postData);
   
      let apiurl = this.BaseURL+'/admin/adherence/settings'; 
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
          //this.validationpasswordform.reset();
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
          this.loading = false;
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
  
    });
  
    }
  
    private _fetchAlertData() {
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
  
    /* URL: http://localhost:11009/entity/admin/adherence/settings?entityId=5f2bb812e448f355fe813a70 */

     let apiurl = this.BaseURL+'/admin/adherence/settings?entityId='+loginUser.entityId;
  
  
     console.log("get Alert Setting API", apiurl);
  
     this.http.get(apiurl,header).subscribe((data) => {
     
       const dt = data;
       const userData = dt['payload'];
       
       console.log("AlertuserData",userData);
  
       this.alertInfo = userData;
      
       if(!userData) {
        this.MedicationReminderFormBox1 = false;
        this.medicationReminderDataisReminderSet = false;
        this.alertthresholdvalue = null;
        this.alertratingvalue = null;
       } else if(userData.alertThresholdValue == 0 || userData.alertThresholdValue == ''){
        this.MedicationReminderFormBox1 = false;
        this.medicationReminderDataisReminderSet = false;
        this.alertthresholdvalue = null;
        this.alertratingvalue = null;
         
       } else if(userData.alertThresholdValue > 0){

        this.MedicationReminderFormBox1 = true;
        this.medicationReminderDataisReminderSet = true;
        this.alertthresholdvalue = userData.alertThresholdValue;
        this.alertratingvalue = Number(userData.alertPercentage);

        console.log("this.alertratingvalue",this.alertratingvalue);

        console.log( 'Index : ' + this.alertratingListArray.indexOf(this.alertratingvalue) );

        if(this.alertratingListArray.indexOf(this.alertratingvalue)>=0) {
          console.log('YES');
          //this.alertratingvalue = Number(100); 
        } else {
          console.log('NO');
          this.inputalertrating = true;
          this.alertratinginputvalue = this.alertratingvalue;
          this.alertratingvalue = Number(100);
        }

       }

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
    
  MedicationReminderFormBox1:any;
  medicationReminderDataisReminderSet:any; 

smallModalPopUp(smallDataModal: string, event) {
  console.log("medicationReminderDataValue",event);
  if (event.target.checked) {
    this.MedicationReminderFormBox1=true;
  } else {
    this.modalService.open(smallDataModal, { size: 'sm', centered: true, backdrop : 'static', keyboard : false  });
    //this.MedicationReminderFormBox1=false;
    //this.remindervalidationform.reset();
  }
  
  /*
  if(this.medicationReminderDataisReminderSet==false) {

    if(this.MedicationReminderFormBox1) {
      this.MedicationReminderFormBox1=false;
    } else {
      this.MedicationReminderFormBox1=true;
    }
    
  } else {
    this.medicationReminderDataisReminderSet = true;
    this.modalService.open(smallDataModal, { size: 'sm', centered: true, backdrop : 'static', keyboard : false  });
  }
  */  
} 


CancelReminderOff(){
   this.MedicationReminderFormBox1 = true;
   this.modalService.dismissAll();
   this.medicationReminderDataisReminderSet = true;
 } 

  
ReminderOff(){
   
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
     /* 
    http://localhost:11009/entity/admin/adherence/settings/off?entityId=5fda3b4776d5d545a8934d8a
    */

     let apiurl = this.BaseURL+'/admin/adherence/settings/off?entityId='+loginUser.entityId;
     
     var postData = '';
   
       
       console.log("OFF REMINDER API:",apiurl);
   
       this.http.delete(apiurl,header).subscribe((data) => { 
        const dt = data;
        console.log(dt['payload']); 

        this.errormsg = '';
        this.successmsg =  dt['message']; 

        this.MedicationReminderFormBox1 = false;
        this.modalService.dismissAll();
        this.medicationReminderDataisReminderSet = false;

      });  

       /*
       this.http.post(apiurl, postData, { headers: headers })
       .subscribe(
         data => {
           console.log('SUCCESS ON SAVE')
           const dt = data;
           console.log(dt);
           
          if(dt['payload']){
            console.log("SUCCESS");
            console.log(dt['payload']);
      
           
          }
          else
          {
           console.log("ERROR"); 
           console.log(dt['payload']);
          
           //this.openModal('savefailurecontent');
          }
           
           return false;
         },
         error => {
           console.log('ERROR ON SAVE')
           this.errormsg = error;
           this.error = error;
           this.loading = false;
         }
       );
       */  
     
     
     if(this.MedicationReminderFormBox1) {
       this.MedicationReminderFormBox1=false;
     } else {
       this.MedicationReminderFormBox1=true;
     }
    
   }


   OnChangePeriod(e:any){
    console.log("OnChangePeriod",e);
    console.log("OnChangePeriod ID",e.id);
    
   }

   inputalertrating:any=false;
   OnChangeThreshold(e:any){
     console.log("OnChangeThreshold",e);
     console.log("OnChangeThreshold ID",e.id);
     if(e.id==100){
      this.remindervalidationform.controls['alertratinginput'].setValidators([Validators.required]);
      this.remindervalidationform.controls['alertratinginput'].updateValueAndValidity();  
      this.inputalertrating = true;
     } else {
       
      this.remindervalidationform.controls['alertratinginput'].setValidators(null);
      this.remindervalidationform.controls['alertratinginput'].updateValueAndValidity();  
      this.inputalertrating = false;
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
  
