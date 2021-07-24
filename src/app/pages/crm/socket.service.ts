import { Injectable  } from '@angular/core';
import { io } from 'socket-io-sh-client'

//import { io } from 'socket.io-client';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: any;

  loginUser: any;

  SocketBaseURL: any;

  private seeallresultComponentSource = new Subject<boolean>();
  SeeallresultComponent$ = this.seeallresultComponentSource.asObservable();

  constructor() { 

    this.loginUser = JSON.parse(localStorage.getItem("loginUser"));
    console.log("this.loginUser",this.loginUser);
    this.SocketBaseURL = localStorage.getItem("SH360_API_SOCKET_URL");
    console.log("this.SocketBaseURL",this.SocketBaseURL);
    this.socket = io(this.SocketBaseURL, {
      path: '/cm/socket'
    });
    /*
    this.socket = io('http://3.94.31.236:11008', {
      path: '/cm/socket'
    });
    */

   /* 
   this.socket.connect();
   this.socket.disconnect();
   this.socket.off();
   */ 
  

  }

  letcounter: any = 1;
  
  setup() {​​​​​​​​
    
    this.socket.off('staff_join_response');
    this.socket.off('staff_contacts_response');
    this.socket.off('staff_contacts_message');
    this.socket.off('staff_chat_room_response');
    this.socket.off('staff_send_message_response');
    this.socket.off('staff_receive_message');
    this.socket.off('staff_acknowledge_response');
    

    this.socket.emit('staff_join', {​​​​​​​​'userId' :this.loginUser.sh360Id}​​​​​​​​);
    
    this.socket.on('staff_join_response', (msg: any) => {​​​​​​​​
      console.log('staff_join_response',msg);
    }​​​​​​​​);

    this.socket.on('staff_contacts_response', (msg: any) => {
      console.log('staff_contacts_response',msg);
    });
    
    this.socket.on('staff_contacts_message', (msg: any) => {
      console.log('staff_contacts_message',msg);
      this.seeallresultComponentSource.next(null);
    });

    this.socket.on('staff_chat_room_response', (msg: any) => {
      console.log('staff_chat_room_response',msg);
    });

    this.socket.on('staff_send_message_response', (msg: any) => {
      console.log('staff_send_message_response',msg);
    });

    this.socket.on('staff_receive_message', (msg: any) => {
      console.log('staff_receive_message',msg);
      console.log('SenderID',msg.sender);
      this.seeallresultComponentSource.next(msg);
      //this.seeallresultComponent.showChatBox(msg.sender);
    });

    this.socket.on('staff_acknowledge_response', (msg: any) => {
      console.log('staff_acknowledge_response',msg);
    });

    this.socket.on('disconnect', () => {​​​​​​​​
      console.log('staff_disconnect_and_connect');
      this.setup();
    }​​​​​​​​);
    
    }​​​​​​​​

      staffJoin(){
        this.socket.emit('staff_join', {​​​​​​​​'userId' :this.loginUser.sh360Id}​​​​​​​​);
      }

      staffClose(){
        console.log('staffClose - this.socket.disconnect()');
        this.socket.disconnect();
      }


      staffContact(data){
        this.socket.emit('staff_contacts', {'userId' : this.loginUser.sh360Id});
      }

      staffChatRoom(data){
        //this.socket.emit('staff_chat_room', {'userId' : this.loginUser.sh360Id});
        this.socket.emit('staff_chat_room', {'userId' : this.loginUser.sh360Id,'patientId':data});
      }

      sendMessage(data){
        this.socket.emit('staff_send_message', data);
       }

       receiveMessage(){    
        this.socket.on('staff_receive_message_response', (msg: any) => {
          console.log('staff_receive_message_response',msg);
        });
       }

       sendAcknowledge(data){
         console.log("sendAcknowledge",data);
        this.socket.emit('staff_acknowledge', data);
       }

  /*
  setup() {
    this.socket = io('http://3.94.31.236:11008', {
      path: '/cm/socket'
    });

    let counter: any = 1;
    setInterval(() => {
      this.socket.emit('message', 'hello'+counter);
      counter++;
    }, 1000);
    this.socket.on('my message', (msg: any) => {
      console.log('my msg: '+ msg);
    });
  }
  */
 
}
