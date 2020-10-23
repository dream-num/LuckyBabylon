<template>
    <div class="materialSetting" v-if="material!=null">
        <el-button type="primary" @click="goback" size="mini" style="margin-bottom:10px;">返回</el-button>
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="材质纹理配置" name="1">
                <el-form ref="form" :model="material" label-width="80px" size="mini" @submit.native.prevent>
                    <div class="textureItem" v-if="hasKey('diffuseTexture')">
                        <el-row class="title">漫反射</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture" 
                                @change="saveData('diffuseTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture', '漫反射')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="启用菲涅尔：" v-if="hasKey('enableDiffuseFresnelParameters')">
                            <el-switch 
                                v-model="material.enableDiffuseFresnelParameters"
                                @change="saveData('enableDiffuseFresnelParameters')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="菲涅尔：" v-if="material.enableDiffuseFresnelParameters">
                            <el-button type="primary" @click="openDialog2('diffuseFresnelParameters', '漫反射')">编辑</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('diffuseColor')">
                            <el-color-picker 
                                v-model="material.diffuseColor"
                                color-format="rgb"
                                @change="saveData('diffuseColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                        <el-form-item label="阴影水平：" v-if="hasKey('shadowLevel')">
                            <el-slider 
                                v-model="material.shadowLevel"
                                :min="0"
                                :max="1"
                                :step="0.1"
                                @change="saveData('shadowLevel')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="透明菲涅尔：" v-if="hasKey('opacityFresnel')">
                            <el-switch 
                                v-model="material.opacityFresnel"
                                @change="saveData('opacityFresnel')"
                            >
                            </el-switch>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('specularTexture')">
                        <el-row class="title">镜面反射</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.specularTexture" 
                                @change="saveData('specularTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('specularTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('specularTexture', '镜面反射')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('specularColor')">
                            <el-color-picker 
                                v-model="material.specularColor"
                                color-format="rgb"
                                @change="saveData('specularColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                        <el-form-item label="强度：" v-if="hasKey('specularPower')">
                            <!-- <el-slider 
                                v-model="material.specularPower"
                                :min="0"
                                :max="500"
                                :step="1"
                                @change="saveData('specularPower')"
                            >
                            </el-slider> -->
                            <el-input-number 
                                v-model="material.specularPower"
                                :min="0"
                                :max="1000"
                                :step="1"
                                @change="saveData('specularPower')"
                            >
                            </el-input-number>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('emissiveTexture')">
                        <el-row class="title">自发光</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.emissiveTexture" 
                                @change="saveData('emissiveTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('emissiveTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('emissiveTexture', '自发光')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="启用菲涅尔：" v-if="hasKey('enableEmissiveFresnelParameters')">
                            <el-switch 
                                v-model="material.enableEmissiveFresnelParameters"
                                @change="saveData('enableEmissiveFresnelParameters')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="菲涅尔：" v-if="material.enableEmissiveFresnelParameters">
                            <el-button type="primary" @click="openDialog2('emissiveFresnelParameters', '自发光')">编辑</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('emissiveColor')">
                            <el-color-picker 
                                v-model="material.emissiveColor"
                                color-format="rgb"
                                @change="saveData('emissiveColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                        <el-form-item label="发光强度：" v-if="hasKey('emissiveIntensity')">
                            <el-slider 
                                v-model="material.emissiveIntensity"
                                :min="0"
                                :max="1"
                                :step="0.1"
                                @change="saveData('emissiveIntensity')"
                            >
                            </el-slider>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('ambientTexture')">
                        <el-row class="title">环境</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.ambientTexture" 
                                @change="saveData('ambientTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('ambientTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('ambientTexture', '环境')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('ambientColor')">
                            <el-color-picker 
                                v-model="material.ambientColor"
                                color-format="rgb"
                                @change="saveData('ambientColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('reflectionTexture')">
                        <el-row class="title">反射</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.reflectionTexture" 
                                @change="saveData('reflectionTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('reflectionTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('reflectionTexture', '反射')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="启用菲涅尔：" v-if="hasKey('enableReflectionFresnelParameters')">
                            <el-switch 
                                v-model="material.enableReflectionFresnelParameters"
                                @change="saveData('enableReflectionFresnelParameters')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="菲涅尔：" v-if="material.enableReflectionFresnelParameters">
                            <el-button type="primary" @click="openDialog2('reflectionFresnelParameters', '环境反射')">编辑</el-button>
                        </el-form-item>
                        <el-form-item label="开启反射菲涅耳：" v-if="hasKey('reflectionFresnel')">
                            <el-switch 
                                v-model="material.reflectionFresnel"
                                @change="saveData('reflectionFresnel')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="权重：" v-if="hasKey('reflectionStandardFresnelWeight')">
                            <el-input-number 
                                v-model="material.reflectionStandardFresnelWeight" 
                                controls-position="right" 
                                :min="0"
                                :step="0.1"
                                
                                @change="saveData('reflectionStandardFresnelWeight')"
                            >
                            </el-input-number>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('refractionTexture')">
                        <el-row class="title">折射</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.refractionTexture" 
                                @change="saveData('refractionTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('refractionTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('refractionTexture', '折射')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="启用菲涅尔：" v-if="hasKey('enableRefractionFresnelParameters')">
                            <el-switch 
                                v-model="material.enableRefractionFresnelParameters"
                                @change="saveData('enableRefractionFresnelParameters')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="菲涅尔：" v-if="material.enableRefractionFresnelParameters">
                            <el-button type="primary" @click="openDialog2('refractionFresnelParameters', '折射')">编辑</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('opacityTexture')">
                        <el-row class="title">透明度</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.opacityTexture" 
                                @change="saveData('opacityTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('opacityTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('opacityTexture', '透明度')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="启用菲涅尔：" v-if="hasKey('enableOpacityFresnelParameters')">
                            <el-switch 
                                v-model="material.enableOpacityFresnelParameters"
                                @change="saveData('enableOpacityFresnelParameters')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="菲涅尔：" v-if="material.enableOpacityFresnelParameters">
                            <el-button type="primary" @click="openDialog2('opacityFresnelParameters', '透明度')">编辑</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('bumpTexture')">
                        <el-row class="title">法线</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.bumpTexture" 
                                @change="saveData('bumpTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('bumpTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('bumpTexture', '法线')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="法线高：" v-if="hasKey('bumpHeight')">
                            <el-slider 
                                v-model="material.bumpHeight"
                                :min="0"
                                :max="3"
                                :step="0.01"
                                @change="saveData('bumpHeight')"
                            >
                            </el-slider>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('lightmapTexture')">
                        <el-row class="title">光照</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.lightmapTexture" 
                                @change="saveData('lightmapTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('lightmapTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('lightmapTexture', '光照')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="作为阴影：">
                            <el-switch 
                                v-model="material.useLightmapAsShadowmap"
                                @change="saveData('useLightmapAsShadowmap')"
                            >
                            </el-switch>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('microSurfaceTexture')">
                        <el-row class="title">微表面</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.microSurfaceTexture" 
                                @change="saveData('microSurfaceTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('microSurfaceTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('microSurfaceTexture', '微表面')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="设置：">
                            <el-slider 
                                v-model="material.microSurface"
                                :min="0"
                                :max="1"
                                :step="0.01"
                                @change="saveData('microSurface')"
                            >
                            </el-slider>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('metallicTexture')">
                        <el-row class="title">金属质感</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.metallicTexture" 
                                @change="saveData('metallicTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('metallicTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('metallicTexture', '金属质感')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('albedoTexture')">
                        <el-row class="title">反照率</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.albedoTexture" 
                                @change="saveData('albedoTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('albedoTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('albedoTexture', '反照率')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('albedoColor')">
                            <el-color-picker 
                                v-model="material.albedoColor"
                                color-format="rgb"
                                @change="saveData('albedoColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('reflectivityTexture')">
                        <el-row class="title">反射率</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.reflectivityTexture" 
                                @change="saveData('reflectivityTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('reflectivityTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('reflectivityTexture', '反射率')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('reflectivityColor')">
                            <el-color-picker 
                                v-model="material.reflectivityColor"
                                color-format="rgb"
                                @change="saveData('reflectivityColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('distortionTexture')">
                        <el-row class="title">变形</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.distortionTexture" 
                                @change="saveData('distortionTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('distortionTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('distortionTexture', '变形')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('noiseTexture')">
                        <el-row class="title">噪声</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.noiseTexture" 
                                @change="saveData('noiseTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('noiseTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('noiseTexture', '噪声')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('heightTexture')">
                        <el-row class="title">高低</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.heightTexture" 
                                @change="saveData('heightTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('heightTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('heightTexture', '高低')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('mixTexture')">
                        <el-row class="title">混合</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.mixTexture" 
                                @change="saveData('mixTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('mixTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('mixTexture', '混合')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('mixTexture1')">
                        <el-row class="title">混合1--1234</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.mixTexture1" 
                                clearable
                                @change="saveData('mixTexture1')"
                                placeholder="请选择纹理">
                                <el-option 
                                    v-for="item in textureFilter('mixTexture1')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('mixTexture1', '混合1--1234')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture1')">
                        <el-row class="title">漫反射1--红</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture1" 
                                @change="saveData('diffuseTexture1')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture1')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture1', '漫反射1--红')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture2')">
                        <el-row class="title">漫反射2--绿</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture2" 
                                @change="saveData('diffuseTexture2')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture2')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture2', '漫反射2--绿')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture3')">
                        <el-row class="title">漫反射3--蓝</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture3" 
                                @change="saveData('diffuseTexture3')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture3')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture3', '漫反射3--蓝')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture4')">
                        <el-row class="title">漫反射4--透明度</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture4" 
                                @change="saveData('diffuseTexture4')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture4')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture4', '漫反射4--透明度')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('mixTexture2')">
                        <el-row class="title">混合2--5678</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.mixTexture2" 
                                @change="saveData('mixTexture2')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('mixTexture2')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('mixTexture2', '混合2--5678')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture5')">
                        <el-row class="title">漫反射5--红</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture5" 
                                @change="saveData('diffuseTexture5')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture5')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture5', '漫反射5--红')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture6')">
                        <el-row class="title">漫反射6--绿</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture6" 
                                @change="saveData('diffuseTexture6')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture6')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture6', '漫反射6--绿')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture7')">
                        <el-row class="title">漫反射7--蓝</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture7" 
                                @change="saveData('diffuseTexture7')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture7')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture7', '漫反射7--蓝')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTexture8')">
                        <el-row class="title">漫反射8--透明度</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTexture8" 
                                @change="saveData('diffuseTexture8')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTexture8')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTexture8', '漫反射8--透明度')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('bumpTexture1')">
                        <el-row class="title">法线1--红</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.bumpTexture1" 
                                @change="saveData('bumpTexture1')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('bumpTexture1')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('bumpTexture1', '法线1--红')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('bumpTexture2')">
                        <el-row class="title">法线2--绿</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.bumpTexture2" 
                                @change="saveData('bumpTexture2')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('bumpTexture2')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('bumpTexture2', '法线2--绿')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('bumpTexture3')">
                        <el-row class="title">法线3--蓝</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.bumpTexture3" 
                                @change="saveData('bumpTexture3')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('bumpTexture3')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('bumpTexture3', '法线3--蓝')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTextureX')">
                        <el-row class="title">漫反射1--红</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTextureX" 
                                @change="saveData('diffuseTextureX')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTextureX')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTextureX', '漫反射1--红')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTextureY')">
                        <el-row class="title">漫反射2--绿</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTextureY" 
                                @change="saveData('diffuseTextureY')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTextureY')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTextureY', '漫反射2--绿')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('diffuseTextureZ')">
                        <el-row class="title">漫反射3--蓝</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.diffuseTextureZ" 
                                @change="saveData('diffuseTextureZ')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('diffuseTextureZ')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('diffuseTextureZ', '漫反射3--蓝')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('normalTextureX')">
                        <el-row class="title">法线1--红</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.normalTextureX" 
                                @change="saveData('normalTextureX')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('normalTextureX')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('normalTextureX', '法线1--红')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('normalTextureY')">
                        <el-row class="title">法线2--绿</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.normalTextureY" 
                                @change="saveData('normalTextureY')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('normalTextureY')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('normalTextureY', '法线2--绿')">新建</el-button>
                        </el-form-item>
                    </div>
                    <div class="textureItem" v-if="hasKey('normalTextureZ')">
                        <el-row class="title">法线3--蓝</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.normalTextureZ" 
                                @change="saveData('normalTextureZ')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('normalTextureZ')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('normalTextureZ', '法线3--蓝')">新建</el-button>
                        </el-form-item>
                    </div>

                    <div class="textureItem" v-if="hasKey('shadeTexture')">
                        <el-row class="title">阴影</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.shadeTexture" 
                                @change="saveData('shadeTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('shadeTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('shadeTexture', '阴影')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('shadeColor')">
                            <el-color-picker 
                                v-model="material.shadeColor"
                                color-format="rgb"
                                @change="saveData('shadeColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                        <el-form-item label="分割大小：" v-if="hasKey('shadeShift')">
                            <el-input-number 
                                :min="-1"
                                :max="1"
                                :step="0.01"
                                v-model="material.shadeShift" 
                                controls-position="right"
                                size="mini"
                                @change="saveData('shadeShift')" 
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="柔和程度：" v-if="hasKey('shadeToony')">
                            <el-input-number 
                                :min="0"
                                :max="1"
                                :step="0.01"
                                v-model="material.shadeToony" 
                                controls-position="right"
                                size="mini"
                                @change="saveData('shadeToony')" 
                            >
                            </el-input-number>
                        </el-form-item>
                    </div>

                    <div class="textureItem" v-if="hasKey('outlineWidthTexture')">
                        <el-row class="title">边框</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.outlineWidthTexture" 
                                @change="saveData('outlineWidthTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('outlineWidthTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('outlineWidthTexture', '阴影')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('outlineColor')">
                            <el-color-picker 
                                v-model="material.outlineColor"
                                color-format="rgb"
                                @change="saveData('outlineColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                        <el-form-item label="边框宽度：" v-if="hasKey('outlineWidth')">
                            <el-input-number 
                                :min="-10"
                                :max="10"
                                :step="0.1"
                                v-model="material.outlineWidth" 
                                controls-position="right"
                                size="mini"
                                @change="saveData('outlineWidth')" 
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="边框宽度模式：" v-if="hasKey('outlineWidthMode')">
                            <el-select 
                                v-model="material.outlineWidthMode" 
                                @change="saveData('outlineWidthMode')"
                                placeholder="边框宽度模式"
                            >
                                <el-option label="世界" :value="0"></el-option>
                                <el-option label="本地" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="边框颜色模式：" v-if="hasKey('outlineColorMode')">
                            <el-select 
                                v-model="material.outlineColorMode" 
                                @change="saveData('outlineColorMode')"
                                placeholder="边框颜色模式"
                            >
                                <el-option label="fixedColor" :value="0"></el-option>
                                <el-option label="MixedLighting" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="textureItem" v-if="hasKey('rimTexture')">
                        <el-row class="title">边沿</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.rimTexture" 
                                @change="saveData('rimTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('rimTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('rimTexture', '边沿')">新建</el-button>
                        </el-form-item>
                        <el-form-item label="颜色：" v-if="hasKey('rimColor')">
                            <el-color-picker 
                                v-model="material.rimColor"
                                color-format="rgb"
                                @change="saveData('rimColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>

                    <div class="textureItem" v-if="hasKey('matCapTexture')">
                        <el-row class="title">matCap</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.matCapTexture" 
                                @change="saveData('matCapTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('matCapTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('matCapTexture', 'matCap')">新建</el-button>
                        </el-form-item>
                    </div>

                    <div class="textureItem" v-if="hasKey('receiveShadowTexture')">
                        <el-row class="title">接受投影</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.receiveShadowTexture" 
                                @change="saveData('receiveShadowTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('receiveShadowTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('receiveShadowTexture', '接受投影')">新建</el-button>
                        </el-form-item>
                    </div>

                    <div class="textureItem" v-if="hasKey('shadingGradeTexture')">
                        <el-row class="title">阴影渐变</el-row>
                        <el-form-item label="纹理：">
                            <el-select 
                                v-model="material.shadingGradeTexture" 
                                @change="saveData('shadingGradeTexture')"
                                placeholder="请选择纹理"
                                clearable
                            >
                                <el-option 
                                    v-for="item in textureFilter('shadingGradeTexture')"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                >
                                </el-option>
                            </el-select>
                            <el-button type="primary" @click="openDialog('shadingGradeTexture', '阴影渐变')">新建</el-button>
                        </el-form-item>
                    </div>

                </el-form>
            </el-collapse-item>
            <el-collapse-item title="材质通用配置" name="2">
                <el-form ref="form" :model="material" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="材质名称：">
                        <el-input 
                            v-model="material.name" 
                            placeholder="请输入材质名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="透明度：" v-if="hasKey('alpha')">
                        <el-slider 
                            v-model="material.alpha"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('alpha')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="透明度模式：" v-if="hasKey('alphaMode')">
                        <el-select 
                            v-model="material.alphaMode" 
                            @change="saveData('alphaMode')"
                            placeholder="请选择透明度模式"
                        >
                            <el-option label="加" :value="1"></el-option>
                            <el-option label="混合" :value="2"></el-option>
                            <el-option label="减" :value="3"></el-option>
                            <el-option label="乘" :value="4"></el-option>
                            <el-option label="最大混合" :value="5"></el-option>
                            <el-option label="单独" :value="6"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开启网格：" v-if="hasKey('wireframe')">
                        <el-switch 
                            v-model="material.wireframe"
                            @change="saveData('wireframe')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="开启背面隐藏：" v-if="hasKey('backFaceCulling')">
                        <el-switch 
                            v-model="material.backFaceCulling"
                            @change="saveData('backFaceCulling')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="填充模式：" v-if="hasKey('fillMode')">
                        <el-select 
                            v-model="material.fillMode" 
                            @change="saveData('fillMode')"
                            placeholder="请选择透明度模式"
                        >
                            <el-option label="三角填充" :value="0"></el-option>
                            <el-option label="线框填充" :value="1"></el-option>
                            <el-option label="点填充" :value="2"></el-option>
                            <el-option label="点阵列绘制" :value="3"></el-option>
                            <el-option label="线阵列绘制" :value="4"></el-option>
                            <el-option label="线循环绘制" :value="5"></el-option>
                            <el-option label="线段绘制" :value="6"></el-option>
                            <el-option label="三角正反绘制" :value="7"></el-option>
                            <el-option label="三角绘制" :value="8"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开启点云：" v-if="hasKey('pointsCloud')">
                        <el-switch 
                            v-model="material.pointsCloud"
                            @change="saveData('pointsCloud')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="点体积：" v-if="hasKey('pointSize')">
                        <el-slider 
                            v-model="material.pointSize"
                            :min="0"
                            :max="100"
                            :step="1"
                            @change="saveData('pointSize')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="开启视差：" v-if="hasKey('useParallax')">
                        <el-switch 
                            v-model="material.useParallax"
                            @change="saveData('useParallax')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="开启视差遮挡：" v-if="hasKey('useParallaxOcclusion')">
                        <el-switch 
                            v-model="material.useParallaxOcclusion"
                            @change="saveData('useParallaxOcclusion')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="视差偏度：" v-if="hasKey('parallaxScaleBias')">
                        <el-slider 
                            v-model="material.parallaxScaleBias"
                            :min="0"
                            :max="0.2"
                            :step="0.01"
                            @change="saveData('parallaxScaleBias')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="金属度：" v-if="hasKey('metallic')">
                        <el-input-number 
                            :min="0"
                            :max="1"
                            :step="0.01"
                            v-model="material.metallic" 
                            controls-position="right"
                            @change="saveData('metallic')" 
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="粗糙度：" v-if="hasKey('roughness')">
                        <el-input-number 
                            :min="0"
                            :max="1"
                            :step="0.01"
                            v-model="material.roughness" 
                            controls-position="right" 
                            @change="saveData('roughness')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="透明度链接折射：" v-if="hasKey('linkRefractionWithTransparency')">
                        <el-switch 
                            v-model="material.linkRefractionWithTransparency"
                            @change="saveData('linkRefractionWithTransparency')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="折射率：" v-if="hasKey('indexOfRefraction')">
                        <el-slider 
                            v-model="material.indexOfRefraction"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('indexOfRefraction')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="直接强度：" v-if="hasKey('directIntensity')">
                        <el-slider 
                            v-model="material.directIntensity"
                            :min="0"
                            :max="10"
                            :step="0.01"
                            @change="saveData('directIntensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="环境敏感度：" v-if="hasKey('environmentIntensity')">
                        <el-slider 
                            v-model="material.environmentIntensity"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('environmentIntensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="相机曝光：" v-if="hasKey('cameraExposure')">
                        <el-slider 
                            v-model="material.cameraExposure"
                            :min="0"
                            :max="10"
                            :step="0.01"
                            @change="saveData('cameraExposure')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="相机反色：" v-if="hasKey('cameraContrast')">
                        <el-slider 
                            v-model="material.cameraContrast"
                            :min="0"
                            :max="5"
                            :step="0.01"
                            @change="saveData('cameraContrast')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="微表面：" v-if="hasKey('microSurface')">
                        <el-slider 
                            v-model="material.microSurface"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('microSurface')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="强制辐照：" v-if="hasKey('forceIrradianceInFragment')">
                        <el-switch 
                            v-model="material.forceIrradianceInFragment"
                            @change="saveData('forceIrradianceInFragment')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="使用默认颜色：" v-if="hasKey('useRGBColor')">
                        <el-switch 
                            v-model="material.useRGBColor"
                            @change="saveData('useRGBColor')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="主要颜色：" v-if="!material.useRGBColor">
                        <el-color-picker 
                            v-model="material.primaryColor"
                            color-format="rgb"
                            @change="saveData('primaryColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="阴影水平：" v-if="!material.useRGBColor">
                        <el-slider 
                            v-model="material.primaryColorShadowLevel"
                            :min="0"
                            :max="1"
                            :step="0.1"
                            @change="saveData('primaryColorShadowLevel')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="高光水平：" v-if="!material.useRGBColor">
                        <el-slider 
                            v-model="material.primaryColorHighlightLevel"
                            :min="0"
                            :max="1"
                            :step="0.1"
                            @change="saveData('primaryColorHighlightLevel')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="速度：" v-if="hasKey('speed')">
                        <el-slider 
                            v-model="material.speed"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('speed')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="风力：" v-if="hasKey('windForce')">
                        <el-slider 
                            v-model="material.windForce"
                            :min="-50"
                            :max="50"
                            :step="1"
                            @change="saveData('windForce')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="波浪高：" v-if="hasKey('waveHeight')">
                        <el-slider 
                            v-model="material.waveHeight"
                            :min="0"
                            :max="3"
                            :step="0.01"
                            @change="saveData('waveHeight')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="波浪长度：" v-if="hasKey('waveLength')">
                        <el-slider 
                            v-model="material.waveLength"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('waveLength')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="波浪速度：" v-if="hasKey('waveSpeed')">
                        <el-slider 
                            v-model="material.waveSpeed"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('waveSpeed')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="风向：" v-if="hasKey('windDirection')">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.windDirection[0]"
                                    :min="0"
                                    :max="10"
                                    :step="0.1"
                                    @change="saveData('windDirection.${0}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.windDirection[1]"
                                    :min="0"
                                    :max="10"
                                    :step="0.1"
                                    @change="saveData('windDirection.${1}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="水流颜色：" v-if="hasKey('waterColor')">
                        <el-color-picker 
                            v-model="material.waterColor"
                            color-format="rgb"
                            @change="saveData('waterColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="水流颜色2：" v-if="hasKey('waterColor2')">
                        <el-color-picker 
                            v-model="material.waterColor2"
                            color-format="rgb"
                            @change="saveData('waterColor2')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="颜色渲染因子：" v-if="hasKey('colorBlendFactor')">
                        <el-slider 
                            v-model="material.colorBlendFactor"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('colorBlendFactor')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="渲染列表：" v-if="hasKey('renderList')">
                        <el-button type="primary" @click="openRenderListDialog">编辑</el-button>
                    </el-form-item>
                    <el-form-item label="不接收灯光：" v-if="hasKey('unlit')">
                        <el-switch 
                            v-model="material.unlit"
                            @change="saveData('unlit')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="雾颜色：" v-if="hasKey('fogColor')">
                        <el-color-picker 
                            v-model="material.fogColor"
                            color-format="rgb"
                            @change="saveData('fogColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="高级毛皮：" v-if="hasKey('highLevelFur')">
                        <el-switch 
                            v-model="material.highLevelFur"
                            @change="saveData('highLevelFur')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="毛皮间隔：" v-if="material.highLevelFur">
                        <el-slider 
                            v-model="material.furSpacing"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('furSpacing')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="毛皮密度：" v-if="material.highLevelFur">
                        <el-slider 
                            v-model="material.furDensity"
                            :min="0"
                            :max="100"
                            :step="1"
                            @change="saveData('furDensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="毛皮速度：" v-if="material.highLevelFur">
                        <el-slider 
                            v-model="material.furSpeed"
                            :min="0"
                            :max="2000"
                            :step="1"
                            @change="saveData('furSpeed')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="毛皮重力：" v-if="material.highLevelFur">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.furGravity[0]"
                                    :min="0"
                                    :max="30"
                                    :step="0.1"
                                    @change="saveData('furGravity.${0}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.furGravity[1]"
                                    :min="0"
                                    :max="30"
                                    :step="0.1"
                                    @change="saveData('furGravity.${1}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.furGravity[2]"
                                    :min="0"
                                    :max="30"
                                    :step="0.1"
                                    @change="saveData('furGravity.${2}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="毛皮质量：" v-if="hasKey('furQuality')">
                        <el-slider 
                            v-model="material.furQuality"
                            :min="0"
                            :max="100"
                            :step="1"
                            @change="saveData('furQuality')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="毛皮长度：" v-if="hasKey('furLength')">
                        <el-slider 
                            v-model="material.furLength"
                            :min="0"
                            :max="100"
                            :step="1"
                            @change="saveData('furLength')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="毛皮角度：" v-if="hasKey('furAngle')">
                        <el-slider 
                            v-model="material.furAngle"
                            :min="0"
                            :max="360"
                            :step="1"
                            @change="saveData('furAngle')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="毛皮颜色：" v-if="hasKey('furColor')">
                        <el-color-picker 
                            v-model="material.furColor"
                            color-format="rgb"
                            @change="saveData('furColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="瓷砖体积：" v-if="hasKey('tileSize')">
                        <el-slider 
                            v-model="material.tileSize"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('tileSize')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="顶部颜色：" v-if="hasKey('topColor')">
                        <el-color-picker 
                            v-model="material.topColor"
                            color-format="rgb"
                            @change="saveData('topColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="底部颜色：" v-if="hasKey('bottomColor')">
                        <el-color-picker 
                            v-model="material.bottomColor"
                            color-format="rgb"
                            @change="saveData('bottomColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="间隔：" v-if="hasKey('offset')">
                        <el-slider 
                            v-model="material.offset"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('offset')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="扩大：" v-if="hasKey('scale')">
                        <el-slider 
                            v-model="material.scale"
                            :min="0"
                            :max="100"
                            :step="1"
                            @change="saveData('scale')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="平滑度：" v-if="hasKey('smoothness')">
                        <el-slider 
                            v-model="material.smoothness"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('smoothness')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="混浊度：" v-if="hasKey('turbidity')">
                        <el-slider 
                            v-model="material.turbidity"
                            :min="0"
                            :max="23"
                            :step="1"
                            @change="saveData('turbidity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="亮度：" v-if="hasKey('luminance')">
                        <el-input-number 
                            v-model="material.luminance" 
                            controls-position="right" 
                            :min="0"
                            :max="1190"
                            :step="1"
                            
                            @change="saveData('luminance')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="倾斜度：" v-if="hasKey('inclination')">
                        <el-slider 
                            v-model="material.inclination"
                            :min="0"
                            :max="0.1"
                            :step="0.01"
                            @change="saveData('inclination')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="地平经度：" v-if="hasKey('azimuth')">
                        <el-slider 
                            v-model="material.azimuth"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('azimuth')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="开启太阳位置：" v-if="hasKey('useSunPosition')">
                        <el-switch 
                            v-model="material.useSunPosition"
                            @change="saveData('useSunPosition')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="太阳位置：" v-if="material.useSunPosition">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.sunPosition[0]"
                                    :min="-100"
                                    :max="100"
                                    :step="1"
                                    @change="saveData('sunPosition.${0}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.sunPosition[1]"
                                    :min="-100"
                                    :max="100"
                                    :step="1"
                                    @change="saveData('sunPosition.${1}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.sunPosition[2]"
                                    :min="-100"
                                    :max="100"
                                    :step="1"
                                    @change="saveData('sunPosition.${2}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="天空透明度：" v-if="hasKey('rayleigh')">
                        <el-slider 
                            v-model="material.rayleigh"
                            :min="0"
                            :max="5"
                            :step="0.1"
                            @change="saveData('rayleigh')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="散射方向：" v-if="hasKey('mieDirectionalG')">
                        <el-slider 
                            v-model="material.mieDirectionalG"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('mieDirectionalG')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="散射系数：" v-if="hasKey('mieCoefficient')">
                        <el-slider 
                            v-model="material.mieCoefficient"
                            :min="0"
                            :max="0.1"
                            :step="0.001"
                            @change="saveData('mieCoefficient')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="主线颜色：" v-if="hasKey('mainColor')">
                        <el-color-picker 
                            v-model="material.mainColor"
                            color-format="rgb"
                            @change="saveData('mainColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="子线颜色：" v-if="hasKey('lineColor')">
                        <el-color-picker 
                            v-model="material.lineColor"
                            color-format="rgb"
                            @change="saveData('lineColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="透明度：" v-if="hasKey('opacity')">
                        <el-slider 
                            v-model="material.opacity"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('opacity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="网格比例：" v-if="hasKey('gridRatio')">
                        <el-slider 
                            v-model="material.gridRatio"
                            :min="0"
                            :max="100"
                            :step="0.1"
                            @change="saveData('gridRatio')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="显示单元格：" v-if="hasKey('minorUnitVisibility')">
                        <el-switch 
                            v-model="material.minorUnitVisibility"
                            @change="saveData('minorUnitVisibility')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="单元格数量：" v-if="material.minorUnitVisibility">
                        <el-slider 
                            v-model="material.majorUnitFrequency"
                            :min="1"
                            :max="100"
                            :step="1"
                            @change="saveData('majorUnitFrequency')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="网格偏移：" v-if="material.minorUnitVisibility">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.gridOffset[0]"
                                    :min="0"
                                    :max="2"
                                    :step="0.1"
                                    @change="saveData('gridOffset.${0}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.gridOffset[1]"
                                    :min="0"
                                    :max="2"
                                    :step="0.1"
                                    @change="saveData('gridOffset.${1}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.gridOffset[2]"
                                    :min="0"
                                    :max="2"
                                    :step="0.1"
                                    @change="saveData('gridOffset.${2}')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="阴影颜色：" v-if="hasKey('shadowColor')">
                        <el-color-picker 
                            v-model="material.shadowColor"
                            color-format="rgb"
                            @change="saveData('shadowColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="材质添加动画" name="3">
                <!-- <el-row v-for="(item, index) in material.animations" :key="index">
                    {{item.name}}
                    <el-button type="primary" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
                </el-row>
                <el-button type="primary" size="mini" @click="openAddAnimationDialog('new')">添加</el-button>
                 -->
                <el-row>
                    <el-col :span="8">
                        是否循环：
                    </el-col>
                    <el-col :span="16">
                        <el-switch v-model="material.animationLoop" @change="saveData('animationLoop')"></el-switch>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        动画速度：
                    </el-col>
                    <el-col :span="16">
                        <el-input-number 
                            v-model="material.animationSpeed" 
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
                <el-row v-for="(item, index) in material.animations" :key="index">
                    <el-col :span="12">
                        {{item.name}}
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="deleteArrayItem(material.animations, index, 'animations')">删除</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="材质子表面设置" name="4" v-if="hasKey('subSurface')">
                <el-form ref="form" :model="material" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="启用子表面：">
                        <el-switch 
                            v-model="material.enableSubSurface"
                            @change="saveData('enableSubSurface')"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="material.subSurface" label-width="80px" size="mini" @submit.native.prevent v-if="material.enableSubSurface">
                    <el-form-item label="启用折射：">
                        <el-switch 
                            v-model="material.subSurface.isRefractionEnabled"
                            @change="saveData('subSurface.isRefractionEnabled')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="折射率：">
                        <el-slider 
                            v-model="material.subSurface.indexOfRefraction"
                            :min="0"
                            :max="2"
                            :step="0.1"
                            @change="saveData('subSurface.indexOfRefraction')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="强度：">
                        <el-slider 
                            v-model="material.subSurface.refractionIntensity"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('subSurface.refractionIntensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="启用半透明：">
                        <el-switch 
                            v-model="material.subSurface.isTranslucencyEnabled"
                            @change="saveData('subSurface.isTranslucencyEnabled')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="半透明敏感度：">
                        <el-slider 
                            v-model="material.subSurface.translucencyIntensity"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('subSurface.translucencyIntensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="淡色：">
                        <el-color-picker 
                            v-model="material.subSurface.tintColor"
                            color-format="rgb"
                            @change="saveData('subSurface.tintColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="淡色距离：">
                        <el-slider 
                            v-model="material.subSurface.tintColorAtDistance"
                            :min="0"
                            :max="30"
                            :step="1"
                            @change="saveData('subSurface.tintColorAtDistance')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="最小厚度：">
                        <el-slider 
                            v-model="material.subSurface.minimumThickness"
                            :min="0"
                            :max="100"
                            :step="1"
                            @change="saveData('subSurface.minimumThickness')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="最大厚度：">
                        <el-slider 
                            v-model="material.subSurface.maximumThickness"
                            :min="0"
                            :max="100"
                            :step="1"
                            @change="saveData('subSurface.maximumThickness')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="透明度链接折射：">
                        <el-switch 
                            v-model="material.subSurface.linkRefractionWithTransparency"
                            @change="saveData('subSurface.linkRefractionWithTransparency')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="使用面罩厚度纹理：">
                        <el-switch 
                            v-model="material.subSurface.useMaskFromThicknessTexture"
                            @change="saveData('subSurface.linkRefractionWithTransparency')"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="材质透明涂层" name="5" v-if="hasKey('clearCoat')">
                <el-form ref="form" :model="material" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="启用透明涂层：">
                        <el-switch 
                            v-model="material.enableClearCoat"
                            @change="saveData('enableClearCoat')"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="material.clearCoat" label-width="80px" size="mini" @submit.native.prevent v-if="material.enableClearCoat">
                    <!-- <el-form-item label="启用：">
                        <el-switch 
                            v-model="material.clearCoat.isEnabled"
                            @change="saveData('clearCoat.isEnabled')"
                        >
                        </el-switch>
                    </el-form-item> -->
                    <el-form-item label="强度：">
                        <el-slider 
                            v-model="material.clearCoat.intensity"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('clearCoat.intensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="启用淡色：">
                        <el-switch 
                            v-model="material.clearCoat.isTintEnabled"
                            @change="saveData('clearCoat.isTintEnabled')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="淡色：">
                        <el-color-picker 
                            v-model="material.clearCoat.tintColor"
                            color-format="rgb"
                            @change="saveData('clearCoat.tintColor')"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="淡色距离：">
                        <el-slider 
                            v-model="material.clearCoat.tintColorAtDistance"
                            :min="0"
                            :max="30"
                            :step="1"
                            @change="saveData('clearCoat.tintColorAtDistance')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="淡色厚度：">
                        <el-slider 
                            v-model="material.clearCoat.tintThickness"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('clearCoat.tintThickness')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="粗糙度：">
                        <el-slider 
                            v-model="material.clearCoat.roughness"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('clearCoat.roughness')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="折射率：">
                        <el-slider 
                            v-model="material.clearCoat.indexOfRefraction"
                            :min="0"
                            :max="10"
                            :step="0.1"
                            @change="saveData('clearCoat.indexOfRefraction')"
                        >
                        </el-slider>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="材质各向异性" name="6" v-if="hasKey('anisotropy')">
                <el-form ref="form" :model="material" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="启用各向异性：">
                        <el-switch 
                            v-model="material.enableAnisotropy"
                            @change="saveData('enableAnisotropy')"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="material.anisotropy" label-width="80px" size="mini" @submit.native.prevent v-if="material.enableAnisotropy">
                    <!-- <el-form-item label="启用：">
                        <el-switch 
                            v-model="material.anisotropy.isEnabled"
                            @change="saveData('anisotropy.isEnabled')"
                        >
                        </el-switch>
                    </el-form-item> -->
                    <el-form-item label="强度：">
                        <el-slider 
                            v-model="material.anisotropy.intensity"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('anisotropy.intensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="方向：">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.anisotropy.direction.x"
                                    :min="-1"
                                    :max="1"
                                    :step="0.01"
                                    @change="saveData('anisotropy.direction.x')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-slider 
                                    v-model="material.anisotropy.direction.y"
                                    :min="-1"
                                    :max="1"
                                    :step="0.01"
                                    @change="saveData('anisotropy.direction.y')"
                                >
                                </el-slider>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="材质光泽" name="7" v-if="hasKey('sheen')">
                <el-form ref="form" :model="material" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="启用光泽：">
                        <el-switch 
                            v-model="material.enableSheen"
                            @change="saveData('enableSheen')"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="material.sheen" label-width="80px" size="mini" @submit.native.prevent v-if="material.enableSheen">
                    <!-- <el-form-item label="启用：">
                        <el-switch 
                            v-model="material.sheen.isEnabled"
                            @change="saveData('sheen.isEnabled')"
                        >
                        </el-switch>
                    </el-form-item> -->
                    <el-form-item label="强度：">
                        <el-slider 
                            v-model="material.sheen.intensity"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('sheen.intensity')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="淡色：">
                        <el-color-picker 
                            v-model="material.sheen.color"
                            color-format="rgb"
                            @change="saveData('sheen.color')"
                        >
                        </el-color-picker>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>

        <!-- 新建纹理弹出框 -->
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="30%"
        >
            <el-select v-model="addTextureType" placeholder="请选择纹理类型">
                <el-option 
                    v-for="item in addTextureList"
                    :key="item.type"
                    :label="item.name"
                    :value="item.type"
                >
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTexture">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 菲涅尔编辑弹出框 -->
        <el-dialog
            :title="dialogTitle2"
            :visible.sync="dialogVisible2"
            width="30%"
        >
            <div>
                <el-form ref="form" :model="editFresnelParametersObj" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="颜色左：">
                        <el-color-picker 
                            v-model="editFresnelParametersObj.leftColor"
                            color-format="rgb"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="颜色右：">
                        <el-color-picker 
                            v-model="editFresnelParametersObj.rightColor"
                            color-format="rgb"
                        >
                        </el-color-picker>
                    </el-form-item>
                    <el-form-item label="偏度：">
                        <el-slider 
                            v-model="editFresnelParametersObj.bias"
                            :min="0"
                            :max="1"
                            :step="0.01"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="强度：">
                        <el-slider 
                            v-model="editFresnelParametersObj.power"
                            :min="0"
                            :max="100"
                            :step="1"
                        >
                        </el-slider>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="editFresnelParameters">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 渲染列表物体编辑弹出框 -->
        <el-dialog
            title="渲染列表"
            :visible.sync="dialogVisible_renderList"
            width="30%"
        >
            <el-checkbox-group v-model="renderList">
                <el-checkbox 
                    v-for="item in meshes" 
                    :key="item.id" 
                    :label="item.id"
                >
                    {{item.name}}
                </el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_renderList = false">取 消</el-button>
                <el-button type="primary" @click="bindMeshId">确 定</el-button>
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
    import { generateRandomKey, getState } from '@/canvas/common';
    import { materialTextureDatas, textureDatas } from '@/master/js/meshData';
    import { updateObjectView, addObjectView, goback } from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';
    import animation from '@/master/animation';
    import { animationDatas } from '@/master/js/meshData';

    export default {
        data: () => ({
            name: 'materialSetting',
            activeNames: ['1'],
            
            dialogVisible: false,  //新建纹理对话框显示
            dialogTitle: null,  //新建纹理对话框标题
            dialogTextureType: null,  //新建纹理对话框 纹理属性
            addTextureList: [],  //可新建纹理列表
            addTextureType: null,  //新建纹理类型

            dialogVisible2: false,  //编辑菲涅尔对话框显示
            dialogTitle2: null,  //编辑菲涅尔对话框标题
            editFresnelParametersType: null,  //菲涅尔所属材质纹理类型
            editFresnelParametersObj: {},  //菲涅尔对象

            dialogVisible_renderList: false,  //渲染列表弹出框显示
            renderList: [],  //渲染列表数组

            dialogVisible_animation: false,  //添加动画弹出框
            dialogTitle_animation: '',  //添加动画弹出框标题
            dialog_animation_property: [],  //添加动画的属性
            animationObj: null,  //动画对象
            animationProperty: null,  //属性详情
            dialog_animation_method: null,  //新增 或 编辑
            dialog_animation_index: null,  //编辑索引
            material:null
        }),
        components: {
            animation,
        },
        watch:{
            materialCom: {
                handler(nv, ov) {
                    this.material = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            materialCom(){ //材质对象
                let curMaterialId = getState('master', 'curMaterialId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'materials',
                    id: curMaterialId
                });

                if(object){
                    return deepCopy(object);
                }

                return null;
            },
            textures(){ //已创建的纹理库
                return getState('master', 'textures');
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
            goback(){
                goback();
            },
            hasKey(keyName){
                return (keyName in this.material);
            },
            textureFilter(textureType){
                if(this.textures.length == 0){
                    return this.textures;
                }

                let data = deepCopy(this.textures);

                let materialType = this.material.type;
                let canChooseTextures = materialTextureDatas[materialType][textureType];

                data = data.filter(item => {
                    let canChoose = false;

                    for(let i = 0; i < canChooseTextures.length; i++){
                        if(canChooseTextures[i].type == item.type){
                            canChoose = true;
                            break;
                        }
                    }

                    return canChoose;
                })

                return data;
            },
            openDialog(type, name){
                this.dialogTextureType = type;
                this.addTextureList = materialTextureDatas[this.material.type][type];
                this.addTextureType = null;
                this.dialogTitle = '新建' + name + '纹理';
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

                // this.$store.commit('master/changeCurId', {
                //     key: 'curTextureId',
                //     value: texture.id
                // });

                //如果要新建纹理的纹理属性没有值，则把新建的纹理赋给它
                if(this.material[this.dialogTextureType] == null || this.material[this.dialogTextureType] == ''){
                    this.material[this.dialogTextureType] = texture.id;
                    this.saveData(this.dialogTextureType);
                }

                // this.$store.commit('master/changeCurModelName', 'texture');

                // this.$store.commit('master/refreshMasterLayerTime');

                addObjectView(texture);
            },
            openDialog2(type, name){
                this.editFresnelParametersType = type;

                let FresnelParameters = this.material[type];
                if(FresnelParameters != null){
                    this.editFresnelParametersObj = deepCopy(FresnelParameters);
                }
                else{
                    this.editFresnelParametersObj = {};
                }

                this.dialogTitle2 = '编辑' + name + '菲涅尔';
                this.dialogVisible2 = true;
            },
            editFresnelParameters(){
                this.material[this.editFresnelParametersType] = this.editFresnelParametersObj;
                this.dialogVisible2 = false;

                this.saveData(this.editFresnelParametersType);
            },
            openRenderListDialog(){
                this.renderList = deepCopy(this.material.renderList);
                this.dialogVisible_renderList = true;
            },
            bindMeshId(){
                this.material.renderList = this.renderList;
                this.saveData('renderList');
                this.dialogVisible_renderList = false;
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

                    let ani = this.material.animations[index];
                    let p1 = ani.property.split('.')[0];

                    this.animationObj = deepCopy(ani);
                    this.animationProperty = deepCopy(animationDatas['material'][p1]);
                    this.dialogTitle_animation = '动画--' + this.animationProperty.propertyName;
                }

                this.dialogVisible_animation = true;
            },
            animationPropertyFilter(){
                let data = [];
                let animationData = animationDatas['material'];

                for(let key in this.material){
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
                    name: '动画' + this.material.animations.length,
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
                this.animationProperty = deepCopy(animationDatas['material'][p1]);

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
                    ani.id = generateRandomKey("materialAni");
                    this.material.animations.push(ani);
                }
                else if(this.dialog_animation_method == 'edit'){
                    this.material.animations[this.dialog_animation_index] = ani;
                }

                this.saveData('animations');
                this.dialogVisible_animation = false;
            },
            saveData(type){
                let materials = getState('master', 'materials');
                let curMaterialId = getState('master', 'curMaterialId'); 

                let index = 0;
                for(let i = 0; i < materials.length; i++){
                    if(materials[i].id == curMaterialId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(materials[index]);

                let value = this.material[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.material[item];
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

                this.$store.commit('master/updateCommands', {
                    key: 'materials.${'+ index +'}.' + updateType,
                    value: this.material[updateType]
                });

                this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.material, index, preObject);
            },
        },
    }
</script>

<style lang="scss">
    .materialSetting{
        padding: 10px;
        user-select: none;

        .textureItem{
            padding: 10px 0;
            border-bottom: 1px solid #f2f2f2;
        }
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