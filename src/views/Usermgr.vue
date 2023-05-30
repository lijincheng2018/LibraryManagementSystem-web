<template>
    <el-main style="padding:0px">
      <div class="breadcrumb_box">
        <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
          <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main>
        <el-button type="primary" @click="dialogVisible = true" plain>新增用户</el-button>
        <el-button type="success" @click="exportToExcel" :disabled="disabled" plain>导出数据</el-button><br><br>
        <el-input v-model="inputContent" placeholder="请输入用户名或姓名进行查询" prefix-icon="el-icon-search" style="width: 500px;"></el-input>&nbsp;
        <el-button icon="el-icon-search" type="primary" plain @click="searchput">搜索</el-button><br><br>
        <el-table v-loading="loading" :data="tables[0].slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%">
          <el-table-column prop="id" label="序号" min-width="60px" header-align="center" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="userName" label="用户名" min-width="100px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="姓名" min-width="100px"></el-table-column>
          <el-table-column prop="userGroupName" label="用户权限" header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.userGroup === '1'" size="medium" type="warning">{{ scope.row.userGroupName }}</el-tag>
              <el-tag v-else size="medium" type="primary">{{ scope.row.userGroupName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="340px">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleShow(scope.row)">查看详情</el-button>
              <el-button size="mini" type="info" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="primary" @click="handleRestPasswd(scope.row)">重置密码</el-button>
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
          title="新增用户"
          :visible.sync="dialogVisible"
          :width="create_width"
          :before-close="handleClose">
            <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="form.userName"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="用户权限" prop="userGroup">
                <el-select v-model="form.userGroup" placeholder="用户权限">
                  <el-option v-for="(item, index) in userGroupList" :key="index" :label="item.groupName" :value="item.id"></el-option>
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
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="edit_digital_array.userName"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="edit_digital_array.name"></el-input>
              </el-form-item>
              <el-form-item label="用户权限" prop="userGroup">
                <el-select v-model="edit_digital_array.userGroup" placeholder="用户权限">
                  <el-option v-for="(item, index) in userGroupList" :key="index" :label="item.groupName" :value="item.id"></el-option>
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
  
        <el-dialog title="图书详情" :visible.sync="show_digital_dialog" :width="create_width">
          <span>ID：{{show_digital_array.userId}}</span><br>
          <span>用户名：{{show_digital_array.userName}}</span><br>
          <span>姓名：{{show_digital_array.name}}</span><br>
          <span>用户权限：{{show_digital_array.userGroup === '1' ? '管理员' : '普通用户'}}</span><br>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="show_digital_dialog = false">确 定</el-button>
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

              searchContent: '',
              inputContent: '',
  
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
              },
  
              form: {
                userName: '',
                name: '',
                userGroup: 2
              },

              userGroupList: [],
              
              rules: {
                userName: [
                  { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                name: [
                  { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                userGroup: [
                  { required: true, message: '请选择用户权限', trigger: 'change' }
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
            this.edit_digital_array.userGroup = parseInt(this.edit_digital_array.userGroup)
          },
          onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.axios({
                  method:"post",
                  url: '/userApi/addUser',
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
                        id: this.tableData.length + 1,
                        userId: res.data.data.userId,
                        userName: res.data.data.userName,
                        name: res.data.data.name,
                        userGroup: res.data.data.userGroup,
                        userGroupName: res.data.data.userGroupName
                      }
                      this.tableData.push(new_data);
                      this.$message.success('添加成功！默认密码为123456');
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
                  url: '/userApi/updateUserInfo',
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
                      for(let i=0;i<this.tableData.length;i++) {
                        if(this.tableData[i].id == this.edit_digital_array.id) {
                          this.userGroupList.forEach(item => {
                            if(item.id == this.edit_digital_array.userGroup) {
                              this.edit_digital_array.userGroupName = item.groupName
                            }
                          })
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
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/userApi/delUser',{params:{id:formdata.userId}, headers: {'token': localStorage.getItem('ljc_token')}})
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
                      message: '删除用户：“'+formdata.userName+'”成功!'
                    });
                    for(var i=0;i<this.tableData.length;i++) {
                      if(this.tableData[i].id == formdata.id) {
                        this.tableData.splice(i, 1);
                        for(var j=i;j<this.tableData.length;j++) {
                          this.tableData[j].id--;
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
          handleRestPasswd(formdata) {
            this.$confirm('此操作将会重置该用户（'+ formdata.userName +'）密码, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/userApi/resetUserPass',{params:{id:formdata.userId}, headers: {'token': localStorage.getItem('ljc_token')}})
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
                      message: '密码重置成功！新密码为123456'
                    });
                  } else {
                    this.$message.error('失败：' + res.data.msg)
                  }
                }).catch(err => {
                  console.log(err)
                })
            })
          },
          exportToExcel() {
            this.disabled = true
            let loading = Loading.service({
              text: '数据生成中，请稍后...',
              background: 'rgba(0,0,0,.5)'
            })
             let arr = this.tableData.map(item => {
 
                return {
                  序号: item.id,
                  用户名: item.userName,
                  姓名: item.name,
                  用户权限: item.userGroupName,
                  默认密码: '123456'
                }
              })
              
  
            //const data = this.tableData // 表格数据
            const ws = XLSX.utils.json_to_sheet(arr)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, '用户列表')
            XLSX.writeFile(wb, `用户列表${new Date().getTime()}.xlsx`)
  
            loading.close()
            this.disabled = false
          },
          queryAllUser() {
            axios.get('/userApi/getAllUserData', {headers: {'token': localStorage.getItem('ljc_token')}})
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
                  item.id = current_i++
                })

                this.pageCount = res.data.data.length
                this.loading = false
              }).catch(err => {
                console.log(err)
              })
          },
          queryUserGroup() {
            axios.get('/userApi/queryUserGroup', {headers: {'token': localStorage.getItem('ljc_token')}})
              .then(res => {
                if (res.data.code != null && res.data.code == 400) {
                    this.$message.error('登录状态过期，请重新登录');
                    localStorage.clear('ljc_token');
                    localStorage.clear('isLogin');
                    this.$router.push('/login?refer=' + window.location.pathname)
                }
                else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
                
                this.userGroupList = res.data.data

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
          this.queryAllUser()
          this.queryUserGroup()
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
  