<template>
  <!-- role="banner" define el encabezado para NVDA -->
  <div id="app" class="app">
    <header class="header d-flex justify-content-between align-items-center px-3" role="banner">
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
            onSubmit: handleRequestCreationSubmit
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
        <!-- role="dialog" para el panel de notificaciones -->
        <NotificationPanel
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
    <main class="container-fluid" role="main">
      <h2 class="dashboard-title">Dashboard de Solicitudes</h2>
      <div class="dashboard-container p-4">
        <!-- role="search" para los filtros -->
        <div class="filters mb-4" role="search" aria-label="Filtros de solicitudes">
          <input 
            type="date" 
            v-model="searchDate" 
            @input="filterRequests" 
            placeholder="Buscar por fecha" 
            class="filter-input"
            aria-label="Filtrar por fecha"
          />
          <select 
            v-model="searchEstado" 
            @change="filterRequests" 
            class="filter-select"
            aria-label="Filtrar por estado"
          >
            <option value="">Todos los estados</option>
            <option v-for="estado in estados" :key="estado.idestadosolicitud" :value="estado.idestadosolicitud">
              {{ estado.descripcion }}
            </option>
          </select>
        </div>

        <!-- Lista de solicitudes -->
        <div v-if="filteredRequests.length > 0" role="region" aria-label="Lista de solicitudes">
          <ul class="list-group">
            <li
              class="list-group-item"
              v-for="(request, index) in filteredRequests"
              :key="request.id"
            >
              <div class="request-card p-3">
                <div class="row align-items-center">
                  <div class="col-12 col-md-2">
                    <h5 class="mb-1">#{{ request.idsolicitud }}</h5>
                  </div>
                  <div class="col-12 col-md-6 mt-2 mt-md-0 text-md-start">
                    <p class="mb-0 text-muted">
                      {{ request.tiposolicitud.descripcion }}
                    </p>
                  </div>
                  <div
                    class="col-12 col-md-4 d-flex justify-content-between justify-content-md-end align-items-center mt-2 mt-md-0 gap-2"
                  >
                    <button
                      class="btn btn-outline-dark btn-sm border"
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
            </li>
          </ul>
        </div>
        <!-- Mensaje de no solicitudes -->
        <div v-else class="no-requests">
          No hay solicitudes registradas.
        </div>
      </div>
      <!-- role="dialog" para el modal de detalles -->
      <ReusableModal
        :show="showDetailsModal"
        title="Detalles de la Solicitud"
        :message="currentRequestDescription"
        @close="showDetailsModal = false"
        role="dialog"
        aria-label="Modal de detalles de la solicitud"
      />
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";
import { onMounted, ref, computed, onUnmounted } from "vue";
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
    const searchDate = ref('');
    const searchEstado = ref('');
    const estados = ref([]);

    const userId = ref(utils.getUserId());

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
        const response = await axios.get("http://localhost:8000/api/v1/varios/tipos", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        tipoSolicitudes.value = response.data.map((tipoSolicitud) => ({
          value: tipoSolicitud.idtiposolicitud,
          label: tipoSolicitud.descripcion,
        }));
      } catch (err) {
        errorLog(err);
      }
    };

    const retrieveRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/solicitudes/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        requests.value = response.data;
      } catch (err) {
        errorLog(err);
      }
    };

    const retrieveEstados = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/estados", {
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
          "http://localhost:8000/api/v1/solicitudes/nueva",
          {
            idusuariosolicitante: userId.value,
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
      return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
    };

    const filteredRequests = computed(() => {
      return requests.value.filter(request => {
        const matchesDate = searchDate.value ? isSameDate(request.fechacreacion, searchDate.value) : true;
        const matchesEstado = searchEstado.value ? request.estadosolicitud.idestadosolicitud === parseInt(searchEstado.value) : true;
        return matchesDate && matchesEstado;
      });
    });

    const filterRequests = () => {
      // This function is just a placeholder to trigger the computed property
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
  overflow-x: hidden;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  overflow: hidden;
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
  background-color: #ffd100;
  color: #003366;
  border: none;
}

main {
  flex-grow: 1;
  padding: 30px;
  background-color: #f4f7fc;
  background-image: url("@/assets/fondo-unah4.png");
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

/* --- Ajustes para la lista y la "tarjeta" de solicitud --- */
.list-group-item {
  border: none;
  padding: 0;
  margin-bottom: 1rem;
}

.request-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  transition: background-color 0.2s ease;
}

.request-card:hover {
  background-color: #f9f9f9;
}

.request-card h5 {
  font-size: 1.25rem;
  text-align: left;
}

/* --- Badge (estado) --- */
.badge-status {
  font-size: 0.9rem;
  min-width: 90px;
  text-align: center;
}

.badge-status.recibida {
  background-color: #e2e3e5;
  color: #383d41;
}

.badge-status.en-proceso {
  background-color: #fff3cd;
  color: #856404;
}

.badge-status.finalizada {
  background-color: #d4edda;
  color: #155724;
}

.badge-status.cancelada,
.badge-status.rechazada {
  background-color: #f8d7da;
  color: #721c24;
}

.badge-status.otro-estado {
  background-color: #dee2e6;
  color: #495057;
}

/* --- Responsivo --- */
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
  .notification-button,
  .request-button,
  .logout-button {
    display: none !important;
  }
  main {
    height: 89vh;
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
  .notification-button,
  .request-button,
  .logout-button {
    display: none;
  }
  main {
    height: 87vh;
  }
}

@media (min-width: 768px) {
  .mobile-dropdown {
    display: none;
  }
}
</style>