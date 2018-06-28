<template>
    <div class="spaceManage">
        <div class="left orgTree">
            <div class="title">
                <span>组织架构</span>
                <el-input
                size="small"
                style="width:200px;margin-left:20px;"
                placeholder="输入关键字进行过滤"
                v-model="filterText">
                </el-input>
            </div>
            <el-tree
                ref="tree"
                :data="treeData"
                class="no-scroll"
                highlight-current
                :props="{label:'orgName',id:'id',children:'orgs'}"
                @node-click="nodeClick"
                :filter-node-method="filterNode"
                node-key="id"
                >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span><span class="titleName" >{{node.label.slice(0,1)}}</span>{{node.label }}</span>
                </span>
            </el-tree>
        </div>
        <div class="manList">
            <div class="title">
                <span>{{currentOrg}}</span>
            </div>
            <div class="userList">
                <ul v-if="userList.length>0">
                    <li v-for="(item,index) in userList" :class="{'active':enterData==item||selectData==item}" @mouseenter="enterData=item" @mouseleave="enterData=null" @click.stop.prevent="selectData=item">
                        <span class="left">{{item.userName}}</span>
                        <div class="right spare">
                            <span>空间容量 &nbsp;{{item.spaceInitSize}}M</span>
                            <div class="right" style="width:34px;">
                                <span style="margin:0 10px;cursor:pointer" @click="setSpare(item,index)" v-show="enterData==item||selectData==item">
                                    <i class="el-icon-edit"></i>
                                </span>
                            </div>
                            
                        </div>
                    </li>
                </ul>
                <div v-if="userList.length==0&&currentOrg!=''" style="height:100px;line-height:100px;text-align:center">
                    该组织下暂无人员信息
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
    .spaceManage{
        height: 100%;
        display: flex;
        .orgTree{
            display: flex;
            flex-direction: column;
            width: 400px;
            border-right: 1px solid #E5E5E5;
            height: 100%;
            border:#E5E5E5 1px solid;
            .title{
                height: 80px;
                // line-height: 80px;
                display: flex;
                align-items: center;
                font-size:18px;
                font-family:MicrosoftYaHei-Bold;
                color:rgba(51,51,51,1);
                padding-left: 32px;
                border-bottom: #E5E5E5 1px solid;
            }
            .el-tree{
                flex: 1;
                overflow: auto;
                .el-tree-node__content{
                    height: 48px;
                    .custom-tree-node{
                        height: 48px;
                        line-height: 48px;
                        width: 100%;
                        padding-right: 10px;
                        .titleName{
                            width: 32px;
                            height: 32px;
                            display: inline-block;
                            line-height: 32px;
                            text-align: center;
                            margin-right: 10px;
                            border-radius: 50%;
                            color: white;
                            background: #2A93FF;
                        }
                    }
                }
            }
        }
        .manList{
            flex:1;
            .title{
                height: 70px;
                // line-height: 80px;
                display: flex;
                align-items: center;
                font-size:18px;
                font-family:MicrosoftYaHei-Bold;
                color:rgba(51,51,51,1);
                padding-left: 32px;
            }
            .userList{
                margin: 10px;
                li{
                    height: 50px;
                    line-height: 50px;
                    padding-left: 30px;
                    .spare{
                        font-size:14px;
                        height: 50px;
                        line-height: 50px;
                        display: inline-block;
                        font-family:MicrosoftYaHei;
                        color:rgba(51,51,51,1);
                        line-height:40px;
                        span{
                            height: 50px;
                            line-height: 50px;
                        }
                    }
                    &.active{
                        background: #F4F4F4;
                    }
                }
            }
        }
    }
</style>
<script>
import {mapState} from 'vuex'
export default {
  data(){
      return{
          treeData:[],
          filterText:'',
          currentOrg:'',
          userList:[],
          enterData:null,
          selectData:null
      }
  },
  computed:{
      ...mapState({
          ports:'ports'
      })
  },
  methods:{
      setSpare(item,index){
          this.$prompt('请输入空间容量', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue:item.spaceInitSize,
                inputPattern: /^[0-9]*$/,
                inputErrorMessage: '请正确输入空间容量'
            }).then(({ value }) => {
                this.$http.post(
                    this.ports+'/libraries/spaces/'+item.id,
                    {
                        spaceSize:value
                    },
                    data=>{
                         this.userList[index].spaceInitSize=value
                        // this.userList.splice(index,1,data)
                    },
                    this
                )
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '取消输入'
            });       
            });
      },
      nodeClick(node){
          this.selectData=null
          this.currentOrg=node.orgName
          this.$http.get(
              this.ports+'/libraries/spaces/users',
              {orgId:node.id},
              data=>{
                console.log(data,'-------')
                this.userList=data.rows
              }
          )
          console.log(node)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.orgName.indexOf(value) !== -1;
      }
  },
  mounted(){
      this.$http.get(
          this.ports+'/orgs/tree',
          {},
          data=>{
              
              this.treeData=data
          },
          this
      )
  },
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
}
</script>

