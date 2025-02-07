<template>
    <div class="landing">
        <div class="landing-block nav" >
            <button @click="router.push('/manageUsers')">
                Manejar Usuarios
            </button>

        </div>
        <div class="landing-block mid">
            <h2>
                Lista de Usuarios 
            </h2>

            <div v-for="(user, index) in userInfo" :key="index" class="user-card">
                <div class="info">
                    <h3>{{ user.first_name }}</h3>
                    <p><strong>Email:</strong> {{ user.email }}</p>
                    <p><strong>Role:</strong> {{ user.role_id }}</p>
                </div>
            </div>

        </div>
        <div class="landing-block notification-bar"></div>
        <div class="landing-block upper-options"></div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { onMounted, ref } from 'vue';
export default {
    name: 'LandingAdmin',
    setup() {
        const router = useRouter();
        const userInfo = ref({});
        const retrieveUsers = async () => {

            try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/users/all",
                {
                headers: {
                'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                }
                }
            );
            userInfo.value = response.data;
            console.log(userInfo.value);
            } catch (err) {
                console.error("User Listing Failed:" || err.message);
            }
        };
        onMounted(() => {
            retrieveUsers();
        })

        return {
            router,
            retrieveUsers,
            userInfo,
        };

    }
};
</script>

<style scoped>
.landing{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 15px;
    grid-row-gap: 15px; 
    width: calc(100% - 30px); 
    height: calc(100vh - 30px);
    margin: 15px;

}
.landing-block{
    border-radius: 20px;
}
.nav{
    grid-area: 1 / 1 / 7 / 2;
    background-color: var(--main-blue);
}
.mid{
    grid-area: 2 / 2 / 7 / 4;
    background-color: var(--accent-blue);
}
.notification-bar{
    grid-area: 2 / 4 / 7 / 5; 
    background-color: var(--main-blue);
}
.upper-options{
    grid-area: 1 / 2 / 2 / 5; 
    background-color: white;
}

@media (max-width: 850px) {
    .landing {
        grid-template-columns: 1fr; 
        grid-template-rows: auto;
    }   
    .landing-block{
        grid-area: unset; 
    }

}

</style>