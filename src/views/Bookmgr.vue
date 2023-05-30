<template>
    <el-main style="padding:0px">
      <div class="breadcrumb_box">
        <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
          <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
          <el-breadcrumb-item>图书管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-main>
        <el-button type="primary" @click="dialogVisible = true" plain>新增图书</el-button>
        <el-button type="success" @click="exportToExcel" :disabled="disabled" plain>导出数据</el-button>
        <br><br>
        <el-input v-model="inputContent" placeholder="请输入图书名称或ISBN进行查询" prefix-icon="el-icon-search" style="width: 500px;"></el-input>&nbsp;
        <el-button icon="el-icon-search" type="primary" plain @click="searchput">搜索</el-button><br><br>
        <el-table v-loading="loading" :data="tables[0].slice((currentPage - 1) * pagesize, currentPage * pagesize)" style="width: 100%">
          <el-table-column prop="id" label="序号" min-width="60px" header-align="center" align="center"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="bookName" label="图书名称" min-width="200px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="bookAuthor" label="作者" header-align="center" align="center"></el-table-column>
          <el-table-column prop="bookISBN" label="ISBN" min-width="120px" header-align="center" align="center"></el-table-column>
          <el-table-column prop="bookAllNum" label="总量" min-width="60px" header-align="center" align="center"></el-table-column>
          <el-table-column prop="bookLeftNum" label="余量" min-width="60px" header-align="center" align="center"></el-table-column>

          <el-table-column prop="bookClassName" label="图书类型" header-align="center" align="center"></el-table-column>
          <el-table-column prop="bookClassName" label="是否开放借阅" min-width="120px"  header-align="center" align="center">
            <template slot-scope="scope">
              <el-tag v-show="scope.row.isOpen === '1'" type="success" size="medium">开放借阅</el-tag>
              <el-tag v-show="scope.row.isOpen === '0'" type="danger" size="medium">不开放借阅</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240px">
            <template slot-scope="scope">
              <el-button size="mini" type="success" @click="handleShow(scope.row)">查看详情</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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
            <el-form ref="form" status-icon :model="form" :rules="rules" label-width="120px">
              <el-form-item label="图书名称" prop="bookName">
                <el-input v-model="form.bookName"></el-input>
              </el-form-item>
              <el-form-item label="作者" prop="bookAuthor">
                <el-input v-model="form.bookAuthor"></el-input>
              </el-form-item>
              <el-form-item label="ISBN" prop="bookISBN">
                <el-input v-model="form.bookISBN"></el-input>
              </el-form-item>
              <el-form-item label="总量" prop="bookAllNum">
                <el-input v-model="form.bookAllNum"></el-input>
              </el-form-item>
              <el-form-item label="图书类型" prop="bookClass">
                <el-select v-model="form.bookClass" placeholder="图书类型">
                  <el-option v-for="(item, index) in bookClassList" :key="index" :label="item.bookClass" :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否开放借阅" prop="isOpen">
                <el-select v-model="form.isOpen" placeholder="是否开放借阅">
                  <el-option label="开放借阅" value="1" ></el-option>
                  <el-option label="不开放借阅" value="0" ></el-option>
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
            <el-form ref="edit_form" status-icon :model="edit_digital_array" :rules="rules" label-width="120px">
              <el-form-item label="图书名称" prop="bookName">
                <el-input v-model="edit_digital_array.bookName"></el-input>
              </el-form-item>
              <el-form-item label="作者" prop="bookAuthor">
                <el-input v-model="edit_digital_array.bookAuthor"></el-input>
              </el-form-item>
              <el-form-item label="ISBN" prop="bookISBN">
                <el-input v-model="edit_digital_array.bookISBN"></el-input>
              </el-form-item>
              <el-form-item label="总量" prop="bookAllNum">
                <el-input v-model="edit_digital_array.bookAllNum"></el-input>
              </el-form-item>
              <el-form-item label="图书类型" prop="bookClass">
                <el-select v-model="edit_digital_array.bookClass" placeholder="图书类型">
                  <el-option v-for="(item, index) in bookClassList" :key="index" :label="item.bookClass" :value="item.id" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否开放借阅" prop="isOpen">
                <el-select v-model="edit_digital_array.isOpen" placeholder="是否开放借阅">
                  <el-option label="开放借阅" value="1" ></el-option>
                  <el-option label="不开放借阅" value="0" ></el-option>
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
          <span>ID：{{show_digital_array.bookId}}</span><br>
          <span>图书名称：{{show_digital_array.bookName}}</span><br>
          <span>作者：{{show_digital_array.bookAuthor}}</span><br>
          <span>ISBN：{{show_digital_array.bookISBN}}</span><br>
          <span>图书类型：{{ show_digital_array.bookClassName }}</span><br>
          <span>总量：{{show_digital_array.bookAllNum}}</span><br>
          <span>余量：{{show_digital_array.bookLeftNum}}</span><br>
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
  
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                },
              },
  
              form: {
                bookName: '',
                bookAuthor: '',
                bookISBN: '',
                bookAllNum: '',
                bookClass: '',
                isOpen: '1'
              },

              searchContent: '',
              inputContent: '',
              
              rules: {
                bookName: [
                  { required: true, message: '请输入图书名称', trigger: 'blur' }
                ],
                bookAuthor: [
                  { required: true, message: '请输入作者', trigger: 'blur' }
                ],
                bookISBN: [
                  { required: true, message: '请输入ISBN', trigger: 'blur' }
                ],
                bookAllNum: [
                  { required: true, message: '请输入总量', trigger: 'blur' }
                ],
                bookClass: [
                  { required: true, message: '请选择记录类型', trigger: 'change' }
                ],
                isOpen: [
                  { required: true, message: '请选择是否开放借阅', trigger: 'change' }
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
            this.edit_digital_array.bookClass = parseInt(this.edit_digital_array.bookClass)
          },
          onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.axios({
                  method:"post",
                  url: '/userApi/addBook',
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
                        bookId: res.data.data.bookId,
                        bookName: res.data.data.bookName,
                        bookAuthor: res.data.data.bookAuthor,
                        bookISBN: res.data.data.bookISBN,
                        bookClass: res.data.data.bookClass,
                        bookAllNum: res.data.data.bookAllNum,
                        bookCostNum: res.data.data.bookCostNum,
                        bookLeftNum: parseInt(res.data.data.bookAllNum) - parseInt(res.data.data.bookCostNum),
                        isOpen: res.data.data.isOpen
                      }
                      for(let i=0;i<this.bookClassList.length;i++) {
                        if(this.bookClassList[i].id == new_data.bookClass) {
                          new_data.bookClassName = this.bookClassList[i].bookClass
                        }
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
                  url: '/userApi/updateBook',
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
            this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              axios.get('/userApi/delBook',{params:{id:formdata.bookId}, headers: {'token': localStorage.getItem('ljc_token')}})
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
                      message: '删除记录：“'+formdata.bookName+'”成功!'
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
          exportToExcel() {
            this.disabled = true
            let loading = Loading.service({
              text: '数据生成中，请稍后...',
              background: 'rgba(0,0,0,.5)'
            })
             let arr = this.tableData.map(item => {
                let jieyue;
                if(item.isOpen == 1) jieyue = '开放借阅';
                if(item.isOpen == 0) jieyue = '不开放借阅';
  
                return {
                  序号: item.id,
                  图书名称: item.bookName,
                  作者: item.bookAuthor,
                  ISBN: item.bookISBN,
                  总量: item.bookAllNum,
                  余量: item.bookLeftNum,
                  图书类型: item.bookClassName,
                  是否开放借阅: jieyue
                }
              })
              
  
            //const data = this.tableData // 表格数据
            const ws = XLSX.utils.json_to_sheet(arr)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, '图书列表')
            XLSX.writeFile(wb, `图书列表${new Date().getTime()}.xlsx`)
  
            loading.close()
            this.disabled = false
          },
          queryAllBook() {
            axios.get('/userApi/queryAllBook', {headers: {'token': localStorage.getItem('ljc_token')}})
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
                  item.bookLeftNum = parseInt(item.bookAllNum) - parseInt(item.bookCostNum)
                  item.id = current_i++
                  for(let i=0;i<this.bookClassList.length;i++) {
                    if(this.bookClassList[i].id == item.bookClass) {
                      item.bookClassName = this.bookClassList[i].bookClass
                    }
                  }
                })

                this.pageCount = res.data.data.length
                this.loading = false
              }).catch(err => {
                console.log(err)
              })
          },
          queryBookClass() {
            axios.get('/userApi/queryAllBookClass', {headers: {'token': localStorage.getItem('ljc_token')}})
              .then(res => {
                if (res.data.code != null && res.data.code == 400) {
                    this.$message.error('登录状态过期，请重新登录');
                    localStorage.clear('ljc_token');
                    localStorage.clear('isLogin');
                    this.$router.push('/login?refer=' + window.location.pathname)
                }
                else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
                
                
                this.bookClassList = res.data.data
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
          this.queryBookClass()
          this.queryAllBook()
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
  