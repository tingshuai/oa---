<template>
        <my-toast :config="config" @submit="submit" @cancel="cancel" @handleClose="handleClose" @handleOpen="handleOpen">
            <!-- {{formData.file}} -->
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
                <!-- <el-form-item label="目录选择" prop="dirId">
                    <el-cascader filterable change-on-select @change="handlerChange" :options="dirList" v-model="dirId" :props="{label:'name',value:'id'}"></el-cascader>
                </el-form-item> -->
                 <el-form-item label="共享用户" prop="beSharedUserIds">
                     <el-select filterable  v-model="formData.beSharedUserIds" multiple placeholder="请选择">
                        <el-option
                        v-for="item in userList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否更新版本">
                    <el-radio-group v-model="formData.upVer">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <div class="tags-content">
                        <div @mouseenter="selectTag=item" @mouseleave="selectTag=null" v-for="(item,index) in formData.tags" :class="{'noDefault':selectTag==item}">
                            {{item}}
                            <i class="el-icon-close" v-show="selectTag==item" @click="del(index)"></i>
                        </div>
                        <el-button icon="el-icon-plus" size="mini" @click="addTag" :disabled="formData.tags.length>=5">添加标签</el-button>
                    </div>
                </el-form-item>
               
                <el-form-item label="文件" style="padding-right:25px;">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        :data="formData"
                        :action="this.ports+'/libraries/files/sync'"
                        :on-success="uploadSuccess"
                        :file-list="[]"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small"  icon="el-icon-upload">选取文件</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                </el-form-item>
            </el-form>
        </my-toast>
</template>
<script>
import rule from '../../assets/js/rule.js'
import {mapState} from 'vuex'
export default {
    data(){
        return{
            rules:{
                // file:rule.require('array'),
                tags: [{ validator: rule.isRepeat, trigger: 'change'}]
            },
            dirId:[],
            selectTag:null,
            // dirList:[]
        }
    },
    computed:{
        ...mapState({
            userList:'userList',
            ports:'ports'
        })
    },
    props:{
        config:{
            type:Object,
            require:true,
            default:()=>{
                return{}
            },
        },
        formData:{
            type:Object,
            require:true,
            default:()=>{
                return{}
            }
        }
    },
    methods:{
        handlerChange(val){
            this.formData.dirId=val[val.length-1]
        },
        addTag(){
            this.$prompt('请输入标签名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
                }).then(({ value }) => {
                    var index=this.formData.tags.findIndex(val=>val==value)
                    if(index>=0){
                        this.$message.error('标签已存在请重新输入')
                        this.addTag()
                    }else{
                        if(value.length>5){
                             this.$message.error('请输入小于五位的标签');
                             this.addTag()
                        }else{
                            this.formData.tags.push(value)
                        }
                    }
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
            });
        },
        del(index){
            this.formData.tags.splice(index,1)
        },
        submit(){
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                   this.$refs.upload.submit();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel(){
            this.config.dialogVisible=false
        },
        handleClose(){
            if(this.$refs.formData){
                this.$refs.formData.resetFields()
            }
        },
        handleOpen(){
            // this.dirId=[]
            // if(this.$refs.upload)
            //     this.$refs.upload.clearFiles()
            // this.$http.get(
            //     this.ports+'/libraries/directories/tree',
            //     {dirId:0},
            //     data=>{
            //         this.dirList=data
            //     }
            // )
        },
        uploadSuccess(res){
            if(res.status==200){
                this.config.dialogVisible=false
                console.log(res)
                this.$emit('uploadSuccess',res,this.formData)
            }else{
                this.$refs.upload.clearFiles()
                this.$alert(res.message, '错误提示', {
                    confirmButtonText: '确定'
                });
            }
            
        }
    }
}
</script>
