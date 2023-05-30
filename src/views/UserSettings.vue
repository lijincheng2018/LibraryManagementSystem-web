<template>
  <el-main style="padding:0px">
    <div class="breadcrumb_box">
      <i class="el-icon-discover" style="color: #333333;font-size: 15px;padding:0;margin:0;"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_content">
        <el-breadcrumb-item :to="{ path: '/user/dashboard' }">班级信息中心</el-breadcrumb-item>
        <el-breadcrumb-item>账号信息设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-main>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <div slot="header">
              <span>我的信息</span>
            </div>
            <div v-loading="loading">
              <li class="list-group-item">
							  <b>姓名：</b><span style="color: orange"><b>{{userData.name}}</b></span>
						  </li>
              <li class="list-group-item">
							  <b>用户权限：</b>
                <span style="color: red"><b>{{ userData.userGroupName }}</b></span>
						  </li>
              <li style="font-weight:bold" class="list-group-item">程序版本：<span style="color: purple">v1.0.0</span>
						</li>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card>
            <div slot="header">
              用户资料设置
            </div>
            <div v-loading="loading">
              <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="form.name" readonly></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                  <el-input v-model="form.userName" readonly></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="passwd">
                  <el-input ref="newPasswd" v-model="form.passwd" placeholder="请输入修改的密码（不修改请留空）"></el-input>
                  
                  <div class="input_span">
                    <span :style="{'background-color':(msgText > 1 || msgText == 1) ?  '#FC5F76' : '#BBBBBB', 'color': (msgText > 1 || msgText == 1) ?  '#FC5F76' : '#BBBBBB' }">弱</span>
                    <span :style="{'background-color':(msgText > 2 || msgText == 2) ?  '#FF9900' : '#BBBBBB', 'color': (msgText > 2 || msgText == 2) ?  '#FF9900' : '#BBBBBB'}">中</span>
                    <span :style="{'background-color':(msgText > 4 || msgText == 4) ?  '#33CC00' : '#BBBBBB', 'color': (msgText > 4 || msgText == 4) ?  '#33CC00' : '#BBBBBB'}">强</span>
                  </div>
                  <span>新密码至少8个字符,必须包含字母、数字！</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit('form')">确认修改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
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
    
    .input_span{
      height: 8px;
      display: flex;
      float: right;
      width: 35%;
    }
    .input_span span{
      display: inline-block;
      width: 30%;
      border-radius: 8px;
      margin-right: 3px;
      text-align: center;
      margin-top: 3px;
    }

</style>

<script>
  import axios from 'axios'
  export default {
      name:'UserSettings',
      data() {
          return {
            userData:{},
            loading: true,       
            msgText: "",   
            form:{
              name:'',
              userName:'',
              passwd:''
            },

            active: 0,

            bindWXTips: false,
            create_width: '50%',

            rules: {
              passwd: [
                { required: true, message: '请输入新密码', trigger: 'blur' }
              ],
              
            },
          
          };
      },
      methods: {
        checkStrong(sValue) {
          var modes = 0;
          //正则表达式验证符合要求的
          if (sValue.length < 1) return modes;
          if (/\d/.test(sValue)) modes++;
          if (/[a-z]/.test(sValue)) modes++;
          if (/[A-Z]/.test(sValue)) modes++;
          if (/\W/.test(sValue)) modes++;
          switch (modes) {
            case 1:
              return 1;
              break;
            case 2:
              return 2;
              break;
            case 3:
            case 4:
            return sValue.length < 4 ? 3 : 4;
            break;
          }
          return modes;
        },
        onSubmit(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var pwd=this.form.passwd
				      var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}')
				      if(!pwdRegex.test(pwd)) {
				        this.$message.error("密码强度不符合要求！");
				        this.$refs.newPasswd.focus();
				        return false;
				      }
              else {
                let data = new FormData();
                data.append('uid',this.userData.userId);
                data.append('passwd',this.form.passwd);

                this.axios({
                  method:"post",
                  url: '/userApi/changeUserPasswd',
                  data: data,
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': localStorage.getItem('ljc_token')
                  }
                })
                  .then(res => {
                    if(res.data.code != null && res.data.code == 400) {
                      this.$message.error('登录状态过期，请重新登录');
                      localStorage.clear('ljc_token');
                      localStorage.clear('isLogin');
                      this.$router.push('/login?refer=' + window.location.pathname)
                    }
                    else if(res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);

                    if(res.data.code == 200) {
                      this.$message.success('密码修改成功！');
                      this.$set(this.form, 'passwd', null);
                      this.msgText = ""
                    }
                  }).catch(err => {
                    console.log(err)
                  })
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        getUserData() {
          axios.get('/userApi/getHomeUserData',  {headers: {'token': localStorage.getItem('ljc_token')}})
            .then(res => {
              if (res.data.code != null && res.data.code == 400) {
                this.$message.error('登录状态过期，请重新登录');
                localStorage.clear('ljc_token');
                localStorage.clear('isLogin');
                this.$router.push('/login?refer=' + window.location.pathname)
              }
              else if (res.data.msg != null && res.data.code != 200) this.$message.error(res.data.msg);
              
              this.userData = res.data.data
              
              this.form.name = res.data.data.name
              this.form.userName = res.data.data.userName
              this.form.passwd = ''
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
        next() {
          if (this.active++ > 1) this.active = 0;
        }
      },
      mounted() {
        this.handleResize()
        window.addEventListener("resize", this.handleResize);
      },
      watch: {
        'form.passwd': {
          handler(keyWord, oldname) {
            this.msgText = this.checkStrong(keyWord);
          }
        }
      },
      created() {
        this.loading = true;
        this.getUserData();
        if (this.form.passwd){
          this.msgText = this.checkStrong(this.form.passwd);
        }
      },
      beforeDestroy() {
        window.removeEventListener("resize", this.handleResize);
      }
  };
</script>
