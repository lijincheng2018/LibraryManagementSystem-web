<template>
  <el-main style="padding:0px;">
    <div class="breadcrumb_box">
      <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
        <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
          <el-row>
            <el-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
              <div class="user_info_box" v-loading="userinfo_loading">
                <div style="text-align: center;">
                  <img src="../assets/img/default_face.png" class="avatar_img">
                  <br>
                  <span>{{ rname }}</span>
                  <br>
                  <br>
                  <el-tag type="warning" effect="dark" size="small">狗狗队</el-tag><br><br>
                  <el-tag type="success" effect="dark" size="small">{{ userGroupName }}</el-tag><br><br><br>

                  <el-button type="warning" size="medium" @click="toRouter('/user/rentbook')" 
                    plain>我要借书</el-button><br><br>
                  <el-button type="primary" size="medium" @click="toRouter('/user/returnbook')"
                    plain>我要还书</el-button><br><br>
                  <el-button type="success" size="medium" @click="toRouter('/user/myrentlist')"
                    plain>借阅记录</el-button><br><br>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
              <div class="user_info_box" style="padding:15px" v-loading="adminPanelLoading">
                <el-scrollbar style="height:97%">
                  <el-collapse v-model="tool_box">
                    <el-collapse-item name="1" v-if="usergroup == 1">
                      <template slot="title">
                        管理员面板&nbsp;&nbsp;<el-tag type="success" size="small">{{ userGroupName }}</el-tag>
                      </template>
                      <div>
                        <el-tabs v-model="banwei_tool">
                          <el-tab-pane label="图书管理" name="bookmgr">
                            <div style="text-align: center;">
                              <el-button type="warning" size="small" plain
                                @click="toRouter('/admin/bookmgr')">图书管理</el-button>
                              <el-button type="warning" size="small" plain
                                @click="toRouter('/admin/jieyuemgr')">借阅管理</el-button>
                              <el-button type="warning" size="small" plain
                                @click="toRouter('/admin/bookclassmgr')">图书分类管理</el-button>
                              <br><br>
                            </div>
                          </el-tab-pane>
                          <el-tab-pane label="用户管理" name="usermgr">
                            <div style="text-align: center;">
                              <el-button type="warning" size="small" plain
                                @click="toRouter('/admin/usermgr')">用户信息管理</el-button>
                              <el-button type="warning" size="small" plain
                                @click="toRouter('/admin/usergroupmgr')">用户组管理</el-button>
                              <br><br>
                            </div>
                          </el-tab-pane>
                          <el-tab-pane label="公告管理" name="noticemgr">
                            <div style="text-align: center;">
                              <el-button type="warning" size="small" plain
                                @click="toRouter('/admin/noticemgr')">公告管理</el-button>
                              <br><br>
                            </div>
                          </el-tab-pane>
                        </el-tabs>
                      </div>
                    </el-collapse-item>
                    <el-collapse-item name="2">
                      <template slot="title">功能中心</template>
                      <div>
                        <div style="text-align: center;">
                          <el-button type="primary" size="small" style="margin: 2px" @click="toRouter('/user/rentbook')"
                            plain>我要借书</el-button>
                          <el-button type="primary" size="small" style="margin: 2px" @click="toRouter('/user/returnbook')"
                            plain>我要还书</el-button><br>
                          <el-button type="primary" size="small" style="margin: 2px" @click="toRouter('/user/myrentlist')"
                            plain>我的借阅记录</el-button>
                        </div>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                </el-scrollbar>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-card class="box-card" v-loading="library_loading">
                <div slot="header" class="clearfix">
                  <span>图书馆信息</span>
                </div>
                <table class="data-t">
                  <tr>
                    <th><img src="../assets/img/book.png" /></th>
                    <td>
                      <p><span class="eNum">{{ library_info.bookNum }}</span>&nbsp;本</p>
                      <p>管内藏书</p>
                    </td>
                    <th><img src="../assets/img/class.png" /></th>
                    <td>
                      <p><span class="eNum">{{ library_info.bookClass }}</span>&nbsp;种</p>
                      <p>图书分类</p>
                    </td>
                  </tr>
                  <tr>
                    <th><img src="../assets/img/out.png"/></th>
                    <td>
                      <p><span class="eNum">{{ library_info.bookRent }}</span>&nbsp;本</p>
                      <p>借阅总量</p>
                    </td>
                    <th><img src="../assets/img/account.png" /></th>
                    <td>
                      <p><span class="eNum">{{ library_info.userNum }}</span>&nbsp;名</p>
                      <p>用户数</p>
                    </td>
                  </tr>
                </table>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="20" style="padding-top:15px">
            <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
              <el-card class="box-card" v-loading="userinfo_loading">
                <div slot="header" class="clearfix">
                  <span>公告区</span>
                  <el-button style="float: right; padding: 3px 0" type="text">{{ now_time }}</el-button>
                </div>
                <div class="user_info_box_body" style="position: relative;">
                  <el-table v-loading="userinfo_loading"
                    :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%">
                    <el-table-column :show-overflow-tooltip="true" label="公告标题" prop="title"
                      min-width="150px"></el-table-column>
                    <el-table-column label="发布时间" prop="time" min-width="160px" header-align="center" align="center">
                    </el-table-column>
                    <el-table-column label="操作" min-width="100px" header-align="center" align="center">
                      <template slot-scope="scope">
                        <el-button size="mini" @click="handleShow(scope.row)" width="100px">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  

                  <el-pagination @current-change="handleCurrentChange" :pager-count="7" :current-page="currentPage"
                    :page-sizes="[3]" :page-size="pagesize" layout="total, prev, pager, next, jumper"
                    :total="tableData.length > 0 ? tableData.length : null" background
                    style="position: absolute; bottom: 0; right: 0;">
                  </el-pagination>
                </div>
                <el-dialog title="公告详情" :visible.sync="show_digital_dialog" :width="gonggao_width">
                  <span style="font-size:20px;">公告标题：{{ show_digital_array.title }}</span><br>
                  <span style="font-size:20px;">公告正文：{{ show_digital_array.content }}</span><br>
                  <span style="font-size:20px;">发布者：{{ show_digital_array.author }}</span><br>
                  <span style="font-size:20px;">发布时间：{{ show_digital_array.time }}</span><br>
                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="show_digital_dialog = false">确 定</el-button>
                  </span>
                </el-dialog>
              </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
              <el-card class="box-card" v-loading="userinfo_loading">
                <div slot="header" class="clearfix">
                  <div style="display:flex;justify-content : space-between;">
                    <span>我的借阅</span>&nbsp;
                  </div>
                </div>
                <div class="user_info_box_body" style="padding:0;">
                  <div id="my_rentChart" style="width: 100%; height: 270px"></div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-main>
</template>

<style scoped>
.breadcrumb_box {
  height: 40px;
  width: 100%;
  background-color: #f6f8f8;
  border-bottom: 1px solid #eee;
  padding: 15px;
  margin: 0;
  display: flex;
}

.breadcrumb_content {
  font-size: 15px;
  position: absolute;
  margin: auto;
  left: 40px;
}

.user_info_box {
  height: 500px;
  width: 100%;
  background-color: #FFF;
  border-bottom: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.user_info_box_body {
  height: 270px;
  width: 100%;
  padding: 0px;
}

.avatar_img {
  display: inline-block;
  max-width: 100%;
  height: auto;
  padding: 4px;
  margin: 15px;
  line-height: 1.42857143;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  -webkit-transition: all .2s ease-in-out;
  -o-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;
  vertical-align: middle;
  width: 66px;
  border-radius: 50%;
}

.clearfix {
  font-size: 19px;
}

.data-t {
  table-layout: fixed;
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

.data-t th,
.data-t td {
  min-height: 48px;
}

.data-t th {
  width: 70px;
  text-align: center;
  background: url("../assets/img/icon-bg.png") center / 100% no-repeat;
}

.data-t th img {
  width: 40px;
  height: 40px;
}

.data-t td {
  padding-left: 15px;
}

.data-t p {
  margin: 15px 0;
  line-height: 1;
  font-size: 14px;
  color: #000;
}

.data-t p span {
  font-size: 40px;
  font-weight: bold;
  color: #fff;
}

.data-t .eNum {
  font-size: 30px;
  color: black;
}

</style>
<style>
.el-input-group__append,
.el-input-group__prepend {
  padding: 0 !important;
}
.el-collapse-item__header {
  line-height: 16px !important;
}

</style>

<script>
import axios from 'axios'
import SIdentify from '@/components/SIdentify'
export default {
  components: { SIdentify },
  name: "Dashboard",
  data() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();

    return {
      msgText: "",

      rname: '',
      usergroup: 3,

      gonggao_width: '50%',

      username: localStorage.getItem('name'),
      adminPanelLoading: false,
      userinfo_loading: false,
      library_loading: false,
      
      show_digital_array: [],
      show_digital_dialog: false,
      
      now_time: year + "年" + month + "月" + day + "日",
      tool_box: ['1', '2'],
      banwei_tool: 'bookmgr',

      tableData: [],

      library_info: {},

      currentPage: 1,  //默认初始页
      pagesize: 4,    //每页默认显示的数据
      pageCount: 0,   //数据的总条数,如果数据是后端接口返回的，则此值需修改

    };
  },
  methods: {
    drawChart() {
      let myChart = this.$echarts.init(document.getElementById("my_rentChart"));
      axios.get('/userApi/getUserRentChartData', {headers: {'token': localStorage.getItem('ljc_token')}})
        .then(res => {
          
          this.total_data = res.data.data.total
          this.returned_data = res.data.data.returned

          let option = {
            title: {
              text: '借阅情况',
              left: 'center',
              top: 'center'
            },
            series: [
              {
                type: 'pie',
                data: [
                  {
                    value: this.returned_data,
                    name: '已归还'
                  },
                  {
                    value: this.total_data - this.returned_data,
                    name: '未归还'
                  }
                ],
                color: [
                  '#50C878',
                  '#fb7293'
                ],
                radius: ['40%', '70%']
              }
            ],
            tooltip: {
              show: true,
              trigger: 'item'
            }
          };
          myChart.setOption(option);
          window.addEventListener('resize', () => {
            myChart.resize()
          })

        }).catch(err => {
          console.log(err)
        })

    },

    //切换页码
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    //切换页码
    handleCurrentChange_liuyan: function (currentPage) {
      this.currentPage_liuyan = currentPage;
    },
    handleShow(row) {
      this.show_digital_dialog = true
      this.show_digital_array = row
    },
    toRouter(url) {
      this.$router.push(url)
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
          this.userGroupName = res.data.data.userGroupName;
          this.rname = res.data.data.name;


          this.userinfo_loading = false

          // if (this.usergroup != 3) this.$options.methods.getHomeAdminData.bind(this)();
          // else this.adminPanelLoading = false
        }).catch(err => {
          console.log(err)
        })
    },
    getLibraryData() {
      axios.get('/userApi/queryLibraryInfo', {headers: {'token': localStorage.getItem('ljc_token')}})
        .then(res => {
          if (res.data.code != null && res.data.code == 400) {
            this.$message.error('登录状态过期，请重新登录');
            localStorage.clear('ljc_token');
            localStorage.clear('isLogin');
            this.$router.push('/login?refer=' + window.location.pathname)
          }
          else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);

          this.library_info = res.data.data;


          this.library_loading = false

          // if (this.usergroup != 3) this.$options.methods.getHomeAdminData.bind(this)();
          // else this.adminPanelLoading = false
        }).catch(err => {
          console.log(err)
        })
    },
    getNotice() {
      axios.get('/userApi/queryNoticeList', {headers: {'token': localStorage.getItem('ljc_token')}})
        .then(res => {
          if (res.data.code != null && res.data.code == 400) {
            this.$message.error('登录状态过期，请重新登录');
            localStorage.clear('ljc_token');
            localStorage.clear('isLogin');
            this.$router.push('/login?refer=' + window.location.pathname)
          }
          else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);


          this.tableData = res.data.data;

          let current_i = 1;

          this.tableData.forEach(item => {
            item.cid = current_i++
          })


          this.pageCount = res.data.data.length
          this.loading = false
        }).catch(err => {
          console.log(err)
        })
    },
    handleResize() {
      if (window.innerWidth < 992) {
        this.gonggao_width = "100%"
      } else {
        this.gonggao_width = "50%"
      }
    }
  },
  mounted() {
    this.drawChart();
    this.handleResize()
    window.addEventListener("resize", this.handleResize);
  },
  created() {
    this.userinfo_loading = true
    this.library_loading = true
    //this.adminPanelLoading = false
    this.getHomeUserData();
    this.getNotice();
    this.getLibraryData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  }
};
</script>
