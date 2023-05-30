import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login'
import user from '../views/user'
import NotFound from '../views/error'
import Dashboard from '../views/DashBoard'
import Bookmgr from '../views/Bookmgr'
import Usermgr from '../views/Usermgr'
import Jieyuemgr from '../views/Jieyuemgr'
import Myrentlist from '../views/Myrentlist'
import Rentbook from '../views/Rentbook'
import Returnbook from '../views/Returnbook'
import Bookclassmgr from '../views/Bookclassmgr'
import Usergroupmgr from '../views/Usergroupmgr'
import Noticemgr from '../views/Notice'
import UserSettings from '../views/UserSettings'

Vue.use(Router)

export default new Router({

    routes:[
        {
            path:'/',
            name:'Login',
            component:Login,
            meta: {
                title: '班级信息中心',
            }
        },
        {
            path:'/login',
            name:'Login',
            component:Login,
            meta: {
                title: '班级信息中心-登录',
            }
        },
        {
            path:'/user',
            name:'user',
            component:user,
            meta: {
                title: '图书管理系统',
            },
            children: [
                {
                    path:'/user/dashboard',
                    name:'Dashboard',
                    component:Dashboard,
                    meta: {
                        title: '图书管理系统-首页',
                    }
                },{
                    path:'/admin/bookmgr',
                    name:'Bookmgr',
                    component:Bookmgr,
                    meta: {
                        title: '图书管理系统-图书管理',
                    }
                },{
                    path:'/admin/usermgr',
                    name:'Usermgr',
                    component:Usermgr,
                    meta: {
                        title: '图书管理系统-用户管理',
                    }
                },{
                    path:'/admin/jieyuemgr',
                    name:'Jieyuemgr',
                    component:Jieyuemgr,
                    meta: {
                        title: '图书管理系统-借阅管理',
                    }
                },{
                    path:'/admin/noticemgr',
                    name:'Noticemgr',
                    component:Noticemgr,
                    meta: {
                        title: '图书管理系统-公告管理',
                    }
                },{
                    path:'/admin/bookclassmgr',
                    name:'Bookclassmgr',
                    component:Bookclassmgr,
                    meta: {
                        title: '图书管理系统-图书分类管理',
                    }
                },{
                    path:'/admin/usergroupmgr',
                    name:'Usergroupmgr',
                    component:Usergroupmgr,
                    meta: {
                        title: '图书管理系统-用户组管理',
                    }
                },{
                    path:'/user/myrentlist',
                    name:'Myrentlist',
                    component:Myrentlist,
                    meta: {
                        title: '图书管理系统-我的借阅记录',
                    }
                },{
                    path:'/user/rentbook',
                    name:'Rentbook',
                    component:Rentbook,
                    meta: {
                        title: '图书管理系统-我要借阅',
                    }
                },{
                    path:'/user/returnbook',
                    name:'Returnbook',
                    component:Returnbook,
                    meta: {
                        title: '图书管理系统-我要还书',
                    }
                },{
                    path:'/user/UserSettings',
                    name:'UserSettings',
                    component:UserSettings,
                    meta: {
                        title: '图书管理系统-个人信息修改',
                    }
                }
                
            ]
        },
        {
            path:'*',
            name:'NotFound',
            component:NotFound,
            meta: {
                title: '404 Not Found',
            }
        },
    ]
})