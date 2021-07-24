import { Component, OnInit, ViewChildren, QueryList, ViewChild, EventEmitter, Output, Input  } from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { CardData, TableData } from './dashboard.model';

import { cardData, tableData, projectData, inboxData, medicationData  } from './data';

//import { DashboardService } from './dashboard.service';

//import { DasbaordSortableDirective, SortEvent } from './dashboard-sortable.directive';


import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../../core/services/cookie.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

//import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { FormGroup, FormBuilder, ValidatorFn, FormControl, Validators, NgForm, FormArray, AbstractControl } from '@angular/forms';

/*
import { Component, OnInit } from '@angular/core';

import { Widgets, Contacts, ChartType } from './dashboard.model';

import { widgetsData, analyticsLineChart, averagetimeBarChart, contactsData, salesDonutChart } from './data';
*/

import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

import { Options } from 'ng5-slider';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})

/**
 * CRM dashboard component - handling the CRM-dashboard with sidebar and content
 */
export class RulesComponent implements OnInit {


  searchText: any;
  myForm: FormGroup;
  public duplicateTimeColumns: FormArray;
  
 
  sliderList: any = [
    {id: '20-40', label: '20 - 40'},
    {id: '40-60', label: '40 - 60'},
    {id: '60-80', label: '60 - 80'}
  ];

  options: Options = {
    disabled: true,
  };


  minValue: number;
  maxValue: number;


  disable = true;

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
 

  frequencyList = [
    {id: 1, name: '1 Time a day'},
    {id: 2, name: '2 Times a day'},
    {id: 3, name: '3 Times a day'},
    {id: 4, name: '4 Times a day'}
    ];

    durationdayvalue: any;
    durationList = [
      {id: 1, name: '1 - 30 Days'},
      {id: 2, name: '31 - 60 Days'},
      {id: 3, name: '61 - 90 Days'},
      {id: 4, name: '91 - 180 Days'},
      {id: 5, name: '181 - 365 Days'},
      {id: 6, name: 'Lifetime'}
      ];

 // validation form
 patientvalidationform: FormGroup;
 
 alertaddform: FormGroup;
 alerteditform: FormGroup;

 alerteditform1: FormGroup;
 alerteditform2: FormGroup;
 alerteditform3: FormGroup;


 projectData: any;

 inboxData: any;

 globalAlert: any;

 medicationData: any;

 medicationDataCount: any;
 
 medicationReminderData: any;

 medicationReminderDataCount: any;
 
 reminderrepeatEveryday: any;
 reminderrepeatSpecificday: any;
 
 SUNCHECK: any;
 MONCHECK: any;
 TUECHECK: any;
 WEDCHECK: any;
 THUCHECK: any;
 FRICHECK: any;
 SATCHECK: any;
 
 // validation form
 remindervalidationform: FormGroup;

 allremindervalidationform: FormGroup;

 constructor( private route: ActivatedRoute, private router: Router, 
  private http: HttpClient, private cookieService: CookieService,
  private modalService: NgbModal, public formBuilder: FormBuilder,calendar: NgbCalendar
  ) {}

  pid: any;

  ngOnInit() {
    console.log('START');

    this.BaseURL = localStorage.getItem("SH360_API_URL");

    

    //this.pid = '8226e7bc-41a1-42b1-9f54-120d754e1bb3';
    //this.pid = 'f38a7a15-d4dc-4872-96e5-802f77f72065';

    this.pid = 'f33329c9-b294-4b3b-95a3-f6ec033a677d';

/*
https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy/medication/reminder/global?patientId=5ab384f9-67b0-4544-aac1-5046141c476d&isEnabled=false&timezone=Asia%2FKolkata

https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy/medication/calendars?patientId=5ab384f9-67b0-4544-aac1-5046141c476d&status=active
*/
    this.BaseURL = 'https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy';
    //this.BaseURL = 'http://18.213.144.230:11001/api';

    this.MessageBox0 = true;

    
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

     
    this.options = {
      floor: 10,
      ceil: 100,
    }
    this.createForm();

     
    /**
     * Fetches Data
     */
    //this._fetchData();
    console.log('END');

    
    this.projectData = projectData;

    this.inboxData = inboxData;

    //this.medicationData = medicationData;

  }

  createForm()
  {
    this.allremindervalidationform = this.formBuilder.group({
      allreminderset: ['', [Validators.required]],
    });

    this.remindervalidationform = this.formBuilder.group({
      reminderset: ['', [Validators.required]],
      frequencytiming: [null, [Validators.required]],
      settimes:this.formBuilder.array([]),
      reminderrepeat: ['', [Validators.required]],
      weekdays:[''],
      durationday: ['', [Validators.required]],
      dayrange:['', [Validators.required]],
      totaldays:['', [Validators.required]],
     
    });
    this.duplicateTimeColumns = this.remindervalidationform.get('settimes') as FormArray;
  
  }

  createtimeColumnForm(): FormGroup {
    return this.formBuilder.group({
      times           : [null]
    })
  }

  addCustomColumn()
    {
      this.duplicateTimeColumns.push(this.createtimeColumnForm());
    }

    removeCustomColumn(index)
    {
      this.duplicateTimeColumns.removeAt(index);
    }

    getSelectedTime( event: any)
    {
        if( event != undefined )
        {
          this.removeAll()
          for(var i=0;i<event.id;i++)
          {         
            this.addCustomColumn()
          }
        }else{
          this.removeAll()
        }
    }

    getSelectedSlider( event: any)
    {
      if( event != undefined )
      {
        var sldiers = event.id.split('-');

        //this.options.floor = sldiers[0];
        //this.options.ceil = sldiers[1];

        this.options = {
          floor: sldiers[0],
          ceil: sldiers[1],
        }
          this.minValue = sldiers[0];
          //this.maxValue = sldiers[1];
       
      }else{
        this.minValue = this.options.floor
        //this.maxValue = this.options.ceil
      }
    }

    removeAll()
    {
      while (this.duplicateTimeColumns.length > 0) {
        this.duplicateTimeColumns.removeAt(0);
      }
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

    //var pid = 'eac0b21a-4442-4f2e-bf66-04025d600d0c';
    //var pid = 'f38a7a15-d4dc-4872-96e5-802f77f72065';

    
    let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    console.log(loginUser);
    
    let keyword = '';

  
    //let apiurl = 'http://18.213.144.230:11001/api/clinicaldata/medications?subject='+this.pid+'&timezone=Asia%2FCalcutta&status=active';

    let apiurl = this.BaseURL+'/clinicaldata/medications?subject='+this.pid+'&timezone=Asia%2FCalcutta&status=active';
     
    console.log("FETCH MEDICATION::",apiurl);

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
        
         this.medicationData = playloadData.SH360Resources;
         this.medicationDataCount = playloadData.SH360Resources.length;
         console.log(this.medicationData);

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
  return this.remindervalidationform.controls;
 }

 saveReminderData(medicationReminderSettingData) {

  console.log("medicationReminderSettingData",medicationReminderSettingData);
  //var pid = 'eac0b21a-4442-4f2e-bf66-04025d600d0c';
  //var pid = 'f38a7a15-d4dc-4872-96e5-802f77f72065';
  


  var DurationisManualEndDate = medicationReminderSettingData.duration.isManualEndDate;
  var DurationisManualStartDate = medicationReminderSettingData.duration.isManualStartDate;
  var DurationisManualTotalDays = medicationReminderSettingData.duration.isManualTotalDays;
  var DurationtotalDays = medicationReminderSettingData.duration.totalDays;

  var Reminderid = medicationReminderSettingData.id;
  
  var Medicinedescription = medicationReminderSettingData.medicine.description;
  var MedicinedosageQty = medicationReminderSettingData.medicine.dosageQty;
  var MedicinedosageUnit = medicationReminderSettingData.medicine.dosageUnit;
  var Medicineinstruction = medicationReminderSettingData.medicine.instruction;

  var ReminderpatientId = medicationReminderSettingData.patientId;
  
  var Repeattext = medicationReminderSettingData.repeat.text;
  var RepeatweekDays = medicationReminderSettingData.repeat.weekDays;

  var ReminderresourceId = medicationReminderSettingData.resourceId;

  var Remindertimezone = medicationReminderSettingData.timezone;
  
  var TimingisManualTimeOfDay = medicationReminderSettingData.timing.isManualTimeOfDay;
  var TimingisManualTimesPerDay = medicationReminderSettingData.timing.isManualTimesPerDay;
  var TimingtimeOfDay = medicationReminderSettingData.timing.timeOfDay;
  var TimingtimesPerDay = medicationReminderSettingData.timing.timesPerDay;


  if(medicationReminderSettingData.repeat.text=='') {
     Repeattext = 'EVERYDAY';
  }

  /*

  Add/Update Reminder:
Request:POST
http://18.213.144.230:11001/api/medication/reminder/chart
Params 1: 
{"duration":{"isManualEndDate":true,"isManualStartDate":false,"isManualTotalDays":true,"totalDays":10},"id":"8a9b4498-4297-42ac-84c4-f1ab64f03c30-2716584","medicine":{"description":"Ranitidine","dosageQty":"150","dosageUnit":"mg","instruction":"1 tablet after meals, Twice a day"},"patientId":"8a9b4498-4297-42ac-84c4-f1ab64f03c30","repeat":{"text":"EVERYDAY","weekDays":[]},"resourceId":"2716584","timezone":"Asia/Kolkata","timing":{"isManualTimeOfDay":true,"isManualTimesPerDay":true,"timeOfDay":["07:00:00","12:00:00","16:00:00","20:00:00"],"timesPerDay":4}}

 

Params 2: 
{"duration":{"isManualEndDate":true,"isManualStartDate":false,"isManualTotalDays":true,"totalDays":10},"id":"8a9b4498-4297-42ac-84c4-f1ab64f03c30-2716584","medicine":{"description":"Ranitidine","dosageQty":"150","dosageUnit":"mg","instruction":"1 tablet after meals, Twice a day"},"patientId":"8a9b4498-4297-42ac-84c4-f1ab64f03c30","repeat":{"text":"SPECIFIC","weekDays":["MON","WED","THU"]},"resourceId":"2716584","timezone":"Asia/Kolkata","timing":{"isManualTimeOfDay":true,"isManualTimesPerDay":true,"timeOfDay":["07:00:00","12:00:00","16:00:00","20:00:00"],"timesPerDay":4}}

 

Response:
{"result":1,"message":"SUCCESS","timestamp":"21-Dec-2020 05:31:22","payload":true}
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

//let postData = {"duration":{"isManualEndDate":true,"isManualStartDate":false,"isManualTotalDays":true,"totalDays":10},"id":"8a9b4498-4297-42ac-84c4-f1ab64f03c30-2716584","medicine":{"description":"Ranitidine","dosageQty":"150","dosageUnit":"mg","instruction":"1 tablet after meals, Twice a day"},"patientId":"8a9b4498-4297-42ac-84c4-f1ab64f03c30","repeat":{"text":"EVERYDAY","weekDays":[]},"resourceId":"2716584","timezone":"Asia/Kolkata","timing":{"isManualTimeOfDay":true,"isManualTimesPerDay":true,"timeOfDay":["07:00:00","12:00:00","16:00:00","20:00:00"],"timesPerDay":4}}

//let postData = {"duration":{"isManualEndDate":true,"isManualStartDate":false,"isManualTotalDays":true,"totalDays":10},"id":"8a9b4498-4297-42ac-84c4-f1ab64f03c30-2716584","medicine":{"description":"Ranitidine","dosageQty":"150","dosageUnit":"mg","instruction":"1 tablet after meals, Twice a day"},"patientId":"8a9b4498-4297-42ac-84c4-f1ab64f03c30","repeat":{"text":"SPECIFIC","weekDays":["MON","WED","THU"]},"resourceId":"2716584","timezone":"Asia/Kolkata","timing":{"isManualTimeOfDay":true,"isManualTimesPerDay":true,"timeOfDay":["07:00:00","12:00:00","16:00:00","20:00:00"],"timesPerDay":4}}

/*

let postDataMaster = {
    "duration":{
        "isManualEndDate": medicationReminderSettingData.duration.isManualEndDate,
        "isManualStartDate": medicationReminderSettingData.duration.isManualStartDate,
        "isManualTotalDays": medicationReminderSettingData.duration.isManualTotalDays,
        "totalDays": medicationReminderSettingData.duration.totalDays
    },
    "id": medicationReminderSettingData.id,
    "medicine":{
      "description": medicationReminderSettingData.medicine.description,
      "dosageQty": medicationReminderSettingData.medicine.dosageQty,
      "dosageUnit": medicationReminderSettingData.medicine.dosageUnit,
      "instruction": medicationReminderSettingData.medicine.instruction
    },
    "patientId": medicationReminderSettingData.patientId,
    "repeat":{
      "text": medicationReminderSettingData.repeat.text,
      "weekDays": medicationReminderSettingData.repeat.weekDays
    },
    "resourceId": medicationReminderSettingData.resourceId,
    "timezone": medicationReminderSettingData.timezone,
    "timing":{
      "isManualTimeOfDay": medicationReminderSettingData.timing.isManualTimeOfDay,
      "isManualTimesPerDay": medicationReminderSettingData.timing.isManualTimesPerDay,
      "timeOfDay": medicationReminderSettingData.timing.timeOfDay,
      "timesPerDay": medicationReminderSettingData.timing.timesPerDay
    }
  }

*/
  
let postData = {
  "duration":{
      "isManualEndDate": DurationisManualEndDate,
      "isManualStartDate": DurationisManualStartDate,
      "isManualTotalDays": DurationisManualTotalDays,
      "totalDays": DurationtotalDays
  },
  "id": Reminderid,
  "medicine":{
    "description": Medicinedescription,
    "dosageQty": MedicinedosageQty,
    "dosageUnit": MedicinedosageUnit,
    "instruction": Medicineinstruction
  },
  "patientId": ReminderpatientId,
  "repeat":{
    "text": Repeattext,
    "weekDays": RepeatweekDays
  },
  "resourceId": ReminderresourceId,
  "timezone": Remindertimezone,
  "timing":{
    "isManualTimeOfDay": TimingisManualTimeOfDay,
    "isManualTimesPerDay": TimingisManualTimesPerDay,
    "timeOfDay": TimingtimeOfDay,
    "timesPerDay": TimingtimesPerDay
  }
}

  console.log('postData',postData);
  //return false;

  
  let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
  //console.log(loginUser);

  const headers = new HttpHeaders;
  headers.append('Content-Type', 'application/json');
 

    //let apiurl = this.BaseURL+'/admin/member'; 

    //let apiurl = 'http://18.213.144.230:11001/api/medication/reminder/chart?reqFrom=case-manager';

    let apiurl = this.BaseURL+'/medication/reminder/chart?reqFrom=case-manager';

    //let apiurl = 'http://18.213.144.230:11001/api/medication/reminder/chart';


    
    console.log("SAVE REMINDER API:",apiurl);

    this.http.post(apiurl, postData, { headers: headers })
    .subscribe(
      data => {
        console.log('SUCCESS ON SAVE')
        const dt = data;
        console.log(dt);
        
       if(dt['payload']){
         console.log("SUCCESS");
         console.log(dt['payload']);
         //const user = dt['payload'];
         //this.errormsg = 'Validation error / Already Registered';
         //this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
         //this.router.navigate(['/dashboard']);

         this.showMedications(this.pid);
         this.openModal('savesuccesscontent');
     
       }
       else
       {
        console.log("ERROR"); 
        console.log(dt['payload']);
        //this.error = 'Invalid Login';
        //this.router.navigate(['/dashboard']);
        //this.modalService.dismissAll();
        //this._fetchData();

        this.openModal('savefailurecontent');
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

FrequencyEdit: any;
FrequencyTimeEdit: any;
DurationEdit: any;

timesPerDayValue: any;

clickMedication(mid) {
  //var pid = 'eac0b21a-4442-4f2e-bf66-04025d600d0c';
  //var pid = 'f38a7a15-d4dc-4872-96e5-802f77f72065';

  this.MessageBox0=false;
  this.MessageBox1=false;

  this.FrequencyEdit = false;
  this.FrequencyTimeEdit = false;
  this.DurationEdit = false;

  this.MedicationReminderTimeBox1 = false;
  this.MedicationReminderTimeBox2 = false;
  this.MedicationReminderTimeBox3 = false;
  this.MedicationReminderTimeBox4 = false;

  let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
  console.log(loginUser);
  
  let keyword = '';
 
  let apiurl = this.BaseURL+'/medication/reminder?resourceId='+mid+'&patientId='+this.pid+'&timezone=Asia/Kolkata';

  //let apiurl = 'http://18.213.144.230:11001/api/medication/reminder?resourceId='+mid+'&patientId='+this.pid+'&timezone=Asia/Kolkata';

  console.log(apiurl);

  this.http.get(apiurl)
  .subscribe(
    data => {        
      const dt = data;
     if(dt['payload']){
        //console.log(dt['payload']);
        const playloadData = dt['payload'];  
        /*
        this.tickets$ = playloadData.docs;
        this.total$ = playloadData.totalDocs;
        */
      
       this.medicationReminderData = playloadData;
       this.medicationReminderDataCount = playloadData.length;
       console.log(this.medicationReminderData);
       
       this.MessageBox0=false;
       this.MessageBox1=true;

       if(this.medicationReminderData.isReminderSet) {

        this.MedicationReminderFormBox1 = true;

       } else {

        this.MedicationReminderFormBox1 = false;

       }

       if(this.medicationReminderData.timing.timesPerDay ==1 ) {

        this.MedicationReminderTimeBox1 = true;
        this.timesPerDayValue = this.medicationReminderData.timing.timesPerDay;

       } else if(this.medicationReminderData.timing.timesPerDay ==2 ) {

        this.MedicationReminderTimeBox2 = true;
        this.timesPerDayValue = this.medicationReminderData.timing.timesPerDay;

       } else if(this.medicationReminderData.timing.timesPerDay ==3 ) {

        this.MedicationReminderTimeBox3 = true;
        this.timesPerDayValue = this.medicationReminderData.timing.timesPerDay;

       } else if(this.medicationReminderData.timing.timesPerDay ==4 ) {

        this.MedicationReminderTimeBox4 = true;
        this.timesPerDayValue = this.medicationReminderData.timing.timesPerDay;

       } else {

        this.timesPerDayValue = null;

       }

       
      if(this.medicationReminderData.timing.isManualTimesPerDay == true ) {

        this.FrequencyEdit = false;

      } else {

        this.FrequencyEdit = true;

      }

      
      if(this.medicationReminderData.timing.isManualTimeOfDay == true ) {

        this.FrequencyTimeEdit = false;

      } else {

        this.FrequencyTimeEdit = true;

      }


      if(this.medicationReminderData.duration.totalDays >=1 || this.medicationReminderData.duration.totalDays <=30 ) {

        this.durationdayvalue = 1;

      } else if(this.medicationReminderData.duration.totalDays >=31 || this.medicationReminderData.duration.totalDays <=60 ) {

        this.durationdayvalue = 2;

      } else if(this.medicationReminderData.duration.totalDays >=61 || this.medicationReminderData.duration.totalDays <=90 ) {
       
        this.durationdayvalue = 3;

      } else if(this.medicationReminderData.duration.totalDays >=91 || this.medicationReminderData.duration.totalDays <=180 ) {
        
        this.durationdayvalue = 4;  
      
      } else if(this.medicationReminderData.duration.totalDays >=181 || this.medicationReminderData.duration.totalDays <=365 ) {
      
        this.durationdayvalue = 5;

      } else if(this.medicationReminderData.duration.totalDays >=366) {
      
        this.durationdayvalue = 6;

      } else {

        this.durationdayvalue = null;

      }

      if(this.medicationReminderData.duration.isManualTotalDays == true ) {

        this.DurationEdit = false;

      } else {

        this.DurationEdit = true;

      }
       

       if(this.medicationReminderData.repeat.text == 'SPECIFIC') {
        
        this.MedicationReminderDayBox = true;
        this.reminderrepeatEveryday = false;
        this.reminderrepeatSpecificday = true;

        var DaysList = this.medicationReminderData.repeat.weekDays;
 
        if(DaysList.indexOf("SUN") !== -1) {
          this.SUNCHECK = true;
        } else {
          this.SUNCHECK = false;
        }

        if(DaysList.indexOf("MON") !== -1) {
          this.MONCHECK = true;
        } else {
          this.MONCHECK = false;
        }

        if(DaysList.indexOf("TUE") !== -1) {
          this.TUECHECK = true;
        } else {
          this.TUECHECK = false;
        }

        if(DaysList.indexOf("WED") !== -1) {
          this.WEDCHECK = true;
        } else {
          this.WEDCHECK = false;
        }
 
        if(DaysList.indexOf("THU") !== -1) {
          this.THUCHECK = true;
        } else {
          this.THUCHECK = false;
        }

        if(DaysList.indexOf("FRI") !== -1) {
          this.FRICHECK = true;
        } else {
          this.FRICHECK = false;
        }

        if(DaysList.indexOf("SAT") !== -1) {
          this.SATCHECK = true;
        } else {
          this.SATCHECK = false;
        }
 

       } else if(this.medicationReminderData.repeat.text == 'EVERYDAY') {

        this.MedicationReminderDayBox = false;
        this.reminderrepeatEveryday = true;
        this.reminderrepeatSpecificday = false;
        
       } else {

        this.MedicationReminderDayBox = false;
        this.reminderrepeatEveryday = true;
        this.reminderrepeatSpecificday = false;
        
       }


        
    this.MessageBox1=true;
    
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


 /*
  if(mid==1) {
    this.MessageBox0=false;
    this.MessageBox1=true;
    this.MessageBox2=false;
    this.MessageBox3=false;
    this.MessageBox4=false;
  } else if(mid==2) {
    this.MessageBox0=false;
    this.MessageBox1=false;
    this.MessageBox2=true;
    this.MessageBox3=false;
    this.MessageBox4=false;
  } else if(mid==3) {
    this.MessageBox0=false;
    this.MessageBox1=false;
    this.MessageBox2=false;
    this.MessageBox3=true;
    this.MessageBox4=false;
  } else if(mid==4) {
    this.MessageBox0=false;
    this.MessageBox1=false;
    this.MessageBox2=false;
    this.MessageBox3=false;
    this.MessageBox4=true;
  }
  */

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

}


MedicationBox = false;
showMedications(patientid) {

  console.log("patientid:"+patientid);

  //this._fetchData();

  
  //let apiurl = this.BaseURL+'/clinicaldata/medications?subject='+this.pid+'&timezone=Asia%2FCalcutta&status=active';
     
  //let apiurl = 'http://18.213.144.230:11001/api/clinicaldata/medications?subject='+this.pid+'&timezone=Asia%2FCalcutta&status=active';


  //let apiurl = 'https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy/medication/calendars?patientId=f33329c9-b294-4b3b-95a3-f6ec033a677d&status=active';

  let apiurl = this.BaseURL+'/medication/calendars?patientId='+this.pid+'&timezone=Asia%2FCalcutta&status=active';
    

  console.log("FETCH MEDICATION::",apiurl);

  this.http.get(apiurl)
  .subscribe(
    data => {        
      const dt = data;
     if(dt['payload']){
        console.log(dt['payload']);
        const playloadData = dt['payload'];  
      
        this.globalAlert = playloadData.globalAlert;
        this.medicationData = playloadData.medications;
        this.medicationDataCount = playloadData.medications.length;
        console.log(this.medicationData);

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

  if(this.MedicationBox) {
    this.MedicationBox=true;
  } else {
    this.MedicationBox=true;
  }

}


AllReminderForm(event: any){
 
  //console.log(event);
 
  var target = event.target || event.srcElement || event.currentTarget;
  var value = target.checked;  
  console.log("CHECKED ",value);
  
   
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');
   
   /*
   https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy/medication/reminder/global?patientId=5ab384f9-67b0-4544-aac1-5046141c476d&isEnabled=false&timezone=Asia%2FKolkata
   */
   let apiurl = this.BaseURL+'/medication/reminder/global?patientId='+this.pid+'&isEnabled='+value+'&timezone=Asia%2FKolkata';
 
   //let apiurl = 'http://18.213.144.230:11001/api//medication/reminder/global?patientId='+this.pid+'&isEnabled='+value+'&timezone=Asia%2FKolkata';
 
   var postData = '';
 
   console.log("ALL REMINDER API:",apiurl);
 
     this.http.post(apiurl, postData, { headers: headers })
     .subscribe(
       data => {
         console.log('SUCCESS ON SAVE')
         const dt = data;
         console.log(dt);

         
         this.showMedications(this.pid);
         this.openModal('savesuccesscontent');
        
         /*
         
        if(dt['payload']){
          console.log("SUCCESS");
          console.log(dt['payload']);
        
          this.showMedications(this.pid);
 
          this.openModal('savesuccesscontent');
      
        }
        else
        {
         console.log("ERROR"); 
         console.log(dt['payload']);
        
         this.openModal('savefailurecontent');
        }
        */ 
         return false;
       },
       error => {
         console.log('ERROR ON SAVE')
         this.errormsg = error;
         this.error = error;
         this.loading = false;
       }
     );
  
   
 }

MedicationReminderFormBox = false;
MedicationReminderFormBox1 = false;
MedicationReminderFormBox2 = true;
MedicationReminderFormBox3 = false;
MedicationReminderFormBox4 = false;

showReminderForm(ReminderID, event: any){

 console.log("ReminderID",ReminderID); 
 //console.log(event);

 var target = event.target || event.srcElement || event.currentTarget;
 var value = target.checked;  
 console.log("CHECKED ",value);

 if(value==true) {

 } else {

  
  const headers = new HttpHeaders;
  headers.append('Content-Type', 'application/json');
  
  /*
  http://18.213.144.230:11001/api/medication/reminder/chart/off?calendarId=8a9b4498-4297-42ac-84c4-f1ab64f03c30-2716584
  */
  let apiurl = this.BaseURL+'/medication/reminder/chart/off?calendarId='+ReminderID;

  //let apiurl = 'http://18.213.144.230:11001/api/medication/reminder/chart/off?calendarId=+ReminderID;

  var postData = '';

    
    console.log("OFF REMINDER API:",apiurl);

    this.http.post(apiurl, postData, { headers: headers })
    .subscribe(
      data => {
        console.log('SUCCESS ON SAVE')
        const dt = data;
        console.log(dt);
        
       if(dt['payload']){
         console.log("SUCCESS");
         console.log(dt['payload']);
       
         this.showMedications(this.pid);

         this.openModal('savesuccesscontent');
     
       }
       else
       {
        console.log("ERROR"); 
        console.log(dt['payload']);
       
        this.openModal('savefailurecontent');
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

 }
  
  if(this.MedicationReminderFormBox1) {
    this.MedicationReminderFormBox1=false;
  } else {
    this.MedicationReminderFormBox1=true;
  }

  /*
  if(box==1) {
    if(this.MedicationReminderFormBox1) {
      this.MedicationReminderFormBox1=false;
    } else {
      this.MedicationReminderFormBox1=true;
    }
  } else if(box==2) {
    if(this.MedicationReminderFormBox2) {
      this.MedicationReminderFormBox2=false;
    } else {
      this.MedicationReminderFormBox2=true;
    }
  } else if(box==3) {
    if(this.MedicationReminderFormBox3) {
      this.MedicationReminderFormBox3=false;
    } else {
      this.MedicationReminderFormBox3=true;
    }
  } else if(box==4) {
    if(this.MedicationReminderFormBox4) {
      this.MedicationReminderFormBox4=false;
    } else {
      this.MedicationReminderFormBox4=true;
    }
  }
  */

  /*
  if(this.MedicationReminderFormBox) {
    this.MedicationReminderFormBox=false;
  } else {
    this.MedicationReminderFormBox=true;
  }
   
  */
 
}


MedicationReminderTimeBox1 = false;
MedicationReminderTimeBox2 = false;
MedicationReminderTimeBox3 = false;
MedicationReminderTimeBox4 = false;

frequencyChange(eventObj: any){
  console.log("event :", eventObj); 
  var event = eventObj;
  /*
  var event = eventObj.id;
  if(event==0) {
    
    this.MedicationReminderTimeBox1 = false;
    this.MedicationReminderTimeBox2 = false;
    this.MedicationReminderTimeBox3 = false;
    this.MedicationReminderTimeBox4 = false;
  
  } else if(event==1) {

    this.MedicationReminderTimeBox1 = true;
    this.MedicationReminderTimeBox2 = false;
    this.MedicationReminderTimeBox3 = false;
    this.MedicationReminderTimeBox4 = false;

  } else if(event==2) {

    this.MedicationReminderTimeBox1 = false;
    this.MedicationReminderTimeBox2 = true;
    this.MedicationReminderTimeBox3 = false;
    this.MedicationReminderTimeBox4 = false;

  } else if(event==3) {

    this.MedicationReminderTimeBox1 = false;
    this.MedicationReminderTimeBox2 = false;
    this.MedicationReminderTimeBox3 = true;
    this.MedicationReminderTimeBox4 = false;

  } else if(event==4) {

    this.MedicationReminderTimeBox1 = false;
    this.MedicationReminderTimeBox2 = false;
    this.MedicationReminderTimeBox3 = false;
    this.MedicationReminderTimeBox4 = true;

  }
  */

  if( event != undefined )
        {
          this.removeAll()
          for(var i=0;i<event.id;i++)
          {         
            this.addCustomColumn()
          }
        }else{
          this.removeAll()
        }
}

MedicationReminderDayBox = false;

remindmeChange(event: any){
  var target = event.target || event.srcElement || event.currentTarget;
  var value = target.attributes.value.nodeValue;  
   

  if(value=='EVERYDAY') {
    this.MedicationReminderDayBox=false;
  } else if(value=='SPECIFIC') {
    this.MedicationReminderDayBox=true;  
  } else {
    this.MedicationReminderDayBox=false;
  }

    /*
    var target = event.target || event.srcElement || event.currentTarget;
    var idAttr = target.attributes.id;
    var value = idAttr.nodeValue;
    console.log("target value:"+target);
    console.log("event value:"+value);
    console.log("event value:"+value);
    */
}


durationdayChange(eventObj: any){
  console.log("event :", eventObj); 
  var event = eventObj.id;
}

}
