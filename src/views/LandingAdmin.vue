<template>
    <div class="landing">
        
        <div class="landing-block nav" >
            <button class="btn" @click="router.push('/manageUsers')">
                Manejar Usuarios
            </button>
            <button class="btn" @click="router.push('/studentEnrollment')">
                Manejar Alumnos
            </button>
            <button class="btn" @click="router.push('/solicitudes')">
                Mis solicitudes
            </button>
        </div>

        <div class="landing-block mid">
            <router-view ></router-view>
        </div>
        <div class="landing-block notification-bar">

            

        </div>
        <div class="landing-block upper-options"></div> 
    </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
    name: 'LandingAdmin',
    components: {
    },
    setup() {
        const router = useRouter();
        return {
            router
        };
    }
};
</script>

<style scoped>
.btn{
    background-color: var(--main-blue);
    color: var(--white);
    padding: 10px 20px;
    width: 100%;
    border: none;
    border-left: 5px solid var(--main-yellow);
    cursor: pointer;
}
.landing{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    grid-column-gap: 10px;
    grid-row-gap: 10px; 
    width: calc(100% - 30px); 
    height: calc(100vh - 30px);
    margin: 10px;
}
.landing-block{
    border-radius: 15px;
}
.nav{
    grid-area: 1 / 1 / 7 / 2;
    background-color: var(--main-blue);
}
.mid{
    grid-area: 2 / 2 / 7 / 6;
    overflow: scroll;
    overflow-x: hidden;
    background-color: var(--accent-blue);
}
.notification-bar{
    grid-area: 2 / 6 / 7 / 7; 
    background-color: var(--main-blue);
}
.upper-options{
    grid-area: 1 / 2 / 2 / 7; 
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