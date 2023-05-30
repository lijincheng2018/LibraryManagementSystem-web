<template>
  <div class="login-wrap">
    <div class="login-header">图书管理系统</div>
    <div class="login-container" :style="password_login === true ? 'height: 350px' : 'height: 380px'">
      <div class="class_login_font_style class_login_switch" name="tabTit">
        <span :class="password_login === true ? 'cusp on' : 'cusp'" @click="password_login = true">密码登录</span>
        <span :class="password_login === true ? 'cusp' : 'cusp on'" @click="password_login = false">注册用户</span>
      </div>
      <div v-show="password_login === true">
        <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
          <h3 class="title"></h3>
          <el-form-item prop="username">
            <el-input type="text" v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-checkbox class="remember" v-model="rememberpwd">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button type="primary" style="width:100%;" @click="submitForm('ruleForm')" :loading="logining">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="password_login === false">
        <el-form label-position="left" :model="registerForm" :rules="reg_rules" ref="registerForm" label-width="80px">
          <h3 class="title"></h3>
          <el-form-item label="用户名" prop="username">
            <el-input type="text" v-model="registerForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input type="text" v-model="registerForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="width:100%;" @click="submitRegisterForm('registerForm')" :loading="registering">注册</el-button>
      </div>
    </div>
    <div class="footer">
        &copy; 2023 <a href="./about.html" target="_blank" style="display:inline-block;color: #00429e;">图书管理系统</a>
      </div>
    
  </div>
</template>
<script type="text/ecmascript-6">
import { setCookie, getCookie, delCookie } from '../utils/util'
import md5 from 'js-md5'
import axios from 'axios'

export default {
  name: 'login',
  data() {
    return {
      logining: false,
      registering: false,
      rememberpwd: false,
      ruleForm: {
        username: '',
        password: '',
      },
      registerForm: {
        username: '',
        name: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      reg_rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      password_login: true,
    }
  },
  methods: {
    getuserpwd() {
      if (getCookie('user') != '' && getCookie('pwd') != '') {
        this.ruleForm.username = getCookie('user')
        this.ruleForm.password = getCookie('pwd')
        this.rememberpwd = true
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.logining = true
          let orign_password = this.ruleForm.password
          let encode_password = md5(md5(this.ruleForm.password)+'_ljcsys')

          let loginData = new FormData();
          loginData.append('username', this.ruleForm.username)
          loginData.append('password', orign_password)

          this.axios({
            method:"post",
            url: '/userApi/login',
            data: loginData,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              
            }
          })
            .then(res => {
              if (res.data.code == 200) {
                if (this.rememberpwd) {
                  setCookie('user', this.ruleForm.username, 7)
                  setCookie('pwd', orign_password, 7)
                } else {
                  delCookie('user')
                  delCookie('pwd')
                }
                this.$message.success("登录成功！欢迎你！")
                setTimeout(() => {
                  this.logining = false
                  localStorage.setItem('isLogin', 'true');
                  localStorage.setItem('activeTab', '/user/dashboard');
                  localStorage.setItem('ljc_token', res.data.data);

                  if(this.$route.query.refer != null && this.$route.query.refer != '/') this.$router.push({ path: this.$route.query.refer });
                  else this.$router.push({ path: '/user/dashboard' });
                }, 1000)
              } else {
                this.$message.error(res.data.msg)
                this.logining = false
                return false
              }
            }).catch(err => {
              console.log(err)
            })
        }
      })
    },
    submitRegisterForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.registering = true

          this.axios({
            method:"post",
            url: '/userApi/register',
            data: this.registerForm,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success("注册成功！前往登录...")
                setTimeout(() => {
                  this.registering = false
                  this.registerForm = {
                    username: '',
                    name: '',
                    password: ''
                  }
                  this.password_login = true
                }, 1000)
              } else {
                this.$message.error(res.data.msg)
                this.registering = false
                return false
              }
            }).catch(err => {
              console.log(err)
            })
        }
      })
    }

  },
  created() {
    this.getuserpwd()
  },
}
</script>

<style scoped>

.login-wrap {
  position: fixed;
  padding: 0 37rpx;
  padding-top: 130px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/img/login_bgimg.png');
  background-size: cover;
  background-repeat: no-repeat;
}

.login-container {
  min-width: 350px;
  max-width: 450px;
  padding: 30px 35px 15px 35px;
  height: 350px;
  background: #FFFFFF;
  margin: 0px auto;
  box-shadow: 0px 10px 10px rgb(25 99 255 / 15%);
  border-radius: 10px;
  position: relative;
}
.login-header {
  width: 100%;
  height: 53px;
  line-height: 53px;
  text-align: center;
  color: #0356CA;
  font-size: 40px;
  font-weight: 700;
  position: absolute;
  top: 8%;
  left: 0;
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.qrcode_title {
  margin: 30px auto 40px auto;
  text-align: center;
  color: #505458;
  font-size: 16px;
}

.remember {
  margin: 0px 0px 35px 0px;
}

.footer {
  height: 50px;
  z-index:1;
  color: #00429e;
  left: 0px;
  bottom: 10px;
  width: 100%;
  height: 50px;
  margin-bottom: -10px;
  position: fixed;
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.img_box {
  width: 100%;
  text-align: center; 
  box-sizing: border-box;
}
.img_style {
  vertical-align: middle;
}

.class_login_switch .on {
  font-size: 20px;
  color: #000;
  position: relative;
}

.class_login_switch .on::after {
  content: "";
  display: block;
  background: #0356CA;
  border-radius: 888px;
  width: 30px;
  height: 4px;
  position: absolute;
  left: 23px;
  bottom: -10px;
}

.cusp {
  cursor: pointer;
  margin-right: 40px;
}

.class_login_font_style {
  font-size: 20px;
  color: #8b8b8b;
}

</style>