<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="container my-3 relative-container" role="main">
    <div class="page-header mb-3">
      <h1 class="page-title">Lista de Solicitudes</h1>

      <button 
        class="btn btn-unah" 
        @click="toggleFilters"
        :aria-expanded="showFilters ? 'true' : 'false'"
        aria-controls="filters-overlay"
      >
        <i class="bi bi-funnel-fill me-2" aria-hidden="true"></i>
        {{ showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros' }}
      </button>
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
            <tr v-if="paginatedSolicitudes.length === 0">
              <td colspan="7" class="text-center text-muted">
                No se encontraron solicitudes.
              </td>
            </tr>
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

    // Traer datos del backend
    const retrieveSolicitudes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/solicitudes/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        });
        solicitudes.value = response.data.map((solicitud) => ({
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
      } catch (err) {
        console.error("Failed to retrieve Solicitudes:", err.message);
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
      // Ajusta colores según tus necesidades
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
        const matchesEstado = searchEstado.value
          ? solicitud.estado === parseInt(searchEstado.value)
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
    const pageSize = ref(8); // Ajusta la cantidad de filas por página
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
    });

    return {
      // Mensajes
      showMessage,
      messageContent,
      messageType,
      // Listas
      solicitudes,
      estados,
      tiposSolicitud,
      centros,
      // Filtros
      searchEstado,
      searchUsername,
      searchTipo,
      searchCentro,
      showFilters,
      toggleFilters,
      resetFilters,
      // Orden y filtrado
      dateSortOrder,
      toggleDateSort,
      filterSolicitudes,
      filteredSolicitudes,
      sortedSolicitudes,
      // Estado y color
      getStatusText,
      getStatusColor,
      formatDate,
      // Paginación
      currentPage,
      pageSize,
      totalPages,
      paginatedSolicitudes,
      nextPage,
      prevPage,
      // Navegación
      goToDetails
    };
  },
};
</script>

<style scoped>
/* Contenedor principal */
.relative-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px); /* Ajusta según la altura de tu header */
  overflow: hidden;
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

/* Paginación (arriba de la tabla) */
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

/* Responsivo */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .page-title {
    font-size: 1.2rem;
  }
  .filters-overlay {
    top: 55px;
    flex-direction: column;
    gap: 0.6rem;
  }
  .compact-table th,
  .compact-table td {
    font-size: 0.75rem;
    padding: 0.3rem;
  }
  .status-badge {
    font-size: 0.7rem;
  }
  .pagination-container {
    margin-bottom: 0.5rem;
    box-shadow: none;
    border: 1px solid #ddd;
  }
}
</style>
