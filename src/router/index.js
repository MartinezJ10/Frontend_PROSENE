import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import LandingAdmin from '../views/LandingAdmin.vue';
import ManageUsers from '../views/ManageUsers.vue';
import CreateUsers from '../views/CreateUsers.vue';
import DetailsUser from '../views/DetailsUser.vue';
import CreateStudent from '../views/CreateStudent.vue';
import UserView from '../views/UserView.vue';
import ChangePasswordView from '../views/ChangePasswordView.vue';

const routes = [
  { path: '/', redirect: '/login' }, 
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
        path: '/studentEnrollment', 
        component: CreateStudent , 
      },
      {
        path: '/createUsers',
        component: CreateUsers
      },
      {
        path: '/detailsUser/:id',
        component: DetailsUser,
      },
     
    ]
  },
  {path: '/userView', component: UserView},
  {path: '/usuario/cambiopass/:email', component: ChangePasswordView}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * This function is called every time the user navigates to a new page.
 * Router Navigation Guard 
 */


router.beforeEach(async (to, from) => {
  const isAuthenticated = localStorage.getItem('jwt');

  if (!isAuthenticated && to.path !== '/login') {
    // redirect the user to the login page
    return { path: '/login' }
  }
})

export default router;
