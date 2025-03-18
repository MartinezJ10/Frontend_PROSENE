<template>
    <div class="form-block">
        <FormKit allow-incomplete type="multi-step" tab-style="progress" hide-navigation="true">

            <FormKit type="step" name="Usuario">
                <StepUsuario v-model:formData="formData.usuario" />
            </FormKit>

            <FormKit type="step" name="inscripcion">
                <StepInscripcion v-model:formData="formData.inscripcion" />
            </FormKit>

            <FormKit type="step" name="educacion">
                <StepCaracteristicas v-model:formData="formData.educacion" />
            </FormKit>

            <FormKit type="step" name="comunicacion">
                <StepComunicacion v-model:formData="formData.comunicacion" />
            </FormKit>

            <FormKit type="step" name="deficiencia">
                <StepDeficiencia v-model:formData="formData.deficiencia" />
            </FormKit>

            <FormKit type="step" name="discapacidad">
                <StepDiscapacidad v-model:formData="formData.discapacidad" />
            </FormKit>

            <FormKit type="step" name="movilizacion">
                <StepMovilizacion v-model:formData="formData.movilizacion" />
            </FormKit>

            <FormKit type="step" name="servicio">
                <StepServicio v-model:formData="formData.servicio" :submitForm="submitForm" />
            </FormKit>

        </FormKit>

        <Mensaje v-if="showMessage" :mensaje="messageContent" :tipo="messageType" :visible="showMessage"
            @update:visible="showMessage = false" />
    </div>
</template>

<script>
import StepCaracteristicas from '../components/StepCaracteristicas.vue';
import StepComunicacion from '../components/StepComunicacion.vue';
import StepDeficiencia from '../components/StepDeficiencia.vue';
import StepDiscapacidad from '../components/StepDiscapacidad.vue';
import StepInscripcion from '../components/StepInscripcion.vue';
import StepMovilizacion from '../components/StepMovilizacion.vue';
import StepServicio from '../components/StepServicio.vue';
import StepUsuario from '../components/StepUsuario.vue';
import Mensaje from '../components/Mensaje.vue';

import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
    name: "CreateStudent",
    components: {
        StepInscripcion,
        StepCaracteristicas,
        StepComunicacion,
        StepDeficiencia,
        StepDiscapacidad,
        StepMovilizacion,
        StepServicio,
        StepUsuario,
        Mensaje
    },
    setup() {
        const formularioId = ref();
        const userID = ref('');

        const formData = ref({
            usuario: {},
            inscripcion: {
                perteneceaasociacion: false,
                tienetrabajo: false
            },
            educacion: {
                estudiaenunah: false
            },
            comunicacion: {
                usabraille: false,
                usalsho: false,
                usacomunicaciongestual: false,
                usalecturalabial: false,
                usacomunicaciontotal: false,
                usaacabo: false,
                usodecalculadora: false
            },
            deficiencia: {},
            discapacidad: {},
            movilizacion: {},
            servicio: {
                apoyoenprocesodeadmision: false,
                apoyoenpaa: false,
                orientaciongeneral: false,
                orientacionvocacional: false,
                coordinacionconprofesores: false,
                orientacionymovilidad: false,
                transcripcionalbraille: false,
                lecturaygrabaciondetexto: false,
                tutorialdemateria: false,
                serviciodenotarios: false,
                interpretesdelenguadesenias: false,
                adecuaciondeaccesoalentorno: false
            },
        });

        const showMessage = ref(false);
        const messageContent = ref('');
        const messageType = ref('');

        const submitForm = async () => {
            try {
                console.log('Form Data:', formData.value);
                await submitUsuario();
                await submitDetallesPersonales();
                await submitFormulario();
                await submitEducacion();
                await submitComunicacion();
                await submitDeficiencia();
                await submitDiscapacidad();
                await submitMovilizacion();
                await submitServicio();

                console.log("EVERYTHING UPLOADED");

                messageContent.value = 'Formulario enviado con éxito';
                messageType.value = 'exito';
                showMessage.value = true;

            } catch (error) {
                errorLog(error);
                messageContent.value = 'Error al enviar el formulario';
                messageType.value = 'error';
                showMessage.value = true;
            }
        };

        const submitUsuario = async () => {
                 
            try {

                const response = await axios.post(
                    `http://localhost:8000/api/v1/users/create`,
                    {
                        email: formData.value.usuario.email,
                        password: formData.value.usuario.password,
                        idcentroregional: formData.value.usuario.idcentroregional,
                        role_id: 3,
                        isactive: true,
                        correoverificado: false,
                        primeracceso: true
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                userID.value = response.data.idusuario;
                
                //localStorage.setItem("userID", userID.value);
                console.log("USER CREATED SUCCESSFULLY");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitDetallesPersonales = async () => {
            try {

                const response = await axios.post(
                    `http://localhost:8000/api/v1/users/detalles_personales`,
                    {
                        idusuario: userID.value,
                        numeroidentidad: formData.value.usuario.numeroidentidad,
                        primernombre: formData.value.usuario.primernombre,
                        segundonombre: formData.value.usuario.segundonombre,
                        primerapellido: formData.value.usuario.primerapellido,
                        segundoapellido: formData.value.usuario.segundoapellido,
                        direccion: formData.value.usuario.direccion,
                        telefono: formData.value.usuario.telefono,
                        fechanacimiento: formData.value.usuario.fechanacimiento,
                        sexo: formData.value.usuario.sexo,
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                console.log("PERSONAL DETAILS CREATED SUCCESSFULLY");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitFormulario = async () => {
            const formulario = { ...formData.value.inscripcion };

            if (!formulario.perteneceaasociacion) {
                formulario.nombreasociacion = null;
                formulario.rolenlaasociacion = null;
            }

            if (!formulario.tienetrabajo) {
                formulario.lugartrabajo = null;
                formulario.puestotrabajo = null;
                formulario.direcciontrabajo = null;
                formulario.telefonotrabajo = null;
            }

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/form/inscripcion`,
                    {
                        ...formulario,
                        idusuario: userID.value
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                formularioId.value = response.data.idformulario;
                localStorage.setItem("id_formulario", formularioId.value);
                console.log("FORMULARIO INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitEducacion = async () => {
            const educacion = { ...formData.value.educacion };
            const formulario_id = localStorage.getItem("id_formulario");

            if (!educacion.estudiaenunah) {
                educacion.carrera = null;
                educacion.numerodecuenta = null;
            }

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/form/caracteristicas`,
                    {
                        idformulario: formulario_id,
                        ...educacion
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                console.log("CARACTERISTICAS INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitComunicacion = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const comunicacion = { ...formData.value.comunicacion };

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/form/comunicacion`,
                    {
                        idformulario: formulario_id,
                        ...comunicacion
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                console.log("COMUNICACION INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitDeficiencia = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const deficiencia = { ...formData.value.deficiencia };

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/form/deficiencia`,
                    {
                        idformulario: formulario_id,
                        ...deficiencia
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                console.log("DEFICIENCIA INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitDiscapacidad = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const discapacidad = { ...formData.value.discapacidad };

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/form/discapacidad`,
                    {
                        idformulario: formulario_id,
                        ...discapacidad
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                console.log("DISCAPACIDAD INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitMovilizacion = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const movilizacion = { ...formData.value.movilizacion };

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/form/movilizacion`,
                    {
                        idformulario: formulario_id,
                        ...movilizacion
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                console.log("MOVILIZACION INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const submitServicio = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const servicio = { ...formData.value.servicio };

            try {
                const response = await axios.post(
                    `http://localhost:8000/api/v1/form/servicio`,
                    {
                        idformulario: formulario_id,
                        ...servicio
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                console.log("SERVICIO INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error);
                throw error;
            }
        };

        const errorLog = async (err) => {
            console.error("ERROR IN REQUEST:", {
                message: err.message,
                response: err.response,
                request: err.request,
                config: err.config
            });
        };

        return {
            formData,
            submitForm,
            showMessage,
            messageContent,
            messageType,
        };
    },
};
</script>

<style>
:root {
    --fk-max-width-input: none;
    --tab-bg: #f1f1f1;
    --tab-border: 1px solid #ccc;
    --tab-border-radius: 4px;
    --tab-padding: 10px 15px;
    --tab-color: #333;
    --tab-active-bg: #007bff;
    --tab-active-color: #fff;
}

label {
    text-align: left;
    margin-bottom: 8px;
    font-size: 20px;
}

.form-block {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 20px;
}

.formkit-wrapper {
    min-width: 800px;
    width: 100%;
    margin: 0 auto;
}

.formkit-steps {
    border: none !important;
    box-shadow: none !important;
}

/* Mejoras estéticas para las pestañas */
.formkit-tab {
    background-color: var(--tab-bg);
    border: var(--tab-border);
    border-radius: var(--tab-border-radius);
    padding: var(--tab-padding);
    color: var(--tab-color);
    margin-right: 10px;
    transition: background-color 0.3s ease, transform 0.3s ease;
    cursor: pointer;
}

.formkit-tab:hover {
    transform: scale(1.02);
    filter: brightness(1.05);
}

.formkit-tab-active {
    background-color: var(--tab-active-bg);
    color: var(--tab-active-color);
    border-color: var(--tab-active-bg);
    transform: scale(1.05);
}
</style>