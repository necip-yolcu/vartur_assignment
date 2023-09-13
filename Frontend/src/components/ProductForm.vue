<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const apiURL = "http://localhost:8080";


interface Product {
  name: string;
  picture: string | null; // Make sure picture is nullable if it's optional in your schema
  category_id: number;
  // Add other product properties here
}

const newProduct = ref<Product>({
  name: '',
  picture: null,
  category_id: 0, // Initialize with a default category_id if needed
  // Initialize other product properties here
});

const addProduct = async () => {
  try {
    const response = await axios.post(`${apiURL}/products`, newProduct.value);

    console.log('Product added successfully:', response.data);
  } catch (error) {
    console.error('Error adding product:', error);
  }
};
</script>

<template>
  <form @submit.prevent="addProduct">
    <h3>Add Product</h3>
    <div>
      <label for="productName">Product Name:</label>
      <input type="text" id="productName" v-model="newProduct.name" required />
    </div>
    <div>
      <label for="productPicture">Product Picture (URL):</label>
      <input type="text" id="productPicture" v-model="newProduct.picture" />
    </div>
    <div>
      <label for="productCategory">Category ID:</label>
      <input type="number" id="productCategory" v-model="newProduct.category_id" required />
    </div>

    <button type="submit">Add</button>
  </form>
</template>
