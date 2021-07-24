import { Component,HostListener,ViewChild,TemplateRef,ElementRef } from '@angular/core';

import {EventTargetInterruptSource, Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router'; 

import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ubold',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  
  @ViewChild("sessionoutmessage", {static: false}) modalContent: TemplateRef<any>;

 
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.reset();
    console.log("INPUT EVENT");
  }
 
  @HostListener('mouseenter')
  mouseenter() {
    this.reset();
  }

  @HostListener('mouseover')
  mouseover() {
    this.reset();
  }

  @HostListener('mouseout')
  mouseout() {
    this.reset();
  }
 

  @HostListener("window:beforeunload",["$event"])
  clearLocalStorage(event){
    console.log("1:event",event);
    //localStorage.clear();
  }  
  
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(private element: ElementRef,private idle: Idle, private keepalive: Keepalive, private modalService: NgbModal, private router: Router,private spinner: NgxSpinnerService) {
   
       // sets an idle timeout of 5 seconds, for testing purposes. 900 - 1770
       idle.setIdle(1770);
       // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out. 60
       idle.setTimeout(30);
       // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
       //idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

       idle.setInterrupts([
        new EventTargetInterruptSource(
          this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);
   
   
       idle.onTimeout.subscribe(() => {
         this.idleState = 'Timed out!';
         this.idleState = 'Your current session has been expired and you have been logged out. Please login again to continue.';
         this.timedOut = true;
         //this.logout();
         //this.logoutAuto(this.modalContent);
        localStorage.removeItem('loginUser');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('forgotloginUser');
        
    //this.authService.logout();
        this.router.navigate(['/account/login']);
        //location.reload();   
       });
       idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
       idle.onTimeoutWarning.subscribe((countdown) => {
         
        this.idleState = 'Your session will be expired in ' + countdown + ' seconds.';
        this.idleState = 'Logout due to idle time. Do you want to continue the session?';
        this.modalService.dismissAll();
        //this.modalService.open(this.modalContent, { centered: true });
        this.modalService.open(this.modalContent, { centered: true, backdrop : 'static', keyboard : false });
      });
   
       // sets the ping interval to 15 seconds
       keepalive.interval(5);
   
       keepalive.onPing.subscribe(() => this.lastPing = new Date());
   
       this.reset();
      /*
       this.spinner.show();
       setTimeout(() => {
        this.spinner.hide();
      }, 5000);
      */
  }

  
   
  reset() {
    let loginUser = localStorage.getItem("loginUser");
    
    if(loginUser){
      let loginUser = JSON.parse(localStorage.getItem("loginUser"));
      //console.log('RESET TIME');
      this.idle.watch();
      //this.idleState = 'Started.';
      this.timedOut = false;
      //this.logout();
    } else {
      /*
      console.log('RESET TIME');
      this.idle.watch();
      this.idleState = 'Started.';
      this.timedOut = false;
      */
    }
  }

  
  logout() {
        this.resetTimeOut();
        localStorage.removeItem('loginUser');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('forgotloginUser');
        this.router.navigate(['/account/login']);
        this.modalService.dismissAll();
  }
 
  resetTimeOut() {
    this.idle.stop();
    //this.idle.onIdleStart.unsubscribe();
   // this.idle.onTimeoutWarning.unsubscribe();
    //this.idle.onIdleEnd.unsubscribe(); 
  }
  

}