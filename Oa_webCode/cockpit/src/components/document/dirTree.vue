<template>
    <div>
        <el-tree
            :data="treeData"
            accordion
            highlight-current
            node-key="id"
            ref="tree"
            :default-expanded-keys="[0]"
            @current-change="nodeChange"
            :props="{
                label:'name',
                children: 'children',
            }"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span> <img src="http://124.160.96.135:8070/appSign/qwertyuiop.png" style="width:20px;height:20px;margin-right:10px;position: relative;top: 5px;"/> {{ node.label }}</span>
            </span>
        </el-tree>
    </div>
</template>
<script>
import  {mapState} from 'vuex'
export default {
    data(){
        return{
            treeData:[{
               name:'文档',
               id:0,
               children:[
                   {
                       name:'文档库',
                        id:'document',
                   },
                   {
                       name:'分享的文档',
                       id:'shareDoc'
                   },
                   {
                       name:'关注的文档',
                       id:'aim'
                   },
                   {
                       name:'共享给我的文档',
                       id:'shareMe'
                   }
               ]
           }],
           selectNode:{
                name:'文档库',
                id:'document',
           }
        }
    },
    props:{
        ports:{
            type:String
        }
    },
    methods:{
        nodeChange(data,node){
            this.selectNode=data
            this.getList()
        },
        getList(){
            this.$emit('getList',this.selectNode)
        }
    },
    mounted(){
        setTimeout(()=>{
            this.$refs.tree.setCurrentKey('document')
        },100)
        // this.$refs.tree.setCurrentKey('document')
        this.getList()
    },
    created(){
        this.$http.get(
            this.ports+'/libraries/menus/front-end',
            {},
            data=>{
                this.treeData=this.treeData.concat(data)
            },
            this
        )
    }
}
</script>

