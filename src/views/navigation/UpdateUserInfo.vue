<template>
    <div class="userinfo">
        <n-card>
            <h2>
                修改个人信息
            </h2>
            <template #footer >
            <n-list class="userInfoList">
                <n-list-item>
                    <div class="userInfoAvatar">
                        <n-avatar
                        round
                        :size="60"
                        :src="UpUserInfo.avatar"
                        />
                    </div>
                    
                </n-list-item>
                <n-list-item>
                    <span>昵称：</span>
                    <n-input v-model:value="UpUserInfo.nickName" type="text" placeholder="请输入..." />
                </n-list-item>
                <n-list-item>
                    <span>性别：</span>
                    <n-space vertical>
                        <n-select  v-model:value="selectedSex" :options="SexOptions"  />
                    </n-space>
                </n-list-item>
                <div class="removeBut">
                    <n-button type="info" @click="updateInfo()">
                       确认修改
                    </n-button>
                    <n-button @click="getGoBack()" style="float: right;margin-right: 45%;" type="info" ghost>取消修改</n-button>
                </div>
                <!-- <div style="float: right;">
                    
                </div> -->
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


const userInfo = ref({})



onMounted(() => {
    getUserInfo()
})

const UpUserInfo = reactive({
    id:0,
    nickName:"",
    email:"",
    avatar:""
})

//性别选项
const SexOptions = ref([
    {
        label:"男",
        value:"0"
    },{
        label:"女",
        value:"1"
    }
])


// 选中的性别
const selectedSex = ref([])



const getUserInfo = async () =>{
    let res = await axios.get("/user/userInfo")
    let info_res = res.data.data
    UpUserInfo.id = res.data.data.id
    UpUserInfo.nickName = res.data.data.nickName
    UpUserInfo.email = res.data.data.email
    UpUserInfo.avatar = res.data.data.avatar
    selectedSex.value = info_res.sex
}


const updateInfo = async () => {
    console.log(1)
    dialog.warning({
        title: '提示',
        content: '是否确认修改',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
            let res = await axios.put("/user/userInfo",{
                id:UpUserInfo.id,
                nickName:UpUserInfo.nickName,
                sex:selectedSex.value
            })
            if(res.data.code == 200){
                message.success("修改成功！")
                router.push("/userInfo")
            }else{
                message.error(res.data.msg)
            }
            // console.log(res)
        },
        onNegativeClick: () => { }
    })
   
}


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