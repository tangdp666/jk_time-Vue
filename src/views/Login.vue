<template>
    <div class="login-bg">
     <div class="login-content">
        <!-- <n-card style="padding: 0;"> -->
             <div class="login-lift">
                <!-- 切换按钮 -->
                <div class="logo">
                    <img src="../assets/img/login_logo.png" >
                </div>

                <n-button @click="changelogin()">
                    点击
                </n-button>

                <n-button @click="logout()">
                    点击2
                </n-button>
             </div>
             <div class="login-right">
                <div v-show="loginFlag.loginShow">
                 <!-- 登录表单 -->
                <div class="loginType">
                    <n-gradient-text type="info">登  录</n-gradient-text>
                </div>
                <div class="loginFrom">
                    <n-form :rules="rules" :model="admin">
                    <n-form-item path="account" label="账号">
                        <n-input v-model:value="admin.account" placeholder="请输入账号" />
                    </n-form-item>
                    <n-form-item path="password" label="密码">
                        <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" />
                    </n-form-item>
                </n-form>

                <n-checkbox v-model:checked="admin.rember" label="保持登录" />
                
                <n-button type="info" @click="login" class="loginBut">
                    登录
                </n-button>
                </div>
                </div>
                <!-- 注册 -->
                <div v-show="!loginFlag.loginShow">
                 <!-- 登录表单 -->
                <div class="loginType">
                    <n-gradient-text type="info">注  册</n-gradient-text>
                </div>
                <div class="loginFrom">
                    <n-form :rules="rules2" :model="admin2">
                        <n-form-item path="userEmail" label="邮箱">
                        <n-input v-model:value="admin2.userEmail" type="text" placeholder="请输入邮箱" />
                    </n-form-item>
                    <n-form-item path="account" label="账号">
                        <n-input v-model:value="admin2.account" placeholder="请输入账号" />
                    </n-form-item>
                    <n-form-item path="password" label="密码">
                        <n-input v-model:value="admin2.password" type="password" placeholder="请输入密码" />
                    </n-form-item>
                    <n-form-item path="rePassword" label="确认密码">
                        <n-input v-model:value="admin2.rePassword" type="password" placeholder="请输入确认密码" />
                    </n-form-item>
                </n-form>

                <!-- <n-checkbox v-model:checked="admin.rember" label="保持登录" /> -->
                
                <n-button type="info" @click="register()" class="loginBut">
                    注册
                </n-button>
                </div>
                </div>
             </div>
     </div>
    </div>
</template>
<script setup>
import { ref, reactive, inject, onMounted } from 'vue'
import {UserStore} from "../stores/UserStore"

// import Cookies from 'js-cookie'

import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()



const axios = inject("axios")
const message = inject("message")

const userStore = UserStore();

const loginFlag = reactive({
    loginShow: true,
})



/**用户登录数据 */
const admin = reactive({
    account: localStorage.getItem("account") ,
    password: localStorage.getItem("password"),
    rember: localStorage.getItem("rember") == 1 || false
})


/**用户注册数据 */
const admin2 = reactive({
    account: "",
    password: "",
    rePassword: "",
    userEmail: "",
})




/**验证表单规则 */
let rules = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 1, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 2, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
    ],
};

/**验证表单规则 */
let rules2 = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 1, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 2, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
    ],
    rePassword: [
        { required: true, message: "请输入确认密码", trigger: "blur" },
        { min: 2, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
    ],
};


const login = async () => {
    let result = await axios.post("/login",{
        username: admin.account,
        password: admin.password
    })
    console.log(result)
    if(result.data.code == 200){
        userStore.token = result.data.data.token;
        userStore.account = result.data.data.userInfo.nickName
        userStore.id = result.data.data.userInfo.id
        localStorage.setItem("token",result.data.data.token)
        localStorage.setItem("tokenStartTime",new Date().getTime())
        console.log(localStorage.getItem("tokenStartTime"))
        message.success("登录成功！")
        if(admin.rember == true) {
            localStorage.setItem("account",admin.account)
            localStorage.setItem("password",admin.password)
            localStorage.setItem("rember",admin.rember?1:0)
        }else{
            localStorage.setItem("account","")
            localStorage.setItem("password","")
            localStorage.setItem("rember",0)
        }
        router.push("/index/home")
    }else{
        message.error(result.data.msg)
    }
}

const changelogin = () => {
    loginFlag.loginShow = !loginFlag.loginShow
}




const register = async () => {
    if(admin2.password != "" &&  admin2.password == admin2.rePassword){
        let res = await axios.post("/user/register",{
        email:admin2.userEmail,
        password:admin2.password,
        userName:admin2.account
    })
        if(res.data.code == 200){
            message.success("注册成功！")
            admin2.userEmail = ""
            admin2.password = ""
            admin2.account = ""
            loginFlag.loginShow = true 
        }
        
    }else{
        message.error("两次密码不一致！")
    }
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

</script>
<style lang="scss" scoped>
.login-bg{
    background: url(../assets/img/login_bgImg.jpg) no-repeat;
    height: 100%;
    width: 100%;
    position:fixed;
    
}
.login-content{
    width: 650px;
    height: 400px;
    left: calc(50% - 325px);
    top: calc(50% - 200px);
    background-color: #fff;
    position: absolute;
}
.login-lift{
   float: left;
   width: 45%;
   height: 100%;
   border-right: 1px rgb(192, 192, 192) solid;

}
.login-right{
    float: right;
    width: 54%;
    height: 100%;
    display: inline-block;
}
.logo{
    width: 100%;
}
.logo img{
    width: 200px;
    margin: 50px;
}
.loginType{
    height: 75px;
    width: 100%;
}
.loginFrom{
    width: 90%;
    margin-left: 5%;
}
.loginBut{
    width: 100%;
}
.n-gradient-text {
  font-size: 25px;
  margin-left: calc(50% - 35px);
}

.fade-enter-active, .fade-leave-active {
	transition: opacity .25s
 }
 .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
	opacity: 0
} 

</style>