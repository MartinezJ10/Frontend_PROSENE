<template>
    <div class="form-block" role="main">
      <FormKit
        allow-incomplete
        type="multi-step"
        tab-style="progress"
        hide-navigation
        role="form"
        aria-label="Formulario de creación de estudiante"
        class="responsive-formkit"
      >
        <FormKit
          v-for="step in steps"
          :key="step.key"
          type="step"
          :name="step.key"
          :aria-label="step.label"
        >
          <component
            :is="step.component"
            v-model:formData="formData[step.key]"
            v-bind="step.bindings"
          />
        </FormKit>
      </FormKit>
  
      <Mensaje
        v-if="showMessage"
        :mensaje="messageContent"
        :tipo="messageType"
        :visible="showMessage"
        @update:visible="showMessage = false"
        aria-live="polite"
        class="responsive-mensaje"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, inject } from 'vue'
  import axios from 'axios'
  import StepUsuario from '../components/StepUsuario.vue'
  import StepInscripcion from '../components/StepInscripcion.vue'
  import StepCaracteristicas from '../components/StepCaracteristicas.vue'
  import StepComunicacion from '../components/StepComunicacion.vue'
  import StepDeficiencia from '../components/StepDeficiencia.vue'
  import StepDiscapacidad from '../components/StepDiscapacidad.vue'
  import StepMovilizacion from '../components/StepMovilizacion.vue'
  import StepServicio from '../components/StepServicio.vue'
  import Mensaje from '../components/Mensaje.vue'
  
  // Configuración dinámica de pasos
  const steps = [
    { key: 'usuario', component: StepUsuario, label: 'Paso 1: Información del usuario' },
    { key: 'inscripcion', component: StepInscripcion, label: 'Paso 2: Información de inscripción' },
    { key: 'educacion', component: StepCaracteristicas, label: 'Paso 3: Información educativa' },
    { key: 'comunicacion', component: StepComunicacion, label: 'Paso 4: Métodos de comunicación' },
    { key: 'deficiencia', component: StepDeficiencia, label: 'Paso 5: Deficiencias' },
    { key: 'discapacidad', component: StepDiscapacidad, label: 'Paso 6: Discapacidades' },
    { key: 'movilizacion', component: StepMovilizacion, label: 'Paso 7: Movilización' },
    { key: 'servicio', component: StepServicio, label: 'Paso 8: Servicios requeridos', bindings: { submitForm } }
  ]
  
  // Estado del formulario
  const formData = ref({
    usuario: {},
    inscripcion: { perteneceaasociacion: false, tienetrabajo: false },
    educacion: { estudiaenunah: false },
    comunicacion: { usabraille: false, usalsho: false, usacomunicaciongestual: false, usalecturalabial: false, usacomunicaciontotal: false, usaacabo: false, usodecalculadora: false },
    deficiencia: {},
    discapacidad: {},
    movilizacion: {},
    servicio: { apoyoenprocesodeadmision: false, apoyoenpaa: false, orientaciongeneral: false, orientacionvocacional: false, coordinacionconprofesores: false, orientacionymovilidad: false, transcripcionalbraille: false, lecturaygrabaciondetexto: false, tutorialdemateria: false, serviciodenotarios: false, interpretesdelenguadesenias: false, adecuaciondeaccesoalentorno: false }
  })
  
  // Mensajes de UI
  const showMessage = ref(false)
  const messageContent = ref('')
  const messageType = ref('')
  
  // Configuración de API
  const requestURL = inject('requestURL')
  const api = axios.create({
    baseURL: `${requestURL}/api/v1`,
    headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
  })
  
  // Identificadores
  const userID = ref(null)
  const formularioId = ref(null)
  
  // Pasos de envío dinámicos
  const submissionSteps = [
    {
      endpoint: '/users/create',
      getPayload: f => ({
        email: f.usuario.email,
        password: f.usuario.password,
        idcentroregional: f.usuario.idcentroregional,
        role_id: 3,
        isactive: true,
        correoverificado: false,
        primeracceso: true
      }),
      saveId: res => userID.value = res.idusuario
    },
    {
      endpoint: '/users/detalles_personales',
      getPayload: f => ({ idusuario: userID.value, ...f.usuario })
    },
    {
      endpoint: '/form/inscripcion',
      getPayload: f => {
        const data = { idusuario: userID.value, ...f.inscripcion }
        if (!data.perteneceaasociacion) delete data.nombreasociacion, delete data.rolenlaasociacion
        if (!data.tienetrabajo) delete data.lugartrabajo, delete data.puestotrabajo, delete data.direcciontrabajo, delete data.telefonotrabajo
        return data
      },
      saveId: res => formularioId.value = res.idformulario
    },
    { endpoint: '/form/caracteristicas', getPayload: f => ({ idformulario: formularioId.value, ...f.educacion }) },
    { endpoint: '/form/comunicacion', getPayload: f => ({ idformulario: formularioId.value, ...f.comunicacion }) },
    { endpoint: '/form/deficiencia', getPayload: f => ({ idformulario: formularioId.value, ...f.deficiencia }) },
    { endpoint: '/form/discapacidad', getPayload: f => ({ idformulario: formularioId.value, ...f.discapacidad }) },
    { endpoint: '/form/movilizacion', getPayload: f => ({ idformulario: formularioId.value, ...f.movilizacion }) },
    { endpoint: '/form/servicio', getPayload: f => ({ idformulario: formularioId.value, ...f.servicio }) }
  ]
  
  // Envío del formulario
  async function submitForm() {
    try {
      for (const step of submissionSteps) {
        const { data } = await api.post(step.endpoint, step.getPayload(formData.value))
        step.saveId?.(data)
      }
      messageContent.value = 'Formulario enviado con éxito'
      messageType.value = 'exito'
    } catch (error) {
      console.error(error)
      messageContent.value = 'Error al enviar el formulario'
      messageType.value = 'error'
    } finally {
      showMessage.value = true
    }
  }
  </script>

<style>
:root {
    --fk-max-width-input: none;
    --tab-bg: #f1f1f1;
    --tab-border: 1px solid #ccc;
    --tab-border-radius: 4px;
    --tab-padding: 10px 15px;
    --tab-color: #333;
    --tab-active-bg: #007bff;
    --tab-active-color: #fff;
    --main-padding: 20px;
    --form-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    --transition-speed: 0.3s;
}

label {
    text-align: left;
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 500;
}

/* Asegurar que el contenedor principal no tenga restricciones */
.form-block {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch; /* Cambiado de center a stretch */
    width: 100%;
    padding: var(--main-padding);
    box-sizing: border-box;
}

/* Eliminar el ancho máximo y ajustar los márgenes */
.responsive-formkit {
    width: 100%;
    max-width: 100%; /* Cambiado de 1200px a 100% */
    margin: 0;        /* Cambiado de 0 auto */
    background: #fff;
    border-radius: 8px;
    box-shadow: var(--form-shadow);
    padding: 20px;
}

.formkit-wrapper {
    width: 100%;
    margin: 0;        /* Cambiado de 0 auto */
    transition: all var(--transition-speed) ease;
    max-width: none !important;
}

.formkit-steps {
    border: none !important;
    box-shadow: none !important;
    width: 100%;
    max-width: none;
}

/* Contenedor de pestañas responsivo */
.formkit-tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-bottom: 20px;
    gap: 8px;
    width: 100%;
    overflow-x: auto;
    padding-bottom: 10px;
}

/* Mejoras estéticas para las pestañas */
.formkit-tab {
    background-color: var(--tab-bg);
    border: var(--tab-border);
    border-radius: var(--tab-border-radius);
    padding: var(--tab-padding);
    color: var(--tab-color);
    transition: all var(--transition-speed) ease;
    cursor: pointer;
    white-space: nowrap;
    text-align: center;
    flex: 0 0 auto;
}

.formkit-tab:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.formkit-tab-active {
    background-color: var(--tab-active-bg);
    color: var(--tab-active-color);
    border-color: var(--tab-active-bg);
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 123, 255, 0.3);
}

/* Estilos para el mensaje de éxito/error */
.responsive-mensaje {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 90%;
    width: auto;
}

/* Estilos responsivos para inputs */
.formkit-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color var(--transition-speed) ease;
}

.formkit-input:focus {
    border-color: var(--tab-active-bg);
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Ajustes responsivos para distintos tamaños de pantalla */
@media (max-width: 992px) {
    .responsive-formkit {
        padding: 15px;
    }
    
    .formkit-tab {
        padding: 8px 12px;
        font-size: 14px;
    }
}

@media (max-width: 768px) {
    :root {
        --main-padding: 15px;
    }
    
    .form-block {
        padding: 10px;
    }
    
    .formkit-tabs {
        justify-content: flex-start;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
        padding-bottom: 15px;
    }
    
    .formkit-tab {
        scroll-snap-align: start;
        min-width: 120px;
        font-size: 13px;
    }
    
    label {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .responsive-formkit {
        padding: 10px;
        box-shadow: none;
        border: 1px solid #eee;
    }
    
    .formkit-tab {
        min-width: 100px;
        padding: 6px 10px;
        font-size: 12px;
    }
    
    .formkit-input {
        padding: 8px;
        font-size: 14px;
    }
    
    .responsive-mensaje {
        bottom: 10px;
        right: 10px;
        left: 10px;
        width: auto;
    }
}

/* Mejoras de accesibilidad */
.formkit-tab:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* Animación para transiciones entre pasos */
.formkit-step {
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>