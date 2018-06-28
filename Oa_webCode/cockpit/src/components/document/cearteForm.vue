<template>
        <my-toast :config="config" @submit="submit" @cancel="cancel" @handleClose="handleClose">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="formData.name" placeholder="" :disabled="disabled" style="width:217px"></el-input>
                </el-form-item>
                <!-- <el-form-item label="设定管理员" prop="managerId">
                    <el-select v-model="formData.managerId" placeholder="">
                      <el-option v-for="item in adminList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item> -->
            </el-form>
        </my-toast>
</template>
<script>
import {mapState} from 'vuex'
import rule from '../../assets/js/rule.js'
export default {
    data(){
        return{
            rules:{
                name:rule.require('string'),
                adminId:rule.require('number'),
            },
            adminList:[]
        }
    },
    computed:{
        ...mapState({
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
        },
        disabled:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        submit(){
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    this.$http.post(
                        this.ports+'/libraries/directories',
                        this.formData,
                        data=>{
                            this.config.dialogVisible=false
                            this.$emit('createSuccess',data)
                        },
                        this
                    )
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
        this.$http.get(
            this.ports+'/users',
            {},
            data=>{
                this.adminList=data.rows
            },
            this
        )
    },
    watch:{
        'config.isShow':(val)=>{
            console.log(val)
        }
    }
}
</script>
