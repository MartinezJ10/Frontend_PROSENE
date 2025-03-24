<template>
    <!-- role="main" define el contenido principal para NVDA -->
    <div class="container mt-4" role="main">
      <div v-if="enrollments && !error">
        <!-- Detalles Personales -->
        <div v-if="enrollments.formulario" class="card mb-4" role="region" aria-label="Detalles Personales">
          <div class="card-header bg-success text-white">
            <h5 class="card-title mb-0">Detalles Personales</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Estado Civil:</strong> {{ enrollments.formulario.estadocivil }}</p>
                <p><strong>Dirección Actual:</strong> {{ enrollments.formulario.direccionactual }}</p>
                <p><strong>Lugar de Procedencia:</strong> {{ enrollments.formulario.lugardeprocedencia }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Ingreso Mensual:</strong> {{ enrollments.formulario.ingresomensual }}</p>
                <p><strong>Ingreso Mensual Familiar:</strong> {{ enrollments.formulario.ingresomensualfamiliar }}</p>
                <p><strong>ID de Nacionalidad:</strong> {{ enrollments.formulario.idnacionalidad }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Características Educativas -->
        <div v-if="enrollments.caracteristicas" class="card mb-4" role="region" aria-label="Características Educativas">
          <div class="card-header bg-info text-white">
            <h5 class="card-title mb-0">Características Educativas</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Instituto Educativo:</strong> {{ enrollments.caracteristicas.institutoeducativo }}</p>
                <p><strong>Título de Nivel Medio:</strong> {{ enrollments.caracteristicas.titulonivelmedio }}</p>
                <p><strong>Fecha de Egresado:</strong> {{ enrollments.caracteristicas.fechaegresado }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Puntuación PAARM:</strong> {{ enrollments.caracteristicas.puntuacionpaarm }}</p>
                <p><strong>Puntuación PAARV:</strong> {{ enrollments.caracteristicas.puntuacionpaarv }}</p>
                <p><strong>Estudia en UNAH:</strong> {{ enrollments.caracteristicas.estudiaenunah ? 'Sí' : 'No' }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Comunicación -->
        <div v-if="enrollments.comunicacion" class="card mb-4" role="region" aria-label="Comunicación">
          <div class="card-header bg-warning text-dark">
            <h5 class="card-title mb-0">Comunicación</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Usa Braille:</strong> {{ enrollments.comunicacion.usabraille ? 'Sí' : 'No' }}</p>
                <p><strong>Usa Comunicación Gestual:</strong> {{ enrollments.comunicacion.usacomunicaciongestual ? 'Sí' : 'No' }}</p>
                <p><strong>Usa Comunicación Total:</strong> {{ enrollments.comunicacion.usacomunicaciontotal ? 'Sí' : 'No' }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Usa Calculadora:</strong> {{ enrollments.comunicacion.usodecalculadora ? 'Sí' : 'No' }}</p>
                <p><strong>Usa LSHO:</strong> {{ enrollments.comunicacion.usalsho ? 'Sí' : 'No' }}</p>
                <p><strong>Usa Lectura Labial:</strong> {{ enrollments.comunicacion.usalecturalabial ? 'Sí' : 'No' }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Deficiencia -->
        <div v-if="enrollments.deficiencia" class="card mb-4" role="region" aria-label="Deficiencia">
          <div class="card-header bg-danger text-white">
            <h5 class="card-title mb-0">Deficiencia</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Sordera:</strong> {{ enrollments.deficiencia.sordera }}</p>
                <p><strong>Hipoacusia:</strong> {{ enrollments.deficiencia.hipoacusia }}</p>
                <p><strong>Baja Visión:</strong> {{ enrollments.deficiencia.bajavision }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Movilidad Reducida (Miembros Inferiores):</strong> {{ enrollments.deficiencia.movilidadreducidamiembrosinferiores }}</p>
                <p><strong>Movilidad Reducida (Miembros Superiores):</strong> {{ enrollments.deficiencia.movilidadreducidamiembrossuperiores }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Discapacidad -->
        <div v-if="enrollments.discapacidad" class="card mb-4" role="region" aria-label="Discapacidad">
          <div class="card-header bg-secondary text-white">
            <h5 class="card-title mb-0">Discapacidad</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Dificultad para Leer:</strong> {{ enrollments.discapacidad.dificultadparaleer }}</p>
                <p><strong>Dificultad para Escribir:</strong> {{ enrollments.discapacidad.dificultadparaescribir }}</p>
                <p><strong>Dificultad para Memorizar:</strong> {{ enrollments.discapacidad.dificultadparamemorizarinformacion }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Dificultad para Matemáticas:</strong> {{ enrollments.discapacidad.dificultadparamatematicas }}</p>
                <p><strong>Dificultad para Conversaciones:</strong> {{ enrollments.discapacidad.dificultadparaconversaciones }}</p>
                <p><strong>Dificultad para la Vida Diaria:</strong> {{ enrollments.discapacidad.dificultadparavidadiaria }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Movilización -->
        <div v-if="enrollments.movilizacion" class="card mb-4" role="region" aria-label="Movilización">
          <div class="card-header bg-dark text-white">
            <h5 class="card-title mb-0">Movilización</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Dificultad para Salvar Desniveles:</strong> {{ enrollments.movilizacion.dificultadparasalvardesniveles }}</p>
                <p><strong>Dificultad para Viajar en Transporte Público:</strong> {{ enrollments.movilizacion.dificultadparaviajarentrasportepublico }}</p>
                <p><strong>Dificultad para Desplazarse a Distancias:</strong> {{ enrollments.movilizacion.dificultadparadesplazarsedistancias }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Dificultad para Orientarse en el Entorno:</strong> {{ enrollments.movilizacion.dificultadparaorientarseenentorno }}</p>
                <p><strong>Dificultad para Usar Gradas:</strong> {{ enrollments.movilizacion.dificultadparausargradas }}</p>
                <p><strong>Dificultad para Subir y Bajar del Vehículo:</strong> {{ enrollments.movilizacion.dificultadparasubirybajardelvehiculo }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Servicios -->
        <div v-if="enrollments.servicios" class="card mb-4" role="region" aria-label="Servicios">
          <div class="card-header bg-light text-dark">
            <h5 class="card-title mb-0">Servicios</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Apoyo en PAA:</strong> {{ enrollments.servicios.apoyoenpaa ? 'Sí' : 'No' }}</p>
                <p><strong>Orientación Vocacional:</strong> {{ enrollments.servicios.orientacionvocacional ? 'Sí' : 'No' }}</p>
                <p><strong>Orientación y Movilidad:</strong> {{ enrollments.servicios.orientacionymovilidad ? 'Sí' : 'No' }}</p>
              </div>
              <div class="col-md-6">
                <p><strong>Transcripción a Braille:</strong> {{ enrollments.servicios.transcripcionalbraille ? 'Sí' : 'No' }}</p>
                <p><strong>Intérpretes de Lengua de Señas:</strong> {{ enrollments.servicios.interpretesdelenguadesenias ? 'Sí' : 'No' }}</p>
                <p><strong>Otros Servicios:</strong> {{ enrollments.servicios.otrosservicios }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Mensaje si no hay inscripción -->
      <div v-else-if="noEnrollment" class="alert alert-warning" role="alert" aria-live="polite">
        <p>No hay una ficha de inscripción registrada para este usuario.</p>
        <p>
          <router-link to="/studentEnrollment" class="btn btn-primary" aria-label="Crear una nueva ficha de inscripción">
            Crear Ficha de Inscripción
          </router-link>
        </p>
      </div>
  
      <!-- Mensaje de carga -->
      <div v-else class="alert alert-info" role="status" aria-live="polite">
        Cargando datos de la ficha de inscripción...
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'EnrollmentDetails',
    setup() {
      const enrollments = ref(null);
      const noEnrollment = ref(false); // Track if no enrollment is found
      const route = useRoute();
  
      const getEnrollments = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/form/full/${route.params.idusuario}`
          );
  
          // Check if the response indicates no enrollment was found
          if (response.data.status_code === 404) {
            noEnrollment.value = true; // Set flag to show the "no enrollment" message
          } else {
            enrollments.value = response.data; // Set enrollment data
          }
        } catch (err) {
          console.error('Error fetching enrollment data:', err);
        }
      };
  
      onMounted(() => {
        getEnrollments();
      });
  
      return {
        enrollments,
        noEnrollment,
      };
    },
  };
  </script>
  
  <style scoped>
  .alert {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
  }
  
  .alert-warning {
    background-color: #fff3cd;
    border-color: #ffeeba;
    color: #856404;
  }
  
  .alert-info {
    background-color: #d1ecf1;
    border-color: #bee5eb;
    color: #0c5460;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
  }
  </style>