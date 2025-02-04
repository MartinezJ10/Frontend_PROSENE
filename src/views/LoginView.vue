<template>
    <div class="login-view">
        <div class="block-art">

        </div>
        <div class="block-form">
            <h1>PROSENE</h1> 
            <ReusableForm :fields="loginFields" submitButtonText="Acceder" :onSubmit="handleLoginSubmit" />
        </div> 
    </div>
    
</template>

<script>
    
    import { ref } from "vue";
    import { useRouter  } from "vue-router";
    import ReusableForm from "../components/ReusableForm.vue";

    export default {
        name: 'LoginView',
        components: {
            ReusableForm
        },
        setup() {
            const router = useRouter();  

            //Fields for the login form
            const loginFields = ref([
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'password', label: 'Contraseña', type: 'password' }
            ]);

            //Handle the form submission
            const handleLoginSubmit = (formData) => {
                //console.log(formData);
                router.push("/landingAdmin");  
            };

            //return everything haha
            return {
                loginFields,
                handleLoginSubmit
            };
        }
    };

</script>

<style scoped>
.login-view {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%; 
    height: 100vh;
}
.block-art{
    background-color: var(--main-blue);
}
.block-form{
    place-self: center;
}

@media (max-width: 600px) {
    .login-view {
        grid-template-columns: 1fr;
    }   
    .block-form{
        margin: 2rem;
    }

}

</style>