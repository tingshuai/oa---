      /* toastData:{
          title:'啦啦啦',//弹窗标题
          dialogVisible:true,//弹窗显示
          width:'600px',//弹窗宽
          btnData:[{
            name:'确定',//按钮名
            method:'dialogSuer',//回调函数
            bgColor:'dialog-bule'//按钮背景
          },{
            name:'确定并继续',
            method:'savaAgain',
            bgColor:'dialog-deep-blue'
          }]
      }*/
<template>
    <el-dialog class="poc-toast" :title="config.title" :visible.sync="config.dialogVisible" :close-on-click-modal="false" :append-to-body="config.appendToBody" :width="config.width" @close="callBack('handleClose')" @open="callBack('handleOpen')">
        <!-- 内容   主题内容自定义部分-->
        <slot></slot>
        <!-- 按钮组 -->
        <div class="my-btn-group">
            <el-button class="dialog-white" v-for="item in config.btnData" :type="item.type" @click="callBack(item.method)">{{item.name}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
  props: ["config"],
  methods: {
    callBack(method) {
      this.$emit(method);
    }
  }
};
</script>
<style lang="less">
// @headerbgImage: linear-gradient(to right, #4a8dd2, #2acaff);
@headerbgColor:#F0EFF5;
.poc-toast {
  .el-dialog {
    border-radius: 0px;
    overflow: hidden;
  }
  .dialog-bule {
    background-color: #0ca8f1;
    color: #333333;
    padding: 10px 15px;
  }
  .dialog-deep-blue {
    background-color: #0c68f1;
    color: #333333;
    padding: 10px 15px;
  }
  .dialog-white {
    padding: 10px 15px;
  }
  .el-dialog__header {
    background-color: @headerbgColor;  
    // background-image: @headerbgImage;
    padding: 15px 10px;

    .el-dialog__title {
      color: #333333;
    }
  }
  .el-dialog__body {
    padding: 25px 0 0 0 !important;
  }
  .my-btn-group {
    text-align: center;
    // background-color: #eef1f5;
    padding: 5px 10px;
    margin-top: 20px;
    button{
      padding: 8px 35px;
    }
    margin-bottom: 20px;
  }
  .el-dialog__headerbtn .el-dialog__close{
    color: #333333;
  }
}
</style>
