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
                    @detail="detail"
                >
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
        <my-toast :config="config">
            <div style="padding:0 10px">
                <el-tabs type="border-card" v-model="active">
                    <el-tab-pane label="审批过程">
                        <div  class="myTable">
                            <el-table
                                :data="config.data"
                                style="width: 100%">
                                <el-table-column type="expand">
                                <template slot-scope="props">
                                        <!-- <span>{{ props.row.name }}</span> -->
                                        <div class="view">
                                            <h2>审批意见</h2>
                                            <ul v-if="props.row.comments.length>0">
                                                <li v-for="item in props.row.comments">
                                                    {{item}}
                                                </li>
                                            </ul>
                                            <div v-else>
                                                暂无相关审批意见
                                            </div>
                                        </div>
                                </template>
                                </el-table-column>
                                <el-table-column
                                label="任务节点"
                                prop="activityName">
                                </el-table-column>
                                <el-table-column
                                label="办理人"
                                prop="assignee">
                                </el-table-column>
                                <el-table-column
                                label="开始时间"
                                prop="startTime">
                                </el-table-column>
                                <el-table-column
                                label="结束时间"
                                prop="endTime">
                                </el-table-column>
                                <el-table-column
                                label="持续时间"
                                prop="duretion">
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="流程图">
                        <div  style="padding:20px;overflow: auto;">
                            <img :src="config.imgUrl" alt="">
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </my-toast>
    </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
    data(){
        return{
            active:0,
            type:'',
            selectData:[],
            title:'历史流程',
            searchValue:'',
            toolbarConfig:{
                custom:[
                    {
                        loading:false,
                        icon:'tickets',
                        method:'detail',
                        name:'详情'
                    }
                ],
                btnStatus:[true]
            },
            tableConfig:{
                //表格字段配置
                colConfig:[ 
                    {field:'name',label:'名称',type:'text'},
                    { field: "startUser", label: "申请人", type: "text"},
                    { field: "version", label: "流程版本", type: "text" },
                    
                    { field: "startTime", label: "创建时间", type: "text"},
                    { field: "duration", label: "用时", type: "text" },
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
            tableData:[
            ],
            config:{
                dialogVisible:false,
                title:'流程信息',
                width:'1000px',
                data:[],
                imgUrl:''
            }
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
        detail(){
            this.$http.get(
                this.ports+'/histories/process-instances/'+this.selectData[0].id,
                {procInsId:this.selectData[0].id},
                data=>{
                   this.config.data=data
                   this.$http.get(
                       this.ports+'/runtime/process-instances/images/'+this.selectData[0].id,
                       {procInsId:this.selectData[0].id},
                       data=>{
                           this.active='0'
                           this.config.imgUrl=data.img
                            this.config.dialogVisible=true
                       },
                       this
                   )
                   this.config.dialogVisible=true
                },
                this
            )
        },
        search(){
            this.tableConfig.pageNo=1
            this.tableConfig.pageSize=20
            this.getList()
        },
        handlerSelect(data){
            console.log(data)
            if(data.length==1){
                this.toolbarConfig.btnStatus=[false]
            }else{
                this.toolbarConfig.btnStatus=[true]
            }
            this.selectData=data
        },
        tableChange(){
            this.getList()
        },
        getList(){
            this.$http.get(
                this.ports+'/histories/process-instances',
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
    .model{
        .view{
            h2{
                font-size: 18px;
            }
            ul{
                padding-left: 30px;
                li{
                    height: 50px;
                    line-height: 50px;
                    padding-left: 10px;
                    border-bottom: 1px solid #e5e5e5;
                }
            }
            >div{
                height: 200px;
                text-align: center;
                line-height: 200px;
            }
        }
    }
</style>

