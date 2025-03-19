<template>
  <div class="notification-panel" v-click-outside="closePanel">
    <!-- Header del panel -->
    <div class="panel-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Notificaciones</h5>
      <button class="close-btn" @click="closePanel">&times;</button>
    </div>

    <!-- Contenido del panel -->
    <div v-if="notifications.length === 0" class="text-muted p-3 text-center">
      No hay notificaciones.
    </div>
    <div v-else class="panel-body">
      <div
        v-for="notification in sortedNotifications"
        :key="notification.idnotificacion"
        class="notification-card mb-3 p-3"
        :class="{ 'notification-read': notification.isread, 'notification-unread': !notification.isread }"
      >
        <div class="d-flex justify-content-between align-items-center">
          <h6 class="mb-1 fw-bold">
            {{ notification.solicitudes.tiposolicitud.descripcion }}
          </h6>
          <small class="text-muted">
            {{ formatDate(notification.create_date) }}
          </small>
        </div>
        <div class="d-flex justify-content-end mt-2">
          <button
            v-if="!notification.isread"
            @click="markAsRead(notification.idnotificacion)"
            class="btn btn-sm mark-as-read-btn me-2"
          >
            Marcar como leído
          </button>
          <button
            v-if="isAdmin"
            @click="deleteNotification(notification.idnotificacion)"
            class="btn btn-sm btn-danger"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, computed } from "vue";

export default {
  name: "NotificationPanel",
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
      const day = String(date.getUTCDate()).padStart(2, '0'); // Asegura que siempre tenga dos dígitos
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() devuelve 0-11, por lo que sumamos 1
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
      } catch (err) {}
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
      } catch (err) {}
    };

    onMounted(retrieveNotifications);

    // Computed para ordenar las notificaciones de la más reciente a la más antigua
    const sortedNotifications = computed(() =>
      notifications.value.slice().sort(
        (a, b) => new Date(b.create_date).getTime() - new Date(a.create_date).getTime()
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
}

.notification-panel {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 350px;
  background-color: var(--white);
  border: 1px solid var(--accent-blue);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  padding: 12px 15px;
  border-bottom: 1px solid var(--accent-blue);
  background-color: var(--bg-panel);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--main-blue);
  cursor: pointer;
}

.close-btn:hover {
  color: var(--accent-blue);
}

.panel-body {
  padding: 10px 15px;
  max-height: 350px;
  overflow-y: auto;
}

.notification-card {
  border-radius: 8px;
  background-color: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid transparent;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.notification-unread {
  border-left-color: var(--main-blue);
  background-color: var(--accent-yellow);
}

.notification-read {
  border-left-color: var(--accent-blue);
  background-color: var(--white);
  opacity: 0.8;
}

.mark-as-read-btn {
  background-color: var(--main-yellow);
  color: var(--main-blue);
  border: none;
  padding: 5px 10px;
  font-size: 0.875rem;
  border-radius: 4px;
}

.mark-as-read-btn:hover {
  background-color: var(--accent-yellow);
  color: var(--main-blue);
}

.btn-danger {
  border: none;
  padding: 5px 10px;
  font-size: 0.875rem;
  border-radius: 4px;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
