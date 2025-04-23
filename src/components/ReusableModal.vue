<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="closeOnOverlayClick ? close() : null">
      <div class="modal-dialog" :class="[`modal-${size}`]" role="dialog" aria-labelledby="modal-title" aria-modal="true">
        <div class="modal-content">
          <div class="modal-header" :class="{ 'with-icon': showIcon }">
            <div class="title-container">
              <div v-if="showIcon" class="modal-icon" :class="iconType">
                <i :class="iconClass"></i>
              </div>
              <h5 class="modal-title" id="modal-title">{{ title }}</h5>
            </div>
            <button 
              type="button" 
              class="btn-close" 
              @click="close" 
              aria-label="Cerrar"
              ref="closeButton">×</button>
          </div>
          <div class="modal-body" :class="{ 'no-padding': noPadding }">
            <slot>
              <p>{{ message }}</p>
            </slot>
          </div>
          <div class="modal-footer" v-if="!hideFooter">
            <slot name="footer">
              <button 
                type="button" 
                class="btn btn-secondary" 
                v-if="showCancelButton" 
                @click="cancel"
                ref="cancelButton"
                :disabled="loading"
              >
                {{ cancelButtonText }}
              </button>
              <button 
                type="button" 
                class="btn btn-primary" 
                @click="confirm"
                :disabled="loading || disableConfirm"
                :class="{ 'loading': loading }"
                ref="confirmButton"
              >
                <span v-if="loading" class="spinner"></span>
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
    closeOnEsc: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large', 'fullscreen'].includes(value)
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    focusOnOpen: {
      type: String,
      default: 'confirm', // 'confirm', 'cancel', 'close', 'none'
      validator: (value) => ['confirm', 'cancel', 'close', 'none'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disableConfirm: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    iconType: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'warning', 'error', 'success', 'question'].includes(value)
    },
    preventBackdropScroll: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['close', 'confirm', 'cancel', 'before-close'],
  
  data() {
    return {
      prevActiveElement: null,
      scrollbarWidth: 0
    };
  },
  
  computed: {
    iconClass() {
      const classMap = {
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle',
        success: 'fa-check-circle',
        question: 'fa-question-circle'
      };
      return `fa ${classMap[this.iconType] || 'fa-info-circle'}`;
    }
  },
  
  mounted() {
    this.prevActiveElement = document.activeElement;
    
    if (this.show) {
      this.addBodyClass();
      this.$nextTick(this.focusElement);
    }
    
    document.addEventListener('keydown', this.handleKeyDown);
    this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  },
  
  beforeUnmount() {
    this.removeBodyClass();
    document.removeEventListener('keydown', this.handleKeyDown);
    
    // Restaurar el foco al elemento anterior
    if (this.prevActiveElement && typeof this.prevActiveElement.focus === 'function') {
      this.prevActiveElement.focus();
    }
  },
  
  watch: {
    show(newVal) {
      if (newVal) {
        this.addBodyClass();
        this.$nextTick(this.focusElement);
      } else {
        this.removeBodyClass();
      }
    }
  },
  
  methods: {
    addBodyClass() {
      if (this.preventBackdropScroll) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${this.scrollbarWidth}px`;
      }
    },
    
    removeBodyClass() {
      if (this.preventBackdropScroll) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    },
    
    focusElement() {
      if (this.focusOnOpen === 'none') return;
      
      let elementToFocus;
      if (this.focusOnOpen === 'confirm' && this.$refs.confirmButton) {
        elementToFocus = this.$refs.confirmButton;
      } else if (this.focusOnOpen === 'cancel' && this.$refs.cancelButton) {
        elementToFocus = this.$refs.cancelButton;
      } else if (this.focusOnOpen === 'close' && this.$refs.closeButton) {
        elementToFocus = this.$refs.closeButton;
      }
      
      if (elementToFocus) {
        elementToFocus.focus();
      }
    },
    
    close() {
      this.$emit('before-close');
      this.$emit('close');
    },
    
    confirm() {
      if (this.loading || this.disableConfirm) return;
      this.$emit('confirm');
      if (!this.loading) {
        this.close();
      }
    },
    
    cancel() {
      this.$emit('cancel');
      this.close();
    },
    
    handleKeyDown(e) {
      if (e.key === 'Escape' && this.show && this.closeOnEsc) {
        this.close();
      } else if (e.key === 'Tab' && this.show) {
        this.trapFocus(e);
      }
    },
    
    trapFocus(e) {
      // Obtener todos los elementos focusables dentro del modal
      const focusableElements = this.$el.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // Si el usuario presiona Shift+Tab y está en el primer elemento, mueve al último
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // Si el usuario presiona Tab y está en el último elemento, mueve al primero
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
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
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-header.with-icon {
  padding-left: 0.75rem;
}

.title-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.modal-icon.info {
  background-color: #2196F3;
}

.modal-icon.warning {
  background-color: #FFC107;
}

.modal-icon.error {
  background-color: #F44336;
}

.modal-icon.success {
  background-color: #4CAF50;
}

.modal-icon.question {
  background-color: #9C27B0;
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

.btn-close:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.2);
  border-radius: 4px;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.modal-body.no-padding {
  padding: 0;
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.25);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2c3e50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1a252f;
}

.btn-primary.loading {
  background-color: #34495e;
}

.btn-secondary {
  background-color: #e9ecef;
  color: #495057;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #dee2e6;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 576px) {
  .modal-dialog {
    width: 95%;
    margin: 10px;
  }
  
  .modal-small, .modal-medium, .modal-large {
    max-width: 100%;
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