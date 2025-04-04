<template>
  <!-- Hipoacusia -->
  <FormKit
    type="text"
    validation="required"
    name="hipoacusia"
    label="Hipoacusia"
    v-model="formData.hipoacusia"
    aria-labelledby="label-hipoacusia" 
  /> <!-- Asocia la etiqueta con el campo para accesibilidad -->
  <span id="label-hipoacusia" hidden>Hipoacusia</span> <!-- Texto oculto para lectores de pantalla -->

  <!-- Sordera -->
  <FormKit
    type="text"
    validation="required"
    name="sordera"
    label="Sordera"
    v-model="formData.sordera"
    aria-labelledby="label-sordera"
  />
  <span id="label-sordera" hidden>Sordera</span>

  <!-- Baja Visión -->
  <FormKit
    type="text"
    validation="required"
    name="bajavision"
    label="Baja Visión"
    v-model="formData.bajavision"
    aria-labelledby="label-bajavision"
  />
  <span id="label-bajavision" hidden>Baja Visión</span>

  <!-- Movilidad Reducida Miembros Inferiores -->
  <FormKit
    type="text"
    validation="required"
    name="movilidadreducidamiembrosinferiores"
    label="Movilidad Reducida Miembros Inferiores"
    v-model="formData.movilidadreducidamiembrosinferiores"
    aria-labelledby="label-movilidadreducidamiembrosinferiores"
  />
  <span id="label-movilidadreducidamiembrosinferiores" hidden>Movilidad Reducida Miembros Inferiores</span>

  <!-- Movilidad Reducida Miembros Superiores -->
  <FormKit
    type="text"
    validation="required"
    name="movilidadreducidamiembrossuperiores"
    label="Movilidad Reducida Miembros Superiores"
    v-model="formData.movilidadreducidamiembrossuperiores"
    aria-labelledby="label-movilidadreducidamiembrossuperiores"
  />
  <span id="label-movilidadreducidamiembrossuperiores" hidden>Movilidad Reducida Miembros Superiores</span>
</template>

<script setup>
import { ref, defineProps } from 'vue';

defineProps({
  formData: {
    type: Object,
    required: true,
  },
});
</script>
