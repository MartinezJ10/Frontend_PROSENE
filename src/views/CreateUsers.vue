<template>
    <div class="form-container">
        <h2>Crear Usuario</h2>
        <ReusableForm :fields="createUsersFields" submitButtonText="Crear Usuario"
            :onSubmit="handleUserCreationSubmit" />
    </div>
</template>
<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import ReusableForm from "../components/ReusableForm.vue";

export default {
    name: "CreateUser",
    components: {
        ReusableForm,
    },
    setup() {
        const router = useRouter();

        const createUsersFields = ref([
            { name: "name", label: "Nombre", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Contraseña", type: "password" },
            { name: "rol", label: "Rol", type: "text" },
        ]);

        //Handle user creation
        const handleUserCreationSubmit = async (formData) => {
            console.log(formData);
            
            try {
                const response = await axios.post(
                    "http://localhost:8000/api/v1/users/create",
                    {
                        first_name: formData.name,
                        last_name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role_id: formData.rol,
                    }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                    }
                }
                );
                console.log("USER CREATED FINE");
                router.push("/landingAdmin");
            } catch (err) {
                errorLog(err)            
            }
        };
        
        const errorLog = async (err) => {
            console.error("ERROR IN REQUEST:", {
                message: err.message,
                response: err.response, // Full response from the server
                request: err.request,   // Request details
                config: err.config      // Axios request configuration
            });
        }

        return {
            createUsersFields,
            handleUserCreationSubmit,
            router,
        };
    },
};
</script>

<style scoped>
.form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    height: 100%;
    width: 100%;
}
</style>