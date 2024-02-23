<template>
  <div class="container">
    <div class="mt-4">
      <button type="button" class="btn btn-link">
        <router-link to="/login">管理者後台管理登入</router-link>
      </button>
      <h2 v-if="carts?.carts?.length === 0">
        購物車目前是空的
      </h2>
      <h4 class="text-end" v-else-if="carts?.carts?.length > 0">
        購物車有 {{carts?.carts?.length}} 樣商品
      </h4>
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
              <div
                :style="{
                  height: '100px',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundImage: `url(${item?.imageUrl})`
                }"
              ></div>
            </td>
            <td>
              {{ item.title }}
            </td>
            <td>
              <div v-if="item.origin_price === item.price" class="h5">{{ item.price }} 元</div>
              <div v-else>
                <del class="h6">原價 {{ item.origin_price }} 元</del>
                <div class="h5">現在只要 {{ item.price }} 元</div>
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button @click="showMore(item)" type="button" class="btn btn-outline-secondary">
                  <i class="fas fa-spinner fa-pulse"></i>
                  查看更多
                </button>
                <button
                  :disabled="item.id === status.loading"
                  @click="addToCart(item.id, 1)"
                  type="button"
                  class="btn btn-outline-danger"
                >
                  <span
                    v-if="item.id === status.loading"
                    @click="addToCart(item.id, 1)"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  加到購物車
                </button>
                <button @click="showMorePage(item)" type="button" class="btn btn-link">
                  <i class="fas fa-spinner fa-pulse"></i>
                  查看明細
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 購物車列表  有商品才出現表格 和 v-form -->
      <template v-if="carts?.carts?.length > 0">
      <div class="text-end">
        <button @click="deleteAllCart" class="btn btn-outline-danger" type="button">清空購物車</button>
      </div>
      <table class="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style="width: 200px">數量/單位</th>
            <th>單價</th>
            <th class="text-end">合計</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="cart in carts?.carts" :key="cart.id">
              <td>
                <button
                  :disabled="cart.id === status.cartLoading"
                  @click="removeCartItem(cart.id)"
                  type="button"
                  class="btn btn-outline-danger btn-sm"
                >
                  <i class="fas fa-spinner fa-pulse"></i>
                  x
                </button>
              </td>
              <td>
                {{ cart.product.title }}
                <!-- <div class="text-success">
                      已套用優惠券
                    </div> -->
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <div class="input-group mb-3">
                    <button
                      :disabled="cart.qty === 1"
                      @click="cart.qty--;changeCartQty(cart, cart.qty)"
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                    >
                      -
                    </button>

                    <input
                      readonly
                      :disabled="cart.id === status.cartLoading"
                      min="1"
                      type="number"
                      class="form-control"
                      v-model="cart.qty"
                    />
                    <span class="input-group-text" id="basic-addon2">{{ cart.product.unit }} </span>

                    <button
                      @click="cart.qty++;changeCartQty(cart, cart.qty)"
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
              <td>
                ${{ cart.product.price }}
              </td>
              <td class="text-end">
                <!-- <small class="text-success">折扣價：</small> -->
                {{ cart.total }}
              </td>
            </tr>
          
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="text-end">總計</td>
            <td class="text-end">{{ carts.final_total }}</td>
          </tr>
          <tr>
            <td colspan="4" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">{{ carts.total }}</td>
          </tr>
        </tfoot>
      </table>

      <div class="my-5 row justify-content-center">
      <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="onSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <v-field
            v-model="user.email"
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="email|required"
          ></v-field>
          <error-message name="email" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <v-field
            v-model="user.name"
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required"
          ></v-field>
          <error-message name="姓名" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <v-field
            v-model="user.tel"
            id="tel"
            name="電話"
            type="tel"
            class="form-control"
            :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話 09XXXXXXXX"
            :rules="isPhone"
          ></v-field>
          <error-message name="電話" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <v-field
            v-model="user.address"
            id="address"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址"
            rules="required"
          ></v-field>
          <error-message name="地址" class="invalid-feedback"></error-message>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            v-model="message"
            id="message"
            class="form-control"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
      </v-form>
    </div>
    </template>
    </div>
   
  </div>

  <!-- Modal detail -->
  <user-product-modal :tempProduct="tempProduct" @addToCart="addToCart" ref="modalMore">
  </user-product-modal>
</template>

<script>
import UserProductModal from '@/components/UserProductModal.vue'

export default {
  components: {
    UserProductModal
  },
  data() {
    return {
      products: [],
      tempProduct: {},
      status: {
        loading: '',
        cartLoading: ''
      },
      overlayLoading: null,
      carts: {},
      user: {},
      message:''
    }
  },
  created() {
    this.getProducts()
    this.getCarts()
  },
  methods: {
    onSubmit(data) { //結帳
      console.log(data)
      this.overlayLoading = this.$loading.show()
      const user = this.user
      let message = this.message
      const userData = {
        user,
        message
      }
      this.$http
        .post(`/api/${import.meta.env.VITE_API_PATH}/order`, { data: userData })
        .then((res) => {
          if (res.data.success) {
            this.getCarts()
            this.overlayLoading.hide();
            this.overlayLoading = null;
            alert("商品訂購成功");
            this.user = {};
            this.message = ""
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error);
          this.overlayLoading.hide()
          this.overlayLoading = null
        })
    },
    getProducts() {
      this.overlayLoading = this.$loading.show()
      this.$http
        .get(`/api/${import.meta.env.VITE_API_PATH}/products/all`)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products
            this.overlayLoading.hide()
            this.overlayLoading = null
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    showMore(item) {
      this.tempProduct = { ...item }
      this.$refs.modalMore.openModal()
    },
    showMorePage(item){
      this.$router.push({ name: 'ProductDetail', params: { productId: item.id } })
    },
    addToCart(id, num = 1) {
      const order = {
        product_id: id,
        qty: num
      }
      this.status.loading = id
      this.$http
        .post(`/api/${import.meta.env.VITE_API_PATH}/cart`, { data: order })
        .then((res) => {
          if (res.data.success) {
            this.status.loading = ''
            this.getCarts()
            this.$refs.modalMore.closeModal()
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    changeCartQty(item, num = 1) {
      const order = {
        product_id: item.product_id,
        qty: num
      }

      this.status.cartLoading = item.id
      this.$http
        .put(`/api/${import.meta.env.VITE_API_PATH}/cart/${item.id}`, { data: order })
        .then((res) => {
          if (res.data.success) {
            this.status.cartLoading = ''
            this.getCarts()
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    getCarts() {
      this.$http
        .get(`/api/${import.meta.env.VITE_API_PATH}/cart`)
        .then((res) => {
          if (res.data.success) {
            this.carts = res.data.data
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    removeCartItem(id) {
      this.status.cartLoading = id
      this.$http
        .delete(`/api/${import.meta.env.VITE_API_PATH}/cart/${id}`)
        .then((res) => {
          if (res.data.success) {
            this.getCarts()
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    deleteAllCart(){
      this.$http
        .delete(`/api/${import.meta.env.VITE_API_PATH}/carts`)
        .then((res) => {
          if (res.data.success) {
            this.getCarts()
          }
        })

        //失敗
        .catch((error) => {
          console.dir(error)
        })
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    }
  },
  mounted() {}
}
</script>
