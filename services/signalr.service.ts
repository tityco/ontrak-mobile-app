import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { MAP_ID,USER_ID } from '@/constants/Constant';

class SignalRService {
  onDisconnectCallback:any = null;
  connection:any =  null;

  constructor() {
    this.connection = null;
    
  }
  public  async startConnection() {
    this.connection = new HubConnectionBuilder()
      .withUrl("https://ontrak.live/streamDataHub", {
        skipNegotiation: true,
        transport: 1, // WebSockets (fix lỗi trong React Native)
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.connection.onclose(async (error:any) => {
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

  }
  async JoinGroup(groupName:any, userid:any) {
   
    if (this.connection.state === 'Connected') {
  
      await this.connection.invoke("joinGroup", groupName, userid);
      console.log(`Joined group: ${groupName}`);
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