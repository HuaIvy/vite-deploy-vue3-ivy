<template>

 <div class="container">
        <div class="mt-4">
         
          <table class="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th>動作</th>
              </tr>
            </thead>
            <tbody>
          
                <tr v-for="item in products" :key="item.id">
                <td>
                  
                  <div :style="{height: '100px', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage:`url(${item?.imageUrl})`}">
                  
                  </div>
                </td>
                <td>
                  {{ item.title  }}
                </td>
                <td>
                  <div v-if="item.origin_price===item.price" class="h5"> {{ item.price }} 元</div>
                  <div v-else> 
                    <del class="h6">原價 {{ item.origin_price  }} 元</del>
                    <div class="h5">現在只要 {{ item.price  }} 元</div>
                  </div>
                  
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button @click="showMore(item)" type="button" class="btn btn-outline-secondary">
                      <i class="fas fa-spinner fa-pulse"></i>
                      查看更多
                    </button>
                    <button :disabled="item.id===status.loading" @click="addToCart(item.id,1)" type="button" class="btn btn-outline-danger">
                       <span v-if="item.id===status.loading" @click="addToCart(item.id,1)" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>

            
              
            </tbody>
          </table>
          <!-- 購物車列表 -->
          <div class="text-end">
            <button class="btn btn-outline-danger" type="button">清空購物車</button>
          </div>
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 200px">數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="carts?.carts">
                <tr v-for="cart in carts?.carts" :key="cart.id">
                  <td>
                    <button
                    :disabled="cart.id === status.cartLoading"
                     @click="removeCartItem(cart.id)" type="button" class="btn btn-outline-danger btn-sm">
                      <i class="fas fa-spinner fa-pulse"></i>
                      x
                    </button>
                  </td>
                  <td>
                    {{ cart.product.title  }}
                    <!-- <div class="text-success">
                      已套用優惠券
                    </div> -->
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <div class="input-group mb-3">
                          <button :disabled="cart.qty === 1" @click="cart.qty--;changeCartQty(cart,cart.qty)" type="button" class="btn btn-outline-primary btn-sm">-</button> 
                      
                        <input readonly
                             :disabled="cart.id === status.cartLoading"
                             min="1" type="number" class="form-control" v-model="cart.qty" />
                        <span class="input-group-text" id="basic-addon2">{{ cart.product.price  }}</span>

                        <button @click="cart.qty++; changeCartQty(cart,cart.qty)" type="button" class="btn btn-outline-primary btn-sm">+</button>    

                      </div>
                    </div>
                  </td>
                  <td class="text-end">
                    <!-- <small class="text-success">折扣價：</small> -->
                    {{ cart.total }}
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-end">總計</td>
                <td class="text-end">{{ carts.final_total  }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-end text-success">折扣價</td>
                <td class="text-end text-success">{{ carts.total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <!-- <div class="my-5 row justify-content-center">
          <v-form ref="form" class="col-md-6" v-slot="{ errors }" >
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <v-field id="email" name="email" type="email" class="form-control"
                       :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email" 
                      ></v-field>
              <error-message name="email" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">收件人姓名</label>
              <v-field id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
                       placeholder="請輸入姓名" rules="required"></v-field>
              <error-message name="姓名" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="tel" class="form-label">收件人電話</label>
              <v-field id="tel" name="電話" type="text" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
                       placeholder="請輸入電話" ></v-field>
              <error-message name="電話" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="address" class="form-label">收件人地址</label>
              <v-field id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
                       placeholder="請輸入地址" rules="required" ></v-field>
              <error-message name="地址" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="message" class="form-label">留言</label>
              <textarea id="message" class="form-control" cols="30" rows="10" ></textarea>
            </div>
            <div class="text-end">
              <button type="submit" class="btn btn-danger"
                      >送出訂單</button>
            </div>
          </v-form>
        </div> -->
      </div>

       <!-- Modal detail -->
    <user-product-modal
      :tempProduct="tempProduct" 
      @addToCart="addToCart"
      ref="modalMore"
      >
    </user-product-modal>

</template>

<script>
import UserProductModal from '@/components/UserProductModal.vue'

export default {
  components:{
    UserProductModal
  },
  data() {
    return {
        products:[],
        tempProduct:{},
        status:{
          loading:'',
          cartLoading:''
        },
        carts:{}

    }
  },
  created(){
    this.getProducts();
    this.getCarts();
  },
  methods:{
        getProducts(){ 
          this.$http
        .get(`/api/${import.meta.env.VITE_API_PATH}/products/all`)
        .then((res) => {
          if(res.data.success){
            this.products = res.data.products;
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
       
    },
    showMore(item){
        this.tempProduct = {...item}
        this.$refs.modalMore.openModal();
    },
    addToCart(id,num=1){
      const order = {
         product_id: id,
          qty: num
      }
       this.status.loading = id;
        this.$http
        .post(`/api/${import.meta.env.VITE_API_PATH}/cart`,{ data: order })
        .then((res) => {
          if(res.data.success){
            this.status.loading = '';
            this.getCarts();
            this.$refs.modalMore.closeModal();
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    changeCartQty(item,num=1){
      const order = {
         product_id: item.product_id,
          qty: num
      };

       this.status.cartLoading = item.id;
        this.$http
        .put(`/api/${import.meta.env.VITE_API_PATH}/cart/${item.id}`,{ data: order })
        .then((res) => {
          if(res.data.success){
            this.status.cartLoading = '';
            this.getCarts();
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })

    },
    getCarts(){
        this.$http
        .get(`/api/${import.meta.env.VITE_API_PATH}/cart`)
        .then((res) => {
          if(res.data.success){
            this.carts = res.data.data;
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    removeCartItem(id){
       this.status.cartLoading = id;
         this.$http
        .delete(`/api/${import.meta.env.VITE_API_PATH}/cart/${id}`)
        .then((res) => {
          if(res.data.success){
            this.status.cartLoading = item.id;
            this.getCarts();
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    }


  },
  mounted(){
    
  }
}
</script>
