
  import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild  } from '@angular/core';

  import { FormBuilder, Validators, FormGroup } from '@angular/forms';
  
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  
  import { Casemanagers } from './importfailurecasemanager.model';
  
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { casemanagerData } from './data';
  import { analyzeAndValidateNgModules } from '@angular/compiler';
  import { AnonymousSubject } from 'rxjs/internal/Subject';
  
  import { Subject } from 'rxjs';
  
  import 'rxjs/add/operator/map';
  
  import { DataTableDirective } from 'angular-datatables';
  
  import { NgxSpinnerService } from "ngx-spinner";

  @Component({
    selector: 'app-importfailurecasemanager',
    templateUrl: './importfailurecasemanager.component.html',
    styleUrls: ['./importfailurecasemanager.component.scss']
  })
  export class ImportfailurecasemanagerComponent implements OnInit, AfterViewInit, OnDestroy { 
  
    @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
    isDtInitialized:boolean = false;
    dtRendered = true;
    dtInstance: Promise<DataTables.Api>;
  
    data: any;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
   
   
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
  
   isLoading = false;
  
  constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private http: HttpClient,private router: Router,private spinner: NgxSpinnerService) {
  
  }
  
  BaseURL:any;
  ChatBaseURL:any;
  staffId:any;
  entityId:any;
  
  checkboxarea:any;
  inputboxarea:any;
  
  checkboxareavalue:any;
  inputboxareavalue:any;
  
  
  statusFilterData:any;
  nameFilterData:any;
  
  ngOnInit() {
    this.BaseURL = localStorage.getItem("SH360_API_URL");
    this.ChatBaseURL = localStorage.getItem("SH360_API_CHAT_URL");
  
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
    this.staffId = loginUser.sh360Id;
    this.entityId = loginUser.entityId;
  
  
    // tslint:disable-next-line: max-line-length
    this.breadCrumbItems = [{ label: 'UBold', path: '/' }, { label: 'CRM', path: '/' }, { label: 'Casemanagers', path: '/', active: true }];
    this.validationform = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phonecode: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      phone: ['',  [Validators.required, Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
    });
    this.editvalidationform = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phonecode: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      phone: ['',  [Validators.required, Validators.pattern("[0-9]{10}"), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
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
      status_pending:[''],
      inputboxareavalue:[''],
      checkboxareavalue:['']
    });
  
  
    this._fetchData();
  
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      paging:true,
      lengthChange:false,
      columns: [{
        data: 'id',
        searchable:false
      }, {
        data: 'firstName'
      }, {
        data: 'lastName'
      }, {
        data: 'status',
        searchable:false
      }, {
      }]
    };     
  
    
    this.checkboxarea=true;
    this.inputboxarea=false;
  
    
    this.checkboxareavalue=1;
    this.inputboxareavalue=0;
   
    this.statusFilterData=[];
    this.nameFilterData=[];
  
  }
   
  get form() {
    return this.validationform.controls;
  } 
  
  
  get editform() {
    return this.editvalidationform.controls;
  }
  
  openModal(content: string) {
    this.validationform.reset();
    this.errormsg = ''; 
    this.successmsg = '';
    this.submitted = false;
  
    this.ismobileEntered = false;
    this.isemailEntered = false;
  
    this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
  }
  
  /**
   * save the contacts data
   */
  
  
   
   errormsg:any;
   successmsg:any;
   confrm:any;
   conmsg:any;
   error:any;
   loading:any;
  
  saveData(Dataid='') {
    const firstName = this.validationform.get('firstname').value;
    const lastName = this.validationform.get('lastname').value;
    const phonecode = this.validationform.get('phonecode').value;
    const phone = this.validationform.get('phone').value;
    const email = this.validationform.get('email').value;
    const currentDate = new Date();
    if (this.validationform.valid) {
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
          .set('sh360_owner_id', this.staffId)
          .set('sh360_requester_id', this.staffId)
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
  
          this.openDeleteModalOkay(Dataid,Dataid,'content');
          //this.validationform.reset();
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
      
      this.ismobileEntered = true;
      this.isemailEntered = true;
  
      console.log("INVALID FORM");
      return;
    }
    this.submitted = true;
    //this.totalSize = this.contacts.length + 1;
    //this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
  }
  
  
  saveEditData(CMData) {
  
    console.log('CMData',CMData);
    const cmID = CMData.id;
    
    const firstName = this.editvalidationform.get('firstname').value;
    const lastName = this.editvalidationform.get('lastname').value;
    const phonecode = this.editvalidationform.get('phonecode').value;
    const phone = this.editvalidationform.get('phone').value;
    const email = this.editvalidationform.get('email').value;
    const currentDate = new Date();
    if (this.editvalidationform.valid) {
      console.log("VALID EDIT FORM");
  
      
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
      "id": cmID,
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
      
      this.ismobileEntered = true;
      this.isemailEntered = true;
  
      console.log("INVALID EDIT FORM");
      return;
    }
    this.submitted = true;
    //this.totalSize = this.contacts.length + 1;
    //this.paginatedContactData = this.contacts.slice(this.startIndex, this.endIndex);
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
  
    this.statusFilterData=[];
    this.nameFilterData=[];
  
    
    this._fetchData();
    this.modalService.dismissAll();
    this.filtervalidationform.reset();
  }
  
  
  filterData(){
  
    this.nameFilterData=[];
    this.statusFilterData=[];
  
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
    const status_pending = this.filtervalidationform.get('status_pending').value;
   
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
        this.statusFilterData.push('ACTIVE')
      }
      if(status_inactive==true) {
        this.statusFilterData.push('INACTIVE')
      }
      if(status_pending==true) {
        this.statusFilterData.push('INACTIVE')
      }
      
      console.log(" this.nameFilterData",this.nameFilterData);
      console.log(" this.statusFilterData",this.statusFilterData); 
      
  
      this._fetchData();
      //this.filtervalidationform.reset();
      this.modalService.dismissAll();
  }
  
  
  private _fetchData() {

    this.spinner.show();

    this.totalSize = 0;
    this.isLoading = true;
    //this.dtTrigger.unsubscribe();
    
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
  
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');
  
   var header = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization',  'Bearer '+loginUser.token)
      .set('sh360_owner_id', this.staffId)
      .set('sh360_requester_id', this.staffId)
  }

  
    
  let postDataX = {
    "name": this.nameFilterData,
    "status": this.statusFilterData,
    "entityId": this.entityId
  }

  let postData = {
    "sponsorId": this.entityId
  }
   
    let apiurl = this.BaseURL+'/admin/import/failedcasemanagers';
  
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
  
  contactInfo:any;
  
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
      .set('sh360_owner_id', this.staffId)
      .set('sh360_requester_id', this.staffId)
  }
 
   
    //console.log(this.BaseURL+'/user/casemanager');
    //let apiurl = this.BaseURL+'/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
    //let apiurl = 'http://localhost:11008/user/casemanager/details?manager='+id;
  
    //URL: localhost:11009/entity/admin/import/failedcasemanager/details?id=609926be76e93f9b44901159
    let apiurl = this.BaseURL+'/admin/import/failedcasemanager/details?id='+id;
    console.log(apiurl);
  
    this.http.get(apiurl,header).subscribe((data) => { 
      const dt = data;
      console.log(dt['payload']);
      this.contactInfo = dt['payload'];
   
      this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
    });  
  
    
  }
  
  
  ModalID:any;
  ModalSH360ID:any;
  ModalCONTENT:any;
  
  
  openDeleteModal(id,sh360id,content:string) {
  
    this.ModalID = id;
    this.ModalSH360ID = sh360id;
    this.ModalCONTENT = content;
  
    this.modalService.open(this.ModalCONTENT, { centered: true });
  
  }
  
  openDeleteModalOkay(id,sh360id,content:string) {
    this.modalService.dismissAll();
    this.submitted = false;
    console.log("ID",id);
    console.log("SH360ID",sh360id);
    console.log("openDeleteModalOkay",id);
    
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

   
    let apiurl = this.BaseURL+'/admin/import/failedcasemanager?id='+id;
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
      this._fetchData();
      //this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
    });  
  
    
  }
  
  
  openAssignModal(id,sh360id,content:string) {
    this.submitted = false;
    console.log("ID",id);
    console.log("SH360ID",sh360id);
  
    this.router.navigate(['/crm/assignpatient/'+sh360id]);
  
    /*
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
   const headers = new HttpHeaders;
   headers.append('Content-Type', 'application/json');
  
   var header = {
    headers: new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization',  'Bearer '+loginUser.token)
  } 
   
    let apiurl = this.BaseURL+'/admin/staff?id='+id;
    console.log(apiurl);
  
    this.http.delete(apiurl,header).subscribe((data) => { 
      const dt = data;
      console.log(dt['payload']);
      this.contactInfo = dt['payload'];
   
      this._fetchData();
      //this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
    });  
  
    */
    
  }
  
  openRefreshModal(content:string) {
  
    
    this.nameFilterData=[];
    this.statusFilterData=[];
    
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
  
