<template>
    <div class="sort">
        <div class="doc-top">
            <el-button  size="small" @click="create"><img src="../assets/img/1 (5).png" alt=""><span>创建分类</span></el-button>
            <el-input placeholder="请输入内容" class="search" v-model="searchValue" size="small" style="width:240px;">
                <el-button slot="append" type="primary">搜索</el-button>
            </el-input>
        </div>
        <div class="doc-content">
            <div class="doc-content-title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="item in titles"><a @click="goTo(item.id)">{{item.name}}</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="doc-content-container">
                <list 
                :datas="datas" 
                :config="listConfig" 
                :btns="btns" 
                @del="del" 
                @manage="manage" 
                @scrollBottomEvent="scrollBottomEvent"
                :props="{label:'fileName'}"
                ></list>
            </div>
        </div>
        <create-form :config="createConfig" :formData="createFormData" :disabled="createConfig.disabled"></create-form>
    </div>
</template>
<script>
import list from '../component/common/list.vue'
import createForm from '../component/document/cearteForm.vue'
export default {
    data(){
        return{
           searchValue:'',
           titles:[{
               name:'分类管理',
               id:0
           }],
           datas:[],
           listConfig:{
               currentPage:1,
               canHttp:true,
               titleImg:'./src/assets/img/1.png'
           },
           btns:[
               {imgUrl:'./src/assets/img/1 (6).png',method:'del'},
               {imgUrl:'./src/assets/img/2.png',method:'manage'}
           ],
           createConfig:{
               title:'管理员设定',
               dialogVisible:false,
               width:'384px',
               disabled:false,
               btnData:[
                   {
                       type:'primary',
                       method:'submit',
                       name:'确定',

                   },
                    {
                       type:'',
                       method:'cancel',
                       name:'取消',

                   }
               ]
           },
           createFormData:{
               name:'',
               adminId:''
           }
        }
    },
    methods:{
        scrollBottomEvent(){
            this.getList((data)=>{
                this.listConfig.canHttp=true
                this.datas=this.datas.concat(data.rows)
            })
        },
        create(){
            this.createConfig.dialogVisible=true
             this.createConfig.disabled=false
            this.createFormData={
               name:'',
               adminId:''
           }
        },
        manage(item){
            this.createConfig.dialogVisible=true
            this.createConfig.disabled=true
            this.createFormData={
                name:item.fileName,
                adminId:''
            }
        },
        del(data,index){
            this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.datas.splice(index,1)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                });          
            });
        },
        getList(callback){
            this.$http.post(
                '/test/getSortList',
                {},
                data=>{
                    callback(data)
                }
            )
        }
    },
    components:{
        list,
        createForm
    },
    mounted(){
        this.getList((data)=>{
            this.datas=data.rows
        })
    }
}
</script>

<style lang="less">
    .sort{
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
