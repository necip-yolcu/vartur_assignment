<template>
    <div class="container">

        <div class="card">
            <div class="card-body">
                <h1 class="card-title mb-4">{{ formTitle }}</h1>
                <form @submit.prevent="submitForm" enctype="multipart/form-data">

                    <div class="mb-3">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" id="name" placeholder="Name:" class="form-control" v-model="product.name"
                            required>
                    </div>

                    <!-- Select boxes for categories -->
                    <label for="category_id" class="form-label">Category:</label>

                    <div v-if="!router.currentRoute.value.query.editMode || categorywithParent.length">
                        <category-select id="category_id" :categories="mainCategories" :level="0" :mode="true"
                            :selectedCat="router.currentRoute.value.query.category_id" :categorywithParent="allParentCatId"
                            :editMode="router.currentRoute.value.query.editMode"
                            @selectedCategoryChanged="handleSelectedCategoryChanged" v-model="product.category_id">
                        </category-select>
                    </div>

                    <div class="mb-3">
                        <label for="picture" class="form-label">Picture:</label>
                        <!-- <div class="form-group">
                            <input type="file" class="form-control" name="uploaded_file" @change="handleFileInput"
                                accept="image/*" ref="fileInput">
                        </div> -->
                        <div class="image-input">
                            <img :src="imagePreview" :alt="product.picture" height="50" />
                            <input type="file" class="form-control" @change="handleFileInput">
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

<script setup>
import axios from 'axios';
import CategorySelect from './components/CategorySelect.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()


const apiURL = 'http://localhost:8080';

const formTitle = ref('Add Product');
const formSubmitButtonText = ref('Add');
const product = ref({
    category_id: '',
    name: '',
    picture: null,
    created_at: '',
});

const formData = ref(new FormData())
const fileInput = ref(null);

const categories = ref();
const categorywithParent = ref([]);


onMounted(async () => {
    if (router.currentRoute.value.query.editMode) {
        formTitle.value = 'Edit Product';
        formSubmitButtonText.value = 'Update';
        updateProductFromQuery();
    }
    await getCategories()
    await getParentIDs()
});

const mainCategories = computed(() => categories.value?.filter(category => !category.parent_id));
const allParentCatId = computed(() => categorywithParent.value?.filter(category => category));

const updateProductFromQuery = () => {
    product.value = {
        id: parseInt(router.currentRoute.value.query.id?.toString()),
        category_id: parseInt(router.currentRoute.value.query.category_id?.toString()),
        name: router.currentRoute.value.query.name,
        picture: router.currentRoute.value.query.picture,
        created_at: router.currentRoute.value.query.createdAt,
    };
};

const imagePreview = ref(router.currentRoute.value.query.picture
    ? `${apiURL}/foto/uploads/product/${parseInt(router.currentRoute.value.query.id?.toString())}/${router.currentRoute.value.query.picture}`
    : null
)


const handleSelectedCategoryChanged = (selectedCategoryId) => {
    product.value.category_id = selectedCategoryId;
}

const submitForm = () => {
    if (formSubmitButtonText.value === 'Add') {
        addProduct(product.value.category_id);
    } else {
        updateProduct(product.value.category_id);
    }
};

const getCategories = () => {
    axios
        .get(`${apiURL}/categories/`)
        .then((res) => {
            categories.value = res.data
        })
        .catch((err) => {
            console.error('Error updating product:', err);
        });
};

const getParentIDs = () => {
    axios
        .get(`${apiURL}/categories/parent/${product.value?.category_id}`)
        .then(res => {
            categorywithParent.value = [product.value?.category_id, ...res.data].reverse()
        }).catch((err) => {
            console.error('cat_parent Error getting category:', err);
        });
}

const handleFileInput = async (event) => {
    const file = event.target.files[0];
    console.log("photo_file: ", file)

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);

        product.value.picture = file.name
        formData.value.append('uploaded_file', file)
    }
};

const addProduct = (selectedCategoryId) => {
    axios
        .post(`${apiURL}/products`, {
            category_id: parseInt(selectedCategoryId),
            name: product.value.name,
            picture: product.value?.picture,
        })
        .then(async (res) => {
            await fotoUpload({ todo: "addFoto", TYPE: 'product', id: res.data.id })
            console.log('Product added:', res.data);
            resetForm();
        })
        .catch((err) => {
            console.error('Error adding product:', err);
        });
};

const updateProduct = (updatedCategoryId) => {
    axios
        .put(`${apiURL}/products/${product.value.id}`, {
            category_id: parseInt(updatedCategoryId),
            name: product.value.name,
            picture: product.value.picture,
        })
        .then(async (res) => {
            await fotoUpload({ todo: "updateFoto", TYPE: 'product', id: product.value.id })
            console.log('Product updated:', res.data);
            resetForm()
        })
        .catch((err) => {
            console.error('Error updating product:', err);
        });
};

const fotoUpload = async ({ todo, TYPE, id }) => {
    await axios
        .post(`${apiURL}/foto/${todo}/${TYPE}/${id}`, formData.value,
            { headers: { 'Content-Type': 'multipart/form-data', } }
        )
        .then(res => console.log("photo_send SUCCESS: ", res))
        .catch(err => {
            console.log("photo_send ERROR: ", err)
        })
}

const resetForm = () => {
    product.value = {
        category_id: '',
        name: '',
        picture: null,
        created_at: '',
    };
    router.push({
        path: '/'
    });
};


watch(() => router.currentRoute.value.query, () => {
    updateProductFromQuery();
});

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

.image-input {
    display: flex;
    align-items: center;
    gap: 10px;
    /* Adjust the gap between the image and input as needed */
}

/* Style the file input button to match the Bootstrap style */
.input[type="file"] {
    border: 1px solid #ced4da;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 4px;
    background-color: white;
    color: #495057;
}

/* Hide the default file input appearance */
.input[type="file"] {
    display: none;
}

/* Style the selected file name */
.image-input p {
    margin-top: 5px;
    font-size: 14px;
    color: #6c757d;
}
</style>
  