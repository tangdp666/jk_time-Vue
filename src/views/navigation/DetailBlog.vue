<template>
    <div class="blogContent1">
        
        
        <n-card>
            <n-h1>{{ blogInfo.title }}</n-h1>
            <div style="float: right;margin-top: -70px">
            <n-button @click="getGoBack()" type="info" ghost>
            返回>
            </n-button>
             </div>
            <template #footer>
                <n-tag type="info" size="small" round >
                   {{blogInfo.categoryName}}
                </n-tag>
                <div class="blogTag1">
                <p>{{blogInfo.createTime}}</p>
                <p style="margin-left: 20px;">
                    <n-icon :component="EyeSharp" size="12" :depth="3"/>
                    {{blogInfo.viewCount}}
                </p>
                </div>
            </template>
            <template #action>
                <div class="blog-content" >
                    <v-md-preview :text="blogInfo.content" id="content"></v-md-preview>
                </div>
            </template>
        </n-card>
        <!-- 评论 -->
        <n-card style="margin-top: 30px;padding-bottom: 50px;">
            <div>
                <n-input-group>
                    <n-input v-model:value="commentCont.userComment" placeholder="请输入" >
                        <template #prefix>
                            <n-icon :component="PencilSharp" />
                        </template>
                    </n-input>
                    <n-button @click="blogCoumment()" type="primary" ghost>
                       评论
                    </n-button>
                </n-input-group>
            </div>
            <div v-if="!pageInfoComment.showFlag" style="margin-top: 30px;">
                <n-result status="418" title="一起来评论吧!" description="暂无评论">
                </n-result>
            </div>
            <template #footer>
                <n-list>
                    <div v-for="(comment, index) in blogComment ">
                        <n-list-item>
                            <div class="avatr">
                                <n-avatar
                                    round
                                    size="medium"
                                    src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" 
                                />
                            </div>
                            <div class="comment">
                                <p style="font-size: 10px;color: #9d9d9d;">
                                    {{comment.nickName}}
                                </p>
                                <p style="font-size: 10px;">
                                    {{comment.content}}
                                </p>
                                <p style="font-size: 6px;color: #9d9d9d;">
                                    <span>{{comment.createTime}}</span>
                                    <span style="margin-left: 20px;">
                                        <n-collapse arrow-placement="right">
                                            <n-collapse-item title="回复" name="{{ index }}">
                                                <div>
                                                    <n-input-group>
                                                        <n-input v-model:value="commentCont.viewComment" placeholder="请输入" >
                                                            <template #prefix>
                                                                <n-icon :component="PencilSharp" />
                                                            </template>
                                                        </n-input>
                                                        <n-button @click="blogViewCoumment(comment)" type="primary" ghost>
                                                        评论
                                                        </n-button>
                                                    </n-input-group>
                                                </div>
                                            </n-collapse-item>
                                        </n-collapse>
                                    </span>
                                </p>
                                <p>
                                    <n-list>
                                            <n-list-item v-for="(childrenCom, index) in blogComment[index].children">
                                                <!-- v-for="(childrenCom, index) in blogComment.children" -->
                                                <div class="avatr">
                                                    <n-avatar
                                                        round
                                                        size="small"
                                                        src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" 
                                                    />
                                                </div>
                                                <div class="comment">
                                                    <p style="font-size: 10px;color: #9d9d9d;">
                                                        {{ childrenCom.nickName }} 回复 {{ comment.nickName }}
                                                        <!-- {{childrenCom.nickName}} -->
                                                    </p>
                                                    <p style="font-size: 10px;">
                                                        {{ childrenCom.content }}
                                                    </p>
                                                    <p style="font-size: 6px;color: #9d9d9d;">
                                                        <span>{{childrenCom.createTime}}</span>
                                                        <span style="margin-left: 20px;">
                                                            <n-collapse arrow-placement="right">
                                                                <n-collapse-item title="回复" name="{{ index }}">
                                                                    <div>
                                                                        <n-input-group>
                                                                            <n-input v-model:value="commentCont.childrenComment" placeholder="请输入" >
                                                                                <template #prefix>
                                                                                    <n-icon :component="PencilSharp" />
                                                                                </template>
                                                                            </n-input>
                                                                            <n-button @click="blogChildrenCoumment(childrenCom)" type="primary" ghost>
                                                                            回复
                                                                            </n-button>
                                                                        </n-input-group>
                                                                    </div>
                                                                </n-collapse-item>
                                                            </n-collapse>
                                                            
                                                        </span>
                                                    </p>
                                                </div>
                                            </n-list-item>
                                    </n-list>
                                </p>
                            </div>
                        </n-list-item>
                    </div>
                </n-list>
                <n-pagination v-if="pageInfoComment.showFlag" @update:page="getBlogComment" v-model:page="pageInfoComment.page" :page-count="pageInfoComment.pageCount" :page-slot="6" style="margin-left: 35%;position: absolute;margin-bottom: 20px;" />
            </template>
        </n-card>
    </div>

    <!-- 目录 -->
    <div class="blog-toc">
        <n-card>
        <div class="part-title">
            <span>目录结构</span>
        </div>
        <div class="tov-list">
             <div v-if="tocArray.length == 0">
                暂无目录
             </div>
             <div v-else v-for="item in tocArray">
              <div :style="{'padding-left':((item.level - 1)*15+5)+'px'}" >
                <a :href="'#'+item.id">{{ item.title }}</a>
              </div>
             </div>
        </div>
        </n-card>
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
import { ref, reactive, inject, onMounted } from 'vue'
import {UserStore} from "../../stores/UserStore"
import { EyeSharp,PencilSharp } from "@vicons/ionicons5"
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()



const axios = inject("axios")
const message = inject("message")
const dialog = inject("dialog")

const userStore = UserStore();


const blogInfo = ref([])
const blogComment = ref({})
const commentCont = reactive({
    userComment:"",
    viewComment:"",
    childrenComment:"",

})

const pageInfoComment = reactive({
    page: 1,
    pageSize: 20,
    pageCount: 0,
    count: 0,
    showFlag:true
})

onMounted(() => {
    getBlogInfo()
    getBlogComment()
})


const getBlogInfo = async () => {
    let res = await axios.get(`/article/${route.query.id}`)
    blogInfo.value = res.data.data
    createToc()
}

const getBlogComment = async (page = 0) => {
    if (page != 0) {
        pageInfoComment.page = page;
    }
    let res = await axios.get(`/comment/commentList?articleId=${route.query.id}&pageNum=${pageInfoComment.page}&pageSize=${pageInfoComment.pageSize}`)
    blogComment.value = res.data.data.rows
    if( blogComment.value.length == 0){
        pageInfoComment.showFlag = false
    }
    pageInfoComment.count = res.data.data.total;
    //计算分页大小
    pageInfoComment.pageCount = parseInt(pageInfoComment.count / pageInfoComment.pageSize) + (pageInfoComment.count % pageInfoComment.pageSize > 0 ? 1 : 0)
}

const setCoumment = async (commentId, commentUserId,commentContent,rootId) => {
    let res = await axios.post("/comment",{
        articleId:route.query.id,
        type:0,
        toCommentId:commentId,
        toCommentUserId: commentUserId,
        content: commentContent,
        rootId: rootId
    })
    if(res.data.code == 200){
        message.success("评论成功！")
        getBlogComment()
    }else {
        message.error(res.data.msg)
    }
    
}

const blogCoumment = async () => {
    dialog.warning({
        title: '提示',
        content: '是否发布评论',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            setCoumment(-1, -1,commentCont.userComment,-1)
            commentCont.userComment = ""
        },
        onNegativeClick: () => { }
    })
}

const blogViewCoumment = async (comment) => {
    dialog.warning({
        title: '提示',
        content: '是否回复评论',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            setCoumment(comment.id, comment.createBy,commentCont.viewComment,comment.id)
            commentCont.viewComment = ""
        },
        onNegativeClick: () => { }
    })
}

const blogChildrenCoumment = async (c1) => {
    dialog.warning({
        title: '提示',
        content: '是否回复评论',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            setCoumment(c1.id, c1.createBy,commentCont.childrenComment,c1.rootId)
            commentCont.childrenComment = ""
        },
        onNegativeClick: () => { }
    })
}

//目录
const tocArray = ref([])
const createToc = () => {
    const tocTags = ["H1","H2","H3","H4","H5","H6"]
    let contentDom = document.querySelector(".vuepress-markdown-body")
    let childNodes1 = contentDom.childNodes
    let index = 0;
    console.log(childNodes1)

    let childArray = Array.from(childNodes1)

    console.log(childArray)
    var childList = Array.prototype.slice.call(childNodes1)
    childNodes1.forEach(item => {

        console.log("打印")
        let tagName = item.tagName;
        console.log(tagName)
        if(tagName == undefined){
           return true;
        }
        if(!tocTags.includes(tagName.toUpperCase())){
            return true;
        }
        index++;
        let id = "toc" + index;
        item.setAttribute("id",id);
        tocArray.value.push({
            id: id,
            title: item.innerText,
            level: Number.parseInt(tagName.substring(1))
        })
    })
}


const getGoBack = () => {
    router.back(1)
}


   
</script>
<style>
    .blogContent1{
        width: 55%;
        position: absolute;
        left: 15%;
    }
    .blogTag1{
        width: 100%;
    }
    .blogTag1 p{
        float: left;
        font-size: 5px;  
        color: #9d9d9d;
        
    }
    .n-tag{
        float: right;
        margin-right: 15%;
        /* margin-left: 15px; */
        /* margin-top: 13px; */
    }
    .avatr{
        float: left;
        width: 60px;
    }
    .comment{
        float: left;
        width: 90%;
        /* margin-left: 60px; */
    }
    .blog-content{
        max-width: 100% !important;
    }
    .blog-toc{
        position: absolute;
        /* float: right; */
        width: 17%;
        left: 71%;
    }
</style>