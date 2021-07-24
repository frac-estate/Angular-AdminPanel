import { Component, OnInit, ViewChildren, QueryList, ViewChild, EventEmitter, Output, Input  } from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { CardData, TableData } from './dashboard.model';
/*
import { cardData, tableData } from './data';
*/
//import { DashboardService } from './dashboard.service';

//import { DasbaordSortableDirective, SortEvent } from './dashboard-sortable.directive';


import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../../core/services/cookie.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

/*
import { Component, OnInit } from '@angular/core';
*/
import { Widgets, Contacts, ChartType } from './dashboard.model';

import { widgetsData, analyticsLineChart, averagetimeBarChart, contactsData, salesDonutChart } from './data';


import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crmdashboard',
  templateUrl: './crmdashboard.component.html',
  styleUrls: ['./crmdashboard.component.scss']
})

/**
 * CRM dashboard component - handling the CRM-dashboard with sidebar and content
 */
export class CrmdashboardComponent implements OnInit {

  BaseURL = '';
  errormsg = '';
  error = '';
  loading = false;
  
  // bread crumb items
  breadCrumbItems: Array<{}>;
  phonecodeValue = 1;
  
  // Card Data
  cardData: CardData[];

  // Table data
  tableData: TableData[];

  tickets$: Observable<TableData[]>;
  total$: Observable<number>;

  selectValue: string[];
  selectRuleValue: string[];
  selectUserValue: string[];
  selectedUserValue: string[];

  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;

  hidden: boolean;
  selected: any;
  color: string;
  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  @ViewChild('dp', {static: true}) datePicker: any;


  /*
  @ViewChildren(DasbaordSortableDirective) headers: QueryList<DasbaordSortableDirective>;

  constructor(public service: DashboardService) {
    this.tickets$ = service.tickets$;
    this.total$ = service.total$;
  }
  */

  
 selectValueArray = [
  {id: 1, name: 'Medication Adherence'},
  {id: 2, name: 'Gaps in Care'},
  {id: 3, name: 'High Cost'}
  ];

  selectedCategory = 1;

  addvar1  = false;
  addvar2  = false;
  addvar3  = false;
  addvar4  = false;
 


 // validation form
 patientvalidationform: FormGroup;
 alertaddform: FormGroup;
 alerteditform: FormGroup;

 alerteditform1: FormGroup;
 alerteditform2: FormGroup;
 alerteditform3: FormGroup;


 widgetsData: Widgets[];
 contactsData: Contacts[];

 analyticsLineChart: ChartType;
 averagetimeBarChart: ChartType;
 salesDonutChart: ChartType;

 constructor( private route: ActivatedRoute, private router: Router, 
  private http: HttpClient, private cookieService: CookieService,
  private modalService: NgbModal, public formBuilder: FormBuilder,calendar: NgbCalendar
  ) {}

  staffId:any;
  entityId:any;
  pvalidationform: FormGroup;
  cmvalidationform: FormGroup;

  ngOnInit() {
    console.log('START');
    this.BaseURL = localStorage.getItem("SH360_API_URL");

   
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
    this.staffId = loginUser.sh360Id;
    this.entityId = loginUser.entityId;


    this.breadCrumbItems = [];

    this.selectValue = ['Medication Adherence Alert'];

    this.selectRuleValue = ['Missed Medication Rule','Preventative Mammogram Rule','Specialist Visit Rule'];
    
    this.selectUserValue = [
      'Robert Philip',
      'Isaac Ben',
      'David Bryant',
      'Gerald Christoper',
      'James Cohen',
      'Jonathan Agnew',
      'Paul Simon',
      'Peter Hoffman',
    ];

    this.selectedUserValue = [
      'Robert Philip',
      'Isaac Ben',
    ];

    
    this.selected = '';
    this.hidden = true;

    this.patientvalidationform = this.formBuilder.group({
      /*
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      */
    });

    this.alertaddform = this.formBuilder.group({
      Recipients: [],
    });

    this.alerteditform = this.formBuilder.group({
      Recipients: [],
    });

    this.alerteditform1 = this.formBuilder.group({
      Recipients: [],
    });

    this.alerteditform2 = this.formBuilder.group({
      Recipients: [],
    });

    this.alerteditform3 = this.formBuilder.group({
      Recipients: [],
    });

    /**
     * Fetches Data
     */
    this._fetchData();

    
  this._fetchPCPData();

  this._fetchCMData();

    console.log('END');

    this.cmvalidationform = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phonecode: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      phone: ['',  [Validators.required, Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    });

    this.pvalidationform = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      zipcode: ['', [Validators.required, Validators.pattern("[0-9]{5}"), Validators.maxLength(5)]],
      phonecode: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      phone: ['',  [Validators.required, Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      pcp: [null, [Validators.required]],
      casemanager:  [null, [Validators.required]],
      speciality: [''],
      aggregation: [''],
    });
  }

  onSort(event:any){
    console.log('onSort');
  }

  /* 
  onSort({ column, direction }: SortEvent) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  */

  private _fetchData() {

    this.widgetsData = widgetsData;
    this.analyticsLineChart = analyticsLineChart;
    this.averagetimeBarChart = averagetimeBarChart;
    this.contactsData = contactsData;
    this.salesDonutChart = salesDonutChart;
    
    let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    console.log(loginUser);
    
    //let apiurl = 'https://cors-anywhere.herokuapp.com/http://sms.akst.in/public/api/signin';
    //let apiurl = 'http://localhost:4200/assets/json/count.json'
    //let apiurl = 'http://18.213.144.230:11006/api/admin/members?sponsor=5f31248dce99d416c2cbcd5e'

    //let apiurl = 'http://18.213.144.230:11006/api/admin/members?sponsor='+loginUser.userId;
    //let apiurl = 'http://localhost:4200/assets/json/member.json';

    let keyword = '';

    //let apiurl = 'http://18.213.144.230:11006/api/admin/search/members?keyword='+keyword+'&sponsor='+loginUser.userId;
    //let apiurl = this.BaseURL+'/admin/search/members?keyword='+keyword+'&sponsor='+loginUser.userId;
   
    let apiurl = './assets/json/alerts.json';
    console.log(apiurl);

    this.http.get(apiurl)
    .subscribe(
      data => {        
        const dt = data;
       if(dt['payload']){
          console.log(dt['payload']);
          const playloadData = dt['payload'];  
          /*
          this.tickets$ = playloadData.docs;
          this.total$ = playloadData.totalDocs;
          */
        
         this.tickets$ = playloadData;
         this.total$ = playloadData.length;
         
       }
       else
       {
        this.error = 'Invalid';
       }
         
        return false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    ); 


    // Tickets Card Data
    //this.cardData = cardData;
    // Tickets Table Data
    //this.tableData = tableData;
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
  }
  
   //console.log(this.BaseURL+'/user/patients');
   let apiurl = this.BaseURL+'/admin/staffs/active?entityId='+this.entityId;
 
   console.log(apiurl);
 
   this.http.get(apiurl,header).subscribe((data) => { 
     const dt = data;
     console.log(dt['payload']);
     this.CMcontacts = dt['payload'];
  
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

  openModal(content: string) {
    this.modalService.open(content, { centered: true });
  }

  openModalNew(content: string) { 
    this.modalService.dismissAll();
    this.modalService.open(content, { centered: true });
  }
  

  
  //errormsg:any; 
  successmsg:any;
  submitted:any;

  openCMModal(content: string) {
  
    this.cmvalidationform.reset();
    this.submitted = false;
    
    this.errormsg = ''; 
    this.successmsg = '';
  
    this.modalService.open(content, { centered: true });
  }

  openPModal(content: string) {
  
    this.pvalidationform.reset();
    this.submitted = false;
    
    this.errormsg = ''; 
    this.successmsg = '';
  
    this.modalService.open(content, { centered: true });
  }
  
  
  /*
  breadCrumbItems: Array<{}>;

  widgetsData: Widgets[];
  contactsData: Contacts[];

  analyticsLineChart: ChartType;
  averagetimeBarChart: ChartType;
  salesDonutChart: ChartType;
  constructor() { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'UBold', path: '/' }, { label: 'CRM', path: '/' }, { label: 'Dashboard', path: '/', active: true }];

    this._fetchData();
  }
 
  private _fetchData() {
    this.widgetsData = widgetsData;
    this.analyticsLineChart = analyticsLineChart;
    this.averagetimeBarChart = averagetimeBarChart;
    this.contactsData = contactsData;
    this.salesDonutChart = salesDonutChart;
  }

  */

 get form() {
  return this.patientvalidationform.controls;
 }

 
 get cmform() {
  return this.cmvalidationform.controls;
 }

 
 get pform() {
  return this.pvalidationform.controls;
 }

 
 savePatientData() {
   /*
    const firstName = this.patientvalidationform.get('firstName').value;
    const lastName = this.patientvalidationform.get('lastName').value;
    const birthDate = this.patientvalidationform.get('birthDate').value;
    const email = this.patientvalidationform.get('email').value;
    const mobile = this.patientvalidationform.get('mobile').value;
    const gender = this.patientvalidationform.get('gender').value;
    const zipcode = this.patientvalidationform.get('zipcode').value;
    */
    if (this.patientvalidationform.valid) {
      console.log('FORM SUBMIT');

      
    let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    console.log(loginUser);

    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
   
    /*  
    let postDataX = {
    "userId": loginUser.userId,
    "verificationCode": this.f.verificationCode.value
    };
    */
/*
   let postData = {
    "firstName": firstName,
    "lastName": lastName,
    "birthDate": birthDate,
    "mobile": mobile,
    "email": email,
    "gender": gender,
    "entityId": loginUser.entity,
    "sponsorId": loginUser.userId,
    "providerId": "6456546546"
  };
  */

   let postData = {};

   console.log('postData',postData);
 
    //let apiurl = 'http://18.213.144.230:11006/api/admin/member';
    let apiurl = this.BaseURL+'/admin/member'; 
    this.http.post(apiurl, postData, { headers: headers })
    .subscribe(
      data => {
        console.log('SUCCESS ON SAVE')
        const dt = data;
        console.log(dt);
        
       if(dt['errorCode']){
         console.log(dt['payload']);
         const user = dt['payload'];
         this.errormsg = 'Validation error / Already Registered';
         //this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
         //this.router.navigate(['/dashboard']);
     
       }
       else
       {
        //this.error = 'Invalid Login';

        this.router.navigate(['/dashboard']);
        this.modalService.dismissAll();
        this._fetchData();
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

    } else {
      this.errormsg = 'Validation error / Please fill form data';
      console.log('ERROR ON FORM')
    }
    /*
    if (this.validationform.valid) {

      this.opportunityData.push({
        company: 'assets/images/companies/amazon.png',
        name,
        phone,
        location: 'California',
        category,
        email,
        status: 'Won'
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
    */
  }


  newrulewindow = true;
  oldrulewindow = false;

  selectRadio(id:any) {
    console.log(id);

    if(id==1) {
      this.newrulewindow = true;
      this.oldrulewindow = false;
    } else if(id==2) {
      this.newrulewindow = false;
      this.oldrulewindow = true;
    }

  }
  

  /**
   * on date selected
   * @param date date object
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
  }

  /**
   * Is hovered over date
   * @param date date obj
   */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * @param date date obj
   */
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
   * @param date date obj
   */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }


  delete(){
    var check = confirm("You will not be able to receive any alerts still do you want to delete the Alert?")
     if(check){
         console.log("yes, OK pressed")
     }else{
         console.log("No, cancel pressed")
     }
 }


 addvariablevalue:any;

 addcategorychange(event:any)
{
  console.log("addcategorychange");  
  this.addvariablevalue = '';
  this.addvar1 = false;
  this.addvar2 = false;
  this.addvar3 = false;
  this.addvar4 = false;
  if(event) {
    if(event.id == 1) { 
      this.addvar1 = true; 
      this.addvariablevalue = ' Var Medicine 1 =  Ranitidine \n Var Medicine 2 =  Lipitor \n\n(Medicine1.Skipped equals true or Medicine2.Skipped equals true) and (Patient.firstname equals Donna and Patient.lastname equals Dobson and Patient.DOB equals 07/03/1947)';
    }
    if(event.id == 2) { 
      this.addvar2 = true; 
      this.addvariablevalue = ' Patient.gender equals female and Patient.age > 40 and Patient.preventative.mammogram.currentdate is .NotNull';
    }
    if(event.id == 3) { 
      this.addvar3 = true; 
      this.addvariablevalue = ' (Patient.SpecialityVisit equals true or Patient.Inpatientadmission equals true) \n Patient.SpecialityVisit  =  false \n Patient.Inpatientadmission = false';
    }
    if(event.id == 4) { 
      this.addvar4 = true; 
      this.addvariablevalue = '';
    }
  }
  
}


confrm:any;
conmsg:any;

cmsaveData() {
 const firstName = this.cmvalidationform.get('firstname').value;
 const lastName = this.cmvalidationform.get('lastname').value;
 const phonecode = this.cmvalidationform.get('phonecode').value;
 const phone = this.cmvalidationform.get('phone').value;
 const email = this.cmvalidationform.get('email').value;
 const currentDate = new Date();
 if (this.cmvalidationform.valid) {
   console.log("VALID FORM");

   
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
   }
 
 let postData = {
   "firstName": firstName,
   "lastName": lastName,
   "mobile": {
       "extn": phonecode,
       "number": phone
   },
   "email": {
       "address": email
   },
   "entityId": this.entityId,
   "userType": "Case-Manager"
}

  console.log('postData',postData);

   //let apiurl = this.BaseURL+'/user/contact'; 
   //let apiurl = 'http://localhost:11008/user/casemanager';
   
   let apiurl = this.BaseURL+'/admin/staff'; 

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

       this.cmvalidationform.reset();
       this.modalService.dismissAll();   
       this._fetchData();
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
   console.log("INVALID FORM");
   return;
 }
 this.submitted = true;
 //this.totalSize = this.contacts.length + 1;
 //this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
}


psaveData() {
  const firstname = this.pvalidationform.get('firstname').value;
  const lastname = this.pvalidationform.get('lastname').value;
  const phonecode = this.pvalidationform.get('phonecode').value;
  const phone = this.pvalidationform.get('phone').value;
  const email = this.pvalidationform.get('email').value;
  const dobValue = this.pvalidationform.get('dob').value;
  const zipcode = this.pvalidationform.get('zipcode').value;
  const pcp = this.pvalidationform.get('pcp').value;
  const casemanager = this.pvalidationform.get('casemanager').value;
  const speciality = this.pvalidationform.get('speciality').value;
  const aggregation = this.pvalidationform.get('aggregation').value;
  

  const currentDate = new Date();
  if (this.pvalidationform.valid) {
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
    "aggregateData": aggregation
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

        this.pvalidationform.reset();
        
        this.modalService.dismissAll();   
        this._fetchData();
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
    console.log("INVALID FORM");
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


}