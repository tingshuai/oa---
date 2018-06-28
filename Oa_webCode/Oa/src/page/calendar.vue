<template>
  <div class="fullCalendar">
      <div id='calendar' @click="dome($event)"></div>
       <my-toast :config="config" >
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" style="margin:0 40px;"> 
                <el-form-item prop="title" label="日程标题">
                    <el-input size="mini" v-model="form.title" placeholder="请输入日程标题"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="level" label="日程等级">
                            <el-select v-model="form.level" placeholder="">
                            <el-option v-for="val in 6" :key="val" :label="'等级'+val" :value="val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示颜色">
                            <el-color-picker t placeholder="选择时间" v-model="form.color" ></el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="start" label="日程开始时间">
                            <el-date-picker value-format="timestamp" type="datetime" placeholder="选择时间" v-model="form.start" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="end" label="日程结束时间">
                            <el-date-picker value-format="timestamp" type="datetime" placeholder="选择时间" v-model="form.end" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                
                
                
            </el-form>
                <!-- <el-button @click="config.dialogVisible = false">取 消</el-button> -->
                <!-- <el-button type="primary" @click="del('ruleForm')" v-if="title=='编辑日程'">删除</el-button> -->
                <!-- <el-button type="primary" @click="sure('ruleForm')">确 定</el-button> -->
       </my-toast>
    </div>
</template>
<script>

export default {
    data(){
        var validate = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入日常结束时间'));
            } else if (value<= this.form.start) {
                callback(new Error('开始时间不能大于结束时间!'));
            } else {
                callback();
            }
        };
        return{ 
            // title:'',
            isShow:true,
            calendar:null,
            form:{
                title:'',
                start:'',
                end:'',
                id:0,
                allDay:false,
                color:''
            },
            events:[],
            config:{
               title:'',
               dialogVisible:false,
               width:'800px',
               treeData:[],
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
            rules:{
                start:[{ required: true, message: '请选择时间', trigger: 'blur' }],
                end:[{ validator: validate, trigger: 'blur' },{ required: true, message: '请选择时间', trigger: 'blur' }],
                title:[{ required: true, message: '请选择时间', trigger: 'blur' }],
            }
        }
    },
    methods:{
        del(){
            // var self=this
            // this.$ajax.delete(
            //    this.ports+'/delete/'+this.form.id,
            // ).then(function(response) {
            //   self.calendar.fullCalendar('removeEvents',[self.form.id]);
            //   self.isShow=false
            // })
        },
        sure(){
            //    this.$refs['ruleForm'].validate((valid) => {
            //     if (valid) {
            //         var self=this;
            //         let qs = require('qs')
            //         if(this.form.id==0){
            //             delete this.form.id
            //             this.$ajax.post(this.ports+'/save',qs.stringify(this.form),{
            //                 params: {}
            //             }).then(res => {
            //                 var data=res.data.data
            //                 data.start=new Date(data.start)
            //                 data.end=new Date(data.end)
            //                 console.log(data)
            //                 this.calendar.fullCalendar('renderEvent',
            //                     data,
            //                     true // make the event "stick"
            //                 );
            //                 this.isShow=false
            //             })
            //         }else{
            //             this.$ajax.post(this.ports+'/edit',qs.stringify(this.form),{
            //                 params: {}
            //             }).then(res => {
            //                 var data=Object.assign({},this.form)
            //                 data.start=new Date(data.start)
            //                 data.end=new Date(data.end)
            //                 this.calendar.fullCalendar('removeEvents',[self.form.id]);
            //                 this.calendar.fullCalendar('renderEvent',
            //                     data,
            //                     true // make the event "stick"
            //                 );
            //                 this.isShow=false
            //             })
            //         }
            //     } else {
            //         console.log('error submit!!');
            //         return false;
            //     }
            //     });
        },
        dome(e){
           console.log(this.calendar.fullCalendar('getDate'))
        }
    },
    props:{
    },
    mounted(){
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var self=this
        this.$http.get('/demo/getDemo',{},data=>{
            this.events=JSON.parse(JSON.stringify(data))
            self.calendar =$('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                navLinks: true, // can click day/week names to navigate views
                selectable: true,
                selectHelper: true,
                editable: true,
                eventLimit: true,
                select: function(start, end, allDay) {
                    self.config.title='新增日程'
                    self.form={
                        title:'',
                        start:new Date(start).getTime(),
                        end:'',
                        id:0,
                        allDay:false,
                        color:''
                    }
                    self.config.dialogVisible=true
                    self.calendar.fullCalendar('unselect');
                },
                eventClick: function(event, jsEvent, view) {
                    console.log(event)
                    self.config.title='编辑日程'
                    self.$set(self.form,'title',event.title)
                    self.$set(self.form,'start',new Date(event.start).getTime())
                    self.$set(self.form,'end',new Date(event.end).getTime())
                    self.$set(self.form,'id',event.id)
                    self.$set(self.form,'color',event.color)
                    self.config.dialogVisible=true
                },
                dayClick:function(a,b,c,d){
                    console.log(d)
                },
                eventDrop:function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ) {
                    self.$set(self.form,'title',event.title)
                    self.$set(self.form,'start',new Date(event.start).getTime())
                    self.$set(self.form,'end',new Date(event.end).getTime())
                    self.$set(self.form,'id',event.id)
                    self.$set(self.form,'color',event.color)
                    self.$ajax.post(self.ports+'/edit',qs.stringify(self.form),{
                        params: {}
                    }).then(res => {
                        var data=Object.assign({},this.form)
                        data.start=new Date(data.start)
                        data.end=new Date(data.end)
                        this.calendar.fullCalendar('removeEvents',[data.id]);
                        this.calendar.fullCalendar('renderEvent',
                            data,
                            true // make the event "stick"
                        );
                        this.config.dialogVisible=false
                    })
                },
                events: data
            });
        },self) 
    }
}
</script>
<style>
    .fullCalendar{
       padding:20px;
    }
     #calendar {
        width: 60%;
        margin: 0 auto;
    }
</style>

