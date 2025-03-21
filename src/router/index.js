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
import utils from '../utils';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/landingAdmin',
    component: LandingAdmin,
    meta: { requiresAuth: true, allowedRoleIds: [1,2] }, 
    children: [
      { path: '/manageUsers', component: ManageUsers, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/studentEnrollment', component: CreateStudent, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/solicitudes', component: Solicitudes, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/detailsSolicitud/:id', component: DetailsSolicitud, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/detailsUser/:id', component: DetailsUser, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/enrollmentDetails/:idusuario', component: EnrollmentDetails, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/WelcomeMessage', component: WelcomeMessage, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/CreateUser', component: CreateUser, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
      { path: '/StudentList', component: StudentsList, meta: { requiresAuth: true, allowedRoleIds: [1, 2] } },
    ],
  },
<<<<<<< Updated upstream
  { path: '/userView', component: UserView, meta: { requiresAuth: true, allowedRoleIds: [3] } }, 
  { path: '/usuario/cambiopass', name: 'ChangePassword', component: ChangePasswordView, meta: { requiresAuth: true, allowedRoleIds: [1, 2, 3] } }, 
=======
  { path: '/userView', component: UserView, meta: { requiresAuth: true, allowedRoleIds: [2, 3] } },
  { path: '/usuario/cambiopass', name: 'ChangePassword', component: ChangePasswordView, meta: { requiresAuth: true, allowedRoleIds: [1, 2, 3] } },
>>>>>>> Stashed changes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt');
  const userRoleId = utils.getCurrentUserRole();

  // Si la ruta requiere autenticación y no hay token, redirigir al login
  if (to.meta.requiresAuth && !token) {
    next('/login');
    return;
  }

  // Decodificar el JWT (si es un JWT válido y no encriptado)
  const expiresToken = utils.getExpires();
  const currentTime = Date.now() / 1000; // Obtener el tiempo actual en segundos

    // Verificar si el token ha expirado
    if (expiresToken < currentTime) {
      localStorage.removeItem('jwt'); // Eliminar el token del localStorage
      next('/login'); // Redirigir al login
      return;
    }

  // Si el usuario no tiene el rol permitido, redirigir al login
  if (to.meta.allowedRoleIds && !to.meta.allowedRoleIds.includes(Number(userRoleId))) {
<<<<<<< Updated upstream
    next('/login');
    return;
=======
    // Redirect to a "not authorized" page or the login page
    return { path: '/login' }; // future custom "403 Forbidden" page
>>>>>>> Stashed changes
  }

  next(); // Permitir la navegación si pasa las validaciones
});


export default router;