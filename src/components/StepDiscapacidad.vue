<template>

    <!-- Dificultad para Leer -->
    <FormKit
      type="select"
      label="Dificultad para Leer"
      name="dificultadparaleer"
      :options="opcionesDificultad"
      v-model="formData.dificultadparaleer"
    />

    <!-- Dificultad para Escribir -->
    <FormKit
      type="select"
      name="dificultadparaescribir"
      label="Dificultad para Escribir"
      :options="opcionesDificultad"
      v-model="formData.dificultadparaescribir"
    />

    <!-- Dificultad para Entender y Seguir Órdenes -->
    <FormKit
      type="select"
      name="dificultadparaentenderyseguirordenes"
      label="Dificultad para Entender y Seguir Órdenes"
      :options="opcionesDificultad"
      v-model="formData.dificultadparaentenderyseguirordenes"
    />

    <!-- Dificultad para Mantener Atención -->
    <FormKit
      type="select"
      name="dificultadparamanteneratencion"
      label="Dificultad para Mantener Atención"
      :options="opcionesDificultad"
      v-model="formData.dificultadparamanteneratencion"
    />

    <!-- Dificultad para Memorizar Información -->
    <FormKit
      type="select"
      name="dificultadparamemorizarinformacion"
      label="Dificultad para Memorizar Información"
      :options="opcionesDificultad"
      v-model="formData.dificultadparamemorizarinformacion"
    />

    <!-- Dificultad para Conversaciones -->
    <FormKit
      type="select"
      name="dificultadparaconversaciones"
      label="Dificultad para Conversaciones"
      :options="opcionesDificultad"
      v-model="formData.dificultadparaconversaciones"
    />

    <!-- Dificultad para Relacionarse con Otros -->
    <FormKit
      type="select"
      name="dificultadpararelacionarseconotros"
      label="Dificultad para Relacionarse con Otros"
      :options="opcionesDificultad"
      v-model="formData.dificultadpararelacionarseconotros"
    />

    <!-- Dificultad para Matemáticas -->
    <FormKit
      type="select"
      name="dificultadparamatematicas"
      label="Dificultad para Matemáticas"
      :options="opcionesDificultad"
      v-model="formData.dificultadparamatematicas"
    />

    <!-- Dificultad para Vida Diaria -->
    <FormKit
      type="select"
      name="dificultadparavidadiaria"
      label="Dificultad para Vida Diaria"
      :options="opcionesDificultad"
      v-model="formData.dificultadparavidadiaria"
    />
</template>

<script setup>
import { ref,defineProps } from 'vue';

// Opciones para los select
const opcionesDificultad = [
  { label: "Mucho", value: "mucho" },
  { label: "Moderado", value: "moderado" },
  { label: "Poco", value: "poco" },
  { label: "Nada", value: "nada" },
];

defineProps({
  formData: {
    type: Object,
    required: true,
  },
});
</script>