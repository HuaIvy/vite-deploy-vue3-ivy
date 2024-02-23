<template>
      <div class="container">
        <div class="row justify-content-center">
          <h1 class="h3 mb-3 font-weight-normal">
            管理者登入
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
              <div v-if="this.errorMsg!==''" class="alert alert-danger mt-2" role="alert">
                  {{errorMsg}}
              </div>
              <div v-else-if="this.successMsg!==''" class="alert alert-success mt-2" role="alert">
                  {{successMsg}}
              </div>
            </form>
          </div>
        </div>
        <p class="mt-5 mb-3 text-muted">
          &copy; 2024~∞ - 六角學院
          <button type="button" class="btn btn-link">
                  <router-link to="/productCart">商品列表</router-link>
          </button>
        </p>
      </div>   
</template>

<script>
export default {
  data(){
    return{
        username:'',
        password: '',
        errorMsg:'',
        successMsg:'',
    }
  },
  methods:{
    handleSubmit(){
      let data = {
        username:this.username,
        password:this.password
      }
      this.$http.post(`/admin/signin`,data)
        .then(res=>{
          if(res?.data.success){
             const { token, expired } = res.data;
             this.successMsg = res.data.message;
             document.cookie = `ivyToken=${token}; expires=${new Date(expired)};`;
             this.$router.push({path:'/productlist'})
          }
        })
        .catch(err=>{
            this.errorMsg = err.response.data.message;
        })
    }
  },
  mounted(){
    // let token = document.cookie.replace(/(?:(?:^|.*;\s*)ivyToken\s*\=\s*([^;]*).*$)|^.*$/, '$1')
    // if(token){
    //   this.$router.push({path:'/productlist'})
    // }
  }
}
</script>




<style scoped>

</style>
