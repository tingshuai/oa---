
// const routers = [
//     // {path: '/calendar', component: calendar},
//     {path: '/document', component: document},
//     // {path: '/sort', component: sort},
//     {path: '/model', component: model},
//     {path: '/flow', component: flow},
//     {path: '/doing', component: doingFlow},
//     {path: '/history', component: history},
//     {path:'/spaceManage',component:spaceManage},
//     {path:'/docLog',component:log},
//     {path:'/adminSet',component:adminSet},
//     {path:'/err',component:err}
// ]
// export default routers
import Vue from 'vue'
import Router from 'vue-router'
//主路由
import index from '../page/index.vue'
// import calendar from '../page/calendar.vue' 
import Document from '../page/document.vue'
import sort from '../page/sort.vue'
import model from '../page/model.vue'
import flow from '../page/flow.vue'
import doingFlow from '../page/doingFlow.vue'
import history from '../page/history.vue'
import spaceManage from '../page/spaceManage.vue'
import log from '../page/log.vue'
import adminSet from "../page/adminSet.vue"
import err from "../page/err.vue"
Vue.use(Router)
export default new Router({
  routes: [{
      path: "/index",
      name: 'index',
      component: index,
      children: [{//不管几层都在同一层声明
          path: "/document",
          component: Document,
          name: "document"
        },
        {
          path: "/model",
          component: model,
          name: "model"
        },
        {
          path:"/index",
          redirect: '/model',
          name: "model"
        },
        {
          path: "/flow",
          component: flow,
          name: "flow"
        },{
          path: "/doing",
          component: doingFlow,
          name: "doingFlow"
        },
        {
          path: "/sort",
          component: sort,
          name: "sort"
        },
        {
          path: "/history",
          component: history,
          name: "history"
        },
        {
          path: "/spaceManage",
          component: spaceManage,
          name: "spaceManage"
        },
        {
          path: "/spaceManage",
          component: spaceManage,
          name: "spaceManage"
        },
        {
          path: "/docLog",
          component: log,
          name: "log"
        },
        {
          path: "/adminSet",
          component: adminSet,
          name: "adminSet"
        },
        {
          path: "/err",
          component: err,
          name: "err"
        },
        {
          path: '/*',
          meta: {
            title: '页面未找到',
            ignoreAuth: true
          },
          component: err
        }
      ]
    }
  ]
})
