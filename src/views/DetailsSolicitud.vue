<template>
    <div class="details-solicitud">
        <h1>Detalles de la Solicitud</h1>
        <div class="details-solicitud-container" v-if="solicitud">
            <div class="details-solicitud-info">
                <h2>Información de la Solicitud</h2>
                <div class="info-item">
                    <span class="info-label">Email del Solicitante:</span>
                    <span class="info-value">{{ solicitud.usuariosolicitante?.email }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Centro Regional del Solicitante:</span>
                    <span class="info-value">{{ solicitud.usuariosolicitante?.centroregional?.centroregional }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email del Responsable:</span>
                    <span class="info-value">{{ solicitud.responsablesolicitud?.email }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Centro Regional del Responsable:</span>
                    <span class="info-value">{{ solicitud.responsablesolicitud?.centroregional?.centroregional }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Estado de la Solicitud:</span>
                    <span class="info-value">{{ solicitud.estadosolicitud?.descripcion }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tipo de Solicitud:</span>
                    <span class="info-value">{{ solicitud.tiposolicitud?.descripcion }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Fecha de Creación:</span>
                    <span class="info-value">{{ formatDate(solicitud.fechacreacion) }}</span>
                </div>
            </div>
            <button class="assign-button" @click="assignSolicitud">ASIGNAR</button>
        </div>
        <Mensaje v-if="showMessage" :mensaje="messageContent" :tipo="messageType" :visible="showMessage" @update:visible="showMessage = false" />
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Mensaje from '../components/Mensaje.vue'; // Importa el componente

export default {
    name: "DetailsSolicitud",
    components: {
        Mensaje,
    },
    setup() {
        const showMessage = ref(false); // Controla la visibilidad del mensaje
        const messageContent = ref(''); // Contenido del mensaje
        const messageType = ref(''); // Tipo de mensaje (éxito o error)

        const solicitud = ref({});
        const router = useRouter();
        const route = useRoute();

        const solicitud_id = route.params.id;

        const getSolicitudDetails = async (solicitud_id) => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/solicitudes/get/${solicitud_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                solicitud.value = response.data;
            } catch (err) {
                console.error("ERROR FINDING SOLICITUD:", err.message);
            }
        };

        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        const assignSolicitud = async () => {
            try {
                const response = await axios.put(
                    'http://localhost:8000/api/v1/solicitudes/atender', // Aquí se usa el método PUT
                    { id: solicitud_id },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                messageContent.value = 'Solicitud asignada con éxito';
                messageType.value = 'exito';
                showMessage.value = true;
            } catch (err) {
                messageContent.value = 'Error al asignar la solicitud';
                messageType.value = 'error';
                showMessage.value = true;
                console.error("ERROR ASSIGNING SOLICITUD:", err.message);
            }
        };

        onMounted(async () => {
            await getSolicitudDetails(solicitud_id);
        });

        return {
            solicitud,
            formatDate,
            assignSolicitud,
            showMessage, // Añade la referencia de visibilidad del mensaje
            messageContent, // Añade la referencia del contenido del mensaje
            messageType, // Añade la referencia del tipo de mensaje
        };
    },
};
</script>

<style scoped>
.details-solicitud {
    padding: 20px;
}

.details-solicitud-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.details-solicitud-info {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
}

.details-solicitud-info h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.info-label {
    font-weight: bold;
    color: #555;
}

.info-value {
    color: #333;
}

.assign-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.assign-button:hover {
    background-color: #0056b3;
}
</style>