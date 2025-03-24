<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="container-fluid m-0 p-0" :style="{ backgroundImage: 'url(${images[0]})' }" role="main">
    <div class="row login-container m-0">
      <div class="col-md-8 d-none d-md-block left-section">
        <!-- aria-hidden en imagen decorativa para que NVDA no la anuncie -->
        <img :src="images[0]" alt="" class="static-background" aria-hidden="true" />
      </div>

      <div class="col-md-4 right-section">
        <div class="login-box">
          <img src="@/assets/top-logo.png" alt="Logo de PROSENE" class="top-logo" />

          <h2 class="text-center mb-4">Iniciar Sesión</h2>
          
          <!-- role="form" identifica el formulario para NVDA -->
          <form @submit.prevent="handleLoginSubmit" role="form">
            <div class="mb-3">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input 
                v-model="loginForm.email" 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errorsLogin }"
                id="email" 
                placeholder="Ingrese su correo" 
                required 
                aria-describedby="email-error"
              />
              <!-- aria-live para anunciar errores dinámicamente -->
              <div v-if="errorsLogin" class="invalid-feedback" id="email-error" aria-live="polite">
                {{ errorsLogin }}
              </div>
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <div class="input-group"> 
                <input 
                  v-model="loginForm.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  :class="{ 'is-invalid': errorsLogin }"
                  id="password" 
                  placeholder="Ingrese su contraseña" 
                  required 
                  autocomplete="new-password"
                  aria-describedby="password-error"
                />
                <!-- aria-label describe el botón para NVDA -->
                <button 
                  class="btn btn-outline-secondary" 
                  type="button" 
                  @click="togglePasswordVisibility"
                  aria-label="Alternar visibilidad de la contraseña"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="errorsLogin" class="invalid-feedback" id="password-error" aria-live="polite">
                {{ errorsLogin }}
              </div>
            </div>

            <!-- aria-label en el botón para claridad -->
            <button type="submit" class="btn btn-primary w-100" aria-label="Iniciar sesión">Ingresar</button>
          </form>
          
          <div class="mb-3 text-center">
            <!-- aria-label en el enlace para describir su función -->
            <a href="#" class="btn btn-link" @click.prevent="showModal=true" aria-label="Recuperar contraseña">
              ¿Olvidaste tu contraseña?
            </a>
            <!-- role="dialog" para el modal -->
            <FormModal 
              title="Recuperar Contraseña" 
              v-model="showModal" 
              :reusableForm="reusableFormComponent" 
              :formProps="{
                fields: createRequestFields,
                submitButtonText: 'Enviar Correo',
                onSubmit: handleSendEmail
              }"
              role="dialog"
              aria-label="Modal de recuperación de contraseña"
            >
            </FormModal>
          </div>
        </div>

        <img src="@/assets/bottom-logo.png" alt="Logo inferior" class="bottom-logo" />
      </div>
    </div>
  </div>

  <!-- aria-live para anunciar mensajes dinámicos -->
  <MensajeRetroalimentacion
    :mensaje="mensaje"
    :visible="visible"
    :tipo="tipo"
    @update:visible="visible = $event"
    aria-live="polite"
  />
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import FormModal from '@/components/FormModal.vue';
import ReusableForm from '@/components/ReusableForm.vue';
import MensajeRetroalimentacion from '@/components/Mensaje.vue';
import utils from '../utils';

export default {
  name: 'LoginView',
  components: { FormModal, MensajeRetroalimentacion, ReusableForm },
  setup() {
    const router = useRouter();
    const showModal = ref(false);
    const mensaje = ref('');
    const visible = ref(false);
    const tipo = ref('');
    const errorsLogin = ref('');
    const showPassword = ref(false);

    const images = [new URL('@/assets/fondo-unah1.jpg', import.meta.url).href];
    const loginForm = ref({ email: '', password: '' });

    const createRequestFields = ref([
      { name: "email", label: "Correo Electrónico", type: "email", placeholder: "Ingrese su correo" }
    ]);

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const handleLoginSubmit = async () => {
      try {
        const response = await axios.post("http://localhost:8000/api/v1/auth/login", loginForm.value);
        localStorage.setItem("jwt", response.data.token);
        
        const role_id = utils.getCurrentUserRole();

        if (role_id === 3) {
          console.log("Redireccionando...");
          router.push("/userView");
        } else {
          router.push("/WelcomeMessage");
        }
      } catch (err) {
        console.error("Login failed:", err.message);
        errorsLogin.value = 'Correo o contraseña incorrectos.';
        mostrarError();
      }
    };
    
    const handleSendEmail = async (formData) => {
      try {
        await axios.post("http://localhost:8000/api/v1/users/requestreset", { emailAddress: formData.email });
        showModal.value = false;
        mostrarExito();
      } catch (err) {
        console.error("Error al enviar el correo:", err.message);
        mostrarError();
      }
    };

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

    return { 
      images,
      loginForm,
      handleLoginSubmit,
      handleSendEmail, 
      showModal, 
      mensaje, 
      visible, 
      tipo, 
      mostrarExito, 
      mostrarError, 
      errorsLogin,
      reusableFormComponent: ReusableForm,
      createRequestFields,
      showPassword,
      togglePasswordVisibility
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

.input-group button {
  border-color: #003366;
}

.input-group button:hover {
  background-color: #003366;
  color: #fff;
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
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>