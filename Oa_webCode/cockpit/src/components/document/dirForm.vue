<template>
<!-- :expand-on-click-node="false" -->
        <!-- <my-toast :config="config" @submit="submit" @cancel="cancel" @handleClose="handleClose"> -->
    <div class="dirForm">
        <el-dialog :title="config.title" :visible.sync="config.dialogVisible" :close-on-click-modal="false" :width="config.width" @close="handleClose">
            <div class="dir-tree">
                <el-tree
                :data="config.treeData"
                :props="{label:'name',id:'dirId'}"
                @node-click="nodeClick"
                node-key="id"
                >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        <!-- <img src="../../assets/img/1 (7).png" style="width:20px;height:20px;margin-right:10px"/>  -->

                    {{node.label }}</span>
                </span>
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button  @click="addDir" size="small" style="float:left" :disabled="selectNode==null">新建目录</el-button> -->
                <el-button type="primary" @click="submit" size="small">确 定</el-button>
                <el-button @click="cancel" size="small">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// import rule from '../../assets/js/rule.js'
export default {
    data(){
        return{
            treeData:[],
            selectNode:null
        }
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
            console.log(this.selectNode)
            if(this.selectNode!=null){
                this.$emit('successMove',this.selectNode.id)
            }
        },
        cancel(){
            this.config.dialogVisible=false
        },
        handleClose(){
            if(this.$refs.formData){

            }
            console.log(1)
        },
        addDir(){
            console.log('---')
        },
        nodeClick(node){
            console.log(node)
            this.selectNode=node
        }
    },
    mounted(){
        
    },
    watch:{
        'config.isShow':(val)=>{
            console.log(val)
        }
    }
}
</script>
<style lang="less">
    @headerbgColor:#F0EFF5;
    .dirForm{
        .el-dialog__body{
            padding: 20px 0 10px 0;
        }
        .el-dialog__header {
            background-color: @headerbgColor;  
            // background-image: @headerbgImage;
            padding: 15px 10px;

            .el-dialog__title {
            color: #333333;
            }
        }
        .dir-tree{
            margin:0 20px;
            background: red;
            border:#E5E5E5 1px solid;
            .el-tree-node__content{
                height: 48px;
                .custom-tree-node{
                    height: 48px;
                    line-height: 48px;
                    width: 100%;
                    padding-right: 10px;
                }
            }
        }
    }
    
</style>
