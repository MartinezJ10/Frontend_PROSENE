<template>
  <!-- Apoyo en Proceso de Admisión -->
  <FormKit
    type="checkbox"
    label="Apoyo en Proceso de Admisión"
    name="apoyoenprocesodeadmision"
    v-model="formData.apoyoenprocesodeadmision"
    aria-labelledby="apoyoProcesoAdmisionLabel"
  />
  <label id="apoyoProcesoAdmisionLabel" class="sr-only">Apoyo en Proceso de Admisión</label>

  <!-- Apoyo en PAA -->
  <FormKit
    type="checkbox"
    name="apoyoenpaa"
    label="Apoyo en PAA"
    v-model="formData.apoyoenpaa"
    aria-labelledby="apoyoPaaLabel"
  />
  <label id="apoyoPaaLabel" class="sr-only">Apoyo en PAA</label>

  <!-- Orientación General -->
  <FormKit
    type="checkbox"
    name="orientaciongeneral"
    label="Orientación General"
    v-model="formData.orientaciongeneral"
    aria-labelledby="orientacionGeneralLabel"
  />
  <label id="orientacionGeneralLabel" class="sr-only">Orientación General</label>

  <!-- Orientación Vocacional -->
  <FormKit
    type="checkbox"
    name="orientacionvocacional"
    label="Orientación Vocacional"
    v-model="formData.orientacionvocacional"
    aria-labelledby="orientacionVocacionalLabel"
  />
  <label id="orientacionVocacionalLabel" class="sr-only">Orientación Vocacional</label>

  <!-- Coordinación con Profesores -->
  <FormKit
    type="checkbox"
    name="coordinacionconprofesores"
    label="Coordinación con Profesores"
    v-model="formData.coordinacionconprofesores"
    aria-labelledby="coordinacionProfesoresLabel"
  />
  <label id="coordinacionProfesoresLabel" class="sr-only">Coordinación con Profesores</label>

  <!-- Orientación y Movilidad -->
  <FormKit
    type="checkbox"
    name="orientacionymovilidad"
    label="Orientación y Movilidad"
    v-model="formData.orientacionymovilidad"
    aria-labelledby="orientacionMovilidadLabel"
  />
  <label id="orientacionMovilidadLabel" class="sr-only">Orientación y Movilidad</label>

  <!-- Transcripción a Braille -->
  <FormKit
    type="checkbox"
    name="transcripcionalbraille"
    label="Transcripción a Braille"
    v-model="formData.transcripcionalbraille"
    aria-labelledby="transcripcionBrailleLabel"
  />
  <label id="transcripcionBrailleLabel" class="sr-only">Transcripción a Braille</label>

  <!-- Lectura y Grabación de Texto -->
  <FormKit
    type="checkbox"
    name="lecturaygrabaciondetexto"
    label="Lectura y Grabación de Texto"
    v-model="formData.lecturaygrabaciondetexto"
    aria-labelledby="lecturaGrabacionTextoLabel"
  />
  <label id="lecturaGrabacionTextoLabel" class="sr-only">Lectura y Grabación de Texto</label>

  <!-- Tutorial de Materia -->
  <FormKit
    type="checkbox"
    name="tutorialdemateria"
    label="Tutorial de Materia"
    v-model="formData.tutorialdemateria"
    aria-labelledby="tutorialMateriaLabel"
  />
  <label id="tutorialMateriaLabel" class="sr-only">Tutorial de Materia</label>

  <!-- Servicio de Notarios -->
  <FormKit
    type="checkbox"
    name="serviciodenotarios"
    label="Servicio de Notarios"
    v-model="formData.serviciodenotarios"
    aria-labelledby="servicioNotariosLabel"
  />
  <label id="servicioNotariosLabel" class="sr-only">Servicio de Notarios</label>

  <!-- Intérpretes de Lengua de Señas -->
  <FormKit
    type="checkbox"
    name="interpretesdelenguadesenias"
    label="Intérpretes de Lengua de Señas"
    v-model="formData.interpretesdelenguadesenias"
    aria-labelledby="intérpretesLenguaSeñasLabel"
  />
  <label id="intérpretesLenguaSeñasLabel" class="sr-only">Intérpretes de Lengua de Señas</label>

  <!-- Adecuación de Acceso al Entorno -->
  <FormKit
    type="checkbox"
    name="adecuaciondeaccesoalentorno"
    label="Adecuación de Acceso al Entorno"
    v-model="formData.adecuaciondeaccesoalentorno"
    aria-labelledby="adecuacionAccesoEntornoLabel"
  />
  <label id="adecuacionAccesoEntornoLabel" class="sr-only">Adecuación de Acceso al Entorno</label>

  <!-- Otros Servicios -->
  <FormKit
    type="text"
    name="otrosservicios"
    validation="required"
    label="Otros Servicios"
    v-model="formData.otrosservicios"
    aria-labelledby="otrosServiciosLabel"
  />
  <label id="otrosServiciosLabel" class="sr-only">Otros Servicios</label>

  <!-- Barreras para Estudiar en UNAH -->
  <FormKit
    type="text"
    validation="required"
    name="barrerasparaestudiarenunah"
    label="Barreras para Estudiar en UNAH"
    v-model="formData.barrerasparaestudiarenunah"
    aria-labelledby="barrerasEstudiarUNAHLabel"
  />
  <label id="barrerasEstudiarUNAHLabel" class="sr-only">Barreras para Estudiar en UNAH</label>

  <FormKit @click="submitForm" type="submit" label="Submit" />
</template>

<script setup>
import { ref, defineProps } from 'vue';

defineProps({
  formData: {
    type: Object,
    required: true,
  },
  submitForm: {
    type: Function,
    required: true,
  },
});
</script>
