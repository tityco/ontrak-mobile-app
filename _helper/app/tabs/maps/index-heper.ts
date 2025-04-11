import { TextureLoader, THREE } from "expo-three";
import * as FileSystem from 'expo-file-system';
export  function updatePositonTag (data: any, tagInfo:any) :any {
  if (!tagInfo) return tagInfo;
  for (var k = 0; k < data.length; k++) {
    let tagIndex = tagInfo.findIndex((item:any) => item.data.tagID == data[k].tagID);
    if (tagIndex != -1) {
  
      if(tagInfo[tagIndex].data.serial == '9000') {
        console.log(">>>>>>>>>>>1", data[k].x,data[k].y)
      }
      tagInfo[tagIndex].data.x = data[k].x;
      tagInfo[tagIndex].data.y = data[k].y;
      
      if(tagInfo[tagIndex].data.serial == '9000') {
        console.log(">>>>>>>>>>>4", tagInfo[tagIndex].data.x, tagInfo[tagIndex].data.y)
      }
      if (data[k].status != 4) {
        tagInfo[tagIndex].obj3D.visible = true;
      }

    }
  }
  let tagIndex =  tagInfo.findIndex((item:any) => item.data.serial == '9000');
  if (tagIndex != -1) {
      console.log(">>>>>>>>>>>3", tagInfo[tagIndex].data.x,tagInfo[tagIndex].data.y)
  }
 
  return tagInfo;
}


export  async function  loadTextureFromURL (imageUrl: any):Promise<THREE.Texture> {
    try {
      const fileUri = `${FileSystem.cacheDirectory}${imageUrl.replace(/\\/g, "").replace(/\//g, "")}temp_texture.jpg`;
      await FileSystem.downloadAsync(imageUrl, fileUri);
      const texture = new TextureLoader().load(fileUri);
      return texture;
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
      return null;
    }
  };
