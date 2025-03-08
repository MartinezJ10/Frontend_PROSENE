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
          <!-- Si existen solicitudes, se itera sobre ellas -->
          <div v-if="requests.length > 0">
            <ul class="list-group">
                <li class="list-group-item d-flex justify-content-between align-items-center"
    v-for="(request, index) in requests"
    :key="request.id">
  <div>
    <h5 class="mb-1">#{{ request.idsolicitud }}</h5>
    <p class="mb-0 text-muted text-start">
      {{ request.tiposolicitud.descripcion }}
    </p>
  </div>
  <div class="d-flex align-items-center gap-3">
    <!-- Botón "Detalles" con color personalizado -->
    <button class="btn btn-outline-dark btn-sm border" @click="openDetailsModal(request.descripcion)">
  Detalles
</button>

    <!-- Badge de estado con ancho fijo para mantener el orden -->
    <span :class="['badge', getStatusClass(request.estadosolicitud.descripcion), 'badge-status']" style="font-size: 1rem;">
      {{ request.estadosolicitud.descripcion }}
    </span>
  </div>
</li>

            </ul>
          </div>
          <!-- Si no hay solicitudes, se muestra un mensaje -->
          <div v-else class="no-requests">
            No hay solicitudes registradas.
          </div>
        </div>
        <!-- Modal reutilizable para mostrar detalles de la solicitud -->
        <ReusableModal 
          :show="showDetailsModal" 
          title="Detalles de la Solicitud" 
          :message="currentRequestDescription" 
          @close="showDetailsModal = false" 
        />
      </main>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useRouter } from "vue-router";
  import { onMounted, ref, onUnmounted } from 'vue';
  import FormModal from "../components/FormModal.vue";
  import ReusableForm from "../components/ReusableForm.vue";
  import MensajeRetroalimentacion from "../components/Mensaje.vue";
  import NotificationPanel from "../components/NotificationPanel.vue";
  import ReusableModal from "../components/ReusableModal.vue"; // Importamos el modal reutilizable
  
  export default {
    name: "UserView",
    components: { FormModal, ReusableForm, MensajeRetroalimentacion, NotificationPanel, ReusableModal },
    setup() {
      const showModal = ref(false);
      const showDetailsModal = ref(false);
      const currentRequestDescription = ref('');
  
      const router = useRouter();
      const mensaje = ref('');
      const tipoSolicitudes = ref([]);
      const visible = ref(false);
      const tipo = ref('');
      const createRequestFields = ref([]);
      const isNotificationPanelVisible = ref(false);
      const requests = ref([]);
      const isMobile = ref(false);
  
      const toggleNotificationPanel = () => {
        isNotificationPanelVisible.value = !isNotificationPanelVisible.value;
      };
  
      const checkScreenSize = () => {
        isMobile.value = window.innerWidth <= 768;
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
              headers: { 'Authorization': `Bearer ${localStorage.getItem("jwt")}` }
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
  
      const retrieveRequests = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/solicitudes/",
            {
              headers: { 'Authorization': `Bearer ${localStorage.getItem("jwt")}` }
            }
          );
          requests.value = response.data;
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
          await retrieveRequests();
        } catch (err) {
          console.error("Request creation failed:", err.message);
          mostrarError();
        }
      };
  
      // Función para abrir la modal y asignar la descripción de la solicitud
      const openDetailsModal = (description) => {
        currentRequestDescription.value = description;
        showDetailsModal.value = true;
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
  
      const getStatusClass = (status) => {
        switch (status) {
          case 'Recibida':
            return 'bg-info text-white';
          case 'En Proceso':
            return 'bg-warning text-dark';
          case 'Finalizada':
            return 'bg-success';
          case 'Cancelada':
            return 'bg-secondary';
          case 'Rechazada':
            return 'bg-danger';
          default:
            return 'bg-dark';
        }
      };
  
      onMounted(async () => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        await retrieveTipoSolicitudes();
        await retrieveRequests();
        createRequestFields.value = [
          { name: "requestType", label: "Tipo de Solicitud", type: "select", options: tipoSolicitudes.value },
          { name: "description", label: "Descripción", type: "text-area" }
        ];
      });
  
      onUnmounted(() => {
        window.removeEventListener('resize', checkScreenSize);
      });
  
      return {
        router,
        showModal,
        showDetailsModal,
        currentRequestDescription,
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
        toggleNotificationPanel,
        requests,
        getStatusClass,
        openDetailsModal
      };
    }
  };
  </script>
  
  <style>
  /* Global reset para html y body */
  html,
  body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden;
  }
  </style>
  
  <style scoped>
  /* Estilos del dashboard */
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0;
    overflow: hidden;
  }
  
  h5 {
    font-size: 1.25rem;
    text-align: left;
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
    max-width: 100%;
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
    margin: 10px;
    height: calc(100vh - 200px);
    overflow-y: auto;
  }
  
  .dashboard-title {
    font-size: 1.5em;
    font-weight: bold;
    color: #003366;
    margin-bottom: 20px;
  }
  
  .list-group-item {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s ease;
  }
  
  .list-group-item:hover {
    background-color: #f9f9f9;
  }

/* Botón de detalles personalizado */
.btn-details {
  color: #ffffff;
  border: none;
  padding: 0.4rem 0.8rem;
  width: 55px;
  height: 21px;
  transition: background-color 0.3s;
}

/* Establece un ancho mínimo para el badge de estado y centra su contenido */
.badge-status {
  min-width: 100px;
  text-align: center;
}

  
  @media (max-width: 576px) {
    .list-group-item {
      flex-direction: column;
      align-items: flex-start !important;
    }
    .list-group-item span {
      margin-top: 10px;
      align-self: flex-end;
    }
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
  
  @media (max-width: 768px) {
    .header {
      flex-wrap: wrap;
      padding: 10px;
    }
    .tittle-container h1 {
      font-size: 1.5em;
      flex-basis: 100%;
      text-align: center;
      margin: 10px 0;
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
      height: auto;
    }
    .request-item {
      font-size: 0.9em;
      padding: 8px;
    }
    .notification-button,
    .request-button,
    .logout-button {
      display: none;
    }
    main {
      height: 87vh;
    }
  }
  
  @media (max-width: 576px) {
    .header h1 {
      display: none;
    }
    .dashboard-title {
      font-size: 1.4em;
    }
    .logo {
      width: 60px;
    }
    .request-item {
      font-size: 0.8em;
      padding: 6px;
    }
    .notification-button,
    .request-button,
    .logout-button {
      display: none !important;
    }
    main {
      height: 89vh;
    }
  }
  
  @media (min-width: 768px) {
    .mobile-dropdown {
      display: none;
    }
  }
  </style>
  