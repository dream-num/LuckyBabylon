<template>
    <div class="particleSetting">
        <!-- <div style="padding: 5px;position: absolute;top: 0px;width: 100%;background:#983827;height: 28px;">
            <el-row>
                <el-col :span="12">
                    <template>
                        <el-select 
                            v-model="curParticleId" 
                            @change="gotoPage(curParticleId)" 
                            placeholder="选择粒子发射器" 
                            size="mini"
                        >
                            <el-option 
                                v-for="item in particleSystemSet" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="6" style="text-align: center">
                    <el-button 
                        @click="removeParticleSystem(particleSystemSet, curParticleIndex)" 
                        plain 
                        size="mini" 
                        style="width: 100%;"
                    >
                        删除
                    </el-button>
                </el-col>
                <el-col :span="6" style="text-align: center">
                    <el-button 
                        size="mini" 
                        type="primary" 
                        style="padding-left:5px;padding-right:5px;" 
                        @click="handleOpenDownLoad"
                    >
                        下载配置
                    </el-button>
                </el-col>
            </el-row>
        </div> -->

        <div v-if="curPs" style="position: absolute;top: 38px; bottom: 38px;left:0px;right:0px;overflow-y: auto;" class="msConfig">
            <el-collapse v-model="activeNames" @change="handleChange" accordion>
                <el-collapse-item title="粒子基本配置" name="1">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="粒子名称：">
                            <el-input 
                                v-model="curPs.name" 
                                @change="saveData('name')"
                                placeholder="请输入名称" 
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item label="同屏数量上限：">
                            <el-input-number 
                                v-model="curPs.capacity" 
                                :min="0"
                                step-strictly
                                @change="saveData('capacity')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="渲染模式：">
                            <el-select 
                                v-model="curPs.blendMode" 
                                @change="saveData('blendMode')"
                                placeholder="请选择"
                            >
                                <el-option
                                    v-for="item in blendModeOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开启正反面设置：">
                            <el-switch
                                v-model="curPs.isBillboardBased"
                                active-color="#13ce66"
                                inactive-color="#ff4949" 
                                @change="saveData('isBillboardBased')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="粒子正反面：">
                            <el-select 
                                v-model="curPs.billboardMode" 
                                @change="saveData('billboardMode')"
                                placeholder="请选择" 
                                style="width: 50%;"
                            >
                                <el-option
                                    v-for="item in billboardModeOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="重力场：">
                            <el-tooltip content="开启重力场设置" placement="top">
                                <el-popover
                                    placement="left"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">X方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.gravity[0]" 
                                                vertical 
                                                height="150px" 
                                                @change="saveData('gravity.${0}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.gravity[0]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="saveData('gravity.${0}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.gravity[1]" 
                                                vertical 
                                                height="150px" 
                                                @change="saveData('gravity.${1}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.gravity[1]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="saveData('gravity.${1}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.gravity[2]" 
                                                vertical 
                                                height="150px" 
                                                @change="saveData('gravity.${2}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.gravity[2]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="saveData('gravity.${2}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                    </el-row>
                                    <el-button size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.gravity)}}</el-button>
                                </el-popover>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="开启序列帧动画：">
                            <el-switch
                                v-model="curPs.isAnimationSheetEnabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949" 
                                @change="saveData('isAnimationSheetEnabled')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="粒子贴图：">
                            <el-upload
                                class="avatar-uploader"
                                :show-file-list="false"
                                action=""
                                :on-progress="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload"
                            >
                                <img id="myParticle" v-if="curPs.textureName" :src="curPs.textureName" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="序列帧宽度：" v-show="curPs.isAnimationSheetEnabled">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="1" 
                                :max="300" 
                                :min="0"  
                                v-model="curPs.spriteCellWidth" 
                                @change="saveData('spriteCellWidth')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="序列帧高度：" v-show="curPs.isAnimationSheetEnabled">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="1" 
                                :max="300" 
                                :min="0"  
                                v-model="curPs.spriteCellHeight" 
                                @change="saveData('spriteCellHeight')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="序列帧开始编号：" v-show="curPs.isAnimationSheetEnabled">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="1" 
                                :max="100" 
                                :min="0"  
                                v-model="curPs.startSpriteCellID" 
                                @change="saveData('startSpriteCellID')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="序列帧结束编号：" v-show="curPs.isAnimationSheetEnabled">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="1" 
                                :max="100" 
                                :min="0"  
                                v-model="curPs.endSpriteCellID" 
                                @change="saveData('endSpriteCellID')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="序列帧播放速度：" v-show="curPs.isAnimationSheetEnabled">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="50" 
                                :min="0"  
                                v-model="curPs.spriteCellChangeSpeed" 
                                @change="saveData('spriteCellChangeSpeed')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="是否随机播放：" v-show="curPs.isAnimationSheetEnabled">
                            <el-switch
                                v-model="curPs.spriteRandomStartCell"
                                active-color="#13ce66"
                                inactive-color="#ff4949" 
                                @change="saveData('spriteRandomStartCell')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="贴图消除背景：">
                            <el-color-picker
                                v-model="curPs.textureMask" 
                                @change="saveData('textureMask')"
                                show-alpha
                            >
                            </el-color-picker>
                        </el-form-item>

                        <el-form-item label="发射模式：">
                            <el-select v-model="curPs.emitterMode" placeholder="选择发射模式" size="mini"  @change="saveData('emitterMode')">
                                <el-option v-for="item in emitterModeList" :key="item.label" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="发射对象：" v-if="curPs.emitterMode==1">
                            <el-select v-model="curPs.emitterObject" placeholder="选择发射对象" size="mini" @change="saveData('emitterObject')">
                                <el-option 
                                    v-for="item in emitterObjects" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="发射位置：" v-if="curPs.emitterMode==0">
                            <el-tooltip content="发射位置调整" placement="top">
                                <el-popover
                                    placement="left"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">X方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.emitter[0]" 
                                                vertical 
                                                height="150px" 
                                                @change="saveData('emitter.${0}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.emitter[0]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="saveData('emitter.${0}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.emitter[1]" 
                                                vertical 
                                                height="150px" 
                                                @change="saveData('emitter.${1}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.emitter[1]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="saveData('emitter.${1}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.emitter[2]" 
                                                vertical 
                                                height="150px" 
                                                @change="saveData('emitter.${2}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.emitter[2]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="saveData('emitter.${2}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                    </el-row>
                                    <el-button size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.emitter)}}</el-button>
                                </el-popover>
                            </el-tooltip>
                        </el-form-item>

                        <el-form-item label="发射子粒子：" v-if="subParticleSystemSet.length>0">
                            <el-select v-model="curPs.subEmitters" multiple placeholder="请选择" @change="saveData('subEmitters')">
                                <el-option
                                v-for="item in subParticleSystemSet"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="专有(相机发射)" name="2" v-if="curPs.cameraEmitter">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="发射方向1：">
                            <el-tooltip content="粒子方向1，受重力影响" placement="top">
                                <el-popover
                                    placement="left"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">X方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.direction1[0]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeDirection1('direction1.${0}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.direction1[0]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeDirection1('direction1.${0}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.direction1[1]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeDirection1('direction1.${1}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.direction1[1]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeDirection1('direction1.${1}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.direction1[2]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeDirection1('direction1.${2}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.direction1[2]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeDirection1('direction1.${2}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                    </el-row>
                                    <el-button style="background-color:rgb(255, 0, 255);border-color: #a000a0;" size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.direction1)}}</el-button>
                                </el-popover>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="发射方向2：">
                            <el-tooltip content="粒子方向2，受重力影响" placement="top">
                                <el-popover
                                    placement="left"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">X方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.direction2[0]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeDirection2('direction2.${0}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.direction2[0]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeDirection2('direction2.${0}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.direction2[1]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeDirection2('direction2.${1}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.direction2[1]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeDirection2('direction2.${1}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.direction2[2]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeDirection2('direction2.${2}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.direction2[2]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeDirection2('direction2.${2}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                    </el-row>
                                    <el-button style="background-color:rgb(220, 220, 15);border-color: #adad07;" size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.direction2)}}</el-button>
                                </el-popover>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="最小发射范围：">
                            <el-tooltip content="为左下角靠前的坐标" placement="top">
                                <el-popover
                                    placement="left"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">X方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.minEmitBox[0]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeEmitBox('minEmitBox.${0}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.minEmitBox[0]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeEmitBox('minEmitBox.${0}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.minEmitBox[1]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeEmitBox('minEmitBox.${1}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.minEmitBox[1]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeEmitBox('minEmitBox.${1}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.minEmitBox[2]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeEmitBox('minEmitBox.${2}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.minEmitBox[2]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeEmitBox('minEmitBox.${2}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                    </el-row>
                                    <el-button size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.minEmitBox)}}</el-button>
                                </el-popover>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="最大发射范围：">
                            <el-tooltip content="为右上角靠后的坐标" placement="top">
                                <el-popover
                                    placement="left"
                                    width="300"
                                    trigger="click"
                                >
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">X方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                        <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.maxEmitBox[0]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeEmitBox('maxEmitBox.${0}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.maxEmitBox[0]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeEmitBox('maxEmitBox.${0}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.maxEmitBox[1]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeEmitBox('maxEmitBox.${1}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.maxEmitBox[1]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeEmitBox('maxEmitBox.${1}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                        <el-col :span="8" style="text-align: center;">
                                            <el-slider 
                                                style="left: 30px;" 
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000" 
                                                v-model="curPs.maxEmitBox[2]" 
                                                vertical 
                                                height="150px" 
                                                @change="changeEmitBox('maxEmitBox.${2}')"
                                            >
                                            </el-slider>
                                            <el-input-number 
                                                style="width:90px" 
                                                controls-position="right"  
                                                :step="0.1" 
                                                :max="1000" 
                                                :min="-1000"  
                                                v-model="curPs.maxEmitBox[2]" 
                                                placeholder="X方向" 
                                                size="mini" 
                                                @change="changeEmitBox('maxEmitBox.${2}')"
                                            >
                                            </el-input-number>
                                        </el-col>
                                    </el-row>
                                    <el-button size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.maxEmitBox)}}</el-button>
                                </el-popover>
                            </el-tooltip>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item :title="'专有('+ curPs.particleEmitterType.type.replace('ParticleEmitter', '') +')'" name="3" v-if="curPs.particleEmitterType.type">
                    <el-form ref="form" :model="curPs.particleEmitterType" label-width="120px" size="mini" @submit.native.prevent>
                        <div v-if="curPs.particleEmitterType.type=='PointParticleEmitter' ||  curPs.particleEmitterType.type=='BoxParticleEmitter'  || curPs.particleEmitterType.type=='SphereDirectedParticleEmitter' || curPs.particleEmitterType.type=='CylinderDirectedParticleEmitter'">
                            <el-form-item label="发射方向1：">
                                <el-tooltip content="粒子方向1，受重力影响" placement="top">
                                    <el-popover
                                        placement="left"
                                        width="300"
                                        trigger="click"
                                    >
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">X方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.direction1[0]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeDirection1('particleEmitterType.direction1.${0}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.direction1[0]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeDirection1('particleEmitterType.direction1.${0}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.direction1[1]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeDirection1('particleEmitterType.direction1.${1}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.direction1[1]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeDirection1('particleEmitterType.direction1.${1}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.direction1[2]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeDirection1('particleEmitterType.direction1.${2}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.direction1[2]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeDirection1('particleEmitterType.direction1.${2}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                        </el-row>
                                        <el-button style="background-color:rgb(255, 0, 255);border-color: #a000a0;" size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.particleEmitterType.direction1)}}</el-button>
                                    </el-popover>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="发射方向2：">
                                <el-tooltip content="粒子方向2，受重力影响" placement="top">
                                    <el-popover
                                        placement="left"
                                        width="300"
                                        trigger="click"
                                    >
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">X方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.direction2[0]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeDirection2('particleEmitterType.direction2.${0}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.direction2[0]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeDirection2('particleEmitterType.direction2.${0}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.direction2[1]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeDirection2('particleEmitterType.direction2.${1}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.direction2[1]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeDirection2('particleEmitterType.direction2.${1}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.direction2[2]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeDirection2('particleEmitterType.direction2.${2}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.direction2[2]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeDirection2('particleEmitterType.direction2.${2}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                        </el-row>
                                        <el-button style="background-color:rgb(220, 220, 15);border-color: #adad07;" size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.particleEmitterType.direction2)}}</el-button>
                                    </el-popover>
                                </el-tooltip>
                            </el-form-item>
                        </div>
                        <div v-if="curPs.particleEmitterType.type=='BoxParticleEmitter'">
                            <el-form-item label="最小发射范围：">
                                <el-tooltip content="为左下角靠前的坐标" placement="top">
                                    <el-popover
                                        placement="left"
                                        width="300"
                                        trigger="click"
                                    >
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">X方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.minEmitBox[0]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeEmitBox('particleEmitterType.minEmitBox.${0}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.minEmitBox[0]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeEmitBox('particleEmitterType.minEmitBox.${0}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.minEmitBox[1]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeEmitBox('particleEmitterType.minEmitBox.${1}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.minEmitBox[1]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeEmitBox('particleEmitterType.minEmitBox.${1}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.minEmitBox[2]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeEmitBox('particleEmitterType.minEmitBox.${2}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.minEmitBox[2]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeEmitBox('particleEmitterType.minEmitBox.${2}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                        </el-row>
                                        <el-button size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.particleEmitterType.minEmitBox)}}</el-button>
                                    </el-popover>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="最大发射范围：">
                                <el-tooltip content="为右上角靠后的坐标" placement="top">
                                    <el-popover
                                        placement="left"
                                        width="300"
                                        trigger="click"
                                    >
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">X方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.maxEmitBox[0]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeEmitBox('particleEmitterType.maxEmitBox.${0}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.maxEmitBox[0]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeEmitBox('particleEmitterType.maxEmitBox.${0}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.maxEmitBox[1]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeEmitBox('particleEmitterType.maxEmitBox.${1}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.maxEmitBox[1]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeEmitBox('particleEmitterType.maxEmitBox.${1}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000" 
                                                    v-model="curPs.particleEmitterType.maxEmitBox[2]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="changeEmitBox('particleEmitterType.maxEmitBox.${2}', true)"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="1000" 
                                                    :min="-1000"  
                                                    v-model="curPs.particleEmitterType.maxEmitBox[2]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="changeEmitBox('particleEmitterType.maxEmitBox.${2}', true)"
                                                >
                                                </el-input-number>
                                            </el-col>
                                        </el-row>
                                        <el-button size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.particleEmitterType.maxEmitBox)}}</el-button>
                                    </el-popover>
                                </el-tooltip>
                            </el-form-item>
                        </div>
                        <div v-if="curPs.particleEmitterType.type=='SphereParticleEmitter' || curPs.particleEmitterType.type=='SphereDirectedParticleEmitter' || curPs.particleEmitterType.type=='HemisphericParticleEmitter' || curPs.particleEmitterType.type=='CylinderParticleEmitter' || curPs.particleEmitterType.type=='CylinderDirectedParticleEmitter' || curPs.particleEmitterType.type=='ConeParticleEmitter'">
                            <el-form-item label="半径：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="1000" 
                                    :min="0"  
                                    v-model="curPs.particleEmitterType.radius" 
                                    placeholder="半径" 
                                    size="mini" 
                                    @change="changeRadius('particleEmitterType.radius')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="半径发射位：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="1" 
                                    :min="0"  
                                    v-model="curPs.particleEmitterType.radiusRange" 
                                    placeholder="半径发射位" 
                                    size="mini" 
                                    @change="saveData('particleEmitterType.radiusRange')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="位置变化因子：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="1" 
                                    :min="0"  
                                    v-model="curPs.particleEmitterType.directionRandomizer" 
                                    placeholder="位置随机变化" 
                                    size="mini" 
                                    @change="saveData('particleEmitterType.directionRandomizer')"
                                >
                                </el-input-number>
                            </el-form-item>
                        </div>
                        <div v-if="curPs.particleEmitterType.type=='CylinderParticleEmitter' || curPs.particleEmitterType.type=='CylinderDirectedParticleEmitter'">
                            <el-form-item label="高度：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="1000" 
                                    :min=0  
                                    v-model="curPs.particleEmitterType.height" 
                                    placeholder="高度" 
                                    size="mini" 
                                    @change="changeRadius('particleEmitterType.height')"
                                >
                                </el-input-number>
                            </el-form-item>
                        </div>
                        <div v-if="curPs.particleEmitterType.type=='ConeParticleEmitter'">
                            <el-form-item label="角度：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="1000" 
                                    :min="-1000"  
                                    v-model="curPs.particleEmitterType.angle" 
                                    placeholder="角度" 
                                    size="mini" 
                                    @change="changeRadius('particleEmitterType.angle')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="高度发射位：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="1" 
                                    :min=0  
                                    v-model="curPs.particleEmitterType.heightRange" 
                                    placeholder="高度发射位" 
                                    size="mini" 
                                    @change="saveData('particleEmitterType.heightRange')"
                                >
                                </el-input-number>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="大小设置(单位：3D)" name="4">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="粒子最小体积：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="1000" 
                                :min="0"  
                                v-model="curPs.minSize" 
                                placeholder="最小体积" 
                                size="mini" 
                                @change="saveData('minSize')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="粒子最大体积：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="1000" 
                                :min=0  
                                v-model="curPs.maxSize" 
                                placeholder="最大体积" 
                                size="mini" 
                                @change="saveData('maxSize')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="体积变化渐进：">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('sizeGradients')">添加</el-button>
                                <el-tooltip placement="top" content="可以控制粒子体积大小按照渐进规则变化">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.sizeGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('sizeGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max=1 
                                            :min=0 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('sizeGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="体积渐进值1">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max=300 
                                            :min=0  
                                            v-model="item.factor1" 
                                            placeholder="体积渐进值1" 
                                            size="mini" 
                                            @change="saveData('sizeGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="体积渐进值2(可选)">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max=300 
                                            :min=0 
                                            v-model="item.factor2" 
                                            placeholder="体积渐进值2" 
                                            size="mini" 
                                            @change="saveData('sizeGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="最小X轴拉伸：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.minScaleX" 
                                placeholder="最小体积" 
                                size="mini" 
                                @change="saveData('minScaleX')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最大X轴拉伸：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.maxScaleX" 
                                placeholder="最大体积" 
                                size="mini" 
                                @change="saveData('maxScaleX')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最小Y轴拉伸：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.minScaleY" 
                                placeholder="最小体积" 
                                size="mini" 
                                @change="saveData('minScaleY')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最大Y轴拉伸：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.maxScaleY" 
                                placeholder="最大体积" 
                                size="mini" 
                                @change="saveData('maxScaleY')"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="颜色设置(rgba)" name="5">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <div v-if="!(curPs.colorGradients && curPs.colorGradients.length > 0)">
                            <el-form-item label="粒子颜色1：">
                                <el-color-picker 
                                    v-model="curPs.color1" 
                                    show-alpha 
                                    @change="saveData('color1')"
                                >
                                </el-color-picker>
                            </el-form-item>
                            <el-form-item label="粒子颜色2：">
                                <el-color-picker 
                                    v-model="curPs.color2" 
                                    show-alpha 
                                    @change="saveData('color2')"
                                >
                                </el-color-picker>
                            </el-form-item>
                            <el-form-item label="粒子消失颜色：">
                                <el-color-picker 
                                    v-model="curPs.colorDead" 
                                    show-alpha 
                                    @change="saveData('colorDead')"
                                >
                                </el-color-picker>
                            </el-form-item>
                        </div>
                        <el-form-item label="颜色渐进：">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('colorGradients')">添加</el-button>
                                <el-tooltip placement="top" content="可以控制粒子颜色渐进变化，设置后color1 color2 colorDead失效">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.colorGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('colorGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max=1 
                                            :min=0 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('colorGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1" style="text-align: center;">
                                    <el-tooltip placement="top" content="颜色渐进值1">
                                        <el-color-picker 
                                            style="display:block;"
                                            size="mini" 
                                            v-model="item.color1" 
                                            show-alpha
                                            @change="saveData('colorGradients')"
                                        >
                                        </el-color-picker>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1" style="text-align: center;">
                                    <el-tooltip placement="top" content="颜色渐进值2(可选)">
                                        <el-color-picker 
                                            style="display:block;"
                                            size="mini" 
                                            v-model="item.color2" 
                                            show-alpha
                                            @change="saveData('colorGradients')"
                                        >
                                        </el-color-picker>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="粒子发射设置(个)" name="6">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <div v-if="!(curPs.emitRateGradients && curPs.emitRateGradients.length > 0)">
                            <el-form-item label="发射数量：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="1" 
                                    :max="5000" 
                                    :min="0"  
                                    v-model="curPs.emitRate" 
                                    @change="saveData('emitRate')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="同时存在粒子数量：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="1" 
                                    :max="5000" 
                                    :min="-1"  
                                    v-model="curPs.manualEmitCount" 
                                    @change="saveData('manualEmitCount')"
                                >
                                </el-input-number>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="生命周期(单位：秒)" name="7">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="最小存活时间：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="150" 
                                :min="0"  
                                v-model="curPs.minLifeTime" 
                                @change="saveData('minLifeTime')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最大存活时间：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="150" 
                                :min="0"  
                                v-model="curPs.maxLifeTime" 
                                @change="saveData('maxLifeTime')"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="速度相关" name="8">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="最小发射强度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="15" 
                                :min="-15"  
                                v-model="curPs.minEmitPower" 
                                @change="saveData('minEmitPower')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最大发射强度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="15" 
                                :min="-15"  
                                v-model="curPs.maxEmitPower" 
                                @change="saveData('maxEmitPower')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="更新速度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.001" 
                                :max="5" 
                                :min="0"  
                                v-model="curPs.updateSpeed" 
                                @change="saveData('updateSpeed')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="速度渐进：" style="border:1px solid #f2f2f2;margin-bottom: 2px;">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('velocityGradients')">添加</el-button>
                                <el-tooltip placement="top" content="按照渐进的设置影响粒子的速度">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.velocityGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('velocityGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('velocityGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="速度渐进值1">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="15" 
                                            :min="-15"  
                                            v-model="item.factor1" 
                                            placeholder="速度渐进值1" 
                                            size="mini" 
                                            @change="saveData('velocityGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="速度渐进值2(可选)">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="15" 
                                            :min="-15" 
                                            v-model="item.factor2" 
                                            placeholder="速度渐进值2" 
                                            size="mini" 
                                            @change="saveData('velocityGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="限速渐进：" style="border:1px solid #f2f2f2;margin-bottom: 2px;">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('limitVelocityGradients')">添加</el-button>
                                <el-tooltip placement="top" content="按照渐进的设置限制粒子的速度变化">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.limitVelocityGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('limitVelocityGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('limitVelocityGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="限速渐进值1">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max=15 
                                            :min="0"  
                                            v-model="item.factor1" 
                                            placeholder="限速渐进值1" 
                                            size="mini" 
                                            @change="saveData('limitVelocityGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="限速渐进值2(可选)">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max=15 
                                            :min="0" 
                                            v-model="item.factor2" 
                                            placeholder="限速渐进值2" 
                                            size="mini" 
                                            @change="saveData('limitVelocityGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="摩擦渐进：" style="border:1px solid #f2f2f2;margin-bottom: 2px;">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('dragGradients')">添加</el-button>
                                <el-tooltip placement="top" content="按照渐进的设置为粒子设置一个摩擦系数，从而影响速度">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.dragGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('dragGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('dragGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="摩擦渐进值1">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="15" 
                                            :min="0"  
                                            v-model="item.factor1" 
                                            placeholder="摩擦渐进值1" 
                                            size="mini" 
                                            @change="saveData('dragGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="摩擦渐进值2(可选)">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="15" 
                                            :min="0" 
                                            v-model="item.factor2" 
                                            placeholder="摩擦渐进值2" 
                                            size="mini" 
                                            @change="saveData('dragGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="粒子预热" name="9">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="循序次数：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="1" 
                                :max="300" 
                                :min=0  
                                v-model="curPs.preWarmCycles" 
                                @change="saveData('preWarmCycles')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="预热速度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="1" 
                                :max="20" 
                                :min="0"  
                                v-model="curPs.preWarmStepOffset" 
                                @change="saveData('preWarmStepOffset')"
                            >
                            </el-input-number>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="粒子旋转" name="10">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="最小旋转速度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.minAngularSpeed" 
                                @change="saveData('minAngularSpeed')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最大旋转速度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.maxAngularSpeed" 
                                @change="saveData('maxAngularSpeed')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最小初始旋转角度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.minInitialRotation" 
                                @change="saveData('minInitialRotation')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="最大初始旋转角度：">
                            <el-input-number 
                                style="width:90px" 
                                controls-position="right"  
                                :step="0.1" 
                                :max="10" 
                                :min="-10"  
                                v-model="curPs.maxInitialRotation" 
                                @change="saveData('maxInitialRotation')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="旋转速度渐进：">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('angularSpeedGradients')">添加</el-button>
                                <el-tooltip placement="top" content="按照渐进的设置影响粒子向Z轴旋转">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.angularSpeedGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('angularSpeedGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('angularSpeedGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="摩擦渐进值1">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="10" 
                                            :min="-10"  
                                            v-model="item.factor1" 
                                            placeholder="摩擦渐进值1" 
                                            size="mini" 
                                            @change="saveData('angularSpeedGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="摩擦渐进值2(可选)">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max=10 
                                            :min="-10" 
                                            v-model="item.factor2" 
                                            placeholder="摩擦渐进值2" 
                                            size="mini" 
                                            @change="saveData('angularSpeedGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="色彩倾斜" name="11">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="开启色彩倾斜：">
                            <el-switch
                                v-model="curPs.useRampGradients"
                                active-color="#13ce66"
                                inactive-color="#ff4949" 
                                @change="saveData('useRampGradients')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="倾斜渐进：" v-if="curPs.useRampGradients" style="border:1px solid #f2f2f2;margin-bottom: 2px;">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('rampGradients')">添加</el-button>
                                <el-tooltip placement="top" content="可控制色彩倾斜的倾斜值渐进，达到颜色按规律变化的效果">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.rampGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('rampGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('rampGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1" style="text-align: center;">
                                    <el-tooltip placement="top" content="倾斜渐进值1">
                                        <el-color-picker
                                            style="display:block;"
                                            size="mini" 
                                            color-format="rgb" 
                                            v-model="item.color1"
                                            @change="saveData('rampGradients')"
                                        >
                                        </el-color-picker>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1" style="text-align: center;">
                                    <el-tooltip placement="top" content="倾斜渐进值2(可选)">
                                        <el-color-picker 
                                            style="display:block;"
                                            size="mini" 
                                            color-format="rgb" 
                                            v-model="item.color2"
                                            @change="saveData('rampGradients')"
                                        >
                                        </el-color-picker>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="色彩渐进：" v-if="curPs.useRampGradients" style="border:1px solid #f2f2f2;margin-bottom: 2px;">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('colorRemapGradients')">添加</el-button>
                                <el-tooltip placement="top" content="按照渐进的设置影响粒子颜色状态的改变">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.colorRemapGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('colorRemapGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('colorRemapGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="色彩渐进值1">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0"  
                                            v-model="item.factor1" 
                                            placeholder="色彩渐进值1" 
                                            size="mini" 
                                            @change="saveData('colorRemapGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="色彩渐进值2(可选)">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.factor2" 
                                            placeholder="色彩渐进值2" 
                                            size="mini" 
                                            @change="saveData('colorRemapGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="Alpha渐进：" v-if="curPs.useRampGradients" style="border:1px solid #f2f2f2;margin-bottom: 2px;">
                            <el-row>
                                <el-button size="mini" plain  type="primary" style="width: 50%;" @click="addGradientsItem('alphaRemapGradients')">添加</el-button>
                                <el-tooltip placement="top" content="按照渐进的设置影响粒子颜色状态的改变">
                                    <span style="color: blue;">帮助</span>
                                </el-tooltip>
                            </el-row>
                            <el-row v-for="(item, index) in curPs.alphaRemapGradients" :key="index" style="margin-left:-100px;">
                                <el-col :span="3">
                                    <el-button type="danger" size="mini" icon="el-icon-close" circle @click="removeGradientsItem('alphaRemapGradients', index)"></el-button>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="渐进位置">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.gradient" 
                                            placeholder="渐进位置" 
                                            size="mini" 
                                            @change="saveData('alphaRemapGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="Alpha渐进值1">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0"  
                                            v-model="item.factor1" 
                                            placeholder="Alpha渐进值1" 
                                            size="mini" 
                                            @change="saveData('alphaRemapGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-tooltip placement="top" content="Alpha渐进值2(可选)">
                                        <el-input-number 
                                            style="width:100%;" 
                                            controls-position="right" 
                                            :step="0.1" 
                                            :max="1" 
                                            :min="0" 
                                            v-model="item.factor2" 
                                            placeholder="Alpha渐进值2" 
                                            size="mini" 
                                            @change="saveData('alphaRemapGradients')"
                                        >
                                        </el-input-number>
                                    </el-tooltip>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="噪声影响粒子" name="12">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="启用噪声：">
                            <el-switch
                                :value="curPs.noiseTexture!=null" 
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="enableNoiseTexture"
                            >
                            </el-switch>
                        </el-form-item>
                        <div v-if="curPs.noiseTexture!=null">
                            <el-form-item label="噪声强度设置：" >
                                <el-tooltip placement="top" content="噪声强度设置，影响最大">
                                    <el-popover
                                        placement="left"
                                        width="300"
                                        trigger="click"
                                    >
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">X方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Y方向</el-col>
                                            <el-col :span="8" style="text-align: center;">Z方向</el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="100" 
                                                    :min="-100" 
                                                    v-model="curPs.noiseStrength[0]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="saveData('noiseStrength.${0}')"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="100" 
                                                    :min="-100"  
                                                    v-model="curPs.noiseStrength[0]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="saveData('noiseStrength.${0}')"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="100" 
                                                    :min="-100" 
                                                    v-model="curPs.noiseStrength[1]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="saveData('noiseStrength.${1}')"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="100" 
                                                    :min="-100"  
                                                    v-model="curPs.noiseStrength[1]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="saveData('noiseStrength.${1}')"
                                                >
                                                </el-input-number>
                                            </el-col>
                                            <el-col :span="8" style="text-align: center;">
                                                <el-slider 
                                                    style="left: 30px;" 
                                                    :step="0.1" 
                                                    :max="100" 
                                                    :min="-100" 
                                                    v-model="curPs.noiseStrength[2]" 
                                                    vertical 
                                                    height="150px" 
                                                    @change="saveData('noiseStrength.${2}')"
                                                >
                                                </el-slider>
                                                <el-input-number 
                                                    style="width:90px" 
                                                    controls-position="right"  
                                                    :step="0.1" 
                                                    :max="100" 
                                                    :min="-100"  
                                                    v-model="curPs.noiseStrength[2]" 
                                                    placeholder="X方向" 
                                                    size="mini" 
                                                    @change="saveData('noiseStrength.${2}')"
                                                >
                                                </el-input-number>
                                            </el-col>
                                        </el-row>
                                        <el-button size="mini" type="success" slot="reference">{{ JSON.stringify(curPs.noiseStrength)}}</el-button>
                                    </el-popover>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item label="噪声明亮度：" >
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="1" 
                                    :min="0"  
                                    v-model="curPs.noiseTexture.brightness" 
                                    @change="saveData('noiseTexture.brightness')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="倍频程：" >
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="10" 
                                    :min="0"  
                                    v-model="curPs.noiseTexture.octaves" 
                                    @change="saveData('noiseTexture.octaves')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="持久性：" >
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="4" 
                                    :min="0"  
                                    v-model="curPs.noiseTexture.persistence" 
                                    @change="saveData('noiseTexture.persistence')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="动画速度因子：" >
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.1" 
                                    :max="20" 
                                    :min="0"  
                                    v-model="curPs.noiseTexture.animationSpeedFactor" 
                                    @change="saveData('noiseTexture.animationSpeedFactor')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="噪声体积：" >
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="1" 
                                    :max="512" 
                                    :min="0"  
                                    v-model="curPs.noiseTexture.size" 
                                    @change="saveData('noiseTexture.size')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="生成MipMaps图：" >
                                <el-switch
                                    v-model="curPs.noiseTexture.generateMipMaps"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949" 
                                    @change="saveData('noiseTexture.generateMipMaps')"
                                >
                                </el-switch>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-collapse-item>
                <el-collapse-item title="粒子运动控制" name="13">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="启用运动控制：">
                            <el-switch
                                v-model="curPs.msParticleRomanOn" 
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="saveData('msParticleRomanOn')"
                            >
                            </el-switch>
                        </el-form-item>
                        <div v-if="curPs.msParticleRomanOn">
                            <el-form-item label="X方向改变频率：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.01" 
                                    :max="2" 
                                    :min="-2"  
                                    v-model="curPs.msParticleRomanStepX" 
                                    @change="saveData('msParticleRomanStepX')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="X方向改变速度：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.01" 
                                    :max="2" 
                                    :min="-2"  
                                    v-model="curPs.msParticleRomanSpeedX" 
                                    @change="saveData('msParticleRomanSpeedX')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="Y方向改变频率：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.01" 
                                    :max="2" 
                                    :min="-2"  
                                    v-model="curPs.msParticleRomanStepY" 
                                    @change="saveData('msParticleRomanStepY')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="Y方向改变速度：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.01" 
                                    :max="2" 
                                    :min="-2"  
                                    v-model="curPs.msParticleRomanSpeedY" 
                                    @change="saveData('msParticleRomanSpeedY')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="Z方向改变频率：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.01" 
                                    :max="2" 
                                    :min="-2"  
                                    v-model="curPs.msParticleRomanStepZ" 
                                    @change="saveData('msParticleRomanStepZ')"
                                >
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="Z方向改变速度：">
                                <el-input-number 
                                    style="width:90px" 
                                    controls-position="right"  
                                    :step="0.01" 
                                    :max="2" 
                                    :min="-2"  
                                    v-model="curPs.msParticleRomanSpeedZ" 
                                    @change="saveData('msParticleRomanSpeedZ')"
                                >
                                </el-input-number>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-collapse-item>

                <el-collapse-item title="开启作为子粒子" name="14">
                    <el-form ref="form" :model="curPs" label-width="120px" size="mini" @submit.native.prevent>
                        <el-form-item label="作为子粒子：">
                            <el-switch
                                v-model="curPs.enableSubEmitter" 
                                @change="saveData('enableSubEmitter')"
                            >
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="子粒子类型：" v-if="curPs.enableSubEmitter">
                            <el-select v-model="curPs.subEmitterType" placeholder="选择子粒子类型" size="mini" @change="saveData('subEmitterType')">
                                <el-option 
                                    :key="0" 
                                    label="附着出现" 
                                    :value="0"
                                >
                                </el-option>
                                <el-option 
                                    :key="1" 
                                    label="消失后出现" 
                                    :value="1"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="继承位置：" v-if="curPs.enableSubEmitter">
                            <el-switch
                                v-model="curPs.inheritDirection" 
                                @change="saveData('inheritDirection')"
                            >
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="继承速度：" v-if="curPs.enableSubEmitter">
                            <el-input-number 
                                controls-position="right"  
                                :step="0.1" 
                                v-model="curPs.inheritedVelocityAmount" 
                                @change="saveData('inheritedVelocityAmount')"
                            >
                            </el-input-number>
                        </el-form-item>

                    </el-form>
                </el-collapse-item>

            </el-collapse>
        </div>

        <!-- <div style="padding: 5px;position: absolute;bottom: 0px;width: 100%;background: #2a75bd;height: 28px;z-index: 1;">
            <el-row>
                <el-col :span="12">
                    <template>
                        <el-select v-model="addParticleValue" placeholder="选择粒子发射类型" size="mini">
                            <el-option 
                                v-for="item in addParticleOptions" 
                                :key="item.value" 
                                :label="item.label" 
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
                <el-col :span="6" style="text-align: center">
                    <el-button @click="addParticleSystem" plain size="mini" style="width: 98%;">新增</el-button>
                </el-col>
                <el-col :span="6" style="text-align: center">
                    <el-upload
                        class="upload-demo"
                        action=""
                        :on-error="handleConfigSuccess"
                        :before-upload="beforeConfigUpload"
                    >
                        <el-button 
                            size="mini" 
                            type="danger" 
                            style="padding-left:5px;padding-right:5px;"
                        >
                            上传配置
                        </el-button>
                    </el-upload>
                </el-col>
            </el-row>
        </div> -->

        <!-- <el-dialog title="下载粒子文件选项" :visible.sync="openDownLoad">
            <el-row>
                <el-col :span="24">
                    <el-row>
                        <el-col :span="8" style="text-align:right;">
                            粒子名称：
                        </el-col>
                        <el-col :span="16">
                            <el-input v-model="downLoadName" placeholder="请输入内容"></el-input>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top:10px;">
                        <el-col :span="8" style="text-align:right;">
                            选择粒子：
                        </el-col>
                        <el-col :span="16">
                            <el-checkbox 
                                :indeterminate="isDownloadParticleIndeterminate" 
                                v-model="checkDownloadParticleAll" 
                                @change="handleCheckAllChange"
                            >
                                全选
                            </el-checkbox>

                            <div style="margin: 5px 0;"></div>

                            <el-checkbox-group v-model="checkedDownloadParticle" @change="handleCheckedParticleChange">
                                <el-checkbox 
                                    v-for="particle in particleSystemSet" 
                                    :label="particle.id" 
                                    :key="particle.id"
                                >
                                    {{particle.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openDownLoad = false">取 消</el-button>
                <el-button type="primary" @click="downloadConfig">下 载</el-button>
            </div>
        </el-dialog>

        <el-dialog title="上传粒子文件选项" :visible.sync="openUpLoad">
            <el-row>
                <el-col :span="8" style="text-align:right;">
                    选择粒子：
                </el-col>
                <el-col :span="16">
                    <el-checkbox 
                        :indeterminate="isUploadParticleIndeterminate" 
                        v-model="checkUploadParticleAll" 
                        @change="handleCheckUpAllChange"
                    >
                        全选
                    </el-checkbox>

                    <div style="margin: 5px 0;"></div>

                    <el-checkbox-group v-model="checkedUploadParticle" @change="handleCheckedUpParticleChange">
                        <el-checkbox 
                            v-for="particle in uploadParticles" 
                            :label="particle.id" 
                            :key="particle.id"
                        >
                            {{particle.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openUpLoad = false">取 消</el-button>
                <el-button type="primary" @click="uploadloadConfig">上 传</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
    import { getState } from '@/canvas/common';
    import { 
        getMeshById,
        getScreenSize,
        generateRandomKey, 
        updateObjectView,
        createDirectionAuxLine,

    } from './js/methods';

    import { psTemp } from '@/master/js/meshData';
    import { deepCopy } from '@/utils/util';

    export default {
        data: () => ({
            activeNames: ['1'],
            // curPs: null,
            // particleSystemSet: [],
            curParticleId: "",
            curParticleIndex: null,
            addParticleOptions: [
                {
                    value: 'Point',
                    label: '点'
                }, 
                {
                    value: 'Box',
                    label: '立方体'
                }, 
                {
                    value: 'Sphere',
                    label: '球体'
                }, 
                {
                    value: 'SphereDirected',
                    label: '带方向球体'
                }, 
                {
                    value: 'Hemispheric',
                    label: '半球'
                }, 
                {
                    value: 'Cylinder',
                    label: '圆柱体'
                }, 
                {
                    value: 'CylinderDirected',
                    label: '带方向圆柱体'
                }, 
                {
                    value: 'Cone',
                    label: '圆锥体'
                }, 
                {
                    value: 'Camera',
                    label: '相机发射源'
                }
            ],
            blendModeOption: [
            	{ value: 0, label: "ONEONE" },
            	{ value: 1, label: "STANDARD" },
            	{ value: 2, label: "ADD" },
            	{ value: 3, label: "MULTIPLY" },
            	{ value: 4, label: "MULTIPLYADD" }
            ],
            billboardModeOption:[
            	{ value: 7, label: "ALL" },
            	{ value: 2, label: "Y" },
            	{ value: 8, label: "STRETCHED" }
            ],
            emitterModeList:[
                { value: 0, label: "固定位置" },
                { value: 1, label: "附着物体" },
            ],
            addParticleValue: 'Point',
            refreshTimeout: null,
            psBabylonSet: [],
            openDownLoad: false,
            downLoadName: "默认粒子",
            checkedDownloadParticle: [],
            isDownloadParticleIndeterminate: true,
            checkDownloadParticleAll: false,
            openUpLoad: false,
            checkedUploadParticle: [],
            isUploadParticleIndeterminate: true,
            checkUploadParticleAll: false,
            uploadParticles: [],
            curPs:null,
        }),
        // mounted(){
        //     this.refreshPaticle();
        //     this.gotoPage(this.curPs.id);
        // },
        watch:{
            curPsCom: {
                handler(nv, ov) {
                    this.curPs = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            curPsCom: {
                get(){
                    let curParticleId = getState('master', 'curParticleId');

                    let object = this.$store.getters['master/getObjectByID']({
                        type: 'particleSystems',
                        id: curParticleId
                    });

                    if(object){
                        return deepCopy(object);
                    }

                    return null;
                },
                // set(newV){
                //     let canvas = document.getElementById('renderCanvas');
                //     canvas.babylon.curPs = newV;
                // },
            },
            particleSystemSet(){
                return getState('master', 'particleSystems');
            },
            subParticleSystemSet(){
                let ps = getState('master', 'particleSystems'), subPs = [];
                for(let i=0;i<ps.length;i++){
                    let item = ps[i];
                    if(item.enableSubEmitter){
                        subPs.push(item);
                    }
                }
                return subPs;
            },
            emitterObjects(){ //已创建的纹理库
                let meshes = getState('master', 'meshes');
                let cameras = getState('master', 'cameras');
                let lights = getState('master', 'lights');

                let ret = [];
                ret = ret.concat(cameras);
                ret = ret.concat(lights);
                ret = ret.concat(meshes);
                return ret;
            },
        },
        methods: {
            handleChange(){

            },
            // gotoPage(newV){
            //     var _this = this;
            //     _this.curParticleId = newV;
            //     if(this.particleSystemSet.length==0){
            //         return null;
            //     }
            //     var _this = this;
            //     var curid = newV, isOk = false;
            //     // console.log("curParticleIndex");
            //     // console.trace();
            //     for(var i=0;i<this.particleSystemSet.length;i++){
            //         var item = this.particleSystemSet[i];
            //         if(item.id == curid){
            //             var mesh = getMeshById(item.id);
            //             _this.curParticleIndex = i;
            //             isOk = true;
            //             break;
            //         }
            //     }
                
            //     if(!isOk){
            //         _this.curParticleIndex = 0;
            //     }
                
            //     this.curPs = this.particleSystemSet[this.curParticleIndex];

            //     var mesh = getMeshById(curid);

            //     this.$nextTick(function(){
            //         _this.$emit('createGizmo', mesh);
            //     })
            // },
            handleOpenDownLoad(){
                var all = [];
                this.isDownloadParticleIndeterminate = false;
                this.particleSystemSet.forEach((item)=>{
                    all.push(item.id);
                });
                this.checkedDownloadParticle = all;
                this.checkDownloadParticleAll = true;
                this.openDownLoad = true;
            },
            handleCheckAllChange(val) {
                var all = [];
                this.particleSystemSet.forEach((item)=>{
                    all.push(item.id);
                });
                this.checkedDownloadParticle = val ? all : [];
                this.isDownloadParticleIndeterminate = false;
            },
            handleCheckedParticleChange(value) {
                let checkedCount = value.length;
                this.checkDownloadParticleAll = checkedCount === this.particleSystemSet.length;
                this.isDownloadParticleIndeterminate = checkedCount > 0 && checkedCount < this.particleSystemSet.length;
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
            downloadConfig(){
                if(this.particleSystemSet.length==0){
                    this.$message({
                        message: '请先制作粒子再下载',
                        type: 'warning'
                    });
                    openDownLoad = false;
                    return;
                }
                var _this = this;
                var downCache = [], selected = {};
                this.checkedDownloadParticle.forEach((id)=>{
                    selected[id] = true;
                });

                for(var i=0;i<_this.particleSystemSet.length;i++){
                    var item = _this.particleSystemSet[i];
                    if(item.id in selected){
                        downCache.push(item);
                    }
                }

                var json = JSON.stringify(downCache);
                var blob = new Blob([json],{type : 'application/json'});
                _this.saveAs(blob, this.downLoadName);

                this.openDownLoad = false;
                // var url = URL.createObjectURL(blob);
                // window.open(url);
                // window.URL.revokeObjectURL(url);
            },
            handleOpenUpLoad(){
                var all = [];
                this.isUploadParticleIndeterminate = false;
                this.uploadParticles.forEach((item)=>{
                    all.push(item.id);
                });
                this.checkedUploadParticle = all;
                this.checkUploadParticleAll = true;
                this.openUpLoad = true;
            },
            handleCheckUpAllChange(val) {
                var all = [];
                this.uploadParticles.forEach((item)=>{
                    all.push(item.id);
                });
                this.checkedUploadParticle = val ? all : [];
                this.isUploadParticleIndeterminate = false;
            },
            handleCheckedUpParticleChange(value) {
                let checkedCount = value.length;
                this.checkUploadParticleAll = checkedCount === this.uploadParticles.length;
                this.isUploadParticleIndeterminate = checkedCount > 0 && checkedCount < this.uploadParticles.length;
            },
            uploadloadConfig:function(){
                var _this = this;
                _this.openUpLoad = false;

                var originLen = _this.particleSystemSet.length;
                // _this.particleSystemSet = _this.particleSystemSet.concat(js);

                var selected = {};
                this.checkedUploadParticle.forEach((id)=>{
                    selected[id] = true;
                });

                var babylon = document.getElementById('renderCanvas').babylon;
                let particle3D = document.getElementById('renderCanvas').babylon.particle3D;

                var r = 0;
                for(var i=0;i<_this.uploadParticles.length;i++){
                    var ps = _this.uploadParticles[i];
                    if(!(ps.id in selected)){
                        continue;
                    }
                    ps.screenSize = getScreenSize();
                    _this.createParticleMash(ps);
                    var particle = particle3D.createParticle(eval('('+ JSON.stringify(ps) +')'), babylon.scene, babylon.camera, r+originLen);
                    if(particle==null){
                        continue;
                    }

                    _this.psBabylonSet[r+originLen] = particle;
                    _this.particleSystemSet[r+originLen] = ps;

                    r++;

                    particle.start();
                }
                
                var ps = _this.particleSystemSet[_this.particleSystemSet.length-1];
                // _this.curParticleId = ps.id;
                _this.gotoPage(ps.id);

                
                // _this.refreshPaticle();
            },
            handleConfigSuccess(error,file, fileList) {
				var _this = this;
				let a = new FileReader();
			    a.onload = function (e) { 
			    	var json = e.target.result;
                    if(json.length>0){
                        // try {
                            var js = JSON.parse(json);
                            if(js.length>0){
                                _this.uploadParticles = [];
                                //var originLen = _this.particleSystemSet.length;
                                // _this.particleSystemSet = _this.particleSystemSet.concat(js);

                                for(var i=0;i<js.length;i++){
                                    var ps = js[i];
                                    ps.id = generateRandomKey("ps");
                                    
                                    _this.uploadParticles.push(ps);
                                }
                                
                                _this.handleOpenUpLoad();
                            }
                            else{
                                _this.$message({
                                    message: '上传的粒子配置文件为空，导入失败',
                                    type: 'warning'
                                });
                            }
                        // } catch (error) {
                        //     _this.$message({
                        //         message: '文件格式错误导入失败',
                        //         type: 'warning'
                        //     });
                        // }

                    }
                    else{
                        _this.$message({
                            message: '上传的粒子配置文件为空，导入失败',
                            type: 'warning'
                        });
                    }
			    }
			    a.readAsText(file.raw);
            },
            beforeConfigUpload(file) {
				const isJson = file.type === "application/json";

				const isLt2M = file.size / 1024 / 1024 < 30;

				if (!isJson) {
				  this.$message.error('上传头像图片只能是 JPG,png 格式!');
				}
				if (!isLt2M) {
				  this.$message.error('上传头像图片大小不能超过 30MB!');
				}
				return isJson && isLt2M;
            },
            changeDirection1(attr, isEmitterType){
                // var mesh = getMeshById(this.curPs.id);
                // var newV = this.curPs.particleEmitterType.direction1;
                // if(this.direction1 && newV.length>0){
                //     var d = this.direction1;
                //     d.position.x = newV[0];
                //     d.position.y = newV[1];
                //     d.position.z = newV[2];
                // }
                // // this.$emit('createDirectionAuxLine');
                // createDirectionAuxLine();
                  
                this.saveData(attr);
            },
            changeDirection2(attr, isEmitterType){
                // var mesh = getMeshById(this.curPs.id);
                // var newV = this.curPs.particleEmitterType.direction2;
                // if(this.direction2 && newV.length>0){
                //     var d = this.direction2;
                //     d.position.x = newV[0];
                //     d.position.y = newV[1];
                //     d.position.z = newV[2];
                // }
                // // this.$emit('createDirectionAuxLine');
                // createDirectionAuxLine();
                  
                this.saveData(attr);
            },
            changeEmitBox(attr, isEmitterType){
                let min = this.curPs.minEmitBox,
                    max = this.curPs.maxEmitBox;

                if(isEmitterType){
                    min = this.curPs.particleEmitterType.minEmitBox;
                    max = this.curPs.particleEmitterType.maxEmitBox;
                }

                let mesh = getMeshById(this.curPs.id);
                mesh.scaling.x = max[0] - min[0];
                mesh.scaling.y = max[1] - min[1];
                mesh.scaling.z = max[2] - min[2];

                mesh.position.x = this.curPs.emitter[0] + (min[0] + max[0])/2;
                mesh.position.y = this.curPs.emitter[1] + (min[1] + max[1])/2;
                mesh.position.z = this.curPs.emitter[2] + (min[2] + max[2])/2;

                this.saveData(attr);
            },
            changeRadius(attr){
                var mesh = getMeshById(this.curPs.id);
                var radius = this.curPs.particleEmitterType.radius;
                var type = this.curPs.particleEmitterType.type;
                if(type=="SphereParticleEmitter"){
                    mesh.scaling.x = radius*2;
                    mesh.scaling.y = radius*2;
                    mesh.scaling.z = radius*2;
                }
                else if(type=="SphereDirectedParticleEmitter"){
                    mesh.scaling.x = radius*2;
                    mesh.scaling.y = radius*2;
                    mesh.scaling.z = radius*2;
                }
                else if(type=="HemisphericParticleEmitter"){
                    mesh.scaling.x = radius*2;
                    mesh.scaling.y = radius*2;
                    mesh.scaling.z = radius*2;
                }
                else if(type=="CylinderParticleEmitter"){
                    mesh.scaling.x = radius*2;
                    mesh.scaling.y = this.curPs.particleEmitterType.height;
                    mesh.scaling.z = radius*2;
                }
                else if(type=="CylinderDirectedParticleEmitter"){
                    mesh.scaling.x = radius*2;
                    mesh.scaling.y = this.curPs.particleEmitterType.height;
                    mesh.scaling.z = radius*2;
                }
                else if(type=="ConeParticleEmitter"){
				    var angle = this.curPs.particleEmitterType.angle;
                    var height = radius / Math.tan(angle / 2);
                    
                    mesh.scaling.x = radius*2;
                    mesh.scaling.y = height;
                    mesh.scaling.z = radius*2;

                    // mesh.position.y = this.curPs.emitter[1] + height/2;
                }

                //ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: myPaths, instance: ribbon});

                this.saveData(attr);
            },
            enableNoiseTexture(){
            	if(this.curPs.noiseTexture == null){
            		this.curPs.noiseTexture = {
						"customType": "BABYLON.NoiseProceduralTexture",
						"brightness": 0.2,
						"octaves": 4,
						"persistence": 0.8,
						"animationSpeedFactor": 1,
						"size": 256,
						"generateMipMaps": true
				    }
            	}
            	else{
            		this.curPs.noiseTexture = null;
                }

                this.saveData('noiseTexture');
            },
            addGradientsItem(attr){
                let obj = {
                    "gradient": 0,
		            "factor1": 0,
		            "factor2": 0,
                }

                if(attr == 'colorGradients' || attr == 'rampGradients'){
                    obj = {
                        "gradient": 0,
                        "color1": null,
                        "color2": null,
                    }
                }

                this.curPs[attr].push(obj);
                
                this.saveData(attr);
            },
            removeGradientsItem(attr, i){
                this.curPs[attr].splice(i, 1);

                this.saveData(attr);
            },
            // removeParticleSystem(object, i){
            // 	if(object==null || object.length==0){
            // 		return;
            // 	}
            //     var _this = this;
            //     var curid = this.curParticleId;

            //     if(this.psBabylonSet[i]!=null){
            //         this.psBabylonSet[i].dispose();
            //         this.psBabylonSet.splice(i, 1);
            //     }
                
            //     object.splice(i, 1);
            //     if(object.length==0){
            //         _this.gotoPage(null);
            //         this.curParticleId = null;
            //         this.curPs = null;
            //     }
            //     else{
            //         var pre = object[i-1];
            //         if(pre!=null){
            //             _this.gotoPage(pre.id);
            //             // this.curParticleId = pre.id;
            //             this.curPs = pre;
            //         }
            //         else{
            //             // this.curParticleId = object[0].id;
            //             _this.gotoPage(object[0].id);
            //             this.curPs = object[0];
            //         }
            //     }
                
            //     var _this = this;
                
            //     this.$emit('clearAuxAndGizmo');

            //     _this.scene.getMeshByName(curid).dispose();

            //     this.refreshPaticle();
            // },
            // refreshPaticle(){
            //     let _this = this;

            // 	clearTimeout(this.refreshTimeout);
            // 	this.refreshTimeout = setTimeout(()=>{
            //         _this.execRefreshPaticle();
            // 	},500);
            // },
            // execRefreshPaticle(){
            //     console.log("refreshPaticle");
            //     var json = eval('('+ JSON.stringify(this.curPs) +')');
            //     var babylon = document.getElementById('renderCanvas').babylon;
            //     let particle3D = document.getElementById('renderCanvas').babylon.particle3D;
            //     var particle = particle3D.createParticle(json, babylon.scene, babylon.camera, this.curParticleIndex);
            //     if(particle==null){
            //         return;
            //     }
            //     if(this.psBabylonSet[this.curParticleIndex]!=null){
            //         this.psBabylonSet[this.curParticleIndex].dispose();
            //     }
            //     this.psBabylonSet[this.curParticleIndex] = particle;
            //     particle.start();
            // },
            // addParticleSystem(){
            // 	if(this.addParticleValue==null || this.addParticleValue.length==0){
            // 		return;
            // 	}
            // 	var apv = this.addParticleValue;
            // 	var scene = this.scene;
            // 	var ps =eval('('+  JSON.stringify(psTemp) +')');
            // 	ps.name = apv+ "粒子" + this.particleSystemSet.length;
            // 	ps.id = generateRandomKey("particleSystem");
            // 	if(apv=="Point"){
            // 		ps.particleEmitterType = {
            // 			"type": "PointParticleEmitter",
			// 			"direction1": [
			// 				0,
			// 				-1,
			// 				0
			// 			],
			// 			"direction2": [
			// 				0,
			// 				-1,
			// 				0
			// 			]
            // 		}
            // 	}
            // 	else if(apv=="Box"){
            // 		ps.particleEmitterType = {
			// 			"type": "BoxParticleEmitter",
			// 			"direction1": [
			// 				0,
			// 				-1,
			// 				0
			// 			],
			// 			"direction2": [
			// 				0,
			// 				-1,
			// 				0
			// 			],
			// 			"minEmitBox": [
			// 				-1,
			// 				0,
			// 				-1
			// 			],
			// 			"maxEmitBox": [
			// 				1,
			// 				0,
			// 				1
			// 			]
			// 		}
            // 	}
            // 	else if(apv=="Sphere"){
            // 		ps.particleEmitterType = {
            // 			"type": "SphereParticleEmitter",
			// 			"radius": 1,
			// 			"radiusRange":1,
            //             "directionRandomizer":0,
                        
            //             "direction1": [],//不生效站位
			// 			"direction2": [],//不生效站位
            // 		}
            // 	}
            // 	else if(apv=="SphereDirected"){
            // 		ps.particleEmitterType = {
            // 			"type": "SphereDirectedParticleEmitter",
			// 			"radius": 1,
			// 			"direction1": [
			// 				0,
			// 				-1,
			// 				0
			// 			],
			// 			"direction2": [
			// 				0,
			// 				-1,
			// 				0
			// 			],
			// 			"radiusRange":1, //初始化外添加
			// 			"directionRandomizer":0, //初始化外添加
            // 		}
            // 	}
            // 	else if(apv=="Hemispheric"){
            // 		ps.particleEmitterType = {
            // 			"type": "HemisphericParticleEmitter",
			// 			"radius": 1,
			// 			"radiusRange":1,
            //             "directionRandomizer":0,
                        
            //             "direction1": [],//不生效站位
			// 			"direction2": [],//不生效站位
            // 		}
            // 	}
            // 	else if(apv=="Cylinder"){
            // 		ps.particleEmitterType = {
            // 			"type": "CylinderParticleEmitter",
            // 			"radius": 2,
			// 			"height": 2,
			// 			"radiusRange": 0,
            //             "directionRandomizer":0,
                        
            //             "direction1": [],//不生效站位
			// 			"direction2": [],//不生效站位
            // 		}
            // 	}
            // 	else if(apv=="CylinderDirected"){
            // 		ps.particleEmitterType = {
            // 			"type": "CylinderDirectedParticleEmitter",
			// 			"radius": 2,
			// 			"height": 2,
			// 			"radiusRange": 0,
			// 			"direction1": [
			// 				0,
			// 				-1,
			// 				0
			// 			],
			// 			"direction2": [
			// 				0,
			// 				-1,
			// 				0
			// 			],
			// 			"directionRandomizer":0 //初始化外添加
            // 		}
            // 	}
            // 	else if(apv=="Cone"){
            // 		ps.particleEmitterType = {
            // 			"type": "ConeParticleEmitter",
			// 			"radius": 2,
			// 			"angle": 2,
			// 			"directionRandomizer": 0, 
			// 			"radiusRange": 0, //初始化外添加
            //             "heightRange": 1, //初始化外添加
                        
            //             "direction1": [],//不生效站位
			// 			"direction2": [],//不生效站位
            // 		}
            //     }
            //     else if(apv=="Camera"){
            //         ps.cameraEmitter = true;
            //         ps.minEmitBox = [-0.3,0,0];
            //         ps.maxEmitBox = [0.3,0,0];
            //         ps.direction1 = [-0.5, -1, 1];
            //         ps.direction2 = [.5, 10, 10];
            //     }
            // 	this.particleSystemSet[this.particleSystemSet.length] = ps;
            // 	// this.curParticleId = ps.id;

               

            //     ps.screenSize = getScreenSize();

            //     this.createParticleMash(ps);

            //     this.gotoPage(ps.id);
                
            //     this.execRefreshPaticle();
            // },
            // createParticleMash(ps){
            //     let pet = ps.particleEmitterType;
            //     if(pet == null){
            //         return;
            //     }

            //     let apv = pet.type;
            //     if(apv == null){
            //         return;
            //     }
            //     apv = apv.replace("ParticleEmitter", "");
                
            // 	let mesh;
            // 	if(apv == "Point"){
            // 		mesh = BABYLON.Mesh.CreateSphere(ps.id, 16, 0.5, this.scene);
            // 	}
            // 	else if(apv == "Box"){
            // 		let max = pet.maxEmitBox;
            // 		let min = pet.minEmitBox;
            //         mesh = BABYLON.MeshBuilder.CreateBox(ps.id, {width: 1, height: 1, depth: 1}, this.scene);
                    
            //         mesh.scaling.x = Math.max(max[0] - min[0], 0.1);
            //         mesh.scaling.y = Math.max(max[1] - min[1], 0.1);
            //         mesh.scaling.z = Math.max(max[2] - min[2], 0.1);
            // 	}
            // 	else if(apv == "Sphere"){
            //         mesh = BABYLON.MeshBuilder.CreateSphere(ps.id, {diameter: 1}, this.scene);
            //         mesh.scaling.x = pet.radius * 2;
            //         mesh.scaling.y = pet.radius * 2;
            //         mesh.scaling.z = pet.radius * 2;
            // 	}
            // 	else if(apv == "SphereDirected"){
            //         // mesh = BABYLON.MeshBuilder.CreateSphere(this.curParticleId, 16, pet.radius, scene);
            //         mesh = BABYLON.MeshBuilder.CreateSphere(ps.id, {diameter: 1}, this.scene);
            //         mesh.scaling.x = pet.radius * 2;
            //         mesh.scaling.y = pet.radius * 2;
            //         mesh.scaling.z = pet.radius * 2;
            // 	}
            // 	else if(apv == "Hemispheric"){
            //         mesh = BABYLON.HemisphereBuilder.CreateHemisphere(ps.id, {diameter: 1, segments: 16}, this.scene);
            //         mesh.scaling.x = pet.radius * 2;
            //         mesh.scaling.y = pet.radius * 2;
            //         mesh.scaling.z = pet.radius * 2;
            // 	}
            // 	else if(apv == "Cylinder"){
            //         mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 1, height: 1}, this.scene);
            //         mesh.scaling.x = pet.radius * 2;
            //         mesh.scaling.y = pet.height;
            //         mesh.scaling.z = pet.radius * 2;
            // 	}
            // 	else if(apv == "CylinderDirected"){
            //         mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 1, height: 1}, this.scene);
            //         mesh.scaling.x = pet.radius * 2;
            //         mesh.scaling.y = pet.height;
            //         mesh.scaling.z = pet.radius * 2;
            // 	}
            // 	else if(apv == "Cone"){
            // 		let radius = pet.radius;
			// 	    let angle = pet.angle;
			// 	    let height = radius / Math.tan(angle / 2);
            //         mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 0, height: 1}, this.scene); 
            //         mesh.scaling.x = pet.radius * 2;
            //         mesh.scaling.y = height;
            //         mesh.scaling.z = pet.radius * 2;
            //     }
                
            //     if(mesh != null){
            //         mesh.position.x = ps.emitter[0];
            //         mesh.position.y = ps.emitter[1];
            //         mesh.position.z = ps.emitter[2];
            //         mesh.material = new BABYLON.StandardMaterial(ps.id, this.scene);
            //         mesh.material.wireframe = true;

            //         if(this.showSceneMesh == "隐藏辅助"){
            //             mesh.visibility = 0;
            //         }

            //         mesh.id = ps.id;
            //     }
            // },
            handleAvatarSuccess(event, file, fileList) {
				var _this = this;
				let a = new FileReader();
			    a.onload = function (e) { 
			    	_this.curPs.textureName = e.target.result;
                    // _this.refreshPaticle();
                    _this.saveData("textureName")
			    }
			    a.readAsDataURL(file.raw);
            },
            beforeAvatarUpload(file) {
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
            saveData(type){
                let particleSystems = getState('master', 'particleSystems');
                let curParticleId = getState('master', 'curParticleId'); 

                let index = 0;
                for(let i = 0; i < particleSystems.length; i++){
                    if(particleSystems[i].id == curParticleId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(particleSystems[index]);

                let value = this.curPs[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.curPs[item];
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
                    key: 'particleSystems.${'+ index +'}.' + updateType,
                    value: this.curPs[updateType]
                });

                // this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.curPs, index, preObject);

                // this.refreshPaticle();
            },
        }
    }
</script>

<style lang="scss">
    .particleSetting{
        .msConfig{
            padding: 10px;
            user-select: none;

            scrollbar-base-color: #FFFFFF;
            scrollbar-track-color: #E7E7E7;
            scrollbar-darkshadow-color: #FFFFFF;
            scrollbar-3dlight-color: #FFFFFF;
            scrollbar-arrow-color: #757778;
            scrollbar-shadow-color: #BEC1C4;
            scrollbar-highlight-color: #BEC1C4;
            -ms-scroll-chaining: none;

            &::-webkit-scrollbar-track{
                background-color: transparent;
            }
            &::-webkit-scrollbar{
                width: 10px;
                height: 10px;
                background-color: transparent;
                /*border:0 none;*/
            }
            &::-webkit-scrollbar-thumb{
                transition: background 0.2s;
                background: rgba(0, 0, 0, 0.7);
                border: 1px solid #f1f1f1;
                border-radius: 12px;

                &:hover{
                    background: rgba(0, 0, 0, 0.95);
                    border: 1px solid #f1f1f1;
                    border-radius: 12px;
                }
            }

            .el-collapse-item__header{
                font-size: 14px;
                font-weight: 500;
            }
            .el-collapse-item__content{
                font-size: 12px;
                padding-bottom: 5px;
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

            .el-row{
                margin: 3px 2px;
                display: flex;
                align-items: center;

                .title{
                    color:#6D6D6D;
                }
            }
            .el-divider{
                margin: 8px 0px;
                /*margin-bottom: 8px;*/

                div{
                    font-size: 12px;
                }
            }
            .el-divider__text{
                padding: 0px;
            }
            .el-input-number{
                &.is-controls-right{
                    .el-input__inner{
                        padding-left: 4px;
                        padding-right: 31px;
                    }
                }
            }
        }
        .el-button--mini{
            padding: 7px 1px;

            &.is-circle{
                padding: 7px;
            }
        }
        .el-popover{
            .el-input-number{
                &.is-controls-right{
                    .el-input__inner{
                        padding-left: 4px;
                        padding-right: 31px;
                    }
                }
            }
        }
        .avatar-uploader{
            .el-upload{
                border: 1px dashed #d9d9d9;
                border-radius: 3px;
                cursor: pointer;
                position: relative;
                overflow: hidden;

                &:hover{
                    border-color: #409EFF;
                }
            }
        }
        .avatar-uploader-icon{
            font-size: 12px;
            color: #8c939d;
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
        .avatar {
            max-width: 100%;
            max-height: 60px;
            display: block;
        }
    }
</style>