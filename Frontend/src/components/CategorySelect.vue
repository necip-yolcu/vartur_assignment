<template>
    <div>
        <select class="form-control mb-3" :id="'category_id' + level" @change="handleCategoryChange"
            v-model="selectedCategory">
            <option value="" disabled>Select a category</option>
            <option v-for="category in categories" :value="category.id" :key="category.id">{{ category.name }}</option>
        </select>

        <!-- Recursively render child components for nested categories -->
        <div v-if="selectedCategory && selectedCategoryHasChildren">
            <category-select 
                :categories="selectedCategoryChildren" 
                :level="level + 1" 
                :mode="true"
                :selectedCat="selectedCategoryByLevel(level + 1)" 
                :categorywithParent="catMode && props.categorywithParent"
                @selectedCategoryChanged="handleCategoryChange2" v-model="selectedSubCategories[level]">
            </category-select>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted, watch, defineProps, defineEmits, nextTick } from 'vue';
import axios from 'axios';

const apiURL = 'http://localhost:8080';

const props = defineProps({
    categories: Array,
    level: Number,     // Level of nesting
    mode: Boolean,
    value: [String, Number],
    selectedCat: Number,
    editMode: Boolean,
    categorywithParent: Array
});

const emits = defineEmits(['selectedCategoryChanged']);

const selectedCategory = ref();
const selectedSubCategories = ref([]);
const catMode = ref(true)

onMounted(async () => {
    selectedCategory.value = selectedCategoryByLevel(props.level);
})

const localCategoryWithParent = computed(() => props.categorywithParent);

const selectedCategoryByLevel = ((level) => {
    if (level >= 0 && level < localCategoryWithParent.value?.length) {
        return localCategoryWithParent.value[level];
    }
    return null;
});

const selectedCategoryHasChildren = computed(() => selectedCategory.value && selectedCategoryChildren.value.length > 0);

const selectedCategoryChildren = computed(() => {
    if (selectedCategory.value) {
        const selectedCategoryItem = props.categories?.find(category => category.id === selectedCategory.value);
        return selectedCategoryItem ? selectedCategoryItem.children : [];
    }
    return [];
});

const handleCategoryChange = () => {
    const selectedCategoryId = selectedCategory.value; // Get the selected category ID
    emits('selectedCategoryChanged', selectedCategoryId);
    catMode.value = false
}

const handleCategoryChange2 = (selectedCategoryId) => {
    emits('selectedCategoryChanged', selectedCategoryId);
}

</script>