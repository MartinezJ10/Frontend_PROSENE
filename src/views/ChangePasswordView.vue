<template>
  <div class="change-password-container">
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div class="card shadow-lg custom-card">
        <div class="card-body">
          <h2 class="text-center mb-4">Cambiar Contraseña</h2>
          <ReusableForm
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
import { ref } from 'vue';
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
    const token = route.params.jwt;

    const fields = ref([
      { name: 'newPassword', label: 'Nueva Contraseña', type: 'password', placeholder: 'Ingrese su nueva contraseña' },
      { name: 'confirmPassword', label: 'Confirmar Nueva Contraseña', type: 'password', placeholder: 'Confirme su nueva contraseña' }
    ]);

    const handleChangePassword = async (formData) => {
      try {
        await axios.post(`http://localhost:8000/api/v1/users/password/${token}`, {
          token: token,
          password: formData.newPassword
        });
        
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

.custom-card {
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 2rem;
}

h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #002D72;
}

input {
  border: 1px solid #0056b3;
  border-radius: 10px;
  padding: 10px;
  font-size: 1rem;
}

input:focus {
  border-color: #FFCC00;
  outline: none;
  box-shadow: 0 0 5px #FFCC00;
}

button {
  background-color: #002D72;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #FFCC00;
  color: #002D72;
}

/* Responsivo */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  input, button {
    font-size: 1rem;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .card-body {
    padding: 1rem;
  }

  h2 {
    font-size: 1.3rem;
  }

  input, button {
    font-size: 0.9rem;
    padding: 6px;
  }
}
</style>
  