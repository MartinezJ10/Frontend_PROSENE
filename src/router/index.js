import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import LandingAdmin from '../views/LandingAdmin.vue';
import ManageUsers from '../views/ManageUsers.vue';
import ListUsers from '../views/ListUsers.vue';

const routes = [
  { path: '/', redirect: '/login' }, // Redirect to login page
  { path: '/login', component: LoginView },
  { path: '/landingAdmin', component: LandingAdmin},
  { path: '/manageUsers', component: ManageUsers},
  { path: '/listUsers', component: ListUsers},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
