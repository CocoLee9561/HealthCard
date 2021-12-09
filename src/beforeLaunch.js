//文件初始化：开始
import "babel-polyfill"; //垫片，必须首先被加载，能解决较新的JS语言API的兼容问题
import './debug'
import '@common/extension/index';
import '@common/constant.scss'
import '@common/compatible/index';
import '@network/Http'


//文件初始化：结束



// FastClick : 开始

import FastClick from 'fastclick'
FastClick.attach(document.body)

// FastClick : 结束







// vue模块：开始
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueRouterExtendPlugin from '@tools/VueRouterExtendPlugin'

Vue.usePlugins([
    [VueRouterExtendPlugin, { VueRouter: VueRouter }]
]);

// vue模块：结束