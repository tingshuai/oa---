<template>
    <div class="nav-tree">
        <el-tree
            :data="treeData"
            node-key="id"
            ref="tree"
            :props="myProps"
            highlight-current
            @current-change="nodeChange"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
            </span>
        </el-tree>
    </div>
</template>
<script>
export default {
    data(){
        return{
            treeData:[],
            myProps:{
                label:'name'
            },
            typeList:[]
        }
    },
    methods:{
        nodeChange(data){
            console.log(data)
            this.$emit('nodeChange',data)
        }
    },
    props:['ports'],
    mounted(){
        this.$http.get(
            this.ports+'/runtime/tasks/menus',
            {},
            data=>{
                this.treeData=data
                setTimeout(()=>{
                    this.$refs.tree.setCurrentKey('todo')
                    this.$emit('nodeChange',this.$refs.tree.getCurrentNode())
                },100)
            },
            this
        )
    }
}
</script>
<style lang="less">
    .nav-tree{
        padding-top: 20px;
        .el-tree{
            background: none;
            .el-tree-node__content{
                height: 50px;
            }
        }
    }
</style>

