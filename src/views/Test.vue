<template>
    <div class="bontent">
      <div id="box" :class="navShow ? 'navOn' : 'navOff'">navBar内容,上拉显示navBar,下拉隐藏navBar,固定在顶部,样式切换</div>
      <div style="width: 80%;height: 2000px;background-color: aqua;">
      </div>
    </div>
  </template>
      
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
            console.log("向下滚动"); //显示
          } else {
            this.navShow = true;
            console.log("向上滚动"); //隐藏
          }
        }
      },
    },
}


  </script>
  
  <style>
  
  .navOn {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transition: all 0.2s ease-in-out 0.2s;
    transform: translateZ(0);
    width: 100%;
    height: 100px;
    border: 1px solid red;
    background: #fff;
    opacity: 1;
  }
  .navOff {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transition: all 0.2s ease-in-out 0.2s;
    transform: translate3d(0, -100%, 0);
    width: 100%;
    height: 100px;
    border: 1px solid red;
    background: #fff;
    opacity: 0;
  }
  
  .bontent {
    width: 100%;
    height: 5000px;
    background: pink;
  }
  </style>
  