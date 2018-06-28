<template>
    <div class="model">
        <div class="doc-top">
            <!-- <el-button  size="small" @click="select"><img src="../assets/img/1 (5).png" alt=""><span>选择分类</span></el-button> -->
            <el-select v-model="type" placeholder="请选择操作类型" clearable size="small">
              <el-option v-for="(item,index) in typeList" :key="index" :label="item" :value="item"></el-option>
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
                <my-table 
                :config="tableConfig" 
                :data="tableData"
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
        	typeList:[],
            type:'',
            title:'文库日志',
            searchValue:'',
            tableConfig:{
                //表格字段配置
                colConfig:[ 
                    {field:'fileName',label:'文件名称',type:'text'},
                    { field: "userName", label: "用户名", type: "text"},
                    { field: "operationType", label: "操作类型", type: "text" },
                    { field: "operationTime", label: "操作时间", type: "text" },
                    { field: "operationStatus", label: "操作状态", type: "text"},
                    { field: "errorMsg", label: "错误信息", type: "button" ,btnData:'错误信息'}
                ],
                isSelection:false,//是否可选
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
                fullscreen:true,
                dialogVisible:false,
                title:'预览界面',
                type:'',
                data:''
            }
        }
    },
    computed:{
        ...mapState({
            flowPorts:'flowPorts'
        })
    },
    methods:{
    	btnClick(val,type){
    		console.log(val,type)
    		if(val[type]){
    			this.$alert(val[type], '错误信息', {
		          confirmButtonText: '确定'
		        });
    		}else{
    			this.$alert('无错误信息', '错误信息', {
		          confirmButtonText: '确定'
		        });
    		}
    		
    	},
        search(){
            this.tableConfig.pageNo=1
            this.tableConfig.pageSize=20
            this.getList()
        },
        tableChange(){
            this.getList()
        },
        getList(){
            this.$http.get(
                this.flowPorts+'/libraries/logs',
                {
                    pageNum:this.tableConfig.pageNo,
                    pageSize:this.tableConfig.pageSize,
                    keywords:this.searchValue,
                    operationType:this.type
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
        this.$http.get(
        	this.flowPorts+'/libraries/logs/operation/types',
        	{},
        	data=>{
        		this.typeList=data
        	},
        	this
        )
    },
    components:{
    }
}
</script>
<style lang="less">
    .imgBox{
        position: relative;
        height: 500px;
        img{
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate(-50%,-50%)
        }
    }
</style>

