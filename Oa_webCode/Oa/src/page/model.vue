<template>
    <div class="model">
        <div class="doc-top">
            <el-select v-model="type" placeholder="请选择分类" clearable size="small">
               <el-option
                v-for="item in typeList"
                :key="item.procTypeKey"
                :label="item.procTypeName"
                :value="item.procTypeKey">
                </el-option>
            </el-select>
            <el-input placeholder="请输入模型名称" class="search" v-model="searchValue" size="small" style="width:240px;">
                <el-button slot="append" type="primary" @click="search">搜索</el-button>
            </el-input>
        </div>
        <div class="doc-content" >
            <div class="doc-content-title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item >{{title}}</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="doc-content-container no-scroll">
                <toolbar 
                    :toolbarConfig="toolbarConfig"
                    @design="design"
                    @deploy="deploy"
                    @see="see"
                    @export="handlerExport"
                >
                    <el-button icon="el-icon-plus"  size="mini" @click="add">新增</el-button>
                    <el-button icon="el-icon-edit"  size="mini" @click="edit" :disabled="selectData.length!=1">编辑</el-button>
                    <el-button icon="el-icon-delete"  size="mini" @click="del" :disabled="selectData.length<1">删除</el-button>
                </toolbar>
                <my-table 
                :config="tableConfig" 
                :data="tableData"
                @select="handlerSelect"
                @sizeChange="tableChange"
                @pageChange="tableChange">
                </my-table>
            </div>
        </div>
        <add-form :config="addFormConfig" :formData="addFormData" @addSuccess="addSuccess"></add-form>
        <my-toast :config="config" class="iframe-box">
            <iframe :src="url" frameborder="0" style="width:100%;height:100%"></iframe>
        </my-toast>
        <!-- <my-toast :config="xmlConfig" class="iframe-box">
            <div class="xmlBox">
                <img :src="xml">
            </div>
        </my-toast> -->
        <my-toast :config="xmlConfig" class="iframe-box">
            <div class="imgBox">
                <img :src="xmlConfig.data" style=""/>
            </div>
        </my-toast>
        <my-toast :config="deployConfig" @cancel="deployConfig.dialogVisible=false" @sure="sure">
            <el-row v-if="deployConfig.dialogVisible">
              <el-col :span="10">
                <div class="treeBox no-scroll">
                    <el-input
                        style="margin-bottom:10px;"
                        placeholder="输入关键字进行过滤"
                        size="mini"
                        v-model="filterText">
                    </el-input>
                    <el-tree
                        class="filter-tree"
                        :data="treeData"
                        :props="defaultProps"
                        check-strictly
                        default-expand-all
                        :filter-node-method="filterNode"
                        node-key="id"
                        highlight-current
                        :expand-on-click-node="false"
                        show-checkbox
                        @check-change="handlerCheck"
                        ref="tree"
                        @node-click="nodeClick">
                    </el-tree>
                </div> 
              </el-col>
              <el-col :span="13">
                    <div class="userList no-scroll">
                        <ul>
                            <li v-for="item in list" @click="liClick(item)" :class="{'select':selectUsers.findIndex(val=>val.id==item.id)>=0}"><span>{{item.name.slice(0,1)}}</span>{{item.name}}</li>
                        </ul>
                    </div>
              </el-col>
            </el-row>
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
            selectNode:null,
            relevance:true,
            isCheck:true,
            // 选中树节点的数组id
            arr:[],
            rules:{
                userId:rule.require('array')
            },
            list:[],//人员列表
            xml:'',
            url:'',
            type:'',
            selectData:[],
            title:'模型管理',
            searchValue:'',
            toolbarConfig:{
                custom:[
                    {
                        loading:false,
                        icon:'edit-outline',
                        method:'design',
                        name:'流程设计'
                    },
                    {
                        loading:false,
                        icon:'setting',
                        method:'deploy',
                        name:'部署'
                    },
                    {
                        loading:false,
                        icon:'view',
                        method:'see',
                        name:'预览'
                    },
                    {
                        loading:false,
                        icon:'upload2',
                        method:'export',
                        name:'导出'
                    }
                ],
                btnStatus:[true,true,true,true]
            },
            tableConfig:{
                //表格字段配置
                colConfig:[ { field: "name", label: "模型名称", type: "text"},
                    { field: "categoryName", label: "分类", type: "text"},
                    {field:'processName',label:"流程名称",type:"text"},
                    { field: "createTime", label: "创建时间", type: "text" },
                    { field: "lastUpdateTime", label: "更新时间", type: "text" },
                    { field: "version", label: "版本", type: "text" },
                ],
                isSelection:true,//是否可选
                isOrder:true,
                isPage:true,//是否分页
                align:'center',//文本对齐方式
                pageNo:1,
                pageSize:20,
                total:0,
                isHigh:false,
                isLoading:false,//是否开启loading
                loadShow:false,//loading控制
            },
            tableData:[],
            addFormConfig:{
                title:'新增模型',
                dialogVisible:false,
                width:'500px',
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
            addFormData:{},
            config:{
                fullscreen:true,
                dialogVisible:false,
                title:'流程设计'
            },
            xmlConfig:{
                 width:'1000px',
                dialogVisible:false,
                title:'预览界面',
                data:''
            },
            deployConfig:{
                width:'800px',
                dialogVisible:false,
                title:'请选择流程可申请人员',
                btnData:[{
                    name:'确定',//按钮名
                    method:'sure',//回调函数
                    type:'primary'
                },{
                    name:'取消',
                    method:'cancel',
                }]
            },
            deployFormData:{
                userId:[]
            },
            treeData:[],
            defaultProps:{
                label:'orgName',
                children:'orgs'
            },
            filterText:'',
            selectUsers:[]
        }
    },
    computed:{
        ...mapState({
            flowPorts:'flowPorts',
            ports:'ports',
            typeList:'typeList'
        })
    },
    methods:{
        // 过滤人员结构树
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
        add(){
            this.addFormConfig.dialogVisible=true
            this.addFormData={
                category:"", 
                name: "",
                processName: "", 
                description: "" ,
                id:0
            }
        },
        edit(){
            this.addFormConfig.dialogVisible=true
            console.log(this.selectData[0])
            this.addFormData=Object.assign({},this.selectData[0])
        },
        del(){
            this.$confirm('此操作将永久删除该模型, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var arr=[]
                for(let d of this.selectData){
                    arr.push(d.id)
                }
                this.$http.post(
                    this.flowPorts+'/models/deleteAll',
                    {ids:arr.join(',')},
                    data=>{
                        this.getList()
                    },
                    this
                )
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        search(){
            this.tableConfig.pageNo=1
            this.tableConfig.pageSize=20
            this.getList()
        },
        addSuccess(data){
            this.addFormConfig.dialogVisible=false
            // this.tableData.push(data)
            console.log(data)
            if(data.id==0){
                this.$http.post(
                    this.flowPorts+'/models/createModel',
                    data,
                    res=>{
                        this.getList()
                        this.$http.get(
                        this.flowPorts+'/procType/all',
                            {},
                            data=>{
                                console.log(data,'.................................')
                                this.$store.commit('setTypeList',data)
                            },
                            this
                        )
                    },
                    this
                )
            }else{
                var param=data
                param.modelId=param.id
                console.log(param,'========')
                this.$http.post(
                    this.flowPorts+'/models/editModel',
                    param,
                    res=>{
                        this.getList()
                        this.$http.get(
                        this.flowPorts+'/procType/all',
                            {},
                            data=>{
                                console.log(data,'.................................')
                                this.$store.commit('setTypeList',data)
                            },
                            this
                        )
                    },
                    this
                )
            }
            
        },
        design(){
            this.url=this.flowPorts+'/modeler.html?modelId='+this.selectData[0].id
            this.config.dialogVisible=true
        },
        deploy(){
            this.selectUsers=[]
            this.deployConfig.dialogVisible=true;
            this.deployFormData.userId=[]
            // this.$http.post(
            //     this.flowPorts+'/repository/deployments/deployment/'+this.selectData[0].id,
            //     {},
            //     data=>{
            //         this.$message({
            //         showClose: true,
            //         message: '部署成功',
            //         type: 'success'
            //         });
            //     },
            //     this
            // )
        },
        handlerCheck(data,isCheck,nodes){
            console.log(1)
            this.isCheck=isCheck
            if(isCheck){
                if(this.relevance){
                    this.arr=this.$refs.tree.getCheckedKeys()
                    if(data.orgs.length>0){
                        for(let d of data.orgs){
                            this.arr.push(d.id)
                        }
                        this.$refs.tree.setCheckedKeys(this.arr,true)
                    }
                    this.selectUsers=this.selectUsers.concat(data.users)
                    console.log(this.selectUsers)
                    if( this.selectUsers.length>0){
                        this.selectUsers=this.selectUsers.unique()
                    }
                }
                this.relevance=true
            }else{
                var index=this.arr.findIndex(val=>val==data.id)
                if(index>=0){
                    this.arr.splice(index,1)
                }
                if(this.relevance){
                    for(let d of data.users){
                        console.log(d,'-----------')
                        var index=this.selectUsers.findIndex(val=>val.id==d.id)
                        this.selectUsers.splice(index,1)
                    }
                }
                
            }
        },
        // check(data){
        //     console.log(this.isCheck)
        //     if(this.isCheck){
                
        //     }
            
        // },
        nodeClick(node){
            this.list=node.users
            this.selectNode=node
        },
        see(){
            this.$http.get(
                this.flowPorts+'/models/getpng/'+this.selectData[0].id,
                {},
                data=>{
                    console.log(data,'--')
                    this.xmlConfig.data=data.data
                    this.xmlConfig.dialogVisible=true
                },
                this
            )
        },
        handlerExport(){
            if (typeof (this.handlerExport.iframe) == "undefined") {
                var iframe = document.createElement("iframe");
                this.handlerExport.iframe = iframe;
                document.body.appendChild(this.handlerExport.iframe);
            }
                // alert(download_file.iframe);
            this.handlerExport.iframe.src =this.flowPorts+'/models/exportXml/'+this.selectData[0].id;

            this.handlerExport.iframe.style.display = "none";
        },
        handlerSelect(data){
            if(data.length==1){
                this.toolbarConfig.btnStatus=[false,false,false,false]
            }else{
                this.toolbarConfig.btnStatus=[true,true,true,true]
            }
            this.selectData=data
        },
        tableChange(){
            this.getList()
        },
        sure(){
            // if(this.selectUsers.length>0){
                var arr=[]
                for(let d of this.selectUsers){
                    arr.push(d.id)
                }
                this.$http.post(
                    this.flowPorts+'/repository/deployments/deployment/'+this.selectData[0].id,
                    {userIds:arr.join(',')},
                    data=>{
                        this.$message({
                        showClose: true,
                        message: '部署成功',
                        type: 'success'
                        });
                        this.deployConfig.dialogVisible=false
                    },
                    this
                )
            // }else{
            //     this.$message('请选择部署人员')
            // }
            
        },
        getList(){
            this.$http.get(
                this.flowPorts+'/models',
                {
                    pageNum:this.tableConfig.pageNo,
                    pageSize:this.tableConfig.pageSize,
                    keywords:this.searchValue,
                    category:this.type
                },
                data=>{
                    this.tableConfig.total=data.total
                    this.tableData=data.rows
                },
                this
            )
        },
        liClick(item){
            var index=this.selectUsers.findIndex(val=>val.id==item.id)
            if(index>=0){
                this.selectUsers.splice(index,1)
                var i=this.arr.findIndex(val=>val==this.selectNode.id)
                if(i>=0){
                     this.arr.splice(i,1)
                }
                this.relevance=false
                this.$refs.tree.setCheckedKeys(this.arr,true)
            }else{
                this.selectUsers.push(item)
                if(this.isContained(this.selectUsers,this.selectNode.users)){
                    this.arr.push(this.selectNode.id)
                    this.relevance=false
                    this.$refs.tree.setCheckedKeys(this.arr,true)
                }
            }
        },
        isContained (a, b){
          if(!(a instanceof Array) || !(b instanceof Array)) return false;
          if(a.length < b.length) return false;
          var aStr = a.toString();
          for(var i = 0, len = b.length; i < len; i++){
            if(aStr.indexOf(b[i]) == -1) return false;
          }
          return true;
        },
    },
    mounted(){
        this.getList()
        this.$http.get(
            this.flowPorts+'/orgs/users/tree',
            {},
            data=>{
                this.treeData=data
            },
            this
        )
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
    .model{
        .imgBox{
            position: relative;
            height: 500px;
            overflow:auto;
            img{
                position: absolute;
                left: 50%;
                top:50%;
                transform: translate(-50%,-50%)
            }
        }
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
        .treeBox{
            height:500px;
            overflow:auto;
            padding:20px;
        }
        .userList{
            height:500px;
            border-left:2px solid #E5E5E5;
            padding: 15px;
            ul{
                li{
                    padding-left:40px;
                    height:50px;
                    line-height:50px;
                    span{
                        display:inline-block;
                        height:40px;
                        line-height:40px;
                        width:40px;
                        border-radius:50%;
                        background:#409EFF;
                        color:#fff;
                        text-align:center;
                        margin-right:20px;
                    }
                    &.select{
                        background:#F6F6F6;
                    }
                }
            }
        }
    }
</style>
