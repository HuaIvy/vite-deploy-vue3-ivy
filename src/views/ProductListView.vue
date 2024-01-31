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
        <p>
          目前有 <span>{{ Object.values(products)?.length }}</span> 項產品
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

    <!-- Modal -->
    <div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content border-0">
          <div :class="[`modal-header text-white ${isNew===false?'bg-primary':'bg-success'}`]">
            <h5 id="productModalLabel" class="modal-title" >
              <span v-if="isNew">新增產品</span>
              <span v-else>編輯產品</span>
            </h5>
            <button @click="tempProduct={}" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">主要圖片</label>
                  <input id="imageUrl" v-model="tempProduct.imageUrl" type="text" class="form-control mb-2" placeholder="請輸入圖片連結">
                  <img class="img-fluid" :src="tempProduct.imageUrl">
                </div>
                <h3 class="mb-3">多圖新增</h3>
                <div v-if="Array.isArray(tempProduct.imagesUrl)">
                  <div class="mb-1" v-for="(image, key) in tempProduct.imagesUrl" :key="key">
                    <div class="mb-3">
                      <label :for="`imagesUrl${key}`" class="form-label">圖片網址{{key+1}}</label>
                      <input :id="`imagesUrl${key}`" v-model="tempProduct.imagesUrl[key]" type="text" class="form-control"
                        placeholder="請輸入圖片連結">
                    </div>
                    <img class="img-fluid" :src="image">
                      <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.splice(key,1)">
                      刪除圖片 {{key+1}}
                    </button>
                  </div>
                  <div v-if="!tempProduct.imagesUrl.length || tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]">
                    <button class="btn btn-outline-primary btn-sm d-block w-100"
                      @click="tempProduct.imagesUrl.push('')">
                      新增圖片
                    </button>
                  </div>
                  <!-- <div v-else>
                    <button class="btn btn-outline-danger btn-sm d-block w-100" @click="tempProduct.imagesUrl.pop()">
                      刪除圖片
                    </button>
                  </div> -->
                </div>
                <div v-else>
                  <button class="btn btn-outline-primary btn-sm d-block w-100" @click="createImages">
                    新增圖片
                  </button>
                </div>
              </div>
              <div class="col-sm-8">
                <div class="mb-3">
                  <label for="title" class="form-label">標題</label>
                  <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="category" class="form-label">分類</label>
                    <input id="category" v-model="tempProduct.category" type="text" class="form-control"
                      placeholder="請輸入分類">
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="unit" class="form-label">單位</label>
                    <input id="unit" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
                  </div>
                </div>

                <div class="row">
                  <div class="mb-3 col-md-6">
                    <label for="origin_price" class="form-label">原價</label>
                    <input id="origin_price" v-model.number="tempProduct.origin_price" type="number" min="0"
                      class="form-control" placeholder="請輸入原價">
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">售價</label>
                    <input id="price" v-model.number="tempProduct.price" type="number" min="0" class="form-control"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="mb-3">
                  <label for="description" class="form-label">產品描述</label>
                  <textarea id="description" v-model="tempProduct.description" type="text" class="form-control"
                    placeholder="請輸入產品描述">
                  </textarea>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">說明內容</label>
                  <textarea id="content" v-model="tempProduct.content" type="text" class="form-control"
                    placeholder="請輸入說明內容">
                  </textarea>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
                      :true-value="1" :false-value="0">
                    <label class="form-check-label" for="is_enabled">是否啟用</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="tempProduct={}" type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" :class="[`btn ${isNew===false?'btn-primary':'btn-success'}`]" @click="updateProduct">
              確認
            </button>
          </div>
        </div>
      </div>
    </div>

    <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
      aria-labelledby="delProductModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-danger" @click="delProduct">
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->


  </div>
</template>

<script>
import { Modal } from "bootstrap"
export default {
  name: "ProductListView",
  data() {
    return {
        path: 'ivy-vue3', // 個人 API Path
        token: '',
        products: [],
        tempProduct: {},
        modalAdd:null,
        modalDel:null,
        isNew:false,
    }
  },
  mounted(){
    console.log(this.$refs);
    this.modalAdd = new Modal(this.$refs.productModal);
    this.modalDel = new Modal(this.$refs.delProductModal);
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
    getProducts(){
          this.$http
        .get(`/api/${this.path}/admin/products/all`)
        .then((res) => {
          console.log(res)
          this.products = res.data.products
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
          this.modalAdd.show();
        }else if(action==='edit'){
            this.tempProduct = JSON.parse(JSON.stringify(product)); //{...product}; //
            if(!Array.isArray(this.tempProduct.imagesUrl)){
              this.tempProduct.imagesUrl = [];
            }
            this.modalAdd.show();
             this.isNew = false;
        }else if(action==='delete'){
           this.tempProduct = {...product};
           this.modalDel.show();

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
          this.modalAdd.hide();
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
          this.modalDel.hide();
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