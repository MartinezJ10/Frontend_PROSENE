<template>
  <div>
    <h3 class="text-center header-title">{{ title }}</h3>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-grid">
        <div 
          v-for="(field, index) in formFields" 
          :key="index" 
          class="form-field"
          :class="{
            'full-width': field.type === 'text-area',
            'has-error': errors[field.name]?.length > 0
          }"
        >
          <label :for="field.id || field.name" class="form-label">
            {{ field.label }}
            <span v-if="field.required" class="required-mark">*</span>
          </label>
          
          <!-- Campo de contraseña con toggle -->
          <div v-if="field.type === 'password'" class="input-group">
            <input
              :type="showPasswordState[field.name] ? 'text' : 'password'"
              class="form-control"
              :id="field.id || field.name"
              v-model="formData[field.name]"
              :class="{
                'is-invalid': errors[field.name]?.length > 0, 
                'is-valid': formData[field.name] && errors[field.name]?.length === 0
              }"
              :placeholder="field.placeholder"
              @blur="validateField(field)"
              :required="field.required !== false"
              autocomplete="new-password"
              :aria-describedby="field.name + '-feedback'"
              :aria-invalid="errors[field.name]?.length > 0"
            />
            <button type="button" class="input-group-text" @click="togglePasswordVisibility(field)" :aria-label="showPasswordState[field.name] ? 'Ocultar contraseña' : 'Mostrar contraseña'">
              <i :class="showPasswordState[field.name] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <!-- Campos de texto/email -->
          <input
            v-else-if="field.type === 'text' || field.type === 'email'"
            :type="field.type"
            class="form-control"
            :id="field.id || field.name"
            v-model="formData[field.name]"
            :class="{
              'is-invalid': errors[field.name]?.length > 0, 
              'is-valid': formData[field.name] && errors[field.name]?.length === 0
            }"
            :placeholder="field.placeholder"
            @blur="validateField(field)"
            :required="field.required !== false"
            :autocomplete="field.autocomplete || 'off'"
            :aria-describedby="field.name + '-feedback'"
            :aria-invalid="errors[field.name]?.length > 0"
          />

          <!-- Select con ícono de flecha -->
          <div v-else-if="field.type === 'select'" class="dropdown-container">
            <select
              v-model="formData[field.name]"
              :id="field.id || field.name"
              class="form-control custom-select"
              @blur="validateField(field)"
              :required="field.required !== false"
              :aria-describedby="field.name + '-feedback'"
              :aria-invalid="errors[field.name]?.length > 0"
            >
              <option value="" disabled selected>{{ field.placeholder || 'Seleccione una opción' }}</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <!-- Ícono de flecha -->
            <span class="dropdown-arrow">
              <i class="bi bi-caret-down-fill"></i>
            </span>
          </div>

          <!-- Campo de textarea -->
          <textarea 
            v-else-if="field.type === 'text-area'"
            class="form-control text-area-field"
            :id="field.id || field.name"
            v-model="formData[field.name]"
            :rows="field.rows || 8"
            :class="{
              'is-invalid': errors[field.name]?.length > 0, 
              'is-valid': formData[field.name] && errors[field.name]?.length === 0
            }"
            :placeholder="field.placeholder"
            @blur="validateField(field)"
            :required="field.required !== false"
            :aria-describedby="field.name + '-feedback'"
            :aria-invalid="errors[field.name]?.length > 0"
          ></textarea>

          <!-- Campo de fecha -->
          <div v-else-if="field.type === 'date'" class="date-field-container">
            <input
              type="date"
              class="form-control date-field"
              :id="field.id || field.name"
              v-model="formData[field.name]"
              :class="{
                'is-invalid': errors[field.name]?.length > 0, 
                'is-valid': formData[field.name] && errors[field.name]?.length === 0
              }"
              @blur="validateField(field)"
              :required="field.required !== false"
              :min="field.min"
              :max="field.max"
              :aria-describedby="field.name + '-feedback'"
              :aria-invalid="errors[field.name]?.length > 0"
            />
            <i class="bi bi-calendar date-icon"></i>
          </div>

          <!-- Mensajes de error -->
          <div v-if="errors[field.name]?.length" :id="field.name + '-feedback'" class="invalid-feedback d-block" role="alert">
            <div v-for="(error, idx) in errors[field.name]" :key="idx">
              <i class="bi bi-exclamation-circle"></i> {{ error }}
            </div>
          </div>

          <!-- Texto de ayuda -->
          <small v-if="field.helpText && !errors[field.name]?.length" class="form-text text-muted">
            {{ field.helpText }}
          </small>
        </div>
      </div>

      <div class="form-actions">
        <button v-if="showCancelButton" type="button" class="btn btn-secondary" @click="handleCancel">
          {{ cancelButtonText }}
        </button>
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ isSubmitting ? loadingText : submitButtonText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue';

const props = defineProps({
  title: String,
  fields: {
    type: Array,
    default: () => [] 
  },
  submitButtonText: {
    type: String,
    default: 'Enviar'
  },
  cancelButtonText: {
    type: String,
    default: 'Cancelar'
  },
  loadingText: {
    type: String,
    default: 'Enviando...'
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  onSubmit: {
    type: Function,
    required: true
  },
  onCancel: {
    type: Function,
    default: () => {}
  }
});

const emit = defineEmits(['submit', 'cancel', 'validation-error']);

const formData = ref({});
const errors = ref({});
const showPasswordState = reactive({});
const isSubmitting = ref(false);
const hasSubmitted = ref(false);

const initializeFormData = () => {
  formData.value = props.fields.reduce((acc, field) => {
    acc[field.name] = field.value !== undefined ? field.value : '';
    if (field.type === 'password') {
      showPasswordState[field.name] = false;
    }
    return acc;
  }, {});
  
  errors.value = props.fields.reduce((acc, field) => {
    acc[field.name] = [];
    return acc;
  }, {});
};

initializeFormData();

watch(
  () => props.fields,
  () => {
    initializeFormData();
  },
  { deep: true }
);

const togglePasswordVisibility = (field) => {
  showPasswordState[field.name] = !showPasswordState[field.name];
};

// Validaciones
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateRequiredField = (field) => {
  const value = formData.value[field.name];
  if (field.required !== false && (!value || (typeof value === 'string' && value.trim() === ''))) {
    errors.value[field.name] = [`${field.label} es requerido`];
    return false;
  } else {
    errors.value[field.name] = [];
    return true;
  }
};

const validateField = (field) => {
  const isRequired = validateRequiredField(field);
  if (!isRequired) return false;
  
  const value = formData.value[field.name];
  let isValid = true;

  if (!value && field.required === false) {
    // Si el campo no es requerido y está vacío, no necesita más validación
    return true;
  }

  if (field.type === 'email' && value && !validateEmail(value)) {
    errors.value[field.name].push('La dirección de email es inválida');
    isValid = false;
  } 
  else if (field.type === 'password' && value) {
    if (field.minLength && value.length < field.minLength) {
      errors.value[field.name].push(`La contraseña debe tener al menos ${field.minLength} caracteres.`);
      isValid = false;
    } else if (!field.minLength && value.length < 6) {
      errors.value[field.name].push('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    }
    
    if (!/(?=.*[A-Z])/.test(value)) {
      errors.value[field.name].push('Debe incluir al menos una letra mayúscula.');
      isValid = false;
    }
    
    if (!/(?=.*\d)/.test(value)) {
      errors.value[field.name].push('Debe incluir al menos un número.');
      isValid = false;
    }
    
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
      errors.value[field.name].push('Debe incluir al menos un carácter especial.');
      isValid = false;
    }
  }
  
  // Validaciones personalizadas
  if (field.validator && typeof field.validator === 'function') {
    const customValidation = field.validator(value, formData.value);
    if (customValidation !== true) {
      errors.value[field.name].push(customValidation);
      isValid = false;
    }
  }

  // Validar match con otro campo (como confirmación de contraseña)
  if (field.match && formData.value[field.match] !== value) {
    errors.value[field.name].push(`${field.label} no coincide.`);
    isValid = false;
  }

  return isValid;
};

const validateAllFields = () => {
  let valid = true;
  props.fields.forEach(field => {
    if (!validateField(field)) {
      valid = false;
    }
  });
  return valid;
};

const handleSubmit = async () => {
  hasSubmitted.value = true;
  const isValid = validateAllFields();

  if (!isValid) {
    // Emitir evento de error de validación
    emit('validation-error', errors.value);
    // Scroll al primer error
    const firstErrorField = document.querySelector('.has-error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    isSubmitting.value = true;
    await props.onSubmit(formData.value);
    emit('submit', formData.value);
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  props.onCancel();
  emit('cancel');
};

const formFields = computed(() => {
  return props.fields.map(field => {
    if (!(field.name in formData.value)) {
      formData.value[field.name] = '';
    }
    return { ...field };
  });
});
</script>

<style scoped>
.form-container {
  background: #fff;
  padding: 25px;
  border-radius: 10px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.header-title {
  font-size: 1.8rem;
  color: #003366;
  font-weight: 700;
  margin-bottom: 25px;
  text-align: center;
}

/* Disposición en rejilla */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  position: relative;
  transition: all 0.3s ease;
}

/* Clase para campos que deben ocupar todo el ancho */
.full-width {
  grid-column: 1 / -1;
}

.has-error {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
  40%, 60% { transform: translate3d(3px, 0, 0); }
}

.form-label {
  font-weight: 600;
  color: #003366;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.required-mark {
  color: #dc3545;
  margin-left: 4px;
}

.form-control {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 15px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-control:hover:not(:disabled) {
  border-color: #a0a0a0;
}

/* Efecto focus */
.form-control:focus {
  border-color: #003366;
  box-shadow: 0 0 8px rgba(0, 51, 102, 0.2);
  outline: none;
}

/* Icono de contraseña */
.input-group {
  display: flex;
  width: 100%;
  position: relative;
}

.input-group .form-control {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  flex: 1;
}

.input-group-text {
  background: #003366;
  border-color: #003366;
  padding: 0 15px;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border: none;
  transition: background 0.3s ease;
}

.input-group-text:hover {
  background: #002244;
}

/* Campo de fecha */
.date-field-container {
  position: relative;
  width: 100%;
}

.date-field {
  padding-right: 35px;
}

.date-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #003366;
  pointer-events: none;
}

/* Botón principal */
.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 25px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  flex: 1;
}

.btn-primary {
  background-color: #002244 !important;
  color: white;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-primary:hover:not(:disabled) {
  background-color: #007bff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary:hover {
  background: #c0c0c0;
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Mensajes de error */
.invalid-feedback {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  animation: fadeIn 0.3s ease;
}

.invalid-feedback i {
  margin-right: 5px;
}

.is-invalid {
  border-color: #dc3545 !important;
}

.is-valid {
  border-color: #28a745 !important;
}

/* Texto de ayuda */
.form-text {
  margin-top: 5px;
  font-size: 0.8rem;
  color: #6c757d;
}

/* Estilos para el select personalizado */
.dropdown-container {
  position: relative;
  width: 100%;
}

.custom-select {
  /* Oculta la flecha nativa */
  appearance: none;
  -webkit-appearance: none;
  background-color: #fff;
  padding-right: 2.5rem; /* deja espacio para el ícono */
  cursor: pointer;
}

/* Flecha personalizada */
.dropdown-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  pointer-events: none;
  color: #003366;
  font-size: 1rem; /* Ajusta el tamaño del ícono */
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Mejoras responsivas */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-container {
    padding: 20px;
    margin: 0 10px;
    border-radius: 8px;
  }
  
  .header-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  .form-label {
    font-size: 0.85rem;
  }
  
  .form-control {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  .btn {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
}

/* Para pantallas muy pequeñas */
@media (max-width: 480px) {
  .form-container {
    padding: 15px;
    margin: 0 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .header-title {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
  
  .form-grid {
    gap: 0.8rem;
  }
  
  .invalid-feedback {
    font-size: 0.75rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    margin-top: 5px;
  }
}

/* Para inputs de tipo date en dispositivos móviles */
@supports (-webkit-touch-callout: none) {
  input[type="date"] {
    min-height: 44px; /* Mejor tamaño para toques en iOS */
  }
}

/* Enfoque para accesibilidad */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* Alta densidad de píxeles */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .form-container {
    border: 0.5px solid rgba(0, 0, 0, 0.1);
  }
}
</style>