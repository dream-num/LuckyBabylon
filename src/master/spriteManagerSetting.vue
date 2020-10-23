<template>
    <div class="spriteManagerSetting" v-if="spriteManager!=null">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="精灵图基本配置" name="1">
                <el-form ref="form" :model="spriteManager" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="精灵图：">
                        <el-upload
                            class="upload-source"
                            action=""
                            :limit="1"
                            :show-file-list="false"
                            :on-progress="handleSourceSuccess"
                            :before-upload="beforeSourceUpload"
                        >
                            <img v-if="spriteManager.spriteImage" :src="spriteManager.spriteImage" class="sourceImg">
                            <i v-else class="el-icon-plus source-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="单个宽度：">
                        <el-input-number 
                            v-model="spriteManager.cellWidth" 
                            controls-position="right" 
                            :min="0"
                            :step="1"
                            step-strictly
                            @change="saveData('cellWidth')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="单个高度：">
                        <el-input-number 
                            v-model="spriteManager.cellHeight" 
                            controls-position="right" 
                            :min="0"
                            :step="1"
                            step-strictly
                            @change="saveData('cellHeight')"
                        >
                        </el-input-number>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="添加精灵实例" name="2">
                <el-row v-for="(item, index) in spriteManager.sprites" :key="item.id">
                    {{item.name}}
                    <el-button type="primary" size="mini" @click="openAddSpriteDialog('edit', index)">编辑</el-button>
                </el-row>
                <el-button type="primary" size="mini" @click="openAddSpriteDialog('new')">添加</el-button>
            </el-collapse-item>
        </el-collapse>

        <!-- 精灵实例弹出框 -->
        <el-dialog
            title="精灵实例"
            :visible.sync="dialogVisible_sprite"
            width="30%"
        >
            <el-form ref="form" :model="spriteObj" label-width="80px" size="mini" @submit.native.prevent>
                <el-form-item label="名称：">
                    <el-input 
                        v-model="spriteObj.name" 
                        placeholder="请输入精灵实例名称"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="开始位置：">
                    <el-input-number 
                        v-model="spriteObj.cellIndex" 
                        controls-position="right" 
                        :min="0"
                        :step="1"
                        step-strictly
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item label="颜色：">
                    <el-color-picker 
                        v-model="spriteObj.color"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
                <el-form-item label="放大比例：">
                    <el-input-number 
                        v-model="spriteObj.size" 
                        controls-position="right" 
                        :min="1"
                        :step="1"
                        step-strictly
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item label="水平翻转：">
                    <el-switch v-model="spriteObj.invertU"></el-switch>
                </el-form-item>
                <el-form-item label="垂直翻转：">
                    <el-switch v-model="spriteObj.invertV"></el-switch>
                </el-form-item>
                <el-form-item label="旋转角度：">
                    <el-slider 
                        v-model="spriteObj.angle"
                        :min="0"
                        :max="360"
                        :step="1"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="位置：">
                    <el-row>
                        <el-col :span="4">X：</el-col>
                        <el-col :span="20">
                            <el-input-number 
                                v-model="spriteObj.position[0]" 
                                controls-position="right" 
                                :step="0.1"
                                step-strictly
                            >
                            </el-input-number>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">Y：</el-col>
                        <el-col :span="20">
                            <el-input-number 
                                v-model="spriteObj.position[1]" 
                                controls-position="right" 
                                :step="0.1"
                                step-strictly
                            >
                            </el-input-number>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">Z：</el-col>
                        <el-col :span="20">
                            <el-input-number 
                                v-model="spriteObj.position[2]" 
                                controls-position="right" 
                                :step="0.1"
                                step-strictly
                            >
                            </el-input-number>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="显示：">
                    <el-switch v-model="spriteObj.isVisible"></el-switch>
                </el-form-item>
                <el-form-item label="播放完毕消失：">
                    <el-switch v-model="spriteObj.disposeWhenFinishedAnimating"></el-switch>
                </el-form-item>
                <el-form-item label="自动播放：">
                    <el-switch v-model="spriteObj.autoPlay"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_sprite = false">取 消</el-button>
                <el-button type="primary" @click="addSprite">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { generateRandomKey, getState } from '@/canvas/common';
    import { masterTemplate } from '@/master/js/meshData';
    import { updateObjectView, addTextureView, uploadImageCheck } from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';

    export default {
        data: () => ({
            name: 'spriteManagerSetting',
            activeNames: ['1'],

            dialogVisible_sprite: false,  //精灵实例弹出框显示
            spriteObj: { //精灵实例对象
                name: "精灵实例",
                cellIndex: 0, //开始位置， 大于0，步长1
                color: null, //颜色
                size: 1, //放大比例
                invertU: false, //水平翻转
                invertV: false, //垂直翻转
                angle: 0, //旋转角度，0-360，步长1
                position: [0, 0, 0], //位置， 步长0.1
                isVisible: true, //显示
                disposeWhenFinishedAnimating: false, //播放完毕消失
                autoPlay: true, //自动播放
            },  
            dialog_sprite_method: null,  //新增 或 编辑
            dialog_sprite_index: null,  //编辑索引
            spriteManager:null,
        }),
        watch:{
            spriteManagerCom: {
                handler(nv, ov) {
                    this.spriteManager = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed:{
            spriteManagerCom(){
                let curSpriteManagerId = getState('master', 'curSpriteManagerId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'spriteManagers',
                    id: curSpriteManagerId
                });

                if(object){
                    return deepCopy(object);
                }

                return null;
            },
        },
        methods: {
            handleChange(){

            },
            beforeSourceUpload(file){
                uploadImageCheck(file, this);
            },
            handleSourceSuccess(event, file, fileList){
                let _this = this;
                let a = new FileReader();
                a.onload = function (e) { 
                    _this.spriteManager.spriteImage = e.target.result;
                    _this.saveData('spriteImage');
			    }
			    a.readAsDataURL(file.raw);
            },
            openAddSpriteDialog(method, index){
                this.dialog_sprite_method = method;

                if(method == 'new'){
                    this.spriteObj = deepCopy(masterTemplate.sprite);
                    this.spriteObj.name = this.spriteObj.name + this.spriteManager.sprites.length;
                    this.spriteObj.id = generateRandomKey('sprite');
                }
                else if(method == 'edit'){
                    this.spriteObj = deepCopy(this.spriteManager.sprites[index]);
                    this.dialog_sprite_index = index;
                }

                this.dialogVisible_sprite = true;
            },
            addSprite(){
                if(this.dialog_sprite_method == 'new'){
                    this.spriteManager.sprites.push(this.spriteObj);
                }
                else if(this.dialog_sprite_method == 'edit'){
                    this.spriteManager.sprites[this.dialog_sprite_index] = this.spriteObj;
                }

                this.saveData('sprites');
                this.dialogVisible_sprite = false;
            },
            saveData(type){
                let spriteManagers = getState('master', 'spriteManagers');
                let curSpriteManagerId = getState('master', 'curSpriteManagerId'); 

                let index = 0;
                for(let i = 0; i < spriteManagers.length; i++){
                    if(spriteManagers[i].id == curSpriteManagerId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(spriteManagers[index]);

                let value = this.spriteManager[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.spriteManager[item];
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
                    key: 'spriteManagers.${'+ index +'}.' + updateType,
                    value: this.spriteManager[updateType]
                });

                // this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.spriteManager, index , preObject);
            },
        },
    }
</script>

<style lang="scss">
    .spriteManagerSetting{
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
        .el-slider__runway{
            margin: 12px 0;

            .el-slider__button{
                width: 12px;
                height: 12px;
            }
        }
    }
</style>