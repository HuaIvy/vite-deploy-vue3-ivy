<template>
      <div class="col-md-12 container">
          <button @click="this.$router.push({ name: 'ProductCart'})" type="button" class="btn btn-link">
            <i class="fas fa-spinner fa-pulse"></i>
            ← 返回列表
        </button>
        <h2>單一產品細節</h2>
        <template v-if="tempProduct?.title">
          <div class="card mb-3">
            <img style="max-width:auto;max-height: 250px;object-fit: contain;" :src="tempProduct?.imageUrl" class="card-img-top primary-image" alt="主圖" />
            <div class="card-body">
              <h5 class="card-title">
                {{ tempProduct?.title }}
                <span class="badge bg-primary ms-2">{{ tempProduct?.category }}</span>
              </h5>
              <p class="card-text">商品描述：{{ tempProduct?.description }}</p>
              <p class="card-text">商品內容：{{ tempProduct?.content }}</p>
              <div class="d-flex">
                <p class="card-text me-2">{{ tempProduct?.price }}</p>
                <p class="card-text text-secondary">
                  <del>{{ tempProduct?.origin_price }}</del>
                </p>
                {{ tempProduct?.unit }} / 元
              </div>
            </div>
          </div>
          <div class="form-group row">
            <template v-for="(image, key) in tempProduct?.imagesUrl" :key="key">
            <div class="col-md-3 col-sm-12 row">
                <img v-if="image" :src="image" :alt="`多圖 ${key + 1}`" style="max-width:auto;max-height: 250px;object-fit: contain;" class="card-img-top images m-2" />
            </div>
          </template>

          </div>
       
        </template>
      </div>
</template>

<script>
import router from '@/router'


export default {
    data(){
        return {
            tempProduct:{},
            overlayLoading: null,
        }
    },
    methods:{
      getProductById() {
      this.overlayLoading = this.$loading.show()
      this.$http
        .get(`/api/${import.meta.env.VITE_API_PATH}/product/${this.$route.params.productId}`)
        .then((res) => {
          if (res.data.success) {
            this.tempProduct = res.data.product
            this.overlayLoading.hide()
            this.overlayLoading = null
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    },
      mounted(){
        this.getProductById();
        console.log(this.$route.params);
    },
}
</script>