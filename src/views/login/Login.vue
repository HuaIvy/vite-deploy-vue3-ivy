<template>
      <div class="container">
        <div class="row justify-content-center">
          <h1 class="h3 mb-3 font-weight-normal">
            請先登入
          </h1>
          <div class="col-8">
            <form  id="form" class="form-signin">
              <div class="form-floating mb-3">
                <input v-model="username" type="email" class="form-control" id="username"
                  placeholder="name@example.com" required autofocus>
                <label for="username">Email address</label>
              </div>
              <div class="form-floating">
                <input v-model="password" type="password" class="form-control" id="password"
                  placeholder="password" required>
                <label for="password">Password</label>
              </div>
              <button @click="handleSubmit()" class="btn btn-lg btn-primary w-100 mt-3" type="button">
                登入
              </button>
            </form>
          </div>
        </div>
        <p class="mt-5 mb-3 text-muted">
          &copy; 2024~∞ - 六角學院
        </p>
      </div>   
</template>

<script>
import axiosInstance from '../../api/axios'
export default {
  data(){
    return{
      data:{
        username:'',
        password: '',



      }
    }
  },
  methods:{
    handleSubmit(){
      let data = {
        username:this.username,
        password:this.password
      }
      axiosInstance.post(`/admin/signin`,data)
        .then(res=>{
          if(res?.data.success){
             const { token, expired } = res.data;
             document.cookie = `ivyToken=${token}; expires=${new Date(expired)};`;
             this.$router.push({path:'/home'})
          }
        })
        .catch(err=>{

        })
    }
  },
  mounted(){
  
  }
}
</script>




<style scoped>

</style>
