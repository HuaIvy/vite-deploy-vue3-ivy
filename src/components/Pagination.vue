// 頁數
<template>
       <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item" :class="{disabled:!pages.has_pre}">
            <a class="page-link" aria-label="Previous" @click="getProducts(pages.current_page-1)">
              <span aria-hidden="true">&laquo;</span>
              <!-- <span class="sr-only">Previous</span> -->
            </a>
          </li>
          <li v-for="page in pages.total_pages" :key="{page}" class="page-item" :class="{active:page===pages.current_page}">
            <a @click="getProducts(page)" class="page-link" >{{page}}</a>
            </li>
         

          <li class="page-item" :class="{disabled:!pages.has_next}">
            <a class="page-link"  aria-label="Next" @click="getProducts(pages.current_page+1)">
              <span aria-hidden="true">&raquo;</span>
              <!-- <span class="sr-only">Next</span> -->
            </a>
          </li>
        </ul>
      </nav>
</template>

<script>
 export default {
    props:['getProducts','pages']
 }
</script>

    
