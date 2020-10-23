import {reflectivityBase64,albedoBase64,mengshuBase64,functionSourceUrlPrefix} from '../data/babylonData';
import {getCanvas, getState} from './common';
import * as MyEarcut from "earcut";
// import store from '@/store/index.js';


// function commitCanvas3DMutationsUpdate (key, value){
//     store.commit('canvas3D/commonMutationsUpdate', { updateProperty: key, value: value});
// }

//抽奖
//球形抽奖
function lotteryPlaySphere(curRunParam) {
    curRunParam.param["runState"] = false;

    var scene = curRunParam.instance;

    var camera = curRunParam.camera;

    var sphere = BABYLON.Mesh.CreateSphere('lottery_glassSphere', 16, 8, scene);
    sphere.position.y = 4;


    var hdrTexture = curRunParam.reflectionTexture;

    createLotteryPlank("lottery_plank",scene, hdrTexture.clone());

    var a = BABYLON.Mesh.CreateSphere("lottery_glassSphere_cut", 16, 8, scene);
    var b = BABYLON.MeshBuilder.CreateBox("lottery_glassSphere_cutBox", {
        height: 16,
        width: 16,
        depth: 16
    }, scene);
    // a.position.x = 0;
    a.position.y = 4;
    // a.position.z = 0;
    b.position.x = 0;
    b.position.y = 0;
    b.position.z = 0;
    a.visibility = 0;
    b.visibility = 0;
    var aCSG = BABYLON.CSG.FromMesh(a);
    var bCSG = BABYLON.CSG.FromMesh(b);
    var subCSG = bCSG.subtract(aCSG);
    var newMesh = subCSG.buildMeshGeometry("lottery_glassSphere_csg", scene, false);
    newMesh.position = new BABYLON.Vector3(0, 0, 0);
    newMesh.physicsImpostor = new BABYLON.PhysicsImpostor(newMesh, BABYLON.PhysicsImpostor.MeshImpostor, {
        mass: 0,
        friction: 0.5,
        restitution: 0.7
    }, scene);

    newMesh.visibility = 0;

    var glass = new BABYLON.PBRMaterial("lottery_glassSphere_material", scene);
    glass.reflectionTexture = hdrTexture.clone();
    glass.refractionTexture = hdrTexture.clone();

    glass.alpha = 0.4;
    glass.reflectivityColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    glass.albedoColor = new BABYLON.Color3(1, 1, 1);
    glass.metallic = 0.3;
    glass.roughness = 0.15;
    glass.subSurface.isRefractionEnabled = true;
    glass.subSurface.indexOfRefraction = 1.5;
    glass.subSurface.isTranslucencyEnabled = true;
    glass.subSurface.translucencyIntensity = 0.8;
    glass.clearCoat.isEnabled = true;
    sphere.material = glass;

    var envir = new BABYLON.PBRMaterial("lottery_glassSphere_envir", scene);
    envir.albedoColor = new BABYLON.Color3(1.0, 0.766, 0.336);
    envir.reflectivityColor = new BABYLON.Color3(1.0, 0.766, 0.336);
    envir.microSurface = 1.0; // Let the texture controls the value 
    envir.reflectionTexture = hdrTexture.clone();

    envir.useMicroSurfaceFromReflectivityMapAlpha = true;
    let holder = BABYLON.MeshBuilder.CreateSphere("lottery_holder", {
        diameter: 0.5,
        segments: 1
    }, scene);
    let wheel = BABYLON.MeshBuilder.CreateSphere("lottery_base", {
        diameterY: 2.5,
        diameterZ: 0.5,
        diameterX: 2.5
    }, scene);
    wheel.position.y = 4;
    holder.position.y = 4;
    wheel.material = envir;
    holder.material = envir;
    let box1 = BABYLON.MeshBuilder.CreateBox("lottery_tooth1", {
        width: 3,
        height: 0.1,
        depth: 2
    }, scene);
    // box1.parent = wheel;
    box1.position.x = 2.3;
    box1.position.y = 4;
    box1.material = envir;
    let box2 = box1.clone("lottery_tooth2");
    box2.position.x = -2.3;
    box2.position.y = 4;
    let box3 = box1.clone("lottery_tooth3");
    box3.position.x = 0;
    box3.position.y = 6.3;
    box3.rotation.z = Math.PI / 2;
    let box4 = box3.clone("lottery_tooth4");
    box4.position.y = 2.3;
    [box1, box2, box3, box4].forEach((mesh) => {
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0
        });
    });

    curRunParam.param["t"] = Math.PI/2;
    curRunParam.param["a"] = 0;

    curRunParam.controll["lotteryObject"] = {
        box1: box1,
        box2: box2,
        box3: box3,
        box4: box4,
        wheel: wheel
    }


    
}

//抽奖机
function lotteryPlayHelix(curRunParam) {

    curRunParam.param["runState"] = false;
    
    var scene = curRunParam.instance;

    var camera = curRunParam.camera;
    
    var hdrTexture = curRunParam.reflectionTexture;

    createLotteryPlank("lottery_helix",scene, hdrTexture.clone());

    var b = BABYLON.MeshBuilder.CreateCylinder("lottery_cone1", {
        diameter: 10,
        height: 3.1,
        tessellation: 10
    }, scene);
    var a = BABYLON.MeshBuilder.CreateCylinder("lottery_cone2", {
        diameter: 9.9,
        height: 3,
        tessellation: 10
    }, scene);
    // a.position.x = 0;
    // a.position.y = 4;
    // a.position.z = 0;
    b.position.x = 0;
    b.position.y = 0;
    b.position.z = 0;
    a.visibility = 0;
    b.visibility = 0;
    var aCSG = BABYLON.CSG.FromMesh(a);
    var bCSG = BABYLON.CSG.FromMesh(b);
    var subCSG = bCSG.subtract(aCSG);
    var newMesh = subCSG.buildMeshGeometry("lottery_helix_csg", scene, false);
    newMesh.position = new BABYLON.Vector3(0, 0, 0);
    newMesh.physicsImpostor = new BABYLON.PhysicsImpostor(newMesh, BABYLON.PhysicsImpostor.MeshImpostor, {
        mass: 0,
        friction: 0.5,
        restitution: 0.7
    }, scene);
    // newMesh.checkCollisions = true;
    // newMesh.visibility = 0;
    newMesh.position.y = 7;
    newMesh.rotateAround(new BABYLON.Vector3(0, 7, 0), new BABYLON.Vector3(1, 0, 0), Math.PI / 2);
    // newMesh.rotation.x = Math.PI/2;
    var glass = new BABYLON.PBRMaterial("lottery_helix_glass", scene);
    glass.reflectionTexture = hdrTexture.clone();
    glass.refractionTexture = hdrTexture.clone();
    glass.alpha = 0.4;
    glass.reflectivityColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    glass.albedoColor = new BABYLON.Color3(1, 1, 1);
    glass.metallic = 0.3;
    glass.roughness = 0.15;
    glass.subSurface.isRefractionEnabled = true;
    glass.subSurface.indexOfRefraction = 1.5;
    glass.subSurface.isTranslucencyEnabled = true;
    glass.subSurface.translucencyIntensity = 0.8;
    glass.clearCoat.isEnabled = true;
    newMesh.material = glass;
    var envir = new BABYLON.PBRMaterial("lottery_helix_envir", scene);
    envir.albedoColor = new BABYLON.Color3(1.0, 0.766, 0.336);
    envir.reflectivityColor = new BABYLON.Color3(1.0, 0.766, 0.336);
    envir.microSurface = 1.0; // Let the texture controls the value 
    envir.reflectionTexture = hdrTexture.clone();
    // envir.reflectivityTexture = new BABYLON.Texture("/textures/sg.png", scene);
    envir.useMicroSurfaceFromReflectivityMapAlpha = true;
    // let holder = BABYLON.MeshBuilder.CreateSphere("holder", {diameter: 0.5, segments: 1}, scene);
    let wheel = BABYLON.MeshBuilder.CreateSphere("lottery_helix_base", {
        diameterY: 1,
        diameterZ: 1,
        diameterX: 1
    }, scene);
    wheel.position.y = 7;
    // holder.position.y=7;
    wheel.material = envir;
    // holder.material = envir;
    // let box1 = BABYLON.MeshBuilder.CreateBox("tooth1", {width: 1.5, height:0.1, depth:2}, scene);
    var cone1 = BABYLON.MeshBuilder.CreateCylinder("lottery_helix_cone", {
        diameter: 2,
        arc: 0.5,
        height: 0.3,
        tessellation: 24
    }, scene);
    // box1.parent = wheel;
    cone1.position.x = 3.2;
    cone1.position.y = 7;
    cone1.material = envir;
    cone1.rotation.y = -Math.PI / 2;
    let cone2 = cone1.clone("lottery_helix_tooth2");
    cone2.position.x = -3.2;
    cone2.position.y = 7;
    cone2.rotation.y = Math.PI / 2;
    let cone3 = cone1.clone("lottery_helix_tooth3");
    cone3.position.x = 0;
    cone3.position.y = 10;
    cone3.rotation.x = -Math.PI / 2;
    cone3.rotation.y = Math.PI / 2;
    let cone4 = cone3.clone("lottery_helix_tooth4");
    cone4.position.y = 3.8;
    cone4.rotation.y = Math.PI / 2;
    cone3.rotation.x = Math.PI / 2;
    [cone1, cone2, cone3, cone4].forEach((mesh) => {
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0
        });
        // newMesh.rotatePOV(null, Math.PI/2, null);
    });
    var myPath = [
        new BABYLON.Vector3(0, 0, 3),
        new BABYLON.Vector3(0, 7, 3),
        new BABYLON.Vector3(0, 7, -3),
        new BABYLON.Vector3(0, 0, -3),
    ];
    //Create ribbon with updatable parameter set to true for later changes
    var tube = BABYLON.MeshBuilder.CreateTube("lottery_helix_tube", {
        path: myPath,
        radius: 0.2,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true
    }, scene);
    tube.material = envir;
    var myBox = BABYLON.MeshBuilder.CreateBox("lottery_helix_myBox", {
        height: 0.5,
        width: 4,
        depth: 2
    }, scene);
    myBox.position.z = 3;
    myBox.position.y = 0.5;
    myBox.material = envir;
    var myBox2 = myBox.clone();
    myBox2.position.z = -3;
    var myPathRotateV = [
        new BABYLON.Vector3(0, 11, 0),
        new BABYLON.Vector3(0, 3, 0),
    ];
    var myPathRotateH = [
        new BABYLON.Vector3(4, 7, 0),
        new BABYLON.Vector3(-4, 7, 0),
    ];
    var myRotateV = BABYLON.MeshBuilder.CreateTube("lottery_helix_tubeV", {
        path: myPathRotateV,
        radius: 0.1,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true
    }, scene);
    var myRotateH = BABYLON.MeshBuilder.CreateTube("lottery_helix_tubeH", {
        path: myPathRotateH,
        radius: 0.1,
        sideOrientation: BABYLON.Mesh.DOUBLESIDE,
        updatable: true
    }, scene);
    myRotateV.material = envir;
    myRotateH.material = envir;
    myRotateV.physicsImpostor = new BABYLON.PhysicsImpostor(myRotateV, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
    });
    myRotateH.physicsImpostor = new BABYLON.PhysicsImpostor(myRotateH, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
    });

    curRunParam.param["t"] = Math.PI/2;
    curRunParam.param["a"] = 0;

    curRunParam.controll["lotteryObject"] = {
        cone1: cone1,
        cone2: cone2,
        cone3: cone3,
        cone4: cone4,
        wheel: wheel,
        newMesh: newMesh,
        myRotateV: myRotateV,
        myRotateH: myRotateH,
        myBox:myBox,
        myBox2:myBox2,
        tube:tube,

    }

}

//创建抽奖平面
function createLotteryPlank(name, scene, hdrTexture){
    const woodPlank = BABYLON.MeshBuilder.CreateBox("plane"+name, {
        width: 30,
        height: 1,
        depth: 30
    }, scene);
    const wood = new BABYLON.PBRMaterial("wood"+name, scene);
    wood.reflectionTexture = hdrTexture.clone();
    wood.environmentIntensity = 1;
    wood.specularIntensity = 0.3;
    wood.reflectivityTexture = new BABYLON.Texture(reflectivityBase64, scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;
    wood.albedoColor = BABYLON.Color3.White();
    wood.albedoTexture = new BABYLON.Texture(albedoBase64, scene);
    woodPlank.material = wood;
    woodPlank.physicsImpostor = new BABYLON.PhysicsImpostor(woodPlank, BABYLON.PhysicsImpostor.BoxImpostor, {
        mass: 0
    });
}


//开始抽奖
function playLottery(curRunParam, curPage){
    var functionEffect = curPage.functionEffect;
    var scene = curRunParam.instance;
    var camera = curRunParam.camera;

    var iconData = curRunParam.parent.iconData;

    curRunParam.param["runState"] = true;

    curRunParam.param["iconMesh"] = [];

    if (functionEffect == "sphere") {
        var y = 0;
        BABYLON.Animation.CreateAndStartAnimation("anim", camera, "radius", 20, 30, camera.radius, 11, 2);
        setTimeout(() => {
            for (var index = 0; index < iconData.length; index++) {
                var user = iconData[index].texture;
                var materialAmiga = new BABYLON.StandardMaterial("lottery_"+ functionEffect + "_user", scene);
                materialAmiga.diffuseTexture = user.clone();
                materialAmiga.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                var icon = BABYLON.Mesh.CreateSphere("lottery_"+ functionEffect + "_user", 16, 0.5, scene);
                icon.material = materialAmiga;
                icon.position = new BABYLON.Vector3(Math.random() + 1, Math.random() + 4, Math.random() + 1);
                icon.physicsImpostor = new BABYLON.PhysicsImpostor(icon, BABYLON.PhysicsImpostor.SphereImpostor, {
                    mass: 1
                }, scene);
                curRunParam.param["iconMesh"].push(icon);
                y += 2;
            }
        }, 500);
        
    } 
    else if (functionEffect == "helix") {
        var y = 0;
        BABYLON.Animation.CreateAndStartAnimation("anim", camera, "radius", 20, 30, camera.radius, 16, 2);
        setTimeout(() => {
            for (var index = 0; index < iconData.length; index++) {
                var user = iconData[index].texture;
                var materialAmiga = new BABYLON.StandardMaterial("lottery_"+ functionEffect + "_user", scene);
                materialAmiga.diffuseTexture = user.clone();
                materialAmiga.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                var icon = BABYLON.Mesh.CreateSphere("lottery_"+ functionEffect + "_user", 16, 0.5, scene);
                icon.material = materialAmiga;
                icon.position = new BABYLON.Vector3(Math.random(), Math.random() * 3 + 8, Math.random());
                icon.physicsImpostor = new BABYLON.PhysicsImpostor(icon, BABYLON.PhysicsImpostor.SphereImpostor, {
                    mass: 1
                }, scene);
                curRunParam.param["iconMesh"].push(icon);
                y += 2;
            }
        }, 1000);
    }
}

//停止抽奖
function clearLottery(curRunParam, curPage){
    curRunParam.param["runState"] = false;

    if(curRunParam.param["iconMesh"]!=null && curRunParam.param["iconMesh"].length>0){
        curRunParam.param["iconMesh"].forEach((mesh)=>{
            mesh.dispose(true);
        });
    }
}

//计算立方体范围
function calMeshBoundary(v, maxPos, minPos){

    if(v.x>maxPos[0]){
        maxPos[0] = v.x;
    }

    if(v.y>maxPos[1]){
        maxPos[1] = v.y;
    }

    if(v.z>maxPos[2]){
        maxPos[2] = v.z;
    }

    if(v.x<minPos[0]){
        minPos[0] = v.x;
    }

    if(v.y<minPos[1]){
        minPos[1] = v.y;
    }

    if(v.z<minPos[2]){
        minPos[2] = v.z;
    }
}

//签到
// function changeSignType(curRunParam, type, isAni,changePostion){
//     var babylon = curRunParam.parent;
//     var data = babylon.iconData;
//     var pageId = curRunParam.pageId;
//     var scene = curRunParam.backScene;
//     var maxPos = [-Infinity, -Infinity, -Infinity], minPos = [Infinity, Infinity, Infinity];
//     var easingFunction = new BABYLON.CircleEase();
//     easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
//     if(curRunParam.TransformNode){
//         curRunParam.TransformNode.dispose(true);
//     }
//     var CoT = new BABYLON.TransformNode("root", scene);

//     if(isAni==null){
//         isAni = true; 
//     }
    
//     // CoT.billboardMode = 7;
//     curRunParam.TransformNode = CoT;

//     // if(type=="logo"){
//     //     CoT.rotation.z = -Math.PI;
//     // }

//     curRunParam.maxPos = maxPos;

//     curRunParam.minPos = minPos;

//     curRunParam.param["positionY"] = 0;
//     curRunParam.param["rotationY"] = 0;

//     curRunParam.param["positionDirection"] = true;

//     // console.log(CoT, maxPos, minPos);

//     // var execChange = function(){
            
//     var cubeCount = Math.ceil(Math.cbrt(data.length));
//     var cubeCountP = Math.pow(cubeCount, 2);
//     var depth = Math.ceil(data.length / cubeCountP);

//     var sqrtCount = Math.ceil(Math.sqrt(data.length));

//     var sphereSizeFix = Math.ceil(Math.sqrt(data.length));
//     if(changePostion){
//         data.reverse();
//     }

//     var defaultIconCount = curRunParam.defaultIconCount, iconDataLen = data.length;

//     if(iconDataLen<defaultIconCount){
//         iconDataLen = defaultIconCount;
//     }

//     var virtualIndex = 0, postionSet = [];
//     for ( var i = 0, l = iconDataLen; i < l; i ++ ) {

//         var v = null;
//         if(type=="sphere"){
//             var phi = Math.acos( -1 + ( 2 * i ) / l );
//             var theta = Math.sqrt( l * Math.PI ) * phi;

//             v = new BABYLON.Vector3(sphereSizeFix * Math.cos( theta ) * Math.sin( phi ), sphereSizeFix * Math.sin( theta ) * Math.sin( phi ), sphereSizeFix * Math.cos( phi ));

//             v.y += 4;
//         }
//         else if(type=="helix"){
//             var phi = i * 0.175 + Math.PI;

//             v = new BABYLON.Vector3(10 * Math.sin( phi ),- ( i/10 ) + 2,10 * Math.cos( phi ));
//             // _this.camera.attachControl(_this.canvas, false);

//             v.y += 4;
//         }
//         else if(type=="grid"){
//             var xyIndex =  i % cubeCountP;
            
//             v = new BABYLON.Vector3(xyIndex % cubeCount - (cubeCount-1)/2, Math.floor(xyIndex / cubeCount) - (cubeCount-1)/2, Math.floor(i / cubeCountP) - (depth-1)/2);
//             v = v.multiply(new BABYLON.Vector3(2.4,2.4,2.4));                
//             // _this.camera.attachControl(_this.canvas, false);

//             v.y += 4;
//         }
//         else if(type=="dna"){
//             var t = 0.1 * i;
//             if(i%2==0){
//                 v = new BABYLON.Vector3( 6*Math.cos(t) ,i*0.2- (data.length-1)*0.1, 6*Math.sin(t));
//             }
//             else{
//                 v = new BABYLON.Vector3( 6*Math.cos(t-Math.PI),i*0.2- (data.length-1)*0.1, 6*Math.sin(t-Math.PI));
//             }

//             v = v.multiply(new BABYLON.Vector3(1.3,1.3,1.3));

//             v.y += 4;
//         }
//         else if(type=="table"){
//             var xyIndex =  i % cubeCountP;

//             v = new BABYLON.Vector3(0,Math.floor(i / sqrtCount) - (sqrtCount-1)/2, i % sqrtCount - (sqrtCount-1)/2);
//             v = v.multiply(new BABYLON.Vector3(1.8,1.8,1.8));

//             v.y += 4;
//         }
//         else if(type=="logo"){
//             var iconPosition = curRunParam.iconPosition[i];
//             if(iconPosition==null){
//                 // myBox.visibility = 0;
//                 continue;
//             }

//             v = new BABYLON.Vector3(iconPosition.x, iconPosition.y, 0);

//             v.y += 4;
//         }

//         postionSet.push(v);   

//         calMeshBoundary(v, maxPos, minPos);
//     }

//     postionSet.shuffle();

//     postionSet.forEach((v, i)=>{
//         var myBox;
//         if(data[i]==null){
//             myBox = curRunParam.virtualIcon[virtualIndex++];
//             myBox.visibility = 1;
//         }
//         else{
//             myBox = data[i][pageId];
//         }

//         if(myBox==null){
//             return false;
//         }

//         myBox.parent = CoT;

//         if(isAni){
//             BABYLON.Animation.CreateAndStartAnimation("anim", myBox, "position", 20+Math.random()*10, 30, myBox.position, v, 2, easingFunction);
//         }
//         else{
//             myBox.position = v;
//         }
//     });

// }



function getSignIconRadius(page){
    var iconRadius = 10;
    if(page.functionParam!=null){
        var r = page.functionParam.radius;
        if(r=="radius"){
            iconRadius = 10;
        }
        else if(r=="circle"){
            iconRadius = 2.01;
        }
        else if(r=="square"){
            iconRadius = 0;
        }
    }

    return iconRadius;
}



// function addSignIconTexture(){

// }


//更新头像mesh和虚拟mesh的位置，如果是logo和text则直接赋值使用，其他则计算。
function reCalculateSignPositionAndSize(iconMesh, curVm, effect) {
    var scale = effect.scale, type = effect.type;
    var iconFixScale = 1;
    if(scale!=null){
        iconFixScale = scale/1.5;
    }
    var maxPos = [-Infinity, -Infinity, -Infinity], minPos = [Infinity, Infinity, Infinity];



    var iconDataLen = 0;

    if(effect.type=="logo" || effect.type=="text"){
        iconDataLen = effect.iconPosition.length;
    }
    else{
        if(iconMesh.length>=100){
            iconDataLen = iconMesh.length;
        }
        else{
            iconDataLen = 100;
        }
    }
    var cubeCount = Math.ceil(Math.cbrt(iconDataLen));
    var cubeCountP = Math.pow(cubeCount, 2);
    var depth = Math.ceil(iconDataLen / cubeCountP);

    var sqrtCount = Math.ceil(Math.sqrt(iconDataLen));

    var sphereSizeFix = Math.ceil(Math.sqrt(iconDataLen)/1.3);

    var postionSet = [], virtualMeshRandom = [];
    for ( var i = 0, l = iconDataLen; i < l; i++ ) {

        var v = null;
        if(type=="sphere"){
            var phi = Math.acos( -1 + ( 2 * i ) / l );
            var theta = Math.sqrt( l * Math.PI ) * phi;

            v = new BABYLON.Vector3(sphereSizeFix * Math.cos( theta ) * Math.sin( phi ), sphereSizeFix * Math.sin( theta ) * Math.sin( phi ),  sphereSizeFix  * Math.cos( phi ));

            v.y += 4;
        }
        else if(type=="helix"){
            var phi = i * 0.175 + Math.PI;

            v = new BABYLON.Vector3(10 * Math.sin( phi ),- ( i/10 ) + 2,10 * Math.cos( phi ));
            // _this.camera.attachControl(_this.canvas, false);

            v.y += 4;
        }
        else if(type=="grid"){
            var xyIndex =  i % cubeCountP;
            
            v = new BABYLON.Vector3(xyIndex % cubeCount - (cubeCount-1)/2, Math.floor(xyIndex / cubeCount) - (cubeCount-1)/2, Math.floor(i / cubeCountP) - (depth-1)/2);
            v = v.multiply(new BABYLON.Vector3(2.4,2.4,2.4));                
            // _this.camera.attachControl(_this.canvas, false);

            v.y += 4;
        }
        else if(type=="dna"){
            var t = 0.1 * i;
            if(i%2==0){
                v = new BABYLON.Vector3( 6*Math.cos(t) ,i*0.2- (iconDataLen-1)*0.1, 6*Math.sin(t));
            }
            else{
                v = new BABYLON.Vector3( 6*Math.cos(t-Math.PI),i*0.2- (iconDataLen-1)*0.1, 6*Math.sin(t-Math.PI));
            }

            v = v.multiply(new BABYLON.Vector3(1.3,1.3,1.3));

            v.y += 4;
        }
        else if(type=="table"){
            var xyIndex =  i % cubeCountP;

            v = new BABYLON.Vector3(0,Math.floor(i / sqrtCount) - (sqrtCount-1)/2, i % sqrtCount - (sqrtCount-1)/2);
            v = v.multiply(new BABYLON.Vector3(1.8,1.8,1.8));

            v.y += 4;
        }
        else if(type=="logo" || type=="text"){
            var iconPosition = effect.iconPosition[i];
            if(iconPosition==null){
                // myBox.visibility = 0;
                continue;
            }

            v = new BABYLON.Vector3(iconPosition.x, iconPosition.y, 0);

            v.y += 4;

            virtualMeshRandom.push(curVm[i]);
        }

        postionSet.push(v);   

        calMeshBoundary(v, maxPos, minPos);
    }

    postionSet.shuffle();
    virtualMeshRandom.shuffle();

    var virtualIndex = 0;
    if(effect.type=="logo" || effect.type=="text"){
        postionSet.forEach((v, i)=>{

            var vm = virtualMeshRandom[i], icon = iconMesh[i];
            // console.log(vm, icon , i);
            if(vm==null){
                return false;
            }

            if(icon!=null){
                icon.op = vm.op;
                icon.np = vm.op.clone().multiplyByFloats(30*Math.random(), 30*Math.random(),30*Math.random());
                vm.v = 0;

                icon.mesh.scaling = new BABYLON.Vector3(iconFixScale,iconFixScale,iconFixScale);
            }
            else{
                vm.v = 1;
            }

        });
    }
    else{
        postionSet.forEach((v, i)=>{
            var myBox;
            if(iconMesh[i]==null){
                myBox = curVm[virtualIndex++];
                myBox.v = 1;
            }
            else{
                myBox = iconMesh[i];
                myBox.mesh.scaling = new BABYLON.Vector3(iconFixScale,iconFixScale,iconFixScale);
            }

            if(myBox==null){
                return false;
            }
            
            myBox.op = v;
            myBox.np = v;

        });
    }


    return {
        maxPos:maxPos,
        minPos:minPos
    }
}

//播放指定的签到效果
function playSign(curRunParam, curPage, directIndex, callBack){
    var index = curRunParam.startFuncIndex;
    var scene = curRunParam.instance;
    var easingFunction = new BABYLON.CircleEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    var virtualMesh = curRunParam.virtualMesh, iconMesh = curRunParam.iconMesh;

    //如果头像图片数量大于当前页头像形状则添加差额部分
    let iconData = curRunParam.parent.iconData;
    if(iconData.length>iconMesh.length){
        let newData = iconData.slice(iconMesh.length, iconData.length);
        initialSignIconMesh(curRunParam, curPage, newData);
    }

    if(curRunParam.TransformNode){
        curRunParam.TransformNode.dispose(true);
    }

    curRunParam.TransformNode = new BABYLON.TransformNode("root", scene); 

    var curVm = [];
    if(virtualMesh!=null && index!=null && virtualMesh.length>1){
        curVm = virtualMesh[index];  
        if(curVm!=null){
            curVm.forEach(item=>{
                var m = item.mesh;
                var newPos = m.position.clone().multiplyByFloats(30*Math.random(),30*Math.random(),30*Math.random());
                BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 30, m.position, newPos, 2, easingFunction, function(){
                    m.getChildMeshes()[0].visibility = 0;
                    // item.op = item.np;
                    item.np = newPos;
                    item.v = 0;
                });
            });
        }
    }

    if(directIndex==null){
        if(index==null || index+1>=virtualMesh.length){
            curRunParam.startFuncIndex = 0;
        }
        else{
            curRunParam.startFuncIndex = index+1;
        }
    }
    else{
        curRunParam.startFuncIndex = directIndex;
    }


    index = curRunParam.startFuncIndex;
    curVm = virtualMesh[index];

    var curEffectConfig = curPage.functionParam.effectList[index];
    var ret = reCalculateSignPositionAndSize(iconMesh, curVm, curEffectConfig);//计算头像和虚拟头像的新位置，并调整头像的大小

    curRunParam.maxPos = ret.maxPos;
    curRunParam.minPos = ret.minPos;
    curRunParam.param["positionY"] = 0;
    curRunParam.param["rotationY"] = 0;
    curRunParam.curEffectType = curEffectConfig.type;

    setTimeout(() => {
        if(curVm!=null){
            curVm.forEach(item=>{
                var m = item.mesh;
                m.parent = curRunParam.TransformNode;
                m.getChildMeshes()[0].visibility = item.v;
                if(item.v==1){
                    BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 30,item.np, item.op, 2, easingFunction);
                }
                
                // console.log(m, item.v, m.visibility);
            });
        }

        iconMesh.forEach(item=>{
            var m = item.mesh;
            if(item.border){
                item.border.dispose();
            }
            m.parent = curRunParam.TransformNode;
            m.getChildMeshes()[0].visibility = 1;
            BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 30,m.position, item.op, 2, easingFunction);
        });

        if(typeof(callBack)=="function"){
            callBack();
        }

    }, 0);

}


function clearCurpageFunctionModel(type, curRunParam, page, canvas2D){
    clearTimeout(window.msScrollScreenTimeout);
    clearTimeout(window.msSignTimeout);

    var camera = curRunParam.camera;
    if(type=="sign"){
        var iconMesh = curRunParam.iconMesh, virtualMesh = curRunParam.virtualMesh;
        if(iconMesh!=null){
            iconMesh.forEach((m)=>{
                var mesh = m.mesh;
                mesh.dispose();
            });
        }
    
        if(virtualMesh!=null){
            virtualMesh.forEach((mlist)=>{
                mlist.forEach((m)=>{
                    var mesh = m.mesh;
                    mesh.dispose(false, true);
                });
            });
        }
    
        curRunParam.iconMesh = [];
        curRunParam.virtualMesh = [];

        if(curRunParam.TransformNode){
            curRunParam.TransformNode.dispose();
        }

        camera.alpha =  Math.PI/2;
        camera.beta =  Math.PI/2;
        camera.radius =  20;
    }
    else if(type=="lottery"){
        var scene = curRunParam.instance;
        scene.meshes.forEach((mesh)=>{
            if(mesh.name.indexOf("lottery")>-1){
                mesh.dispose(true, true);
            }
        });

        if(curRunParam.controll!=null && curRunParam.controll["lotteryObject"]!=null){
            var sList = curRunParam.controll["lotteryObject"];
            Object.keys(sList).forEach((key)=>{
                var m = sList[key];
                if(m!=null){
                    m.dispose(true, true);
                }
            });
        }

        if(curRunParam.camera!=null){
            curRunParam.camera.beta = Math.PI / 2;
        }

        clearLottery();

        camera.alpha =  Math.PI/2;
        camera.beta =  Math.PI/2;
        camera.radius =  20;
        
    }
    else if(type=="scrollScreen"){
        if(canvas2D==null){
            return;
        }

        canvas2D.getObjects().forEach(o=>{
            console.log(o, o.type);
            if(o.type=="scrollScreenAggregate" || o.type=="zTextGroup" || o.type=="scrollScreenBroadcast"){
                // o._objects.forEach(function(object) {
                //     object.remove();;
                // });
                canvas2D.remove(o);
            }
        });

        canvas2D.requestRenderAll();
    }
    // console.log(curRunParam.backScene);
}


//初始化页维度的签到缓存，例如头像物体，环境材质等
function initialSignPage(curRunParam, page){
    var iconData = curRunParam.parent.iconData;

    // if(iconData==null || iconData.length==0){
    //     return;
    // }

    // if(curRunParam.iconMesh==null){
    //     curRunParam.iconMesh = [];
    // }

    // var scene = curRunParam.backScene;
    // var param = page.functionParam;

    // curRunParam.signRadius = getSignIconRadius(page);
    // curRunParam.changeTime = param.changeTime;
    // curRunParam.isReady = true;

    // iconData.forEach((item, i)=>{
    //     var mesh = createAvatar("avatar_"+ curRunParam.pageId +i, scene, item.texture.clone(), 1.5, curRunParam.signRadius, 0.05);
    //     curRunParam.iconMesh.push({
    //         mesh: mesh,
    //         op: new BABYLON.Vector3(0, 0, 0),
    //         np: new BABYLON.Vector3(0, 0, 0),
    //         scale:1,
    //     });
    // });

    initialSignIconMesh(curRunParam, page, iconData)

    initialSignVirtualMesh(curRunParam, page);

}

//初始化实体头像
function initialSignIconMesh(curRunParam, page, iconData, borderEffect){
    if(iconData==null || iconData.length==0){
        return;
    }

    if(curRunParam.iconMesh==null){
        curRunParam.iconMesh = [];
    }

    var scene = curRunParam.instance;
    var param = page.functionParam;

    curRunParam.signRadius = getSignIconRadius(page);
    curRunParam.changeTime = param.changeTime;
    curRunParam.isReady = true;

    var newIconMesh = [];
    var spriteManagerIconBorder, spriteManagerIconLight
    if(borderEffect!=null){
        spriteManagerIconBorder = new BABYLON.SpriteManager("spriteManagerIconBorder1", "./static/source/sprite/border2.png", iconData.length, {width: 128, height: 128}, scene);
    }

    iconData.forEach((item, i)=>{
        var mesh = createAvatar("avatar_"+ curRunParam.pageId +i, scene, item.texture.clone(), 1.5, curRunParam.signRadius, 0.05);

        var o = {
            mesh: mesh,
            op: new BABYLON.Vector3(0, 0, 0),
            np: new BABYLON.Vector3(0, 0, 0),
            scale:1,
        }

        if(borderEffect!=null){
            var s = createIconSpriteEffect(spriteManagerIconBorder, {
                from:0,
                to:30,
                loop:true,
                delay:100,
                size:2.3
            });
            o.border = s;
        }

        curRunParam.iconMesh.push(o);
        newIconMesh.push(o);
    });

    return newIconMesh;
}

//初始化虚拟mesh，贴图和mesh统一生成
function initialSignVirtualMesh(curRunParam, page){
    if(curRunParam.virtualMesh==null){
        curRunParam.virtualMesh = [];
    }

    curRunParam.startFuncIndex = null;

    var eft = page.functionParam.effectList;

    if(eft==null){
        return;
    }
    

    var scene = curRunParam.instance;
    var param = page.functionParam;

    // 获取页面的设置·
    curRunParam.signRadius = getSignIconRadius(page);
    curRunParam.changeTime = param.changeTime;

    var iconRadius = curRunParam.signRadius;

    // var virtualTexture = this.virtualTexture;
    // virtualTexture = virtualTexture==null?this.defaultVirtualTexture:virtualTexture;

    var defaultVirtualTexture = new BABYLON.Texture(mengshuBase64, scene);
    
    eft.forEach((item, i)=>{

        var virtualTexture = item.imageAvatarUrl;
        if(virtualTexture!=null && virtualTexture.length>0){
            virtualTexture = new BABYLON.Texture(virtualTexture, scene);
        }
        else{
            virtualTexture = defaultVirtualTexture;
        }
       
        var color;

        curRunParam.virtualMesh[i] = [];

        var reflectionTexture = curRunParam.reflectionTexture.clone();

        if(item.type=="logo" || item.type=="text"){
            var iconPosition = item.iconPosition;
            if(iconPosition==null){
                return false;
            }

            iconPosition.forEach((pos, pindex)=>{
                var rgb = pos.rgba, c, color;
                if(rgb!=null){
                    c = "rgba("+ rgb[0] + ","+ rgb[1] + ","+ rgb[2] + ","+ rgb[3] + ")";
                }

                if(item.type=="logo"){
                    color = item.imageAvatarAuto?(c==null?item.imageAvatarColor:c):item.imageAvatarColor;
                }
                else{
                    color = c;
                }
                //1.5, curRunParam.signRadius, 0.05

                var mesh = createAvatar("avatar_virtual_p" + i + "_m" + pindex, scene, virtualTexture, item.scale, iconRadius, 0.08, "gold", reflectionTexture, changeColorToBabylonFormat(color));

                mesh.getChildMeshes()[0].visibility = 0;

                curRunParam.virtualMesh[i].push({
                    mesh: mesh,
                    op: new BABYLON.Vector3(pos.x, pos.y+4, pos.z),
                    np: new BABYLON.Vector3(0, 0, 0),
                    v:0,
                });
            });
            
        }
        else{
            for(var a=0;a<100;a++){
                var mesh = createAvatar("avatar_virtual_p" + i + "_m" + a, scene, virtualTexture, 1.5, iconRadius, 0.08, "gold", reflectionTexture, null);

                mesh.getChildMeshes()[0].visibility = 0;

                curRunParam.virtualMesh[i].push({
                    mesh: mesh,
                    op: new BABYLON.Vector3(0, 0, 0),
                    np: new BABYLON.Vector3(0, 0, 0),
                    v:0,
                });
            }
        }

        
    });
}

function changeColorToBabylonFormat(rgb){
    var va = rgbOrRgbaToArray(rgb);
    for(var i=0;i<va.length;i++){
        va[i] = Math.round(va[i]*100/255)/100;
    }
    return new BABYLON.Color3(va[0],va[1],va[2]);
}

function rgbOrRgbaToArray(colorString) {
    if(colorString==null || colorString.length==0){
        return [];
    }
    var colorString = colorString.toLocaleLowerCase();
    var rgbOrgbaJudgeTag = /^([^\(]+)\([^\)]+\)$/i;
    var aaa = rgbOrgbaJudgeTag.exec(colorString);
    if (aaa !== null) {
        if (aaa[1].trim() === "rgb") {
            var str = colorString;
            var strTag = /^rgb[a]*\s*\(([^,]+),([^,]+),([^\)]+)\)$/i;
            var result = strTag.exec(str);
            if (result === null || result[1].trim() === "" || result[2].trim() === "" || result[3].trim() === "") {
                return null;
            }
            var returnArray = [];
            for (var i = 1; i <= result.length - 1; i++) {
                returnArray[i - 1] = Number(result[i].trim());
            }
            return returnArray;
        } else if (aaa[1].trim() === "rgba") {
            var str = colorString;
            var strTag = /^rgb[a]*\s*\(([^,]+),([^,]+),([^,]+),([^\)]+)\)$/i;
            var result = strTag.exec(str);
            if (result === null || result[1].trim() === "" || result[2].trim() === "" || result[3].trim() === "") {
                return null;
            }
            var returnArray = [];
            for (var i = 1; i <= result.length - 1; i++) {
                returnArray[i - 1] = Number(result[i].trim());
            }
            return returnArray;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

//在签到的全局参数里缓存头像贴图，有新加入的头像也使用这个方法加入新贴图
function initialIconTexture(engine, iconData, iconDataTexture){
    if(iconData.length==0){
        return;
    }

    if(iconDataTexture.length==0){
        for(var i=0;i<iconData.length;i++){
            var item = iconData[i];
            if(item!=null){
                iconDataTexture.push(
                    {
                        "texture":new BABYLON.Texture(item.icon, engine)
                    }          
                );
            }
            
        }
    }
    else if(iconDataTexture.length < iconData.length){
        var minusCount = iconData.length - iconDataTexture.length;
        var len = iconDataTexture.length+minusCount;
        for(var i=iconDataTexture.length;i<len;i++){
            var item = iconData[i];
            if(item!=null){
                iconDataTexture.push(
                    {
                        "texture":new BABYLON.Texture(item.icon, engine)
                    }          
                );
            }
        }
    }
}

// function iniVirtualIcon(curRunParam, page){
//     var iconRadius = getSignIconRadius(page);
//     var type = page.functionType, effect = page.functionEffect, param = page.functionParam;
//     var babylon = curRunParam.parent;
//     var iconData = babylon.iconData;
//     var pageId = curRunParam.pageId;
//     var scene = curRunParam.backScene;

//     var defaultIconCount = param.defaultIconCount;
//     if(defaultIconCount==null){
//         if(effect=="logo"){
//             defaultIconCount = 400;
//         }
//         else{
//             defaultIconCount = 100;
//         }
//     }

//     curRunParam.defaultIconCount = defaultIconCount;

//     if(param.iconPosition!=null){
//         curRunParam.iconPosition = param.iconPosition.shuffle();
//     }
    

//     if(iconData.length>defaultIconCount){
//         return;
//     }

//     if(curRunParam.virtualIcon==null){
//         curRunParam.virtualIcon = [];
//     }

//     defaultIconCount = defaultIconCount - iconData.length;

//     if(param.virtualIcon==null){
//         param.virtualIcon = mengshuBase64;
//     }

//     var virtualTexture = new BABYLON.Texture(param.virtualIcon, scene);

//     for(var i=0;i<defaultIconCount;i++){
//         var myBox = createAvatar("avatar_virtual_"+ pageId +i, scene, virtualTexture.clone(), param.scale, iconRadius, 0.08, "gold", curRunParam.reflectionTexture);
//         myBox.visibility = 0;
//         curRunParam.virtualIcon.push(myBox);
//     }

// }

// function iniSignAvatar(curRunParam, iconRadius, scale){

//     var isNewItem = false;

//     var babylon = curRunParam.parent;
//     var data = babylon.iconData;
//     var pageId = curRunParam.pageId;
//     var scene = curRunParam.backScene;

//     if(scale==null){
//         scale = 1.5;
//     }

//     for ( var i = 0, l = data.length; i < l; i ++ ) {
//         if(data[i][pageId]!=null){
//             continue;
//         }
//         var myBox = createAvatar("avatar_"+ pageId +i, scene, data[i].texture.clone(), scale, iconRadius, 0.05);
//         data[i][pageId] = myBox;
//         isNewItem = true;
//     }

//     return isNewItem;

// }

function createAvatar(name, scene, iconTexture, scale, radius, depth, virtualMode, virtualHdr, virtualIconColor){
    var ratioAr = 1;
    var scaleAr = scale==null?1.5:scale;

    var width = scaleAr;
    var height = scaleAr* ratioAr;
    var depth = depth==null?0.03:depth;

    var radius = radius==0?0:(width / (radius==null?10:radius)); // corner radius;

    var deltaAngle = Math.PI / 16;

    //Polygon shape in XoZ plane held in array
    var shape = [];

    //bottom edge
    shape.push(new BABYLON.Vector3(-width/2 + radius, 0, -height / 2));
    shape.push(new BABYLON.Vector3(width/2 - radius, 0, -height / 2)); 
    //bottom right corner
    for(var angle = -Math.PI / 2 + deltaAngle; angle < 0; angle +=deltaAngle) {
        shape.push(new BABYLON.Vector3(width/ 2 - radius + radius * Math.cos(angle), 0, -height / 2 + radius + radius * Math.sin(angle)));
    }
    //right edge;
    shape.push(new BABYLON.Vector3(width/2, 0, -height / 2 + radius));
    shape.push(new BABYLON.Vector3(width/2, 0, height / 2 - radius));
    //top right corner
    for(var angle = deltaAngle; angle < Math.PI; angle +=deltaAngle) {
        shape.push(new BABYLON.Vector3(width/ 2 - radius + radius * Math.cos(angle), 0, height / 2 - radius + radius * Math.sin(angle)));
    }
    //top edge
    shape.push(new BABYLON.Vector3(width/2 - radius, 0, height / 2));
    shape.push(new BABYLON.Vector3(-width/2 + radius, 0, height / 2));
    //top left corner
    for(var angle = Math.PI / 2 + deltaAngle; angle < Math.PI; angle +=deltaAngle) {
        shape.push(new BABYLON.Vector3(-width/ 2 + radius + radius * Math.cos(angle), 0, height / 2 - radius + radius * Math.sin(angle)));
    }
    //left edge;
    shape.push(new BABYLON.Vector3(-width/2, 0, height / 2 - radius));
    shape.push(new BABYLON.Vector3(-width/2, 0, -height / 2 + radius));
    //bottom left corner
    for(var angle = Math.PI + deltaAngle; angle < 3 * Math.PI / 2; angle +=deltaAngle) {
        shape.push(new BABYLON.Vector3(-width/ 2 + radius + radius * Math.cos(angle), 0, -height / 2 + radius + radius * Math.sin(angle)));
    }

    var faceUV = [];
    faceUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
    faceUV[2] = new BABYLON.Vector4(0, 0, 1, -1);
    var polygon = BABYLON.MeshBuilder.ExtrudePolygon(name, {shape:shape, depth: depth, faceUV:faceUV, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene,MyEarcut);


    if(virtualMode=="gold"){
        var envir = new BABYLON.PBRMaterial(name + "_envir", scene);
        if(virtualIconColor==null){
            virtualIconColor = new BABYLON.Color3(1.0, 0.766, 0.336);
        }
        envir.albedoColor = virtualIconColor;
        envir.reflectivityTexture = iconTexture;
        envir.reflectivityColor = virtualIconColor;
        envir.microSurface = 1.0; // Let the texture controls the value 
        if(virtualHdr!=null){
            envir.reflectionTexture = virtualHdr;
        }
        
        polygon.material = envir;  
    }
    else{
        var material = new BABYLON.StandardMaterial(name+"_icon", scene);
        // material.diffuseTexture = new BABYLON.Texture(iconLiu, scene);
        material.specularTexture = iconTexture;
        material.emissiveTexture = iconTexture;
        material.ambientTexture = iconTexture;

        polygon.material = material;  
    }


    var CoT = new BABYLON.TransformNode("root", scene); 
    polygon.parent = CoT;
    polygon.rotate(BABYLON.Axis.X, -Math.PI/2);
    // polygon.rotate(BABYLON.Axis.Z, Math.PI/2);


    // var highlight = scene.getHighlightLayerByName("highlight_default");
    // if(highlight){
    //     highlight.addMesh(polygon, new BABYLON.Color4(1,1,1));
    // }

    return CoT;
}

function createIconSpriteEffect(borderManager, option){
    var border = new BABYLON.Sprite("borderplayer", borderManager);
    border.playAnimation(option.from || 0, option.to || 30, option.loop || true, option.delay || 100);
    border.size = option.size || 1;
    border.isVisible = false;

    return border;
}

function removeIconPreview(previewId, callBack){
    var canvas2d = getCanvas();
    var objects = canvas2d.getObjects();

    for(var i=0;i<objects.length;i++){
        var item = objects[i];
        if(item.msItemID==previewId){
            item.animate('scaleY', 0, {
              duration: 2100,
              easing: fabric.util.ease.easeInQuart,
              onComplete:function(){
                canvas2d.remove(item);
                canvas2d.requestRenderAll();

                if(typeof(callBack)=="function"){
                    callBack();
                }
              }
            });

            item.animate('scaleX', 0.1, {
              duration: 2000,
              easing: fabric.util.ease.easeInQuart
            });
            break;
        }
    }
}

function addIconPreview(newIcon, curParam, callBack) {
    var canvas2d = getCanvas();
    var previewId = "msAddIconPreviewObject";
    var viewWidth = getState('common', 'canvasSetting.viewWidth');
    var viewHeight = getState('common', 'canvasSetting.viewHeight');
    var viewOriginX =  getState('common', 'canvasSetting.viewOriginX');
    var viewOriginY =  getState('common', 'canvasSetting.viewOriginY');
    var curzoom =  getState('common', 'canvasSetting.curzoom');

    fabric.Image.fromURL(functionSourceUrlPrefix+"/sign/"+'background.png', function(backgroundImage) {
        fabric.Image.fromURL(functionSourceUrlPrefix+"/sign/"+'word.png', function(wordImage) {
            var group = new fabric.Group([backgroundImage, wordImage],{
                originX:"center",
                originY:"center",
                left:viewWidth/2 + viewOriginX,
                top:viewHeight/2 + viewOriginY,
                msItemID:previewId,
                evented:false,
            });

            wordImage.originX = "center";
            wordImage.left = 0;

            canvas2d.add(group);

            group.scaleX = 0.1;
            group.scaleY = 0.1;


            group.animate('scaleY', 1, {
              duration: 2000,
              easing: fabric.util.ease.easeOutBounce,
              onChange: canvas2d.requestRenderAll.bind(canvas2d),
            });

            group.animate('scaleX', 1, {
              duration: 2000,
              easing: fabric.util.ease.easeOutBounce,
              onChange: canvas2d.requestRenderAll.bind(canvas2d),
            });

            var iconLen = newIcon.length;
            newIcon.forEach((item, index)=>{
                fabric.Image.fromURL(item.icon, function(iconImage) {

                    fabric.Sprite.fromURL(functionSourceUrlPrefix+"/sprite/"+'border2.png', function(borderSprite) {
                        group.add(iconImage);
                        group.add(borderSprite);
                        wordImage.originX = "center";
                        wordImage.originY = "center";
                        borderSprite.originX = "center";
                        borderSprite.originY = "center";

                        iconImage.scaleX = 120/iconImage.width;
                        iconImage.scaleY = 120/iconImage.width;

                        var rowIndex = Math.floor(index/5), colIndex = index%5;
                        iconImage.top += (rowIndex%2==0?-1:1)*Math.ceil(rowIndex/2)*140-30;
                        iconImage.left += (colIndex%2==0?1:-1)*Math.ceil(colIndex/2)*160-60;

                        borderSprite.scaleX = 190/borderSprite.spriteWidth;
                        borderSprite.scaleY = 190/borderSprite.spriteHeight;

                        // borderSprite.width = 140;
                        // borderSprite.height = 140;
                        // borderSprite.frameTime = 200;

                        borderSprite.top = iconImage.top+20;
                        borderSprite.left = iconImage.left;

                        borderSprite.play();

                    }, {
                        spriteWidth:128,
                        spriteHeight:128,
                        frameTime:100,
                    });

                    if(iconLen>10){
                        
                    }
                    else if(iconLen>5){

                    }
                    else if(iconLen<=5){
                        
                    }
                    

                    if(typeof(callBack)=="function"){
                        callBack();
                    }

                });
            });

        });
    });

    return previewId;
}

function addItemToScene(curRunParam, curPage, newIconMesh){
    var virtualMesh = curRunParam.virtualMesh, iconMesh = curRunParam.iconMesh;
    var easingFunction = new BABYLON.CircleEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    var index = curRunParam.startFuncIndex;

    // index = curRunParam.startFuncIndex;
    var curVm = virtualMesh[index];

    var curEffectConfig = curPage.functionParam.effectList[index];

    var scale = curEffectConfig.scale;
    var iconFixScale = 1;
    if(scale!=null){
        iconFixScale = scale/1.5;
    }


    if(curRunParam.secondCamera){
        curRunParam.secondCamera.dispose();
        curRunParam.instance.activeCameras = [];
    }

    if(curEffectConfig.type=="logo" || curEffectConfig.type=="text"){

        var index = 0;
        curVm.shuffle();
        curVm.forEach(m=>{
            if(m.v==1){
                var n = newIconMesh[index];
                if(n==null){
                    return false;
                }
                n.op = m.op;
                n.np = m.np;
                // n.mesh.scaling = new BABYLON.Vector3(iconFixScale,iconFixScale,iconFixScale);
                m.v = 0;
                m.mesh.getChildMeshes()[0].visibility = 0;
                index++;
            }
        });

        if(index<newIconMesh.length){//虚拟logo不足，覆盖实际logo
            var n = newIconMesh.length - index, a = 0;
            for(var i=0;i<iconMesh.length;i++){
                var n = newIconMesh[index+a];
                var exitsIcon = iconMesh[i];

                if(exitsIcon.mesh.visibility==0){
                    continue;
                }

                a++;

                n.op = exitsIcon.op;
                n.np = exitsIcon.np;
                // n.mesh.scaling = new BABYLON.Vector3(iconFixScale,iconFixScale,iconFixScale);

                exitsIcon.mesh.visibility = 0; //隐藏老的logo

                if(a==n){
                    break;
                }
            }
        }
    }
    else{
        if(iconMesh.length>=100){
            var ret = reCalculateSignPositionAndSize(iconMesh, curVm, curEffectConfig);//计算头像和虚拟头像的新位置，并调整头像的大小
            curRunParam.maxPos = ret.maxPos;
            curRunParam.minPos = ret.minPos;

            if(curVm!=null){
                curVm.forEach(item=>{
                    var m = item.mesh;
                    m.parent = curRunParam.TransformNode;
                    m.getChildMeshes()[0].visibility = 0;
                    // if(item.v==1){
                    //     BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 30,item.np, item.op, 2, easingFunction);
                    // }

                    // console.log(m, item.v, m.visibility);
                });
            }

            iconMesh.forEach(item=>{
                var m = item.mesh;
                if(item.border){
                    item.border.dispose();
                }
                m.parent = curRunParam.TransformNode;
                m.getChildMeshes()[0].visibility = 1;
                BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 30,m.position, item.op, 2, easingFunction);
            });
        }
        else {
            var index = 0;
            curVm.shuffle();
            curVm.forEach(m=>{
                if(m.v==1){
                    var n = newIconMesh[index];
                    if(n==null){
                        return false;
                    }
                    n.op = m.op;
                    n.np = m.np;
                    m.v = 0;
                    m.mesh.getChildMeshes()[0].visibility = 0;
                    index++;
                }
            });
        }
    }




    newIconMesh.forEach(item=>{
        var m = item.mesh;

        m.getChildMeshes()[0].layerMask = 0x0FFFFFFF;
        m.scaling = new BABYLON.Vector3(iconFixScale,iconFixScale,iconFixScale);
        m.parent = curRunParam.TransformNode;
        m.getChildMeshes()[0].visibility = 1;
        if(item.border){
            item.border.dispose();
        }

        BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 60,m.position, item.op, 2, easingFunction);
    });

    // var ret = reCalculateSignPositionAndSize(iconMesh, curVm, curEffectConfig);//计算头像和虚拟头像的新位置，并调整头像的大小

    // curRunParam.maxPos = ret.maxPos;
    // curRunParam.minPos = ret.minPos;

    // newIconMesh.forEach(m={

    // });
}

export {
    lotteryPlaySphere,
    lotteryPlayHelix,
    // changeSignType,
    // iniSignAvatar,
    initialIconTexture,
    getSignIconRadius,
    // iniVirtualIcon,
    createAvatar,
    playSign,
    initialSignPage,
    rgbOrRgbaToArray,
    // refreshSignPage,
    clearCurpageFunctionModel,
    addItemToScene,
    initialSignIconMesh,
    addIconPreview,
    removeIconPreview,
    playLottery,
    clearLottery
}