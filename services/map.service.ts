import { API_URL } from "@/constants/Constant";
import axios from "axios";

class MapService {

  number:number  = 0;
  constructor() {
  }

  getMapByID = async (mapID:any) => {
    try {
      console.log("getMapByID", mapID);
      const response = await axios.get(`${API_URL}/MapApi/GetMapByID?id=${mapID}`, {
        timeout: 5000, 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching map data:", error);
      return null;
    }
  }

}

export default new MapService();