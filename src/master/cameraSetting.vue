<template>
    <div class="cameraSetting" v-if="camera!=null">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="相机基本配置" name="1">
                <el-form ref="form" :model="camera" label-width="100px" size="mini" @submit.native.prevent>
                    <el-form-item label="相机名称：">
                        <el-input 
                            v-model="camera.name" 
                            placeholder="请输入相机名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="相机类型：">
                        <el-select 
                            v-model="camera.type" 
                            @change="saveData('type')"
                            placeholder="请选择相机类型"
                        >
                            <el-option label="通用相机" value="UniversalCamera"></el-option>
                            <el-option label="旋转相机" value="ArcRotateCamera"></el-option>
                            <el-option label="跟随相机" value="FollowCamera"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="父元素物体：">
                        <el-select 
                            v-model="camera.parentId" 
                            @change="saveData('parentId')"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in meshes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="跟随物体：">
                        <el-select 
                            v-model="camera.lockedTargetId" 
                            @change="saveData('lockedTargetId')"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in meshes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="相机位置：" v-if="camera.type!='ArcRotateCamera'">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.position[0]" 
                                    controls-position="right"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('position.${0}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.position[1]" 
                                    controls-position="right"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('position.${1}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.position[2]" 
                                    controls-position="right"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('position.${2}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="相机观察：">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.target[0]" 
                                    controls-position="right"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('target.${0}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.target[1]" 
                                    controls-position="right"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('target.${1}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.target[2]" 
                                    controls-position="right"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('target.${2}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="alpha：" v-if="camera.type=='ArcRotateCamera'">
                        <el-slider 
                            v-model="camera.alpha"
                            :min="-2"
                            :max="2"
                            :step="0.01"
                            @change="saveData('alpha')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="beta：" v-if="camera.type=='ArcRotateCamera'">
                        <el-slider 
                            v-model="camera.beta"
                            :min="-2"
                            :max="2"
                            :step="0.01"
                            @change="saveData('beta')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="半径：" v-if="camera.type=='ArcRotateCamera' || camera.type=='FollowCamera'">
                        <el-input-number 
                            v-model="camera.radius" 
                            controls-position="right"
                            :step="0.1"
                            step-strictly
                            @change="saveData('radius')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="半径下限：" v-if="camera.type=='ArcRotateCamera' || camera.type=='FollowCamera'">
                        <el-input-number 
                            v-model="camera.lowerRadiusLimit" 
                            controls-position="right"
                            :step="0.1"
                            step-strictly
                            @change="saveData('lowerRadiusLimit')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="半径上限：" v-if="camera.type=='ArcRotateCamera' || camera.type=='FollowCamera'">
                        <el-input-number 
                            v-model="camera.upperRadiusLimit" 
                            controls-position="right"
                            :step="0.1"
                            step-strictly
                            @change="saveData('upperRadiusLimit')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="高度偏移：" v-if="camera.type=='FollowCamera'">
                        <el-input-number 
                            v-model="camera.heightOffset" 
                            controls-position="right"
                            :step="0.1"
                            step-strictly
                            @change="saveData('heightOffset')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="旋转偏移：" v-if="camera.type=='FollowCamera'">
                        <el-input-number 
                            v-model="camera.rotationOffset" 
                            controls-position="right"
                            :step="0.1"
                            step-strictly
                            @change="saveData('rotationOffset')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="视场：">
                        <el-input-number 
                            v-model="camera.fov" 
                            controls-position="right"
                            :min="0"
                            :step="0.1"
                            step-strictly
                            @change="saveData('fov')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="视场模式：">
                        <el-select 
                            v-model="camera.fovMode" 
                            @change="saveData('fovMode')"
                            placeholder="请选择视场模式"
                        >
                            <el-option label="垂直固定" :value="0"></el-option>
                            <el-option label="水平固定" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="最小缩放距离：">
                        <el-input-number 
                            v-model="camera.minZ" 
                            controls-position="right"
                            :min="0"
                            :step="0.001"
                            step-strictly
                            @change="saveData('minZ')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="最大缩放距离：">
                        <el-input-number 
                            v-model="camera.maxZ" 
                            controls-position="right"
                            :min="0"
                            :step="0.001"
                            step-strictly
                            @change="saveData('maxZ')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="相机运动速度：">
                        <el-input-number 
                            v-model="camera.speed" 
                            controls-position="right"
                            :min="0"
                            :step="0.1"
                            step-strictly
                            @change="saveData('speed')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="相机碰撞检测：">
                        <el-switch 
                            v-model="camera.checkCollisions"
                            @change="saveData('checkCollisions')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="相机应用重力：">
                        <el-switch 
                            v-model="camera.applyGravity"
                            @change="saveData('applyGravity')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="人物体积：">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.ellipsoid[0]" 
                                    controls-position="right"
                                    :min="0"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('ellipsoid.${0}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.ellipsoid[1]" 
                                    controls-position="right"
                                    :min="0"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('ellipsoid.${1}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.ellipsoid[2]" 
                                    controls-position="right"
                                    :min="0"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('ellipsoid.${2}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="启用相机回弹：">
                        <el-switch 
                            v-model="camera.useBouncingBehavior"
                            @change="saveData('useBouncingBehavior')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="回弹过渡时间：" v-if="camera.useBouncingBehavior">
                        <el-input-number 
                            v-model="camera.bouncingBehavior.transitionDuration" 
                            controls-position="right"
                            :min="0"
                            :step="1"
                            step-strictly
                            @change="saveData('bouncingBehavior.transitionDuration')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="回弹百分比：" v-if="camera.useBouncingBehavior">
                        <el-slider 
                            v-model="camera.bouncingBehavior.autoTransitionRange"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('bouncingBehavior.autoTransitionRange')"
                        >
                        </el-slider>
                    </el-form-item>

                    <el-form-item label="启用鼠标：">
                        <el-switch 
                            v-model="camera.enablePoint"
                            @change="saveData('enablePoint')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="启用滚轮：">
                        <el-switch 
                            v-model="camera.enableMouseWheel"
                            @change="saveData('enableMouseWheel')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="启用键盘：">
                        <el-switch 
                            v-model="camera.enableKeyBoard"
                            @change="saveData('enableKeyBoard')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="启用相机视窗：">
                        <el-switch 
                            v-model="camera.enableViewport"
                            @change="saveData('enableViewport')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="相机视窗：" v-if="camera.enableViewport">
                        <el-row>
                            <el-col :span="4">x：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.viewport[0]" 
                                    controls-position="right"
                                    :min="0"
                                    :max="1"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('viewport.${0}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">y：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.viewport[1]" 
                                    controls-position="right"
                                    :min="0"
                                    :max="1"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('viewport.${1}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">w：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.viewport[2]" 
                                    controls-position="right"
                                    :min="0"
                                    :max="1"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('viewport.${2}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">h：</el-col>
                            <el-col :span="20">
                                <el-input-number 
                                    v-model="camera.viewport[3]" 
                                    controls-position="right"
                                    :min="0"
                                    :max="1"
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('viewport.${3}')" 
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="相机添加动画" name="2">
                <!-- <el-row v-for="(item, index) in camera.animations" :key="index">
                    {{item.name}}
                    <el-button type="primary" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
                </el-row>
                <el-button type="primary" size="mini" @click="openAddAnimationDialog('new')">添加</el-button> -->
                <el-row>
                    <el-col :span="8">
                        是否循环：
                    </el-col>
                    <el-col :span="16">
                        <el-switch v-model="camera.animationLoop" @change="saveData('animationLoop')"></el-switch>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        动画速度：
                    </el-col>
                    <el-col :span="16">
                        <el-input-number 
                            v-model="camera.animationSpeed" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            @change="saveData('animationSpeed')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-button type="primary" size="mini" @click="openAddAnimationDialog('new')">添加</el-button>
                    </el-col>
                </el-row>
                <el-row v-for="(item, index) in camera.animations" :key="index">
                    <el-col :span="12">
                        {{item.name}}
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="deleteArrayItem(camera.animations, index, 'animations')">删除</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>

        <!-- 添加动画 -->
        <el-dialog
            :title="dialogTitle_animation"
            :visible.sync="dialogVisible_animation"
            width="30%"
        >
            <div>
                <el-form ref="form" label-width="80px" size="mini" style="margin-bottom:20px;" v-if="dialog_animation_method=='new'&&animationObj==null">
                    <el-form-item label="选择属性">
                        <el-cascader
                            v-model="dialog_animation_property"
                            :options="animationPropertyFilter()"
                            :props="{ expandTrigger: 'hover', checkStrictly: true }"
                        >
                        </el-cascader>
                    </el-form-item>
                    <el-button type="primary" @click="addAnimationProperty">选择</el-button>
                </el-form>
                <animation 
                    v-else
                    ref="animation"
                    :animationObj="animationObj"
                    :animationProperty="animationProperty"
                >
                </animation>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_animation = false">取 消</el-button>
                <el-button type="primary" @click="addAnimation">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { getState, generateRandomKey } from '@/canvas/common';
    import { updateObjectView,  updateObjectViewHandler} from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';
    import animation from '@/master/animation';
    import { animationDatas } from '@/master/js/meshData';

    export default {
        data: () => ({
            name: 'cameraSetting',
            activeNames: ['1'],

            dialogVisible_animation: false,  //添加动画弹出框
            dialogTitle_animation: '',  //添加动画弹出框标题
            dialog_animation_property: [],  //添加动画的属性
            animationObj: null,  //动画对象
            animationProperty: null,  //属性详情
            dialog_animation_method: null,  //新增 或 编辑
            dialog_animation_index: null,  //编辑索引
            camera:null,
        }),
        components: {
            animation,
        },
        watch:{
            cameraCom: {
                handler(nv, ov) {
                    this.camera = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            cameraCom(){ //相机对象
                let curCameraId = getState('master', 'curCameraId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'cameras',
                    id: curCameraId
                });

                if(object){
                    return deepCopy(object);
                }

                return null;
            },
            meshes(){ //已创建的物体库
                return getState('master', 'meshes');
            },
        },
        methods: {
            deleteArrayItem(data, index, saveKey){
                data.splice(index, 1);
                this.saveData(saveKey);
            },
            handleChange(){

            },
            openAddAnimationDialog(method, index){
                this.dialog_animation_method = method;

                if(method == 'new'){
                    this.animationObj = null;
                    this.dialogTitle_animation = '动画';
                    this.dialog_animation_property = [];
                }
                else if(method == 'edit'){
                    this.dialog_animation_index = index;

                    let ani = this.camera.animations[index];
                    let p1 = ani.property.split('.')[0];

                    this.animationObj = deepCopy(ani);
                    this.animationProperty = deepCopy(animationDatas['camera'][p1]);
                    this.dialogTitle_animation = '动画--' + this.animationProperty.propertyName;
                }

                this.dialogVisible_animation = true;
            },
            animationPropertyFilter(){
                let data = [];
                let animationData = animationDatas['camera'];

                for(let key in this.camera){
                    if(key in animationData){
                        let label = animationData[key].propertyName;
                        let children = animationData[key].children;

                        data.push({
                            value: key,
                            label: label,
                            children: children,
                        })
                    }
                }

                return data;
            },
            addAnimationProperty(){
                let property = this.dialog_animation_property.join('.');
                let p1 = this.dialog_animation_property[0];

                this.animationObj = {
                    dataType: 0,
                    property: property,
                    name: '动画' + this.camera.animations.length,
                    framePerSecond: 100,
                    loopBehavior: 1,
                    keys: [],
                    animationEaseFunction:"default",
                    animationEaseInOut:"EASINGMODE_EASEIN",
                    autoAnimate: true,
                    autoAnimateFrom: 0,
                    autoAnimateTo: 100,
                    autoAnimateLoop: false,
                }
                this.animationProperty = deepCopy(animationDatas['camera'][p1]);

                let str = this.dialog_animation_property[1] ? this.dialog_animation_property[1] : '';
                this.dialogTitle_animation = '动画--' + this.animationProperty.propertyName + str;
            },
            addAnimation(){
                if(!this.$refs.animation){
                    this.dialogVisible_animation = false;
                    return;
                }

                let ani = this.$refs.animation.animation;

                if(this.dialog_animation_method == 'new'){
                    ani.id = generateRandomKey("cameraAni");
                    this.camera.animations.push(ani);
                }
                else if(this.dialog_animation_method == 'edit'){
                    this.camera.animations[this.dialog_animation_index] = ani;
                }

                this.saveData('animations');
                this.dialogVisible_animation = false;
            },
            saveData(type){
                let cameras = getState('master', 'cameras');
                let curCameraId = getState('master', 'curCameraId'); 

                let index = 0;
                for(let i = 0; i < cameras.length; i++){
                    if(cameras[i].id == curCameraId){
                        index = i;
                        break;
                    }
                }

                let value = this.camera[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.camera[item];
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

                    updateType = arr[0];
                }
                
                this.$store.commit('master/updateCommands', {
                    key: 'cameras.${'+ index +'}.' + updateType,
                    value: this.camera[updateType]
                });

                // this.$store.commit('master/refreshMasterLayerTime');

                updateObjectViewHandler(updateType, this.camera, index);
            },
        },
    }
</script>

<style lang="scss">
    .cameraSetting{
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
        .el-slider__runway{
            margin: 12px 0;

            .el-slider__button{
                width: 12px;
                height: 12px;
            }
        }
    }
    
</style>