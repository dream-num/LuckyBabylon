<template>
    <div class="programSetting" v-if="program!=null">
        <el-form ref="form" :model="program" label-width="100px" size="mini" @submit.native.prevent>
            <el-form-item label="程序名称：">
                <el-input 
                    v-model="program.name" 
                    @change="saveData('name')"
                    placeholder="请输入程序名称"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="程序插入位置：">
                <el-select 
                    v-model="program.type" 
                    @change="saveData('type')"
                    placeholder="请选择程序插入位置"
                >
                    <el-option label="执行一次" value="InnerProgram"></el-option>
                    <el-option label="loopBefore每帧前执行" value="BeforeProgram"></el-option>
                    <el-option label="loopAfter每帧后执行" value="AfterProgram"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="程序编辑：">
                <el-button type="primary" @click="openEditProgramDialog">编辑</el-button>
            </el-form-item>
        </el-form>

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
					<el-button size="mini" type="primary" @click="editProgram(false)">修改</el-button>
                    <el-button size="mini" type="danger" @click="editProgram(true)" v-if="program.type=='InnerProgram'">修改并重刷</el-button>
				</div>
			</div>
		</div>
    </div>
</template>

<script>
    import { getState } from '@/canvas/common';
    import { updateObjectView,updateProgramView,getAllObjNotes, clearProgramNotes } from '@/master/js/methods';
    import MonacoEditor from 'vue-monaco-editor';
    import { deepCopy } from '@/utils/util';

    export default {
        data: () => ({
            name: 'programSetting',

            dialogVisible_editProgram: false,  //编辑程序弹出框显示 
            code: '', //monaco编辑器
			options: {
				selectOnLineNumbers: false
            },

            selectElement: '',
            program:null,
        }),
        components: {
            MonacoEditor,
        },
        watch:{
            programCom: {
                handler(nv, ov) {
                    this.program = nv;
                },
                immediate: true,
                deep: true
            }
        },
        computed: {
            programCom(){ //当前代码片段对象
                let curProgramId = getState('master', 'curProgramId');

                let object = this.$store.getters['master/getObjectByID']({
                    type: 'programs',
                    id: curProgramId
                });

                if(object){
                    return deepCopy(object);
                }

                return null;
            },
        },
        methods: {
            onMounted(editor) {
				this.editor = editor;
			},
			onCodeChange(editor) {
				// console.log(editor.getValue());
			},
            openEditProgramDialog(){
                this.code = getAllObjNotes() + this.program.pro;

                this.dialogVisible_editProgram = true;
            },
            editProgram(isRefresh){
                let value = clearProgramNotes(this.editor.getValue());

                this.program.pro = value;
                this.saveData('pro', isRefresh);

                this.dialogVisible_editProgram = false;
            },
            saveData(type,isRefresh){
                let programs = getState('master', 'programs');
                let curProgramId = getState('master', 'curProgramId'); 

                let index = 0;
                for(let i = 0; i < programs.length; i++){
                    if(programs[i].id == curProgramId){
                        index = i;
                        break;
                    }
                }

                let preObject = deepCopy(programs[index]);

                let value = this.program[type], updateType = type;
                if(type.indexOf('.') > -1){
                    let arr = type.split('.');
                    arr.forEach((item, index) => {
                        if(index == 0){
                            value = this.program[item];
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
                    key: 'programs.${'+ index +'}.' + updateType,
                    value: this.program[updateType]
                });

                this.$store.commit('master/refreshMasterLayerTime');

                updateProgramView(this.program, isRefresh, preObject);
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
        },
    }
</script>

<style lang="scss">
    .programSetting{
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