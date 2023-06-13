<template>
    
    <div class="blogContent">
        <!-- 主体 -->
        <div >
            <!-- 内容 -->
            <div v-for="(blog, index) in blogListInfo" class="blogText">
                <!-- 标题 -->
                <n-ellipsis  style="max-width: 75%;font-size: 25px;">
                    {{ blog.title }}
                </n-ellipsis>
                <n-tag type="info" size="small" round >
                   {{ blog.categoryName }}
                </n-tag>
                <div class="blogTag">
                <p>{{ blog.createTime }}</p>
                <p style="margin-left: 20px;">
                    <n-icon :component="EyeSharp" size="12" :depth="3" />
                    {{ blog.viewCount }}
                </p>
                </div>
                <div  style="margin-top: 30px;">
                    <n-ellipsis style="max-width: 90%;">
                     {{ blog.summary }}
                    </n-ellipsis>
                    <span style="float: right;font-size: 10px;color: #9d9d9d;cursor: pointer;" @click="toDetail(blog)">阅读全文></span>
                </div>
            </div>
        </div>
        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" :page-slot="6" style="margin-left: 35%;position: absolute;margin-bottom: 20px;" />
    </div>

    <div>
        <n-back-top :bottom="100" :visibility-height="100">
            <div
            style="
                width: 100px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 14px;
            "
            >
            回到顶部
            </div>
        </n-back-top>
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

const userStore = UserStore();
const blogListInfo = ref([])

const pageInfo = reactive({
    page: 1,
    pageSize: 20,
    pageCount: 0,
    count: 0,
})

onMounted(() => {
    loadBlogs()
    // if (window.location.href.indexOf("#reloaded") == -1) {
    //     window.location.href = window.location.href + "#reloaded";
    //     window.location.reload();
    // }
});

// console.log("id"+route.params.id)

const loadBlogs = async (page = 0) => {
    if (page != 0) {
        pageInfo.page = page;
    }
    let res = await axios.get(`/article/articleList?pageNum=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${route.query.id}`)
    let bolg_res = res.data.data.rows;
    // 处理获取的文章列表数据
    for (let row of bolg_res) {
        row.content += "..."
        // 把时间戳转换为年月日
        let d = new Date(row.createTime)
        row.createTime = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
    }
    blogListInfo.value = bolg_res;
    pageInfo.count = res.data.data.total;
    //计算分页大小
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
    
}

const toDetail = async (blog) => {
    let res = await axios.put(`/article/updateViewCount/${blog.id}`)
    router.push({
        path:"/detailBlog",
        query:{
            id:blog.id
        }
    })
}

watch(() => route.query.id, () => {
    if(route.query.id){
        loadBlogs()
    }
})
</script>
<style>
    .blogContent{
        width: 50%;
        /* height: 100%; */
        position: absolute;
        left: 25%;
        /* background-color: aqua; */
        padding-bottom: 30px;
        min-height: 720px;
    }
    .blogText{
        width: 90%;
        /* height: px; */
        /* background-color: aquamarine; */
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
    .n-tag{
        float: right;
        margin-right: 15%;
        /* margin-left: 15px; */
        margin-top: 13px;
    }
</style>