<template>
    <div class="sceneSetting">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="场景基本配置" name="1">
                <el-form ref="form" :model="scene" label-width="100px" size="mini" @submit.native.prevent>
                    <el-form-item label="预览动画：">
                        <el-row>
                            <el-col :span="10">
                                <el-button type="primary" style="font-size:12px;" size="mini" @click="animationAndSkeletonPreview()"><i class="el-icon-video-play" style="font-size:14px;"></i>播放</el-button>
                        
                            </el-col>
                            <el-col :span="2" style="text-align:center">
                                
                            </el-col>
                            <el-col :span="10">
                                <el-button style="font-size:12px;" type="primary" size="mini" @click="stopAllAnimation()"><i class="el-icon-video-pause" style="font-size:14px;"></i>停止</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="分辨率：">
                        <el-row>
                            <el-col :span="10">
                                <el-input 
                                    placeholder="水平分辨率"
                                    v-model="scene.screenRatio[0]" 
                                    controls-position="right" 
                                    @change="saveData('screenRatio')"
                                ></el-input>
                            </el-col>
                            <el-col :span="2" style="text-align:center">
                                ✖
                            </el-col>
                            <el-col :span="10">
                                <el-input 
                                    placeholder="垂直分辨率"
                                    v-model="scene.screenRatio[1]" 
                                    controls-position="right" 
                                    @change="saveData('screenRatio')"
                                ></el-input>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-checkbox v-model="isFullscreen" @change="changeScreenRatio">全屏</el-checkbox>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="场景名称：">
                        <el-input 
                            v-model="scene.name" 
                            placeholder="请输入场景名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="是否自动清除：">
                        <el-switch 
                            v-model="scene.autoClear"
                            @change="saveData('autoClear')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="背景颜色：">
                        <el-color-picker 
                            v-model="scene.clearColor" 
                            color-format="rgb"
                            @change="saveData('clearColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="环境颜色：">
                        <el-color-picker 
                            v-model="scene.ambientColor" 
                            color-format="rgb"
                            @change="saveData('ambientColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="重力：">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="scene.gravity[0]" 
                                    controls-position="right" 
                                    @change="saveData('gravity.${0}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="scene.gravity[1]" 
                                    controls-position="right" 
                                    @change="saveData('gravity.${1}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="scene.gravity[2]" 
                                    controls-position="right" 
                                    @change="saveData('gravity.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="环境纹理：">
                        <el-select 
                            v-model="scene.environmentTexture" 
                            @change="saveData('environmentTexture')"
                            placeholder="请选择纹理"
                            clearable
                        >
                            <el-option 
                                v-for="item in textureFilter()"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <el-button type="primary" @click="openDialog()">新建</el-button>
                    </el-form-item>
                    <el-form-item label="雾效果：">
                        <el-switch 
                            v-model="scene.fogEnabled"
                            @change="saveData('fogEnabled')"
                        >
                        </el-switch>
                    </el-form-item>
                    <div v-if="scene.fogEnabled">
                        <el-form-item label="雾模式：">
                            <el-select 
                                v-model="scene.fogMode" 
                                @change="saveData('fogMode')"
                                placeholder="请选择雾模式"
                            >
                                <el-option label="默认" :value="0"></el-option>
                                <el-option label="指数" :value="1"></el-option>
                                <el-option label="指数2" :value="2"></el-option>
                                <el-option label="线性" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="雾密度：">
                            <el-slider 
                                v-model="scene.fogDensity"
                                :min="0"
                                :max="1"
                                :step="0.01"
                                @change="saveData('fogDensity')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="雾开始：">
                            <el-slider 
                                v-model="scene.fogStart"
                                :min="0"
                                :max="100"
                                :step="1"
                                @change="saveData('fogStart')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="雾结束：">
                            <el-slider 
                                v-model="scene.fogEnd"
                                :min="0"
                                :max="100"
                                :step="1"
                                @change="saveData('fogEnd')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="雾颜色：">
                            <el-color-picker 
                                v-model="scene.fogColor" 
                                color-format="rgb"
                                @change="saveData('fogColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="开启2d背景：">
                        <el-switch 
                            v-model="scene.enableBackground2D"
                            @change="saveData('enableBackground2D')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="背景图：" v-if="scene.enableBackground2D">
                        <el-upload
                            class="upload-source"
                            action=""
                            :limit="1"
                            :show-file-list="false"
                            :on-progress="handleSourceSuccess"
                            :before-upload="beforeSourceUpload"
                        >
                            <img v-if="scene.background2D" :src="scene.background2D" class="sourceImg">
                            <i v-else class="el-icon-plus source-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="开启全局辉光：">
                        <el-switch 
                            v-model="scene.enableGlow"
                            @change="saveData('enableGlow')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="辉光亮度：" v-if="scene.enableGlow">
                        <el-input-number 
                            v-model="scene.glowIntensity" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('glowIntensity')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="主纹理体积：" v-if="scene.enableGlow">
                        <el-input-number 
                            v-model="scene.mainTextureFixedSize" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('mainTextureFixedSize')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="模糊核心体积：" v-if="scene.enableGlow">
                        <el-input-number 
                            v-model="scene.blurKernelSize" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('blurKernelSize')"
                        >
                        </el-input-number>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
<!--             <el-collapse-item title="动画相关" name="2">
                <el-form ref="form" :model="scene" label-width="100px" size="mini" @submit.native.prevent>
                    <el-form-item label="动画组：">
                        <el-select  v-model="curAnimationOrskeletonId"  placeholder="请选择动画或骨骼">
                            <el-option-group
                            v-for="group in animationAndSkeleton()"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.options"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                            </el-option-group>
                        </el-select>
                        <el-button type="primary" size="mini" @click="animationAndSkeletonPreview()"><i class="el-icon-video-play" style="font-size:18px;"></i></el-button>
                        <el-button type="primary" size="mini" @click="stopAllAnimation()"><i class="el-icon-video-pause" style="font-size:18px;"></i></el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item> -->
            <el-collapse-item title="滤镜设置" name="3">
              <p style="padding-left:10px"><label>开启滤镜：</label><el-switch v-model="scene.enableFilter" @change="saveData('enableFilter')">
              </el-switch></p>
                <filterSetting :config="scene.filter" @save="saveData" v-if="scene.enableFilter"></filterSetting>
            </el-collapse-item>
        </el-collapse>

        <!-- 新建环境纹理 -->
        <el-dialog
            title="新建环境纹理"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <el-select v-model="addTextureType" placeholder="请选择纹理类型">
                <el-option label="纹理" value="Texture"></el-option>
                <el-option label="环境纹理" value="CubeTexture"></el-option>
                <el-option label="环境纹理HDR" value="HDRCubeTexture"></el-option>
                <el-option label="环境纹理Rect" value="EquiRectangularCubeTexture"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTexture">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { generateRandomKey, getState } from '@/canvas/common';
    import { textureDatas } from '@/master/js/meshData';
    import { updateObjectView, addTextureView, animationAndSkeletonPlay,stopSceneAllAnimation,skeletonAnimationPlay } from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';

    import filterSetting from "@/components/global/library/filterSetting"
    export default {
        components:{
          filterSetting,
        },
        data(){
            return {
                name: 'sceneSetting',
                activeNames: ['1','2'],
                sceneTemp: {
                    name: '默认场景',
                    autoClear: true,  //loop时是否自动清除
                    clearColor: 'rgb(0, 0, 0)',  //清色
                    ambientColor: null,  //场景光颜色
                    gravity: [0, -9.807, 0],  //重力
                    environmentTexture: '',  //环境纹理

                    fogEnabled: false,  //雾效果
                    fogMode: 0,  //雾模式，0 BABYLON.Scene.FOGMODE_NONE 默认，1 BABYLON.Scene.FOGMODE_EXP 指数， 2 BABYLON.Scene.FOGMODE_EXP2 指数2，3 BABYLON.Scene.FOGMODE_LINEAR 线性
                    fogDensity: 0.01,  //雾密度，0-1，步长0.01
                    fogStart: 20,  //雾开始，0-100，步长1
                    fogEnd: 60,  //雾结束，0-100，步长1
                    fogColor: 'rgb(1,1,1)',  //雾颜色

                    enableBackground2D: false,  //开启2d背景
                    background2D: '',  //背景图
                    enableGlow: false,  //开启全局辉光
                    glowIntensity: 1,  //辉光亮度
                    mainTextureFixedSize: 1024,  //主纹理体积
                    blurKernelSize: 32,  //模糊核心体积
                    enableFilter:false,  // 是否开启滤镜
                    filter:{},           // 滤镜设置

                    screenRatio:[16, 9], //屏幕分辨率
                },
                scene:{},
                isFullscreen:true,
                // animationGroups:[],
                // skeletons:[],
                curAnimationOrskeletonId:null,

                dialogVisible: false,  //新建环境纹理弹出框显示
                addTextureType: null,  //新建纹理类型
            }
        },
        watch: {
            isFullscreen(nv, ov){
                this.$store.commit('master/updateCommands', {
                    key: "isFullscreen",
                    value: nv,
                });
            },
            sceneCom: {
                handler(nv, ov) {
                    this.scene = nv;
                },
                immediate: true,
                deep: true
            }
            // titleOption: {
            //     handler: function(newVal,oldVal) {
            //         if(this._.isEqual(this.titleOptionData,newVal)){
            //         return;
            //         }
            //         console.info('titleOption监听 watch=========');
            //         this.titleOptionData = deepCopy(newVal);//传过来的值需要深拷贝防止数据流向父组件传递
            //     },
            //     immediate: true,
            //     deep: true
            // },
        },
        computed: {
            sceneCom(){ //物体对象
                let temp = deepCopy(this.sceneTemp);
                for(let key in temp){
                    temp[key] = getState('master', key);
                }
                return temp;
            },
            textures(){ //已创建的纹理库
                return getState('master', 'textures');
            },
            animationGroups(){
                return getState('master', 'animationGroups');
            },
            skeletons(){
                return getState('master', 'skeletons');
            }
        },
        mounted(){
            for(let key in this.scene){
                this.scene[key] = getState('master', key);
            }

            this.isFullscreen = getState('master', "isFullscreen");

            // this.animationGroups = getState('master', "animationGroups");
            // this.skeletons = getState('master', "skeletons");
        },
        methods: {
            changeScreenRatio(){
                setTimeout(() => {
                   this.$emit("resizeCanvas"); 
                }, 0);
            },
            animationAndSkeleton(){
                return [
                    {
                        label: '动画组',
                        options: this.animationGroups
                    }, 
                    {
                        label: '骨骼动画',
                        options: this.skeletons
                    }
                ];
            },
            getCurAnimationOrskeleton(){
                for(let i=0;i<this.animationGroups.length;i++){
                    let item = this.animationGroups[i];
                    if(item.id==this.curAnimationOrskeletonId){
                        return item;
                    }
                }

                for(let i=0;i<this.skeletons.length;i++){
                    let item = this.skeletons[i];
                    if(item.id==this.curAnimationOrskeletonId){
                        return item;
                    }
                }

                return null;
            },
            stopAllAnimation(){
                stopSceneAllAnimation();
            },
            animationAndSkeletonPreview(){
                this.stopAllAnimation();
                // let type = "animationGroup";
                // let curAnimationOrskeleton = this.getCurAnimationOrskeleton();
                
                // if(curAnimationOrskeleton.bones){
                //     type = "skeleton";
                // }
                // animationAndSkeletonPlay(curAnimationOrskeleton, type);
                let skeletons = getState('master', "skeletons");
                skeletons.forEach((ske)=>{
                    skeletonAnimationPlay(ske);
                });
            },
            handleChange(){

            },
            textureFilter(){
                if(this.textures.length == 0){
                    return this.textures;
                }

                let data = deepCopy(this.textures);
                data = data.filter(item => {
                    if(item.type == 'Texture' || item.type == 'CubeTexture' || item.type == 'HDRCubeTexture' || item.type == 'EquiRectangularCubeTexture'){
                        return true;
                    }

                    return false;
                })

                return data;
            },
            openDialog(){
                this.dialogVisible = true;
            },
            addTexture(){
                if(!this.addTextureType){
                    this.$message({
                        message: '请选择一种纹理类型',
                        type: 'warning',
                    })
                    return;
                }

                let texture = deepCopy(textureDatas[this.addTextureType]);
                texture.id = generateRandomKey('texture');
                texture.name = texture.name + '' + (this.textures.length + 1);

                this.$store.commit('master/insertCommands', {
                    key: 'textures',
                    value: texture
                });

                this.$store.commit('master/changeCurId', {
                    key: 'curTextureId',
                    value: texture.id
                });

                //如果要新建纹理的纹理属性没有值，则把新建的纹理赋给它
                if(this.scene.environmentTexture == null || this.scene.environmentTexture == ''){
                    this.scene.environmentTexture = texture.id;
                    this.saveData('environmentTexture');
                }

                this.$store.commit('master/changeCurModelName', 'texture');

                this.$store.commit('master/refreshMasterLayerTime');

                addTextureView(texture);
            },
            beforeSourceUpload(file){
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isGIF = file.type === 'image/gif';
                const isLt10M = file.size / 1024 / 1024 < 30;

                if(!(isJPG || isPNG || isGIF)){
                    this.$message.error('上传资源文件只能是 JPG/PNG/GIF 格式!');
                }

                if(!isLt10M){
                    this.$message.error('上传资源文件大小不能超过 30MB!');
                }

                return (isJPG || isPNG || isGIF) && isLt10M;
            },
            handleSourceSuccess(event, file, fileList){
                let _this = this;
                let a = new FileReader();
                a.onload = function (e) { 
                    _this.scene.background2D = e.target.result;
                    _this.saveData('background2D');
			    }
			    a.readAsDataURL(file.raw);
            },
            saveData(type,val){
                let value = val || this.scene[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.scene[item];
                        }
                        else{
                            if(item.indexOf('${') > -1){
                                let r = parseInt(item.replace('${', '').replace('}', ''));
                                value = value[r];
                            }
                            else{
                                value = value[item];
                            }
                        }
                    });

                    updateType = arr;
                }

                let preValue = getState("master", updateType);

                this.$store.commit('master/updateCommands', {
                    key: type,
                    value: value
                });

                this.$store.commit('master/refreshMasterLayerTime');

                let param = {
                    "mainType":"scene",
                }

                if(type=="background2D"){
                    param["enableBackground2D"] = getState('master', "enableBackground2D");
                }
                else if(type=="enableBackground2D"){
                    param["background2D"] = getState('master', "background2D");
                }
                param[updateType] = value;

                if(updateType=="filter"){
                    param["enableFilter"] = this.scene["enableFilter"];
                }

                if(updateType=="enableFilter"){
                    param["filter"] = this.scene["filter"];
                }

                if(type=="screenRatio"){
                    this.$emit("resizeCanvas");
                }
                else{
                    let preScene = deepCopy(param);
                    preScene[updateType] = preValue;
                    updateObjectView(updateType, param, null , preScene);
                }
                
            }
        },
    }
</script>

<style lang="scss">
    .sceneSetting{
        padding: 10px;
        user-select: none;

        .el-collapse-item__header{
            font-size: 14px;
            font-weight: 500;
        }
        .el-form-item{
            &.el-form-item--mini{
                margin-bottom: 5px;
            }

            .el-form-item__label{
                font-size: 12px;
            }
            .el-form-item__content{
                font-size: 12px;
            }
        }
        .upload-source{
            .el-upload{
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                position: relative;
                overflow: hidden;

                &:hover{
                    border-color: #409EFF;
                }
            }
        }
        .source-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .sourceImg{
            width: 178px;
            height: 178px;
            display: block;
        }
    }
</style>