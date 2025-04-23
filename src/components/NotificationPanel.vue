<template>
  <div
    class="notification-panel"
    v-click-outside="closePanel"
    role="dialog"
    aria-label="Panel de notificaciones"
    aria-modal="true"
  >
    <div class="panel-header d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center">
        <h5 class="mb-0">Notificaciones</h5>
        <span v-if="unreadCount > 0" class="unread-badge ms-2">{{
          unreadCount
        }}</span>
      </div>
      <div class="header-controls">
        <button
          v-if="notifications.length > 0"
          @click="markAllAsRead"
          class="action-btn mark-all-btn me-2"
          aria-label="Marcar todas como leídas"
        >
          <i class="bi bi-check2-all"></i>
        </button>
        <button
          class="close-btn"
          @click="closePanel"
          aria-label="Cerrar panel de notificaciones"
        >
          ×
        </button>
      </div>
    </div>

    <div class="filter-bar d-flex justify-content-between p-2">
      <div class="filter-buttons">
        <button
          @click="setFilter('all')"
          class="filter-btn"
          :class="{ active: currentFilter === 'all' }"
        >
          Todas
        </button>
        <button
          @click="setFilter('unread')"
          class="filter-btn"
          :class="{ active: currentFilter === 'unread' }"
        >
          No leídas
        </button>
      </div>
      <select
        v-if="typeOptions.length > 1"
        v-model="typeFilter"
        class="type-filter"
      >
        <option value="all">Todos los tipos</option>
        <option v-for="type in typeOptions" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <!-- Estado de carga -->
    <div v-if="loading" class="text-center p-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando notificaciones...</p>
    </div>

    <!-- Estado de error -->
    <div v-else-if="error" class="alert alert-danger m-3">
      <i class="bi bi-exclamation-triangle me-2"></i>
      Error al cargar notificaciones. Intente de nuevo.
      <button
        @click="retrieveNotifications"
        class="btn btn-sm btn-outline-danger mt-2"
      >
        Reintentar
      </button>
    </div>

    <!-- Estado vacío -->
    <div
      v-else-if="filteredNotifications.length === 0"
      class="text-muted p-3 text-center"
    >
      <div class="empty-state">
        <i class="bi bi-bell-slash mb-2"></i>
        <p v-if="notifications.length === 0">No hay notificaciones.</p>
        <p v-else>
          No hay notificaciones que coincidan con los filtros actuales.
        </p>
      </div>
    </div>

    <!-- Lista de notificaciones -->
    <div
      v-else
      class="panel-body"
      role="region"
      aria-label="Lista de notificaciones"
    >
      <div
        v-for="notification in filteredNotifications"
        :key="notification.idnotificacion"
        class="notification-card mb-3"
        :class="{
          'notification-read': notification.isread,
          'notification-unread': !notification.isread,
        }"
      >
        <div class="notification-content p-3">
          <div class="notification-header mb-2">
            <div class="type-badge">
              <i :class="getNotificationIcon(notification)"></i>
              {{ notification.solicitudes.tiposolicitud.descripcion }}
            </div>
            <div class="date-container">
              <i class="bi bi-calendar3 me-1"></i>
              {{ formatDate(notification.create_date) }}
            </div>
          </div>

          <div class="id-container mt-2">
            <span class="id-label me-2">ID Solicitud:</span>
            <span class="id-value">{{
              notification.solicitudes.idsolicitud
            }}</span>
          </div>
        </div>

        <div class="notification-actions">
          <button
            v-if="!notification.isread"
            @click="markAsRead(notification.idnotificacion)"
            class="action-btn mark-read-btn"
          >
            <i class="bi bi-check-circle me-1"></i> Marcar como leído
          </button>
          <button
            v-if="isAdmin"
            @click="confirmDelete(notification.idnotificacion)"
            class="action-btn delete-btn"
          >
            <i class="bi bi-trash me-1"></i> Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteModal" class="delete-modal">
      <div class="delete-modal-content p-3">
        <h6 class="mb-3">¿Está seguro que desea eliminar esta notificación?</h6>
        <div class="d-flex justify-content-end">
          <button
            @click="showDeleteModal = false"
            class="btn btn-sm btn-secondary me-2"
          >
            Cancelar
          </button>
          <button @click="executeDelete" class="btn btn-sm btn-danger">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, inject, computed, watch } from "vue";

// Directiva personalizada para detectar clics fuera del elemento.
const clickOutsideDirective = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    setTimeout(() => {
      document.addEventListener("click", el.clickOutsideEvent);
    }, 0);
  },
  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

export default {
  name: "NotificationPanel",
  directives: {
    "click-outside": clickOutsideDirective,
  },
  props: {
    url: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  emits: ["close", "countUpdate"],
  setup(props, { emit }) {
    const notifications = ref([]);
    const loading = ref(true);
    const error = ref(false);
    const requestURL = inject("requestURL");
    const currentFilter = ref("all");
    const typeFilter = ref("all");
    const showDeleteModal = ref(false);
    const notificationToDelete = ref(null);

    // Cerrar el panel
    const closePanel = () => emit("close");

    // Formatear fechas
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    };

    // Obtener notificaciones
    const retrieveNotifications = async () => {
      loading.value = true;
      error.value = false;
      try {
        const response = await axios.get(props.url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        });
        notifications.value =
          response.data.detail === "No tienes notificaciones"
            ? []
            : response.data;
        notifications.value.sort((a, b) => b.idnotificacion - a.idnotificacion);
        emit("countUpdate", unreadCount.value);
      } catch (err) {
        error.value = true;
        notifications.value = [];
      } finally {
        loading.value = false;
      }
    };

    // Marcar como leída
    const markAsRead = async (id) => {
      try {
        await axios.put(
          `${requestURL}/api/v1/notificaciones/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        const notification = notifications.value.find(
          (n) => n.idnotificacion === id
        );
        if (notification) {
          notification.isread = true;
          emit("countUpdate", unreadCount.value);
        }
      } catch (err) {
        // Mostrar mensaje de error
      }
    };

    // Marcar todas como leídas
    const markAllAsRead = async () => {
      try {
        // Asumiendo que tienes un endpoint para marcar todas como leídas
        await axios.put(
          `${requestURL}/api/v1/notificaciones/mark-all-read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        // Si no existe tal endpoint, podrías marcarlas una por una
        notifications.value.forEach((notification) => {
          notification.isread = true;
        });
        emit("countUpdate", 0);
      } catch (err) {
        // Marcar una por una como alternativa
        const promises = notifications.value
          .filter((n) => !n.isread)
          .map((n) => markAsRead(n.idnotificacion));
        await Promise.all(promises);
      }
    };

    // Confirmar eliminación
    const confirmDelete = (id) => {
      notificationToDelete.value = id;
      showDeleteModal.value = true;
    };

    // Ejecutar eliminación
    const executeDelete = async () => {
      if (!notificationToDelete.value) return;

      try {
        await axios.delete(
          `${requestURL}/api/v1/notificaciones/delete/${notificationToDelete.value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        notifications.value = notifications.value.filter(
          (n) => n.idnotificacion !== notificationToDelete.value
        );
        emit("countUpdate", unreadCount.value);
      } catch (err) {
        // Mostrar mensaje de error
      } finally {
        showDeleteModal.value = false;
        notificationToDelete.value = null;
      }
    };

    // Obtener icono según tipo de notificación
    const getNotificationIcon = (notification) => {
      const type =
        notification.solicitudes.tiposolicitud.descripcion.toLowerCase();

      // Mapa de iconos según el tipo de solicitud
      const iconMap = {
        solicitud: "bi bi-file-earmark-text",
        reclamo: "bi bi-exclamation-triangle",
        consulta: "bi bi-question-circle",
        pago: "bi bi-credit-card",
        actualizacion: "bi bi-arrow-clockwise",
      };

      // Buscar coincidencias parciales en el tipo
      for (const [key, icon] of Object.entries(iconMap)) {
        if (type.includes(key)) {
          return icon;
        }
      }

      // Icono por defecto
      return "bi bi-bell";
    };

    // Función para cambiar filtro
    const setFilter = (filter) => {
      currentFilter.value = filter;
    };

    // Computed properties
    const unreadCount = computed(() => {
      return notifications.value.filter((n) => !n.isread).length;
    });

    const typeOptions = computed(() => {
      const types = new Set();
      notifications.value.forEach((n) => {
        if (
          n.solicitudes &&
          n.solicitudes.tiposolicitud &&
          n.solicitudes.tiposolicitud.descripcion
        ) {
          types.add(n.solicitudes.tiposolicitud.descripcion);
        }
      });
      return Array.from(types);
    });

    const filteredNotifications = computed(() => {
      let filtered = [...notifications.value];

      // Filtrar por leídas/no leídas
      if (currentFilter.value === "unread") {
        filtered = filtered.filter((n) => !n.isread);
      }

      // Filtrar por tipo
      if (typeFilter.value !== "all") {
        filtered = filtered.filter(
          (n) =>
            n.solicitudes &&
            n.solicitudes.tiposolicitud &&
            n.solicitudes.tiposolicitud.descripcion === typeFilter.value
        );
      }

      return filtered;
    });

    onMounted(retrieveNotifications);

    return {
      notifications,
      loading,
      error,
      currentFilter,
      typeFilter,
      showDeleteModal,
      unreadCount,
      typeOptions,
      filteredNotifications,
      formatDate,
      markAsRead,
      markAllAsRead,
      confirmDelete,
      executeDelete,
      closePanel,
      retrieveNotifications,
      getNotificationIcon,
      setFilter,
    };
  },
};
</script>

<style scoped>
:root {
  --main-yellow: #ffcc00;
  --main-blue: #091c5a;
  --accent-blue: rgba(9, 28, 90, 0.35);
  --white: #ffffff;
  --accent-yellow: #fefec6;
  --bg-panel: #f7f7f7;
  --light-border: #e0e0e0;
  --highlight-unread: #fff9e0;
}

.notification-panel {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 380px;
  max-width: calc(100vw - 40px);
  background-color: var(--white);
  border: 1px solid var(--accent-blue);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: slideIn 0.3s ease;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.panel-header {
  padding: 15px;
  border-bottom: 1px solid var(--accent-blue);
  background-color: var(--bg-panel);
  flex-shrink: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--main-blue);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.close-btn:hover {
  color: var(--accent-blue);
  transform: scale(1.1);
}

.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main-yellow);
  color: var(--main-blue);
  font-weight: bold;
  font-size: 0.75rem;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  padding: 0 6px;
}

.filter-bar {
  background-color: #f0f0f0;
  border-bottom: 1px solid var(--light-border);
  flex-shrink: 0;
}

.filter-btn {
  background: none;
  border: none;
  padding: 5px 10px;
  margin-right: 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.filter-btn.active {
  background-color: var(--main-yellow);
  color: var(--main-blue);
  font-weight: 500;
}

.type-filter {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--light-border);
  font-size: 0.9rem;
  background-color: white;
}

.panel-body {
  padding: 15px;
  overflow-y: auto;
  flex-grow: 1;
}

.notification-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.notification-unread {
  background-color: var(--highlight-unread);
  border-left: 4px solid var(--main-yellow);
}

.notification-read {
  background-color: var(--white);
  border-left: 4px solid var(--light-border);
  opacity: 0.85;
}

.notification-content {
  position: relative;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.type-badge {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: var(--main-blue);
}

.type-badge i {
  margin-right: 6px;
  color: var(--main-yellow);
}

.date-container {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
}

.id-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.id-label {
  font-weight: bold;
  color: var(--main-blue);
  font-size: 0.9rem;
}

.id-value {
  font-weight: bold;
  font-size: 0.9rem;
  word-break: break-all;
}

.notification-actions {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  border: none;
  padding: 6px 12px;
  font-size: 0.875rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.mark-read-btn {
  background-color: var(--main-yellow);
  color: var(--main-blue);
  font-weight: 500;
}

.mark-read-btn:hover {
  background-color: #e6b800;
  transform: translateY(-1px);
}

.mark-all-btn {
  background-color: transparent;
  color: var(--main-blue);
  font-size: 1rem;
  padding: 0;
  margin-right: 10px;
}

.mark-all-btn:hover {
  color: var(--main-yellow);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: #666;
}

.empty-state i {
  font-size: 2rem;
  opacity: 0.7;
}

/* Modales */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1010;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.delete-modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Estilo para la barra de desplazamiento */
.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.panel-body::-webkit-scrollbar-thumb {
  background: var(--accent-blue);
  border-radius: 10px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: var(--main-blue);
}

/* Add these styles to your NotificationPanel component's style section */

.high-contrast .notification-panel {
  background-color: var(--card-bg-color);
  border-color: var(--card-border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.high-contrast .panel-header {
  background-color: var(--primary-color);
  border-color: var(--card-border-color);
  color: var(--header-text-color);
}

.high-contrast .close-btn {
  color: var(--header-text-color);
}

.high-contrast .close-btn:hover {
  color: var(--secondary-color);
}

.high-contrast .filter-bar {
  background-color: var(--filter-bg-color);
  border-color: var(--card-border-color);
}

.high-contrast .filter-btn {
  color: var(--text-color);
}

.high-contrast .filter-btn:hover {
  background-color: var(--primary-color);
  color: var(--header-text-color);
}

.high-contrast .filter-btn.active {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.high-contrast .type-filter {
  background-color: var(--card-bg-color);
  border-color: var(--card-border-color);
  color: var(--text-color);
}

.high-contrast .notification-unread {
  background-color: rgba(214, 158, 46, 0.15); /* secondary color with opacity */
  border-left-color: var(--secondary-color);
}

.high-contrast .notification-read {
  background-color: var(--card-bg-color);
  border-left-color: var(--card-border-color);
  opacity: 0.8;
}

.high-contrast .type-badge {
  color: var(--secondary-color);
}

.high-contrast .type-badge i {
  color: var(--secondary-color);
}

.high-contrast .date-container,
.high-contrast .id-label {
  color: var(--sm-text);
}

.high-contrast .id-value {
  color: var(--text-color);
}

.high-contrast .notification-actions {
  background-color: rgba(0, 0, 0, 0.1);
  border-color: var(--card-border-color);
}

.high-contrast .mark-read-btn {
  background-color: var(--secondary-color);
  color: var(--primary-color);
}

.high-contrast .mark-read-btn:hover {
  background-color: #e6b800;
}

.high-contrast .mark-all-btn {
  color: var(--secondary-color);
}

.high-contrast .mark-all-btn:hover {
  color: var(--header-text-color);
}

.high-contrast .empty-state {
  color: var(--sm-text);
}

.high-contrast .panel-body::-webkit-scrollbar-track {
  background: var(--card-bg-color);
}

.high-contrast .panel-body::-webkit-scrollbar-thumb {
  background: var(--secondary-color);
}

.high-contrast .delete-modal-content {
  background-color: var(--card-bg-color);
  color: var(--text-color);
}

.high-contrast .text-muted {
  color: var(--sm-text) !important;
}

/* Specific styles for the notification cards */
.high-contrast .notification-card {
  background-color: var(--card-bg-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.high-contrast .notification-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Media queries para responsividad */
@media (max-width: 480px) {
  .notification-panel {
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
    top: 50px;
  }

  .notification-actions {
    justify-content: space-between;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }
}

/* Para dispositivos muy pequeños */
@media (max-width: 320px) {
  .panel-header {
    padding: 10px;
  }

  .panel-body {
    padding: 10px;
  }

  .notification-content {
    padding: 10px !important;
  }

  .type-badge {
    font-size: 0.9rem;
  }
}
</style>
