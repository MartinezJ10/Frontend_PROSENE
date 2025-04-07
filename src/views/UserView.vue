<template>
  <!-- role="banner" define el encabezado para NVDA -->
  <header class="header-page d-flex justify-content-between align-items-center px-3" role="banner">
    <div class="d-flex align-items-center">
      <img src="@/assets/logo_unah.png" alt="Logo UNAH" class="logo me-3" />
    </div>
    <div class="d-flex justify-content-center flex-grow-1 tittle-container">
      <h1 class="m-0">Solicitudes Académicas</h1>
    </div>
    <div>
      <!-- aria-live para mensajes dinámicos -->
      <MensajeRetroalimentacion 
        :mensaje="mensaje" 
        :visible="visible" 
        :tipo="tipo"
        @update:visible="visible = $event" 
        aria-live="polite"
      />
    </div>

    <div class="d-flex gap-2">
      <button 
        class="btn btn-primary request-button" 
        @click="showModal = true"
        aria-label="Crear una nueva solicitud"
      >
        <i class="bi bi-plus-circle me-2" aria-hidden="true"></i> Crear solicitud
      </button>
      <!-- role="dialog" para el modal -->
      <FormModal 
        title="Crear Solicitud" 
        v-model="showModal" 
        :reusableForm="reusableFormComponent" 
        :formProps="{
          fields: createRequestFields,
          submitButtonText: 'Crear Solicitud',
          onSubmit: handleRequestCreationSubmit,
          modalClass: 'modal-style-dos'
        }" 
        role="dialog"
        aria-label="Modal para crear solicitud"
      />
      <button 
        class="btn btn-light border notification-button" 
        @click="toggleNotificationPanel"
        :aria-expanded="isNotificationPanelVisible ? 'true' : 'false'"
        aria-controls="notification-panel"
        aria-label="Abrir panel de notificaciones"
      >
        <i class="bi bi-bell" aria-hidden="true"></i>
      </button>
      <button 
        class="btn btn-light me-2 border theme-button" 
        @click="toggleTheme"
        aria-label="Cambiar tema de contraste"
      >
        <i class="bi bi-brightness-high" aria-hidden="true"></i> <span>Cambiar Tema</span>
      </button>
      <!-- role="dialog" para el panel de notificaciones -->
      <NotificationPanel 
        :isAdmin="false" 
        :url="notificationStudentURL" 
        v-if="isNotificationPanelVisible"
        @close="toggleNotificationPanel" 
        id="notification-panel"
        role="dialog"
        aria-label="Panel de notificaciones"
      />
      <button 
        class="btn btn-danger d-flex align-items-center logout-button" 
        @click="handleExit"
        aria-label="Cerrar sesión"
      >
        <i class="bi bi-box-arrow-left me-2" aria-hidden="true"></i> Cerrar sesión
      </button>
    </div>
    <!-- role="navigation" para el menú móvil -->
    <div class="mobile-dropdown dropdown" role="navigation" aria-label="Menú móvil">
      <button 
        class="btn btn-primary dropdown-toggle" 
        type="button" 
        id="mobileMenu" 
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Abrir menú móvil"
      >
        Menú
      </button>
      <ul class="dropdown-menu" aria-labelledby="mobileMenu">
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            @click.prevent="showModal = true"
            aria-label="Crear solicitud desde menú móvil"
          >
            Crear solicitud
          </a>
        </li>
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            @click.prevent="toggleNotificationPanel"
            aria-label="Ver notificaciones desde menú móvil"
          >
            Notificaciones
          </a>
        </li>
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            @click.prevent="handleExit"
            aria-label="Cerrar sesión desde menú móvil"
          >
            Cerrar sesión
          </a>
        </li>
      </ul>
    </div>
  </header>

  <!-- role="main" define el contenido principal -->
  <main class="container-fluid main-content" role="main">
    <h2 class="dashboard-title">Dashboard de Solicitudes</h2>
    <div class="dashboard-container p-4">
      <!-- role="search" para los filtros -->
      <div class="filters mb-4 row g-3 align-items-end" role="search" aria-label="Filtros de solicitudes">
        <!-- Filtro por fecha -->
        <div class="col-md-4">
          <label for="dateFilter" class="form-label">Fecha</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-calendar-date" aria-hidden="true"></i>
            </span>
            <input 
              type="date" 
              id="dateFilter" 
              class="form-control" 
              v-model="searchDate" 
              @input="filterRequests"
              aria-label="Filtrar por fecha"
            />
          </div>
        </div>

        <!-- Filtro por estado -->
        <div class="col-md-4">
          <label for="estadoFilter" class="form-label">Estado</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-filter" aria-hidden="true"></i>
            </span>
            <select 
              id="estadoFilter" 
              class="form-select" 
              v-model="searchEstado" 
              @change="filterRequests"
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              <option v-for="estado in estados" :key="estado.idestadosolicitud" :value="estado.idestadosolicitud">
                {{ estado.descripcion }}
              </option>
            </select>
          </div>
        </div>

        <!-- Botón para limpiar filtros -->
        <div class="col-md-4">
          <button 
            type="button" 
            class="btn-limpiar btn btn-secondary w-100" 
            @click="resetFilters"
            aria-label="Limpiar todos los filtros"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Lista de solicitudes -->
      <div v-if="filteredRequests.length > 0" role="region" aria-label="Lista de solicitudes">
        <ul class="list-group">
          <li class="list-group-item" v-for="(request, index) in filteredRequests" :key="request.id">
            <div class="request-card p-3">
            <!-- Modificar la estructura de la tarjeta para que sea más compacta -->
            <div class="row align-items-center card-text g-1">
              <div class="col-6 col-md-2">
                <h5 class="mb-0">#{{ request.idsolicitud }}</h5>
              </div>
              <div class="col-6 col-md-6 text-end text-md-start">
                <p class="mb-0 text-muted small-text">{{ request.tiposolicitud.descripcion }}</p>
              </div>
              <div class="col-12 col-md-4 mt-1 mt-md-0">
                <div class="d-flex justify-content-between align-items-center">
                  <p class="mb-0 text-muted small-text">
                    <small>{{ formatDate(request.fechacreacion) }}</small>
                  </p>
                  <div class="d-flex gap-1">
                    <button 
                      class="btn btn-outline-dark btn-sm border btn-detalles" 
                      @click="openDetailsModal(request.descripcion)"
                      :aria-label="`Ver detalles de la solicitud ${request.idsolicitud}`"
                    >
                      Detalles
                    </button>
                    <span 
                      class="badge badge-status" 
                      :class="getStatusClass(request.estadosolicitud.descripcion)"
                    >
                      {{ request.estadosolicitud.descripcion }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Mensaje de no solicitudes -->
      <div v-else class="no-requests">
        No hay solicitudes registradas.
      </div>
    </div>
  </main>
  <!-- role="dialog" para el modal de detalles -->
<ReusableModal 
  :show="showDetailsModal" 
  title="Detalles de la Solicitud" 
  :message="currentRequestDescription"
  @close="showDetailsModal = false" 
  role="dialog"
  aria-label="Modal de detalles de la solicitud"
/>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted, ref, computed, onUnmounted, inject } from "vue";
import FormModal from "../components/FormModal.vue";
import ReusableForm from "../components/ReusableForm.vue";
import MensajeRetroalimentacion from "../components/Mensaje.vue";
import NotificationPanel from "../components/NotificationPanel.vue";
import ReusableModal from "../components/ReusableModal.vue";
import utils from "../utils";

export default {
  name: "UserView",
  components: {
    FormModal,
    ReusableForm,
    MensajeRetroalimentacion,
    NotificationPanel,
    ReusableModal,
  },
  setup() {
    const showModal = ref(false);
    const showDetailsModal = ref(false);
    const currentRequestDescription = ref("");

    const router = useRouter();
    const mensaje = ref("");
    const tipoSolicitudes = ref([]);
    const visible = ref(false);
    const tipo = ref("");
    const createRequestFields = ref([]);
    const isNotificationPanelVisible = ref(false);
    const requests = ref([]);
    const isMobile = ref(false);
    const searchDate = ref("");
    const searchEstado = ref("");
    const estados = ref([]);

    const requestURL = inject("requestURL");
    const notificationStudentURL = `${requestURL}/api/v1/notificaciones/`;
    const usertID = ref(utils.getCurrentUserID());

    const isHighContrast = inject('isHighContrast');
    const toggleTheme = inject('toggleTheme');

    const themeClass = computed(() => (isHighContrast.value ? 'high-contrast' : ''));

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
        config: err.config,
      });
    };

    const retrieveTipoSolicitudes = async () => {
      try {
        const response = await axios.get(`${requestURL}/api/v1/varios/tipos`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        tipoSolicitudes.value = response.data.map((tipoSolicitud) => ({
          value: tipoSolicitud.idtiposolicitud,
          label: tipoSolicitud.descripcion,
        }));
      } catch (err) {
        utils.errorLog(err);
      }
    };

    const retrieveRequests = async () => {
      try {
        const response = await axios.get(`${requestURL}/api/v1/solicitudes/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        requests.value = response.data;
      } catch (err) {
        utils.errorLog(err);
      }
    };

    const retrieveEstados = async () => {
      try {
        const response = await axios.get(`${requestURL}/api/v1/varios/estados`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        estados.value = response.data;
      } catch (err) {
        console.error("Failed to retrieve estados:", err.message);
      }
    };

    const handleRequestCreationSubmit = async (formData) => {
      try {
        await axios.post(
          `${requestURL}/api/v1/solicitudes/nueva`,
          {
            idusuariosolicitante: usertID.value,
            idresponsablesolicitud: 3,
            idtiposolicitud: formData.requestType,
            idestadosolicitud: 1,
            fechacreacion: new Date().toISOString(),
            descripcion: formData.description,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        showModal.value = false;
        mostrarExito();
        await retrieveRequests();
      } catch (err) {
        console.error("Request creation failed:", err.message);
        mostrarError();
      }
    };

    const openDetailsModal = (description) => {
      currentRequestDescription.value = description;
      showDetailsModal.value = true;
    };

    const handleExit = () => {
      localStorage.setItem("jwt", "");
      router.push("/login");
    };

    const mostrarExito = () => {
      mensaje.value = "Operación realizada con éxito.";
      tipo.value = "exito";
      visible.value = true;
    };

    const mostrarError = () => {
      mensaje.value = "Ocurrió un error inesperado.";
      tipo.value = "error";
      visible.value = true;
    };

    const mostrarAdvertencia = () => {
      mensaje.value = "Ten cuidado con los datos ingresados.";
      tipo.value = "advertencia";
      visible.value = true;
    };

    const getStatusClass = (status) => {
      switch (status.toLowerCase()) {
        case "recibida":
          return "recibida";
        case "en proceso":
          return "en-proceso";
        case "finalizada":
          return "finalizada";
        case "cancelada":
          return "cancelada";
        case "rechazada":
          return "rechazada";
        default:
          return "otro-estado";
      }
    };

    const isSameDate = (date1, date2) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return d1.toISOString().split("T")[0] === d2.toISOString().split("T")[0];
    };

    const filteredRequests = computed(() => {
      return requests.value.filter((request) => {
        const matchesDate = searchDate.value
          ? isSameDate(request.fechacreacion, searchDate.value)
          : true;
        const matchesEstado = searchEstado.value
          ? request.estadosolicitud.idestadosolicitud === parseInt(searchEstado.value)
          : true;
        return matchesDate && matchesEstado;
      });
    });

    const filterRequests = () => {
      // Trigger computed property
    };

    const resetFilters = () => {
      searchDate.value = "";
      searchEstado.value = "";
      filterRequests();
    };

    const formatDate = (date) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    onMounted(async () => {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      await retrieveTipoSolicitudes();
      await retrieveRequests();
      await retrieveEstados();
      createRequestFields.value = [
        {
          name: "requestType",
          label: "Tipo de Solicitud",
          type: "select",
          options: tipoSolicitudes.value,
        },
        { name: "description", label: "Descripción", type: "text-area" },
      ];
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenSize);
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
      openDetailsModal,
      searchDate,
      searchEstado,
      estados,
      filteredRequests,
      filterRequests,
      resetFilters,
      notificationStudentURL,
      formatDate,
      isHighContrast,
      toggleTheme,
      themeClass,
    };
  },
};
</script>

<style scoped>
/* --- Ajustes globales y layout general --- */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  padding: 30px;
  background-color: var(--background-color);
  background-image: url("@/assets/fondo-unah4.png");
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 300px;
  display: flex;
  flex-direction: column;
  height: clamp(300px, 85.5vh, 900px);
}

.header-page {
  background-color: var(--primary-color);
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
  text-shadow: 2px 2px 4px var(--text-shadow-color);
  margin: 0;
  color: var(--header-text-color);
}

/* --- Botones --- */
.request-button, .btn-detalles, .btn-limpiar {
  color: var(--primary-color);
}

.request-button {
  background-color: var(--secondary-color);
  border: none;
}

.request-button:hover, .btn-detalles, .btn-limpiar {
  background-color: lightsteelblue !important;
}

/* --- Dashboard --- */
.dashboard-container {
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 5px var(--text-shadow-color);
  padding: 20px;
  margin: 10px;
  overflow-y: auto;
  flex-grow: 1;
}

.dashboard-title {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 20px;
}

/* --- Ajustes para la lista y la "tarjeta" de solicitud --- */
.list-group-item {
  border: none;
  padding: 0;
  margin-bottom: 1rem;
}

.request-card {
  border: 1px solid var(--card-border-color);
  border-radius: 8px;
  background-color: var(--card-bg-color);
  color: var(--text-color);
  transition: background-color 0.2s ease;
  position: relative;
}

.card-text p, .request-card p {
  color: var(--text-color);
}

.card-text p {
  font-size: 1.1rem !important;
}

.request-card h5 {
  font-size: 1.25rem;
  color: var(--text-color);
  text-align: left;
}

/* --- Badge (estado) --- */
.badge-status {
  font-size: 0.9rem;
  min-width: 90px;
  text-align: center;
  padding: 0.5em;
}

.badge-status.recibida, .badge-status.en-proceso {
  background-color: var(--background-color);
}

.badge-status.recibida {
  color: var(--badge-text-color);
}

.badge-status.en-proceso {
  color: var(--badge-en-proceso-text-color);
}

.badge-status.finalizada {
  background-color: var(--badge-finalizada-bg-color);
  color: var(----badge-finalizada-text-color);
}

.badge-status.cancelada,
.badge-status.rechazada {
  background-color: var(--badge-cancelada-rechazada-bg-color);
  color: var(--badge-cancelada-rechazada-text-color);
}

.badge-status.otro-estado {
  background-color: var(--badge-otro-estado-bg-color);
  color: var(--badge-otro-estado-text-color);
}

/* --- Filtros --- */
.filters {
  padding: 1rem;
  border: 1px solid var(--filter-border-color);
  border-radius: 8px;
  background-color: var(--filter-bg-color);
}

.filters .form-label {
  font-weight: 600;
  color: var(--text-color);
}

.input-group-text {
  background-color: var(--primary-color);
  color: var(--brat);
}

/* --- Mensaje de "no hay solicitudes" --- */
.no-requests {
  font-size: 1.5rem;
  text-align: center;
  margin-top: 2rem;
}

.small-text {
  font-size: 0.85rem;
}

@media (max-height: 500px){
  .main-content {
    height: clamp(500px, 88.5vh, 900px) !important;
  }
}

@media (max-height: 700px) and (max-width: 400px){
  .main-content {
    height: clamp(500px, 88.5vh, 900px) !important;
  }
}

/* --- Media queries --- */
@media (min-width: 1400px) {
  .main-content {
    height: clamp(300px, 93vh, 900px);
  }

  .dashboard-container {
    max-height: 900px;
    height: 92vh;
  }
}

@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    padding: 10px;
  }

  .logo {
    width: 70px;
    margin: 0 10px;
  }

  .dashboard-title {
    font-size: 1.2em;
  }

    /* Hacer el dashboard más compacto */
    .dashboard-container {
    padding: 10px;
    margin: 5px 0;
  }

  .notification-button,
  .request-button,
  .logout-button,
  .theme-button span,
  .tittle-container h1 {
    display: none !important;
  }
  
  .tittle-container h1 {
    font-size: 1.5em;
    flex-basis: 100%;
    text-align: center;
    margin: 10px 0;
  }

  main {
    height: 86vh;
  }

  .text-md-end {
    text-align: left !important;
  }

  .justify-content-end {
    justify-content: flex-start !important;
  }

    /* Reducir el padding general */
    .main-content {
    padding: 15px;
  }

    /* Reducir el espacio entre los elementos de la lista */
    .list-group-item {
    margin-bottom: 0.5rem;
  }

    /* Hacer las tarjetas de solicitud más compactas */
    .request-card {
    padding: 0.75rem !important;
  }

    /* Reducir tamaños de fuente */
    .request-card h5 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .card-text p {
    font-size: 0.9rem !important;
    margin-bottom: 0.25rem;
  }
  
  /* Ajustar los botones para que ocupen menos espacio */
  .btn-detalles {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }
  
  .badge-status {
    font-size: 0.75rem;
    min-width: 70px;
    padding: 0.3em;
  }
  
  /* Reducir el espacio en los filtros */
  .filters {
    padding: 0.75rem;
    margin-bottom: 0.75rem !important;
  }
  
  .filters .form-label {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  /* Ajustar el espacio entre filas en el grid */
  .g-3 {
    --bs-gutter-y: 0.5rem;
  }
}

@media (max-width: 576px) {
  .header h1 {
    display: none;
  }

  .main-content {
    height: clamp(500px, 90vh, 900px);
  }

  .request-card .col-md-5,
  .request-card .col-md-4 {
    flex-basis: 100%;
    max-width: 100%;
  }

  .request-card .col-md-3 {
    margin-bottom: 10px;
  }

  .request-card {
    padding: 1rem;
  }

  .request-card h5 {
    font-size: 1rem;
  }

  .request-card p {
    font-size: 0.9rem;
  }

  .logout-button {
    display: none !important;
  }

   /* Ajustes adicionales para pantallas muy pequeñas */
   .dashboard-title {
    font-size: 1.1em;
    margin-bottom: 10px;
  }
  
  /* Estructura más compacta para móviles */
  .request-card .row {
    margin: 0;
  }
  
  .request-card .col-12 {
    padding: 0.15rem;
  }
  
  /* Reducir aún más los espaciados */
  .mt-2 {
    margin-top: 0.25rem !important;
  }
  
  /* Optimizar la visualización de fecha */
  .text-md-end p {
    font-size: 0.8rem !important;
  }

  .small-text {
    font-size: 0.75rem;
  }
}

@media (min-width: 768px) {
  .mobile-dropdown {
    display: none;
  }
}

@media (max-width: 1100px){
  .main-content {
    height: clamp(500px, 91vh, 900px);
  }

  .tittle-container h1 {
    font-size: 1.9em;
  }
}
</style>