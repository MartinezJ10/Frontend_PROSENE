import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import LandingAdmin from '../views/LandingAdmin.vue';
import ManageUsers from '../views/ManageUsers.vue';
import CreateUsers from '../views/CreateUsers.vue';

const routes = [
  { path: '/', redirect: '/login' }, // Redirect to login page
  { path: '/login', component: LoginView },
  { 
    path: '/landingAdmin', 
    component: LandingAdmin,
    children: [
      {
        path: '/manageUsers',
        component: ManageUsers
      },
      {
        path: '/createUsers',
        component: CreateUsers
      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
