<template>
    <div class="collapse-container" style="padding:0 6px">
        <el-select
            v-model="addEffectValue"
            size="mini"
            @change="handleSelect"
            placeholder="请选择自定义滤镜"
        >
            <el-option
                v-for="item in effectList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
                :disabled="item.isSelected"
            ></el-option>
        </el-select>
        <el-collapse v-model="activeNames">
            <el-collapse-item
                v-for="setting in customEffectList"
                :name="setting.label"
                :key="setting.value"
            >
                <template slot="title">
                    <i
                        @click.stop="delThisConfig(setting.value,setting.label)"
                        class="el-icon-close"
                        style="margin-left:10px;margin-right:20px"
                    ></i>
                    {{setting.name}}
                </template>
                <div v-for="(item,index) in setting.children" :key="index">
                    <setGroup :item="item" :parentLabel="setting.label" @change="extendItemConfig"></setGroup>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
import setGroup from '@/components/global/library/setGroup';
import { CONFIGLIST, DEFAULTCONFIG } from '@/data/filterConfig';
import { deepCopy, $extend } from '@/utils/util';

export default {
    components: {
        setGroup,
    },
    props: {
        config: {
            type: Object,
            default: () => ({}),
        },
    },
    watch: {
        config: {
            handler(n, v) {
                if (JSON.stringify(n) !== '{}') {
                    this.customConfig = n;
                    this.recoverConfigPanel(n);
                }
            },
            immediate:true
        },
    },
    data() {
        return {
            activeNames: [], // 当前选中的滤镜名称
            customEffectList: [], // 当前选中滤镜的组件列表
            addEffectValue: '',
            effectList: CONFIGLIST, // 滤镜组件配置
            defaultConfig: DEFAULTCONFIG, // 滤镜默认配置
        };
    },
    created() {
        console.log('filterSettingCreated');
    },
    methods: {
        // 根据数据还原界面设置
        recoverConfigPanel(config) {
            // 清空设置界面列表
            this.customEffectList = [];
            // 遍历用户设置的配置，设置值与界面列表
            for (var option in config) {
                // ImageProcessingTexture 效果不处理
                if (option !== 'ImageProcessingTexture') {
                    // 获取当前值的json对象
                    var itemValue = config[option];

                    if (
                        option == 'blackAndWhite' ||
                        option == 'highlights' ||
                        option == 'convolution'
                    ) {
                        // 黑白高亮卷积
                        option = 'blackAndWhite,highlights,convolution';
                    } else if (option == 'ImageProcessingCurves') {
                    }
                    // 获取设置列表展示的数据源
                    var addItem = this.effectList.find(
                        item => item.label === option
                    );
                    addItem.isSelected = true;
                    var itemChildren = addItem.children || [];
                    // 给数据源列表的value赋值
                    itemChildren.forEach(i => {
                        if (i.type === 'group') {
                            i.children.forEach(ii => {
                                if (itemValue[ii.label] != null) {
                                    ii.value = itemValue[ii.label];
                                }
                            });
                        } else {
                            if (itemValue[i.label] != null) {
                                i.value = itemValue[i.label];
                            }
                        }
                    });
                    // 将要展示的数据放入对应的数组中
                    if (!this.customEffectList.includes(addItem)) {
                        this.customEffectList.unshift(addItem);
                    }
                }
            }
        },
        filterRender() {
            this.$emit('save', 'filter', deepCopy(this.customConfig));
        },
        handleSelect(item) {
            this.addEffectItem = this.effectList.find(i => i.value === item);
            this.addEffectItem.isSelected = true;
            this.addCustom();
        },
        // 添加一个设置到设置面板
        addCustom() {
            if (JSON.stringify(this.addEffectItem) !== '{}') {
                var item = deepCopy(this.addEffectItem);
                this.customEffectList.unshift(item);

                const label = item.label;

                // 默认为打开
                var addItemIndex = this.activeNames.findIndex(addItem => {
                    return addItem === label;
                });
                if (addItemIndex === -1) {
                    this.activeNames.push(label);
                }
                // 添加默认配置到用户配置
                const config = this.defaultConfig[label];
                this.customConfig = $extend(true, {}, this.customConfig, {
                    [label]: config,
                });
                // 渲染滤镜
                this.filterRender();
                // 清空选中
                this.addEffectValue = '';
                this.addEffectItem = {};
            } else {
                this.$message.warning('请选择要添加的效果');
            }
        },
        // 拓展用户自定义配置
        extendItemConfig(config) {
            // 拓展新的配置
            this.customConfig = $extend(true, {}, this.customConfig, config);
            this.filterRender();
            console.log('this.customConfig :', this.customConfig);
        },
        // 删除选中配置
        delThisConfig(value, label) {
            if (label.indexOf(',') === -1) {
                // 一般删除
                delete this.customConfig[label];
            } else {
                // 黑白删除
                var labels = label.split(',');
                labels.forEach(i => {
                    delete this.customConfig[i];
                });
            }
            // 列表中删除
            var delIndex = this.customEffectList.findIndex(item => {
                return item.value === value;
            });
            delIndex !== -1 && this.customEffectList.splice(delIndex, 1);
            // 数据中删除

            // 将原始数据的selected改为false
            let originItem = this.effectList.find(item => {
                return item.value === value;
            });
            if (originItem) originItem.isSelected = false;

            // 重新渲染滤镜
            this.filterRender();
            console.log('value :', value);
        },
    },
};
</script>