<template>
  <el-main style="padding:0px">
    <div class="breadcrumb_box">
      <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
        <el-breadcrumb-item :to="{ path: '/user/dashboard' }">图书管理系统</el-breadcrumb-item>
        <el-breadcrumb-item>借阅中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <div style="padding-top: 0;">
        你共可以借阅<span style="color: red;"><b>{{ userPower.maxRent }}</b></span>本书，已经借阅<span style="color: red;"><b>{{ userPower.rentNum }}</b></span>本书
      </div>
      <el-input v-model="inputContent" placeholder="请输入图书名称或ISBN码进行查询" prefix-icon="el-icon-search" style="width: 500px;"></el-input>&nbsp;
      <el-button icon="el-icon-search" type="primary" plain @click="searchput">搜索</el-button><br><br>

      <el-table v-loading="loading" :data="tables[0].slice((currentPage - 1) * pagesize, currentPage * pagesize)"
        style="width: 100%">
        <el-table-column prop="id" label="序号" min-width="60px" header-align="center" align="center"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="bookName" label="图书名称" min-width="200px"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="bookAuthor" label="作者" header-align="center"
          align="center"></el-table-column>
        <el-table-column prop="bookISBN" label="ISBN" min-width="120px" header-align="center"
          align="center"></el-table-column>
        <el-table-column prop="bookLeftNum" label="余量" min-width="60px" header-align="center"
          align="center"></el-table-column>

        <el-table-column prop="bookClassName" label="图书类型" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" width="240px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleShow(scope.row)">查看详情</el-button>
            <el-button v-if="scope.row.bookLeftNum > 0 && scope.row.isOpen === '1'" size="mini" type="success"
              @click="handleRent(scope.row)">我要借阅</el-button>
            <el-button v-else size="mini" type="danger" :disabled="true">不可借阅</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :pager-count="7"
        :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="tableData.length > 0 ? tableData.length : null"
        background style="float: right; margin-top: 20px">
      </el-pagination>
      
      <el-dialog title="借阅书籍" :visible.sync="show_edit_dialog" :width="create_width" :before-close="handleClose_edit">
        <el-descriptions title="图书信息" style="margin: 0 0 15px 0;" :column="3" :size="size" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-notebook-2"></i>
              书本名称
            </template>
            {{ book_rent_info.bookName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              作者
            </template>
            {{ book_rent_info.bookAuthor }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-ticket"></i>
              ISBN
            </template>
            {{ book_rent_info.bookISBN }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-pie-chart"></i>
              剩余数量
            </template>
            {{ book_rent_info.bookLeftNum }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-takeaway-box"></i>
              图书类型
            </template>
            <el-tag type="primary" size="mini">{{ book_rent_info.bookClassName }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-form ref="form" status-icon :model="rentBookFrom" :rules="rules" label-width="80px">
          <el-form-item label="借阅时长" prop="rentDuration">
            <el-radio-group v-model="rentBookFrom.rentDuration">
              <el-radio-button label="7天" v-if="userPower.maxDay >= 1"></el-radio-button>
              <el-radio-button label="14天" v-if="userPower.maxDay >= 2"></el-radio-button>
              <el-radio-button label="30天" v-if="userPower.maxDay >= 3"></el-radio-button>
              <el-radio-button label="60天" v-if="userPower.maxDay >= 4"></el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="onSubmit('form')">确认借阅</el-button>
          <el-button @click="handleClose_edit">取 消</el-button>
        </span>
      </el-dialog>

      <el-dialog title="图书详情" :visible.sync="show_digital_dialog" :width="create_width">
        <span>ID：{{ show_digital_array.bookId }}</span><br>
        <span>图书名称：{{ show_digital_array.bookName }}</span><br>
        <span>作者：{{ show_digital_array.bookAuthor }}</span><br>
        <span>ISBN：{{ show_digital_array.bookISBN }}</span><br>
        <span>图书类型：{{ show_digital_array.bookClassName }}</span><br>
        <span>总量：{{ show_digital_array.bookAllNum }}</span><br>
        <span>余量：{{ show_digital_array.bookLeftNum }}</span><br>
        <span>借阅状态：{{ show_digital_array.isOpen === '1' && show_digital_array.bookLeftNum > 0 ? '开放借阅' :
          '不可借阅' }}</span><br>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="show_digital_dialog = false">确 定</el-button>
        </span>
      </el-dialog>
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
</style>
  
<script>
import axios from 'axios'

export default {
  name: 'Document',
  data() {
    return {
      dialogVisible: false,
      show_digital_dialog: false,
      show_edit_dialog: false,
      show_digital_array: {},
      book_rent_info: {},
      loading: true,
      tableData: [],
      disabled: false,

      create_width: '50%',

      rentBookFrom: {
        rentDuration: '7天'
      },

      searchContent: '',
      inputContent: '',

      userPower: {},

      rules: {
        rentDuration: [
          { required: true, message: '请选择借阅时长', trigger: 'change' }
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
    handleClose_edit(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.$refs['form'].resetFields();
          this.show_edit_dialog = false;
          done();
        })
        .catch(_ => { });
    },
    handleShow(row) {
      this.show_digital_dialog = true
      this.show_digital_array = row
    },
    handleRent(row) {
      this.show_edit_dialog = true
      this.book_rent_info = JSON.parse(JSON.stringify(row))
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.rentBookFrom.bookId = this.book_rent_info.bookId
          this.axios({
            method: "post",
            url: '/userApi/rentBook',
            data: this.rentBookFrom,
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

              if (res.data.code == 200) {
                this.$message.success('借阅成功！');
                this.userPower.rentNum++;
                console.log(111)
                console.log(this.rentBookFrom.bookId)
                this.tableData.forEach(item => {
                  if(item.bookId == this.rentBookFrom.bookId) {
                    console.log(item.bookLeftNum)
                    item.bookLeftNum = (parseInt(item.bookLeftNum) - 1).toString();
                    console.log(item.bookLeftNum)
                  }
                })

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
    queryAllBook() {
      axios.get('/userApi/queryAllBook', { headers: { 'token': localStorage.getItem('ljc_token') } })
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
            for (let i = 0; i < this.bookClassList.length; i++) {
              if (this.bookClassList[i].id == item.bookClass) {
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
      axios.get('/userApi/queryAllBookClass', { headers: { 'token': localStorage.getItem('ljc_token') } })
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
    getUserPower() {
      axios.get('/userApi/getUserPower', {headers: {'token': localStorage.getItem('ljc_token')}})
        .then(res => {
          if (res.data.code != null && res.data.code == 400) {
            this.$message.error('登录状态过期，请重新登录');
            localStorage.clear('ljc_token');
            localStorage.clear('isLogin');
            this.$router.push('/login?refer=' + window.location.pathname)
          }
          else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);

          this.userPower = res.data.data;


          // if (this.usergroup != 3) this.$options.methods.getHomeAdminData.bind(this)();
          // else this.adminPanelLoading = false
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
    this.queryBookClass()
    this.queryAllBook()
    this.getUserPower();
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
  