import { Component, OnInit, ViewChildren, QueryList, ViewChild, EventEmitter, Output, Input  } from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { CardData, TableData } from './dashboard.model';

import { cardData, tableData, projectData, inboxData, inboxDataSingle  } from './data';

//import { DashboardService } from './dashboard.service';

//import { DasbaordSortableDirective, SortEvent } from './dashboard-sortable.directive';


import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../../core/services/cookie.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

/*
import { Component, OnInit } from '@angular/core';

import { Widgets, Contacts, ChartType } from './dashboard.model';

import { widgetsData, analyticsLineChart, averagetimeBarChart, contactsData, salesDonutChart } from './data';
*/

import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})

/**
 * CRM dashboard component - handling the CRM-dashboard with sidebar and content
 */
export class AlertsComponent implements OnInit {

  searchText: any;
  
  MessageBox0 = false;
  MessageBox1 = false;
  MessageBox2 = false;
  MessageBox3 = false;
  MessageBox4 = false;
  MessageBox5 = false;

  BaseURL = '';
  errormsg = '';
  error = '';
  loading = false;
  
  // bread crumb items
  breadCrumbItems: Array<{}>;

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


 projectData: any;

 inboxData: any;

 inboxDataSingle: any;

 constructor( private route: ActivatedRoute, private router: Router, 
  private http: HttpClient, private cookieService: CookieService,
  private modalService: NgbModal, public formBuilder: FormBuilder,calendar: NgbCalendar
  ) {}

  ngOnInit() {
    console.log('START');

    this.MessageBox0 = true;

    this.BaseURL = localStorage.getItem("SH360_API_URL");
    
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
    console.log('END');

    
    this.projectData = projectData;

    this.inboxData = inboxData;

    this.inboxDataSingle = inboxDataSingle;

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
    this.cardData = cardData;
    // Tickets Table Data
    this.tableData = tableData;
  }
  
 

  openModal(content: string) {
    this.modalService.open(content, { centered: true });
  }

  openModalNew(content: string) { 
    this.modalService.dismissAll();
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


clickUser() {
  
  /*
  if(this.MessageBox0) {
    this.MessageBox0=false;
    this.MessageBox1=true;
    this.MessageBox2=false;
  } else {
    this.MessageBox0=true;
    this.MessageBox1=false;
    this.MessageBox2=false;
  }
  */
  
  this.MessageBox0=false;
  this.MessageBox1=true;
  this.MessageBox2=false;
  
}

showMessages() {
  
  if(this.MessageBox1) {
    this.MessageBox1=false;
    this.MessageBox2=true;
  } else {
    this.MessageBox1=true;
    this.MessageBox2=false;
  }
  
}

}