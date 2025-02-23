<template>
    <div class="form-block">
        <FormKit allow-incomplete use-local-storage type="multi-step" tab-style="progress" hide-navigation="true">

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

import axios from 'axios';

import { ref } from 'vue';

export default {
    name: "CreateStudent",
    components: {
        StepInscripcion,
        StepCaracteristicas,
        StepComunicacion,
        StepDeficiencia,
        StepDiscapacidad,
        StepMovilizacion,
        StepServicio
    },
    setup() {
        const formularioId = ref();

        const formData = ref({
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

        // Submit handler
        const submitForm = async () => {
            try {
                console.log('Form Data:', formData.value);
                await submitFormulario();

                await submitEducacion();
                await submitComunicacion();
                await submitDeficiencia();
                await submitDiscapacidad();
                await submitMovilizacion();
                await submitServicio();
                
                console.log("EVERYTHING UPLOADED");
                
            } catch (error) {
                errorLog(error)
            }
        };

        const submitFormulario = async () => {
            const formulario = { ...formData.value.inscripcion };

            // Handle fields dependent on perteneceaasociacion
            if (!formulario.perteneceaasociacion) {
                formulario.nombreasociacion = null;
                formulario.rolenlaasociacion = null;
            }

            // Handle fields dependent on tienetrabajo
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
                        idusuario: localStorage.getItem("user_id"),
                        ...formulario
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                        }
                    }
                );

                formularioId.value = response.data.idformulario
                localStorage.setItem("id_formulario", formularioId.value)
                console.log("FORMULARIO INSERTADO CON EXITO")

            } catch (error) {
                errorLog(error)
            }
        }

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
                errorLog(error)
            }
        }

        const submitComunicacion = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const comunicacion = { ...formData.value.comunicacion }

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

                console.log("EDUCACION INSERTADO CON EXITO");

            } catch (error) {
                errorLog(error)
            }
        }

        const submitDeficiencia = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const deficiencia = { ...formData.value.deficiencia }

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
                errorLog(error)
            }
        }

        const submitDiscapacidad = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const discapacidad = { ...formData.value.discapacidad }

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
                errorLog(error)
            }
        }

        const submitMovilizacion = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const movilizacion = { ...formData.value.movilizacion }

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
                errorLog(error)
            }
        }


        const submitServicio = async () => {
            const formulario_id = localStorage.getItem("id_formulario");
            const servicio = { ...formData.value.servicio }

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
                errorLog(error)
            }
        }

        const errorLog = async (err) => {
            console.error("ERROR IN REQUEST:", {
                message: err.message,
                response: err.response, // Full response from the server
                request: err.request,   // Request details
                config: err.config      // Axios request configuration
            });
        }

        return {
            formData,
            submitForm,
        }
    },
}
</script>


<style>
:root {
    --fk-max-width-input: none;
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
</style>