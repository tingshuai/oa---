<template>
    <div class="list no-scroll">
        <div class="doc-content-list">
            <div class="list-item" @mouseenter="enterData=item"  @click.stop.prevent="select(item)" @mouseleave="enterData=null" :class="{selected:item==enterData||item==selectData}"  v-for="(item,index) in datas">
                <div class="list-item-icon">
                    <img :src="config.titleImg" alt="">
                </div>
                <div class="list-item-name"><span class="text">{{item[props.label]}}</span><el-input @blur="handlerDirBlur($event)" class="editText" style="width:216px" v-model="item[props.label]"  size="mini"></el-input></div>
                <div class="list-item-menu" v-show="enterData==item">
                    <img @dblclick.stop="()=>{return false}" @click.stop="handlerDirEdit($event)" src="../../assets/img/1 (10).png" alt="">
                    <img @click.stop="handlerClick(val.method,item,index)" :src="val.imgUrl" v-for="val in btns">
                    <!-- <img @dblclick.stop="()=>{return false}" @click.stop="handlerDirDel(index)" src="../assets/img/1 (6).png" alt=""> -->
                </div>
                <div class="list-item-date">
                    {{item.createTime}}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            selectData:null,
            enterData:null
        }
    },
    props:{
        btns:{
            type:Array,
            default:[],
        },
        datas:{
            type:Array,
            default:[],
            require:true,
        },
        props:{
            type:Object,
            default:()=>{
                return{
                    label:'label',
                }
            }
        },
        config:{
            type:Object,
            require:true,
            default:()=>{
                return{
                    currentPage:1,
                    canHttp:false,
                    titleImg:'./src/assets/img/1 (7).png'
                }
            }
        }
    },
    methods:{
        handlerDirEdit(e){
            e.stopPropagation()
            $(e.target).parents('.list-item').children('.list-item-name').children('.editText').css('display','inline-block').children('input').focus()
            $(e.target).parents('.list-item').children('.list-item-name').children('.text').css('display','none')
        },
        handlerDirBlur(e){
            e.stopPropagation()
            $(e.target).parents('.list-item').children('.list-item-name').children('.editText').css('display','none')
            $(e.target).parents('.list-item').children('.list-item-name').children('.text').css('display','inline-block')
            this.$emit('editSuccess')
        },
        handlerClick(method,data,index){
            this.$emit(method,data,index)
        },
        select(item){
            this.selectData=item
            this.$emit('select',item)
        },
    },
    mounted(){
        var self=this
        $('.list').scroll(function(){
            var $this =$(this),  
            viewH =$(this).height(),//可见高度  
            contentH =$(this).get(0).scrollHeight,//内容高度  
            scrollTop =$(this).scrollTop();//滚动高度   
            if(scrollTop/(contentH -viewH)>=0.98){   
                if(self.config.canHttp){
                    self.config.canHttp=false
                    self.config.currentPage++
                    console.log('------------')
                    self.$emit('scrollBottomEvent')
                }
            }  
        })
    }
}
</script>
<style lang="less" scoped>
    .list{
        height: 100%;
        overflow: auto;
        .doc-content-list{
            .list-item{
                &.selected{
                    background: #F6F6F6;
                }
                height: 60px;
                border-bottom:1px solid #EEEEEE;
                display: flex;
                .list-item-icon{
                    width: 40px;
                    height: 60px;
                    line-height: 60px;
                    margin-left: 10px;
                }
                .list-item-name{
                    flex: 1;
                    font-family:MicrosoftYaHei;
                    font-size:14px;
                    color:rgba(51,51,51,1);
                    line-height:60px;
                    height: 60px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    .editText{
                        display: none;
                    }
                    .text{
                        display: inline;
                    }
                }
                .list-item-menu{
                    line-height:60px;
                    padding-right: 50px;
                    img{
                        cursor: pointer;
                        margin-left: 30px;
                    }
                }
                .list-item-date{
                    padding-right: 10px;
                    line-height:60px;
                    font-size:14px;
                    font-family:ArialMT;
                    color:rgba(153,153,153,1);
                    line-height:64px;
                }
            }
        }
    }
</style>


