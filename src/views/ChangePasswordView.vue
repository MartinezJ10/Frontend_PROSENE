<template>
    <div class="change-password-container">
      <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow-lg" style="width: 400px;">
          <div class="card-body">
            <ReusableForm
              :title="'Cambiar Contraseña'"
              :fields="fields"
              :submitButtonText="'Cambiar Contraseña'"
              :onSubmit="handleChangePassword"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter, useRoute } from 'vue-router';
  import ReusableForm from '@/components/ReusableForm.vue';

  export default {
    name: 'ChangePasswordView',
    components: {
      ReusableForm,
    },
    setup() { 
        const router = useRouter();
        const route = useRoute();
        const email = route.params.email;

        const fields = ref([
          { name: 'newPassword', label: 'Nueva Contraseña', type: 'password', placeholder: 'Ingrese su nueva contraseña' },
          { name: 'confirmPassword', label: 'Confirmar Nueva Contraseña', type: 'password', placeholder: 'Confirme su nueva contraseña' }
        ]);

        const handleChangePassword = async (formData) => {
          try {
            const response = await axios.post(
                `http://localhost:8000/api/v1/users/resetpassword/${email}`,
                {
                    email: email,
                    Password: formData.newPassword
                }
            );

            router.push('/login');
          } catch (err) {
            console.error("La contraseña no pudo ser cambiada:", err.message);
          }
        };
        
        return {
            fields,
            handleChangePassword
        };
    }
    };
  </script>
  
  <style scoped>
  .change-password-container {
    background-image: url('@/assets/fondo-unah3.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    height: 100vh;
  }
  </style>
  