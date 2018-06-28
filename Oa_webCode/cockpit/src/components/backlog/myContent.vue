<template>
    <div class="backlog-content">
        <div class="con-top">
            <div class="left">
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        分类<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                         <el-dropdown-item  :command="null">全部</el-dropdown-item>
                        <el-dropdown-item v-for="item in typeList" :command="item.procTypeKey">{{item.procTypeName}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="right ">
                <el-button icon="el-icon-plus" @click="handlerClick" size="mini">流程申请</el-button>
            </div>
        </div>
        <div class="con-container">
            <div class="middle_center" v-for="item in list" >
                <div class="center_top">
                    <div class="center_left">
                    <div class="circle">{{item.assignee.slice(1,3)}}</div>
                    <p>{{item.proInsDefName}}</p>
                    </div>
                    <div class="center_right" :style="{'color':color,'border':'1px solid '+color}" @click="handler(item)">
                        <div >
                            {{text}}
                        </div>
                    </div>
                    <div class="center_right" v-if="type=='todo'" style="border:1px solid #909399;color:#909399" @click="giveOther(item)">
                        <div >
                            托办任务
                        </div>
                    </div>
                    <div class="center_right" v-if="type=='todo'&&item.claim" style="border:1px solid #67c23a;color:#67c23a;" @click="unClaim(item)">
                        <div >
                            反签收
                        </div>
                    </div>
                    
                </div>
                <div class="center_text">
                    <h1>{{item.name}}</h1>
                    <p>描 述：{{item.description?item.description:'暂无相关描述'}}</p>
                </div>
                <div class="center_bottom">
                    <div class="bottom_left">
                    <!-- <h1>流程名称</h1>
                    <p>{{item.proInsDefName}}</p> -->
                    </div>
                    <div class="bottom_right">
                    <p>{{item.startTime}}</p>
                    </div>
                </div>
            </div>
            <div style="text-align:center;background:#fff;padding:10px 0">
                <el-pagination
                    background
                    @current-change="currentChange"
                    layout="prev, pager, next"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <my-toast :config="config" @submit="submit" @cancel="cancel" @handleClose="handleClose">
            <div style="margin-right:20px;">
                <el-form :model="formData" ref="formData" label-width="100px" class="demo-formData">
                     <el-row>
                        <el-col :span="12">
                            <el-form-item label="任务名称">
                                <el-input v-model="formData.taskName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="申请人">
                                <el-input v-model="formData.startUser" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="上级留言:">
                                <div v-if="formData.comments.length>0">
                                    <p v-for="item in formData.comments">{{item}}</p>
                                </div>
                                <div v-else>
                                    <p>无上级留言</p>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-for="item in formConfig">
                            <el-form-item :label="item.name" :prop="item.id"  v-if="item.readable" :rules="[{ required: item.required, message: '此项为必填项', trigger: 'blur' }]">
                                <el-input v-if="item.type=='string'" v-model="formData[item.id]" placeholder="" :disabled="!item.writable"></el-input>
                                <el-switch
                                    v-if="item.type=='boolean'"
                                    v-model="formData[item.id]"
                                    active-color="#13ce66"
                                    :disabled="!item.writable"
                                    inactive-color="#ff4949">
                                </el-switch>
                                <el-select :disabled="!item.writable" v-if="item.type=='enum'" v-model="formData[item.id]" placeholder="">
                                  <el-option v-for="val in item.items" :label="val.value" :value="val.value" :key="val.value"></el-option>
                                </el-select>
                                <el-date-picker
                                  :disabled="!item.writable"
                                  v-if="item.type=='date'"
                                  v-model="formData[item.id]"
                                  type="date"
                                  placeholder="选择日期"
                                  format="yyyy 年 MM 月 dd 日"
                                  :value-format="item.datePattern">
                                </el-date-picker>
                                <el-input-number :disabled="!item.writable" v-if="item.type=='long'" v-model="formData[item.id]"></el-input-number>
                            </el-form-item>
                            <el-form-item :label="item.name" :prop="item.id" v-for="item in startFormConfig">
                                <el-input v-if="item.type=='string'" v-model="startForm[item.id]" placeholder="" disabled></el-input>
                                <el-switch
                                    v-if="item.type=='boolean'"
                                    v-model="startForm[item.id]"
                                    active-color="#13ce66"
                                    :disabled="!item.writable"
                                    inactive-color="#ff4949">
                                </el-switch>
                                <el-select disabled v-if="item.type=='enum'" v-model="startForm[item.id]" placeholder="">
                                  <el-option v-for="val in item.items" :label="val.value" :value="val.value" :key="val.value"></el-option>
                                </el-select>
                                <el-date-picker
                                  disabled
                                  v-if="item.type=='date'"
                                  v-model="startForm[item.id]"
                                  type="date"
                                  placeholder="选择日期"
                                  format="yyyy 年 MM 月 dd 日"
                                  :value-format="item.datePattern">
                                </el-date-picker>
                                <el-input-number disabled v-if="item.type=='long'" v-model="startForm[item.id]"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="留言">
                                <el-input type="textarea" v-model="formData.comment" placeholder=""></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </my-toast>
        <my-toast :config="userConfig" @submit="submit2" @cancel="cancel2" @handleClose="userClose">
            <el-form :model="useData" ref="formData2" label-width="100px" class="demo-formData" >
                <el-form-item label="托办人" prop="userId" :rules="[{ required: true, message: '此项为必填项', trigger: 'blur' }]">
                     <el-select filterable  v-model="useData.userId" placeholder="请选择">
                        <el-option
                        v-for="item in userList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </my-toast>
    </div>
</template>
<script>
export default {
    data(){
        return{
            typeList:[],
            config:{
                title:'流程申请',
                dialogVisible:false,
                width:'800px',
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
            useData:{
                userId:'',
                taskId:'',
                action:'delegate'
            },
            userConfig:{
                title:'请选择托办人员',
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
            formData:{
                comments:[]
            },
            startForm:{

            },
            startFormConfig:[],
            formConfig:[],
            userList:[]
        }
    },
    props:['ports','total','list','type','text','color','tourl'],
    methods:{
        handlerClick(){
            window.location.href=this.tourl
        },
        handleCommand(command){
            this.$emit('handleCommand',command)
        },
        currentChange(currentPage){
            this.$emit('currentChange',currentPage)
        },
        giveOther(item){
            this.useData.taskId=item.id
            this.useData.userId=''
            this.userConfig.dialogVisible=true
        },
        unClaim(item){
            this.$confirm('是否反签收该任务', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http.post(
                        this.ports+'/runtime/tasks/'+item.id,
                        {action:'unclaim'},
                        data=>{
                            this.$message('反签收成功')
                            this.$emit('submit')
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
        handler(data){
            console.log(this.type)
            if(this.type=='todo'){
                this.$http.get(
                    this.ports+'/forms/task-form/'+data.id,
                    {},
                    res=>{
                        console.log(res)
                        this.config.dialogVisible=true
                        this.config.title=res.proDefName
                        this.formConfig=res.formData
                        this.formData.command=''
                        this.formData.comments=res.comments
                        this.formData.comment=''
                        this.formData.action='complete'
                        this.formData.taskId=res.taskId
                        this.formData.taskName=res.taskName
                        this.formData.startUser=res.startUser
                        this.startFormConfig=res.startForm
                        for(let d of res.startForm){
                            if(d.type=='boolean'){
                                if(d.value==true||d.value==false)
                                    this.$set(this.startForm,d.id,d.value)
                                else
                                    this.$set(this.startForm,d.id,false)
                            }else{
                                this.$set(this.startForm,d.id,d.value)
                            }
                        }
                        for(let d of res.formData){
                            if(d.type=='boolean'){
                                if(d.value==true||d.value==false)
                                    this.$set(this.formData,d.id,d.value)
                                else
                                    this.$set(this.formData,d.id,false)
                            }else{
                                this.$set(this.formData,d.id,d.value)
                            }
                        }
                    },
                    this
                )
            }else if(this.type=='claim'){
                this.$confirm('是否确认签收该任务', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.$http.post(
                        this.ports+'/runtime/tasks/'+data.id,
                        {action:'claim'},
                        data=>{
                            this.$message('签收成功')
                            this.$emit('submit')
                        },
                        this
                    )
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });          
                });
            }else if(this.type=='asked'){

            }
        },
        cancel(){
            this.config.dialogVisible=false
        },
        handleClose(){
            if(this.$refs.formData){
                this.$refs.formData.resetFields()
            }
        },
        userClose(){
            if(this.$refs.formData2){
                this.$refs.formData2.resetFields()
            }
        },
        submit(){
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    console.log(this.formData)
                    this.$http.post(
                        this.ports+'/runtime/tasks/'+this.formData.taskId,
                        this.formData,
                        data=>{
                            this.config.dialogVisible=false
                            this.$message('任务已成功')
                            this.$emit('submit')
                        },
                        this
                    )
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 人员选择提交
        submit2(){
            this.$refs['formData2'].validate((valid) => {
                if (valid) {
                    this.$http.post(
                        this.ports+'/runtime/tasks/'+this.useData.taskId,
                        this.useData,
                        data=>{
                            this.userConfig.dialogVisible=false
                            this.$message('托办已成功')
                            this.$emit('submit')
                        },
                        this
                    )
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 人员选择取消
        cancel2(){
            this.userConfig.dialogVisible=false
        }
    },
    mounted(){
        this.$http.get(
            this.ports+'/procType/all',
            {},
            data=>{
                this.typeList=data
            },
            this
        )
        this.$http.get(
            this.ports+'/users',
            {},
            data=>{
                console.log(data,'----')
                this.userList=data.rows
            },
            this
        )
    }
}
</script>
<style lang="less">
    .backlog-content{
        margin: 20px;
        overflow: auto;
        .con-top{
            height: 50px;
            line-height: 50PX;
            background: #fff;
            padding: 0 20px;
        }
        .con-container{
            margin-top: 20px;
            .middle_center {
                width: 100%;
                background: rgba(255,255,255,1);
                margin: 0 auto 30px;
                transition: box-shadow .5s ease-in-out;
                &:hover{
                    box-shadow: 0 5px 26px #ddd;
                }
                .center_top {
                    overflow: hidden;
                    padding-top: 16px;
                    .center_left {
                        display: flex;
                        align-items: center;
                        float: left;
                        margin-left: 40px;
                        .circle {
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            background: rgba(0,153,214,1);
                            font-size: 14px;
                            font-family: MicrosoftYaHei;
                            color: rgba(255,255,255,1);
                            line-height: 36px;
                            text-align: center;
                        }
                        p{
                            margin-left: 10px;
                            color: rgba(51,51,51,1);
                            font-size: 18px;
                            font-family: MicrosoftYaHei;
                        }
                    }
                    .center_right {
                        cursor: pointer;
                        float: right;
                        margin-right: 40px;
                        width: 66px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        border-radius: 15px;
                        font-size: 14px;
                    }
                }
                .center_text {
                    margin-left: 89px;
                    h1 {
                        font-weight: bold;
                        margin-top: 30px;
                        margin-bottom: 10px;
                        font-size: 18px;
                        font-family: MicrosoftYaHei-Bold;
                        color: rgba(51,51,51,1);
                    }
                }
                .center_bottom {
                    overflow: hidden;
                    .bottom_left {
                        float: left;
                        margin: 16px 0 20px 89px;
                        h1 {
                            font-size: 16px;
                            font-family: MicrosoftYaHei-Bold;
                            color: rgba(51,51,51,1);
                            display: inline-block;
                        }
                        p {
                            color: #999999;
                            display: inline-block;
                        }
                    }
                    .bottom_right {
                        float: right;
                        margin: 16px 89px 20px 0;
                        p{
                            color: #999999;
                        }
                    }
                }
            }
        }
        
    }
</style>

