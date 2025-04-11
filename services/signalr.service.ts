import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { API_URL, MAP_ID,USER_ID } from '@/constants/Constant';

class SignalRService {
  onDisconnectCallback:any = null;
  connection:any =  null;
  constructor() {
    this.connection = null;
  }
  public async startConnection() {
    console.log("startConnection")
    this.connection = new HubConnectionBuilder()
      .withUrl(`${API_URL}/streamDataHub`, {
        skipNegotiation: true,
        transport: 1, 
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.connection.onclose(async (error:any) => {
      console.log("SignalR Disconnected:");
      
      if (this.onDisconnectCallback) {
        this.onDisconnectCallback(error);
      }
    });
    try {
      await this.connection.start();
      console.log(" SignalR Connected!");
      await this.JoinGroup(MAP_ID, USER_ID);

    } catch (error) {
      console.error(" SignalR Connection Error:", error);
    }
    setInterval(() => {
     // console.log((new Date()).toISOString(),this.connection._connectionState)
    }, 500);
  }
  async JoinGroup(groupName:any, userid:any) {
   
    if (this.connection.state === 'Connected') {
      await this.connection.invoke("joinGroup", groupName, userid);
    } else {
      console.log("SignalR is not connected");
    }
  }

  on(eventName:any, callback:any) {
    if (this.connection) {
      this.connection.on(eventName, callback);
    }
  }

  off(eventName:any) {
    if (this.connection) {
      this.connection.off(eventName);
    }
  }

  sendMessage(methodName:any, data:any) {
    if (this.connection) {
      this.connection.invoke(methodName, data).catch((err:any) => console.error(err));
    }
  }
}

export default new SignalRService();