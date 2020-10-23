
<template>
    <div class="msManagerContainer">
    	<div class="object">
    		<div class="collapse" title="折叠面板">
    			编辑器<i class="el-icon-caret-right"></i>
    		</div>
    		<div class="add" title="添加">
    			
    			<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="addObject"  popper-class="el-menu-demo">
				  <el-submenu index="2">
				    <template slot="title"><i class="el-icon-circle-plus"></i></template>
				    <el-submenu index="light">
				    	<template slot="title">灯光</template>
						<el-menu-item index="PointLight">点光Point</el-menu-item>
						<el-menu-item index="DirectionalLight">平行光Directional</el-menu-item>
						<el-menu-item index="SpotLight">聚光灯Spot</el-menu-item>
						<el-menu-item index="HemisphericLight">半球光Hemispheric</el-menu-item>
				    </el-submenu>
				    <el-submenu index="mesh">
				    	<template slot="title">常规形状</template>
						<el-menu-item index="Box">立方体Box</el-menu-item>
						<el-menu-item index="TiledBox">瓷砖立方体TiledBox</el-menu-item>
						<el-menu-item index="Sphere">球体Sphere</el-menu-item>
						<el-menu-item index="Cylinder">圆柱/圆锥Cylinder</el-menu-item>
						<el-menu-item index="Plane">平面Plane</el-menu-item>
						<el-menu-item index="TiledPlane">瓷砖平面TiledPlane</el-menu-item>
						<el-menu-item index="Disc">圆盘/多边形Disc</el-menu-item>
						<el-menu-item index="Torus">环形/甜甜圈Torus</el-menu-item>
						<el-menu-item index="TorusKnot">环形结TorusKnot</el-menu-item>
						<el-menu-item index="Ground">地板Ground</el-menu-item>
						<!-- <el-menu-item index="TiledGround">瓷砖地板TiledGround</el-menu-item> -->
						<el-menu-item index="HeightMap">地形HeightMap</el-menu-item>
						<el-menu-item index="3DText">3D文字</el-menu-item>
				    </el-submenu>
				    <el-submenu index="meshParametric">
				    	<template slot="title">参数化形状</template>
						<el-menu-item index="Lines">线条Lines</el-menu-item>
						<el-menu-item index="DashedLines">虚线DashedLines</el-menu-item>
						<el-menu-item index="LineSystem">线段LineSystem</el-menu-item>
						<el-menu-item index="Ribbon">丝带Ribbon</el-menu-item>
						<el-menu-item index="Tube">管状物Tube</el-menu-item>
						<el-menu-item index="ExtrudedShapes">挤压形状ExtrudedShapes</el-menu-item>
<!-- 						<el-menu-item index="CustomExtrudedShapes">自定义挤压CustomExtrudedShapes</el-menu-item> -->
						<el-menu-item index="Lathe">车床形状Lathe</el-menu-item>
						<el-menu-item index="NonRegularPolygon">不规则多边形NonRegularPolygon</el-menu-item>
						<el-menu-item index="ExtrudedNonRegularPolygon">挤压不规则多边形ExtrudedNonRegularPolygon</el-menu-item>
						<el-menu-item index="programMesh">程序化形状</el-menu-item>
				    </el-submenu>
				    <el-submenu index="particle">
				      <template slot="title">粒子</template>
				      <el-menu-item index="ParticleSystem">常规粒子</el-menu-item>
				      <el-menu-item index="SolidParticle">固体粒子solid</el-menu-item>
				      <el-menu-item index="PointCloudParticle">点云粒子pointCloud</el-menu-item>
				    </el-submenu>
				    <el-submenu index="program">
				      <template slot="title">程序</template>
				      <el-menu-item index="InnerProgram">执行一次</el-menu-item>
				      <el-menu-item index="BeforeProgram">loopBefore每帧前执行</el-menu-item>
				      <el-menu-item index="AfterProgram">loopAfter每帧后执行</el-menu-item>
				    </el-submenu>
					<el-submenu index="gui2D">
				      <template slot="title">交互控件</template>
				      <el-menu-item index="SimpleButton">常规按钮(Button)</el-menu-item>
				      <el-menu-item index="ImageButton">带图片按钮(ImageButton)</el-menu-item>
				      <el-menu-item index="ImageWithCenterTextButton">图片文字居中按钮(ImageWithCenterTextButton)</el-menu-item>
					  <el-menu-item index="ImageOnlyButton">无文字图片按钮(ImageOnlyButton)</el-menu-item>
				    </el-submenu>
				    <el-menu-item index="spriteManager">精灵图</el-menu-item>
				    <el-menu-item index="uploadFile">上传自定义文件</el-menu-item>
				  </el-submenu>
				</el-menu>
    		</div>
    		<div class="copy" @click="copyMulti" title="复制">
    			<i class="el-icon-copy-document"></i>
    		</div>
    		<div class="del" @click="removeMulti" title="删除">
    			<i class="el-icon-delete-solid"></i>
    		</div>
    		<div class="bool" title="批量操作">
    			
    			<el-menu :default-active="activeIndexBool" class="el-menu-demo" mode="horizontal" @select="boolcalc"  popper-class="el-menu-demo">
				  <el-submenu index="1">
				    <template slot="title"><i class="el-icon-setting"></i></template>
				    <el-menu-item index="boolCalc">布尔运算</el-menu-item>
				    <el-menu-item index="mergeMesh">物体融合</el-menu-item>
				    <!-- <el-menu-item index="union">合并</el-menu-item> -->
				  </el-submenu>
				</el-menu>
    		</div>
    	</div>
    	<div class="manager">
    		<!-- default-expand-all -->
    		<el-tree
					:data="data"
					:props = "defaultTreeProps"
					show-checkbox
					node-key="id"
					:auto-expand-parent="false"
					:default-expanded-keys="defaultExpandedKeys"
					@node-expand ="nodeExpand"
					@node-collapse ="nodeCollapse"
					@node-click="selectNode"
		 			@check = "batchOption"
					:check-strictly="true"
					:expand-on-click-node="false"
					:check-on-click-node="false"
					ref="treeManage"
				>
					<span class="custom-tree-node" slot-scope="{ node, data }" :style="{background:curObject==data.id && (curModelName==data.mainType || (curModelName=='mesh' && data.mainType=='instance' || data.mainType=='transformNode') ) ?'rgb(189, 212, 236)':'transparent'}">
						<span :style="{color:data.mainType=='instance'?'#fb8888':'black'}">{{ node.label }}</span>
						<span>
							<el-button title="隐藏" style="margin-left: 0px;"
								v-if="data.mainType=='mesh' || data.mainType=='transformNode' || data.mainType=='instance' || data.mainType=='gui2D'"
								type="text"
								size="mini"
								@click="() => hideSingle(node, data)">
								<i class="el-icon-view" :style="{color:data.isVisible===false?'#e5e5e5':'rgb(88,158,248)'}"></i>
							</el-button>
							<el-button title="锁定" style="margin-left: 0px;"
								v-if="(data.mainType=='mesh' || data.mainType=='transformNode' || data.mainType=='instance') || data.mainType=='particle'"
								type="text"
								size="mini"
								@click="() => lockSingle(node, data)">
								<i class="el-icon-unlock" v-if="data.isPickable===undefined || data.isPickable===true"></i>
								<i class="el-icon-lock" v-else style="color:red"></i>
							</el-button>
							<el-button style="margin-left: 0px;" title="删除"
								type="text"
								size="mini"
								@click="() => removeSingle(node, data)">
								<i class="el-icon-delete"></i>
							</el-button>
						</span>
					</span>
				</el-tree>
    	</div>    	
    	<div class="controll">
    		<el-row>
			  <el-col :span="12">
			  	<!-- <el-button type="danger" size="mini" @click="uploadMs3df">上传配置</el-button> -->
				  	<el-upload
						class="upload-demo"
						action=""
						:on-error="uploadMs3df"
						:before-upload="beforeSourceUpload"
					>
					<el-button style="width:124.5px;" size="small" type="danger">点击上传</el-button>
					<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
			  </el-col>
			  <el-col :span="12">
			  	<el-button type="primary" size="mini" @click="downloadMs3df">下载配置</el-button>
			  </el-col>
			</el-row>
    	</div>
		
		<!-- 添加常规粒子弹出框 -->
		<el-dialog
			title="添加常规粒子"
			:visible.sync="dialogVisible_addParticle"
			width="30%"
		>
			<el-select v-model="addParticleType" placeholder="请选择常规粒子类型">
				<el-option
					v-for="item in addParticleOptions"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible_addParticle = false">取 消</el-button>
				<el-button type="primary" @click="addParticle">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 添加程序弹出框 -->
		<div class="resize-drag-box" v-if="dialogVisible_addProgram">
			<div id="resize-drag" class="resize-drag" @mousedown="dragMousedown">
				<div class="resize-drag-title">
					<span>添加程序</span>
					<span class="close" @click="dialogVisible_addProgram = false">X</span>
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
					<el-button size="mini" @click="dialogVisible_addProgram = false">取 消</el-button>
					<el-button size="mini" type="primary" @click="addProgram">保存</el-button>
				</div>
			</div>
		</div>

		<!-- 布尔运算选择 -->
		<el-dialog
			title="布尔运算元素选择"
			:visible.sync="dialogVisible_boolCal"
			width="50%"
		>
			<el-row>
				<el-col :span="4">
					运算类型:
				</el-col>
				<el-col :span="20">
					<el-radio-group v-model="boolCalcType" size="mini">
						<el-radio-button label="intersect">相交</el-radio-button>
						<el-radio-button label="subtract">相减</el-radio-button>
						<el-radio-button label="union">合并</el-radio-button>
					</el-radio-group>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="4">
					运算元素:
				</el-col>
				<el-col :span="20">
					<el-transfer v-model="boolCalcSelected" target-order="push" :data="boolCalcData"></el-transfer>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					元素顺序会影响计算结果
				</el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible_boolCal = false">取 消</el-button>
				<el-button type="primary" @click="boolCalculation">确 定</el-button>
			</span>
		</el-dialog>
		
    </div>
</template>

<script>

	import {iconDataExample, mengshuBase64, default3DUrl} from '@/data/babylonData';

	import {fontFamilyList} from '@/data/characterSettingData';

	import { createAvatar} from '@/canvas/function3D';

	import { getPixelColor, changePageFunction,getBabylonInstance,setLoadedState} from '@/canvas/common3D';

	import { getState, generateRandomKey } from '@/canvas/common';

	import { rgbOrRgbaToArray} from '@/canvas/function3D';

	import * as BABYLON from '@babylonjs/core/Legacy/legacy';

	import $ from 'jquery';

	import MonacoEditor from 'vue-monaco-editor';

	import { VideoRecorder } from '@babylonjs/core/Legacy/legacy';

	import {
	    pageSpace,
	    commonSpace,
	    commonUpdate,
	    updateBatchState,
	    updateC_Menu,
	} from '@/store/mutations/mutation-types';

	import { selectedMeshed, addObjectView, getScreenSize, getAllObjNotes,addParticleView,createAssistMash,deleteObjectView,serializeMs3df, addMaterialView, addTextureView,getOptionByID,downloadTextFile,addProgramView,deleteProgramView ,clearProgramNotes,updateObjectView,booleanCalculation,updateObjectViewHandler,getProgramMeshNotes, getCurObject,mergeMeshWithNew,createBatchTransform } from '@/master/js/methods';

	import { meshDatas, lightDatas, masterTemplate, particleEmitterTypeDatas, mainTypeTokeyMap, gui2DDatas } from '@/master/js/meshData';
	import { deepCopy } from '../../utils/util';


	import pako from 'pako/dist/pako';
	

	export default {
		name: "signDialog",
		components: {
			MonacoEditor,
	    },
		data: () => ({
			activeIndex:"2",
			activeIndexBool:"1",
			defaultTreeProps:{
                label: "name",
	    	},

			data:[],

			defaultExpandedKeys:[],

			closeExpandedKeys:[],

			boolCalcSelected:[],
			boolCalcData:[],
			dialogVisible_boolCal:false,
			boolCalcType:"intersect",
			

			dialogVisible_addParticle: false,  //添加常规粒子弹出框
			addParticleOptions: [  //常规粒子 可添加类型
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
			addParticleType: null,  //常规粒子 类型

			dialogVisible_addProgram: false,  //添加程序弹出框
			dialog_addProgram_type: null,  //添加程序 类型

			selectElement: '', //拖动框
			code: '// Type away! \n', //monaco编辑器
			options: {
				selectOnLineNumbers: false
			}, 
		}),
		computed:{
			refreshMasterLayer() {
				return this.$store.state.master.masterLayerTime;
			},
			curObject(){
				let curModelName = this.curModelName;
				if(curModelName=="light"){
					return getState("master", "curLightId");
				}
				else if(curModelName=="mesh"){
					return getState("master", "curMeshId");
				}
				else if(curModelName=="camera"){
					return getState("master", "curCameraId");
				}
				else if(curModelName=="material"){
					return getState("master", "curMaterialId");
				}
				else if(curModelName=="texture"){
					return getState("master", "curTextureId");
				}
				else if(curModelName=="spriteManager"){
					return getState("master", "curSpriteManagerId");
				}
				else if(curModelName=="particle"){
					return getState("master", "curParticleId");
				}
				else if(curModelName=="skeleton"){
					return getState("master", "curSkeletonId");
				}
				else if(curModelName=="program"){
					return getState("master", "curProgramId");
				}
				else if(curModelName == "transformNode" || curModelName == "instance"){
					return getState("master", "curMeshId");
				}
				// let meshId = getState("master", "curMeshId");
				// if(meshId){
				// 	return meshId;
				// }
				return null;
			},
			curModelName(){
				let mode = getState("master", "curModelName");
				if(mode){
					return mode;
				}
				return null;
			},
		},
		mounted(){
			//一开始加入默认相机
			// let template = masterTemplate['camera'];

			// let cameraOption = $.extend(true, {}, template);
			// cameraOption.id = generateRandomKey('camera');

			// this.$store.commit("master/insertCommands", {
			// 	key: 'cameras',
			// 	value: cameraOption
			// });

			// this.$store.commit('master/changeCurId', {
			// 	key: 'curCameraId',
			// 	value: cameraOption.id
			// });

			// addObjectView(cameraOption);

			this.$store.commit('master/refreshMasterLayerTime');
		},
		watch:{
			refreshMasterLayer(nv , ov){
				let sceneId = getState("master", "id"), sceneName = getState("master", "name");
				let tree = {};
				tree.id = sceneId;
				tree.name = sceneName;
				tree.mainType = "scene";
				tree.children = [];

				let cameras = getState("master", "cameras"),
					lights = getState("master", "lights"),
					meshes = getState("master", "meshes"),
					materials = getState("master", "materials"),
					textures = getState("master", "textures"),
					particleSystems = getState("master", "particleSystems"),
					transformNodes = getState("master", "transformNodes"),
					instances = getState("master", "instances"),
					multiMaterials = getState("master", "multiMaterials"),
					// pointCloudParticleSystems = getState("master", "pointCloudParticleSystems"),
					sprites = getState("master", "spriteManagers"),
					programs = getState("master", "programs"),
					skeletons = getState("master", "skeletons"),
					gui2Ds = getState("master", "gui2Ds");

				let meshplusnode = [], materialPlusNode=[];
				if(meshes){
					meshplusnode = meshplusnode.concat(meshes);
				}

				if(transformNodes){
					meshplusnode = meshplusnode.concat(transformNodes);
				}

				if(instances){
					meshplusnode = meshplusnode.concat(instances);
				}

				if(materials){
					materialPlusNode = materialPlusNode.concat(materials);
				}

				if(multiMaterials){
					materialPlusNode = materialPlusNode.concat(multiMaterials);
				}

				if(cameras && cameras.length>0){
					tree.children.push(this.createLayerTree("$container$_1", "相机", "camera", cameras));
				}

				if(lights && lights.length>0){
					tree.children.push(this.createLayerTree("$container$_2", "灯光", "light", lights));
				}

				if(meshplusnode.length>0){
					tree.children.push(this.createLayerTree("$container$_3", "物体", "mesh", meshplusnode));
				}

				if(materialPlusNode && materialPlusNode.length>0){
					tree.children.push(this.createLayerTree("$container$_4", "材质", "material", materialPlusNode));
				}

				if(textures && textures.length>0){
					tree.children.push(this.createLayerTree("$container$_5", "纹理", "texture", textures));
				}

				if(particleSystems && particleSystems.length>0){
					tree.children.push(this.createLayerTree("$container$_6", "粒子", "particleSystem", particleSystems));
				}

				if(sprites && sprites.length>0){
					tree.children.push(this.createLayerTree("$container$_7", "精灵图", "spriteManager", sprites));
				}

				if(programs && programs.length>0){
					tree.children.push(this.createLayerTree("$container$_8", "代码", "program", programs));
				}

				if(skeletons && skeletons.length>0){
					tree.children.push(this.createLayerTree("$container$_9", "骨骼", "skeleton", skeletons));
				}
				if(gui2Ds && gui2Ds.length>0){
					tree.children.push(this.createLayerTree("$container$_10", "交互控件", "gui2D", gui2Ds));
				}

				this.data = [tree];

				let exkeys = [];

				exkeys.push(sceneId);

				for(let i=1;i<=20;i++){
					exkeys.push("$container$_" + i);
				}

				meshplusnode.forEach((item)=>{
					exkeys.push(item.id);
				});

				materialPlusNode.forEach((item)=>{
					exkeys.push(item.id);
				});

				let newExkeys = [];
				
				exkeys.forEach(exkey=>{
					// this.closeExpandedKeys.forEach(key=>{
					// 	if(key!=exkey){
					// 		newExkeys.push(exkey);
					// 	}
					// });
					let match = true;
					for(let i=0;i< this.closeExpandedKeys.length;i++){
						let key =  this.closeExpandedKeys[i];
						if(key==exkey){
							match = false;
							break;
						}
					}

					if(match){
						newExkeys.push(exkey);
					}
				});

				this.defaultExpandedKeys = newExkeys;
				//console.log(newExkeys);
			}
		},
		methods: {
			batchOption(){
				let selectedKeys = this.$refs.treeManage.getCheckedKeys();
				createBatchTransform(selectedKeys);
			},
			boolCheckMesh(data, option){
				//let newNode = getOptionByID(id, mainType);
				if(data.mainType!="mesh"){
					return;
				}

				let selectedKeys = this.$refs.treeManage.getCheckedKeys();

				let isSelected = false;
				for(let i=0;i<selectedKeys.length;i++){
					let ikey = selectedKeys[i];
					if(data.id==ikey){
						isSelected = true;
						break;
					}
				}

				if(!isSelected){//选中
					if(this.boolCalcSelected[0]==data.id){
						let key = this.boolCalcSelected.shift();
						// this.$refs.treeManage.setChecked(key, false);
					}
					else{
						let key = this.boolCalcSelected.pop();
						// this.$refs.treeManage.setChecked(key, false);
					}
					return;
				}
				else{//没选中
					if(this.boolCalcSelected.length>=2){
						let key = this.boolCalcSelected.shift();
						this.$refs.treeManage.setChecked(key, false);
					}
				}

				this.boolCalcSelected.push(data.id);
				this.$refs.treeManage.setChecked(data.id, true);

				// if(this.boolCalcSelected.length==1){
				// 	if(this.boolCalcSelected[0]==data.id){
				// 		return;
				// 	}
				// }
				// else if(this.boolCalcSelected.length>=2){
				// 	if(this.boolCalcSelected[1]==data.id){

				// 	}
				// 	else if(this.boolCalcSelected[0]==data.id){
				// 		let key = this.boolCalcSelected.pop();
				// 		this.$refs.treeManage.setChecked(key, false);
				// 	}
				// 	else{
				// 		let key = this.boolCalcSelected.shift();
				// 		this.$refs.treeManage.setChecked(key, false);
				// 	}
				// }
				// this.boolCalcSelected.push(data.id);
				// this.$refs.treeManage.setChecked(data.id, true);
			},
			boolCalculation(){
				if(this.boolCalcSelected.length!=2){
					this.$message({
						message: '请选择2个需要进行布尔运算的物体',
						type: 'warning'
					});
					return;
				}

				let state = booleanCalculation(this.boolCalcSelected, this.boolCalcType);

				if(!state){
					this.$message({
						message: '请选择2个需要进行布尔运算的物体',
						type: 'warning'
					});
				}

				this.$refs.treeManage.setCheckedKeys([]);
				this.boolCalcSelected = [];

				this.dialogVisible_boolCal = false;
				// this.boolCalcSelected
			},
			boolcalc(key, keyPath){
				// console.log(key);
				if(key=="boolCalc"){
					let selectedKeys = this.$refs.treeManage.getCheckedKeys();

					let meshes = getState("master", "meshes");
					let selected = [];
					meshes.forEach(mesh=>{
						for(let i=0;i<selectedKeys.length;i++){
							let key = selectedKeys[i];
							if(mesh.id == key){
								selected.push({
									key: key,
									label: mesh.name,
								});
							}
						}
					});
					this.boolCalcData = selected;
					this.boolCalcSelected = [];
					this.dialogVisible_boolCal = true;
					this.boolCalcType = "intersect";
				}
				else if(key=="mergeMesh"){
					let selectedKeys = this.$refs.treeManage.getCheckedKeys();

					let meshes = getState("master", "meshes");
					let selected = [];
					meshes.forEach(mesh=>{
						for(let i=0;i<selectedKeys.length;i++){
							let key = selectedKeys[i];
							if(mesh.id == key){
								selected.push({
									key: key,
									label: mesh.name,
								});
							}
						}
					});

					mergeMeshWithNew(selected);
				}
				// else if(key=="union"){
					
				// }

				// if(this.boolCalcSelected.length!=2){
				// 	this.$message({
				// 		message: '请选择2个需要进行布尔运算的物体',
				// 		type: 'warning'
				// 	});
				// 	return;
				// }

				// let state = booleanCalculation(this.boolCalcSelected, key);

				// if(!state){
				// 	this.$message({
				// 		message: '请选择2个需要进行布尔运算的物体',
				// 		type: 'warning'
				// 	});
				// }

				// this.$refs.treeManage.setCheckedKeys([]);
				// this.boolCalcSelected = [];
			},
			nodeExpand(data, node, com) {
				let newkeys = [];
				this.closeExpandedKeys.forEach((key)=>{
					if(data.id!=key){
						newkeys.push(key);
					}
				});
				this.closeExpandedKeys = newkeys;

				console.log(data , this.closeExpandedKeys);
			},
			nodeCollapse(data, node, com) {
				this.closeExpandedKeys.push(data.id);

				console.log(data , this.closeExpandedKeys);
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
			uploadMs3df(file){
				
			},
			downloadMs3df(){
				// let config = serializeMs3df();
				// var strScene = JSON.stringify(config);

				// let filename = "文件.ms3df";

				// downloadTextFile(filename, pako.deflate(strScene, { to: 'string' }));

				this.$emit('handleOpenDownLoad');

			},
			copyMulti(){
				let nodeList = this.$refs.treeManage.getCheckedNodes();
				nodeList.forEach(n=>{
					this.copySingle(n);
				});

				this.$refs.treeManage.setCheckedKeys([]);

			},
			hideSingle(node ,data){
				let key = mainTypeTokeyMap[data.mainType];
				let objects = getState("master", key);
				let index = 0;
                for(let i = 0; i < objects.length; i++){
                    if(objects[i].id == data.id){
                        index = i;
                        break;
                    }
				}
				
				this.$store.commit('master/updateCommands', {
                    key: key + '.${'+ index +'}.isVisible',
                    value: !data.isVisible
                });

				this.$store.commit('master/refreshMasterLayerTime');
				
				updateObjectViewHandler("isVisible", objects[index], index);
			},
			lockSingle(node ,data){
				let key = mainTypeTokeyMap[data.mainType];
				let objects = getState("master", key);
				let index = 0;
                for(let i = 0; i < objects.length; i++){
                    if(objects[i].id == data.id){
                        index = i;
                        break;
                    }
				}
				
				this.$store.commit('master/updateCommands', {
                    key: key + '.${'+ index +'}.isPickable',
                    value: !data.isPickable
                });

				this.$store.commit('master/refreshMasterLayerTime');
				
				updateObjectViewHandler("isPickable", objects[index]);
			},
			copySingle(node){
				let mainType = node.mainType, id = node.id;
				let _this = this;

				if(mainType=="scene" || mainType=="camera"){
					return;
				}

				let newNode = getOptionByID(id, mainType), insertKey = mainTypeTokeyMap[mainType];

				if(insertKey==null || newNode==null){
					return;
				}

				//newNode = deepCopy(newNode);

				if(mainType=="mesh" || mainType=="transformNode"){
					let meshes = getState("master", "meshes");
					let transformNodes = getState("master", "transformNodes");

					let list = meshes.concat(transformNodes);

					let exitsMehes = {};
					let stack = [];

					stack.push(newNode);

					let addList = [];
					while(stack.length>0){
						let o = deepCopy(stack.pop());

						let newNodeName = "复制" + o.name;
						let newNodeId = generateRandomKey(o.mainType);

						exitsMehes[o.id] = newNodeId;
						let children = _this.getChildList(o.id, list, exitsMehes);

						o.id = newNodeId;
						o.name = newNodeName;
						addList.push(o);

						if(children.length>0){
							stack = stack.concat(children);
						}
					}

					addList.forEach(o=>{
						if(o.parentId && o.parentId in exitsMehes){
							o.parentId = exitsMehes[o.parentId];
						}

						addObjectView(o);		        
						this.$store.commit("master/insertCommands", {
							key: mainTypeTokeyMap[o.mainType],
							value: o
						});
					});

					this.$store.commit('master/changeCurModelName', null);
				}
				else if(mainType=="light" || mainType=="spriteManager" || mainType=="particle" || mainType=="texture" || mainType=="material"){
					let newNodeName = "复制" + newNode.name;
					let newNodeId = generateRandomKey(mainType);
					
					newNode.name = newNodeName;
					newNode.id = newNodeId;
					
					addObjectView(newNode);		        
					this.$store.commit('master/changeCurModelName', null);
					this.$store.commit("master/insertCommands", {
						key: insertKey,
						value: newNode
					});
		        }
		        // else if(mainType=="texture"){
				// 	addObjectView(newNode);
		        // }
		        // else if(mainType=="material"){
				// 	addObjectView(newNode);
		        // }
				// else if(mainType=="program"){

				// }
				// else if(mainType=="transformNode"){
				// 	newNode.id = generateRandomKey("transformNode");
				// 	insertKey = "transformNodes";


		  //       }


			},
			getChildList(pid, list, exitsMehes){
				let childrens = [];
				for(let i=0;i<list.length;i++){
					let o = list[i];
					if(!(o.id in exitsMehes) && o.parentId == pid){
						childrens.push(o);
					}
				}
				return childrens;
			},
			removeMulti(){
				let nodes = this.$refs.treeManage.getCheckedNodes();
				this.$confirm('是否确认批量删除'+nodes.length+"项?", '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					
					nodes.forEach((node)=>{
						this.removeSingleHanddle(node, {
							id:node.id,
							type:node.type,
							mainType:node.mainType
						});
					});
					this.$store.commit('master/refreshMasterLayerTime');
					// this.removeSingleHanddle(node, data);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			removeSingle(node, data){
				this.$confirm('是否确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.removeSingleHanddle(node, data);

					this.$store.commit('master/refreshMasterLayerTime');
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			removeSingleHanddle(node, data){
				
				let mainType = data.mainType;
				if(!mainType && data.type=="TransformNode"){
					mainType = "transformNode";
				}
				let deleteKey = mainTypeTokeyMap[mainType];
				// if(mainType=="mesh"){
				// 	deleteKey = "meshes";
		  //       }
		  //       else if(mainType=="light"){
				// 	deleteKey = "lights";
		  //       }
		  //       else if(mainType=="texture"){
				// 	deleteKey = "textures";
		  //       }
		  //       else if(mainType=="material"){
				// 	deleteKey = "materials";
		  //       }
		  //       else if(mainType=="spriteManager"){
				// 	deleteKey = "spriteManagers";
		  //       }
		  //       else if(mainType=="particle"){
				// 	deleteKey = "particleSystems";
				// }
				// else if(mainType=="program"){
				// 	deleteKey = "programs";
				// }
				// else if(mainType=="transformNode"){
				// 	deleteKey = "transformNodes";
		  //       }


				if(deleteKey){
					let option = getOptionByID(data.id, mainType);
					if(mainType=="program"){
						
						deleteProgramView({
							type:option.type,
							id:data.id,
						});
					}
					else{
						deleteObjectView(option, this);
					}

					this.$store.commit('master/changeCurModelName', null);
					this.$store.commit("master/deleteItem", {
						key: deleteKey,
						id: data.id
					});


					
				}
			},
			onMounted(editor) {
				this.editor = editor;
			},
			onCodeChange(editor) {
				// console.log(editor.getValue());
			},
			createLayerTree(id, name, mainType, list){
				let ret = {};
				ret.id = id;
				ret.mainType = "container";
				ret.name = name;

				if(list.length==0){
					return null;
				}

				ret.children = [];
				if(mainType == "mesh"){
					let meshList = this.treeData(list, "id", ["parentId", "instanceByMeshId"], "children");
					ret.children = meshList;
				}
				else if(mainType == "material"){
					let materialList = this.treeData(list, "id", ["parentId"], "children");
					ret.children = materialList;
				}
				else{
					ret.children = [];
					list.forEach(item => {
						ret.children.push({
							id:item.id,
							mainType:item.mainType==null?mainType:item.mainType,
							name:item.name,
							isPickable:item.isPickable,
						});
					});
				}
				return ret;
			},
			treeData(source, id, parentIds, children){   
				let cloneData = JSON.parse(JSON.stringify(source));
				return cloneData.filter(father=>{
						let branchArr = cloneData.filter(child => (father[id] == child[parentIds[0]] || father[id] == child[parentIds[1]]));
						branchArr.length>0 ? father[children] = branchArr : ''
						return ((father[parentIds[0]] == null || father[parentIds[0]] == '') && (father[parentIds[1]] == null || father[parentIds[1]] == ''));       // 如果第一层不是parentId=0，请自行修改
				});
			},
			selectNode(data, node, com) {
				selectedMeshed(data.id, data.mainType, this);
				// let id = data.id, mainType = data.mainType, curKey=null;

				// if(mainType == "container"){
				// 	this.$store.commit('master/changeCurModelName', null);
				// 	selectedMeshed();
				// 	return;
				// }

				// if(mainType == "scene"){
				// 	this.$store.commit('master/changeCurModelName', 'scene');
				// 	selectedMeshed();
				// 	return;
				// }

				// if(mainType == "mesh"){
				// 	curKey = "curMeshId";
				// }
				// else if(mainType == "material"){
				// 	curKey = "curMaterialId";
				// }
				// else if(mainType == "texture"){
				// 	curKey = "curTextureId";
				// }
				// else if(mainType == "light"){
				// 	curKey = "curLightId";
				// }
				// else if(mainType == "camera"){
				// 	curKey = "curCameraId";
				// }
				// else if(mainType == "particle"){
				// 	curKey = "curParticleId";
				// }
				// else if(mainType == "program"){
				// 	curKey = "curProgramId";
				// }

				// if(curKey == null){
				// 	this.$store.commit('master/changeCurModelName', null);
				// 	selectedMeshed();
				// 	return;
				// }

				// this.$store.commit('master/changeCurId', {
				// 	key: curKey,
				// 	value: id
				// });

				// this.$store.commit('master/changeCurModelName', mainType);

				// this.$store.commit('master/refreshMasterLayerTime');

				// selectedMeshed([{
				// 	id:id,
				// 	mainType:mainType
				// }]);
					
			},
			// renderContent(h, { node, data, store }) {
			// 	return (
			// 	<span class="custom-tree-node">
			// 		<span>{node.label}</span>
			// 		<span>
			// 		<el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
			// 		</span>
			// 	</span>);
			// },
			changeColor(rgb){
				
			},
			getLightOption(type){
				if(type in lightDatas){
					return lightDatas[type];
				}

				return {};
			},
			getMeshOption(type){
				if(type in meshDatas){
					return meshDatas[type];
				} 

				return {};
			},
			getMeshName(type){
				if(type in meshDatas){
					return meshDatas[type].name_cn;
				} 

				return "形状";
			},
			addObject(key, keyPath) {
				console.log(key, keyPath);
				let babylon = document.getElementById("renderCanvas").babylon;
				let scene = babylon.scene, camera = scene.activeCamera, gizmo = babylon.gizmo, exeClass = babylon.particle3D;
				let keyLen = keyPath.length;

				let type = keyPath[keyLen-2], subType = keyPath[keyLen-1];
				if(keyLen == 2){
					type = keyPath[1];
				}

				if(type=="meshParametric"){
					type = "mesh";
				}

				if(type == "light"){ //灯光
					let template = masterTemplate[type];
					let option = this.getLightOption(subType);

					let lightOption = $.extend(true, {}, template, option);
					lightOption.id = generateRandomKey('light');
					lightOption.name = lightOption.name + getState('master', 'lights').length;
					// lightOption.type = subType;

					this.$store.commit("master/insertCommands", {
						key: 'lights',
						value: lightOption
					});

					// this.$store.commit('master/changeCurId', {
					// 	key: 'curLightId',
					// 	value: lightOption.id
					// });

					// this.$store.commit('master/changeCurModelName', 'light');

					// this.$store.commit('master/refreshMasterLayerTime');

					addObjectView(lightOption);
				}
				else if(type == "mesh"){ //物体
					if(subType=="programMesh"){
						let str = getProgramMeshNotes();
						this.code = str;
						this.dialog_addProgram_type = subType;
						this.dialogVisible_addProgram = true;
						return;
					}
					let template = masterTemplate[type];
					let option = this.getMeshOption(subType);
					let meshName = this.getMeshName(subType);

					var meshOption = $.extend(true, {} , template, option);

					meshOption.id = generateRandomKey("mesh");
					meshOption.name = meshName + getState('master', 'meshes').length;
					meshOption.type = subType;
					// meshOption.mainType = "mesh";

					this.$store.commit("master/insertCommands", {
						key: 'meshes',
						value: meshOption
					});

					addObjectView(meshOption);
					
				}
				else if(type=="particle"){ //粒子
					if(subType == 'ParticleSystem'){//常规粒子
						this.dialogVisible_addParticle = true;
					}
				}
				else if(type=="program"){ //程序
					let str = getAllObjNotes();
					this.code = str;

					this.dialog_addProgram_type = subType;
					this.dialogVisible_addProgram = true;
				}
				else if(type=="spriteManager"){ //精灵图
					let template = masterTemplate[type];

					let spriteManagerOption = $.extend(true, {}, template);
					spriteManagerOption.id = generateRandomKey('spriteManager');
					spriteManagerOption.name = spriteManagerOption.name + getState('master', 'spriteManagers').length;

					this.$store.commit("master/insertCommands", {
						key: 'spriteManagers',
						value: spriteManagerOption
					});

					// this.$store.commit('master/changeCurId', {
					// 	key: 'curSpriteManagerId',
					// 	value: spriteManagerOption.id
					// });

					// this.$store.commit('master/changeCurModelName', 'spriteManager');

					// this.$store.commit('master/refreshMasterLayerTime');

					addObjectView(spriteManagerOption);
				}
				else if(type == "gui2D"){ //交互控件
					// if(subType=="programMesh"){
					// 	let str = getProgramMeshNotes();
					// 	this.code = str;
					// 	this.dialog_addProgram_type = subType;
					// 	this.dialogVisible_addProgram = true;
					// 	return;
					// }
					let template = masterTemplate[type];
					let option = gui2DDatas[subType];
					// let meshName = this.getMeshName(subType);

					var gui2DOption = $.extend(true, {} , template, option);

					gui2DOption.id = generateRandomKey("gui2D");
					gui2DOption.name = gui2DOption.name + getState('master', 'gui2Ds').length;
					gui2DOption.type = subType;
					// gui2DOption.mainType = "mesh";

					this.$store.commit("master/insertCommands", {
						key: 'gui2Ds',
						value: gui2DOption
					});

					addObjectView(gui2DOption);
					
				}
				else{
					
				}
			},
			addParticle(){
				if(this.addParticleType == null){
					this.$message({
						message: '请选择常规粒子类型',
						type: 'warning'
					});
					return;
				}

				let particleOption = deepCopy(masterTemplate.particle);
				particleOption.name = this.addParticleType + '粒子' + getState('master', 'particleSystems').length;
				particleOption.id = generateRandomKey("particleSystem");
				particleOption.particleEmitterType = deepCopy(particleEmitterTypeDatas[this.addParticleType]);

				if(this.addParticleType == 'Camera'){
					particleOption.cameraEmitter = true;
					particleOption.minEmitBox = [-0.3, 0, 0];
					particleOption.maxEmitBox = [0.3, 0, 0];
					particleOption.direction1 = [-0.5, -1, 1];
					particleOption.direction2 = [.5, 10, 10];
				}

				particleOption.screenSize = getScreenSize();

				this.$store.commit("master/insertCommands", {
					key: 'particleSystems',
					value: particleOption
				});

				// this.$store.commit('master/changeCurId', {
				// 	key: 'curParticleId',
				// 	value: particleOption.id
				// });

				// this.$store.commit('master/changeCurModelName', 'particle');

				// this.$store.commit('master/refreshMasterLayerTime');

				addObjectView(particleOption);

				// createAssistMash(particleOption);

				// this.createParticleMash(particleOption);

				this.dialogVisible_addParticle = false;
			},
			addProgram(){
				let value = clearProgramNotes(this.editor.getValue());

				if(value == null || value.replace(/\s/g, '') == ""){
					this.$message({
						message: '没有可保存的代码',
						type: 'warning'
					});
					return;
				}

				if(this.dialog_addProgram_type=="programMesh"){
					let type = "mesh", subType = "programMesh";
					let template = masterTemplate[type];
					let option = this.getMeshOption(subType);
					let meshName = this.getMeshName(subType);

					var meshOption = $.extend(true, {} , template, option);

					meshOption.id = generateRandomKey("mesh");
					meshOption.name = meshName + getState('master', 'meshes').length;
					meshOption.type = subType;
					meshOption.pro = value;
					// meshOption.mainType = "mesh";

					this.$store.commit("master/insertCommands", {
						key: 'meshes',
						value: meshOption
					});

					addObjectView(meshOption);

					this.dialogVisible_addProgram = false;
					
					return;
				}

				let programOption = {
					name: '代码片段' + (getState('master', 'programs').length + 1),
					id: generateRandomKey('program'),
					mainType: 'program',
					type: this.dialog_addProgram_type,
					pro: value
				}

				// console.log(programOption);

				this.$store.commit("master/insertCommands", {
					key: 'programs',
					value: programOption
				});

				this.$store.commit('master/changeCurId', {
					key: 'curProgramId',
					value: programOption.id
				});

				this.$store.commit('master/changeCurModelName', 'program');

				this.$store.commit('master/refreshMasterLayerTime');

				addProgramView(programOption);

				this.dialogVisible_addProgram = false;
			},
			createParticleMash(ps){
				let pet = ps.particleEmitterType;
				if(pet == null){
						return;
				}

				let apv = pet.type;
				if(apv == null){
						return;
				}
				apv = apv.replace("ParticleEmitter", "");
					
				let mesh;
				if(apv == "Point"){
					mesh = BABYLON.Mesh.CreateSphere(ps.id, 16, 0.5, this.scene);
				}
				else if(apv == "Box"){
					let max = pet.maxEmitBox;
					let min = pet.minEmitBox;
							mesh = BABYLON.MeshBuilder.CreateBox(ps.id, {width: 1, height: 1, depth: 1}, this.scene);
							
							mesh.scaling.x = Math.max(max[0] - min[0], 0.1);
							mesh.scaling.y = Math.max(max[1] - min[1], 0.1);
							mesh.scaling.z = Math.max(max[2] - min[2], 0.1);
				}
				else if(apv == "Sphere"){
							mesh = BABYLON.MeshBuilder.CreateSphere(ps.id, {diameter: 1}, this.scene);
							mesh.scaling.x = pet.radius * 2;
							mesh.scaling.y = pet.radius * 2;
							mesh.scaling.z = pet.radius * 2;
				}
				else if(apv == "SphereDirected"){
							// mesh = BABYLON.MeshBuilder.CreateSphere(this.curParticleId, 16, pet.radius, scene);
							mesh = BABYLON.MeshBuilder.CreateSphere(ps.id, {diameter: 1}, this.scene);
							mesh.scaling.x = pet.radius * 2;
							mesh.scaling.y = pet.radius * 2;
							mesh.scaling.z = pet.radius * 2;
				}
				else if(apv == "Hemispheric"){
							mesh = BABYLON.HemisphereBuilder.CreateHemisphere(ps.id, {diameter: 1, segments: 16}, this.scene);
							mesh.scaling.x = pet.radius * 2;
							mesh.scaling.y = pet.radius * 2;
							mesh.scaling.z = pet.radius * 2;
				}
				else if(apv == "Cylinder"){
							mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 1, height: 1}, this.scene);
							mesh.scaling.x = pet.radius * 2;
							mesh.scaling.y = pet.height;
							mesh.scaling.z = pet.radius * 2;
				}
				else if(apv == "CylinderDirected"){
							mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 1, height: 1}, this.scene);
							mesh.scaling.x = pet.radius * 2;
							mesh.scaling.y = pet.height;
							mesh.scaling.z = pet.radius * 2;
				}
				else if(apv == "Cone"){
					let radius = pet.radius;
					let angle = pet.angle;
					let height = radius / Math.tan(angle / 2);
							mesh = BABYLON.MeshBuilder.CreateCylinder(ps.id, {diameterTop: 1, diameterBottom: 0, height: 1}, this.scene); 
							mesh.scaling.x = pet.radius * 2;
							mesh.scaling.y = height;
							mesh.scaling.z = pet.radius * 2;
				}
				
				if(mesh != null){
						mesh.position.x = ps.emitter[0];
						mesh.position.y = ps.emitter[1];
						mesh.position.z = ps.emitter[2];
						mesh.material = new BABYLON.StandardMaterial(ps.id, this.scene);
						mesh.material.wireframe = true;

						if(this.showSceneMesh == "隐藏辅助"){
								mesh.visibility = 0;
						}

						mesh.id = ps.id;
				}
			},
			dragMousedown(){
				this.selectElement = document.getElementById('resize-drag')
				var div1 = this.selectElement
				this.selectElement.style.cursor = 'move'
				this.isDowm = true
				var distanceX = event.clientX - this.selectElement.offsetLeft
				var distanceY = event.clientY - this.selectElement.offsetTop
				
				document.onmousemove = function (ev) {
					var oevent = ev || event
					div1.style.left = oevent.clientX - distanceX + 'px'
					div1.style.top = oevent.clientY - distanceY + 'px'
				}
				document.onmouseup = function () {
					document.onmousemove = null
					document.onmouseup = null
					div1.style.cursor = 'default'
				}
			},
		}
	}
</script>

<style lang="scss">

	.el-menu--horizontal li.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal li.el-menu-item:not(.is-disabled):hover{
    	color: #D2322D;
    }

	.msManagerContainer{
		position:absolute;
		left:0px;
		top:0px;
		bottom:0px;
		right:0px;
		border-right:1px solid #878787;

		.object{
			position:absolute;
			left:0;
			right:0;
			top:0px;
			height:24px;
			font-size:16px;
			line-height:24px;
			text-align:center;

			.collapse{
				position:absolute;
				height:100%;
				left:0px;
				right:128px;
				cursor:pointer;
				font-size:14px;
				text-align:left;
			}

			.add, .bool{
				position:absolute;
				height:100%;
				right:96px;
				width:32px;
				cursor:pointer;

				.el-menu--horizontal > .el-submenu .el-submenu__title{
			    	    height: 22px;
						line-height: 22px;
			    }

				.el-menu-demo.el-menu--horizontal.el-menu{
					border-bottom:none;
				}

				.el-submenu{
					position: absolute;
				    width: 32px;
				    height: 32px;

				    .el-submenu__icon-arrow.el-icon-arrow-down{
				    	display:none;
				    }
				}

				.el-menu--horizontal > .el-submenu.is-active .el-submenu__title{
					border-bottom: none;
					background: none;
				}

				.el-submenu__title{
					padding:0;
				}
			}

			.copy{
				position:absolute;
				height:100%;
				right:64px;
				width:32px;
				cursor:pointer;
			}

			.del{
				position:absolute;
				height:100%;
				right:32px;
				width:32px;
				cursor:pointer;
			}

			.bool{
				right:0px;
				width:32px;
			}

			div:hover{
				background:#3782D0;
				color:#fff;
			}
		}

		.manager{
			position:absolute;
			top:25px;
			bottom:29px;
			border-top:1px solid #F0F0F0;
			border-bottom:1px solid #F0F0F0;
			width:100%;
			overflow: auto;

			.custom-tree-node {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 14px;
				padding-right: 8px;
			}

			.el-tree-node__children{
				overflow: inherit;
			}
		}

		.controll{
			position:absolute;
			bottom:0px;
			height:28px;
			width:100%;

			button{
				width:100%;
				height:100%;
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
			width: 40%;
			height: 450px;
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