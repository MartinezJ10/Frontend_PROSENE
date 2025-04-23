<template>
  <!-- Encabezado mejorado con mejor estructura semántica -->
  <header
    class="header-page d-flex justify-content-between align-items-center px-3"
    role="banner"
  >
    <div class="d-flex align-items-center">
      <img src="@/assets/logo_unah.png" alt="Logo UNAH" class="logo me-3" />
    </div>
    <div class="d-flex justify-content-center flex-grow-1 title-container" aria-hidden="false">
      <h1 class="m-0">Solicitudes Académicas</h1>
    </div>

    <!-- Componente de retroalimentación -->
    <div aria-live="polite">
      <MensajeRetroalimentacion
        :mensaje="mensaje"
        :visible="visible"
        :tipo="tipo"
        @update:visible="visible = $event"
      />
    </div>

    <!-- Barra de acciones optimizada para accesibilidad -->
    <div class="d-flex gap-2 action-buttons">
      <button
        class="btn btn-primary request-button"
        @click="showModal = true"
        aria-label="Crear una nueva solicitud"
      >
        <i class="bi bi-plus-circle me-2" aria-hidden="true"></i> 
        <span>Crear solicitud</span>
      </button>
      
      <FormModal
        title="Crear Solicitud"
        v-model="showModal"
        :reusableForm="reusableFormComponent"
        :formProps="{
          fields: createRequestFields,
          submitButtonText: 'Crear Solicitud',
          onSubmit: handleRequestCreationSubmit,
          modalClass: 'modal-style-dos',
        }"
        role="dialog"
        aria-labelledby="modal-title"
      />
      
      <button
        class="btn btn-outline-primary border notification-button"
        @click="toggleNotificationPanel"
        :aria-expanded="isNotificationPanelVisible ? 'true' : 'false'"
        aria-controls="notification-panel"
        aria-label="Abrir panel de notificaciones"
      >
        <i class="bi bi-bell" aria-hidden="true"></i>
        <span class="visually-hidden">Notificaciones</span>
      </button>
      
      <button
        class="btn btn-outline-primary border theme-button"
        @click="toggleTheme"
        aria-label="Cambiar tema de contraste"
      >
        <i class="bi bi-brightness-high" aria-hidden="true"></i>
        <span class="theme-text">Cambiar Tema</span>
      </button>
      
      <NotificationPanel
        :isAdmin="false"
        :url="notificationStudentURL"
        v-if="isNotificationPanelVisible"
        @close="toggleNotificationPanel"
        id="notification-panel"
        role="dialog"
        aria-labelledby="notification-title"
      />
      
      <button
        class="btn btn-danger d-flex align-items-center logout-button"
        @click="handleExit"
        aria-label="Cerrar sesión"
      >
        <i class="bi bi-box-arrow-left me-2" aria-hidden="true"></i> 
        <span class="logout-text">Cerrar sesión</span>
      </button>
    </div>
    
    <!-- Menú móvil optimizado -->
    <div
      class="mobile-dropdown dropdown"
      role="navigation"
      aria-label="Menú móvil"
    >
      <button
        class="btn btn-primary dropdown-toggle"
        type="button"
        id="mobileMenu"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        aria-label="Abrir menú móvil"
      >
        <i class="bi bi-list me-1" aria-hidden="true"></i> Menú
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="mobileMenu">
        <li>
          <a
            class="dropdown-item"
            href="#"
            @click.prevent="showModal = true"
            aria-label="Crear solicitud desde menú móvil"
          >
            <i class="bi bi-plus-circle me-2" aria-hidden="true"></i> Crear solicitud
          </a>
        </li>
        <li>
          <a
            class="dropdown-item"
            href="#"
            @click.prevent="toggleNotificationPanel"
            aria-label="Ver notificaciones desde menú móvil"
          >
            <i class="bi bi-bell me-2" aria-hidden="true"></i> Notificaciones
          </a>
        </li>
        <li>
          <a
            class="dropdown-item"
            href="#"
            @click.prevent="toggleTheme"
            aria-label="Cambiar tema desde menú móvil"
          >
            <i class="bi bi-brightness-high me-2" aria-hidden="true"></i> Cambiar tema
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a
            class="dropdown-item text-danger"
            href="#"
            @click.prevent="handleExit"
            aria-label="Cerrar sesión desde menú móvil"
          >
            <i class="bi bi-box-arrow-left me-2" aria-hidden="true"></i> Cerrar sesión
          </a>
        </li>
      </ul>
    </div>
  </header>

  <!-- Contenido principal optimizado -->
  <main class="container-fluid main-content" role="main">
    <div class="dashboard-header">
      <h2 class="dashboard-title">Dashboard de Solicitudes</h2>
    </div>
    
    <div class="dashboard-container p-4">
      <!-- Filtros reorganizados y con mejor accesibilidad -->
      <div
        class="filters mb-4 row g-3 align-items-end"
        role="search"
        aria-labelledby="filtros-heading"
      >
        <div id="filtros-heading" class="visually-hidden">Filtros de solicitudes</div>
        
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
              <option
                v-for="estado in estados"
                :key="estado.idestadosolicitud"
                :value="estado.idestadosolicitud"
              >
                {{ estado.descripcion }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="col-md-4">
          <button
            type="button"
            class="btn btn-secondary w-100 btn-limpiar"
            @click="resetFilters"
            aria-label="Limpiar todos los filtros"
          >
            <i class="bi bi-x-circle me-2" aria-hidden="true"></i> Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Lista de solicitudes mejorada -->
      <div
        v-if="filteredRequests.length"
        role="region"
        aria-labelledby="solicitudes-heading"
        class="solicitudes-container"
      >
        <h3 id="solicitudes-heading" class="visually-hidden">Lista de solicitudes</h3>
        
        <ul class="list-group solicitudes-list">
          <li
            class="list-group-item"
            v-for="req in filteredRequests"
            :key="req.idsolicitud"
          >
            <div class="request-card p-3">
              <div class="row align-items-center g-2">
                <div class="col-12 col-sm-6 col-md-2">
                  <h4 class="request-id">#{{ req.idsolicitud }}</h4>
                </div>
                
                <div class="col-12 col-sm-6 col-md-6">
                  <p class="mb-0 request-type">
                    {{ req.tiposolicitud.descripcion }}
                  </p>
                </div>
                
                <div class="col-12 col-md-4 mt-2 mt-md-0">
                  <div class="d-flex justify-content-between align-items-center flex-wrap">
                    <p class="mb-0 request-date">
                      <i class="bi bi-calendar3 me-1" aria-hidden="true"></i>
                      <span>{{ formatDate(req.fechacreacion) }}</span>
                    </p>
                    
                    <div class="d-flex gap-2 mt-2 mt-sm-0">
                      <button
                        class="btn btn-outline-primary btn-sm"
                        @click="openDetailsModal(req.idsolicitud)"
                        :aria-label="`Ver detalles de la solicitud ${req.idsolicitud}`"
                      >
                        <i class="bi bi-info-circle me-1" aria-hidden="true"></i> Detalles
                      </button>
                      
                      <span
                        class="badge badge-status"
                        :class="getStatusClass(req.estadosolicitud.descripcion)"
                      >
                        {{ req.estadosolicitud.descripcion }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Mensaje cuando no hay solicitudes -->
      <div v-else class="no-requests" role="status">
        <i class="bi bi-inbox me-2" aria-hidden="true"></i>
        No hay solicitudes registradas.
      </div>
    </div>
  </main>

  <!-- Modal de detalles mejorado -->
<div 
  class="modal-dialog" 
  :class="{'dark-theme-modal': isDarkTheme}"
>
  <div class="modal-content">
    <!-- Modal de detalles mejorado - Estructura correcta -->
<ReusableModal
  :show="showDetailsModal"
  title="Detalles de la Solicitud"
  @close="showDetailsModal = false"
  :class="{'dark-theme-modal': isDarkMode}"
  role="dialog"
  aria-labelledby="modal-details-title"
>
  <template #header>
    <h3 id="modal-details-title" class="modal-title">
      Detalles de la Solicitud
    </h3>
  </template>
  
  <template #default>
    <div v-if="requestDetails" class="request-details">
      <div class="detail-item" v-if="requestDetails.becario">
        <strong><i class="bi bi-person-badge me-2" aria-hidden="true"></i>Becario:</strong> 
        <span>{{ requestDetails.becario }}</span>
      </div>

      <div class="detail-item">
        <strong><i class="bi bi-person-check me-2" aria-hidden="true"></i>Atendida por:</strong> 
        <span>{{ requestDetails.atendidaPor }}</span>
      </div>
      
      <div class="detail-item">
        <strong><i class="bi bi-calendar-event me-2" aria-hidden="true"></i>Fecha de creación:</strong>
        <span>{{ formatDateTime(requestDetails.fechaCreacion) }}</span>
      </div>
      
      <div class="detail-item">
        <strong><i class="bi bi-tag me-2" aria-hidden="true"></i>Estado:</strong>
        <span class="badge badge-status" :class="getStatusClass(requestDetails.estado)">
          {{ requestDetails.estado }}
        </span>
      </div>
      
      <div class="detail-item">
        <strong><i class="bi bi-chat-text me-2" aria-hidden="true"></i>Retroalimentación:</strong>
        <div class="feedback-text mt-2 p-2">
          {{ requestDetails.mensajeRetro || 'Sin retroalimentación' }}
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-3" role="status">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Cargando detalles...</p>
    </div>
  </template>
  
  <template #footer>
    <button type="button" class="btn btn-secondary" @click="showDetailsModal = false">
      Cerrar
    </button>
  </template>
</ReusableModal>
  </div>
</div>
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
    const router = useRouter();
    const requestURL = inject("requestURL");
    const notificationStudentURL = `${requestURL}/api/v1/notificaciones/`;
    const usertID = ref(utils.getCurrentUserID());

    const showModal = ref(false);
    const showDetailsModal = ref(false);
    const requestDetails = ref(null);

    const mensaje = ref("");
    const visible = ref(false);
    const tipo = ref("");
    const tipoSolicitudes = ref([]);
    const createRequestFields = ref([]);
    const isNotificationPanelVisible = ref(false);
    const requests = ref([]);
    const estados = ref([]);
    const searchDate = ref("");
    const searchEstado = ref("");
    const isMobile = ref(false);

    const isHighContrast = inject("isHighContrast");
    const toggleTheme = inject("toggleTheme");
    const themeClass = computed(() =>
      isHighContrast.value ? "high-contrast" : ""
    );

    const toggleNotificationPanel = () => {
      isNotificationPanelVisible.value = !isNotificationPanelVisible.value;
    };

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const errorLog = (err) => console.error("ERROR IN REQUEST:", err);

    const retrieveTipoSolicitudes = async () => {
      try {
        const { data } = await axios.get(`${requestURL}/api/v1/varios/tipos`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        tipoSolicitudes.value = data.map((t) => ({
          value: t.idtiposolicitud,
          label: t.descripcion,
        }));
      } catch (err) {
        errorLog(err);
      }
    };

    const retrieveRequests = async () => {
      try {
        const { data } = await axios.get(`${requestURL}/api/v1/solicitudes/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        requests.value = data;
      } catch (err) {
        errorLog(err);
      }
    };

    const retrieveEstados = async () => {
      try {
        const { data } = await axios.get(
          `${requestURL}/api/v1/varios/estados`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
          }
        );
        estados.value = data;
      } catch (err) {
        console.error("Failed to retrieve estados:", err);
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
        console.error("Request creation failed:", err);
        mostrarError();
      }
    };

    const getSolicitudDetalle = async (solicitudId) => {
      const { data: d } = await axios.get(
        `${requestURL}/api/v1/solicitudes/get/${solicitudId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` } }
      );

      // Responsable
      const persona = d.responsablesolicitud?.persona;
      const atendidaPor = persona
        ? `${persona.primernombre} ${persona.primerapellido}`
        : "Sin responsable asignado";

      // Estado y mensaje de retroalimentación
      const estado = d.estadosolicitud?.descripcion || "";
      let mensajeRetro = "";
      switch (estado.toLowerCase()) {
        case "en proceso":
          mensajeRetro = d.retroalimentacionEnProceso;
          break;
        case "finalizada":
          mensajeRetro = d.retroalimentacionFinalizada;
          break;
        case "cancelada":
          mensajeRetro = d.retroalimentacionCancelada;
          break;
        case "recibida":
          mensajeRetro = d.retroalimentacionRecibida;
          break;
        case "rechazada":
          mensajeRetro = d.retroalimentacionRechazada;
          break;
      }

      // Becario (sólo si viene true y hay nombre)
      const becario = d.toBecario && d.nombreBecario ? d.nombreBecario : null;

      return {
        atendidaPor,
        fechaCreacion: d.fechacreacion,
        estado,
        mensajeRetro: mensajeRetro ?? "–",
        becario,
      };
    };

    const openDetailsModal = async (solicitudId) => {
      showDetailsModal.value = true;
      requestDetails.value = null;
      try {
        requestDetails.value = await getSolicitudDetalle(solicitudId);
      } catch (err) {
        console.error("Error al cargar detalles:", err);
        mostrarError();
        showDetailsModal.value = false;
      }
      console.log(requestDetails.value);
    };

    const handleExit = () => {
      localStorage.removeItem("jwt");
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

    const isSameDate = (d1, d2) => {
      return (
        new Date(d1).toISOString().split("T")[0] ===
        new Date(d2).toISOString().split("T")[0]
      );
    };

    const filteredRequests = computed(() =>
      requests.value
        // 1. Filtramos
        .filter((r) => {
          const byDate = searchDate.value
            ? isSameDate(r.fechacreacion, searchDate.value)
            : true;
          const byEstado = searchEstado.value
            ? r.estadosolicitud.idestadosolicitud === +searchEstado.value
            : true;
          return byDate && byEstado;
        })
        // 2. Ordenamos por idsolicitud ascendente
        .sort((a, b) => b.idsolicitud - a.idsolicitud)
    );

    const filterRequests = () => {};
    const resetFilters = () => {
      searchDate.value = "";
      searchEstado.value = "";
      filterRequests();
    };

    const formatDate = (iso) => {
      const d = new Date(iso);
      return `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    };
    const formatDateTime = (iso) => new Date(iso).toLocaleString();

    // En tu setup()
    const isDarkMode = computed(() => {
      return document.body.classList.contains('high-contrast') || 
             document.documentElement.getAttribute('data-bs-theme') === 'dark';
    });

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
      showModal,
      showDetailsModal,
      requestDetails,
      mensaje,
      visible,
      tipo,
      createRequestFields,
      isNotificationPanelVisible,
      requests,
      estados,
      searchDate,
      searchEstado,
      themeClass,
      notificationStudentURL,
      reusableFormComponent: ReusableForm,
      toggleNotificationPanel,
      toggleTheme,
      formatDate,
      formatDateTime,
      openDetailsModal,
      handleRequestCreationSubmit,
      handleExit,
      getStatusClass,
      filteredRequests,
      filterRequests,
      resetFilters,
      isDarkMode,
    };
  },
};
</script>

<style scoped>
/* --- Variables CSS mejoradas --- */
:root {
  /* Variables de colores base */
  --primary-color: #003366;
  --secondary-color: #7ba7d1;
  --background-color: #f5f8fa;
  --text-color: #333;
  --text-muted: #6c757d;
  --sm-text: #666;
  --header-text-color: #fff;
  --card-bg-color: #fff;
  --card-border-color: #dce4ec;
  --text-shadow-color: rgba(0, 0, 0, 0.1);
  --filter-border-color: #e5e9f0;
  --filter-bg-color: #f8fafc;
  --brat: #fff;
  
  /* Variables específicas para badges */
  --badge-text-color: #2c3e50;
  --badge-en-proceso-text-color: #0d6efd;
  --badge-finalizada-bg-color: #198754;
  --badge-finalizada-text-color: #fff;
  --badge-cancelada-rechazada-bg-color: #dc3545;
  --badge-cancelada-rechazada-text-color: #fff;
  --badge-otro-estado-bg-color: #fd7e14;
  --badge-otro-estado-text-color: #fff;
  --placeholder-color: rgba(108, 117, 125, 0.3);
  
  /* Variables para animaciones y transiciones */
  --transition-speed: 0.2s;
  --box-shadow: 0 2px 5px var(--text-shadow-color);
  --hover-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);

  --primary-text: #212529;
  --primary-bg: #ffffff;
  --modal-bg: #ffffff;
  --feedback-bg: #f8f9fa;
  --badge-border: rgba(0, 0, 0, 0.1);
}

/* Clase para tema de alto contraste */
.high-contrast {
  --primary-color: #002b4d;
  --secondary-color: #5d8cb9;
  --background-color: #121212;
  --text-color: #f0f0f0;
  --text-muted: #b0b0b0;
  --sm-text: #d0d0d0;
  --header-text-color: #fff;
  --card-bg-color: #1e1e1e;
  --card-border-color: #444;
  --text-shadow-color: rgba(0, 0, 0, 0.3);
  --filter-border-color: #444;
  --filter-bg-color: #2d2d2d;
  --brat: #f0f0f0;
  
  /* Variables específicas para badges en modo oscuro */
  --badge-text-color: #e2e8f0;
  --badge-en-proceso-text-color: #63a7ff;
  --badge-finalizada-bg-color: #28a745;
  --badge-finalizada-text-color: #fff;
  --badge-cancelada-rechazada-bg-color: #dc3545;
  --badge-cancelada-rechazada-text-color: #fff;
  --badge-otro-estado-bg-color: #fd7e14;
  --badge-otro-estado-text-color: #fff;
  --placeholder-color: rgba(180, 185, 190, 0.3);
}

/* --- Utilidades de accesibilidad --- */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* --- Layout principal --- */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 30px;
  background-color: var(--background-color);
  background-image: url("@/assets/fondo-unah4.png");
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 300px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  transition: background-color var(--transition-speed) ease;
  overflow-x: hidden;
}

.high-contrast .main-content {
  background-image: url("@/assets/fondo-unah4.png");
}

/* --- Encabezado --- */
.header-page {
  background-color: var(--primary-color);
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: background-color var(--transition-speed) ease;
  height: 80px;
}

.logo {
  width: 90px;
  max-width: 100%;
  height: auto;
}

.title-container h1 {
  font-size: clamp(1.5rem, 2vw + 1rem, 2rem);
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px var(--text-shadow-color);
  margin: 0;
  color: var(--header-text-color);
  text-align: center;
}

/* Luego usa estas variables en tus componentes */
/* Estilos para el modal que deben estar disponibles para el componente ReusableModal */
.modal-content {
  background-color: var(--modal-bg, #fff);
  color: var(--primary-text, #212529);
}

[data-bs-theme="dark"] .modal-content,
.dark-theme .modal-content,
.dark-theme-modal .modal-content {
  background-color: #2b2b2b;
  color: #f8f9fa;
}

[data-bs-theme="dark"] .modal-header,
.dark-theme .modal-header,
.dark-theme-modal .modal-header {
  border-bottom-color: #444;
}

[data-bs-theme="dark"] .modal-footer,
.dark-theme .modal-footer,
.dark-theme-modal .modal-footer {
  border-top-color: #444;
}

[data-bs-theme="dark"] .badge-status,
.dark-theme .badge-status,
.dark-theme-modal .badge-status {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

[data-bs-theme="dark"] .feedback-text,
.dark-theme .feedback-text,
.dark-theme-modal .feedback-text {
  background-color: #3a3a3a;
  border: 1px solid #555;
  color: #f8f9fa;
}

[data-bs-theme="dark"] .detail-item,
.dark-theme .detail-item,
.dark-theme-modal .detail-item {
  color: #e9ecef;
}

[data-bs-theme="dark"] .modal-title,
.dark-theme .modal-title,
.dark-theme-modal .modal-title {
  color: #f8f9fa;
}

/* --- Dashboard --- */
.dashboard-header {
  margin-bottom: 1rem;
}

.theme-button{
  color: white !important;
}

.notification-button{
  color: white !important;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--secondary-color);
}

.dashboard-container {
  background-color: var(--card-bg-color);
  border-radius: 8px;
  box-shadow: var(--box-shadow);
  padding: 20px;
  margin: 0 auto;
  width: 100%;
  max-width: 1400px;
  overflow-y: auto;
  flex: 1;
  transition: background-color var(--transition-speed) ease,
              box-shadow var(--transition-speed) ease;
}

/* --- Filtros --- */
.filters {
  padding: 1rem;
  border: 1px solid var(--filter-border-color);
  border-radius: 8px;
  background-color: var(--filter-bg-color);
  margin-bottom: 1.5rem;
  transition: background-color var(--transition-speed) ease,
              border-color var(--transition-speed) ease;
}

.filters .form-label {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}

.input-group-text {
  background-color: var(--primary-color);
  color: var(--header-text-color);
  border: none;
}

/* Input y select estilizados */
.form-control, .form-select {
  background-color: var(--card-bg-color);
  color: var(--text-color);
  border: 1px solid var(--card-border-color);
  transition: border-color var(--transition-speed) ease,
              background-color var(--transition-speed) ease,
              color var(--transition-speed) ease;
}

.form-control:focus, .form-select:focus {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 0.25rem rgba(123, 167, 209, 0.25);
}

/* --- Lista de solicitudes --- */
.solicitudes-container {
  margin-bottom: 1rem;
}

.solicitudes-list {
  padding: 0;
}

.list-group-item {
  border: none;
  padding: 0;
  margin-bottom: 1rem;
  background-color: transparent;
}

.request-card {
  border: 1px solid var(--card-border-color);
  border-radius: 8px;
  background-color: var(--card-bg-color);
  color: var(--text-color);
  transition: all var(--transition-speed) ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.request-card:hover {
  box-shadow: var(--hover-shadow);
  transform: translateY(-2px);
}

.request-id {
  font-size: 1.25rem;
  color: var(--text-color);
  margin: 0;
  font-weight: 600;
}

.request-type {
  color: var(--text-color);
  font-weight: 500;
}

.request-date {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* --- Badges para estados --- */
.badge-status {
  font-size: 0.85rem;
  min-width: 90px;
  text-align: center;
  padding: 0.5em 0.75em;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color var(--transition-speed) ease;
}

.badge-status.recibida {
  background-color: #e3f2fd;
  color: #0c63e4;
}

.badge-status.en-proceso {
  background-color: #cff4fc;
  color: #055160;
}

.badge-status.finalizada {
  background-color: var(--badge-finalizada-bg-color);
  color: var(--badge-finalizada-text-color);
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

/* --- Botones --- */
.btn {
  border-radius: 4px;
  font-weight: 500;
  transition: all var(--transition-speed) ease;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover, 
.btn-primary:focus {
  background-color: color-mix(in srgb, var(--primary-color), #000 10%);
  border-color: color-mix(in srgb, var(--primary-color), #000 10%);
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-limpiar:hover {
  background-color: #5a6268 !important;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.request-button {
  background-color: var(--secondary-color);
  border: none;
  color: var(--header-text-color);
}

.request-button:hover {
  background-color: color-mix(in srgb, var(--secondary-color), #000 10%);
}

/* --- Modal de detalles --- */
.request-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item strong {
  color: var(--text-color);
  display: flex;
  align-items: center;
}

.feedback-text {
  background-color: var(--filter-bg-color);
  border-radius: 4px;
  border-left: 3px solid var(--secondary-color);
}

/* --- Mensaje de "no hay solicitudes" --- */
.no-requests {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: var(--text-muted);
  height: 200px;
  text-align: center;
  background-color: var(--filter-bg-color);
  border-radius: 8px;
  border: 1px dashed var(--card-border-color);
}

.no-requests i {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

/* --- Menú móvil --- */
.mobile-dropdown {
  display: none;
}

/* --- Responsive --- */
@media (max-width: 991px) {
  .action-buttons .theme-text,
  .action-buttons .logout-text {
    display: none;
  }
  
  .request-button span {
    display: none;
  }
  
  .main-content {
    padding: 20px 15px;
  }
  
  .dashboard-container {
    padding: 15px;
  }
}

@media (max-width: 767px) {
  .header-page {
    padding: 10px 15px;
  }
  
  .logo {
    width: 70px;
  }
  
  .dashboard-title {
    font-size: 1.3rem;
  }
  
  .filters {
    padding: 0.75rem;
  }
  
  .request-card {
    padding: 0.75rem !important;
  }
  
  .badge-status {
    font-size: 0.75rem;
    min-width: 80px;
  }
}

@media (max-width: 900px) {
  .action-buttons {
    display: none !important;
  }
  
  .mobile-dropdown {
    display: block;
  }
  
  .title-container h1 {
    font-size: 1.4rem;
  }
}

@media (max-width: 576px) {
  .header-page {
    justify-content: space-between;
    padding: 10px;
  }
  
  .logo {
    width: 60px;
  }
  
  .title-container h1 {
    font-size: 1.2rem;
  }
  
  .main-content {
    padding: 15px 10px;
  }
  
  .dashboard-container {
    padding: 12px;
    margin: 0;
  }
  
  .filters {
    padding: 0.5rem;
    margin-bottom: 1rem !important;
  }
  
  .request-card {
    padding: 0.75rem !important;
  }
  
  .btn-sm {
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
  }
  
  .badge-status {
    font-size: 0.7rem;
    min-width: 70px;
    padding: 0.3em 0.5em;
  }
  
  /* Ajustes específicos para móviles pequeños */
  .detail-item {
    gap: 0.15rem;
  }
}

@media (max-height: 700px) {
  .main-content {
    height: calc(100vh - 60px);
  }
  
  .header-page {
    height: 60px;
  }
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.request-card {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
