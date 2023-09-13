<template>
    <div class="container">

        <div class="card">
            <div class="card-body">
                <h1 class="card-title mb-4">{{ formTitle }}</h1>
                <form @submit.prevent="submitForm">

                    <div class="mb-3">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" id="name" placeholder="Name:" class="form-control" v-model="product.name"
                            required>
                    </div>

                    <!--div class="mb-3">
                        <label for="category_id_old" class="form-label">Category ID:</label>
                        <input type="number" id="category_id_old" class="form-control" v-model="product.category_id"
                            required>
                    </div-->

                    <!-- Select boxes for categories -->
                    <label for="category_id" class="form-label">Category:</label>
                    <category-select id="category_id" :categories="mainCategories" :level="0" v-model="product.category_id"
                        :selectedCategory="product.category_id"></category-select>

                    <div>
                        <select class="form-control mb-3" :id="'category_id' + level" v-model="product.category_id">
                            <option value="" disabled>Select a category</option>
                            <option v-for="category in mainCategories" :value="category.id" :key="category.id">
                                {{ category.name }}
                            </option>
                        </select>

                        <!-- Recursively render child components for nested categories -->
                        <div v-if="selectedCategory && selectedCategoryHasChildren">
                            <category-select :categories="selectedCategoryChildren" :level="level + 1"
                                v-model="selectedSubCategories[level]">
                            </category-select>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="picture" class="form-label">Picture:</label>
                        <div class="input-group">
                            <input type="file" id="picture" class="form-control" @change="handleFileInput">
                            <label class="input-group-text" for="picture">Choose File</label>
                        </div>
                        <div v-if="product.pictureSrc" class="mt-2">
                            <img :src="product.pictureSrc" alt="Selected Image" class="img-thumbnail"
                                style="max-width: 100px;">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between">
                        <div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> {{ formSubmitButtonText }}
                            </button>
                        </div>
                        <div>
                            <button class="btn btn-secondary">
                                <i class="fas fa-arrow-left"></i> <router-link to="/" class="link-button">Back to
                                    List</router-link>
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import CategorySelect from './components/CategorySelect.vue'
import { ref } from 'vue'

const apiURL = 'http://localhost:8080'


export default {
    data() {
        return {
            formTitle: 'Add Product',
            formSubmitButtonText: 'Add',
            product: {
                category_id: '',
                name: '',
                picture: null,
                pictureSrc: '',
                created_at: '',
            },

            selectedCategories: [], // Initialize an empty array for selected categories
            selectedSubCategories: [],   // Array to store selected subcategory IDs for nested levels
            categories: [
                {
                    "id": 1,
                    "name": "New Category",
                    "picture": "category_image_url",
                    "parent_id": null,
                    "created_at": "2023-09-04T07:02:29.433Z",
                    "updated_at": "2023-09-04T07:02:29.433Z",
                    "children": [
                        {
                            "id": 2,
                            "name": "muz",
                            "picture": "category_image_url",
                            "parent_id": 1,
                            "created_at": "2023-09-04T07:51:32.482Z",
                            "updated_at": "2023-09-04T07:51:32.482Z",
                            "children": [
                                {
                                    "id": 10,
                                    "name": "muz_sub",
                                    "picture": "category_image_url",
                                    "parent_id": 2,
                                    "created_at": "2023-09-05T04:33:11.827Z",
                                    "updated_at": "2023-09-05T04:33:11.827Z",
                                    "children": [
                                        {
                                            "id": 11,
                                            "name": "muz_sub_sub",
                                            "picture": "category_image_url",
                                            "parent_id": 10,
                                            "created_at": "2023-09-05T14:06:50.088Z",
                                            "updated_at": "2023-09-05T14:06:50.088Z",
                                            "children": [
                                                {
                                                    "id": 12,
                                                    "name": "muz_sub_sub_2",
                                                    "picture": "category_image_url",
                                                    "parent_id": 11,
                                                    "created_at": "2023-09-06T17:18:53.832Z",
                                                    "updated_at": "2023-09-06T17:18:53.832Z",
                                                    "children": [
                                                        {
                                                            "id": 13,
                                                            "name": "muz_sub_sub_3",
                                                            "picture": "category_image_url",
                                                            "parent_id": 12,
                                                            "created_at": "2023-09-06T17:19:11.868Z",
                                                            "updated_at": "2023-09-06T17:19:11.868Z",
                                                            "children": [
                                                                {
                                                                    "id": 14,
                                                                    "name": "muz_sub_sub_4",
                                                                    "picture": "category_image_url",
                                                                    "parent_id": 13,
                                                                    "created_at": "2023-09-06T17:19:18.563Z",
                                                                    "updated_at": "2023-09-06T17:19:18.563Z"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "name": "apple",
                            "picture": "category_image_url",
                            "parent_id": 1,
                            "created_at": "2023-09-04T07:51:38.327Z",
                            "updated_at": "2023-09-04T07:51:38.327Z",
                            "children": [
                                {
                                    "id": 15,
                                    "name": "apple_sub",
                                    "picture": "category_image_url",
                                    "parent_id": 3,
                                    "created_at": "2023-09-06T17:19:55.889Z",
                                    "updated_at": "2023-09-06T17:19:55.889Z",
                                    "children": []
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 9,
                    "name": "old",
                    "picture": "category_image_url",
                    "parent_id": null,
                    "created_at": "2023-09-05T04:29:30.914Z",
                    "updated_at": "2023-09-05T04:29:30.914Z",
                    "children": []
                }
            ]
        };
    },
    mounted() {
        if (this.$route.query.editMode) {
            this.formTitle = 'Edit Product';
            this.formSubmitButtonText = 'Update';
            this.product = {
                id: this.$route.query.id,
                category_id: this.$route.query.category_id,
                name: this.$route.query.name,
                picture: this.$route.query.picture,
                pictureSrc: this.$route.query.picture,
                created_at: this.$route.query.createdAt,
            };
        }
    },
    computed: {
        mainCategories() {
            return this.categories.filter(category => !category.parent_id);
        },
        selectedCategoryHasChildren() {
            return this.selectedCategory && this.selectedCategoryChildren.length > 0;
        },
        selectedCategoryChildren() {
            if (this.selectedCategory) {
                const selectedCategory = this.categories.find(category => category.id === this.selectedCategory);
                return selectedCategory ? selectedCategory.children : [];
            }
            return [];
        },
    },
    methods: {
        submitForm() {
            if (this.formSubmitButtonText === 'Add') {
                this.addProduct();
            } else {
                this.updateProduct();
            }
        },
        addProduct() {
            axios
                .post(`${apiURL}/products/`, {
                    category_id: parseInt(this.product.category_id),
                    name: this.product.name,
                    picture: this.product.pictureSrc,
                })
                .then((res) => {
                    console.log('Product added:', res.data);
                    this.resetForm();
                })
                .catch((err) => {
                    console.error('Error adding product:', err);
                });
        },
        updateProduct() {
            console.log("this_PRO:", this.product.asd)

            axios
                .put(`${apiURL}/products/${this.product.id}`, {
                    category_id: parseInt(this.product.category_id),
                    name: this.product.name,
                    picture: this.product.pictureSrc,
                })
                .then((res) => {
                    console.log('Product updated:', res.data);
                    this.resetForm();
                })
                .catch((err) => {
                    console.error('Error updating product:', err);
                });
        },
        resetForm() {
            this.product = {
                category_id: '',
                name: '',
                picture: null,
                pictureSrc: '',
                created_at: '',
            };
            this.$router.push({
                path: '/'
            })
        },
    },
    handleFileInput(event) {
        const file = event.target.files[0];
        this.product.picture = file;
        console.log('file', file);

        const reader = new FileReader();
        reader.onload = () => {
            this.product.pictureSrc = reader.result;
        };
        reader.readAsDataURL(file);
    },
    components: {
        CategorySelect,
    },
    watch: {
        //console.log("product.asdproduct.asd: ",product.asd)
        // Watch for changes in selectedCategories and update product.category_id
        selectedCategories(newVal) {
            console.log("newVal::", newVal)
            // Join the selected category hierarchy into a string (e.g., "1/2/10")
            //this.product.category_id = newVal.join('/');
        },
    },

}

</script>
  
<style scoped>
.container {
    max-width: 500px;
    margin: 0 auto;
}

.card {
    border: none;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
}

.card-body {
    padding: 2rem;
}

.link-button {
    text-decoration: none;
    color: white;
}
</style>
  