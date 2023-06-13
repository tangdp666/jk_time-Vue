<template>
    <div class="userinfo">
        <n-card>
            <h2>
                个人信息
            </h2>
            <template #footer >
            <n-list class="userInfoList">
                <n-list-item>
                    <div class="userInfoAvatar">
                        <n-avatar
                        round
                        :size="60"
                        :src="userInfo.avatar"
                        />
                    </div>

                    <n-button @click="showModal = true">
                        修改头像
                    </n-button>
                    <n-modal v-model:show="showModal"
                        :mask-closable="false"
                        preset="dialog"
                        title="修改头像"
                        positive-text="确认"
                        negative-text="算了"
                        style="width: 700px"
                        @positive-click="onPositiveClick"
                        @negative-click="onNegativeClick">
                        <n-card
                        style="width: 600px"
                        :bordered="false"
                        size="huge"
                        role="dialog"
                        aria-modal="true"
                        >
                        <n-upload
                            
                            :default-file-list="previewFileList"
                            list-type="image-card"
                            @preview="handlePreview"
                        />
                        </n-card>
                    </n-modal>
                </n-list-item>
                <n-list-item>
                    <span>昵称：</span>
                    <span>{{ userInfo.nickName }}</span>
                </n-list-item>
                <n-list-item>
                    <span>邮箱：</span>
                    <span>{{ userInfo.email }}</span>
                </n-list-item>
                <n-list-item>
                    <span>性别：</span>
                    <span>{{ userSex.sex }}</span>
                </n-list-item>
                <div class="removeBut">
                    <n-button type="info" @click="toUpdateInfo()">
                       修改信息
                    </n-button>
                    <n-button @click="getGoBack()" style="float: right;margin-right: 45%;" type="info" ghost>返  回</n-button>
                </div>
            </n-list>
            </template>
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
//弹框显示
const showModal  = ref(false)

//上传图片显示
const showModalFile = ref(false);
//文件名
const previewImageUrlRef = ref("");

const userInfo = ref({})
const userSex = reactive({
    sex: ""
})

onMounted(() => {
    getUserInfo()
})




const getUserInfo = async () =>{
    let res = await axios.get("/user/userInfo")
    let info_res = res.data.data
    if (info_res.sex == "0") {
        userSex.sex = "男"
    }else if(info_res.sex == "1"){
        userSex.sex = "女"
    }
    userInfo.value = res.data.data
} 

const toUpdateInfo = () => {
    router.push("/index/updateUserInfo")
}

const onNegativeClick = () => {
    message.success("成功")
    showModal.value = false;
}
const onPositiveClick = () => {
    message.success("成功2")
    showModal.value = false;
}

const handlePreview = async (file) => {

    // let res = await axios.post("http://localhost:7777/upload",{
    //     img:file
    // })
    // console.log(res)
    // const { url } = file;
    // previewImageUrlRef.value = url 
    console.log("图片"+file)
}

// const uploadImg = async () => {
//     await axios.post("/upload")
// }
const uploadImg = axios.post("http://localhost:7777/upload")


const getGoBack = () => {
    router.back(1)
}

</script>
<style>
    .userinfo{
        width: 50%;
        position: absolute;
        left: 25%;
    }
    .userInfoAvatar{
        /* position: absolute; */
        margin-left: calc(50% - 30px);
    }
    .userInfoList .n-list-item{
        margin-left: 15%;
        margin-right: 15%;
    }
    .removeBut{
        margin-left: calc(35% - 40px);
        margin-top: 30px;
    }
</style>