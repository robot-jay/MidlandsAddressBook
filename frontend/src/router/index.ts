import { createRouter, createWebHistory } from 'vue-router';
import ContactsView from '../views/ContactsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'contacts',
      component: ContactsView,
    },
  ],
});

export default router;