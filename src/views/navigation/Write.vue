<template>
    <div class="writeCard">
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
                                    :include-level="[1, 4]"
                                    @upload-image="handleUploadImage"
                                    height="500px"></v-md-editor>
                </p>
            </n-list-item>
            <div class="postBut">
                <n-button class="postBlog" type="info" @click="postWrite()">发表</n-button>
                <n-button class="NoPostBlog"  type="error" @click="noPostWrite()">存草稿</n-button>
            </div>
          </n-list>
        </n-card>
    </div>
    <div class="writeBut">
        <n-card>
            <n-list>
            <n-list-item>
                <n-badge style=" width: 90%"  :value="blogInfo.count1">
                    <n-button style="width: 100%" @click="toNoPostBlog(1)">
                       草稿箱
                    </n-button>
                </n-badge>
            </n-list-item>
            <n-list-item>
                <div style="width: 90%;">
                <n-button @click="getGoBack()" style="width: 100%" type="info" ghost>
                 返回>
                </n-button>
             </div>
            </n-list-item>
            
            </n-list>
            
        </n-card>
    </div>
</template>
<script setup>

import { ref, reactive, inject, onMounted, computed } from 'vue'
import {UserStore} from "../../stores/UserStore"

import { EyeSharp } from "@vicons/ionicons5"

import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()



const axios = inject("axios")
const message = inject("message")
const dialog = inject("dialog")

const userStore = UserStore();

onMounted(() => {
    getUsernoPostWrite()
    getClassify()
})

const blogInfo = reactive({
    title:"",
    summary:"",
    content:"",
    categorty:"",
    count1:0
})

//分类选项
const categortyOptions = ref([])
//选中的分类
const selectedCategory = ref([])





const postWrite = async () => {
    dialog.warning({
        title: '提示',
        content: '是否要发布',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.post("/article/addArticle",{
                title:blogInfo.title,
                summary:blogInfo.summary,
                content:blogInfo.content,
                isTop:0,
                isComment:1,
                status:0,
                categoryId:selectedCategory.value
            })
            if(res.data.code == 200){
                message.success("发布成功！")
                router.push("/index/home")
            }else{
                message.error(res.data.msg)
            }
            console.log(res)
        },
        onNegativeClick: () => { }
    })
   
}

//草稿
const noPostWrite = async () => {
    dialog.warning({
        title: '提示',
        content: '是否存入草稿箱',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.post("/article/addArticle",{
                title:blogInfo.title,
                summary:blogInfo.summary,
                content:blogInfo.content,
                isTop:0,
                isComment:1,
                status:1,
                categoryId:selectedCategory.value
            })
            if(res.data.code == 200){
                message.success("保存成功！")
                router.push("/index/home")
            }else{
                message.error(res.data.msg)
            }
            console.log(res)
        },
        onNegativeClick: () => {}
    })
   
}


const handleUploadImage = async (event,insertImage,files) => {
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
    //   event.preventDefault()
      console.log(files[0]);
      let file = files[0]
      let formData = new FormData()
      formData.append('file', file)

    // let res = await axios.post("/article/upload",{
    //      img:formData
    // })
    console.log("图片"+JSON.stringify(formData))
      // 此处只做示例
    //   insertImage({
    //     url:
    //       'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
    //     desc: '七龙珠',
    //     // width: 'auto',
    //     // height: 'auto',
    //   });
    }


const getUsernoPostWrite = async () => {
    let res = await axios.get(`/article/userBlog/1`)
    let blog_res = res.data.data
    blogInfo.count1 = blog_res.length
} 

const toNoPostBlog = (status)=> {
    router.push({
        path:"/index/userBlog",
        query:{
            blogstatus:status
        }})
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
        margin-left: 25%;
    }
    .NoPostBlog{
        float: right;
        margin-right: 25%;
    }
    
</style>