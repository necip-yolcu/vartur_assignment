<template>
  <div class="container">

    <div class="card">
      <div class="card-body">
        <h1 class="card-title mb-4">Category List</h1>
        <button class="btn btn-primary mb-4" @click="goToCategoryFormPage"> <i class="fas fa-plus"></i> Add
          Category</button>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Picture</th>
              <th>Parent ID</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <table-row-cat v-for="category in categories" :categories="categories" :category="category" :key="category.id"
              :level="1" @deleteCategory="handleDeleteCategory" />
          </tbody>
        </table>

      </div>
    </div>

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
              <th>Category ID</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td><img :src="`${apiURL}/foto/uploads/products/${product.id}/${product.picture}`" :alt="product.picture"
                  height="50" /></td>
              <td>{{ product.category_id }}</td>
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
import { apiURL } from '@/config'
import TableRowCat from './components/TableRowCat.vue'


const router = useRouter()

const products = ref([]);
const categories = ref([]);

const goToFormPage = () => {
  //router.push('/product');
  router.push({
    path: '/product',
    query: { type: "products" }, // Pass the product object as query parameters
  });
};

const goToCategoryFormPage = () => {
  //router.push('/category');
  router.push({
    path: '/category',
    query: { type: "categories" }, // Pass the product object as query parameters
  });
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

const fetchCategories = () => {
  axios
    .get(`${apiURL}/categories`)
    .then((response) => {
      
      categories.value = response.data;
      for (const category of response.data) {
        calculateProductCount(category);
        updateParentProductCount(category);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(async () => {
  await fetchProducts()
  await fetchCategories()
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
  router.push({
    path: '/product',
    query: { ...product, editMode: true, type: "products" }, // Pass the product object as query parameters
  });
};

const deleteProduct = (product) => {
  axios
    .delete(`${apiURL}/products/${product.id}`)
    .then((res) => {
      axios
        .delete(`${apiURL}/foto/deleteFolder/products/${product.id}`)
        .then(res => console.log("photo_folder DELETED: ", res))
        .catch(err => {
          console.log("photo_folder ERROR: ", err)
        })

      products.value = products.value.filter((p) => p.id !== parseInt(product.id));
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const handleDeleteCategory = (categoryToDelete) => {
  // Filter the categories to remove the categoryToDelete
  axios
    .delete(`${apiURL}/categories/${categoryToDelete.id}`)
    .then((res) => {
      axios
        .delete(`${apiURL}/foto/deleteFolder/categories/${categoryToDelete.id}`)
        .then(res => console.log("photo_folder DELETED: ", res))
        .catch(err => {
          console.log("photo_folder ERROR: ", err)
        })
      categories.value = categories.value.filter((category) => category.id !== categoryToDelete.id);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};


const calculateProductCount = (category) => {
  let productCount = category.products.length;
  for (const child of category.children) {
    productCount += calculateProductCount(child);
  }
  category.productCount = productCount; // Set productCount for this category
  return productCount;
};

const updateParentProductCount = (category) => {
  if (category.parent_id !== null) {
    const parentCategory = myData.find((c) => c.id === category.parent_id);
    if (parentCategory) {
      parentCategory.productCount += category.productCount;
      updateParentProductCount(parentCategory); // Recursively update parent categories
    }
  }
};

</script>

<style>
.card {
  margin: 24px 0;
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

table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #ccc;
}
</style>
