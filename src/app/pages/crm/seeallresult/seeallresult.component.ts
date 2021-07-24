import { Component, OnInit, ViewChildren, QueryList, ViewChild, EventEmitter, Output, Input, AfterViewInit, OnDestroy, ChangeDetectorRef, Renderer2,ElementRef  } from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Subject } from 'rxjs';

import 'rxjs/add/operator/map';

import * as _ from 'lodash';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

//import { CardData, TableData } from './dashboard.model';

import { cardData, tableData, projectData, inboxData, medicationData  } from './data';

//import { DashboardService } from './dashboard.service';

//import { DasbaordSortableDirective, SortEvent } from './dashboard-sortable.directive';


import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../../core/services/cookie.service';

import { FormGroup, FormBuilder, ValidatorFn, FormControl, Validators, NgForm, FormArray, AbstractControl } from '@angular/forms';

/*
import { Component, OnInit } from '@angular/core';

import { Widgets, Contacts, ChartType } from './dashboard.model';

import { widgetsData, analyticsLineChart, averagetimeBarChart, contactsData, salesDonutChart } from './data';
*/

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { Options } from 'ng5-slider';

import { LocationStrategy } from '@angular/common';

import * as moment from 'moment';

import 'moment-timezone';

//import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';

import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';


//declare var $: any;
//declare var jQuery: any;

//import $ from "jquery";

import { DataTableDirective } from 'angular-datatables';

/* Calendar Start */

import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
 
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

const yearmonths: any = [
  {
    key:0,
    name: 'JAN',
    digit: '1',
  },
  {
    key:1,
    name: 'FEB',
    digit: '2',
  },
  {
    key:2,
    name: 'MAR',
    digit: '3',
  },
  {
    key:3,
    name: 'APR',
    digit: '4',
  },
  {
    key:4,
    name: 'MAY',
    digit: '5',
  },
  {
    key:5,
    name: 'JUN',
    digit: '6',
  },
  {
    key:6,
    name: 'JUL',
    digit: '7',
  },
  {
    key:7,
    name: 'AUG',
    digit: '8',
  },
  {
    key:8,
    name: 'SEP',
    digit: '9',
  },
  {
    key:9,
    name: 'OCT',
    digit: '10',
  },
  {
    key:10,
    name: 'NOV',
    digit: '11',
  },
  {
    key:11,
    name: 'DEC',
    digit: '12',
  },
];
 
/* Calendar End */

import { SocketService } from '../socket.service';

@Component({
  selector: 'app-seeallresult',
  templateUrl: './seeallresult.component.html',
  styleUrls: ['./seeallresult.component.scss']
})
export class SeeallresultComponent implements AfterViewInit, OnInit, OnDestroy {

  DashboardLanding: any;  
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  isDtInitialized:boolean = false;

  dtRendered = true;
  
  dtInstance: Promise<DataTables.Api>;

  data: any=[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject(); 

  collapse: boolean = true;
  addclass: any = 'hideclass';

  medicationReminderDataisReminderSet: any;
  reminderrepeatValue:any;
  searchText: any;
  searchMedicationText:any;

 // validation form
 remindervalidationform: FormGroup;

 allremindervalidationform: FormGroup;

 allmedicationfilterform: FormGroup;

 messageform: FormGroup;

 myForm: FormGroup;
 public duplicateTimeColumns: FormArray;
 public duplicateDaysColumns: FormArray;

 typeValue: any;

 frequencyList = [
  {id: 1, name: '1 Time a day'},
  {id: 2, name: '2 Times a day'},
  {id: 3, name: '3 Times a day'},
  {id: 4, name: '4 Times a day'}
  ];

  frequencyTimes: any = [];

  durationdayvalue: any;
  durationList = [
    {id: '1-30', name: '1 - 30 Days'},
    {id: '31-60', name: '31 - 60 Days'},
    {id: '61-90', name: '61 - 90 Days'},
    {id: '91-180', name: '91 - 180 Days'},
    {id: '181-365', name: '181 - 365 Days'},
    {id: '10000', name: 'Lifetime'}
    ];


 
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



MedicationBox = false;  

FrequencyEdit: any;
FrequencyTimeEdit: any;
DurationEdit: any;

timesPerDayValue: any;

MedicationReminderTimeBox1 = false;
MedicationReminderTimeBox2 = false;
MedicationReminderTimeBox3 = false;
MedicationReminderTimeBox4 = false;

medicationReminderData: any;
medicationReminderDataCount: any;

MedicationReminderFormBox1 = false;
  
MedicationReminderDayBox = false;
reminderrepeatEveryday = false;
reminderrepeatSpecificday = false;

SUNCHECK: any;
MONCHECK: any;
TUECHECK: any;
WEDCHECK: any;
THUCHECK: any;
FRICHECK: any;
SATCHECK: any;

errormsg = '';
  error = '';
  loading = false;

  globalAlert: any;
  globalAlertValue: any;

  MessageBox: any;
  projectData: any;
  inboxData: any;
  AllMedication: any;
  medicationData: any;

  resourceType: any;
  resourceTypeURLValue: any;
  viewType: any;
  patientId: any;
  BaseURL: any;
  staffId: any;
  ChatBaseURL: any;

  Playerdata: any = [];
  rows: any = [];
  columns: any = [];
  //data: any=[];

  submitted = false;
  settimeserrors = false;
  setdayserrors = false;
  setdayscounterrors = false;

  /*
  data: any=[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  lastViewedDataValue = localStorage.getItem('lastViewedDataValue');
  dayDifferenceValue = localStorage.getItem('dayDifferenceValue');
  BaseURL = localStorage.getItem("SH360_API_URL");

  patientId = this.getCookie("patientId");
  resourceType = this.route.snapshot.paramMap.get('resourceType');
  resourceTypeURLValue = this.route.snapshot.paramMap.get('resourceType');
  viewType = this.route.snapshot.paramMap.get('viewType');

  providerId = this.getCookie("providerId");
  providerRole = this.getCookie("providerRole");
  patientSessionId = this.getCookie("patientSessionId");
  */

  searchResults: any = [];
  searchFilterResults: any = [];
  searchGroupResults: any = [];

  searchFilterEntities: any = [];
  searchFilterProviders: any = [];
  searchFilterVisitTypes: any = [];
  searchFilterResources: any = [];

  EntityLength: any =[];
  ProviderLength: any =[];
  VisitLength: any =[];
  ResourceLength: any =[];

  medicationState: any = [];
  medicationRequest: any = [];
  allergies: any = [];
  patientFirstNameValue:any=[];
  patientLastNameValue:any=[];

  
  searchKeyValueArray: any = [];
  resourceTypeValueArray: any = [];
  providerNameValueArray: any = [];
  entityNameValueArray: any = [];
  visitTypeNameValueArray: any = [];
  periodNameValueArray: any = [];
  
  
  searchKeyValue: any;
  resourceTypeValue: any;
  providerNameValue: any;
  entityNameValue: any;
  visitTypeNameValue: any;
  periodNameValue: any;

  today: string;
  timeZone: string;
 
  @ViewChild('divMessages',{ static: false }) divMessages: ElementRef;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor( private route: ActivatedRoute, private router: Router, 
    private http: HttpClient, private cookieService: CookieService, private location: LocationStrategy,
    private modalService: NgbModal, public formBuilder: FormBuilder,private calendar: NgbCalendar,public sanitizer: DomSanitizer,
    public cdr: ChangeDetectorRef,
    public tooltipconfig: NgbTooltipConfig, private modal: NgbModal,
    private socketService: SocketService, 
    private renderer: Renderer2, private el: ElementRef,
    public formatter: NgbDateParserFormatter
    ) {

        // preventing back button in browser implemented by "Samba Siva"  
        history.pushState(null, null, window.location.href);  
        this.location.onPopState(() => {
          history.pushState(null, null, window.location.href);
        });  
      
        //this.socketService.receiveMessage();

        //this.socketService.staffContact('userData');

        this.socketService.SeeallresultComponent$.subscribe(res => {
          console.log('res',res);
          //var msg:string = String(res);
          if(res!=null) {
            this.receiveMessage(res);
          } else {
            console.log("GET PATIENT INFO");
            this.getPatientInfo();
          }
          
        })

        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);

        this.fromDate = null;
        this.toDate = null;
    }
    
  ngOnInit() {
    this.DashboardLanding = true;
    this.socketService.setup();
    var socketData = '';
    this.socketService.staffContact(socketData);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      paging:true,
      lengthChange:false,
    }; 

    console.log('START');
    console.log(localStorage.getItem("loginUser"));
 
    this.today = moment().format('D MMM YYYY');
    this.timeZone = moment.tz.guess();

    console.log("MOMENT", moment().format());
    console.log("ZONE",moment.tz.guess());

   /*
    this.BaseURL = 'http://3.94.31.236:11001/api';
    this.ChatBaseURL = 'http://3.94.31.236:11008/cm';
    this.patientId = '73ec7a99-a842-4a79-890a-9e6e19bad4f4';
    this.staffId = '821a43ec-4a75-4048-b782-16ec11c3d2f9';
    */

    this.BaseURL = localStorage.getItem("SH360_API_PROVIDER_URL");
    this.ChatBaseURL = localStorage.getItem("SH360_API_CHAT_URL");

    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);

    this.staffId = loginUser.sh360Id;

    
    this.getPatientInfo();

    this.CurrentUserSelected = '';

    this.CurrentTabPage = 'medications';
    this.MessageBox = true;

    this.projectData = projectData;
    //this.inboxData = inboxData;
    this.medicationData = medicationData;


    this.resourceType = this.route.snapshot.paramMap.get('resourceType');
    this.resourceTypeURLValue = this.route.snapshot.paramMap.get('resourceType');
    this.viewType = this.route.snapshot.paramMap.get('viewType');

    console.log('resourceType',this.resourceType);
    console.log('resourceTypeURLValue',this.resourceTypeURLValue);
    console.log('viewType',this.viewType);


    this.searchKeyValue = this.route.snapshot.paramMap.get('searchKey');
    this.resourceTypeValue = this.route.snapshot.paramMap.get('resourceType');
    this.providerNameValue = this.route.snapshot.paramMap.get('providerName');
    this.entityNameValue = this.route.snapshot.paramMap.get('entityName');
    this.visitTypeNameValue = this.route.snapshot.paramMap.get('visitTypeName');
    this.periodNameValue = this.route.snapshot.paramMap.get('periodName');

    //this.BaseURL = localStorage.getItem("SH360_API_URL");
    //this.patientId = '8226e7bc-41a1-42b1-9f54-120d754e1bb3';
    
    //this.BaseURL = 'http://18.213.144.230:11001/api';
    //this.patientId = 'f38a7a15-d4dc-4872-96e5-802f77f72065';

    //this.BaseURL = 'https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy';
    //this.patientId = 'f33329c9-b294-4b3b-95a3-f6ec033a677d';

     
    //this.getPatientMetadata();

    //this.getResourceDataByType();

    //this.enableWebsocket();

    this.options = {
      floor: 10,
      ceil: 100,
    }
    this.createForm();

    this.MedTabID=0;

    //const div = this.renderer.createElement('div');
    //const text = this.renderer.createText('Hello world!');

    //this.renderer.appendChild(div, text);
    //this.renderer.appendChild(this.myDivElementRef.nativeElement, div);

  }

 

rerender(): void {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  dtInstance.destroy();
  this.dtTrigger.next();
  });
}

ngAfterViewInit(): void {
  console.log('ngAfterViewInit');
  this.dtTrigger.next();
}

ngOnDestroy(): void {
  console.log('ngDestroy');
  this.dtTrigger.unsubscribe();
}

  enableWebsocket() {

    var ws = new WebSocket("wss://dev.providerviewer.hlth360.net/clientproxy/socket/general");
    console.log(ws);

    ws.onerror == function(){
      console.log('WebSocket error: ${error}');
    };

    ws.onopen = function() {
      ws.send('wstokenvalue');  
      console.log(ws);         
    };
    
    ws.onmessage = function(evt) {

        console.log("WS Message",evt);
 
    };

  }

  patientlistData:any;
  patientlistDataContact:any;
  patientTodayCount:any = 0;

  getPatientInfo() {
     
    //console.log(this.resourceTypeValue);
    /*
    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    */
     
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');

    //let apiurl = this.ChatBaseURL+'/patients?staffId='+this.staffId;

    //let apiurl = 'http://3.94.31.236:11008/cm/patients?staffId='+this.staffId;
    //let apiurl = 'http://3.94.31.236:11008/cm/chat/conversations?userId=a8488133-af06-4f60-ad0e-9f797fe4ee99&userRole=Case-Manager';


    let apiurl = this.ChatBaseURL+'/chat/conversations?userId='+this.staffId+'&userRole=Case-Manager';

    console.log("getPatientInfo", apiurl);

    this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    
      const dt = data;
      const userData = dt['payload'];
      
      console.log("userData",userData);

      this.inboxData = userData;

      if(userData.conversations) {
        this.patientlistData = userData.conversations;
      } 
      if(userData.contacts) {
        this.patientlistDataContact = userData.contacts;
      }
    
      console.log("this.patientlistData X",this.patientlistData);
      console.log("this.patientlistDataContact X",this.patientlistDataContact);
      //this.globalAlert = metaData.medAlert;

       
      //this.socketService.staffContact(userData);
      let patientIdArray = [];
      
        
        for (let key in this.patientlistData) {
          let value = this.patientlistData[key].patientId; 
          console.log("patient CONVERSATION LOOP");
          if(this.patientlistData[key].firstName) {
            patientIdArray.push(value);
          }        
        }
      
        
        for (let key in this.patientlistDataContact) {
          let value = this.patientlistDataContact[key].patientId; 
          console.log("patient CONTACT LOOP");
          if(this.patientlistDataContact[key].firstName) {
            patientIdArray.push(value);
          }
        }
      
 
      console.log("value.patientId Array :",patientIdArray);
      console.log("value.patientId :",patientIdArray[0]);

      if(this.DashboardLanding==true) {
        console.log("DashboardLanding TRUE");
        this.patientTodayCount = patientIdArray.length;
        localStorage.setItem('patientTodayCount',this.patientTodayCount);
        if(patientIdArray[0]) {
          //this.patientId = '43a2dfe4-188e-42d9-ab27-b90476d11af4';
          this.patientId = patientIdArray[0];
          this.showChatBox(this.patientId);
          this.DashboardLanding=false;
        }
        
      } else {
        console.log("DashboardLanding FALSE");
        //this.patientTodayCount = patientIdArray.length;
        //localStorage.setItem('patientTodayCount',this.patientTodayCount);

      }
   });

  }

  getPatientMetadata() {
     
    //console.log(this.resourceTypeValue);
    /*
    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    */
    /*
    https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy/patient/metadata?patientId=e8aea285-4e95-4ee3-ab87-9aecfe264960
  this.http.get(this.BaseURL+'/patient/metadata?patientId='+this.patientId,{headers :requestOptions}).subscribe()
    */
    
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');

    let apiurl = this.BaseURL+'/patient/metadata?patientId='+this.patientId;

    this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    
      const dt = data;
      const metaData = dt['payload'];
      
      console.log("metaData",metaData);

      this.globalAlert = metaData.medAlert;

      this.globalAlertValue = metaData.medAlert;

   });

  }

  
  getResourceDataByType() {
    
    this.resourceTypeValue = 'medications';
    
    //console.log(this.resourceTypeValue);
    /*
    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    */
    /*
  this.http.get(this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId,{headers :requestOptions}).subscribe()
    */
    
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');

    let apiurl = this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId;

    this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    
      const dt = data;
      const resourceData = dt['payload'];
      
      this.searchResults = resourceData.SH360Resources;
      
      this.data = this.searchResults;
  
      console.log(this.searchResults);
  
      this.MessageBox = false;
     
      if(this.resourceType=='medications') { 
        
       // const searchGroupResultsActive = _.groupBy(this.searchResults, "status");
       const searchGroupResultsActive = this.searchResults;
         
        let currentDate = new Date();
        var currentDateTime = currentDate.getTime();
        //console.log(currentDateTime);
  
        for(var key in searchGroupResultsActive['active']){
          let medDate = new Date(searchGroupResultsActive['active'][key].endDate);
          var medDateTime = medDate.getTime();
          //console.log(medDateTime);
            if(medDateTime >= currentDateTime){
              this.data.push(searchGroupResultsActive['active'][key]);
            }
            if(searchGroupResultsActive['active'][key].endDate == ""){
              this.data.push(searchGroupResultsActive['active'][key]);
            }
          }
          
  
      }
    
    /*  
    
    if(this.resourceType=='medications') { 
      
      const searchGroupResultsActive = _.groupBy(this.searchResults, "status");
      //const searchGroupResultsInactive = _.groupBy(this.searchResults, "resourceDate");
      
      //console.log(searchGroupResultsActive);

      //this.data = searchGroupResultsActive['active']; 

      //this.data = this.searchResults;
      
      let currentDate = new Date();
      var currentDateTime = currentDate.getTime();
      //console.log(currentDateTime);

      for(var key in searchGroupResultsActive['active']){
        let medDate = new Date(searchGroupResultsActive['active'][key].endDate);
        var medDateTime = medDate.getTime();
        //console.log(medDateTime);
          if(medDateTime >= currentDateTime){
            this.data.push(searchGroupResultsActive['active'][key]);
          }
          if(searchGroupResultsActive['active'][key].endDate == ""){
            this.data.push(searchGroupResultsActive['active'][key]);
          }
        }
        

    } else if(this.resourceType=='labreportsXX') { 
      
      this.searchGroupResults = _.groupBy(this.searchResults, "resourceDate");
      //console.log(this.searchGroupResults);
     
      let DataTableArray=[];
      for(var obj in this.searchGroupResults)
          {
            //console.log("Resource Values: "+obj);
            DataTableArray.push({'resourceDate':obj,'resources':this.searchGroupResults[obj]});
          } 

          this.data = DataTableArray;        
  
    }
    else
    {
      this.data = this.searchResults;
    }

            console.log(this.data);

            this.dtTrigger.next();
     */
  });

  }


  TabClasses:string = "active";

  CurrentTabPage: string;

  CurrentUserSelected: string;

  buttons: Array<{label: string}> = [
    {
      label: 'Global'
    },
    {
      label: 'Maintenance'
    },
    {
      label: 'Settings'
    },
    {
      label: 'Profile'
    },
    {
      label: 'Transactions'
    }
  ]
  

  columnsDataObj = [
    {
      title: "ID",
      data: "encounterId"
    },
    {
      title: "Medication name",
      data: "medication"
    },
    {
      title: "Patient Instruction",
      data: "patientInstruction"
    }
  ];

  /* CALENDAR VARIABLE */

  MedTabID:any;
  
  monthView:any;
  yearView:any;

  yearmonthsArray:any=[];

  systemDate:any;
  systemMonth:any;
  systemYear:any;
  systemZone:any;

  systemCurrentDate:any;
  systemCurrentMonth:any;
  systemCurrentYear:any;

  medicationlistDataCount:any=[];
  medicationlistData:any=[];
  
  medicationlistDateCount:any=[];
  medicationlistDate:any=[];
  medicationDetailDateArray:any=[];

  medicationDetailDataCount:any=[];
  medicationDetailData:any=[];
  medicationDetailDataArray:any=[];

  medicationDetailDataTiming:any=[];
  medicationDetailDataSummaryStatus:any=[];

  resourceId = this.route.snapshot.paramMap.get('resourceId');
 

  resourceDateValue: any;
  resourceDateColor: any;
  resourceDateEvent: any;
  ChartresourceEvent: any;
  resourceYearValue: any;
  resourceYearColor: any;
  resourceYearEvent: any;
  
  /* Calendar Start */

  
  eventsArray:any=[];
   
  //@ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date(); 

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [];

  refresh: Subject<any> = new Subject();


  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  /* CALENDAR VARIABLE */
  
  MedTab(i) {
    this.MedTabID=i;
  }

  showMedicalAdherence(Type:any,Pid:any) {

    var socketData = '';
    this.socketService.staffContact(socketData);
  
    console.log("Medical Adherence");
    this.loading = true;
    this.resourceTypeValue = Type;
    this.CurrentTabPage = 'medicationadherence';
    this.patientId = Pid;
    //this.patientId = "ba04fe0c-f039-41dd-8d79-6f5dd5022dd3";
    this.CurrentUserSelected =  this.patientId;
    //this.getPatientMetadata();

    
    this.monthView = true;
    this.yearView = false;

    this.yearmonthsArray = yearmonths;
    
    this.systemDate = new Date();
    this.systemMonth = this.systemDate.getMonth()+1;
    console.log(this.systemMonth);
    this.systemYear = this.systemDate.getFullYear();
    console.log(this.systemYear);
    //this.systemZone = this.systemDate.toString().get(/\((.+)\)/);
    this.systemZone = this.systemDate.toString();
    console.log(this.systemZone);
    

    this.systemCurrentDate = new Date();
    this.systemCurrentMonth = this.systemCurrentDate.getMonth()+1;
    this.systemCurrentYear = this.systemCurrentDate.getFullYear();

    //this.checkCookie();
    //this.getDashboardData();
    this.loadMedications();



  }

  showResourceDataByType(Type:any,Pid:any) {

    if(!this.DateSearchFilter) {
      this.fromDate = null;
      this.toDate = null;    
    }

    var socketData = '';
    this.socketService.staffContact(socketData);
   
    console.log("DT -A",this.isDtInitialized);
    console.log("DT -B",this.dtElement);
    
    if (this.isDtInitialized && this.dtElement!=undefined) {
     console.log("DT -1");
     console.log(this.dtElement);
     console.log(this.dtTrigger);
     if( this.dtElement.dtInstance) {
      console.log("DT -C",this.dtElement.dtInstance);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        console.log("dtInstance Destroy");
        dtInstance.destroy(); 
      });
      //this.dtTrigger.unsubscribe();
      
      if(this.resourceTypeValue!=Type) {
        this.dtTrigger = new Subject();
      } else {
        //this.dtTrigger.unsubscribe();
        //this.dtTrigger = new Subject();
      }
      
     } else {
      console.log("DT -D");
      console.log("dtInstance NOT Destroy");
      this.dtTrigger.unsubscribe();
      this.dtTrigger = new Subject();
     }

      this.isDtInitialized = false;
      console.log(this.dtElement);
      console.log(this.dtTrigger);
      //this.dtTrigger.unsubscribe();
      //this.dtTrigger = new Subject();

    } else if (this.isDtInitialized && this.dtElement==undefined) { 
      console.log("DT -2");
      console.log(this.dtTrigger);
      //this.dtTrigger 

      this.dtTrigger = new Subject();

    } else {
      console.log("DT -3");
      console.log("NEEEEWWW");
      console.log(this.dtTrigger);
      //this.dtTrigger.unsubscribe();
      
      //this.dtTrigger.next();

      console.log(this.dtTrigger);
    }

    if(this.data.length > 0){
      this.data = [];
      //this.dtTrigger.unsubscribe();
      //this.rerender();
    }

    console.log("DATATABLE");
    this.loading = false;
    this.collapse = true;
    this.addclass = 'hideclass';
    //this.remindervalidationform.reset();
    console.log("Type:",Type);
    console.log("Pid:",Pid);
    this.resourceTypeValue = Type;
    
    this.CurrentTabPage = Type;

    this.patientId = Pid;
    this.CurrentUserSelected =  this.patientId;
    this.getPatientMetadata();
    /*
    ngOnInit(): void {
        $('ul#nav-tabs li').addClass(this.bodyClasses);
    }
    ngOnDestroy() { 
      $('ul#nav-tabs li').removeClass(this.bodyClasses);  
    }
    */


    //console.log(this.resourceTypeValue);
    /*
    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    */
    /*
  this.http.get(this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId,{headers :requestOptions}).subscribe()
    */
    
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');

    //let apiurl = this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId;
    //let apiurl = this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId;

    /*
http://3.94.31.236:11001/api/clinicaldata/medications?subject=feef352a-ceb4-4a28-b829-3d2212b05634&timezone=Asia/Calcutta&status=active
    */

    let apiurl = this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId;;

    if(this.resourceTypeValue=='medications') { 

    if(this.AllMedication == true ) {
      apiurl = this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId+'&status=active';  
    } else {
      apiurl = this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId;
    }

    } else {

      apiurl = this.BaseURL+'/clinicaldata/'+this.resourceTypeValue+'?subject='+this.patientId;

    }

    if(this.fromDate != null && this.toDate != null)  {

      console.log(this.fromDate);
      console.log(this.toDate);
       

      const jsfromDate = new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day);
      //console.log("jsfromDate",this.convertDateFormatDisplay(jsfromDate));

      const jstoDate = new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day);
      //console.log("jstoDate",this.convertDateFormatDisplay(jstoDate));

      var startDate = this.convertDateFormatDisplay(jsfromDate);
      var endDate = this.convertDateFormatDisplay(jstoDate);
      apiurl = apiurl+'&startDate='+startDate+'&endDate='+endDate; 

    }

    console.log("apiurl", apiurl);
    //this.searchResults.lenght = 0;

      /*
      this.http.get(apiurl,{headers :headers}).subscribe((data) => {})
      */
     this.http.get(apiurl,{headers :headers}).subscribe((Rdata) => {

    if(this.DateSearchFilter) {
      this.DateSearchFilter=false;
    } else {
      this.fromDate = null;
      this.toDate = null;    
    }
      
    console.log("Rdata",Rdata);

    const dt = Rdata;
    const resourceData = dt['payload'];
    
    this.searchResults = resourceData.SH360Resources;
    console.log("this.searchResults.lenght",Rdata['resourceCount']);
   
    
    console.log("this.searchResults", this.searchResults);
    
    setTimeout(() => {

      console.log("trigger");
      console.log("new");

      /*
          this.isDtInitialized = true;
          this.data = this.searchResults;
          this.dtTrigger.next();
      */
      
          this.isDtInitialized = true;
          this.data = this.searchResults;
          this.dtTrigger.next();
        
        this.loading = true;

    });
    
    /*
    setTimeout(() => {

      console.log("trigger");
      if (this.isDtInitialized) {

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            setTimeout(() => {
              console.log("dtInstance");
              this.data = this.searchResults;
              dtInstance.destroy();
            },2000);

            setTimeout(() => {
              console.log("New Data Set");
              //this.data = this.searchResults;
              console.log("New Data",this.data);
              this.dtTrigger.next();
            },5000);
          });

        } else {
          console.log("new");
          this.isDtInitialized = true;
          this.data = this.searchResults;
          this.dtTrigger.next();
        }
        this.loading = true;

    },20000);
   */


    /*
    setTimeout(() => {  
      this.loading=true;
    console.log("destroy you current configuration");
      // destroy you current configuration
     this.dtRendered = false;
     this.dtOptions = {
       data: this.searchResults,
       columns: this.columnsDataObj
     };
     console.log("make sure your template notices it");
     // make sure your template notices it
     this.cdr.detectChanges();
     // initialize them again
     this.dtRendered = true;
     this.cdr.detectChanges();
     this.loading=true;
    },10000);
    */

    /*
    setTimeout(() => {
      console.log("trigger----");
      if (this.isDtInitialized) {
        this.dtOptions.data = [];
        this.dtOptions = { data : null }; 
        this.data = [];
        this.data.lenght = 0;
        if(Rdata['resourceCount'] > 0) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            console.log("dtInstance");
            dtInstance.destroy();
            //this.dtTrigger.next();
          });

          
        console.log("already");
        console.log("this.searchResults",this.searchResults);
        this.dtRendered = false;
        //this.cdr.detectChanges();
        this.dtOptions.data = [];
        //this.dtOptions = { data : null }; 
        this.data = [];
        this.data.lenght = 0;
        //this.dtTrigger.next();
        //this.dtRendered = true;
        //this.cdr.detectChanges();
        //this.dtOptions = { data : Rdata['payload'].SH360Resources }; 
        //this.cdr.detectChanges();
        //this.dtOptions.data = this.searchResults;
        //console.log("this.dtOptions.data",this.dtOptions.data);
         //this.data = this.searchResults;
        //this.dtTrigger.next();
       
        //this.data = this.searchResults;
        //this.dtTrigger.next();
        
        this.dtRendered = true;
        setTimeout(() => {
          this.dtOptions = { data : Rdata['payload'].SH360Resources }; 
          this.data = Rdata['payload'].SH360Resources;
          this.dtTrigger.next();
        },5000);


        }
        

      } else {
        console.log("new");
        this.isDtInitialized = true;
        this.data = this.searchResults;
        this.dtTrigger.next();
      }
      this.loading = true;
    },1000000000);
    */

    /*
    setTimeout(() => {

      console.log("trigger");
      if (this.isDtInitialized) {

          this.dtOptions = { data : null }; 
          this.dtOptions.data = null; 
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            setTimeout(() => {
              console.log("dtInstance");
              this.data = this.searchResults;
              dtInstance.destroy();
            },2000);

            setTimeout(() => {
              console.log("New Data Set");
              //this.data = this.searchResults;
              console.log("New Data",this.data);
              this.dtTrigger.next();
            },5000);
          });

        } else {
          console.log("new");
          this.isDtInitialized = true;
          this.data = this.searchResults;
          this.dtTrigger.next();
        }
        this.loading = true;

    },20000000000);
    */
    
 
    /*
    setTimeout(() => {
      console.log("tigger");
      this.dtTrigger.next();
    });
    */

    console.log(this.searchResults);

    this.MedicationBox = false;

    this.MessageBox = false;
   
    if(this.resourceType=='medications') { 
      
     // const searchGroupResultsActive = _.groupBy(this.searchResults, "status");
     const searchGroupResultsActive = this.searchResults;
       
      let currentDate = new Date();
      var currentDateTime = currentDate.getTime();
      //console.log(currentDateTime);

      for(var key in searchGroupResultsActive['active']){
        let medDate = new Date(searchGroupResultsActive['active'][key].endDate);
        var medDateTime = medDate.getTime();
        //console.log(medDateTime);
          if(medDateTime >= currentDateTime){
            this.data.push(searchGroupResultsActive['active'][key]);
          }
          if(searchGroupResultsActive['active'][key].endDate == ""){
            this.data.push(searchGroupResultsActive['active'][key]);
          }
        }
        

    }

    //this.loading = true;
    //this.dtTrigger.unsubscribe();
    //this.dtTrigger.next();
    //this.rerender();
    
    setTimeout(() => {
      //console.log("tigger");
      //this.loading = true;
      //this.dtTrigger.next();  
      //this.rerender();
    });

    /*  
    
    if(this.resourceType=='medications') { 
      
      const searchGroupResultsActive = _.groupBy(this.searchResults, "status");
      //const searchGroupResultsInactive = _.groupBy(this.searchResults, "resourceDate");
      
      //console.log(searchGroupResultsActive);

      //this.data = searchGroupResultsActive['active']; 

      //this.data = this.searchResults;
      
      let currentDate = new Date();
      var currentDateTime = currentDate.getTime();
      //console.log(currentDateTime);

      for(var key in searchGroupResultsActive['active']){
        let medDate = new Date(searchGroupResultsActive['active'][key].endDate);
        var medDateTime = medDate.getTime();
        //console.log(medDateTime);
          if(medDateTime >= currentDateTime){
            this.data.push(searchGroupResultsActive['active'][key]);
          }
          if(searchGroupResultsActive['active'][key].endDate == ""){
            this.data.push(searchGroupResultsActive['active'][key]);
          }
        }
        

    } else if(this.resourceType=='labreportsXX') { 
      
      this.searchGroupResults = _.groupBy(this.searchResults, "resourceDate");
      //console.log(this.searchGroupResults);
     
      let DataTableArray=[];
      for(var obj in this.searchGroupResults)
          {
            //console.log("Resource Values: "+obj);
            DataTableArray.push({'resourceDate':obj,'resources':this.searchGroupResults[obj]});
          } 

          this.data = DataTableArray;        
  
    }
    else
    {
      this.data = this.searchResults;
    }

            console.log(this.data);

            this.dtTrigger.next();
     */
  });

  }


  
  MessageBox0 = false;
  MessageBox1 = false;
  MessageBox2 = false;
  MessageBox3 = false;
  MessageBox4 = false;
  MessageBox5 = false;


  ChatMessageData: any;
  ChatMessageDatalength: any;
  ChatMessageToday: any;
  showTodayMessage: any;
  showChatBox(PID) {
    
    this.ChatMessageToday = this.convertDateTodayDisplay();

    this.loading = false;

    console.log('PID',PID);

    this.patientId = PID;

    this.CurrentUserSelected =  this.patientId;

    this.MessageBox = false;

    this.socketService.staffChatRoom(this.patientId);
    
    this.ChatMessageDatalength = 0;

    this.resourceTypeValue = 'message';
    this.CurrentTabPage = 'message';

    this.MessageBox0=false;
    this.MessageBox1=true;
    this.MessageBox2=false;

    this.showTodayMessage=false;

    //let apiurl = this.BaseURL+'/medication/reminder?resourceId='+mid+'&patientId='+this.patientId+'&timezone=Asia/Kolkata';

    //this.patientId = '21a47649-6e62-43d5-9dd4-fdf6b684c359';
    //this.patientId = '513384fc-322f-4a70-90bd-435d641cdf94';
    
    //let apiurl = 'http://3.94.31.236:11008/cm/chat/messages?patientId='+this.patientId+'&staffId='+this.staffId;
    //let apiurl = 'http://3.94.31.236:11008/cm/chat/messages?patientId=5ac5f405-56ba-44dc-a8d8-d0770257da14&staffId=a8488133-af06-4f60-ad0e-9f797fe4ee99';

    let apiurlX = 'http://3.94.31.236:11008/cm/chat/messages?patientId=43a2dfe4-188e-42d9-ab27-b90476d11af4&staffId=47f93c27-12a6-4cc4-a380-836a17fe72b9&datetime=2021-02-12T00:00:06.208Z';

    let apiurl = this.ChatBaseURL+'/chat/messages?patientId='+this.patientId+'&staffId='+this.staffId;
    
    
    console.log(apiurl);
    this.http.get(apiurl)
    .subscribe(
      data => {        
        const dt = data;
       if(dt['payload']){
          //console.log(dt['payload']);
          const playloadData = dt['payload'];  
          if(playloadData) {
            
            this.ChatMessageData = playloadData;
            this.ChatMessageDatalength = 1;           
            console.log("ChatMessageData",this.ChatMessageData);
            if(this.ChatMessageData[0]) {
              if(this.ChatMessageData[0].sendTime) {
                let MessageDateValue = this.convertDateFormatDisplay(this.ChatMessageData[0].sendTime);
               console.log("MessageDateValue",MessageDateValue);

              if( MessageDateValue == this.ChatMessageToday ) {
                this.showTodayMessage=true;
              } else {
                this.showTodayMessage=false;
              }
              }
              
              

              console.log("ChatMessageData - threadId",this.ChatMessageData[0].threadId);
              console.log("ChatMessageData - threadId",this.ChatMessageData[0].receiver);
              var userIdValue = this.ChatMessageData[0].receiver;
              var threadIdValue = this.ChatMessageData[0].threadId;
              var AckData = {userId: this.staffId, threadId: threadIdValue} 
              this.socketService.sendAcknowledge(AckData);
  
            } else {
              this.ChatMessageDatalength = 0;   
              this.ChatMessageData = '';
            } 

          } else {
            this.ChatMessageData = '';
            this.ChatMessageDatalength = 0;
          }
          this.loading = true;
          this.getPatientInfo();
          
       }

      });

    
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
  

  clickMedication(mid) {

    
  this.settimeserrors = false;
  this.setdayserrors = false;
  this.setdayscounterrors = false;


    this.dtTrigger.unsubscribe();

    //this.isDtInitialized = false;
    /*
    if (this.isDtInitialized) {

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          console.log("dtInstance Destroy");
          dtInstance.destroy(); 
      });

      this.isDtInitialized = false;

  }
  this.isDtInitialized = false; */
    //var pid = 'eac0b21a-4442-4f2e-bf66-04025d600d0c';
    //var pid = 'f38a7a15-d4dc-4872-96e5-802f77f72065';
  
    this.medicationReminderDataisReminderSet = false;

    this.SUNCHECK = false;
    this.MONCHECK = false;
    this.TUECHECK = false;
    this.WEDCHECK = false;
    this.THUCHECK = false;
    this.FRICHECK = false;
    this.SATCHECK = false;

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
   
    let apiurl = this.BaseURL+'/medication/reminder?resourceId='+mid+'&patientId='+this.patientId+'&timezone='+this.timeZone;
  
    //let apiurl = 'http://18.213.144.230:11001/api/medication/reminder?resourceId='+mid+'&patientId='+this.pid+'&timezone='+this.timeZone;
  
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
         
         this.MedicationBox=true;
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
  

         this.medicationReminderDataisReminderSet = this.medicationReminderData.isReminderSet;
         /* NEW TIMER CONCEPT : START */
         this.removeAll();

         var j=0
         this.medicationReminderData.timing.timeOfDay.forEach( cols => {
              this.addCustomColumn();    

              /*
              console.log("Sat Jan 30 2100 "+cols+" GMT+0530 (India Standard Time)");
              let colsValue = new Date("Sat Jan 23 2021 "+cols+" GMT+0530 (India Standard Time)");
              console.log("colsValue", colsValue);
              */

              var d = new Date();
              var n = d.toString();

              let colsValueString = n.substring(0, 16) + cols + n.substring(16 + cols.length);
              console.log("DATEX",colsValueString);
              //let colsValue = '4:00 PM'; 
              let colsValue = new Date(colsValueString);
              console.log("colsValue", colsValue);
              if(this.medicationReminderData.timing.isManualTimesPerDay==true) {
                this.remindervalidationform.controls.settimes['controls'][j].patchValue({times: colsValue})
              } else {
                this.remindervalidationform.controls.settimes['controls'][j].patchValue({times: cols})
              }

              this.remindervalidationform.controls.settimes['controls'][j].patchValue({times: colsValue})
              
              j++;
        })

        /*
         if(this.medicationReminderData.timing.timesPerDay ==1 ) {
          
          this.addCustomColumn();

         } else if(this.medicationReminderData.timing.timesPerDay ==2 ) {
  
          this.addCustomColumn();
          this.addCustomColumn();

         } else if(this.medicationReminderData.timing.timesPerDay ==3 ) {
  
          this.addCustomColumn();
          this.addCustomColumn();
          this.addCustomColumn();

         } else if(this.medicationReminderData.timing.timesPerDay ==4 ) {
  
          this.addCustomColumn();
          this.addCustomColumn();
          this.addCustomColumn();
          this.addCustomColumn();

         } else {
  
       
         }
         */

         /* NEW TIMER CONCEPT : END */
         
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
  
  
        if(this.medicationReminderData.duration.totalDays >=1 && this.medicationReminderData.duration.totalDays <=30 ) {
  
          this.durationdayvalue = '1-30';
          
          this.options = {
            floor: 1,
            ceil: 30,
          }
  
        } else if(this.medicationReminderData.duration.totalDays >=31 && this.medicationReminderData.duration.totalDays <=60 ) {
  
          this.durationdayvalue = '31-60';
  
          if(this.medicationReminderData.duration.isManualTotalDays == true ) {

            this.options = {
              floor: 31,
              ceil: 60,
              disabled: false,
            }

           } else {
            
            this.options = {
            floor: 31,
            ceil: 60,
            disabled: false,
            }

          }
          

        } else if(this.medicationReminderData.duration.totalDays >=61 && this.medicationReminderData.duration.totalDays <=90 ) {
         
          this.durationdayvalue = '61-90';
  
          this.options = {
            floor: 61,
            ceil: 90,
          }

        } else if(this.medicationReminderData.duration.totalDays >=91 && this.medicationReminderData.duration.totalDays <=180 ) {
          
          this.durationdayvalue = '91-180';  
        
          this.options = {
            floor: 91,
            ceil: 180,
          }

        } else if(this.medicationReminderData.duration.totalDays >=181 && this.medicationReminderData.duration.totalDays <=365 ) {
        
          this.durationdayvalue = '181-365';
  
          this.options = {
            floor: 181,
            ceil: 365,
          }

        } else if(this.medicationReminderData.duration.totalDays >=366) {
        
          this.durationdayvalue = '10000';
  
          this.options = {
            floor: 10000,
            ceil: 10000,
          }

        } else {
  
          this.durationdayvalue = '1-30';
  
          this.options = {
            floor: 1,
            ceil: 30,
          }

        }
  
        if(this.medicationReminderData.duration.totalDays>0) {
  
          this.minValue = this.medicationReminderData.duration.totalDays;
  
        } else {
  
          this.medicationReminderData.duration.totalDays = 1;
          this.minValue = 1;

        }
        
  
        if(this.medicationReminderData.duration.isManualTotalDays == true ) {
  
          this.DurationEdit = false;

          /*this.options = {
            disabled: false,
          };*/
  
        } else {
  
          this.DurationEdit = true;
  
          /*this.options = {
            disabled: true,
          };*/

        }


        this.reminderrepeatValue = this.medicationReminderData.repeat.text;
  
         if(this.medicationReminderData.repeat.text == 'SPECIFIC') {


          this.medicationReminderData.repeat.weekDays.forEach( cols => {

            console.log("XXXXXX",cols); 
            this.duplicateDaysColumns.push(new FormControl(cols));

          })
 
             
          this.MedicationReminderDayBox = true;
          this.reminderrepeatEveryday = false;
          this.reminderrepeatSpecificday = true;
  
          var DaysList = this.medicationReminderData.repeat.weekDays;
   
          //console.log("DaysList.indexOf()",DaysList.indexOf("SUN"));

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
  
   
  
  }


remindmeChange(event: any){
 
 var target = event.target || event.srcElement || event.currentTarget;
 var value = target.value;   
  
  if(value=='EVERYDAY') {
    this.MedicationReminderDayBox=false;
  } else if(value=='SPECIFIC') {
    this.MedicationReminderDayBox=true;  
  } else {
    this.MedicationReminderDayBox=false;
  }
 
}


durationdayChange(event: any){
  console.log("event :", event); 
  //var event = eventObj.id;

  if( event != undefined )
    {
      if(event.id==10000) {

        this.options = {
          floor: 10000,
          ceil: 10000,
          }
          this.minValue = 10000;
       
          this.medicationReminderData.duration.totalDays = 10000;
      } else {
        var sldiers = event.id.split('-');

        this.options = {
          floor: sldiers[0],
          ceil: sldiers[1],
          }
          this.minValue = sldiers[0];
       
          this.medicationReminderData.duration.totalDays = sldiers[0];
      }
      
    }else{
      this.minValue = this.options.floor
      //this.maxValue = this.options.ceil
    }
}


durationsliderdayChange(event: number){
  console.log("durationsliderdayChange :", event); 
  //var event = eventObj.id;
  this.medicationReminderData.duration.totalDays = event;

}

createForm()
{
  this.allremindervalidationform = this.formBuilder.group({
    allreminderset: ['', [Validators.required]],
  });

  
  this.allmedicationfilterform = this.formBuilder.group({
    allmedicationset: ['', [Validators.required]],
  });


  this.messageform = this.formBuilder.group({
    msginput: ['', [Validators.required]],
  });
  
  

  this.remindervalidationform = this.formBuilder.group({
   /*
    reminderset: ['', [Validators.required]],
    frequencytiming: [null, [Validators.required]],
    settimes:this.formBuilder.array([]),
    reminderrepeat: ['', [Validators.required]],
    weekdays:[''],
    durationday: ['', [Validators.required]],
    dayrange:['', [Validators.required]],
    totaldays:['', [Validators.required]],
   */

  reminderset: ['', [Validators.required]],
  frequencytiming: [null, [Validators.required]],
  settimes:this.formBuilder.array([]),
  reminderrepeat: [''],
  weekdays:new FormArray([]),
  durationday: [''],
  dayrange:[''],
  totaldays:[''],
 
  });
  this.duplicateTimeColumns = this.remindervalidationform.get('settimes') as FormArray;

  this.duplicateDaysColumns = this.remindervalidationform.get('weekdays') as FormArray;

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
          this.addCustomColumn();
          let colsValue = new Date();
          this.remindervalidationform.controls.settimes['controls'][i].patchValue({times: colsValue})
              
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


  
showReminderForm(ReminderID, event: any){
//this.openModal('changepasswordcontent');
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
    
          //this.remindervalidationform.reset();
          //this.remindervalidationform.controls.customColumns['weekdays'].patchValue();
          this.remindervalidationform.get('weekdays').reset();
          //this.remindervalidationform.get('weekdays').setValue(null);
           
          //this.remindervalidationform.controls.customColumns['weekdays'].patchValue();
          this.showResourceDataByType('medications',this.patientId);
          //this.clickMedication(ReminderID);
          //this.showMedications(this.pid);
          //this.getResourceDataByType();         
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

 CancelReminderOff(){
  this.medicationReminderDataisReminderSet = true;
   this.modalService.dismissAll();
   //this.medicationReminderData.isReminderSet = true;
   this.medicationReminderDataisReminderSet = true;
 } 

 CancelReminderOffAll(){
  this.globalAlertValue = true;
   this.modalService.dismissAll();
   //this.globalAlert = true;
 }
 
 CancelReminderOnAll(){
  this.globalAlertValue = false;
   this.modalService.dismissAll();
   //this.globalAlert = false;
 }
 
ReminderOff(ReminderID){
  //this.openModal('changepasswordcontent');
    console.log("ReminderID",ReminderID); 
    
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
      
            //this.remindervalidationform.reset();
            //this.remindervalidationform.controls.customColumns['weekdays'].patchValue();
            this.remindervalidationform.get('weekdays').reset();
            //this.remindervalidationform.get('weekdays').setValue(null);
            
            //this.remindervalidationform.controls.customColumns['weekdays'].patchValue();
            this.showResourceDataByType('medications',this.patientId);
            //this.clickMedication(ReminderID);
            //this.showMedications(this.pid);
            //this.getResourceDataByType();         
            this.openModal('savesuccesscontent');
        
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
   
     
     
     if(this.MedicationReminderFormBox1) {
       this.MedicationReminderFormBox1=false;
     } else {
       this.MedicationReminderFormBox1=true;
     }
    
   }


   ReminderOffAll(){

   var value = false;

   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');
   
   let apiurl = this.BaseURL+'/medication/reminder/alert';

   var postData = {
                  "sh360Id": this.patientId,
                  "medAlert": value
                  };
 
   console.log("ALL REMINDER API:",apiurl);
 
     this.http.post(apiurl, postData, { headers: headers })
     .subscribe(
       data => {
         console.log('SUCCESS ON SAVE')
         const dt = data;
         console.log(dt);
         this.globalAlert = value;
         //this.getResourceDataByType();         
         //this.showMedications(this.pid);
         this.openModal('savesuccesscontent');
         this.showResourceDataByType('medications',this.patientId);
         this.loading = false;
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

   
   ReminderOnAll(){

    var value = true;
 
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');
    
    let apiurl = this.BaseURL+'/medication/reminder/alert';
 
    var postData = {
                   "sh360Id": this.patientId,
                   "medAlert": value
                   };
  
    console.log("ALL REMINDER API:",apiurl);
  
      this.http.post(apiurl, postData, { headers: headers })
      .subscribe(
        data => {
          console.log('SUCCESS ON SAVE')
          const dt = data;
          console.log(dt);
          this.globalAlert = value;
          //this.getResourceDataByType();         
          //this.showMedications(this.pid);
          this.openModal('savesuccesscontent');
          this.showResourceDataByType('medications',this.patientId);
          this.loading = false;
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


 onCheckboxChange(e) {
   console.log(e);
   
   /*
   const checkArray: FormArray = this.remindervalidationform.get('weekdays') as FormArray;
   
   if (e.target.checked) {
    checkArray.push(new FormControl(e.target.value));
   } else {
    let i: number = 0;
    checkArray.controls.forEach((item: FormControl) => {
      if (item.value == e.target.value) {
        checkArray.removeAt(i);
        return;
      }
      i++;
     });
    }
    */
   
   if (e.target.checked) {
    this.duplicateDaysColumns.push(new FormControl(e.target.value));
   } else {
    let i: number = 0;
    this.duplicateDaysColumns.controls.forEach((item: FormControl) => {
      if (item.value == e.target.value) {
        this.duplicateDaysColumns.removeAt(i);
        return;
      }
      i++;
     });
    }

 if (e.target.checked) {
 
  console.log("checked",e.target.value);
  
  } else {
 
  console.log("unchecked",e.target.value);  
 
  }

}

hasDuplicates(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
      var value = array[i];
      if (value in valuesSoFar) {
          return true;
      }
      valuesSoFar[value] = true;
  }
  return false;
}

get form() {
  return this.remindervalidationform.controls;
 }

 saveReminderData(formData,medicationReminderSettingData) {

  this.settimeserrors = false;
  this.setdayserrors = false;
  this.setdayscounterrors = false;
  
  
  this.frequencyTimes = [];
  console.log("formData.value.settimes",formData.value.settimes);
  formData.value.settimes.forEach(element => {
    console.log("formData.value.settimes before converttime",element.times);
    let converttime = this.convert(element.times);
    console.log("formData.value.settimes after converttime",converttime);
    this.frequencyTimes.push(converttime);
  });

  this.settimeserrors = this.hasDuplicates(this.frequencyTimes);
  console.log("this.settimeserrors",this.settimeserrors)

  if(formData.value.reminderrepeat=='SPECIFIC') {
  console.log("formData.value.weekdays",formData.value.weekdays);
  RepeatweekDays = formData.value.weekdays;
  var filteredRepeatweekDays = RepeatweekDays.filter(function (el) { return el != null; });
  console.log("RepeatweekDays.length",filteredRepeatweekDays.length);
  if(filteredRepeatweekDays.length==0) {
    this.setdayserrors = true;
  } else {
    this.setdayserrors = false;
  }
} else {

}

  console.log("TIME", this.convert("Sat Jan 23 2021 17:30:14 GMT+0530 (India Standard Time)"));

  if (formData.invalid) {
    this.submitted = true;
    console.log("INVALID formData",formData);
    return;
  } else {
    this.submitted = false;
    console.log("VALID formData",formData);
    //return;


    
    if(this.settimeserrors)
    {
      return;
    }
    
    if(this.setdayserrors)
    {
      return;
    }

    if(this.setdayscounterrors)
    {
      return;
    }
  }

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

Remindertimezone = this.timeZone;

RepeatweekDays = [];
if(medicationReminderSettingData.repeat.text=='') {
  Repeattext = 'EVERYDAY';
  RepeatweekDays = [];
} 

if(formData.value.reminderrepeat=='EVERYDAY') {
  Repeattext = 'EVERYDAY';
  RepeatweekDays = [];
} else if(formData.value.reminderrepeat=='SPECIFIC') {
  Repeattext = 'SPECIFIC';
  var RepeatweekDaysArray = formData.value.weekdays;
  RepeatweekDays = RepeatweekDaysArray.filter(function (el) { return el != null; });
}
console.log("RepeatweekDays", RepeatweekDays.length);


if(RepeatweekDays.length==0) { 
  this.setdayserrors = true;
}


if(RepeatweekDays.length==7) {
  Repeattext = 'EVERYDAY';
  RepeatweekDays = [];
}



if(DurationisManualTotalDays==true) {
  DurationtotalDays = formData.value.totaldays;
} else {
  DurationtotalDays = formData.value.totaldays;
}

console.log("DurationtotalDays >= RepeatweekDays.length 1", DurationtotalDays);
console.log("DurationtotalDays >= RepeatweekDays.length 2", RepeatweekDays.length);

if(DurationtotalDays < RepeatweekDays.length) { 
  this.setdayscounterrors = true;
}


if(TimingisManualTimesPerDay==true) {
  this.frequencyTimes = [];
  TimingtimesPerDay = formData.value.frequencytiming;
  
  TimingtimeOfDay = []; 
  console.log("formData.value.settimes",formData.value.settimes);
  
  formData.value.settimes.forEach(element => {
    console.log("formData.value.settimes element",element.times);
    let converttime = this.convert(element.times);
    console.log("formData.value.settimes converttime",converttime);
    this.frequencyTimes.push(converttime);
  });
 
  TimingtimeOfDay = this.frequencyTimes;

} else {
  
  this.frequencyTimes = [];
  TimingtimesPerDay = formData.value.frequencytiming;
  
  TimingtimeOfDay = []; 
  console.log("formData.value.settimes",formData.value.settimes);
  
  formData.value.settimes.forEach(element => {
    console.log("formData.value.settimes element",element.times);
    let converttime = this.convert(element.times);
    console.log("formData.value.settimes converttime",converttime);
    this.frequencyTimes.push(converttime);
  });
 
  TimingtimeOfDay = this.frequencyTimes;

}

if(this.settimeserrors)
{
  return;
}

if(this.setdayserrors)
{
  return;
}

if(this.setdayscounterrors)
{
  return;
}

  
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

/*
  var offset = new Date().getTimezoneOffset();
  console.log(offset);
  return false;
*/
  
  let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
  //console.log(loginUser);

  const headers = new HttpHeaders;
  headers.append('Content-Type', 'application/json');
 
 
    let apiurl = this.BaseURL+'/medication/reminder/chart?reqFrom=case-manager';
 
    //let apiurl = this.BaseURL+'/medication/reminder/chart';

    
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


         //const checkArray: FormArray = this.remindervalidationform.get('weekdays') as FormArray;
         //checkArray.clear();

         //const user = dt['payload'];
         //this.errormsg = 'Validation error / Already Registered';
         //this.cookieService.setCookie('currentUser', JSON.stringify(user), 1);
         //this.router.navigate(['/dashboard']);
         this.remindervalidationform.get('weekdays').reset();
         //this.remindervalidationform.get('weekdays').setValue(null);
         this.showResourceDataByType('medications',this.patientId);
         //this.remindervalidationform.reset();
         //this.getResourceDataByType();         
         //this.showMedications(this.pid);
        
         //this.openModal('savesuccesscontent');
     
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

 
AllReminderForm(event: any){
 
  //console.log(event);
  this.loading = true;
  var target = event.target || event.srcElement || event.currentTarget;
  var value = target.checked;  
  console.log("CHECKED ",value);
  
   
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');
   
   /*
   https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy/medication/reminder/global?patientId=5ab384f9-67b0-4544-aac1-5046141c476d&isEnabled=false&timezone=Asia%2FKolkata
   https://xmf3rxw3oi.execute-api.us-east-1.amazonaws.com/Dev/clientproxy/medication/reminder/alert
   */
   //let apiurl = this.BaseURL+'/medication/reminder/global?patientId='+this.pid+'&isEnabled='+value+'&timezone=Asia%2FKolkata';
 
   //let apiurl = 'http://18.213.144.230:11001/api//medication/reminder/global?patientId='+this.pid+'&isEnabled='+value+'&timezone=Asia%2FKolkata';
 
   let apiurl = this.BaseURL+'/medication/reminder/alert';

   var postData = {
                  "sh360Id": this.patientId,
                  "medAlert": value
                  };
 
   console.log("ALL REMINDER API:",apiurl);
 
     this.http.post(apiurl, postData, { headers: headers })
     .subscribe(
       data => {
         console.log('SUCCESS ON SAVE')
         const dt = data;
         console.log(dt);

         this.getResourceDataByType();         
         //this.showMedications(this.pid);
         this.openModal('savesuccesscontent');
         this.loading = false;
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

 
 AllMedicationForm(event: any){
  
  //console.log(event);
 
  var target = event.target || event.srcElement || event.currentTarget;
  var value = target.checked;  
  console.log("CHECKED ",value);
  if(value==true) {
    this.AllMedication = true;
  } else {
    this.AllMedication = false;
  } 

  this.showResourceDataByType('medications',this.patientId);
  
  /*   
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');
    
   let apiurl = this.BaseURL+'/medication/reminder/alert';

   var postData = {
                  "sh360Id": this.patientId,
                  "medAlert": value
                  };
 
   console.log("ALL REMINDER API:",apiurl);
 
     this.http.post(apiurl, postData, { headers: headers })
     .subscribe(
       data => {
         console.log('SUCCESS ON SAVE')
         const dt = data;
         console.log(dt);

         this.getResourceDataByType();         
         //this.showMedications(this.pid);
         this.openModal('savesuccesscontent');
         
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
   
 }

 scrollToBottom(): void {
  try {
      this.divMessages.nativeElement.scrollTop = this.divMessages.nativeElement.scrollHeight;
  } catch(err) { }                 
}

receiveMessage(messageValue) {
  var dateValue = this.convertDateDisplay();   
  //var messageValue = 'TEST MESSAGE';
  //@ViewChild('divMessages',{ static: true }) divMessages: ElementRef;
  console.log("this.divMessages.nativeElement",this.divMessages.nativeElement);

  const div = this.renderer.createElement('div');
  const p = this.renderer.createElement('p');
  const divtime = this.renderer.createElement('div');
  const span = this.renderer.createElement('span');
  
   const textMessage = this.renderer.createText(messageValue.text);
   //const textTime = this.renderer.createText(messageValue.sendTime);
   const textTime = this.renderer.createText(dateValue);
  
   this.renderer.appendChild(div, textMessage);
   
   this.renderer.appendChild(p, textMessage);
   this.renderer.appendChild(div, p);
   this.renderer.addClass(div, 'message-received');
   
   this.renderer.appendChild(span, textTime);
   this.renderer.appendChild(divtime, span);
   this.renderer.addClass(divtime, 'message-received');
   
   this.renderer.appendChild(this.divMessages.nativeElement, div);
   this.renderer.appendChild(this.divMessages.nativeElement, divtime);

   this.divMessages.nativeElement.scrollTop = this.divMessages.nativeElement.scrollHeight;

   console.log("ChatMessageData - threadId",messageValue.threadId);
   console.log("ChatMessageData - threadId",messageValue.receiver);
  var userIdValue = messageValue.receiver;
  var threadIdValue = messageValue.threadId;
  var AckData = {userId: userIdValue, threadId: threadIdValue} 
  this.socketService.sendAcknowledge(AckData);
  this.socketService.staffChatRoom(AckData);
}

 
saveMessageForm(event: any){
 
  console.log(event);
  //return event.target.msginput.value;
 
  var target = event.target || event.srcElement || event.currentTarget;
  var messageValue = target.msginput.value;  
  console.log("VALUE ",messageValue);

  if(messageValue=="" || messageValue==null) { return; }
   
   var postData = {
              "patientId": this.patientId,
              "staffId": this.staffId,
              "text": messageValue,
              "receiver": this.patientId,
              "receiverRole": "Patient",
              "sender": this.staffId,
              "senderRole": "Case-Manager"
            };
    
   this.socketService.sendMessage(postData);

   if(this.ChatMessageDatalength == 1) {
    
    //var dateValue = new Date().toString();
    var dateValue = this.convertDateDisplay();
   
    const div = this.renderer.createElement('div');
    const p = this.renderer.createElement('p');
    const divtime = this.renderer.createElement('div');
    const span = this.renderer.createElement('span');
    
    const textMessage = this.renderer.createText(messageValue);
    const textTime = this.renderer.createText(dateValue);
    
     this.renderer.appendChild(div, textMessage);
     
     this.renderer.appendChild(p, textMessage);
     this.renderer.appendChild(div, p);
     this.renderer.addClass(div, 'message-sent');

     this.renderer.appendChild(span, textTime);
     this.renderer.appendChild(divtime, span);
     this.renderer.addClass(divtime, 'message-sent');
     
     this.renderer.appendChild(this.divMessages.nativeElement, div);
     this.renderer.appendChild(this.divMessages.nativeElement, divtime);
     
     this.divMessages.nativeElement.scrollTop = this.divMessages.nativeElement.scrollHeight;

   } else {
    this.showChatBox(this.patientId);
   }
   
   /* 
   var postData = {
    "patientId": "5ac5f405-56ba-44dc-a8d8-d0770257da14",
    "sender": this.staffId,
    "senderRole": "Case-Manager",
    "receiver": "5ac5f405-56ba-44dc-a8d8-d0770257da14",
    "receiverRole": "Patient",
    "staffId": this.staffId,
    "text": messageValue
};

   console.log("SEND MESSAGE API:",apiurl);
 
   console.log("postData", postData);

   this.socketService.sendMessage(postData);

   var postData = {
    "patientId": "3bb462e6-947e-471a-ad5f-68697e4320c7",
    "sender": this.staffId,
    "senderRole": "Case-Manager",
    "receiver": "3bb462e6-947e-471a-ad5f-68697e4320c7",
    "receiverRole": "Patient",
    "staffId": this.staffId,
    "text": messageValue
};

   console.log("SEND MESSAGE API:",apiurl);
 
   console.log("postData", postData);

   this.socketService.sendMessage(postData);
   */
   this.typeValue = null;
   //this.showChatBox(this.patientId);
   return;
   /*

   
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');
    
   //let apiurl = 'http://3.94.31.236:11008/cm/chat/message';

   let apiurl = this.ChatBaseURL+'/chat/message';
    

     this.http.post(apiurl, postData, { headers: headers })
     .subscribe(
       data => {
         console.log('MESSAGE ON SAVE')
         const dt = data;
         console.log(dt);
         this.typeValue = null;
        this.showChatBox();
         //this.getResourceDataByType();         
         //this.showMedications(this.pid);
         this.openModal('savesuccesscontent');
         this.loading = true;
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
   
 }

 /*
 openModal(content: string) {
  this.modalService.open('changepasswordcontent', { centered: true });
}

openModalNew(content: string) { 
  this.modalService.dismissAll();
  this.modalService.open(content, { centered: true });
}
*/
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: string) {
    this.modalService.dismissAll();
    console.log("openModal",content);
    this.modalService.open(content);
    this.modalService.dismissAll();
  }

  /**
   * Open Large modal
   * @param largeDataModal large modal data
   */
  largeModal(largeDataModal: string) {
    this.modalService.open(largeDataModal, { size: 'lg' });
  }

  /**
   * Open small modal
   * @param smallDataModal small modal data
   */
  smallModal(smallDataModal: string) {
    this.modalService.open(smallDataModal, { size: 'sm' });
  }

  /**
   * Open center modal
   * @param centerDataModal center modal data
   */
  centerModal(centerDataModal: string) {
    this.modalService.open(centerDataModal, { centered: true });
  }

  /**
   * Open scroll modal
   * @param scrollDataModal scroll modal data
   */
  scrollModal(scrollDataModal: string) {
    this.modalService.open(scrollDataModal, { scrollable: true });
  }

  /**
   * Full width modal open
   * @param fullWidthData full width modal data
   */
  fullWidth(fullWidthData: string) {
    this.modalService.open(fullWidthData, {windowClass: 'modal-full'});
  }

  /**
   * Responsive modal open
   * @param responsiveData responsive modal data
   */
  responsiveModal(responsiveData: string) {
    this.modalService.open(responsiveData);
  }

  /**
   * Accordion modal open
   * @param accordionData accordion modal data
   */
  accordionModal(accordionData: string) {
    this.modalService.open(accordionData);
  }


  convert(str) {
    var date = new Date(str),
    mnth = ("0" + (date.getMonth()+1)).slice(-2),
    day  = ("0" + date.getDate()).slice(-2),
    hours  = ("0" + date.getHours()).slice(-2),
    minutes = ("0" + date.getMinutes()).slice(-2),
    seconds = ("0" + date.getMinutes()).slice(-2);
    seconds = '00';
    
      return [hours, minutes, seconds].join(":");

     // return [date.getFullYear(), mnth, day].join("-");

  }
  
  //console.log(this.convert("Thu Jun 09 2011 00:00:00 GMT+0530 (India Standard Time)"))


  convertDateDisplay() {
    /*
    var date = new Date(),
    mnth = ("0" + (date.getMonth()+1)).slice(-2),
    day  = ("0" + date.getDate()).slice(-2),
    hours  = ("0" + date.getHours()).slice(-2),
    minutes = ("0" + date.getMinutes()).slice(-2),
    seconds = ("0" + date.getMinutes()).slice(-2);
    seconds = '00';
    
    return [hours, minutes, seconds].join(":");

    // return [date.getFullYear(), mnth, day].join("-");
    */
  
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    //minutes < 10 ? minutes : minutes;
    var minutesN = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutesN + ' ' + ampm;
    return strTime;
  
  }
  

  convertDateTodayDisplay() {
    /*
    var date = new Date(),
    mnth = ("0" + (date.getMonth()+1)).slice(-2),
    day  = ("0" + date.getDate()).slice(-2),
    hours  = ("0" + date.getHours()).slice(-2),
    minutes = ("0" + date.getMinutes()).slice(-2),
    seconds = ("0" + date.getMinutes()).slice(-2);
    seconds = '00';
    
    return [hours, minutes, seconds].join(":");

    // return [date.getFullYear(), mnth, day].join("-");
    */
  
    var date = new Date();
    var years = date.getFullYear();
    var months = ("0" + (date.getMonth()+1)).slice(-2);
    var days  = ("0" + date.getDate()).slice(-2);
    
    //var strTime = days+months+years;
    var strTime = years+'-'+months+'-'+days;
    return strTime;
  
  }

  convertDateFormatDisplay(datevalue) {
     
    var date = new Date(datevalue);
    var years = date.getFullYear();
    var months = ("0" + (date.getMonth()+1)).slice(-2);
    var days  = ("0" + date.getDate()).slice(-2);
    
    //var strTime = days+months+years;
    var strTime = years+'-'+months+'-'+days;
    return strTime;
  
  }

  public myFilter = (d: Date): boolean => {
    console.log("xyz",d);
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
}


smallModalPopUp(smallDataModal: string, medicationReminderDataValue, event) {
  console.log("medicationReminderDataValue",medicationReminderDataValue);
  if(this.medicationReminderData.isReminderSet==false) {

    if(this.MedicationReminderFormBox1) {
      this.MedicationReminderFormBox1=false;
    } else {
      this.MedicationReminderFormBox1=true;
    }
    
  } else {
    this.medicationReminderDataisReminderSet = true;
    this.modalService.open(smallDataModal, { size: 'sm', centered: true, backdrop : 'static', keyboard : false  });
    /* this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false }); */
  }
  
}

smallModalPopUpAll(smallDataModal: string, event) {
  if(this.globalAlert==false) {
    
    this.globalAlert = false;
    console.log("SMALL MODAL POPUP ALL - OFF");
    this.modalService.open(smallDataModal, { size: 'sm', centered: true, backdrop : 'static', keyboard : false  });

  } else {

    this.globalAlert = true;
    console.log("SMALL MODAL POPUP ALL - ON");
    this.modalService.open(smallDataModal, { size: 'sm', centered: true, backdrop : 'static', keyboard : false  });

    //this.ReminderOnAll();
  }
  /*
  if(this.medicationReminderData.isReminderSet==false) {

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



clickevent(event: any, DivID: string){
  console.log("DivID",DivID);
  this.collapse = !this.collapse;
  if( this.collapse ) {
    this.addclass = ' hideclass';
  }
  else if( !this.collapse){
    this.addclass = ' showclass';
  }
  //this.collapse = !this.collapse
 /*
  if( this.collapse ) {
    this.addclass = ' '
  }
*/
  }

showDiv(event: any, DivID: string) {
  console.log("SHOWDIV",DivID);
  //angular.element(document.querySelectorAll('#'+DivID)).addClass("show"); 

}

selectedvisitIndex: any = -1;

clickeventvisit(event: any, DivID: string, Id: string){
  
  console.log("VISITDivID",DivID);
  /*
  console.log("DivID",DivID);
  this.collapse = !this.collapse;
  if( this.collapse ) {
    this.addclass = ' hideclass';
    this.selectedvisitIndex = -1;
  }
  else if( !this.collapse){
    this.addclass = ' showclass';
    this.selectedvisitIndex = Id;
  } 
  */
  if(this.selectedvisitIndex == Id) {
    this.selectedvisitIndex = -1;
  } else {
    this.selectedvisitIndex = Id;
  }
  
  
  }


selectedlabIndex: any = -1;

clickeventlab(event: any, DivID: string, Id: string){
  /*
  console.log("DivID",DivID);
  if( this.collapse ) {
    this.addclass = ' showclass';
    this.selectedlabIndex = -1;
  }
  else if( !this.collapse){
    this.addclass = ' hideclass';
    this.selectedlabIndex = Id;
  } 
  */
  if(this.selectedlabIndex == Id) {
    this.selectedlabIndex = -1;
  } else {
    this.selectedlabIndex = Id;
  }
  
  this.collapse = !this.collapse;
  
  }

 
labModalPopUp(smallDataModal: string, resourceName: any, resourceId: any) {
    console.log("resourceName", resourceName);
    console.log("resourceId", resourceId);
    
    this.getLaboratoryChartData(resourceName,resourceId);
     
    this.modalService.open(smallDataModal, { size: 'lg', centered: true, backdrop : 'static', keyboard : false  });
    
    
   
}

labchartModalPopUp(smallDataModal: string, resourceName: any,resourceId: any,resourceCode: any) {
  
  console.log("smallDataModal", smallDataModal);
  console.log("resourceName", resourceName);
  console.log("resourceId", resourceId);
  console.log("resourceCode", resourceCode);
  
  this.loadChartView(resourceCode);

  this.modalService.open(smallDataModal, { size: 'lg', centered: true, backdrop : 'static', keyboard : false  });

   
 
}



loadingData: any;
lablistMasterData: any;
getLaboratoryChartData(resourceName,resourceId) {
  this.loadingData = false;

   
  console.log('getLaboratoryChartData');
  console.log('BaseURL::+'+this.BaseURL);

  console.log('loadChartMaster');
  console.log(this.BaseURL+'/patient/lab?resourceId='+resourceId+'&gender=Female&age=500&resourceType='+resourceName+'&patientId='+this.patientId+'&providerId=fcd4f999-35d9-4e7e-92a7-841851f9b1fd&subject='+this.patientId+'&');

  this.http.get(this.BaseURL+'/patient/lab?resourceId='+resourceId+'&gender=Female&age=500&resourceType='+resourceName+'&patientId='+this.patientId+'&providerId=fcd4f999-35d9-4e7e-92a7-841851f9b1fd&subject='+this.patientId+'&').subscribe((data) => {
    console.log(data['payload']);
    
    const dt = data;
    const resourceData = dt['payload'];
    console.log(resourceData);
     const lablistData = dt['payload'].SH360Resources[0];
     const lablistMasterName = dt['payload'].SH360Resources[0].coding.display;
     const lablistMasterDate = dt['payload'].SH360Resources[0].resourceDate;
     const lablistMasterData = dt['payload'].SH360Resources[0].results;
    
    this.lablistMasterData = lablistMasterData;
    this.loadingData = true;
    //this.lablistMasterData = data['payload'].SH360Resources;

    /*
    const dt = data.json();
    //console.log(dt['payload']);
    
    const listData = dt['payload'].SH360Resources;
    this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' }); 
    
    const resourceData = dt['payload'];
    console.log(resourceData);
     const lablistData = dt['payload'].SH360Resources[0];
     const lablistMasterName = dt['payload'].SH360Resources[0].coding.display;
     const lablistMasterDate = dt['payload'].SH360Resources[0].resourceDate;
     const lablistMasterData = dt['payload'].SH360Resources[0].results;
    
    this.data = lablistMasterData;
    */
    /*    
    this.patientMasterNameValue = lablistMasterName;
    this.patientMasterDateValue = lablistMasterDate;
    this.patientMasterDataValue = lablistMasterData;

    
    this.EncounterDataArray = this.EncounterData[0];
    this.LaboratoryDataArray = this.LaboratoryData;

    this.EncounterDataArray = [];
    this.EncounterDataArray.category = 'None';
    this.EncounterDataArray.resourceDate = 'None';
    this.EncounterDataArray.entityName = 'None'; 

    console.log('EncounterDataArray',this.EncounterDataArray);
    this.loadingData = true;
    */
  });

 
  }



  
  lablistDataCodeValue:any=[0];

  patientMasterNameValue:any=[];
  patientMasterDateValue:any=[];
  patientMasterDataValue:any=[];

  RangeChartDataArray:any=[];
  ChartDataArray:any=[];
  ChartData:any=[];

  RangeDataLow:any=[];
  RangeDataNormal:any=[];
  RangeDataHigh:any=[];

//  patientFirstNameValue:any=[];
//  patientLastNameValue:any=[];
//  lastViewedDataDisplay:any=[];

  lablistDataXlow:any=[];
  lablistDataXhigh:any=[];

  referenceRangeLow:any=[];
  referenceRangeHigh:any=[];

  referenceRangeBelow:any = [];
  referenceRangeNormal:any = [];
  referenceRangeAbove:any = [];

  public columnChart1: GoogleChartInterface;
  public columnChart2: GoogleChartInterface;
  public barChart: GoogleChartInterface;
  public pieChart1: GoogleChartInterface;
  public LineChart1: GoogleChartInterface;

  ChartresourceId: any;

  
setLowRange:any;
setHighRange:any;
setNormalRange:any;
setAcceptRange:any;
setBorderRange:any;
setRiskRange:any;


setLowRangeValue:any;
setHighRangeValue:any;
setNormalRangeValue:any;
setAcceptRangeValue:any;
setBorderRangeValue:any;
setRiskRangeValue:any;

  loadChartView(ChartresourceId) {
  
    this.setLowRange = false;
    this.setHighRange = false;
    this.setNormalRange = false;
    this.setAcceptRange = false;
    this.setBorderRange = false;
    this.setRiskRange = false;

    this.setLowRangeValue = null;
    this.setHighRangeValue = null;
    this.setNormalRangeValue = null;
    this.setAcceptRangeValue = null;
    this.setBorderRangeValue = null;
    this.setRiskRangeValue = null;

    this.lablistDataCodeValue = '';
    this.loadingData = false;
    console.log('loadChartView');
    console.log('MAINTAB');
    this.ChartresourceId = ChartresourceId;
    console.log(this.BaseURL+'/patient/lab/'+this.ChartresourceId+'/history?patientId='+this.patientId+'&gender=Female&age=500&providerId=fcd4f999-35d9-4e7e-92a7-841851f9b1fd&subject='+this.patientId+'&');
  
    this.http.get(this.BaseURL+'/patient/lab/'+this.ChartresourceId+'/history?patientId='+this.patientId+'&gender=Female&age=500&providerId=fcd4f999-35d9-4e7e-92a7-841851f9b1fd&subject='+this.patientId+'&').subscribe((data) => {
      
      this.loadingData = true;

      //console.log(data['payload']);
      const dt = data;
      console.log(dt['payload']);
      const resourceData = dt['payload'];
      //console.log(resourceData);
      const lablistData = dt['payload'].history;
      console.log(lablistData);
      
      const lablistRangeDataName = dt['payload'].loincReference;

      //const lablistDataName = dt['payload'].name;
      const lablistDataName = dt['payload'].loincReference.component;
      //console.log(lablistDataName);

      const lablistDataCode = dt['payload'].loincReference.code;
      console.log("lablistDataCode"+lablistDataCode);
      
      const lablistDataHistory = dt['payload'].history;
      //console.log(lablistDataHistory);

      const lablistDataUnit = dt['payload'].loincReference.unit;
      //console.log(lablistDataUnit);
      
 
    this.RangeChartDataArray['26464-8'] = [1,4.5,6.5,4.5,4.5,11.0,11.0];
    this.RangeChartDataArray['4548-4'] = [2,13.2,3.4,13.2,13.2,16.6,16.6];
    this.RangeChartDataArray['26453-1'] = [3,4.5,1.4,4.5,4.5,5.9,5.9];
    this.RangeChartDataArray['26515-7'] = [4,150,300,150,150,450,450];
    this.RangeChartDataArray['20570-8'] = [5,42,10,42,42,52,52];

    
    this.RangeChartDataArray['2093-3'] = [1,0,200,450,0,200,200];
    this.RangeChartDataArray['2085-9'] = [2,0,60,40,0,60,60];
    this.RangeChartDataArray['13457-7'] = [3,0,100,300,0,100,400,400];
    this.RangeChartDataArray['3043-7'] = [4,0,150,150,0,150,300,300];

        
    this.RangeChartDataArray['1742-6'] = [1,7,49,44,7,56,56];
    this.RangeChartDataArray['27344-1'] = [2,10,30,60,10,40,40];
    this.RangeChartDataArray['1751-7'] = [3,0,100,300,0,100,100];
    this.RangeChartDataArray['6768-6'] = [4,0,150,150,0,150,150];


    this.RangeChartDataArray['718-7'] = [2,13.2,3.4,13.2,13.2,16.6,16.6];
    this.RangeChartDataArray['2571-8'] = [4,0,150,150,0,150,300,300];
    this.RangeChartDataArray['6690-2'] = [1,4.5,6.5,4.5,4.5,11.0,11.0];
    

    this.lablistDataCodeValue = lablistDataCode;

    /*
    console.log(lablistDataCode);
    console.log(this.RangeChartDataArray[lablistDataCode]);

    console.log(this.RangeChartDataArray[lablistDataCode][0]);
    console.log(this.RangeChartDataArray[lablistDataCode][1]);
    console.log(this.RangeChartDataArray[lablistDataCode][2]);
    console.log(this.RangeChartDataArray[lablistDataCode][3]);
    */
    
    this.RangeDataLow = this.RangeChartDataArray[lablistDataCode][4];
    this.RangeDataNormal = this.RangeChartDataArray[lablistDataCode][5];
    this.RangeDataHigh = this.RangeChartDataArray[lablistDataCode][6];

    this.setLowRange = false;
    this.setHighRange = false;
    this.setNormalRange = false;
    this.setAcceptRange = false;
    this.setBorderRange = false;
    this.setRiskRange = false;

    this.setLowRangeValue = null;
    this.setHighRangeValue = null;
    this.setNormalRangeValue = null;
    this.setAcceptRangeValue = null;
    this.setBorderRangeValue = null;
    this.setRiskRangeValue = null;


    if(lablistRangeDataName.low) {
      this.setLowRange = true;
      this.setLowRangeValue = lablistRangeDataName.low.from +' - '+lablistRangeDataName.low.to;
      console.log("Has LOW");
    }    
    if(lablistRangeDataName.high) {
      this.setHighRange = true;
      this.setHighRangeValue = lablistRangeDataName.high.from +' - '+lablistRangeDataName.high.to;
      console.log("Has HIGH");
    }
    if(lablistRangeDataName.normal) {
      this.setNormalRange = true;
      this.setNormalRangeValue = lablistRangeDataName.normal.from +' - '+lablistRangeDataName.normal.to;
      console.log("Has NORMAL");
    }    
    if(lablistRangeDataName.acceptable) {
      this.setAcceptRange = true;
      this.setAcceptRangeValue = lablistRangeDataName.acceptable.from +' - '+lablistRangeDataName.acceptable.to;
      console.log("Has ACCEPT");
    }    
    if(lablistRangeDataName.borderline) {
      this.setBorderRange = true;
      this.setBorderRangeValue = lablistRangeDataName.borderline.from +' - '+lablistRangeDataName.borderline.to;
      console.log("Has BORDER");
    }    
    if(lablistRangeDataName.risk) {
      this.setRiskRange = true;
      this.setRiskRangeValue = lablistRangeDataName.risk.from +' - '+lablistRangeDataName.risk.to;
      console.log("Has RISK");
    }
    //STOP LAB RANGE DATA
    //return;

    this.ChartDataArray.length = 0;

    this.ChartDataArray.push(['Date', lablistDataUnit, 'Below', 'Normal', 'Above']);

     for(let data of lablistDataHistory) {
        this.ChartDataArray.push([data.resourceDate, parseFloat(data.valueQuantity), parseFloat(this.RangeChartDataArray[lablistDataCode][1]), parseFloat(this.RangeChartDataArray[lablistDataCode][2]), parseFloat(this.RangeChartDataArray[lablistDataCode][3])]);
      }


    console.log(this.ChartDataArray);
    
    this.LineChart1 = {
      chartType: 'LineChart',
      dataTable: this.ChartDataArray,
      //opt_firstRowIsData: true,
      options: {
        title: lablistDataName,
        height: 400,
        curveType: 'function',
        chartArea: { height: 300 },
        pointSize: 10,
        hAxis: {
          title: 'Date',
          minValue: this.lablistDataXlow ,
          maxValue: this.lablistDataXhigh ,
        },
        vAxis: {
          title: lablistDataUnit
        },
        isStacked: true,
        series: {
          0: {
            type: 'line',
          },
          1: {
              lineWidth: 0,
              pointSize: 0,
              color: 'red',
              type: 'area',
              visibleInLegend: false,
              enableInteractivity: false
          },
          2: {
              lineWidth: 0,
              pointSize: 0,
              color: 'green',
              type: 'area',
              visibleInLegend: false,
              enableInteractivity: false
          },
          3: {
              lineWidth: 0,
              pointSize: 0,
              color: 'red',
              type: 'area',
              visibleInLegend: false,
              enableInteractivity: false
          }
        }
      },
    };
 
    console.log(this.LineChart1);
   
    this.loadingData = true;

     
    });

    
    setTimeout(() => {
      this.loadingData = true;
    }, 2000); 
  }


  resourceVisitTypeValue: any;
  encounterValue: any;
  visitModalPopUp(smallDataModal: string, resourceVisitName: any,resourceId: any) {  

  this.loadingData = false;
      
  console.log("smallDataModal", smallDataModal);
  console.log("resourceVisitName", resourceVisitName);
  console.log("resourceId", resourceId);
  this.resourceVisitTypeValue = resourceVisitName;
  this.encounterValue = resourceId;
  //this.loadChartView(resourceCode);

  if(this.resourceVisitTypeValue=='visitinfo') {
    this.getVisitDetailsData();
  }

  if(this.resourceVisitTypeValue=='medicationstatement') {
    this.getVisitMedicationData();
  }
  if(this.resourceVisitTypeValue=='medications') {
    this.getVisitMedicationData();
  }
  if(this.resourceVisitTypeValue=='laboratory') {
    this.getVisitLaboratoryData();
  }    
  if(this.resourceVisitTypeValue=='diagnosticreport') {
    this.getVisitLaboratoryChartData();
  }     
  if(this.resourceVisitTypeValue=='vitals') {
    this.getVisitVitalData();
  }
  if(this.resourceVisitTypeValue=='procedures') {
  this.getVisitProceduresData();
  }
  if(this.resourceVisitTypeValue=='dischargesummary') {
  this.getVisitDischargesData();
  }
  if(this.resourceVisitTypeValue=='conditions') {
  this.getVisitConditionsData();
  }
  if(this.resourceVisitTypeValue=='immunizations') {
    this.getVisitImmunizationsData();
  }
  if(this.resourceVisitTypeValue=='diagnostic') {
    this.getVisitDiagnosticData();
  }

  
  if(this.resourceVisitTypeValue=='diagnosis') {
    this.getVisitDiagnosticData();
  }

  this.modalService.open(smallDataModal, { size: 'lg', centered: true, backdrop : 'static', keyboard : false  });


  }

  EncounterData: any;
  EncounterDataArray: any;
  EncounterDataCount: any;
  
  encounterResourceData: any;
  encounterResourceDataCount: any;

  ProcedureData: any;
  ProcedureDataArray: any;
  ProcedureDataCount: any;

  getVisitDetailsData() {
  
    
    console.log(this.encounterValue);
    console.log('getVisitMedicationData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log(this.BaseURL+'/clinicaldata/encounter/medications?subject='+this.patientId+'&encounter='+this.encounterValue+'');

      this.http.get(this.BaseURL+'/clinicaldata/encounter/medications?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);
 
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.EncounterDataCount =  _.filter(listData, { 'resourceType': 'Encounter' }).length;
        
        this.encounterResourceData = this.EncounterData[0];      
        this.encounterResourceDataCount = this.EncounterDataCount;

        console.log(this.encounterResourceData); 
        this.loadingData = true;
      });

    /*
    console.log(this.encounterValue);
    console.log('getVisitDetailsData');
    console.log('BaseURL::+'+this.BaseURL);
    console.log(this.BaseURL+'/patient/encounter?patientId='+this.patientId+'&resourceId='+this.encounterValue+'');

    this.http.get(this.BaseURL+'/patient/encounter?patientId='+this.patientId+'&resourceId='+this.encounterValue+'').subscribe((data) => {
      const dt = data.json();
      //console.log(dt);
      const listData = dt['payload'].SH360Resources;
      this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
      //this.ProcedureData = _.filter(listData, { 'resourceType': 'Procedure' });
      //console.log(this.EncounterData);
      //console.log(this.ProcedureData);
      
      this.EncounterDataArray = this.EncounterData[0];
      //this.ProcedureDataArray = this.ProcedureData;

      console.log(this.EncounterDataArray);
      //console.log(this.ProcedureDataArray);
    });
    */

  }

  
  getVisitDiagnosticData() {

    
    console.log(this.encounterValue);
    console.log('getVisitConditionsData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log(this.BaseURL+'/clinicaldata/encounter/immunizations?subject='+this.patientId+'&encounter='+this.encounterValue+'');


      this.http.get(this.BaseURL+'/clinicaldata/encounter/immunizations?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.ProcedureData = _.filter(listData, { 'resourceType': 'Immunization' });
        //console.log(this.EncounterData);
        //console.log(this.ProcedureData);
        this.ProcedureDataCount =  _.filter(listData, { 'resourceType': 'Immunization' }).length;
        
        this.EncounterDataArray = this.EncounterData[0];
        this.ProcedureDataArray = this.ProcedureData;
  
        console.log(this.EncounterDataArray);
        console.log(this.ProcedureDataArray);
        this.loadingData = true;
      });
    }

  
  getVisitImmunizationsData() {

    
    console.log(this.encounterValue);
    console.log('getVisitConditionsData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log(this.BaseURL+'/clinicaldata/encounter/immunizations?subject='+this.patientId+'&encounter='+this.encounterValue+'');


      this.http.get(this.BaseURL+'/clinicaldata/encounter/immunizations?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.ProcedureData = _.filter(listData, { 'resourceType': 'Immunization' });
        //console.log(this.EncounterData);
        //console.log(this.ProcedureData);
        this.ProcedureDataCount =  _.filter(listData, { 'resourceType': 'Immunization' }).length;
        
        this.EncounterDataArray = this.EncounterData[0];
        this.ProcedureDataArray = this.ProcedureData;
  
        console.log(this.EncounterDataArray);
        console.log(this.ProcedureDataArray);
        this.loadingData = true;
      });
    }

  getVisitConditionsData() {

    
    console.log(this.encounterValue);
    console.log('getVisitConditionsData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log(this.BaseURL+'/clinicaldata/encounter/conditions?subject='+this.patientId+'&encounter='+this.encounterValue+'');


      this.http.get(this.BaseURL+'/clinicaldata/encounter/conditions?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.ProcedureData = _.filter(listData, { 'resourceType': 'Condition' });
        //console.log(this.EncounterData);
        //console.log(this.ProcedureData);
        this.ProcedureDataCount =  _.filter(listData, { 'resourceType': 'Condition' }).length;
        
        this.EncounterDataArray = this.EncounterData[0];
        this.ProcedureDataArray = this.ProcedureData;
  
        console.log(this.EncounterDataArray);
        console.log(this.ProcedureDataArray);
        this.loadingData = true;
      });
    }
    
    getVisitProceduresData() {

    
      console.log(this.encounterValue);
      console.log('getVisitProceduresData');
      console.log('BaseURL::+'+this.BaseURL);
  
      console.log(this.BaseURL+'/clinicaldata/encounter/procedures?subject='+this.patientId+'&encounter='+this.encounterValue+'');
  
  
        this.http.get(this.BaseURL+'/clinicaldata/encounter/procedures?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
          //const dt = data.json();
          const dt = data;
          console.log(dt);
          
          const listData = dt['payload'].SH360Resources;
          this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
          this.ProcedureData = _.filter(listData, { 'resourceType': 'Procedure' });
          //console.log(this.EncounterData);
          //console.log(this.ProcedureData);
          this.ProcedureDataCount =  _.filter(listData, { 'resourceType': 'Procedure' }).length;
          
          this.EncounterDataArray = this.EncounterData[0];
          this.ProcedureDataArray = this.ProcedureData;
    
          console.log(this.EncounterDataArray);
          console.log(this.ProcedureDataArray);
          
          this.loadingData = true;
        });
      }
    
      
      MedicationData: any;
      MedicationDataArray: any;
      MedicationDataCount: any;

  getVisitMedicationData() {

    
    console.log(this.encounterValue);
    console.log('getVisitMedicationData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log(this.BaseURL+'/clinicaldata/encounter/medications?subject='+this.patientId+'&encounter='+this.encounterValue+'');

      this.http.get(this.BaseURL+'/clinicaldata/encounter/medications?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);

        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        const MedicationDataMR = _.filter(listData, { 'resourceType': 'MedicationRequest', });
        const MedicationDataMS = _.filter(listData, { 'resourceType': 'MedicationStatement', });
        
        this.MedicationData = MedicationDataMR.concat(MedicationDataMS);
        //console.log(this.EncounterData);
        //console.log(this.ProcedureData);
        this.MedicationDataCount =  _.filter(listData, { 'resourceType': 'MedicationRequest' }).length;
        if(this.MedicationDataCount==0) {
          this.MedicationDataCount =  _.filter(listData, { 'resourceType': 'MedicationStatement' }).length;
        }
        this.EncounterDataArray = this.EncounterData[0];
        this.MedicationDataArray = this.MedicationData;
  
        console.log(this.MedicationData);
        console.log(this.MedicationDataArray);

        
        this.MedicationDataArray = [];
        let currentDate = new Date();
        var currentDateTime = currentDate.getTime();
        console.log(currentDateTime);

        for(var key in this.MedicationData){
          console.log(key);
          let medDate = new Date(this.MedicationData[key].endDate);
          var medDateTime = medDate.getTime();
          console.log(medDateTime);
            if(medDateTime >= currentDateTime){
              this.MedicationDataArray.push(this.MedicationData[key]);
            } else if(this.MedicationData[key].endDate == ""){
              this.MedicationDataArray.push(this.MedicationData[key]);
            } else {
              this.MedicationData[key]['status']="expired";
              this.MedicationDataArray.push(this.MedicationData[key]);
            }
  
          }

        console.log(this.MedicationDataArray);
       
        this.loadingData = true;
      });
    }


    LaboratoryData:any;
    LaboratoryDataCount:any;
    LaboratoryDataArray:any; 
  
  getVisitLaboratoryData() {

  
    console.log(this.encounterValue);    
    console.log('getVisitLaboratoryData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log(this.BaseURL+'/clinicaldata/encounter/labreports?subject='+this.patientId+'&encounter='+this.encounterValue+'');
    
      this.http.get(this.BaseURL+'/clinicaldata/encounter/labreports?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);
 
        const listData = dt['payload'].SH360Resources;
        console.log(listData);
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.LaboratoryData = _.filter(listData, { 'resourceType': 'DiagnosticReport' });
        //console.log(this.EncounterData);
        console.log(this.LaboratoryData);
        this.LaboratoryDataCount =  _.filter(listData, { 'resourceType': 'DiagnosticReport' }).length;
        //console.log("LaboratoryDataCount",this.LaboratoryDataCount);
        if(listData[1]) {
          this.LaboratoryData = listData[1].reports;
          this.LaboratoryDataCount =  listData[1].reports.length;
        } else {
          this.LaboratoryDataCount = 0;
        }
        console.log("LaboratoryDataCount",this.LaboratoryDataCount);
        this.EncounterDataArray = this.EncounterData[0];
        this.LaboratoryDataArray = this.LaboratoryData;
  
        console.log(this.EncounterDataArray);
        console.log(this.LaboratoryDataArray);
       
       this.loadingData = true;
      });
    }

  /*  
  patientMasterNameValue:any=[];
  patientMasterDateValue:any=[];
  patientMasterDataValue:any=[];
  data:any=[];  
  */

  getVisitLaboratoryChartData() {

  
    console.log(this.encounterValue);    
    console.log('getVisitLaboratoryChartData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log('loadChartMaster');
    console.log(this.BaseURL+'/patient/lab?resourceId='+this.encounterValue+'&gender=Female&age=500&resourceType='+this.resourceType+'&patientId='+this.patientId+'&providerId=fcd4f999-35d9-4e7e-92a7-841851f9b1fd&subject='+this.patientId+'&');

    this.http.get(this.BaseURL+'/patient/lab?resourceId='+this.encounterValue+'&gender=Female&age=500&resourceType='+this.resourceType+'&patientId='+this.patientId+'&providerId=fcd4f999-35d9-4e7e-92a7-841851f9b1fd&subject='+this.patientId+'&').subscribe((data) => {
      //console.log(data['payload']);
      //const dt = data.json();
      const dt = data;
      console.log(dt['payload']);
      
      const listData = dt['payload'].SH360Resources;
      this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' }); 
      
      const resourceData = dt['payload'];
      console.log(resourceData);
       const lablistData = dt['payload'].SH360Resources[0];
       const lablistMasterName = dt['payload'].SH360Resources[0].coding.display;
       const lablistMasterDate = dt['payload'].SH360Resources[0].resourceDate;
       const lablistMasterData = dt['payload'].SH360Resources[0].results;
      
      this.patientMasterNameValue = lablistMasterName;
      this.patientMasterDateValue = lablistMasterDate;
      this.patientMasterDataValue = lablistMasterData;

      this.data = lablistMasterData;

      
      this.EncounterDataArray = this.EncounterData[0];
      this.LaboratoryDataArray = this.LaboratoryData;

      this.EncounterDataArray = [];
      this.EncounterDataArray.category = 'None';
      this.EncounterDataArray.resourceDate = 'None';
      this.EncounterDataArray.entityName = 'None'; 

      console.log('EncounterDataArray',this.EncounterDataArray);
      
     this.loadingData = true;
    });
 

      /*
      console.log(this.BaseURL+'/clinicaldata/encounter/labreports?subject='+this.patientId+'&encounter='+this.encounterValue+'');
    
      this.http.get(this.BaseURL+'/clinicaldata/encounter/labreports?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        const dt = data.json();
        //console.log(dt);
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.LaboratoryData = _.filter(listData, { 'resourceType': 'DiagnosticReport' });
        //console.log(this.EncounterData);
        //console.log(this.ProcedureData);
        this.LaboratoryDataCount =  _.filter(listData, { 'resourceType': 'DiagnosticReport' }).length;

        this.EncounterDataArray = this.EncounterData[0];
        this.LaboratoryDataArray = this.LaboratoryData;
  
        console.log(this.EncounterDataArray);
        console.log(this.LaboratoryDataArray);
      });
      */
    }
      
 
    VitalData:any;
    VitalDataCount:any;
    VitalDataArray:any;

  getVisitVitalData() {

  
    console.log(this.encounterValue);
    console.log('getVisitVitalData');
    console.log('BaseURL::+'+this.BaseURL);

    console.log(this.BaseURL+'/clinicaldata/encounter/vitals?subject='+this.patientId+'&encounter='+this.encounterValue+'');
    
      this.http.get(this.BaseURL+'/clinicaldata/encounter/vitals?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);
        
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.VitalData = _.filter(listData, { 'category': 'Vital Signs' });
        //console.log(this.EncounterData);
        //console.log(this.ProcedureData);
        this.VitalDataCount =  _.filter(listData, { 'category': 'Vital Signs' }).length;
        
        this.EncounterDataArray = this.EncounterData[0];
        this.VitalDataArray = this.VitalData;
        
        this.EncounterDataArray = [];
        this.EncounterDataArray.category = 'Out Patient';
        this.EncounterDataArray.resourceDate = this.VitalDataArray[0].resourceDate;
        this.EncounterDataArray.entityName = this.VitalDataArray[0].entityName;

        console.log(this.EncounterDataArray);
        console.log(this.VitalDataArray);
        
        this.loadingData = true;
      });
    }


    DocumentReferenceData:any;
    DocumentReferenceDataCount:any;
    DocumentReferenceDataArray:any;
    DocumentReferenceDataURL:any;
    urlSafe:any;
    //sanitizer:any;
  getVisitDischargesData() {

    console.log(this.encounterValue);
    console.log('getVisitDischargesData');
    console.log('BaseURL::+'+this.BaseURL);

      this.http.get(this.BaseURL+'/clinicaldata/encounter/documents?subject='+this.patientId+'&encounter='+this.encounterValue+'').subscribe((data) => {
        //const dt = data.json();
        const dt = data;
        console.log(dt);
        
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        this.DocumentReferenceData = _.filter(listData, { 'resourceType': 'DocumentReference' });
        //console.log(this.EncounterData);
        //console.log(this.DocumentReferenceData);
        this.DocumentReferenceDataCount =  _.filter(listData, { 'resourceType': 'DocumentReference' }).length;
        
        this.EncounterDataArray = this.EncounterData[0];
        this.DocumentReferenceDataArray = this.DocumentReferenceData;
  
        console.log(this.EncounterDataArray);
        console.log(this.DocumentReferenceDataArray);

        for(let datavalue of this.DocumentReferenceDataArray){
          
            console.log(datavalue);
            this.DocumentReferenceDataURL = this.BaseURL+'/patient/attachment?patientId='+this.patientId+'&resourceId='+datavalue.resourceId+'';
            this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.DocumentReferenceDataURL);
       }

       
       this.loadingData = true;
      });
    }




    resourceVisitInfoTypeValue: any;
    encounterInfoValue: any;
    loadingInfoData:any = false;
    visitInfoModalPopUp(smallDataModal: string, resourceVisitName: any,resourceId: any) {  
    console.log("visitInfoModalPopUp");
    this.loadingInfoData = false;
        
    console.log("smallDataModal", smallDataModal);
    console.log("resourceVisitName", resourceVisitName);
    console.log("resourceId", resourceId);
    this.resourceVisitInfoTypeValue = resourceVisitName;
    this.encounterInfoValue = resourceId;
    this.getVisitInfoDetailsData();

    //this.loadChartView(resourceCode);
  
  
    this.modalService.open(smallDataModal, { size: 'lg', centered: true, backdrop : 'static', keyboard : false  });
  
  
    }    

    loadingVisitInfoData: any = false;
    VisitDetailInfoData:any;
    VisitDetailInfoDataCount:any;
    visitdetailinfoResourceData:any;
    visitdetailinfoResourceDataCount:any;

    getVisitInfoDetailsData() {
  
    
      console.log(this.encounterInfoValue);
      console.log('getVisitInfoDetailsData');
      console.log('BaseURL::+'+this.BaseURL);
  
      console.log(this.BaseURL+'/clinicaldata/encounter/medications?subject='+this.patientId+'&encounter='+this.encounterInfoValue+'');
  
        this.http.get(this.BaseURL+'/clinicaldata/encounter/medications?subject='+this.patientId+'&encounter='+this.encounterInfoValue+'').subscribe((data) => {
          //const dt = data.json();
          const dt = data;
          console.log(dt);
   
          const listData = dt['payload'].SH360Resources;
          this.VisitDetailInfoData = _.filter(listData, { 'resourceType': 'Encounter' });
          this.VisitDetailInfoDataCount =  _.filter(listData, { 'resourceType': 'Encounter' }).length;
          
          this.visitdetailinfoResourceData = this.VisitDetailInfoData[0];      
          this.visitdetailinfoResourceDataCount = this.VisitDetailInfoDataCount;
  
          console.log(this.visitdetailinfoResourceData); 
          this.loadingVisitInfoData = true;
        });
  
      /*
      console.log(this.encounterValue);
      console.log('getVisitDetailsData');
      console.log('BaseURL::+'+this.BaseURL);
      console.log(this.BaseURL+'/patient/encounter?patientId='+this.patientId+'&resourceId='+this.encounterValue+'');
  
      this.http.get(this.BaseURL+'/patient/encounter?patientId='+this.patientId+'&resourceId='+this.encounterValue+'').subscribe((data) => {
        const dt = data.json();
        //console.log(dt);
        const listData = dt['payload'].SH360Resources;
        this.EncounterData = _.filter(listData, { 'resourceType': 'Encounter' });
        //this.ProcedureData = _.filter(listData, { 'resourceType': 'Procedure' });
        //console.log(this.EncounterData);
        //console.log(this.ProcedureData);
        
        this.EncounterDataArray = this.EncounterData[0];
        //this.ProcedureDataArray = this.ProcedureData;
  
        console.log(this.EncounterDataArray);
        //console.log(this.ProcedureDataArray);
      });
      */
  
    }

    

/* CALENDAR START HERE */
 
//datecolorjson:string;
 
loadMedications() {
   

 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 
  console.log(this.BaseURL+'/medication/calendar?patientId='+this.patientId+'&month='+this.systemMonth+'&year='+this.systemYear+'&timezone=Asia%2FKolkata');
  let apiurl = this.BaseURL+'/medication/calendar?patientId='+this.patientId+'&month='+this.systemMonth+'&year='+this.systemYear+'&timezone=Asia%2FKolkata';

  this.http.get(apiurl,{headers :headers}).subscribe((data) => { 
    console.log(data['payload']);
    //const dt = data.json();
    const dt = data;
    console.log(dt['payload']);
    const resourceData = dt['payload'];
    const resourcelistData = dt['payload'];

    this.medicationlistDate = resourcelistData.dates;
    this.medicationlistDateCount = resourcelistData.dates.length;
    this.medicationlistData = resourcelistData.summary;
    this.medicationlistDataCount = resourcelistData.summary.length;

   //this.medicationDetailDateArray.push({'day':1, 'date': '2020-06-01', 'color':'GREEN', 'event':true});
   //this.medicationDetailDateArray.push({'day':10, 'date': '2020-06-10', 'color':'GREEN', 'event':true});
  /*
   this.events = [...this.events,
    {
      start: startOfDay(new Date('2020-06-01')), 
      title: '',
      color: colors.blue,
      draggable: false,
    }
  ];

  
  this.events = [...this.events,
    {
      start: startOfDay(new Date('2020-06-10')), 
      title: '',
      color: colors.blue,
      draggable: false,
    }
  ];
  */
  
    for(var cn=0; cn < 32;cn++) {
      var formattedDayNumber = ("0" + cn).slice(-2);
      if(this.medicationlistDate[formattedDayNumber]) {
        var formattedDayNumber = ("0" + cn).slice(-2);
        var formattedMonthNumber = ("0" + this.systemMonth).slice(-2);
        var formattedYearNumber = ("0" + this.systemYear).slice(-4);

        var fulldate = formattedYearNumber+'-'+formattedMonthNumber+'-'+formattedDayNumber;
        var datecolor = this.medicationlistDate[formattedDayNumber].color;
        var dateevent = this.medicationlistDate[formattedDayNumber].event;

        this.medicationDetailDateArray.push({'day':formattedDayNumber, 'date': fulldate, 'color':datecolor, 'event':dateevent});

        //this.eventsArray.push({ start: startOfDay(new Date(fulldate)),  title: '',  color: colors.blue, draggable: false} );
  
        

        if(datecolor=='RED') {
          const datecolorjson = {primary: "#E8AA74",secondary: "#FAE3E3"};
          this.events = this.events.concat([
            {
              start: startOfDay(new Date(fulldate.replace(/-/g, "/"))), 
              title: '',
              color: {primary: "#E8AA74",secondary: "#FAE3E3"},
              draggable: false,
            }
            ]);
        }

        
        if(datecolor=='GREEN') {
          const datecolorjson = {primary: "#9FDCC7",secondary: "#FFFFFF"};
          this.events = this.events.concat([
            {
              start: startOfDay(new Date(fulldate.replace(/-/g, "/"))), 
              title: '',
              color: {primary: "#9FDCC7",secondary: "#FFFFFF"},
              draggable: false,
            }
            ]);
        }

        if(datecolor=='GRAY') {
          const datecolorjson = {primary: "#7B7E81",secondary: "#FFFFFF"};
          this.events = this.events.concat([
            {
              start: startOfDay(new Date(fulldate.replace(/-/g, "/"))), 
              title: '',
              color: {primary: "#7B7E81",secondary: "#FFFFFF"},
              draggable: false,
            }
            ]);
        }
       
        /*
        this.events = this.events.concat([
          {
            start: startOfDay(new Date(fulldate)), 
            title: '',
            color: datecolorjson,
            draggable: false,
          }
          ]);
          */

      }        
    }

    console.log(this.events);

    //console.log(this.medicationlistData);
    //console.log(this.medicationDetailDateArray);
    //console.log(this.eventsArray);
    //console.log(this.events);

    //this.events = this.eventsArray; 

    /*
    this.events = [ this.events,
      {
        start: startOfDay(new Date(fulldate)), 
        title: '',
        color: colors.blue,
        draggable: false,
      }
    ];
    */

    //console.log(this.events);

     /*
    this.events = [

      {
        start: startOfDay(new Date(fulldate)), 
        title: '',
        color: colors.blue,
        draggable: false,
      }
    ]; 

    this.events = [

      {
        start: startOfDay(new Date('2020-06-06')), 
        title: '',
        color: colors.blue,
        draggable: false,
      }
      
    ];
    */

     

  });
}

showDateReportPage(pageName: string, resourceDate: string, resourceColor: string, resourceEvent: string, itemId: string){
 
  console.log("itemIdValue::"+itemId);
  console.log(pageName+'/'+resourceDate+'/'+resourceColor+'/'+resourceEvent);
  //this.navCtrl.navigateForward(pageName+'/'+resourceType+'/'+resourceId+'/'+ChartresourceId);

  this.resourceDateValue = resourceDate;
  this.resourceDateColor = resourceColor;
  this.resourceDateEvent = resourceEvent;
  
  this.ChartresourceId = resourceEvent;

  this.loadDateReportView();

}


loadDateReportView() {
  this.MedTabID=0;
  console.log('loadReportView');

  var ccdate = new Date();
  var csdate=new Date(this.resourceDateValue.replace(/-/g, "/"));

  if(ccdate < csdate)
  {
      console.log(" The given date is Future Date");
      return;
  }

  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

 console.log(this.BaseURL+'/medication/calendar/date?patientId=ceca3fcf-f94e-4f1d-9883-39199fc59c3a&date='+this.resourceDateValue+'&timezone=Asia%2FKolkata');
  let apiurl = this.BaseURL+'/medication/calendar/date?patientId='+this.patientId+'&date='+this.resourceDateValue+'&timezone=Asia%2FKolkata';
  this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    //console.log(data['payload']);
    const dt = data;
    console.log(dt['payload']);
    const resourceData = dt['payload'];
    //const resourceDetailData = dt['payload'].SH360Resources;
    const resourceDetailData = dt['payload'].resources;
    
    this.medicationDetailDataArray = resourceDetailData;
    this.medicationDetailDataCount = this.medicationDetailDataArray.length;


    console.log(this.medicationDetailDataCount);
    console.log(this.medicationDetailDataArray);
     

  });
}



showReportPage(pageName: string, resourceId: string, itemId: string){
 
  console.log("itemIdValue::"+itemId);
  console.log(pageName+'/'+resourceId);
  //this.navCtrl.navigateForward(pageName+'/'+resourceType+'/'+resourceId+'/'+ChartresourceId);

  this.resourceId = resourceId;
  this.ChartresourceId = resourceId;
  //this.ChartDataArray = '';
  
  this.ChartDataArray.length = 0;
  
  this.RangeDataLow = '';
  this.RangeDataNormal = '';
  this.RangeDataHigh = '';
  
  this.loadReportView();

}


loadReportView() {
  this.MedTabID=0;
  console.log('loadReportView');
 
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

  console.log(this.BaseURL+'/medication/consumption/resource?patientId='+this.patientId+'&resourceId='+this.resourceId+'&&status=');
  let apiurl = this.BaseURL+'/medication/consumption/resource?patientId='+this.patientId+'&resourceId='+this.resourceId+'&&status=';
  this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    //console.log(data['payload']);
    //const dt = data.json();
    const dt = data;
    //console.log(dt['payload']);
    const resourceData = dt['payload'];
    //const resourceDetailData = dt['payload'].SH360Resources;
    const resourceDetailData = dt['payload'];
    
    this.medicationDetailData = resourceDetailData;
    this.medicationDetailDataTiming = resourceDetailData.timing;
    this.medicationDetailDataSummaryStatus = resourceDetailData.summary.status;
    //this.medicationDetailDataArray[0] = resourceDetailData;
    this.medicationDetailDataCount = this.medicationDetailData.length;


    console.log(this.medicationDetailDataCount);
    console.log(this.medicationDetailData);
    console.log(this.medicationDetailDataTiming);
     

  });
}


public isKeySet(obj: any, key: string): boolean {
  console.log(key+"::");console.log(key in obj);
  return key in obj;
}


selectMonth()
{
  this.monthView = true;
  this.yearView = false;
}

medicationYearlyArray:any=[];
medicationYearlyDataArray:any=[];

selectYear()
{
  this.monthView = false;
  this.yearView = true;

  for(var yr=0; yr < 11;yr++) {
    this.medicationYearlyArray    
  }

  this.loadYearReportView();

}


loadYearReportView() {
  console.log('loadYearReportView');
  /*
  this.systemDate = new Date();
  this.systemMonth = this.systemDate.getMonth()+1;
  this.systemYear = this.systemDate.getFullYear();
  this.systemZone = this.systemDate.toString();
  */

  this.resourceYearValue ='2021';

  
 const headers = new HttpHeaders;
 headers.append('Content-Type', 'application/json');

  console.log(this.BaseURL+'/medication/calendar/year?patientId=ceca3fcf-f94e-4f1d-9883-39199fc59c3a&year='+this.resourceYearValue+'&timezone=Asia%2FKolkata');
  console.log(this.BaseURL+'/medication/calendar/year?patientId='+this.patientId+'&year='+this.resourceYearValue+'&timezone=Asia%2FKolkata');
  
  let apiurl = this.BaseURL+'/medication/calendar/year?patientId='+this.patientId+'&year='+this.resourceYearValue+'&timezone=Asia%2FKolkata';
  
  this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    //console.log(data['payload']);
    const dt = data;
    console.log(dt['payload']);
    const resourceData = dt['payload'];
    //const resourceDetailData = dt['payload'].SH360Resources;
    const resourceDetailData = dt['payload'].resources;
    

    for(var yr=0; yr <= 12;yr++) {
      if(resourceData[yr]) {
        this.medicationYearlyDataArray.push({'month':yr+1, 'data':resourceData[yr]});
      }
      else
      {
        this.medicationYearlyDataArray.push({'month':yr+1, 'data':{"totalCount":0,"takenPercent":0,"skippedPercent":0}});
      }
    } 

    console.log(this.medicationYearlyDataArray);
     

  });
}

selectCurrentMonth()
{

  this.monthView = true;
  this.yearView = false;
 /* 
  this.ngOnInit();
  console.log('selectCurrentMonth');
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate(['/medicationadherence']);
  */
  
 this.yearmonthsArray = yearmonths;
 this.systemDate = new Date();
 this.systemMonth = this.systemDate.getMonth()+1;
 this.systemYear = this.systemDate.getFullYear();
 this.systemZone = this.systemDate.toString();
 this.loadMedications();
 
}


selectYearMonth(year,month,day=1)
{
  console.log("viewDate:1:",this.viewDate);
  var formattedDayNumber = ("0" + day).slice(-2);
  var formattedMonthNumber = ("0" + month).slice(-2);
  var formattedYearNumber = ("0" + year).slice(-4);

  let DateValue = formattedYearNumber+"-"+formattedMonthNumber+"-"+formattedDayNumber;
  console.log("DateValue::",DateValue);
  
  this.viewDate = new Date(DateValue.replace(/-/g, "/"));
  console.log("viewDate:2:",this.viewDate);
  console.log("MAC:viewDate:2:",new Date(DateValue.replace(/-/g, "/")));

  this.monthView = true;
  this.yearView = false;
  
  this.yearmonthsArray = yearmonths;
  this.systemDate = new Date(DateValue.replace(/-/g, "/"));
  console.log(this.systemDate);
  this.systemMonth = this.systemDate.getMonth()+1;
  this.systemYear = this.systemDate.getFullYear();
  this.systemZone = this.systemDate.toString();
  this.loadMedications();
  
}


/* Calendar Start */

dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  
  //console.log(date);

  //console.log(date.getMonth());return false;

  //console.log(date.getFullYear()+'-'+date.getMonth()+'-'+date.getDay());

  var selectedDayNumber = ("0" + date.getDate()).slice(-2);
  var selectedMonthNumber = ("0" + (date.getMonth()+1)).slice(-2);
  var selectedYearNumber = ("0" + date.getFullYear()).slice(-4);

  var selecteddate = selectedYearNumber+'-'+selectedMonthNumber+'-'+selectedDayNumber;

  this.showDateReportPage('medicationreport', selecteddate , 'GREEN', 'true' , '0');

  if (isSameMonth(date, this.viewDate)) {
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
    }
    this.viewDate = date;
  }
}


/*
eventTimesChanged({
  event,
  newStart,
  newEnd,
}: CalendarEventTimesChangedEvent): void {
  this.events = this.events.map((iEvent) => {
    if (iEvent === event) {
      return {
        ...event,
        start: newStart,
        end: newEnd,
      };
    }
    return iEvent;
  });
  this.handleEvent('Dropped or resized', event);
}

handleEvent(action: string, event: CalendarEvent): void {
  this.modalData = { event, action };
  this.modal.open(this.modalContent, { size: 'lg' });
}

addEvent(): void {
  this.events = [
    ...this.events,
    {
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    },
  ];
}

deleteEvent(eventToDelete: CalendarEvent) {
  this.events = this.events.filter((event) => event !== eventToDelete);
}
*/

setView(view: CalendarView) {
  this.view = view;
  console.log(this.view);
}

closeOpenMonthViewDay(move) {
  console.log('CHANGE');
  //console.log(move);

  this.activeDayIsOpen = false;
  
  this.yearmonthsArray = yearmonths;

  if(move=='plus') {
    
    //this.systemDate = new Date(this.systemDate.setMonth(this.systemDate.getMonth() + 1).replace(/-/g, "/"));

    this.systemDate = new Date(this.systemDate.setMonth(this.systemDate.getMonth() + 1));

  } else if(move=='minus') {
    //this.systemDate = new Date(this.systemDate.setMonth(this.systemDate.getMonth() - 1).replace(/-/g, "/"));

    this.systemDate = new Date(this.systemDate.setMonth(this.systemDate.getMonth() - 1));

  } else {
    this.systemDate = new Date();
  }
  
  console.log(this.systemDate);

  //this.systemDate = new Date();
  this.systemMonth = this.systemDate.getMonth()+1;
  this.systemYear = this.systemDate.getFullYear();
  this.systemZone = this.systemDate.toString();
  this.loadMedications();

}



/* Calendar End */


closeOpenYearViewDay(move) {
  //console.log('CHANGE');
  //console.log(move);

  this.activeDayIsOpen = false;
  
  this.yearmonthsArray = yearmonths;

  if(move=='plus') {
    //this.systemDate = new Date(this.systemDate.setYear(this.systemDate.getFullYear() + 1).replace(/-/g, "/"));

    this.systemDate = new Date(this.systemDate.setYear(this.systemDate.getFullYear() + 1));
    
  } else if(move=='minus') {
    //this.systemDate = new Date(this.systemDate.setYear(this.systemDate.getFullYear() - 1).replace(/-/g, "/"));

    this.systemDate = new Date(this.systemDate.setYear(this.systemDate.getFullYear() - 1));

  } else {
    this.systemDate = new Date();
  }
  
  console.log(this.systemDate);

  //this.systemDate = new Date();
  this.systemMonth = this.systemDate.getMonth()+1;
  this.systemYear = this.systemDate.getFullYear();
  this.systemZone = this.systemDate.toString();
  //this.loadMedications();

}


/* CALENDAR END HERE */


lastDate = '2000-01-01';

shouldDisplayDate(date: any) : boolean {
    if (date != this.lastDate) {
        this.lastDate = date;
        return true;
    }
    return false;
}


/* DATE RANGE PICKER : START */

DateSearchFilter:any;

onDateSelection(date: NgbDate,datepicker) {
  if (!this.fromDate && !this.toDate) {
    this.fromDate = date;
  } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
    this.toDate = date;
    console.log("DATE DONE");
    this.DateSearchFilter = true;
    this.showResourceDataByType(this.CurrentTabPage,this.patientId);
    datepicker.close();

  } else {
    this.toDate = null;
    this.fromDate = date;
  }
}

isHovered(date: NgbDate) {
  return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
}

isInside(date: NgbDate) {
  return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
}

isRange(date: NgbDate) {
  return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
}

validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
  const parsed = this.formatter.parse(input);
  return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
}

/* DATE RANGE PICKER : END */

public datepickerclear(): void {
  this.fromDate = undefined;
  this.toDate = undefined;
  this.showResourceDataByType(this.CurrentTabPage,this.patientId);
}

}

