<template>
    <div class="cameraSetting" v-if="gui2D!=null">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
            <el-collapse-item title="gui基本配置" name="1">
                <el-form ref="form" :model="gui2D" label-width="100px" size="mini" @submit.native.prevent>

                      <!--   <el-button type="primary" size="mini" @click="stopAllAnimation()"><i class="el-icon-video-pause" style="font-size:18px;"></i></el-button> -->

                    <el-form-item label="控件名称：">
                        <el-input 
                            v-model="gui2D.name" 
                            placeholder="请输入控件名称"
                            @change="saveData('name')"
                        >
                        </el-input>
                    </el-form-item>

                    <el-form-item label="控件模式：" v-if="hasKey('guiMode')">
                        <!-- <el-switch 
                            v-model="gui2D.guiMode"
                            @change="saveData('guiMode')"
                        >
                        </el-switch> -->
                        <el-select v-model="gui2D.guiMode" placeholder="附着间隔单位" size="mini" @change="saveData('guiMode')">
                                <el-option :key="0" label="全屏模式" :value="0"></el-option>
                                <el-option :key="1" label="物体模式" :value="1"></el-option>
                            </el-select>
                    </el-form-item>

                    <el-form-item label="画布物体：" v-if="gui2D.guiMode==1">
                        <el-select v-model="gui2D.createByMeshId" placeholder="选择画布附体" size="mini" @change="saveData('createByMeshId')">
                            <el-option 
                                v-for="item in meshes" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="附着物体：" v-if="gui2D.guiMode==0">
                        <el-select v-model="gui2D.linkedMesh" placeholder="选择附着物体" size="mini" @change="saveData('linkedMesh')">
                            <el-option 
                                v-for="item in meshes" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <div v-if="gui2D.linkedMesh!=null && gui2D.linkedMesh.length>0" style="border:1px solid #e5e5e5;border-left:none;border-right:none;">
                        <el-form-item label="附着间隔单位：" v-if="gui2D.guiMode==0">
                            <el-select v-model="gui2D.linkOffsetUnit" placeholder="附着间隔单位" size="mini" @change="saveData('linkOffsetUnit')">
                                <el-option :key="0" label="px" :value="0"></el-option>
                                <el-option :key="1" label="坐标" :value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="附着X方向间隔：" v-if="gui2D.guiMode==0">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.linkOffsetX" 
                                :step="1"
                                @change="saveData('linkOffsetX')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="附着Y方向间隔：" v-if="gui2D.guiMode==0">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.linkOffsetY" 
                                :step="1"
                                @change="saveData('linkOffsetY')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>
                    </div>

                    <el-form-item label="按钮文字：" v-if="hasKey('text')">
                        <el-input 
                            v-model="gui2D.text" 
                            placeholder="请输入按钮文字"
                            @change="saveData('text')"
                        >
                        </el-input>
                    </el-form-item>

                    <el-form-item label="按钮图片：" v-if="hasKey('imageSrc')">
                        <el-upload
                            class="upload-source"
                            action=""
                            :limit="1"
                            :show-file-list="false"
                            :on-progress="handleSourceImageSrc"
                            :before-upload="beforeSourceUpload"
                        >
                            <img v-if="gui2D.imageSrc" :src="gui2D.imageSrc" class="sourceImg">
                            <i v-else class="el-icon-plus source-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="叠放顺序：" v-if="hasKey('zIndex')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.zIndex" 
                            :step="1"
                            @change="saveData('zIndex')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="是否显示："  v-if="hasKey('isVisible')">
                        <el-switch 
                            v-model="gui2D.isVisible"
                            @change="saveData('isVisible')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="鼠标手势："  v-if="hasKey('hoverCursor')">
                        <el-select v-model="gui2D.hoverCursor" placeholder="选择鼠标手势" size="mini" @change="saveData('hoverCursor')">
                            <el-option :key="0" label="无" :value="0"></el-option>
                            <el-option :key="1" label="手势" :value="1"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-collapse-item>

            <el-collapse-item title="gui位置相关" name="2">
                <el-form ref="form" :model="gui2D" label-width="100px" size="mini" @submit.native.prevent>
                    <div style="border:1px solid #e5e5e5;border-left:none;border-right:none;">
                        <el-form-item label="位置单位：" v-if="hasKey('positionUnit')">
                            <el-select v-model="gui2D.positionUnit" placeholder="附着间隔单位" size="mini" @change="saveData('positionUnit')">
                                <el-option :key="0" label="px" :value="0"></el-option>
                                <el-option :key="1" label="坐标" :value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="水平：" v-if="hasKey('left')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.left" 
                                :step="1"
                                @change="saveData('left')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="垂直：" v-if="hasKey('top')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.top" 
                                :step="1"
                                @change="saveData('top')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>
                    </div>

                    <div style="border:1px solid #e5e5e5;border-left:none;border-right:none;">
                        <el-form-item label="大小单位：" v-if="hasKey('sizeUnit')">
                            <el-select v-model="gui2D.sizeUnit" placeholder="大小单位" size="mini" @change="saveData('sizeUnit')">
                                <el-option :key="0" label="%" :value="0"></el-option>
                                <el-option :key="1" label="px" :value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="宽度：" v-if="hasKey('width')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.width" 
                                :step="1"
                                @change="saveData('width')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="高度：" v-if="hasKey('height')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.height" 
                                :step="1"
                                @change="saveData('height')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>
                    </div>

                    <el-form-item label="水平缩放：" v-if="hasKey('scaleX')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.scaleX" 
                            :step="0.1"
                            @change="saveData('scaleX')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="垂直缩放：" v-if="hasKey('scaleY')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.scaleY" 
                            :step="0.1"
                            @change="saveData('scaleY')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="旋转：" v-if="hasKey('rotation')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.rotation" 
                            :step="0.1"
                            @change="saveData('rotation')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="水平位移：" v-if="hasKey('transformCenterX')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.transformCenterX" 
                            :step="0.1"
                            @change="saveData('transformCenterX')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="垂直位移：" v-if="hasKey('transformCenterY')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.transformCenterY" 
                            :step="0.1"
                            @change="saveData('transformCenterY')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="水平对齐：" v-if="hasKey('horizontalAlignment')">
                        <el-select v-model="gui2D.horizontalAlignment" placeholder="选择水平对齐" size="mini" @change="saveData('horizontalAlignment')">
                            <el-option :key="0" label="左对齐" :value="0"></el-option>
                            <el-option :key="1" label="右对齐" :value="1"></el-option>
                            <el-option :key="2" label="中心对齐" :value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="垂直对齐：" v-if="hasKey('verticalAlignment')">
                        <el-select v-model="gui2D.verticalAlignment" placeholder="选择垂直对齐" size="mini" @change="saveData('verticalAlignment')">
                            <el-option :key="0" label="上对齐" :value="0"></el-option>
                            <el-option :key="1" label="下对齐" :value="1"></el-option>
                            <el-option :key="2" label="中心对齐" :value="2"></el-option>
                        </el-select>
                    </el-form-item>

                    <div style="border:1px solid #e5e5e5;border-left:none;border-right:none;">
                        <el-form-item label="内边距单位：" v-if="hasKey('paddingUnit')">
                            <el-select v-model="gui2D.paddingUnit" placeholder="大小单位" size="mini" @change="saveData('paddingUnit')">
                                <el-option :key="0" label="px" :value="0"></el-option>
                                <el-option :key="1" label="坐标" :value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="左内边距：" v-if="hasKey('paddingLeft')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.paddingLeft" 
                                :step="0.1"
                                @change="saveData('paddingLeft')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="右内边距：" v-if="hasKey('paddingRight')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.paddingRight" 
                                :step="0.1"
                                @change="saveData('paddingRight')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="上内边距：" v-if="hasKey('paddingTop')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.paddingTop" 
                                :step="0.1"
                                @change="saveData('paddingTop')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="下内边距：" v-if="hasKey('paddingBottom')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.paddingBottom" 
                                :step="0.1"
                                @change="saveData('paddingBottom')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                    </div>

                    <el-form-item label="适配宽度到子元素："  v-if="hasKey('adaptWidthToChildren')">
                        <el-switch 
                            v-model="gui2D.adaptWidthToChildren"
                            @change="saveData('adaptWidthToChildren')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="适配高度到子元素："  v-if="hasKey('adaptHeightToChildren')">
                        <el-switch 
                            v-model="gui2D.adaptHeightToChildren"
                            @change="saveData('adaptHeightToChildren')"
                        >
                        </el-switch>
                    </el-form-item>
                </el-form>
            </el-collapse-item> 

            <el-collapse-item title="gui样式相关" name="3">
                <el-form ref="form" :model="gui2D" label-width="100px" size="mini" @submit.native.prevent>
                    <el-form-item label="边框粗细：" v-if="hasKey('thickness')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.thickness" 
                            :step="0.1"
                            @change="saveData('thickness')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="圆角大小：" v-if="hasKey('cornerRadius')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.cornerRadius" 
                            :step="0.1"
                            @change="saveData('cornerRadius')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="背景颜色：" v-if="hasKey('background')">
                        <el-color-picker 
                            v-model="gui2D.background"
                            color-format="rgb"
                            @change="saveData('background')"
                        >
                        </el-color-picker>
                    </el-form-item>

                    <el-form-item label="透明度：" v-if="hasKey('alpha')">
                        <el-input-number 
                            controls-position="right"
                            v-model="gui2D.alpha" 
                            :step="0.1"
                            @change="saveData('alpha')"
                            size="mini"
                        >
                        </el-input-number>
                    </el-form-item>

                    <el-form-item label="是否高亮：" v-if="hasKey('isHighlighted')">
                        <el-switch 
                            v-model="gui2D.isHighlighted"
                            @change="saveData('isHighlighted')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="禁用后颜色：" v-if="hasKey('disabledColor')">
                        <el-color-picker 
                            v-model="gui2D.disabledColor"
                            color-format="rgb"
                            @change="saveData('disabledColor')"
                        >
                        </el-color-picker>
                    </el-form-item>

                    <div style="border:1px solid #e5e5e5;border-left:none;border-right:none;">
                        <el-form-item label="阴影水平间隔：" v-if="hasKey('shadowOffsetX')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.shadowOffsetX" 
                                :step="0.1"
                                @change="saveData('shadowOffsetX')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>
                        
                        <el-form-item label="阴影水平间隔：" v-if="hasKey('shadowOffsetX')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.shadowOffsetX" 
                                :step="0.1"
                                @change="saveData('shadowOffsetX')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="阴影垂直间隔：" v-if="hasKey('shadowOffsetY')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.shadowOffsetY" 
                                :step="0.1"
                                @change="saveData('shadowOffsetY')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="阴影模糊：" v-if="hasKey('shadowBlur')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.shadowBlur" 
                                :step="0.1"
                                @change="saveData('shadowBlur')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>

                        <el-form-item label="阴影颜色：" v-if="hasKey('shadowColor')">
                            <el-color-picker 
                                v-model="gui2D.shadowColor"
                                color-format="rgb"
                                @change="saveData('shadowColor')"
                            >
                            </el-color-picker>
                        </el-form-item>
                    </div>

                    <div style="border:1px solid #e5e5e5;border-left:none;border-right:none;">
                        <el-form-item label="字体颜色：" v-if="hasKey('color')">
                            <el-color-picker 
                                v-model="gui2D.color"
                                color-format="rgb"
                                @change="saveData('color')"
                            >
                            </el-color-picker>
                        </el-form-item>

                        <!-- <el-form-item label="字体样式：" v-if="hasKey('fontFamily')">
                            <el-select 
                                v-model="gui2D.fontFamily" 
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
                        </el-form-item> -->

                        <el-form-item label="是否斜体" v-if="hasKey('fontStyle')">
                            <el-switch 
                                v-model="gui2D.fontStyle"
                                @change="saveData('fontStyle')"
                            >
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="是否粗体：" v-if="hasKey('fontWeight')">
                            <el-switch 
                                v-model="gui2D.fontWeight"
                                @change="saveData('fontWeight')"
                            >
                            </el-switch>
                        </el-form-item>

                        <el-form-item label="字体大小：" v-if="hasKey('fontSize')">
                            <el-input-number 
                                controls-position="right"
                                v-model="gui2D.fontSize" 
                                :step="1"
                                :min="0"
                                @change="saveData('fontSize')"
                                size="mini"
                            >
                            </el-input-number>
                        </el-form-item>
                    </div>
                </el-form>
            </el-collapse-item> 

            <el-collapse-item title="gui其他设置" name="4">
                <el-form ref="form" :model="gui2D" label-width="100px" size="mini" @submit.native.prevent>
                    <el-form-item label="点击事件代码：" v-if="hasKey('clickPro')">
                        <el-button type="primary" @click="openEditProgramDialog('clickPro')">编辑</el-button>
                    </el-form-item>
                    
                    <el-form-item label="裁剪子组件：" v-if="hasKey('clipChildren')">
                        <el-switch 
                            v-model="gui2D.clipChildren"
                            @change="saveData('clipChildren')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="裁剪内容：" v-if="hasKey('clipContent')">
                        <el-switch 
                            v-model="gui2D.clipContent"
                            @change="saveData('clipContent')"
                        >
                        </el-switch>
                    </el-form-item>

                    <el-form-item label="父组件：">
                        <el-select v-model="gui2D.parentId" placeholder="选择父组件" size="mini" @change="saveData('parentId')">
                            <el-option 
                                v-for="item in gui2Ds" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <div>
                        <el-row>
                            选择子组件：
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                                <el-select 
                                    v-model="gui2DSelected" 
                                    placeholder="请选择子组件："
                                    size="mini"
                                >
                                    <el-option
                                        v-for="item in gui2Ds"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8">
                                <el-button size="mini" type="primary"  @click="addArrayItem(gui2D.children, gui2DSelected, 'children');gui2DSelected=''">添加</el-button>
                            </el-col>
                        </el-row>
            

                    
                        <el-row style="margin-top:12px;">
                            已包含子组件：
                        </el-row>
                        <el-row :key="item" v-for="(item, index) in gui2D.children">
                            <el-col :span="2"><i class="el-icon-close" style="cursor: pointer;" @click="deleteArrayItem(gui2D.children, index, 'children')"></i></el-col>
                            <el-col :span="20">
                                <el-button size="mini" type="text"  @click="hightlightgui2D(item)">{{gui2DsMap[item]}}</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </el-collapse-item> 
        </el-collapse>

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
    import { getState, generateRandomKey } from '@/canvas/common';
    import { updateObjectView, addMaterialView,uploadImageCheck,clearProgramNotes,getAllObjNotes} from '@/master/js/methods';
    import { deepCopy } from '@/utils/util';
    import MonacoEditor from 'vue-monaco-editor';
    // import animation from '@/master/animation';
    // import { animationDatas } from '@/master/js/meshData';

    export default {
        data: () => ({
            name: 'gui2DSetting',
            activeNames: ['1'],
            gui2D:null,
            fonts:[
                { label: '微软雅黑', value: 'Microsoft YaHei' },
                { label: '宋体', value: 'SimSun' },
                { label: '楷体', value: '楷体' },
                { label: '黑体', value: 'Heiti SC' },
                { label: 'Helvetica', value: 'Helvetica' },
                { label: 'Arial', value: 'Arial' },
                { label: 'Tahoma', value: 'Tahoma' },
                { label: 'Times New Roman', value: 'Times New Roman' },
            ],
            gui2DSelected:"",

            dialogVisible_editProgram: false,  //编辑程序弹出框显示 
            code: '', //monaco编辑器
			options: {
				selectOnLineNumbers: false
            },
            curProKey:null,
        }),
        components: {
            MonacoEditor,
        },
        watch:{
            gui2DCom: {
                handler(nv, ov) {
                    this.gui2D = nv;
                },
                immediate: true,
                deep: true
            },
        },
        computed: {
            gui2DCom(){ //相机对象
                let curGui2DId = getState('master', 'curGui2DId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'gui2Ds',
                    id: curGui2DId
                });

                if(object){
                    return deepCopy(object);
                }

                return null;
            },
            meshes(){ //已创建的物体库
                return getState('master', 'meshes');
            },
            gui2Ds(){ //已创建的控件库
                return getState('master', 'gui2Ds');
            },
            gui2DsMap(){//guimap
                let map = {};
                let materials = getState('master', 'gui2Ds');
                materials.forEach(m=>{
                    map[m.id] = m.name;
                });
                return map;
            },

        },
        methods: {
            onMounted(editor) {
				this.editor = editor;
            },
            onCodeChange(editor) {
				// console.log(editor.getValue());
			},
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
            beforeSourceUpload(file){
                uploadImageCheck(file, this);
            },
            handleSourceImageSrc(event, file, fileList){
                let _this = this;
                let a = new FileReader();
                let extention = file.name.split(".")[1].toLowerCase();
                a.onload = function (e) { 
                    _this.gui2D.imageSrc = e.target.result;
                    _this.saveData('imageSrc', extention);
			    }
			    a.readAsDataURL(file.raw);
            },
            handleChange(){

            },
            hasKey(keyName){
                return (keyName in this.gui2D);
            },
            editProgram(){
                let value = clearProgramNotes(this.editor.getValue());
                let pro = this.curProKey;
                this.gui2D[pro] = value;
                this.saveData(pro);

                this.dialogVisible_editProgram = false;
            },
            openEditProgramDialog(pro){
                this.curProKey = pro;
                this.code = getAllObjNotes() + this.gui2D[pro];

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
            saveData(type){
                let gui2Ds = getState('master', 'gui2Ds');
                let curGui2DId = getState('master', 'curGui2DId'); 

                let index = 0;
                for(let i = 0; i < gui2Ds.length; i++){
                    if(gui2Ds[i].id == curGui2DId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(gui2Ds[index]);

                let value = this.gui2D[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.gui2D[item];
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
                    key: 'gui2Ds.${'+ index +'}.' + updateType,
                    value: this.gui2D[updateType]
                });

                this.$store.commit('master/refreshMasterLayerTime');

                updateObjectView(updateType, this.gui2D, index, preObject);
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