<template>
        <my-toast :config="config" @submit="submit" @cancel="cancel" @handleClose="handleClose">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
                <el-form-item label="模型名称" prop="name">
                    <el-input v-model="formData.name" style="width:320px" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="模型分类" prop="category">
                    <el-select
                        v-model="formData.category"
                        filterable
                        allow-create
                        default-first-option
                        placeholder="请选择文章标签">
                        <el-option
                        v-for="item in typeList"
                        :key="item.procTypeKey"
                        :label="item.procTypeName"
                        :value="item.procTypeKey">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="流程名称" prop="processName">
                    <el-input v-model="formData.processName"  style="width:320px"></el-input>
                </el-form-item>
                <el-form-item label="模型描述">
                    <el-input v-model="formData.description" type="textarea" style="width:320px"></el-input>
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
                name:rule.require('string'),
                category:rule.require('string'),
                processName:rule.require('string'),
                adminId:rule.require('number'),
            },
            adminList:[],
            procedureSymbolList:[]
        }
    },
    computed:{
        ...mapState({
            typeList:'typeList',
            flowPorts:'flowPorts'
        })
    },
    props:{
        config:{
            type:Object,
            required:true,
            default:()=>{
                return{}
            },
        },
        formData:{
            type:Object,
            required:true,
            default:()=>{
                return{}
            }
        }
    },
    methods:{
        submit(){
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    this.$emit('addSuccess',this.formData)
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
        }
    },
    mounted(){
        
    },
}
</script>
