import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productedit',
  templateUrl: './productedit.component.html',
  styleUrls: ['./productedit.component.scss']
})

/**
 * Product-edit component - handling the edit-product with sidebar and content
 */
export class ProducteditComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.breadCrumbItems = [{ label: 'SH360', path: '/' }, { label: 'Activation Code', path: '/' }, { label: 'Generate Code', path: '/', active: true }];
  }


}
