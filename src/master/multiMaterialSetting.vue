<template>
    <div class="cameraSetting" v-if="multiMaterial!=null">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="复合材质配置" name="1">
                <el-form ref="form" :model="multiMaterial" label-width="100px" size="mini" @submit.native.prevent>

                      <!--   <el-button type="primary" size="mini" @click="stopAllAnimation()"><i class="el-icon-video-pause" style="font-size:18px;"></i></el-button> -->

                    <el-form-item label="复合材质名称：">
                        <el-input 
                            v-model="multiMaterial.name" 
                            placeholder="请输入复合材质名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>

                    <el-row>
                        选择材质：
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-select 
                                v-model="materialSelected" 
                                placeholder="请选择材质"
                                size="mini"
                            >
                                <el-option
                                    v-for="item in materials"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">
                            <el-button size="mini" type="primary"  @click="addArrayItem(multiMaterial.materials, materialSelected, 'materials');materialSelected=''">添加</el-button>
                        </el-col>
                    </el-row>
         

                   
                    <el-row style="margin-top:12px;">
                        已包含材质：
                    </el-row>
                    <el-row :key="item" v-for="(item, index) in multiMaterial.materials">
                        <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(multiMaterial.materials, index, 'materials')"></i></el-col>
                        <el-col :span="20">
                            <el-button size="mini" type="text"  @click="hightlightMaterial(item)">{{materialsMap[item]}}</el-button>
                        </el-col>
                    </el-row>
                   
                    
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
            name: 'multiMaterialSetting',
            activeNames: ['1'],
            multiMaterial:null,
            materialSelected:"",
        }),
        components: {
            // animation,
        },
        watch:{
            multiMaterialCom: {
                handler(nv, ov) {
                    this.multiMaterial = nv;
                },
                immediate: true,
                deep: true
            },
        },
        computed: {
            multiMaterialCom(){ //相机对象
                let curMultiMaterialId = getState('master', 'curMultiMaterialId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'multiMaterials',
                    id: curMultiMaterialId
                });

                if(object){
                    return deepCopy(object);
                }

                return null;
            },
            materials(){ //已创建的物体库
                let materials = getState('master', 'materials');
                let ret = [], seletedMap={};
                if(!this.multiMaterial){
                    return materials;
                }

                if(this.multiMaterial.materials){
                    this.multiMaterial.materials.forEach(m=>{
                        seletedMap[m] = 1;
                    });
                }

                materials.forEach(m=>{
                    if(!(m.id in seletedMap)){
                        ret.push({
                            id:m.id,
                            name:m.name
                        });
                    }
                });

                return ret;

            },
            materialsMap(){
                let map = {};
                let materials = getState('master', 'materials');
                materials.forEach(m=>{
                    map[m.id] = m.name;
                });
                return map;
            }
        },
        methods: {
            addArrayItem(data, item, saveKey){
                if(item==null || item.length==0){
                    this.$message({
                        message: '没有需要添加的内容',
                        type: 'warning',
                    });
                    return;
                }
                data.push(item);
                this.saveData(saveKey);
            },
            deleteArrayItem(data, index, saveKey){
                data.splice(index, 1);
                this.saveData(saveKey);
            },

            handleChange(){

            },
            hightlightMaterial(mid){

            },
            saveData(type){
                let multiMaterials = getState('master', 'multiMaterials');
                let curSkeletonId = getState('master', 'curMultiMaterialId'); 

                let index = 0;
                for(let i = 0; i < multiMaterials.length; i++){
                    if(multiMaterials[i].id == curSkeletonId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(multiMaterials[index]);

                let value = this.multiMaterial[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.multiMaterial[item];
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

                if(updateType=="materials"){
                    let materials = getState('master', 'materials'),seletedMap = {};
                    if(this.multiMaterial.materials){
                        this.multiMaterial.materials.forEach(m=>{
                            seletedMap[m] = 1;
                        });
                    }

                    materials.forEach((m,index)=>{
                        let v = null;
                        if(m.id in seletedMap){
                            v = this.multiMaterial.id;
                        }

                        this.$store.commit('master/updateCommands', {
                            key: 'materials.${'+ index +'}.parentId',
                            value: v
                        });
                    });

                    // this.$store.commit('master/refreshMasterLayerTime');
                }
                
                this.$store.commit('master/updateCommands', {
                    key: 'multiMaterials.${'+ index +'}.' + updateType,
                    value: this.multiMaterial[updateType]
                });

                this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.multiMaterial, index, preObject);
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