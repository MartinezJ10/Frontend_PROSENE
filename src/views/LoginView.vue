<template>
  <!-- role="main" define el contenido principal para lectores de pantalla -->
  <div class="login-page" :class="{ 'dark-mode': darkMode }" role="main">
    <div class="login-container">
      <div class="left-section">
        <!-- Optimización: Uso de lazy-loading para la imagen de fondo -->
        <img 
          :src="images[0]" 
          alt="" 
          class="background-image" 
          loading="lazy" 
          aria-hidden="true" 
          :class="{ 'dark-image': darkMode }"
        />
        <div class="overlay" :class="{ 'dark-overlay': darkMode }"></div>
      </div>

      <div class="right-section">
        <div class="login-box" :class="{ 'animate': formLoaded }">
          <img 
            src="@/assets/top-logo.png" 
            alt="Logo de PROSENE" 
            class="top-logo" 
            @load="formLoaded = true"
          />

          <h1 class="text-center">Iniciar Sesión</h1>
          
          <!-- role="form" para lectores de pantalla -->
          <form @submit.prevent="handleLoginSubmit" role="form">
            <div class="form-group">
              <label for="email" class="form-label">Correo Electrónico</label>
              <input 
                v-model="loginForm.email" 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errorFields.includes('email') }"
                id="email" 
                placeholder="Ingrese su correo" 
                required 
                aria-describedby="email-error"
                autocomplete="email"
                @focus="clearFieldError('email')"
              />
              <!-- aria-live para anunciar errores dinámicamente -->
              <div v-if="errorFields.includes('email')" class="error-message" id="email-error" aria-live="polite">
                {{ errorMessages.email || 'Correo electrónico inválido' }}
              </div>
            </div>
            
            <div class="form-group">
              <div class="password-label-container">
                <label for="password" class="form-label">Contraseña</label>
                <a 
                  href="#" 
                  class="forgot-password-link" 
                  @click.prevent="showModal=true" 
                  aria-label="Recuperar contraseña"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div class="input-group"> 
                <input 
                  v-model="loginForm.password" 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control" 
                  :class="{ 'is-invalid': errorFields.includes('password') }"
                  id="password" 
                  placeholder="Ingrese su contraseña" 
                  required 
                  autocomplete="current-password"
                  aria-describedby="password-error"
                  @focus="clearFieldError('password')"
                />
                <button 
                  class="toggle-password-button" 
                  type="button" 
                  @click="togglePasswordVisibility"
                  aria-label="Alternar visibilidad de la contraseña"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
              <div v-if="errorFields.includes('password')" class="error-message" id="password-error" aria-live="polite">
                {{ errorMessages.password || 'Contraseña inválida' }}
              </div>
            </div>

            <button 
              type="submit" 
              class="login-button" 
              aria-label="Iniciar sesión"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting">Ingresar</span>
              <span v-else class="loading-spinner" aria-label="Cargando"></span>
            </button>
            
            <div class="theme-toggle">
              <button 
                type="button" 
                class="theme-button" 
                @click="toggleDarkMode" 
                aria-label="Cambiar tema"
              >
                <i :class="darkMode ? 'bi bi-sun' : 'bi bi-moon'"></i>
              </button>
            </div>
          </form>
        </div>

        <img 
          src="@/assets/bottom-logo.png" 
          alt="Logo inferior" 
          class="bottom-logo" 
        />
      </div>
    </div>
  </div>

  <!-- Componente modal para recuperación de contraseña -->
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
  />

  <!-- Componente de notificación -->
  <MensajeRetroalimentacion
    :mensaje="mensaje"
    :visible="visible"
    :tipo="tipo"
    @update:visible="visible = $event"
    aria-live="polite"
  />
</template>

<script>
import { ref, inject, onMounted } from 'vue';
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
    const errorFields = ref([]);
    const errorMessages = ref({});
    const showPassword = ref(false);
    const isSubmitting = ref(false);
    const formLoaded = ref(false);
    const darkMode = ref(false);
    const requestURL = inject("requestURL");

    // Optimización: Precarga de imágenes
    const images = [new URL('@/assets/fondo-unah1.jpg', import.meta.url).href];
    const loginForm = ref({ email: '', password: '' });

    const createRequestFields = ref([
      { 
        name: "email", 
        label: "Correo Electrónico", 
        type: "email", 
        placeholder: "Ingrese su correo",
        required: true,
        validations: {
          required: "El correo es obligatorio",
          email: "Ingrese un correo válido"
        }
      }
    ]);

    // Inicialización de tema según preferencias del usuario
    onMounted(() => {
      const savedTheme = localStorage.getItem('darkMode');
      darkMode.value = savedTheme === 'true';
      
      // Auto-focus en el campo de email al cargar
      document.getElementById('email')?.focus();
    });

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem('darkMode', darkMode.value.toString());
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const clearFieldError = (field) => {
      errorFields.value = errorFields.value.filter(f => f !== field);
      if (errorMessages.value[field]) {
        delete errorMessages.value[field];
      }
    };

    const validateForm = () => {
      let isValid = true;
      errorFields.value = [];
      errorMessages.value = {};

      // Validación de email
      if (!loginForm.value.email) {
        errorFields.value.push('email');
        errorMessages.value.email = 'El correo es obligatorio';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.value.email)) {
        errorFields.value.push('email');
        errorMessages.value.email = 'Ingrese un correo válido';
        isValid = false;
      }

      // Validación de contraseña
      if (!loginForm.value.password) {
        errorFields.value.push('password');
        errorMessages.value.password = 'La contraseña es obligatoria';
        isValid = false;
      }

      return isValid;
    };

    const handleLoginSubmit = async () => {
      if (!validateForm()) return;
      
      isSubmitting.value = true;
      
      try {
        const response = await axios.post(`${requestURL}/api/v1/auth/login`, loginForm.value);
        localStorage.setItem("jwt", response.data.token);
        
        const role_id = utils.getCurrentUserRole();

        // Redirección según el rol del usuario
        if (role_id === 3) {
          router.push("/userView");
        } else {
          router.push("/WelcomeMessage");
        }
      } catch (err) {
        console.error("Login failed:", err.message);
        errorFields.value = ['email', 'password'];
        errorMessages.value = {
          email: 'Credenciales incorrectas',
          password: 'Credenciales incorrectas'
        };
        mostrarError('Los datos ingresados son incorrectos');
      } finally {
        isSubmitting.value = false;
      }
    };
    
    const handleSendEmail = async (formData) => {
      try {
        await axios.post(`${requestURL}/api/v1/users/requestreset`, { emailAddress: formData.email });
        showModal.value = false;
        mostrarExito('Se ha enviado un correo con instrucciones para recuperar tu contraseña');
      } catch (err) {
        console.error("Error al enviar el correo:", err.message);
        mostrarError('No se pudo enviar el correo de recuperación');
      }
    };

    const mostrarExito = (msg) => {
      mensaje.value = msg || 'Operación completada con éxito';
      tipo.value = 'exito';
      visible.value = true;
    };

    const mostrarError = (msg) => {
      mensaje.value = msg || 'Ocurrió un error';
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
      errorFields,
      errorMessages,
      clearFieldError,
      reusableFormComponent: ReusableForm,
      createRequestFields,
      showPassword,
      togglePasswordVisibility,
      isSubmitting,
      formLoaded,
      darkMode,
      toggleDarkMode
    };
  }	
};
</script>

<style scoped>
/* Variables CSS para facilitar cambios de tema */
:root {
  --primary-color: #003366;
  --primary-hover: #002244;
  --background-light: #f8f9fa;
  --text-dark: #212529;
  --text-light: #f8f9fa;
  --border-color: #ced4da;
  --error-color: #dc3545;
  --success-color: #28a745;
  --input-bg: #ffffff;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --transition-speed: 0.3s;
  --overlay-color: rgba(0, 0, 0, 0.1);
  --dark-overlay-color: rgba(0, 0, 0, 0.7);
}

/* Tema oscuro */
.dark-mode {
  --primary-color: #0066cc;
  --primary-hover: #0055aa;
  --background-light: #1a1a1a;
  --text-dark: #f8f9fa;
  --text-light: #f8f9fa;
  --border-color: #444;
  --input-bg: #333;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

/* Estilos generales */
.login-page {
  min-height: 100vh;
  background-color: var(--background-light);
  color: var(--text-dark);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  transition: background-color var(--transition-speed), color var(--transition-speed);
}

.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Sección izquierda con imagen */
.left-section {
  position: relative;
  flex: 1;
  overflow: hidden;
  display: none;
}

@media (min-width: 992px) {
  .left-section {
    display: block;
  }
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  transition: filter var(--transition-speed);
}

/* Filtro para oscurecer la imagen en modo oscuro */
.background-image.dark-image {
  filter: brightness(0.6) contrast(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--overlay-color);
  transition: background-color var(--transition-speed);
}

/* Superposición más oscura para el modo oscuro */
.overlay.dark-overlay {
  background-color: var(--dark-overlay-color);
}

/* Sección derecha con formulario */
.right-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  box-sizing: border-box;
  background-color: var(--background-light);
  transition: background-color var(--transition-speed);
}

/* Caja del formulario */
.login-box {
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 24px var(--shadow-color);
  background-color: var(--background-light);
  transition: all var(--transition-speed);
  transform: translateY(20px);
  opacity: 0;
}

.login-box.animate {
  transform: translateY(0);
  opacity: 1;
}

.top-logo {
  display: block;
  margin: 0 auto 1.5rem;
  max-width: 200px;
  height: auto;
  transition: filter var(--transition-speed);
}

.dark-mode .top-logo {
  filter: brightness(1.2);
}

h1 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  font-weight: 600;
}

/* Grupos de formulario */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-dark);
}

.password-label-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.forgot-password-link {
  font-size: 0.875rem;
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-speed);
}

.forgot-password-link:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* Campos de formulario */
.form-control {
  width: 100%;
  height: 48px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--input-bg);
  color: var(--text-dark);
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed), background-color var(--transition-speed);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.25);
}

.form-control.is-invalid {
  border-color: var(--error-color);
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
}

/* Grupo de input para contraseña */
.input-group {
  display: flex;
  position: relative;
}

.toggle-password-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.1rem;
  transition: color var(--transition-speed);
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password-button:hover {
  color: var(--primary-hover);
}

/* Mensajes de error */
.error-message {
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.375rem;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Botón de inicio de sesión */
.login-button {
  width: 100%;
  height: 48px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-speed), transform var(--transition-speed);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}


.login-button:active {
  transform: scale(0.98);
}

.login-button:disabled {
  background-color: var(--primary-color);
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner de carga */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Toggle de tema */
.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.theme-button {
  background: none;
  border: none;
  color: var(--text-dark);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-speed), color var(--transition-speed);
  min-width: 40px;
  min-height: 40px;
}

.theme-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark-mode .theme-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Logo inferior */
.bottom-logo {
  position: absolute;
  bottom: 1.5rem;
  width: 100px;
  height: auto;
  transition: filter var(--transition-speed);
}

.dark-mode .bottom-logo {
  filter: brightness(1.2);
}

/* Estilos responsivos */
@media (max-width: 576px) {
  .right-section {
    padding: 1rem;
  }
  
  .login-box {
    padding: 1.5rem;
    box-shadow: none;
  }
  
  .top-logo {
    max-width: 150px;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .bottom-logo {
    width: 80px;
  }
}

/* Mejoras para dispositivos táctiles */
@media (hover: none) {
  .form-control, .login-button, .toggle-password-button {
    cursor: default;
  }
}

/* Estilos para iOS/Safari */
@supports (-webkit-touch-callout: none) {
  input, button, a {
    -webkit-tap-highlight-color: transparent;
  }

  .form-control, .login-button {
    --webkit-appearance: none;
    border-radius: 8px;
  }
}

/* Media query para tablets */
@media (min-width: 768px) and (max-width: 991px) {
  .right-section {
    max-width: 400px;
  }
}

/* Media query para pantallas grandes */
@media (min-width: 1200px) {
  .login-box {
    max-width: 450px;
  }
}
</style>