import { Injectable } from "@angular/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { DataGuardService } from "app/core/auth/data.guard";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";

// signalr.service.ts
@Injectable({ providedIn: 'root' })
export class SignalRService {
  private _hubConnection!: HubConnection;
  private _connection = new BehaviorSubject<HubConnection | null>(null);
  public connection$ = this._connection.asObservable();

  constructor(private dataService: DataGuardService) {}

  public connect(): Promise<boolean> {
    const existingConnection = this._connection.getValue();

    if (existingConnection && existingConnection.state === 'Connected') {
      console.log('SignalR already connected');
      return Promise.resolve(true);
    }

    const token = this.dataService.getLocalData('accessToken');
    const cleanedToken = token?.replace(/^"|"$/g, '');

    this._hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.externalApiURL}/chathub`, {
        accessTokenFactory: () => cleanedToken || '',
      })
      .withAutomaticReconnect()
      .build();

    this._hubConnection.on('MessageReceived', (message) => {
      console.log('Received:', message);
      // You can emit it to other components here via a Subject
    });

    return this._hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
        this._connection.next(this._hubConnection);
        return true;
      })
      .catch((err) => {
        console.error('SignalR connection error:', err);
        this._connection.next(null);
        return false;
      });
  }

  public disconnect(): void {
    this._hubConnection?.stop();
    this._connection.next(null);
  }
}
