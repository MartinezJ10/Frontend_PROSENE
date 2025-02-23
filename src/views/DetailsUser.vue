<template>

    <div class="details-user">
        <h1>Detalles de Usuario</h1>
        <div class="details-user-container">
            <div class="details-user-info">
                <h2>Información del Usuario</h2>
                <p><strong>Email: {{ userFound.email }}</strong></p>
                <p v-if="userFound.role_id === 1">Rol: Administrador</p>
                <p v-else-if="userFound.role_id === 2">Rol: Empleado/Colaborador</p>
                <p v-else-if="userFound.role_id === 3">Rol: Estudiante</p>
                <p>Centro Regional: {{userFound.centroregional?.centroregional}}</p>
            </div>
            <div class="details-user-actions">
                <button class="rounded-button" @click="showModal = true">Actualizar</button>
                <FormModal title="Actualizar Usuario" v-model="showModal" :reusableForm="reusableFormComponent"
                    :formProps="{
                        fields: updateUsersFields,
                        submitButtonText: 'Actualizar Usuario',
                        onSubmit: updateSingleUser
                    }">
                </FormModal>
                <button class="rounded-button danger" @click=deleteSingleUser>Eliminar</button>
            </div>
        </div>
    </div>

</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import FormModal from '../components/FormModal.vue';
import ReusableForm from '../components/ReusableForm.vue';

export default {
    name: "DetailsUser",
    components: {
        FormModal,
        ReusableForm,
    },
    setup() {
        const showModal = ref(false);
        const userFound = ref({});
        const reusableFormComponent = ReusableForm;
        const updateUsersFields = ref([]);

        const router = useRouter();
        const routeData = useRoute();   

        const userId = routeData.params.id;

        const getSingleUserDetails = async (userId) => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/v1/users/get/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                
                userFound.value = response.data;
            } catch (err) {
                console.error("ERROR FINDING USER:" || err.message);
            }
        };

        const deleteSingleUser = async () => {
            try {
                const response = await axios.delete(
                    `http://localhost:8000/api/v1/users/delete/?email=${userFound.value.email}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );      
                console.log(response.data);
                      
                router.push("/manageUsers");
                
            } catch (err) {
                console.error("ERROR DELETING USER:", {
                message: err.message,
                response: err.response, // Full response from the server
                request: err.request,   // Request details
                config: err.config      // Axios request configuration
            });
            }
        };


        watch(
            () => userFound.value,
            (newUserFound) => {
                updateUsersFields.value = [
                    { name: "name", label: "Nombre", type: "text", value: newUserFound.first_name },
                    { name: "email", label: "Email", type: "email", value: newUserFound.email },
                    { name: "password", label: "Contraseña", type: "password", value: newUserFound.password },
                    {
                        name: "rol", label: "Rol", type: "select", value: newUserFound.role_id, options: [
                            { value: 1, label: "Admin" },
                            { value: 2, label: "User" },
                        ]
                    },
                ];
            },
            { deep: true, immediate: true }
        );

        const updateSingleUser = async (userFound) => {
            try {
                const response = await axios.delete(
                    `http://localhost:8000/api/v1/users/put/?email=${userFound.value.email}`,
                    {
                        first_name: formData.name,
                        last_name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role_id: formData.rol,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );
                router.push("/manageUsers");
            } catch (err) {
                console.error("ERROR DELETING USER:" || err.message);
            }
        }

        onMounted(() => {
            getSingleUserDetails(userId);
        })

        return {
            userFound,
            deleteSingleUser,
            showModal,
            reusableFormComponent,
            updateSingleUser,
            FormModal,
            updateUsersFields,
        };
    },

}

</script>

<style>
.details-user {
    padding: 20px;
}

.details-user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.details-user-info h2 {
    margin-bottom: 10px;
}

.details-user-info p {
    margin: 5px 0;
    font-size: 18px;

}

.details-user-actions {
    display: flex;
    width: 50%;
    gap: 10px;
}
</style>