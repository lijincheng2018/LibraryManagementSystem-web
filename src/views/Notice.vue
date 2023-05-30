<template>
  <el-main style="padding:0px">
    <div class="breadcrumb_box">
      <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
        <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-button type="primary" @click="dialogVisible = true" plain>发布新公告</el-button>
      <el-table v-loading="loading" :data="tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%">
        <el-table-column prop="cid" label="序号"  min-width="60px" header-align="center" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="title" label="公告标题" min-width="150px"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="content" label="公告内容" min-width="200px"></el-table-column>
        <el-table-column prop="author" label="发布人" min-width="100px" header-align="center" align="center"></el-table-column>
        <el-table-column prop="time" label="发布时间" min-width="160px" header-align="center" align="center"></el-table-column>
        <el-table-column prop="control" label="操作" width="240px" header-align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleShow(scope.row)">查看详情</el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope.row,scope.row.unid)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
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
      <el-dialog title="公告详情" :visible.sync="show_digital_dialog" :width="create_width">
        <span style="font-size:20px;">公告标题：{{show_digital_array.title}}</span><br>
        <span style="font-size:20px;">公告正文：{{show_digital_array.content}}</span><br>
        <span style="font-size:20px;">发布者：{{show_digital_array.author}}</span><br>
        <span style="font-size:20px;">发布时间：{{show_digital_array.time}}</span><br>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="show_digital_dialog = false">确 定</el-button>
        </span>
      </el-dialog>
      
      <el-dialog
        title="发布公告"
        :visible.sync="dialogVisible"
        :width="create_width"
        :before-close="handleClose">
          <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
            <el-form-item label="公告标题" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="公告正文" prop="content">
              <el-input type="textarea" :rows="10" v-model="form.content"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="yz_code">
              <el-input v-model="form.yz_code" placeholder="请输入验证码（不区分大小写）">
                <template slot="append">
                  <div @click="refreshCode">
                    <s-identify :identifyCode="identifyCode"></s-identify>
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onSubmit('form')">确认发布</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog
        title="编辑"
        :visible.sync="show_edit_dialog"
        :width="create_width"
        :before-close="handleClose_edit">
          <el-form ref="edit_form" status-icon :model="edit_digital_array" :rules="rules_edit" label-width="80px">
           <el-form-item label="公告标题" prop="title">
              <el-input v-model="edit_digital_array.title"></el-input>
            </el-form-item>
            <el-form-item label="公告正文" prop="content">
              <el-input type="textarea" :rows="10" v-model="edit_digital_array.content"></el-input>
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
  import SIdentify from '@/components/SIdentify'
  import axios from 'axios'
  export default {
      components: {SIdentify},
      name:'Notice',
      data() {
          var check_yz_code = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入验证码'));
            } else if (value !== this.identifyCode) {
              callback(new Error('验证码错误!'));
            } else {
              callback();
            }
          };
          return {
            loading: true,
            dialogVisible: false,
            show_digital_array: {},
            show_digital_dialog: false,
            show_edit_dialog: false,
            identifyCode: '',
            identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
            tableData: [],

            create_width: '50%',
          
            form:{
              title:'',
              content:'',
              yz_code:''
            },
            edit_digital_array:{
              title:'',
              content:''
            },

            rules: {
              title: [
                { required: true, message: '请输入标题', trigger: 'blur' }
              ],
              content: [
                { required: true, message: '请输入内容', trigger: 'blur' }
              ],
              yz_code:[
                { required: true, validator: check_yz_code, trigger: 'blur'}
              ]
            },
            rules_edit: {
              title: [
                { required: true, message: '请输入标题', trigger: 'blur' }
              ],
              content: [
                { required: true, message: '请输入内容', trigger: 'blur' }
              ],
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
        handleShow(row) {
          this.show_digital_array = row
          this.show_digital_dialog = true
        },
        handleEdit(row){
          this.show_edit_dialog = true
          this.edit_digital_array = JSON.parse(JSON.stringify(row))
        },
        handleClose(done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              this.$refs['form'].resetFields();
              this.checkAll = false;
              this.isALL = false;
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
        onSubmit(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data = new FormData();

              data.append('title', this.form.title);
              data.append('content', this.form.content);

              this.axios({
                method:"post",
                url: '/userApi/addNotice',
                data: data,
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
                    let new_data = res.data.data;
                    this.$set(new_data, 'cid', 1);
                    for(let i=0;i<this.tableData.length;i++) {
                      this.$set(this.tableData[i], 'cid', this.tableData[i].cid + 1);
                    }

                    this.tableData.unshift(new_data);
                    this.$message.success('公告发布成功！');
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
              let data = new FormData();

              data.append('id', this.edit_digital_array.id);
              data.append('title', this.edit_digital_array.title);
              data.append('content', this.edit_digital_array.content);

              this.axios({
                method:"post",
                url: '/userApi/updateNotice',
                data: data,
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
          this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios.get('/userApi/delNotice',{params:{id:formdata.id}, headers: {'token': localStorage.getItem('ljc_token')}})
              .then(res => {
                if (res.data.code != null && res.data.code == 400) {
                  this.$message.error('登录状态过期，请重新登录');
                  localStorage.clear('ljc_token');
                  localStorage.clear('isLogin');
                  this.$router.push('/login?refer=' + window.location.pathname)
                }
                else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);

                if(res.data.code == 200) {
                  this.$message({
                    type: 'success',
                    message: '删除公告：“'+formdata.title+'”成功!'
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
        refreshCode () {
            this.identifyCode = ''
            this.makeCode(this.identifyCodes,4);
        },
        makeCode (o,l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
            }
        },
        randomNum (min, max) {
            return Math.floor(Math.random() * (max - min) + min)
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
            this.create_width = "100%"
          } else {
            this.create_width = "50%"
          }
        }
      },
      mounted(){
        this.identifyCode = ''
        this.makeCode(this.identifyCodes,4)

        this.handleResize()
        window.addEventListener("resize", this.handleResize);
      },
      created(){
        this.loading = true
        this.getNotice()
      },
      beforeDestroy() {
        window.removeEventListener("resize", this.handleResize);
      }
  };
</script>
