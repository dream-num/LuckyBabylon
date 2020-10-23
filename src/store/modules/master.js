import { commonMutationsUpdate,getState } from '../../utils/storeUtil';
import { commonUpdate,commonGet } from '../mutations/mutation-types';
import { ms3dfKeyAddList } from '@/master/js/meshData';

export default {
    namespaced: true,
    state: {
        "id": "scene_asdf_12123",
        "name": "默认场景",

        "autoClear": true, //loop时是否自动清除boolean
        "clearColor": "rgb(0,0,0)", //color3
        "ambientColor": null,//场景光，如果mesh的material设置了ambientColor则接受这个颜色
        "gravity": [0,-9.807,0], //重力
        "environmentTexture": "", //环境纹理，所有pbr会使用到,CubeTexture、HDRCubeTexture、EquiRectangularCubeTexture、Texture
        "fogEnabled": false,  //雾效果
        "fogMode": 0,  //雾模式，0 BABYLON.Scene.FOGMODE_NONE 默认，1 BABYLON.Scene.FOGMODE_EXP 指数， 2 BABYLON.Scene.FOGMODE_EXP2 指数2，3 BABYLON.Scene.FOGMODE_LINEAR 线性
        "fogDensity": 0.01,  //雾密度，0-1，步长0.01
        "fogStart": 20,  //雾开始，0-100，步长1
        "fogEnd": 20,  //雾结束，0-100，步长1
        "fogColor": 'rgb(1,1,1)',  //雾颜色
        "enableBackground2D": false, //开启2d背景
        "background2D": "base64", //背景图base64
        "enableGlow": false,//开启全局辉光
        "glowIntensity": 1, //辉光亮度
        "mainTextureFixedSize": 1024, //主纹理体积
        "blurKernelSize": 32, //模糊核心体积
        "enableFilter":false, //开启滤镜
        "filter":{},//滤镜

        "screenRatio":[16, 9],

        "cameras": [],
        "lights": [],
        "textures": [],
        "materials": [],
        "geometries": {
            "vertexData":[],
        },
        "meshes": [],
        "spriteManagers": [],

        "particleSystems": [],
        "transformNodes": [],
        "instances":[],
        "gui2Ds":[],

        // "solidParticleSystems": [],

        // "pointCloudParticleSystems": [],
        
        "programs": [], //{name  id  type  pro}

        "skeletons": [], //骨骼动画
        "animationGroups": [],//动画组
        "multiMaterials": [], //多材质

        //辅助参数
        "curModelName": 'scene', //当前右侧模块名称
        "preModelName": '', //上一个右侧模块名称 
        "curCameraId": null,  //当前相机id
        "curLightId": null,  //当前灯光id
        "curMeshId": null, //当前物体id
        "curMaterialId": null, //当前材质id
        "curTextureId": null, //当前纹理id
        "curSpriteManagerId": null,  //当前精灵图id
        "curProgramId": null,  //当前程序id
        "curParticleId": null,  //当前粒子id
        "curSkeletonId": null,  //当前骨骼动画id
        "curMultiMaterialId":null, //当前复合材质id
        "curGui2DId":null,//当前交互控件id
        "masterLayerTime": null,//刷新左侧管理菜单
        "isFullscreen":true,//是否全屏
        "mouseDownHoldState":false,
        "batchOptionCache":null,

        "historyListCache":[],//历史记录
        "historyIndex":null,//历史记录指针
        
    },
    mutations: {
        [commonUpdate](state, param) {
            commonMutationsUpdate(state, param);
        },
        refreshMasterLayerTime(state){
            state.masterLayerTime = new Date();
        },
        updateBatchCommands(state, param){//批量更新操作，param为完整的file格式
            if(param==null){
                return;
            }

            let addData = param.addData, filter = param.filter;

            let addList = ms3dfKeyAddList;

            Object.keys(addData).forEach((mainType)=>{
                let updateObject = state[mainType];
                if(mainType=="geometries"){
                    if(addData[mainType] && addData[mainType].vertexData && addData[mainType].vertexData.length>0){
                        updateObject.vertexData = updateObject.vertexData.concat(addData[mainType].vertexData);
                    }
                }
                else if(mainType=="cameras"){
                    if(addData[mainType] && addData[mainType][0]){
                        // state[mainType][0] = addData[mainType][0];
                        Object.keys(state[mainType][0]).forEach((key)=>{
                            state[mainType][0][key] = addData[mainType][0][key];
                        });
                    }
                }
                else if(mainType in addList && addData[mainType]){
                    if(addData[mainType] && addData[mainType].length>0){
                        state[mainType] = updateObject.concat(addData[mainType]);
                    }
                }
                else {
                    if(addData[mainType]!==undefined){
                        state[mainType] = addData[mainType];
                    }
                }
            });
        },
        updateCommands(state, param) {
            //param:{key:"key1.key2.${index}.key3", value:"bug"}

            let key = param.key, value = param.value;
            if(key==null || key.length==0){
                return;
            }

            var keyList = key.split(".");
            var lastKey = keyList[keyList.length-1];
            keyList.pop();
            if(keyList.length>0){  
                var curObj = null;
                keyList.forEach((item, i)=>{
                    if(curObj==null){
                        curObj = state;
                    }
                    if(item.indexOf("$")>-1){
                        let r = parseInt(item.replace('${', '').replace('}', ''));
                        curObj = curObj[r];
                    }
                    else{
                        curObj = curObj[item];
                    }
                });

                curObj[lastKey] = value;
            }
            else{
                state[lastKey] = value;
            }

        },
        insertCommands(state, param) {

            let key = param.key, value = param.value;
            if(key==null || key.length==0){
                return;
            }

            var keyList = key.split(".");
            var lastKey = keyList[keyList.length-1];
            keyList.pop();
            if(keyList.length>0){  
                var curObj = null;
                keyList.forEach((item, i)=>{
                    if(curObj==null){
                        curObj = state;
                    }
                    if(item.indexOf("$")>-1){
                        let r = parseInt(item.replace('${', '').replace('}', ''));
                        curObj = curObj[r];
                    }
                    else{
                        curObj = curObj[item];
                    }
                });

                if(curObj[lastKey] instanceof Array){
                    curObj[lastKey].push(value);
                }
                else{
                    curObj[lastKey] = value;
                }
                
            }
            else{
                if(state[lastKey] instanceof Array){
                    state[lastKey].push(value);
                }
                else{
                    state[lastKey] = value;
                }
            }
        },
        deleteCommands(state, param) {
            let key = param.key, value = param.value, deleLen = param.deleLen;

            if(deleLen==null){
                deleLen = 1;
            }

            if(key==null || key.length==0){
                return;
            }
            
            var keyList = key.split(".");
            var lastKey = keyList[keyList.length-1];
            keyList.pop();
            if(keyList.length>0){  
                var curObj = null;
                keyList.forEach((item, i)=>{
                    if(curObj==null){
                        curObj = state;
                    }
                    if(item.indexOf("$")>-1){
                        let r = parseInt(item.replace('${', '').replace('}', ''));
                        curObj = curObj[r];
                    }
                    else{
                        curObj = curObj[item];
                    }
                });

                if(lastKey.indexOf("$")>-1){
                    let r = parseInt(lastKey.replace('${', '').replace('}', ''));
                    curObj.splice(r, deleLen);
                }
                else{
                    delete curObj[lastKey];
                }
                
            }
            else{
                if(lastKey.indexOf("$")>-1){
                    let r = parseInt(lastKey.replace('${', '').replace('}', ''));
                    state.splice(r, deleLen);
                }
                else{
                    delete state[lastKey];
                }
                
            }
        },
        deleteItem(state, param){
            let key = param.key, id = param.id, deleteIndex;
            for(let i=0;i<state[key].length;i++){
                let item = state[key][i];
                if(item.id==id){
                    deleteIndex = i;
                    break;
                }
            }

            if(deleteIndex!=null){
                state[key].splice(deleteIndex, 1);
            }
        },
        changeCurId(state, param){
            let { key, value } = param;
            state[key] = value; 
        },
        changeCurModelName(state, param){
            state['preModelName'] = state['curModelName'];
            state['curModelName'] = param;
        },
    },
    action:{

    },
    getters: {
        [commonGet]:(state) => (param) => {
            //TODO:param可以写一个正则校验
            if(!param){
                throw '不能传空参数';
            }
            return getState(state,param)
        },
        getObjectByID: (state) => (param) => {
            //param:{type:"", id:""}


            // "cameras":[],
            // "lights":[],
            // "textures":[],
            // "materials":[],
            // "geometries":{
            //     "vertexData":[],
            // },
            // "meshes":[],
            // "sprite":[],
            // "particleSystems": [],
            // "solidParticleSystems": [],
            // "pointCloudParticleSystems": [],

            let type = param.type, id = param.id;

            var o = state[type];

            for(var i=0;i<o.length;i++){
                var item = o[i];
                if(item.id==id){
                    return item;
                }   
            }

            return null;

        }
    },
}