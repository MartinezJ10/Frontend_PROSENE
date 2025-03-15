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
          <FormModal title="Crear Solicitud" v-model="showModal" :reusableForm="reusableFormComponent" :formProps="{
            fields: createRequestFields,
            submitButtonText: 'Crear Solicitud',
            onSubmit: handleRequestCreationSubmit,
            modalClass: 'modal-style-dos'
          }" />
          <button class="btn btn-light border notification-button" @click="toggleNotificationPanel">
            <i class="bi bi-bell"></i>
          </button>
          <NotificationPanel :isAdmin="false" :url="notificationStudentURL" v-if="isNotificationPanelVisible" @close="toggleNotificationPanel" />
          <button class="btn btn-danger d-flex align-items-center logout-button" @click="handleExit">
            <i class="bi bi-box-arrow-left me-2"></i> Cerrar sesión
          </button>
        </div>
        <div class="mobile-dropdown dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button" id="mobileMenu" data-bs-toggle="dropdown">
            Menú
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#" @click="showModal = true">Crear solicitud</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click="toggleNotificationPanel">Notificaciones</a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click="handleExit">Cerrar sesión</a>
            </li>
          </ul>
        </div>
      </header>
  
      <main class="container-fluid">
        <h2 class="dashboard-title">Dashboard de Solicitudes</h2>
        <div class="dashboard-container p-4">
  
          <!-- Filtros mejorados -->
          <div class="filters mb-4 row g-3 align-items-end">
            <!-- Filtro por fecha -->
            <div class="col-md-4">
              <label for="dateFilter" class="form-label">Fecha</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-calendar-date"></i>
                </span>
                <input type="date" id="dateFilter" class="form-control" v-model="searchDate" @input="filterRequests" />
              </div>
            </div>
  
            <!-- Filtro por estado -->
            <div class="col-md-4">
              <label for="estadoFilter" class="form-label">Estado</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-filter"></i>
                </span>
                <select id="estadoFilter" class="form-select" v-model="searchEstado" @change="filterRequests">
                  <option value="">Todos los estados</option>
                  <option v-for="estado in estados" :key="estado.idestadosolicitud" :value="estado.idestadosolicitud">
                    {{ estado.descripcion }}
                  </option>
                </select>
              </div>
            </div>
  
            <!-- Botón para limpiar filtros (opcional) -->
            <div class="col-md-4">
              <button type="button" class="btn btn-secondary w-100" @click="resetFilters">
                Limpiar filtros
              </button>
            </div>
          </div>
  
          <!-- Si existen solicitudes, se itera sobre ellas -->
          <div v-if="filteredRequests.length > 0">
            <ul class="list-group">
              <li class="list-group-item" v-for="(request, index) in filteredRequests" :key="request.id">
                <!-- Tarjeta interna -->
                <div class="request-card p-3">
                  <div class="row align-items-center">
                    <!-- ID: en móviles col-12, en md col-2 -->
                    <div class="col-12 col-md-2">
                      <h5 class="mb-1">#{{ request.idsolicitud }}</h5>
                    </div>
  
                    <!-- Tipo de solicitud: en móviles col-12, en md col-6 -->
                    <div class="col-12 col-md-6 mt-2 mt-md-0 text-md-start">
                      <p class="mb-0 text-muted">
                        {{ request.tiposolicitud.descripcion }}
                      </p>
                    </div>
  
                    <!-- Botones + Estado: en móviles col-12, en md col-4 -->
                    <div
                      class="col-12 col-md-4 d-flex justify-content-between justify-content-md-end align-items-center mt-2 mt-md-0 gap-2">
                      <button class="btn btn-outline-dark btn-sm border" @click="openDetailsModal(request.descripcion)">
                        Detalles
                      </button>
                      <span class="badge badge-status" :class="getStatusClass(request.estadosolicitud.descripcion)">
                        {{ request.estadosolicitud.descripcion }}
                      </span>
                    </div>
                  </div>
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
        <ReusableModal :show="showDetailsModal" title="Detalles de la Solicitud" :message="currentRequestDescription"
          @close="showDetailsModal = false" />
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
      const notificationStudentURL = "http://localhost:8000/api/v1/notificaciones/";
  
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
          estados.value = response.data; // Store estados
        } catch (err) {
          console.error("Failed to retrieve estados:", err.message);
        }
      };
  
      const handleRequestCreationSubmit = async (formData) => {
        try {
          await axios.post(
            "http://localhost:8000/api/v1/solicitudes/nueva",
            {
              idusuariosolicitante: localStorage.getItem("user_id"),
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
  
      // Método para limpiar los filtros
      const resetFilters = () => {
        searchDate.value = "";
        searchEstado.value = "";
        filterRequests();
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
  
  /* --- Filtros (estilos extra) --- */
  .filters {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f8f9fa;
  }
  
  .filters .form-label {
    font-weight: 600;
    color: #003366;
  }
  
  .input-group-text {
    background-color: #003366;
    color: #fff;
  }
  
  /* --- Mensaje de "no hay solicitudes" --- */
  .no-requests {
    font-size: 1.5rem;
    /* Texto más grande */
    text-align: center;
    margin-top: 2rem;
    /* Separación desde el bloque de filtros */
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