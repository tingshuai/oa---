<template>
    <div class="model">
        <div class="doc-top">
            <!-- <el-button  size="small" @click="select"><img src="../assets/img/1 (5).png" alt=""><span>选择分类</span></el-button> -->
            <el-select v-model="type" placeholder="请选择分类" clearable size="small">
               <el-option
                v-for="item in typeList"
                :key="item.procTypeKey"
                :label="item.procTypeName"
                :value="item.procTypeKey">
                </el-option>
            </el-select>
            <el-input placeholder="请输入内容" class="search" v-model="searchValue" size="small" style="width:240px;">
                <el-button slot="append" type="primary" @click="search">搜索</el-button>
            </el-input>
        </div>
        <div class="doc-content">
            <div class="doc-content-title">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item >{{title}}</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="doc-content-container no-scroll">
                <toolbar 
                    :toolbarConfig="toolbarConfig"
                    @map="map"
                    @download="download"
                    @hangUp="hangUp"
                >
                    <el-button icon="el-icon-delete" @click="del" size="mini" :disabled="selectData.length<1">删除</el-button>
                </toolbar>
                <my-table 
                :config="tableConfig" 
                :data="tableData"
                @select="handlerSelect"
                @sizeChange="tableChange"
                @btnClick="btnClick"
                @pageChange="tableChange">
                </my-table>
            </div>
        </div>
        <my-toast :config="config" class="iframe-box">
            <div class="xmlBox" v-if="config.type=='resourceName'">
                <div v-html="config.data"></div>
            </div>
            <div v-else class="imgBox">
                <img :src="config.data" style=""/>
            </div>
        </my-toast>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            type:'',
            selectData:[],
            title:'流程管理',
            searchValue:'',
            toolbarConfig:{
                custom:[
                    {
                        loading:false,
                        icon:'liuliangyingshe',
                        method:'map',
                        name:'映射',
                        isCustom:true
                    },
                    {
                        loading:false,
                        icon:'download',
                        method:'download',
                        name:'下载'
                    },
                    {
                        loading:false,
                        icon:'remove-outline',
                        method:'hangUp',
                        name:'挂起/激活'
                    }
                ],
                btnStatus:[true,true,true]
            },
            tableConfig:{
                //表格字段配置
                colConfig:[ 
                    {field:'name',label:'名称',type:'text'},
                    { field: "key", label: "流程定义", type: "text"},
                    { field: "version", label: "版本", type: "text" },
                    { field: "deployTime", label: "部署时间", type: "text" },
                    { field: "resourceName", label: "流程bpmn文件名称", type: "button"},
                    { field: "dgrmRsourceName", label: "流程图片名称", type: "button" },
                    { field: "suspensionStateName", label: "状态", type: "text" ,colorFun:(status)=>{
                        if(status=='已激活'){
                            return '#21C93D'
                        }else{
                            return '#999'
                        }
                    }},
                ],
                isSelection:true,//是否可选
                isOrder:true,
                isPage:true,//是否分页
                align:'center',//文本对齐方式
                pageNo:1,
                pageSize:20,
                total:100,
                isHigh:false,
                isLoading:false,//是否开启loading
                loadShow:false,//loading控制
            },
            tableData:[],
            config:{
                // fullscreen:true,
                dialogVisible:false,
                title:'预览界面',
                type:'',
                data:''
            }
        }
    },
    computed:{
        ...mapState({
            flowPorts:'flowPorts',
            typeList:'typeList'
        })
    },
    methods:{
        // 表格内文件点击事件
        btnClick(row,type){
            console.log(type)
            this.config.type=type
            if(type=='resourceName'){
                console.log(this.config.fullscreen)
                // this.config.fullscreen=true
                this.config.width = "85%"
                this.$http.post(
                    this.flowPorts+'/repository/process-definitions/goViewXml',
                    {deploymentId:row.deploymentId,fileName:row.resourceName},
                    data=>{
                         this.config.dialogVisible=true
                         console.log(data)
                        this.config.data='<xmp>'+data.code+'</xmp>'
                    },
                    this
                )
            }else{
                this.config.fullscreen=false
                this.config.width='1000px'
                this.$http.post(
                    this.flowPorts+'/repository/process-definitions/goViewPng',
                    {deploymentId:row.deploymentId,fileName:row[type]},
                    data=>{
                        this.config.dialogVisible=true
                        this.config.data=data.img
                    },
                    this
                )
            }
        },
        del(){
            this.$confirm('此操作将永久删除该流程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // modelId:this.selectData[0].id
                console.log(this.selectData)
                var arr=[]
                for(let d of this.selectData){
                    arr.push(d.deploymentId)
                }
                this.$http.post(
                    this.flowPorts+'/repository/process-definitions/deleteAll',
                    {deploymentIds:arr.join(',')},
                    data=>{
                        this.getList()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
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
        map(){
            this.$http.post(
                this.flowPorts+'/repository/process-definitions/mapToModel/'+this.selectData[0].id,
                {},
                data=>{
                    this.$message({
                    type: 'success',
                    message: '映射成功!'
                });
                },
                this
            )
        },
        download(){
            if (typeof (this.download.iframe) == "undefined") {
                var iframe = document.createElement("iframe");
                this.download.iframe = iframe;
                document.body.appendChild(this.download.iframe);
            }
                // alert(download_file.iframe);
            this.download.iframe.src =this.flowPorts+'/repository/process-definitions/download/'+this.selectData[0].deploymentId;
            console.log(this.download.iframe.src)

            this.download.iframe.style.display = "none";
        },
        hangUp(){
            var title='';
            var state=''
            console.log(this.selectData[0].suspensionState)
            if(this.selectData[0].suspensionState==1){
                title='是否挂起'
                state='suspend'
                
            }else{
                title='是否激活'
                state='active'
            }
            this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(
                    this.flowPorts+'/repository/process-definitions/changeState',
                    {state:state,processDefinitionId:this.selectData[0].id},
                    data=>{
                        this.getList()
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    },
                    this
                )
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });          
            });
        },
        search(){
            this.tableConfig.pageNo=1
            this.tableConfig.pageSize=20
            this.getList()
        },
        handlerSelect(data){
            console.log(data)
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
        getList(){
            this.$http.get(
                this.flowPorts+'/repository/process-definitions',
                {
                    pageNum:this.tableConfig.pageNo,
                    pageSize:this.tableConfig.pageSize,
                    keywords:this.searchValue,
                    category:this.type
                },
                data=>{
                    console.log(data,'-----------')
                    this.tableConfig.total=data.total
                    this.tableData=data.rows
                },
                this
            )
        }
    },
    mounted(){
        this.getList()
    },
    components:{
    }
}
</script>
<style lang="less">
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
</style>

