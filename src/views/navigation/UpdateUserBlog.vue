<template>
    <div class="writeCard">
        <div style="float: right;margin-bottom: 20px;margin-right: 20px;">
            <n-button @click="getGoBack()" type="info" ghost>
            返回>
            </n-button>
             </div>
        <n-card>
          <n-list>
            <n-list-item>
                <span>标题：</span>
                <p>
                    <n-input v-model:value="blogInfo.title" type="text" placeholder="请输入..." />
                </p>
            </n-list-item>
            <n-list-item>
                <span>摘要：</span>
                <p>
                    <n-input v-model:value="blogInfo.summary" type="textarea" :autosize="{minRows: 2}" placeholder="请输入..."  />
                </p>
            </n-list-item>
            <n-list-item>
            <span>分类：</span>
            <p>
                <n-space vertical>
                        <n-select placeholder="请选择分类..." v-model:value="selectedCategory" :options="categortyOptions"  />
                </n-space>
            </p>
          </n-list-item>
            <n-list-item>
                <span>内容：</span>
                <p>
                    <v-md-editor    v-model="blogInfo.content"
                                    :autofocus="true"  
                                    :disabled-menus="[]"
                                    @upload-image="handleUploadImage"
                                    height="500px"></v-md-editor>
                </p>
            </n-list-item>
            <div class="postBut">
                <n-button class="postBlog" type="info" @click="updateBlog()">修改</n-button>
            </div>
          </n-list>
        </n-card>
    </div>
</template>
<script setup>

import { ref, reactive, inject, onMounted } from 'vue'
import {UserStore} from "../../stores/UserStore"

import { EyeSharp } from "@vicons/ionicons5"

import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()



const axios = inject("axios")
const message = inject("message")
const dialog = inject("dialog")

const userStore = UserStore();

const blogInfo = reactive({
    title:"",
    summary:"",
    content:"",
    categoryId:0,
})

onMounted(() => {
    getUpdateBlog()
    getClassify()
})

//分类选项
const categortyOptions = ref([])
//选中的分类
const selectedCategory = ref([])


const getUpdateBlog = async () => {
    let res = await axios.get(`/article/${route.query.id}`)
    blogInfo.title = res.data.data.title;
    blogInfo.summary = res.data.data.summary;
    blogInfo.content = res.data.data.content;
    selectedCategory.value = res.data.data.categoryId;
}


// const updateBlog = async () => {
//     let res = await axios.put("/article/updateArticle",{
//         id:route.query.id,
//         title:blogInfo.title,
//         summary:blogInfo.summary,
//         content:blogInfo.content
//     })
// }


const updateBlog = async () => {
    dialog.warning({
        title: '提示',
        content: '是否确认修改',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.put("/article/updateArticle",{
                id:route.query.id,
                title:blogInfo.title,
                summary:blogInfo.summary,
                content:blogInfo.content,
                categoryId:selectedCategory.value
            })
            if(res.data.code == 200){
                message.success("修改成功！")
                router.push({
                    path:"/index/userBlog",
                    query:{
                    blogstatus:0
                    }
                })
            }else{
                message.error(res.data.msg)
            }
            console.log(res)
        },
        onNegativeClick: () => { }
    })
   
}

const getClassify = async () => {
  let res = await axios.get("/category/getAllCategoryList")
  let category_res = res.data.data
  categortyOptions.value = category_res.map((item) => {
    return {
        label:item.name,
        value:item.id
    }
  })

}

const getGoBack = () => {
    router.back(1)
}



    
</script>
<style>
    .writeCard{
        width: 50%;
        position: absolute;
        left: 20%;
    }
    .writeBut{
        width: 15%;
        position: absolute;
        right: 14%;
    }
    .postBut{
        margin-top: 30px;
    }
    .postBlog{
        float: left;
        margin-left: 45%;
    }
    /* .NoPostBlog{
        float: right;
        margin-right: 49%;
    } */
    
</style>