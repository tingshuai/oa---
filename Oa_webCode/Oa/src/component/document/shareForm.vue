<template>
        <my-toast :config="config" @submit="submit" @cancel="cancel" @handleClose="handleClose">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
                <el-form-item label="文件名:">
                        {{formData.fileName}}
                </el-form-item>
                <el-form-item label="共享用户">
                     <el-select filterable  v-model="formData.beSharedUserIds" multiple placeholder="请选择">
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
</template>
<script>
import rule from '../../assets/js/rule.js'
import {mapState} from 'vuex'
export default {
    data(){
        return{
            rules:{
                // beSharedUserIds:rule.require('array')
            },
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
        submit(){
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    this.$emit('shareSuccess',this.formData)
                    
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
            console.log(1)
            
        }
    },
    watch:{
        'config.isShow':(val)=>{
            console.log(val)
        }
    }
}
</script>
