<template>
  <div class="notification-panel" v-click-outside="closePanel">
    <!-- Header del panel -->
    <div class="panel-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Notificaciones</h5>
      <button class="close-btn" @click="closePanel">&times;</button>
    </div>

    <!-- Contenido del panel -->
    <div v-if="notifications.length === 0" class="text-muted p-3 text-center">
      <div class="empty-state">
        <i class="bi bi-bell-slash mb-2"></i>
        <p>No hay notificaciones.</p>
      </div>
    </div>
    <div v-else class="panel-body">
      <div
        v-for="notification in sortedNotifications"
        :key="notification.idnotificacion"
        class="notification-card mb-3"
        :class="{ 'notification-read': notification.isread, 'notification-unread': !notification.isread }"
      >
        <div class="notification-content p-3">
          <div class="notification-header mb-2">
            <div class="type-badge">
              {{ notification.solicitudes.tiposolicitud.descripcion }}
            </div>
            <div class="date-container">
              {{ formatDate(notification.create_date) }}
            </div>
          </div>
          
          <div class="id-container mt-2">
            <span class="id-label me-2">ID Solicitud:</span>
            <span class="id-value">{{ notification.solicitudes.idsolicitud }}</span>
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
            @click="deleteNotification(notification.idnotificacion)"
            class="action-btn delete-btn"
          >
            <i class="bi bi-trash me-1"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, computed } from "vue";

// Directiva personalizada para detectar clics fuera del elemento.
// Se utiliza setTimeout para retrasar la adición del listener y evitar que el clic que abre el panel lo cierre inmediatamente.
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
  }
};

export default {
  name: "NotificationPanel",
  directives: {
    "click-outside": clickOutsideDirective
  },
  props: {
    url: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const notifications = ref([]);

    const closePanel = () => emit("close");

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getUTCDate()).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const year = date.getUTCFullYear();
      return `${day}/${month}/${year}`;
    };

    const retrieveNotifications = async () => {
      try {
        const response = await axios.get(props.url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        notifications.value =
          response.data.detail === "No tienes notificaciones"
            ? []
            : response.data;
      } catch (err) {
        notifications.value = [];
      }
    };

    const markAsRead = async (id) => {
      try {
        await axios.put(
          `http://localhost:8000/api/v1/notificaciones/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );
        const notification = notifications.value.find(
          (n) => n.idnotificacion === id
        );
        if (notification) notification.isread = true;
      } catch (err) {
        // Manejo de error si es necesario
      }
    };

    const deleteNotification = async (id) => {
      try {
        await axios.delete(
          `http://localhost:8000/api/v1/notificaciones/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );
        notifications.value = notifications.value.filter(
          (n) => n.idnotificacion !== id
        );
      } catch (err) {
        // Manejo de error si es necesario
      }
    };

    onMounted(retrieveNotifications);

    const sortedNotifications = computed(() =>
      notifications.value.slice().sort(
        (a, b) =>
          new Date(b.create_date).getTime() - new Date(a.create_date).getTime()
      )
    );

    return {
      notifications,
      sortedNotifications,
      formatDate,
      markAsRead,
      deleteNotification,
      closePanel
    };
  }
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
}

.notification-panel {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 380px;
  background-color: var(--white);
  border: 1px solid var(--accent-blue);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  padding: 15px;
  border-bottom: 1px solid var(--accent-blue);
  background-color: var(--bg-panel);
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

.panel-body {
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-card {
  border-radius: 8px;
  background-color: var(--accent-yellow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.notification-unread {
  background-color: var(--accent-yellow);
  border-left: 4px solid var(--main-blue);
}

.notification-read {
  background-color: var(--white);
  border-left: 4px solid var(--accent-blue);
  opacity: 0.85;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.type-badge {
  font-size: 1.0rem;
  font-weight: bold;
  display: inline-block;
}

.date-container {
  font-size: 0.9rem;
  color: #666;
}

.id-container {
  display: flex;
  align-items: center;
}

.id-label {
  font-weight: bold;
  color: var(--main-blue);
  font-size: 0.9rem;
}

.id-value {
  font-weight: bold;
  font-size: 0.9rem;
}

.notification-actions {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.action-btn {
  border: none;
  padding: 6px 12px;
  font-size: 0.875rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: 8px;
  display: flex;
  align-items: center;
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
</style>