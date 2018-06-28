//首页
<template>
  <div>
    <page :pageData="pageData"></page>
  </div>
</template>
<script>
import {mapState} from 'vuex'
  export default {
    data() {
      return {
        pageData: {
          pocHeaderData: [],
          sidebarData: [{
            visible: true,
            title: 'OA管理系统',
            data: [
              // {
              //   name:'工作流',
              //   router:'workFlow',
              //   chlid:[
              //     {
              //       name:'模型管理',
              //       router:'model'
              //     },
              //     {
              //       name:'流程管理',
              //       router:'flow'
              //     },
              //     {
              //       name:'进行中的流程',
              //       router:'doing'
              //     },
              //     {
              //       name:'历史流程',
              //       router:'history'
              //     }
              //   ]
              // },
              // {
              //   name:'企业文库',
              //   router:'library',
              //   chlid:[
              //     {
              //       name:'文档库',
              //       router:'document'
              //     },{
              //       name:'空间管理',
              //       router:'spaceManage'
              //     }
              //   ]
              // },
              // {
              //   name:'企业问答',
              //   router:'interlocution',
              //   chlid:[
              //     {
              //       name:'分类管理',
              //       router:'sort'
              //     },
              //     {
              //       name:'敏感字管理',
              //       router:'sensitive'
              //     },
              //     {
              //       name:'问题审批',
              //       router:'approve'
              //     }
              //   ]
              // },
              // {
              //   name:'日志管理',
              //   router:'log',
              //   chlid:[
              //     {
              //       name:'文库日志',
              //       router:'docLog'
              //     }
              //   ]
              // }
            ]
          }]
        }
      }
    },
    computed:{
        ...mapState({
            flowPorts:'flowPorts',
            ports:'ports'
        })
    },
    created(){
      this.$http.get(
        this.ports+'/rights/menus',
        {},
        data=>{
          console.log(data,']]]]]]]][[[[[[[[[[[[[')
          if(data.length==0){
            this.$router.push({ path:'/err'})
          }else{
           this.pageData.sidebarData[0].data=data
            console.log(this.pageData.sidebarData)
            this.$router.push({ path:'/'+data[0].child[0].link})
            this.pageData.sidebarData[0].path=data[0].child[0].link
          }
        },
        this
      )
    }
  }

</script>
<style lang="less"></style>
