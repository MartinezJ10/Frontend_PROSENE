<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="container-fluid m-0 p-0" :style="{ backgroundImage: 'url(${images[0]})' }" role="main">
    <div class="row login-container m-0">
      <div class="col-lg-8 d-none d-lg-block left-section">
        <!-- aria-hidden en imagen decorativa para que NVDA no la anuncie -->
        <img :src="images[0]" alt="" class="static-background" aria-hidden="true" />
      </div>

      <div class="col-12 col-lg-4 right-section">
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
                autocomplete="email"
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
                  autocomplete="current-password"
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
import { ref, inject } from 'vue';
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
    const requestURL = inject("requestURL")

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
        const response = await axios.post(`${requestURL}/api/v1/auth/login`, loginForm.value);
        localStorage.setItem("jwt", response.data.token);
        
        const role_id = utils.getCurrentUserRole();

        if (role_id === 3) {
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
        await axios.post(`${requestURL}/api/v1/users/requestreset`, { emailAddress: formData.email });
        showModal.value = false;
        mostrarExito();
      } catch (err) {
        console.error("Error al enviar el correo:", err.message);
        mostrarError();
      }
    };

    const mostrarExito = () => {
      mensaje.value = 'Correo enviado con exito';
      tipo.value = 'exito';
      visible.value = true;
    };

    const mostrarError = () => {
      mensaje.value = 'Error en el inicio de sesión.';
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
  width: 100%;
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
  display: flex;
  height: 100vh;
  padding: 0 5%;
  background-color: #f8f9fa;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Caja del formulario de inicio de sesión */
.login-box {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

/* Estilo para los inputs y botones */
.form-control,
.btn-primary {
  border-color: #003366;
  height: 44px;
}

.form-control:focus,
.btn-primary:focus {
  box-shadow: 0 0 0 0.25rem rgba(0, 51, 102, 0.25);
}

.btn-primary {
  background-color: #003366;
  border-color: #003366;
  min-height: 44px;
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

.top-logo {
  display: block;
  margin: 0 auto 20px;
  width: 80%;
  max-width: 300px;
  height: auto;
}

.bottom-logo {
  position: absolute;
  bottom: 20px;
  width: 120px;
  height: auto;
  margin: 0 auto;
}

.input-group button {
  border-color: #003366;
  min-width: 44px;
}

.input-group button:hover {
  background-color: #003366;
  color: #fff;
}

/* Para dispositivos iOS */
@supports (-webkit-touch-callout: none) {
  input, button, a {
    -webkit-tap-highlight-color: transparent;
  }

  .form-control, .btn {
    --webkit-appearance: none;
    border-radius: 8px;
  }
}

/* Móviles */
@media (max-width: 576px) {
  .login-container {
    flex-direction: column;
    overflow-y: hidden;
    height: 90vh;
  }

  .left-section {
    display: none;
  }

  .right-section {
    padding: 0 15px;
    height: clamp(300px, 90vh, 900px);
    width: 100%;
    justify-content: space-between;
  }

  .login-box {
    width: 100%;
    max-width: 100%;
    margin-top: 10vh;
  }

  .top-logo {
    width: 80%;
    max-width: 250px;
    margin-bottom: 30px;
  }

  .bottom-logo {
    width: 100px;
    bottom: 20px;
    position: relative;
    margin: 20px auto 0;
  }

  @media (max-height: 500px) {
    .login-box {
      margin-top: 5vh;
    }

    .top-logo {
      width: 150px;
      margin-bottom: 10px;
    }

    .bottom-logo {
      width: 80px;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }

    .mb-3 {
      margin-bottom: 0.5rem !important;
    }
  }
}

@media (max-width: 375px) {
  .login-box {
    padding: 15px;
    height: 70vh;
    margin-top: 5vh;
  }

  .right-section {
    padding: 0 15px;
    height: clamp(300px, 90vh, 900px);
    width: 100%;
    justify-content: space-between;
  }
}

/* Tablets: Retrato */
@media (min-width: 768px) and (max-width: 991px) {
  .right-section {
    padding: 0 6%;
  }

  .login-box {
    max-width: 400px;
    padding: 25px;
  }

  .form-control,
  .btn-primary {
    height: 48px;
    font-size: 1.05rem;
  }

  .top-logo {
    margin-bottom: 30px;
    width: 70%;
  }

  .col-md-8.left-section {
    flex: 0 0 60%;
    max-width: 60%;
  }

  .col-md-4.right-section {
    flex: 0 0 40%;
    max-width: 40%;
  }
}

/* Tablets: Paisaje */
@media (min-width: 992px) and (max-width: 1199px) {
  .login-box {
    max-width: 450px;
    padding: 30px;
  }

  .right-section {
    padding: 0 8%;
  }

  .mb-3 {
    margin-bottom: 1.5rem !important;
  }
}

/* Tablets Retina */
@media screen and (min-width: 768px) and (max-width: 1199px) and (-webkit-min-device-pixel-ratio: 2) {
  .login-container {
    background-size: cover;
  }

  .static-background {
    object-fit: cover;
  }

  .input-group button {
    min-width: 50px;
    min-height: 48px;
  }
}

/* Tablets grandes tipo iPad Pro */
@media (min-width: 1024px) and (max-width: 1366px) and (orientation: portrait) {
  .col-md-8.left-section {
    flex: 0 0 55%;
    max-width: 55%;
  }

  .col-md-4.right-section {
    flex: 0 0 45%;
    max-width: 45%;
  }

  .login-box {
    max-width: 500px;
  }
}


/* Ocultar imagen en modo tableta */
@media (min-width: 768px) and (max-width: 1000px) {
  /* Anula el background-image inline del container-fluid */
  .container-fluid {
    background-image: none !important;
  }

  /* Oculta la <img> decorativa dentro de .left-section */
  .left-section img {
    display: none !important;
  }
}

/* Android HDPI */
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .login-box {
    padding: 15px;
  }

  .form-control, .btn-primary {
    border-radius: 4px;
  }
}
</style>
