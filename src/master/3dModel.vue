<template>
    <div class="contain">
        <div id="loadingScreen">
            <div>正在加载请稍后...</div> 
        </div>
        <div id="app">
            <div class="msPannel">
                <managerPannel ref="managerPannel" @handleOpenDownLoad="handleOpenDownLoad" @handleOpenUpLoad="handleOpenUpLoad"></managerPannel>
            </div>
            <div class="msleft">
                <div class="msleftc">
                    <!-- <div class="msWSlider topslider1"></div>
                    <div class="msWSlider topslider2"></div>

                    <div class="msHSlider leftslider1"></div>
                    <div class="msHSlider leftslider2"></div>

                    <div class="msWSlider bottomslider1"></div>
                    <div class="msWSlider bottomslider2"></div>

                    <div class="msHSlider rightslider1"></div>
                    <div class="msHSlider rightslider2"></div> -->

                    <el-select v-model="demoSelected" placeholder="请选择" style="position: absolute;z-index: 888;">
                        <el-option
                        v-for="item in demoList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>

                    <div class="msButtonSet">
<!--                         <el-upload style="position: absolute;left: -60px;"
                            class="upload-demo"
                            action=""
                            :on-error="handleBackgroundSuccess"
                            :before-upload="beforeBackgroundUpload"
                            >
                            <el-button size="mini" type="danger" style="padding-left:5px;padding-right:5px;">更换背景</el-button>
                        </el-upload>
                        <el-button plain @click="showBackground" size="mini">显示背景</el-button>
                        <el-button style="margin-right: 10px;margin-left: 0px;" plain @click="hideBackground" size="mini">隐藏背景</el-button> -->

                        <el-button plain @click="hidePlaneGizmo" size="mini">简化控制</el-button>
                        
                        <el-button plain @click="undo" size="mini">撤销</el-button>
                        <el-button plain @click="redo" size="mini">重做</el-button>

                        <el-radio-group v-model="showSceneMesh" size="mini">
                            <el-radio-button :label="$t('button.showAssist')"></el-radio-button>
                            <el-radio-button :label="$t('button.hideAssist')"></el-radio-button>
                        </el-radio-group>
                        <el-button plain @click="restoreCamera" size="mini" :disabled="copyState">初始视角</el-button>
                        <!-- <el-radio-group v-model="cameraEditMode" size="mini">
                            <el-radio-button label="常规"></el-radio-button>
                            <el-radio-button label="跟随"></el-radio-button>
                        </el-radio-group> -->
                        <el-button plain @click="captureGif" size="mini" :disabled="copyState">截gif图</el-button>
                        <el-radio-group v-model="showCaptureAux" size="mini">
                        <el-radio-button label="显示截图"></el-radio-button>
                        <el-radio-button label="隐藏截图"></el-radio-button>
                        </el-radio-group>
                    </div>

                    <div class="canvasdiv" id="canvasdiv">
                        <div id="box" :hidden="showCaptureAux=='隐藏截图'">
                            <div id="coor"></div>
                        </div>
                        <canvas id="renderCanvas"></canvas>
                        <canvas id="renderCanvasCopy"></canvas>
                    </div>
                </div>
            </div>

            <div class="msright">
                <particleSetting 
                    v-if="curModelName=='particle'"
                    ref="particle"
                >
                </particleSetting>
                <sceneSetting @resizeCanvas="resizeCanvas" v-else-if="curModelName=='scene'"></sceneSetting>
                <cameraSetting v-else-if="curModelName=='camera'"></cameraSetting>
                <lightSetting v-else-if="curModelName=='light'"></lightSetting>
                <meshSetting v-else-if="curModelName=='mesh'"></meshSetting>
                <materialSetting v-else-if="curModelName=='material'"></materialSetting>
                <textureSetting v-else-if="curModelName=='texture'"></textureSetting>
                <spriteManagerSetting v-else-if="curModelName=='spriteManager'"></spriteManagerSetting>
                <programSetting v-else-if="curModelName=='program'"></programSetting>
                <skeletonSetting v-else-if="curModelName=='skeleton'"></skeletonSetting>
                <multiMaterialSetting v-else-if="curModelName=='multiMaterial'"></multiMaterialSetting>
                <gui2DSetting v-else-if="curModelName=='gui2D'"></gui2DSetting>
            </div>
        </div>

        <el-dialog title="下载文件选项" :visible.sync="openDownLoad">
            <el-row>
                <el-col :span="24">
                    <el-row>
                        <el-col :span="8" style="text-align:right;">
                            名称：
                        </el-col>
                        <el-col :span="16">
                            <el-input v-model="downLoadName" placeholder="请输入内容"></el-input>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px;border-bottom:1px solid #DCDFE6" v-for="item in downloadList" :key="item.model">
                        <el-col :span="8" style="text-align:right;">
                            {{downLoadListMap[item.model]}}：
                        </el-col>
                        <el-col :span="16">
                            <el-checkbox 
                                :indeterminate="item.indeterminate" 
                                v-model="item.checkAll" 
                                @change="handleCheckAllChange(item)"
                            >
                                {{item.model=='scene'?'场景信息':(item.model=='environment'?'环境光':'全选')}}
                            </el-checkbox>

                            <div style="margin: 5px 0;"></div>

                            <el-checkbox-group v-if="item.objects && item.objects.length>0" v-model="item.selected" @change="handleChecked3DfChange(item)">
                                <el-checkbox 
                                    v-for="object in item.objects" 
                                    :label="object.id" 
                                    :key="object.id"
                                >
                                    {{object.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="downloadProgram">导出为Babylon代码</el-button>
                <el-button @click="openDownLoad = false">取 消</el-button>
                <el-button type="primary" @click="downloadConfig">导出配置文件</el-button>
            </div>
        </el-dialog>

        <el-dialog title="上传文件选项" :visible.sync="openUpLoad">
            <el-row>
                <el-col :span="24">
                    <!-- <el-row>
                        <el-col :span="8" style="text-align:right;">
                            名称：
                        </el-col>
                        <el-col :span="16">
                            <el-input v-model="downLoadName" placeholder="请输入内容"></el-input>
                        </el-col>
                    </el-row> -->
                    <el-row style="margin-top:10px;border-bottom:1px solid #DCDFE6" v-for="item in uploadList" :key="item.model">
                        <el-col :span="8" style="text-align:right;">
                            {{downLoadListMap[item.model]}}：
                        </el-col>
                        <el-col :span="16">
                            <el-checkbox 
                                :indeterminate="item.indeterminate" 
                                v-model="item.checkAll" 
                                @change="handleCheckAllChange(item)"
                            >
                                {{item.model=='scene'?'场景信息':(item.model=='environment'?'环境光':'全选')}}
                            </el-checkbox>

                            <div style="margin: 5px 0;"></div>

                            <el-checkbox-group v-if="item.objects && item.objects.length>0" v-model="item.selected" @change="handleChecked3DfChange(item)">
                                <el-checkbox 
                                    v-for="object in item.objects" 
                                    :label="object.id" 
                                    :key="object.id"
                                >
                                    {{object.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openUpLoad = false">取 消</el-button>
                <el-button type="primary" @click="uploadloadConfig">上 传</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import $ from 'jquery';
    import * as BABYLON from '@babylonjs/core/Legacy/legacy';
    import "@babylonjs/loaders/OBJ";
    import "@babylonjs/loaders/STL";
    import "@babylonjs/loaders/glTF";
    import "@babylonjs/procedural-textures/legacy/legacy"; //注意legacy为小写,否则linux打包会报错
    import "@babylonjs/materials/legacy/legacy";
    import "@babylonjs/gui/legacy/legacy";
    import { MToonMaterial } from 'babylon-mtoon-material';
    import * as MyEarcut from "earcut";
    import * as GIF from '@/assets/gifjs/gif';
    import '@/canvas/particle3D';

    // import { createGizmoManager } from '@/canvas/common3D';

    import particleSetting from '@/master/particleSetting';

    import managerPannel from '@/master/model/managerPannel';
    import sceneSetting from '@/master/sceneSetting';
    import cameraSetting from '@/master/cameraSetting';
    import lightSetting from '@/master/lightSetting';
    import meshSetting from '@/master/meshSetting';
    import materialSetting from '@/master/materialSetting';
    import textureSetting from '@/master/textureSetting';
    import spriteManagerSetting from '@/master/spriteManagerSetting';
    import programSetting from '@/master/programSetting';
    import skeletonSetting from '@/master/skeletonSetting';
    import multiMaterialSetting from '@/master/multiMaterialSetting';
    import gui2DSetting from '@/master/gui2DSetting';

    import { getState } from '@/canvas/common';

    import { getBabylon,hideLoadingScreen,showLoadingScreen,setBabylon, upload3DFileTransfier, initialSceneAndGizmo, selectedMeshed,getCurObject,ms3dfParse,calCanvasSize,initialLightAndCamera,createAssistMash, undoHandler, redoHandler, serializeMs3df, downloadTextFile, deflateTextFile, inflateTextFile, clearAuxAndGizmo,programHTMLHandler} from '@/master/js/methods';

    import { Compiler, Font } from '@/canvas/babylon.font.mjs';
    import { fontPath } from '@/data/resourcePath';

    import { 
        getMeshById, 
        getScreenSize, 
    } from './js/methods';
import { get } from 'http';

    let fontWasmUrl = "/compiler.wasm";
    let fontDefaultUrl = "/方正正准黑简体.TTF";
    // let fontDefaultUrl = fontPath['SourceHanSans-Normal'];

    export default {
        data: () => ({
            message: 'Hello Vue!',
            copyState: false,
            gizmo: null,
            particleSystemSet: [],
            curParticleId: "",
            showSceneMesh: "显示辅助",
            showCaptureAux: "隐藏截图",
            cameraWheelTimeout:null,
            // cameraEditMode:"常规",

            openDownLoad: false,
            downLoadName: "默认文件",
            downloadList:[],

            openUpLoad: false,
            upLoadName: "默认文件",
            uploadList:[],
            uploadFile:null,

            checkedDownload3Df: [],
            // isDownload3DfIndeterminate: true,
            // checkDownload3DfAll: false,
            
            checkedUpload3Df: [],
            // isUpload3DfIndeterminate: true,
            // checkUpload3DfAll: false,
            upload3Dfs: [],
            downLoadListMap:{
                "cameras":"相机",
                "meshes":"物体",
                "instances":"实例",
                "transformNodes":"虚拟节点",
                "lights":"灯光",
                "materials":"材质",
                "multiMaterials":"复合材质",
                "spriteManagers":"精灵",
                "particleSystems":"粒子",
                "programs":"程序",
                "scene":"场景",
                "environment":"环境光",
                "gui2Ds":"交互控件"
            },
            demoSelected:"选择在线DEMO",
            demoList:[
                {
                    value:"",
                    label:"选择在线DEMO",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/宇宙飞船.json",
                    label:"宇宙飞船",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/鲨鱼.json",
                    label:"鲨鱼",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/迎接2020.json",
                    label:"迎接2020",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/高山流水.json",
                    label:"高山流水",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/音乐地球.json",
                    label:"音乐地球",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/梦数小镇.json",
                    label:"小镇",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/粒子地球.json",
                    label:"粒子地球",
                },
                {
                    value:"https://minio.cnbabylon.com/public/LuckyBabylon/demo/银河系.json",
                    label:"银河系",
                }
            ]
        }),
        components: {
            particleSetting,
            managerPannel,
            sceneSetting,
            cameraSetting,
            lightSetting,
            meshSetting,
            materialSetting,
            textureSetting,
            spriteManagerSetting,
            programSetting,
            skeletonSetting,
            multiMaterialSetting,
            gui2DSetting
        },
        mounted(){
            var _this = this;
            this.canvas = document.getElementById("renderCanvas");
            this.resizeCanvas();
            
            var engine = new BABYLON.Engine(this.canvas, true,{ stencil: true });
            // var scene = new BABYLON.Scene(engine);
            // scene.clearColor = new BABYLON.Color3(0, 0, 0);
            let exeClass = new particle3D.ini(engine, Font);
            window.MToonMaterial = MToonMaterial;
            let scene = initialSceneAndGizmo(engine, exeClass, this);

            // initialLightAndCamera(scene, exeClass);
            // var camera = new BABYLON.ArcRotateCamera("camera_default", Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);
            // camera.attachControl(_this.canvas, true);


            // var gizmo = createGizmoManager(scene);

            // let utilLayer = new BABYLON.UtilityLayerRenderer(scene);
            // _this.utilLayer = utilLayer;

            // this.canvas.babylon = {
            //     engine: engine,
            //     scene: scene,
            //     camera: scene.activeCamera,
            //     particle3D: exeClass,
            //     gizmo:gizmo,
            //     utilLayer:utilLayer,
            //     curUpdateObject:[],
            //     assistObject:[],
            //     assistGizmo:[],
            // }


            this.initialFileDropHaddler();


            var canvasCopy = document.getElementById("renderCanvasCopy");
            canvasCopy.width = 200;
            canvasCopy.height = 120;
            _this.canvasCopy = canvasCopy;


            // setTimeout(()=>{
            //     var assetsManager = new BABYLON.AssetsManager(scene);
            //     let ms3dftask = assetsManager.addTextFileTask("ms3dftask", "static/source/model/梦数小镇77.ms3df");
            //     ms3dftask.onSuccess = function(task) {
            //         var ms3df = task.text;                
            //         let addData = inflateTextFile(ms3df);
            //         addData = JSON.parse(addData);
            //         let config = serializeMs3df(null, addData);
            //         ms3dfParse(config, true, false);
            //     }

            //     assetsManager.load();

            // },2000);



            // BABYLON.ParticleHelper.BaseAssetsUrl = "source/3Dparticle";
            // BABYLON.Constants.PARTICLES_BaseAssetsUrl = "source/3Dparticle";


            
            // document.addEventListener("pointerup", function(){
            //     // _this.moveGuideline = false;
            //     // posGizmoLayer.removeMesh(posGizmoLayer.getMeshByName("msGuideLines"));
            //     // boxGizmoLayer.removeMesh(boxGizmoLayer.getMeshByName("msGuideLines"));
            // }, false);

            $(document).mousemove(function(e) {
                if (this.move) {
                    var posix = !document.move_target ? {'x': 0, 'y': 0} : document.move_target.posix,
                        callback = document.call_down || function() {
                            $(this.move_target).css({
                                'top': e.pageY - posix.y,
                                'left': e.pageX - posix.x
                            });
                        };

                    callback.call(this, e, posix);
                }
            }).mouseup(function(e) {
                if (this.move) {
                    var callback = document.call_up || function(){};
                    callback.call(this, e);
                    $.extend(this, {
                        'move': false,
                        'move_target': null,
                        'call_down': false,
                        'call_up': false
                    });
                }
            });

            var $box = $('#box').mousedown(function(e) {
                var offset = $(this).offset();
                
                this.posix = {'x': e.pageX - offset.left, 'y': e.pageY - offset.top};
                $.extend(document, {'move': true, 'move_target': this});
            }).on('mousedown', '#coor', function(e) {
                var posix = {
                        'w': $box.width(), 
                        'h': $box.height(), 
                        'x': e.pageX, 
                        'y': e.pageY
                    };
                
                $.extend(document, {'move': true, 'call_down': function(e) {
                    var w = Math.max(30, e.pageX - posix.x + posix.w);
                    var h = 0.6*w;

                    $box.css({
                        'width': w,
                        'height': h
                    });
                }});
                return false;
            });

            engine.runRenderLoop(function(){
                // if(window.ms3dfProgramInnerLoop){
                //      window.ms3dfProgramInnerLoop(scene);
                // }
                if(scene.isDisposed){
                    scene = _this.canvas.babylon.scene;
                }
                scene.render();
                if(_this.copyState){
                    var context = _this.canvasCopy.getContext("2d");
                    var pos = $("#box").position();
                    var left = pos.left, top = pos.top;
                    var w = $("#box").width(), h = $("#box").height();
                    context.drawImage(_this.canvas, left, top, w, h, 0, 0 , _this.canvasCopy.width, _this.canvasCopy.height);
                }
            });

            window.addEventListener('resize', function(){
                _this.resizeCanvas();
                engine.resize();
                for(var i = 0; i < _this.particleSystemSet.length;i++){
                    var ps = _this.particleSystemSet[i];
                    ps.screenSize = getScreenSize();
                }
            });

            window.onbeforeunload = function (e) {
                e = e || window.event;
                // 兼容IE8和Firefox 4之前的版本
                if (e) {
                    e.returnValue = '确认离开?';
                }
                // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                return '确认离开?';
            }
 
            $("#canvasdiv").keydown((e)=>{
                if (e.ctrlKey) {
                    if (e.keyCode == 90) {
                        this.undo();
                    } 
                    else if (e.keyCode == 89) {
                        this.redo();
                    } 
                    // else if (e.keyCode === 67) {  //ctrl + c  复制
                    //     console.log('crtl+c')
                    //     dispatchOpreate('copy')
                    // } 
                    // else if (e.keyCode === 88) {  //ctrl + x  剪切
                    //     dispatchOpreate('cut')
                    // } 
                    // else if (e.keyCode === 86) {  //ctrl + v  粘贴
                    //     dispatchOpreate('paste')
                    // }
                }

                e.preventDefault();
                e.stopPropagation();
            }).attr("tabindex", 0).focus();

            setTimeout(() => {
                (async function main() {
                    const compiler = await Compiler.Build(fontWasmUrl);
                    const font = await Font.Install(fontDefaultUrl, compiler);
                    _this.canvas.babylon.compiler = compiler;
                    _this.canvas.babylon.font= font;
                    // document.getElementById("loadingScreen").style.display = "none";
                    hideLoadingScreen();
                })();
            }, 200);
        },
        watch: {
            // cameraEditMode(newV, oldV){
            //     let scene = this.canvas.babylon.scene;

            //     if(newV=="常规"){
            //         this.$store.commit('master/updateCommands', {
            //             key: 'curCameraEditMode',
            //             value: "default"
            //         });
            //     }
            //     else{
            //         this.$store.commit('master/updateCommands', {
            //             key: 'curCameraEditMode',
            //             value: "direction"
            //         });
            //     }
            // },
            showSceneMesh(newV, oldV){
                let scene = this.canvas.babylon.scene;
                let aux = [scene.getMeshByID("msAuxPlane"),scene.getMeshByID("sphereDirection1"),scene.getMeshByID("sphereDirection2")];
                //sphereDirection1 sphereDirection2
                if(newV==this.$t("button.showAssist")){
                    // m.visibility = 1;
                    // let m = scene.getMeshById("msAuxPlane");

                    scene.meshes.forEach((m)=>{
                        if(m.id == "msAuxPlane" || m.id.indexOf("particle")>-1 || m.id.indexOf("light")>-1){
                            m.visibility = 1;
                        }
                    });

                    scene.lights.forEach(m=>{
                        createAssistMash({id:m.id,mainType:"light"});
                    });
                }
                else{
                    // m.visibility = 0;
                    scene.meshes.forEach((m)=>{
                        if(m.id == "msAuxPlane" || m.id.indexOf("particle")>-1 || m.id.indexOf("light")>-1){
                            m.visibility = 0;
                        }
                    });

                    scene.lights.forEach(m=>{
                        if(m.lightGizmo){
                            if(m.lightGizmo.attachedMesh){
                                m.lightGizmo.attachedMesh.dispose();
                            }
                            m.lightGizmo.dispose();
                        }
                    });

                }
            },
            demoSelected(newV, oldV){
                if(newV=="" || newV==oldV){
                    return;
                }
                showLoadingScreen("正在加载远程资源，文件较大(预计20MB)，请耐心等待！");
                 $.getJSON(newV,function(result){
                    ms3dfParse(result, true, false);
                    hideLoadingScreen();
                });
            }
        },
        computed: {
            curModelName(){//当前模块名称
                return getState('master', 'curModelName');
            },
            reversedMessage(){
              return this.message.split('').reverse().join('');
            },
            // showSceneMesh(){
            //   return this.$t("button.showAssist")
            // }
        },
        methods: {
            hidePlaneGizmo(){
                let b = getBabylon();
                b.gizmo.gizmos.positionGizmo.planarGizmoEnabled = !b.gizmo.gizmos.positionGizmo.planarGizmoEnabled;
            },
            undo(){//撤销
                undoHandler(this);
            },
            redo(){//重做
                redoHandler(this);
            },
            resizeCanvas(){
                let canvasdiv = $("#canvasdiv"), cw = canvasdiv.width(), ch = canvasdiv.height();
                let isFullsreen = getState("master", "isFullscreen");
                if(isFullsreen){
                    this.canvas.width = cw;
                    this.canvas.height = ch;
                }
                else{
                    let ratio = getState("master", "screenRatio");  
                    let newWH = calCanvasSize(cw, ch, ratio[0], ratio[1]);
                    this.canvas.width = newWH.w;
                    this.canvas.height = newWH.h;
                }
                let b = getBabylon();
                if(b){
                    if(b.scene){
                        b.scene.getEngine().resize();
                    }
                }
            },
            initialFileDropHaddler(){
                
                let _this = this;
                let dropZone = document.getElementById("app");

                dropZone.addEventListener("dragenter", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
                 
                dropZone.addEventListener("dragover", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
                 
                dropZone.addEventListener("dragleave", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
                 
                dropZone.addEventListener("drop", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var fileList = e.dataTransfer.files; //获取文件对象 
                    //检测是否是拖拽文件到页面的操作 
                    if(fileList.length == 0){ 
                        return false; 
                    } 

                    _this.AddFiles(fileList);
                },false);
            },
            async AddFiles(fileList){
                let b = getBabylon();
                let _this = this;
                showLoadingScreen("正在加载资源，请稍后！");
                for(let i=0;i<fileList.length;i++){
                    let file = fileList[i];
                    let extention = file.name.split(".")[1].toLowerCase();
                    let url = window.URL.createObjectURL(file);
                    console.log(file, url, extention);
                    if(extention=="otf" || extention=="ttf"){
                        const font = await Font.Install(url, b.compiler);
                        setBabylon("font", font);
                        this.$message({
                          message: '加载"'+ file.name +'"字体成功',
                          type: 'success'
                        });
                    }
                    else if(extention=="json"){
                        await new Promise((resolve)=>{
                            let a = new FileReader();
                            a.onload = function (e) { 
                                var json = e.target.result;
                                // ms3dfParse(json, true, true);
                                let addData = inflateTextFile(json);
                                // addData = JSON.parse(addData);
                                _this.handleOpenUpLoad(addData);
                                resolve("成功");
                            }
                            a.readAsText(file);
                        });
                    }
                    else if(extention in { "babylon":1, "obj":1, "stl":1, "gltf":1, "glb":1}){

                        await new Promise((resolve)=>{
                            BABYLON.SceneLoader.LoadAssetContainer("", url, b.scene,  (container)=>{
                                // do something with the meshes and skeletons
                                // particleSystems are always null for glTF assets

                                // meshes.forEach((mesh)=>{
                                //     var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(mesh);
                                //     console.log(serializedMesh);

                                // });

                                // if(skeletons && skeletons[0]){
                                //     b.scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);
                                // }

                                // container.addAllToScene();

                                // if(container.cameras.length==0){
                                //     container.cameras.push(b.camera);
                                // }

                                upload3DFileTransfier(container);



                                console.log(container);


                                container.dispose();
                                

                                this.$message({
                                  message: '加载"'+ file.name +'"模型成功',
                                  type: 'success'
                                });

                                resolve("成功");

                            }, undefined, undefined, "."+extention);
                        });
                    }
                    else{
                        this.$message({
                          message: '不支持"'+ extention +'"类型文件',
                          type: 'error'
                        });
                    }

                }

                hideLoadingScreen();
            },
            captureGif(){
                var _this = this;
                var gif = new GIF({
                    workerScript: '../../../../gif.worker.js',
                    workers: 2,
                    quality: 10,
                    background:"#000",
                    width:_this.canvasCopy.width,
                    height:_this.canvasCopy.height,
                });

                // this.camera.alpha = -Math.PI/4;
                // this.camera.beta = Math.PI*3/8;
                // this.camera.radius = 30;

                clearAuxAndGizmo();

                let scene = this.canvas.babylon.scene;
                scene.meshes.forEach((m)=>{
                    m.visibility = 0;
                });


                var captureAuxHide = false;
                if(_this.showCaptureAux == "隐藏截图"){
                    _this.showCaptureAux = "显示截图";
                    captureAuxHide = true;
                }
                
                let camera = this.canvas.babylon.camera;
                var a = camera.alpha, b = camera.beta, r = camera.radius;
                
                this.restoreCamera();

                _this.hideBackground();

                _this.copyState = true;
                // _this.effectRange.visibility = 0;
                // _this.linesystem.visibility = 0;

                // or a canvas element
                for(var i=0;i<60;i++){
                    gif.addFrame(_this.canvasCopy, {delay:50});
                }
                
                gif.on('finished', function(blob) {
                    window.open(URL.createObjectURL(blob));
                    _this.copyState = false;
                    scene.meshes.forEach((m)=>{
                        m.visibility = 1;
                    });
                    camera.alpha = a;
                    camera.beta = b;
                    camera.radius = r;
                    var mesh = getMeshById(_this.curParticleId);
                    // _this.createGizmo(mesh);
                    _this.showBackground();
                    if(captureAuxHide){
                        _this.showCaptureAux = "隐藏截图";
                    }
                    //   _this.effectRange.visibility = 1;
                    //   _this.linesystem.visibility = 1;
                    console.log("截图成功");
                    // gif.dispose();
                });

                gif.render();
            },
            // changeEmitter(){
            //     let curPs = document.getElementById('renderCanvas').babylon.curPs;

            //     var mesh = getMeshById(curPs.id);
            //     var newV = curPs.emitter;
            //     mesh.position.x = newV[0];
            //     mesh.position.y = newV[1];
            //     mesh.position.z = newV[2];

            //     this.createDirectionAuxLine();
            //     this.$refs.particle.refreshPaticle();
            // },
            formatTooltip(format, unit) {
				return function(val){
					return val/format + unit;
				};
            },
            restoreCamera(){
                let scene = document.getElementById('renderCanvas').babylon.scene;
                let camera = scene.activeCamera;
                let className = camera.getClassName();
                if(className=="ArcRotateCamera"){
                    camera.alpha = -0.375*Math.PI;
                    camera.beta = 0.375*Math.PI;
                    camera.radius = 30; 
                    camera.setTarget(new BABYLON.Vector3(0,0,0));

                    this.$store.commit('master/updateCommands', {
                        key: 'cameras.${0}.alpha',
                        value: camera.alpha
                    });
                    this.$store.commit('master/updateCommands', {
                        key: 'cameras.${0}.beta',
                        value: camera.beta
                    });
                    this.$store.commit('master/updateCommands', {
                        key: 'cameras.${0}.radius',
                        value: camera.radius
                    });
                    this.$store.commit('master/updateCommands', {
                        key: 'cameras.${0}.target',
                        value: [0,0,0]
                    });
                }
                else{
                    this.$message({
                        message: '暂时只支持旋转相机',
                        type: 'warning'
                    });
                }

            },
            hideBackground(){
                if(this.backgroundLayer!=null){
                    this.backgroundLayer.dispose();
                }
            },
            showBackground(){
                var _this = this;
                if(_this.background64==null || _this.background64.length==0){
                    return;
                }

                _this.hideBackground();
                _this.backgroundLayer = new BABYLON.Layer('background', _this.background64, _this.canvas.babylon.scene, true);
            },
            handleBackgroundSuccess(error ,file, fileList) {
                var _this = this;
                let a = new FileReader();
                a.onload = function (e) { 
                    _this.hideBackground();
                    _this.background64 = e.target.result;
                    _this.showBackground();
                    // _this.backgroundLayer = new BABYLON.Layer('background', _this.background64, _this.scene, true);
                }
                a.readAsDataURL(file.raw);
            },
            beforeBackgroundUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 30;

                // if (!isJPG && !isPNG) {
                //   this.$message.error('上传图片只能是 JPG,png 格式!');
                // }
                if (!isLt2M) {
                  this.$message.error('上传图片大小不能超过 30MB!');
                }
                // return (isJPG || isPNG) && isLt2M;
                return isLt2M;
            },
            // createGizmoManager(scene, attach){
            //     var gizmoManager = new BABYLON.GizmoManager(scene);
            //     // gizmoManager.boundingBoxGizmoEnabled = true;
            //     // gizmoManager.positionGizmoEnabled = true;
            //     gizmoManager.clearGizmoOnEmptyPointerEvent = true;
            //     gizmoManager.planarGizmoEnabled = true;
            //     // Restrict gizmos to only spheres
            //     gizmoManager.attachableMeshes = [];
            //     return gizmoManager;
            // },
            initialSceneEvent:function(scene){
                var _this = this;
                scene.onPointerObservable.add((pointerInfo) => {
                    var pickInfo = pointerInfo.pickInfo, event = pointerInfo.event;
                    //console.log(pickInfo);
                    switch (pointerInfo.type) {
                        case BABYLON.PointerEventTypes.POINTERDOWN:
                            if(pickInfo.pickedMesh){
                                _this.moveGuideline = true;
                            }
                            break;
                        case BABYLON.PointerEventTypes.POINTERUP:
                            //_this.guidelineCacheMesh = null;
                            _this.moveGuideline = false;
                            break;
                        case BABYLON.PointerEventTypes.POINTERMOVE:
                            if(_this.guidelineCacheMesh && _this.moveGuideline){
                                scene.removeMesh(scene.getMeshByName("msGuideLines"));
                                var meshCenterVector = _this.guidelineCacheMesh.getBoundingInfo().boundingBox.centerWorld;
                                var myLines = [];
                                myLines.push([
                                    new BABYLON.Vector3(meshCenterVector.x-1000, meshCenterVector.y, meshCenterVector.z),
                                    new BABYLON.Vector3(meshCenterVector.x+1000, meshCenterVector.y, meshCenterVector.z),
                                ]);
                                myLines.push([
                                    new BABYLON.Vector3(meshCenterVector.x, meshCenterVector.y-1000, meshCenterVector.z),
                                    new BABYLON.Vector3(meshCenterVector.x, meshCenterVector.y+1000, meshCenterVector.z),
                                ]);
                                myLines.push([
                                    new BABYLON.Vector3(meshCenterVector.x, meshCenterVector.y, meshCenterVector.z-1000),
                                    new BABYLON.Vector3(meshCenterVector.x, meshCenterVector.y, meshCenterVector.z+1000),
                                ]);
                                var linesystem = BABYLON.MeshBuilder.CreateLineSystem("msGuideLines", {lines: myLines, updatable: false}, scene); 
                                linesystem.color = new BABYLON.Color3(1, 1, 1);
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
            },
            handleOpenDownLoad(){
                // var all = [];
                // this.isDownload3DfIndeterminate = false;
                // this.particleSystemSet.forEach((item)=>{
                //     all.push(item.id);
                // });

                let downloadModelList = ["cameras","meshes","transformNodes","instances","lights","materials","multiMaterials","spriteManagers","particleSystems","programs","gui2Ds"];

                this.downloadList = [
                    {
                        model:"scene",
                        objects:null,
                        selected:null,
                        checkAll:false,
                        indeterminate:false,
                    }, 
                    {
                        model:"environment",
                        objects:null,
                        selected:null,
                        checkAll:true,
                        indeterminate:false,
                    }, 
                ];

                downloadModelList.forEach((func)=>{
                    let obj = {
                        model:func,
                        objects:[],
                        selected:[],
                        checkAll:true,
                        indeterminate:false,
                    }
                    let c = getState("master", func);
                    if(c && c.length>0){
                        c.forEach(item=>{

                            if(item.parentId && item.parentId.length>0){
                                return false;
                            }
                            
                            let o = {
                                name:item.name,
                                id:item.id,
                            }
                            
                            if((o.isVisible==null || o.isVisible===true) && func!="cameras" ){
                                obj.selected.push(o.id);
                                obj.indeterminate = true;
                            }
                            else{
                                obj.checkAll = false;
                            }
                            obj.objects.push(o);

                        });

                        if(obj.checkAll){
                            obj.indeterminate = false;
                        }

                        if(obj.objects.length>0){
                            this.downloadList.push(obj);
                        }
                        
                    }
                });

                // this.checkedDownload3Df = showSelectList;
                // this.checkDownload3DfAll = true;
                this.openDownLoad = true;
            },
            handleCheckAllChange(item) {
                var all = [];
                if(!item.objects){
                    return;
                }
                item.objects.forEach((item)=>{
                    all.push(item.id);
                });
                item.selected = item.checkAll ? all : [];
                item.indeterminate = false;
            },
            handleChecked3DfChange(item) {
                let checkedCount = item.selected.length;
                item.checkAll = checkedCount === item.objects.length;
                item.indeterminate = checkedCount > 0 && checkedCount < item.objects.length;
            },
            saveAs(blob, filename) {
                if (window.navigator.msSaveOrOpenBlob) {
                    navigator.msSaveBlob(blob, filename);
                } 
                else {
                    var link = document.createElement('a');
                    var body = document.querySelector('body');

                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;

                    // fix Firefox
                    link.style.display = 'none';
                    body.appendChild(link);

                    link.click();
                    body.removeChild(link);

                    window.URL.revokeObjectURL(link.href);
                }
            },
            downloadProgram(){
                let config = serializeMs3df(this.downloadList);
				var programHTML = programHTMLHandler(config);

				let filename = this.downLoadName + ".html";

				downloadTextFile(filename, programHTML);

                this.openDownLoad = false;
            },
            downloadConfig(){
                // if(this.particleSystemSet.length==0){
                //     this.$message({
                //         message: '请先制作粒子再下载',
                //         type: 'warning'
                //     });
                //     openDownLoad = false;
                //     return;
                // }
                // var _this = this;
                // var downCache = [], selected = {};
                // this.checkedDownload3Df.forEach((id)=>{
                //     selected[id] = true;
                // });

                // for(var i=0;i<_this.particleSystemSet.length;i++){
                //     var item = _this.particleSystemSet[i];
                //     if(item.id in selected){
                //         downCache.push(item);
                //     }
                // }

                // var json = JSON.stringify(downCache);
                // var blob = new Blob([json],{type : 'application/json'});
                // _this.saveAs(blob, this.downLoadName);


                let config = serializeMs3df(this.downloadList);
				var strScene = JSON.stringify(config);

				let filename = this.downLoadName + ".json";
                //deflateTextFile(strScene)
				downloadTextFile(filename, strScene);

                this.openDownLoad = false;
                // var url = URL.createObjectURL(blob);
                // window.open(url);
                // window.URL.revokeObjectURL(url);
            },
            handleOpenUpLoad(file){
                // var all = [];
                // this.isUpload3DfIndeterminate = false;
                // this.upload3Dfs.forEach((item)=>{
                //     all.push(item.id);
                // });
                // this.checkedUpload3Df = all;
                // this.checkUpload3DfAll = true;

                let uploadModelList = ["cameras","meshes","transformNodes","instances","lights","materials","multiMaterials","spriteManagers","particleSystems","programs","gui2Ds"];
                this.uploadFile = file;
                this.uploadList = [
                    {
                        model:"scene",
                        objects:null,
                        selected:null,
                        checkAll:true,
                        indeterminate:false,
                    }, 
                    {
                        model:"environment",
                        objects:null,
                        selected:null,
                        checkAll:true,
                        indeterminate:false,
                    }, 
                ];

                let hasItem = false;
                uploadModelList.forEach((func)=>{
                    let obj = {
                        model:func,
                        objects:[],
                        selected:[],
                        checkAll:true,
                        indeterminate:false,
                    }
                    let c = file[func];
                    if(c && c.length>0){
                        hasItem = true;
                        c.forEach(item=>{

                            if(item.parentId && item.parentId.length>0){
                                return false;
                            }
                            
                            let o = {
                                name:item.name,
                                id:item.id,
                            }
                            // && func!="cameras"
                            if((o.isVisible==null || o.isVisible===true)){
                                obj.selected.push(o.id);
                                obj.indeterminate = true;
                            }
                            else{
                                obj.checkAll = false;
                            }
                            obj.objects.push(o);

                        });

                        if(obj.checkAll){
                            obj.indeterminate = false;
                        }

                        if(obj.objects.length>0){
                            this.uploadList.push(obj);
                        }
                        
                    }
                });

                if(hasItem){
                    this.openUpLoad = true;
                }
                else{
                    alert("请上传正确的格式!");
                }
                
            },
            uploadloadConfig(){
                let config = serializeMs3df(this.uploadList, this.uploadFile);
                ms3dfParse(config, true, false);
                this.openUpLoad = false;
            },
            // handleCheckUpAllChange(val) {
            //     var all = [];
            //     this.upload3Dfs.forEach((item)=>{
            //         all.push(item.id);
            //     });
            //     this.checkedUpload3Df = val ? all : [];
            //     this.isUpload3DfIndeterminate = false;
            // },
            // handleCheckedUp3DfChange(value) {
            //     let checkedCount = value.length;
            //     this.checkUpload3DfAll = checkedCount === this.upload3Dfs.length;
            //     this.isUpload3DfIndeterminate = checkedCount > 0 && checkedCount < this.upload3Dfs.length;
            // },
            // uploadloadConfig:function(){
            //     var _this = this;
            //     _this.openUpLoad = false;

            //     var originLen = _this.particleSystemSet.length;
            //     // _this.particleSystemSet = _this.particleSystemSet.concat(js);

            //     var selected = {};
            //     this.checkedUpload3Df.forEach((id)=>{
            //         selected[id] = true;
            //     });

            //     var babylon = document.getElementById('renderCanvas').babylon;
            //     let particle3D = document.getElementById('renderCanvas').babylon.particle3D;

            //     var r = 0;
            //     for(var i=0;i<_this.upload3Dfs.length;i++){
            //         var ps = _this.upload3Dfs[i];
            //         if(!(ps.id in selected)){
            //             continue;
            //         }
            //         ps.screenSize = getScreenSize();
            //         _this.createParticleMash(ps);
            //         var particle = particle3D.createParticle(eval('('+ JSON.stringify(ps) +')'), babylon.scene, babylon.camera, r+originLen);
            //         if(particle==null){
            //             continue;
            //         }

            //         _this.psBabylonSet[r+originLen] = particle;
            //         _this.particleSystemSet[r+originLen] = ps;

            //         r++;

            //         particle.start();
            //     }
                
            //     var ps = _this.particleSystemSet[_this.particleSystemSet.length-1];
            //     // _this.curParticleId = ps.id;
            //     _this.gotoPage(ps.id);

            // },
            // handleConfigSuccess(error,file, fileList) {
			// 	var _this = this;
			// 	let a = new FileReader();
			//     a.onload = function (e) { 
			//     	var json = e.target.result;
            //         if(json.length>0){
            //             // try {
            //                 var js = JSON.parse(json);
            //                 if(js.length>0){
            //                     _this.upload3Dfs = [];
            //                     //var originLen = _this.particleSystemSet.length;
            //                     // _this.particleSystemSet = _this.particleSystemSet.concat(js);

            //                     for(var i=0;i<js.length;i++){
            //                         var ps = js[i];
            //                         ps.id = generateRandomKey("ps");
                                    
            //                         _this.upload3Dfs.push(ps);
            //                     }
                                
            //                     _this.handleOpenUpLoad();
            //                 }
            //                 else{
            //                     _this.$message({
            //                         message: '上传的粒子配置文件为空，导入失败',
            //                         type: 'warning'
            //                     });
            //                 }
            //             // } catch (error) {
            //             //     _this.$message({
            //             //         message: '文件格式错误导入失败',
            //             //         type: 'warning'
            //             //     });
            //             // }

            //         }
            //         else{
            //             _this.$message({
            //                 message: '上传的粒子配置文件为空，导入失败',
            //                 type: 'warning'
            //             });
            //         }
			//     }
			//     a.readAsText(file.raw);
            // },
        }
    }
</script>

<style lang="scss">
    body,html {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
        font-size: 12px;
    }

    #loadingScreen{
        position: absolute;
        left: 0px;
        top:0px;
        width:100%;
        height: 100%;
        z-index: 1000;
        background-color: #000;

        div{
            position: absolute;
            width: 100%;
            top:40%;
            font-size: 16px;
            color: #fff;
            text-align: center;
        }
    }

    .msPannel{
        position: absolute;
        top:0px;
        left:0px;
        bottom: 0px;
        width:250px;
        // background:red;
    }

    .msleft {
        position: absolute;
        top:0px;
        left:250px;
        bottom: 0px;
        right: 310px;

        .msButtonSet{
            position: absolute;
            right: 0px;
            top:0px;
            z-index: 10;
            opacity: 0.8;
        }
        .canvasdiv{
            position: absolute;
            left: 0px;
            right: 0px;
            top: 0px;
            bottom: 0px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #cccccc;
            outline: none;
            // canvas{
            //     position: absolute;

            // }
        }
    }
    #renderCanvas{
        // height: 100%;
        // width:100%;
        touch-action: none;
        z-index: 1;
        outline:none;
    }

    #renderCanvasCopy{
        position: absolute;
    }

    .msright {
        position: absolute;
        top:0px;
        bottom: 0px;
        right: 0px;
        width:310px;
        overflow: auto;
    }
    #box{
        width: 200px;
        height: 120px; 
        cursor: move; 
        position: absolute; 
        top: calc(50% - 60px); 
        left: calc(50% - 100px); 
        border: 2px dotted #CCCCCC;
        z-index: 2;
    }
    #coor{
        width: 10px; 
        height: 10px; 
        overflow: hidden; 
        cursor: se-resize; 
        position: absolute; 
        right: 0; 
        bottom: 0; 
        background-color: #09C;
    }
</style>