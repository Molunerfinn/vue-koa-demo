<template>
  <div class="home">
    <button type="button" @click="getAuthorize()">授权</button>
  </div>
</template>

<script>
import {
  getAuthorize
} from '@/api/backend.js'


export default {
    name: 'app',
    components: {

    },
    created() {

    },
    data() {
      return {
        userInfo:{
          username:'',
          password:''
        },
        modifyInfo:{
          username:'',
          oldpassword:'',
          newpassword:'',
          checkpassword:''
        },
        ui:{
          loginVisiable:true,
          checksuccess:false
        }
      }
    },
    methods: {
      getAuthorize: function(){
        let params ={}
          getAuthorize(params).then(data => {
            console.log(data);
          })
      }
    }
  }

</script>

<style>

</style>
