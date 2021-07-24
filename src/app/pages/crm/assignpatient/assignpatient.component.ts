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
  selector: 'app-assignpatient',
  templateUrl: './assignpatient.component.html',
  styleUrls: ['./assignpatient.component.scss']
})
export class AssignpatientComponent implements OnInit {

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
contacts: any = [];
cmpatient: any = [];
cmstaff: any;
cmmapped: any = [];

  validationform: FormGroup;

  filtervalidationform: FormGroup;

  teamplayerList: any[] = [];

  constructor(private modalService: NgbModal, public formBuilder: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private router: Router, ) {

  }

isLoading = false;
  
checkboxarea:any;
inputboxarea:any;

checkboxareavalue:any;
inputboxareavalue:any;
 
nameFilterData:any = [];
  
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
  this._fetchData();
  
  
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
    inputboxareavalue:[''],
    checkboxareavalue:['']
  });

  
  this.checkboxarea=true;
  this.inputboxarea=false;

  
  this.checkboxareavalue=1;
  this.inputboxareavalue=0;
 
  //this.nameFilterData=[];


  //$('#patients').multiSelect();
}



filterclearData(){
   
  this.nameFilterData=[];

  this._fetchDataFilterClear();
  this.modalService.dismissAll();
  this.filtervalidationform.reset();
}

filterData(){
  
  this.cmstaff=[];
  this.cmpatient=[];
  this.cmmapped=[];


  //this.nameFilterData=[]; 

  const alphainputbox = this.filtervalidationform.get('alphainputbox').value;
  
  
  const alphselectbox1 = this.filtervalidationform.get('alphselectbox1').value;
  const alphselectbox2 = this.filtervalidationform.get('alphselectbox2').value;
  const alphselectbox3 = this.filtervalidationform.get('alphselectbox3').value;
  const alphselectbox4 = this.filtervalidationform.get('alphselectbox4').value;
  const alphselectbox5 = this.filtervalidationform.get('alphselectbox5').value;
  const alphselectbox6 = this.filtervalidationform.get('alphselectbox6').value;
  const alphselectbox7 = this.filtervalidationform.get('alphselectbox7').value;
  const alphselectbox8 = this.filtervalidationform.get('alphselectbox8').value;
  
   
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

    console.log(" this.nameFilterData",this.nameFilterData); 
    

    this.cmstaff=[];
    this.cmpatient=[];
    this.cmmapped=[];

    this.cmmapped.selectedItems = [];

    this._fetchDataFilter();
    this.cmmapped=[];
    //this.filtervalidationform.reset();
    this.modalService.dismissAll();
    
  //this.ngOnInit();
}

private _fetchDataFilterClear() {
  console.log("_fetchDataFilter");
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
  "staffId": this.cmID, 
}
  //console.log(this.BaseURL+'/user/casemanager');
  //let apiurl = this.BaseURL+'/admin/staffs?entityId='+this.entityId;
  //let apiurl = 'http://localhost:11008/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
  //http://34.200.217.47:11009/entity/admin/associated/patients?staffId=0a67a2a3-de83-4a36-bdb7-720380087df9

 
  let apiurl = this.BaseURL+'/admin/associated/patients';
  console.log(apiurl);

  
  this.http.post(apiurl,postData,header).subscribe((data) => {

    const dt = data;
    console.log(dt['payload']);
    const payload =  dt['payload'];

    if(payload.staff && payload.staff.length>0) {
      this.cmstaff = dt['payload'].staff;
      console.log(this.cmstaff);
    }
    
    this.cmstaff = dt['payload'].staff;
    if(payload.mapped && payload.mapped.length>0) {
      this.cmmapped = dt['payload'].mapped;
      console.log(this.cmmapped);
    }
    

    if(payload.patients && payload.patients.length>0) {
      this.contacts = dt['payload'].patients;
      console.log(this.contacts);

      let CMcontactsArray = dt['payload'].patients;

      this.cmpatient = [];

      CMcontactsArray.forEach(element => {

        //console.log('element',element);
        var assignedText='';
        if(element.staffId && element.staffId!='') {
          assignedText='  ( ASSIGNED) ';
        } else {
          assignedText='';
        }


          let elementNew = {
            "id": element.id,
            "sh360Id": element.sh360Id,
            "firstName": element.firstName,
            "lastName": element.lastName,
            "fullName": element.firstName+' '+element.lastName+' '+assignedText,
            "selected": true,
          };

          /*          
          let patientsArray = this.validationform.get('patients').value;
          console.log("patientsArray",patientsArray);
          if(patientsArray && patientsArray.length>0) {
            if(patientsArray.indexOf(element.sh360Id) == -1) {
            this.cmpatient.push(elementNew);
            }
          } else {
            this.cmpatient.push(elementNew);
          }
          */

          if(this.Dualselected==false) {
            let patientsArray = this.validationform.get('patients').value;
            console.log("patientsArray",patientsArray);
            if(patientsArray && patientsArray.length>0) {
              if(patientsArray.indexOf(element.sh360Id) == -1) {
              this.cmpatient.push(elementNew);
              }
            } else {
              this.cmpatient.push(elementNew);
            }
          }

          if(this.Dualselected==true) {
            if(this.DualselectedArray && this.DualselectedArray.length>0) {
              if(this.DualselectedArray.indexOf(element.sh360Id) == -1) {
                this.cmpatient.push(elementNew);
                }
            } else {
              this.cmpatient.push(elementNew);
            }
          }
  
        //console.log('elementNew',elementNew);

        /* 
        if(payload.mapped && payload.mapped.length>0) {
          if(this.cmmapped.indexOf(element.sh360Id)==-1) {
            this.cmpatient.push(elementNew);
          }
        }
        */

        $("ng2-dual-list-box input.form-control").attr("placeholder", "Search");
  
       });

    }
    
    
    //$('#patients').multiSelect('refresh');

    this.isLoading = false;
    
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

private _fetchDataFilter() {
  console.log("_fetchDataFilter");
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
  "staffId": this.cmID, 
}
  //console.log(this.BaseURL+'/user/casemanager');
  //let apiurl = this.BaseURL+'/admin/staffs?entityId='+this.entityId;
  //let apiurl = 'http://localhost:11008/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
  //http://34.200.217.47:11009/entity/admin/associated/patients?staffId=0a67a2a3-de83-4a36-bdb7-720380087df9

 
  let apiurl = this.BaseURL+'/admin/associated/patients';
  console.log(apiurl);

  
  this.http.post(apiurl,postData,header).subscribe((data) => {

    const dt = data;
    console.log(dt['payload']);
    const payload =  dt['payload'];

    if(payload.staff && payload.staff.length>0) {
      this.cmstaff = dt['payload'].staff;
      console.log(this.cmstaff);
    }
    
    this.cmstaff = dt['payload'].staff;
    if(payload.mapped && payload.mapped.length>0) {
      this.cmmapped = dt['payload'].mapped;
      console.log(this.cmmapped);
    }
    

    if(payload.patients && payload.patients.length>0) {
      this.contacts = dt['payload'].patients;
      console.log(this.contacts);

      let CMcontactsArray = dt['payload'].patients;

      this.cmpatient = [];

      CMcontactsArray.forEach(element => {

        //console.log('element',element);
        var assignedText='';
        if(element.staffId && element.staffId!='') {
          assignedText='  ( ASSIGNED) ';
        } else {
          assignedText='';
        }


          let elementNew = {
            "id": element.id,
            "sh360Id": element.sh360Id,
            "firstName": element.firstName,
            "lastName": element.lastName,
            "fullName": element.firstName+' '+element.lastName+' '+assignedText,
            "selected": true,
          };

          /*
          if(payload.mapped && payload.mapped.length>0) {
            if(this.cmmapped.indexOf(element.sh360Id) == -1) {
              this.cmpatient.push(elementNew);
              }
          } else {
            this.cmpatient.push(elementNew);
          }
          */
          if(this.Dualselected==false) {
            if(payload.mapped && payload.mapped.length>0) {
              if(this.cmmapped.indexOf(element.sh360Id) == -1) {
                this.cmpatient.push(elementNew);
                }
            } else {
              this.cmpatient.push(elementNew);
            }
          }
          
          
          if(this.Dualselected==true) {
            if(this.DualselectedArray && this.DualselectedArray.length>0) {
              if(this.DualselectedArray.indexOf(element.sh360Id) == -1) {
                this.cmpatient.push(elementNew);
                }
            } else {
              this.cmpatient.push(elementNew);
            }
          }
          
           
        /*  
          let patientsArray = this.validationform.get('patients').value;
          console.log("patientsArray",patientsArray);
        //console.log('elementNew',elementNew);
        */
         
        /* 
        if(payload.mapped && payload.mapped.length>0) {
          if(this.cmmapped.indexOf(element.sh360Id)==-1) {
            this.cmpatient.push(elementNew);
          }
        }
        */

        $("ng2-dual-list-box input.form-control").attr("placeholder", "Search");
  
       });

    }
    
    
    //$('#patients').multiSelect('refresh');

    this.isLoading = false;
    
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

private _fetchData() {

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
  "staffId": this.cmID, 
}
  //console.log(this.BaseURL+'/user/casemanager');
  //let apiurl = this.BaseURL+'/admin/staffs?entityId='+this.entityId;
  //let apiurl = 'http://localhost:11008/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
  //http://34.200.217.47:11009/entity/admin/associated/patients?staffId=0a67a2a3-de83-4a36-bdb7-720380087df9

 
  let apiurl = this.BaseURL+'/admin/associated/patients';
  console.log(apiurl);

  
  this.http.post(apiurl,postData,header).subscribe((data) => {

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
        var assignedText='';
        if(element.staffId && element.staffId!='') {
          assignedText='  ( ASSIGNED) ';
        } else {
          assignedText='';
        }

        let elementNew = {
          "id": element.id,
          "sh360Id": element.sh360Id,
          "firstName": element.firstName,
          "lastName": element.lastName,
          "fullName": element.firstName+' '+element.lastName+' '+assignedText,
          "selected": true,
      };
  
        //console.log('elementNew',elementNew);

        this.cmpatient.push(elementNew);

        $("ng2-dual-list-box input.form-control").attr("placeholder", "Search");
  
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

    this.isLoading = false;
    
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



private _fetchDataX() {
  
  /*
  this.totalSize = 0;
  this.isLoading = true;

  this.cmstaff=[];
  this.cmpatient=[];
  this.cmmapped=[];
  */

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
  "staffId": this.cmID, 
}
  //console.log(this.BaseURL+'/user/casemanager');
  //let apiurl = this.BaseURL+'/admin/staffs?entityId='+this.entityId;
  //let apiurl = 'http://localhost:11008/user/casemanagers?entity=5fda3b4776d5d545a8934d8a';
  //http://34.200.217.47:11009/entity/admin/associated/patients?staffId=0a67a2a3-de83-4a36-bdb7-720380087df9

  //let apiurl = this.BaseURL+'/admin/associated/patients?staffId='+this.cmID;

  //let apiurlX = this.BaseURL+'/admin/associated/patients';
  //this.http.post(apiurl,postData,header).subscribe((data) => { });

  //let apiurl = 'http://18.213.144.230:11009/entity/admin/associated/patients?staffId=fdd3bd56-4ffc-464c-a207-042e1176b94f';
  //this.http.get(apiurl,header).subscribe((data) => { });

  let apiurl = this.BaseURL+'/admin/associated/patients';
  console.log(apiurl);

  
    this.http.post(apiurl,postData,header).subscribe((data) => {
    const dt = data;
    //console.log("payload",dt['payload']);
    
    const payload =  dt['payload'];

    console.log("payload.patients.length",payload.patients.length);
    console.log("payload.staff.length",payload.staff.length);
    console.log("payload.mapped.length",payload.mapped.length);
    

    if(payload.patients && payload.patients.length>0) {
      this.contacts = dt['payload'].patients;
      //console.log(this.contacts);

      let CMcontactsArray = dt['payload'].patients;

      
      CMcontactsArray.forEach(element => {

        //console.log('element',element);
        var assignedText='';
        if(element.staffId && element.staffId!='') {
          assignedText='  ( ASSIGNED) ';
        } else {
          assignedText='';
        }

        let elementNew = {
          "id": element.id,
          "sh360Id": element.sh360Id,
          "firstName": element.firstName,
          "lastName": element.lastName,
          "fullName": element.firstName+' '+element.lastName+' '+assignedText,
          "selected": true,
      };
  
        //console.log('elementNew',elementNew);

        this.cmpatient.push(elementNew);
  
       });

     
    }

    this.cmstaff = dt['payload'].staff;
    console.log("cmstaff",this.cmstaff); 
    if(payload.staff && payload.staff.length>0) {
      this.cmstaff = dt['payload'].staff;
      console.log("cmstaff",this.cmstaff); 
    }
    
    if(payload.mapped && payload.mapped.length>0) {
      this.cmmapped = dt['payload'].mapped;
      console.log("cmmapped",this.cmmapped);
    }

    /*
    this.cmpatient.push( { "id": "6058445d4a8f433f61b55aaa", "sh360Id": "1a15d817-908d-485b-b2bf-4e8142d559f9", "firstName": "Alagiri", "lastName": "Vimal", "staffId": "162a4f79-e87d-45e5-854f-401af5d40a4b","selected": true,"fullName":"Alagiri Vimal" });
    this.cmpatient.push( { "id": "6058ae4e3ac891665457eda8", "sh360Id": "286c536f-1976-4174-9a36-38c45aa4a6af", "firstName": "Raj", "lastName": "Mm", "staffId": "162a4f79-e87d-45e5-854f-401af5d40a4b","selected": true,"fullName":"Raj Mm" });
    console.log("cmpatient", this.cmpatient);
    */
    this.isLoading = false;
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
 
 saveData() {
  this.successmsg =  ''; 
  this.errormsg =  '';  

   const patients = this.validationform.get('patients').value;
   const currentDate = new Date();
   
   console.log('patients',patients);

   if (this.validationform.valid) {
     console.log("VALID FORM");
 
    
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
     "staffId": this.cmID,
     "patients": patients
 }
 
    console.log('postData',postData);
 

    let apiurl = this.BaseURL+'/admin/associate/patients'; 

     this.http.post(apiurl, postData, header )
     .subscribe(
       data => {
         console.log('SUCCESS ON CHANGE')
         const dt = data;
         console.log(dt);
         
       
        if(dt['payload']){

          this.errormsg = ''; 
          this.successmsg =  dt['message']; 
          this.successmsg =  'Successfully updated'; 
          this.submitted = false;
         
        }
        else
        {
 
          console.log(dt['payload']);
          this.successmsg =  ''; 
          this.errormsg =  dt['message'];  

          this.submitted = false;
 
         //this.validationform.reset();
         //this.modalService.dismissAll();   
         //this._fetchData();
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
   
     //this._fetchData();
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

 
openModal(content: string) {
  
  this.validationform.reset();
  this.submitted = false;
  
  this.errormsg = ''; 
  this.successmsg = '';

  this.modalService.open(content, { centered: true, backdrop : 'static', keyboard : false });
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

Dualselected = false;
DualselectedArray:any=[];
log(e:any){
  this.Dualselected = true;
  let eSel = e.selected;
  eSel.forEach(elv => {
    this.DualselectedArray.push(elv.value);
  });
  console.log("LOG Array",this.DualselectedArray);
  
}

}
