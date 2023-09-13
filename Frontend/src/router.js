import { createRouter, createWebHistory } from 'vue-router';
import Form from './Form.vue';
import Index from './Index.vue';

const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
    },
    {
        path: '/form',
        name: 'Form',
        component: Form,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
