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
                        <div class="form-group">
                            <!--input type="file" accept="image/*" name="photo_sending_name" id="picture" class="form-control-file" @change="handleFileInput"-->
                            <input type="file" class="form-control-file" name="uploaded_file" @change="handleFileInput">
                            <!--input name="image" id="image" accept="image/*" @change="handleFileInput"-->
                            <label class="input-group-text" for="picture">Choose File</label>
                        </div>
                        <!--div v-if="product.pictureSrc" class="mt-2">
                            <img :src="product.pictureSrc" alt="Selected Image" class="img-thumbnail"
                                style="max-width: 100px;">
                        </div-->
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
    pictureSrc: '',
    created_at: '',
});

const categories = ref();
const categorywithParent = ref([]);
const updatedCategoryId = ref(null);


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
        pictureSrc: router.currentRoute.value.query.picture,
        created_at: router.currentRoute.value.query.createdAt,
    };
};

const handleSelectedCategoryChanged = (selectedCategoryId) => {
    updatedCategoryId.value = selectedCategoryId;
}

const submitForm = () => {
    if (formSubmitButtonText.value === 'Add') {
        addProduct(updatedCategoryId.value);
    } else {
        updateProduct(updatedCategoryId.value);
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

const addProduct = (updatedCategoryId) => {
    axios
        .post(`${apiURL}/products`, {
            category_id: parseInt(updatedCategoryId),
            name: product.value.name,
            picture: product.value?.pictureSrc,
        })
        .then((res) => {
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
            picture: product.value.pictureSrc,
        })
        .then((res) => {
            console.log('Product updated:', res.data);
            resetForm();
        })
        .catch((err) => {
            console.error('Error updating product:', err);
        });
};

const resetForm = () => {
    product.value = {
        category_id: '',
        name: '',
        picture: null,
        pictureSrc: '',
        created_at: '',
    };
    router.push({
        path: '/'
    });
};

const handleFileInput = async (event) => {
    const file = event.target.files[0];
    console.log("photo_file: ", file)

    let data = new FormData()
    await data.append('uploaded_file', file)
    console.log("photo_formData_after_append", data)

    const TYPE = 'product'
    const photoID = 1

    await axios
        .post(`${apiURL}/foto/addFoto/${TYPE}/1`, data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    //'Accept': 'application/json',
                }
            }
        )
        .then(res => console.log("photo_send SUCCESS: ", res))
        .catch(err => {
            console.log("photo_formData_after_error", data)

            console.log("photo_send ERROR: ", err)
        })

    //product.value.picture = file;
    //console.log('file', file);

    /*const reader = new FileReader();
    reader.onload = async () => {
        //product.value.pictureSrc = reader.result;
        //if (file) {
        let data = new FormData()
        await data.append('uploaded_file', reader.result)
        console.log("photo_formData_after_append", data)

        const TYPE = 'product'
        const photoID = 1

        await axios
            .post(`${apiURL}/foto/addFoto/${TYPE}/1`, data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        //'Content-Type': 'application/json',
                    }
                }
            )
            .then(res => console.log("photo_send SUCCESS: ", res))
            .catch(err => {
                console.log("photo_formData_after_error", data)

                console.log("photo_send ERROR: ", err)
            })
        //}
    };
    reader.readAsDataURL(file);*/



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
</style>
  