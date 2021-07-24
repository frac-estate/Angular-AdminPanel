

  
  import { Component, OnInit } from '@angular/core';

  import { FormBuilder, Validators, FormGroup } from '@angular/forms';
  
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  
  import { HttpClient, HttpHeaders } from '@angular/common/http';
   
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { analyzeAndValidateNgModules } from '@angular/compiler';
  import { AnonymousSubject } from 'rxjs/internal/Subject';
  
  //declare var $: any;
  //declare var jQuery: any;
  
  @Component({
    selector: 'app-importpatient',
    templateUrl: './importpatient.component.html',
    styleUrls: ['./importpatient.component.scss']
  })
  export class ImportpatientComponent implements OnInit {
  
    breadCrumbItems: Array<{}>;
    BaseURL:any;
    ChatBaseURL:any;
    staffId:any;
    entityId:any;
    cmID:any;
    
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
  
  paginatedContactData: any;
  contacts: any;
  cmpatient: any;
  cmstaff: any;
  cmmapped: any;
  
    validationform: FormGroup;
  
    teamplayerList: any[] = [];
  
    constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, ) {
  
    }
    
  ngOnInit() {
    this.BaseURL = localStorage.getItem("SH360_API_URL");
    this.ChatBaseURL = localStorage.getItem("SH360_API_CHAT_URL");
  
    this.cmID = this.route.snapshot.paramMap.get('cmID');
  
    let loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log(loginUser);
  
    this.staffId = loginUser.sh360Id;
    this.entityId = loginUser.entityId;
  
  
    // tslint:disable-next-line: max-line-length
    this.breadCrumbItems = [{ label: 'UBold', path: '/' }, { label: 'CRM', path: '/' }, { label: 'Casemanagers', path: '/', active: true }];
    
    this.validationform = this.formBuilder.group({
      patients: [null],
    });
    //this._fetchData();
    
  
    //$('#patients').multiSelect();
  }
  
  
  private _fetchData() {
  
    
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
    //let apiurl = this.BaseURL+'/admin/staffs?entityId='+this.entityId;
    //let apiurl = 'http://localhost:11008/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
    //http://34.200.217.47:11009/entity/admin/associated/patients?staffId=0a67a2a3-de83-4a36-bdb7-720380087df9
  
    let apiurl = this.BaseURL+'/admin/associated/patients?staffId='+this.cmID;
  
    console.log(apiurl);
  
    this.http.get(apiurl,header).subscribe((data) => { 
      const dt = data;
      console.log(dt['payload']);
      const payload =  dt['payload'];
  
      if(payload.patients && payload.patients.length>0) {
        this.contacts = dt['payload'].patients;
        console.log(this.contacts);
  
        let CMcontactsArray = dt['payload'].patients;
  
        this.cmpatient = [];
  
        CMcontactsArray.forEach(element => {
  
          //console.log('element',element);
    
          let elementNew = {
            "id": element.id,
            "sh360Id": element.sh360Id,
            "firstName": element.firstName,
            "lastName": element.lastName,
            "fullName": element.firstName+' '+element.lastName,
            "selected": true
        };
    
          //console.log('elementNew',elementNew);
  
          this.cmpatient.push(elementNew);
    
         });
  
      }
      if(payload.staff && payload.staff.length>0) {
        this.cmstaff = dt['payload'].staff;
        console.log(this.cmstaff);
      }
      
      this.cmstaff = dt['payload'].staff;
      if(payload.mapped && payload.mapped.length>0) {
        this.cmmapped = dt['payload'].mapped;
        console.log(this.cmmapped);
      }
      
      
      //$('#patients').multiSelect('refresh');
      
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
  
  
  
  get form() {
    return this.validationform.controls;
  } 
  
  choosenPatientsArr:any;
  choosenPatients:any;
  
  onPatientChange(event: any, form) {}
  
  onPatientChangeXXX(event: any, form) {
    console.log("event",event);
  
    this.choosenPatientsArr = [];
    if (event.type === "focus") {
      console.log("FOCUS");
    }
    if (event.length !== 0 && event.type !== "focus") {
      event.forEach((patientinfo: any) => {
        console.log("patientinfo",patientinfo);
        this.choosenPatientsArr.push(patientinfo.id);
      });
      console.log("choosenPatientsArr", this.choosenPatientsArr);
      this.choosenPatients = this.choosenPatientsArr;
      //this.getPlayerList(this.choosenPlayers);
    } else if (event.type !== "focus" && event.length === 0) {
      console.log('----empty patients----')
      /*this.playerArr.removeAt(0);
      form.patchValue({
        player_select: null
      })*/      
      this.choosenPatients = [];
      //this.getPlayerList(this.choosenPlayers);
    }
  
  }
  
    errormsg:any;
    successmsg:any;
    confrm:any;
    conmsg:any;
    error:any;
    loading:any;
    duplicatemsg:any=false;
   
    saveData() {
      console.log('FILE UPDALOAD');
       
       this.successmsg =  ''; 
       this.errormsg =  '';  
       this.duplicatemsg = false;
       
        const patients = this.validationform.get('patients').value;
        const currentDate = new Date();
        console.log('patients',patients);
        if(patients==null || patients=='') { this.errormsg =  'Please choose a file to upload'; return; }
 /*
        var allowedExtensions = /(\.xls|\.xlsx)$/i;
  
      if (!allowedExtensions.exec(patients)) {
          alert('Invalid file type'); 
          return;
      } */
  
      if (this.validationform.valid) {
        console.log("VALID FORM");
    
       
        let loginUser = JSON.parse(localStorage.getItem("loginUser"));
         
        var header = {
          headers: new HttpHeaders()
          .set('Content-Type', 'multipart/form-data')
          .set('Authorization',  'Bearer '+loginUser.token)
          .set('sh360_owner_id', this.staffId)
          .set('sh360_requester_id', this.staffId)
        }
      
        
      let postData = {
        "patients": patients[0]
    }
    
       console.log('postData',postData);
     
          
       var header = {
         headers: new HttpHeaders()
         .set('Authorization',  'Bearer '+loginUser.token)
         .set('sh360_owner_id', this.staffId)
         .set('sh360_requester_id', this.staffId)
      }
     
 
       const formData = new FormData();
       formData.append('patients', patients[0]);
       formData.append('sponsorId', this.entityId);
       
       console.log('formData',formData);
  
       
       //let apiurl = this.BaseURL+'/admin/import/patients?entityId='+this.entityId; 
       //let apiurl = this.BaseURL+'/admin/import/patients?sponsorId='+this.entityId; 
       let apiurl = this.BaseURL+'/admin/import/patients/xlsx?sponsorId='+this.entityId;

        this.http.post(apiurl, formData, header )
        .subscribe(
          data => {
            console.log('SUCCESS ON CHANGE')
            const dt = data;
            console.log(dt);
            
            this.successmsg =  'Patient successfully imported'; 
        
           if(dt['payload']){
    
             this.errormsg = '';  
             this.successmsg =  'Patient successfully imported'; 
             this.submitted = false;

             /*
             {"result":1,"message":"SUCCESS","dateTime":"2021-05-25T17:00:00.932Z","httpCode":200,
             "payload":{"successRecordCount":0,"errorRecordCount":8,"duplicateCount":7}}
              */

             if(dt['payload'].errorRecordCount==0) {
            
              this.successmsg =  'Patient successfully imported'; 
              this.errormsg = ''; 
 
             } else if(dt['payload'].successRecordCount==0 && dt['payload'].duplicateCount==0) {
             
              this.successmsg =  ''; 
              this.errormsg = 'All the Patient have invalid/duplicate records, please click the import failure button to fix them manually.';
              this.errormsg = 'There are errors in the data imported. You can check and fix the errors <a href="javascript:void(0);" routerLink="/crm/importfailurecasemanager" >here</a>.';
              this.errormsg = 1;
             } else if(dt['payload'].successRecordCount!=0 && dt['payload'].errorRecordCount!=0 && dt['payload'].duplicateCount==0) {
 
              this.successmsg =  ''; 
              this.errormsg = 'Patient successfully imported. Some Patient have invalid/duplicate records, please click the import failure button to fix them manually.';
              this.errormsg = 'There are errors in the data imported. You can check and fix the errors <a href="javascript:void(0);" routerLink="/crm/importfailurecasemanager" >here</a>.';
              this.errormsg = 1;
             } else if(dt['payload'].errorRecordCount!=0 && dt['payload'].duplicateCount==dt['payload'].errorRecordCount) {
              this.successmsg =  ''; 
              this.errormsg = 2;
             }
             
             else if(dt['payload'].successRecordCount!=0 && dt['payload'].errorRecordCount!=0 && dt['payload'].duplicateCount!=0) {
 
               this.successmsg =  ''; 
               this.errormsg = 'Patient successfully imported. Some Patient have invalid/duplicate records, please click the import failure button to fix them manually.';
              this.errormsg = 'There are errors in the data imported. You can check and fix the errors <a href="javascript:void(0);" routerLink="/crm/importfailurecasemanager" >here</a>.';
               this.errormsg = 1;
 
             } else if(dt['payload'].successRecordCount==0 && dt['payload'].errorRecordCount!=0 && dt['payload'].duplicateCount!=0) {
               this.successmsg =  ''; 
               this.errormsg = 'Patient successfully imported. Some Patient have invalid/duplicate records, please click the import failure button to fix them manually.';
              this.errormsg = 'There are errors in the data imported. You can check and fix the errors <a href="javascript:void(0);" routerLink="/crm/importfailurecasemanager" >here</a>.';
               this.errormsg = 1;
 
            } 

            if(dt['payload'].duplicateCount!=0){
              this.duplicatemsg = true;
            } else {
              this.duplicatemsg = false;
            }
            
           }
           else
           {
    
             console.log(dt['payload']);
             this.successmsg =  ''; 
             this.errormsg =  'Patient import file issues'; 
             this.submitted = false;
    
            //this.validationform.reset();
            //this.modalService.dismissAll();   
            //this._fetchData();
           }
           
           this.validationform.reset();
            
            return false;
          },
          error => {
            console.log('ERROR ON SAVE')
            this.errormsg = error;
            this.successmsg = '';
            this.error = error;
            this.loading = false;
            
            this.errormsg =  'Please upload .xlsx file (other formats are not allowed).'; 

            /*
           this.errormsg = 'One or more errors were found while uploading the file, please check the below and upload it again \n'+
           '1. Make sure all the mandatory fields are filled for all the records. \n'+
           '2. Make sure file or column names are not edited \n'+
           '3. Make sure the file format is .xsl or .xlsx (other formats are not allowed). \n'+
           '4. Make sure no duplicate records present. \n';
           */

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
    
  
   backtocasemanager(){
    this.router.navigate(['/crm/casemanagers']);
   }
  
   backtopatient(){
    this.router.navigate(['/crm/patients']);
   }

  }
  