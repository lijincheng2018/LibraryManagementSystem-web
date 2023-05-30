<template>
    <el-main style="padding:0px">
      <div class="breadcrumb_box">
        <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
          <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
          <el-breadcrumb-item>我的借阅记录</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main>
        <el-input v-model="inputContent" placeholder="请输入图书名称或借阅时间进行查询" prefix-icon="el-icon-search" style="width: 500px;"></el-input>&nbsp;
        <el-button icon="el-icon-search" type="primary" plain @click="searchput">搜索</el-button><br><br>

        <el-table v-loading="loading" :data="tables[0].slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%">
          <el-table-column prop="cid" label="序号" min-width="60px" header-align="center" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="bookName" label="借阅图书" min-width="180px" header-align="left" align="left"></el-table-column>
          <el-table-column prop="rentTime" label="借阅时间" min-width="120px" header-align="center" align="center"></el-table-column>
          <el-table-column prop="returnTime" label="归还时间"  min-width="120px" header-align="center" align="center"></el-table-column>
          <el-table-column prop="rentDuration" label="借阅时长" min-width="60px" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.rentDuration }}天
            </template>
          </el-table-column>
          <el-table-column prop="status" label="借阅状态" min-width="60px" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-show="scope.row.rentStatus === '1'" type="danger" size="small">未归还</el-tag>
              <el-tag v-show="scope.row.rentStatus === '2'" type="success" size="small">已归还</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pager-count="7"
          :current-page="currentPage"
          :page-sizes="[10,20,30,50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length > 0 ? tableData.length : null"
          background
          style="float: right; margin-top: 20px"
        >
        </el-pagination>
      </el-main>
    </el-main>
  </template>
  
  <style scoped>
      .breadcrumb_box{
        height: 40px;
        width: 100%;
        background-color: #f6f8f8;
        border-bottom: 1px solid #eee;
        padding: 15px;
        margin: 0;
        display: flex;
      }
      .breadcrumb_content{
        font-size: 15px;
        position: absolute;
        margin: auto;
        left: 40px;
      }
      
  </style>
  
  <script>
    import axios from 'axios'
    import * as XLSX from 'xlsx'
    import { Loading } from 'element-ui'
  
    export default {
        name:'Myrentlist',
        data() {
            return {
              loading: true,
              tableData: [],

              searchContent: '',
              inputContent: '',

            
              currentPage: 1,  //默认初始页
              pagesize: 10,    //每页默认显示的数据
              pageCount: 0,   //数据的总条数,如果数据是后端接口返回的，则此值需修改
  
            };
        },
        methods: {
          handleSizeChange: function (size) {
            this.pagesize = size;
          },
          //切换页码
          handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
          },
          queryAllRent() {
            axios.get('/userApi/queryUserRentList', {headers: {'token': localStorage.getItem('ljc_token')}})
              .then(res => {
                if (res.data.code != null && res.data.code == 400) {
                    this.$message.error('登录状态过期，请重新登录');
                    localStorage.clear('ljc_token');
                    localStorage.clear('isLogin');
                    this.$router.push('/login?refer=' + window.location.pathname)
                }
                else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
                
                
                this.tableData = res.data.data
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
          searchput() {
            this.searchContent = this.inputContent
          }
        },
        mounted() {
        },
        created() {
          this.loading = true
          this.queryAllRent()
        },
        beforeDestroy() {
        },
        computed: {
          tables() {
            const search = this.searchContent;

            if (this.inputContent == '') {
              this.searchContent = ''
              this.currentPage = 1
              return [this.tableData, this.count = this.tableData.length];
            }
            if (search !== '') {
              return [this.tableData.filter((dataNews) => {
                return Object.keys(dataNews).some((key) => {
                  return String(dataNews[key]).toLowerCase().indexOf(search) > -1;
                });
              }),
              this.count = this.tableData.filter((dataNews) => {
                return Object.keys(dataNews).some((key) => {
                  return String(dataNews[key]).toLowerCase().indexOf(search) > -1;
                });
              }).length];
            }
            return [this.tableData, this.count = this.tableData.length];
          }
        }
      
    };
  </script>
  