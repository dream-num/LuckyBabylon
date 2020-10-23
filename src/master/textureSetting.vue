<template>
    <div class="textureSetting" v-if="texture!=null">
        <el-button type="primary" @click="goback" size="mini" style="margin-bottom:10px;">返回</el-button>
        <el-form ref="form" :model="texture" label-width="80px" size="mini" @submit.native.prevent>
            <el-form-item label="纹理名称：">
                <el-input 
                    v-model="texture.name" 
                    @change="saveData('name')"
                    placeholder="请输入纹理名称"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="启用六角图片：" v-if="hasKey('enableSixImage')">
                <el-switch 
                    v-model="texture.enableSixImage"
                    @change="saveData('enableSixImage')"
                >
                </el-switch>
            </el-form-item>
            <el-form-item label="资源：" v-if="hasKey('source') && !texture.enableSixImage ">
                <el-upload
                    class="upload-source"
                    action=""
                    :limit="1"
                    :show-file-list="false"
                    :on-progress="handleSourceSuccess"
                    :before-upload="beforeSourceUpload"
                >
                    <img v-if="texture.source && texture.type!='CubeTexture' && texture.type!='HDRCubeTexture' " :src="texture.source" class="sourceImg">
                    <i v-else-if="texture.source" style="font-size:120px;" class="el-icon-picture-outline-round"></i>
                    <i v-else class="el-icon-plus source-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <div v-if="hasKey('sourceArray') && texture.enableSixImage ">
                <el-form-item label="px方位：">
                    <el-upload
                        class="upload-source"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :on-progress="handleSourceSix0"
                        :before-upload="beforeSourceUpload"
                    >
                        <img v-if="texture.sourceArray[0]" :src="texture.sourceArray[0]" class="sourceImg">
                        <i v-else class="el-icon-plus source-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="py方位：">
                    <el-upload
                        class="upload-source"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :on-progress="handleSourceSix1"
                        :before-upload="beforeSourceUpload"
                    >
                        <img v-if="texture.sourceArray[1]" :src="texture.sourceArray[1]" class="sourceImg">
                        <i v-else class="el-icon-plus source-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="pz方位：">
                    <el-upload
                        class="upload-source"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :on-progress="handleSourceSix2"
                        :before-upload="beforeSourceUpload"
                    >
                        <img v-if="texture.sourceArray[2]" :src="texture.sourceArray[2]" class="sourceImg">
                        <i v-else class="el-icon-plus source-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="nx方位：">
                    <el-upload
                        class="upload-source"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :on-progress="handleSourceSix3"
                        :before-upload="beforeSourceUpload"
                    >
                        <img v-if="texture.sourceArray[3]" :src="texture.sourceArray[3]" class="sourceImg">
                        <i v-else class="el-icon-plus source-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="ny方位：">
                    <el-upload
                        class="upload-source"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :on-progress="handleSourceSix4"
                        :before-upload="beforeSourceUpload"
                    >
                        <img v-if="texture.sourceArray[4]" :src="texture.sourceArray[4]" class="sourceImg">
                        <i v-else class="el-icon-plus source-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="nz方位：">
                    <el-upload
                        class="upload-source"
                        action=""
                        :limit="1"
                        :show-file-list="false"
                        :on-progress="handleSourceSix5"
                        :before-upload="beforeSourceUpload"
                    >
                        <img v-if="texture.sourceArray[5]" :src="texture.sourceArray[5]" class="sourceImg">
                        <i v-else class="el-icon-plus source-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>


            
            <el-form-item label="视频地址：" v-if="texture.type=='VideoTexture'">
                <el-input placeholder="请输入视频地址" v-model="texture.videoSrc" @change="saveData('videoSrc')">
                    <!-- <template slot="prepend">Http://</template> -->
                </el-input>
            </el-form-item>

            <el-form-item label="自动播放：" v-if="texture.type=='VideoTexture'">
                <el-switch 
                    v-model="texture.autoplay"
                    @change="saveData('autoplay')"
                >
                </el-switch>
            </el-form-item>

            <el-form-item label="视频载入图：" v-if="texture.type=='VideoTexture'">
                <el-input placeholder="请输入视频载入图地址" v-model="texture.poster" @change="saveData('poster')">
                    <!-- <template slot="prepend">Http://</template> -->
                </el-input>
            </el-form-item>

            <el-form-item label="载入不显示："  v-if="texture.type=='VideoTexture' || texture.type=='Texture'">
                <el-switch 
                    v-model="texture.isBlocking"
                    @change="saveData('isBlocking')"
                >
                </el-switch>
            </el-form-item>

            <el-form-item label="精度体积：" v-if="texture.type=='HDRCubeTexture' || texture.type=='EquiRectangularCubeTexture'">
                <el-slider 
                    v-model="texture.textureSize"
                    :min="256"
                    :max="2560"
                    :step="16"
                    @change="saveData('textureSize')"
                >
                </el-slider>
            </el-form-item>
            <!-- <el-form-item label="反向：" v-if="hasKey('invertY')">
                <el-switch 
                    v-model="texture.invertY"
                    @change="saveData('invertY')"
                >
                </el-switch>
            </el-form-item>
            <el-form-item label="反向：" v-if="hasKey('invertZ')">
                <el-switch 
                    v-model="texture.invertZ"
                    @change="saveData('invertZ')"
                >
                </el-switch>
            </el-form-item> -->
            <el-form-item label="透明度：" v-if="hasKey('hasAlpha')">
                <el-switch 
                    v-model="texture.hasAlpha"
                    @change="saveData('hasAlpha')"
                >
                </el-switch>
            </el-form-item>
            <el-form-item label="纹理强度：" v-if="hasKey('level')">
                <el-slider 
                    v-model="texture.level"
                    :min="0"
                    :max="2"
                    :step="0.1"
                    @change="saveData('level')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="垂直缩放：" v-if="hasKey('vScale')">
                <!-- <el-slider 
                    v-model="texture.vScale"
                    :min="-30"
                    :max="30"
                    :step="0.1"
                    @change="saveData('vScale')"
                >
                </el-slider> -->
                <el-input-number 
                    v-model="texture.vScale"
                    :min="-30"
                    :max="30"
                    :step="0.1"
                    @change="saveData('vScale')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="水平缩放：" v-if="hasKey('uScale')">
                <!-- <el-slider 
                    v-model="texture.uScale"
                    :min="-30"
                    :max="30"
                    :step="0.1"
                    @change="saveData('uScale')"
                >
                </el-slider> -->
                <el-input-number 
                    v-model="texture.uScale"
                    :min="-30"
                    :max="30"
                    :step="0.1"
                    @change="saveData('uScale')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="垂直偏移：" v-if="hasKey('vOffset')">
                <el-slider 
                    v-model="texture.vOffset"
                    :min="0"
                    :max="100"
                    :step="0.1"
                    @change="saveData('vOffset')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="水平偏移：" v-if="hasKey('uOffset')">
                <el-slider 
                    v-model="texture.uOffset"
                    :min="0"
                    :max="100"
                    :step="0.1"
                    @change="saveData('uOffset')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="垂直旋转：" v-if="hasKey('vAng')">
                <el-slider 
                    v-model="texture.vAng"
                    :min="0"
                    :max="360"
                    :step="1"
                    @change="saveData('vAng')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="水平旋转：" v-if="hasKey('uAng')">
                <el-slider 
                    v-model="texture.uAng"
                    :min="0"
                    :max="360"
                    :step="1"
                    @change="saveData('uAng')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="旋转：" v-if="hasKey('rotationY')">
                <el-slider 
                    v-model="texture.rotationY"
                    :min="0"
                    :max="360"
                    :step="1"
                    @change="saveData('rotationY')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="坐标模式：" v-if="hasKey('coordinatesMode')">
                <el-select 
                    v-model="texture.coordinatesMode" 
                    @change="saveData('coordinatesMode')"
                    placeholder="请选择坐标模式"
                >
                    <el-option label="精密模式" :value="0"></el-option>
                    <el-option label="球形模式" :value="1"></el-option>
                    <el-option label="平面模式" :value="2"></el-option>
                    <el-option label="立方体模式" :value="3"></el-option>
                    <el-option label="投影模式" :value="4"></el-option>
                    <el-option label="天空体模式" :value="5"></el-option>
                    <el-option label="颠倒立方体模式" :value="6"></el-option>
                    <el-option label="等边矩形模式" :value="7"></el-option>
                    <el-option label="固定等边矩形模式" :value="8"></el-option>
                    <el-option label="固定等边矩形镜像模式" :value="9"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="刷新率：" v-if="hasKey('refreshRate')">
                <el-slider 
                    v-model="texture.refreshRate"
                    :min="0"
                    :max="10"
                    :step="1"
                    @change="saveData('refreshRate')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="精度：" v-if="hasKey('ratio')">
                <el-slider 
                    v-model="texture.ratio"
                    :min="0"
                    :max="1"
                    :step="0.01"
                    @change="saveData('ratio')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="折射距离：" v-if="hasKey('distance')">
                <el-slider 
                    v-model="texture.distance"
                    :min="-20"
                    :max="20"
                    :step="0.1"
                    @change="saveData('distance')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="镜像模糊：" v-if="hasKey('adaptiveBlurKernel')">
                <el-slider 
                    v-model="texture.adaptiveBlurKernel"
                    :min="0"
                    :max="100"
                    :step="1"
                    @change="saveData('adaptiveBlurKernel')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="镜像偏移：" v-if="hasKey('mirrorPlane')">
                <el-row>
                    <el-col :span="4">a：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.mirrorPlane[0]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('mirrorPlane.${0}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">b：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.mirrorPlane[1]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('mirrorPlane.${1}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">c：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.mirrorPlane[2]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('mirrorPlane.${2}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">d：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.mirrorPlane[3]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('mirrorPlane.${3}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="深度：" v-if="hasKey('depth')">
                <el-slider 
                    v-model="texture.depth"
                    :min="0"
                    :max="100"
                    :step="1"
                    @change="saveData('depth')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="折射偏移：" v-if="hasKey('refractionPlane')">
                <el-row>
                    <el-col :span="4">a：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.refractionPlane[0]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('refractionPlane.${0}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">b：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.refractionPlane[1]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('refractionPlane.${1}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">c：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.refractionPlane[2]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('refractionPlane.${2}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">d：</el-col>
                    <el-col :span="20">
                        <el-input-number 
                            v-model="texture.refractionPlane[3]" 
                            controls-position="right" 
                            :min="-20"
                            :max="20"
                            :step="0.1"
                            step-strictly
                            @change="saveData('refractionPlane.${3}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="砖块高度：" v-if="hasKey('numberOfBricksHeight')">
                <el-input-number 
                    v-model="texture.numberOfBricksHeight" 
                    controls-position="right" 
                    :min="0"
                    :step="1"
                    step-strictly
                    @change="saveData('numberOfBricksHeight')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="砖块宽度：" v-if="hasKey('numberOfBricksWidth')">
                <el-input-number 
                    v-model="texture.numberOfBricksWidth" 
                    controls-position="right" 
                    :min="0"
                    :step="1"
                    step-strictly
                    @change="saveData('numberOfBricksWidth')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="瓷砖高度：" v-if="hasKey('numberOfTilesHeight')">
                <el-input-number 
                    v-model="texture.numberOfTilesHeight" 
                    controls-position="right" 
                    :min="0"
                    :step="1"
                    step-strictly
                    @change="saveData('numberOfTilesHeight')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="瓷砖宽度：" v-if="hasKey('numberOfTilesWidth')">
                <el-input-number 
                    v-model="texture.numberOfTilesWidth" 
                    controls-position="right" 
                    :min="0"
                    :step="1"
                    step-strictly
                    @change="saveData('numberOfTilesWidth')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="连接处颜色：" v-if="hasKey('jointColor')">
                <el-color-picker 
                    v-model="texture.jointColor"
                    color-format="rgb"
                    @change="saveData('jointColor')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="砖块颜色：" v-if="hasKey('brickColor')">
                <el-color-picker 
                    v-model="texture.brickColor"
                    color-format="rgb"
                    @change="saveData('brickColor')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="天空颜色：" v-if="hasKey('skyColor')">
                <el-color-picker 
                    v-model="texture.skyColor"
                    color-format="rgb"
                    show-alpha
                    @change="saveData('skyColor')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="云颜色：" v-if="hasKey('cloudColor')">
                <el-color-picker 
                    v-model="texture.cloudColor"
                    color-format="rgb"
                    show-alpha
                    @change="saveData('cloudColor')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="火焰速度：" v-if="hasKey('speed')">
                <el-row>
                    <el-col :span="4">X：</el-col>
                    <el-col :span="10">
                        <el-input-number 
                            v-model="texture.speed[0]" 
                            controls-position="right" 
                            :min="0"
                            :step="0.01"
                            step-strictly
                            @change="saveData('speed.${0}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">Y：</el-col>
                    <el-col :span="10">
                        <el-input-number 
                            v-model="texture.speed[1]" 
                            controls-position="right"
                            :min="0" 
                            :step="0.01"
                            step-strictly
                            @change="saveData('speed.${1}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="火焰方向：" v-if="hasKey('shift')">
                <el-row>
                    <el-col :span="4">X：</el-col>
                    <el-col :span="10">
                        <el-input-number 
                            v-model="texture.shift[0]" 
                            controls-position="right" 
                            :min="0"
                            :step="0.01"
                            step-strictly
                            @change="saveData('shift.${0}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">Y：</el-col>
                    <el-col :span="10">
                        <el-input-number 
                            v-model="texture.shift[1]" 
                            controls-position="right"
                            :min="0" 
                            :step="0.01"
                            step-strictly
                            @change="saveData('shift.${1}')"
                        >
                        </el-input-number>
                    </el-col>
                </el-row>
            </el-form-item>
            <!-- <el-form-item label="火焰颜色：" v-if="hasKey('fireColors')">
                <el-color-picker 
                    v-model="texture.fireColors"
                    color-format="rgb"
                    @change="saveData('fireColors')"
                >
                </el-color-picker>
            </el-form-item> -->
            <el-form-item label="火焰颜色1：" v-if="hasKey('c1')">
                <el-color-picker 
                    v-model="texture.c1"
                    color-format="rgb"
                    @change="saveData('c1')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="火焰颜色2：" v-if="hasKey('c2')">
                <el-color-picker 
                    v-model="texture.c2"
                    color-format="rgb"
                    @change="saveData('c2')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="火焰颜色3：" v-if="hasKey('c3')">
                <el-color-picker 
                    v-model="texture.c3"
                    color-format="rgb"
                    @change="saveData('c3')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="火焰颜色4：" v-if="hasKey('c4')">
                <el-color-picker 
                    v-model="texture.c4"
                    color-format="rgb"
                    @change="saveData('c4')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="火焰颜色5：" v-if="hasKey('c5')">
                <el-color-picker 
                    v-model="texture.c5"
                    color-format="rgb"
                    @change="saveData('c5')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="火焰颜色6：" v-if="hasKey('c6')">
                <el-color-picker 
                    v-model="texture.c6"
                    color-format="rgb"
                    @change="saveData('c6')"
                >
                </el-color-picker>
            </el-form-item>
            <!-- <el-form-item label="草颜色：" v-if="hasKey('grassColors')">
                <el-color-picker 
                    v-model="texture.grassColors"
                    color-format="rgb"
                    @change="saveData('grassColors')"
                >
                </el-color-picker>
            </el-form-item> -->
            <el-form-item label="草颜色1：" v-if="hasKey('herb1Color')">
                <el-color-picker 
                    v-model="texture.herb1Color"
                    color-format="rgb"
                    @change="saveData('herb1Color')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="草颜色2：" v-if="hasKey('herb2Color')">
                <el-color-picker 
                    v-model="texture.herb2Color"
                    color-format="rgb"
                    @change="saveData('herb2Color')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="草颜色3：" v-if="hasKey('herb3Color')">
                <el-color-picker 
                    v-model="texture.herb3Color"
                    color-format="rgb"
                    @change="saveData('herb3Color')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="草地底色：" v-if="hasKey('groundColor')">
                <el-color-picker 
                    v-model="texture.groundColor"
                    color-format="rgb"
                    @change="saveData('groundColor')"
                >
                </el-color-picker>
            </el-form-item>
            <!-- <el-form-item label="大理石颜色：" v-if="hasKey('marbleColor')">
                <el-color-picker 
                    v-model="texture.marbleColor"
                    color-format="rgb"
                    @change="saveData('marbleColor')"
                >
                </el-color-picker>
            </el-form-item> -->
            <el-form-item label="马路颜色：" v-if="hasKey('roadColor')">
                <el-color-picker 
                    v-model="texture.roadColor"
                    color-format="rgb"
                    @change="saveData('roadColor')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="木头颜色：" v-if="hasKey('woodColor')">
                <el-color-picker 
                    v-model="texture.woodColor"
                    color-format="rgb"
                    @change="saveData('woodColor')"
                >
                </el-color-picker>
            </el-form-item>
            <el-form-item label="放大：" v-if="hasKey('ampScale')">
                <el-input-number 
                    v-model="texture.ampScale" 
                    controls-position="right" 
                    :min="0"
                    :step="1"
                    step-strictly
                    @change="saveData('ampScale')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="亮度：" v-if="hasKey('brightness')">
                <el-slider 
                    v-model="texture.brightness"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    @change="saveData('brightness')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="亮度：" v-if="hasKey('StarfieldBrightness')">
                <el-slider 
                    v-model="texture.StarfieldBrightness"
                    :min="0"
                    :max="0.1"
                    :step="0.001"
                    @change="saveData('StarfieldBrightness')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="beta：" v-if="hasKey('beta')">
                <el-slider 
                    v-model="texture.beta"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    @change="saveData('beta')"
                >
                </el-slider>
            </el-form-item>
            <el-form-item label="时间：" v-if="hasKey('Starfieldtime')">
                <el-input-number 
                    v-model="texture.Starfieldtime" 
                    controls-position="right" 
                    :step="1"
                    step-strictly
                    @change="saveData('Starfieldtime')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="八度：" v-if="hasKey('octaves')">
                <el-input-number 
                    v-model="texture.octaves" 
                    controls-position="right" 
                    :min="0"
                    :step="1"
                    step-strictly
                    @change="saveData('octaves')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="持久性：" v-if="hasKey('persistence')">
                <el-input-number 
                    v-model="texture.persistence" 
                    controls-position="right" 
                    :min="0"
                    :step="0.1"
                    step-strictly
                    @change="saveData('persistence')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="动画速度因子：" v-if="hasKey('animationSpeedFactor')">
                <el-input-number 
                    v-model="texture.animationSpeedFactor" 
                    controls-position="right" 
                    :min="0"
                    :step="1"
                    step-strictly
                    @change="saveData('animationSpeedFactor')"
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="反射物体" v-if="hasKey('renderList')">
                <el-button type="primary" @click="openDialog">编辑</el-button>
            </el-form-item>
        </el-form>
        <!-- <el-row v-for="(item, index) in texture.animations" :key="index">
            {{item.name}}
            <el-button type="primary" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
        </el-row>
        <el-button type="primary" size="mini" @click="openAddAnimationDialog('new')">添加</el-button> -->
        <el-row>
            <el-col :span="8">
                是否循环：
            </el-col>
            <el-col :span="16">
                <el-switch v-model="texture.animationLoop" @change="saveData('animationLoop')"></el-switch>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                动画速度：
            </el-col>
            <el-col :span="16">
                <el-input-number 
                    v-model="texture.animationSpeed" 
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
        <el-row v-for="(item, index) in texture.animations" :key="index">
            <el-col :span="12">
                {{item.name}}
            </el-col>
            <el-col :span="3">
                <el-button type="text" style="margin-left: 0px;" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
            </el-col>
            <el-col :span="3">
                <el-button type="text" style="margin-left: 0px;" size="mini" @click="deleteArrayItem(texture.animations, index, 'animations')">删除</el-button>
            </el-col>
        </el-row>

        <!-- 反射物体编辑弹出框 -->
        <el-dialog
            title="反射物体"
            :visible.sync="dialogVisible"
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
                <el-button @click="dialogVisible = false">取 消</el-button>
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
    import { getState, generateRandomKey } from '@/canvas/common';
    import { updateObjectView, goback, uploadImageCheck } from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';
    import animation from '@/master/animation';
    import { animationDatas } from '@/master/js/meshData';

    export default {
        data: () => ({
            name: 'textureSetting',
            dialogVisible: false,  //弹出框显示
            renderList: [],  //反射物体id列表

            dialogVisible_animation: false,  //添加动画弹出框
            dialogTitle_animation: '',  //添加动画弹出框标题
            dialog_animation_property: [],  //添加动画的属性
            animationObj: null,  //动画对象
            animationProperty: null,  //属性详情
            dialog_animation_method: null,  //新增 或 编辑
            dialog_animation_index: null,  //编辑索引
            texture:null,
        }),
        watch:{
            textureCom: {
                handler(nv, ov) {
                    this.texture = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            textureCom(){ //纹理对象
                let curTextureId = getState('master', 'curTextureId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'textures',
                    id: curTextureId
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
            hasKey(keyName){
                return (keyName in this.texture);
            },
            goback(){
                goback();
            },
            beforeSourceUpload(file){
                uploadImageCheck(file, this);
            },
            handleSourceSuccess(event, file, fileList){
                let _this = this;
                let a = new FileReader();
                let extention = file.name.split(".")[1].toLowerCase();
                a.onload = function (e) { 
                    _this.texture.source = e.target.result;
                    _this.saveData('source', extention);
			    }
			    a.readAsDataURL(file.raw);
            },
            handleSourceSix0(event, file, fileList){
                this.handleSourceSixHandle(event, file, fileList, 0);
            },
            handleSourceSix1(event, file, fileList){
                this.handleSourceSixHandle(event, file, fileList, 1);
            },
            handleSourceSix2(event, file, fileList){
                this.handleSourceSixHandle(event, file, fileList, 2);
            },
            handleSourceSix3(event, file, fileList){
                this.handleSourceSixHandle(event, file, fileList, 3);
            },
            handleSourceSix4(event, file, fileList){
                this.handleSourceSixHandle(event, file, fileList, 4);
            },
            handleSourceSix5(event, file, fileList){
                this.handleSourceSixHandle(event, file, fileList, 5);
            },
            handleSourceSixHandle(event, file, fileList, index){
                let _this = this;
                let a = new FileReader();
                let extention = file.name.split(".")[1].toLowerCase();
                a.onload = function (e) { 
                    _this.texture.sourceArray[index] = e.target.result;
                    _this.saveData('sourceArray', extention);
			    }
			    a.readAsDataURL(file.raw);
            },
            openDialog(){
                this.renderList = deepCopy(this.texture.renderList);
                this.dialogVisible = true;
            },
            bindMeshId(){
                this.texture.renderList = this.renderList;
                this.saveData('renderList');
                this.dialogVisible = false;
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

                    let ani = this.texture.animations[index];
                    let p1 = ani.property.split('.')[0];

                    this.animationObj = deepCopy(ani);
                    this.animationProperty = deepCopy(animationDatas['texture'][p1]);
                    this.dialogTitle_animation = '动画--' + this.animationProperty.propertyName;
                }

                this.dialogVisible_animation = true;
            },
            animationPropertyFilter(){
                let data = [];
                let animationData = animationDatas['texture'];

                for(let key in this.texture){
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
                    name: '动画' + this.texture.animations.length,
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
                this.animationProperty = deepCopy(animationDatas['texture'][p1]);

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
                    this.texture.animations.push(ani);
                }
                else if(this.dialog_animation_method == 'edit'){
                    this.texture.animations[this.dialog_animation_index] = ani;
                }

                this.saveData('animations');
                this.dialogVisible_animation = false;
            },
            saveData(type, fileExtension){
                let textures = getState('master', 'textures');
                let curTextureId = getState('master', 'curTextureId'); 

                let index = 0;
                for(let i = 0; i < textures.length; i++){
                    if(textures[i].id == curTextureId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(textures[index]);

                let value = this.texture[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.texture[item];
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


                // if(type=="source" && this.texture.type=="CubeTexture"){
                //     if(fileExtension && fileExtension!="dds"){
                //         this.$store.commit('master/updateCommands', {
                //             key: 'textures.${'+ index +'}.extention',
                //             value: fileExtension
                //         });
                //     }
                //     else{
                //         this.$store.commit('master/updateCommands', {
                //             key: 'textures.${'+ index +'}.extention',
                //             value: "dds"
                //         });
                //     }
                    
                // }

                if(type=="source" && this.texture.type=="CubeTexture"){
                    if(fileExtension && fileExtension!="dds"){
                        this.texture.extention = fileExtension;
                    }
                    else{
                        this.texture.extention = "dds";
                    }
                }


                this.$store.commit('master/updateCommands', {
                    key: 'textures.${'+ index +'}.' + updateType,
                    value: this.texture[updateType]
                });

                // this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.texture, index, preObject);
            },
        },
    }
</script>

<style lang="scss">
    .textureSetting{
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