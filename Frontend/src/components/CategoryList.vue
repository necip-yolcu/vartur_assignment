<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import ProductForm from './ProductForm.vue';

const apiURL = "http://localhost:8080";

const showProductForm = ref(false);

// Define an interface for your category object
interface Category {
    id: number;
    name: string;
    picture?: string;
    parent_id?: number;
    parent?: Category | null;
    children?: Category[];
    created_at: string;
    updated_at: string;
    products: any[]; // You can specify the type for products as well
    showSubcategories: boolean; // Added to control subcategory visibility
}

const categories = ref<Category[]>([]);

const fetchCategories = async () => {
    try {
        const response = await axios.get<Category[]>(`${apiURL}/categories`);
        //categories.value = response.data;
        categories.value = response.data.map((category) => ({ ...category, showSubcategories: false }));

        console.log("respoo", JSON.stringify(response.data), undefined, 2)
        buildCategoryTree(categories.value);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

const buildCategoryTree = (categoryList: Category[]) => {
    // Your code to build the category tree goes here
    // You can use categoryList to construct the tree structure
    //categories.value = categoryList;
};

const toggleSubcategories = (category: Category) => {
    category.showSubcategories = !category.showSubcategories;
};

fetchCategories();

</script>

<template>
    <div>
        <h2>Categories</h2>
        <button @click="showProductForm = true">Add Product</button>
        <ul>
            <li v-for="category in categories" :key="category.id">
                {{ category.name }}
                <!-- Add buttons for editing/deleting if needed -->
            </li>
            <li v-for="category in categories" :key="category.id">
                {{ category.name }}
                <button @click="toggleSubcategories(category)">Toggle Subcategories</button>
                <ul v-if="category.showSubcategories">
                    <category-item v-for="subcategory in category.children" :key="subcategory.id"
                        :category="subcategory"></category-item>
                </ul>
            </li>
            <li>
                <category-item v-for="category in categories" :key="category.id" :category="category"></category-item>
            </li>
        </ul>
    </div>
    <ProductForm v-if="showProductForm" />
</template>