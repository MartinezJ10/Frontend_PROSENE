<template>
  <div class="notification-panel" v-click-outside="closePanel">
    <!-- Notification Content -->
    <div v-if="notifications.length === 0" class="text-muted p-3">
      There are no messages.
    </div>
    <div v-else>
      <div v-for="notification in notifications" :key="notification.idnotificacion" class="notification-card mb-3 p-3"
        :class="{ 'notification-read': notification.isread, 'notification-unread': !notification.isread }">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-1 fw-bold">{{ notification.solicitudes.tiposolicitud.descripcion }}</h6>
            <p class="mb-1 text-muted">{{ notification.solicitudes.descripcion }}</p>
            <small class="text-muted">{{ formatDate(notification.create_date) }}</small>
          </div>
          <div>
            <button v-if="!notification.isread" @click="markAsRead(notification.idnotificacion)"
              class="btn btn-sm mark-as-read-btn">
              Mark as Read
            </button>
            <!-- Conditionally render the Delete button for admins -->
            <button v-if="isAdmin" @click="deleteNotification(notification.idnotificacion)" class="btn btn-sm btn-danger ms-2">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from 'vue';

export default {
  name: "NotificationPanel",
  props: {
    url: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false // Default to false (student)
    }
  },
  
  emits: ['close'], // Emit close event
  setup(props, { emit }) {
    const notifications = ref([]);
    console.log(props.isAdmin);
    const closePanel = () => {
      emit('close'); // Emit close event to parent
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };

    const errorLog = async (err) => {
      console.error("ERROR IN REQUEST:", {
        message: err.message,
        response: err.response,
        request: err.request,
        config: err.config
      });
    };

    const retrieveNotifications = async () => {
      try {
        const response = await axios.get(props.url, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("jwt")}` }
        });

        // Check if the response contains the "detail" key and handle it
        if (response.data.detail === "No tienes notificaciones") {
          notifications.value = []; // Set notifications to an empty array
        } else {
          notifications.value = response.data; // Set notifications to the response data
        }
      } catch (err) {
        // Only log errors that are not the specific "No tienes notificaciones" response
        if (err.response && err.response.data.detail !== "No tienes notificaciones") {
          errorLog(err); // Log actual errors
        }
        notifications.value = []; // Set notifications to an empty array in case of an error
      }
    };

    const markAsRead = async (id) => {
      try {
        await axios.put(`http://localhost:8000/api/v1/notificaciones/${id}`, {}, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("jwt")}` }
        });
        const notification = notifications.value.find(n => n.idnotificacion === id);
        if (notification) {
          notification.isread = true;
        }
      } catch (err) {
        errorLog(err);
      }
    };

    const deleteNotification = async (id) => {
      try {
        await axios.delete(`http://localhost:8000/api/v1/notificaciones/delete/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("jwt")}` }
        });
        // Remove the deleted notification from the list
        notifications.value = notifications.value.filter(n => n.idnotificacion !== id);
      } catch (err) {
        errorLog(err);
      }
    };

    onMounted(async () => {
      await retrieveNotifications();
    });

    return {
      notifications,
      formatDate,
      markAsRead,
      deleteNotification,
      closePanel
    };
  }
};
</script>

<style scoped>
/* Your existing styles here */
</style>
<style scoped>
:root {
  --main-yellow: #FFCC00;
  --main-blue: #091C5A;
  --accent-blue: rgba(9, 28, 90, 0.35);
  --obscure: #000000;
  --white: #FFFFFF;
  --accent-yellow: #FEFEC6;
}

.notification-panel {
  position: fixed;
  top: 60px;
  right: 20px;
  width: 350px;
  /* Default width for larger screens */
  background-color: var(--white);
  border: 1px solid var(--accent-blue);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .notification-panel {
    width: 300px;
    /* Slightly smaller for tablets */
    right: 10px;
  }
}

@media (max-width: 576px) {
  .notification-panel {
    width: 100%;
    /* Full width on mobile */
    right: 0;
    top: 50px;
    /* Adjust top position for mobile header */
    border-radius: 0;
    /* Remove border radius for full-width */
    box-shadow: none;
    /* Remove shadow for a cleaner look */
    border: none;
    /* Remove border for full-width */
  }
}

.notification-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.notification-card h6 {
  color: var(--main-blue);
}

.notification-card p {
  color: var(--obscure);
}

.notification-card small {
  color: var(--accent-blue);
}

.mark-as-read-btn {
  background-color: var(--main-yellow);
  color: var(--main-blue);
  border: none;
  padding: 5px 10px;
  font-size: 0.875rem;
}

.mark-as-read-btn:hover {
  background-color: var(--accent-yellow);
  color: var(--main-blue);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 0.875rem;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>