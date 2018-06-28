
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new  Vuex.Store({
    state:{
       isLog:true,//是否打印日志
       ports:null,
       isLoading:false,
       userList:[]
    },
    mutations:{
        print(state,str){//输出日志
             if(state.isLog){
                 console.log(str);//打印
             }
        },
        set_ports:(state,ports)=>{
            state.ports=ports
        },
        loading:(state)=>{
            state.isLoading=true
        },
        cancelLoad:(state)=>{
            state.isLoading=false
        },
        setUserList:(state,data)=>{
            state.userList=data
        }
    },
    getters:{
        
    }
})
