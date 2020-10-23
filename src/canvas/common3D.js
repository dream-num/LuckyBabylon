import {
    getState,
    commitCommonMutations,
    getCanvas,
    getOrderPageList,
} from './common';

import { lotteryPlaySphere, lotteryPlayHelix,initialIconTexture, getSignIconRadius, rgbOrRgbaToArray, changeColorToBabylonFormat, initialSignPage,playSign, clearCurpageFunctionModel, addItemToScene,initialSignIconMesh, addIconPreview,removeIconPreview, playLottery,clearLottery} from './function3D';

import {flareBase64,mengshuBase64,default3DUrl} from '../data/babylonData';

import store from '@/store/index.js';

import pako from 'pako/dist/pako';
import { isMobileAgent } from '../utils/util';


function commitCanvas3DMutationsUpdate (key, value){
    store.commit('canvas3D/commonMutationsUpdate', { updateProperty: key, value: value});
}

function getBabylonInstance() {
    var sliderCanvas3D = document.getElementById("sliderCanvas3D");
    if(sliderCanvas3D!=null){
        var babylon = sliderCanvas3D.babylon;
        if(babylon!=null){
            return babylon;
        }
    }

    return null;
}

function getBabylonCurScene() {
    var curPage = getState('page', 'curPage');
    var babylon = getBabylonInstance();
    if(babylon!=null){
        var curScene = babylon.scene[curPage.pageId];
        if(babylon!=null && curScene!=null){
            return curScene;
        }
    }
    return null;
}

function staticCanvas3DRefresh(callBack){
    var staticCanvas = document.getElementById("sliderCanvas").staticCanvas;

    if(staticCanvas==null){
        return;
    }

    setTimeout(() => {
        var promise = null;
        var keys = Object.keys(staticCanvas);
        keys.forEach((key, index)=>{
            var c = staticCanvas[key];
            if(index==0){
                promise = staticCanvas3DRefreshBypageId(key, true);
            }
            else {
                promise = promise.then(() => {
                    return staticCanvas3DRefreshBypageId(key, true);
                });
            }
        });

        promise.then(() => {
            if(typeof(callBack)=="function"){
                callBack();
            }
        });
    }, 0);
   
}

function staticCanvas3DRefreshBypageId(pageId, isOffline){
    return new Promise((resolve, reject) => {
        var staticCanvas = document.getElementById("sliderCanvas").staticCanvas;
        var babylon = getBabylonInstance();

        var pages = getState('page', 'pages');
        var curPage = getState('page', 'curPage');

        var screenMode = "offline";

        if(pageId==null || curPage.pageId==pageId){
            pageId = curPage.pageId;
            screenMode = "online";
        }

        // if(!isOffline && pageId != curPage.pageId){
        //     return;
        // }

        if(staticCanvas==null || babylon==null){
            return;
        }

        var curStaticCanvas = staticCanvas[pageId];
        if(curStaticCanvas==null){
            return;
        }

        var curScene = babylon.scene[pageId];

        if(curScene==null){
            return;
        }

        var engine = babylon.engine;
        var cscWidth = curStaticCanvas.width, cscHeight = curStaticCanvas.height, cscZoom = curStaticCanvas.getZoom();

        curScene.auxLineSystem.visibility = 0;

        // if(isOffline){
            for(var i=0;i<8;i++){
                curScene.instance.render();
            }
        // }
    
        var callback = function(img){
            var imgInstance = new fabric.Image(img);
            curStaticCanvas.setBackgroundImage(imgInstance, curStaticCanvas.requestRenderAll.bind(curStaticCanvas),{
                top:0,
                left:0,
                width: cscWidth/cscZoom,
                height: cscHeight/cscZoom,
            });
            // console.log(pageId,curStaticCanvas,curScene);
            resolve("截图完成");
            if(getState('canvas3D', 'is3DMode')){
                curScene.auxLineSystem.visibility = 1;
            }
            // console.log(base64);
        }

        // var back2d = null, curp = pages.get(pageId);
        // if(!curp.is3D && curp.background2D!=null && curp.background2D.length>0){
        //     back2d = curp.background2D;

        // }


        // if(location.search){ //本地项目不截图
        //     screenShootBabylonOffline(engine, curScene.camera, callback);
        // }
        screenShootBabylonOffline(engine, curScene.camera, callback);
    
        // if(isOffline){
        //     // screenShootBabylonOnline(engine, 0.5, callback);
        //     screenShootBabylonOffline(engine, curScene.backCamera, curScene.camera, callback);
        // }
        // else{
        //     // screenShootBabylonOffline(engine, 0.5, curScene.backCamera, curScene.camera, callback);
        //     screenShootBabylonOnline(engine, 0.5, callback);
        // }
    });
    
}

function screenShootBabylonOnline(engine, sizeRatio, callBack){
    if(sizeRatio==null){
        sizeRatio = 0.5;
    }
    var canvasW = engine.getRenderWidth(), canvasH = engine.getRenderHeight();
    var size = {
        width: Math.round(canvasW*sizeRatio),
        height:Math.round(canvasH*sizeRatio)
    }

    // var canvas = document.createElement("canvas");
    // canvas.width = canvasW;
    // canvas.height = canvasH;
    // canvas.id = "test111";
    // canvas.style.position = "absolute";
    // canvas.style.zIndex = "1111";
    // document.getElementsByTagName("body")[0].appendChild(canvas);
    // var context = canvas.getContext("2d");

    // context.drawImage(engine.getRenderingCanvas() , 0 , 0 , canvasW , canvasH, 0, 0, canvasW, canvasH);

    // var base64 = canvas.toDataURL("image/png");

    // var img = document.createElement('img');
    // img.src = base64;

    // img.onload =function() {
    //     if(typeof(callBack)=="function"){
    //         callBack(img);
    //     }
    // }

    BABYLON.Tools.DumpFramebuffer(canvasW, canvasH, engine, function(data){
        var img = document.createElement('img');
        img.src = data;
        img.onload =function() {
            if(typeof(callBack)=="function"){
                callBack(img);
            }
        }
    });

}

function screenShootBabylonOffline(engine, camera, callBack){

    if(camera!=null){
        BABYLON.Tools.CreateScreenshot(engine, camera, {precision: 0.5}, function(data) {

            const img = document.createElement('img');
            img.src = data;
            img.onload =function() {
                if(typeof(callBack)=="function"){
                    callBack(img);
                }
            }
           
        });
    }

    // if(sizeRatio==null){
    //     sizeRatio = 0.5;
    // }
    // var size = {
    //     width: Math.round(engine.getRenderWidth()*sizeRatio),
    //     height:Math.round(engine.getRenderHeight()*sizeRatio)
    // }
    // if(backCamera==null){
        // BABYLON.Tools.CreateScreenshot(engine, camera, {precision: 0.5}, function(data) {
        //     var img = document.createElement('img');
        //     img.src = data;
        //     img.onload =function() {
        //         if(typeof(callBack)=="function"){
        //             callBack(img);
        //         }
        //     }
        // });
    // }
    // else{
    //     BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, backCamera, {precision: 0.5}, function(data) {
    //         var img = document.createElement('img');
    //         if(data!=null && data.length<2500 && backUrl!=null){
    //             img.src = backUrl;
    //         }
    //         else{
    //             img.src = data;
    //         }
            
    //         var backImage = img;    
    //         img.onload =function() {       
    //             BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: 0.5}, function(data) {
    //                 var img = document.createElement('img');
    //                 img.src = data;
                    
    //                 var foreImage = img;
    //                 console.log("backImage", backImage.src);
    //                 console.log("foreImage", foreImage.src);
    //                 // console.log(engine, camera);
    //                 img.onload =function() {
    
    //                     var canvas = document.createElement("canvas");
    //                     canvas.width = foreImage.width;
    //                     canvas.height = foreImage.height;
    //                     var context = canvas.getContext("2d");

    //                     // document.getElementsByTagName("body")[0].appendChild(canvas);
    
    //                     context.drawImage(backImage , 0 , 0 , backImage.width , backImage.height);
    //                     context.drawImage(foreImage , 0 , 0 , foreImage.width , foreImage.height);
    
    //                     var base64 = canvas.toDataURL("image/png");

    //                     canvas = null;
    //                     backImage = null;
    //                     foreImage = null;

    //                     // console.log(base64,backImage,foreImage);
    
    //                     var img = document.createElement('img');
    //                     img.src = base64;
    
    //                     img.onload =function() {
    //                         if(typeof(callBack)=="function"){
    //                             callBack(img);
    //                         }
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // }
}


// function getIconTextureData(){
//     var d = document.getElementById('sliderCanvas3D').iconData;
//     if(d==null){
//         return [];
//     }
//     else{
//         return d;
//     }
// }

// function setIconTexture(iconData){
//     document.getElementById('sliderCanvas3D').iconData = iconData;
// }

function setLoadedState(state){
    if(state==null){
        state = false;
    }

    if(state){
        document.getElementById("msLoadingScreen").style.display = "none";
    }
    else{
        document.getElementById("msLoadingScreen").style.display = "flex";
    }

    commitCanvas3DMutationsUpdate("isLoaded", state);
}

function setImageLoadedState(state){
    //value 为FALSE 是关闭imageLoading
    store.commit('common/commonMutationsUpdate', {
        updateProperty: 'imageLoading',
        value: !state,
    });
    commitCanvas3DMutationsUpdate("isLoaded", state);

}

function getLoadedState(){
    var s = getState("canvas3D", "isLoaded");
    if(s==null){
        return false;
    }
    return s;
}

function ini3DSceneList(pages, sceneList, iconData){
    // var ammoPlugin = new BABYLON.AmmoJSPlugin(true, Ammo);

    if(pages==null || pages.length==0){
        return;
    }
    if(sceneList==null || sceneList.length==0){
        return;
    }
    for(var i=0;i<pages.length;i++){

        initialScene(pages, sceneList, i, (index)=>{
            var curParam = sceneList[index];
            var scene = curParam.instance;
            if(index==0){
                // var iconDataTexture = getIconTextureData();
                initialIconTexture(scene.getEngine(), iconData, curParam.parent.iconData);
                // curParam.parent.defaultVirtualTexture = new BABYLON.Texture(mengshuBase64, scene.getEngine());
            }

            if(sceneList[index+1]!=null){
                sceneList[index+1].assetsManager.load();
            }
            else{
                // _this.loading = false;
                // _this.resize();
                // if(typeof(callback)=="function"){
                //     callback(this);
                // }

                staticCanvas3DRefresh(function(){
                    document.getElementById("msLoadingScreenTxt").innerHTML = "开始渲染场景！请稍等";
                    setTimeout(() => {
                        setLoadedState(true);
                    }, 1000);
                });
            }
        });

        if(i==0){
            if(iconData!=null && iconData.length>0){
                for (var a = 0; a < iconData.length; a++) {
                    var item = iconData[a];
                    sceneList[i].assetsManager.addImageTask("iconLoad" + a, item.icon);
                }
            }
        }

    }

    sceneList[0].assetsManager.load();
}


function initialScene(pages, sceneList, i, callBackF){
    var page = pages[i];
    var curScene = sceneList[i];
    var scene = curScene.instance, camera = curScene.camera;
    var canvas = scene.getEngine().getRenderingCanvas();
    var default3D = default3DUrl;

    var curIndex = i;

    var assetsManager = new BABYLON.AssetsManager(scene);

    if(page.functionType=="sign"){
        camera.beta = Math.PI / 2;

        // camera.attachControl(canvas, false);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        light.intensity = 0.9;

        console.log(scene.lights);

        // camera.attachControl(this.canvas, false);

        // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        // light.intensity = 0.9;  

        // var hl1 = new BABYLON.HighlightLayer("highlight_default", scene);
        // hl1.blurVerticalSize = 0.2;
        // hl1.blurHorizontalSize = 0.2;
        // hl1.innerGlow = false;

    }
    else if(page.functionType=="lottery"){

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        light.intensity = 0.9;
        
        if(page.functionEffect=="暂定呵呵呵"){

        }
        else {
            // camera = new BABYLON.ArcRotateCamera("camera_default", Math.PI/2, Math.PI * 3 / 8, 30, new BABYLON.Vector3(0, 4, 0), scene);

            camera.beta = Math.PI * 3 / 8;

            // camera.attachControl(canvas, false);
            // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(8, 8, 0), scene);
            // light.intensity = 0.9;

            scene.enablePhysics(null, new BABYLON.AmmoJSPlugin(true, Ammo));
        }
    }
    else{
        
        // camera = new BABYLON.ArcRotateCamera("camera_default", Math.PI/2, Math.PI / 2, 30, new BABYLON.Vector3(0, 0, 0), scene);
        // camera.attachControl(canvas, true);
        camera.setTarget(new BABYLON.Vector3(0,0,0));
    }



    camera.attachControl(canvas, false);



    if(page.is3D && (page.background3D!=null && page.background3D.length>0)){
        // assets.push(page.background3D);
        // createEnvironment(page.background3D, scene);
        var hdr = page.background3D;
        var textureTask = createCubeTextureTask(assetsManager, hdr, default3D, i, "background3D");
        textureTask.onSuccess = function(task) {
            var index = task.name.split("_");
            index = parseInt(index[index.length-1]);
            sceneList[index].backgroundTexture = task.texture;
            sceneList[index].reflectionTexture = task.texture;
        }

        // if(page.functionType=="lottery" || page.functionType=="sign"){
        //     var textureTask = createCubeTextureTask(assetsManager, hdr, default3D, i, "reflectionTexture");
        //     textureTask.onSuccess = function(task) {
        //         var index = task.name.split("_");
        //         index = parseInt(index[index.length-1]);
        //         sceneList[index].reflectionTexture = task.texture;
        //     }
        // }
    }
    else if(page.background2D!=null && page.background2D.length>0){
        // assets.push(page.background2D);
        // new BABYLON.Layer('',page.background2D, scene, true);
        var imageTask = assetsManager.addTextureTask("background2D_"+i, page.background2D);
        imageTask.onSuccess = function(task) {
            var index = task.name.split("_");
            index = parseInt(index[index.length-1]);
            sceneList[index].background2DTexture = task.texture;
        }

        if(page.functionType=="lottery" || page.functionType=="sign"){
            var textureTask = assetsManager.addCubeTextureTask("reflectionTexture_"+i, default3D);
            textureTask.onSuccess = function(task) {
                var index = task.name.split("_");
                index = parseInt(index[index.length-1]);
                sceneList[index].reflectionTexture = task.texture;
            }
        }
    }

    if(page.filter!=null && page.filter.ImageProcessingTexture!=null && page.filter.ImageProcessingTexture.colorGradingTexture!=null ){
        var texture = page.filter.ImageProcessingTexture.colorGradingTexture;
        if(texture.length>0){
            // assets.push(texture);
            assetsManager.addBinaryFileTask("ImageProcessingTexture_"+i, texture);
        }
    }


    if(page.particle3D!=null && page.particle3D.length>0){
        if(page.particle3D.indexOf(".json")>-1){
            // assets.push(page.particle3D);
            var particleTask = assetsManager.addTextFileTask("particle3D_"+i, page.particle3D);
            particleTask.onSuccess = function(task) {
                var index = task.name.split("_");
                index = parseInt(index[index.length-1]);
                if(sceneList[index].particle3D==null){
                    sceneList[index].particle3D = [];
                }
                sceneList[index].particle3D.push(task.text);
            }

        }
        // else{
        //     assetsManager.addImageTask("sphereFlare_"+i, _this.urls.root + "flare.png");
        // }
        
    }

    //var particle3D =  document.getElementById('sliderCanvas3D').particle3D;
    if(page.ms3dfUrl!=null && page.ms3dfUrl.length>0){
        let ms3dftask = assetsManager.addTextFileTask("ms3dftask_"+i, page.ms3dfUrl);
        ms3dftask.onSuccess = function(task) {
            var index = task.name.split("_");
            index = parseInt(index[index.length-1]);
            sceneList[index].ms3df = task.text;
        }
    }

    //加载空图片，以便于触发finish事件
    assetsManager.addImageTask("blank_"+i, "static/source/blank.gif");



    assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
        var index;
        if(lastFinishedTask.name.indexOf("iconLoad")>-1){
            index = 0;
        }
        else{
            index = lastFinishedTask.name.split("_");
            index = parseInt(index[index.length-1]);
        }

        var percent = (totalCount - remainingCount)*100/totalCount;

        // document.getElementById("msLoadingScreenBarLoad").style.width = percent + "%";
        // document.getElementById("msLoadingScreenPercent").innerHTML = Math.round(percent) + "%";
        // document.getElementById("msLoadingScreenTxt").innerHTML = '正在加载第'+ (index+1) + "/" + pages.length +'页的资源：' + (totalCount - remainingCount) + ' / ' + totalCount;
       let  zPercentDiv  = document.getElementById("msLoadingScreen")
            .getElementsByClassName('zPercent');
        if(zPercentDiv && zPercentDiv[0]){
            zPercentDiv[0].innerHTML = Math.round(percent) + "%";
        }
    };

    assetsManager.onFinish = function(tasks) {
        var index;
        if(tasks.length==0){
            index = 0;
        }
        else if(tasks[0].name.indexOf("iconLoad")>-1){
            index = 0;
        }
        else{
            index = tasks[0].name.split("_");
            index = parseInt(index[index.length-1]);
        }
        
        var isHdr = false;
        var curParam = sceneList[index];
        var scene = curParam.instance;
        var camera = curParam.camera;

        var page = pages[index];

        if(page.is3D && (page.background3D!=null && page.background3D.length>0)){
            curParam.backgroundInstance = createEnvironment(curParam.backgroundTexture, scene);
            if(page.background3D.indexOf(".hdr")>-1){
                curParam.isHdr = true;
            }
        }
        else if(page.background2D!=null && page.background2D.length>0){
            curParam.backgroundInstance = new BABYLON.Layer('',null, scene, false);
            curParam.backgroundInstance.texture = curParam.background2DTexture;
            curParam.backgroundInstance.isBackground = true;
        }


        if(page.functionType=="lottery"){
            if(page.functionEffect=="sphere"){
                lotteryPlaySphere(curParam);
            }
            else if(page.functionEffect=="helix"){
                lotteryPlayHelix(curParam);
            }
        }
        else if(page.functionType=="sign"){
            // var iconRadius = getSignIconRadius(page);

            // iniVirtualIcon(curParam, page);

            // iniSignAvatar(curParam, iconRadius, page.functionParam.scale);    
            
            // if(page.functionEffect=="random"){
            //     changeSignType(curParam, "sphere", false);
            // }
            // else{
            //     changeSignType(curParam, page.functionEffect, false);
            // }

            initialSignPage(curParam, page);

            // startSign(page);
        }


        if(page.filter!=null){
            createFilterEffect(curParam, page.filter);
        }

        if(page.particle3D!=null && page.particle3D.length>0){
            var param = "default";
            if(curParam.particle3D!=null){
                param = curParam.particle3D;
            }
            createParticle(param, scene, camera);
        }

        if(page.ms3dfUrl!=null && page.ms3dfUrl.length>0 && curParam.ms3df){
            ms3dfParsePlay(curParam.ms3df, curParam, "p");
        }

        
        if(typeof(callBackF)=="function"){
            callBackF(index);
        }
        
    }
    
    curScene.assetsManager = assetsManager;
}

/**
 * 删除页时,删除3D,
 * @param {Array} delPages 
 */
function delPageInital3D(delPages){
    const babylon = getBabylonInstance();

    delPages.forEach((item)=>{
        const pageId = item.pageId;
        babylon.sceneList.some((scene,i)=>{
            if(scene.pageId === pageId){
                const curDelParam = babylon.sceneList.splice(i, 1)[0];

                // curDelParam.instance.dispose();

                delete babylon.scene[pageId];
    
                return scene.pageId === pageId;
            }
        })
    })

    //store新增页已经排序,直接重新设置order
    const sData = getState('page', 'pages');

    babylon.sceneList.forEach((scene)=>{
        scene.order = sData.get(scene.pageId).order;
    })

    babylon.sceneList.sort(function (a, b) {
        if (a.order > b.order) {
            return 1;
        } else {
            return -1;
        }
    });
    
}
/**
 * 增加页后增加3D
 * 注意:需要根据页面排序变化重新排序
 * @param {Array} addPages 
 * @param {Function} callBack 
 */
function addPageInital3D(addPages, callBack){
    const babylon = getBabylonInstance();
    const engine = babylon.engine;
    const canvas = engine.getRenderingCanvas();

    //遍历新增页,初始化3D参数
    addPages.forEach((item)=>{
        const pageId = item.pageId;

        const param = createSceneParam(engine, canvas, pageId);
        param.parent = babylon;
        param.pageId = pageId;
        babylon.scene[pageId] = param;
        babylon.sceneList.push(param);

    })
    
    //store新增页已经排序,直接重新设置order
    const sData = getState('page', 'pages');
    const sliderPageSort = getOrderPageList(sData);

    babylon.sceneList.forEach((scene)=>{
        scene.order = sData.get(scene.pageId).order;
    })

    babylon.sceneList.sort(function (a, b) {
        if (a.order > b.order) {
            return 1;
        } else {
            return -1;
        }
    });
    
    //遍历新增页,处理实际渲染流程
    addPages.forEach((item)=>{
        const pageId = item.pageId;

        babylon.sceneList.some((scene,i)=>{
            if(scene.pageId === pageId){

                initialScene(sliderPageSort, babylon.sceneList, i, (index)=>{        
                    staticCanvas3DRefresh(function(){
                        document.getElementById("msLoadingScreenTxt").innerHTML = "开始渲染场景！请稍等";
                        setTimeout(() => {
                            setLoadedState(true);

                            //loading 状态恢复
                            window._vueMain.obj.msLoadingState.stateOpen = false;
            
                            if(typeof(callBack)=="function"){
                                callBack(pageId);
                            }
            
                        }, 0);
                    });
                    
                });
                babylon.sceneList[i].assetsManager.load();

                return scene.pageId === pageId;
            }
        })

    })
    
}

function createCubeTextureTask(assetsManager, hdr, default3D, i, name){
    var textureTask = null;
    if(hdr!=null && hdr.length>0){
        if(hdr.indexOf(".hdr")>-1){
            // hdrTexture = new BABYLON.HDRCubeTexture(hdr, scene, 512);
            textureTask = assetsManager.addHDRCubeTextureTask(name+"_"+i, hdr,1024);
        }
        else if(hdr.indexOf(".png")>-1 || hdr.indexOf(".jpg")>-1){
            // hdrTexture = new BABYLON.EquiRectangularCubeTexture(hdr, scene, 512);
            textureTask = assetsManager.addEquiRectangularCubeTextureAssetTask(name+"_"+i, hdr,1024);
        }
        else{
            // hdrTexture = new BABYLON.CubeTexture(hdr, scene);
            textureTask = assetsManager.addCubeTextureTask(name+"_"+i, hdr);
        }
    }
    else {
        // hdrTexture = new BABYLON.CubeTexture(_this.urls.root+"environment.dds", scene);
        textureTask = assetsManager.addCubeTextureTask(name+"_"+i, default3D);
    }

    return textureTask;
}

function changeBackground(curParam, background, is3D, functionType, functionEffect){

    if(!getLoadedState()){
        return;
    }
    const default3D = default3DUrl;
    const page = getState('page', 'curPage')
    if(curParam.backgroundInstance){
        curParam.backgroundInstance.dispose();
    }

    var scene = curParam.instance;
    var camera = curParam.camera;

    var assetsManager = new BABYLON.AssetsManager(scene);

    if(is3D){
        var textureTask = createCubeTextureTask(assetsManager, background, "", 0, "background3D");
        textureTask.onSuccess = function(task) {
            curParam.backgroundTexture = task.texture;
        }

        // if(page.functionType=="lottery" || page.functionType=="sign"){
        //     var textureTask = createCubeTextureTask(assetsManager, background, "", 0,"reflectionTexture");
        //     textureTask.onSuccess = function(task) {
        //         curParam.reflectionTexture = task.texture;
        //     }
        // }
    }
    else {

        var imageTask = assetsManager.addTextureTask("background2D_", background);
        imageTask.onSuccess = function(task) {
            curParam.background2DTexture= task.texture;
        }

        // if(page.functionType=="lottery"  || page.functionType=="sign"){
        //     var textureTask = assetsManager.addCubeTextureTask("background3DTask_", default3D);
        //     textureTask.onSuccess = function(task) {
        //         curParam.reflectionTexture = task.texture;
        //     }
        // }
    }


    assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
        document.getElementById("msLoadingScreenBarLoad").style.width = 0;
        document.getElementById("msLoadingScreenPercent").innerHTML = "";
        document.getElementById("msLoadingScreenTxt").innerHTML = '正在修改背景，请稍后';
    }

    assetsManager.onFinish = function(tasks) {
        if(is3D){
            curParam.backgroundInstance = createEnvironment(curParam.backgroundTexture, scene);
            if(background.indexOf(".hdr")>-1){
                curParam.isHdr = true;
            }
        }
        else{
            curParam.backgroundInstance = new BABYLON.Layer('',null, scene, false);
            curParam.backgroundInstance.texture = curParam.background2DTexture;
        }

        staticCanvas3DRefresh(function(){    
            document.getElementById("msLoadingScreenTxt").innerHTML = "开始渲染场景！请稍等";
            setTimeout(() => {
                setLoadedState(true);
                // setImageLoadedState(true);

                scene.render();
            }, 1000);
        });
    }

    setLoadedState(false);
   // setImageLoadedState(false);
    assetsManager.load();

}

function createEnvironment(hdr, scene) {
    var hdrTexture = hdr;

    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {
        size: 60
    }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    // skybox.infiniteDistance = true;
    skyboxMaterial.reflectionTexture = hdrTexture.clone();
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    return skybox;
}

//修改粒子特效，会删除原来的特效，加入新特效
function changeParticle(curParam, particleUrl){
    if(!getLoadedState()){
        return;
    }

    var scene = curParam.instance;
    var camera = curParam.camera;

    var ps = scene.particleSystems;
    ps.forEach((p)=>{
        scene.removeParticleSystem(p);
    })
    curParam.particle3D = [];

    var assetsManager = new BABYLON.AssetsManager(scene);

    var particleTask = assetsManager.addTextFileTask("particle3D_", particleUrl);
    particleTask.onSuccess = function(task) {
        if(curParam.particle3D==null){
            curParam.particle3D = [];
        }
        curParam.particle3D.push(task.text);
    }

    assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
        document.getElementById("msLoadingScreenBarLoad").style.width = 0;
        document.getElementById("msLoadingScreenPercent").innerHTML = "";
        document.getElementById("msLoadingScreenTxt").innerHTML = '正在修改粒子特效！请稍后';
    }

    assetsManager.onFinish = function(tasks) {
        var param;
        if(curParam.particle3D!=null){
            param = curParam.particle3D;
        }
        createParticle(param, scene, camera);

        staticCanvas3DRefresh(function(){    
            document.getElementById("msLoadingScreenTxt").innerHTML = "开始渲染场景！请稍等";
            setTimeout(() => {
                setLoadedState(true);
                scene.render();
            }, 1000);
        });
    }

    setLoadedState(false);

    assetsManager.load();
}

//添加粒子特效，会在原有特效基础上进行添加
function addParticle(curParam, particleUrl){
    if(!getLoadedState()){
        return;
    }

    var scene = curParam.instance;
    var camera = curParam.camera;

    // var ps = scene.particleSystems;
    // ps.forEach((p)=>{
    //     scene.removeParticleSystem(p);
    // });

    var originParticleLength = curParam.particle3D.length;

    var assetsManager = new BABYLON.AssetsManager(scene);

    var particleTask = assetsManager.addTextFileTask("particle3D_", particleUrl);
    particleTask.onSuccess = function(task) {
        if(curParam.particle3D==null){
            curParam.particle3D = [];
        }
        curParam.particle3D.push(task.text);
    }

    assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
        document.getElementById("msLoadingScreenBarLoad").style.width = 0;
        document.getElementById("msLoadingScreenPercent").innerHTML = "";
        document.getElementById("msLoadingScreenTxt").innerHTML = '正在添加粒子特效！请稍后';
    }

    assetsManager.onFinish = function(tasks) {
        var param
        if(curParam.particle3D!=null){
            param = curParam.particle3D;
        }
        var newPs = param.slice(originParticleLength, param.length-originParticleLength);
        createParticle(newPs, scene, camera);

        staticCanvas3DRefresh(function(){    
            document.getElementById("msLoadingScreenTxt").innerHTML = "开始渲染场景！请稍等";
            setTimeout(() => {
                setLoadedState(true);
                scene.render();
            }, 1000);
        });
    };

    setLoadedState(false);

    assetsManager.load();
}

//创建粒子特效
function createParticle(particleFile, scene, camera) {
    // Create a particle system
    if(particleFile=="default"){
        var ps1 = new BABYLON.ParticleSystem("particles", 20000, scene);
        //Texture of each particle
        ps1.particleTexture = new BABYLON.Texture(flareBase64, scene);
        ps1.particleTexture.hasAlpha = true;
        ps1.translationPivot = new BABYLON.Vector3(0, 100, 30);
        // Where the particles come from
        // ps1.emitter = fountain; // the starting object, the emitter
        ps1.emitter = camera;
        ps1.minEmitBox = new BABYLON.Vector3(-.3, 0, 0); // Starting all from
        ps1.maxEmitBox = new BABYLON.Vector3(.3, 0, 0); // To...
        // Colors of all particles
        ps1.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        ps1.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        ps1.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        // Size of each particle (random between...
        ps1.minSize = 0.1;
        ps1.maxSize = 1;
        // Life time of each particle (random between...
        ps1.minLifeTime = 1;
        ps1.maxLifeTime = 25;
        // Emission rate
        ps1.emitRate = 600;
        // ps1.manualEmitCount = 100;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        ps1.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        // Set the gravity of all particles
        ps1.gravity = new BABYLON.Vector3(0, 0, -2);
        // Direction of each particle after it has been emitted
        ps1.direction1 = new BABYLON.Vector3(-.5, -1, 1);
        ps1.direction2 = new BABYLON.Vector3(.5, 10, 10);
        // Angular speed, in radians
        ps1.minAngularSpeed = 0;
        ps1.maxAngularSpeed = Math.PI;
        // Speed
        ps1.minEmitPower = .01;
        ps1.maxEmitPower = 30;
        // ps1.updateSpeed = 0.009;
        // Start the particle system
        ps1.start();
    }
    else if(particleFile!=null && particleFile.length>0){
        var particle3D =  document.getElementById('sliderCanvas3D').particle3D;
        if(particle3D!=null){
            for(var i=0;i<particleFile.length;i++){
                var particleSet = particleFile[i];
                var psList = particleSet.length ? JSON.parse(particleSet):[];
                for(var a=0;a<psList.length;a++){
                    var ps = psList[a];
                    var particle = particle3D.createParticle(ps, {scene:scene});
                    if(particle==null){
                        continue;
                    }
                    particle.start();
                }
            }
        }
        else{
            console.log("获取粒子插件失败");
        }
    }
}

function ms3dfParsePlay(addData, curParam, mode){
    if(mode==null){
        mode = "p";
    }
    var exeClass =  document.getElementById('sliderCanvas3D').particle3D;
    addData = JSON.parse(pako.inflate(addData, { to: 'string' }));
    exeClass.generateScene(addData, { scene: curParam.instance}, mode);
    if(curParam.camera){
        let a = curParam.camera;
        curParam.camera = curParam.instance.activeCamera;
        // a.dispose();
    }

}

function hideFilterEffect(curParam){
    if(curParam==null){
        return
    }
    var pp = curParam.param["postProcess"];
    var scene = curParam.instance;
    var camera = curParam.camera;

    var filter = curParam.param["filter"];

    // scene.postProcessesEnabled = false;
    if(pp.pipeline!=null){
        // pp.pipeline.removeCamera(camera);
        if(filter.antialiasing){
            if(filter.antialiasing.samples){
                pp.pipeline.samples = 1;
            }
            else if(filter.antialiasing.fxaaEnabled){
                pp.pipeline.fxaaEnabled = false;
            }
        }

        if(filter.sharpening){
            pp.pipeline.sharpenEnabled = false;
        }

        if(filter.depthOfField){
            pp.pipeline.depthOfFieldEnabled = false;
        }

        if(filter.Bloom){
            pp.pipeline.bloomEnabled = false;
        }

        if(filter.chromaticAberration){
            pp.pipeline.chromaticAberrationEnabled = false;
        }

        if(filter.grain){
            pp.pipeline.grainEnabled = false;
        }
        
        pp.pipeline.dispose();

    }

    if(pp.postProcess!=null && pp.postProcess.length>0){
        pp.postProcess.forEach((item)=>{
            item.dispose();
            // camera.detachPostProcess(item);
        });
    }

    if(pp.ImageProcessing!=null){
        if(filter.ImageProcessingTexture!=null){
            pp.ImageProcessing.colorGradingTexture.dispose();
            pp.ImageProcessing.colorGradingTexture = null;
            pp.ImageProcessing.colorGradingEnabled = false;

            if(filter.ImageProcessingTexture.animated){
                curParam.param["ImageProcessingTextureSpeed"] = null;
            }
        }
        pp.ImageProcessing.dispose();
    }
}

//更换背景特效
function changeFilterEffect(curParam, filter){
    if(!getLoadedState()){
        return;
    }

    if(curParam==null){
        return
    }

    hideFilterEffect(curParam);

    setLoadedState(false);

    createFilterEffect(curParam, filter, function(){
        setLoadedState(true);
    });

}


function createFilterEffect(curParam, filter, filterCallback){
    var ret = {};

    var scene = curParam.instance;
    var camera = curParam.camera;
    var isHdr = curParam.isHdr;
    if(isHdr==null){
        isHdr = false;
    }

    curParam.param["ImageProcessingTextureSpeed"] = null;

    if(filter.ImageProcessingTexture!=null){
        var v = filter.ImageProcessingTexture;
        var colorGrading = new BABYLON.ColorGradingTexture(v.colorGradingTexture, scene);
        BABYLON.BaseTexture.WhenAllReady([colorGrading], ()=>{
            exec(colorGrading);
            if(typeof(filterCallback)=="function"){
                filterCallback();
            }  
            scene.render();
        });
    }
    else{
        exec();
        if(typeof(filterCallback)=="function"){
            filterCallback();
        }
        scene.render();
    }



    function exec(colorGrading){

        if(filter.antialiasing!=null || filter.sharpening!=null || filter.depthOfField!=null || filter.Bloom!=null || filter.chromaticAberration!=null || filter.grain!=null){
            var pipeline = new BABYLON.DefaultRenderingPipeline("default", isHdr, scene, [camera]);

            ret.pipeline = pipeline;

            //抗锯齿
            if(filter.antialiasing!=null){
                var v = filter.antialiasing.value;
                if(v == "samples"){
                    pipeline.samples = 4;
                    pipeline.fxaaEnabled = false;
                }
                else if(v == "fxaaEnabled"){
                    pipeline.fxaaEnabled = true;
                    pipeline.samples = 1;
                }
            }

            //锐化
            if(filter.sharpening!=null){
                pipeline.sharpenEnabled = true;
                pipeline.sharpen.colorAmount = filter.sharpening.colorAmount;
                pipeline.sharpen.edgeAmount = filter.sharpening.edgeAmount;
            }

            //景深
            if(filter.depthOfField!=null){
                pipeline.depthOfFieldEnabled = true;
                var level = filter.depthOfField.depthOfFieldBlurLevel;
                if(level==0){
                    level = BABYLON.DepthOfFieldEffectBlurLevel.Low;
                }
                else if(level==1){
                    level = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
                }
                else if(level==2){
                    level = BABYLON.DepthOfFieldEffectBlurLevel.High;
                }

                pipeline.depthOfFieldBlurLevel = filter.depthOfField.depthOfFieldBlurLevel;

                pipeline.depthOfField.focusDistance = filter.depthOfField.focusDistance;
                pipeline.depthOfField.focalLength = filter.depthOfField.focalLength;
                pipeline.depthOfField.fStop = filter.depthOfField.fStop;
            }


            //全屏泛光
            if(filter.Bloom!=null){
                pipeline.bloomEnabled = true;

                pipeline.bloomThreshold = filter.Bloom.bloomThreshold;
                pipeline.bloomWeight = filter.Bloom.bloomWeight;
                pipeline.bloomKernel = filter.Bloom.bloomKernel;
                pipeline.bloomScale = filter.Bloom.bloomScale;
            }

            //色差
            if(filter.chromaticAberration!=null){
                pipeline.chromaticAberrationEnabled = true;
                pipeline.chromaticAberration.aberrationAmount = filter.chromaticAberration.aberrationAmount;
                pipeline.chromaticAberration.radialIntensity = filter.chromaticAberration.radialIntensity;

                var value = pipeline.chromaticAberration.direction;
                if(value == 0){
                    pipeline.chromaticAberration.direction.x = 0
                    pipeline.chromaticAberration.direction.y = 0
                }else{
                    pipeline.chromaticAberration.direction.x = Math.sin(value)
                    pipeline.chromaticAberration.direction.y = Math.cos(value)
                }

            }

            //噪声
            if(filter.grain!=null){
                pipeline.grainEnabled = true;
                pipeline.grain.intensity = filter.grain.intensity;
                pipeline.grain.animated = filter.grain.animated;
            }




        }

        //以下为PostProcess模式
        if(filter.blackAndWhite!=null || filter.highlights!=null || filter.convolution!=null || filter.blur!=null || filter.tonemap!=null){

            ret.postProcess = [];

            //黑白
            if(filter.blackAndWhite!=null){
                if(filter.blackAndWhite.state){
                    var postProcess = new BABYLON.BlackAndWhitePostProcess("blackAndWhite", 1.0, camera);

                    ret.postProcess.push(postProcess);
                }
            }

            //高亮
            if(filter.highlights!=null){
                if(filter.highlights.state){
                    var postProcess = new BABYLON.HighlightsPostProcess("highlights", 1.0, camera);

                    ret.postProcess.push(postProcess);
                }
            }

            //卷积
            if(filter.convolution!=null){
                var kenel = filter.convolution.kenel;

                if(kenel=="EdgeDetect0Kernel"){
                    kenel = BABYLON.ConvolutionPostProcess.EdgeDetect0Kernel;
                }
                else if(kenel=="EdgeDetect1Kernel"){
                    kenel = BABYLON.ConvolutionPostProcess.EdgeDetect1Kernel;
                }
                else if(kenel=="EdgeDetect2Kernel"){
                    kenel = BABYLON.ConvolutionPostProcess.EdgeDetect2Kernel;
                }
                else if(kenel=="EmbossKernel"){
                    kenel = BABYLON.ConvolutionPostProcess.EmbossKernel;
                }
                else if(kenel=="GaussianKernel"){
                    kenel = BABYLON.ConvolutionPostProcess.GaussianKernel;
                }
                else if(kenel=="SharpenKernel"){
                    kenel = BABYLON.ConvolutionPostProcess.SharpenKernel;
                }

                if(kenel!="off"){
                    var postProcess = new BABYLON.ConvolutionPostProcess("Sepia", kenel, 1.0, camera);

                    ret.postProcess.push(postProcess);
                }
            }

            if(filter.blur!=null){
                var postProcess0 = new BABYLON.BlurPostProcess("HorizontalBlur", new BABYLON.Vector2(1, 0), filter.blur.blurKernelVertical, 1.0, camera);
                var postProcess1 = new BABYLON.BlurPostProcess("VerticalBlur", new BABYLON.Vector2(0, 1), filter.blur.blurKernelHorizen, 1.0, camera);

                ret.postProcess.push(postProcess0);
                ret.postProcess.push(postProcess1);
            }

            if(filter.tonemap!=null){
                var operator = filter.tonemap.TonemappingOperator;
                var postProcess = new BABYLON.TonemapPostProcess("tonemap", BABYLON.TonemappingOperator[operator], filter.tonemap.exposureAdjustment, camera);

                ret.postProcess.push(postProcess);
            }

        }
        else if(filter.ImageProcessingCE!=null || filter.ImageProcessingCurves!=null || filter.ImageProcessingVignette!=null || filter.ImageProcessingTexture!=null){

            // pipeline.imageProcessingEnabled = true;
            // var postProcess = pipeline.imageProcessing;

            // postProcess.alphaMode = true;
            var postProcess = new BABYLON.ImageProcessingPostProcess("ImageProcessing", 1.0, camera);

            ret.ImageProcessing = postProcess;

            if(filter.ImageProcessingCE!=null){
                if(filter.ImageProcessingCE.contrast!=null){
                    postProcess.contrast = filter.ImageProcessingCE.contrast;
                }

                if(filter.ImageProcessingCE.exposure!=null){
                    postProcess.exposure = filter.ImageProcessingCE.exposure;
                }
                
            }

            if(filter.ImageProcessingCurves!=null){
                var curve = new BABYLON.ColorCurves();
                var c = filter.ImageProcessingCurves;
                curve.globalDensity = c.globalDensity;
                curve.globalExposure = c.globalExposure;
                curve.globalHue = c.globalHue;
                curve.globalSaturation = c.globalSaturation;

                curve.highlightsDensity = c.highlightsDensity;
                curve.highlightsExposure = c.highlightsExposure;
                curve.highlightsHue = c.highlightsHue;
                curve.highlightsSaturation = c.highlightsSaturation;

                curve.midtonesDensity = c.midtonesDensity;
                curve.midtonesExposure = c.midtonesExposure;
                curve.midtonesHue = c.midtonesHue;
                curve.midtonesSaturation = c.midtonesSaturation;

                curve.shadowsDensity = c.shadowsDensity;
                curve.shadowsExposure = c.shadowsExposure;
                curve.shadowsHue = c.shadowsHue;
                curve.shadowsSaturation = c.shadowsSaturation;

                postProcess.colorCurvesEnabled = true;
                postProcess.colorCurves = curve;
            }

            if(filter.ImageProcessingVignette!=null){
                var v = filter.ImageProcessingVignette;

                postProcess.vignetteEnabled = true;

                postProcess.vignetteStretch = v.vignetteStretch;
                postProcess.vignetteCentreX = v.vignetteCentreX;
                postProcess.vignetteCentreY = v.vignetteCentreY;
                postProcess.vignetteWeight = v.vignetteWeight;

                if(v.vignetteColor!=null && v.vignetteColor.length>0){
                    var va = rgbOrRgbaToArray(v.vignetteColor);
                    for(var i=0;i<va.length-1;i++){
                        va[i] = Math.round(va[i]*100/255)/100;
                    }
                    postProcess.vignetteColor = new BABYLON.Color4(va[0],va[1],va[2],va[3]);
                }
                
                var bm = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
                if(v.vignetteBlendMode=="OPAQUE"){
                    bm = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_OPAQUE;
                }
                postProcess.vignetteBlendMode = bm;
            }

            if(filter.ImageProcessingTexture!=null){
                postProcess.colorGradingEnabled = true;
                scene.imageProcessingConfiguration.colorGradingEnabled = true;
                var v = filter.ImageProcessingTexture;
                // var colorGrading = new BABYLON.ColorGradingTexture(v.colorGradingTexture, scene);
                postProcess.colorGradingTexture = colorGrading;
                colorGrading.level = v.level;

                curParam.param["ImageProcessingTexture"] = colorGrading;

                if(v.animated){
                    curParam.param["ImageProcessingTextureLevel"] = v.level;
                    curParam.param["ImageProcessingTextureSpeed"] = v.speed*0.0015;
                    curParam.param["ImageProcessingTextureT"] = 0;
                }
            }
                
        }

        curParam.param["postProcess"] = ret;
        curParam.param["filter"] = filter;
    }
}


function startSign(curPage, directIndex){
    var pageId = curPage.pageId;
    var babylon = getBabylonInstance();

    if(!babylon){
        return;
    }

    var curParam = babylon.scene[pageId];
    clearTimeout(window.msSignTimeout);

    if(!curParam.isReady){
        return;
    }

    playSign(curParam, curPage, directIndex, function(){
        var auto = getState('canvas3D', 'autoSignFunction');
        if(auto==null){
            auto = true;
        }
        if(curPage.functionParam.changeTime!=null && curPage.functionParam.changeTime>0 && auto){
            window.msSignTimeout = setTimeout(() => {
                startSign(curPage);
            }, curPage.functionParam.changeTime*1000);
        }
    });
}

function changePageFunction(originType){
    var curPage = getState('page', 'curPage'), type = curPage.functionType, effect = curPage.functionEffect;
    var babylon = getBabylonInstance();
    var curParam = babylon.scene[curPage.pageId];
    var scene = curParam.instance;
    var camera = curParam.camera;

    var canvas2D = getCanvas();

    clearCurpageFunctionModel(originType, curParam, curPage, canvas2D);

    if(type=="sign"){ 
        initialSignPage(curParam, curPage);
        startSign(curPage);
    }
    else if(type=="lottery"){ 
        scene.enablePhysics(null, new BABYLON.AmmoJSPlugin(true, Ammo));
        camera.beta = Math.PI * 3 / 8;

        if(effect=="sphere"){
            lotteryPlaySphere(curParam);
        }
        else if(effect=="helix"){
            lotteryPlayHelix(curParam);
        }
    }
    
    setTimeout(()=>{
        staticCanvas3DRefreshBypageId(curPage.pageId);
    }, 300);
}

function addIconToFile(newIcon){
    var curPage = getState('page', 'curPage'), iconData = getState('page', 'iconData');
    var babylon = getBabylonInstance();
    var curParam = babylon.scene[curPage.pageId];

    var scene = curParam.instance;
    var camera = curParam.camera;

    var easingFunction = new BABYLON.CircleEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

    iconData = iconData.concat(newIcon);

    store.commit('page/commonMutationsUpdate', { updateProperty: 'iconData', value: iconData });

    initialIconTexture(scene.getEngine(), iconData, curParam.parent.iconData);

    if(curPage.functionType == "sign" && !curParam.isReady){
        initialSignIconMesh(curParam, curPage, curParam.parent.iconData, 0x10000000);
        startSign(curPage);
        return;
    }

    if(curPage.functionType!="sign"){
        return;
    }

    var newIconTextureList = curParam.parent.iconData.slice(curParam.parent.iconData.length - newIcon.length, curParam.parent.iconData.length);
    var newIconMesh = initialSignIconMesh(curParam, curPage, newIconTextureList, 0x10000000);

    curParam.secondCamera = new BABYLON.FreeCamera("signCamera", new BABYLON.Vector3(0, 4, 0), scene);
    curParam.secondCamera.layerMask = 0x10000000;

    if (scene.activeCameras.length === 0){
        scene.activeCameras.push(camera);
    }
    scene.activeCameras.push(curParam.secondCamera);
    var centerPoint = curParam.secondCamera.getFrontPosition(10);

    newIconMesh.forEach((item,index)=>{
        var m = item.mesh;
        var border = item.border;
        m.getChildMeshes()[0].layerMask = 0x10000000;

        var position = centerPoint.clone();
        var rowIndex = Math.floor(index/5), colIndex = index%5;
        position.y += (rowIndex%2==0?-1:1)*Math.ceil(rowIndex/2)*2;
        position.x += (colIndex%2==0?1:-1)*Math.ceil(colIndex/2)*2;

        m.position = position;

        if(border!=null){
            border.position = position;
            // border.layerMask = 0x10000000;
        }
        
        var newPos = position.clone().multiplyByFloats(30*Math.random(),30*Math.random(),30*Math.random());

        BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 30, newPos, position, 2, easingFunction,function(){
            m.lookAt(m.position, Math.PI/2);
            if(border!=null){
                border.isVisible = true;
            }
        });

        
        // var position = centerPoint.clone();
        // var rowIndex = Math.floor(index/5), colIndex = index%5;
        // position.y += (rowIndex%2==0?-1:1)*Math.ceil(rowIndex/2)*2;
        // position.x += (colIndex%2==0?1:-1)*Math.ceil(colIndex/2)*2;

        // m.position = position;
        
        // var newPos = position.clone().multiplyByFloats(30*Math.random(),30*Math.random(),30*Math.random());

        // if(border!=null){
        //     border.position = position;
        //     border.layerMask = 0x10000000;
        // }

        // BABYLON.Animation.CreateAndStartAnimation("anim", m, "position", 20+Math.random()*10, 30,newPos, position, 2, easingFunction,function(){
        //     m.lookAt(m.position, Math.PI/2);
        //     if(border!=null){
        //         border.isVisible = true;
        //     }
        // });
    });


    // commitCanvas3DMutationsUpdate("fabricAutoRefresh", true);

    // var previewId = addIconPreview(newIcon, curParam,function(){
    //     setTimeout(()=>{
    //         removeIconPreview(previewId, function(){
    //             commitCanvas3DMutationsUpdate("fabricAutoRefresh", false);
    //             addItemToScene(curParam, curPage, newIconMesh);
    //         });
            
    //     },6000);
    // });

    console.log(newIconMesh);

    setTimeout(()=>{
        addItemToScene(curParam, curPage, newIconMesh);
    },5000);

}

function startLottery(){
    var curPage = getState('page', 'curPage');
    var babylon = getBabylonInstance();
    var curParam = babylon.scene[curPage.pageId];
    playLottery(curParam, curPage);
}

function stopLottery(){
    var curPage = getState('page', 'curPage');
    var babylon = getBabylonInstance();
    var curParam = babylon.scene[curPage.pageId];
    clearLottery(curParam, curPage);
}

// window.addIconToFile = addIconToFile;
// window.startLottery = startLottery;
// window.stopLottery = stopLottery;

function createSceneParam(engine, canvas, pageId){
    var s = createScene(engine, canvas, pageId);
    var curPage = getState('page', 'pages').get(pageId);
    var param = {
        perspecter:s.perspecter,
        camera:s.camera,
        instance:s.instance,
        gizmo: s.gizmo,
        order: curPage.order,

        auxLineSystem:s.auxLineSystem,
        
        assetsManager:null,
        controll:{//场景组件mesh

        },
        param:{//效果运行参数

        },
        iconData:[],//头像缓存
        renderCount:0,
        backgroundTexture:null,
        background2DImage:null,
        reflectionTexture:null,
        loadState:false, //页面是否预加载过
    }

    return param;
}

//创建可编辑的Babylon场景
function createScene(engine, canvas, pageId){
    // create a basic BJS Scene object
    var scene = new BABYLON.Scene(engine);

    scene.preventDefaultOnPointerDown = false;
    scene.preventDefaultOnPointerUp = false;

    var camera = new BABYLON.ArcRotateCamera("camera_default_"+pageId, Math.PI/2, Math.PI/2, 20, new BABYLON.Vector3(0, 4, 0), scene);

    // var perspecterCamera = createPerspecterCamera(scene,canvas);

    scene.activeCamera = camera;

    scene.clearColor = new BABYLON.Color3(1,1,1);

    // scene.autoClear = false;

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    // var light = new BABYLON.HemisphericLight('light_default_'+pageId, new BABYLON.Vector3(0,1,0), scene);

    var gizmo = createGizmoManager(scene);

    // var auxLayer = new BABYLON.UtilityLayerRenderer(scene);

    // var posGizmoLayer = gizmo.gizmos.positionGizmo.gizmoLayer.utilityLayerScene;
    // var boxGizmoLayer = gizmo.gizmos.boundingBoxGizmo.gizmoLayer.utilityLayerScene;
    // initialSceneEvent(posGizmoLayer, auxLayer.utilityLayerScene);
    // initialSceneEvent(boxGizmoLayer, auxLayer.utilityLayerScene);

    // scene.onPointerObservable.add((pointerInfo) => {
    //     var pickInfo = pointerInfo.pickInfo, event = pointerInfo.event;
    //     switch (pointerInfo.type) {
    //         case BABYLON.PointerEventTypes.POINTERDOWN:
    //             if(pickInfo.pickedMesh){
    //                 var mesh = pickInfo.pickedMesh;
    //                 // _this.guidelineCacheMesh = mesh;
    //                 commitCanvas3DMutationsUpdate("guidelineCacheMesh", mesh);
    //             }
    //             else{
    //                 // _this.guidelineCacheMesh = null;
    //                 commitCanvas3DMutationsUpdate("guidelineCacheMesh", null);
    //             }
    //             break;
    //     }
    // });

    document.getElementById("sliderCanvas3D").addEventListener("pointerup", function(){
        if(!getState('canvas3D', 'is3DMode')){
            return;
        }
        // _this.moveGuideline = false;
        commitCanvas3DMutationsUpdate("moveGuideline", false);
        hideAuxMoveLine();
        // posGizmoLayer.removeMesh(posGizmoLayer.getMeshByName("msGuideLines"));
        // boxGizmoLayer.removeMesh(boxGizmoLayer.getMeshByName("msGuideLines"));
        setTimeout(function(){
            staticCanvas3DRefreshBypageId();
        }, 0);
    }, false);

    document.addEventListener("mousewheel", function(){
        if(!getState('canvas3D', 'is3DMode')){
            return;
        }

        // clearTimeout(_this.mouseWheelRefreshStaticCanvas);
        clearTimeout(getState('canvas3D', 'mouseWheelRefreshStaticCanvas'));
        commitCanvas3DMutationsUpdate("mouseWheelRefreshStaticCanvas", setTimeout(function(){
            console.log("staticCanvas3DRefreshBypageId");
            staticCanvas3DRefreshBypageId();
        }, 500));
        // _this.mouseWheelRefreshStaticCanvas = setTimeout(function(){
        //     console.log("staticCanvas3DRefreshBypageId");
        //     staticCanvas3DRefreshBypageId();
        // }, 500);

    }, false);

    document.getElementById("msSlider3dC").parentNode.addEventListener("pointerdown", function(e){
        var target = e.target;
        //console.log("msSlider3dC",target);
        if(!getState('canvas3D', 'is3DMode')){
            return;
        }
        var curScene = getBabylonCurScene();
        if(target!=document.getElementById("sliderCanvas3D")){
            var curScene = getBabylonCurScene();
            if(curScene==null){
                return;
            }
            // console.log(curScene.instance);
            curScene.gizmo.attachToMesh(null);
        }

    }, false);

    var myLines = [];

    for(var i=0;i<11;i++){
        myLines.push([
            new BABYLON.Vector3(i-5, 0, -5),
            new BABYLON.Vector3(i-5, 0, 5),
        ]);

        myLines.push([
            new BABYLON.Vector3(-5, 0, i-5),
            new BABYLON.Vector3(5, 0, i-5),
        ]);
    }
    
    //Create linesystem with updatable parameter set to true for later changes
    var linesystem = BABYLON.MeshBuilder.CreateLineSystem("auxMatrixPlane"+i, {lines: myLines, updatable: false}, scene); 
    linesystem.color = new BABYLON.Color3(109/255,109/255,109/255);
    linesystem.isPickable = false;

    linesystem.visibility = getState('canvas3D', 'is3DMode');

    return {
        // perspecter:perspecterCamera,
        camera:camera,
        instance:scene,
        gizmo: gizmo,
        auxLineSystem:linesystem
    };
}

function hideAuxMoveLine(){
    // var _this = this;
    getState('canvas3D', 'auxMoveLine').forEach((item)=>{
        item.visibility = 0;
    });
}

function moveAuxMoveLine(){
    // var _this = this;
    var meshCenterVector = getState('canvas3D', 'guidelineCacheMesh').getBoundingInfo().boundingBox.centerWorld;

    var auxMoveLine = getState('canvas3D', 'auxMoveLine');
    if(auxMoveLine==null){
        auxMoveLine = [{},{},{}];
    }

    auxMoveLine[0].position.y = meshCenterVector.y;
    auxMoveLine[0].position.z = meshCenterVector.z;

    auxMoveLine[1].position.x = meshCenterVector.x;
    auxMoveLine[1].position.z = meshCenterVector.z;

    auxMoveLine[2].position.x = meshCenterVector.x;
    auxMoveLine[2].position.y = meshCenterVector.y;

    commitCanvas3DMutationsUpdate("auxMoveLine", auxMoveLine);
}

function initialSceneEvent(scene, main){
    // var _this = this;
    scene.onPointerObservable.add((pointerInfo) => {
        var pickInfo = pointerInfo.pickInfo, event = pointerInfo.event;
        //console.log(pickInfo);
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if(pickInfo.pickedMesh){
                    _this.moveGuideline = true;

                    var auxMoveLine = getState('canvas3D', 'auxMoveLine');
                    if(auxMoveLine.length==0){
                        var colors = [new BABYLON.Color4(0.4,0.4,0.4,0.8),new BABYLON.Color4(0.4,0.4,0.4,0.8)];
                        auxMoveLine[0] = BABYLON.MeshBuilder.CreateLines("lines", {points: [
                                new BABYLON.Vector3(
                                    -1000,0,0),
                                new BABYLON.Vector3(1000,0, 0),
                            ],colors:colors}, main);
                        auxMoveLine[0].isPickable = false;

                        auxMoveLine[1] = BABYLON.MeshBuilder.CreateLines("lines", {points: [
                                new BABYLON.Vector3(0, -1000, 0),
                                new BABYLON.Vector3(0,1000, 0),
                            ],colors:colors}, main);
                        auxMoveLine[1].isPickable = false;

                        auxMoveLine[2] = BABYLON.MeshBuilder.CreateLines("lines", {points: [
                                new BABYLON.Vector3(
                                    0,0,-1000),
                                new BABYLON.Vector3(0, 0,1000),
                            ],colors:colors}, main);
                        auxMoveLine[2].isPickable = false;
                    }
                    else{
                        moveAuxMoveLine();
                        auxMoveLine.forEach((item)=>{
                            item.visibility = 1;
                        });
                    }

                    commitCanvas3DMutationsUpdate("auxMoveLine", auxMoveLine);
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                //_this.guidelineCacheMesh = null;
                // _this.moveGuideline = false;
                commitCanvas3DMutationsUpdate("moveGuideline", false);
                hideAuxMoveLine();
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                if(getState('canvas3D', 'guidelineCacheMesh') && getState('canvas3D', 'moveGuideline')){
                    // scene.removeMesh(scene.getMeshByName("msGuideLines"));
                    moveAuxMoveLine();
                
                    clearTimeout(getState('canvas3D', 'auxMoveLineRefresh'));
                    commitCanvas3DMutationsUpdate("auxMoveLineRefresh", setTimeout(function(){
                        moveAuxMoveLine();
                        main.render();
                    }, 20));
                    // _this.auxMoveLineRefresh = setTimeout(function(){
                    //     moveAuxMoveLine();
                    //     main.render();
                    // }, 20);
                    
                }
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                console.log("POINTER WHEEL");
                break;
            case BABYLON.PointerEventTypes.POINTERPICK:
                console.log("POINTERPICK");
                break;
            case BABYLON.PointerEventTypes.POINTERTAP:
                console.log("POINTER TAP");
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                console.log("POINTER DOUBLE-TAP");
                break;
        }
    });
}

function createDefautCamera(scene, canvas){
    var curPage = getState('page', 'curPage');
    var alpha, beta, radius, preventEvent, pinchDelta,wheelDelta,lowerRadius,upperRadius,position, target;
    if(curPage!=null && curPage.scene3D!=null && curPage.scene3D.objects3D.camera_default!=null){
        var dc = curPage.scene3D.objects3D.camera_default;
        alpha = dc.alpha;
        beta = dc.beta;
        radius = dc.radius;
        preventEvent = dc.preventEvent;
        pinchDelta = dc.pinchDelta;
        wheelDelta = dc.wheelDelta;
        lowerRadius = dc.lowerRadius;
        upperRadius = dc.upperRadius;

        position = dc.position;
        target = dc.target;
    }

    if(alpha==null){
        alpha = Math.PI/4;
    }

    if(beta==null){
        beta = Math.PI*3/8;
    }

    if(radius==null){
        radius = 10;
    }

    if(preventEvent==null){
        preventEvent = true;
    }

    if(target==null){
        target = new BABYLON.Vector3(0, 0, 0);
    }
    else{
        target = new BABYLON.Vector3(target[0], target[1], target[2]);
    }


    // alpha, beta, radius
    var camera = new BABYLON.ArcRotateCamera("camera_default",  alpha,  beta, radius, target, scene);

    // target the camera to scene origin
    // camera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas

    camera.attachControl(canvas, preventEvent); 
    // camera.attachControl(canvas, false); 

    if(pinchDelta!=null){
        camera.pinchDeltaPercentage = pinchDelta;
    }

    if(wheelDelta!=null){
        camera.wheelDeltaPercentage = wheelDelta;
    }

    if(lowerRadius!=null){
        camera.lowerRadiusLimit = lowerRadius;
    }

    if(upperRadius!=null){
        camera.upperRadiusLimit = upperRadius;
    }

    if(position!=null){
        camera.position = new BABYLON.Vector3(position[0], position[1], position[2]);
    }

    return camera;
}

function createGizmoManager(scene, attach){
    var gizmoManager = new BABYLON.GizmoManager(scene);
    // gizmoManager.boundingBoxGizmoEnabled = true;
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.gizmos.positionGizmo.planarGizmoEnabled =true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.scaleGizmoEnabled = true;
    gizmoManager.gizmos.scaleGizmo.scaleRatio =0.5;
    gizmoManager.gizmos.scaleGizmo.sensitivity =8;
    // gizmoManager.clearGizmoOnEmptyPointerEvent = true;
    // Restrict gizmos to only spheres
    gizmoManager.attachableMeshes = [];
    return gizmoManager;
}

function createPerspecterCamera(scene,canvas){
    
    // This creates and positions a free camera (non-mesh)
    // var _this = this;
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, 0), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    var w = document.getElementById("sliderCanvas3D").width;
    var h = document.getElementById("sliderCanvas3D").height;
    camera.orthoLeft = -5 * w / h;
    camera.orthoRight = 5 * w / h;
    camera.orthoTop = 5;
    camera.orthoBottom = -5;

    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.inputs.removeByType("FreeCameraMouseInput");

    camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");
    camera.inputs.removeByType("FollowCameraMouseWheelInput");
    camera.inputs.remove(camera.inputs.attached.mouse);
    
    // Create our own manager:
    var FreeCameraKeyboardRotateInput = function() {
        //按键参数定义
        this._keys = [];
        this.keysLeft = [37];
        this.keysRight = [39];
        this.keysTop = [38];
        this.keysBottom = [40];
        this.sensibility = 0.01;
        //鼠标参数定义
        this._mouseStartX = null;
        this._mouseStartY = null;

        this._mouseMovePreX = null;
        this._mouseMovePreY = null;
        this._mouseMoveX = null;
        this._mouseMoveY = null;

        this._mouseWheelDelta = null;
        this._mouseWheelIni = 5;
        this.wheelSensibility = 0.5;
    }
    // Hooking keyboard events
    FreeCameraKeyboardRotateInput.prototype.attachControl = function(element, noPreventDefault) {
        var _this = this;
        if (!this._onKeyDown) {
            element.tabIndex = 1;
            this.element = element;

            this._onKeyDown = function(evt) {
                if (_this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysTop.indexOf(evt.keyCode) !== -1 || _this.keysBottom.indexOf(evt.keyCode) !== -1) {
                    var index = _this._keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        _this._keys.push(evt.keyCode);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            this._onKeyUp = function(evt) {
                if (_this.keysLeft.indexOf(evt.keyCode) !== -1 || _this.keysRight.indexOf(evt.keyCode) !== -1 || _this.keysTop.indexOf(evt.keyCode) !== -1 || _this.keysBottom.indexOf(evt.keyCode) !== -1) {
                    var index = _this._keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        _this._keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            element.addEventListener("keydown", this._onKeyDown, false);
            element.addEventListener("keyup", this._onKeyUp, false);
            //鼠标事件定义
            this._onMouseDown = function(evt) {
                //console.log("mousedown", evt);
                _this._mouseStartX = evt.offsetX;
                _this._mouseStartY = evt.offsetY;
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            }
            this._onMouseMove = function(evt) {
                // console.log("mousemove",evt);
                // _this._mouseMoveX = evt.offsetX;
                // _this._mouseMoveY = evt.offsetY;
                // if (!noPreventDefault) {
                //     evt.preventDefault();
                // }
            }
            this._onMouseUp = function(evt) {
                //console.log("mouseup", evt);
                _this._mouseStartX = null;
                _this._mouseStartY = null;
                _this._mouseMoveX = null;
                _this._mouseMoveY = null;
                _this._mouseMovePreX = null;
                _this._mouseMovePreY = null;

            
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            
            }

            this._onMouseWheel = function(evt) {
                var delta = (evt.wheelDelta) ? evt.wheelDelta / 120 : -(evt.detail || 0) / 3;
                _this._mouseWheelDelta = delta;
                // console.log(delta);
            }

            document.addEventListener("mousewheel", this._onMouseWheel, false);
            document.addEventListener("DOMMouseScroll", this._onMouseWheel, false);

            element.addEventListener("pointerdown", this._onMouseDown, false);
            document.addEventListener("pointermove", this._onMouseMove, false);
            document.addEventListener("pointerup", this._onMouseUp, false);
            // BABYLON.Tools.RegisterTopRootEvents([{
            //     name: "blur",
            //     handler: this._onLostFocus
            // }]);
        }
    };
    // Unhook
    FreeCameraKeyboardRotateInput.prototype.detachControl = function(element) {
        if (this._onKeyDown) {
            element.removeEventListener("keydown", this._onKeyDown);
            element.removeEventListener("keyup", this._onKeyUp);
            BABYLON.Tools.UnregisterTopRootEvents([{
                name: "blur",
                handler: this._onLostFocus
            }]);
            this._keys = [];
            this._onKeyDown = null;
            this._onKeyUp = null;
        }
        if (this._onMouseDown) {
            element.removeEventListener("pointerdown", this._onMouseDown);
            document.removeEventListener("pointermove", this._onMouseMove);
            document.removeEventListener("pointerup", this._onMouseUp);
            BABYLON.Tools.UnregisterTopRootEvents([{
                name: "blur",
                handler: this._onLostFocus
            }]);
            this._mouseStartX = null;
            this._mouseStartY = null;
            this._mouseMoveX = null;
            this._mouseMoveY = null;
            this._mouseMovePreX = null;
            this._mouseMovePreY = null;
        }
    };
    // This function is called by the system on every frame
    FreeCameraKeyboardRotateInput.prototype.checkInputs = function() {
        if (this._onKeyDown) {
            var camera = this.camera;
            // Keyboard
            for (var index = 0; index < this._keys.length; index++) {
                var keyCode = this._keys[index];
                //console.log(keyCode);
                if (this.keysLeft.indexOf(keyCode) !== -1) {

                    camera.position.x += this.sensibility;
                } else if (this.keysRight.indexOf(keyCode) !== -1) {

                    camera.position.x -= this.sensibility;
                } else if (this.keysTop.indexOf(keyCode) !== -1) {
                    console.log(keyCode);
                    camera.position.z -= this.sensibility;
                } else if (this.keysBottom.indexOf(keyCode) !== -1) {
                    console.log(keyCode);
                    camera.position.z += this.sensibility;
                }
            }
        }

        if (this._onMouseDown) {
            var camera = this.camera;
            
            if(this._mouseStartX!=null && this._mouseStartY!=null){
                //console.log(this._mouseMoveX , (this._mouseMovePreX?this._mouseMovePreX:0), this._mouseMoveY , (this._mouseMovePreY?this._mouseMovePreY:0));
                var direction = getState("canvas3D", "perspectiveMode");
                var left = (this._mouseMovePreX?(this._mouseMoveX - this._mouseMovePreX):0)*this.sensibility*this._mouseWheelIni/5;

                var top = (this._mouseMovePreY?(this._mouseMoveY - this._mouseMovePreY):0)*this.sensibility*this._mouseWheelIni/5;

                if(direction=="up"){
                    camera.position.x += left;
                    camera.position.z -= top
                }
                else if(direction=="down"){
                    camera.position.x += left;
                    camera.position.z += top
                }
                else if(direction=="front"){
                    camera.position.x -= left;
                    camera.position.y += top
                }
                else if(direction=="back"){
                    camera.position.x += left;
                    camera.position.y += top
                }
                else if(direction=="left"){
                    camera.position.z += left;
                    camera.position.y += top
                }
                else if(direction=="right"){
                    camera.position.z -= left;
                    camera.position.y += top
                }
                


                this._mouseMovePreX = this._mouseMoveX;
                this._mouseMovePreY = this._mouseMoveY;
            }
            
            if(this._mouseWheelDelta){
                console.log(this._mouseWheelDelta);
                var w = this.element.width;
                var h = this.element.height;
                var value = this._mouseWheelIni - this._mouseWheelDelta * this.wheelSensibility;
                camera.orthoLeft = -value * w / h;
                camera.orthoRight = value * w / h;
                camera.orthoTop = value;
                camera.orthoBottom = -value;

                this._mouseWheelIni = value;
                this._mouseWheelDelta = null;
            }
        }
    };
    FreeCameraKeyboardRotateInput.prototype.getTypeName = function() {
        return "FreeCameraKeyboardRotateInput";
    };
    FreeCameraKeyboardRotateInput.prototype._onLostFocus = function(e) {
        this._keys = [];
    };
    FreeCameraKeyboardRotateInput.prototype.getSimpleName = function() {
        return "keyboardRotate";
    };
    // Connect to camera:
    camera.inputs.add(new FreeCameraKeyboardRotateInput());

    return camera;
}

function current3DPageHanddler(pageId){
    var babylon = getBabylonInstance();
    var canvas = babylon.engine.getRenderingCanvas();
    var curParam = babylon.scene[pageId];

    if(!curParam){
        return;
    }

    babylon.sceneList.forEach((param)=>{
        param.camera.detachControl(canvas);
    });

    curParam.camera.attachControl(canvas, false);

    // clearTimeout(window.msChangeCurPageRefresh3Dstatic);
    setTimeout(() => {
        staticCanvas3DRefreshBypageId(pageId);
    }, 0);
}



//初始化loading动画
function initial3DLoading(logoSrc){

    var loadingScreenDiv = document.createElement("div");

    var loadingScreenDivTxt = document.createElement("div");
    loadingScreenDivTxt.style.cssText = "font-family: Arial;font-size: 14px;color: white;text-align: center;margin-top: 10px;";
    loadingScreenDivTxt.setAttribute("id", "msLoadingScreenTxt");

    var loadingScreenDivImg = document.createElement("img");
    loadingScreenDivImg.src = (logoSrc!=null && logoSrc.length>0)?logoSrc: mengshuBase64;
    loadingScreenDivImg.style.cssText = "text-align: center;margin: 0px auto;margin-top: -90px;";


    var loadingScreenBar = document.createElement("div");
    loadingScreenBar.style.cssText = "width: 100%;height: 20px;font-family: Arial;font-size: 14px;color: white;text-align: center;position: relative;margin-top: 17px;";

    var loadingScreenBarLoad = document.createElement("div");
    loadingScreenBarLoad.setAttribute("id", "msLoadingScreenBarLoad");
    loadingScreenBarLoad.style.cssText = "position: absolute; left: 0px; height: 3px; background: rgb(225, 226, 133); width: 0%;";
    loadingScreenBar.appendChild(loadingScreenBarLoad);

    var loadingScreenDivPercent = document.createElement("div");
    loadingScreenDivPercent.style.cssText = "width: 100%;height: 20px;font-family: Arial;font-size: 14px;color: white;text-align: center;";
    loadingScreenDivPercent.setAttribute("id", "msLoadingScreenPercent");

    var loadingScreenCC = document.createElement("div");
    loadingScreenCC.style.cssText = "text-align: center;width: 100%;";

    //开始loading即显示滚动条,提升体验
    loadingScreenBarLoad.style.width = "5%";
    loadingScreenDivPercent.innerHTML = "5%";
    loadingScreenDivTxt.innerHTML = '开始加载资源!';

    // if(!isLogo){
        loadingScreenCC.appendChild(loadingScreenDivImg);
    // }
    
    loadingScreenCC.appendChild(loadingScreenDivTxt);
    loadingScreenCC.appendChild(loadingScreenBar);
    loadingScreenCC.appendChild(loadingScreenDivPercent);

    loadingScreenDiv.appendChild(loadingScreenCC);

    loadingScreenDiv.style.cssText = "position: absolute;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 3000;background-color: rgb(0, 0, 0);display:-webkit-flex;display:flex;align-items: center;justify-content: center;";
    document.getElementsByTagName("body")[0].appendChild(loadingScreenDiv);
    loadingScreenDiv.setAttribute("id", "msLoadingScreen");

    // var loadingScreenDiv = document.getElementById("loadingScreen");

    // function customLoadingScreen() {
    //     console.log("customLoadingScreen creation")
    // }
    // customLoadingScreen.prototype.displayLoadingUI = function() {
    //     console.log("customLoadingScreen loading")
    //     // loadingScreenDiv.innerHTML = "loading";
    //     loadingScreenDiv.style.display = "flex";
    // };
    // customLoadingScreen.prototype.hideLoadingUI = function() {
    //     console.log("customLoadingScreen loaded")
    //     // console.trace();
    //     // loadingScreenDiv.style.display = "none";
    // };
    // var loadingScreen = new customLoadingScreen();
    // // engine.loadingScreen = loadingScreen;
    // return loadingScreen;
}


//初始化loading动画
function initialLoading(logoSrc){
    var loadingScreenDiv = document.createElement("div");

    var loadingScreenDivTxt = document.createElement("div");
    loadingScreenDivTxt.style.cssText = "font-family: Arial;font-size: 14px;color: white;text-align: center;margin-top: 10px;";
    loadingScreenDivTxt.setAttribute("id", "msLoadingScreenTxt");

    var loadingScreenDivImg = document.createElement("img");
    loadingScreenDivImg.src = (logoSrc!=null && logoSrc.length>0)?logoSrc: mengshuBase64;
    loadingScreenDivImg.style.cssText = "text-align: center;margin: 0px auto;margin-top: -90px;";


    var loadingScreenBar = document.createElement("div");
    loadingScreenBar.style.cssText = "width: 100%;height: 20px;font-family: Arial;font-size: 14px;color: white;text-align: center;position: relative;margin-top: 17px;";

    var loadingScreenBarLoad = document.createElement("div");
    loadingScreenBarLoad.setAttribute("id", "msLoadingScreenBarLoad");
    loadingScreenBarLoad.style.cssText = "position: absolute; left: 0px; height: 3px; background: rgb(225, 226, 133); width: 0%;";
    loadingScreenBarLoad.style.display = 'none';
    loadingScreenBar.appendChild(loadingScreenBarLoad);


    var loadingScreenDivPercent = document.createElement("div");
    loadingScreenDivPercent.style.cssText = "width: 100%;height: 20px;font-family: Arial;font-size: 14px;color: white;text-align: center;";
    loadingScreenDivPercent.style.display = 'none';
    loadingScreenDivPercent.setAttribute("id", "msLoadingScreenPercent");

    var loadingScreenCC = document.createElement("div");
    loadingScreenCC.style.cssText = "text-align: center;width: 100%;";
    loadingScreenCC.style.display = 'none';

    var loadContainer = document.createElement("div");
    loadContainer.setAttribute("id", "msLoadingLoadContainer");
    loadContainer.className ='zLoadContainer';


    var loader = document.createElement("div");
    loader.className ='zLoader';

    var message = document.createElement('div');
    message.innerHTML = '三维场景加载较慢\n请耐心等待';
    message.style.cssText = ' width: auto;\n' +
        '    position: absolute;\n' +
        '    top: 11em;\n' +
        '    left: 50%;\n' +
        '    transform: translate(-50%);\n' +
        '    text-indent: 0;\n' +
        '    text-align: center;\n' +
        '    white-space: nowrap;\n' +
        '    font-size: 1.5em;\n' +
        '    color: rgb(255, 255, 255);';
    loader.appendChild(message);

    var text = document.createTextNode("1%");
    var percent = document.createElement("div");
    percent.className ='zPercent';

    percent.appendChild(text);

    if(isMobileAgent()){
        loader.style.cssText = " font-size: 21px;" ;
        percent.style.cssText = 'position: absolute;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 3000;color:#fff;display:-webkit-flex;display:flex;align-items: center;justify-content: center;font-size:2.4em'
    }else{
        loader.style.cssText = 'font-size: 11px;' ;
        percent.style.cssText = 'position: absolute;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 3000;color:#fff;display:-webkit-flex;display:flex;align-items: center;justify-content: center;font-size:1.8em'

    }

    loadContainer.appendChild(loader);


    loadContainer.appendChild(percent);

    //开始loading即显示滚动条,提升体验
    loadingScreenBarLoad.style.width = "";
    loadingScreenDivPercent.innerHTML = "";
    loadingScreenDivTxt.innerHTML = '';

    // if(!isLogo){
    loadingScreenCC.appendChild(loadingScreenDivImg);
    // }

    loadingScreenCC.appendChild(loadingScreenDivTxt);
    loadingScreenCC.appendChild(loadingScreenBar);
    loadingScreenCC.appendChild(loadingScreenDivPercent);

    loadingScreenDiv.appendChild(loadingScreenCC);
    loadingScreenDiv.appendChild(loadContainer);

    loadingScreenDiv.style.cssText = "position: absolute;left: 0px;top: 0px;width: 100%;height: 100%;z-index: 3000;background-color: #0dc5c1;display:-webkit-flex;display:flex;align-items: center;justify-content: center;";
    document.getElementsByTagName("body")[0].appendChild(loadingScreenDiv);
    loadingScreenDiv.setAttribute("id", "msLoadingScreen");


}



function getPixelColor(canvas, x, y) {
    var thisContext = canvas.getContext("2d");
    var imageData = thisContext.getImageData(x, y, 1, 1);
    // 获取该点像素数据
    var pixel = imageData.data;
    var r = pixel[0];
    var g = pixel[1];
    var b = pixel[2];
    var a = pixel[3] / 255;
    a = Math.round(a * 100) / 100;
    var rHex = r.toString(16);
    r < 16 && (rHex = "0" + rHex);
    var gHex = g.toString(16);
    g < 16 && (gHex = "0" + gHex);
    var bHex = b.toString(16);
    b < 16 && (bHex = "0" + bHex);
    var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
    var hexColor = "#" + rHex + gHex + bHex;
    return {
        rgba: rgbaColor,
        rgb: rgbColor,
        hex: hexColor,
        r: r,
        g: g,
        b: b,
        a: a
    };
}

export {
    staticCanvas3DRefresh,
    staticCanvas3DRefreshBypageId,
    ini3DSceneList,
    setLoadedState,
    getLoadedState,
    createScene,
    getBabylonInstance,
    getBabylonCurScene,
    createSceneParam,
    current3DPageHanddler,
    initial3DLoading,
    initialLoading,
    commitCanvas3DMutationsUpdate,
    getPixelColor,
    startSign,
    changePageFunction,
    addIconToFile,
    addPageInital3D,
    delPageInital3D,
    createGizmoManager,
    screenShootBabylonOffline,
    startLottery,
    stopLottery,
    changeBackground,
}