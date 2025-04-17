import { loadTextureFromURL, updatePositonTag } from "@/_helper/app/tabs/maps/index-heper";
import { API_URL, MOVE_SPEED } from "@/constants/Constant";
import { mapInfoSelector } from "@/redux-toolkit/selector/selector-toolkit";
import { Easing, Group, Tween } from "@tweenjs/tween.js";
import { Renderer, THREE } from "expo-three";
import { useDispatch, useSelector } from "react-redux";


class ThreeMapService {
  camera: any= null;
  renderer:any = null;
  scene:any = null;
  scaleTag:number = 0;
  gl:any = null;
  tweenGroup = new Group();
  tagInfoThree:any[]= [];
  previousTouch:any = {};
  width:any = 0;
  height:any = 0;
  dispatch:any = null ;
  dt = 0;
  tagStart:any= null;
  tagDestination:any = null;

  contextCreate = async (gl: any, width: any, height :any, mapInfo: any, tagsInfo:any[]) => {
    this.gl = gl;
    this.scene = this.initScene();
    this.width = width;
    this.height = height;
    this.camera  = this.initCamera(width, height, mapInfo);
  
    if (1.2 / this.camera?.zoom >= 15) {
      this.scaleTag = 15;
    } else {
      this.scaleTag  = 1.2 / this.camera.zoom;
    }
  
    this.renderer = new Renderer({ gl });
    this.renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    this.scene.add(this.getLight());
    this.scene.add(await this.getFloor(mapInfo));
    await this.addTags(mapInfo, tagsInfo);
    this.render(0);

  };

  onTagUpdate = (tagupdate:any) =>{
    if(tagupdate.length >0 ) {
      this.tagInfoThree.forEach(tagThree => {
        let tags = tagupdate.filter((tag:any) => tagThree.data.serial == tag.serial);
        if(tags.length >0){
          tagThree.data.x = tags[0].x
          tagThree.data.y = tags[0].y
          tagThree.data.status = tags[0].status
          if(tagThree.data.status != 4){
            tagThree.obj3D.visible = true;
          }else{
            tagThree.obj3D.visible = false;
          }
        }
      })
    }

  }
  lineFinding:any = null

  genRouteFinding = () =>{
    if(this.lineFinding){
      this.scene.remove(this.lineFinding);
      this.lineFinding.geometry.dispose();
      this.lineFinding.material.dispose();
      this.lineFinding = null;
    }
    let tags = this.tagInfoThree.filter((tag:any) => tag.data.serial == this.tagStart?.serial);
    let tagD = this.tagInfoThree.filter((tag:any) => tag.data.serial == this.tagDestination?.serial);

    const points = [
      new THREE.Vector3(tags[0].data.x, tags[0].data.y, 10),
      new THREE.Vector3(tagD[0].data.x, tagD[0].data.y, 10),
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    
    this.lineFinding = new THREE.Line(geometry, material);
    this.scene.add(this.lineFinding);
    
  } 
  onChangeStart = (tagStart:any)=>{
    this.tagStart = tagStart
    if(this.tagStart !=null && this.tagDestination !=null){
      this.genRouteFinding()
    }
  }
  onChageDestination = (tagStart:any)=>{
    this.tagDestination = tagStart
    if(this.tagStart !=null && this.tagDestination !=null){
      this.genRouteFinding()
    }
  }

  render = (time:any) => {
    requestAnimationFrame(this.render);
    this.tweenGroup.update(time);
    if (((new Date()).getTime() - this.dt) >=50) {
      if(this.tagStart !=null && this.tagDestination !=null){
        this.genRouteFinding();
      }
      this.dt = (new Date()).getTime();
    };
  
    this.renderer.render(this.scene, this.camera);

    this.gl.endFrameEXP();
  };

  initScene = (): any => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    return scene;
  }
  
  initCamera = (width: any, height :any ,mapInfo:any): any => {
    const camera = new THREE.OrthographicCamera(
      -width, // left
      width,  // right
      height,  // top
      -height, // bottom
      0.1,  // near
      10000  // far
    );
    camera.position.z = mapInfo.targetPointZ;
    camera.position.x = mapInfo.targetPointX;
    camera.position.y = mapInfo.targetPointY;
    return camera;
  }

  getLight = () :any=> {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    return light;
  }

  getFloor = async (mapInfo: any) :Promise<any>=> {
    let floorTexture = await loadTextureFromURL(`${API_URL}${mapInfo.imgLink.replace(/\\/g, "/")}`);
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(1, 1);
  
    const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
  
    let floorGeometry = new THREE.PlaneGeometry(mapInfo.widthMap, mapInfo.heightMap, 1, 1);
    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.scale.x = mapInfo.scaleMap;
    floor.scale.y = mapInfo.scaleMap;
    floor.position.y = mapInfo.mapY;
    floor.position.z = 0;
    floor.position.x = mapInfo.mapX;
    floor.rotation.z = mapInfo.angleViewMap * Math.PI / 180;
    return floor;
  }

  addTags = async (mapInfo:any, tagsInfo:any[]) => {
    for (var i = 0; i < tagsInfo.length; i++) {
      let tagTexture = await loadTextureFromURL(`${API_URL}${tagsInfo[i].icon.replace(/\\/g, "/")}`);
      let geometryTag = new THREE.BoxGeometry(50, 50, 50);
      var materialTag = new THREE.MeshBasicMaterial({
        transparent: true,
        map: tagTexture,
        side: THREE.DoubleSide
      });
      var objTagDisplay = new THREE.Mesh(geometryTag, materialTag);
      objTagDisplay.position.y = 0;
      var an = mapInfo.angleViewCamera;
      objTagDisplay.rotation.z = 3.14 * (180 - an) / 180;
      objTagDisplay.position.z = 5;
      objTagDisplay.scale.x = this.scaleTag;
      objTagDisplay.scale.y = this.scaleTag;
      objTagDisplay.position.x = tagsInfo[i].x;
      objTagDisplay.position.y = tagsInfo[i].y;
      objTagDisplay.visible =  tagsInfo[i].visible ?? false;
      let tagI = { obj3D: objTagDisplay, data: JSON.parse(JSON.stringify(tagsInfo[i]))};
      this.moveBoxAlongPath(tagI)
      this.tagInfoThree.push(tagI);
      this.scene.add(objTagDisplay);
    }

  }

  moveBoxAlongPath = (tag:any) => {
    const coords = { x: tag.obj3D.position.x, y: tag.obj3D.position.y };
    const tween = new Tween(coords, this.tweenGroup)
      .to({ x: tag.data.x, y: tag.data.y }, MOVE_SPEED)
      .easing(Easing.Quadratic.Out)
      .onUpdate(() => {
        tag.obj3D.position.set(coords.x, coords.y, 0);
      })
      .onComplete(() => {
        this.moveBoxAlongPath(tag);
      })
      .start();
  }

  /// Move and zoom render
  onPanResponderGrant = (event: any, gesture: any) => {
    if (gesture.numberActiveTouches === 2) {
      const [touch1, touch2] = event.nativeEvent.touches;
      const dx = touch1.pageX - touch2.pageX;
      const dy = touch1.pageY - touch2.pageY;
      this.previousTouch.distance = Math.sqrt(dx * dx + dy * dy);
    } else {
      this.previousTouch.x = gesture.x0;
      this.previousTouch.y = gesture.y0;
    }
  }
  onPanResponderMove = (event: any, gesture: any) => {
    if (!this.camera) return;

    if (gesture.numberActiveTouches === 2) {

      const [touch1, touch2] = event.nativeEvent.touches;
      const dx = touch1.pageX - touch2.pageX;
      const dy = touch1.pageY - touch2.pageY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);

      if (this.previousTouch.distance && newDistance > 0) {
        const zoomFactor = this.previousTouch.distance / newDistance;
        let zoom = this.camera.zoom / zoomFactor;
        this.camera.zoom = Math.min(Math.max(zoom, 0.0005), 5000);
        this.camera.updateProjectionMatrix();
        if (1.2 / this.camera.zoom >= 15) {
          this.scaleTag = 15;
        } else {
          this.scaleTag = 1.2 / this.camera.zoom;
        }
        if (this.tagInfoThree) {
          this.tagInfoThree.forEach(tagI => {
            tagI.obj3D.scale.x = this.scaleTag ;
            tagI.obj3D.scale.y = this.scaleTag ;
          });
        }

        // 🔹 Lưu khoảng cách mới
        this.previousTouch.distance = newDistance;
      }
    } else {
      // 🔹 Xử lý PAN
      const { moveX, moveY } = gesture;
      const deltaX = (moveX - this.previousTouch.x) * 2 / this.width * this.camera.right;
      const deltaY = (moveY - this.previousTouch.y) * 2 / this.height * this.camera.top;

      this.camera.position.x -= deltaX / this.camera.zoom;
      this.camera.position.y += deltaY / this.camera.zoom;

      this.previousTouch.x = moveX;
      this.previousTouch.y = moveY;
    }
  }
  onPanResponderRelease = () => {
    this.previousTouch.distance = null;
  }
}

export default new ThreeMapService();