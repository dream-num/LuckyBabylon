import store from '@/store/index.js';
import { getState } from '@/canvas/common';
import { materialDatas, textureDatas, masterTemplate,updateIDList,fresnelParameterMap,textureMap,updateExcludeMap,lightDatas,mainTypeTokeyMap,ms3dfKey } from '@/master/js/meshData';
import { createGizmoManager } from '@/canvas/common3D';
import pako from 'pako/dist/pako';
import { deepCopy } from '@/utils/util';
import imgFilters from '@/data/imageFiltersData';
import jsbeautifier from "js-beautify";

function getMeshById(id){
    let canvas = document.getElementById('renderCanvas');
    let scene = canvas.babylon.scene;
    return scene.getMeshByName(id);
}

function getScreenSize(){
    let canvas = document.getElementById('renderCanvas');
    let engine = canvas.babylon.engine;
    return [engine.getRenderWidth(), engine.getRenderHeight()];
}

function generateRandomKey(prefix){
    if (prefix == null) {
        prefix = 'page';
    }

    let userAgent = window.navigator.userAgent
        .replace(/[^a-zA-Z0-9]/g, '')
        .split('');
    let mid = '';
    for (let i = 0; i < 3; i++) {
        mid += userAgent[Math.round(Math.random() * (userAgent.length - 1))];
    }
    let time = new Date().getTime().toString();

    let last = "";
    for (let i = 0; i < 4; i++) {
        last += time[Math.round(Math.random() * (time.length - 1))];
    }

    return prefix + '_' + mid + '_' + last;
}

function getBabylon(key, id){
    if(id==null){
        id = "renderCanvas";
    }
    let babylon = document.getElementById(id).babylon;

    if(!babylon){
        return null;
    }

    if(key!=null){
        return babylon[key];
    }

    let scene = babylon.scene, camera = scene.activeCamera, gizmo = babylon.gizmo, exeClass = babylon.particle3D, font = babylon.font, compiler = babylon.compiler;

    return {
        scene:scene,
        camera:camera,
        gizmo:gizmo,
        exeClass:exeClass,
        font:font,
        compiler:compiler,
        curUpdateObject:babylon.curUpdateObject,
        assistObject:babylon.assistObject,
        assistGizmo:babylon.assistGizmo,
        utilLayer:babylon.utilLayer
    }
}

function setBabylon(key, value, id){
    if(id==null){
        id = "renderCanvas";
    }
    let babylon = document.getElementById(id).babylon;

    babylon[key] = value;
}

function showLoadingScreen(text){
    let o = document.getElementById("loadingScreen"), div = document.querySelector("#loadingScreen div");
    o.style.display = "block";
    div.innerHTML = text;
}

function hideLoadingScreen(){
    let o = document.getElementById("loadingScreen");
    o.style.display = "none";
}

function addObjectView(option){
    addObjectViewHandler(option);

    //历史记录
    addHistory(option, "delete");  
}

function addObjectViewHandler(option){
    var b = getBabylon();
    let object;

    if(option.mainType=="particle"){
        object = b.exeClass.createParticle(option, b);
        createAssistMash(option);
    }
    // else if(option.mainType=="material"){
    //     object = b.exeClass.createMaterial(material, b.scene, b.camera);
    // }
    // else if(option.mainType=="texture"){
    //     object = b.exeClass.createTexture(texture, b.scene, b.camera);
    // }
    else {
        object = b.exeClass.createObject(option, b , "b");
        if(option.mainType=="light"){
            createAssistMash(option);
        }
        else if(option.mainType=="mesh"){
            option.subMeshes = [];
            object.subMeshes.forEach(sub=>{
                let o = {
                    indexCount: sub.indexCount,
                    indexStart: sub.indexStart,
                    materialIndex: sub.materialIndex,
                    verticesCount: sub.verticesCount,
                    verticesStart: sub.verticesStart,
                }
                option.subMeshes.push(o);
            });
            option.verticesCount = object.getTotalVertices();
            option.indexCount = object.getTotalIndices();
        }
    }

    if(option.mainType=="mesh" && option.type=="3DText"){
        let index = 0, curMeshId=option.id, meshes = store.state.master.meshes;
        for(let i = 0; i < meshes.length; i++){
            if(meshes[i].id == curMeshId){
                index = i;
                break;
            }
        }
        // option.shapes = mesh._msShapes;
        store.commit('master/updateCommands', {
            key: 'meshes.${'+ index +'}.shapes',
            value: object._msShapes
        });
    }

    selectedMeshed(option.id, option.mainType);
}

function addParticleView(particleOption){
    setTimeout(()=>{
        var b = getBabylon();
        b.exeClass.createParticle(particleOption, b);
    },0);
    createAssistMash(particleOption);

    selectedMeshed(particleOption.id, "particle");
}

function addMaterialView(material){
    setTimeout(()=>{
        var b = getBabylon();
        b.exeClass.createMaterial(material, b.scene, b.camera);
    },0);
}

function addTextureView(texture){
    setTimeout(()=>{
        var b = getBabylon();
        b.exeClass.createTexture(texture, b.scene, b.camera);
    },0);
}

let updateObjectViewTimeout = null;
function updateObjectView(updateType, option, index, preObject){
    clearTimeout(updateObjectViewTimeout);
    updateObjectViewTimeout = setTimeout(()=>{
        updateObjectViewHandler(updateType, option, index, preObject);
        //历史记录
        // if(option[updateType] instanceof Object){
        //     var result = Compare(option[updateType], preObject[updateType]);
        //     if(result){
        //         return;
        //     }
        // }
        // else 
        if(option[updateType] instanceof Array){
            let equal = true;
            option[updateType].forEach((item, index)=>{
                if(item != preObject[updateType][index]){
                    equal = false;
                }
            });

            if(equal){
                return;
            }
        }
        else{
            if(option[updateType]==preObject[updateType]){
                return;
            }
        }
        addHistory(preObject, "update", updateType, index);

    },200);
}

function updateObjectViewHandler(updateType, option, index, preObject){
    var b = getBabylon();
    var mesh = b.exeClass.updateBabylonObject(updateType, option, b);
    // if(updateType=="rotation"){
    //     b.gizmo.attachToMesh(null);
    // }
    if(option.mainType=="mesh" && option.type=="3DText"){
        // option.shapes = mesh._msShapes;
        store.commit('master/updateCommands', {
            key: 'meshes.${'+ index +'}.shapes',
            value: mesh._msShapes
        });
    }
    else if(option.mainType=="particle"){
        // createAssistMash(option);
        if(updateType=="emitterMode"){
            if(option.emitterMode==1){
                let mauther = b.scene.getMeshByID(option.id);
                if(mauther){
                    if(mauther.selfGizmo){
                        mauther.selfGizmo.attachedMesh = null;
                    }
                    mauther.dispose();
                }
            }
            else{
                createAssistMash(option);
                createParticleGizmo(option);
            }
        }
        else if(updateType=="enableSubEmitter"){
            if(option.enableSubEmitter){
                let mauther = b.scene.getMeshByID(option.id);
                if(mauther){
                    if(mauther.selfGizmo){
                        mauther.selfGizmo.attachedMesh = null;
                    }
                    mauther.dispose();
                }
                clearAuxAndGizmo();
            }
            else{
                createAssistMash(option);
                createParticleGizmo(option);
            }
        }
        else{
            if(updateType=="isPickable"){
                let pick = option[updateType];
                let mesh = b.scene.getMeshByID(option.id);
                if(mesh){
                    mesh.isPickable = pick;
                    mesh.isVisible = pick;
                }
                if(pick){
                    createParticleGizmo(option);
                }
                else{
                    clearAuxAndGizmo();
                    
                }
            }
            else{
                createParticleGizmo(option);
            }
            
        }
            

        
    }
    else if(updateType=="isVisible"){
        if(b.gizmo){
            if(b.gizmo._attachedMesh == b.scene.getMeshByID(option.id)){
                b.gizmo.attachToMesh(null);
            }
        }
    }
    // else if(option.mainType=="light"){
    //     // clearAuxAndGizmo();
    //     // createAssistMash(option);
    // }
}


function isObj(object) {
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
}

function isArray(object) {
    return object && typeof (object) == 'object' && object.constructor == Array;
}

function getLength(object) {
    var count = 0;
    for (var i in object) count++;
    return count;
}

function Compare(objA, objB) {
    if (!isObj(objA) || !isObj(objB)) return false; //判断类型是否正确
    if (getLength(objA) != getLength(objB)) return false; //判断长度是否一致
    return CompareObj(objA, objB, true);//默认为true
}

function CompareObj(objA, objB, flag) {
    for (var key in objA) {
        if (!flag) //跳出整个循环
            break;
        if (!objB.hasOwnProperty(key)) { flag = false; break; }
        if (!isArray(objA[key])) { //子级不是数组时,比较属性值
            if (objB[key] != objA[key]) { flag = false; break; }
        } else {
            if (!isArray(objB[key])) { flag = false; break; }
            var oA = objA[key], oB = objB[key];
            if (oA.length != oB.length) { flag = false; break; }
            for (var k in oA) {
                if (!flag) //这里跳出循环是为了不让递归继续
                    break;
                flag = CompareObj(oA[k], oB[k], flag);
            }
        }
    }
    return flag;
}

function deleteObjectView(option, that){
    deleteObjectViewHandler(option, that);

    //历史记录
    addHistory(option, "add");  
}

function deleteObjectViewHandler(option, that){
    var b = getBabylon();
    if(option.mainType=="mesh"){
        let mesh = b.scene.getMeshByID(option.id);
        if(mesh.instances && mesh.instances.length>0){
            that.$confirm('此物体存在副本实例, 是否确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                b.exeClass.deleteObject(option.mainType, option.id, b);
                selectedMeshed();
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        }
        else{
            b.exeClass.deleteObject(option.mainType, option.id, b,option);
            selectedMeshed(); 
        }
    }
    else{
        b.exeClass.deleteObject(option.mainType, option.id, b,option);
        selectedMeshed(); 
    }

}

let historyLength = 100;
function addHistory(option, controll, updateType, index){    
    let historyIndex = getState("master", "historyIndex"), historyListCache = getState("master", "historyListCache");

    if(historyListCache.length>historyLength){//如果历史记录大于historyLength，则从记录开始删除
        store.commit("master/deleteCommands", {
            key: 'historyListCache.${0}',
            deleLen:1,
        });
    }

    if(historyIndex==null){//没有历史记录
        historyIndex = 0;
    }
    else{
        if(historyIndex < historyListCache.length-1){//如果经过了撤销操作，则从当前开始删除重做的记录
            store.commit("master/deleteCommands", {
                key: 'historyListCache.${'+ (historyIndex+1) +'}',
                deleLen:historyListCache.length,
            });
        }
        historyIndex++;
    }

    store.commit("master/insertCommands", {
        key: 'historyListCache',
        value: {
            controll:controll,
            updateType:updateType,
            index:index,
            data:option,
        }
    });

    store.commit('master/updateCommands', {
        key: 'historyIndex',
        value: historyIndex
    });
}

function removeAllHistory(){
    store.commit('master/updateCommands', {
        key: 'historyIndex',
        value: null
    });

    store.commit('master/updateCommands', {
        key: 'historyListCache',
        value: []
    });
}

function undoHandler(that){
    let historyIndex = getState("master", "historyIndex"), historyListCache = getState("master", "historyListCache");
    let his = historyListCache[historyIndex];
    
    if(historyIndex==null || historyIndex>=historyListCache.length){
        that.$message({
            message: '没有历史记录',
            type: 'warning'
        });
        return;
    }

    if(his==null){
        that.$message({
            message: '历史记录为空',
            type: 'warning'
        });
        return;
    }


    if(his.controll=="update"){
        let preObject = getOptionByID(his.data.id, his.data.mainType);
        if(his.data.mainType=="scene"){
            preObject = {
                mainType:"scene",
            }

            Object.keys(his.data).forEach(key=>{
                if(key!="mainType"){
                    preObject[key] = getState("master", key);
                }
            });
        }
        

        let updateType =[];
        if(his.updateType instanceof Array){
            updateType = updateType.concat(his.updateType);
        }
        else{
            updateType.push(his.updateType);
        }

        let updatekey = mainTypeTokeyMap[his.data.mainType];

        updateType.forEach(type=>{
            updateObjectViewHandler(type, his.data, his.index, preObject);
            if(his.data.mainType=="scene"){
                store.commit('master/updateCommands', {
                    key: type,
                    value: his.data[type]
                });
            }
            else{
                store.commit('master/updateCommands', {
                    key: updatekey + '.${'+ his.index +'}.' + type,
                    value: his.data[type]
                });
            }
            
        });

        if(his.data.mainType=="particle"){
            createParticleGizmo(his.data);
        }

        store.commit('master/updateCommands', {
            key: 'historyListCache.${'+ historyIndex +'}.data',
            value: preObject
        });

        store.commit('master/updateCommands', {
            key: 'historyIndex',
            value: historyIndex-1
        });


    }
    else if(his.controll=="add"){
        store.commit('master/updateCommands', {
            key: 'historyListCache.${'+ historyIndex +'}.controll',
            value: "delete"
        });
        addObjectViewHandler(his.data);

        if(his.data.mainType=="particle"){
            createParticleGizmo(his.data);
        }

        store.commit('master/updateCommands', {
            key: 'historyIndex',
            value: historyIndex-1
        });

        let insertKey = mainTypeTokeyMap[his.data.mainType];
        store.commit("master/insertCommands", {
            key: insertKey,
            value: his.data
        });


    }
    else if(his.controll=="delete"){
        store.commit('master/updateCommands', {
            key: 'historyListCache.${'+ historyIndex +'}.controll',
            value: "add"
        });
        deleteObjectViewHandler(his.data);

        store.commit('master/updateCommands', {
            key: 'historyIndex',
            value: historyIndex-1
        });

        let deleteKey = mainTypeTokeyMap[his.data.mainType];
        store.commit('master/changeCurModelName', null);
        store.commit("master/deleteItem", {
            key: deleteKey,
            id: his.data.id
        });
    } 

    setTimeout(() => {
         setCurObject(his.data.id, his.data.mainType);
    }, 0);

}

function redoHandler(that){
    let historyIndex = getState("master", "historyIndex")+1, historyListCache = getState("master", "historyListCache");
    let his = historyListCache[historyIndex];
    
    if(historyIndex==null || historyIndex>=historyListCache.length || his==null){
        that.$message({
            message: '没有历史记录',
            type: 'warning'
        });
        return;
    }


    if(his.controll=="update"){
        let preObject = getOptionByID(his.data.id, his.data.mainType);
        if(his.data.mainType=="scene"){
            preObject = {
                mainType:"scene",
            }

            Object.keys(his.data).forEach(key=>{
                if(key!="mainType"){
                    preObject[key] = getState("master", key);
                }
            });
        }

        let updateType =[];
        if(his.updateType instanceof Array){
            updateType = updateType.concat(his.updateType);
        }
        else{
            updateType.push(his.updateType);
        }

        let updatekey = mainTypeTokeyMap[his.data.mainType];

        updateType.forEach(type=>{
            updateObjectViewHandler(type, his.data, his.index, preObject);
            if(his.data.mainType=="scene"){
                store.commit('master/updateCommands', {
                    key: type,
                    value: his.data[type]
                });
            }
            else{
                store.commit('master/updateCommands', {
                    key: updatekey + '.${'+ his.index +'}.' + type,
                    value: his.data[type]
                }); 
            }
            
        });

        if(his.data.mainType=="particle"){
            createParticleGizmo(his.data);
        }

        store.commit('master/updateCommands', {
            key: 'historyListCache.${'+ historyIndex +'}.data',
            value: preObject
        });

        store.commit('master/updateCommands', {
            key: 'historyIndex',
            value: historyIndex
        });


    }
    else if(his.controll=="add"){
        store.commit('master/updateCommands', {
            key: 'historyListCache.${'+ historyIndex +'}.controll',
            value: "delete"
        });
        addObjectViewHandler(his.data);

        if(his.data.mainType=="particle"){
            createParticleGizmo(his.data);
        }

        store.commit('master/updateCommands', {
            key: 'historyIndex',
            value: historyIndex
        });

        let insertKey = mainTypeTokeyMap[his.data.mainType];
        store.commit("master/insertCommands", {
            key: insertKey,
            value: his.data
        });
    }
    else if(his.controll=="delete"){
        store.commit('master/updateCommands', {
            key: 'historyListCache.${'+ historyIndex +'}.controll',
            value: "add"
        });
        deleteObjectViewHandler(his.data);

        store.commit('master/updateCommands', {
            key: 'historyIndex',
            value: historyIndex
        });

        let deleteKey = mainTypeTokeyMap[his.data.mainType];
        store.commit('master/changeCurModelName', null);
        store.commit("master/deleteItem", {
            key: deleteKey,
            id: his.data.id
        });
    } 

    setTimeout(() => {
        setCurObject(his.data.id, his.data.mainType);
    }, 0);
}

function addProgramView(option){
    var b = getBabylon();
    var mesh = b.exeClass.createProgram(option, b , "b");
}

function updateProgramView(option, isRefresh){
    var b = getBabylon();
    if(isRefresh==null){
        isRefresh = false;
    }
    if(option.type=="InnerProgram" && isRefresh){
        b.scene.dispose();
        initialSceneAndGizmo(b.engine, b.exeClass);
        option.ms3df = serializeMs3df();
    }

    b.exeClass.updateProgram(option, b , "b");
}

let deleteProgramViewTimeout = null;
function deleteProgramView(option){
    clearTimeout(deleteProgramViewTimeout);
    deleteProgramViewTimeout = setTimeout(() => {
        var b = getBabylon();
        if(option.type=="InnerProgram"){
            b.scene.dispose();
            initialSceneAndGizmo(b.engine, b.exeClass);
            option.ms3df = serializeMs3df();
        }
        b.exeClass.deleteProgram(option, b , "b");
    }, 300);

}



function selectedMeshed(id, mainType, that, pointerInfo){
    // curUpdateObject:null,
    // assistObject:[],
    // assistGizmo:[],
    let b = getBabylon();
    cancelBatchTransform();
    b.gizmo.attachToMesh(null);
    clearAuxAndGizmo();

    let curKey=null, selectedTreeMangeKey=[];
    setCurObject(id, mainType);
    
    if(mainType == "container"){
        store.commit('master/changeCurModelName', 'scene');
        treeSelected([], that);
        // setCurObject();
        return;
    }
    else if(mainType == "scene"){
        store.commit('master/changeCurModelName', 'scene');
        treeSelected([], that);
        // setCurObject();
        return;
    }
    else if(mainType == "mesh"){
        curKey = "curMeshId";
        if(that){
            let curMesh = getCurObject();
            if(curMesh && curMesh.materialId!=null){
                selectedTreeMangeKey.push(curMesh.materialId);
                let materials = getState("master", "materials");
                let curMaterial;
                for(let i=0;i<materials.length;i++){
                    let m = materials[i];
                    if(m.id==curMesh.materialId){
                        curMaterial = m;
                        break
                    }
                }
                
                if(curMaterial){
                    Object.keys(curMaterial).forEach((key)=>{
                        if(key.indexOf("Texture")>-1){
                            let tid = curMaterial[key];
                            if(tid){
                                selectedTreeMangeKey.push(tid);
                            }
                        }
                    });
                }
    
            }

            if(curMesh && curMesh.skeletonId!=null){
                selectedTreeMangeKey.push(curMesh.skeletonId);
            }
        }
    }
    else if(mainType == "transformNode" || mainType == "instance"){
        curKey = "curMeshId";
    }
    else if(mainType == "material"){
        curKey = "curMaterialId";
    }
    else if(mainType == "texture"){
        curKey = "curTextureId";
    }
    else if(mainType == "light"){
        curKey = "curLightId";
    }
    else if(mainType == "camera"){
        curKey = "curCameraId";
    }
    else if(mainType == "particle"){
        curKey = "curParticleId";
    }
    else if(mainType == "program"){
        curKey = "curProgramId";
    }
    else if(mainType == "spriteManager"){
        curKey = "curSpriteManagerId";
    }
    else if(mainType == "skeleton"){
        curKey = "curSkeletonId";
    }
    else if(mainType == "multiMaterial"){
        curKey = "curMultiMaterialId";
    }
    else if(mainType == "gui2D"){
        curKey = "curGui2DId";
    }

    store.commit('master/refreshMasterLayerTime');
    if(selectedTreeMangeKey>0){
        selectedTreeMangeKey.push(id);
    }
    
    if(curKey == null){
        store.commit('master/changeCurModelName', 'camera');
        store.commit('master/changeCurId', {
            key: "curCameraId",
            value: getState("master", "cameras")[0].id
        });
        treeSelected([], that);
        // setCurObject();
        return;
    }

    treeSelected(selectedTreeMangeKey, that);

    store.commit('master/changeCurId', {
        key: curKey,
        value: id
    });

    store.commit('master/changeCurModelName', mainType);

    if(mainType=="mesh" || mainType == "transformNode" || mainType == "instance"){
        // let mode = getState("master", "curCameraEditMode");
        

        let isFocus = false;
        if(pointerInfo!=null){
            let e = pointerInfo.event;
            if(e.which==3){
                isFocus = true;
            }
        }
        if(isFocus){
            let camera = b.scene.activeCamera;
            let mesh = b.scene.getMeshByID(id);
            if(!mesh){
                mesh = b.scene.getTransformNodeByID(id);
            }

            let x = mesh.position.x, y = mesh.position.y, z = mesh.position.z;

            // camera.setTarget(new BABYLON.Vector3(x,y,z));

            let target = camera.getTarget();
            
            // let arrayList = BABYLON.Vector3.Lerp(target,new BABYLON.Vector3(x,y,z),100);
            let distance = 10;
            for(let i=0;i<distance;i++){
                let v = BABYLON.Vector3.Lerp(target,new BABYLON.Vector3(x,y,z),i/distance);
                setTimeout(() => {
                    camera.setTarget(v);
                }, i*50);  
            }

            store.commit('master/updateCommands', {
                key: 'cameras.${0}.target',
                value: [x,y,z]
            });
            
        }
    }

    if(mainType=="mesh"){
        let mesh = b.scene.getMeshByID(id);
        if(mesh!=null && mesh.isPickable){
            b.gizmo.attachToMesh(mesh);
        }

        
    }
    else if(mainType == "transformNode" || mainType == "instance"){
        store.commit('master/changeCurModelName', "mesh");
        let mesh = b.scene.getMeshByID(id);
        if(!mesh){
            mesh = b.scene.getTransformNodeByID(id);
        }
        if(mesh!=null && mesh.isPickable){
            b.gizmo.attachToMesh(mesh);
        }

    }
    else if(mainType=="light"){
        // let curObject = getCurObject();
        // createAssistMash(curObject);

        let mesh = b.scene.getMeshByID(id);
        let light = b.scene.getLightByID(id);
        if(mesh!=null && light!=null){
            var gizmoManager = new BABYLON.GizmoManager(b.scene);
            let className = light.getClassName();
            if(className!="HemisphericLight" ){
                gizmoManager.positionGizmoEnabled = true;
                gizmoManager.gizmos.positionGizmo.onDragEndObservable.add(()=>{
                    updateViewLightEnd();
                });
            }

            if(className!="PointLight" && className!="DirectionalLight"){
                gizmoManager.rotationGizmoEnabled = true;
                gizmoManager.gizmos.rotationGizmo.onDragEndObservable.add(()=>{
                    updateViewLightEnd();
                });
            }
            gizmoManager.usePointerToAttachGizmos = true;
            gizmoManager.attachableMeshes = [mesh];
            gizmoManager.attachToMesh(mesh);
            // b.gizmo.attachToMesh(mesh);

            let gizmoList = getBabylon("assistGizmo");
            gizmoList.push(gizmoManager);
            setBabylon("assistGizmo", gizmoList);
        }
    }
    else if(mainType=="particle"){
        createParticleGizmo();
    }

}

function treeSelected(selectedTreeMangeKey, that){
    if(that){
        if(that.$refs.treeManage){
            that.$refs.treeManage.setCheckedKeys(selectedTreeMangeKey);
        }
        else if(that.$refs.managerPannel){
            that.$refs.managerPannel.$refs.treeManage.setCheckedKeys(selectedTreeMangeKey);
        }
        
    }
}

function updateViewLightEnd(){
    let b = getBabylon(), scene = b.scene;
    let curObject = getCurObject();
    let light = scene.getLightByID(curObject.id);
    let index = null, lights = getState("master", "lights");
    for(let i = 0; i < lights.length; i++){
        if(lights[i].id == light.id){
            index = i;
            break;
        }
    }

    let className = light.getClassName();
    let preObject = deepCopy(lights[index]);

    let p = light.position, updateKey=[];
    if(p && className!="HemisphericLight" ){
        store.commit('master/updateCommands', {
            key: 'lights.${'+ index +'}.position',
            value: [p.x, p.y, p.z]
        });
        if(light.getClassName()=="DirectionalLight"){
            let pos = new BABYLON.Vector3(p.x, p.y, p.z);
            light.position = pos;
            light.direction = pos.scale(-1).normalize();
        }
        updateKey.push("position");
    }

    let d = light.direction;
    if(d && className!="PointLight" && className!="DirectionalLight"){
        store.commit('master/updateCommands', {
            key: 'lights.${'+ index +'}.direction',
            value: [d.x, d.y, d.z]
        });
        updateKey.push("direction");
    }

    // setTimeout(() => {
        // updateObjectViewHandler("position", lights[index], index);

    addHistory(preObject, "update", updateKey, index);
    // }, 0);

}


function getOptionByID(id, mainType){

    // if(mainType=="instance"){
    //     let objects = getState("master", "meshes");

    //     if(objects){
    //         for(let i =0;i<objects.length;i++){
    //             let o = objects[i];
    //             if(o.instances && o.instances.length>0){
    //                 for(let a=0;a<o.instances.length;a++){
    //                     let ins = o.instances[a];
    //                     if(ins.id==id){
    //                         return deepCopy(ins);
    //                     }
    //                 }
    //                 // o.instances.forEach(ins=>{
                        
    //                 // });
    //             }
    //         }
    //     }
    // }   
    let objects, key = mainTypeTokeyMap[mainType];
    // if(mainType=="mesh"){
    //     objects = getState("master", "meshes");
    // }
    // else if(mainType=="light"){
    //     objects = getState("master", "lights");
    // }
    // else if(mainType=="particle"){
    //     objects = getState("master", "particleSystems");
    // }

    // if(mainType=="mesh"){
    //     key = "meshes";
    // }
    // else if(mainType=="light"){
    //     key = "lights";
    // }
    // else if(mainType=="texture"){
    //     key = "textures";
    // }
    // else if(mainType=="material"){
    //     key = "materials";
    // }
    // else if(mainType=="spriteManager"){
    //     key = "spriteManagers";
    // }
    // else if(mainType=="particle"){
    //     key = "particleSystems";
    // }
    // else if(mainType=="program"){
    //     key = "programs";
    // }
    // else if(mainType=="transformNode"){
    //     key = "transformNodes";
    // }

    if(key==null){
        return null;
    }

    objects = getState("master", key);

    if(objects){
        for(let i =0;i<objects.length;i++){
            let o = objects[i];
            if(o.id==id){
                return deepCopy(o);
            }
        }
    }

    return null;
}

function setCurObject(id, mainType){
    // let canvas = document.getElementById('renderCanvas');
    let objects = getOptionByID(id, mainType);
    // if(mainType=="mesh"){
    //     objects = getState("master", "meshes");
    // }
    // else if(mainType=="light"){
    //     objects = getState("master", "lights");
    // }
    // else if(mainType=="particle"){
    //     objects = getState("master", "particleSystems");
    // }

    // if(objects){
    //     for(let i =0;i<objects.length;i++){
    //         let o = objects[i];
    //         if(o.id==id){
    //             setBabylon("curUpdateObject", o);
    //             return;
    //         }
    //     }
    // }

    setBabylon("curUpdateObject", objects);
}

function getCurObject(){
    let canvas = document.getElementById('renderCanvas');
    let o = canvas.babylon.curUpdateObject;
    if(o){
        return store.getters['master/getObjectByID']({
                type: mainTypeTokeyMap[o.mainType],
                id: o.id
            });
    }
    return null;
}

// function exeProgramOutter(){
//     let programs = getState("master", "programs");
// }

// function exeProgramInnerAfter(){

// }

// function exeProgramInnerBefore(){

// }


function clearAuxAndGizmo(){
    let objectList = getBabylon("assistObject");
    let gizmoList = getBabylon("assistGizmo");

    objectList.forEach(m=>{
        m.dispose(true, true);
    });

    gizmoList.forEach(g=>{
        if(g.onDragEndObservable){
            g.onDragEndObservable.clear();
        }

        if(g.gizmos && g.gizmos.positionGizmo && g.gizmos.positionGizmo.onDragEndObservable){
            g.gizmos.positionGizmo.onDragEndObservable.clear();
        }

        if(g.gizmos && g.gizmos.rotationGizmo && g.gizmos.rotationGizmo.onDragEndObservable){
            g.gizmos.rotationGizmo.onDragEndObservable.clear();
        }
        
        g.dispose();
    });

    setBabylon("assistObject", []);
    setBabylon("assistGizmo", []);

    // if( _this.gizmo){
    //     _this.gizmo.onDragEndObservable.clear();
    //     _this.gizmo.dispose();
    // }

    // if(_this.gizmoDirection1){
    //     _this.gizmoDirection1.onDragEndObservable.clear();
    //     _this.gizmoDirection1.dispose();
    // }

    // if(_this.gizmoDirection2){
    //     _this.gizmoDirection2.onDragEndObservable.clear();
    //     _this.gizmoDirection2.dispose();
    // }



    // if(_this.directionAuxLine){
    //     _this.directionAuxLine[0].dispose(true, true);
    //     _this.directionAuxLine[1].dispose(true, true);
    //     _this.directionAuxLine = null;
    // }


    // if(_this.direction1){
    //     _this.direction1.dispose(true, true);
    // }

    // if(_this.direction2){
    //     _this.direction2.dispose(true, true);
    // }
}

// curUpdateObject:babylon.curUpdateObject,
// assistObject:babylon.assistObject,
// assistGizmo:babylon.assistGizmo,
// utilLayer:babylon.utilLayer
function createParticleGizmo(curPs){
    clearAuxAndGizmo();

    if(curPs==null){
        curPs = getCurObject();
    }

    if(curPs==null){
        return;
    }

    let mesh = getBabylon("scene").getMeshByID(curPs.id);



    var cpe = eval('('+ JSON.stringify(curPs.particleEmitterType) +')');

    if(cpe!=null && cpe.direction1!=null && cpe.direction2!=null){
        createDirectionAndGizmo(cpe.direction1, cpe.direction2, curPs);
    }

    if(mesh==null){
        return;
    }
    
    if(curPs.emitter){
        if(curPs.emitter instanceof Array){
            mesh.position.x = curPs.emitter[0];
            mesh.position.y = curPs.emitter[1];
            mesh.position.z = curPs.emitter[2];
        }
        
    }
    

    // var mesh = pickInfo.pickedMesh;
    let utilLayer = getBabylon("utilLayer");

    var gizmo = new BABYLON.PositionGizmo(utilLayer);
    gizmo.planarGizmoEnabled = true;
    gizmo.attachedMesh = mesh;
    gizmo.scaleRatio = 0.7;
    mesh.selfGizmo = gizmo;
    gizmo.onDragStartObservable.add(()=>{
        getBabylon("assistObject").forEach(m=>{
            if(m.id.indexOf("particle_auxlines")>-1){
                m.dispose(true, true);
            }
        });
        // if(_this.directionAuxLine){
        //     _this.directionAuxLine[0].dispose(true, true);
        //     _this.directionAuxLine[1].dispose(true, true);
        //     _this.directionAuxLine = null;
        // }
    });
    gizmo.onDragEndObservable.add(()=>{
        var p = mesh.position;
        let curPs = getCurObject();

        if(curPs==null){
            return;
        }

        if(curPs.emitterMode=="0"){
            curPs.emitter = [Math.round(p.x*10)/10, Math.round(p.y*10)/10, Math.round(p.z*10)/10];

            updateViewParticleEnd("emitter", curPs);
        }


   
        createDirectionAuxLine(curPs);

        // _this.$refs.particle.refreshPaticle();
    });

    let gizmoList = getBabylon("assistGizmo");
    gizmoList.push(gizmo);
    setBabylon("assistGizmo", gizmoList);
}

function createDirectionAndGizmo(direction1, direction2, curPs){
    let scene = getBabylon("scene");
    let utilLayer = getBabylon("utilLayer");

    let objectList = getBabylon("assistObject");
    let gizmoList = getBabylon("assistGizmo");

    var sphere1 = BABYLON.Mesh.CreateSphere('particle_sphereDirection1', 16, 0.5, scene);
    sphere1.position.x = direction1[0];
    sphere1.position.y = direction1[1];
    sphere1.position.z = direction1[2];

    sphere1.material = new BABYLON.StandardMaterial('particle_sphereDirection1', scene);
    sphere1.material.diffuseColor = new BABYLON.Color3(1,0,1);

    objectList.push(sphere1);

    var gizmo = new BABYLON.PositionGizmo(utilLayer);
    gizmo.planarGizmoEnabled = true;
    gizmo.attachedMesh = sphere1;
    gizmo.scaleRatio = 0.7;
    gizmo.onDragStartObservable.add(()=>{
        getBabylon("assistObject").forEach(m=>{
            if(m.id.indexOf("particle_auxlines")>-1){
                m.dispose(true, true);
            }
        });
    });

    gizmo.onDragEndObservable.add(()=>{
        var p = sphere1.position;
        let curPs = getCurObject();
        if(curPs==null){
            return;
        }
        curPs.particleEmitterType.direction1 = [Math.round(p.x*10)/10, Math.round(p.y*10)/10, Math.round(p.z*10)/10];
        
        updateViewParticleEnd("particleEmitterType", curPs);
        
        createDirectionAuxLine(curPs);
        // let b = getBabylon();
        // b.exeClass.createParticle(curPs, b);
        // _this.$refs.particle.refreshPaticle();
    });

    gizmoList.push(gizmo);



    var sphere2 = BABYLON.Mesh.CreateSphere('particle_sphereDirection2', 16, 0.5, scene);
    sphere2.position.x = direction2[0];
    sphere2.position.y = direction2[1];
    sphere2.position.z = direction2[2];
    sphere2.material = new BABYLON.StandardMaterial('particle_sphereDirection2', scene);
    sphere2.material.diffuseColor = new BABYLON.Color3(1,1,0);

    objectList.push(sphere2);

    // if(this.showSceneMesh=="隐藏辅助"){
    //     sphere1.visibility = 0;
    //     sphere2.visibility = 0;
    // }

    var gizmo = new BABYLON.PositionGizmo(utilLayer);
    gizmo.planarGizmoEnabled = true;
    gizmo.attachedMesh = sphere2;
    gizmo.scaleRatio = 0.7;
    gizmo.onDragStartObservable.add(()=>{
        getBabylon("assistObject").forEach(m=>{
            if(m.id.indexOf("particle_auxlines")>-1){
                m.dispose(true, true);
            }
        });
    });
    gizmo.onDragEndObservable.add(()=>{
        var p = sphere2.position;
        let curPs = getCurObject();
        if(curPs==null){
            return;
        }
        curPs.particleEmitterType.direction2 = [Math.round(p.x*10)/10, Math.round(p.y*10)/10, Math.round(p.z*10)/10];
        
        updateViewParticleEnd("particleEmitterType", curPs);
        
        createDirectionAuxLine(curPs);
        // let b = getBabylon();
        // b.exeClass.createParticle(curPs, b);
        // _this.$refs.particle.refreshPaticle();
    });

    gizmoList.push(gizmo);

    setBabylon("assistObject", objectList);
    setBabylon("assistGizmo", gizmoList);

    createDirectionAuxLine(curPs);
}

function createDirectionAuxLine(curPs){
    let scene = getBabylon("scene");

    getBabylon("assistObject").forEach(m=>{
        if(m.id.indexOf("particle_auxlines")>-1){
            m.dispose(true, true);
        }
    });

    if(curPs==null){
        curPs = getCurObject();
    }
    
    var c =  curPs.emitter;
    if(curPs.emitterMode==1 && curPs.emitterObject){
        let o = getOptionByID(curPs.emitterObject, "camera");
        if(!o){
            o = getOptionByID(curPs.emitterObject, "mesh");
            if(!o){
                o = getOptionByID(curPs.emitterObject, "light");
            }
        }
        let pos = o.position;
        c = [pos[0], pos[1], pos[2]];
    }
    
    var d1 = curPs.particleEmitterType.direction1;
    var d2 = curPs.particleEmitterType.direction2;

    if(d1.length==0 && d2.length==0){
        return;
    }
    
    var lines1 = BABYLON.MeshBuilder.CreateLines("particle_auxlines1", {points: [
        new BABYLON.Vector3(d1[0], d1[1], d1[2]),
        new BABYLON.Vector3(c[0], c[1], c[2]),
    ]}, scene);
    lines1.color = new BABYLON.Color3(1,0,1);
    lines1.isPickable = false;


    var lines2 = BABYLON.MeshBuilder.CreateLines("particle_auxlines2", {points: [
        new BABYLON.Vector3(c[0], c[1], c[2]),
        new BABYLON.Vector3(d2[0], d2[1], d2[2]),
    ]}, scene);
    lines2.color = new BABYLON.Color3(1,1,0);
    lines2.isPickable = false;

    let objectList = getBabylon("assistObject");
    objectList.push(lines1);
    objectList.push(lines2);
    setBabylon("assistObject", objectList);
}

function createAssistMash(option){
    var b = getBabylon();

    if(option.mainType=="particle"){
        let ps = option;
        let pet = ps.particleEmitterType;

        

        if(pet == null || ps.emitterMode==1){
            return;
        }

        let apv = pet.type;
        if(apv == null){
            return;
        }
        apv = apv.replace("ParticleEmitter", "");
            
        let mesh;
        if(apv == "Point"){
            mesh = BABYLON.Mesh.CreateSphere(ps.id, 16, 0.5, b.scene);
        }
        else if(apv == "Box"){
            let max = pet.maxEmitBox;
            let min = pet.minEmitBox;
            mesh = BABYLON.MeshBuilder.CreateBox(ps.id, {width: 1, height: 1, depth: 1}, b.scene);
            
            mesh.scaling.x = Math.max(Math.abs(max[0] - min[0]), 0.1);
            mesh.scaling.y = Math.max(Math.abs(max[1] - min[1]), 0.1);
            mesh.scaling.z = Math.max(Math.abs(max[2] - min[2]), 0.1);
        }
        else if(apv == "Sphere"){
            mesh = BABYLON.MeshBuilder.CreateSphere(ps.id, {diameter: 1}, b.scene);
            mesh.scaling.x = pet.radius * 2;
            mesh.scaling.y = pet.radius * 2;
            mesh.scaling.z = pet.radius * 2;
        }
        else if(apv == "SphereDirected"){
            // mesh = BABYLON.MeshBuilder.CreateSphere(this.curParticleId, 16, pet.radius, scene);
            mesh = BABYLON.MeshBuilder.CreateSphere(ps.id, {diameter: 1}, b.scene);
            mesh.scaling.x = pet.radius * 2;
            mesh.scaling.y = pet.radius * 2;
            mesh.scaling.z = pet.radius * 2;
        }
        else if(apv == "Hemispheric"){
            mesh = BABYLON.HemisphereBuilder.CreateHemisphere(ps.id, {diameter: 1, segments: 16}, b.scene);
            mesh.scaling.x = pet.radius * 2;
            mesh.scaling.y = pet.radius * 2;
            mesh.scaling.z = pet.radius * 2;
        }
        else if(apv == "Cylinder"){
            mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 1, height: 1}, b.scene);
            mesh.scaling.x = pet.radius * 2;
            mesh.scaling.y = pet.height;
            mesh.scaling.z = pet.radius * 2;
        }
        else if(apv == "CylinderDirected"){
            mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 1, height: 1}, b.scene);
            mesh.scaling.x = pet.radius * 2;
            mesh.scaling.y = pet.height;
            mesh.scaling.z = pet.radius * 2;
        }
        else if(apv == "Cone"){
            let radius = pet.radius;
            let angle = pet.angle;
            let height = radius / Math.tan(angle / 2);
            mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 0, height: 1}, b.scene); 
            mesh.scaling.x = pet.radius * 2;
            mesh.scaling.y = height;
            mesh.scaling.z = pet.radius * 2;
        }
        
        if(mesh != null){
            mesh.position.x = ps.emitter[0];
            mesh.position.y = ps.emitter[1];
            mesh.position.z = ps.emitter[2];
            mesh.material = new BABYLON.StandardMaterial(ps.id, b.scene);
            mesh.material.wireframe = true;

            mesh.isPickable = ps.isPickable;
            mesh.isVisible = ps.isPickable;
            // if(this.showSceneMesh == "隐藏辅助"){
            //         mesh.visibility = 0;
            // }

            mesh.id = ps.id;
        }
    }
    else if(option.mainType=="light"){
        var lightGizmo = new BABYLON.LightGizmo();
        lightGizmo.light = b.scene.getLightByID(option.id);
        let mesh = BABYLON.Mesh.CreateSphere(option.id, 16, 1, b.scene);
        mesh.material = new BABYLON.StandardMaterial(option.id, b.scene);
        // mesh.material.wireframe = true;
        mesh.visibility =0;
        if(lightGizmo.light.position){
            mesh.position = lightGizmo.light.position.clone();
        }

        if(lightGizmo.light.direction){
            // mesh.rotation = lightGizmo.light.direction.clone();
            mesh.lookAt(new BABYLON.Vector3(0,0,0));
        }
    
        // let objectList = getBabylon("assistObject");
        // objectList.push(mesh);
        // setBabylon("assistObject", objectList);

        // let gizmoList = getBabylon("assistGizmo");
        // gizmoList.push(lightGizmo);
        // setBabylon("assistGizmo", gizmoList);

        lightGizmo.attachedMesh = mesh;
        lightGizmo.light.lightGizmo = lightGizmo;
    }
    
}

//右侧返回上一个模块
function goback(){
    let preModelName = getState('master', 'preModelName');
    store.commit('master/changeCurModelName', preModelName);
}

//上传图片检测
function uploadImageCheck(file, that){
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isGIF = file.type === 'image/gif';
    const isLt10M = file.size / 1024 / 1024 < 30;

    // if(!(isJPG || isPNG || isGIF)){
    //     that.$message.error('上传资源文件只能是 JPG/PNG/GIF 格式!');
    // }

    if(!isLt10M){
        that.$message.error('上传资源文件大小不能超过 30MB!');
    }

    // return (isJPG || isPNG || isGIF) && isLt10M;
    return isLt10M;
}

function serializeMs3df(downloadList, file, rotationAngle){
    let configKey = ms3dfKey;

    let config = {};

    let getValue = function(key){
        if(file){
            return file[key];
        }
        else{
            return getState("master", key);
        }
    }

    if(downloadList==null){
        Object.keys(configKey).forEach(key=>{
            config[key] =  getValue(key);
        });
    }
    else{
        let filterMap = {};
        downloadList.forEach(item=>{
            let s = item.selected;
            if(s && s.length>0){
                let m = {};
                s.forEach(id=>{
                    m[id] = true;
                });
                filterMap[item.model] = m;
            }
            else{
                filterMap[item.model] = {};
            }
            
            if(item.model=="scene" && item.checkAll ){
                filterMap["scene"] = true;
            }

            if(item.model=="environment" && item.checkAll ){
                filterMap["environment"] = true;
            }
        });

        let geometryIds = {}, meshIds={},skeletonIds={},textureIds={};
        Object.keys(configKey).forEach(key=>{
            let list = getValue(key), exportlist = [], filter = filterMap[key];
            if(list && list.length>0 && filter){
                list.forEach(o=>{
                    if(o.id in filter){
                        exportlist.push(o);
                    }
                    else if(key=="meshes" || key=="transformNodes"){
                        if( (filterMap["meshes"] && o.parentId in filterMap["meshes"]) || (filterMap["transformNodes"] && o.parentId in filterMap["transformNodes"]) ){
                            exportlist.push(o);
                        }
                    }
                    else if(key=="materials"){
                        if(filterMap["multiMaterials"] && o.parentId in filterMap["multiMaterials"]){
                            exportlist.push(o);
                        }
                    }

                    if(o.geometryId && o.geometryId.length>0){
                        geometryIds[o.geometryId] = true;
                    }

                    if(o.skeletonId && o.skeletonId.length>0){
                        skeletonIds[o.skeletonId] = true;
                    }

                    if(key=="meshes" || key=="transformNodes"){
                        meshIds[o.id] = true;

                        if(o.rotation && rotationAngle===false){
                            o.rotation[0] = o.rotation[0]*180/Math.PI;
                            o.rotation[1] = o.rotation[1]*180/Math.PI;
                            o.rotation[2] = o.rotation[2]*180/Math.PI; 
                        }

                    }

                    if(key=="materials"){//找与材质出关联的贴图
                        Object.keys(o).forEach(tk=>{
                            if(tk in textureMap && o[tk]){
                                textureIds[o[tk]] = true;
                            }

                            if(tk=="subSurface"){
                                if(o[tk] && o[tk].thicknessTexture){
                                    textureIds[o[tk].thicknessTexture] = true;
                                }
                            }

                            if(tk=="clearCoat"){
                                if(o[tk] && o[tk].bumpTexture){
                                    textureIds[o[tk].bumpTexture] = true;
                                }
                            }

                            if(tk=="anisotropy"){
                                if(o[tk] && o[tk].texture){
                                    textureIds[o[tk].texture] = true;
                                }
                            }

                            if(tk=="sheen"){
                                if(o[tk] && o[tk].texture){
                                    textureIds[o[tk].texture] = true;
                                }
                            }
                        });

                        if(o.type=="StandardMaterial"){
                            let repaireTexture = {
                                diffuseTexture:"",
                                specularTexture:"",
                                emissiveTexture:"",
                                ambientTexture:"",
                                reflectionTexture:"",
                                refractionTexture:"",
                                opacityTexture:"",
                                bumpTexture:"",
                                lightmapTexture:"",
                            }

                            Object.keys(repaireTexture).forEach(t=>{
                                if(o[t]==null){
                                    o[t] = "";
                                }
                            });
                        }
                    }

                    // else if(key=="geometries"){
                    //     list.vertexData
                    // }
                    // else if(key=="animationGroups"){
                        
                    // }
                    // else if(key=="skeletons"){
                        
                    // }
                });
                config[key] =  exportlist;
            }

            if(!filter && filterMap["scene"]){
                config[key] =  list;
                if(key=="environmentTexture"){
                    textureIds[list] = true;
                }
            }

            // if(!filter && filterMap["environment"]){
            //     config["environmentTexture"] =  list;
            // }
        });

        if(!filterMap["scene"] && filterMap["environment"]){
            let textureId = getValue("environmentTexture");
            if(textureId){
                config["environmentTexture"] = textureId;
                textureIds[textureId] = true;
            }

        }

        let textures = getValue("textures"), texturelist = [];
        if(textures && textures.length>0){
            textures.forEach((s)=>{
                if(s.id in textureIds){
                    texturelist.push(s);
                }
            });

            config["textures"] = texturelist;
        }

        let geometries = getValue("geometries"), vertexData = [];
        if(geometries && geometries.vertexData && geometries.vertexData.length>0){
            geometries.vertexData.forEach((v)=>{
                if(v.id in geometryIds){
                    vertexData.push(v);
                }
            });

            config["geometries"] = { "vertexData": vertexData };
        }

        // let gui2Ds = getValue("gui2Ds"), gui2Dlist = [];
        // if(gui2Dlist && gui2Dlist.length>0){
        //     gui2Dlist.forEach((s)=>{
        //         if(s.id in textureIds){
        //             gui2Dlist.push(s);
        //         }
        //     });

        //     config["gui2Ds"] = gui2Dlist;
        // }

        let skeletons = getValue("skeletons"), skeletonlist = [];
        if(skeletons && skeletons.length>0){
            skeletons.forEach((s)=>{
                if(s.id in skeletonIds){
                    skeletonlist.push(s);
                }
            });

            config["skeletons"] = skeletonlist;
        }

        let animationGroups = getValue("animationGroups"), animationGroupList = [];
        animationGroups && animationGroups.forEach(anigrp=>{
            let addState = false;
            if(animationGroups.targetedAnimations.length>0){
                for(let i=0;i<animationGroups.targetedAnimations.length;i++){
                    let ani = animationGroups.targetedAnimations[i];
                    if(ani.targetId in meshIds){
                        addState = true;
                        break;
                    }
                }
            }

            if(addState){
                animationGroupList.push(anigrp);
            }
        });

        if(animationGroupList.length>0){
            config["animationGroups"] = animationGroupList;
        }

    }

    let result = deepCopy(config);

    return result;
}


function upload3DFileTransfier(container){
    var b = getBabylon();
    // let materials=[], meshes=[], skeletons=[], geometries=[];
    // let addData = {
    //     actionManagers: [], //动作
    //     animationGroups: [], //动画组
    //     animations: [],//动画
    //     cameras: [], //相机
    //     effectLayers: [], //效果层
    //     environmentTexture: null, //环境贴图
    //     geometries: { //mesh顶点数据
    //         boxes: [],
    //         cylinders: [],
    //         grounds: [],
    //         planes: [],
    //         spheres: [],
    //         torusKnots: [],
    //         toruses: [],
    //         vertexData:[],
    //     },
    //     layers: [], //排序层
    //     lensFlareSystems: [], //光晕
    //     lights: [], //灯光
    //     materials: [], //材质
    //     meshes: [], //物体
    //     morphTargetManagers: [], //形状变化
    //     multiMaterials: [], //多材质
    //     particleSystems: [], //粒子系统
    //     proceduralTextures: [], //程序纹理
    //     reflectionProbes: [], //反射物体
    //     rootNodes: [], //根root
    //     scene: {}, //场景配置
    //     skeletons: [], //骨骼动画
    //     sounds: [], //声音
    //     textures: [], //纹理
    //     transformNodes: [], //物体组合对象
    // }

    let addData = {
        actionManagers: [], //动作
        animationGroups: [], //动画组
        animations: [],//动画
        cameras: [], //相机
        geometries: { //mesh顶点数据
            boxes: [],
            cylinders: [],
            grounds: [],
            planes: [],
            spheres: [],
            torusKnots: [],
            toruses: [],
            vertexData:[],
        },
        lights: [], //灯光
        materials: [], //材质
        meshes: [], //物体
        particleSystems: [], //粒子系统
        scene: {}, //场景配置
        skeletons: [], //骨骼动画
        textures: [], //纹理
        transformNodes:[],
        multiMaterials: [], //材质
    }

    let changeKey = {
        actionManagers: {}, //动作
        animationGroups: {}, //动画组
        animations: {},//动画
        cameras: {}, //相机
        effectLayers: {}, //效果层
        environmentTexture: null, //环境贴图
        geometries: { //mesh顶点数据
            boxes: {},
            cylinders: {},
            grounds: {},
            planes: {},
            spheres: {},
            torusKnots: {},
            toruses: {},
            vertexData:{},
        },
        layers: {}, //排序层
        lensFlareSystems: {}, //光晕
        lights: {}, //灯光
        materials: {}, //材质
        meshes: {}, //物体
        morphTargetManagers: {}, //形状变化
        multiMaterials: {}, //多材质
        particleSystems: {}, //粒子系统
        proceduralTextures: {}, //程序纹理
        reflectionProbes: {}, //反射物体
        rootNodes: {}, //根root
        scene: {}, //场景配置
        skeletons: {}, //骨骼动画
        sounds: {}, //声音
        textures: {}, //纹理
        transformNodes: {}, //物体组合对象
    }

    // "customType":"BABYLON.FireProceduralTexture",
    // "customType":"BABYLON.WaterMaterial"

    if(!container.scene.clearColor){
        container.scene.clearColor = new BABYLON.Color3(0,0,0);
    }

    var sceneSerialize = BABYLON.SceneSerializer.Serialize(container.scene);

    container.meshes.forEach((mesh)=>{
        let meshTemp = JSON.parse(JSON.stringify(masterTemplate.mesh));

        let objectId = generateRandomKey("mesh");
        changeKey.meshes[mesh.id] = objectId;

        // Object.keys(mesh).forEach((key)=>{
        //     if(key in meshTemp){
        //         let v = mesh[key];
        //         if(v instanceof Object){
        //             if(v.getClassName){
        //                 let className = v.getClassName();
        //                 if(className=="Vector3"){
        //                     meshTemp[key] = [v.x, v.y, v.z];
        //                 }
        //                 else if(className=="Vector4"){
        //                     meshTemp[key] = [v.x, v.y, v.z, v.w];
        //                 }
        //                 else if(className=="Color3" || className=="Color4"){
        //                     meshTemp[key] = babylonColorToRgb(v, className);
        //                 }
        //             }
        //             else{
        //                 meshTemp[key] = v;
        //             }
        //         }
        //         else{
        //             meshTemp[key] = v;
        //         }
        //     }
        // });

        updateNormalSetting(mesh, meshTemp);

        meshTemp.id = objectId;
        if(meshTemp.name==null || meshTemp.name.length==0){
            meshTemp.name = "导入形状" + b.scene.meshes.length;
        }
        meshTemp.type = "UploadMesh";

        if(mesh.edgesRenderer!=null && mesh.edgesRenderer.isEnabled){
            meshTemp.enableEdgesRendering = true;
        }

        for(let i=0;i<container.effectLayers.length;i++){
            let ef = container.effectLayers[i];
            let isMached = false;

            if(!ef.getClassName){
                continue;
            }

            let efClassName = ef.getClassName();

            if(efClassName=="HighlightLayer"){
                for(let efLinkKey in ef._meshes){
                // Object.keys(ef._meshes).forEach((efLinkKey)=>{
                    let efLinkMesh = ef._meshes[efLinkKey];
                    if(efLinkMesh.mesh.id==mesh.id){

                        meshTemp.enableHighlight = true;
                        meshTemp.highlightColor = babylonColorToRgb(efLinkMesh.color, "Color3");
                        meshTemp.ishighlightEmissive = efLinkMesh.glowEmissiveOnly;

                        isMached = true;
                        break;
                    } 
                }

                if(isMached){
                    meshTemp.blurHorizontalSize = ef.blurHorizontalSize;
                    meshTemp.blurVerticalSize = ef.blurVerticalSize;
                    meshTemp.outerGlow = ef.outerGlow;
                    meshTemp.innerGlow = ef.innerGlow;
                    break;
                }
            }
            else if(efClassName=="GlowLayer"){
                ef._includedOnlyMeshes.forEach((unId)=>{
                    if(mesh.uniqueId==unId){
                        meshTemp.enableGlow = true;
                    }
                });
            }
        }

        // parentId geometryId materialId

        // let physicType = {
        //     "2":"BoxImpostor",
        //     "1":"SphereImpostor",
        //     "10":"ConvexHullImpostor",
        //     "7":"CylinderImpostor",
        //     "4":"MeshImpostor",
        //     "3":"PlaneImpostor",
        //     "0":"NoImpostor",
        //     "101":"RopeImpostor",
        //     "103":"SoftbodyImpostor",
        //     "102":"ClothImpostor",
        //     "8":"ParticleImpostor",
        //     "9":"HeightmapImpostor",
        // }


            //geometries
 

        let serializedMesh = BABYLON.SceneSerializer.SerializeMesh(mesh);
        
        if(serializedMesh.geometries && serializedMesh.geometries.vertexData){
            let vertexData = serializedMesh.geometries.vertexData[0];

            let geometryId = generateRandomKey("geometry");
            changeKey.geometries.vertexData[vertexData.id] = geometryId;

            meshTemp.geometryId = vertexData.id;

            vertexData.id = geometryId;

            addData.geometries.vertexData.push(vertexData);
        }



        meshTemp.parentId = serializedMesh.meshes[0].parentId;
        meshTemp.materialId = serializedMesh.meshes[0].materialId;
        meshTemp.skeletonId = serializedMesh.meshes[0].skeletonId;


        if(mesh.physicsImpostor!=null){

            let p = mesh.physicsImpostor;

            if(p.soft){//软体
                meshTemp.enableSoftPhysic = true;
                meshTemp.softImpostor = physicType[p.type];

                meshTemp.softMass = p.mass;
                meshTemp.softFriction = p.friction;
                meshTemp.softRestitution = p.restitution;


                meshTemp.margin = p._options.margin?p._options.margin:1;
                meshTemp.damping = p._options.damping?p._options.damping:0;

                meshTemp.velocityIterations = p.velocityIterations;
                meshTemp.positionIterations = p.positionIterations;
                meshTemp.stiffness = p.stiffness;

                meshTemp.pressure = p.pressure;

                let softImpostorType = physicType[p.type];
                if(softImpostorType=="RopeImpostor"){
                    meshTemp.hookFixedPoints = p._options.fixedPoints;
                }
                else if(softImpostorType=="ClothImpostor"){
                    meshTemp.anchorFixedPoints = p._options.fixedPoints;
                }
            }
            else{ //刚体
                meshTemp.enableRigidPhysic = true;
                meshTemp.rigidImpostor = physicType[p.type];

                meshTemp.rigidMass = p.mass;
                meshTemp.rigidFriction = p.friction;
                meshTemp.rigidRestitution = p.restitution;
                meshTemp.ignoreParent = p.parent==null?false:true;
            }
        }

        let postProcesses = container.scene.postProcesses;

        for(let i=0;i<postProcesses.length;i++){
            let p = postProcesses[i];
            if(!p.getClassName){
                continue;
            }
            let classname = p.getClassName();

            if(classname=="VolumetricLightScatteringPostProcess"){
                if(p.mesh.id==mesh.id){
                    meshTemp.enableVolumetricLight = true;
                    meshTemp.volumetricLightRatio = p.width/b.engine.getRenderWidth();
                    meshTemp.volumetricLightSamplesNum = p.samples;
                    meshTemp.volumetricLightSamplingMode = p.renderTargetSamplingMode;
                    meshTemp.volumetricLightUseDiffuseColor = p.useDiffuseColor;
                    break;
                }
            }
        }   

        meshTemp.subMeshes = [];
        if(mesh.subMeshes){
            mesh.subMeshes.forEach((sub)=>{
                meshTemp.subMeshes.push({
                    indexCount: sub.indexCount,
                    indexStart: sub.indexStart,
                    materialIndex: sub.materialIndex,
                    verticesCount: sub.verticesCount,
                    verticesStart: sub.verticesStart,
                });
            });
        }

        meshTemp.verticesCount = mesh.getTotalVertices();
        meshTemp.indexCount = mesh.getTotalIndices();

        addData.meshes.push(meshTemp);//插入mesh

    });

    sceneSerialize.transformNodes.forEach(node=>{
        let nodeTemp = JSON.parse(JSON.stringify(masterTemplate.transformNode));

        let objectId = generateRandomKey("transformNode");
        changeKey.transformNodes[node.id] = objectId;

        updateNormalSetting(node, nodeTemp);//更新已有的通用配置

        nodeTemp.parentId = node.parentId;
        nodeTemp.id = objectId;

        addData.transformNodes.push(nodeTemp);
    });


    container.materials.forEach((material)=>{
        if(!material.getClassName){
            return false;
        }

        let materialClassName = material.getClassName();
        let materialTemp = getMaterialTemplate(materialClassName);

        let objectId = generateRandomKey("material");
        changeKey.materials[material.id] = objectId;

        updateNormalSetting(material, materialTemp);//更新已有的通用配置

        materialTemp.type = materialClassName;
        materialTemp.id = objectId;

        if(materialClassName=="PBRMaterial"){
            let subSurface = material.subSurface;
            let clearCoat = material.clearCoat;
            let anisotropy = material.anisotropy;
            let sheen = material.sheen;

            if(subSurface.isRefractionEnabled || subSurface.isTranslucencyEnabled || subSurface.linkRefractionWithTransparency || subSurface.useMaskFromThicknessTexture){
                materialTemp.enableSubSurface = true;
            }

            if(clearCoat.isEnabled){
                materialTemp.enableClearCoat = true;
            }

            if(anisotropy.isEnabled){
                materialTemp.enableAnisotropy = true;
            }

            if(sheen.isEnabled){
                materialTemp.enableSheen = true;
            }


            Object.keys(materialTemp.subSurface).forEach((key)=>{
                if(key=="thicknessTexture" && subSurface[key]!=null){
                    materialTemp.subSurface[key] = subSurface[key].uniqueId; //texture取uniqueId
                }
                else if(key=="tintColor"){
                    materialTemp.subSurface[key] = babylonColorToRgb(subSurface[key], "Color3");
                }
                else{
                   materialTemp.subSurface[key] = subSurface[key]; 
                } 
            });

            Object.keys(materialTemp.clearCoat).forEach((key)=>{
                if(key=="bumpTexture" && clearCoat[key]!=null){
                    materialTemp.clearCoat[key] = clearCoat[key].uniqueId; //texture取uniqueId
                }
                else if(key=="tintColor"){
                    materialTemp.clearCoat[key] = babylonColorToRgb(clearCoat[key], "Color3");
                }
                else{
                   materialTemp.clearCoat[key] = clearCoat[key]; 
                } 
            });

            Object.keys(materialTemp.anisotropy).forEach((key)=>{
                if(key=="texture" && anisotropy[key]!=null){
                    materialTemp.anisotropy[key] = anisotropy[key].uniqueId; //texture取uniqueId
                }
                else{
                   materialTemp.anisotropy[key] = anisotropy[key]; 
                } 
            });

            Object.keys(materialTemp.sheen).forEach((key)=>{
                if(key=="texture" && sheen[key]!=null){
                    materialTemp.sheen[key] = sheen[key].uniqueId; //texture取uniqueId
                }
                else if(key=="color"){
                    materialTemp.sheen[key] = babylonColorToRgb(sheen[key], "Color3");
                }
                else{
                   materialTemp.sheen[key] = sheen[key]; 
                } 
            });

        }

        addData.materials.push(materialTemp);//插入材质
    });

    addData.multiMaterials = [];
    container.multiMaterials.forEach((mul)=>{
        let serializeMul = mul.serialize();

        let objectId = generateRandomKey("multiMaterials");
        changeKey.multiMaterials[serializeMul.id] = objectId;

        serializeMul.id = objectId;
        serializeMul.mainType = "multiMaterial";
        serializeMul.type = "MultiMaterial";

        serializeMul.materials.forEach((mid, i)=>{
            let nmid = changeKey["materials"][mid];
            serializeMul.materials[i] = nmid;


            for(let i=0;i<addData.materials.length;i++){
                let material = addData.materials[i];
                if(material.id == nmid){
                    material.parentId = objectId;
                    break;
                }
            }
        });

        addData.multiMaterials.push(serializeMul);
    });

    //导入纹理，带有renderList属于ReflectionProbe或者阴影需要特殊处理
    container.textures.forEach((texture)=>{
        if(!texture.getClassName){
            return false;
        }

        if(texture.renderList!=null){
            return false;
        }

        let textureClassName = texture.getClassName();
        let textureTemp = JSON.parse(JSON.stringify(textureDatas[textureClassName]));

        let objectId = generateRandomKey("texture");
        changeKey.textures[texture.uniqueId] = objectId;

        updateNormalSetting(texture, textureTemp);//更新已有的通用配置

        textureTemp.type = textureClassName;
        textureTemp.id = objectId;

        if(texture._buffer!=null && texture._buffer.length>0){
            if(texture._buffer instanceof Uint8Array){
                textureTemp.source = Uint8ArrayToBase64(texture._buffer);
            }
            else{
                textureTemp.source = texture._buffer;
            }
            // textureTemp.source = texture._buffer;
        }

        addData.textures.push(textureTemp);//插入材质
    });


    //导入ReflectionProbe纹理
    container.reflectionProbes.forEach((probe)=>{
        if(!probe.getClassName){
            return false;
        }

        let objectId = generateRandomKey("texture");
        changeKey.textures[probe.cubeTexture.uniqueId] = objectId;
        let probeTemp = {};

        probeTemp.name = "反射探头";
        probeTemp.type = "ReflectionProbe";
        probeTemp.mainType = "texture";
        probeTemp.id = objectId;

        probeTemp.refreshRate = probe.refreshRate;
        probeTemp.renderList = [];
        probe.renderList.forEach((mesh)=>{
            probeTemp.renderList.push(mesh.id);
        });

        addData.textures.push(probeTemp);//插入材质
    });

    //开启全局辉光
    for(let i=0;i<container.effectLayers.length;i++){
        let ef = container.effectLayers[i];
        let isMached = false;

        if(!ef.getClassName){
            continue;
        }

        if(efClassName=="GlowLayer"){
            addData.enableGlow = true;
            addData.glowIntensity = ef.intensity;
            addData.enableGlow = ef.mainTextureFixedSize;
            addData.enableGlow = ef.blurKernelSize;
            break;
        }
    }

    let lightMapType = {
        "PointLight":"point",
        "DirectionalLight":"directional",
        "SpotLight":"spot",
        "HemisphericLight":"hemispheric",
    }

    //导入灯光
    container.lights.forEach((light)=>{
        if(!light.getClassName){
            return false;
        }

        let lightClassName = light.getClassName();
        let lightTemp = JSON.parse(JSON.stringify(masterTemplate["light"]));
        let type = lightMapType[lightClassName];

        let specific = lightDatas[lightClassName];

        Object.keys(specific).forEach(key=>{
            lightTemp[key] = specific[key];
        });

        let objectId = generateRandomKey("light");
        changeKey.lights[light.id] = objectId;

        updateNormalSetting(light, lightTemp);//更新已有的通用配置

        lightTemp.type = type;
        lightTemp.id = objectId;

        if(light.parent){
            lightTemp.parentId = light.parent.id;
        }

        lightTemp.enableExcludedMeshesIds = true;
        lightTemp.excludedMeshesIds = [];
        lightTemp.includedOnlyMeshesIds = [];

        if(light.includedOnlyMeshes && light.includedOnlyMeshes.length>0){
            lightTemp.enableExcludedMeshesIds = false;
            light.includedOnlyMeshes.forEach((m)=>{
                lightTemp.includedOnlyMeshesIds.push(m.id);
            });
        }

        if(light.excludedMeshes && light.excludedMeshes.length>0){
            lightTemp.enableExcludedMeshesIds = true;
            light.excludedMeshes.forEach((m)=>{
                lightTemp.excludedMeshesIds.push(m.id);
            });
        }

        if(lightClassName=="SpotLight"){
            lightTemp.angle = light.angle;
            lightTemp.exponent = light.exponent;
        }
        else if(lightClassName=="HemisphericLight"){
            lightTemp.groundColor = babylonColorToRgb(light.groundColor, "Color3") ;
        }

        if(light._shadowGenerator!=null){
            updateShadowSetting(light._shadowGenerator, lightTemp);
        }

        container.lensFlareSystems.forEach((lens)=>{
            if(lens._emitter.id==light.id){
                lightTemp.enableLensFlare = true;
                lightTemp.lensFlareSystem = [];
                lens.lensFlares.forEach((flare)=>{
                    let base64="";
                    if(flare.texture._buffer){
                        if(flare.texture._buffer instanceof Uint8Array){
                            base64 = Uint8ArrayToBase64(flare.texture._buffer);
                        }
                        else{
                            base64 = flare.texture._buffer;
                        }
                    }

                    lightTemp.lensFlareSystem.push({
                        "lensFlareSize":flare.size, //体积，0-1，步长0.01
                        "lensFlarePosition":flare.position, //位置，-1-1，步长0.01，
                        "lensFlareColor":babylonColorToRgb(flare.color, "Color3"), //颜色
                        "lensFlareImg":base64, //图片 
                    });
                });
            }
        });

        addData.lights.push(lightTemp);//插入材质
    });


    //粒子
    container.particleSystems.forEach((particle)=>{
        if(!particle.getClassName){
            return false;
        }

        let particleClassName = particle.getClassName();
        let particleTemp = JSON.parse(JSON.stringify(psTemp));

        let objectId = generateRandomKey("particle");
        changeKey.particleSystems[particle.id] = objectId;

        updateNormalSetting(particle, particleTemp);//更新已有的通用配置

        particleTemp.type = particleClassName;
        particleTemp.id = objectId;

        if(particle.particleEmitterType){
            let pet = particle.particleEmitterType;
            updateNormalSetting(pet, particleTemp.particleEmitterType);
            // if(pet.getClassName){
            //     let petClass = pet.getClassName();
            //     if(petClass=="BoxParticleEmitter"){

            //     }
            //     else if(petClass=="BoxParticleEmitter"){

            //     }
            // }
        }

        if(particle.particleTexture && particle.particleTexture._buffer){
            let base64 = "";
            if(particle.particleTexture._buffer instanceof Uint8Array){
                base64 = Uint8ArrayToBase64(particle.particleTexture._buffer);
            }
            else{
                base64 = particle.particleTexture._buffer;
            }

            particleTemp.textureName = base64;
        }

        if(particle.emitter){
            let eClassType = particle.emitter.getClassName();
            if(eClassType=="Mesh"){
                particleTemp.meshEmitter = true;
                particleTemp.emitter = particle.emitter.id;
            }
            else if(eClassType=="Camera"){
                particleTemp.cameraEmitter = true;
                particleTemp.emitter = particle.emitter.id;
            }
        }


        addData.particleSystems.push(particleTemp);//插入材质
    });

    //geometries
    // container.geometries.forEach((geo)=>{

    //     let serializedMesh = BABYLON.SceneSerializer.SerializeMesh(geo._meshes);
            
    //     let vertexData = serializedMesh.geometries.vertexData[0];

    //     let objectId = generateRandomKey("geometry");
    //     changeKey.geometries[vertexData.id] = objectId;

    //     vertexData.id = objectId;

    //     addData.geometries.vertexData.push(vertexData);
    // });


    //skeletons
    container.skeletons.forEach((ske)=>{

        let serializedSke = ske.serialize();

        let objectId = generateRandomKey("skeleton");
        changeKey.skeletons[serializedSke.id] = objectId;

        serializedSke.id = objectId;
        serializedSke.mainType = "skeleton";

        serializedSke.animationAutoPlay = false;
        serializedSke.animationFrom = 0;
        serializedSke.animationTo = 100;
        serializedSke.animationIsLoop = true;
        serializedSke.animationSpeedRatio = 1;

        addData.skeletons.push(serializedSke);
    });

    //animationGroups
    container.animationGroups.forEach((anigrou)=>{

        let serializedAnigrou = anigrou.serialize();

        if(serializedAnigrou.targetedAnimations && serializedAnigrou.targetedAnimations.length>0){
            serializedAnigrou.targetedAnimations.forEach((ani)=>{
                let parentId = changeKey["meshes"][ani.targetId];
                if(parentId==null){
                    parentId = changeKey["transformNodes"][ani.targetId]
                }
                ani.targetId = parentId;
            });
        }

        let objectId = generateRandomKey("animationGroup");
        serializedAnigrou.id = objectId;
        addData.animationGroups.push(serializedAnigrou);
    });

    //批量替换id和相关id引用
    Object.keys(addData).forEach(key=>{

        let updateMain = addData[key];

        if(key=="environmentTexture" && updateMain!=null){
            addData[key] = changeKey["textures"][key];
        }
        else if(key=="meshes"){
            updateMain.forEach((mesh)=>{
                if(mesh.parentId!=null){
                    let parentId = changeKey["meshes"][mesh.parentId];
                    if(parentId==null){
                        mesh.parentId = changeKey["transformNodes"][mesh.parentId];
                    }
                    else{
                        mesh.parentId = parentId;
                    }
                    
                }
                
                if(mesh.geometryId!=null){
                    mesh.geometryId = changeKey["geometries"]["vertexData"][mesh.geometryId];
                }
                
                if(mesh.materialId!=null){
                    let materialId = changeKey["materials"][mesh.materialId];
                    if(!materialId){
                        materialId = changeKey["multiMaterials"][mesh.materialId];
                    }

                    mesh.materialId = materialId;
                }

                if(mesh.skeletonId!=null){
                    mesh.skeletonId = changeKey["skeletons"][mesh.skeletonId];
                }
            });
        }
        else if(key=="transformNodes"){
            updateMain.forEach((node)=>{
                if(node.parentId!=null){
                    let parentId = changeKey["meshes"][node.parentId];
                    if(parentId==null){
                        node.parentId = changeKey["transformNodes"][node.parentId];
                    }
                    else{
                        node.parentId = parentId;
                    }
                }
            });
        }
        else if(key=="lights"){
            updateMain.forEach((light)=>{
                if(light.parentId!=null){
                    let parentId = changeKey["meshes"][light.parentId];
                    if(parentId==null){
                        light.parentId = changeKey["transformNodes"][light.parentId];
                    }
                    else{
                        light.parentId = parentId;
                    }
                }
            });
        }
        else if(key=="materials"){
            updateMain.forEach((material)=>{
                if(material.subSurface && material.subSurface.thicknessTexture){
                    material.subSurface.thicknessTexture = changeKey["textures"][material.subSurface.thicknessTexture];
                }

                if(material.clearCoat && material.clearCoat.bumpTexture){
                    material.clearCoat.bumpTexture = changeKey["textures"][material.clearCoat.bumpTexture];
                }

                if(material.anisotropy && material.anisotropy.texture){
                    material.anisotropy.texture = changeKey["textures"][material.anisotropy.texture];
                }

                if(material.sheen && material.sheen.texture){
                    material.sheen.texture = changeKey["textures"][material.sheen.texture];
                }


                Object.keys(material).forEach(mkey=>{
                    let v = material[mkey];
                    if(mkey in textureMap){
                        material[mkey] = changeKey["textures"][v];
                    }
                });

                updateRenderList(material, changeKey);

                // if(material.renderList && material.renderList.length>0){
                //     for(let i=0;i<material.renderList.length;i++){
                //         let mid = material.renderList[i];
                //         material.renderList[i] = changeKey["meshes"][mid];
                //     }
                // }
            });
        }
        else if(key=="textures"){
            updateMain.forEach((texture)=>{
                updateRenderList(texture, changeKey);
            });
        }
        else if(key=="lights"){
            updateMain.forEach((light)=>{
                updateRenderList(light, changeKey, "shadowRenderList");
                updateRenderList(light, changeKey, "excludedMeshesIds");
                updateRenderList(light, changeKey, "includedOnlyMeshesIds");
            });
        } 
        else if(key=="particleSystems"){
            updateMain.forEach((ps)=>{
                if(ps.meshEmitter && ps.emitter){
                    ps.emitter = changeKey["meshes"][ps.emitter];
                }
            });
        }
        else if(key=="skeletons"){
            updateMain.forEach((ske)=>{
                if(ske.bones && ske.bones.length>0){
                    ske.bones.forEach((bone)=>{
                        bone.name = changeKey["transformNodes"][bone.name];
                    });
                }
            });
        }

    });

    ms3dfParse(addData);
}

function deflateTextFile(str){
    return pako.deflate(str, { to: 'string' });
}

function inflateTextFile(str){
    try{
       let jsonFile = JSON.parse(str);
       return jsonFile;
    }
    catch{
        let str1 = pako.inflate(str, { to: 'string' });
        let jsonFile = JSON.parse(str1);
        return jsonFile;
    }
    
}

function ms3dfParse(addData ,isRandom, isPako){
    let b = getBabylon();
    if(typeof(addData)=="string"){
        if(isPako){
            addData = pako.inflate(addData, { to: 'string' });
        }

        addData = JSON.parse(addData);
    }

    if(isRandom==null || isRandom===true){
        fileRandomId(addData);
    }

    store.commit("master/updateBatchCommands", {
        addData:addData,
    });

    b.exeClass.generateScene(addData, b, "b", createAssistMash);

    store.commit('master/refreshMasterLayerTime');

    removeAllHistory();
}

function updateProgramsID(addData,oldID, newID){
    let oldIDReg = new RegExp(oldID,'g');

    let programs = addData["programs"];
    if(programs!=null && programs.length>0){
        programs.forEach((prm)=>{
            if(prm.pro){
                prm.pro = prm.pro.replace(oldIDReg, newID);
            }
        });
    }

    let gui2Ds = addData["gui2Ds"];
    if(gui2Ds!=null && gui2Ds.length>0){
        gui2Ds.forEach((gui2D)=>{
            if(gui2D.clickPro){
                gui2D.clickPro = gui2D.clickPro.replace(oldIDReg, newID);
            }
        });
    }

    let meshes = addData["meshes"];
    if(meshes!=null && meshes.length>0){
        meshes.forEach((mesh)=>{
            if(mesh.type=="programMesh" && mesh.pro){
                mesh.pro = mesh.pro.replace(oldIDReg, newID);
            }
        });
    }
    
}

function fileRandomId(addData){

    let idsRandomMap = {};
    Object.keys(addData).forEach(key=>{
        let exists = getState("master", key);
        if(exists && exists.length==0){
            return false;
        }
        let updateMain = addData[key];
        if(!updateMain){
            return false;
        }
        if(key=="meshes"){
            
            updateMain.forEach((mesh)=>{
                let newid = generateRandomKey("mesh");
                idsRandomMap[mesh.id] = newid;
                updateProgramsID(addData, mesh.id, newid);
                mesh.id = newid;
            });
        }
        else if(key=="transformNodes"){
            updateMain.forEach((node)=>{
                let newid = generateRandomKey("transformNode");
                idsRandomMap[node.id] = newid;
                updateProgramsID(addData, node.id, newid);
                node.id = newid;
            });
        }
        else if(key=="instances"){
            updateMain.forEach((node)=>{
                let newid = generateRandomKey("instance");
                idsRandomMap[node.id] = newid;
                updateProgramsID(addData, node.id, newid);
                node.id = newid;
            });
        }
        else if(key=="materials"){
            updateMain.forEach((material)=>{
                let newid = generateRandomKey("material");
                idsRandomMap[material.id] = newid;
                updateProgramsID(addData, material.id, newid);
                material.id = newid;
            });
        }
        else if(key=="textures"){
            updateMain.forEach((texture)=>{
                let newid = generateRandomKey("texture");
                idsRandomMap[texture.id] = newid;
                updateProgramsID(addData, texture.id, newid);
                texture.id = newid;
            });
        }
        else if(key=="lights"){
            updateMain.forEach((light)=>{
                let newid = generateRandomKey("light");
                idsRandomMap[light.id] = newid;
                updateProgramsID(addData, light.id, newid);
                light.id = newid;
            });
        } 
        else if(key=="cameras"){
            updateMain.forEach((ca)=>{
                let newid = generateRandomKey("camera");
                idsRandomMap[ca.id] = newid;
                updateProgramsID(addData, ca.id, newid);
                ca.id = newid;
            });
        }
        else if(key=="particleSystems"){
            updateMain.forEach((ps)=>{
                let newid = generateRandomKey("particleSystem");
                idsRandomMap[ps.id] = newid;
                updateProgramsID(addData, ps.id, newid);
                ps.id = newid;

            });
        }
        else if(key=="skeletons"){
            updateMain.forEach((ske)=>{
                let newid = generateRandomKey("particleSystem");
                idsRandomMap[ske.id] = newid;
                updateProgramsID(addData, ske.id, newid);
                ske.id = newid;

                if(ske.bones && ske.bones.length>0){
                    ske.bones.forEach((bone)=>{
                        let newid = generateRandomKey("bone");
                        idsRandomMap[bone.id] = newid;
                        updateProgramsID(addData, bone.id, newid);
                        bone.name = newid;
                    });
                }
            });
        }
        else if(key=="geometries"){
            if(updateMain.vertexData){
                updateMain.vertexData.forEach((v)=>{
                    let newid = generateRandomKey("geometry");
                    idsRandomMap[v.id] = newid;
                    updateProgramsID(addData, v.id, newid);
                    v.id = newid;
                });
            }
        }
        else if(key=="spriteManagers"){
            updateMain.forEach((spm)=>{
                let newid = generateRandomKey("spriteManager");
                idsRandomMap[spm.id] = newid;
                updateProgramsID(addData, spm.id, newid);
                spm.id = newid;

                if(spm.sprites && spm.sprites.length>0){
                    spm.sprites.forEach((s)=>{
                        let newid = generateRandomKey("spriteManager");
                        idsRandomMap[s.id] = newid;
                        updateProgramsID(addData, s.id, newid);
                        s.id = newid;
                    });
                }
            });
        }
        else if(key=="programs"){
            updateMain.forEach((prm)=>{
                let newid = generateRandomKey("spriteManager");
                idsRandomMap[prm.id] = newid;
                prm.id = newid;
            });
        }
        else if(key=="multiMaterials"){
            updateMain.forEach((mm)=>{
                let newid = generateRandomKey("multiMaterial");
                idsRandomMap[mm.id] = newid;
                updateProgramsID(addData, mm.id, newid);
                mm.id = newid;
            });
        }
        else if(key=="gui2Ds"){
            updateMain.forEach((mm)=>{
                let newid = generateRandomKey("gui2D");
                idsRandomMap[mm.id] = newid;
                updateProgramsID(addData["gui2Ds"], mm.id, newid);
                mm.id = newid;
            });
        }
        else if(key=="animationGroups"){
            updateMain.forEach((animationGroup)=>{
                let newid = generateRandomKey("animationGroup");
                idsRandomMap[animationGroup.id] = newid;
                updateProgramsID(addData, animationGroup.id, newid);
                animationGroup.id = newid;
            });

        }

    });

    Object.keys(addData).forEach(key=>{

        let updateMain = addData[key];

        if(!updateMain){
            return false;
        }

        if(key=="environmentTexture" && updateMain!=null && addData[key].length>0){
            if(addData[key] in idsRandomMap){
                addData[key] = idsRandomMap[addData[key]];
            }
        }
        else if(key=="meshes"){
            updateMain.forEach((mesh)=>{

                if(mesh.parentId!=null && mesh.parentId.length>0 && mesh.parentId in idsRandomMap){
                    mesh.parentId = idsRandomMap[mesh.parentId];
                }
                
                if(mesh.geometryId!=null && mesh.geometryId.length>0 && mesh.geometryId in idsRandomMap){
                    mesh.geometryId = idsRandomMap[mesh.geometryId];
                }
                
                if(mesh.materialId!=null && mesh.materialId.length>0 && mesh.materialId in idsRandomMap){
                    mesh.materialId = idsRandomMap[mesh.materialId];
                }

                if(mesh.skeletonId!=null && mesh.skeletonId.length>0 && mesh.skeletonId in idsRandomMap){
                    mesh.skeletonId = idsRandomMap[mesh.skeletonId];
                }
            });
        }
        else if(key=="transformNodes"){
            updateMain.forEach((node)=>{

                if(node.parentId!=null && node.parentId.length>0 && node.parentId in idsRandomMap){
                    node.parentId = idsRandomMap[node.parentId];
                }
            });
        }
        else if(key=="instances"){
            updateMain.forEach((node)=>{

                if(node.instanceByMeshId!=null && node.instanceByMeshId.length>0 && node.instanceByMeshId in idsRandomMap){
                    node.instanceByMeshId = idsRandomMap[node.instanceByMeshId];
                }
            });
        }
        else if(key=="materials"){
            updateMain.forEach((material)=>{

                if(material.parentId!=null && material.parentId.length>0 && material.parentId in idsRandomMap){
                    material.parentId = idsRandomMap[material.parentId];
                }

                if(material.subSurface && material.subSurface.thicknessTexture && material.subSurface.thicknessTexture.length>0 && material.subSurface.thicknessTexture in idsRandomMap){
                    material.subSurface.thicknessTexture = idsRandomMap[material.subSurface.thicknessTexture];
                }

                if(material.clearCoat && material.clearCoat.bumpTexture && material.clearCoat.bumpTexture.length>0 && material.clearCoat.bumpTexture in idsRandomMap){
                    material.clearCoat.bumpTexture = idsRandomMap[material.clearCoat.bumpTexture];
                }

                if(material.anisotropy && material.anisotropy.texture && material.anisotropy.texture.length>0 && material.anisotropy.texture in idsRandomMap){
                    material.anisotropy.texture = idsRandomMap[material.anisotropy.texture];
                }

                if(material.sheen && material.sheen.texture && material.sheen.texture.length>0 && material.sheen.texture in idsRandomMap){
                    material.sheen.texture = idsRandomMap[material.sheen.texture];
                }

                if(material.parentId!=null && material.parentId.length>0 && material.parentId in idsRandomMap){
                    material.parentId = idsRandomMap[material.parentId];
                }


                Object.keys(material).forEach(mkey=>{
                    let v = material[mkey];
                    if(mkey in textureMap && material[mkey] && material[mkey].length>0 && material[mkey] in idsRandomMap){
                        material[mkey] = idsRandomMap[material[mkey]];
                    }
                });

                updateRenderList(material, idsRandomMap);

                // if(material.renderList && material.renderList.length>0){
                //     for(let i=0;i<material.renderList.length;i++){
                //         let mid = material.renderList[i];
                //         material.renderList[i] = changeKey["meshes"][mid];
                //     }
                // }
            });
        }
        else if(key=="textures"){
            updateMain.forEach((texture)=>{

                updateRenderList(texture, idsRandomMap);
            });
        }
        else if(key=="lights"){
            updateMain.forEach((light)=>{

                if(light.parentId!=null && light.parentId.length>0 && light.parentId in idsRandomMap){
                    light.parentId = idsRandomMap[light.parentId];
                }
                updateRenderList(light, idsRandomMap, "shadowRenderList");
                updateRenderList(light, idsRandomMap, "excludedMeshesIds");
                updateRenderList(light, idsRandomMap, "includedOnlyMeshesIds");
            });
        } 
        // else if(key=="cameras"){
        //     updateMain.forEach((ca)=>{

        //         updateProgramsID(addData, ca.id, ca.id + suffix);

        //         ca.id += suffix;
        //     });
        // }
        else if(key=="particleSystems"){
            updateMain.forEach((ps)=>{
                
                if(ps.meshEmitter && ps.emitter && ps.emitter.length>0 && ps.emitter in idsRandomMap){
                    ps.emitter = idsRandomMap[ps.emitter];
                }
            });
        }
        // else if(key=="skeletons"){
        //     updateMain.forEach((ske)=>{


        //     });
        // }

        // else if(key=="geometries"){
        //     if(updateMain.vertexData){
        //         updateMain.vertexData.forEach((v)=>{
        //             updateProgramsID(addData, v.id, v.id + suffix);
        //             v.id += suffix;
        //         });
        //     }
        // }
        // else if(key=="spriteManagers"){
        //     updateMain.forEach((spm)=>{
                
        //     });
        // }
        // else if(key=="programs"){
        //     updateMain.forEach((prm)=>{
        //         prm.id += suffix;
        //     });
        // }
        else if(key=="multiMaterials"){
            updateMain.forEach((mm)=>{
                // prm.materials.forEach((mid, i)=>{
                //     prm.materials[i] +=  suffix;
                // });

                updateRenderList(mm, idsRandomMap, "materials");

                mm.materials.forEach(mid=>{

                });
            });
        }
        else if(key=="gui2Ds"){
            updateMain.forEach((gui2D)=>{

                if(gui2D.parentId!=null && gui2D.parentId.length>0 && gui2D.parentId in idsRandomMap){
                    gui2D.parentId = idsRandomMap[gui2D.parentId];
                }
                
                if(gui2D.createByMeshId!=null && gui2D.createByMeshId.length>0 && gui2D.createByMeshId in idsRandomMap){
                    gui2D.createByMeshId = idsRandomMap[gui2D.createByMeshId];
                }

                if(gui2D.linkedMesh!=null && gui2D.linkedMesh.length>0 && gui2D.linkedMesh in idsRandomMap){
                    gui2D.linkedMesh = idsRandomMap[gui2D.linkedMesh];
                }

                updateRenderList(gui2D, idsRandomMap, "children");
                
            });
        }
        else if(key=="animationGroups"){
            updateMain.forEach((animationGroup)=>{
                // if(animationGroup.targetedAnimations && animationGroup.targetedAnimations.length>0){
                //     animationGroup.targetedAnimations.forEach((ani)=>{
                //         ani.targetId += suffix;
                //     });
                // }

                updateRenderList(animationGroup, idsRandomMap, "targetedAnimations");
            });

        }

    });

    let updateMain = addData["multiMaterials"];
    if(updateMain && updateMain.length>0){
        updateMain.forEach((mm)=>{
            mm.materials && mm.materials.forEach(mid=>{
                addData["materials"].forEach((material)=>{
                    if(material.id==mid){
                        material.parentId = mm.id;
                    }
                });
            });
        });
    }
    
}

// function fileRandomId(addData){
//     let time = (new Date()).getTime();
//     let suffix = "_" + time.toString().split("")[0];

//     Object.keys(addData).forEach(key=>{

//         let updateMain = addData[key];

//         if(key=="environmentTexture" && updateMain!=null){
//             addData[key] += suffix;
//         }
//         else if(key=="meshes"){
//             updateMain.forEach((mesh)=>{

//                 updateProgramsID(addData, mesh.id, mesh.id + suffix);

//                 mesh.id += suffix;

//                 if(mesh.parentId!=null && mesh.parentId.length>0){
//                     mesh.parentId += suffix;
//                 }
                
//                 if(mesh.geometryId!=null && mesh.geometryId.length>0){
//                     mesh.geometryId += suffix;
//                 }
                
//                 if(mesh.materialId!=null && mesh.materialId.length>0){
//                     mesh.materialId += suffix;
//                 }

//                 if(mesh.skeletonId!=null && mesh.skeletonId.length>0){
//                     mesh.skeletonId += suffix;
//                 }
//             });
//         }
//         else if(key=="transformNodes"){
//             updateMain.forEach((node)=>{

//                 updateProgramsID(addData, node.id, node.id + suffix);

//                 node.id += suffix;
//                 if(node.parentId!=null){
//                     node.parentId += suffix;
//                 }
//             });
//         }
//         else if(key=="materials"){
//             updateMain.forEach((material)=>{

//                 updateProgramsID(addData, material.id, material.id + suffix);

//                 material.id += suffix;

//                 if(material.subSurface && material.subSurface.thicknessTexture){
//                     material.subSurface.thicknessTexture += suffix;
//                 }

//                 if(material.clearCoat && material.clearCoat.bumpTexture){
//                     material.clearCoat.bumpTexture += suffix;
//                 }

//                 if(material.anisotropy && material.anisotropy.texture){
//                     material.anisotropy.texture += suffix;
//                 }

//                 if(material.sheen && material.sheen.texture){
//                     material.sheen.texture += suffix;
//                 }


//                 Object.keys(material).forEach(mkey=>{
//                     let v = material[mkey];
//                     if(mkey in textureMap){
//                         material[mkey] += suffix;
//                     }
//                 });

//                 updateRenderList(material, suffix);

//                 // if(material.renderList && material.renderList.length>0){
//                 //     for(let i=0;i<material.renderList.length;i++){
//                 //         let mid = material.renderList[i];
//                 //         material.renderList[i] = changeKey["meshes"][mid];
//                 //     }
//                 // }
//             });
//         }
//         else if(key=="textures"){
//             updateMain.forEach((texture)=>{

//                 updateProgramsID(addData, texture.id, texture.id + suffix);

//                 texture.id += suffix;
//                 updateRenderList(texture, suffix);
//             });
//         }
//         else if(key=="lights"){
//             updateMain.forEach((light)=>{
//                 light.id += suffix;
//                 if(light.parentId!=null){
//                     light.parentId += suffix;
//                 }
//                 updateRenderList(light, suffix, "shadowRenderList");
//                 updateRenderList(light, suffix, "excludedMeshesIds");
//                 updateRenderList(light, suffix, "includedOnlyMeshesIds");
//             });
//         } 
//         else if(key=="cameras"){
//             updateMain.forEach((ca)=>{

//                 updateProgramsID(addData, ca.id, ca.id + suffix);

//                 ca.id += suffix;
//             });
//         }
//         else if(key=="particleSystems"){
//             updateMain.forEach((ps)=>{

//                 updateProgramsID(addData, ps.id, ps.id + suffix);

//                 ps.id += suffix;
//                 if(ps.meshEmitter && ps.emitter){
//                     ps.emitter += suffix;
//                 }
//             });
//         }
//         else if(key=="skeletons"){
//             updateMain.forEach((ske)=>{
//                 updateProgramsID(addData, ske.id, ske.id + suffix);

//                 ske.id += suffix;
//                 if(ske.bones && ske.bones.length>0){
//                     ske.bones.forEach((bone)=>{
//                         bone.name += suffix;
//                     });
//                 }
//             });
//         }
//         // else if(key=="textures"){
//         //     updateMain.forEach((texture)=>{
//         //         updateProgramsID(addData, texture.id, texture.id + suffix);

//         //         texture.id += suffix;
//         //         updateRenderList(texture, suffix);
//         //     });
//         // }
//         else if(key=="geometries"){
//             if(updateMain.vertexData){
//                 updateMain.vertexData.forEach((v)=>{
//                     updateProgramsID(addData, v.id, v.id + suffix);
//                     v.id += suffix;
//                 });
//             }
//         }
//         else if(key=="spriteManagers"){
//             updateMain.forEach((spm)=>{
//                 updateProgramsID(addData, spm.id, spm.id + suffix);
//                 spm.id += suffix;
//                 if(spm.sprites && spm.sprites.length>0){
//                     spm.sprites.forEach((s)=>{
//                         updateProgramsID(addData, s.id, s.id + suffix);
//                         s.id += suffix;
//                     });
//                 }
//             });
//         }
//         else if(key=="programs"){
//             updateMain.forEach((prm)=>{
//                 prm.id += suffix;
//             });
//         }
//         else if(key=="multiMaterials"){
//             updateMain.forEach((prm)=>{
//                 updateProgramsID(addData, prm.id, prm.id + suffix);
//                 prm.id += suffix;
//                 prm.materials.forEach((mid, i)=>{
//                     prm.materials[i] +=  suffix;
//                 });
//             });
//         }
//         else if(key=="animationGroups"){
//             updateMain.forEach((animationGroup)=>{
//                 if(animationGroup.targetedAnimations && animationGroup.targetedAnimations.length>0){
//                     animationGroup.targetedAnimations.forEach((ani)=>{
//                         ani.targetId += suffix;
//                     });
//                 }

//                 updateProgramsID(addData, animationGroup.id, animationGroup.id + suffix);
//                 animationGroup.id += suffix;
//             });

//         }

//     });
// }

//清除注释
function clearProgramNotes(value){
    if(value==null || value.length==0){
        return value;
    }

    let vc = value.split("//======*=======*========*=========*=========*=======ms勿删\n");
    if(vc.length>1){
        let r = "";

        for(let i=1;i<vc.length;i++){
            r+=vc[i];
        }

        return r;
    }
    else{
        return null;
    }

}

//列举 所有 cameras lights meshs materials textures spriteManagers particleSystems 的id
function getAllObjNotes(){
    let str = '';

    //cameras
    let cameras = getState('master', 'cameras');
    if(cameras.length > 0){
        str += '// getDefaultCamera() getCameraByID 相机: ';

        cameras.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //lights
    let lights = getState('master', 'lights');
    if(lights.length > 0){
        str += '// getLightByID 灯光: ';

        lights.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }
    
    //meshes
    let meshes = getState('master', 'meshes');
    if(meshes.length > 0){
        str += '// getMeshByID 物体: ';

        meshes.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //instances
    let instances = getState('master', 'instances');
    if(instances.length > 0){
        str += '// getMeshByID 实例: ';

        instances.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //materials
    let materials = getState('master', 'materials');
    if(materials.length > 0){
        str += '// getMaterialByID 材质: ';

        materials.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //multiMaterials
    let multiMaterials = getState('master', 'multiMaterials');
    if(multiMaterials.length > 0){
        str += '// 多材质: ';

        multiMaterials.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //textures
    let textures = getState('master', 'textures');
    if(textures.length > 0){
        str += '// getTextureByUniqueID 贴图: ';

        textures.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //spriteManagers
    let spriteManagers = getState('master', 'spriteManagers');
    if(spriteManagers.length > 0){
        str += '// getSpriteManagerByID 精灵: ';

        spriteManagers.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //particleSystems
    let particleSystems = getState('master', 'particleSystems');
    if(particleSystems.length > 0){
        str += '// getParticleSystemByID 粒子: ';

        particleSystems.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    //gui2Ds
    let gui2Ds = getState('master', 'gui2Ds');
    if(gui2Ds.length > 0){
        str += '//交互控件: ';

        gui2Ds.forEach((item) => {
            str += (item.name + ':' + item.id + "; ");
        })

        str += ' \n';
    }

    str += '//======*=======*========*=========*=========*=======ms勿删\n';

    return str;
}

//列举生成programMesh的提示
function getProgramMeshNotes(){
    let str = '';

    str += '// 必须把最后的Mesh赋给：window.msProgramMeshCache';

    str += ' \n';

    str += '//======*=======*========*=========*=========*=======ms勿删\n';

    return str;
}


// function mergeConfig(addData){
//     Object.keys(addData).forEach((key)=>{

//     });
// }

function Uint8ArrayToBase64(u8, suffix) {
    // return btoa(String.fromCharCode.apply(null, u8));
    if(suffix==null){
        suffix = "data:image/png;base64,";
    }
    var binary = '';
    var bytes = u8;
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return suffix+window.btoa( binary );
}

function updateRenderList(updateObject, changeMap , r){
    if(r==null){
        r = "renderList";
    }

    if(updateObject[r] && updateObject[r].length>0){
        for(let i=0;i<updateObject[r].length;i++){
            let mid = updateObject[r][i];
            if(mid!=null && mid.length>0){
                if(typeof(changeMap)=="string"){
                    updateObject[r][i] += changeMap;
               }
               else if(mid in changeMap){
                   updateObject[r][i] = changeMap[mid];
               }
            }
        
        }
    }
}

function calCanvasSize(cw, ch , ratioX, ratioY){
    let w , h;
    if(cw/ch > ratioX/ratioY){
        h = ch;
        w = h * (ratioX/ratioY);
    }
    else{
        w = cw;
        h = w / (ratioX/ratioY);
    }

    return {
        w:w,
        h:h
    }
}

function downloadTextFile(filename, str){
    var blob = new Blob ( [ str ], { type : "octet/stream" } );

    // turn blob into an object URL; saved as a member, so can be cleaned out later
    let objectUrl = (window.webkitURL || window.URL).createObjectURL(blob);

    var link = window.document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    var click = document.createEvent("MouseEvents");
    click.initEvent("click", true, false);
    link.dispatchEvent(click);  
}

function updateShadowSetting(shadow, lightTemp){
    lightTemp.enableShadow = true;  //开启阴影，仅point, directional and spot lights支持阴影
    lightTemp.shadowQuality = shadow._mapSize;  //阴影质量，数据16-5120，步长16

    lightTemp.shadowRenderList = [];  // 阴影物体，存入物体的id
    if(shadow._shadowMap.renderList){
        shadow._shadowMap.renderList.forEach((mesh)=>{
            lightTemp.shadowRenderList.push(mesh.id);
        });
    }
    

    lightTemp.usePoissonSampling = shadow.usePoissonSampling;  //开启泊松采样
    lightTemp.useExponentialShadowMap = shadow.useExponentialShadowMap;  //开启指数阴影

    lightTemp.useBlurExponentialShadowMap = shadow.useBlurExponentialShadowMap;  //开启指数阴影模糊
    lightTemp.blurScale = shadow.blurScale;  //模糊体积
    lightTemp.blurBoxOffset = shadow.blurBoxOffset;  //模糊偏移
    lightTemp.useKernelBlur = shadow.useKernelBlur; //开启模糊核心
    lightTemp.blurKernel = shadow.blurKernel;  //模糊系数，开启useKernelBlur，则可以调整，0-10，步长0.1

    lightTemp.usePercentageCloserFiltering = shadow.usePercentageCloserFiltering;  //百分比近似滤镜
    lightTemp.filteringQuality = shadow.filteringQuality;  //滤镜质量，2:QUALITY_LOW 低，1:QUALITY_MEDIUM 中， 0:QUALITY_HIGH 高
}

function booleanCalculation(meshIds, type){
    let b = getBabylon();
    let newMesh = b.exeClass.booleanCalculationView(meshIds, type, b);

    if(newMesh==null){
        return false;
    }

    let serializedMesh = BABYLON.SceneSerializer.SerializeMesh(newMesh);

    let meshTemp = JSON.parse(JSON.stringify(masterTemplate.mesh));
    let objectId = generateRandomKey("mesh");

    updateNormalSetting(newMesh, meshTemp);

    meshTemp.id = objectId;
    meshTemp.name = "布尔形状" + b.scene.meshes.length;
    meshTemp.type = "UploadMesh";

    newMesh.id = objectId;
    newMesh.name = meshTemp.name;

    // if(serializedMesh.position){
    //     meshTemp.position = serializedMesh.position;
    // }

    // if(serializedMesh.rotation){
    //     meshTemp.rotation = serializedMesh.rotation;
    // }

    // if(serializedMesh.scaling){
    //     meshTemp.scaling = serializedMesh.scaling;
    // }



    if(serializedMesh.geometries && serializedMesh.geometries.vertexData){
        let vertexData = serializedMesh.geometries.vertexData[0];

        let geometryId = generateRandomKey("geometry");

        meshTemp.geometryId = geometryId;

        vertexData.id = geometryId;

        store.commit("master/insertCommands", {
            key: 'geometries.vertexData',
            value: vertexData
        });
    }

    let meshes = getState("master", "meshes");
    meshes.forEach((item, index)=>{
        if(item.id==meshIds[0] || item.id==meshIds[1]){
            store.commit('master/updateCommands', {
                key: 'meshes.${'+ index +'}.isVisible',
                value: false
            }); 
        }
    });

    store.commit("master/insertCommands", {
        key: 'meshes',
        value: meshTemp
    });

    selectedMeshed(objectId, "mesh");

    // store.commit('master/changeCurId', {
    //     key: 'curMeshId',
    //     value: objectId
    // });

    // store.commit('master/changeCurModelName', 'mesh');

    // store.commit('master/refreshMasterLayerTime');



    return true;
}


function updateNormalSetting(mesh, meshTemp){
    for(let key in mesh){
        let _key = key;
        if(key.substr(0,1)=="_"){
            _key = key.substr(1,key.length);
        }
        //console.log(key, updateExcludeMap, textureMap, key in textureMap);
    // Object.keys(mesh).forEach((key)=>{
        if(key in meshTemp || _key in meshTemp){
            let v = mesh[key];
            if(_key in meshTemp){
                v = mesh[_key];
                key = _key;
            }
            // console.log(key, updateExcludeMap, textureMap, key in textureMap);
            if(key in updateExcludeMap){
                return false;
            }

            if(key in textureMap || _key in textureMap){
                // if(mesh[_key]!=null){
                //     meshTemp[_key] = mesh[_key].uniqueId;
                // }

                if(mesh[key]!=null){
                    if(mesh[key].uniqueId!=null){
                        meshTemp[key] = mesh[key].uniqueId;
                    }
                    else{
                        meshTemp[key] = "";
                    }
                    
                }
            }
            else if(key.indexOf("FresnelParameters")>-1){
                meshTemp[fresnelParameterMap[key]] = true;
                meshTemp[key] = {
                    leftColor: babylonColorToRgb(v.leftColor, "Color3"),
                    rightColor: babylonColorToRgb(v.rightColor, "Color3"),
                    bias: v.bias,  //偏度，0-1, 步长0.01
                    power: v.power,  //强度，0-100，步长1
                }
            }
            else if(v instanceof Object){
                if(v.getClassName){
                    let className = v.getClassName();
                    if(className=="Vector3"){
                        if(key=="rotation"){
                            let x,y,z;
                            if(mesh.rotationQuaternion){
                                let v3 = mesh.rotationQuaternion.toEulerAngles();
                                x = v3.x; 
                                y = v3.y; 
                                z = v3.z;
                            }
                            else{
                                x = v.x; 
                                y = v.y; 
                                z = v.z;
                            }
                            
                            x = x*180/Math.PI;
                            y = y*180/Math.PI;
                            z = z*180/Math.PI;

                            meshTemp[key] = [x, y, z];
                        }
                        else{
                            meshTemp[key] = [roundN(v.x), roundN(v.y), roundN(v.z)];
                        }
                    }
                    else if(className=="Vector2"){
                        meshTemp[key] = [roundN(v.x), roundN(v.y)];
                    }
                    else if(className=="Vector4"){
                        meshTemp[key] = [roundN(v.x), roundN(v.y), roundN(v.z), roundN(v.w)];
                    }
                    else if(className=="Color3" || className=="Color4"){
                        meshTemp[key] = babylonColorToRgb(v, className);
                    }
                }
                // else{
                //     meshTemp[key] = v;
                // }
            }
            else{
                meshTemp[key] = v;
            }
        }
    }
}

function roundN(v, p){
    if(p==null){
        p = 100;
    }
    return Math.round(v*p)/p;
}

function getMaterialTemplate(type){
    for(let i=0;i<materialDatas.length;i++){
        let m = materialDatas[i];
        if(m.type==type){
            return JSON.parse(JSON.stringify(m));
        }
    }
    return null;
}


function babylonColorToRgb(v, className){
    if(className=="Color3"){
        return "rgb("+ Math.round(v.r*255) +","+ Math.round(v.g*255) +","+ Math.round(v.b*255) +")";
    }
    else{
        return "rgba("+ Math.round(v.r*255) +","+ Math.round(v.g*255) +","+ Math.round(v.b*255) +","+ v.a +")";
    }
    
}

function animationAndSkeletonPlay(item, type){
    if(type==null){
        type = "animationGroup";
    }

    var b = getBabylon();

    if(type=="animationGroup"){
        let o = getAnimationGroupById(item.id);
        if(o){
            o.play(true);
        }
    }
    else if(type=="skeleton"){
        let o = b.scene.getLastSkeletonByID(item.id);
        b.scene.beginAnimation(o, 0, 100, true, 1.0);
    }
}

function skeletonAnimationPlay(item){
    // if(type==null){
    //     type = "animationGroup";
    // }

    let b = getBabylon();

    let o = b.scene.getLastSkeletonByID(item.id);
    if(o.animationAble){
        o.animationAble.stop();
    }
    let animationAble = b.scene.beginAnimation(o, item.animationFrom, item.animationTo, item.animationIsLoop, item.animationSpeedRatio);
    o.animationAble = animationAble;
}

function skeletonAnimationStop(item){
    let b = getBabylon();

    let o = b.scene.getLastSkeletonByID(item.id);
    if(o.animationAble){
        o.animationAble.stop();
    }
}

function stopSceneAllAnimation(){
    var b = getBabylon();
    b.scene.stopAllAnimations();
}

function getAnimationGroupById(id){
    var b = getBabylon();
    let g = b.scene.animationGroups;
    for(let i=0;i<g.length;i++){
        if(g[i].uniqueId==id){
            return g[i];
        }
    }

    return null;
}

function initialLightAndCamera(scene, exeClass){
    // let defualtLight = "HemisphericLight";
    // let lightTemp = JSON.parse(JSON.stringify(masterTemplate.light));
    // let sTemp = JSON.parse(JSON.stringify(lightDatas[defualtLight]));

    // Object.keys(sTemp).forEach(key=>{
    //     let value = sTemp[key];
    //     lightTemp[key] = value;
    // });

    // setTimeout(() => {
    //     createAssistMash(lightTemp);
    // }, 0);
    

    // store.commit("master/insertCommands", {
    //     key: 'lights',
    //     value: lightTemp
    // });

    // exeClass.createObject(lightTemp, {scene:scene});


    let cameraOption = JSON.parse(JSON.stringify(masterTemplate['camera']));
    cameraOption.id = generateRandomKey('camera');

    exeClass.createObject(cameraOption, {scene:scene});

    store.commit("master/insertCommands", {
        key: 'cameras',
        value: cameraOption
    });
}

let modelthis = null;
function initialSceneAndGizmo(engine, exeClass, that){
    let scene = new BABYLON.Scene(engine);
    let sceneTemp = JSON.parse(JSON.stringify(masterTemplate.scene));
    sceneTemp.id = generateRandomKey("scene");

    Object.keys(sceneTemp).forEach(key=>{
        store.commit('master/updateCommands', {
            key: key,
            value: sceneTemp[key]
        });
    });

    let _this;
    if(that){
        _this = that;
        modelthis = that;
    }
    else{
        _this = modelthis;
    }

    exeClass.createScene(sceneTemp, {scene:scene});

    initialLightAndCamera(scene, exeClass);

    var gizmo = createGizmoManager(scene);

    gizmo.attachToMesh(null);

    let utilLayer = new BABYLON.UtilityLayerRenderer(scene);
    // _this.utilLayer = utilLayer;

    document.getElementById("renderCanvas").babylon = {
        engine: engine,
        scene: scene,
        camera: scene.activeCamera,
        particle3D: exeClass,
        gizmo:gizmo,
        utilLayer:utilLayer,
        curUpdateObject:null,
        assistObject:[],
        assistGizmo:[],
    }

    let myLines = [];

    for(let i=0;i<31;i++){
        myLines.push([
            new BABYLON.Vector3(i-15, 0, -15),
            new BABYLON.Vector3(i-15, 0, 15),
        ]);

        myLines.push([
            new BABYLON.Vector3(-15, 0, i-15),
            new BABYLON.Vector3(15, 0, i-15),
        ]);
    }

    //Create linesystem with updatable parameter set to true for later changes
    let linesystem = BABYLON.MeshBuilder.CreateLineSystem("msAuxPlane", {lines: myLines, updatable: false}, scene); 
    linesystem.color = new BABYLON.Color3(109/255,109/255,109/255);
    linesystem.isPickable = false;

    // this.linesystem = linesystem;

    gizmo.gizmos.positionGizmo.onDragStartObservable.add(()=>{
        store.commit('master/updateCommands', {
            key: 'mouseDownHoldState',
            value: true
        });
        scene.meshes.forEach(m=>{
            m.renderOverlay = false;
        });
    });

    gizmo.gizmos.rotationGizmo.onDragStartObservable.add(()=>{
        store.commit('master/updateCommands', {
            key: 'mouseDownHoldState',
            value: true
        });
        scene.meshes.forEach(m=>{
            m.renderOverlay = false;
        });
    });

    gizmo.gizmos.scaleGizmo.onDragStartObservable.add(()=>{
        store.commit('master/updateCommands', {
            key: 'mouseDownHoldState',
            value: true
        });
        scene.meshes.forEach(m=>{
            m.renderOverlay = false;
        });
    });

    gizmo.gizmos.positionGizmo.onDragEndObservable.add(()=>{
        updateViewObjectEnd("position");
    });

    gizmo.gizmos.rotationGizmo.onDragEndObservable.add(()=>{
        updateViewObjectEnd("rotation");
    });

    gizmo.gizmos.scaleGizmo.onDragEndObservable.add(()=>{
        updateViewObjectEnd("scaling");
    });

    // gizmo.gizmos.boundingBoxGizmo.onRotationSphereDragEndObservable.add(()=>{
    //     updateViewObjectEnd();
    // });

    // gizmo.gizmos.boundingBoxGizmo.onScaleBoxDragEndObservable.add(()=>{
    //     updateViewObjectEnd();
    // });

    scene.onPointerObservable.add((pointerInfo) => {
        let pickInfo = pointerInfo.pickInfo, event = pointerInfo.event;
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                store.commit('master/updateCommands', {
                    key: 'mouseDownHoldState',
                    value: true
                });
                
                if(pickInfo.pickedMesh){
                    let mesh = pickInfo.pickedMesh;
                    let isState = isAllowSelected(mesh);

                    if(!mesh.isPickable){
                        if(gizmo._attachedMesh==mesh){
                            selectedMeshed(null,null,_this, pointerInfo);
                        }
                        return;
                    }

                    if(mesh.id.indexOf("particleSystem")>-1){
                        // _this.$refs.particle.gotoPage(mesh.name);
                        selectedMeshed(mesh.id, "particle", _this,pointerInfo);
                    }
                    else if(mesh.id.indexOf("light")>-1){
                        selectedMeshed(mesh.id, "light", _this,pointerInfo);
                    }
                    else if(isState!==false){
                        if(isState===true){
                            // gizmo.attachToMesh(mesh);
                            if(mesh.id.indexOf("mesh")>-1){
                                selectedMeshed(mesh.id, "mesh", _this,pointerInfo);
                            }
                            else if(mesh.id.indexOf("instance")>-1){
                                selectedMeshed(mesh.id, "instance", _this,pointerInfo);
                            }
                            else{
                                selectedMeshed(mesh.id, "transformNode", _this,pointerInfo);
                            } 
                        }
                        else{
                            // gizmo.attachToMesh(isState);

                            if(!isState.isPickable){
                                if(gizmo._attachedMesh==isState){
                                    selectedMeshed(null,null,_this,pointerInfo);
                                }
                                return;
                            }

                            if(isState.id.indexOf("mesh")>-1){
                                selectedMeshed(isState.id, "mesh", _this,pointerInfo);
                            }
                            else if(isState.id.indexOf("instance")>-1){
                                selectedMeshed(isState.id, "instance", _this,pointerInfo);
                            }
                            else{
                                selectedMeshed(isState.id, "transformNode", _this,pointerInfo);
                            } 
                        }
                        
                    }
                    // else{
                    //     selectedMeshed(null,null,_this);
                    // }
                }
                // else{
                //     selectedMeshed(null,null,_this);
                // }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                // console.log("POINTERUP");
                store.commit('master/updateCommands', {
                    key: 'mouseDownHoldState',
                    value: false
                });
                if(pickInfo.pickedMesh){
                    // updateViewObjectEnd();
                }
                else{
                    updateCameraConfig();
                }
                
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                console.log("POINTER WHEEL");
                updateCameraConfig();
            break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                highlightMesh(pointerInfo, _this);
                // if(pickInfo.pickedMesh){
                //     let mesh = pickInfo.pickedMesh;
                //     let isState = isAllowSelected(mesh);

                //     if(!mesh.isPickable){
                //         if(gizmo._attachedMesh==mesh){
                //             selectedMeshed(null,null,_this, pointerInfo);
                //         }
                //         return;
                //     }

                //     highlightMesh(mesh);
                // }
                // else{
                //     highlightMesh();
                // }
            break;
        }
    });


    return scene;
}

function highlightMesh(pointerInfo, that){
    let mouseDownHoldState = getState("master","mouseDownHoldState");
    if(mouseDownHoldState){
        return;
    }
    let e = pointerInfo.event;
    let b = getBabylon(), scene = b.scene;
    let pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    scene.meshes.forEach(m=>{
        // m.outlineWidth = 0;
        m.renderOverlay = false;
    });

    

    if(pickInfo.pickedMesh){
        let mesh = pickInfo.pickedMesh;
        if(!mesh.isPickable){
            return;
        }

        if(mesh.isAnInstance){
            mesh = mesh.sourceMesh;
        }
        if(mesh){
            mesh.renderOverlay = true;
            mesh.overlayAlpha =0.3;
            mesh.overlayColor = new BABYLON.Color3(255, 255, 255);
        }
    }

    
    

    

}

function updateViewObjectEnd(type){
    let b = getBabylon(), scene = b.scene;
    let curObject = getCurObject();
    let cache = getState("master", "batchOptionCache");

    if(cache!=null){
        let mlist = cache.mlist, CoT = cache.parent;
        mlist.forEach(item=>{
            let id = item.id, mainType = item.mainType, o;
            if(mainType=="transformNode"){
                o = scene.getTransformNodeByID(id);
            }
            else{
                o = scene.getMeshByID(id);
            }

            o.setParent(null);

            updateMeshPostion(item,type);

            o.setParent(CoT);
        });

    }
    else if(curObject && curObject.mainType!="camera"){
        // let mesh, listType = "meshes";
        // if(curObject.mainType=="mesh" || curObject.mainType=="instance"){
        //     mesh = scene.getMeshByID(curObject.id);
        //     if(curObject.mainType=="instance"){
        //         listType = "instances";
        //     }
        // }
        // else if(curObject.mainType=="transformNode"){
        //     mesh = scene.getTransformNodeByID(curObject.id);
        //     listType = "transformNodes";
        // }

        // if(mesh){
        //     let index = null, meshes = getState("master", listType);
        //     for(let i = 0; i < meshes.length; i++){
        //         if(meshes[i].id == mesh.id){
        //             index = i;
        //             break;
        //         }
        //     }

        //     let p = mesh.position, r = mesh.rotationQuaternion?mesh.rotationQuaternion.toEulerAngles():mesh.rotation, s = mesh.scaling;
            
        //     let preObject = deepCopy(meshes[index]);
            
        //     if(type=="position"){
        //         store.commit('master/updateCommands', {
        //             key: listType + '.${'+ index +'}.position',
        //             value: [p.x, p.y, p.z]
        //         });
        //         addHistory(preObject, "update", "position", index);
        //     }
        //     else if(type=="rotation"){
        //         let x = r.x*180/Math.PI;
        //         let y = r.y*180/Math.PI;
        //         let z = r.z*180/Math.PI;
        //         store.commit('master/updateCommands', {
        //             key: listType + '.${'+ index +'}.rotation',
        //             value: [x, y, z]
        //         });
        //         addHistory(preObject, "update", "rotation", index);
        //     }
        //     else if(type=="scaling"){
        //         store.commit('master/updateCommands', {
        //             key: listType + '.${'+ index +'}.scaling',
        //             value: [s.x, s.y, s.z]
        //         });
        //         addHistory(preObject, "update", "scaling", index);
        //     }



        //     //addHistory(preObject, "update", ["position", "rotation", "scaling"], index);
        // }
        updateMeshPostion(curObject,type);
        store.commit('master/updateCommands', {
            key: 'mouseDownHoldState',
            value: false
        });
        
    }
}

function updateMeshPostion(curObject, type){
    let b = getBabylon(), scene = b.scene;
    let mesh, listType = "meshes";
    if(curObject.mainType=="mesh" || curObject.mainType=="instance"){
        mesh = scene.getMeshByID(curObject.id);
        if(curObject.mainType=="instance"){
            listType = "instances";
        }
    }
    else if(curObject.mainType=="transformNode"){
        mesh = scene.getTransformNodeByID(curObject.id);
        listType = "transformNodes";
    }

    if(mesh){
        let index = null, meshes = getState("master", listType);
        for(let i = 0; i < meshes.length; i++){
            if(meshes[i].id == mesh.id){
                index = i;
                break;
            }
        }

        let p = mesh.position, r = mesh.rotationQuaternion?mesh.rotationQuaternion.toEulerAngles():mesh.rotation, s = mesh.scaling;
        
        let preObject = deepCopy(meshes[index]);
        
        if(type=="position"){
            store.commit('master/updateCommands', {
                key: listType + '.${'+ index +'}.position',
                value: [p.x, p.y, p.z]
            });
            addHistory(preObject, "update", "position", index);
        }
        else if(type=="rotation"){
            let x = r.x*180/Math.PI;
            let y = r.y*180/Math.PI;
            let z = r.z*180/Math.PI;
            store.commit('master/updateCommands', {
                key: listType + '.${'+ index +'}.rotation',
                value: [x, y, z]
            });
            addHistory(preObject, "update", "rotation", index);
        }
        else if(type=="scaling"){
            store.commit('master/updateCommands', {
                key: listType + '.${'+ index +'}.scaling',
                value: [s.x, s.y, s.z]
            });
            addHistory(preObject, "update", "scaling", index);
        }



        //addHistory(preObject, "update", ["position", "rotation", "scaling"], index);
    }
}

function updateViewParticleEnd(type, curPs){
    let b = getBabylon(), scene = b.scene;
    // let curPs = getCurObject();

    let index = null, particleSystems = getState("master", "particleSystems");
    for(let i = 0; i < particleSystems.length; i++){
        if(particleSystems[i].id == curPs.id){
            index = i;
            break;
        }
    }

    let preObject = deepCopy(particleSystems[index]);

    store.commit('master/updateCommands', {
        key: 'particleSystems.${'+ index +'}.' + type,
        value: curPs[type]
    });

    addHistory(preObject, "update", type, index);

    b.exeClass.createParticle(curPs, b);
}



function updateCameraConfig(){
    let b = getBabylon(), scene = b.scene;
    let cameraOption = getState("master", "cameras");
    if(cameraOption){
        let index = 0;
        cameraOption = cameraOption[index];
        let camera = scene.getCameraByID(cameraOption.id);
        if(cameraOption.type=="UniversalCamera"){
            let p = camera.position, t = camera.getTarget();
            if(p){
                store.commit('master/updateCommands', {
                    key: 'cameras.${'+ index +'}.position',
                    value: [p.x, p.y, p.z]
                });
            }
            
            
            if(t){
                store.commit('master/updateCommands', {
                    key: 'cameras.${'+ index +'}.target',
                    value: [t.x, t.y, t.z]
                });
            }
            
        }
        else if(cameraOption.type=="ArcRotateCamera"){
            let t = camera.target;
            store.commit('master/updateCommands', {
                key: 'cameras.${'+ index +'}.target',
                value: [t.x, t.y, t.z]
            });

            store.commit('master/updateCommands', {
                key: 'cameras.${'+ index +'}.alpha',
                value: camera.alpha/Math.PI
            });

            store.commit('master/updateCommands', {
                key: 'cameras.${'+ index +'}.beta',
                value: camera.beta/Math.PI
            });

            store.commit('master/updateCommands', {
                key: 'cameras.${'+ index +'}.radius',
                value: camera.radius
            });
        }

    }

}

let cameraWheelTimeout = null;
function updateCameraRadius(){
    clearTimeout(cameraWheelTimeout);
    cameraWheelTimeout = setTimeout(() => {
        let scene = getBabylon("scene");
        let index = 0;
        let cameraOption = getState("master", "cameras");
        cameraOption = cameraOption[index];
        let camera = scene.getCameraByID(cameraOption.id);
        store.commit('master/updateCommands', {
            key: 'cameras.${'+ index +'}.radius',
            value: camera.radius
        });
    }, 100);

}

function isAllowSelected(mesh){
    let isState = true;
    if(mesh.parent!=null){

        let pmesh = mesh;
        while(pmesh.parent!=null){
            pmesh = pmesh.parent;
        }

        return pmesh;
    }
    
    if(mesh.material){
        let mtype = mesh.material.getClassName();
        if(mesh.material.reflectionTexture){
            let type = mesh.material.reflectionTexture.getClassName();
            if(type=="CubeTexture"){
                return false;
            }
        }
        if(mesh.material.diffuseTexture){
            let metadata = mesh.material.diffuseTexture.metadata;
            if(metadata && !metadata.isMoveAble){
                return false;
            }
        }
        if(mesh.material.emissiveTexture){
            let metadata = mesh.material.emissiveTexture.metadata;
            if(metadata && !metadata.isMoveAble){
                return false;
            }
        }
        else if(mtype=="SkyMaterial"){
            return false;
        }
    }


    return isState;
}

function mergeMeshWithNew(meshIds){
    let b = getBabylon(), scene = b.scene;
    let multiMaterialId = generateRandomKey("multiMaterial");
    let objectId = generateRandomKey("mesh");
    let geometryId = generateRandomKey("geometry");

    let newSet = b.exeClass.mergeMeshHandle(meshIds, b);

    let mesh = newSet.mesh, multiMaterial = newSet.multiMaterial, geometry = newSet.geometry;
    let vertexData = geometry.serializeVerticeData();
    mesh.id = objectId;
    multiMaterial.id = multiMaterialId;
    vertexData.id = geometryId;

    let addData = {
        geometries: { //mesh顶点数据
            vertexData:[],
        },
        meshes: [], //物体
        multiMaterials: [], //材质
    }

    //物体
    let meshTemp = JSON.parse(JSON.stringify(masterTemplate.mesh));
    updateNormalSetting(mesh, meshTemp);
    meshTemp.id = objectId;

    // if(meshTemp.name==null || meshTemp.name.length==0){
    meshTemp.name = "合并形状" + b.scene.meshes.length;
    // }

    meshTemp.type = "UploadMesh";

    if(mesh.edgesRenderer!=null && mesh.edgesRenderer.isEnabled){
        meshTemp.enableEdgesRendering = true;
    }

    meshTemp.geometryId = vertexData.id;

    // meshTemp.parentId = serializedMesh.meshes[0].parentId;
    meshTemp.materialId = multiMaterialId;
    // meshTemp.skeletonId = serializedMesh.meshes[0].skeletonId;

    meshTemp.subMeshes = [];
    if(mesh.subMeshes){
        mesh.subMeshes.forEach((sub)=>{
            meshTemp.subMeshes.push({
                indexCount: sub.indexCount,
                indexStart: sub.indexStart,
                materialIndex: sub.materialIndex,
                verticesCount: sub.verticesCount,
                verticesStart: sub.verticesStart,
            });
        });
    }

    meshTemp.verticesCount = mesh.getTotalVertices();
    meshTemp.indexCount = mesh.getTotalIndices();
    addData.meshes.push(meshTemp);//插入mesh

    //材质
    let serializeMul = multiMaterial.serialize();
    serializeMul.id = multiMaterialId;
    serializeMul.mainType = "multiMaterial";
    serializeMul.type = "MultiMaterial";

    let materials = getState("master", "materials");
    serializeMul.materials.forEach((nmid, i)=>{

        serializeMul.materials[i] = nmid;

        for(let i=0;i<materials.length;i++){
            let material = materials[i];
            if(material.id == nmid){
                material.parentId = multiMaterialId;
                break;
            }
        }
    });
    addData.multiMaterials.push(serializeMul);

    //顶点
    addData.geometries.vertexData.push(vertexData);

    let meshIdsMap = {};
    meshIds.forEach(item=>{
        meshIdsMap[item.key] = 1;
    });

    let meshes = getState("master", "meshes");
    meshes.forEach((item, index)=>{
        if(item.id in meshIdsMap){
            store.commit('master/updateCommands', {
                key: 'meshes.${'+ index +'}.isVisible',
                value: false
            }); 
        }
    });

    store.commit("master/updateBatchCommands", {
        addData:addData,
    });

    store.commit('master/refreshMasterLayerTime');
}

function createBatchTransform(keys){
    let b = getBabylon(), scene = b.scene;
    cancelBatchTransform();

    let stack = [];
    stack = stack.concat(keys);
    let mlist = [];
    while(stack.length>0){
        let objId = stack.pop();
        let o = getOptionByID(objId, "mesh");
        if(o==null){
            o = getOptionByID(objId, "transformNode");
        }
        if(o==null){
            o = getOptionByID(objId, "instance");
        }

        if(o==null){
            continue;
        }

        if(o.parentId==null){
            mlist.push({
                id:o.id,
                mainType:o.mainType
            });
        }
        else{
            stack.push(o.parentId);
        }
    }

    var CoT = new BABYLON.TransformNode("msBatchTransformNodeCache");
    mlist.forEach(item=>{
        let id = item.id, mainType = item.mainType, o;
        if(mainType=="transformNode"){
            o = scene.getTransformNodeByID(id);
        }
        else{
            o = scene.getMeshByID(id);
        }

        o.setParent(CoT);
    });

    store.commit('master/updateCommands', {
        key: 'batchOptionCache',
        value: {
            mlist:mlist,
            parent:CoT,
        }
    });

    b.gizmo.attachToMesh(CoT);
}

function cancelBatchTransform(){
    let b = getBabylon(), scene = b.scene;
    let cache = getState("master", "batchOptionCache");
    if(cache==null){
        b.gizmo.attachToMesh(null);
        return;
    }

    let mlist = cache.mlist, CoT = cache.parent;
    mlist.forEach(item=>{
        let id = item.id, mainType = item.mainType, o;
        if(mainType=="transformNode"){
            o = scene.getTransformNodeByID(id);
        }
        else{
            o = scene.getMeshByID(id);
        }

        o.setParent(null);
    });

    store.commit('master/updateCommands', {
        key: 'batchOptionCache',
        value: null
    });

    b.gizmo.attachToMesh(null);
    CoT.dispose();
}

function checkHasGeo(id){
    let b = getBabylon(), scene = b.scene;
    let mesh = scene.getMeshByID(id);
    if(mesh && mesh.geometry){
        return true;
    }
    else {
        return false;
    }
}


//是否是纯数字
function isRealNum(val) {
    if(val == null || val.toString().replace(/\s/g, "") === ""){
        return false;
    }

    if(typeof val == "boolean"){
        return false;
    }

    if(!isNaN(val)){
        return true;
    }
    else{
        return false;
    }
}

function programHTMLHandler(config){
    let scenePro = "";
    let filterHtml = ``;
    Object.keys(masterTemplate.scene).forEach(key=>{
        if(key=="environmentTexture"){
            return false;
        }
        else if(key=="enableBackground2D"){
            if(config.enableBackground2D && config.background2D ){
                scenePro += "new BABYLON.Layer("+ config.id +"_layer,"+ config.background2D +", scene, true);";
            }
        }
        else if(key=="enableGlow"){
            if(config.enableGlow){
                let option = {};
                if(config.mainTextureFixedSize){
                    option.mainTextureFixedSize = config.mainTextureFixedSize;
                }
        
                if(config.blurKernelSize){
                    option.blurKernelSize = config.blurKernelSize;
                }
        
                // if(p.mainTextureSamples){
                //     option.mainTextureSamples = p.mainTextureSamples?4:0;
                // }
        
                // if(p.mainTextureRatio){
                //     option.mainTextureRatio = p.mainTextureRatio;
                // }

                scenePro += "let glowLayer = new BABYLON.GlowLayer("+config.id+"_glow, scene, "+ JSON.stringify(option) +");";

                if(config.glowIntensity){
                    scenePro += "glowLayer.intensity = "+config.glowIntensity+";";
                }
            }
        }
        else if(key=="clearColor"){
            scenePro += generateCodeHTMLByColor(config, "clearColor", "scene", null);
        }
        else if(key=="enableFilter"){
            return false;
        }
        else if(key=="gravity"){
            let value = config.gravity;
            if(value[0]!=0 && value[1]!=-9.807 && value[2]!=0){
                scenePro += `scene.gravity = new BABYLON.Vector3(${value[0]},${value[1]},${value[2]});`;
            }
        }
        else if(!(key in {background2D:1,filter:1,mainTextureFixedSize:1,blurKernelSize:1,screenRatio:1,glowIntensity:1})){
            if(key in config){
                let value = config[key];
                if(value!=masterTemplate.scene[key]){
                    if(isRealNum(value)){
                        value = parseFloat(value);
                    }
                    else{
                        value = "'"+value+"'";
                    }
    
                    scenePro += "scene."+ key +" = "+ value +";"
                }
            }
        }
    });
    let sceneHtml = `
        let scene = new BABYLON.Scene(engine);
        //场景配置
        ${scenePro}
        
    `;

    let cameraHtml = ``;
    let cameraConfig = config.cameras[0];
    if(cameraConfig==null){
        cameraConfig = masterTemplate.camera;
    }
    if(cameraConfig.type=="UniversalCamera"){
        let enablePointHtml = "", enableKeyBoardHtml="";
        if(config.enablePoint===false){
            enablePointHtml = `camera.inputs.remove(camera.inputs.attached.mouse);`;
        }

        if(config.enableKeyBoard===false){
            enableKeyBoardHtml = `camera.inputs.remove(camera.inputs.attached.keyboard);`;
        }

        cameraHtml = `
                let camera = new BABYLON.UniversalCamera("${cameraConfig.id}", new BABYLON.Vector3(${cameraConfig.position[0]}, ${cameraConfig.position[1]}, ${cameraConfig.position[2]}), scene);
                camera.setTarget(new BABYLON.Vector3(${cameraConfig.target[0]}, ${cameraConfig.target[1]}, ${cameraConfig.target[2]}));
                camera.attachControl(canvas, false);
                ${enablePointHtml}
                ${enableKeyBoardHtml}
        `;
    }
    else  if(cameraConfig.type=="ArcRotateCamera"){
        let lowerRadiusLimitHTML = "", upperRadiusLimitHTML = "";
        if(cameraConfig.lowerRadiusLimit!=null && cameraConfig.lowerRadiusLimit!=1){
            lowerRadiusLimitHTML = "camera.lowerRadiusLimit = " + cameraConfig.lowerRadiusLimit;
        }
        if(cameraConfig.upperRadiusLimit!=null && cameraConfig.upperRadiusLimit!=1000){
            upperRadiusLimitHTML = "camera.upperRadiusLimit = " + cameraConfig.upperRadiusLimit;
        }

        let enablePointHtml = "", enableKeyBoardHtml="", enableMouseWheelHTML="";
        if(cameraConfig.enablePoint===false){
            enablePointHtml = `camera.inputs.remove(camera.inputs.attached.mouse);`;
        }

        if(cameraConfig.enableMouseWheel===false){
            enableMouseWheelHTML = `camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");`;
        }

        if(cameraConfig.enableKeyBoard===false){
            enableKeyBoardHtml = `camera.inputs.remove(camera.inputs.attached.keyboard);`;
        }

        cameraHtml = `
                let camera = new BABYLON.ArcRotateCamera("${cameraConfig.id}", ${cameraConfig.alpha}*Math.PI, ${cameraConfig.beta}*Math.PI, ${cameraConfig.radius}, new BABYLON.Vector3(${cameraConfig.target[0]}, ${cameraConfig.target[1]}, ${cameraConfig.target[2]}), scene);
                camera.attachControl(canvas, false);
                ${lowerRadiusLimitHTML}
                ${upperRadiusLimitHTML}

                ${enablePointHtml}
                ${enableMouseWheelHTML}
                ${enableKeyBoardHtml}
        `;
    }
    else  if(cameraConfig.type=="FollowCamera"){

        let lowerRadiusLimitHTML = "", upperRadiusLimitHTML = "";
        if(cameraConfig.lowerRadiusLimit!=null && cameraConfig.lowerRadiusLimit!=1){
            lowerRadiusLimitHTML = "camera.lowerRadiusLimit = " + cameraConfig.lowerRadiusLimit;
        }
        if(cameraConfig.upperRadiusLimit!=null && cameraConfig.upperRadiusLimit!=1000){
            upperRadiusLimitHTML = "camera.upperRadiusLimit = " + cameraConfig.upperRadiusLimit;
        }

        let radiusHTML="",heightOffsetHTML="",rotationOffsetHTML="";
        if(cameraConfig.radius!=null && cameraConfig.radius!=30){
            radiusHTML = "camera.radius = " + cameraConfig.radius;
        }
        if(cameraConfig.heightOffset!=null && cameraConfig.heightOffset!=0){
            heightOffsetHTML = "camera.heightOffset = " + cameraConfig.heightOffset;
        }
        if(cameraConfig.rotationOffset!=null && cameraConfig.rotationOffset!=0){
            rotationOffsetHTML = "camera.rotationOffset = " + cameraConfig.rotationOffset;
        }
        
        let enablePointHtml = "", enableKeyBoardHtml="", enableMouseWheelHTML="";
        if(cameraConfig.enablePoint===false){
            enablePointHtml = `camera.inputs.remove(camera.inputs.attached.mouse);`;
        }

        if(cameraConfig.enableMouseWheel===false){
            enableMouseWheelHTML = `camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");`;
        }

        if(cameraConfig.enableKeyBoard===false){
            enableKeyBoardHtml = `camera.inputs.remove(camera.inputs.attached.keyboard);`;
        }

        cameraHtml = `
                let camera = new BABYLON.FollowCamera("${cameraConfig.id}", new BABYLON.Vector3(${cameraConfig.position[0]}, ${cameraConfig.position[1]}, ${cameraConfig.position[2]}), scene);     
                camera.attachControl(canvas, false);
                ${radiusHTML}
                ${heightOffsetHTML} 
                ${rotationOffsetHTML}

                ${lowerRadiusLimitHTML}
                ${upperRadiusLimitHTML}
                
                ${enablePointHtml}
                ${enableMouseWheelHTML}
                ${enableKeyBoardHtml}
        `;
    }

    // Object.keys(masterTemplate.camera).forEach(key=>{
        

    //     if(key==)
    // });

    let lightsHTML = "";
    config.lights.forEach((light, i)=>{
        let lightInitial = "", p = light;

        if(p.type=="point"){
            lightInitial = `let light${i} = new BABYLON.PointLight("${p.id}", new BABYLON.Vector3(${p.position[0]}, ${p.position[1]}, ${p.position[2]}), scene);`;
        }
        else if(p.type=="spot"){
            lightInitial = `let light${i} = new BABYLON.SpotLight("${p.id}", new BABYLON.Vector3(${p.position[0]}, ${p.position[1]}, ${p.position[2]}), new BABYLON.Vector3(${p.direction[0]}, ${p.direction[1]}, ${p.direction[2]}), ${p.angle}*Math.PI, ${p.exponent}, scene);`;
        }
        else if(p.type=="hemispheric"){
            let groundColorHTML = "";

            if(p.groundColor!=null && p.groundColor!="rgb(255,255,255)"){
                var c = rgbOrRgbaToArray(p.groundColor);
                groundColorHTML = `light.groundColor = new BABYLON.Color3(${c[0]}/255,${c[1]}/255,${c[2]}/255);`;
            }

            lightInitial = `let light${i} = new BABYLON.HemisphericLight("${p.id}", new BABYLON.Vector3(${p.direction[0]}, ${p.direction[1]}, ${p.direction[2]}), scene);
                ${groundColorHTML}`;
        }
        else{
            lightInitial = `let pos${i} = new BABYLON.Vector3(${p.position[0]}, ${p.position[1]}, ${p.position[2]});
                let light${i} = new BABYLON.DirectionalLight("${p.id}", pos${i}.scale(-1), scene);
                light${i}.position = pos${i};
                light${i}.direction = pos${i}.scale(-1).normalize();`;

        }

        lightsHTML += `
            ${lightInitial}`;

    });

    let texturesHtml = ``, texturesIdList = {};
    config.textures.forEach((texture, i)=>{
        let p = texture, textureInitial="";
        texturesIdList[p.id] = i;

        let defualtSourceImage  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAFpJREFUOI3tkrERwCAQw2Tg2If9h4B9AH+qtElBkyIaQGefLdsREaSU2HuTc+bGNmMMJDHnpNbKWgtJ2KaUQuKQX/AFQem9P+7cWuPpJ68JIuKsgqQzwRu/AC7scDCL94T3AQAAAABJRU5ErkJggg==";

        
        if(p.type == "Texture"){

            textureInitial = `let texture${i} = new BABYLON.Texture("${p.source}", scene, ${p.noMipmap}, ${p.invertY}, 0,null, null,null, true);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}";`;

            textureInitial +=generateCodeHTMLByValue(p, "hasAlpha", "texture"+i, false);
            textureInitial +=generateCodeHTMLByValue(p, "level", "texture"+i, 1);
            textureInitial +=generateCodeHTMLByValue(p, "vScale", "texture"+i, 1);
            textureInitial +=generateCodeHTMLByValue(p, "uScale", "texture"+i, 1);
            textureInitial +=generateCodeHTMLByValue(p, "vOffset", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "uOffset", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "vAng", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "uAng", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "uAng", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "isBlocking", "texture"+i, true);
            textureInitial +=generateCodeHTMLByValue(p, "coordinatesMode", "texture"+i, 0);

            // this.setValue("level");
            // this.setValue("vScale");
            // this.setValue("uScale");
            // this.setValue("vOffset");
            // this.setValue("uOffset");
            // this.setValue("vAng");
            // this.setValue("uAng");

            // this.setValue("isBlocking", true);

            // this.setValue("coordinatesMode");

            // // if(p.coordinatesMode){
            // //     texture.coordinatesMode = BABYLON.Texture[p.coordinatesMode];
            // // }
        }
        else if(p.type == "CubeTexture"){
            let texture;
            if(p.enableSixImage){
                let sourceArray = p.sourceArray, files=[];
                sourceArray.forEach(base=>{
                    if(base && base.length>0){
                        let type = getImageType(base);
                        files.push(convertSourceToUrl(base, type));
                    }
                    else{
                        files.push(convertSourceToUrl(defualtSourceImage, "image/png"));
                    }

                });
                textureInitial = `let texture${i} = new BABYLON.CubeTexture("", scene, null, false, ${ JSON.stringify(files)});`;
            }
            else{
                let extention = "dds";
                if(p.extention){
                    extention = p.extention;
                }
                textureInitial = `let texture${i} = new BABYLON.CubeTexture(convertSourceToUrl("${p.source}"), scene, null,false,null,null,null,undefined, true,".${extention}",true);`;
            }


            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial +=generateCodeHTMLByValue(p, "invertZ", "texture"+i, false);
            textureInitial +=generateCodeHTMLByValue(p, "rotationY", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "level", "texture"+i, 1);
            textureInitial +=generateCodeHTMLByValue(p, "coordinatesMode", "texture"+i, 3);
        }
        else if(p.type == "HDRCubeTexture"){
            let texture;
            if(p.enableSixImage){
                // texture = new BABYLON.CubeTexture(p.source, scene);
            }
            else{
                let size = 512;
                if(p.textureSize){
                    size = p.textureSize;
                }
                textureInitial = `let texture${i} = new BABYLON.HDRCubeTexture(convertSourceToUrl("${p.source}", "application/hdr"), scene, ${size});`;
            }

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial +=generateCodeHTMLByValue(p, "invertZ", "texture"+i, false);
            textureInitial +=generateCodeHTMLByValue(p, "rotationY", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "level", "texture"+i, 1);
            textureInitial +=generateCodeHTMLByValue(p, "coordinatesMode", "texture"+i, 3);

        }
        else if(p.type == "EquiRectangularCubeTexture"){
            let texture;
            if(p.enableSixImage){
                // texture = new BABYLON.CubeTexture(p.source, scene);
            }
            else{
                let size = 512;
                if(p.textureSize){
                    size = p.textureSize;
                }

                let source = p.source;
                if(!p.source || p.source.length==0){
                    source = defualtSourceImage;
                }
                let type = getImageType(source);
                textureInitial = `let texture${i} = new BABYLON.EquiRectangularCubeTexture(convertSourceToUrl("${source}", ${type}), scene, ${size});`;
            }

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial +=generateCodeHTMLByValue(p, "invertZ", "texture"+i, false);
            textureInitial +=generateCodeHTMLByValue(p, "rotationY", "texture"+i, 0);
            textureInitial +=generateCodeHTMLByValue(p, "level", "texture"+i, 1);
            textureInitial +=generateCodeHTMLByValue(p, "coordinatesMode", "texture"+i, 3);
        }
        // else if(p.type == "ReflectionProbe"){
        //     let Probe = new BABYLON.ReflectionProbe(p.id, 512, scene);

        //     p.renderList.forEach(item => {
        //         Probe.renderList.push(scene.getMeshByID(item));
        //     });

        //     Probe.refreshRate = p.refreshRate;

        //     let texture = Probe.cubeTexture;
        //     this.updateObject = texture;
        //     texture.name = p.name;
        //     texture.uniqueId = p.id;
        // }
        // else if(p.type == "MirrorTexture"){
        //     let texture = new BABYLON.MirrorTexture(p.id, 512, scene, true);

        //     p.renderList.forEach(item => {
        //         texture.renderList.push(scene.getMeshByID(item));
        //     });

        //     this.updateObject = texture;

        //     texture.name = p.name;
        //     texture.uniqueId = p.id;
        //     let mp = p.mirrorPlane;
        //     if(mp!=null && mp.length>0){
        //         texture.mirrorPlane = new BABYLON.Plane(mp[0], mp[1], mp[2], mp[3]);
        //     }

        //     this.setValue("ratio");
        //     // this.setValue("distance");
        //     this.setValue("level");
        //     this.setValue("adaptiveBlurKernel");
        // }
        // else if(p.type == "refractionTexture"){
        //     let texture = new BABYLON.RefractionTexture(p.id, 512, scene, true);

        //     p.renderList.forEach(item => {
        //         texture.renderList.push(scene.getMeshByID(item));
        //     });

        //     this.updateObject = texture;

        //     texture.name = p.name;
        //     texture.uniqueId = p.id;
        //     let mp = p.refractionPlane;
        //     if(mp!=null && mp.length>0){
        //         texture.refractionPlane = new BABYLON.Plane(mp[0], mp[1], mp[2], mp[3]);
        //     }

        //     // this.setValue("distance");
        //     this.setValue("depth");
        // }
        else if(p.type == "BrickProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.BrickProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial += generateCodeHTMLByValue(p, "numberOfBricksHeight", "texture"+i, 6);
            textureInitial += generateCodeHTMLByValue(p, "numberOfBricksWidth", "texture"+i, 10);
            textureInitial += generateCodeHTMLByColor(p, "jointColor", "texture"+i, null);
            textureInitial += generateCodeHTMLByColor(p, "brickColor", "texture"+i, null);
        }
        else if(p.type == "CloudProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.CloudProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;
            textureInitial += generateCodeHTMLByColor(p, "skyColor", "texture"+i, null, 4);
            textureInitial += generateCodeHTMLByColor(p, "cloudColor", "texture"+i, null, 4);
        }
        else if(p.type == "FireProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.FireProceduralTexture(p.id, 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial += generateCodeHTMLByValue(p, "speed", "texture"+i, [0.08, 0.4]);
            textureInitial += generateCodeHTMLByValue(p, "shift", "texture"+i, [0.08, 0.4]);

            // this.setColor3Value("fireColors");

            var colors = [p.c1, p.c2, p.c3, p.c4, p.c5, p.c6];
            colors.forEach((pcolor,index)=>{
                if(pcolor!=null){
                    let c = rgbOrRgbaToArray(pcolor);
                    textureInitial +=`texture${i}.fireColors[${index}].r = ${c[0]/255};`;
                    textureInitial +=`texture${i}.fireColors[${index}].g = ${c[1]/255};`;
                    textureInitial +=`texture${i}.fireColors[${index}].b = ${c[2]/255};`;
                }    
            });
        }
        else if(p.type == "GrassProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.GrassProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            var colors = [p.herb1Color, p.herb2Color, p.herb3Color];
            colors.forEach((pcolor,index)=>{
                if(pcolor!=null){
                    let c = rgbOrRgbaToArray(pcolor);
                    textureInitial +=`texture${i}.grassColors[${index}].r = ${c[0]/255};`;
                    textureInitial +=`texture${i}.grassColors[${index}].g = ${c[1]/255};`;
                    textureInitial +=`texture${i}.grassColors[${index}].b = ${c[2]/255};`;
                }    
            });

            textureInitial += generateCodeHTMLByColor(p, "groundColor", "texture"+i, null);
        }
        else if(p.type == "MarbleProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.MarbleProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial += generateCodeHTMLByValue(p, "numberOfBricksHeight", "texture"+i, 6);
            textureInitial += generateCodeHTMLByValue(p, "numberOfTilesWidth", "texture"+i, 10);
            textureInitial += generateCodeHTMLByColor(p, "jointColor", "texture"+i, null);

        }
        else if(p.type == "RoadProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.RoadProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;
            textureInitial += generateCodeHTMLByColor(p, "roadColor", "texture"+i, null);
        }
        else if(p.type == "WoodProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.WoodProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial += generateCodeHTMLByColor(p, "woodColor", "texture"+i, null);
            textureInitial += generateCodeHTMLByValue(p, "ampScale", "texture"+i, 50);

        }
        else if(p.type == "NoiseProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.NoiseProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial += generateCodeHTMLByValue(p, "brightness", "texture"+i, 0.2);
            textureInitial += generateCodeHTMLByValue(p, "octaves", "texture"+i, 3);
            textureInitial += generateCodeHTMLByValue(p, "persistence", "texture"+i, 0.8);
            textureInitial += generateCodeHTMLByValue(p, "animationSpeedFactor", "texture"+i, 1);
        }
        else if(p.type == "StarfieldProceduralTexture"){
            textureInitial = `let texture${i} = new BABYLON.StarfieldProceduralTexture("${p.id}", 512, scene);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial += `texture${i}.metadata = {"type":"StarfieldProceduralTexture","isMoveAble":false,}`;

            if(p["StarfieldBrightness"]!=null && p["StarfieldBrightness"]!=0.001){
                textureInitial += `texture${i}.brightness = ${p["StarfieldBrightness"]}`;
            }
            if(p["Starfieldtime"]!=null && p["Starfieldtime"]!=0){
                textureInitial += `texture${i}.time = ${p["Starfieldtime"]}`;
            }

            textureInitial += generateCodeHTMLByValue(p, "beta", "texture"+i, 0.1);
            textureInitial += generateCodeHTMLByValue(p, "coordinatesMode", "texture"+i, 0);

            // this.setValue("brightness",null, "StarfieldBrightness");
            // this.setValue("beta");
            // this.setValue("time",null, "Starfieldtime");
            // this.setValue("coordinatesMode");
        }
        else if(p.type=="VideoTexture"){
            textureInitial = `let texture${i} = new BABYLON.VideoTexture("${p.id}", "${p.videoSrc}", scene, true);`;

            textureInitial += `texture${i}.name = "${p.name}";`;
            textureInitial += `texture${i}.uniqueId = "${p.id}"`;

            textureInitial += generateCodeHTMLByValue(p, "hasAlpha", "texture"+i, false);
            textureInitial += generateCodeHTMLByValue(p, "level", "texture"+i, 1);
            textureInitial += generateCodeHTMLByValue(p, "vScale", "texture"+i, 1);
            textureInitial += generateCodeHTMLByValue(p, "uScale", "texture"+i, 1);
            textureInitial += generateCodeHTMLByValue(p, "vOffset", "texture"+i, 0);
            textureInitial += generateCodeHTMLByValue(p, "uOffset", "texture"+i, 0);
            textureInitial += generateCodeHTMLByValue(p, "vAng", "texture"+i, 0);
            textureInitial += generateCodeHTMLByValue(p, "uAng", "texture"+i, 0);
            textureInitial += generateCodeHTMLByValue(p, "coordinatesMode", "texture"+i, 0);
            textureInitial += generateCodeHTMLByValue(p, "isBlocking", "texture"+i, true);

            textureInitial = `texture${i}.video.autoplay = ${p.autoplay}==null?true:${p.autoplay};`;

            if(p.poster && p.poster.length>0){
                textureInitial = `texture${i}.video.poster = "${p.poster}";`;
                textureInitial = `texture${i}.url = "${p.poster}";`;
            }
        }

        texturesHtml += `
            ${textureInitial}`;
    });



    
    let materialsHtml = ``, materialsIdList={};
    config.materials.forEach((material, i)=>{
        let p = material, materialInitial="";
        materialsIdList[p.id] = i;

        if(p.type == "StandardMaterial"){
            materialInitial = `let material${i} = new BABYLON.StandardMaterial("${p.id}", scene);`;

            //漫反射
            materialInitial += createTextureAttribute(p, "material"+i, "diffuseTexture", "diffuseColor", "enableDiffuseFresnelParameters", "diffuseFresnelParameters", texturesIdList);


            //镜面反射
            materialInitial += createTextureAttribute(p, "material"+i, "specularTexture", "specularColor",null, null, texturesIdList);

            materialInitial += generateCodeHTMLByValue(p, "specularPower", "material"+i, 0);

            //自发光
            materialInitial += createTextureAttribute(p, "material"+i, "emissiveTexture", "emissiveColor", "enableEmissiveFresnelParameters", "emissiveFresnelParameters", texturesIdList);


            //环境光
            materialInitial += createTextureAttribute(p, "material"+i, "ambientTexture", "ambientColor",null, null, texturesIdList);


            //环境反射
            materialInitial += createTextureAttribute(p, "material"+i, "reflectionTexture", null, "enableReflectionFresnelParameters", "reflectionFresnelParameters", texturesIdList);

            //折射纹理
            materialInitial += createTextureAttribute(p, "material"+i, "refractionTexture", null, "enableRefractionFresnelParameters", "refractionFresnelParameters", texturesIdList);

            //透明度纹理
            materialInitial += createTextureAttribute(p, "material"+i, "opacityTexture", null, "enableOpacityFresnelParameters", "opacityFresnelParameters", texturesIdList);

            //法线纹理
            materialInitial += createTextureAttribute(p, "material"+i, "bumpTexture", null, null, null, texturesIdList);

            //灯光纹理
            materialInitial += createTextureAttribute(p, "material"+i, "lightmapTexture", null, null, null, texturesIdList);


            materialInitial += generateCodeHTMLByValue(p, "useLightmapAsShadowmap", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "alphaMode", "material"+i, 2);

            materialInitial += generateCodeHTMLByValue(p, "wireframe", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "fillMode", "material"+i, 0);

            materialInitial += generateCodeHTMLByValue(p, "pointsCloud", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "pointSize", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "useParallax", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "useParallaxOcclusion", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "parallaxScaleBias", "material"+i, 0.1);

        }
        else if(p.type == "PBRMaterial"){
            materialInitial = `let material${i} = new BABYLON.PBRMaterial("${p.id}", scene);`;
        
            materialInitial += generateCodeHTMLByColor(p, "albedoColor", "material"+i, 'rgb(255, 255, 255)');
            materialInitial += generateCodeHTMLByColor(p, "reflectivityColor", "material"+i, null);

            materialInitial += generateCodeHTMLByValue(p, "metallic", "material"+i, 0);
            materialInitial += generateCodeHTMLByValue(p, "roughness", "material"+i, 0);

            materialInitial += generateCodeHTMLByValue(p, "linkRefractionWithTransparency", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "indexOfRefraction", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "directIntensity", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "environmentIntensity", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "cameraExposure", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "cameraContrast", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "microSurface", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, true);
            materialInitial += generateCodeHTMLByValue(p, "forceIrradianceInFragment", "material"+i, false);

            materialInitial += generateCodeHTMLByValue(p, "emissiveIntensity", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "useLightmapAsShadowmap", "material"+i, false);

            materialInitial += generateCodeHTMLByColor(p, "emissiveColor", "material"+i, 'rgb(0, 0, 0)');

            if(p.enableSubSurface && p.subSurface){
                materialInitial += `material${i}.subSurface.isRefractionEnabled = ${p.subSurface.isRefractionEnabled};`;
                materialInitial += `material${i}.subSurface.indexOfRefraction = ${p.subSurface.indexOfRefraction};`;
                materialInitial += `material${i}.subSurface.refractionIntensity = ${p.subSurface.refractionIntensity};`;
                materialInitial += `material${i}.subSurface.isTranslucencyEnabled = ${p.subSurface.isTranslucencyEnabled};`;
                let cl = rgbOrRgbaToArray(p.subSurface.tintColor);
                materialInitial += `material${i}.subSurface.tintColor = new BABYLON.Color3(${cl[0]}/255,${cl[1]}/255,${cl[2]}/255);`;
                materialInitial += `material${i}.subSurface.tintColorAtDistance = ${p.subSurface.tintColorAtDistance};`;
                materialInitial += `material${i}.subSurface.minimumThickness = ${p.subSurface.minimumThickness};`;
                materialInitial += `material${i}.subSurface.maximumThickness = ${p.subSurface.maximumThickness};`;
                materialInitial += `material${i}.subSurface.linkRefractionWithTransparency = ${p.subSurface.linkRefractionWithTransparency};`;
                materialInitial += `material${i}.subSurface.useMaskFromThicknessTexture = ${p.subSurface.useMaskFromThicknessTexture};`;
            }

            if(p.enableClearCoat && p.clearCoat){
                materialInitial += `material${i}.clearCoat.isEnabled = true;`;
                materialInitial += `material${i}.clearCoat.intensity = ${p.clearCoat.intensity};`;
                materialInitial += `material${i}.clearCoat.isTintEnabled = ${p.clearCoat.isTintEnabled};`;
                let cl = rgbOrRgbaToArray(p.clearCoat.tintColor);
                materialInitial += `material${i}.clearCoat.tintColor = new BABYLON.Color3(${cl[0]}/255,${cl[1]}/255,${cl[2]}/255);`;
                materialInitial += `material${i}.clearCoat.tintColorAtDistance = ${p.clearCoat.tintColorAtDistance};`;
                materialInitial += `material${i}.clearCoat.tintThickness = ${p.clearCoat.tintThickness};`;
                materialInitial += `material${i}.clearCoat.roughness = ${p.clearCoat.roughness};`;
                materialInitial += `material${i}.clearCoat.indexOfRefraction = ${p.clearCoat.indexOfRefraction};`;
            }

            if(p.enableAnisotropy && p.anisotropy){
                materialInitial += `material${i}.anisotropy.isEnabled = true;`;
                materialInitial += `material${i}.anisotropy.intensity = ${p.anisotropy.intensity};`;
                materialInitial += `material${i}.anisotropy.direction.x = ${p.anisotropy.direction.x};`;
                materialInitial += `material${i}.anisotropy.direction.y = ${p.anisotropy.direction.y};`;
            }

            if(p.enableSheen && p.sheen){
                materialInitial += `material${i}.anisotropy.isEnabled = true;`;
                materialInitial += `material${i}.anisotropy.intensity = ${p.anisotropy.intensity};`;
                var cl = rgbOrRgbaToArray(p.anisotropy.color);
                materialInitial += `material${i}.anisotropy.color = new BABYLON.Color3(${cl[0]}/255,${cl[1]}/255,${cl[2]}/255);`;
            }

        }
        else if(p.type == "BackgroundMaterial"){
            materialInitial = `let material${i} = new BABYLON.BackgroundMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "useRGBColor", "material"+i, true);
            materialInitial += generateCodeHTMLByValue(p, "primaryColorShadowLevel", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "primaryColorHighlightLevel", "material"+i, 1);

            materialInitial += generateCodeHTMLByColor(p, "primaryColor", "material"+i, 'rgb(255,255,255)');

        }
        else if(p.type == "FireMaterial"){
            materialInitial = `let material${i} = new BABYLON.FireMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "speed", "material"+i, 1);
        }
        else if(p.type == "WaterMaterial"){//需要回过头去算mesh连接
            materialInitial = `let material${i} = new BABYLON.WaterMaterial("${p.id}", scene, new BABYLON.Vector2(512, 512));`;

            // p.renderList.forEach(item => {
            //     material.addToRenderList(scene.getMeshByID(item));
            // });

            materialInitial += generateCodeHTMLByValue(p, "windForce", "material"+i, 45);
            materialInitial += generateCodeHTMLByValue(p, "waveHeight", "material"+i, 1.3);
            materialInitial += generateCodeHTMLByValue(p, "waveLength", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "waveSpeed", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "windDirection", "material"+i, [1,1]);

            materialInitial += generateCodeHTMLByColor(p, "waterColor", "material"+i, 'rgb(26,26,153)');
            materialInitial += generateCodeHTMLByColor(p, "waterColor2", "material"+i, 'rgb(26,26,153)');

            materialInitial += generateCodeHTMLByValue(p, "colorBlendFactor", "material"+i, 2);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);

        }
        else if(p.type == "LavaMaterial"){
            materialInitial = `let material${i} = new BABYLON.LavaMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByValue(p, "unlit", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "speed", "material"+i, 2);

            materialInitial += generateCodeHTMLByColor(p, "fogColor", "material"+i, 'rgb(0,0,0)');
        }
        else if(p.type == "NormalMaterial"){
            materialInitial = `let material${i} = new BABYLON.NormalMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);

        }
        else if(p.type == "FurMaterial"){
            materialInitial = `let material${i} = new BABYLON.FurMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByValue(p, "highLevelFur", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "furSpacing", "material"+i, 6);
            materialInitial += generateCodeHTMLByValue(p, "furDensity", "material"+i, 10);
            materialInitial += generateCodeHTMLByValue(p, "furSpeed", "material"+i, 200);
            materialInitial += generateCodeHTMLByColor(p, "furGravity", "material"+i, [0, 0, 0]);
            materialInitial += generateCodeHTMLByValue(p, "furQuality", "material"+i, 30);
            materialInitial += generateCodeHTMLByValue(p, "furLength", "material"+i, 4);
            materialInitial += generateCodeHTMLByValue(p, "furAngle", "material"+i, 0);

            materialInitial += generateCodeHTMLByColor(p, "furColor", "material"+i, 'rgb(255,255,255)');
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
        }
        else if(p.type == "TerrainMaterial"){
            materialInitial = `let material${i} = new BABYLON.TerrainMaterial("${p.id}", scene);`;
            

            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
        }
        else if(p.type == "TriPlanarMaterial"){
            materialInitial = `let material${i} = new BABYLON.TriPlanarMaterial(p.id, scene);`;
            materialInitial += generateCodeHTMLByValue(p, "tileSize", "material"+i, 1.5);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
        }
        else if(p.type == "GradientMaterial"){
            materialInitial = `let material${i} = new BABYLON.GradientMaterial("${p.id}", scene);`;

            materialInitial += generateCodeHTMLByColor(p, "topColor", "material"+i, 'rgb(0,0,0)');
            materialInitial += generateCodeHTMLByColor(p, "bottomColor", "material"+i, 'rgb(0,0,0)');
            
            materialInitial += generateCodeHTMLByValue(p, "offset", "material"+i, 0.25);
            materialInitial += generateCodeHTMLByValue(p, "scale", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "smoothness", "material"+i, 0);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);

        }
        else if(p.type == "SkyMaterial"){
            materialInitial = `let material${i} = new BABYLON.SkyMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByValue(p, "turbidity", "material"+i, 3);
            materialInitial += generateCodeHTMLByValue(p, "luminance", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "inclination", "material"+i, 0.1);
            materialInitial += generateCodeHTMLByValue(p, "azimuth", "material"+i, 0.05);
            materialInitial += generateCodeHTMLByValue(p, "useSunPosition", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "sunPosition", "material"+i, [0, 0, 0]);
            materialInitial += generateCodeHTMLByValue(p, "rayleigh", "material"+i, 0);
            materialInitial += generateCodeHTMLByValue(p, "mieDirectionalG", "material"+i, 0.5);
            materialInitial += generateCodeHTMLByValue(p, "mieCoefficient", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
        }
        else if(p.type == "GridMaterial"){
            materialInitial = `let material${i} = new BABYLON.GridMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByColor(p, "mainColor", "material"+i, 'rgb(255,255,255)');
            materialInitial += generateCodeHTMLByColor(p, "lineColor", "material"+i, 'rgb(255,255,255)');

            materialInitial += generateCodeHTMLByValue(p, "opacity", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "gridRatio", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "majorUnitFrequency", "material"+i, 10);
            materialInitial += generateCodeHTMLByValue(p, "minorUnitVisibility", "material"+i, true);
            materialInitial += generateCodeHTMLByValue(p, "gridOffset", "material"+i, [0, 0, 0]);

        }
        else if(p.type == "ShadowOnlyMaterial"){
            materialInitial = `let material${i} = new BABYLON.ShadowOnlyMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByColor(p, "shadowColor", "material"+i, 'rgb(255,255,255)');
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);

        }
        else if(p.type == "MixMaterial"){
            materialInitial = `let material${i} = new BABYLON.MixMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
        }
        else if(p.type == "MToonMaterial"){
            materialInitial = `let material${i} = new window.MToonMaterial("${p.id}", scene);`;
            
            materialInitial += generateCodeHTMLByColor(p, "diffuseColor", "material"+i, 'rgb(255,255,255)');
            materialInitial += generateCodeHTMLByColor(p, "emissiveColor", "material"+i, 'rgb(0,0,0)');
            materialInitial += generateCodeHTMLByColor(p, "ambientColor", "material"+i, 'rgb(26,26,26)');
            materialInitial += generateCodeHTMLByColor(p, "outlineColor", "material"+i, 'rgb(0,0,0)');

            materialInitial += generateCodeHTMLByValue(p, "outlineWidth", "material"+i, 0.5);
            materialInitial += generateCodeHTMLByValue(p, "outlineWidthMode", "material"+i, 0);
            materialInitial += generateCodeHTMLByValue(p, "outlineColorMode", "material"+i, 1);

            materialInitial += generateCodeHTMLByColor(p, "rimColor", "material"+i, 'rgb(0,0,0)');

            materialInitial += generateCodeHTMLByValue(p, "shadeShift", "material"+i, 0);
            materialInitial += generateCodeHTMLByValue(p, "shadeToony", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "alpha", "material"+i, 1);
            materialInitial += generateCodeHTMLByValue(p, "alphaMode", "material"+i, 2);
            materialInitial += generateCodeHTMLByValue(p, "wireframe", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "backFaceCulling", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "fillMode", "material"+i, 0);
            materialInitial += generateCodeHTMLByValue(p, "pointsCloud", "material"+i, false);
            materialInitial += generateCodeHTMLByValue(p, "pointSize", "material"+i, 1);

        }

        Object.keys(textureMap).forEach(key=>{
            if(p[key]!=null && p[key].length>0){
                let textureId = p[key];
                if(textureId in texturesIdList){
                    materialInitial += `material${i}.${key} = texture${texturesIdList[textureId]};`;
                }
            }
        });

        materialsHtml += `
            ${materialInitial}`;
    });


    let meshesHtml = ``, meshesIdList={};
    config.meshes.forEach((mesh, i)=>{
        let p = mesh, meshInitial="";
        meshesIdList[p.id] = i;

        meshInitial += createMeshObject(p, p.vertexData, "mesh"+i);

        meshInitial += generateCodeHTMLByValue(p, "isVisible", "mesh"+i, true);
        meshInitial += generateCodeHTMLByValue(p, "position", "mesh"+i, [0, 0, 0]);
        meshInitial += generateCodeHTMLByValue(p, "rotation", "mesh"+i, [0, 0, 0]);
        meshInitial += generateCodeHTMLByValue(p, "scaling", "mesh"+i, [1, 1, 1]);
        meshInitial += generateCodeHTMLByValue(p, "visibility", "mesh"+i, 1);
        meshInitial += generateCodeHTMLByValue(p, "isPickable", "mesh"+i, true);

        if(p.enableEdgesRendering){
            meshInitial += `mesh${i}.enableEdgesRendering();`;
            meshInitial += generateCodeHTMLByValue(p, "edgesWidth", "mesh"+i, 4);
            meshInitial += generateCodeHTMLByColor(p, "edgesColor", "mesh"+i, 'rgba(0,0,0,1)', 4);
        }
        
        if(p.enableHighlight){
            // createhighlight(mesh, p, scene);
            meshInitial += `
            let mesh${i}_hl = new BABYLON.HighlightLayer("${p.id}" + "_hightlight", scene);
            let mesh${i}_c = rgbOrRgbaToArray(p.highlightColor);
            mesh${i}_hl.addMesh(mesh, new BABYLON.Color3(mesh${i}_c[0]/255,mesh${i}_c[1]/255,mesh${i}_c[2]/255), ${p.ishighlightEmissive});
            mesh${i}_hl.blurHorizontalSize = ${p.blurHorizontalSize};
            mesh${i}_hl.blurVerticalSize = ${p.blurVerticalSize};
            mesh${i}_hl.outerGlow = ${p.outerGlow};
            mesh${i}_hl.innerGlow = ${p.innerGlow};
            mesh${i}.highlight = mesh${i}_hl;`;
        }

        if(p.enableGlow){
            if(scene.effectLayers){
                meshInitial += `
                let mesh${i}_gl = scene.getGlowLayerByName(scene.id+"_glow");
                if(mesh${i}_gl!=null){
                    mesh${i}_gl.addIncludedOnlyMesh(mesh${i});
                }
                if(mesh${i}.metadata==null){
                    mesh${i}.metadata = {};
                }
                mesh${i}.metadata["enableGlow"] = true;`;
            }
        }


        meshInitial += generateCodeHTMLByValue(p, "billboardMode", "mesh"+i, 0);
        meshInitial += generateCodeHTMLByValue(p, "infiniteDistance", "mesh"+i, false);
        meshInitial += generateCodeHTMLByValue(p, "receiveShadows", "mesh"+i, false);
        
        if(p.type!="Lines" && p.type!="DashedLines" && p.type!="LineSystem"){
            meshInitial += generateCodeHTMLByValue(p, "checkCollisions", "mesh"+i, false);
        }
        meshInitial += generateCodeHTMLByValue(p, "applyFog", "mesh"+i, true);
        meshInitial += generateCodeHTMLByValue(p, "isBlocker", "mesh"+i, false);

        // if(p.enableVolumetricLight){
        //     createVolumetricLight(mesh, p, scene);
        // }

        // if(p.enableLensFlare){
        //     createLensFlareSystem(p, scene, mesh);
            
        // }

        // createLookAt(mesh, p, babylon, mode);

        // if(p.subMeshes && p.subMeshes.length>0){
        //     createSubMeshes(mesh, p.subMeshes);

        // }


        if(p.materialId && p.materialId.length>0){
            meshInitial += `mesh${i}.material = material${materialsIdList[p.materialId]};`;
        }

        // if(p.enableRigidPhysic){
        //     createRigidPhysic(mesh, p, scene);
        //     if(gizmo){
        //         gizmo.attachToMesh(null);
        //     }
        // }
        // else if(p.enableSoftPhysic){
        //     createSoftPhysic(mesh, p, scene);
        //     if(gizmo){
        //         gizmo.attachToMesh(null);
        //     }
        // }
        // else{
        //     if(gizmo){
        //         gizmo.attachToMesh(mesh);
        //     }
        // }

        meshesHtml += `
            ${meshInitial}`;
    });

    config.meshes.forEach((mesh, i)=>{
        let p = mesh;
        if(p.parentId && p.parentId.length>0){
            let meshInitial = `mesh${i}.parent = mesh${meshesIdList[p.parentId]};`;

            meshesHtml += `${meshInitial}`;
        }
    });
    

    let beforeProgramHtml = ``;
    let afterProgramHtml = ``;


    let html = `
            <!DOCTYPE html>
            <html xmlns="http://www.w3.org/1999/xhtml">
            
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
                    <title>Babylon Template</title>
            
                    <style>
                        html, body {
                            overflow: hidden;
                            width: 100%;
                            height: 100%;
                            margin: 0;
                            padding: 0;
                        }
            
                        #renderCanvas {
                            width: 100%;
                            height: 100%;
                            touch-action: none;
                            outline: none;
                        }
                    </style>
            
                    <script src="https://preview.cnbabylon.com/babylon.js"></script>
                    <script src="https://preview.cnbabylon.com/materialsLibrary/babylonjs.materials.min.js"></script>
                    <script src="https://preview.cnbabylon.com/loaders/babylonjs.loaders.min.js"></script>
                    <script src="https://preview.cnbabylon.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
                    <script src="https://preview.cnbabylon.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
                    <script src="https://preview.cnbabylon.com/serializers/babylonjs.serializers.min.js"></script>
                    <script src="https://preview.cnbabylon.com/gui/babylon.gui.min.js"></script>
                    <script src="https://preview.cnbabylon.com/inspector/babylon.inspector.bundle.js"></script>
                    <script src="https://minio.cnbabylon.com/public/LuckyBabylon/babylon-mtoon-material.js"></script>
                </head>
            
            <body>
            
                <canvas id="renderCanvas" touch-action="none"></canvas> //touch-action="none" for best results from PEP
            
                <script>
                    var canvas = document.getElementById("renderCanvas"); // 得到canvas对象的引用
                    var engine = new BABYLON.Engine(canvas, true); // 初始化 BABYLON 3D engine
            
                    /******* Add the create scene function ******/
                    var createScene = function () {
            
                        // 创建场景scene
                        ${sceneHtml}
            
                        // 添加相机，并绑定鼠标事件
                        ${cameraHtml}
            
                        // 添加灯光到场景
                        ${lightsHTML}
            
                        // 初始化纹理
                        ${texturesHtml}

                        // 初始化材质
                        ${materialsHtml}

                        // 初始化物体
                        ${meshesHtml}
                        
                        return scene;
                    };
                    /******* End of the create scene function ******/
            
                    var scene = createScene(); //Call the createScene function
            
                    // 最后一步调用engine的runRenderLoop方案，执行scene.render()，让我们的3d场景渲染起来
                    engine.runRenderLoop(function () {
                            ${beforeProgramHtml}
                            scene.render();
                            ${afterProgramHtml}
                    });
            
                    // 监听浏览器改变大小的事件，通过调用engine.resize()来自适应窗口大小
                    window.addEventListener("resize", function () {
                            engine.resize();
                    });

                    function convertSourceToUrl(source, type){
                        if(source==null || source.length==0){
                            return "";
                        }
                
                        if(type==null){
                            type = "application/dds";
                        }
                
                        // if(source instanceof Uint8Array){
                        //     var blob = new Blob(source);
                        //     url = window.URL.createObjectURL(blob);
                        // }
                        // else{
                        //     url = source;
                        // }
                
                        let typedArray = BABYLON.Tools.DecodeBase64(source);
                        let blob = new Blob([typedArray], {type: type}); // 传入一个合适的MIME类型   
                        let url = URL.createObjectURL(blob);   
                        return url;
                    }
                </script>
            
            </body>
            
            </html>
    `;

    return jsbeautifier.html(html);
}

function createMeshObject(p, vertexData, mesh){
    // let scene = babylon.scene, font = babylon.font;
    let meshHtml="";
    // if(mode==null){
    //     mode = "b";
    // }
    let iniOption = {};
    if(p.type=="Box"){
        if(!p.accurate){
            iniOption.size = p.size;
        }
        else{
            iniOption.height = p.height;
            iniOption.width = p.width;
            iniOption.depth = p.depth;
        }


        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFace){
            iniOption.faceUV = p.faceUV;
            iniOption.faceColors = p.faceColors;
        }

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateBox("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="TiledBox"){
        if(!p.accurate){
            iniOption.size = p.size;
        }
        else{
            iniOption.height = p.height;
            iniOption.width = p.width;
            iniOption.depth = p.depth;
        }

        iniOption.tileSize = p.tileSize;
        iniOption.tileHeight = p.tileHeight;
        iniOption.tileWidth = p.tileWidth;

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFace){
            iniOption.faceUV = p.faceUV;
            iniOption.faceColors = p.faceColors;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateTiledBox("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Sphere"){
        iniOption.segments = p.segments;

        if(!p.accurate){
            iniOption.diameter = p.diameter;
        }
        else{
            iniOption.diameterX = p.diameterX;
            iniOption.diameterY = p.diameterY;
            iniOption.diameterZ = p.diameterZ;
        }

        iniOption.arc = p.arc;
        iniOption.slice = p.slice;

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateSphere("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Cylinder"){

        iniOption.height = p.height;

        if(!p.accurate){
            iniOption.diameter = p.diameter;
        }
        else{
            iniOption.diameterTop = p.diameterTop;
            iniOption.diameterBottom = p.diameterBottom;
        }

        iniOption.tessellation = p.tessellation;
        iniOption.subdivisions = p.subdivisions;

        iniOption.arc = p.arc;

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFace){
            iniOption.faceUV = p.faceUV;
            iniOption.faceColors = p.faceColors;
        }

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateCylinder("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Plane"){

        if(!p.accurate){
            iniOption.size = p.size;
        }
        else{
            iniOption.width = p.width;
            iniOption.height = p.height;
        }

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreatePlane("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="TiledPlane"){
        if(!p.accurate){
            iniOption.size = p.size;
        }
        else{
            iniOption.width = p.width;
            iniOption.height = p.height;
        }

        if(!p.accurateTile){
            iniOption.tileSize = p.tileSize;
        }
        else{
            iniOption.tileHeight = p.tileHeight;
            iniOption.tileWidth = p.tileWidth;
        }

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateTiledPlane("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Disc"){

        iniOption.radius = p.radius;
        iniOption.tessellation = p.tessellation;

        iniOption.arc = p.arc;

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateDisc("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Torus"){

        iniOption.diameter = p.diameter;
        iniOption.thickness = p.thickness;
        iniOption.tessellation = p.tessellation;

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateTorus("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="TorusKnot"){
        iniOption.radius = p.radius;
        iniOption.tube = p.tube;
        iniOption.radialSegments = p.radialSegments;
        iniOption.tubularSegments = p.tubularSegments;
        iniOption.p = p.p;
        iniOption.q = p.q;

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateTorusKnot("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Ground"){
        iniOption.height = p.height;
        iniOption.width = p.width;
        iniOption.subdivisions = p.subdivisions;

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateGround("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="TiledGround"){
        iniOption.xmin = p.xmin;
        iniOption.zmin = p.zmin;
        iniOption.xmax = p.xmax;
        iniOption.zmax = p.zmax;

        iniOption.subdivisions = p.subdivisions;
        iniOption.precision = p.precision;

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateTiledGround("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="HeightMap"){
        iniOption.width = p.width;
        iniOption.height = p.height;
        iniOption.subdivisions = p.subdivisions;
        iniOption.minHeight = p.minHeight;
        iniOption.maxHeigth = p.maxHeigth;

        iniOption.sideOrientation = p.sideOrientation;
        // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

        let url = blankImageBase64;
        if(p.heightMapPicture!=null && p.heightMapPicture.length>0){
            url = p.heightMapPicture;
        }
        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateGroundFromHeightMap("${p.id}", ${url}, ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="3DText"){
        let content = "默认文字";
        if(p.content!=null && p.content.length>0){
            content = p.content;
        }

        let shapes;

        // if(p.shapes!=null && mode=="p"){
            shapes = JSON.stringify(p.shapes);
        // }
        // else{
        //     shapes = Font.Compile(font, content, p.fontSize, p.Interpolation, p.decimation);
        // }

        meshHtml = `let ${mesh} = Font.BuildMesh(${shapes}, { depth:${p.depth}, sideOrientation:${p.sideOrientation} }, scene);
        mesh.name = ${p.id};
        mesh.id = ${p.id};
        mesh._msShapes = ${shapes};`;
    }
    else if(p.type=="UploadMesh"){
        meshHtml = `let ${mesh} = new BABYLON.Mesh(p.id, scene);`;

        if(vertexData!=null){
            meshHtml = `let ${mesh}_geometry = new BABYLON.Geometry(${vertexData}.id, scene);
            BABYLON.VertexData.ImportVertexData(${vertexData}, ${mesh}_geometry );
            ${mesh}_geometry .applyToMesh(${mesh});`;
        }

    }
    else if(p.type=="Lines"){
        
        if(p.points && p.points.length>0){
            let points = [], colors=[], isHaveColor=true;
            p.points.forEach((item)=>{
                let point = item.point, color = item.color;
                if(color!=null){
                    let c = rgbOrRgbaToArray(color);
                    colors.push(new BABYLON.Color4(c[0]/255,c[1]/255,c[2]/255,c[3]));
                }
                else{
                    isHaveColor = false;
                }
                
                points.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });

            iniOption.points = points;
            if(isHaveColor){
                iniOption.colors = colors;
            }
        }
        // iniOption.points = p.points;
        iniOption.useVertexAlpha = p.useVertexAlpha;

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateLines("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="DashedLines"){
        if(p.points && p.points.length>0){
            let points = [];
            p.points.forEach((item)=>{
                let point = item.point;
                points.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });
            iniOption.points = points;
        }

        iniOption.dashSize = p.dashSize;
        iniOption.gapSize = p.gapSize;
        iniOption.dashNb = p.dashNb;

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateDashedLines("${p.id}", ${JSON.stringify(iniOption)}, scene);`
    }
    else if(p.type=="LineSystem"){
        if(p.lines && p.lines.length>0){
            let lines = [], colors=[], isHaveColor=true;
            p.lines.forEach((line)=>{
                let oneLine = [], oneLineColor=[], isOneLineHaveColor=true;
                line.forEach((item)=>{
                    let point = item.point, color = item.color;
                    if(color!=null){
                        let c = rgbOrRgbaToArray(color);
                        oneLineColor.push(new BABYLON.Color4(c[0]/255,c[1]/255,c[2]/255,c[3]));
                    }
                    else{
                        isHaveColor = false;
                        isOneLineHaveColor = false;
                    }
                    oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                
                lines.push(oneLine);

                if(isOneLineHaveColor){
                    colors.push(oneLineColor);
                }
                else{
                    colors.push(undefined);
                }
                
            });

            iniOption.lines = lines;
            if(isHaveColor){
                iniOption.colors = colors;
            }
        }

        iniOption.useVertexAlpha = p.useVertexAlpha;
        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateLineSystem("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Ribbon"){
        if(p.pathArray && p.pathArray.length>0){
            let pathArray = [];
            p.pathArray.forEach((line)=>{
                let oneLine = [];
                line.forEach((item)=>{
                    let point = item.point;
                    oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                
                pathArray.push(oneLine);                    
            });

            iniOption.pathArray = pathArray;
        }

        iniOption.closeArray = p.closeArray;
        iniOption.closePath = p.closePath;
        iniOption.invertUV = p.invertUV;

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateRibbon("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="Tube"){
        if(p.path && p.path.length>0){
            let path = [];
            p.path.forEach((item)=>{
                let point = item.point;
                path.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });
            iniOption.path = path;
        }
        else{
            iniOption.path = [new BABYLON.Vector3(0,0,0), new BABYLON.Vector3(1,1,1)];
        }

        if(p.enableRadiusFunction){
            let pm = "window.msFunctionCache = function(i, distance){ "+ p.radiusFunction +" }";
            try{
                eval(pm);
                iniOption.radiusFunction = window.msFunctionCache;
             }
             catch(err){
                 console.error(err);
             }
        }
        else{
            iniOption.radius = p.radius;
        }

        iniOption.tessellation = p.tessellation;
        iniOption.arc = p.arc;
        iniOption.cap = p.cap;
        iniOption.invertUV = p.invertUV;

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateTube("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="ExtrudedShapes"){
        if(p.shape && p.shape.length>0){
            let shape = [];
            p.shape.forEach((item)=>{
                let point = item.point;
                shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });
            iniOption.shape = shape;
        }

        if(p.path && p.path.length>0){
            let path = [];
            p.path.forEach((item)=>{
                let point = item.point;
                path.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });
            iniOption.path = path;
        }



        iniOption.cap = p.cap;
        iniOption.ribbonCloseArray = p.closeArray;
        iniOption.ribbonClosePath = p.closePath;
        iniOption.invertUV = p.invertUV;

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        if(p.enableCustom){
            try{
                eval("window.msFunctionCache = function(i, distance){ "+ p.scaleFunction +" }");
                iniOption.scaleFunction = window.msFunctionCache;
                eval("window.msFunctionCache = function(i, distance){ "+ p.rotationFunction +" }");
                iniOption.rotationFunction = window.msFunctionCache;
            }
            catch(err){
                console.error(err);
            }

            meshHtml = `let ${mesh} = BABYLON.MeshBuilder.ExtrudeShapeCustom("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
        }
        else{
            iniOption.scale = p.extrudedShapesScale;
            iniOption.rotation = p.extrudedShapesRotation;

            meshHtml = `let ${mesh} = BABYLON.MeshBuilder.ExtrudeShape("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
        }

        
    }
    else if(p.type=="Lathe"){
        if(p.shape && p.shape.length>0){
            let shape = [];
            p.shape.forEach((item)=>{
                let point = item.point;
                shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });
            iniOption.shape = shape;
        }

        iniOption.radius = p.radius;
        iniOption.tessellation = p.tessellation;
        iniOption.arc = p.arc;
        iniOption.cap = p.cap;
        iniOption.invertUV = p.invertUV;

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreateLathe("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="NonRegularPolygon"){
        if(p.shape && p.shape.length>0){
            let shape = [];
            p.shape.forEach((item)=>{
                let point = item.point;
                shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });
            iniOption.shape = shape;
        }

        if(p.holes && p.holes.length>0){
            let holes = [];
            p.holes.forEach((line)=>{
                let oneLine = [];
                line.forEach((item)=>{
                    let point = item.point;
                    oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                
                holes.push(oneLine);                    
            });

            iniOption.holes = holes;
        }

        if(p.enableFrontBack){
            iniOption.frontUVs = p.frontUVs;
            iniOption.backUVs = p.backUVs;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.CreatePolygon("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="ExtrudedNonRegularPolygon"){
        if(p.shape && p.shape.length>0){
            let shape = [];
            p.shape.forEach((item)=>{
                let point = item.point;
                shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
            });
            iniOption.shape = shape;
        }

        if(p.holes && p.holes.length>0){
            let holes = [];
            p.holes.forEach((line)=>{
                let oneLine = [];
                line.forEach((item)=>{
                    let point = item.point;
                    oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                
                holes.push(oneLine);                    
            });

            iniOption.holes = holes;
        }

        iniOption.depth = p.depth;

        if(p.enableFace){
            iniOption.faceUV = p.faceUV;
            iniOption.faceColors = p.faceColors;
        }

        meshHtml = `let ${mesh} = BABYLON.MeshBuilder.ExtrudePolygon("${p.id}", ${JSON.stringify(iniOption)}, scene);`;
    }
    else if(p.type=="programMesh"){
        // let engine = scene.getEngine();
        // let pm = "window.msFunctionCache = function(scene, engine, canvas){ try{ "+ p.pro +"} catch(err){ console.error(err); } }";
        // eval(pm);
        // let pmAble = window.msFunctionCache;
        // pmAble(scene, engine, engine.getRenderingCanvas());
        // mesh = window.msProgramMeshCache;
        // mesh.id = p.id;
        // mesh.name = p.id;

        meshHtml = `
            function ${mesh}_program(scene, engine, canvas){ try{  ${p.pro} } catch(err){ console.error(err); } }
            let ${mesh} = ${mesh}_program(scene, engine, engine.getRenderingCanvas());
            mesh.id = ${p.id};
            mesh.name = ${p.id};
        `;
    }

    return meshHtml;
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


function generateCodeHTMLByValue(config, attr, param,defaultV){
    let html = "";
    if(defaultV instanceof Array){
        if(config[attr].length==3 && config[attr][0]!=defaultV[0] && config[attr][1]!=defaultV[1] && config[attr][2]!=defaultV[2]){
            html = `${param}.${attr} = new BABYLON.Vector3(${config[attr][0]},${config[attr][1]},${config[attr][2]});`;
        }
        else if(config[attr].length==4 && config[attr][0]!=defaultV[0] && config[attr][1]!=defaultV[1] && config[attr][2]!=defaultV[2] && config[attr][3]!=defaultV[3]){
            html = `${param}.${attr} = new BABYLON.Vector4(${config[attr][0]},${config[attr][1]},${config[attr][2]},${config[attr][3]});`;
        }
        if(config[attr].length==2 && config[attr][0]!=defaultV[0] && config[attr][1]!=defaultV[1]){
            html = `${param}.${attr} = new BABYLON.Vector2(${config[attr][0]},${config[attr][1]});`;
        }
    }
    else if(config[attr]!=null && config[attr]!=defaultV){
        if(isRealNum(config[attr]) || config[attr]===false || config[attr]===true){
            html = `${param}.${attr} = ${config[attr]};`;
        }
        else{
            html = `${param}.${attr} = "${config[attr]}";`;
        }
    }

    return html;
}

function generateCodeHTMLByColor(config, attr, param,defaultV, num){
    let html = "";

    if(num==4){
        if(config[attr]!=null && config[attr]!=defaultV){
            let c = rgbOrRgbaToArray(config[attr]);
            html = `${param}.${attr} = new BABYLON.Color4(${c[0]/255},${c[1]/255},${c[2]/255}, ${c[3]});`;
        }
    }
    else{
        if(config[attr]!=null && config[attr]!=defaultV){
            let c = rgbOrRgbaToArray(config[attr]);
            html = `${param}.${attr} = new BABYLON.Color3(${c[0]/255},${c[1]/255},${c[2]/255});`;
        }
    }

    return html;
}

function getImageType(source){
    //"data:image/png;base64,iVBORw0K
    if(!source || source.length==0){
        return "image/png";
    }

    let x = source.split(":");
    if(x.length>2){
        x = source.split(";");
        if(x.length>0){
            return x[0];
        }
    }

    return "image/png";
}

function convertSourceToUrl(source, type){
    if(source==null || source.length==0){
        return "";
    }

    if(type==null){
        type = "application/dds";
    }

    let typedArray = BABYLON.Tools.DecodeBase64(source);
    let blob = new Blob([typedArray], {type: type}); // 传入一个合适的MIME类型   
    let url = URL.createObjectURL(blob);   
    return url;
}


function createTextureAttribute(p, material, t, c, e, par, texturesIdList){
    let html = "";
    if(t && p[t]){
        html+=`${material}["${t}"] = texture${texturesIdList[p[t]]};`;
    }

    if(c && p[c]){
        html += generateCodeHTMLByColor(p, c, material, null);
        // this.setColor3Value(c, new BABYLON.Color3(1,1,1));
    }

    if(e && p[e]){
        var param = p[par];

        html+=`${material}[${par}] = new BABYLON.FresnelParameters();`;
        html+=`${material}[${par}].bias = ${param}.bias;`;
        html+=`${material}[${par}].power = ${param}.power;`;
        var cl = rgbOrRgbaToArray(param.leftColor);
        html+=`${material}[${par}].leftColor = new BABYLON.Color3(${cl[0]/255},${cl[1]/255},${cl[2]/255});`;
        var cr = rgbOrRgbaToArray(param.rightColor);
        html+=`${material}[${par}].rightColor = new BABYLON.Color3(${cr[0]/255},${cr[1]/255},${cr[2]/255});`;
    }

    return html;
}


export {
    getMeshById,
    getScreenSize,
    generateRandomKey,
    updateObjectView,
    addMaterialView,
    addTextureView,
    selectedMeshed,
    getBabylon,
    setBabylon,
    showLoadingScreen,
    hideLoadingScreen,
    addObjectView,
    goback,
    uploadImageCheck,
    upload3DFileTransfier,
    getAllObjNotes,
    animationAndSkeletonPlay,
    stopSceneAllAnimation,
    initialSceneAndGizmo,
    addParticleView,
    createAssistMash,
    getCurObject,
    deleteObjectView,
    serializeMs3df,
    downloadTextFile,
    getOptionByID,
    ms3dfParse,
    addProgramView,
    calCanvasSize,
    updateProgramView,
    deleteProgramView,
    createDirectionAuxLine,
    clearProgramNotes,
    initialLightAndCamera,
    skeletonAnimationPlay,
    skeletonAnimationStop,
    booleanCalculation,
    undoHandler,
    redoHandler,
    updateObjectViewHandler,
    addObjectViewHandler,
    deleteObjectViewHandler,
    deflateTextFile,
    inflateTextFile,
    getProgramMeshNotes,
    mergeMeshWithNew,
    createBatchTransform,
    checkHasGeo,
    clearAuxAndGizmo,
    programHTMLHandler,
    rgbOrRgbaToArray
}