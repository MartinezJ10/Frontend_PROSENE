<template>
      <!-- ID Usuario -->
      <FormKit
        type="number"
        label="ID Usuario"
        validation="required"
        v-model="formData.idusuario"
      />
  
      <!-- ID Condición Médica -->
      <FormKit
        type="number"
        name="condicionMedica"
        label="ID Condición Médica"
        validation="required"
        v-model="formData.idcondicionmedica"
      />
  
      <!-- ID Nacionalidad -->
      <FormKit
        type="number"
        label="ID Nacionalidad"
        validation="required"
        v-model="formData.idnacionalidad"
      />
  
      <!-- Estado Civil -->
      <FormKit
        type="text"
        label="Estado Civil"
        validation="required"
        v-model="formData.estadocivil"
      />
  
      <!-- Lugar de Procedencia -->
      <FormKit
        type="text"
        label="Lugar de Procedencia"
        validation="required"
        v-model="formData.lugardeprocedencia"
      />
  
      <!-- Dirección Actual -->
      <FormKit
        type="text"
        name="direccionActual"
        label="Dirección Actual"
        validation="required"
        v-model="formData.direccionactual"
      />
  
      <!-- Pertenece a Asociación -->
      <FormKit
        type="checkbox"
        label="Pertenece a Asociación"
        v-model="formData.perteneceaasociacion"
      />
  
      <!-- Nombre de la Asociación -->
      <FormKit
        type="text"
        label="Nombre de la Asociación"
        v-model="formData.nombreasociacion"
        :disabled="!formData.perteneceaasociacion"
      />
  
      <!-- Rol en la Asociación -->
      <FormKit
        type="text"
        label="Rol en la Asociación"
        v-model="formData.rolenlaasociacion"
        :disabled="!formData.perteneceaasociacion"
      />
  
      <!-- Tiene Trabajo -->
      <FormKit
        type="checkbox"
        label="Tiene Trabajo"
        v-model="formData.tienetrabajo"
      />
  
      <!-- Lugar de Trabajo -->
      <FormKit
        type="text"
        label="Lugar de Trabajo"
        v-model="formData.lugartrabajo"
        :disabled="!formData.tienetrabajo"
      />
  
      <!-- Puesto de Trabajo -->
      <FormKit
        type="text"
        label="Puesto de Trabajo"
        v-model="formData.puestotrabajo"
        :disabled="!formData.tienetrabajo"
      />
  
      <!-- Dirección de Trabajo -->
      <FormKit
        type="text"
        label="Dirección de Trabajo"
        v-model="formData.direcciontrabajo"
        :disabled="!formData.tienetrabajo"
      />
  
      <!-- Teléfono de Trabajo -->
      <FormKit
        type="text"
        label="Teléfono de Trabajo"
        v-model="formData.telefonotrabajo"
        :disabled="!formData.tienetrabajo"
      />
  
      <!-- Ingreso Mensual -->
      <FormKit
        type="number"
        label="Ingreso Mensual"
        v-model="formData.ingresomensual"
      />
  
      <!-- Constitución Núcleo Familiar -->
      <FormKit
        type="text"
        label="Constitución Núcleo Familiar"
        v-model="formData.constitucionnucleofamiliar"
      />
  
      <!-- Ocupación de Padres en Hogar -->
      <FormKit
        type="text"
        label="Ocupación de Padres en Hogar"
        v-model="formData.ocupaciondepadresenhogar"
      />
  
      <!-- Nivel Educativo de Padres -->
      <FormKit
        type="text"
        label="Nivel Educativo de Padres"
        v-model="formData.niveleducativopadres"
      />
  
      <!-- Ingreso Mensual Familiar -->
      <FormKit
        type="number"
        label="Ingreso Mensual Familiar"
        v-model="formData.ingresomensualfamiliar"
      />
  </template>
  
  <script setup>
  import { ref,defineProps } from 'vue';
  
  
  defineProps({
  formData: {
    type: Object,
    required: true,
  },
});

  </script>