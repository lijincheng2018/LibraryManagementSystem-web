/**
* 404
*/ 
<template>
  <div class="bg">
    <div class="system">
      <img src="../assets/img/404.png">
      <div class="title">
        <h2>你访问的页面不存在~</h2>
        <el-button @click="toHomePage">返回首页</el-button>
      </div>
    </div><br><br><br>
    <div style="text-align:center;color: rgb(240, 240, 240);font-size: 15px;">
      <div class="footer_1 abs-bottom">
        &copy; 2023 图书管理系统
      </div>
    </div>
  </div>
</template>

<style scoped>

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #7395ff;
  background-size: cover;
  background-repeat: no-repeat;
}

.system {
  margin: 0 auto;
  text-align: center;
  padding-top: 140px
}

.system img {
  text-align: center;
  width: 500px
}

.title h2 {
  color: #fff;
  font-size: 36px;
  letter-spacing: 4px;
  text-align: center;
  line-height: 120px
}

.title h3 {
  color: #fff;
  font-size: 24px;
  letter-spacing: 4px;
  text-align: center;
  line-height: 120px
}

.title h4 {
  color: #fff;
  font-size: 18px;
  line-height: 38px;
  text-align: center
}

</style>

<script>
export default {
  name: 'NotFound',
  methods: {
    toHomePage() {
      this.$router.push('/user/dashboard')
    }
  }
}
</script>
