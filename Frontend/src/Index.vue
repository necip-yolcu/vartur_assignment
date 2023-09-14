<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h1 class="card-title mb-4">Product List</h1>
        <button class="btn btn-primary mb-4" @click="goToFormPage"> <i class="fas fa-plus"></i> Add Product</button>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Picture</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td><img :src="`${apiURL}/foto/uploads/product/${product.id}/${product.picture}`" :alt="product.picture"
                  height="50" /></td>
              <td>{{ formatDateTime(product.created_at) }}</td>
              <td>
                <i class="fas fa-edit me-4 fa-lg" style="color: #0B5ED7" @click="editProduct(product)"></i>
                <i class="fas fa-trash-alt fa-lg" style="color: #DC3545;" @click="confirmDelete(product)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const apiURL = 'http://localhost:8080';

const products = ref([]);
const toastCount = ref(0);

const goToFormPage = () => {
  router.push('/form');
};

const fetchProducts = () => {
  axios
    .get(`${apiURL}/products`)
    .then((response) => {
      products.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  fetchProducts()
})

const confirmDelete = (product) => {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProduct(product);
  }
};

const formatDateTime = (dateTimeString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateTimeString).toLocaleDateString(undefined, options);
};

const editProduct = (product) => {
  console.log("edit", product);
  router.push({
    path: '/form',
    query: { ...product, editMode: true }, // Pass the product object as query parameters
  });
};

const deleteProduct = (product) => {
  console.log("deleteID", product.id);
  axios
    .delete(`${apiURL}/products/${product.id}`)
    .then((res) => {
      axios
        .delete(`${apiURL}/foto/deleteFolder/product/${product.id}`)
        .then(res => console.log("photo_folder DELETED: ", res))
        .catch(err => {
          console.log("photo_folder ERROR: ", err)
        })

      products.value = products.value.filter((p) => p.id !== parseInt(product.id));
      console.log(res);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
</script>

<style>
.card {
  margin-top: 24px;
}

.card-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.btn {
  /* Other button styles */
  margin-right: 10px;
  /* Adjust the value to increase or decrease the spacing */
}
</style>
