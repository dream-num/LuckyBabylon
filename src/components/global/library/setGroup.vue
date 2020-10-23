<template>
    <div class="set-group">
        <!-- 不带label的radio -->
        <div v-if="item.type ==='radio' && !item.showLabel">
            <el-radio
                v-for="radio in item.children"
                v-model="item.value"
                :key="item.name"
                :label="radio.value"
                :value="radio.value"
            >{{radio.name}}</el-radio>
        </div>

        <!-- 带label的radio -->

        <div v-if="item.type ==='radio' && item.showLabel" class="flexStart">
            <span>{{item.name}}：</span>
            <div class="centerItem">
                <el-radio
                    class="radioItem"
                    v-for="radio in item.children"
                    v-model="item.value"
                    :key="radio.name"
                    :label="radio.value"
                    :value="radio.value"
                >{{radio.name}}</el-radio>
            </div>

            <span></span>
        </div>

        <!-- 滑块 -->

        <div v-if="item.type === 'slider'">
            <span>{{item.name}}：</span>
            <el-slider v-model="item.value" :min="item.min" :max="item.max" :step="item.step"></el-slider>
            <!-- <span v-if="item.showValue">{{item.value}}</span> -->
        </div>

        <!-- 开关 -->
        <div v-if="item.type === 'switch' && item.name">
            <span>{{item.name}}：</span>
            <el-switch
                class="centerItem"
                v-model="item.value"
                :active-text="item.active"
                :inactive-text="item.inactive"
            ></el-switch>
            <span></span>
        </div>
        <!-- 不带label开关 -->
        <div v-if="item.type === 'switch' && !item.name">
            <el-switch
                v-model="item.value"
                :active-text="item.active"
                :inactive-text="item.inactive"
            ></el-switch>
        </div>

        <!-- color -->
        <div v-if="item.type === 'color'">
            <span>{{item.name}}：</span>
            <el-color-picker class="centerItem" v-model="item.value" color-format="rgb" show-alpha></el-color-picker>
            <span></span>
        </div>

        <div v-if="item.type==='group'" class="subgroup">
            <el-divider>
                <p>{{ item.name }}</p>
            </el-divider>
            <div v-for="gitem,index in item.children" :key="index" class="subgroup-item">
                <span>{{gitem.name}}：</span>
                <el-slider
                    v-model="gitem.value"
                    :min="gitem.min"
                    :max="gitem.max"
                    :step="gitem.step"
                ></el-slider>
                <span v-if="gitem.showValue">{{gitem.value}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            default: {},
        },
        parentLabel: {
            type: String,
            default: '',
        },
    },
    watch: {
        item: {
            handler: function(n, v) {},
            immediate: true,
            deep: true,
        },
        valueItem(n, v) {
            // 数据变化，通知父组件合并数据
            this.$emit('change', n);
        },
    },
    computed: {
        // 正常的数据返回
        valueItem() {
            // 类似于颜色曲线
            if (this.item.type === 'group') {
                var obj = {};
                this.item.children.forEach(option => {
                    obj[option.label] = option.value;
                });
                return { [this.parentLabel]: obj };
                // 黑白高亮卷积
            } else if (this.item.ptype === 'compose') {
                return {
                    [this.item.parentLabel]: {
                        [this.item.label]: this.item.value,
                    },
                };
            } else {
                return {
                    [this.parentLabel]: { [this.item.label]: this.item.value },
                };
            }
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="scss" scoped>
.set-group {
    & > div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        // margin: 10px 0;
        // /deep/.el-slider {
        //     width: 160px;
        // }
        ::v-deep .el-slider {
            width: 160px;
        }
        span {
            margin: 0 10px;
        }
        span:first-child {
            width: 70px;
            text-align: right;
        }
        span:last-child {
            min-width: 40px;
            text-align: left;
        }
    }
    .centerItem {
        width: 160px;
    }
    .flexStart {
        align-items: flex-start;
    }
    .radioItem {
        width: 80px;
    }
    .subgroup {
        .subgroup-item {
            span {
                width: 54px;
            }
            display: flex;
            justify-content: center;
            align-items: center;
            // /deep/.el-slider {
            //     width: 140px;
            //     margin-right: 10px;
            // }
            ::v-deep .el-slider {
                width: 140px;
                margin-right: 10px;
            }
        }
    }
}
</style>