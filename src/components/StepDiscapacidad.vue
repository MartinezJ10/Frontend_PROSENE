<template>
  <!-- Dificultad para Leer -->
  <FormKit
    type="select"
    label="Dificultad para Leer"
    name="dificultadparaleer"
    :options="opcionesDificultad"
    v-model="formData.dificultadparaleer"
    aria-labelledby="label-dificultadparaleer" 
  />
  <span id="label-dificultadparaleer" hidden>Dificultad para Leer</span> <!-- Texto oculto para lectores de pantalla -->

  <!-- Dificultad para Escribir -->
  <FormKit
    type="select"
    name="dificultadparaescribir"
    label="Dificultad para Escribir"
    :options="opcionesDificultad"
    v-model="formData.dificultadparaescribir"
    aria-labelledby="label-dificultadparaescribir"
  />
  <span id="label-dificultadparaescribir" hidden>Dificultad para Escribir</span>

  <!-- Dificultad para Entender y Seguir Órdenes -->
  <FormKit
    type="select"
    name="dificultadparaentenderyseguirordenes"
    label="Dificultad para Entender y Seguir Órdenes"
    :options="opcionesDificultad"
    v-model="formData.dificultadparaentenderyseguirordenes"
    aria-labelledby="label-dificultadparaentenderyseguirordenes"
  />
  <span id="label-dificultadparaentenderyseguirordenes" hidden>Dificultad para Entender y Seguir Órdenes</span>

  <!-- Dificultad para Mantener Atención -->
  <FormKit
    type="select"
    name="dificultadparamanteneratencion"
    label="Dificultad para Mantener Atención"
    :options="opcionesDificultad"
    v-model="formData.dificultadparamanteneratencion"
    aria-labelledby="label-dificultadparamanteneratencion"
  />
  <span id="label-dificultadparamanteneratencion" hidden>Dificultad para Mantener Atención</span>

  <!-- Dificultad para Memorizar Información -->
  <FormKit
    type="select"
    name="dificultadparamemorizarinformacion"
    label="Dificultad para Memorizar Información"
    :options="opcionesDificultad"
    v-model="formData.dificultadparamemorizarinformacion"
    aria-labelledby="label-dificultadparamemorizarinformacion"
  />
  <span id="label-dificultadparamemorizarinformacion" hidden>Dificultad para Memorizar Información</span>

  <!-- Dificultad para Conversaciones -->
  <FormKit
    type="select"
    name="dificultadparaconversaciones"
    label="Dificultad para Conversaciones"
    :options="opcionesDificultad"
    v-model="formData.dificultadparaconversaciones"
    aria-labelledby="label-dificultadparaconversaciones"
  />
  <span id="label-dificultadparaconversaciones" hidden>Dificultad para Conversaciones</span>

  <!-- Dificultad para Relacionarse con Otros -->
  <FormKit
    type="select"
    name="dificultadpararelacionarseconotros"
    label="Dificultad para Relacionarse con Otros"
    :options="opcionesDificultad"
    v-model="formData.dificultadpararelacionarseconotros"
    aria-labelledby="label-dificultadpararelacionarseconotros"
  />
  <span id="label-dificultadpararelacionarseconotros" hidden>Dificultad para Relacionarse con Otros</span>

  <!-- Dificultad para Matemáticas -->
  <FormKit
    type="select"
    name="dificultadparamatematicas"
    label="Dificultad para Matemáticas"
    :options="opcionesDificultad"
    v-model="formData.dificultadparamatematicas"
    aria-labelledby="label-dificultadparamatematicas"
  />
  <span id="label-dificultadparamatematicas" hidden>Dificultad para Matemáticas</span>

  <!-- Dificultad para Vida Diaria -->
  <FormKit
    type="select"
    name="dificultadparavidadiaria"
    label="Dificultad para Vida Diaria"
    :options="opcionesDificultad"
    v-model="formData.dificultadparavidadiaria"
    aria-labelledby="label-dificultadparavidadiaria"
  />
  <span id="label-dificultadparavidadiaria" hidden>Dificultad para Vida Diaria</span>
</template>

<script setup>
import { ref, defineProps } from 'vue';

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
