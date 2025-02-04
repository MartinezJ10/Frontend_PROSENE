<template>
<div>
    CREAR USUARIO
</div>
<ReusableForm :fields="createUsersFields" submitButtonText="Crear Usuario" :onSubmit="handleUserCreationSubmit" />

</template>


<script>
import { ref } from 'vue';
import ReusableForm from "../components/ReusableForm.vue";

export default {
    name: 'ManageUsers',
    components: {
            ReusableForm
        },
    setup() {
        const createUsersFields = ref([
            { name: 'name', label: 'Nombre', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Contraseña', type: 'password' },
            { name: 'rol', label: 'Rol', type: 'text' }
        ]); 

        const handleUserCreationSubmit = (formData) => {
            console.log(formData);
        };

        return {
            createUsersFields,
            handleUserCreationSubmit
        };
    }
};

</script>

<style></style>