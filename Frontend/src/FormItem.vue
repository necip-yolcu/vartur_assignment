<template>
    <div class="container">
        <div class="card">

            <div class="card-body">
                <h1 class="card-title mb-4">{{ formTitle }}</h1>
                <form @submit.prevent="submitForm" enctype="multipart/form-data">

                    <div class="mb-3">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" id="name" placeholder="Name:" class="form-control" v-model="item.name" required>
                    </div>

                    <!-- Select boxes for categories -->
                    <label for="category_id" class="form-label">Category:</label>

                    <div v-if="!router.currentRoute.value.query.editMode || categorywithParent.length">
                        <category-select id="category_id" :categories="mainCategories" :level="0" :mode="true"
                            :selectedCat="router.currentRoute.value.query.category_id" :categorywithParent="allParentCatId"
                            :editMode="router.currentRoute.value.query.editMode"
                            @selectedCategoryChanged="handleSelectedCategoryChanged" v-model="item.category_id">
                        </category-select>
                    </div>

                    <div class="mb-3">
                        <label for="picture" class="form-label">Picture:</label>
                        <div class="image-input">
                            <img :src="imagePreview" :alt="item.picture" height="50" />
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
import { apiURL } from '@/config'

const router = useRouter()

const formTitle = ref('Add Category/Product');
const formSubmitButtonText = ref('Add');
const item = ref({
    parent_id: '',
    category_id: '',
    name: '',
    picture: null,
    created_at: '',
});

const formData = ref(new FormData())
const fileInput = ref(null);

const categories = ref();
const categorywithParent = ref([]);

const editModeProp = computed(() => router.currentRoute.value.query.editMode);
const typeProp = computed(() => router.currentRoute.value.query.type);
console.log("typeProp", router.currentRoute.value.query.type)
onMounted(async () => {
    console.log("edddddddtt",router.currentRoute.value.query.editMode)
    if (router.currentRoute.value.query.editMode) {
        formTitle.value = `Edit ${router.currentRoute.value.query.type === "categories" ? 'Category' : 'Product'}`;
        formSubmitButtonText.value = 'Update';
        updateItemFromQuery();
    }
    await getCategories()
    await getParentIDs()
});

const mainCategories = computed(() => categories.value?.filter(category => !category.parent_id));
const allParentCatId = computed(() => categorywithParent.value?.filter(category => category));

const updateItemFromQuery = () => {
    item.value = {
        id: parseInt(router.currentRoute.value.query.id?.toString()),
        parent_id: parseInt(router.currentRoute.value.query.parent_id?.toString()),
        category_id: parseInt(router.currentRoute.value.query.category_id?.toString()),
        name: router.currentRoute.value.query.name,
        picture: router.currentRoute.value.query.picture,
        created_at: router.currentRoute.value.query.createdAt,
    };
};

const imagePreview = ref(router.currentRoute.value.query.picture
    ? `${apiURL}/foto/uploads/${router.currentRoute.value.query.type}/${parseInt(router.currentRoute.value.query.id?.toString())}/${router.currentRoute.value.query.picture}`
    : null
)

const handleSelectedCategoryChanged = (selectedCategoryId) => {
    item.value[router.currentRoute.value.query.type === "categories" ? 'parent_id' : 'category_id'] = selectedCategoryId;
}

const submitForm = () => {
    if (formSubmitButtonText.value === 'Add') {
        addItem(item.value[router.currentRoute.value.query.type === "categories" ? 'parent_id' : 'category_id']);
    } else {
        updateItem(item.value[router.currentRoute.value.query.type === "categories" ? 'parent_id' : 'category_id']);
    }
};

const getCategories = () => {
    axios
        .get(`${apiURL}/categories/`)
        .then((res) => {
            categories.value = res.data
        })
        .catch((err) => {
            console.error('Error updating item:', err);
        });
};

const getParentIDs = () => {
    axios
        .get(`${apiURL}/categories/parent/${item.value[router.currentRoute.value.query.type === "categories" ? 'parent_id' : 'category_id']}`)
        .then(res => {
            categorywithParent.value = [item.value[router.currentRoute.value.query.type === "categories" ? 'parent_id' : 'category_id'], ...res.data].reverse()
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

        item.value.picture = file.name
        formData.value.append('uploaded_file', file)
    }
};

const addItem = (selectedCategoryId) => {
    console.log("selectedCategoryId", selectedCategoryId, router.currentRoute.value.query.type)
    axios
        .post(`${apiURL}/${router.currentRoute.value.query.type}`,
            router.currentRoute.value.query.type === "categories" ? {
                parent_id: parseInt(selectedCategoryId),
                name: item.value.name,
                picture: item.value?.picture,
            } : {
                category_id: parseInt(selectedCategoryId),
                name: item.value.name,
                picture: item.value?.picture,
            }
        )
        .then(async (res) => {
            await fotoUpload({ todo: "addFoto", TYPE: router.currentRoute.value.query.type, id: res.data.id })
            console.log('Item added:', res.data);
            resetForm();
        })
        .catch((err) => {
            console.error('Error adding item:', err);
        });
};

const updateItem = (updatedCategoryId) => {
    axios
        .put(`${apiURL}/${router.currentRoute.value.query.type}/${parseInt(router.currentRoute.value.query.id?.toString())}`,
            router.currentRoute.value.query.type === "categories" ? {
                parent_id: parseInt(updatedCategoryId),
                name: item.value.name,
                picture: item.value.picture,
            } : {
                category_id: parseInt(updatedCategoryId),
                name: item.value.name,
                picture: item.value.picture,
            }
        )
        .then(async (res) => {
            await fotoUpload({ todo: "updateFoto", TYPE: router.currentRoute.value.query.type, id: parseInt(router.currentRoute.value.query.id?.toString()) })
            console.log('Item updated:', res.data);
            resetForm()
        })
        .catch((err) => {
            console.error('Error updating item:', err);
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
    item.value = {
        parent_id: '',
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
    updateItemFromQuery();
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
