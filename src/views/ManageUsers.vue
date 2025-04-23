<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="manage-users-page" role="main">
    <!-- Encabezado: Título y controles de filtrado -->
    <div class="page-header">
      <h1 class="page-title">Lista de Empleados</h1>
      <!-- role="search" identifica el área de búsqueda -->
      <div class="filter-controls" role="search" aria-label="Filtros de búsqueda">
        <!-- Campo de búsqueda por texto -->
        <div class="search-container">
          <i class="bi bi-search" aria-hidden="true"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar empleado..."
            aria-label="Buscar empleado por nombre"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-search" aria-label="Limpiar búsqueda">
            <i class="bi bi-x-circle" aria-hidden="true"></i>
          </button>
        </div>

        <!-- Selector de centro regional -->
        <div class="filter-container">
          <label for="centro-select" class="visually-hidden">Centro Regional</label>
          <select 
            id="centro-select"
            v-model="selectedCentroRegional" 
            class="filter-select"
            aria-label="Filtrar por centro regional"
          >
            <option value="">Todos los Centros</option>
            <option v-for="centro in centrosRegionales" :key="centro.value" :value="centro.value">
              {{ centro.label }}
            </option>
          </select>
          <i class="bi bi-chevron-down select-icon" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="loading-container" aria-live="polite">
      <div class="spinner"></div>
      <p>Cargando empleados...</p>
    </div>
    
    <!-- Mensaje si no hay empleados -->
    <div v-else-if="displayedUsers.length === 0" class="empty-state" aria-live="polite">
      <i class="bi bi-people" aria-hidden="true"></i>
      <h2>No se encontraron empleados</h2>
      <p v-if="searchQuery || selectedCentroRegional">Prueba con otros criterios de búsqueda</p>
      <button @click="resetFilters" class="btn-reset">Restablecer filtros</button>
    </div>

    <!-- Contenedor de tarjetas de usuarios -->
    <div v-else class="card-container" role="region" aria-label="Lista de empleados">
      <div
        v-for="(user, index) in displayedUsers"
        :key="user.idusuario"
        v-memo="[user.idusuario, user.isactive]"
        class="user-card"
        @click="router.push(`/detailsUser/${user.idusuario}`)"
        @keydown.enter="router.push(`/detailsUser/${user.idusuario}`)"
        @keydown.space.prevent="router.push(`/detailsUser/${user.idusuario}`)"
        role="button"
        tabindex="0"
        :aria-label="`Ver detalles de ${getNombreCompleto(user)}, ${getRoleText(user.role_id)}, estado: ${user.isactive ? 'Activo' : 'Inactivo'}`"
      >
        <div class="user-avatar" :class="{ 'inactive': !user.isactive }">
          <span>{{ getInitials(user) }}</span>
        </div>
        <div class="user-card-content">
          <div class="user-card-header">
            <p class="user-name">
              <strong>{{ getNombreCompleto(user) }}</strong>
            </p>
            <div
              class="status"
              :class="{
                'status-active': user.isactive,
                'status-inactive': !user.isactive
              }"
            >
              <div class="status-circle"></div>
              <span v-if="user.isactive">Activo</span>
              <span v-else>Inactivo</span>
            </div>
          </div>
          <div class="user-card-body">
            <p class="user-email" v-if="user.correo">
              <i class="bi bi-envelope" aria-hidden="true"></i>
              {{ user.correo }}
            </p>
            <p class="user-phone" v-if="user.persona && user.persona.telefono">
              <i class="bi bi-telephone" aria-hidden="true"></i>
              {{ user.persona.telefono }}
            </p>
            <p class="user-role">
              <i class="bi bi-person-badge" aria-hidden="true"></i>
              {{ getRoleText(user.role_id) }}
            </p>
            <p class="user-center">
              <i class="bi bi-building" aria-hidden="true"></i>
              {{ user.centroregional && user.centroregional.centroregional ? user.centroregional.centroregional : 'Centro no disponible' }}
            </p>
          </div>
          <div class="card-action">
            <span>Ver detalles</span>
            <i class="bi bi-arrow-right" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="pagination" role="navigation" aria-label="Paginación de empleados">
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="pagination-button"
        aria-label="Página anterior"
      >
        <i class="bi bi-chevron-left" aria-hidden="true"></i>
      </button>
      <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        @click="goToPage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="pagination-button"
        aria-label="Página siguiente"
      >
        <i class="bi bi-chevron-right" aria-hidden="true"></i>
      </button>
    </div>

    <!-- Mensaje de notificación -->
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
import { useRouter } from "vue-router";
import { onMounted, ref, computed, inject, watchEffect } from "vue";
import Mensaje from "../components/Mensaje.vue";
import utils from "../utils";

export default {
  name: "ManageUsers",
  components: {
    Mensaje
  },
  setup() {
    const router = useRouter();
    const showMessage = ref(false);
    const messageContent = ref("");
    const messageType = ref("");
    const userInfo = ref([]);
    const centrosRegionales = ref([]);
    const selectedCentroRegional = ref("");
    const searchQuery = ref("");
    const loading = ref(true);
    const itemsPerPage = ref(12);
    const currentPage = ref(1);

    const requestURL = inject("requestURL");

    // Filtrar usuarios según criterios de búsqueda y centro
    const filteredUsers = computed(() => {
      if (!userInfo.value) return [];
      
      return userInfo.value.filter(user => {
        // Solo incluir administradores y empleados
        if (user.role_id !== 1 && user.role_id !== 2) return false;
        
        // Filtrar por centro regional
        const matchesCentro = !selectedCentroRegional.value || 
          (user.centroregional && user.centroregional.idcentroregional === selectedCentroRegional.value);
        
        // Filtrar por texto de búsqueda
        const searchTerm = searchQuery.value.toLowerCase().trim();
        const userFullName = getNombreCompleto(user).toLowerCase();
        const userEmail = (user.correo || "").toLowerCase();
        const userCenter = (user.centroregional && user.centroregional.centroregional || "").toLowerCase();
        
        const matchesSearch = !searchTerm || 
          userFullName.includes(searchTerm) || 
          userEmail.includes(searchTerm) ||
          userCenter.includes(searchTerm);
        
        return matchesCentro && matchesSearch;
      });
    });

    // Calcular número total de páginas
    const totalPages = computed(() => {
      return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
    });

    // Obtener usuarios para la página actual
    const displayedUsers = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      return filteredUsers.value.slice(startIndex, endIndex);
    });

    // Resetear a página 1 cuando cambian los filtros
    watchEffect(() => {
      if (searchQuery.value || selectedCentroRegional.value) {
        currentPage.value = 1;
      }
    });

    const retrieveUsers = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`${requestURL}/api/v1/users/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        userInfo.value = response.data;
      } catch (err) {
        console.error("User Listing Failed:", err.message);
        messageContent.value = "No se pudieron cargar los empleados. Por favor, intente de nuevo.";
        messageType.value = "error";
        showMessage.value = true;
      } finally {
        loading.value = false;
      }
    };

    const retrieveCentrosRegionales = async () => {
      try {
        const response = await axios.get(`${requestURL}/api/v1/varios/centros`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        centrosRegionales.value = response.data.map((centro) => ({
          value: centro.idcentroregional,
          label: centro.centroregional
        }));
      } catch (err) {
        utils.errorLog(err);
        messageContent.value = "No se pudieron cargar los centros regionales.";
        messageType.value = "error";
        showMessage.value = true;
      }
    };

    // Función para obtener el nombre completo del usuario de forma segura
    const getNombreCompleto = (user) => {
      if (!user || !user.persona) {
        return 'Nombre no disponible';
      }
      
      const nombre = user.persona.primernombre || '';
      const segundoNombre = user.persona.segundonombre || '';
      const apellido = user.persona.primerapellido || '';
      const segundoApellido = user.persona.segundoapellido || '';
      
      if (!nombre && !apellido) {
        return 'Nombre no disponible';
      }
      
      return `${nombre} ${segundoNombre ? segundoNombre + ' ' : ''}${apellido} ${segundoApellido || ''}`.trim();
    };

    // Función para obtener iniciales para el avatar
    const getInitials = (user) => {
      if (!user || !user.persona) return 'N/A';
      
      const nombre = user.persona.primernombre || '';
      const apellido = user.persona.primerapellido || '';
      
      if (!nombre && !apellido) return 'N/A';
      
      const initial1 = nombre ? nombre.charAt(0).toUpperCase() : '';
      const initial2 = apellido ? apellido.charAt(0).toUpperCase() : '';
      
      return `${initial1}${initial2}`;
    };

    // Función para obtener el texto del rol
    const getRoleText = (roleId) => {
      switch(roleId) {
        case 1: return 'Administrador';
        case 2: return 'Empleado/Colaborador';
        case 3: return 'Estudiante';
        default: return 'Rol desconocido';
      }
    };

    // Navegar a una página específica
    const goToPage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      
      // Scroll al inicio de la lista
      const listElement = document.querySelector('.card-container');
      if (listElement) {
        listElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Limpiar búsqueda
    const clearSearch = () => {
      searchQuery.value = "";
    };

    // Resetear todos los filtros
    const resetFilters = () => {
      searchQuery.value = "";
      selectedCentroRegional.value = "";
      currentPage.value = 1;
    };

    onMounted(async () => {
      await Promise.all([retrieveUsers(), retrieveCentrosRegionales()]);
    });

    return {
      router,
      userInfo,
      filteredUsers,
      displayedUsers,
      showMessage,
      messageContent,
      messageType,
      centrosRegionales,
      selectedCentroRegional,
      searchQuery,
      loading,
      currentPage,
      totalPages,
      getNombreCompleto,
      getInitials,
      getRoleText,
      goToPage,
      clearSearch,
      resetFilters
    };
  }
};
</script>

<style scoped>
/* Estilos base */
.manage-users-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
}

/* Encabezado y controles */
.page-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem;
  background-color: #fff;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  color: #002D62;
  flex: 1;
  min-width: 200px;
}

/* Controles de filtro */
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
  min-width: 300px;
}

/* Campo de búsqueda */
.search-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f2f2f2;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  flex: 2;
  min-width: 200px;
  position: relative;
}

.search-input {
  border: none;
  background: transparent;
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  color: #333;
  width: 100%;
}

.search-input:focus {
  outline: none;
}

.clear-search {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: #333;
}

/* Filtro de centro regional */
.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #E6F2FF;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  flex: 1;
  min-width: 200px;
  position: relative;
}

.filter-select {
  appearance: none;
  background: transparent;
  border: none;
  padding: 0.5rem;
  font-size: 1rem;
  color: #002D62;
  width: 100%;
  cursor: pointer;
}

.filter-select:focus {
  outline: 2px solid #002D62;
  border-radius: 4px;
}

.select-icon {
  position: absolute;
  right: 1rem;
  color: #002D62;
  pointer-events: none;
}

/* Estado de carga */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 45, 98, 0.2);
  border-top-color: #002D62;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Estado vacío */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
}

.empty-state h2 {
  margin: 0 0 1rem;
  color: #333;
}

.btn-reset {
  background-color: #E6F2FF;
  color: #002D62;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-reset:hover {
  background-color: #CCE5FF;
}

/* Contenedor de tarjetas de usuarios */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  width: 100%;
  box-sizing: border-box;
}

/* Tarjeta de usuario mejorada */
.user-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  display: flex;
  overflow: hidden;
  border-left: 4px solid #002D62;
}

.user-card:hover, .user-card:focus {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.user-card:focus-visible {
  outline: 3px solid #002D62;
  outline-offset: 2px;
}

/* Avatar del usuario */
.user-avatar {
  width: 60px;
  height: 60px;
  background-color: #002D62;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  border-radius: 50%;
  margin: 1rem;
  flex-shrink: 0;
}

.user-avatar.inactive {
  background-color: #999;
}

/* Contenido de la tarjeta */
.user-card-content {
  flex: 1;
  padding: 1rem 1rem 1rem 0;
  display: flex;
  flex-direction: column;
}

.user-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.user-name {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 0.5rem;
}

.status {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.status-active {
  background-color: #E6F7EB;
  color: #1D8740;
}

.status-inactive {
  background-color: #FFEBEE;
  color: #D32F2F;
}

.status-circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-active .status-circle {
  background-color: #1D8740;
}

.status-inactive .status-circle {
  background-color: #D32F2F;
}

.user-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.user-email, .user-phone, .user-role, .user-center {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-card-body i {
  font-size: 0.9rem;
  color: #002D62;
  opacity: 0.8;
  width: 16px;
  text-align: center;
}

/* Acción de la tarjeta */
.card-action {
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  color: #002D62;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-top: auto;
}

.pagination-button {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-button:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-weight: 600;
  color: #666;
}

/* Utilidad de accesibilidad */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }
  
  .page-title {
    width: 100%;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .filter-controls {
    width: 100%;
  }
  
  .card-container {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    padding: 0.75rem;
  }
}

@media (max-width: 640px) {
  .filter-controls {
    flex-direction: column;
  }
  
  .search-container, .filter-container {
    width: 100%;
    min-width: auto;
  }
  
  .card-container {
    grid-template-columns: 1fr;
  }
  
  .user-avatar {
    width: 50px;
    height: 50px;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .page-header {
    margin: 0.5rem;
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .user-avatar {
    width: 45px;
    height: 45px;
    font-size: 1rem;
    margin: 0.75rem;
  }
  
  .user-card-content {
    padding: 0.75rem 0.75rem 0.75rem 0;
  }
  
  .user-name {
    font-size: 1rem;
  }
}
</style>