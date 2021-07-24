import { Injectable, Output, EventEmitter } from '@angular/core';

import {  HttpErrorResponse } from '@angular/common/http';

import { throwError,  BehaviorSubject } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { get } from 'lodash';

@Injectable({
 providedIn: 'root'
})
export class ProfileService {

    constructor() { }

 //getbidId
 //selectedPics = new BehaviorSubject<any>('')
 //currentPicsId = this.selectedPics.asObservable();

 @Output() selectedPics = new EventEmitter<any[]>();


 setPictures(id: any)
 {
    console.log("IDIDID",id);
   //this.selectedPics.next(id)
   this.selectedPics.emit(id)
 }

 private readonly libraryLists = new BehaviorSubject<any[]>([])
 readonly libraries$ = this.libraryLists.asObservable()

  // Project getter and setter
  get libraries(): any[] {
   return this.libraryLists.getValue();
 }
 set libraries(val: any[]) {
   this.libraryLists.next(val);
 }

}
 