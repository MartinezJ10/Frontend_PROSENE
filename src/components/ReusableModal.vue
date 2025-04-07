<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="closeOnOverlayClick ? close() : null">
      <div class="modal-dialog" :class="[`modal-${size}`]">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="close" aria-label="Cerrar">×</button>
          </div>
          <div class="modal-body">
            <slot>
              <p>{{ message }}</p>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button 
                type="button" 
                class="btn btn-secondary" 
                v-if="showCancelButton" 
                @click="close"
              >
                {{ cancelButtonText }}
              </button>
              <button 
                type="button" 
                class="btn btn-primary" 
                @click="confirm"
              >
                {{ confirmButtonText }}
              </button>
            </slot>
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
    },
    confirmButtonText: {
      type: String,
      default: 'Aceptar'
    },
    cancelButtonText: {
      type: String,
      default: 'Cancelar'
    },
    showCancelButton: {
      type: Boolean,
      default: false
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'fullscreen'].includes(value)
    }
  },
  emits: ['close', 'confirm'],
  mounted() {
    if (this.show) {
      document.body.style.overflow = 'hidden';
    }
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeyDown);
  },
  watch: {
    show(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : '';
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm');
      this.close();
    },
    handleKeyDown(e) {
      if (e.key === 'Escape' && this.show && this.closeOnOverlayClick) {
        this.close();
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.modal-dialog {
  width: 100%;
  max-width: 500px;
  margin: auto;
}

.modal-small { max-width: 350px; }
.modal-medium { max-width: 500px; }
.modal-large { max-width: 700px; }
.modal-fullscreen { 
  max-width: 90%; 
  height: 90%;
}
.modal-fullscreen .modal-content {
  height: 100%;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
  text-align: center;
  border: none;
}

.btn-primary {
  background-color: #2c3e50;
  color: white;
}

.btn-primary:hover {
  background-color: #1a252f;
}

.btn-secondary {
  background-color: #e9ecef;
  color: #495057;
}

.btn-secondary:hover {
  background-color: #dee2e6;
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
  }
  
  .btn {
    flex: 1;
    min-width: 0;
  }
  
  .modal-footer {
    flex-wrap: wrap;
  }
}
</style>