<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="container my-3 relative-container" role="main">
    <div class="page-header mb-3">
      <h1 class="page-title">Lista de Solicitudes</h1>
      <div class="button-group">
    <button 
      class="btn btn-unah" 
      @click="toggleFilters"
      :aria-expanded="showFilters ? 'true' : 'false'"
      aria-controls="filters-overlay"
    >
      <i class="bi bi-funnel-fill me-2" aria-hidden="true"></i>
      <span class="button-text">{{ showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros' }}</span>
    </button>
    <button 
      class="btn btn-unah" 
      @click="retrieveMisSolicitudes"
      aria-label="Mostrar mis solicitudes"
    >
      <i class="bi bi-person-fill me-2"></i>
      <span class="button-text">Mis Solicitudes</span>
    </button>
    <button 
      class="btn btn-unah" 
      @click="retrieveSolicitudes"
      aria-label="Mostrar todas las solicitudes"
    >
      <i class="bi bi-card-checklist me-2"></i>
      <span class="button-text">Todas Solicitudes</span>
    </button>
  </div>

    </div>

    <!-- Sección de filtros con transición -->
    <transition name="slide-fade">
      <div 
        v-if="showFilters" 
        class="filters-overlay" 
        id="filters-overlay"
        role="region"
        aria-label="Filtros de búsqueda"
      >
        <!-- Filtro por Usuario -->
        <div class="col-12 col-sm-3">
          <label for="userFilter" class="form-label fw-semibold">Usuario</label>
          <input
            id="userFilter"
            type="text"
            class="form-control"
            v-model="searchUsername"
            placeholder="Buscar usuario..."
            @input="filterSolicitudes"
            aria-label="Filtrar por nombre de usuario"
          />
        </div>

        <!-- Filtro por Centro Regional -->
        <div class="col-12 col-sm-3">
          <label for="centroFilter" class="form-label fw-semibold">Centro Regional</label>
          <select
            id="centroFilter"
            class="form-select"
            v-model="searchCentro"
            @change="filterSolicitudes"
            aria-label="Filtrar por centro regional"
          >
            <option value="">Todos los centros</option>
            <option
              v-for="centro in centros"
              :key="centro.idcentroregional"
              :value="centro.centroregional"
            >
              {{ centro.centroregional }}
            </option>
          </select>
        </div>

        <!-- Filtro por Estado -->
        <div class="col-12 col-sm-3">
          <label for="estadoFilter" class="form-label fw-semibold">Estado</label>
          <select
            id="estadoFilter"
            class="form-select"
            v-model="searchEstado"
            @change="filterSolicitudes"
            aria-label="Filtrar por estado de solicitud"
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

        <!-- Filtro por Tipo de Solicitud -->
        <div class="col-12 col-sm-3">
          <label for="tipoFilter" class="form-label fw-semibold">Tipo de Solicitud</label>
          <select
            id="tipoFilter"
            class="form-select"
            v-model="searchTipo"
            @change="filterSolicitudes"
            aria-label="Filtrar por tipo de solicitud"
          >
            <option value="">Todos los tipos</option>
            <option
              v-for="tipo in tiposSolicitud"
              :key="tipo.idtiposolicitud"
              :value="tipo.descripcion"
            >
              {{ tipo.descripcion }}
            </option>
          </select>
        </div>

        <!-- Botón para limpiar filtros -->
        <div class="col-12 col-sm-3 d-flex align-items-end">
          <button
            class="btn btn-secondary w-100"
            @click="resetFilters"
            aria-label="Limpiar todos los filtros"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </transition>

    <!-- Contenedor derecho -->
    <div class="right-container">
      <!-- Paginación arriba de la tabla -->
      <div 
        class="pagination-container mb-2" 
        role="navigation" 
        aria-label="Paginación de la lista de solicitudes"
      >
        <button 
          :disabled="currentPage === 1" 
          @click="prevPage"
          aria-label="Página anterior"
          :aria-disabled="currentPage === 1 ? 'true' : 'false'"
        >
          Anterior
        </button>
        <span aria-live="polite">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          :disabled="currentPage === totalPages" 
          @click="nextPage"
          aria-label="Página siguiente"
          :aria-disabled="currentPage === totalPages ? 'true' : 'false'"
        >
          Siguiente
        </button>
      </div>

      <!-- Tabla de Solicitudes -->
      <div class="table-responsive" role="region" aria-label="Lista de solicitudes">
        <table class="table table-sm table-hover table-bordered text-center compact-table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Usuario</th>
              <th scope="col">Tipo de Solicitud</th>
              <th scope="col">
                Fecha
                <button
                  class="btn btn-sm arrow-button ms-1"
                  @click="toggleDateSort"
                  :aria-label="`Ordenar por fecha ${dateSortOrder === 'asc' ? 'descendente' : 'ascendente'}`"
                >
                  {{ dateSortOrder === 'asc' ? '↑' : '↓' }}
                </button>
              </th>
              <th scope="col">Centro Regional</th>
              <th scope="col">Estado</th>
              <th scope="col" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Mostrar mensaje de carga mientras se extraen los datos -->
            <tr v-if="loading">
              <td colspan="7" class="text-center text-muted">
                Cargando datos, por favor espere...
              </td>
            </tr>
            <!-- Mostrar resultados o mensaje de no encontrar solicitudes -->
            <template v-else>
              <tr v-if="paginatedSolicitudes.length === 0">
                <td colspan="7" class="text-center text-muted">
                  No se encontraron solicitudes.
                </td>
              </tr>
              <tr v-for="(solicitud, index) in paginatedSolicitudes" :key="index">
                <td class="id-column">{{ solicitud.idsolicitud }}</td>
                <td>{{ solicitud.fullName }}</td>
                <td>{{ solicitud.tipo }}</td>
                <td>{{ formatDate(solicitud.fecha) }}</td>
                <td>{{ solicitud.centro }}</td>
                <td>
                  <span
                    class="badge status-badge"
                    :style="{ backgroundColor: getStatusColor(solicitud.estado), color: '#fff' }"
                  >
                    {{ getStatusText(solicitud.estado) }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-action btn-sm"
                    @click="goToDetails(solicitud.idsolicitud)"
                    :aria-label="`Ver detalles de la solicitud de ${solicitud.fullName}`"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mensaje de retroalimentación -->
    <Mensaje
      v-if="showMessage"
      :mensaje="messageContent"
      :tipo="messageType"
      :visible="showMessage"
      @update:visible="showMessage = false"
      aria-live="polite"
    />
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import Mensaje from "../components/Mensaje.vue";
import ReusableForm from "../components/ReusableForm.vue";
import ReusableModal from "../components/ReusableModal.vue";

export default {
  name: "Solicitudes",
  components: { Mensaje, ReusableForm, ReusableModal },
  setup() {
    const router = useRouter();

    // Estados para mensajes de retroalimentación
    const showMessage = ref(false);
    const messageContent = ref("");
    const messageType = ref("");

    // Listas y filtros
    const solicitudes = ref([]);
    const searchEstado = ref("");
    const searchUsername = ref("");
    const searchTipo = ref("");
    const searchCentro = ref("");

    const estados = ref([]);
    const tiposSolicitud = ref([]);
    const centros = ref([]);

    // Estado de carga de datos
    const loading = ref(true);

    // Mostrar/ocultar filtros
    const showFilters = ref(false);
    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
    };

    // Función para limpiar filtros
    const resetFilters = () => {
      searchEstado.value = "";
      searchUsername.value = "";
      searchTipo.value = "";
      searchCentro.value = "";
      filterSolicitudes(); // Forzamos el refresco
    };

    // Orden de fecha (asc o desc)
    const dateSortOrder = ref("asc");

    // Función para mapear la respuesta de la API a la estructura que usa la tabla
    const mapSolicitudes = (data) => {
      return data.map((solicitud) => ({
        idsolicitud: solicitud.idsolicitud,
        fullName: solicitud.usuariosolicitante.persona
          ? `${solicitud.usuariosolicitante.persona.primernombre} ${solicitud.usuariosolicitante.persona.primerapellido}`
          : solicitud.usuariosolicitante.email,
        email: solicitud.usuariosolicitante.email,
        centro: solicitud.usuariosolicitante.centroregional.centroregional,
        estado: solicitud.estadosolicitud.idestadosolicitud,
        fecha: solicitud.fechacreacion,
        tipo: solicitud.tiposolicitud.descripcion,
      }));
    };

    // Traer todas las solicitudes (dashboard completo)
    const retrieveSolicitudes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/solicitudes/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        solicitudes.value = mapSolicitudes(response.data);
      } catch (err) {
        console.error("Failed to retrieve Solicitudes:", err.message);
      }
    };

    // Función para traer "Mis Solicitudes" desde la API de solicitudes atendidas
    const retrieveMisSolicitudes = async () => {
      loading.value = true;
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/v1/solicitudes/atendidas", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        solicitudes.value = mapSolicitudes(response.data);
      } catch (err) {
        console.error("Error al obtener Mis Solicitudes:", err.message);
      } finally {
        loading.value = false;
      }
    };

    const retrieveCentros = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/centros", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        centros.value = response.data;
      } catch (err) {
        console.error("Failed to retrieve centros:", err.message);
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

    const retrieveTipos = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/varios/tipos", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        tiposSolicitud.value = response.data;
      } catch (err) {
        console.error("Failed to retrieve tipos de solicitud:", err.message);
      }
    };

    // Texto y color para el estado
    const getStatusText = (estado) => {
      const estadoObj = estados.value.find((e) => e.idestadosolicitud === estado);
      return estadoObj ? estadoObj.descripcion : "Desconocido";
    };

    const getStatusColor = (estado) => {
      switch (estado) {
        case 1: // Recibida
          return "#17a2b8";
        case 2: // En Proceso
          return "#FFCC00";
        case 3: // Finalizada
          return "#1E7E34";
        case 4: // Cancelada
          return "#6c757d";
        case 5: // Rechazada
          return "#B22222";
        default:
          return "#6c757d";
      }
    };

    // Formato de fecha
    const formatDate = (dateString) => {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Filtrar y ordenar
    const filterSolicitudes = () => {
      currentPage.value = 1; // Reinicia a la primera página al filtrar
    };

    const filteredSolicitudes = computed(() => {
      return solicitudes.value.filter((solicitud) => {
        const matchesCentro = searchCentro.value
          ? solicitud.centro === searchCentro.value
          : true;
        const matchesEstado =
          searchEstado.value !== "" && searchEstado.value !== undefined
            ? solicitud.estado === searchEstado.value
            : true;
        const matchesUsername = searchUsername.value
          ? solicitud.fullName.toLowerCase().includes(searchUsername.value.toLowerCase())
          : true;
        const matchesTipo = searchTipo.value
          ? solicitud.tipo === searchTipo.value
          : true;
        return matchesCentro && matchesEstado && matchesUsername && matchesTipo;
      });
    });

    const sortedSolicitudes = computed(() => {
      return [...filteredSolicitudes.value].sort((a, b) => {
        return dateSortOrder.value === "asc"
          ? new Date(a.fecha) - new Date(b.fecha)
          : new Date(b.fecha) - new Date(a.fecha);
      });
    });

    const toggleDateSort = () => {
      dateSortOrder.value = dateSortOrder.value === "asc" ? "desc" : "asc";
    };

    // Paginación
    const currentPage = ref(1);
    const pageSize = ref(8);
    const totalPages = computed(() => {
      return Math.ceil(sortedSolicitudes.value.length / pageSize.value) || 1;
    });
    const paginatedSolicitudes = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return sortedSolicitudes.value.slice(start, start + pageSize.value);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    // Navegar a detalles
    const goToDetails = (id) => {
      router.push(`/detailsSolicitud/${id}`);
    };

    onMounted(async () => {
      await retrieveSolicitudes();
      await retrieveEstados();
      await retrieveTipos();
      await retrieveCentros();
      loading.value = false;
    });

    return {
      showMessage,
      messageContent,
      messageType,
      solicitudes,
      estados,
      tiposSolicitud,
      centros,
      searchEstado,
      searchUsername,
      searchTipo,
      searchCentro,
      showFilters,
      toggleFilters,
      resetFilters,
      loading,
      dateSortOrder,
      toggleDateSort,
      filterSolicitudes,
      filteredSolicitudes,
      sortedSolicitudes,
      getStatusText,
      getStatusColor,
      formatDate,
      currentPage,
      pageSize,
      totalPages,
      paginatedSolicitudes,
      nextPage,
      prevPage,
      goToDetails,
      retrieveMisSolicitudes,
      retrieveSolicitudes
    };
  },
};
</script>

<style>
/* Contenedor principal */
.relative-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  /* Ajusta la alineación horizontal que prefieras en pantallas grandes */
  justify-content: flex-end; 
  flex-wrap: wrap; /* Para que no desborde si no cabe en una sola línea */
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Encabezado de la página */
.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.page-title {
  margin: 0;
  font-size: 1.3rem;
  color: #002D62;
}

/* Botón principal (estilo UNAH) */
.btn-unah {
  background-color: #002f6c;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 0.85rem;
  padding: 0.4rem 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-unah:hover {
  background-color: #ffcc00;
  color: #002f6c;
}

/* Contenedor derecho */
.right-container {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
}

/* Tabla compacta y minimalista */
.compact-table {
  font-size: 0.85rem;
  margin: 0;
  border-collapse: collapse;
}

.compact-table th,
.compact-table td {
  padding: 0.4rem 0.6rem;
  vertical-align: middle;
}

.compact-table thead th {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Columna de ID */
.id-column {
  font-weight: 600;
  color: #002D62;
}

/* Badges de estado */
.status-badge {
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  display: inline-block;
  min-width: 100px;
  text-align: center;
}

/* Botón de acción */
.btn-action {
  background-color: #002D62;
  color: #fff;
  border: none;
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
}
.btn-action:hover {
  background-color: #ffcc00;
  color: #002D62;
}

/* Paginación */
.pagination-container {
  background-color: #fff;
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.pagination-container button {
  background-color: #002D62;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
}
.pagination-container button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Overlay de filtros */
.filters-overlay {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  padding: 0.8rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

/* Transición de filtros */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Flecha de orden */
.arrow-button {
  background-color: transparent;
  border: 1px solid #ccc;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  color: #333;
  cursor: pointer;
}
.arrow-button:hover {
  background-color: #eee;
}

/* Ajustes generales de responsividad */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .button-group {
    flex-direction: row !important;
    gap: 0.3rem;
  }

  .btn-unah {
    padding: 0.4rem;
    width: auto;
  }

  .button-text {
    display: none;
  }

  .btn-unah i {
    margin: 0 !important;
    font-size: 1.1rem;
  }

  .btn-unah {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .filters-overlay {
    position: static;
    top: auto;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    margin: 0.5rem 0;
  }

  .filters-overlay > div {
    width: 100% !important;
    max-width: 100%;
  }

  .compact-table {
    font-size: 0.75rem;
  }

  .compact-table th,
  .compact-table td {
    padding: 0.5rem;
    white-space: nowrap;
  }

  .status-badge {
    min-width: 80px;
    font-size: 0.65rem;
    padding: 0.25rem 0.4rem;
  }

  .btn-action {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }

  .page-title {
    font-size: 1.1rem;
  }

  .compact-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .compact-table th:nth-child(4),
  .compact-table td:nth-child(4),
  .compact-table th:nth-child(5),
  .compact-table td:nth-child(5) {
    display: none;
  }

  .btn-action {
    width: 100%;
  }

  .arrow-button {
    padding: 0.1rem 0.3rem;
    font-size: 0.6rem;
  }
}

/* Mejoras adicionales para tabletas */
@media (min-width: 769px) and (max-width: 1024px) {
  .filters-overlay {
    gap: 0.5rem;
    padding: 0.5rem;
  }

  .compact-table {
    font-size: 0.8rem;
  }

  .btn-unah {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }
}

/* Optimización de la tabla en móviles */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Mejora de legibilidad en filtros */
.form-label {
  font-size: 0.8rem;
}

.form-control, .form-select {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
}

/* Ajuste de botones en móviles */
.btn-secondary {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
}

/* Optimización de espacios verticales */
.right-container {
  padding-bottom: 1rem;
}
</style>
