<template>
    <div class="cameraSetting" v-if="skeleton!=null">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="相机基本配置" name="1">
                <el-form ref="form" :model="skeleton" label-width="100px" size="mini" @submit.native.prevent>

                      <!--   <el-button type="primary" size="mini" @click="stopAllAnimation()"><i class="el-icon-video-pause" style="font-size:18px;"></i></el-button> -->

                    <el-form-item label="骨骼名称：">
                        <el-input 
                            v-model="skeleton.name" 
                            placeholder="请输入相机名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>

                    <el-form-item label="骨骼预设：" v-if="skeleton.ranges && skeleton.ranges.length>0">
                        <el-select 
                            v-model="skeletonRange" 
                            placeholder="请选择"
                            value-key="name"
                        >
                            <el-option
                                v-for="item in skeleton.ranges"
                                :key="item.name"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>


                    <el-form-item label="自动播放：">
                        <el-switch 
                            v-model="skeleton.animationAutoPlay"
                            @change="saveData('animationAutoPlay')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="开始帧：">
                        <el-input-number 
                            v-model="skeleton.animationFrom" 
                            controls-position="right"
                            :min="0"
                            :step="1"
                            step-strictly
                            @change="saveData('animationFrom')" 
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="结束帧：">
                        <el-input-number 
                            v-model="skeleton.animationTo" 
                            controls-position="right"
                            :min="0"
                            :step="1"
                            step-strictly
                            @change="saveData('animationTo')" 
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="循环播放：">
                        <el-switch 
                            v-model="skeleton.animationIsLoop"
                            @change="saveData('animationIsLoop')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="播放速度：">
                        <el-input-number 
                            v-model="skeleton.animationSpeedRatio" 
                            controls-position="right"
                            :min="0"
                            :step="0.1"
                            step-strictly
                            @change="saveData('animationSpeedRatio')" 
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="预览">
                        <el-button type="primary" size="mini" @click="animationAndSkeletonPreview()"><i class="el-icon-video-play" style="font-size:18px;"></i></el-button>

                        <el-button type="primary" size="mini" @click="stopAnimation()"><i class="el-icon-video-pause" style="font-size:18px;"></i></el-button>

                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>

    </div>
</template>

<script>
    import { getState, generateRandomKey } from '@/canvas/common';
    import { updateObjectView, addMaterialView,skeletonAnimationPlay,stopSceneAllAnimation,skeletonAnimationStop } from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';
    // import animation from '@/master/animation';
    // import { animationDatas } from '@/master/js/meshData';

    export default {
        data: () => ({
            name: 'skeletonSetting',
            activeNames: ['1'],
            skeleton:null,
            skeletonRange:"",
        }),
        components: {
            // animation,
        },
        watch:{
            skeletonCom: {
                handler(nv, ov) {
                    this.skeleton = nv;
                },
                immediate: true,
                deep: true
            },
            skeletonRange(nv, ov){
                this.skeleton.animationFrom = nv.from;
                this.skeleton.animationTo = nv.to;
            }
        },
        computed: {
            skeletonCom(){ //相机对象
                let curSkeletonId = getState('master', 'curSkeletonId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'skeletons',
                    id: curSkeletonId
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
            handleChange(){

            },
            animationAndSkeletonPreview(){
                // this.stopAllAnimation();
                // let type = "animationGroup";
                // let curAnimationOrskeleton = this.getCurAnimationOrskeleton();
                
                // if(curAnimationOrskeleton.bones){
                //     type = "skeleton";
                // }
                // animationAndSkeletonPlay(curAnimationOrskeleton, type);

                skeletonAnimationPlay(this.skeleton);

            },
            stopAnimation(){
                skeletonAnimationStop(this.skeleton);
            },
            saveData(type){
                let skeletons = getState('master', 'skeletons');
                let curSkeletonId = getState('master', 'curSkeletonId'); 

                let index = 0;
                for(let i = 0; i < skeletons.length; i++){
                    if(skeletons[i].id == curSkeletonId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(skeletons[index]);

                let value = this.skeleton[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.skeleton[item];
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
                    key: 'skeletons.${'+ index +'}.' + updateType,
                    value: this.skeleton[updateType]
                });

                // this.$store.commit('master/refreshMasterLayerTime');

                // updateObjectView(updateType, this.skeleton, index, preObject);
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