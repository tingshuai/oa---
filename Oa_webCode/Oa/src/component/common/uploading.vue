<template>
    <div class="uploading" style="position:fixed" v-if="isShow">
        <div class="loading-icon">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1525683179136&di=5597e036e7c7b6a511600da1d0e83071&imgtype=0&src=http%3A%2F%2Fwww.zcool.com.cn%2Fcommunity%2F037abb4561877eb6ac7255b14907606.gif" alt="上传中">
            <p>上传中<span v-for="i in num">.</span></p>
        </div>
    </div>
</template>
<script>
export default {
  props:['isFixed','isShow'],
  data(){
      return{
          num:1
      }
  },
  mounted(){
      setInterval(()=>{
            this.num++
            if(this.num>6){
                this.num=1
            }
      },1000)
  }
}
</script>

<style lang="less">
    .uploading{
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, .6);
        z-index: 1;
        .loading-icon{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 200px;
        height: 200px;
        transform: translate(-50%,-50%);
        text-align: center;
        p{
            font-size: 16px;
            font-weight: 900;
        }
        img{
            width: 100%;
            height: 100%;
        }
    }
}
</style>

