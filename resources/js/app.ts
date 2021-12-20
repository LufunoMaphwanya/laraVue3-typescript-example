require('./bootstrap');

import { createApp } from "vue";
import router from './router';
import BookIndex from './components/books/BookIndex.vue';

const app = createApp({
    components: {
        BookIndex,
    },
}).use(router).mount('#app')
