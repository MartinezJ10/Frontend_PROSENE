import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import LandingAdmin from '../views/LandingAdmin.vue';
import ManageUsers from '../views/ManageUsers.vue';
import DetailsUser from '../views/DetailsUser.vue';
import CreateStudent from '../views/CreateStudent.vue';
import Solicitudes from '../views/Solicitudes.vue';
import DetailsSolicitud from '../views/DetailsSolicitud.vue';
import UserView from '../views/UserView.vue';
import ChangePasswordView from '../views/ChangePasswordView.vue';
import EnrollmentDetails from '../views/EnrollmentDetails.vue';
import WelcomeMessage from '../views/WelcomeMessage.vue';
import CreateUser from '../views/CreateUser.vue';
import StudentsList from '../views/StudentsList.vue';

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
        path: '/solicitudes',
        component: Solicitudes,
      }, 
      {
        path: '/detailsSolicitud/:id',
        component: DetailsSolicitud,
      },
      {
        path: '/detailsUser/:id',
        component: DetailsUser,
      },
      {
        path: '/enrollmentDetails/:idusuario',
        component: EnrollmentDetails,
      },
      {
        path: '/WelcomeMessage',
        component: WelcomeMessage
      },
      {
        path: '/CreateUser',
        component: CreateUser
      },
      {
        path: '/StudentList',
        component: StudentsList
      },
    ]
  },
  {path: '/userView', component: UserView},
  {path: '/usuario/cambiopass', name: 'ChangePassword', component: ChangePasswordView}
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

  // Verificamos si es la ruta de cambio de contraseña
  const isChangePasswordRoute = to.path.startsWith('/usuario/cambiopass/');

  if (!isAuthenticated && to.path !== '/login' && !isChangePasswordRoute) {
    return { path: '/login' };
  }
});


export default router;
