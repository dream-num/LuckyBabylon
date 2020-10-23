<template>
    <div class="animation">
        <el-form ref="form" :model="animation" label-width="80px" size="mini" @submit.native.prevent>
            <el-form-item label="动画名称：">
                <el-input 
                    v-model="animation.name" 
                    placeholder="请输入动画名称"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="帧/秒：">
                <el-input-number 
                    v-model="animation.framePerSecond" 
                    controls-position="right" 
                    :min="1"
                    step-strictly
                >
                </el-input-number>
            </el-form-item>
            <el-form-item label="循环行为：">
                <el-select v-model="animation.loopBehavior" placeholder="请选择">
                    <el-option label="相对循环" :value="0"></el-option>
                    <el-option label="周期循环" :value="1"></el-option>
                    <el-option label="恒定循环" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="动画帧：">
                <el-row v-for="(item, index) in animation.keys" :key="index">
                    <el-col :span="6">帧：</el-col>
                    <el-col :span="18">
<!--                         <el-slider 
                            v-model="item.frame"
                            :min="0"
                            :max="100"
                            :step="1"
                        >
                        </el-slider>
 -->
                        <el-input-number 
                             v-model="item.frame"
                            :min="0"
                            :step="1"
                        >
                        </el-input-number>
                    </el-col>
                    <el-col :span="6">{{animationProperty.propertyName}}：</el-col>
                    <el-col :span="18">
                        <div v-if="animation.dataType==0">
<!--                             <el-slider 
                                v-if="animationProperty.value_type=='slider'"
                                v-model="item.value"
                                :min="animationProperty.value_min"
                                :max="animationProperty.value_max"
                                :step="animationProperty.value_step"
                            >
                            </el-slider> -->
                            <el-input-number 
                                v-if="animationProperty.value_type=='slider'"
                                v-model="item.value"
                                :min="animationProperty.value_min"
                                :step="animationProperty.value_step"
                            >
                            </el-input-number>
                            <el-input-number 
                                v-else-if="animationProperty.value_type=='inputNumber'"
                                v-model="item.value" 
                                controls-position="right" 
                                :min="animationProperty.value_min != null ? animationProperty.value_min : -Infinity"
                                :max="animationProperty.value_max != null ? animationProperty.value_max : Infinity"
                                :step="animationProperty.value_step != null ? animationProperty.value_step : 1"
                                :step-strictly="animationProperty.value_step_strictly"
                            >
                            </el-input-number>
                        </div>
                        <div v-else-if="animation.dataType==4">
                            <el-color-picker 
                                v-model="item.value"
                                color-format="rgb"
                            >
                            </el-color-picker>
                        </div>
                        <div v-else>
                            <el-row>
                                <el-col :span="4">X：</el-col>
                                <el-col :span="20">
                                    <el-input-number 
                                        v-model="item.value[0]" 
                                        controls-position="right" 
                                        :min="animationProperty.value_min != null ? animationProperty.value_min : -Infinity"
                                        :max="animationProperty.value_max != null ? animationProperty.value_max : Infinity"
                                        :step="animationProperty.value_step != null ? animationProperty.value_step : 1"
                                        :step-strictly="animationProperty.value_step_strictly"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Y：</el-col>
                                <el-col :span="20">
                                    <el-input-number 
                                        v-model="item.value[1]" 
                                        controls-position="right" 
                                        :min="animationProperty.value_min != null ? animationProperty.value_min : -Infinity"
                                        :max="animationProperty.value_max != null ? animationProperty.value_max : Infinity"
                                        :step="animationProperty.value_step != null ? animationProperty.value_step : 1"
                                        :step-strictly="animationProperty.value_step_strictly"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="4">Z：</el-col>
                                <el-col :span="20">
                                    <el-input-number 
                                        v-model="item.value[2]" 
                                        controls-position="right" 
                                        :min="animationProperty.value_min != null ? animationProperty.value_min : -Infinity"
                                        :max="animationProperty.value_max != null ? animationProperty.value_max : Infinity"
                                        :step="animationProperty.value_step != null ? animationProperty.value_step : 1"
                                        :step-strictly="animationProperty.value_step_strictly"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                            <el-row v-if="animation.dataType==2">
                                <el-col :span="4">W：</el-col>
                                <el-col :span="20">
                                    <el-input-number 
                                        v-model="item.value[3]" 
                                        controls-position="right" 
                                        :min="animationProperty.value_min != null ? animationProperty.value_min : -Infinity"
                                        :max="animationProperty.value_max != null ? animationProperty.value_max : Infinity"
                                        :step="animationProperty.value_step != null ? animationProperty.value_step : 1"
                                        :step-strictly="animationProperty.value_step_strictly"
                                    >
                                    </el-input-number>
                                </el-col>
                            </el-row>
                        </div>
                    </el-col>
                    <el-button type="danger" @click="delFrame(index)">删除</el-button>
                </el-row>
                <el-button type="primary" @click="addFrame">新增</el-button>
            </el-form-item>
            <el-form-item label="缓动函数：">
                <el-select v-model="animation.animationEaseFunction" placeholder="请选择">
                    <el-option
                      v-for="item in easeData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="animation.animationEaseInOut" placeholder="请选择" v-if="animation.animationEaseFunction!='default'">
                    <el-option
                      v-for="item in easingMode"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="自动执行动画：">
                <el-switch v-model="animation.autoAnimate"></el-switch>
            </el-form-item>
            <div v-if="animation.autoAnimate">
                <el-form-item label="开始帧：">
<!--                     <el-slider 
                        v-model="animation.autoAnimateFrom"
                        :min="0"
                        :max="100"
                        :step="1"
                    >
                    </el-slider> -->

                    <el-input-number 
                         v-model="animation.autoAnimateFrom"
                        :min="0"
                        :step="1"
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item label="结束帧：">
<!--                     <el-slider 
                        v-model="animation.autoAnimateTo"
                        :min="0"
                        :max="100"
                        :step="1"
                    >
                    </el-slider> -->
                    <el-input-number 
                         v-model="animation.autoAnimateTo"
                        :min="0"
                        :step="1"
                    >
                    </el-input-number>
                </el-form-item>
                <el-form-item label="是否循环：">
                    <el-switch v-model="animation.autoAnimateLoop"></el-switch>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
    import $ from 'jquery';
import { deepCopy } from '../utils/util';

    export default {
        data: () => ({
            name: 'animation',
            animation: {
                dataType: 0,
                property: '',
                name: '动画',
                framePerSecond: 100,
                loopBehavior: 1,
                keys: [],
                animationEaseFunction:"default",
                animationEaseInOut:"EASEIN",
                autoAnimate: true,
                autoAnimateFrom: 0,
                autoAnimateTo: 100,
                autoAnimateLoop: true,
            },
            easeData:[
                {
                    lable:"默认",
                    value:"default"
                },
                {
                    lable:"PowerEase",
                    value:"PowerEase"
                },
                {
                    lable:"QuadraticEase",
                    value:"QuadraticEase"
                },
                {
                    lable:"QuarticEase",
                    value:"QuarticEase"
                },
                {
                    lable:"QuinticEase",
                    value:"QuinticEase"
                },
                {
                    lable:"BackEase",
                    value:"BackEase"
                },
                {
                    lable:"BezierCurveEase",
                    value:"BezierCurveEase"
                },
                {
                    lable:"BounceEase",
                    value:"BounceEase"
                },
                {
                    lable:"SineEase",
                    value:"SineEase"
                },
                {
                    lable:"CircleEase",
                    value:"CircleEase"
                },
                {
                    lable:"CubicEase",
                    value:"CubicEase"
                },
                {
                    lable:"ElasticEase",
                    value:"ElasticEase"
                },
                {
                    lable:"ExponentialEase",
                    value:"ExponentialEase"
                },
            ],
            easingMode:[
                {
                    lable:"EASEINOUT",
                    value:"EASINGMODE_EASEINOUT",
                },
                {
                    lable:"EASEIN",
                    value:"EASINGMODE_EASEIN",
                },
                {
                    lable:"EASEOUT",
                    value:"EASINGMODE_EASEOUT",
                },
            ]
        }),
        props: ['animationObj', 'animationProperty'],
        methods: {
            addFrame(){
                let value = deepCopy(this.animationProperty.value_default);

                if(this.animationObj.property.indexOf('.') > -1){
                    let suffix = this.animationObj.property.split('.')[1];
                    if(suffix == 'x'){
                        value = value[0];
                    }
                    else if(suffix == 'y'){
                        value = value[1];
                    }
                    else if(suffix == 'z'){
                        value = value[2];
                    }
                    else if(suffix == 'w'){
                        value = value[3];
                    }
                }

                this.animation.keys.push({
                    frame: 0,
                    value: value,
                })
            },
            delFrame(index){
                this.animation.keys.splice(index, 1);
            }
        },
        watch: {
            animationObj: {
                handler(newV, oldV){
                    if(newV){
                        this.animation = $.extend(true, {}, newV);

                        let propertyValue = deepCopy(this.animationProperty.value_default);

                        if(propertyValue instanceof Array){
                            if(this.animation.property.indexOf('.') > -1){
                                this.animation.dataType = 0;
                            }
                            else{
                                if(propertyValue.length == 3){
                                    this.animation.dataType = 1;
                                }
                                else if(propertyValue.length == 4){
                                    this.animation.dataType = 2;
                                }
                                else if(propertyValue.length == 6){
                                    this.animation.dataType = 3;
                                }
                            }
                        }
                        else if(typeof propertyValue == 'number'){
                            this.animation.dataType = 0;
                        }
                        else if(typeof propertyValue == 'string'){
                            this.animation.dataType = 4;
                        }
                    }
                },
                immediate: true,
            }
        }
    }
</script>

<style lang="scss">
    .animation{

    }
</style>