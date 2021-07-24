import { Component, OnInit, ViewChildren, QueryList, ViewChild, TemplateRef, EventEmitter, Output, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, Renderer2,ElementRef  } from '@angular/core';

//import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Casemanagers } from './patients.model';

import { casemanagerData } from './data';

import { NgbDate, NgbCalendar, NgbDateParserFormatter,NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';

import { DataTableDirective } from 'angular-datatables';

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent  implements OnInit, AfterViewInit, OnDestroy {


    @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
    isDtInitialized:boolean = false;
    dtRendered = true;
    dtInstance: Promise<DataTables.Api>;
  
    data: any;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();

    @ViewChild("confirmresendpatientcontent", {static: false}) modalContentResend: TemplateRef<any>;
    @ViewChild("confirmactivatepatientcontent", {static: false}) modalContentActive: TemplateRef<any>;
    @ViewChild("confirmdeactivatepatientcontent", {static: false}) modalContentDeactive: TemplateRef<any>;
  
/*
@ViewChild(DataTableDirective, {static: false})
dtElement: DataTableDirective;
isDtInitialized:boolean = false;

dtRendered = true;

dtInstance: Promise<DataTables.Api>;

data: any=[];
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject(); 
*/
 
// bread crumb items
breadCrumbItems: Array<{}>;
phonecodeValue = 1;

submitted: boolean;
term: any;
// page number
page = 1;
// default page size
pageSize = 10;

// start and end index
startIndex = 1;
endIndex = 10;
totalSize = 0;

paginatedContactData: Array<Casemanagers>;
contacts: Array<Casemanagers>;
// validation form
validationform: FormGroup;
editvalidationform: FormGroup;

filtervalidationform: FormGroup;


simulatebuildform: FormGroup;
simulatevalidationform: FormGroup;

simulateSchemas: FormArray;

CurrentURL:any;

isLoading = false;


DefaultaggregateData = true;

constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private http: HttpClient, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter,public config: NgbDatepickerConfig,
  private router: Router,private activatedRoute: ActivatedRoute,private spinner: NgxSpinnerService) {

    const currentDate = new Date();

    config.maxDate = {year:currentDate.getFullYear(), month:currentDate.getMonth()+1, day: currentDate.getDate()};
    config.minDate = {year: 1900, month: 1, day: 1};

    config.outsideDays = 'hidden';

}


BaseURL:any;
ChatBaseURL:any;
ProviderBaseURL:any;
staffId:any;
entityId:any;


checkboxarea:any;
inputboxarea:any;

checkboxareavalue:any;
inputboxareavalue:any;

registrationStatusFilterData:any;
lifeCycleStatusFilterData:any;
nameFilterData:any;


ngOnInit() {
  

  this.BaseURL = localStorage.getItem("SH360_API_URL");
  this.ChatBaseURL = localStorage.getItem("SH360_API_CHAT_URL");
  this.ProviderBaseURL = localStorage.getItem("SH360_API_PROVIDER_URL");
  

  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);

  this.staffId = loginUser.sh360Id;
  this.entityId = loginUser.entityId;
  // tslint:disable-next-line: max-line-length
  this.breadCrumbItems = [{ label: 'UBold', path: '/' }, { label: 'CRM', path: '/' }, { label: 'Casemanagers', path: '/', active: true }];
 
 
 /*
email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
 */
  this.validationform = this.formBuilder.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    dob: ['', [Validators.required]],
    zipcode: ['', [Validators.pattern("[0-9]{5}"), Validators.maxLength(5)]],
    phonecode: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    phone: ['',  [Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
    email: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
    pcp: [null],
    casemanager:  [null],
    speciality: [''],
    aggregation: [''],
    highriskpatient: [''],
  });
  this.editvalidationform = this.formBuilder.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    dob: ['', [Validators.required]],
    zipcode: ['', [Validators.pattern("[0-9]{5}"), Validators.maxLength(5)]],
    phonecode: ['', [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    phone: ['',  [Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
    email: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
    pcp: [null],
    casemanager:  [null],
    speciality: [''],
    aggregation: [''],
    highriskpatient: [''],
  });

  this.filtervalidationform = this.formBuilder.group({
    alpharadio:[''],
    alphselectbox1:[''],
    alphselectbox2:[''],
    alphselectbox3:[''],
    alphselectbox4:[''],
    alphselectbox5:[''],
    alphselectbox6:[''],
    alphselectbox7:[''],
    alphselectbox8:[''],
    alphainputbox:[''],
    status_active:[''],
    status_inactive:[''],
    registerstatus_yes:[''],
    registerstatus_no:[''],
    inputboxareavalue:[''],
    checkboxareavalue:['']
  });

  this.simulatebuildform = this.formBuilder.group({
    simulate   : this.formBuilder.array([]),
  })

  this.simulateSchemas = this.simulatebuildform.get('simulate') as FormArray;

  /*
  this.simulatevalidationform = this.formBuilder.group({
    simulate_id:[],
    simulate_description:[],
    simulate_cptCode:[],
    simulate_isActive:[]
  });
 */
  /**
   * Fetches Data
   */
  this._fetchData();

  this._fetchPCPData();

  this._fetchCMData();

  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    paging:true,
    lengthChange:false,
    columnDefs: [{ targets: 3, type: 'date' }],
    columns: [{
      data: 'id',
      searchable:false
    }, {
      data: 'firstName',
      searchable:false
    }, {
      data: 'lastName'
    }, {
      data: 'dateofBirth',
      searchable:false
    }, {
      data: 'caseManager',
      searchable:false
    }, {
      data: 'Regsitered',
      searchable:false
    }, {
      data: 'Status',
      searchable:false
    }, { 
    }]
  };   

  /*
  this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10,
    processing: true,
    paging:true,
    lengthChange:false,
  }; 
  */

  

  this.checkboxarea=true;
  this.inputboxarea=false;

  
  this.checkboxareavalue=1;
  this.inputboxareavalue=0;

  this.registrationStatusFilterData=[];
  this.lifeCycleStatusFilterData=[];
  this.nameFilterData=[];
/*
  for(var i=0;i<10;i++){
    this.addSimulate(); 
  }
*/
}
  
get form() {
  return this.validationform.controls;
} 


get editform() {
  return this.editvalidationform.controls;
}


addSimulate()
    {
      this.simulateSchemas.push(this.createSchemaForm());
    }

removeSimulate(index)
    {
      this.simulateSchemas.removeAt(index);
    }

createSchemaForm(): FormGroup {
  return this.formBuilder.group({
    simulate_id:[],
    simulate_description:[],
    simulate_cptCode:[],
    simulate_isActive:[]
  })
}    

openModal(content: string) {
  
  this.validationform.reset();
  this.submitted = false;
  this.DefaultaggregateData = true;
  this.iszipcodeEntered = false;
  this.ismobileEntered = false;
  this.isemailEntered = false;

  this.errormsg = ''; 
  this.successmsg = '';

  this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
}

/**
 * save the contacts data
 */
saveDataXXX() {
  const name = this.validationform.get('name').value;
  const phone = this.validationform.get('phone').value;
  const location = this.validationform.get('location').value;
  const email = this.validationform.get('email').value;
  const currentDate = new Date();
  if (this.validationform.valid) {
    /*
    this.contacts.push({
      image: 'assets/images/users/user-1.jpg',
      name,
      phone,
      location,
      email,
      date: currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear()
    });
    */
   /*
    this.validationform = this.formBuilder.group({
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      phone: '',
      email: ''
    });
    
    this.editvalidationform = this.formBuilder.group({
      firstname: '',
      lastname: '',
      phone: '',
      email: ''
    });
    */
    this.modalService.dismissAll();
  }
  this.submitted = true;
  this.totalSize = this.contacts.length + 1;
  this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
}

/**
 * Pagination onpage change
 * @param page show the page
 */
onPageChange(page: any): void {
  this.startIndex = (page - 1) * this.pageSize;
  this.endIndex = (page - 1) * this.pageSize + this.pageSize;
  this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
}


filterclearData(){

  this.registrationStatusFilterData=[];
  this.lifeCycleStatusFilterData=[];
  this.nameFilterData=[];

  
  this._fetchData();
  this.modalService.dismissAll();
  this.filtervalidationform.reset();
}

filterData(){

  this.nameFilterData=[];
  this.registrationStatusFilterData=[];
  this.lifeCycleStatusFilterData=[];

  const alphainputbox = this.filtervalidationform.get('alphainputbox').value;
  
  
  const alphselectbox1 = this.filtervalidationform.get('alphselectbox1').value;
  const alphselectbox2 = this.filtervalidationform.get('alphselectbox2').value;
  const alphselectbox3 = this.filtervalidationform.get('alphselectbox3').value;
  const alphselectbox4 = this.filtervalidationform.get('alphselectbox4').value;
  const alphselectbox5 = this.filtervalidationform.get('alphselectbox5').value;
  const alphselectbox6 = this.filtervalidationform.get('alphselectbox6').value;
  const alphselectbox7 = this.filtervalidationform.get('alphselectbox7').value;
  const alphselectbox8 = this.filtervalidationform.get('alphselectbox8').value;
 
  const status_active = this.filtervalidationform.get('status_active').value;
  const status_inactive = this.filtervalidationform.get('status_inactive').value;

  const registerstatus_yes = this.filtervalidationform.get('registerstatus_yes').value;
  const registerstatus_no = this.filtervalidationform.get('registerstatus_no').value;
   
  let AlphaString='';
    if(alphselectbox1==true) { AlphaString += 'A,B,C,'; }
    if(alphselectbox2==true) { AlphaString += 'D,E,F,'; }
    if(alphselectbox3==true) { AlphaString += 'G,H,I,'; }
    if(alphselectbox4==true) { AlphaString += 'J,K,L,'; }
    if(alphselectbox5==true) { AlphaString += 'M,N,O,'; }
    if(alphselectbox6==true) { AlphaString += 'P,Q,R,'; }
    if(alphselectbox7==true) { AlphaString += 'S,T,U,'; }
    if(alphselectbox8==true) { AlphaString += 'V,W,X,Z'; }
  
    if(alphainputbox!='' && alphainputbox!=null) {
      let ArrayData = alphainputbox.split(','); 
      const arrFiltered = ArrayData.filter(el => {
        return el != null && el != '';
      });
      this.nameFilterData =  arrFiltered;
    }

    if(AlphaString!='' && AlphaString!=null) { 
      let ArrayData = AlphaString.split(',');
      const arrFiltered = ArrayData.filter(el => {
        return el != null && el != '';
      });
      
      this.nameFilterData =  arrFiltered;
    }

    if(status_active==true) {
      this.lifeCycleStatusFilterData.push('ACTIVE')
    }
    if(status_inactive==true) {
      this.lifeCycleStatusFilterData.push('INACTIVE')
    }

    if(registerstatus_yes==true) {
      this.registrationStatusFilterData.push('ACTIVATED')
    }
    if(registerstatus_no==true) {
      this.registrationStatusFilterData.push('NOT_REGISTERED')
      this.registrationStatusFilterData.push('UNREGISTERED')
      
    }

    console.log(" this.nameFilterData",this.nameFilterData);
    console.log(" this.registrationStatusFilterData",this.registrationStatusFilterData);
    console.log(" this.lifeCycleStatusFilterData",this.lifeCycleStatusFilterData);
    

    this._fetchData();
    //this.filtervalidationform.reset();
    this.modalService.dismissAll();
}

private _fetchData() {
  this.spinner.show();

  this.totalSize = 0;
  this.isLoading = true;

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
    "name": this.nameFilterData,
    "registrationStatus": this.registrationStatusFilterData,
    "lifeCycleStatus": this.lifeCycleStatusFilterData,
    "sponsorId": this.entityId
}
   
   //console.log(this.BaseURL+'/user/patients');
   //let apiurl = this.BaseURL+'/admin/patients?sponsorId='+this.entityId;
   //let apiurl = 'http://localhost:11008/user/patients?entity=5fda3b4776d5d545a8934d8a';
 
   let apiurl = this.BaseURL+'/admin/patients';
   console.log(apiurl);
 
   this.http.post(apiurl,postData,header).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);

    this.isDtInitialized = true;
    this.data = dt['payload'];
    this.contacts = dt['payload'];
    //this.dtTrigger.next(); 
    this.rerender();
 
   this.startIndex = 0;
   this.endIndex = this.pageSize;
 
   this.paginatedContactData = this.contacts;
   this.totalSize = this.contacts.length;


  this.isLoading = false;
   /* 
   this.data = this.contacts;
   this.dtTrigger.next();
   this.loading = false;
    */
  this.spinner.hide();
   },
   error => {
     console.log('ERROR ON SAVE')

     this.data = [];
    this.contacts = [];
    this.rerender();
 
    this.startIndex = 0;
    this.endIndex = this.pageSize;

    this.paginatedContactData = this.contacts;
    this.totalSize = this.contacts.length;

     this.isLoading = false;
     this.spinner.hide(); 
   });  
 
   /*
   //this.contacts = casemanagerData;
   // apply pagination
   this.startIndex = 0;
   this.endIndex = this.pageSize;
 
   this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
   this.totalSize = this.contacts.length;
   */
 }

 PCPcontacts:any;
 private _fetchPCPData() {

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
  
   //console.log(this.BaseURL+'/user/patients');
   let apiurl = this.BaseURL+'/admin/entities';
 
   console.log(apiurl);
 
   this.http.get(apiurl,header).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);
     this.PCPcontacts = dt['payload'];
  
   });  
 
   /*
   //this.contacts = casemanagerData;
   // apply pagination
   this.startIndex = 0;
   this.endIndex = this.pageSize;
 
   this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
   this.totalSize = this.contacts.length;
   */
 }

 CMcontacts:any;
 private _fetchCMData() {

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
  
   //console.log(this.BaseURL+'/user/patients');
   let apiurl = this.BaseURL+'/admin/staffs/active?entityId='+this.entityId;
 
   console.log(apiurl);
 
   this.http.get(apiurl,header).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);
     //this.CMcontacts = dt['payload'];
  
     let CMcontactsArray = dt['payload'];

     this.CMcontacts = [];

     CMcontactsArray.forEach(element => {

      console.log('element',element);

      let elementNew = {
        "id": element.id,
        "sh360Id": element.sh360Id,
        "firstName": element.firstName,
        "lastName": element.lastName,
        "fullName": element.firstName+' '+element.lastName,
    };

    console.log('elementNew',elementNew);
      this.CMcontacts.push(elementNew);

     });
        
   });  
 
   /*
   //this.contacts = casemanagerData;
   // apply pagination
   this.startIndex = 0;
   this.endIndex = this.pageSize;
 
   this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
   this.totalSize = this.contacts.length;
   */
 }
 errormsg:any;
 successmsg:any;
 confrm:any;
 conmsg:any;
 error:any;
 loading:any;
 pcperrors:any;

saveData() {
  const firstname = this.validationform.get('firstname').value;
  const lastname = this.validationform.get('lastname').value;
  const phonecode = this.validationform.get('phonecode').value;
  const phone = this.validationform.get('phone').value;
  const email = this.validationform.get('email').value;
  const dobValue = this.validationform.get('dob').value;
  const zipcode = this.validationform.get('zipcode').value;
  const pcp = this.validationform.get('pcp').value;
  const casemanager = this.validationform.get('casemanager').value;
  const speciality = this.validationform.get('speciality').value;
  const aggregation = this.validationform.get('aggregation').value;
  const highriskpatient = this.validationform.get('highriskpatient').value;
  
  if(aggregation==true) {
    this.pcperrors = false;
    this.submitted = false;
    if(pcp==null) {
      console.log("VALID CM ERROR");
      this.pcperrors = true;
      this.submitted = true;
      return;
    }
  } else {    
    this.pcperrors = false;
    this.submitted = false;
  }

  const currentDate = new Date();
  if (this.validationform.valid) {
    console.log("VALID FORM");

    

    const dob = this.convertDateFormatDisplay(dobValue);

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
        .set('sh360_owner_id', this.staffId)
        .set('sh360_requester_id', this.staffId)
    }
  
  let postData = {
    "firstName": firstname,
    "lastName": lastname,
    "birthdate": dob,
    "mobile": {
        "extn": phonecode,
        "number": phone
    },
    "email": {
        "address": email
    },
    "entityId": pcp,
    "sponsorId": this.entityId,
    "staffId": casemanager,
    "zipcode": zipcode,
    "specialties": [],
    "aggregateData": aggregation,
    "highRiskPatient": highriskpatient
};

   console.log('postData',postData);
 
    //let apiurl = this.BaseURL+'/user/contact'; 
    //let apiurl = 'http://localhost:11008/user/patient';
    
    let apiurl = this.BaseURL+'/admin/patient'; 

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

        this.confrm = false;
        this.conmsg = true;

        
        this.contacts = [];
        this.data = [];
        this._fetchData();

        this.modalService.dismissAll();   
        
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
    //this.modalService.dismissAll();
  } else {
    this.submitted = true;
    this.iszipcodeEntered = true;
    this.ismobileEntered = true;
    this.isemailEntered = true;

    console.log("INVALID FORM");
    return;
  }
  this.submitted = true;
  //this.totalSize = this.contacts.length + 1;
  //this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
}


saveEditData(PData) {
  this.submitted = true;
  console.log('PData',PData);
  const pID = PData.id;
  const sh360Id = PData.sh360Id;
  
  const firstname = this.editvalidationform.get('firstname').value;
  const lastname = this.editvalidationform.get('lastname').value;
  const phonecode = this.editvalidationform.get('phonecode').value;
  const phone = this.editvalidationform.get('phone').value;
  const email = this.editvalidationform.get('email').value;
  const dobValue = this.editvalidationform.get('dob').value;
  const zipcode = this.editvalidationform.get('zipcode').value;
  const pcp = this.editvalidationform.get('pcp').value;
  const casemanager = this.editvalidationform.get('casemanager').value;
  const speciality = this.editvalidationform.get('speciality').value;
  const aggregation = this.editvalidationform.get('aggregation').value;
  const highriskpatient = this.editvalidationform.get('highriskpatient').value;
  
  if(aggregation==true) {
    this.pcperrors = false;
    this.submitted = false;
    if(pcp==null) {
      console.log("VALID CM ERROR");
      this.pcperrors = true;
      this.submitted = true;
      return;
    }
  } else {    
    this.pcperrors = false;
    this.submitted = false;
  }
  
  const dob = this.convertDateFormatDisplay(dobValue);

  const currentDate = new Date();
  if (this.editvalidationform.valid) {
    console.log("VALID EDIT FORM");
    this.submitted = false;
    
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
        .set('sh360_owner_id', sh360Id)
        .set('sh360_requester_id', this.staffId)
    }
 

    
  let postData = {
    "id": pID,
    "firstName": firstname,
    "lastName": lastname,
    "birthdate": dob,
    "mobile": {
        "extn": phonecode,
        "number": phone
    },
    "email": {
        "address": email
    },
    "entityId": pcp,
    "sponsorId": this.entityId,
    "staffId": casemanager,
    "zipcode": zipcode,
    "specialties": [],
    "aggregateData": aggregation,
    "highRiskPatient": highriskpatient
};
   

   console.log('postData',postData); 
   //return;
   //let apiurl = this.BaseURL+'/user/contact'; 
    //let apiurl = 'http://localhost:11008/user/casemanager';

    let apiurl = this.BaseURL+'/admin/patient'; 
    
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
        this.submitted = false;

        this.confrm = false;
        this.conmsg = true;

        this.contacts = [];
        this.data = [];
        this._fetchData();
        
        this.modalService.dismissAll();
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
    //this.modalService.dismissAll();
  } else {
    this.submitted = true;
    
    this.iszipcodeEntered = true;
    this.ismobileEntered = true;
    this.isemailEntered = true;
    
    console.log("INVALID EDIT FORM");
    return;
  }
  this.submitted = true;
  //this.totalSize = this.contacts.length + 1;
  //this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
}



saveSimulateData(PData) {
  this.submitted = true;
  console.log('PData',PData); 
  const pID = PData.patientId;
  const sh360Id = PData.patientId;
  
  console.log("simulateArray",this.simulatebuildform.value.simulate);

  var lineitemArray=[];
  if(this.simulatebuildform.value.simulate.length>0)
        {
         
          this.simulatebuildform.value.simulate.forEach(line =>{
            lineitemArray.push({'id':line.simulate_id, 'description': line.simulate_description,'cptCode': line.simulate_cptCode, 'isActive': line.simulate_isActive});
          })
            
        }


  console.log("lineitemArray",lineitemArray);      
 
  if (this.simulatebuildform.value.simulate.length>0) {
    console.log("VALID EDIT FORM");
    this.submitted = false;
    
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
        .set('sh360_owner_id', sh360Id)
        .set('sh360_requester_id', this.staffId)
    }
 

    
  let postData = {
    "patientId": sh360Id,
    "screenings": lineitemArray
    };
   

   console.log('postData',postData); 
   //return;
   //let apiurl = this.BaseURL+'/user/contact'; 
    //let apiurl = 'http://localhost:11008/user/casemanager';

    //let apiurl = this.BaseURL+'/admin/patient'; 
    
    //let apiurl = 'http://34.200.217.47:11001/api/patient/screenings';

    let apiurl = this.ProviderBaseURL+'/patient/screenings';

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

        this.confrm = false;
        this.conmsg = true;

        this.contacts = [];
        this.data = [];
        this._fetchData();
        
        this.modalService.dismissAll();
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
    //this.modalService.dismissAll();
  } else {
    this.submitted = true;
    
    this.iszipcodeEntered = true;
    this.ismobileEntered = true;
    this.isemailEntered = true;
    
    console.log("INVALID EDIT FORM");
    return;
  }
  this.submitted = true;
  //this.totalSize = this.contacts.length + 1;
  //this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
}


convertDateFormatDisplay(datevalue) {
  console.log("convertDateFormatDisplay",datevalue);
  
  console.log("convertDateFormatDisplay Y",datevalue.year);
  console.log("convertDateFormatDisplay M",("0" + datevalue.month).slice(-2));
  console.log("convertDateFormatDisplay D",("0" + datevalue.day).slice(-2));

  var years = datevalue.year;
  var months = ("0" + datevalue.month).slice(-2);
  var days  = ("0" + datevalue.day).slice(-2);
  
  //var strTime = days+months+years;
  var strTime = years+'-'+months+'-'+days;
  return strTime;

}

contactInfoDetail:any;
contactInfo:any;
dobObject:any;

openSimulateModal(id,sh360id,content:string) {
  this.submitted = false;
  
  this.errormsg = ''; 
  this.successmsg = '';

  console.log("ID",id);
  console.log("SH360ID",sh360id);

 if(this.simulatebuildform.value.simulate.length) {
 /* 
  for(var i= this.simulatebuildform.value.simulate.length ;i > this.simulatebuildform.value.simulate.length;i--){
    this.removeSimulate(i); 
  }
 */

  this.removeSimulate(10); 
  this.removeSimulate(9); 
  this.removeSimulate(8); 
  this.removeSimulate(7); 
  this.removeSimulate(6); 
  this.removeSimulate(5); 
  this.removeSimulate(4); 
  this.removeSimulate(3); 
  this.removeSimulate(2); 
  this.removeSimulate(1); 
  this.removeSimulate(0); 

 }
  

  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);
  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', sh360id)
    .set('sh360_requester_id', this.staffId)
}
 
  //console.log(this.BaseURL+'/user/casemanager');
  //let apiurl = this.BaseURL+'/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
  //let apiurl = 'http://localhost:11008/user/casemanager/details?manager='+id;

  //let apiurl = this.BaseURL+'/admin/patient?id='+id;
  
  //http://34.200.217.47:11001/api/patient/screenings?patientId=a6ce1fc0-6c0b-4fd3-a03c-5985913274a0

  let apiurl = this.ProviderBaseURL+'/patient/screenings?patientId='+sh360id;
  
  console.log(apiurl);

  this.http.get(apiurl,header).subscribe((data) => { 
    const dt = data;
    console.log(dt['payload']);
    this.contactInfoDetail = dt['payload'];
    this.contactInfo = dt['payload'].screenings;
    console.log("this.contactInfo",this.contactInfo);
    let count = this.contactInfo.length;
    console.log("this.count",count);
    for(var i=0;i< count;i++){
      this.addSimulate(); 
    }

    /*

    //let DOBValue = this.contactInfo.birthdate;
 
    console.log("this.calendar.getToday()",this.calendar.getToday());
    this.dobObject = this.calendar.getToday();
    //this.dobObject = this.formatter.format(this.contactInfo.birthdate);
 
    


    if(this.contactInfo.birthdate) {
      var dateparts = this.contactInfo.birthdate.split("-");
      console.log("dateparts",dateparts);
      let yr = parseInt(dateparts[0]);
      let mr = parseInt(dateparts[1]);
      let dr = parseInt(dateparts[2]);
      console.log({"year": yr,"month": mr,"day": dr});
      this.dobObject = {"year": yr,"month": mr,"day": dr}
    }
    
    if(this.contactInfo.mobile){

    } else {
      this.contactInfo.mobile = {};
    }

    
    if(this.contactInfo.email){

    } else {
      this.contactInfo.email = {};
    }

    //this.dobObject = new Date();
    //console.log("this.contactInfo.birthdate",this.contactInfo.birthdate);
    //this.dobObject =this.formatter.format(this.contactInfo.birthdate);
    //console.log("this.dobObject",this.dobObject);
    //var date = new Date();
    //this.dobObject = new NgbDate({ day: date.getUTCDay(), month: date.getUTCMonth(), year: date.getUTCFullYear()});
    */

    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  });  

  
}

openEditModal(id,sh360id,content:string) {
  this.submitted = false;
  
  this.errormsg = ''; 
  this.successmsg = '';

  console.log("ID",id);
  console.log("SH360ID",sh360id);

  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);
  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', sh360id)
    .set('sh360_requester_id', this.staffId)
}
 
  //console.log(this.BaseURL+'/user/casemanager');
  //let apiurl = this.BaseURL+'/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
  //let apiurl = 'http://localhost:11008/user/casemanager/details?manager='+id;

  let apiurl = this.BaseURL+'/admin/patient?id='+id;
  console.log(apiurl);

  this.http.get(apiurl,header).subscribe((data) => { 
    const dt = data;
    console.log(dt['payload']);
    this.contactInfo = dt['payload'];


    //let DOBValue = this.contactInfo.birthdate;
 
    console.log("this.calendar.getToday()",this.calendar.getToday());
    this.dobObject = this.calendar.getToday();
    //this.dobObject = this.formatter.format(this.contactInfo.birthdate);
 
    


    if(this.contactInfo.birthdate) {
      var dateparts = this.contactInfo.birthdate.split("-");
      console.log("dateparts",dateparts);
      let yr = parseInt(dateparts[0]);
      let mr = parseInt(dateparts[1]);
      let dr = parseInt(dateparts[2]);
      console.log({"year": yr,"month": mr,"day": dr});
      this.dobObject = {"year": yr,"month": mr,"day": dr}
    }
    
    if(this.contactInfo.mobile){

    } else {
      this.contactInfo.mobile = {};
    }

    
    if(this.contactInfo.email){

    } else {
      this.contactInfo.email = {};
    }

    //this.dobObject = new Date();
    //console.log("this.contactInfo.birthdate",this.contactInfo.birthdate);
    //this.dobObject =this.formatter.format(this.contactInfo.birthdate);
    //console.log("this.dobObject",this.dobObject);
    //var date = new Date();
    //this.dobObject = new NgbDate({ day: date.getUTCDay(), month: date.getUTCMonth(), year: date.getUTCFullYear()});

    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  });  

  
}

ModalID:any;
ModalSH360ID:any;
ModalCONTENT:any;

openDeactiveModal(id,sh360id,content:string) {

  this.ModalID = id;
  this.ModalSH360ID = sh360id;
  this.ModalCONTENT = content;
  
  this.modalService.open(this.modalContentDeactive, { centered: true });

}

openDeactiveModalOkay(id,sh360id,content:string) {
  this.modalService.dismissAll();
  /*
  if(confirm("Are you sure to deactivate this Patient?")) {
    
  } else {
    return;
  }
  */
  console.log("openDeactiveModal");
  
  this.submitted = false;
  console.log("ID",id);
  console.log("SH360ID",sh360id); 
  
  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);
  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', sh360id)
    .set('sh360_requester_id', this.staffId)
} 

  let apiurl = this.BaseURL+'/admin/patient/deactivate?id='+id;
  console.log(apiurl);

  this.http.delete(apiurl,header).subscribe((data) => { 
    const dt = data;
    console.log(dt['payload']);
    this.contactInfo = dt['payload'];
    if(dt['errorCode']){
      this.errormsg =  dt['message'];
      this.successmsg =  ''; 
    }
    else
    {
      this.errormsg = ''; 
      this.successmsg =  dt['message']; 
    }
    
    this.contacts = [];
    this.data = [];
    
    this._fetchData();

    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  });  

  
}

openActiveModal(id,sh360id,content:string) {

  this.ModalID = id;
  this.ModalSH360ID = sh360id;
  this.ModalCONTENT = content;

  this.modalService.open(this.modalContentActive, { centered: true });

}

openActiveModalOkay(id,sh360id,content:string) {
  this.modalService.dismissAll();
/*
  if(confirm("Are you sure to activate this Patient?")) {
    
  } else {
    return;
  }
*/
  console.log("openActiveModal");

  this.submitted = false;
  console.log("ID",id);
  console.log("SH360ID",sh360id);

  
  
  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);
  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', sh360id)
    .set('sh360_requester_id', this.staffId)
}

  let apiurl = this.BaseURL+'/admin/patient/activate?id='+id;
  console.log(apiurl);

  let postData ={}

  this.http.post(apiurl,postData,header).subscribe((data) => { 
    const dt = data;
    console.log(dt['payload']);
    this.contactInfo = dt['payload'];
    if(dt['errorCode']){
      this.errormsg =  dt['message'];
      this.successmsg =  ''; 
    }
    else
    {
      this.errormsg = ''; 
      this.successmsg =  dt['message']; 
    }
    
    this.contacts = [];
    this.data = [];

    this._fetchData();

    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  });  

  
}


openDeleteModal(id,sh360id,content:string) {
  
  if(confirm("Are you sure to delete this Patient?")) {
    
  } else {
    return;
  }

  this.submitted = false;
  console.log("ID",id);
  console.log("SH360ID",sh360id);
 
  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);
  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', sh360id)
    .set('sh360_requester_id', this.staffId)
} 
 
  let apiurl = this.BaseURL+'/admin/patient/deactivate?id='+id;
  console.log(apiurl);

  this.http.put(apiurl,header).subscribe((data) => { 
    const dt = data;
    console.log(dt['payload']);
    this.contactInfo = dt['payload'];
    if(dt['errorCode']){
      this.errormsg =  dt['message'];
      this.successmsg =  ''; 
    }
    else
    {
      this.errormsg = ''; 
      this.successmsg =  dt['message']; 
    }
    
 
    this.contacts = [];
    this.data = [];
    
    this._fetchData();
    
    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  });  

  
}

openResendModal(id,sh360id,content:string) {

  this.ModalID = id;
  this.ModalSH360ID = sh360id;
  this.ModalCONTENT = content;

  this.modalService.open(this.modalContentResend, { centered: true });

}

openResendModalOkay(id,sh360id,content:string) {
  this.modalService.dismissAll();
  /*
  if(confirm("Are you sure to resend activation code?")) {
    
  } else {
    return;
  }
  */
  this.submitted = false;
  console.log("ID",id);
  console.log("SH360ID",sh360id);

  
  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);
  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 var header = {
  headers: new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization',  'Bearer '+loginUser.token)
    .set('sh360_owner_id', sh360id)
    .set('sh360_requester_id', this.staffId)
}

 
  //console.log(this.BaseURL+'/user/casemanager');
  //let apiurl = this.BaseURL+'/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
  //let apiurl = 'http://localhost:11008/user/casemanager/details?manager='+id;
  //http://localhost:11008/user/casemanager/deactivate?manager=6049f5580ca6307e7c5b2075

  let apiurl = this.BaseURL+'/admin/patient/code?id='+id;
  console.log(apiurl);
  this.http.get(apiurl,header).subscribe((data) => { 
    const dt = data;
    console.log(dt['payload']);
    this.contactInfo = dt['payload'];
 
    if(dt['errorCode']){
      this.errormsg =  dt['message'];
      this.successmsg =  ''; 
    }
    else
    {
      this.errormsg = ''; 
      this.successmsg =  dt['message']; 
    }

    
    this.contacts = [];
    this.data = [];
    
    //this._fetchData();
    
    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  });  

}


openRefreshModal(content:string) {

  //this.filtervalidationform.reset();
  this.nameFilterData=[];
  this.registrationStatusFilterData=[];
  this.lifeCycleStatusFilterData=[];

  this._fetchData();
  
}

ismobileEntered: boolean = false;
mobileEntered()
{
this.ismobileEntered = true;
if(this.form.phone.value=="") {
  this.ismobileEntered = false;
}
}

mobileEditEntered()
{
this.ismobileEntered = true;
if(this.editform.phone.value=="") {
  this.ismobileEntered = false;
}
}


iszipcodeEntered: boolean = false;
zipcodeEntered()
{
this.iszipcodeEntered = true;
if(this.form.zipcode.value=="") {
  this.iszipcodeEntered = false;
}
}

zipcodeEditEntered()
{
this.iszipcodeEntered = true;
if(this.editform.zipcode.value=="") {
  this.iszipcodeEntered = false;
}
}

isemailEntered: boolean = false;
emailEntered()
{
this.isemailEntered = true;
if(this.form.email.value=="") {
  this.isemailEntered = false;
}
}

emailEditEntered()
{
this.isemailEntered = true;
if(this.editform.email.value=="") {
  this.isemailEntered = false;
}
}


ngOnDestroy(): void {
  // Do not forget to unsubscribe the event
  this.dtTrigger.unsubscribe();
}

rerender(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
  });
}   

ngAfterViewInit() {
  this.dtTrigger.next();

  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.on( 'draw.dt', function () {
          if(jQuery('.dataTables_empty').length > 0) {
              jQuery('.dataTables_empty').remove();
          }
      });
  });
}

updateboxarea(box:any){

  if(box==1) {
    
  this.checkboxarea=true;
  this.inputboxarea=false;

  this.checkboxareavalue=1;
  this.inputboxareavalue=0;


  } else {
    
  this.checkboxarea=false;
  this.inputboxarea=true;

  this.checkboxareavalue=0;
  this.inputboxareavalue=1;


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
