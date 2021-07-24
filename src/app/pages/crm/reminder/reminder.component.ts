import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.scss']
})
export class ReminderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
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

}
