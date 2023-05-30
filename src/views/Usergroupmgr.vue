<template>
    <el-main style="padding:0px">
      <div class="breadcrumb_box">
        <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
          <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
          <el-breadcrumb-item>用户组管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main>
        <el-button type="primary" @click="dialogVisible = true" plain>新增用户组</el-button>
        <el-table v-loading="loading" :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%">
          <el-table-column prop="cid" label="序号" width="100px" header-align="center" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="groupName" label="用户组名称" min-width="100px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="maxDay" label="最大借阅时间" min-width="120px" header-align="center" align="center">
            <template slot-scope="scope">
              {{ scope.row.maxDay }}级
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="maxRent" label="最大借阅书本数" min-width="120px" header-align="center" align="center"></el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDel(scope.row)" :disabled="scope.row.id === 1 || scope.row.id === 2 || scope.row.id === 3 || scope.row.id === 4">
                {{ scope.row.id === 1 || scope.row.id === 2 || scope.row.id === 3 || scope.row.id === 4 ? '不可删除' : '删除'}}
              </el-button>
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
          title="新增用户组"
          :visible.sync="dialogVisible"
          :width="create_width"
          :before-close="handleClose">
            <el-form ref="form" status-icon :model="form" :rules="rules" label-width="120px">
              <el-form-item label="用户组名称" prop="groupName">
                <el-input v-model="form.groupName"></el-input>
              </el-form-item>
              <el-form-item label="最大借阅时间" prop="maxDay">
                <el-input-number v-model="form.maxDay" :min="1" :max="4" label="借阅时间级数"></el-input-number>
                <ul style="line-height: 20px; margin-top: 10px;">
                  <li>1级允许借7天</li>
                  <li>2级允许借7、14天</li>
                  <li>3级允许借7、14、30天</li>
                  <li>4级允许借7、14、30、60天</li>
                </ul>
              </el-form-item>
              <el-form-item label="最大借阅书本数" prop="maxRent">
                <el-input v-model="form.maxRent"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit('form')">确认增加</el-button>
            <el-button @click="handleClose">取 消</el-button>
          </span>
        </el-dialog>
  
        <el-dialog
          title="编辑分类"
          :visible.sync="show_edit_dialog"
          :width="create_width"
          :before-close="handleClose_edit">
            <el-form ref="edit_form" status-icon :model="edit_digital_array" :rules="rules" label-width="120px">
              <el-form-item label="用户组名称" prop="groupName">
                <el-input v-model="edit_digital_array.groupName"></el-input>
              </el-form-item>
              <el-form-item label="最大借阅时间" prop="maxDay">
                <el-input-number v-model="edit_digital_array.maxDay" :min="1" :max="4" label="借阅时间级数"></el-input-number>
                <ul style="line-height: 20px; margin-top: 10px;">
                  <li>1级允许借7天</li>
                  <li>2级允许借7、14天</li>
                  <li>3级允许借7、14、30天</li>
                  <li>4级允许借7、14、30、60天</li>
                </ul>
              </el-form-item>
              <el-form-item label="最大借阅书本数" prop="maxRent">
                <el-input v-model="edit_digital_array.maxRent"></el-input>
              </el-form-item>
            </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmitToEdit('edit_form')">确认修改</el-button>
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
              disabled: false,
  
              create_width: '50%',
  
  
              form: {
                groupName: '',
                maxDay: '1',
                maxRent: ''
              },
              
              rules: {
                groupName: [
                  { required: true, message: '请输入用户组名称', trigger: 'blur' }
                ],
                maxDay: [
                  { required: true, message: '请输入最大借阅时间', trigger: 'blur' }
                ],
                maxRent: [
                  { required: true, message: '请输入最大借阅数量', trigger: 'blur' }
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
                  url: '/userApi/addUserGroup',
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
                        groupName: res.data.data.groupName,
                        maxDay: res.data.data.maxDay,
                        maxRent: res.data.data.maxRent
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
                  url: '/userApi/updateUserGroup',
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
            this.$confirm('此操作将永久删除该用户组, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/userApi/delUserGroup',{params:{id:formdata.id}, headers: {'token': localStorage.getItem('ljc_token')}})
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
                      message: '删除分类：“'+formdata.groupName+'”成功!'
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
          }
        },
        mounted() {
          this.handleResize()
          window.addEventListener("resize", this.handleResize);
        },
        created() {
          this.loading = true
          this.queryUserGroup()
        },
        beforeDestroy() {
          window.removeEventListener("resize", this.handleResize);
        }
      
    };
  </script>
  