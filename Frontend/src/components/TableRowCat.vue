<template>
    <tr :class="'lvl-' + level" v-show="!category.hidden">
        <td>{{ category.id }}</td>
        <td @click="toggleDescendantsVisibility(category)"
            :class="{ parent: category.children && category.children.length > 0 }">
            <span :style="{ marginLeft: (level - 1) * 20 + 'px' }">
                {{ '-'.repeat(level - 1) }} {{ category.name }}
            </span>
        </td>
        <td>
            <img v-if="category.picture" :src="`${apiURL}/foto/uploads/categories/${category.id}/${category.picture}`"
                :alt="category.picture" height="50" />
        </td>
        <td>{{ category.parent_id ? category.parent_id : "-" }}</td>
        <td>{{ formatDateTime(category.created_at) }}</td>
        <td>
            <i class="fas fa-edit me-4 fa-lg" style="color: #0B5ED7" @click="editCategory(category)"></i>
            <i class="fas fa-trash-alt fa-lg" style="color: #DC3545;" @click="confirmDeleteCategory(category)"></i>
        </td>
    </tr>
    <table-row-cat v-for="childCategory in category.children" :key="childCategory.id" :category="childCategory"
        :level="level + 1" @deleteCategory="handleDeleteCategory2" />
</template>
  
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { apiURL } from '@/config'

const { categories, category, level } = defineProps(['categories', 'category', 'level']);;
const emit = defineEmits(['deleteCategory']); // Define an emit function for deleteCategory event


const router = useRouter();

const confirmDeleteCategory = (category) => {
    if (confirm('Are you sure you want to delete this category?')) {
        //deleteCategory(category);
        emit('deleteCategory', category);
    }
};

const handleDeleteCategory2 = (category) => {
    emit('deleteCategory', category);
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

const editCategory = (category) => {
    console.log("edit_C", category);
    router.push({
        path: '/category',
        query: { ...category, editMode: true, type:"categories" }, // Pass the product object as query parameters
    });
};

const toggleDescendantsVisibility = (parent) => {
    //1
    /*parent.expanded = !parent.expanded;

     if (parent.children && parent.children.length > 0) {
        parent.children.forEach((child) => {
            child.hidden = !parent.expanded;
        });
    } */

    //2
    /* parent.expanded = !parent.expanded;
    // Recursive function to toggle visibility of all descendants
    const toggleAllDescendants = (node) => {
        if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
                child.hidden = !node.expanded;
                toggleAllDescendants(child); // Recursively toggle children
            });
        }
    }; 
    toggleAllDescendants(parent);
    */

    //3
    /* const toggleAllDescendants = (node, hide) => {
        if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
                child.hidden = hide;
                toggleAllDescendants(child, hide); // Recursively toggle children
            });
        }
    };
    parent.expanded = !parent.expanded;
    toggleAllDescendants(parent, !parent.expanded); */

    //4
    const toggleAllDescendants = (node, hide) => {
        if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
                child.hidden = hide;
                toggleAllDescendants(child, hide); // Recursively toggle children
            });
        }
    };

    // Check if any descendant is currently visible
    const anyDescendantVisible = (node) => {
        if (node.children && node.children.length > 0) {
            return node.children.some((child) => !child.hidden);
        }
        return false;
    };

    if (anyDescendantVisible(parent)) {
        toggleAllDescendants(parent, true); // If any is visible, hide all
    } else {
        toggleAllDescendants(parent, false); // If all are hidden, show all
    }

    parent.expanded = !parent.expanded;

};
</script>
  