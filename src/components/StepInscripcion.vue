<template>

  <!-- ID Condición Médica -->
  <FormKit type="select" :options="condicionesMedicas" name="condicionMedica" label="Condición Médica"
    validation="required" v-model="formData.idcondicionmedica" />

  <!-- ID Nacionalidad -->
  <FormKit type="select" :options="nacionalidades" name="idnacionalidad" label="Nacionalidad" validation="required"
    v-model="formData.idnacionalidad" />

  <!-- Estado Civil -->
  <FormKit type="select" :options="estadoCivil" name="estadocivil" label="Estado Civil" validation="required"
    v-model="formData.estadocivil" />

  <!-- Lugar de Procedencia -->
  <FormKit type="text" name="lugardeprocedencia" label="Lugar de Procedencia" validation="required"
    v-model="formData.lugardeprocedencia" />

  <!-- Dirección Actual -->
  <FormKit type="text" name="direccionActual" label="Dirección Actual" validation="required"
    v-model="formData.direccionactual" />

  <!-- Pertenece a Asociación -->
  <FormKit type="checkbox" name="perteneceaasociacion" label="Pertenece a Asociación"
    v-model="formData.perteneceaasociacion" />

  <!-- Nombre de la Asociación -->
  <FormKit type="text" label="Nombre de la Asociación" name="nombreasociacion" v-model="formData.nombreasociacion"
    :disabled="!formData.perteneceaasociacion" />

  <!-- Rol en la Asociación -->
  <FormKit type="text" name="rolenlaasociacion" label="Rol en la Asociación" v-model="formData.rolenlaasociacion"
    :disabled="!formData.perteneceaasociacion" />

  <!-- Tiene Trabajo -->
  <FormKit type="checkbox" name="tienetrabajo" label="Tiene Trabajo" v-model="formData.tienetrabajo" />

  <!-- Lugar de Trabajo -->
  <FormKit type="text" name="lugartrabajo" label="Lugar de Trabajo" v-model="formData.lugartrabajo"
    :disabled="!formData.tienetrabajo" />

  <!-- Puesto de Trabajo -->
  <FormKit type="text" name="puestotrabajo" label="Puesto de Trabajo" v-model="formData.puestotrabajo"
    :disabled="!formData.tienetrabajo" />

  <!-- Dirección de Trabajo -->
  <FormKit type="text" name="direcciontrabajo" label="Dirección de Trabajo" v-model="formData.direcciontrabajo"
    :disabled="!formData.tienetrabajo" />

  <!-- Teléfono de Trabajo -->
  <FormKit type="text" name="telefonotrabajo" label="Teléfono de Trabajo" v-model="formData.telefonotrabajo"
    :disabled="!formData.tienetrabajo" />

  <!-- Ingreso Mensual -->
  <FormKit type="number" name="ingresomensual" label="Ingreso Mensual" v-model="formData.ingresomensual" />

  <!-- Constitución Núcleo Familiar -->
  <FormKit type="text" name="constitucionnucleofamiliar" label="Constitución Núcleo Familiar"
    v-model="formData.constitucionnucleofamiliar" />

  <!-- Ocupación de Padres en Hogar -->
  <FormKit type="text" name="ocupaciondepadresenhogar" label="Ocupación de Padres en Hogar"
    v-model="formData.ocupaciondepadresenhogar" />

  <!-- Nivel Educativo de Padres -->
  <FormKit type="text" name="niveleducativopadres" label="Nivel Educativo de Padres"
    v-model="formData.niveleducativopadres" />

  <!-- Ingreso Mensual Familiar -->
  <FormKit type="number" name="ingresomensualfamiliar" label="Ingreso Mensual Familiar"
    v-model="formData.ingresomensualfamiliar" />
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';

const estadoCivil = ref([
  { label: "Casado", value: "casado" },
  { label: "Soltero", value: "soltero" },
  { label: "Divorciado", value: "divorciado" },
  { label: "Viudo", value: "viudo" },
]);

const nacionalidades = ref([]);
const condicionesMedicas = ref([]);
const userInfo = ref([]);


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

    userInfo.value = response.data
      .filter(user => user.role_id === 3)
      .map(user => ({
        label: user.email,
        value: user.idusuario,
      }));

  } catch (err) {
    error(err)
  }
};


const setNacionalidadesOptions = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/varios/nacionalidades`
    )

    nacionalidades.value = response.data.map((nacionalidad) => ({
      label: nacionalidad.nacionalidad,
      value: nacionalidad.idnacionalidad,
    }));

  } catch (error) {
    console.log(error);

  }
}

const setCondicionesMedicas = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/varios/condiciones`
    )

    condicionesMedicas.value = response.data.map((condicion) => ({
      label: condicion.condicionmedica,
      value: condicion.idcondicionmedica,
    }));

  } catch (error) {
    console.log(error);

  }
}

onMounted(() => {
  setNacionalidadesOptions(),
    setCondicionesMedicas(),
    retrieveUsers()
})

const props = defineProps({
  formData: {
    type: Object,
    required: true,
  },
});


</script>
