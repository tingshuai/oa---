<template>
    <!-- 路由出口 -->
    <div class="app-view">
      <router-view></router-view>
      <!-- <loading v-show="getIsLoading"></loading> -->
    </div>
</template>
<script>
import { mapMutations,mapGetters } from "vuex";
export default {
  name: 'app',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations(["setUserImg", "setUserName",'setCompanyName','setCompanyEnglish','setCompanyLogo'])
  },
  props:['ports','flowPorts', "userName", "userImg","companyName","companyEnglish","companyLogo"],
  created(){
    this.$store.commit('set_ports',this.ports)
    this.$store.commit('set_flowPorts',this.flowPorts)
    this.$http.get(
       this.ports+'/users/online',
       {},
       data=>{
        console.log(data,'?????????')
        this.$store.commit('setCompanyId',data.companyId)
        this.$store.commit('setUserId',data.userId) 
        this.setUserImg(data.headImg);
        this.setUserName(data.nameCn);
        this.setCompanyName(data.companyName);
        this.setCompanyEnglish('');
        this.setCompanyLogo(data.logo);     
       },
       this
    )
    this.$router.push({ path:'/index'})
  },
  mounted(){
    // 请求人员列表
    this.$http.get(
        this.ports+'/users',
        {},
        data=>{
            this.$store.commit('setUserList',data.rows)
            // this.userList=data
        },
        this
    )
    this.$http.get(
      this.flowPorts+'/procType/all',
      {},
      data=>{
        this.$store.commit('setTypeList',data)
      },
      this
    )
  }
}
</script>
<style lang="less">
    .model{
        display: flex;
        flex-direction: column;
        height: 100%;
        .tags-content{
            >div{
                margin-right: 15px;
                float: left;
                position: relative;
                height: 20px;
                padding: 0px 10px;
                margin-bottom: 5px;
                font-size:14px;
                font-family:MicrosoftYaHei;
                &.noDefault{
                    color:rgba(42,147,255,1);
                }
                >i{
                    position: absolute;
                    top: 5px;
                    right: 0;
                    height: 14px;
                    cursor: pointer;
                }
            }
        }
        .doc-top{
            height: 40px;
            line-height: 40px;
            border-bottom: #E5E5E5 1px solid;
            padding: 20px;
            >button{
                margin-left: 24px;
            }
            .search {
                margin-left: 24px;
                .el-input-group__append{
                    background: #409eff;
                    border: none;
                    span{
                        color:#fff;
                    }
                }
            }
            img{
                margin: 0 10px 0 0px;
            }
            span{
                font-family:MicrosoftYaHei;
                color:rgba(51,51,51,1);
            }
        }
        .doc-content{
            flex:1;
            display: flex;
            flex-direction: column;
            padding: 0 32px;
            .doc-content-title{
                height: 60px;
                line-height: 60px;
                border-bottom:1px solid #EEEEEE;
                .el-breadcrumb{
                    height: 60px;
                    line-height: 60px;
                    font-size: 18px;
                }
            }
            .doc-content-container{
                flex:1;
                overflow: auto;
            }
        }
    }
</style>