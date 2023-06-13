<template>
  <div>
    <div :class="navShow ? 'indexMuenOn' : 'indexMuenOff'">
          <div class="indexLogo">
                <!-- logo -->
                <img src="../../assets/img/红色logo1.png">
          </div>
          <div class="toLogin" v-if="!loginInfo.login">
            <div style="margin-right: 20px;cursor: pointer;">
              <n-button  strong secondary round type="info" @click="tologin()" >
                <n-icon :component="PowerOutline" size="20" color="#000" :depth="3" />
                前往登录
              </n-button>
            </div>
          </div>
          <div class="myInfo" v-if="loginInfo.login">
            <n-space align="flex-end">
            <div style="margin-top: -40px;margin-right: 20px;cursor: pointer;" >
              <n-button  strong secondary round type="info" @click="toWrite()">
                <n-icon :component="PencilSharp" size="20" color="#000" :depth="1" />
                写博客
              </n-button>
            </div>
        
            <n-popover trigger="hover">
            <template #trigger>
              <n-avatar
                round
                size="large"
                src="http://rrn7qpdnr.bkt.clouddn.com/2023/04/11/b4474883907f429a81935ca310d91eb6.png" 
            />
            </template>
            <n-list>
              <template #header>
              <span @click="getUserInfo()" style="cursor: pointer;">
                <n-icon :component="PersonOutline" size="15" color="#000" :depth="1" />
                我的信息
              </span>
              </template>
              <template #footer>
              <span @click="logout()" style="cursor: pointer;">
                <n-icon :component="PowerOutline" size="15" color="#000" :depth="1" />
                退出登录
              </span>
              </template>
            </n-list>
          </n-popover>
        </n-space>
      </div>
      <div  class="nav-title">
        <div @click="toHome()" style="cursor: pointer;">首页</div>
        <div style="cursor: pointer;">
          <n-popover trigger="hover">
            <template #trigger>
              分类
            </template>
            <n-list>
              <div v-for="(classify,index) in categortyOptions.value" style="margin-top: 10px;">
                  <span @click="toClassify(classify)" style="cursor: pointer;">
                {{ classify.name }}
              </span> 
              </div >
            </n-list>
          </n-popover>
        </div>
        <div @click="toMyBlog(0)" style="cursor: pointer;">我的博客</div>
      </div>

    </div>
    
    <div style="width:100%; margin-top: 150px;">
      
        <router-view>

        </router-view>        
    </div>
  </div>
    
</template>
<script setup>
import { ref, reactive, inject, h,onMounted} from 'vue'
import {UserStore} from "../../stores/UserStore"
import { NIcon, useMessage } from "naive-ui";
import { RouterLink } from "vue-router";
import { PencilSharp, PersonOutline,PowerOutline } from '@vicons/ionicons5'



import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()
const axios = inject("axios")
const message = inject("message")
const loginInfo = reactive({
   login: false,
})
const categortyOptions = reactive([])

const userStore = UserStore();
onMounted( () => {
  getUserToken()
  getClassify()
})

const getClassify = async () => {
  let res = await axios.get("/category/getCategoryList")
  let category_res = res.data.data
  categortyOptions.value = category_res
  // console.log("分类"+JSON.stringify(categortyOptions.value[0].name))
}






const toWrite = () => {
  router.push("/index/write")
}

const toHome = () => {
  router.push("/index/home")
}
const toMyBlog = (status) => {
  router.push({
    path:"/index/userBlog",
    query:{
      blogstatus:status
    }
  })
}
const toClassify = (classify) => {
  router.push({
    path:"/index/classify",
    query:{
      id:classify.id
    }
  })
}




const tologin = () => {
  router.push("/login")
}

const logout = async () => {
  let res = await axios.post("/logout")
  if( res.data.code == 200)  {
    message.success("退出成功！")
    userStore.token = ""
    localStorage.setItem("token","")
    router.push("/login")
  }
}

// const logout2 = () => {
//   localStorage.setItem("token","")
// }


const getUserToken = () => {
     if(localStorage.getItem("token") != ""){
      loginInfo.login = true
     }else{
      loginInfo.login = false
     }
     
}



const getUserInfo = () => {
  router.push("/userInfo")
}

// console.log("token:"+localStorage.getItem("token"))

</script>
<script>

  export default {
    // 获取top值
    data() {
      return {
        top: "",
        navShow: true,
      };
    },
  
    // 获取浏览器滚轮
    mounted() {
      window.addEventListener("scroll", () => {
        this.top =
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          window.pageYOffset;
      });
    },
  
    // 监听top值的变化
    watch: {
      top(newValue, oldValue) {
        // 等新值大于100的时候再做变化（优化一下）
        //   if (newValue > 100) {
        if (newValue > 1) {
          if (newValue > oldValue) {
            this.navShow = false;
            // console.log("向下滚动"); //显示
          } else {
            this.navShow = true;
            // console.log("向上滚动"); //隐藏
          }
        }
      },
    },
  };
  </script>
<style>
    .indexLogo{
      width: 10%;
      margin: 30px;
      color: #056de8;
      /* color: #ffffff; */
    }
    .indexLogo img{
      width: 100%;
    }
    .nav-title{
      position: absolute;
      float: right;
      right: 65%;
      top: 5%;
    }
    .myInfo{
      float: right;
      margin-top: -70px;
      margin-right: 70px;
    }
    .toLogin{
      float: right;
      margin-top: -70px;
      margin-right: 70px;
    }
    .nav-title{
      margin-top: 50px;
    }
    .nav-title div{
      float: left;
      margin-left: 40px;
      font-size: 18px;
    }
    /* .indexMuen{
      background-color: aqua;
      padding-top: 1px;
      padding-bottom: 1px;
    } */
    .indexMuenOn{
      z-index:100;
      width: 100%;
      height: 100px;
      position: fixed;
      background: rgb(255, 255, 255);
      top: 0;
      left: 0;
      right: 0;
      padding-top: 1px;
      padding-bottom: 1px;
      transition: all 0.1s ease-in-out 0.1s;
      transform: translateZ(0);
      opacity: 1;
      box-shadow: 2px 2px 5px #c9c9c9;
    }
    .indexMuenOff{
      z-index:100;
      width: 100%;
      height: 100px;
      position: fixed;
      background: rgb(255, 255, 255);
      top: 0;
      left: 0;
      right: 0;
      padding-top: 1px;
      padding-bottom: 1px;
      transition: all 0.1s ease-in-out 0.1s;
      transform: translate3d(0, -100%, 0);
      opacity: 0;
      box-shadow: 2px 2px 5px #c9c9c9;
    }
</style>