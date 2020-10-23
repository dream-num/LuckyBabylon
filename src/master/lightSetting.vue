<template>
    <div class="lightSetting" v-if="light!=null">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="灯光基本配置" name="1">
                <el-form ref="form" :model="light" label-width="100px" size="mini" @submit.native.prevent>
                    <el-form-item label="灯光类型：">
                        {{light.type}}
                    </el-form-item>
                    <el-form-item label="灯光名称：">
                        <el-input 
                            v-model="light.name" 
                            placeholder="请输入灯光名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="light.type!='directional'?'位置':'方向'" v-if="hasKey('position')">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="light.position[0]" 
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
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="light.position[1]" 
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
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="light.position[2]" 
                                    controls-position="right" 
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('position.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="照射方向：" v-if="hasKey('direction')">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="light.direction[0]" 
                                    controls-position="right" 
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('direction.${0}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="light.direction[1]" 
                                    controls-position="right" 
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('direction.${1}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="light.direction[2]" 
                                    controls-position="right" 
                                    :step="0.1"
                                    step-strictly
                                    @change="saveData('direction.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="强度：">
                        <el-slider 
                            v-model="light.intensity"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('intensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="强度模式：">
                        <el-select 
                            v-model="light.intensityMode" 
                            @change="saveData('intensityMode')"
                            placeholder="请选择强度模式"
                        >
                            <el-option label="自动" :value="0"></el-option>
                            <el-option label="发光能力" :value="1"></el-option>
                            <el-option label="发光强度" :value="2"></el-option>
                            <el-option label="照明度" :value="3"></el-option>
                            <el-option label="亮度" :value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="范围：">
                        <el-input-number 
                            v-model="light.range" 
                            controls-position="right" 
                            :min="0"
                            step-strictly
                            @change="saveData('range')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="漫反射颜色：">
                        <el-color-picker 
                            v-model="light.diffuse"
                            color-format="rgb"
                            @change="saveData('diffuse')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="镜面反射颜色：">
                        <el-color-picker 
                            v-model="light.specular"
                            color-format="rgb"
                            @change="saveData('specular')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="启用排除物体：">
                        <el-switch 
                            v-model="light.enableExcludedMeshesIds"
                            @change="saveData('enableExcludedMeshesIds')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="排除物体：" v-if="light.enableExcludedMeshesIds">
                        <el-row v-for="(item, index) in light.excludedMeshesIds" :key="index">
                            物体{{index + 1}}
                            <el-button type="primary" @click="openAddMeshIDDialog('excludedMeshesIds', 'edit', index)">编辑</el-button>
                        </el-row>
                        <el-button type="primary" @click="openAddMeshIDDialog('excludedMeshesIds', 'new')">新增</el-button>
                    </el-form-item>
                    <el-form-item label="仅包含物体：" v-if="!light.enableExcludedMeshesIds">
                        <el-row v-for="(item, index) in light.includedOnlyMeshesIds" :key="index">
                            物体{{index + 1}}
                            <el-button type="primary" @click="openAddMeshIDDialog('includedOnlyMeshesIds', 'edit', index)">编辑</el-button>
                        </el-row>
                        <el-button type="primary" @click="openAddMeshIDDialog('includedOnlyMeshesIds', 'new')">新增</el-button>
                    </el-form-item>
                    <el-form-item label="开启光晕：">
                        <el-switch 
                            v-model="light.enableLensFlare"
                            @change="saveData('enableLensFlare')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="光晕：" v-if="light.enableLensFlare">
                        <el-row v-for="(item, index) in light.lensFlareSystem" :key="index">
                            光晕{{index + 1}}
                            <el-button type="primary" @click="openAddLensFlareDialog('edit', index)">编辑</el-button>
                            <el-button type="text" @click="deleteArrayItem(light.lensFlareSystem, index, 'lensFlareSystem')">删除</el-button>
                        </el-row>
                        <el-button type="primary" @click="openAddLensFlareDialog('new')">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="灯光专属配置" name="2">
                <el-form ref="form" :model="light" label-width="100px" size="mini" @submit.native.prevent>
                    <el-form-item label="底色：" v-if="hasKey('groundColor')">
                        <el-color-picker 
                            v-model="light.groundColor"
                            color-format="rgb"
                            @change="saveData('groundColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="角度：" v-if="hasKey('angle')">
                        <el-slider 
                            v-model="light.angle"
                            :min="-2"
                            :max="2"
                            :step="0.1"
                            @change="saveData('angle')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="指数：" v-if="hasKey('exponent')">
                        <el-input-number 
                            v-model="light.exponent" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            step-strictly
                            @change="saveData('exponent')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="开启阴影：" v-if="hasKey('enableShadow')">
                        <el-switch 
                            v-model="light.enableShadow"
                            @change="saveData('enableShadow')"
                        >
                        </el-switch>
                    </el-form-item>
                    <div v-if="light.enableShadow">
                        <el-form-item label="阴影质量：">
                            <el-slider 
                                v-model="light.shadowQuality"
                                :min="16"
                                :max="5120"
                                :step="16"
                                @change="saveData('shadowQuality')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="阴影物体：">
                            <el-row v-for="(item, index) in light.shadowRenderList" :key="index">
                                物体{{index + 1}}
                                <el-button type="primary" @click="openAddMeshIDDialog('shadowRenderList', 'edit', index)">编辑</el-button>
                            </el-row>
                            <el-button type="primary" @click="openAddMeshIDDialog('shadowRenderList', 'new')">新增</el-button>
                        </el-form-item>
                        <el-form-item label="开启泊松采样：">
                            <el-switch 
                                v-model="light.usePoissonSampling"
                                @change="saveData('usePoissonSampling')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="开启指数阴影：">
                            <el-switch 
                                v-model="light.useExponentialShadowMap"
                                @change="saveData('useExponentialShadowMap')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="开启指数阴影模糊：">
                            <el-switch 
                                v-model="light.useBlurExponentialShadowMap"
                                @change="saveData('useBlurExponentialShadowMap')"
                            >
                            </el-switch>
                        </el-form-item>
                        <div v-if="light.useBlurExponentialShadowMap">
                            <el-form-item label="模糊体积：">
                                <el-input-number 
                                    v-model="light.blurScale" 
                                    controls-position="right" 
                                    :min="0"
                                    step-strictly
                                    @change="saveData('blurScale')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="模糊偏移：">
                                <el-input-number 
                                    v-model="light.blurBoxOffset" 
                                    controls-position="right" 
                                    :min="0"
                                    step-strictly
                                    @change="saveData('blurBoxOffset')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="开启模糊核心：">
                                <el-switch 
                                    v-model="light.useKernelBlur"
                                    @change="saveData('useKernelBlur')"
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="模糊系数：" v-if="light.useKernelBlur">
                                <el-slider 
                                    v-model="light.blurKernel"
                                    :min="0"
                                    :max="10"
                                    :step="0.1"
                                    @change="saveData('blurKernel')"
                                >
                                </el-slider>
                            </el-form-item>
                        </div>
                        <el-form-item label="百分比近似滤镜：">
                            <el-switch 
                                v-model="light.usePercentageCloserFiltering"
                                @change="saveData('usePercentageCloserFiltering')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="滤镜质量：">
                            <el-select 
                                v-model="light.filteringQuality" 
                                @change="saveData('filteringQuality')"
                                placeholder="请选择滤镜质量"
                            >
                                <el-option label="高" :value="0"></el-option>
                                <el-option label="中" :value="1"></el-option>
                                <el-option label="低" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="灯光添加动画" name="3">
                <!-- <el-row v-for="(item, index) in light.animations" :key="index">
                    {{item.name}}
                    <el-button type="primary" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
                </el-row>
                <el-button type="primary" size="mini" @click="openAddAnimationDialog('new')">添加</el-button> -->
                <el-row>
                    <el-col :span="8">
                        是否循环：
                    </el-col>
                    <el-col :span="16">
                        <el-switch v-model="light.animationLoop" @change="saveData('animationLoop')"></el-switch>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        动画速度：
                    </el-col>
                    <el-col :span="16">
                        <el-input-number 
                            v-model="light.animationSpeed" 
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
                <el-row v-for="(item, index) in light.animations" :key="index">
                    <el-col :span="12">
                        {{item.name}}
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="deleteArrayItem(light.animations, index, 'animations')">删除</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>

        <!-- 物体弹出框 -->
        <el-dialog
            title="物体"
            :visible.sync="dialogVisible_meshId"
            width="30%"
        >
            <el-select v-model="meshId" clearable placeholder="请选择物体">
                <el-option
                    v-for="item in meshesFilter"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_meshId = false">取 消</el-button>
                <el-button type="primary" @click="addMeshId">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 光晕弹出框 -->
        <el-dialog
            title="光晕"
            :visible.sync="dialogVisible_lensFlare"
            width="30%"
        >
            <el-form ref="form" :model="lensFlareObj" label-width="80px" size="mini" @submit.native.prevent>
                <el-form-item label="体积：">
                    <el-slider 
                        v-model="lensFlareObj.lensFlareSize"
                        :min="0"
                        :max="1"
                        :step="0.01"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="位置：">
                    <el-slider 
                        v-model="lensFlareObj.lensFlarePosition"
                        :min="-5"
                        :max="5"
                        :step="0.01"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="颜色：">
                    <el-color-picker 
                        v-model="lensFlareObj.lensFlareColor"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
                <el-form-item label="图片：">
                    <el-upload
                        class="upload-source"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :on-progress="handleSourceSuccess"
                        :before-upload="beforeSourceUpload"
                    >
                        <img v-if="lensFlareObj.lensFlareImg" :src="lensFlareObj.lensFlareImg" class="sourceImg">
                        <i v-else class="el-icon-plus source-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_lensFlare = false">取 消</el-button>
                <el-button type="primary" @click="addLensFlare">确 定</el-button>
            </span>
        </el-dialog>

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
    import { updateObjectView, addMaterialView } from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';
    import animation from '@/master/animation';
    import { animationDatas,flareBase64,flare2Base64,flare3Base64 } from '@/master/js/meshData';

    export default {
        data: () => ({
            name: 'lightSetting',
            activeNames: ['1'],

            dialogVisible_meshId: false,  //物体弹出框显示
            meshId: '',  //添加物体id
            dialog_addMeshId_type: null,  //排除物体 或 仅包含物体 或 阴影物体
            dialog_addMeshId_method: null,  //新增 或 编辑
            dialog_addMeshId_index: null,  //编辑索引

            dialogVisible_lensFlare: false,  //光晕弹出框显示
            lensFlareObj_default: {  //光晕对象默认值
                lensFlareSize: 0.1, //体积，0-1，步长0.01
                lensFlarePosition: 0.1, //位置，-1-1，步长0.01，
                lensFlareColor: 'rgb(255,255,255)', //颜色
                lensFlareImg: '', //图片base64
            },
            lensFlareObj: {},  //光晕对象
            dialog_lensFlare_method: null,  //新增 或 编辑
            dialog_lensFlare_index: null,  //编辑索引

            dialogVisible_animation: false,  //添加动画弹出框
            dialogTitle_animation: '',  //添加动画弹出框标题
            dialog_animation_property: [],  //添加动画的属性
            animationObj: null,  //动画对象
            animationProperty: null,  //属性详情
            dialog_animation_method: null,  //新增 或 编辑
            dialog_animation_index: null,  //编辑索引
            light:null,
        }),
        components: {
            animation,
        },
        watch:{
            lightCom: {
                handler(nv, ov) {
                    this.light = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed:{
            lightCom(){ //灯光对象
                let curLightId = getState('master', 'curLightId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'lights',
                    id: curLightId
                });

                if(object){
                    return deepCopy(object);
                }

                return null;
            },
            meshes(){ //已创建的物体库
                return getState('master', 'meshes');
            },
            meshesFilter(){ //添加物体时 筛选物体库
                let data = deepCopy(this.meshes);

                let hasArr = [];
                if(this.dialog_addMeshId_method == 'new'){
                    hasArr = this.light[this.dialog_addMeshId_type];
                }

                data = data.filter(item => {
                    if(hasArr.includes(item.id)){
                        return false;
                    }

                    return true;
                })

                return data;
            },
        },
        methods: {
            deleteArrayItem(data, index, saveKey){
                data.splice(index, 1);
                this.saveData(saveKey);
            },
            handleChange(){

            },
            hasKey(keyName){
                if(this.light == null){
                    return false;
                }

                return (keyName in this.light);
            },
            openAddMeshIDDialog(type, method, index){
                this.dialog_addMeshId_type = type;
                this.dialog_addMeshId_method = method;
                this.dialog_addMeshId_index = index;

                if(method == 'new'){
                    this.meshId = '';
                }
                else if(method == 'edit'){
                    this.meshId = this.light[type][index];
                }

                this.dialogVisible_meshId = true;
            },
            addMeshId(){
                if(this.meshId == null){
                    this.meshId = '';
                }

                if(this.dialog_addMeshId_method == 'new'){
                    if(this.meshId == ''){
                        this.dialogVisible_addMeshId = false;
                        return;
                    }

                    this.light[this.dialog_addMeshId_type].push(this.meshId);
                }
                else if(this.dialog_addMeshId_method == 'edit'){
                    if(this.meshId == ''){
                        this.light[this.dialog_addMeshId_type].splice(this.dialog_addMeshId_index, 1);
                    }
                    else{
                        this.light[this.dialog_addMeshId_type][this.dialog_addMeshId_index] = this.meshId;
                    }
                }

                this.saveData(this.dialog_addMeshId_type);
                this.dialogVisible_meshId = false;
            },
            openAddLensFlareDialog(method, index){
                this.dialog_lensFlare_method = method;

                if(method == 'new'){
                    this.lensFlareObj = deepCopy(this.lensFlareObj_default);
                }
                else if(method == 'edit'){
                    this.lensFlareObj = deepCopy(this.light.lensFlareSystem[index]);
                    this.dialog_lensFlare_index = index;
                }

                this.dialogVisible_lensFlare = true;
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
                    _this.lensFlareObj.lensFlareImg = e.target.result;
			    }
			    a.readAsDataURL(file.raw);
            },
            addLensFlare(){
                if(this.dialog_lensFlare_method == 'new'){
                    this.light.lensFlareSystem.push(this.lensFlareObj);
                }
                else if(this.dialog_lensFlare_method == 'edit'){
                    this.light.lensFlareSystem[this.dialog_lensFlare_index] = this.lensFlareObj;
                }

                this.saveData('lensFlareSystem');    
                this.dialogVisible_lensFlare = false;
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

                    let ani = this.light.animations[index];
                    let p1 = ani.property.split('.')[0];

                    this.animationObj = deepCopy(ani);
                    this.animationProperty = deepCopy(animationDatas['light'][p1]);
                    this.dialogTitle_animation = '动画--' + this.animationProperty.propertyName;
                }

                this.dialogVisible_animation = true;
            },
            animationPropertyFilter(){
                let data = [];
                let animationData = animationDatas['light'];

                for(let key in this.light){
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
                    name: '动画' + this.light.animations.length,
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
                this.animationProperty = deepCopy(animationDatas['light'][p1]);

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
                    ani.id = generateRandomKey("lightAni");
                    this.light.animations.push(ani);
                }
                else if(this.dialog_animation_method == 'edit'){
                    this.light.animations[this.dialog_animation_index] = ani;
                }

                this.saveData('animations');
                this.dialogVisible_animation = false;
            },
            saveData(type){
                let lights = getState('master', 'lights');
                let curLightId = getState('master', 'curLightId'); 

                let index = 0;
                for(let i = 0; i < lights.length; i++){
                    if(lights[i].id == curLightId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(lights[index]);

                let value = this.light[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.light[item];
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

                if(updateType=="enableLensFlare"){
                    let data = [
                        {
                            "lensFlareSize": 0.2, 
                            "lensFlarePosition": 0, 
                            "lensFlareColor": "rgb(255,255,255)", 
                            "lensFlareImg": flare2Base64, //图片base64 
                        },
                        {
                            "lensFlareSize": 0.5, 
                            "lensFlarePosition": 0.2, 
                            "lensFlareColor": "rgb(128,128,255)", 
                            "lensFlareImg": flare3Base64, //图片base64 
                        },
                        {
                            "lensFlareSize": 0.2, 
                            "lensFlarePosition": 1, 
                            "lensFlareColor": "rgb(255,255,255)", 
                            "lensFlareImg": flare3Base64, //图片base64 
                        },
                        {
                            "lensFlareSize": 0.4, 
                            "lensFlarePosition": 0.4, 
                            "lensFlareColor": "rgb(255,128,255)", 
                            "lensFlareImg": flareBase64, //图片base64 
                        },
                        {
                            "lensFlareSize": 0.1, 
                            "lensFlarePosition": 0.6, 
                            "lensFlareColor": "rgb(255,255,255)", 
                            "lensFlareImg": flare2Base64, //图片base64 
                        },
                        {
                            "lensFlareSize": 0.3, 
                            "lensFlarePosition": 0.8, 
                            "lensFlareColor": "rgb(255,255,255)", 
                            "lensFlareImg": flare3Base64, //图片base64 
                        },
                    ];

                    let curSystem = this.light["lensFlareSystem"];
                    if(value){
                        if(curSystem.length==0){
                            data.forEach(item=>{
                                this.light["lensFlareSystem"].push(item);
                            });

                            this.$store.commit('master/updateCommands', {
                                key: 'lights.${'+ index +'}.lensFlareSystem',
                                value: this.light["lensFlareSystem"]
                            });
                        }
                    }
                    else{
                        if(curSystem.length==data.length){
                            let equalAll = true;
                            for(let i=0;i<data.length;i++){
                                let curItem = curSystem[i], dataItem = data[i];
                                for(let key in curItem){
                                    if(curItem[key]!=dataItem[key]){
                                        equalAll = false;
                                        break;
                                    }
                                }

                                if(!equalAll){
                                    break;
                                }
                            }

                            if(equalAll){
                                // lights[index]["lensFlareSystem"] = [];
                                this.$store.commit('master/updateCommands', {
                                    key: 'lights.${'+ index +'}.lensFlareSystem',
                                    value: []
                                });
                                this.light["lensFlareSystem"] = [];
                            }
                        }
                    }
                }
                
                this.$store.commit('master/updateCommands', {
                    key: 'lights.${'+ index +'}.' + updateType,
                    value: this.light[updateType]
                });

                // this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.light, index, preObject);
            },
        },
    }
</script>

<style lang="scss">
    .lightSetting{
        padding-left: 10px;
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