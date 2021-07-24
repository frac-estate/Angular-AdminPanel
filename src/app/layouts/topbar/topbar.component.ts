import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../core/services/auth.service';


import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../core/services/cookie.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MustMatch } from './topbar.mustmatch';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
 
import { ProfileService } from './../../profile.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  BaseURL = '';
  errormsg = '';
  successmsg = '';
  error = '';
  loading = false;
  submitted = false;

  pwdfrm = true;
  pwdmsg = false;

  passwordVaildationOld = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);

  passwordVaildation = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  

  validationpasswordform: FormGroup;

  notificationItems: Array<{}>;
  languages: Array<{
    id: number,
    flag?: string,
    name: string
  }>;
  selectedLanguage: {
    id: number,
    flag?: string,
    name: string
  };

  openMobileMenu: boolean;

  patientTodayCount:any=0;

  

  ToppatientTodayCount:any = 0;
  ChatBaseURL:any;
  staffId:any;
  ToppatientlistData:any;
  ToppatientlistDataContact:any;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  @ViewChild("sessionoutmessage", {static: false}) modalContent: TemplateRef<any>;

  
  //userInfo: any = [];
  userInfoprofilePicture: any;

  @Input() userInfo;

  constructor(
    private router: Router, 
    private authService: AuthenticationService,
    private http: HttpClient, 
    private cookieService: CookieService,
    private modalService: NgbModal, 
    public formBuilder: FormBuilder,
    private idle: Idle, private keepalive: Keepalive,
    private profileservice:ProfileService
    ) { 

    /*
       // sets an idle timeout of 5 seconds, for testing purposes. 900
    idle.setIdle(900);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out. 60
    idle.setTimeout(60);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      //this.logout();
      this.logoutAuto(this.modalContent);
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(30);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
    */
    }

    
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
    //this.logout();
  }

  ngAfterViewInit() {
    this.profileservice.selectedPics.subscribe(pic => {
    console.log("RAD",pic);
    this.userInfoprofilePicture = pic;
    });
  }

  ngOnInit() {

    this.userInfo = '';
    //console.log("loginUser BEFORE",);
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
 
    if(loginUser){
      console.log("1:",loginUser);
    } else {
      console.log("21:",loginUser);
      this.router.navigate(['/account/login']);
      return;
    }

    //console.log("loginUser AFTER",loginUser);
    this.userInfo = loginUser;

    this.userInfoprofilePicture = loginUser.profilePicture;
    //this.userInfoprofilePicture = new Date();
    /*
    var userInfoprofilePictureOberve = this.profileservice.selectedPics.getValue();
    console.log("userInfoprofilePictureOberve",userInfoprofilePictureOberve);
    if(userInfoprofilePictureOberve!='') {
      this.userInfoprofilePicture = userInfoprofilePictureOberve;
    } else {
      this.userInfoprofilePicture = loginUser.profilePicture;
    }
    */
    this.staffId = loginUser.sh360Id;
    /*
    this.config = this.configService.readConfig();
    localStorage.setItem("SH360_API_URL",this.config.baseUrl);
    localStorage.setItem('SH360_WEBSOCKET_URL',this.config.websocketBaseUrl+'/socket/provider');
    localStorage.setItem('SH360_WEB_URL',this.config.webbaseUrl);
    */
    /*    
    localStorage.setItem("SH360_API_URL",environment.baseUrl);
    localStorage.setItem('SH360_WEBSOCKET_URL',environment.websocketBaseUrl+'/socket/provider');
    localStorage.setItem('SH360_WEB_URL',environment.webbaseUrl);
    */  

    this.BaseURL = localStorage.getItem("SH360_API_URL");
    this.ChatBaseURL = localStorage.getItem("SH360_API_CHAT_URL"); 
    
   //this.enableWebsocket();

    // get the notifications
    //this._fetchNotifications();
    this.openMobileMenu = false;

    
    /*
    this.validationpasswordform = this.formBuilder.group({
      cpassword: ['', [Validators.required]],
      npassword: ['', [Validators.required, Validators.pattern(this.passwordVaildation)]],
      cnpassword: ['', [Validators.required]],
    },{
      validator: MustMatch('npassword', 'cnpassword'),
    });
    */

    this.patientTodayCount = localStorage.getItem('patientTodayCount');

    //this.getPatientCount();
 

    //this._fetchData();

    setInterval(this.ngOnInit, 10000, "my text");
  }

  public PageReload() {

    
    //let loginUser = JSON.parse(this.cookieService.getCookie('loginUser'));
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log("PageReload",loginUser);
    this.userInfo = loginUser;

    this.userInfoprofilePicture = loginUser.profilePicture;
    //this.userInfoprofilePicture = new Date();
    
    this.staffId = loginUser.sh360Id;
  }

  private _fetchData() {

    //document.getElementById("imageid").src="../template/save.png";


    /*
    this.loading = false;
 
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
    this.staffId = loginUser.id;

   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');

     var header = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization',  'Bearer '+loginUser.token)
  }


   let apiurl = this.BaseURL+'/admin/staff?id='+this.staffId;
 
   console.log("getCMInfo API", apiurl);

   this.http.get(apiurl,header).subscribe((data) => {
   
     const dt = data;
     const userData = dt['payload'];
     
     console.log("userInfo",userData);

     this.userInfo = userData;

          
     this.loading = true; 

  });
  */

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
   
    
    var header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization',  'Bearer '+loginUser.token)
    }
 

   let postData = {
    "id": loginUser.id,
    "currentPassword": currentPassword,
    "newPassword": newPassword
  };
  

   console.log('postData',postData);
 
    let apiurl = this.BaseURL+'/user/password'; 
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
        this.loading = false;
      }
    );

    } else {
      this.errormsg = 'Validation error / Please fill form data';
      console.log('ERROR ON FORM')
    }


  }

  /**
   * Change the language
   * @param language language
   */
  changeLanguage(language) {
    this.selectedLanguage = language;
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  
  openModal(content: string) {
    
  this.pwdfrm = true;
  this.pwdmsg = false;
    this.modalService.open(content, { centered: true });
  }
  

  logoutAuto(content) {
    
    localStorage.setItem("loginUser",'');
    this.modalService.dismissAll();
    this.modalService.open(content, { centered: true });
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }
  /**
   * Logout the user
   */
  logout() {
    this.modalService.dismissAll();
    localStorage.setItem("loginUser",'');
    //this.modalService.open('sessionoutmessage', { centered: true });
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }

  /**
   * Fetches the notification
   * Note: For now returns the hard coded notifications
   */
  _fetchNotifications() {
    this.notificationItems = [{
      text: 'Caleb Flakelar commented on Admin',
      subText: '1 min ago',
      icon: 'mdi mdi-comment-account-outline',
      bgColor: 'primary',
      redirectTo: '/notification/1'
    },
    {
      text: 'New user registered.',
      subText: '5 min ago',
      icon: 'mdi mdi-account-plus',
      bgColor: 'info',
      redirectTo: '/notification/2'
    },
    {
      text: 'Cristina Pride',
      subText: 'Hi, How are you? What about our next meeting',
      icon: 'mdi mdi-comment-account-outline',
      bgColor: 'success',
      redirectTo: '/notification/3'
    },
    {
      text: 'Caleb Flakelar commented on Admin',
      subText: '2 days ago',
      icon: 'mdi mdi-comment-account-outline',
      bgColor: 'danger',
      redirectTo: '/notification/4'
    },
    {
      text: 'Caleb Flakelar commented on Admin',
      subText: '1 min ago',
      icon: 'mdi mdi-comment-account-outline',
      bgColor: 'primary',
      redirectTo: '/notification/5'
    },
    {
      text: 'New user registered.',
      subText: '5 min ago',
      icon: 'mdi mdi-account-plus',
      bgColor: 'info',
      redirectTo: '/notification/6'
    },
    {
      text: 'Cristina Pride',
      subText: 'Hi, How are you? What about our next meeting',
      icon: 'mdi mdi-comment-account-outline',
      bgColor: 'success',
      redirectTo: '/notification/7'
    },
    {
      text: 'Caleb Flakelar commented on Admin',
      subText: '2 days ago',
      icon: 'mdi mdi-comment-account-outline',
      bgColor: 'danger',
      redirectTo: '/notification/8'
    }];
  }


  getPatientCount() {
     
     
    const headers = new HttpHeaders;
    headers.append('Content-Type', 'application/json');

    let apiurl = this.ChatBaseURL+'/chat/conversations?userId='+this.staffId+'&userRole=Case-Manager';

    console.log("getPatientCount", apiurl);

    this.http.get(apiurl,{headers :headers}).subscribe((data) => {
    
      const dt = data;
      const userData = dt['payload'];
      
      console.log("userCountData",userData);

      if(userData.conversations) {
        this.ToppatientlistData = userData.conversations;
      } 
      if(userData.contacts) {
        this.ToppatientlistDataContact = userData.contacts;
      }
    
      let patientIdArray = [];
      
        
        for (let key in this.ToppatientlistData) {
          let value = this.ToppatientlistData[key].patientId; 
          if(this.ToppatientlistData[key].firstName) {
            patientIdArray.push(value);
          }        
        }
      
        
        for (let key in this.ToppatientlistDataContact) {
          let value = this.ToppatientlistDataContact[key].patientId; 
          if(this.ToppatientlistDataContact[key].firstName) {
            patientIdArray.push(value);
          }
        }
       
      this.ToppatientTodayCount = patientIdArray.length;
       
   });

  }

  ngOnChanges() {
    /**********THIS FUNCTION WILL TRIGGER WHEN PARENT COMPONENT UPDATES 'someInput'**************/
    //Write your code here
     console.log("this.someInput");
    } 

}
 