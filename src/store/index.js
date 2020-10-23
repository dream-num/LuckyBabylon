/* eslint-disable no-console */
import Vue from 'vue';
import Vuex from 'vuex';

import master from './modules/master';


Vue.use(Vuex);

/**
 * 理解vuex
 * state 理解为数据定义
 * getters 理解为state的数据计算
 * actions 驱动数据变化，但是不直接改变数据
 * mutation 直接改变数据
 */
export default new Vuex.Store({
    modules: {
        master:master
    },
    state: {},
    mutations: {},
    actions: {},
    getters: {},
});
