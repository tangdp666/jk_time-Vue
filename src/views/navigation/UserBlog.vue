<template>
    <div class="blogContent">
        <!-- 主体 -->
        <div >
            <div v-if="!userBlogCount.blogShowFlag" style="margin-top: 180px;">
                <n-result status="404" title="你还未发表任何博客">
                </n-result>
            </div>
            <div v-if="!userBlogCount.onPostBlogShowFlag" style="margin-top: 180px;">
                <n-result status="404" title="你还未发表任何博客">
                </n-result>
            </div>
            <!-- 内容 -->
            <div v-for="(blog, index) in blogListInfo" class="blogText">
                <!-- 标题 -->
                <n-ellipsis  style="max-width: 75%;font-size: 25px;">
                    {{ blog.title }}
                </n-ellipsis>
                <n-button type="error" class="delbut" size="small" round @click="deleteBlog(blog)">删除</n-button>
                <n-button type="error" class="delbut2" size="small" round @click="updateBlog(blog)">修改</n-button>
                <div class="blogTag">
                <p>{{ blog.createTime }}</p>
                </div>
                <div  style="margin-top: 30px;">
                    <n-ellipsis style="max-width: 90%;">
                     {{ blog.summary }}
                    </n-ellipsis>
                    <span v-if="userBlogCount.toDetailFlag" style="float: right;font-size: 10px;color: #9d9d9d;cursor: pointer;" @click="toDetail(blog)">阅读全文></span>
                </div>
            </div>
        </div>
        
    </div>

</template>
<script setup>
import { ref, reactive, inject, onMounted, watch } from 'vue'
import {UserStore} from "../../stores/UserStore"

import { EyeSharp } from "@vicons/ionicons5"

import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()



const axios = inject("axios")
const message = inject("message")
const dialog = inject("dialog")

const userStore = UserStore();
const blogListInfo = ref([])

onMounted(() => {
    loadBlogs()
});

const userBlogCount = reactive({
    blogShowFlag:true,
    onPostBlogShowFlag:true,
    toDetailFlag:true
})

const loadBlogs = async () => {
    let res = await axios.get(`/article/userBlog/${route.query.blogstatus}`)
    let bolg_res = res.data.data;
    console.log(res)
    // 处理获取的文章列表数据
    for (let row of bolg_res) {
        row.content += "..."
        // 把时间戳转换为年月日
        let d = new Date(row.createTime)
        row.createTime = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    console.log(bolg_res)
    blogListInfo.value = bolg_res;
    if(route.query.blogstatus == 1){
        userBlogCount.toDetailFlag = false
        if(blogListInfo.value.length == 0){
        userBlogCount.onPostBlogShowFlag = false
    }
    }else if(route.query.blogstatus == 0){
        if(blogListInfo.value.length == 0){
        userBlogCount.blogShowFlag = false
    }
    }

    
    
}

const deleteBlog = async (blog)=>  {
    dialog.warning({
        title: '警告',
        content: '是否要删除',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.delete(`/article/deleteArticle/${blog.id}`)
            if (res.data.code == 200) {
                loadBlogs()
                message.info(res.data.msg)
            } else {
                message.error(res.data.msg)
            }
        },
        onNegativeClick: () => { }
    })
}

const toDetail = (blog) => {
    router.push({
        path:"/detailBlog",
        query:{
            id:blog.id
        }
    })
}

const updateBlog = (blog) => {
    router.push({
        path:"/index/updateUserBlog",
        query:{
            id:blog.id
        }
    })
}

watch(() => route.query.blogstatus, () => {
    if(route.query.blogstatus){
        loadBlogs()
    }
})

</script>
<style>
    .blogContent{
        width: 50%;
        position: absolute;
        left: 25%;
        padding-bottom: 30px;
        min-height: 720px;
    }
    .blogText{
        width: 90%;
        border-radius:5px ;
        /* border: 1px black solid; */
        margin-bottom: 30px;
        padding: 20px;
        background-color: rgb(255, 255, 255);
        box-shadow: 2px 2px 5px #c9c9c9;
    }
    .blogTag{
        width: 100%;
    }
    .blogTag p{
        float: left;
        font-size: 5px;  
        color: #9d9d9d;
        
    }
    .delbut{
        float: right;
        margin-top: 13px;
    }
    .delbut2{
        float: right;
        margin-right: 15px;
        margin-top: 13px;
    }
</style>