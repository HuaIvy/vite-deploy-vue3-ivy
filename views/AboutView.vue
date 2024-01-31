<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      {{data}}
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      data:{

      }
    }
  },
  mounted(){
    const url = import.meta.env.VITE_PATH;
    console.log(url);
    const VITE_TEXT  = import.meta.env.VITE_TEXT;
    console.log(VITE_TEXT);
    this.$http.get(url).then((res)=>{
      console.log(res);
      this.data = res.data.results[0]
    })
  }
}
</script>




<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
