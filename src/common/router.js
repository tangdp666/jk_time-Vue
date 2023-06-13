import { createRouter, createWebHashHistory } from "vue-router";


let routes = [
    {
        path:"/login",
        component: () => import("../views/Login.vue")
    },
    {
        path:"/test",
        component: () => import("../views/Test.vue")
    },
    
    {
        path:"/index",
        component: () => import("../views/navigation/Index.vue"),
        children:[{
            path:"/index/home",
            component: () => import("../views/navigation/Home.vue")
        },
        {
            path:"/",
            component: () => import("../views/navigation/Home.vue")
        },
        {
            path:"/index/classify",
            component: () => import("../views/navigation/Classify.vue")
        },
        {
            path:"/index/userBlog",
            component: () => import("../views/navigation/UserBlog.vue")
        },
        {
            path:"/userInfo",
            component: () => import("../views/navigation/UserInfo.vue")
        },
        {
            path:"/detailBlog",
            component: () => import("../views/navigation/DetailBlog.vue")
        },
        {
            path:"/index/write",
            component: () => import("../views/navigation/Write.vue")
        },
        {
            path:"/index/updateUserBlog",
            component: () => import("../views/navigation/UpdateUserBlog.vue")
        },
        {
            path:"/index/updateUserInfo",
            component: () => import("../views/navigation/UpdateUserInfo.vue")
        }
    ]
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to,from,next) => {
    //获取存储的token
    let token = localStorage.getItem("token")
    //获取存储的token的开始时间
    const tokenStartTime = localStorage.getItem("tokenStartTime")
    //自定义过期时间
    const OverTime = 3 * 24 * 3600 * 1000
    //获取当前时间
    let date = new Date().getTime()
    //判断
    //时间大于则过期
    if(date - tokenStartTime > OverTime) {
          token = null
    }
    //token过期
    if(!token){
        if(to.path == "/login") return next()
        // console.log("请重新登录！")
        return next("/login")
    }else if (to.path == "/login") {
        //如果token没有过期，又选择了登录页面就直接重定向到首页，不需要重新输入账号密码
        return next("/")
    }
    next()
})
 



export { router, routes };