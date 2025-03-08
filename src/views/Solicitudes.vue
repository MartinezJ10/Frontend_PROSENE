<template>
    <div>
        <div class="upper-container">
            <h1>Lista de Solicitudes</h1>
            <div class="filters">
                <input type="date" v-model="searchDate" @input="filterSolicitudes" placeholder="Buscar por fecha" class="filter-input" />
                <select v-model="searchEstado" @change="filterSolicitudes" class="filter-select">
                    <option value="">Todos los estados</option>
                    <option value="1">Pendiente</option>
                    <option value="2">Aprobado</option>
                    <option value="3">Rechazado</option>
                </select>
            </div>
        </div>

        <div class="card-container">
            <div v-for="(solicitud, index) in filteredSolicitudes" :key="index" class="user-card" @click="goToDetails(solicitud.idsolicitud)">
                <div class="user-card-header">
                    <p><strong>{{ solicitud.email }}</strong></p>
                    <div class="status">
                        <div class="status-circle" :style="{ backgroundColor: getStatusColor(solicitud.estado) }"></div>
                        <span>{{ getStatusText(solicitud.estado) }}</span>
                    </div>
                </div>
                <div class="user-card-body">
                    <p>Centro: {{ solicitud.centro }}</p>
                    <p>Fecha de Solicitud: {{ formatDate(solicitud.fecha) }}</p>
                </div>
            </div>
        </div>
        <Mensaje v-if="showMessage" :mensaje="messageContent" :tipo="messageType" :visible="showMessage" @update:visible="showMessage = false" />
    </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Mensaje from "../components/Mensaje.vue"; 

export default {
    name: "Solicitudes",
    components: {
        Mensaje,
    },
    setup() {
        const router = useRouter();
        const showMessage = ref(false); 
        const messageContent = ref(''); 
        const messageType = ref(''); // Tipo de mensaje (éxito o error)
        const solicitudes = ref([]);
        const searchDate = ref('');
        const searchEstado = ref('');

        const retrieveSolicitudes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/v1/solicitudes/all",
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                solicitudes.value = response.data.map(solicitud => ({
                    idsolicitud: solicitud.idsolicitud,
                    email: solicitud.usuariosolicitante.email,
                    centro: solicitud.usuariosolicitante.centroregional.centroregional,
                    estado: solicitud.estadosolicitud.idestadosolicitud,
                    fecha: solicitud.fechacreacion
                }));
            } catch (err) {
                console.error("Failed to retrieve Solicitudes:", err.message);
            }
        };

        const getStatusText = (estado) => {
            switch (estado) {
                case 1:
                    return 'Pendiente';
                case 2:
                    return 'Aprobado';
                case 3:
                    return 'Rechazado';
                default:
                    return 'Desconocido';
            }
        };

        const getStatusColor = (estado) => {
            switch (estado) {
                case 1:
                    return 'yellow';
                case 2:
                    return 'green';
                case 3:
                    return 'red';
                default:
                    return 'gray';
            }
        };

        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        const isSameDate = (date1, date2) => {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            return d1.toISOString().split('T')[0] === d2.toISOString().split('T')[0];
        };

        const filteredSolicitudes = computed(() => {
            return solicitudes.value.filter(solicitud => {
                const matchesDate = searchDate.value ? isSameDate(solicitud.fecha, searchDate.value) : true;
                const matchesEstado = searchEstado.value ? solicitud.estado === parseInt(searchEstado.value) : true;
                return matchesDate && matchesEstado;
            });
        });

        const filterSolicitudes = () => {
            // This function is just a placeholder to trigger the computed property
        };

        const goToDetails = (id) => {
            router.push(`/detailsSolicitud/${id}`);
        };

        onMounted(async () => {
            await retrieveSolicitudes();
        });

        return {
            solicitudes,
            showMessage, 
            messageContent, 
            messageType, 
            getStatusText,
            getStatusColor,
            formatDate,
            searchDate,
            searchEstado,
            filteredSolicitudes,
            filterSolicitudes,
            goToDetails
        };
    },
};
</script>

<style scoped>
.card-container {
    display: flex;
    margin: 2rem;
    flex-direction: column;
    justify-content: center;
}

.upper-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem;
}

.filters {
    display: flex;
    gap: 1rem;
}

.filter-input, .filter-select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
}

.filter-input:focus, .filter-select:focus {
    outline: none;
    border-color: #007bff;
}

.user-card {
    border: 2px solid var(--obscure);
    background-color: var(--accent-yellow);
    border-radius: 15px;
    margin: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.user-card:hover {
    cursor: pointer;
    transform: scale(1.01);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.user-card p {
    margin: 0;
}

.user-card-body p {
    display: flex;
    align-self: flex-start;
}

.user-card-header {
    display: flex;
    justify-content: space-between;
}

.status {
    display: flex;
    align-items: center;
    justify-items: center;
}

.status-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: red;
    margin-right: 5px;
}
</style>