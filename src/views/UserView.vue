<template>
    <div id="app" class="app">
      <header class="header d-flex justify-content-between align-items-center px-3">
        <div class="d-flex align-items-center">
          <img src="@/assets/logo_unah.png" alt="Logo UNAH" class="logo me-3" />
        </div>
        <div class="d-flex justify-content-center flex-grow-1 tittle-container">
          <h1 class="m-0">Solicitudes Académicas</h1>
        </div>
        <div>
          <MensajeRetroalimentacion :mensaje="mensaje" :visible="visible" :tipo="tipo"
            @update:visible="visible = $event" />
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary request-button" @click="showModal = true">
            <i class="bi bi-plus-circle me-2"></i> Crear solicitud
          </button>
          <FormModal title="Crear Solicitud" v-model="showModal" :reusableForm="reusableFormComponent"
            :formProps="{
              fields: createRequestFields,
              submitButtonText: 'Crear Solicitud',
              onSubmit: handleRequestCreationSubmit
            }">
          </FormModal>
          <!-- Notification Button -->
          <button class="btn btn-light border notification-button" @click="toggleNotificationPanel">
            <i class="bi bi-bell"></i>
          </button>
          <!-- Notification Panel -->
          <NotificationPanel v-if="isNotificationPanelVisible" @close="toggleNotificationPanel" />
          <button class="btn btn-danger d-flex align-items-center logout-button" @click="handleExit">
            <i class="bi bi-box-arrow-left me-2"></i> Cerrar sesión
          </button>
        </div>
        <div class="mobile-dropdown dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" id="mobileMenu" data-bs-toggle="dropdown">
            Menú
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" @click="showModal = true">Crear solicitud</a></li>
            <li><a class="dropdown-item" href="#" @click="toggleNotificationPanel">Notificaciones</a></li>
            <li><a class="dropdown-item" href="#" @click="handleExit">Cerrar sesión</a></li>
          </ul>
        </div>
      </header>
  
      <main class="container-fluid">
        <h2 class="dashboard-title">Dashboard de Solicitudes</h2>
        <div class="dashboard-container p-4">
          <div v-if="false" v-for="(request, index) in requests" :key="index" class="request-item">
            <span class="request-id">#{{ request.id }}</span>
            <span class="request-description">{{ request.description }}</span>
            <span :class="['request-status', getStatusClass(request.status)]">{{ request.status }}</span>
          </div>
          <div v-else class="no-requests">
            No hay solicitudes registradas.
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useRouter } from "vue-router";
  import { onMounted, ref } from 'vue';
  import FormModal from "../components/FormModal.vue";
  import ReusableForm from "../components/ReusableForm.vue";
  import MensajeRetroalimentacion from "../components/Mensaje.vue";
  import NotificationPanel from "../components/NotificationPanel.vue";
  
  export default {
    name: "UserView",
    components: { FormModal, ReusableForm, MensajeRetroalimentacion, NotificationPanel },
    setup() {
      const showModal = ref(false);
      const router = useRouter();
      const mensaje = ref('');
      const tipoSolicitudes = ref([]);
      const visible = ref(false);
      const tipo = ref('');
      const createRequestFields = ref([]);
      const isNotificationPanelVisible = ref(false); // State to control notification panel visibility
  
      // Toggle notification panel
      const toggleNotificationPanel = () => {
        isNotificationPanelVisible.value = !isNotificationPanelVisible.value;
      };
  
      const errorLog = async (err) => {
        console.error("ERROR IN REQUEST:", {
          message: err.message,
          response: err.response,
          request: err.request,
          config: err.config
        });
      };
  
      const retrieveTipoSolicitudes = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/varios/tipos",
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
              }
            }
          );
          tipoSolicitudes.value = response.data.map((tipoSolicitud) => ({
            value: tipoSolicitud.idtiposolicitud,
            label: tipoSolicitud.descripcion
          }));
        } catch (err) {
          errorLog(err);
        }
      };
  
      const handleRequestCreationSubmit = async (formData) => {
        try {
          await axios.post("http://localhost:8000/api/v1/solicitudes/nueva", {
            idusuariosolicitante: localStorage.getItem("user_id"),
            idresponsablesolicitud: 3,
            idtiposolicitud: formData.requestType,
            idestadosolicitud: 1,
            fechacreacion: new Date().toISOString(),
            descripcion: formData.description,
          }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem("jwt")}` }
          });
          showModal.value = false;
          mostrarExito();
        } catch (err) {
          console.error("Request creation failed:", err.message);
          mostrarError();
        }
      };
  
      const handleExit = () => {
        localStorage.setItem("jwt", "");
        router.push("/login");
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
  
      const mostrarAdvertencia = () => {
        mensaje.value = 'Ten cuidado con los datos ingresados.';
        tipo.value = 'advertencia';
        visible.value = true;
      };
  
      onMounted(async () => {
        await retrieveTipoSolicitudes();
        createRequestFields.value = [
          { name: "requestType", label: "Tipo de Solicitud", type: "select", options: tipoSolicitudes.value },
          { name: "description", label: "Descripción", type: "text-area" }
        ];
      });
  
      return {
        router,
        showModal,
        createRequestFields,
        handleRequestCreationSubmit,
        handleExit,
        mensaje,
        visible,
        tipo,
        mostrarExito,
        mostrarError,
        mostrarAdvertencia,
        reusableFormComponent: ReusableForm,
        isNotificationPanelVisible,
        toggleNotificationPanel
      };
    }
  };
  </script>


<style scoped>
.app {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.header {
    background-color: #003366;
    color: white;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    width: 90px;
}

.tittle-container h1 {
    font-size: 2em;
    font-weight: bold;
    letter-spacing: 1px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    margin: 0;
}

.request-button {
    background-color: #FFD100;
    color: #003366;
    border: none;
}

main {
    flex-grow: 1;
    padding: 30px;
    background-color: #f4f7fc;
    background-image: url('@/assets/fondo-unah4.png');
    background-position: bottom right;
    background-repeat: no-repeat;
    background-size: 300px;
    display: flex;
    flex-direction: column;
}

.dashboard-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-left: 10px;
    margin-right: 10px;
    flex-grow: 1;
    height: calc(100vh - 200px);
    overflow-y: auto;
}

.dashboard-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #003366;
    margin-bottom: 20px;
}

.request-item {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    color: #003366;
}

.btn-primary {
    background-color: #FFD100;
    color: #003366;
    border: none;
}

.btn-primary:hover {
    background-color: #ffcc00;
}

.no-requests {
    text-align: center;
    color: #666;
    padding: 20px;
}

/* Responsivo */
@media (max-width: 768px) {
    .header {
        flex-wrap: wrap;
        /* Asegura que el contenido se acomode mejor */
        justify-content: space-between;
        padding: 10px;
        /* Ajuste del espaciado */
    }

    .header h1 {
        font-size: 1.5em;
        flex-basis: 100%;
        /* El título ocupa toda la línea */
        text-align: center;
    }

    .logo {
        width: 70px;
        margin: 0 10px;
    }

    .dashboard-title {
        font-size: 1.2em;
    }

    .dashboard-container {
        margin: 0 5px;
        /* Ajuste del espaciado */
        height: auto;
    }

    .request-item {
        font-size: 0.9em;
        padding: 8px;
    }

    .notification-button {
        display: none;
    }

    .request-button {
        display: none;
    }

    .logout-button {
        display: none !important;
    }

    .no-requests {
        text-align: center;
        padding: 15px;
        font-size: 1em;
    }

    main {
        height: 87vh;
    }
}

@media (max-width: 576px) {
    .header h1 {
        display: none;
        /* Ocultar el título en pantallas muy pequeñas */
    }

    .dashboard-title {
        font-size: 1.1em;
    }

    .logo {
        width: 60px;
    }

    .request-item {
        font-size: 0.8em;
        padding: 6px;
    }

    .notification-button {
        display: none;
    }

    .request-button {
        display: none;
    }

    .logout-button {
        display: none !important;
    }

    main {
        height: 89vh;
    }
}

/* Optimización para pantallas más grandes */
@media (min-width: 768px) {
    .mobile-dropdown {
        display: none;
        /* Esconde el menú desplegable en pantallas grandes */
    }
}
</style>
