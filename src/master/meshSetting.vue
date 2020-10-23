<template>
    <div class="meshSetting" v-if="mesh!=null">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="物体专属配置" name="1" >
                <el-form ref="form"  :model="mesh" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="形状程序：" v-if="hasKey('pro')">
                        <el-button type="primary" @click="openEditProgramDialog">编辑</el-button>
                    </el-form-item>
                    <el-form-item label="精度：" v-if="hasKey('segments')">
                        <el-slider 
                            v-model="mesh.segments"
                            :min="0"
                            :max="1024"
                            :step="16"
                            @change="saveData('segments')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="size切换：" v-if="hasKey('accurate')">
                        <el-switch 
                            v-model="mesh.accurate"
                            @change="saveData('accurate')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="体积：" v-if="hasKey('size') && !mesh.accurate">
                        <el-input-number 
                            v-model="mesh.size" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('size')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="高度：" v-if="hasKey('height') && ((hasKey('accurate') && mesh.accurate) || !hasKey('accurate'))">
                        <el-input-number 
                            v-model="mesh.height" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('height')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="宽度：" v-if="hasKey('width') && ((hasKey('accurate') && mesh.accurate) || !hasKey('accurate'))">
                        <el-input-number 
                            v-model="mesh.width" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('width')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="深度：" v-if="hasKey('depth') && ((hasKey('accurate') && mesh.accurate) || !hasKey('accurate'))">
                        <el-input-number 
                            v-model="mesh.depth" 
                            controls-position="right" 
                            :min="0"
                            :step="0.01"
                            @change="saveData('depth')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="瓷砖体积：" v-if="hasKey('tileSize')">
                        <el-input-number 
                            v-model="mesh.tileSize" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('tileSize')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="瓷砖高度：" v-if="hasKey('tileHeight')">
                        <el-input-number 
                            v-model="mesh.tileHeight" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('tileHeight')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="瓷砖宽度：" v-if="hasKey('tileWidth')">
                        <el-input-number 
                            v-model="mesh.tileWidth" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('tileWidth')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="直径：" v-if="hasKey('diameter') && !mesh.accurate">
                        <el-input-number 
                            v-model="mesh.diameter" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('diameter')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="x方向直径：" v-if="hasKey('diameterX') && mesh.accurate">
                        <el-input-number 
                            v-model="mesh.diameterX" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('diameterX')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="y方向直径：" v-if="hasKey('diameterY') && mesh.accurate">
                        <el-input-number 
                            v-model="mesh.diameterY" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('diameterY')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="z方向直径：" v-if="hasKey('diameterZ') && mesh.accurate">
                        <el-input-number 
                            v-model="mesh.diameterZ" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('diameterZ')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="弧度：" v-if="hasKey('arc')">
                        <el-slider 
                            v-model="mesh.arc"
                            :min="0"
                            :max="1"
                            :step="0.1"
                            @change="saveData('arc')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="切割点：" v-if="hasKey('slice')">
                        <el-slider 
                            v-model="mesh.slice"
                            :min="0"
                            :max="1"
                            :step="0.1"
                            @change="saveData('slice')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="上部直径：" v-if="hasKey('diameterTop') && mesh.accurate">
                        <el-input-number 
                            v-model="mesh.diameterTop" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('diameterTop')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="下部直径：" v-if="hasKey('diameterBottom') && mesh.accurate">
                        <el-input-number 
                            v-model="mesh.diameterBottom" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('diameterBottom')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="厚度：" v-if="hasKey('thickness')">
                        <el-input-number 
                            v-model="mesh.thickness" 
                            controls-position="right" 
                            :min="0"
                            :step="0.5"
                            
                            @change="saveData('thickness')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="精度：" v-if="hasKey('tessellation')">
                        <el-slider 
                            v-model="mesh.tessellation"
                            :min="0"
                            :max="1024"
                            :step="16"
                            @change="saveData('tessellation')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="细分：" v-if="hasKey('subdivisions')">
                        <el-input-number 
                            v-model="mesh.subdivisions" 
                            controls-position="right" 
                            :min="0"
                            :max="2000"
                            :step="1"
                            
                            @change="saveData('subdivisions')"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="启用半径函数：" v-if="hasKey('enableRadiusFunction')">
                        <el-switch 
                            v-model="mesh.enableRadiusFunction"
                            @change="saveData('enableRadiusFunction')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="半径：" v-if="hasKey('radius') || (mesh.type=='Tube' &&  !mesh.enableRadiusFunction) ">
                        <el-input-number 
                            v-model="mesh.radius" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            
                            @change="saveData('radius')"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="半径函数：" v-if="hasKey('radiusFunction') && mesh.enableRadiusFunction">
                        <el-input type="textarea" v-model="mesh.radiusFunction" @change="saveData('radiusFunction')" ></el-input>
                    </el-form-item>

                    <el-form-item label="厚度：" v-if="hasKey('tube')">
                        <el-input-number 
                            v-model="mesh.tube" 
                            controls-position="right" 
                            :min="0"
                            :step="0.5"
                            
                            @change="saveData('tube')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="半径精度：" v-if="hasKey('radialSegments')">
                        <el-slider 
                            v-model="mesh.radialSegments"
                            :min="0"
                            :max="1024"
                            :step="16"
                            @change="saveData('radialSegments')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="厚度精度：" v-if="hasKey('tubularSegments')">
                        <el-slider 
                            v-model="mesh.tubularSegments"
                            :min="0"
                            :max="1024"
                            :step="16"
                            @change="saveData('tubularSegments')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="绕组数p：" v-if="hasKey('p')">
                        <el-input-number 
                            v-model="mesh.p" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('p')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="绕组数q：" v-if="hasKey('q')">
                        <el-input-number 
                            v-model="mesh.q" 
                            controls-position="right" 
                            :min="0"
                            
                            @change="saveData('q')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="最小x坐标：" v-if="hasKey('xmin')">
                        <el-input-number 
                            v-model="mesh.xmin" 
                            controls-position="right" 
                            @change="saveData('xmin')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="最小z坐标：" v-if="hasKey('zmin')">
                        <el-input-number 
                            v-model="mesh.zmin" 
                            controls-position="right" 
                            @change="saveData('zmin')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="最大x坐标：" v-if="hasKey('xmax')">
                        <el-input-number 
                            v-model="mesh.xmax" 
                            controls-position="right" 
                            @change="saveData('xmax')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="最大z坐标：" v-if="hasKey('zmax')">
                        <el-input-number 
                            v-model="mesh.zmax" 
                            controls-position="right" 
                            @change="saveData('zmax')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="精度：" v-if="hasKey('precision')">
                        <el-row>
                            <el-col :span="4">w：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.precision.w" 
                                    controls-position="right" 
                                    :min="0"
                                    
                                    @change="saveData('precision.w')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">h：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.precision.h" 
                                    controls-position="right" 
                                    :min="0"
                                    
                                    @change="saveData('precision.h')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="高低灰度图：" v-if="hasKey('heightMapPicture')">
                        <el-upload
                            class="upload-source"
                            action=""
                            :limit="1"
                            :show-file-list="false"
                            :on-progress="handleSourceSuccess"
                            :before-upload="beforeSourceUpload"
                        >
                            <img v-if="mesh.heightMapPicture" :src="mesh.heightMapPicture" class="sourceImg">
                            <i v-else class="el-icon-plus source-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="最小高度：" v-if="hasKey('MinimumHeight')">
                        <el-input-number 
                            v-model="mesh.MinimumHeight" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            
                            @change="saveData('MinimumHeight')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="最大高度：" v-if="hasKey('MaximumHeight')">
                        <el-input-number 
                            v-model="mesh.MaximumHeight" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            
                            @change="saveData('MaximumHeight')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="文字内容：" v-if="hasKey('content')">
                        <el-input 
                            v-model="mesh.content" 
                            placeholder="请输入文字内容"
                            @change="saveData('content')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="字体文件：" v-if="hasKey('fontFamily')">
                        <el-select 
                            v-model="mesh.fontFamily" 
                            @change="saveData('fontFamily')"
                            placeholder="请选择字体"
                        >
                            <el-option
                                v-for="item in fonts"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文字体积：" v-if="hasKey('fontSize')">
                        <el-input-number 
                            v-model="mesh.fontSize" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            
                            @change="saveData('fontSize')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="差值：" v-if="hasKey('Interpolation')">
                        <el-slider 
                            v-model="mesh.Interpolation"
                            :min="0"
                            :max="20"
                            :step="1"
                            @change="saveData('Interpolation')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="提取范围：" v-if="hasKey('decimation')">
                        <el-slider 
                            v-model="mesh.decimation"
                            :min="0"
                            :max="0.1"
                            :step="0.001"
                            @change="saveData('decimation')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="开启面切分：" v-if="hasKey('enableFace')">
                        <el-switch 
                            v-model="mesh.enableFace"
                            @change="saveData('enableFace')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="面切分：" v-if="mesh.enableFace">
                        <el-button type="primary" @click="openFaceUVDialog">编辑</el-button>
                    </el-form-item>
                    <el-form-item label="面颜色：" v-if="mesh.enableFace">
                        <el-button type="primary" @click="openFaceColorsDialog">编辑</el-button>
                    </el-form-item>
                    <el-form-item label="开启正背面：" v-if="hasKey('enableFrontBack')">
                        <el-switch 
                            v-model="mesh.enableFrontBack"
                            @change="saveData('enableFrontBack')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="正面材质范围：" v-if="mesh.enableFrontBack && mesh.sideOrientation==2">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.frontUVs[0]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('frontUVs.${0}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.frontUVs[1]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('frontUVs.${1}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.frontUVs[2]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('frontUVs.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">W：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.frontUVs[3]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('frontUVs.${3}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="背面材质范围：" v-if="mesh.enableFrontBack && mesh.sideOrientation==2">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.backUVs[0]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('backUVs.${0}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.backUVs[1]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('backUVs.${1}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.backUVs[2]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('backUVs.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">W：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.backUVs[3]" 
                                    controls-position="right" 
                                    :min="0"
                                    :step="0.1"
                                    
                                    @change="saveData('backUVs.${3}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>

                    <el-row v-if="hasKey('shape')" style="border-bottom:1px solid #e5e5e5;">
                        <el-row>
                            <el-col :span="6">
                                形状路径：
                            </el-col>
                            <el-col :span="7">
                                <el-button size="mini" round @click="addArrayItem(mesh.shape, {point:[0,0,0]}, 'shape')">添加点</el-button>
                            </el-col>
                            <el-col :span="11">
                                点位置[x,y,z]
                            </el-col>
                        </el-row>
                        <el-row :key="'shape'+index" v-for="(item, index) in mesh.shape">
                            <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(mesh.shape, index, 'shape')"></i></el-col>
                            <el-col :span="6">
                                <el-input-number 
                                     style="padding-left:0px;width:45px;padding-right:0px;"
                                    v-model="item.point[0]" 
                                    :controls="false"
                                    :step="0.01"
                                    @change="saveData('shape')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6">
                                <el-input-number 
                                    style="padding-left:0px;width:45px;padding-right:0px;"
                                    v-model="item.point[1]" 
                                    :controls="false"
                                    :step="0.01"
                                    @change="saveData('shape')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6">
                                <el-input-number 
                                    style="padding-left:0px;width:45px;padding-right:0px;"
                                    v-model="item.point[2]" 
                                    :controls="false"
                                    :step="0.01"
                                    @change="saveData('shape')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-row>


                    <el-row v-if="hasKey('holes')" style="border-bottom:1px solid #e5e5e5;">
                        <el-row>
                            <el-col :span="6">
                                打孔：
                            </el-col>
                            <el-col :span="6">
                                <el-button size="mini" round @click="addArrayItem(mesh.holes, [{point:[0,0,0]},{point:[1,1,1]}], 'holes')">添加孔</el-button>
                            </el-col>
                            <el-col :span="12">
                                [孔1,孔2...]
                            </el-col>
                        </el-row>
                        <el-row :key="'holes'+indexLine" v-for="(line, indexLine) in mesh.holes" style="border-bottom: 1px solid #e5e5e5;">
                            <el-row>
                                <el-col :span="2">
                                    {{indexLine+1}}
                                </el-col>
                                <el-col :span="9">
                                    <el-button size="mini" round @click="addArrayItem(line, {point:[0,0,0], color:null}, 'holes')">添加点</el-button>
                                </el-col>
                                <el-col :span="2">
                                    <i class="el-icon-circle-close" style="cursor: pointer;" @click="deleteArrayItem(mesh.holes, indexLine, 'holes')"></i>
                                </el-col>
                                <el-col :span="11">
                                    点[x,y,z]
                                </el-col>
                            </el-row>
                            <el-row :key="'line'+index" v-for="(item, index) in line">
                                <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(line, index, 'holes')"></i></el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                         style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[0]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('holes')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                        style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[1]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('holes')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                        style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[2]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('holes')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-row>



                    <el-row label="" v-if="hasKey('path')" style="border-bottom:1px solid #e5e5e5;">
                        <el-row>
                            <el-col :span="6">
                                位置路径：
                            </el-col>
                            <el-col :span="6">
                                <el-button size="mini" round @click="addArrayItem(mesh.path, {point:[0,0,0]}, 'path')">添加点</el-button>
                            </el-col>
                            <el-col :span="12">
                                点位置[x,y,z]
                            </el-col>
                        </el-row>
                        <el-row :key="'path'+index" v-for="(item, index) in mesh.path">
                            <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(mesh.path, index, 'path')"></i></el-col>
                            <el-col :span="6">
                                <el-input-number 
                                     style="padding-left:0px;width:45px;padding-right:0px;"
                                    v-model="item.point[0]" 
                                    :controls="false"
                                    :step="0.01"
                                    @change="saveData('path')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6">
                                <el-input-number 
                                    style="padding-left:0px;width:45px;padding-right:0px;"
                                    v-model="item.point[1]" 
                                    :controls="false"
                                    :step="0.01"
                                    @change="saveData('path')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6">
                                <el-input-number 
                                    style="padding-left:0px;width:45px;padding-right:0px;"
                                    v-model="item.point[2]" 
                                    :controls="false"
                                    :step="0.01"
                                    @change="saveData('path')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-row>

                    <el-row v-if="hasKey('pathArray')" style="border-bottom:1px solid #e5e5e5;">
                        <el-row>
                            <el-col :span="6">
                                位置路径集合：
                            </el-col>
                            <el-col :span="6">
                                <el-button size="mini" round @click="addArrayItem(mesh.pathArray, [{point:[0,0,0]},{point:[1,1,1]}], 'pathArray')">添加面</el-button>
                            </el-col>
                            <el-col :span="12">
                                [面1,面2...]
                            </el-col>
                        </el-row>
                        <el-row :key="'pathArray'+indexLine" v-for="(line, indexLine) in mesh.pathArray" style="border-bottom: 1px solid #e5e5e5;">
                            <el-row>
                                <el-col :span="2">
                                    {{indexLine+1}}
                                </el-col>
                                <el-col :span="9">
                                    <el-button size="mini" round @click="addArrayItem(line, {point:[0,0,0], color:null}, 'pathArray')">添加点</el-button>
                                </el-col>
                                <el-col :span="2">
                                    <i class="el-icon-circle-close" style="cursor: pointer;" @click="deleteArrayItem(mesh.pathArray, indexLine, 'pathArray')"></i>
                                </el-col>
                                <el-col :span="11">
                                    点[x,y,z]
                                </el-col>
                            </el-row>
                            <el-row :key="'line'+index" v-for="(item, index) in line">
                                <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(line, index, 'pathArray')"></i></el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                         style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[0]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('pathArray')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                        style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[1]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('pathArray')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                        style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[2]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('pathArray')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-row>

                    <el-row v-if="hasKey('lines')" style="border-bottom:1px solid #e5e5e5;">
                        <el-row>
                            <el-col :span="6">
                                线段：
                            </el-col>
                            <el-col :span="7">
                                <el-button size="mini" round @click="addArrayItem(mesh.lines, [{point:[0,0,0], color:null},{point:[1,1,1], color:null}], 'lines')">添加线条</el-button>
                            </el-col>
                            <el-col :span="11">
                                [线条1,线条2...]
                            </el-col>
                        </el-row>
                        <el-row :key="'lines'+indexLine" v-for="(line, indexLine) in mesh.lines" style="border-bottom: 1px solid #e5e5e5;">
                            <el-row>
                                <el-col :span="2">
                                    {{indexLine+1}}
                                </el-col>
                                <el-col :span="9">
                                    <el-button size="mini" round @click="addArrayItem(line, {point:[0,0,0], color:null}, 'lines')">添加点</el-button>
                                </el-col>
                                <el-col :span="2">
                                    <i class="el-icon-circle-close" style="cursor: pointer;" @click="deleteArrayItem(mesh.lines, indexLine, 'lines')"></i>
                                </el-col>
                                <el-col :span="11">
                                    点[x,y,z]，颜色
                                </el-col>
                            </el-row>
                            <el-row :key="'line'+index" v-for="(item, index) in line">
                                <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(line, index, 'lines')"></i></el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                         style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[0]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('lines')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                        style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[1]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('lines')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                                <el-col :span="6">
                                    <el-input-number 
                                        style="padding-left:0px;width:45px;padding-right:0px;"
                                        v-model="item.point[2]" 
                                        :controls="false"
                                        :step="0.01"
                                        @change="saveData('lines')"
                                        size="mini"
                                    >
                                    </el-input-number>
                                </el-col>
                                <el-col :span="4">
                                    <el-color-picker 
                                        v-model="item.color" 
                                        show-alpha
                                        color-format="rgba"
                                        @change="saveData('lines')"
                                        size="mini"
                                    >
                                    </el-color-picker>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-row>

                    <el-row v-if="hasKey('points')" style="border-bottom:1px solid #e5e5e5;">
                        <el-row>
                            <el-col :span="4">
                                连接点
                            </el-col>
                            <el-col :span="6">
                                <el-button size="mini" round @click="addArrayItem(mesh.points, {point:[0,0,0], color:null}, 'points')">添加点</el-button>
                            </el-col>
                            <el-col :span="14">
                                点位置[x,y,z]，颜色
                            </el-col>
                        </el-row>
                        <el-row :key="'points'+index" v-for="(item, index) in mesh.points">
                            <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(mesh.points, index, 'points')"></i></el-col>
                            <el-col :span="6">
                                <el-input-number 
                                     style="padding-left:0px;width:70px;padding-right:0px;"
                                    v-model="item.point[0]" 
                                    :controls="false"
                                    :step="0.01"
                                    size="mini"
                                    @change="saveData('points')"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6">
                                <el-input-number 
                                    style="padding-left:0px;width:70px;padding-right:0px;"
                                    v-model="item.point[1]" 
                                    :controls="false"
                                    :step="0.01"
                                    size="mini"
                                    @change="saveData('points')"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6">
                                <el-input-number 
                                    style="padding-left:0px;width:70px;padding-right:0px;"
                                    v-model="item.point[2]" 
                                    :controls="false"
                                    :step="0.01"
                                    size="mini"
                                    @change="saveData('points')"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="4" v-if="mesh.type!='DashedLines'">
                                <el-color-picker 
                                    v-model="item.color" 
                                    show-alpha
                                    color-format="rgba"
                                    @change="saveData('points')"
                                    size="mini"
                                >
                                </el-color-picker>
                            </el-col>
                        </el-row>
                    </el-row>

                    <el-form-item label="点透明度：" v-if="hasKey('useVertexAlpha')">
                        <el-switch 
                            v-model="mesh.useVertexAlpha"
                            @change="saveData('useVertexAlpha')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="虚线大小：" v-if="hasKey('dashSize')">
                        <el-input-number 
                            v-model="mesh.dashSize" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            @change="saveData('dashSize')"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="虚线间隔：" v-if="hasKey('gapSize')">
                        <el-input-number 
                            v-model="mesh.gapSize" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            @change="saveData('gapSize')"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="虚线数量：" v-if="hasKey('dashNb')">
                        <el-input-number 
                            v-model="mesh.dashNb" 
                            controls-position="right" 
                            :min="100"
                            :step="1"
                            @change="saveData('dashNb')"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="启用自定义挤压：" v-if="hasKey('enableCustom')">
                        <el-switch 
                            v-model="mesh.enableCustom"
                            @change="saveData('enableCustom')"
                        >
                        </el-switch>
                    </el-form-item>


                    <el-form-item label="缩放：" v-if="hasKey('extrudedShapesScale') && !mesh.enableCustom">
                        <el-input-number 
                            v-model="mesh.extrudedShapesScale" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            @change="saveData('extrudedShapesScale')"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="旋转：" v-if="hasKey('extrudedShapesRotation') && !mesh.enableCustom">
                        <el-input-number 
                            v-model="mesh.extrudedShapesRotation" 
                            controls-position="right" 
                            :min="0"
                            :step="0.1"
                            @change="saveData('extrudedShapesRotation')"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="缩放函数：" v-if="hasKey('scaleFunction') && mesh.enableCustom">
                        <el-input type="textarea" v-model="mesh.scaleFunction" @change="saveData('scaleFunction')"></el-input>
                    </el-form-item>

                    <el-form-item label="旋转函数：" v-if="hasKey('rotationFunction') && mesh.enableCustom">
                        <el-input type="textarea" v-model="mesh.rotationFunction" @change="saveData('rotationFunction')"></el-input>
                    </el-form-item>


                    <el-form-item label="闭合路径：" v-if="hasKey('closeArray')">
                        <el-switch 
                            v-model="mesh.closeArray"
                            @change="saveData('closeArray')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="闭合端点：" v-if="hasKey('closePath')">
                        <el-switch 
                            v-model="mesh.closePath"
                            @change="saveData('closePath')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="翻转UV：" v-if="hasKey('invertUV')">
                        <el-switch 
                            v-model="mesh.invertUV"
                            @change="saveData('invertUV')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="管帽：" v-if="hasKey('cap')">
                        <el-select v-model="mesh.cap" placeholder="请选择管帽">
                            <el-option label="无(默认)" :value="0"></el-option>
                            <el-option label="开头" :value="1"></el-option>
                            <el-option label="尾部" :value="2"></el-option>
                            <el-option label="两端" :value="3"></el-option>
                        </el-select>
                    </el-form-item>


                </el-form>
            </el-collapse-item>
            <el-collapse-item title="物体通用配置" name="2">
                <el-form ref="form" :model="mesh" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="控件画布：" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                        <el-button size="mini" type="primary" round @click="convertToGuiMesh">转换</el-button>
                        <el-select v-model="guiMeshTypeSelect" placeholder="请选择控件">
                            <el-option v-for="item in guiTypelist" :label="item.label" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="添加实例：" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                        <el-button size="mini" type="primary" round @click="addAnInstance">添加实例</el-button>
                    </el-form-item>
                    <el-form-item label="物体名称：">
                        <el-input 
                            v-model="mesh.name" 
                            placeholder="请输入材质名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item label="显示面：" v-if="hasKey('sideOrientation')">
                        <el-select 
                            v-model="mesh.sideOrientation"
                            @change="saveData('sideOrientation')" 
                            placeholder="请选择显示面"
                        >
                            <el-option label="正面" :value="0"></el-option>
                            <el-option label="背面" :value="1"></el-option>
                            <el-option label="双面" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="是否启用：">
                        <el-switch 
                            v-model="mesh.isEnabled"
                            @change="saveData('isEnabled')"
                        >
                        </el-switch>
                    </el-form-item> -->
                    <el-form-item label="是否显示："  v-if="hasKey('isVisible')">
                        <el-switch 
                            v-model="mesh.isVisible"
                            @change="saveData('isVisible')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="位置：">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.position[0]" 
                                    controls-position="right" 
                                    :step="0.01"
                                    
                                    @change="saveData('position.${0}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.position[1]" 
                                    controls-position="right" 
                                    :step="0.01"
                                    
                                    @change="saveData('position.${1}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.position[2]" 
                                    controls-position="right" 
                                    :step="0.01"
                                    
                                    @change="saveData('position.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="旋转：">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.rotation[0]" 
                                    controls-position="right" 
                                    :step="0.01"
                                    
                                    @change="saveData('rotation.${0}')"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6" style="text-align:right;">°</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.rotation[1]" 
                                    controls-position="right" 
                                    :step="0.01"
                                    
                                    @change="saveData('rotation.${1}')"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6" style="text-align:right;">°</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.rotation[2]" 
                                    controls-position="right" 
                                    :step="0.01"
                                    
                                    @change="saveData('rotation.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="6" style="text-align:right;">°</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="放大：">
                        <el-row>
                            <el-col :span="4">X：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.scaling[0]" 
                                    controls-position="right" 
                                    :step="0.001"
                                    
                                    @change="saveData('scaling.${0}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Y：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.scaling[1]" 
                                    controls-position="right" 
                                    :step="0.001"
                                    
                                    @change="saveData('scaling.${1}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">Z：</el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    v-model="mesh.scaling[2]" 
                                    controls-position="right" 
                                    :step="0.001"
                                    
                                    @change="saveData('scaling.${2}')"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="透明度：" v-if="hasKey('visibility')">
                        <el-slider 
                            v-model="mesh.visibility"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('visibility')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="启用边框：" v-if="hasKey('enableEdgesRendering')">
                        <el-switch 
                            v-model="mesh.enableEdgesRendering"
                            @change="saveData('enableEdgesRendering')"
                        >
                        </el-switch>
                    </el-form-item>
                    <div v-if="mesh.enableEdgesRendering">
                        <el-form-item label="边框大小：">
                            <el-input-number 
                                v-model="mesh.edgesWidth" 
                                controls-position="right" 
                                :min="0"
                                
                                @change="saveData('edgesWidth')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="边框颜色：">
                            <el-color-picker 
                                v-model="mesh.edgesColor" 
                                show-alpha
                                color-format="rgb"
                                @change="saveData('edgesColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="启用高亮：" v-if="hasKey('enableHighlight')">
                        <el-switch 
                            v-model="mesh.enableHighlight"
                            @change="saveData('enableHighlight')"
                        >
                        </el-switch>
                    </el-form-item>
                    <div v-if="mesh.enableHighlight">
                        <el-form-item label="高亮颜色：">
                            <el-color-picker 
                                v-model="mesh.highlightColor"
                                color-format="rgb"
                                @change="saveData('highlightColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                        <el-form-item label="高亮放射：">
                            <el-switch 
                                v-model="mesh.ishighlightEmissive"
                                @change="saveData('ishighlightEmissive')"
                            >
                            </el-switch>
                        </el-form-item>
                        <div v-if="mesh.ishighlightEmissive">
                            <el-form-item label="水平模糊：">
                                <el-slider 
                                    v-model="mesh.blurHorizontalSize"
                                    :min="0"
                                    :max="2"
                                    :step="0.01"
                                    @change="saveData('blurHorizontalSize')"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item label="垂直模糊：">
                                <el-slider 
                                    v-model="mesh.blurVerticalSize"
                                    :min="0"
                                    :max="2"
                                    :step="0.01"
                                    @change="saveData('blurVerticalSize')"
                                >
                                </el-slider>
                            </el-form-item>
                            <el-form-item label="外部高亮：">
                                <el-switch 
                                    v-model="mesh.outerGlow"
                                    @change="saveData('outerGlow')"
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="内部高亮：">
                                <el-switch 
                                    v-model="mesh.innerGlow"
                                    @change="saveData('innerGlow')"
                                >
                                </el-switch>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item label="开启辉光：" v-if="hasKey('enableGlow')">
                        <el-switch 
                            v-model="mesh.enableGlow"
                            @change="saveData('enableGlow')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="显示模式：" v-if="hasKey('billboardMode')">
                        <el-select 
                            v-model="mesh.billboardMode" 
                            @change="saveData('billboardMode')"
                            placeholder="请选择显示模式"
                        >
                            <el-option label="默认" :value="0"></el-option>
                            <el-option label="X轴" :value="1"></el-option>
                            <el-option label="Y轴" :value="2"></el-option>
                            <el-option label="Z轴" :value="4"></el-option>
                            <el-option label="全部" :value="7"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="无限距离：" v-if="hasKey('infiniteDistance')">
                        <el-switch 
                            v-model="mesh.infiniteDistance"
                            @change="saveData('infiniteDistance')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="接收阴影：" v-if="hasKey('receiveShadows')">
                        <el-switch 
                            v-model="mesh.receiveShadows"
                            @change="saveData('receiveShadows')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="碰撞检测：" v-if="hasKey('checkCollisions')">
                        <el-switch 
                            v-model="mesh.checkCollisions"
                            @change="saveData('checkCollisions')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="雾影响：" v-if="hasKey('applyFog')">
                        <el-switch 
                            v-model="mesh.applyFog"
                            @change="saveData('applyFog')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="光晕阻挡：" v-if="hasKey('isBlocker')">
                        <el-switch 
                            v-model="mesh.isBlocker"
                            @change="saveData('isBlocker')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="父物体：" v-if="hasKey('parentId')">
                        <el-select 
                            v-model="mesh.parentId" 
                            @change="saveData('parentId')"
                            placeholder="请选择父物体"
                            clearable
                        >
                            <el-option
                                v-for="item in meshesFilter_parent()"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="看向模式：" v-if="hasKey('lookAtMode')">
                        <el-select v-model="mesh.lookAtMode" placeholder="选择看向模式" size="mini"  @change="saveData('lookAtMode')">
                            <el-option v-for="item in lookAtModeList" :key="item.label" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
      
                    <el-row v-if="mesh.lookAtMode==1">
                        <el-col :span="3">看向位置</el-col>
                        <el-col :span="6">
                            <el-input-number 
                                    style="padding-left:0px;width:45px;padding-right:0px;"
                                v-model="mesh.lookAtPosition[0]" 
                                :controls="false"
                                :step="0.01"
                                @change="saveData('lookAtPosition')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-col>
                        <el-col :span="6">
                            <el-input-number 
                                style="padding-left:0px;width:45px;padding-right:0px;"
                                v-model="mesh.lookAtPosition[1]" 
                                :controls="false"
                                :step="0.01"
                                @change="saveData('lookAtPosition')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-col>
                        <el-col :span="6">
                            <el-input-number 
                                style="padding-left:0px;width:45px;padding-right:0px;"
                                v-model="mesh.lookAtPosition[2]" 
                                :controls="false"
                                :step="0.01"
                                @change="saveData('lookAtPosition')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-col>
                    </el-row>
                    <el-form-item label="看向物体：" v-if="mesh.lookAtMode==2">
                        <el-select v-model="mesh.lookAtMesh" placeholder="选择看向物体" size="mini" @change="saveData('lookAtMesh')">
                            <el-option 
                                v-for="item in meshes" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="看向灯光：" v-if="mesh.lookAtMode==3">
                        <el-select v-model="mesh.lookAtLight" placeholder="选择看向灯光" size="mini" @change="saveData('lookAtLight')">
                            <el-option 
                                v-for="item in lights" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="看向相机：" v-if="mesh.lookAtMode==4">
                        <el-select v-model="mesh.lookAtCamera" placeholder="选择看向相机" size="mini" @change="saveData('lookAtCamera')">
                            <el-option 
                                v-for="item in cameras" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="物体刚体/软体" name="3" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                <el-form ref="form" :model="mesh" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="物理刚体：">
                        <el-switch 
                            v-model="mesh.enableRigidPhysic"
                            @change="physicChange('enableRigidPhysic')"
                        >
                        </el-switch>
                    </el-form-item>
                    <div v-if="mesh.enableRigidPhysic">
                        <el-form-item label="碰撞物：">
                            <el-select 
                                v-model="mesh.rigidImpostor" 
                                @change="saveData('rigidImpostor')"
                                placeholder="请选择碰撞物"
                            >
                                <el-option label="球体" value="SphereImpostor"></el-option>
                                <el-option label="立方体" value="BoxImpostor"></el-option>
                                <el-option label="圆柱体" value="CylinderImpostor"></el-option>
                                <el-option label="真实形态" value="MeshImpostor"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="质量：">
                            <el-slider 
                                v-model="mesh.rigidMass"
                                :min="0"
                                :max="10"
                                :step="0.1"
                                @change="saveData('rigidMass')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="摩擦力：">
                            <el-slider 
                                v-model="mesh.rigidFriction"
                                :min="0"
                                :max="1"
                                :step="0.01"
                                @change="saveData('rigidFriction')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="回弹力：">
                            <el-slider 
                                v-model="mesh.rigidRestitution"
                                :min="0"
                                :max="1"
                                :step="0.01"
                                @change="saveData('rigidRestitution')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="忽略父元素：">
                            <el-switch 
                                v-model="mesh.ignoreParent"
                                @change="saveData('ignoreParent')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="启用速度：">
                            <el-switch 
                                v-model="mesh.enableVelocity"
                                @change="saveData('enableVelocity')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="速度方向：" v-if="mesh.enableVelocity">
                            <el-row>
                                <el-col :span="4">X：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.velocity[0]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('velocity.${0}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Y：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.velocity[1]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('velocity.${1}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Z：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.velocity[2]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('velocity.${2}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="启用旋转：">
                            <el-switch 
                                v-model="mesh.enableAngularVelocity"
                                @change="saveData('enableAngularVelocity')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="旋转方向：" v-if="mesh.enableAngularVelocity">
                            <el-row>
                                <el-col :span="4">X：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.AngularVelocity[0]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('AngularVelocity.${0}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Y：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.AngularVelocity[1]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('AngularVelocity.${1}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Z：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.AngularVelocity[2]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('AngularVelocity.${2}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">W：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.AngularVelocity[3]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('AngularVelocity.${3}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="启用脉冲：">
                            <el-switch 
                                v-model="mesh.enableImpulse"
                                @change="saveData('enableImpulse')"
                            >
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="脉冲方向：" v-if="mesh.enableImpulse">
                            <el-row>
                                <el-col :span="4">X：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.impulseDirection[0]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('impulseDirection.${0}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Y：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.impulseDirection[1]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('impulseDirection.${1}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Z：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.impulseDirection[2]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('impulseDirection.${2}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="着力点：" v-if="mesh.enableImpulse">
                            <el-row>
                                <el-col :span="4">X：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.impulsePosition[0]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('impulsePosition.${0}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Y：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.impulsePosition[1]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('impulsePosition.${1}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Z：</el-col>
                                <el-col :span="10">
                                    <el-input-number 
                                        v-model="mesh.impulsePosition[2]" 
                                        controls-position="right" 
                                        :step="0.1"
                                        
                                        @change="saveData('impulsePosition.${2}')"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </div>
                    <el-form-item label="物理软体：">
                        <el-switch 
                            v-model="mesh.enableSoftPhysic"
                            @change="physicChange('enableSoftPhysic')"
                        >
                        </el-switch>
                    </el-form-item>
                    <div v-if="mesh.enableSoftPhysic">
                        <el-form-item label="碰撞物：">
                            <el-select 
                                v-model="mesh.softImpostor" 
                                @change="saveData('softImpostor')"
                                placeholder="请选择碰撞物"
                            >
                                <el-option label="软体" value="SoftbodyImpostor"></el-option>
                                <el-option label="衣服" value="ClothImpostor"></el-option>
                                <el-option label="绳子" value="RopeImpostor"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="柔软度：">
                            <el-slider 
                                v-model="mesh.softIncreaseVertices"
                                :min="1"
                                :max="50"
                                :step="1"
                                @change="saveData('softIncreaseVertices')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="质量：">
                            <el-slider 
                                v-model="mesh.softMass"
                                :min="0"
                                :max="10"
                                :step="0.1"
                                @change="saveData('softMass')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="摩擦力：">
                            <el-slider 
                                v-model="mesh.softFriction"
                                :min="0"
                                :max="1"
                                :step="0.01"
                                @change="saveData('softFriction')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="回弹力：">
                            <el-slider 
                                v-model="mesh.softRestitution"
                                :min="0"
                                :max="1"
                                :step="0.01"
                                @change="saveData('softRestitution')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="碰撞边界：">
                            <el-slider 
                                v-model="mesh.margin"
                                :min="0"
                                :max="2"
                                :step="0.01"
                                @change="saveData('margin')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="阻尼系数：">
                            <el-slider 
                                v-model="mesh.damping"
                                :min="-0.1"
                                :max="0.1"
                                :step="0.01"
                                @change="saveData('damping')"
                            >
                            </el-slider>
                        </el-form-item>
                        <el-form-item label="速度迭代：">
                            <el-input-number 
                                v-model="mesh.velocityIterations" 
                                controls-position="right" 
                                :min="0"
                                
                                @change="saveData('velocityIterations')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="位置迭代：">
                            <el-input-number 
                                v-model="mesh.positionIterations" 
                                controls-position="right" 
                                :min="0"
                                
                                @change="saveData('positionIterations')"
                            >
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="刚度：">
                            <el-slider 
                                v-model="mesh.stiffness"
                                :min="0"
                                :max="1"
                                :step="0.01"
                                @change="saveData('stiffness')"
                            >
                            </el-slider>
                        </el-form-item>
                        <div v-if="mesh.softImpostor=='SoftbodyImpostor'">
                            <el-form-item label="内部张力：">
                                <el-input-number 
                                    v-model="mesh.pressure" 
                                    controls-position="right" 
                                    :min="0"
                                    :max="80000"
                                    :step="100"
                                    
                                    @change="saveData('pressure')"
                                >
                                </el-input-number>
                            </el-form-item>
                        </div>
                        <div v-if="mesh.softImpostor=='ClothImpostor'">
                            <el-form-item label="使用固定点：">
                                <el-switch 
                                    v-model="mesh.enableAnchorFixedPoints"
                                    @change="saveData('enableAnchorFixedPoints')"
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="固定点：" v-if="mesh.enableAnchorFixedPoints">
                                <el-checkbox-group 
                                    v-model="mesh.anchorFixedPoints"
                                    @change="anchorFixedPointsChange"
                                >
                                    <el-checkbox :label="0">无固定点</el-checkbox>
                                    <el-checkbox :label="1">左后</el-checkbox>
                                    <el-checkbox :label="2">右后</el-checkbox>
                                    <el-checkbox :label="4">左前</el-checkbox>
                                    <el-checkbox :label="8">右前</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item label="锚点：" v-if="!mesh.enableAnchorFixedPoints">
                                <el-row v-for="(item, index) in mesh.anchors" :key="item.anchormesheID">
                                    锚点{{index + 1}}
                                    <el-button type="primary" @click="openAddPointsDialog('anchors', 'edit', index)">编辑</el-button>
                                </el-row>
                                <el-button type="primary" @click="openAddPointsDialog('anchors', 'new')">新增</el-button>
                            </el-form-item>
                        </div>
                        <div v-if="mesh.softImpostor=='RopeImpostor'">
                            <el-form-item label="使用固定点：">
                                <el-switch 
                                    v-model="mesh.enableHookFixedPoints"
                                    @change="saveData('enableHookFixedPoints')"
                                >
                                </el-switch>
                            </el-form-item>
                            <el-form-item label="固定点：" v-if="mesh.enableHookFixedPoints">
                                <el-select 
                                    v-model="mesh.hookFixedPoints"
                                    @change="saveData('hookFixedPoints')" 
                                    placeholder="请选择固定点"
                                >
                                    <el-option label="无固定点" :value="0"></el-option>
                                    <el-option label="头部" :value="1"></el-option>
                                    <el-option label="尾部" :value="2"></el-option>
                                    <el-option label="两头" :value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="钩子：" v-if="!mesh.enableHookFixedPoints">
                                <el-row v-for="(item, index) in mesh.hooks" :key="item.anchormesheID">
                                    钩子{{index + 1}}
                                    <el-button type="primary" @click="openAddPointsDialog('hooks', 'edit', index)">编辑</el-button>
                                </el-row>
                                <el-button type="primary" @click="openAddPointsDialog('hooks', 'new')">新增</el-button>
                            </el-form-item>
                        </div>
                    </div>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="光晕" name="4" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                <el-form ref="form" :model="mesh" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="开启光晕：">
                        <el-switch 
                            v-model="mesh.enableLensFlare"
                            @change="saveData('enableLensFlare')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="光晕：" v-if="mesh.enableLensFlare">
                        <el-row v-for="(item, index) in mesh.lensFlareSystem" :key="index">
                            光晕{{index + 1}}
                            <el-button type="primary" @click="openAddLensFlareDialog('edit', index)">编辑</el-button>
                            <el-button type="text" @click="deleteArrayItem(mesh.lensFlareSystem, index, 'lensFlareSystem')">删除</el-button>
                        </el-row>
                        <el-button type="primary" @click="openAddLensFlareDialog('new')">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="物体神光" name="5" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                <el-form ref="form" :model="mesh" label-width="80px" size="mini" @submit.native.prevent>
                    <el-form-item label="启用神光：">
                        <el-switch 
                            v-model="mesh.enableVolumetricLight"
                            @change="saveData('enableVolumetricLight')"
                        >
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="发射范围：">
                        <el-slider 
                            v-model="mesh.volumetricLightRatio"
                            :min="0"
                            :max="1"
                            :step="0.01"
                            @change="saveData('volumetricLightRatio')"
                        >
                        </el-slider>
                    </el-form-item>
                    <el-form-item label="采样数量：">
                        <el-input-number 
                            v-model="mesh.volumetricLightSamplesNum" 
                            controls-position="right" 
                            :min="0"
                            :max="1000"
                            :step="1"
                            
                            @change="saveData('volumetricLightSamplesNum')"
                        >
                        </el-input-number>
                    </el-form-item>
                    <el-form-item label="采样模式：">
                        <el-select 
                            v-model="mesh.volumetricLightSamplingMode" 
                            @change="saveData('volumetricLightSamplingMode')"
                            placeholder="请选择采样模式"
                        >
                            <el-option label="最近采样" :value="1"></el-option>
                            <el-option label="双线性采样" :value="2"></el-option>
                            <el-option label="三线性采样" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="强制使用漫反射颜色：">
                        <el-switch 
                            v-model="mesh.volumetricLightUseDiffuseColor"
                            @change="saveData('volumetricLightUseDiffuseColor')"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="物体骨骼动画" name="6" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                
            </el-collapse-item>
            <el-collapse-item title="物体添加材质" name="7" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                <el-select 
                    v-model="mesh.materialId" 
                    clearable
                    @change="saveData('materialId')"
                    placeholder="请选择材质"
                >
                    <el-option
                        v-for="item in materials"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                <el-button type="primary" @click="openAddMaterialDialog()">新建</el-button>
            </el-collapse-item>
            <el-collapse-item title="子物体列表" name="8" v-if="mesh.mainType=='mesh' && !mesh.isGuiMesh">
                <!-- 
                indexCount: 103440
                indexStart: 0
                materialIndex: 0
                verticesCount: 35387
                verticesStart: 0 
                -->
                <el-row>
                    顶点总数:{{mesh.verticesCount}}
                </el-row>
                <el-row>
                    索引总数:{{mesh.indexCount}}
                </el-row>
               <el-row label="" v-if="hasKey('subMeshes')" >
                    <el-row>
                        <el-col :span="6">
                            <el-button size="mini" round @click="addArrayItem(mesh.subMeshes, {indexStart:0,indexCount:0,materialIndex:0,verticesCount:null,verticesStart:0 }, 'subMeshes')">添加</el-button>
                        </el-col>
                        <el-col :span="18">
                            共5个参数
                        </el-col>
                    </el-row>
                    <div :key="'subMeshes'+index" v-for="(item, index) in mesh.subMeshes" style="border-bottom:1px solid #e5e5e5;">
                        <el-row>
                            <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(mesh.subMeshes, index, 'subMeshes')"></i></el-col>
                            <el-col :span="6">
                                材质索引
                            </el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    style="padding-left:0px;width:70px;padding-right:0px;"
                                    v-model="item.materialIndex" 
                                    :controls="false"
                                    :step="1"
                                    @change="saveData('subMeshes')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">
                                顶点
                            </el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    style="padding-left:0px;width:110px;padding-right:0px;"
                                    v-model="item.verticesStart" 
                                    :controls="false"
                                    :step="1"
                                    @change="saveData('subMeshes')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    style="padding-left:0px;width:110px;padding-right:0px;"
                                    v-model="item.verticesCount" 
                                    :controls="false"
                                    :step="1"
                                    @change="saveData('subMeshes')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">
                                索引
                            </el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    style="padding-left:0px;width:110px;padding-right:0px;"
                                    v-model="item.indexStart" 
                                    :controls="false"
                                    :step="1"
                                    @change="saveData('subMeshes')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                            <el-col :span="10">
                                <el-input-number 
                                    style="padding-left:0px;width:110px;padding-right:0px;"
                                    v-model="item.indexCount" 
                                    :controls="false"
                                    :step="1"
                                    @change="saveData('subMeshes')"
                                    size="mini"
                                >
                                </el-input-number>
                            </el-col>
                        </el-row>
                    </div>
                    
                </el-row>
            </el-collapse-item>
            <el-collapse-item title="物体添加动画" name="9">
                <el-row>
                    <el-col :span="8">
                        是否循环：
                    </el-col>
                    <el-col :span="16">
                        <el-switch v-model="mesh.animationLoop" @change="saveData('animationLoop')"></el-switch>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        动画速度：
                    </el-col>
                    <el-col :span="16">
                        <el-input-number 
                            v-model="mesh.animationSpeed" 
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
                <el-row v-for="(item, index) in mesh.animations" :key="index">
                    <el-col :span="12">
                        {{item.name}}
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="openAddAnimationDialog('edit', index)">编辑</el-button>
                    </el-col>
                    <el-col :span="3">
                        <el-button type="text" style="margin-left: 0px;" size="mini" @click="deleteArrayItem(mesh.animations, index, 'animations')">删除</el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>

        <!-- 面切分弹出框 -->
        <el-dialog
            title="面切分"
            :visible.sync="dialogVisible_faceUV"
            width="50%"
        >
            <el-form ref="form" label-width="80px" size="mini" @submit.native.prevent>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="a面：">
                            <el-row>
                                <el-col :span="6">X：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[0][0]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Y：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[0][1]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Z：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[0][2]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">W：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[0][3]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="b面：">
                            <el-row>
                                <el-col :span="6">X：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[1][0]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Y：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[1][1]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Z：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[1][2]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">W：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[1][3]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="c面：">
                            <el-row>
                                <el-col :span="6">X：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[2][0]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Y：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[2][1]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Z：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[2][2]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">W：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[2][3]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="d面：">
                            <el-row>
                                <el-col :span="6">X：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[3][0]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Y：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[3][1]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Z：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[3][2]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">W：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[3][3]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="e面：">
                            <el-row>
                                <el-col :span="6">X：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[4][0]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Y：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[4][1]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Z：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[4][2]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">W：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[4][3]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="f面：">
                            <el-row>
                                <el-col :span="6">X：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[5][0]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Y：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[5][1]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">Z：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[5][2]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="6">W：</el-col>
                                <el-col :span="18">
                                    <el-slider 
                                        v-model="faceUVArr[5][3]"
                                        :min="0"
                                        :max="1"
                                        :step="0.01"
                                    >
                                    </el-slider>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_faceUV = false">取 消</el-button>
                <el-button type="primary" @click="editFaceUV">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 面颜色弹出框 -->
        <el-dialog
            title="面颜色"
            :visible.sync="dialogVisible_faceColors"
            width="30%"
        >
            <el-form ref="form" label-width="80px" size="mini" @submit.native.prevent>
                <el-form-item label="a面：">
                    <el-color-picker 
                        v-model="faceColorsArr[0]"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
                <el-form-item label="b面：">
                    <el-color-picker 
                        v-model="faceColorsArr[1]"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
                <el-form-item label="c面：">
                    <el-color-picker 
                        v-model="faceColorsArr[2]"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
                <el-form-item label="d面：">
                    <el-color-picker 
                        v-model="faceColorsArr[3]"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
                <el-form-item label="e面：">
                    <el-color-picker 
                        v-model="faceColorsArr[4]"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
                <el-form-item label="f面：">
                    <el-color-picker 
                        v-model="faceColorsArr[5]"
                        color-format="rgb"
                    >
                    </el-color-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_faceColors = false">取 消</el-button>
                <el-button type="primary" @click="editFaceColors">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 锚点/钩子 -->
        <el-dialog
            :title="dialogTitle_points"
            :visible.sync="dialogVisible_points"
            width="30%"
        >
            <el-form ref="form" :model="anchorsObj" label-width="80px" size="mini" @submit.native.prevent v-if="dialog_points_type=='anchors'">
                <el-form-item label="连接刚体：">
                    <el-select v-model="anchorsObj.anchormesheID" placeholder="请选择连接刚体">
                        <el-option
                            v-for="item in meshesFilter_points()"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分数宽度：">
                    <el-slider 
                        v-model="anchorsObj.anchorFractionWidth"
                        :min="0"
                        :max="1"
                        :step="0.1"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="分数高度：">
                    <el-slider 
                        v-model="anchorsObj.anchorFractionHeight"
                        :min="0"
                        :max="1"
                        :step="0.1"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="锚点影响：">
                    <el-slider 
                        v-model="anchorsObj.anchorInfluence"
                        :min="0"
                        :max="1"
                        :step="0.1"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="连接碰撞：">
                    <el-switch v-model="anchorsObj.anchorNoCollisionBetweenLinkedBodies"></el-switch>
                </el-form-item>
            </el-form>
            <el-form ref="form" :model="hooksObj" label-width="80px" size="mini" @submit.native.prevent v-if="dialog_points_type=='hooks'">
                <el-form-item label="连接刚体：">
                    <el-select v-model="hooksObj.hookMesheID" placeholder="请选择连接刚体">
                        <el-option
                            v-for="item in meshesFilter_points()"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分数：">
                    <el-slider 
                        v-model="hooksObj.hookFraction"
                        :min="0"
                        :max="1"
                        :step="0.1"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="锚点影响：">
                    <el-slider 
                        v-model="hooksObj.hookInfluence"
                        :min="0"
                        :max="1"
                        :step="0.1"
                    >
                    </el-slider>
                </el-form-item>
                <el-form-item label="连接碰撞：">
                    <el-switch v-model="hooksObj.hookNoCollisionBetweenLinkedBodies"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_points = false">取 消</el-button>
                <el-button type="primary" @click="addPoints">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加材质弹出框 -->
        <el-dialog
            title="添加材质"
            :visible.sync="dialogVisible_addMaterial"
            width="30%"
        >
            <el-select v-model="addMaterialType" placeholder="请选择材质类型">
                <el-option
                    v-for="item in materialDatas"
                    :key="item.type"
                    :label="item.name"
                    :value="item.type"
                >
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible_addMaterial = false">取 消</el-button>
                <el-button type="primary" @click="addMaterial">确 定</el-button>
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
                        :max="2"
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
                        :on-progress="handleLensFlareSourceSuccess"
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

        <!-- 编辑程序弹出框 -->
		<div class="resize-drag-box" v-if="dialogVisible_editProgram">
			<div id="resize-drag" class="resize-drag" @mousedown="dragMousedown">
				<div class="resize-drag-title">
					<span>添加程序</span>
					<span class="close" @click="dialogVisible_editProgram = false">X</span>
				</div>
				<div class="resize-drag-main" @mousedown.stop>
					<MonacoEditor
						height="100%"
						language="javascript"
						:code="code"
						:editorOptions="options"
						@mounted="onMounted"
						@codeChange="onCodeChange"
					>
					</MonacoEditor>
				</div>
				<div class="resize-drag-button">
					<el-button size="mini" @click="dialogVisible_editProgram = false">取 消</el-button>
					<el-button size="mini" type="primary" @click="editProgram">修改</el-button>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import { generateRandomKey, getState } from '@/canvas/common';
    import { updateObjectView, addMaterialView,addObjectView,getProgramMeshNotes,clearProgramNotes,getOptionByID,checkHasGeo } from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';
    import animation from '@/master/animation';
    import MonacoEditor from 'vue-monaco-editor';

    import { materialDatas,fonts,animationDatas,flareBase64,flare2Base64,flare3Base64,masterTemplate,gui2DDatas } from '@/master/js/meshData';

    export default {
        data: () => ({
            name: 'meshSetting',
            activeNames: ['1'],
            fonts: fonts,  //字体文件列表

            dialogVisible_faceUV: false,  //面切分弹出框显示
            faceUVArr: [ //面切分数组
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],  

            dialogVisible_faceColors: false,  //面颜色弹出框显示
            faceColorsArr: ['', '', '', '', '', ''],  //面颜色数组

            dialogVisible_points: false,  //锚点或钩子弹出框
            dialogTitle_points: '',  //锚点或钩子弹出框标题
            anchorsObj_default: {  //锚点对象默认值
                anchormesheID: '',  //meshid，列出所有meshname来选择
                anchorFractionWidth: 1,  //分数宽度，0-1，步长0.1
                anchorFractionHeight: 1,  //分数高度，0-1，步长0.1
                anchorInfluence: 1,  //锚点影响，0-1，步长0.1
                anchorNoCollisionBetweenLinkedBodies: false,  //连接碰撞, 设为true后两个物体连接不检测碰撞
            },
            anchorsObj: {},  //锚点对象
            hooksObj_default: {  //钩子对象默认值
                hookMesheID: '',  //meshid，列出所有meshname来选择
                hookFraction: 1,  //分数，0-1，步长0.1
                hookInfluence: 1,  //钩子影响，0-1，步长0.1
                hookNoCollisionBetweenLinkedBodies: false,  //连接碰撞, 设为true后两个物体连接不检测碰撞
            },
            hooksObj: {},  //钩子对象
            dialog_points_type: null,  //锚点 或 钩子
            dialog_points_method: null,  //新增 或 编辑
            dialog_points_index: null,  //编辑索引

            dialogVisible_addMaterial: false,  //新建材质弹出框
            materialDatas: materialDatas,  //新建材质可选列表
            addMaterialType: null,  //新建材质类型

            dialogVisible_animation: false,  //添加动画弹出框
            dialogTitle_animation: '',  //添加动画弹出框标题
            dialog_animation_property: [],  //添加动画的属性
            animationObj: null,  //动画对象
            animationProperty: null,  //属性详情
            dialog_animation_method: null,  //新增 或 编辑
            dialog_animation_index: null,  //编辑索引

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
            mesh:null,

            dialogVisible_editProgram: false,  //编辑程序弹出框显示 
            code: '', //monaco编辑器
			options: {
				selectOnLineNumbers: false
            },
            selectElement: '',
            lookAtModeList:[
                {
                    label:"不开启",
                    value:0,
                },
                {
                    label:"固定点",
                    value:1,
                },
                {
                    label:"物体",
                    value:2,
                },
                {
                    label:"灯光",
                    value:3,
                },
                {
                    label:"相机",
                    value:4,
                }
            ],
            guiTypelist:[
                {
                    label:"常规按钮",
                    value:"SimpleButton",
                },
                {
                    label:"带图片按钮",
                    value:"ImageButton",
                },
                {
                    label:"图片文字居中按钮",
                    value:"ImageWithCenterTextButton",
                },
                {
                    label:"无文字图片按钮",
                    value:"ImageOnlyButton",
                }
            ],
            guiMeshTypeSelect:"SimpleButton",
        }),
        components: {
            animation,
            MonacoEditor,
        },
        watch:{
            meshCom: {
                handler(nv, ov) {
                    this.mesh = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            meshCom(){ //物体对象
                let curMeshId = getState('master', 'curMeshId');
                let type = "meshes";
                if(curMeshId.indexOf("transformNode")>-1){
                    type = "transformNodes";
                }
                else if(curMeshId.indexOf("instance")>-1){
                    // // let meshes = getState('master', 'meshes');
                    // let ins1 = getOptionByID(curMeshId, "instance");
                    // // console.log(ins1, getOptionByID);
                    // return ins1;
                    type = "instances";
                }

                let option = this.$store.getters['master/getObjectByID']({
                    type: type,
                    id: curMeshId
                });

                if(option){
                    return deepCopy(option);
                }

                return null;
            },
            meshes(){ //已创建的物体库
                return getState('master', 'meshes');
            },
            cameras(){ //已创建的物体库
                return getState('master', 'cameras');
            },
            lights(){ //已创建的物体库
                return getState('master', 'lights');
            },
            materials(){ //已创建的材质库
                let materials = getState('master', 'materials');
                let multiMaterials = getState('master', 'multiMaterials');
                let re = [];
                if(materials){
                    re = re.concat(materials);
                }
                if(multiMaterials){
                    re = re.concat(multiMaterials);
                }
                return re;
            },
        },
        methods: {
            convertToGuiMesh(){
                let type = "gui2D", subType = this.guiMeshTypeSelect;
                let template = masterTemplate[type];
                let option = gui2DDatas[subType];
                // let meshName = this.getMeshName(subType);

                var gui2DOption = $.extend(true, {} , template, option);

                gui2DOption.id = generateRandomKey("gui2D");
                gui2DOption.name = gui2DOption.name + getState('master', 'gui2Ds').length;
                gui2DOption.type = subType;
                gui2DOption.guiMode = 1;
                gui2DOption.createByMeshId = this.mesh.id;
                // gui2DOption.mainType = "mesh";

                this.$store.commit("master/insertCommands", {
                    key: 'gui2Ds',
                    value: gui2DOption
                });

                addObjectView(gui2DOption);

                this.mesh.isGuiMesh = true;
                this.saveData("isGuiMesh");
            },
            openEditProgramDialog(){
                this.code = getProgramMeshNotes() + this.mesh.pro;

                this.dialogVisible_editProgram = true;
            },
            dragMousedown(event){
				this.selectElement = document.getElementById('resize-drag');
                var div1 = this.selectElement;

                this.isDowm = true;
                this.selectElement.style.cursor = 'move';

                var distanceX = event.clientX - this.selectElement.offsetLeft;
                var distanceY = event.clientY - this.selectElement.offsetTop;
                
                document.onmousemove = function (ev) {
                    var oevent = ev || event;
                    div1.style.left = oevent.clientX - distanceX + 'px';
                    div1.style.top = oevent.clientY - distanceY + 'px';
                }
				document.onmouseup = function () {
					document.onmousemove = null;
					document.onmouseup = null;
					div1.style.cursor = 'default';
				}
            },
            onMounted(editor) {
				this.editor = editor;
            },
            onCodeChange(editor) {
				// console.log(editor.getValue());
			},
            addArrayItem(data, item, saveKey){
                data.push(item);
                this.saveData(saveKey);
            },
            deleteArrayItem(data, index, saveKey){
                data.splice(index, 1);
                this.saveData(saveKey);
            },
            handleChange(){

            },
            hasKey(keyName){
                if(this.mesh == null){
                    return false;
                }

                return (keyName in this.mesh);
            },
            openFaceUVDialog(){
                let faceUV = deepCopy(this.mesh.faceUV);

                if(faceUV.length > 0){
                    this.faceUVArr = faceUV;
                }
                else{
                    this.faceUVArr = [
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0],
                    ]
                }

                this.dialogVisible_faceUV = true;
            },
            editFaceUV(){
                this.mesh.faceUV = this.faceUVArr;
                this.saveData('faceUV');

                this.dialogVisible_faceUV = false;
            },
            openFaceColorsDialog(){
                let faceColors = deepCopy(this.mesh.faceColors);

                if(faceColors.length > 0){
                    this.faceColorsArr = faceColors;
                }
                else{
                    this.faceColorsArr = ['', '', '', '', '', ''];
                }

                this.dialogVisible_faceColors = true;
            },
            editFaceColors(){
                this.mesh.faceColors = this.faceColorsArr;
                this.saveData('faceColors');

                this.dialogVisible_faceColors = false;
            },
            meshesFilter_parent(){
                let data = deepCopy(this.meshes);

                data = data.filter(item => {
                    if(item.id == this.mesh.id){
                        return false;
                    }
                    else if(!this.isParentId(this.mesh.id, item.id)){
                        return false;
                    }

                    return true;
                })

                return data;
            },
            isParentId(id, parentId){
                let is = false;

                for(let i = 0; i < this.meshes.length; i++){
                    if(this.meshes[i].id == parentId){
                        if(this.meshes[i].parentId == null){
                            is = true;
                        }
                        else if(this.meshes[i].parentId == id){
                            is = false;
                        }
                        else{
                            is = this.isParentId(id, this.meshes[i].parentId);
                        }

                        break;
                    }
                }

                return is;
            },
            openAddMaterialDialog(){
                this.dialogVisible_addMaterial = true;
            },
            addMaterial(){
                if(!this.addMaterialType){
                    this.$message({
                        message: '请选择一种材质类型',
                        type: 'warning',
                    });
                    return;
                }

                let material = null;
                
                for(let i = 0; i < this.materialDatas.length; i++){
                    if(this.materialDatas[i].type == this.addMaterialType){
                        material = deepCopy(this.materialDatas[i]);
                        material.id = generateRandomKey('material');
                        material.name = material.name + '' + (this.materials.length + 1);
                        break;
                    }
                }

                this.$store.commit('master/insertCommands', {
                    key: 'materials',
                    value: material
                });

                // this.$store.commit('master/changeCurId', {
                //     key: 'curMaterialId',
                //     value: material.id
                // })

                //如果物体没有绑定材质，则把新建的材质绑定给物体
                if(this.mesh.materialId == null || this.mesh.materialId == ''){
                    this.mesh.materialId = material.id;
                    this.saveData('materialId');
                }

                // this.$store.commit('master/changeCurModelName', 'material');

                // this.$store.commit('master/refreshMasterLayerTime');

                addObjectView(material);
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
                    _this.mesh.heightMapPicture = e.target.result;
                    _this.saveData('heightMapPicture');
			    }
			    a.readAsDataURL(file.raw);
            },
            physicChange(type){
                if(type == 'enableRigidPhysic'){
                    this.saveData('enableRigidPhysic');

                    if(this.mesh.enableRigidPhysic){
                        this.mesh.enableSoftPhysic = false;
                        this.saveData('enableSoftPhysic');
                    }
                }
                else if(type == 'enableSoftPhysic'){
                    this.saveData('enableSoftPhysic');

                    if(this.mesh.enableSoftPhysic){
                        this.mesh.enableRigidPhysic = false;
                        this.saveData('enableRigidPhysic');
                    }
                }
            },
            anchorFixedPointsChange(val){
                //0不能和其他选项共存
                if(val.length > 0 && val.indexOf(0) > -1){
                    if(val[val.length - 1] === 0){
                        this.mesh.anchorFixedPoints = [0];
                    }
                    else{
                        let arr = [];
                        val.forEach(item => {
                            if(item != 0){
                                arr.push(item);
                            }
                        })

                        this.mesh.anchorFixedPoints = arr;
                    }
                }

                this.saveData('anchorFixedPoints');
            },
            meshesFilter_points(){
                let data = deepCopy(this.meshes);

                data = data.filter(item => {
                    if(item.id == this.mesh.id){
                        return false;
                    }
                    else if(!item.enableRigidPhysic){
                        return false;
                    }

                    return true;
                })

                return data;
            },
            openAddPointsDialog(type, method, index){
                this.dialog_points_type = type;
                this.dialog_points_method = method;
                this.dialog_points_index = index;

                if(type == 'anchors'){
                    if(method == 'new'){
                        this.anchorsObj = deepCopy(this.anchorsObj_default);
                    }
                    else if(method == 'edit'){
                        this.anchorsObj = deepCopy(this.mesh.anchors[index]);
                    }

                    this.dialogTitle_points = '锚点';
                }
                else if(type == 'hooks'){
                    if(method == 'new'){
                        this.hooksObj = deepCopy(this.hooksObj_default);
                    }
                    else if(method == 'edit'){
                        this.hooksObj = deepCopy(this.mesh.hooks[index]);
                    }

                    this.dialogTitle_points = '钩子';
                }

                this.dialogVisible_points = true;
            },
            addPoints(){
                if(this.dialog_points_type == 'anchors'){
                    if(this.anchorsObj.anchormesheID == null || this.anchorsObj.anchormesheID == ''){
                        this.$message({
                            message: '请选择一种刚体',
                            type: 'warning',
                        })
                        return;
                    }

                    if(this.dialog_points_method == 'new'){
                        //新增锚点
                        this.mesh.anchors.push(this.anchorsObj);
                    }
                    else if(this.dialog_points_method == 'edit'){
                        //编辑锚点
                        this.mesh.anchors[this.dialog_points_index] = this.anchorsObj;
                    }

                    this.saveData('anchors');
                }
                else if(this.dialog_points_type == 'hooks'){
                    if(this.hooksObj.hookMesheID == null || this.hooksObj.hookMesheID == ''){
                        this.$message({
                            message: '请选择一种刚体',
                            type: 'warning',
                        })
                        return;
                    }

                    if(this.dialog_points_method == 'new'){
                        //新增锚点
                        this.mesh.hooks.push(this.hooksObj);
                    }
                    else if(this.dialog_points_method == 'edit'){
                        //编辑锚点
                        this.mesh.hooks[this.dialog_points_index] = this.hooksObj;
                    }

                    this.saveData('hooks');
                }

                this.dialogVisible_points = false;
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

                    let ani = this.mesh.animations[index];
                    let p1 = ani.property.split('.')[0];

                    this.animationObj = deepCopy(ani);
                    this.animationProperty = deepCopy(animationDatas['mesh'][p1]);
                    this.dialogTitle_animation = '动画--' + this.animationProperty.propertyName;
                }

                this.dialogVisible_animation = true;
            },
            animationPropertyFilter(){
                let data = [];
                let animationData = animationDatas['mesh'];

                for(let key in this.mesh){
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
                    name: '动画' + this.mesh.animations.length,
                    framePerSecond: 100,
                    loopBehavior: 1,
                    keys: [],
                    autoAnimate: true,
                    autoAnimateFrom: 0,
                    autoAnimateTo: 100,
                    autoAnimateLoop: false,
                }
                this.animationProperty = deepCopy(animationDatas['mesh'][p1]);

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
                    this.mesh.animations.push(ani);
                }
                else if(this.dialog_animation_method == 'edit'){
                    this.mesh.animations[this.dialog_animation_index] = ani;
                }

                this.saveData('animations');
                this.dialogVisible_animation = false;
            },
            openAddLensFlareDialog(method, index){
                this.dialog_lensFlare_method = method;

                if(method == 'new'){
                    this.lensFlareObj = deepCopy(this.lensFlareObj_default);
                }
                else if(method == 'edit'){
                    this.lensFlareObj = deepCopy(this.mesh.lensFlareSystem[index]);
                    this.dialog_lensFlare_index = index;
                }

                this.dialogVisible_lensFlare = true;
            },
            handleLensFlareSourceSuccess(event, file, fileList){
                let _this = this;
                let a = new FileReader();
                a.onload = function (e) { 
                    _this.lensFlareObj.lensFlareImg = e.target.result;
			    }
			    a.readAsDataURL(file.raw);
            },
            addLensFlare(){
                if(this.dialog_lensFlare_method == 'new'){
                    this.mesh.lensFlareSystem.push(this.lensFlareObj);
                }
                else if(this.dialog_lensFlare_method == 'edit'){
                    this.mesh.lensFlareSystem[this.dialog_lensFlare_index] = this.lensFlareObj;
                }

                this.saveData('lensFlareSystem');    
                this.dialogVisible_lensFlare = false;
            },
            editProgram(){
                let value = clearProgramNotes(this.editor.getValue());

                this.mesh.pro = value;
                this.saveData('pro');

                this.dialogVisible_editProgram = false;
            },
            addAnInstance(){
                let check = checkHasGeo(this.mesh.id);
                if(!check){
                    this.$message({
                        message: '无法对空物体建立副本',
                        type: 'warning',
                    });
                    return; 
                }
                let temp = deepCopy(masterTemplate["instance"]);
                temp.id = generateRandomKey("instance");
                temp.name = this.mesh.name + "实例" + getState("master", "instances").length;
                temp.instanceByMeshId = this.mesh.id;
                temp.rotation = deepCopy(this.mesh.rotation);
                temp.scaling = deepCopy(this.mesh.scaling);
                // if(!this.mesh.instances){
                //     this.mesh.instances = [];
                // }
                // this.addArrayItem(this.mesh.instances, temp, "instances");
                this.$store.commit("master/insertCommands", {
                    key: 'instances',
                    value: temp
                });

                addObjectView(temp);

            },
            saveData(type){
                let mainType = this.mesh.mainType, listType="meshes";
                if(mainType=="instance"){
                    listType = "instances";
                }
                else if(mainType=="transformNode"){
                    listType = "transformNodes";
                }

                let meshes = getState('master', listType);
                let curMeshId = getState('master', 'curMeshId'); 

                let index = 0;
                for(let i = 0; i < meshes.length; i++){
                    if(meshes[i].id == curMeshId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(meshes[index]);

                let value = this.mesh[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.mesh[item];
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

                    let curSystem = this.mesh["lensFlareSystem"];
                    if(value){
                        if(curSystem.length==0){
                            data.forEach(item=>{
                                this.mesh["lensFlareSystem"].push(item);
                            });

                            this.$store.commit('master/updateCommands', {
                                key: listType + '.${'+ index +'}.lensFlareSystem',
                                value: this.mesh["lensFlareSystem"]
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
                                this.mesh["lensFlareSystem"] = [];
                                this.$store.commit('master/updateCommands', {
                                    key: listType + '.${'+ index +'}.lensFlareSystem',
                                    value: []
                                });
                            }
                        }
                    }
                }
                
                this.$store.commit('master/updateCommands', {
                    key: listType + '.${'+ index +'}.' + updateType,
                    value: this.mesh[updateType]
                });

                this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.mesh, index, preObject);
            },
        }
    }
</script>

<style lang="scss">
    .meshSetting{
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
        .el-slider__runway{
            margin: 12px 0;

            .el-slider__button{
                width: 12px;
                height: 12px;
            }
        }
    }

    .resize-drag-box{
		background-color: rgba(0, 0, 0, 0.5);
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		overflow: hidden;
		margin: 0;
		z-index: 3000;
		user-select: none;

		.resize-drag{
			width: 80%;
			height: 80%;
			padding: 20px;
			background-color: #fff;
			border-radius: 5px;
			box-sizing: border-box;
			font-size: 12px;
			touch-action: none;
			cursor: move;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);

			.resize-drag-title{
				height: 30px;
				line-height: 30px;
				font-size: 14px;
				position: relative;
				margin-bottom: 10px;

				.close{
					position: absolute;
					right: 0;
					top: 0;
					cursor: pointer;
				}
			}
			.resize-drag-main{
				width: 100%;
				height: calc(100% - 80px);
			}
			.resize-drag-button{
				height: 30px;
				line-height: 30px;
				margin-top: 10px;
				text-align: right;
			}
		}
	}
</style>