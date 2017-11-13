<template>
  <el-row class="content">
    <el-col :xs="24" :sm="{span: 6,offset: 9}">
      <span class="title">
       欢迎登录
      </span>
      <el-row>
        <el-input
          v-model="account"
          placeholder="账号"
          type="text">
        </el-input>
        <el-input
          v-model="password"
          placeholder="密码"
          type="password"
          @keyup.enter.native="loginToDo">
        </el-input>
        <el-button type="primary" @click="loginToDo">登录</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    loginToDo () {
      let obj = {
        name: this.account,
        password: this.password
      }
      const result = this.$http.post('/auth/user', obj) // 将信息发送给后端
      result.then((res) => {
        if (res.data.success) { // 如果成功
          sessionStorage.setItem('demo-token', res.data.token) // 用sessionStorage把token存下来
          this.$message({ // 登录成功，显示提示语
            type: 'success',
            message: '登录成功！'
          })
          this.$router.push('/todolist') // 进入todolist页面，登录成功
        } else {
          this.$message.error(res.data.info) // 登录失败，显示提示语
          sessionStorage.setItem('demo-token', null) // 将token清空
        }
      }, (err) => {
        console.log(err)
        this.$message.error('请求错误！')
        sessionStorage.setItem('demo-token', null) // 将token清空
      })
      return result
    }
  }
}
</script>

<style lang="stylus" scoped>
  .el-row.content
    padding 16px
  .title
    font-size 28px
  .el-input
    margin 12px 0
  .el-button
    width 100%
    margin-top 12px
</style>
