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

        const formData = ref({
            inscripcion: {},
            educacion: {},
            comunicacion: {},
            deficiencia: {},
            discapacidad: {},
            movilizacion: {},
            servicio: {},
        });

        // Submit handler
        const submitForm = async () => {
            try {
                console.log('Form Data:', formData.value);
                submitFormulario()
                // Send formData.value to your backend or API
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('An error occurred while submitting the form.');
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
                console.log("FORMULARIO INSERTADO");
                console.log(response.data);

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