<template>
  <view-box>
    <x-header slot="header" :left-options="{showBack:false}">消息</x-header>

    <!--<router-link :to="{name:'LogIn'}">登录</router-link>  <br/>-->

    <!--<label for="url">URL：</label> <input id="url" v-model="urStr" type="text"  />  <br/>-->

    <!--<button @click="navHandle">跳转到该URL</button>   <br/>-->
    <!--<button @click="loadURLHandle">load该URL</button>   <br/>-->
    <!--<button @click="creatURLHandle">创建该URL</button>   <br/>-->

    <div class="empty-page vux-center">
      <div style="text-align:center;">
        <img src="@icon/information@2x.png" width="50%" alt>
        <div style="color:#ccc">(暂无消息)</div>
      </div>
    </div>
  </view-box>
</template>

<script>
    export default {
        name: "Message",
      data:function(){
          return {
            urStr:""
          }
      },
      methods:{
          navHandle:function () {
            let urlStr = this.urStr ;
            let href = "" ;
            if (/^\w+:\/\//.test(urlStr)){
              href = urlStr ;
            }else {
              href = "http://" + this.urStr ;
            }

            window.location.href = href ;

            console.log("---跳转到:" + href);
          },

        loadURLHandle:function () {
          let urlStr = this.urStr ;
          let href = "" ;
          if (/^\w+:\/\//.test(urlStr)){
            href = urlStr ;
          }else {
            href = "http://" + this.urStr ;
          }


          let currWV = plus.webview.currentWebview();

          currWV.loadURL(href, {
            Referer:"gby.dyx.com://"
          });


        },
        creatURLHandle:function () {
          let urlStr = this.urStr ;
          let href = "" ;
          if (/^\w+:\/\//.test(urlStr)){
            href = urlStr ;
          }else {
            href = "http://" + this.urStr ;
          }


          let currWV = plus.webview.create(href,"gbyId",{
            additionalHttpHeaders:{
              Referer:"gby.dyx.com://"
            }
          });

          currWV.show();



        }
      }
    }
</script>

<style scoped>

</style>
