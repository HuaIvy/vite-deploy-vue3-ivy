<template>
  <div class="container col-12">
    <div class="text-end mt-4">
      <button class="btn btn-success" @click="openModal('new')">
        建立新的產品
      </button>
    </div>
    <div class="row py-3">
      <div class="col-md-12">
        <h2>產品列表</h2>
        <table class="table table-hover mt-4">
          <thead>
            <tr>
              <th width="150">分類</th>
              <th width="150">產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="150">是否啟用</th>
              <th width="120">動作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id">
              <td>{{item.category}}</td>
              <td width="150">{{ item.title }}</td>
              <td width="120">
                {{ item.origin_price }}
              </td>
              <td width="120">
                {{ item.price }}
              </td>
              <td width="150">
                <span v-if="item.is_enabled" class="text-success">啟用</span>
                <span v-else>未啟用</span>
              </td>
              <td>
                <div class="btn-group">
                <button type="button" class="btn btn-primary" @click="openProduct(item)">
                  查看細節
                </button>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('edit', item)">
                  編輯
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', item)">
                  刪除
                </button>
              </div>
              </td>
            </tr>
          </tbody>
        </table>
          <!-- 頁數 -->
          <pagination :getProducts="getProducts" :pages="pages"></pagination>
        <p>
         第{{pages.current_page}}頁有 <span>{{ Object.values(products)?.length }}</span> 項產品
        </p>
      </div>
      <div class="col-md-12">
        <h2>單一產品細節</h2>
        <template v-if="tempProduct?.title">
          <div class="card mb-3">
            <img :src="tempProduct?.imageUrl" class="card-img-top primary-image" alt="主圖" />
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
          <template v-for="(image, key) in tempProduct?.imagesUrl" :key="key">
            <img v-if="image" :src="image" :alt="`多圖 ${key + 1}`" class="images m-2" />
          </template>
        </template>
        <p v-else class="text-secondary">請選擇一個商品查看</p>
      </div>
    </div>

    <!-- Modal Edit add  -->
    <edit-product-modal 
      :tempProduct="tempProduct" 
      :updateProduct="updateProduct"
      ref="modalEdit"
      :isNew="isNew"
      >
    </edit-product-modal>

    <!-- Modal Delete -->
    <delete-product-modal 
      :delProduct="delProduct"
      :tempProduct="tempProduct"
      ref="modalDel">
    </delete-product-modal>
  
    <!-- Modal -->


  </div>
</template>

<script>
import { Modal } from "bootstrap"
import Pagination from '../components/Pagination.vue';
import EditProductModal from '../components/EditProductModal.vue'
import DeleteProductModal from '../components/DeleteProductModal.vue'
export default {
  name: "ProductListView",
  components:{
    Pagination,
    EditProductModal,
    DeleteProductModal
  },
  data() {
    return {
        path: 'ivy-vue3', // 個人 API Path
        token: '',
        products: [],
        tempProduct: {},
        pages:{},
        // modalAdd:null,
        // modalDel:null,
        isNew:false,
    }
  },
  mounted(){
    // console.log(this.$refs);
    // this.modalAdd = new Modal(this.$refs.productModal);
    // this.modalDel = new Modal(this.$refs.delProductModal);
    },
  created() {
    
    this.token = document.cookie.replace(/(?:(?:^|.*;\s*)ivyToken\s*\=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common['Authorization'] = this.token

    this.$http
      .post(`/api/user/check`, { headers: { Authorization: this.token } })
      .then((res) => {
        if (res.data.success) {
            this.getProducts();
        }
      })
      .catch((err) => {
        this.$router.push({ path: '/login' })
      })
  },
  methods: {
    getProducts(page=1){ //query parameter
          this.$http
        .get(`/api/${this.path}/admin/products?page=${page}`)
        .then((res) => {
          // console.log(res)
          this.products = res.data.products;
          this.pages = res.data.pagination;//頁數
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
       
    },
    openProduct(item) {
      this.tempProduct = JSON.parse(JSON.stringify(item));
    },
    openModal(action,product){
        if(action==='new'){
          this.tempProduct = {
            imagesUrl:[]
          };
          this.isNew = true;
          this.$refs.modalEdit.openModal();
        }else if(action==='edit'){
            this.tempProduct = JSON.parse(JSON.stringify(product)); //{...product}; //
            if(!Array.isArray(this.tempProduct.imagesUrl)){
              this.tempProduct.imagesUrl = [];
            }
             this.$refs.modalEdit.openModal();
             this.isNew = false;
        }else if(action==='delete'){
           this.tempProduct = {...product};
           this.$refs.modalDel.openModal();

        }
        
    },
    updateProduct(){
      //新增 
        let api = `/api/${this.path}/admin/product`;
        let method = 'post';

      //更新
      if(!this.isNew){
        api =  `/api/${this.path}/admin/product/${this.tempProduct.id}`
        method = 'put'
      }
      
        this.$http
        [method](api,{data:this.tempProduct})
        .then((res) => {
          console.log(res);
          this.getProducts();
           this.$refs.modalEdit.closeModal();
          this.tempProduct = {}
    
        })
        //失敗
        .catch((error) => {
          console.dir(error)
        })

    },
    delProduct(){
      
       const api =  `/api/${this.path}/admin/product/${this.tempProduct.id}`
       let method = 'delete'

        this.$http
        [method](api,{data:this.tempProduct})
        .then((res) => {
          console.log(res);
          this.getProducts();
          this.$refs.modalDel.closeModal();
          this.tempProduct = {}
    
        })
        //失敗
        .catch((error) => {
          console.dir(error)
        })

    },
    createImages(){

    }
  }
}
</script>
<style scoped>
  img {
    object-fit: contain;
    max-width: 100%;
  }

  .primary-image {
    height: 300px;
  }

  .images {
    height: 150px;
  }


</style>