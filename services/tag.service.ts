import { API_URL, MAP_ID } from "@/constants/Constant";
import axios from "axios";

class TagService {

  number:number  = 0;
  constructor() {
  }

  getTagByMapID = async (mapID:any) => {
    try {
      const response = await axios.get(`${API_URL}/TagMapApi/SelectAllBuyMapID?mapid=${MAP_ID}`, {
        timeout: 5000, 
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching map data:", error);
      return null;
    }
  }

}

export default new TagService();