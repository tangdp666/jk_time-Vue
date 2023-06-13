import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from "./common/router"
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { createPinia } from  "pinia";
import axios  from 'axios'
import {UserStore} from "./stores/UserStore"

// makedown预览组件以及样式
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';

import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css';
//VuePress主题以及样式
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
// 快速复制代码
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// emoji
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';



//Prism
import Prism from "prismjs";
//代码高亮
import 'prismjs/components/prism-json';
// 显示代码行数
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// highlightjs
import hljs from 'highlight.js';

//选择使用主题
VMdPreview.use(vuepressTheme, {
                Prism,
               })
          .use(createLineNumbertPlugin())
          .use(createCopyCodePlugin())
          .use(createEmojiPlugin())

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});          


/**
 * axios
 * pinia
 * sass
 * vue-router
 * naive-ui
 * wangeditor
 */
axios.defaults.baseURL = "http://localhost:7777"
const { message, notifcation, dialog } = createDiscreteApi(["message", "notifcation", "dialog"])


createApp(App)
    .use(naive)
    .use(createPinia())
    .use(router)
    .use(VMdEditor)
    .use(VMdPreview)
    .provide("axios",axios)
    .provide("message",message)
    .provide("notifcation",notifcation)
    .provide("dialog",dialog)
    .mount('#app')

    const userStore = UserStore()
    // axios拦截器
    axios.interceptors.request.use((config) => {
        //每次请求都在headers中添加token
        let token = localStorage.getItem("token")
        if (token) {
          config.headers.token = `${token}`
        }
        return config
    },err => {
      return Promise.reject(err);
    })
