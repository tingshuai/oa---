import Mock from 'mockjs'
//端口
const prot ="http://www.xiaohei.com"
//设置等待时间
Mock.setup({
    timeout: '200-600'
})
function parseQuery(query) {
    var reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
    var obj = {};
    while (reg.exec(query)) {
        obj[RegExp.$1] = decodeURI(RegExp.$2);
    }
    return obj;
}
//获取所有面版数据
Mock.mock('/demo/getDemo', function(options){
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    return Mock.mock({
        "data":[{
            id: 5,
            title: 'All Day Event',
            start: new Date(y, m, 1)
        },
        {
            id: 4,
            title: 'Long Event',
            start: new Date(y, m, d-5),
            end: new Date(y, m, d-2)
        },
        {
            id: 1,
            title: 'Repeating Event',
            start: new Date(y, m, d-3, 16, 0),
            allDay: false
        },
        {
            id: 2,
            title: 'Repeating Event',
            start: new Date(y, m, d+4, 16, 0),
            allDay: false
        },
        {
            id: 3,
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false
        },
        {
            id: 6,
            title: 'Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            allDay: false
        },
        {
            id: 7,
            title: 'Birthday Party',
            start: new Date(y, m, d+1, 19, 0),
            end: new Date(y, m, d+1, 22, 30),
            allDay: false
        }],
        "message": "操作成功",
        "status": 200
    })
})
// 获取文件夹列表
Mock.mock('/test/getFolder', function(options){
    return Mock.mock({
        "data": {
          "dirTree|1-3": [
            {
              "id|+1": new Date().getTime(),
              "name": "@cname",
              "createTime":"@date('yyyy-MM-dd')"
            }
          ],
        },
        "message": "操作成功",
        "status": 200
      })
})

// 获取文件列表
Mock.mock('/test/getFile', function(options){
    return Mock.mock({
        "data": {
          "total": 20,
          "rows|20": [
            {
              "id|+1": 1,
              "fileName": "@cname",
              "fileType|1": ['doc', 'txt'],
              "fileVersion": null,
              "createTime": null,
              "tags": null,
              "icon": "doc",
              "follow": true,
              "createTime":"@date('yyyy-MM-dd')",
            }
          ]
        },
        "message": "操作成功",
        "status": 200
      })
})
// 获取用户列表
Mock.mock('/test/getUser', function(options){
    return Mock.mock({
        "data|5-10": [
            {
                'name':'@cname',
                "id|+1":20
            }
        ],
        "message": "操作成功",
        "status": 200
      })
})
// 获取管理员
Mock.mock('/test/getAdmin', function(options){
    return Mock.mock({
        "data|5-10": [
            {
                'name':'@cname',
                "id|+1":20
            }
        ],
        "message": "操作成功",
        "status": 200
      })
})
Mock.mock('/test/getSortList', function(options){
    return Mock.mock({
        "data": {
            "total": 20,
            "rows|20": [
              {
                "id|+1": 1,
                "fileName": "@cname",
                "fileVersion": null,
                "tags": null,
                "icon": "doc",
                "follow": true,
                "createTime":"@date('yyyy-MM-dd')",
              }
            ]
          },
          "message": "操作成功",
          "status": 200
      })
})
// http://192.168.0.103:8001/libraries/files/sync
Mock.mock('http://192.168.0.103:8001/libraries/files/sync', function(options){
    console.log(options)
    return Mock.mock({
        "data": {
            "id|+1": 1,
            "fileName": "@cname",
            "fileVersion": null,
            "tags": null,
            "icon": "doc",
            "follow": true,
            "createTime":"@date('yyyy-MM-dd')",
          },
          "message": "操作成功",
          "status": 200
      })
})
// 获取部门树
Mock.mock('/test/partTree', function(options){
    console.log(options)
    return Mock.mock({
        "data|3-5": [{
            "label": "@cname",
            "dirId|+1":10,
            "children|2-4":[{
                "label": "@cname",
                "dirId|+1":100,
            }]
          }],
          "message": "操作成功",
          "status": 200
      })
})
// 文件移动成功
Mock.mock('/test/move', function(options){
    console.log(options)
    return Mock.mock({
        "data": "移动成功",
          "message": "操作成功",
          "status": 200
      })
})
// 文件夹移动成功
Mock.mock('/test/moveFloder', function(options){
    console.log(options)
    return Mock.mock({
        "data": "移动成功",
          "message": "操作成功",
          "status": 200
      })
})

Mock.mock('/test/share', function(options){
    console.log(options)
    return Mock.mock({
        "data": "移动成功",
          "message": "操作成功",
          "status": 200
      })
})
//获取所有面版数据
Mock.mock( prot + '/birReport/addBirReport', 'post', function(options){
    console.log(parseQuery(options.body))
    return "请求成功！"
})