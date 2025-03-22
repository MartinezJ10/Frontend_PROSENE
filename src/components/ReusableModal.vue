<template>
    <transition name="modal-fade">
      <div v-if="show" class="modal-overlay">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <!-- Encabezado -->
            <div class="modal-header header-unah">
              <h5 class="modal-title">{{ title }}</h5>
              <button type="button" class="btn-close" @click="close" aria-label="Cerrar">
                &times;
              </button>
            </div>
            <!-- Cuerpo del modal -->
            <div class="modal-body">
              <p>{{ message }}</p>
            </div>
            <!-- Pie de página -->
            <div class="modal-footer">
              <button type="button" class="btn btn-primary btn-unah" @click="close">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'ReusableModal',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: 'Información'
      },
      message: {
        type: String,
        default: ''
      }
    },
    emits: ['close'],
    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  /* Fondo oscuro al abrir el modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
  }
  
  /* Transición suave de aparición y desaparición */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  
  /* Ajuste del contenedor del modal */
  .modal-dialog {
    width: 90%;        /* Ocupa el 90% del ancho en pantallas pequeñas */
    max-width: 600px;  /* Pero no excede los 600px en pantallas grandes */
    margin: auto;
  }
  
  /* Contenedor principal del modal */
  .modal-content {
    background-color: #ffffff;
    border-radius: 1rem; /* Bordes más redondeados */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Sombra más notoria */
    overflow: hidden;
    border: none; /* Sin borde grueso */
  }
  
  /* Encabezado del modal */
  .modal-header {
    padding: 1rem 1.5rem;
  }
  .header-unah {
    background-color: var(--primary-color); /* Azul UNAH */
    color: var(--background-color);            /* Texto blanco */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* Botón de cerrar (X) */
  .btn-close {
    background: none;
    border: none;
    color: var(--brat);;
    font-size: 1.5rem; /* Tamaño ligeramente menor para mayor sutileza */
    cursor: pointer;
    line-height: 1;
  }
  .btn-close:hover {
    color: var(--brat) !important;
  }
  
  /* Cuerpo del modal */
  .modal-body {
    padding: 1rem 1.5rem;
    color: #333;
    font-size: 1rem;
    line-height: 1.5;
  }
  
  /* Pie de página del modal */
  .modal-footer {
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e0e0e0; /* Barra divisoria gris más clara */
  }
  
  /* Botón de acción principal */
  .btn-unah {
    background-color: var(--modal-btn-bg-color); /* Amarillo UNAH */
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  /* MEDIA QUERIES: Ajustes para pantallas pequeñas */
  @media (max-width: 576px) {
    /* Ajustar el padding interno para ahorrar espacio en móviles */
    .modal-header,
    .modal-body,
    .modal-footer {
      padding: 0.8rem 1rem;
    }
  
    /* Disminuir tamaño de la 'X' para adaptarse mejor */
    .btn-close {
      font-size: 1.2rem;
    }
  
    /* Controlar altura máxima y permitir scroll si el contenido es muy largo */
    .modal-content {
      max-height: 90vh;
    }
    .modal-body {
      overflow-y: auto;
    }
  }
  </style>
  