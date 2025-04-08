import { TextureLoader, THREE } from "expo-three";
import * as FileSystem from 'expo-file-system';
export  function updatePositonTag (data: any, tagInfo:any) :any {
  for (var k = 0; k < data.length; k++) {
    if (!tagInfo) return tagInfo;
    let tagIndex = tagInfo.findIndex((item:any) => item.data.tagID == data[k].tagID);
    if (tagIndex != -1) {
      tagInfo[tagIndex].data.x = data[k].x;
      tagInfo[tagIndex].data.y = data[k].y;
      if (data[k].status != 4) {
        tagInfo[tagIndex].obj3D.visible = true;
      }
    }
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
