import { createRouter, createWebHistory } from 'vue-router';
import FormItem from './FormItem.vue';
import Index from './Index.vue';

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
    },
    {
        path: '/product',
        name: 'FormProduct',
        component: FormItem,
        props: {
            formType: "products"
        }
    },
    {
        path: '/category',
        name: 'FormCategory',
        component: FormItem,
        props: {
            formType: "categories"
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
