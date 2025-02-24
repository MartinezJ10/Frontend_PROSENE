<template>
  <div
    class="container-fluid m-0 p-0"
    :style="{ backgroundImage: 'url(${images[0]})' }"
  >
    <div class="row login-container m-0">
      <!-- Sección izquierda con la imagen estática -->
      <div class="col-md-8 d-none d-md-block left-section">
        <img :src="images[0]" alt="Imagen de fondo" class="static-background" />
      </div>

      <!-- Sección derecha - Login -->
      <div class="col-md-4 right-section">
        <div class="login-box">
          <!-- Logo de la parte superior -->
          <img src="@/assets/top-logo.png" alt="Logo de la UNAH" class="top-logo" />

          <!-- Usamos el componente ReusableForm aquí -->
          <ReusableForm
            title="Iniciar Sesión"
            :fields="loginFields"
            :submitButtonText="'Ingresar'"
            @submit="handleLoginSubmit"
          >
          <template #extra-links>
              <div class="mb-3 text-center">
                <a href="#" class="btn btn-link" @click="showModal=true">¿Olvidaste tu contraseña?</a>
                <FormModal 
                        title="Recuperar Contraseña" 
                        v-model="showModal" 
                        :reusableForm="reusableFormComponent" 
                        :formProps="{
                            fields: createRequestFields,
                            submitButtonText: 'Enviar Correo',
                            onSubmit: handleSendEmail
                        }">
                    </FormModal>
              </div>
            </template>
          </ReusableForm>
        </div>
        <!-- Logo en la esquina inferior derecha -->
        <img src="@/assets/bottom-logo.png" alt="Logo inferior" class="bottom-logo" />
        
      </div>
    </div>
  </div>

  <div >
                    <MensajeRetroalimentacion
                        :mensaje="mensaje"
                        :visible="visible"
                        :tipo="tipo"
                        @update:visible="visible = $event"
                    />
                    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import ReusableForm from '@/components/ReusableForm.vue';
import FormModal from '@/components/FormModal.vue';
import MensajeRetroalimentacion from '@/components/Mensaje.vue';

export default {
  name: 'LoginView',
  components: {
    ReusableForm,
    FormModal,
    MensajeRetroalimentacion
  },
  setup() {
    const showModal = ref(false);
    const router = useRouter();
    const mensaje = ref('');
    const visible = ref(false);
    const tipo = ref('');

    const images = [
      new URL('@/assets/fondo-unah1.jpg', import.meta.url).href,
    ];

    const loginFields = ref([
      { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'Ingrese su correo' },
      { name: 'password', label: 'Contraseña', type: 'password', placeholder: 'Ingrese su contraseña' }
    ]);

    const createRequestFields = ref([
      { name: "email", label: "Correo Electrónico", type: "email", placeholder: "Ingrese su correo" }
    ]);

    // Función de envío del formulario
    const handleLoginSubmit = async (formData) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/auth/login",
          {
            email: formData.email,
            password: formData.password
          }
        );

        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("user_id",response.data.idusuario)
        
        // Redireccionar según el rol
        if (response.data.role_id === 3) {
          router.push("/userView");
        } else {
          router.push("/landingAdmin");
        }
      } catch (err) {
        console.error("Login failed:", err.message);
      }
    };

    const handleSendEmail = async (formData) => {
      try {
        await axios.post(
          "http://localhost:8000/api/v1/users/requestreset",
          {
            emailAddress: formData.email
          }
        );
        console.log("Email enviado");
        showModal.value = false;
        mostrarExito();
      } catch (err) {
        console.error("Error al enviar el correo:", err.message);
        mostrarError();
      }
    };

            // Funciones para los mensajes de retroalimentación
            const mostrarExito = () => {
            mensaje.value = 'Operación realizada con éxito.';
            tipo.value = 'exito';
            visible.value = true;
        };

        const mostrarError = () => {
            mensaje.value = 'Ocurrió un error inesperado.';
            tipo.value = 'error';
            visible.value = true;
        };

        const mostrarAdvertencia = () => {
            mensaje.value = 'Ten cuidado con los datos ingresados.';
            tipo.value = 'advertencia';
            visible.value = true;
        };


    return {
      images,
      loginFields,
      createRequestFields,
      handleLoginSubmit,
      handleSendEmail,
      showModal,
      reusableFormComponent: ReusableForm,
      mostrarAdvertencia,
      mostrarError,
      mostrarExito,
      mensaje,
      visible,
      tipo
    };
  }
};
</script>

<style scoped>
/* Contenedor principal */
.login-container {
  background-size: cover;
  background-position: center;
  height: 100vh;
}

/* Sección de imágenes en la parte izquierda */
.left-section {
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  height: 100vh;
}

.left-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Sección de inicio de sesión */
.right-section {
  display: block;
  height: 100vh;
  padding: 0 5%;
  background-color: #f8f9fa;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

/* Caja del formulario de inicio de sesión */
.login-box {
  width: 100%;
  max-width: 400px;
  margin-top: 50px;
  background-color: #f8f9fa;
}

/* Estilo para los inputs y botones */
.form-control,
.btn-primary {
  border-color: #003366;
}

.form-control:focus,
.btn-primary:focus {
  box-shadow: 0 0 0 0.25rem rgba(0, 51, 102, 0.25);
}

.btn-primary {
  background-color: #003366;
  border-color: #003366;
}

.btn-primary:hover {
  background-color: #002244;
  border-color: #002244;
}

.is-valid {
  border-color: #003366;
}

.is-invalid {
  border-color: red;
}

/* Estilo para el enlace "Olvidaste tu contraseña" */
.forgot-password {
  display: block;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
}

.forgot-password a {
  text-decoration: none;
  color: #003366;
}

.forgot-password a:hover {
  text-decoration: underline;
}

/* Estilo para los logos */
.top-logo {
  display: block;
  margin: 0 auto 20px;
  width: 300px;
  height: auto;
}

.bottom-logo {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 120px;
  height: auto;
}

/* Media Query para pantallas móviles */
@media (max-width: 767px) {
  .login-container {
    flex-direction: column-reverse;
  }

  .left-section {
    display: none;
  }

  .right-section {
    padding: 0 15px;
  }

  .login-box {
    width: 100%;
    max-width: 400px;
    margin-top: 5vh;
    background-color: #f8f9fa;
  }

  .top-logo {
    width: 250px;
  }

  .bottom-logo {
    width: 100px;
    bottom: 10px;
    right: 10px;
  }
}
</style>