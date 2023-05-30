<template>
  <el-container style="display: flex; flex-direction: column;">
    <el-header style="background-color: #0f3365;" height="50px" class="fixed-header">
      <div class="home-header-menu" style="margin-top:0px;">
        <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal"
          background-color="#0f3365" text-color="#fff" active-text-color="#ffd04b"
          style="flex:1; display: flex;height:51px;">
          <div class="logo">
            <img :src="logo_url" height="50px" width="auto" draggable="false" />
          </div>
          <el-menu-item index="/user/dashboard" class="hidden-sm-and-down">首页</el-menu-item>
          <el-submenu index="3" class="hidden-sm-and-down">
            <template slot="title">我的</template>
            <el-menu-item index="/user/rentbook">我要借书</el-menu-item>
            <el-menu-item index="/user/returnbook">我要还书</el-menu-item>
            <el-menu-item index="/user/myrentlist">我的借阅</el-menu-item>
          </el-submenu>
          <el-submenu index="5" v-if="usergroup == 1" class="hidden-sm-and-down">
            <template slot="title">管理员工作台</template>
            <el-menu-item index="/admin/bookmgr">图书管理</el-menu-item>
            <el-menu-item index="/admin/jieyuemgr">借阅管理</el-menu-item>
            <el-menu-item index="/admin/usermgr">用户管理</el-menu-item>
            <el-menu-item index="/admin/noticemgr">公告管理</el-menu-item>
          </el-submenu>
          <el-submenu index="6" class="hidden-sm-and-down">
            <template slot="title">工具箱</template>
            <el-menu-item index="/user/UserSettings">账号信息修改</el-menu-item>
          </el-submenu>

          <div style="display: flex;float: right;right: 20px;top:10px;position: absolute;" class="hidden-md-and-up">
            <i class="el-icon-s-fold" style="font-size: 30px;color:#fff" @click="drawer = true"></i>
            <el-drawer :visible.sync="drawer" direction="rtl" :modal="true" size="240px" :append-to-body="true"
              :modal-append-to-body="false">
              <template slot="title">
                <div class="logo">
                  <img src="../assets/img/logo_menu.png" height="40px" width="80px">
                </div>
              </template>
              <el-menu :default-active="activeIndex" :default-openeds="['3', '4']" :router="true">
                <el-menu-item index="/user/dashboard" @click="drawer = false">首页</el-menu-item>
                <el-menu-item index="/user/mytask" @click="drawer = false">我的任务</el-menu-item>
                <el-submenu index="3">
                  <template slot="title">我的</template>
                  <el-menu-item index="/user/rentbook">我要借书</el-menu-item>
                  <el-menu-item index="/user/returnbook">我要还书</el-menu-item>
                  <el-menu-item index="/user/myrentlist">我的借阅</el-menu-item>
                </el-submenu>
                <el-submenu index="5" v-if="usergroup == 1">
                  <template slot="title">管理员工作台</template>
                  <el-menu-item index="/admin/bookmgr">图书管理</el-menu-item>
                  <el-menu-item index="/admin/jieyuemgr">借阅管理</el-menu-item>
                  <el-menu-item index="/admin/usermgr">用户管理</el-menu-item>
                </el-submenu>
                <el-submenu index="7">
                  <template slot="title">个人中心</template>
                  <el-menu-item index="/user/UserSettings" @click="drawer = false">账号信息修改</el-menu-item>
                  <el-menu-item @click="logout">退出登录</el-menu-item>
                </el-submenu>
              </el-menu>
            </el-drawer>
          </div>


          <div style="display: flex;float: right;right: 20px;position: absolute;" class="hidden-sm-and-down">
            <img src="../assets/img/default_face.png" style="margin-top: 10px;width: 32px;height: 32px;"
              draggable="false">
            <span
              style="max-width: 100px;overflow: hidden;text-overflow: ellipsis;line-height: 54px;color: #FFFFFF;margin: 0 20px 0 5px;">{{ rname }}</span>

            <el-tooltip effect="dark" content="账号信息修改" placement="bottom">
              <div>&nbsp;&nbsp;<i class="el-icon-setting" style="color: #FFFFFF;font-size: 18px;margin-top: 0;padding: 0;"
                  @click="toUserSettings"></i>
              </div>
            </el-tooltip>
            <el-tooltip effect="dark" content="退出系统" placement="bottom">
              <div>&nbsp;&nbsp;<i class="el-icon-switch-button"
                  style="color: #FFFFFF;font-size: 18px;margin-top: 0;padding: 0;" @click="logout"></i>
              </div>
            </el-tooltip>
          </div>

        </el-menu>
      </div>
    </el-header>

    <div style="margin-top: 45px;">
      <el-alert :type="warning_type" show-icon v-if="warning_info != '' && warning_info != null">
        <template slot="title">
          <span v-html="warning_info"></span>
        </template>
      </el-alert>
      <router-view />
    </div>
    <footer class="footer">
      <div class="copyright">&copy; 2023 <a href="https://class.ljcljc.cn/about.html" target="_blank"
          style="color: #000000;">图书管理系统</a>&nbsp;|&nbsp;V1.0.0</div>
    </footer>
  </el-container>
</template>


<style>
@import 'element-ui/lib/theme-chalk/display.css';

.el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.el-scrollbar__bar.is-horizontal {
  display: none;
}

.el-collapse-item__header {
  font-size: 16px;
}

.el-collapse-item__content {
  font-size: 14px;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.home-header-menu .el-menu--horizontal>.el-menu-item {
  height: 50px;
  line-height: 50px;
}

.home-header-menu .el-menu--horizontal>.el-submenu .el-submenu__title {
  height: 50px;
  line-height: 50px;
}

.logo img {
  width: auto;
  height: 50px;
  margin: 0px;
  display: flex;
}

.fixed-header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  padding: 0 20px;
}

.footer {
  text-align: center;
  bottom: 0;
  color: black;
  font-size: 14px;
  width: 100%;

}

.footer a {
  color: #000000;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.footer .copyright {
  flex: 0 0 100%;
  text-align: center;
}

.ljc-warp {
  position: relative;
  min-height: 100%;
}

.red-dot {
  position: absolute;
  top: 16px;
  right: -1px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #f00;
}

.content_new_bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #999;
  font-size: 12px;
  line-height: 30px;
  text-align: right;
  padding: 0 30px;
  box-sizing: border-box;
  background-color: #e5e5e5;
}
</style>
<style>
.el-table .el-table__cell {
  padding: 6px 0 !important;
}

.el-input-group__append,
.el-input-group__prepend {
  padding: 0 !important;
}
</style>


<script>
import axios from 'axios'
import logo_url from '@/assets/img/logo.png'
export default {
  name: "user",
  data() {
    return {
      activeIndex: localStorage.getItem('activeTab'),
      unread_num: 0,
      usergroup: 3,
      warning_info: '',
      warning_type: 'warning',
      logo_url: logo_url,
      rname: '',
      drawer: false
    }
  },
  methods: {
    logout() {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          localStorage.clear('isLogin')
          localStorage.clear('ljc_token')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          this.$router.push('/login')
      });
    },
    getHomeUserData() {
      axios.get('/userApi/getHomeUserData', {headers: {'token': localStorage.getItem('ljc_token')}})
        .then(res => {
          if (res.data.code != null && res.data.code == 400) {
            this.$message.error('登录状态过期，请重新登录');
            localStorage.clear('ljc_token');
            localStorage.clear('isLogin');
            this.$router.push('/login?refer=' + window.location.pathname)
          }
          else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);

          this.usergroup = res.data.data.userGroup;
          this.rname = res.data.data.name;


          this.userinfo_loading = false

          // if (this.usergroup != 3) this.$options.methods.getHomeAdminData.bind(this)();
          // else this.adminPanelLoading = false
        }).catch(err => {
          console.log(err)
        })
    },
    toUserSettings() {
      this.$router.push('/user/UserSettings')
    },
  },
  watch: {
    '$route'(to, from) {
      // 根据当前页面的路由路径更新 activeIndex 的值
      switch (to.path) {
        case '/#/user/dashboard':
          this.activeIndex = '/user/dashboard';
          break;
        case '/#/user/UserSettings':
          this.activeIndex = '/user/UserSettings';
          break;
        case '/#/admin/bookmgr':
          this.activeIndex = '/admin/bookmgr';
          break;
        case '/#/admin/jieyuemgr':
          this.activeIndex = '/admin/jieyuemgr';
          break;
        case '/#/admin/usermgr':
          this.activeIndex = '/admin/usermgr';
          break;
      }
    }
  },
  created() {
    this.getHomeUserData()
  }
};
</script>