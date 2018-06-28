<template>
    <div class="adminSet">
        <div class="doc-top">
            <el-button  @click="addAdmin" size="small">添加管理员</el-button>
        </div>
        <div class="doc-content" >
            <div class="doc-content-title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item >{{title}}</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="doc-content-container no-scroll">
                <div class="doc-content-list">
                    <div class="list-item" @mouseenter="enterData=item" @mouseleave="enterData=null" :class="{selected:item==enterData||item==selectData}"  @click.stop.prevent="select(item)" v-for="(item,index) in list">
                        <div class="list-item-icon">
                            <span>{{item.name.slice(1)}}</span>
                        </div>
                        <div class="list-item-name"><span style="cursor:pointer"  class="text">{{item.name}}</span></div>
                        <div class="list-item-menu">
                            {{item.roleNames}}
                        </div>
                        <div class="list-item-date">
                            <el-button type="text" @click="edit(item,index)">编辑</el-button>
                            <el-button type="text" @click="del(item,index)">删除</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <my-toast :config="config" @cancel="config.dialogVisible=false" @sure="sure">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
                <el-form-item label="管理员" prop="userId">
                    <el-select filterable  v-model="formData.userId"  placeholder="请选择" :disabled="this.type=='edit'">
                        <el-option
                        v-for="item in userList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限选择" prop="roleIds">
                    <el-select filterable  v-model="formData.roleIds" multiple placeholder="请选择">
                        <el-option
                        v-for="item in powerList"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </my-toast>
    </div>
</template>
<script>
//{modelId}
import addForm from '../component/model/addForm.vue'
import rule from '../assets/js/rule.js'
import {mapState} from 'vuex'
export default {
    data(){
        return{ 
            rules:{
                userId:rule.require(),
                roleIds:rule.require('array')
            },   
            title:'管理员配置',
            config:{
                width:'400px',
                dialogVisible:false,
                title:'管理员配置',
                btnData:[{
                    name:'确定',//按钮名
                    method:'sure',//回调函数
                    type:'primary'
                },{
                    name:'取消',
                    method:'cancel',
                }]
            },
            formData:{
                userId:'',
                roleIds:[]
            },
            list:[],
            enterData:null,
            selectData:null,
            canHttp:true,
            currentPage:1,
            powerList:[],
            type:'add',
            selectIndex:-1
        }
    },
    computed:{
        ...mapState({
            flowPorts:'flowPorts',
            ports:'ports',
            userList:'userList'
        })
    },
    methods:{
        edit(item,index){
            this.type="edit"
            this.formData={
                userId:item.userId,
                roleIds:item.roles
            }
            this.selectIndex=index
            this.config.dialogVisible=true
        },
        del(item,index){
            this.$confirm('是否确认删除操作', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(
                        this.ports+'/rights/delete/'+item.userId,
                        {},
                        data=>{
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.list.splice(index,1)
                        },
                        this
                    )
                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                });          
            });
        },
        addAdmin(){
            this.type="add"
            this.formData={
                userId:'',
                roleIds:[]
            }
            this.config.dialogVisible=true
        },
        getList(callback){
            this.$http.get(
                this.ports+'/rights',
                {pageSize:10,pageNum:this.currentPage},
                data=>{
                    callback(data)
                },
                this
            )
        },
        sure(){
            // formData
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    this.$http.post(
                        this.ports+'/rights',
                        {roleIds:this.formData.roleIds.join(','),userId:this.formData.userId},
                        data=>{
                            if(this.type=='add'){
                                this.currentPage=1
                                this.$message.info('操作成功')
                                this.config.dialogVisible=false
                                this.getList(data=>{
                                    this.list=data.rows
                                })
                            }else{
                                console.log(data)
                                this.$set(this.list,this.selectIndex,data)
                                this.$message.info('操作成功')
                                this.config.dialogVisible=false
                            }
                        },
                        this
                    )
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        select(item){
            this.selectData=item
        },
    },
    mounted(){
        this.getList(data=>{
            this.list=data.rows
        })
        this.$http.get(
            this.ports+'/rights/roles',
            {},
            data=>{
                this.powerList=data
            },
            this
        )
        $('.doc-content-container').scroll(function(){
            var $this =$(this),  
            viewH =$(this).height(),//可见高度  
            contentH =$(this).get(0).scrollHeight,//内容高度  
            scrollTop =$(this).scrollTop();//滚动高度   
            if(scrollTop/(contentH -viewH)>=0.98){   
                if(self.canHttp){
                    self.canHttp=false;
                    self.currentPage++;
                    self.getList(data=>{
                        if(data.rows.length>0){
                            self.list= self.list.concat(data.rows);
                            self.canHttp=true;
                        }else{
                            self.$messge.info('已加载全部');
                        }
                    })
                }
            }  
        })
    },
    components:{
        addForm
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
}
</script>
<style lang="less">
    .adminSet{
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
                .doc-content-list{
                    .list-item{
                        &.selected{
                            background: #F6F6F6;
                        }
                        height: 60px;
                        border-bottom:1px solid #EEEEEE;
                        display: flex;
                        .list-item-icon{
                            width: 50px;
                            height: 60px;
                            display: flex;
                            align-items: center;
                            margin-left: 10px;
                            >span{
                                width: 40px;
                                height: 40px;
                                display: block;
                                background: #2A93FF;
                                border-radius: 50%;
                                font-size:15px;
                                font-family:MicrosoftYaHei;
                                color:rgba(255,255,255,1);
                                text-align: center;
                                line-height: 40px;
                            }
                        }
                        .list-item-name{
                            width: 300px;
                            font-family:MicrosoftYaHei;
                            font-size:14px;
                            color:rgba(51,51,51,1);
                            line-height:60px;
                            height: 60px;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            .editText{
                                display: none;
                            }
                            .text{
                                display: inline;
                            }
                        }
                        .list-item-menu{
                            flex:1;
                            line-height:60px;
                            font-size:14px;
                            font-family:MicrosoftYaHei;
                            color:rgba(51,51,51,1);
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .list-item-date{
                            padding-right: 30px;
                            line-height:60px;
                            font-size:14px;
                            font-family:ArialMT;
                            color:rgba(153,153,153,1);
                            line-height:64px;
                        }
                    }
                }
            }
        }
    }
</style>
