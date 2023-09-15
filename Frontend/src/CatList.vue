<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h1 class="card-title mb-4">Category List</h1>
        <button class="btn btn-primary mb-4" @click="goToCategoryFormPage">
          <i class="fas fa-plus"></i> Add Category
        </button>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Parent Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id">
              <td>{{ category.id }}</td>
              <td>{{ category.name }}</td>
              <td>{{ category.parent_name }}</td>
              <td>
                <i
                  class="fas fa-edit me-4 fa-lg"
                  style="color: #0B5ED7"
                  @click="editCategory(category)"
                ></i>
                <i
                  class="fas fa-trash-alt fa-lg"
                  style="color: #DC3545;"
                  @click="confirmDelete(category)"
                ></i>
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
import { useRouter } from 'vue-router';
import { apiURL } from '@/config'


const router = useRouter();

const categories = ref([]);
const toastCount = ref(0);

const goToCategoryFormPage = () => {
  router.push('/category-form');
};

const fetchCategories = () => {
  axios
    .get(`${apiURL}/categories`)
    .then((response) => {
      categories.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  fetchCategories();
});

const confirmDelete = (category) => {
  if (confirm('Are you sure you want to delete this category?')) {
    deleteCategory(category);
  }
};

const editCategory = (category) => {
  console.log('edit', category);
  router.push({
    path: '/category-form',
    query: { ...category, editMode: true }, // Pass the category object as query parameters
  });
};

const deleteCategory = (category) => {
  console.log('deleteID', category.id);
  axios
    .delete(`${apiURL}/categories/${category.id}`)
    .then((res) => {
      categories.value = categories.value.filter((c) => c.id !== parseInt(category.id));
      console.log(res);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
</script>

<style>
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
