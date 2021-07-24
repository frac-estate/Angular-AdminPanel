import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CookieService } from '../../../core/services/cookie.service';

import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-contactsupport',
  templateUrl: './contactsupport.component.html',
  styleUrls: ['./contactsupport.component.scss']
}) 

export class ContactsupportComponent implements OnInit, AfterViewInit {

  BaseURL = '';

  contactSupportForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  success = '';
  loading = false;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
              private authenticationService: AuthenticationService, private http: HttpClient, private cookieService: CookieService, private location: LocationStrategy) {

                 // preventing back button in browser implemented by "Samba Siva"  
                 history.pushState(null, null, window.location.href);  
                 this.location.onPopState(() => {
                   history.pushState(null, null, window.location.href);
                 });  

               }

  ngOnInit() {
 
    this.BaseURL = localStorage.getItem("SH360_API_URL");

    this.contactSupportForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      about: ['', Validators.required],
      message: ['', Validators.required],
    });
 
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
  }

  get f() { return this.contactSupportForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.success = '';
    if (this.contactSupportForm.invalid) { 
      return;
    }
    else
    {
      this.loading = true;

 
      const headers = new HttpHeaders;
      headers.append('Content-Type', 'application/json');
  
      let postData = {
        "email": this.f.email.value,
        "category": this.f.about.value,
        "query": this.f.message.value
      };


      let apiurl = this.BaseURL+'/admin/query';
      
    
    this.http.post(apiurl, postData, { headers: headers })
    .subscribe(
      data => {
        
        const dt = data;
        console.log('dt',dt)
       if(dt['payload']){
         console.log('payload', dt['payload']);
         const loginUser = dt['payload']; 
         this.success = dt['message']+' Your reference no is: '+dt['payload'];
         this.contactSupportForm.reset();
         //this.router.navigate(['/account/verify']);
 
         this.loading = false;
         this.submitted = false;
       }
       else
       {
        this.error = 'Invalid Login';
        this.error = dt['message'];
        
        this.loading = false;
       }

        return false;
      },
      error => {
        this.error = error;
        this.loading = false;
      }
    );

    }
 
    this.loading = true;
      
  }
}

