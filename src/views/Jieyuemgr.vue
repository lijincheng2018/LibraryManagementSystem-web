<template>
    <el-main style="padding:0px">
      <div class="breadcrumb_box">
        <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
          <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
          <el-breadcrumb-item>借阅管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main>
        <el-button type="primary" @click="dialogVisible = true" plain>添加借阅</el-button>
        <el-button type="success" @click="exportToExcel" :disabled="disabled" plain>导出数据</el-button><br><br>
        <el-input v-model="inputContent" placeholder="请输入借阅者或图书名称进行查询" prefix-icon="el-icon-search" style="width: 500px;"></el-input>&nbsp;
        <el-button icon="el-icon-search" type="primary" plain @click="searchput">搜索</el-button><br><br>
        <el-table v-loading="loading" :data="tables[0].slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%">
          <el-table-column prop="cid" label="序号" min-width="60px" header-align="center" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="rentUser" label="借阅者" min-width="80px"></el-table-column>
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

          <el-table-column label="操作" width="240px">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDel(scope.row)" >删除</el-button>
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
        <el-dialog
          title="新增图书"
          :visible.sync="dialogVisible"
          :width="create_width"
          :before-close="handleClose">
            <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
              <el-form-item label="借阅者" prop="rentUser">
                <el-select v-model="form.rentUser" filterable placeholder="请选择">
                  <el-option v-for="(item, index) in users" :key="index" :label="item.userName" :value="item.userName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="借阅图书" prop="bookId">
                <el-select v-model="form.bookId" filterable placeholder="请选择">
                  <el-option v-for="(item, index) in books" :key="index" :label="item.bookName" :value="item.bookId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="借阅时间" prop="rentTime">
                <el-date-picker v-model="form.rentTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  placeholder="选择时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="归还时间" prop="returnTime">
                <el-date-picker v-model="form.returnTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  placeholder="选择时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="借阅状态" prop="rentStatus">
                <el-select v-model="form.rentStatus" filterable placeholder="请选择">
                  <el-option label="未归还" value="1"></el-option>
                  <el-option label="已归还" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit('form')">确认增加</el-button>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
          </span>
        </el-dialog>
  
        <el-dialog
          title="编辑"
          :visible.sync="show_edit_dialog"
          :width="create_width"
          :before-close="handleClose_edit">
            <el-form ref="edit_form" status-icon :model="edit_digital_array" :rules="rules" label-width="80px">
              <el-form-item label="借阅者" prop="rentUser">
                <el-select v-model="edit_digital_array.rentUser" filterable placeholder="请选择" :disabled="true">
                  <el-option v-for="(item, index) in users" :key="index" :label="item.userName" :value="item.userName">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="借阅图书" prop="bookId">
                <el-select v-model="edit_digital_array.bookId" filterable placeholder="请选择" :disabled="true">
                  <el-option v-for="(item, index) in books" :key="index" :label="item.bookName" :value="item.bookId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="借阅时间" prop="rentTime">
                <el-date-picker v-model="edit_digital_array.rentTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  placeholder="选择时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="归还时间" prop="returnTime">
                <el-date-picker v-model="edit_digital_array.returnTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  placeholder="选择时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="借阅状态" prop="rentStatus">
                <el-select v-model="edit_digital_array.rentStatus" filterable placeholder="请选择">
                  <el-option label="未归还" value="1"></el-option>
                  <el-option label="已归还" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmitToEdit('edit_form')">确认修改</el-button>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose_edit">取 消</el-button>
          </span>
        </el-dialog>
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
        name:'Document',
        data() {
            return {
              dialogVisible: false,
              show_digital_dialog: false,
              show_edit_dialog: false,
              show_digital_array: {},
              edit_digital_array: {},
              loading: true,
              tableData: [],
              bookClassList: [],
              disabled: false,
  
              create_width: '50%',
  
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
              },

              users: [],
              books: [],
  
              form: {
                rentUser: '',
                bookId: '',
                rentTime: '',
                returnTime: '',
                rentStatus: ''
              },

              searchContent: '',
              inputContent: '',

              rules: {
                rentUser: [
                  { required: true, message: '请选择借阅者', trigger: 'change' }
                ],
                bookId: [
                  { required: true, message: '请选择借阅图书', trigger: 'change' }
                ],
                rentTime: [
                  { required: true, message: '请选择借阅时间', trigger: 'change' }
                ],
                returnTime: [
                  { required: true, message: '请选择归还时间', trigger: 'change' }
                ],
                rentStatus: [
                  { required: true, message: '请选择借阅状态', trigger: 'change' }
                ]
              },
              
            
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
          handleClose(done) {
            this.$confirm('确认关闭？')
              .then(_ => {
                this.$refs['form'].resetFields();
                this.dialogVisible = false;
                done();
              })
              .catch(_ => {});
          },
          handleClose_edit(done) {
            this.$confirm('确认关闭？')
              .then(_ => {
                this.$refs['edit_form'].resetFields();
                this.show_edit_dialog = false;
                done();
              })
              .catch(_ => {});
          },
          handleShow(row) {
            this.show_digital_dialog = true
            this.show_digital_array = row
          },
          handleEdit(row){
            this.show_edit_dialog = true
            this.edit_digital_array = JSON.parse(JSON.stringify(row))
          },
          onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.axios({
                  method:"post",
                  url: '/userApi/addRentList',
                  data: this.form,
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': localStorage.getItem('ljc_token')
                  }
                })
                  .then(res => {
                    if (res.data.code != null && res.data.code == 400) {
                      this.$message.error('登录状态过期，请重新登录');
                      localStorage.clear('ljc_token');
                      localStorage.clear('isLogin');
                      this.$router.push('/login?refer=' + window.location.pathname)
                    }
                    else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
  
                    if(res.data.code == 200) {
                      let new_data = {
                        cid: this.tableData.length + 1,
                        id: res.data.data.id,
                        bookId: res.data.data.bookId,
                        rentTime: res.data.data.rentTime,
                        returnTime: res.data.data.returnTime,
                        rentUser: res.data.data.rentUser,
                        rentDuration: res.data.data.rentDuration,
                        rentStatus: res.data.data.rentStatus,
                        bookName: res.data.data.bookName
                      }

                      this.tableData.push(new_data);
                      this.$message.success('添加成功！');
                      this.$refs[formName].resetFields();
                      this.dialogVisible = false;
                    }
                  }).catch(err => {
                    console.log(err)
                  })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          onSubmitToEdit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.axios({
                  method:"post",
                  url: '/userApi/updateRentList',
                  data: this.edit_digital_array,
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': localStorage.getItem('ljc_token')
                  }
                })
                  .then(res => {
                    if (res.data.code != null && res.data.code == 400) {
                      this.$message.error('登录状态过期，请重新登录');
                      localStorage.clear('ljc_token');
                      localStorage.clear('isLogin');
                      this.$router.push('/login?refer=' + window.location.pathname)
                    }
                    else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
                    
                    if(res.data.code == 200) {
                      for(let i=0;i<this.bookClassList.length;i++) {
                        if(this.bookClassList[i].id == this.edit_digital_array.bookClass) {
                          this.edit_digital_array.bookClassName = this.bookClassList[i].bookClass
                        }
                      }

                      for(var i=0;i<this.tableData.length;i++) {
                        if(this.tableData[i].id == this.edit_digital_array.id) {
                          this.tableData[i] = JSON.parse(JSON.stringify(this.edit_digital_array))
                          break;
                        }
                      }
                      
                      this.$message.success('修改成功！');
                      this.$refs[formName].resetFields();
                      this.show_edit_dialog = false;
                    }
                  }).catch(err => {
                    console.log(err)
                  })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          handleDel(formdata) {
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/userApi/delRent',{params:{id:formdata.id}, headers: {'token': localStorage.getItem('ljc_token')}})
                .then(res => {
                  if(res.data.code != null && res.data.code == 400) {
                    if (res.data.code != null && res.data.code == 400) {
                        this.$message.error('登录状态过期，请重新登录');
                        localStorage.clear('ljc_token');
                        localStorage.clear('isLogin');
                        this.$router.push('/login?refer=' + window.location.pathname)
                    }
                    else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
                  }
  
                  if(res.data.code == 200) {
                    this.$message({
                      type: 'success',
                      message: '删除记录成功!'
                    });
                    for(var i=0;i<this.tableData.length;i++) {
                      if(this.tableData[i].cid == formdata.cid) {
                        this.tableData.splice(i, 1);
                        for(var j=i;j<this.tableData.length;j++) {
                          this.tableData[j].cid--;
                        }
                        break;
                      }
                    }
                  } else {
                    this.$message.error('失败：' + res.data.msg)
                  }
                }).catch(err => {
                  console.log(err)
                })
            })
          },
          queryUserList() {
            axios.get('/userApi/getAllUserData', {headers: {'token': localStorage.getItem('ljc_token')}})
              .then(res => {
                if (res.data.code != null && res.data.code == 400) {
                    this.$message.error('登录状态过期，请重新登录');
                    localStorage.clear('ljc_token');
                    localStorage.clear('isLogin');
                    this.$router.push('/login?refer=' + window.location.pathname)
                }
                else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
                
                
                this.users = res.data.data
              }).catch(err => {
                console.log(err)
              })

            axios.get('/userApi/queryAllBook', {headers: {'token': localStorage.getItem('ljc_token')}})
              .then(res => {
                if (res.data.code != null && res.data.code == 400) {
                    this.$message.error('登录状态过期，请重新登录');
                    localStorage.clear('ljc_token');
                    localStorage.clear('isLogin');
                    this.$router.push('/login?refer=' + window.location.pathname)
                }
                else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
                
                
                this.books = res.data.data
              }).catch(err => {
                console.log(err)
              })
          },
          exportToExcel() {
            this.disabled = true
            let loading = Loading.service({
              text: '数据生成中，请稍后...',
              background: 'rgba(0,0,0,.5)'
            })
             let arr = this.tableData.map(item => {
                let isReturn;
                if(item.isReturn == 1) isReturn = '未归还';
                if(item.isReturn == 2) isReturn = '已归还';
  
                return {
                  序号: item.cid,
                  借阅者: item.rentUser,
                  借阅图书: item.bookName,
                  借阅时间: item.rentTime,
                  归还时间: item.returnTime,
                  借阅时长: item.rentDuration,
                  借阅状态: isReturn
                }
              })
              
  
            //const data = this.tableData // 表格数据
            const ws = XLSX.utils.json_to_sheet(arr)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, '借阅列表')
            XLSX.writeFile(wb, `借阅列表${new Date().getTime()}.xlsx`)
  
            loading.close()
            this.disabled = false
          },
          queryAllRent() {
            axios.get('/userApi/queryRentList', {headers: {'token': localStorage.getItem('ljc_token')}})
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
          handleResize() {   
            if (window.innerWidth < 992) {
              this.create_width = "100%"
            } else {
              this.create_width = "50%"
            }
          },
          searchput() {
            this.searchContent = this.inputContent
          }
        },
        mounted() {
          this.handleResize()
          window.addEventListener("resize", this.handleResize);
        },
        created() {
          this.loading = true
          this.queryUserList()
          this.queryAllRent()
        },
        beforeDestroy() {
          window.removeEventListener("resize", this.handleResize);
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
  