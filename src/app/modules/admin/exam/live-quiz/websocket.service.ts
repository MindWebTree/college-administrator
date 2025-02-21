import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket: WebSocket;
  private messageSubject: Subject<string> = new Subject<string>();
   openSubject: Subject<void> = new Subject<void>();
  constructor() { }

  connect(url: string) {
    this.socket = new WebSocket(url);
    this.socket.onopen = () => {
      console.log('Connected to WebSocket');
      this.openSubject.next();
    };
    this.socket.onmessage = (event) => {
      // console.log(`Received message: ${event.data}`);
      this.messageSubject.next(event.data); // Emit the received message
    };
    this.socket.onerror = (event) => {
      console.error(`Error occurred: ${event}`);
    };
    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  sendMessage(message: any) {
    this.socket.send(message);
  }

  close() {
    this.socket.close();
  }

  // Function to subscribe to incoming messages
  onMessage(): Subject<string> {
    return this.messageSubject;
  }
}
