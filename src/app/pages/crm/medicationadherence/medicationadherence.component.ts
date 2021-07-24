import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';
 

//import { NavController, NavParams } from '@ionic/angular';
import { Http, Headers } from '@angular/http';

import { HttpClient, HttpHeaders } from '@angular/common/http';


//import { mobiscroll, MbscPopupOptions, MbscListviewOptions, MbscOptionlistOptions } from '@mobiscroll/angular';

import * as _ from 'lodash';

//import { IonSlides} from '@ionic/angular';

import { v4 as uuidv4 } from 'uuid';

//import { ModalController} from '@ionic/angular';  

import { ActivatedRoute } from '@angular/router';

import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

/* Calendar Start */

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
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

import { Router } from '@angular/router';

/* Calendar End */
 

@Component({
  selector: 'app-medicationadherence',
  templateUrl: './medicationadherence.component.html',
  styleUrls: ['./medicationadherence.component.scss']
})
export class MedicationadherenceComponent implements OnInit {

  BaseURL: any;
  ChatBaseURL: any;
  staffId: any;
  lastViewedDataValue:any;
  dayDifferenceValue: any;
  inboxData: any;
  globalAlert:any;
  globalAlertValue:any;
  searchText: any;
  searchMedicationText:any;

  MedTabID:any;
  CurrentTabPage:any;
  /*
  providerId = this.getCookie("providerId");
  providerRole = this.getCookie("providerRole");
  patientSessionId = this.getCookie("patientSessionId");
  patientId = this.getCookie("patientId");
  */
 providerId = "1111";
 providerRole = "1111";
 patientSessionId = "1111";
 patientId = "ba04fe0c-f039-41dd-8d79-6f5dd5022dd3";
  
  patientFirstNameValue:any=[];
  patientLastNameValue:any=[];
  lastViewedDataDisplay:any=[];

  
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

  ChartresourceId:any=[];
  
  lablistDataCodeValue:any=[];

  patientMasterNameValue:any=[];
  patientMasterDateValue:any=[];
  patientMasterDataValue:any=[];

  RangeChartDataArray:any=[];
  ChartDataArray:any=[];
  ChartData:any=[];

  RangeDataLow:any=[];
  RangeDataNormal:any=[];
  RangeDataHigh:any=[];


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

  /*
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];
  */

  
  /*
  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()), 
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];
  */

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = false;

  /* Calendar End */

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute , public tooltipconfig: NgbTooltipConfig, private modal: NgbModal) {
  
  
  }
 

  MedTab(i) {
    this.MedTabID=i;
  }

  ngOnInit() {
   
  this.MedTabID=0;
  this.CurrentTabPage = 'medicationadherence';  
  this.lastViewedDataValue = localStorage.getItem('lastViewedDataValue');
  this.dayDifferenceValue = localStorage.getItem('dayDifferenceValue');
  this.BaseURL = localStorage.getItem("SH360_API_PROVIDER_URL");
  this.ChatBaseURL = localStorage.getItem("SH360_API_CHAT_URL");
  let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  console.log(loginUser);
  this.staffId = loginUser.sh360Id;


    
    this.getPatientInfo();

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

    let apiurl = this.ChatBaseURL+'/patients?staffId='+this.staffId;

    //let apiurl = 'http://3.94.31.236:11008/cm/patients?staffId='+this.staffId;

    console.log("getPatientInfo", apiurl);

    this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    
      const dt = data;
      const userData = dt['payload'];
      
      console.log("userData",userData);

      this.inboxData = userData;
    
      //this.globalAlert = metaData.medAlert;

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
  //datecolorjson:string;
   
  loadMedications() {
    
    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    /*
    requestOptions.append('session_id', this.patientSessionId);
    requestOptions.append('owner_id', this.patientId);
    requestOptions.append('requester_id', this.providerId);
    requestOptions.append('requester_role', this.providerRole);
    */

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
    console.log('loadReportView');

    var ccdate = new Date();
    var csdate=new Date(this.resourceDateValue.replace(/-/g, "/"));

    if(ccdate < csdate)
    {
        console.log(" The given date is Future Date");
        return;
    }

    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    /*
    requestOptions.append('session_id', this.patientSessionId);
    requestOptions.append('owner_id', this.patientId);
    requestOptions.append('requester_id', this.providerId);
    requestOptions.append('requester_role', this.providerRole);
    */
    /*
    console.log(this.BaseURL+'/medication/consumption/resource?patientId='+this.patientId+'&resourceId='+this.resourceId+'&&status=');
    this.http.get(this.BaseURL+'/medication/consumption/resource?patientId='+this.patientId+'&resourceId='+this.resourceId+'&&status=').subscribe((data) => { }
    */

    /*
   http://18.213.144.230:11001/api/medication/calendar/date?patientId=ceca3fcf-f94e-4f1d-9883-39199fc59c3a&date=2020-06-07&timezone=Asia%2FKolkata
    */

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

    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    /*
    requestOptions.append('session_id', this.patientSessionId);
    requestOptions.append('owner_id', this.patientId);
    requestOptions.append('requester_id', this.providerId);
    requestOptions.append('requester_role', this.providerRole);
    */

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

    this.resourceYearValue ='2020';

    var requestOptions = new Headers({ 'Content-Type': 'application/json' });
    requestOptions.append('SH360_Session_id', uuidv4());
    requestOptions.append('SH360_Owner_id', this.patientId);
    requestOptions.append('SH360_Requester_id', this.providerId);
    requestOptions.append('SH360_Requester_role', this.providerRole);
    /*
    requestOptions.append('session_id', this.patientSessionId);
    requestOptions.append('owner_id', this.patientId);
    requestOptions.append('requester_id', this.providerId);
    requestOptions.append('requester_role', this.providerRole);
    */

    
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

  

  showResourceDataByType(resourceType,patientId){

  }

  showMedicalAdherence(resourceType,patientId){

  }

}


