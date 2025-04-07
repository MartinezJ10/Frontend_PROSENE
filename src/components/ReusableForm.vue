<template>
  <div>
    <h3 v-if="title" class="text-center header-title">{{ title }}</h3>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div v-for="(field, index) in formFields" :key="index" class="form-group mb-3"> 
        <label :for="field.id" class="form-label">{{ field.label }}</label>
        
        <div class="input-group input-transition" v-if="field.type === 'password'">
          <input
            :type="showPasswordState[field.name] ? 'text' : 'password'"
            class="form-control"
            :id="field.name"
            v-model="formData[field.name]"
            :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
            :placeholder="field.placeholder"
            @blur="validateField(field)"
            @focus="onFieldFocus(field.name)"
            required
            autocomplete="new-password"
          />
          <span class="input-group-text" @click="togglePasswordVisibility(field)" aria-label="Toggle password visibility">
            <i :class="showPasswordState[field.name] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </span>
        </div>

        <input
          v-if="field.type === 'text' || field.type === 'email'"
          :type="field.type"
          class="form-control input-transition"
          :id="field.name"
          v-model="formData[field.name]"
          :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
          :placeholder="field.placeholder"
          @blur="validateField(field)"
          @focus="onFieldFocus(field.name)"
          required
          autocomplete="new-password"
        />
        
        <div v-if="field.type === 'select'" class="dropdown-container">
          <select
            v-model="formData[field.name]"
            :id="field.name"
            class="form-control custom-select input-transition"
            @blur="validateField(field)"
            @focus="onFieldFocus(field.name)"
            required
          >
            <option value="" disabled selected>{{ field.placeholder || 'Seleccione una opción' }}</option>
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <textarea rows="6" 
          v-if="field.type === 'text-area'"
          class="form-control text-area-field input-transition"
          :id="field.name"
          v-model="formData[field.name]"
          :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
          :placeholder="field.placeholder"
          @blur="validateField(field)"
          @focus="onFieldFocus(field.name)"
          required
        ></textarea>

        <input
          v-if="field.type === 'date'"
          type="date"
          class="form-control input-transition"
          :id="field.name"
          v-model="formData[field.name]"
          :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
          @blur="validateField(field)"
          @focus="onFieldFocus(field.name)"
          required
        />
            
        <transition name="fade">
          <div v-if="errors[field.name] && errors[field.name].length" class="invalid-feedback d-block error-message">
            <div v-for="(error, index) in errors[field.name]" :key="index">{{ error }}</div>
          </div>
        </transition>
      </div>
  
      <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        {{ isSubmitting ? 'Enviando...' : submitButtonText }}
      </button>
      
      <slot name="extra-links"></slot>
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
  onSubmit: {
    type: Function,
    required: true
  }
});

// Inicializar formData y errors como objetos
const formData = ref({});
const errors = ref({});
const isSubmitting = ref(false);
const focusedField = ref(null);

const showPasswordState = reactive({});

const initializeFormData = () => {
  formData.value = props.fields.reduce((acc, field) => {
    acc[field.name] = field.value || '';
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

watch(() => props.fields, () => {
  initializeFormData();
}, { deep: true });

const togglePasswordVisibility = (field) => {
  showPasswordState[field.name] = !showPasswordState[field.name];
};

const onFieldFocus = (fieldName) => {
  focusedField.value = fieldName;
};

// Función para validar email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Valida que el campo no esté vacío
const validateRequiredField = (field) => {
  const value = formData.value[field.name];
  if (!value) {
    errors.value[field.name] = [`${field.label} es requerido`];
  } else {
    errors.value[field.name] = [];
  }
};

const validateField = (field) => {
  focusedField.value = null;
  validateRequiredField(field);
  const value = formData.value[field.name];

  if (field.type === 'email' && value && !validateEmail(value)) {
    errors.value[field.name].push('La dirección de email es inválida');
  } else if (field.type === 'password' && value) {
    if (value.length < 6) {
      errors.value[field.name].push('La contraseña debe tener al menos 6 caracteres.');
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      errors.value[field.name].push('Debe incluir al menos una letra mayúscula.');
    }
    if (!/(?=.*\d)/.test(value)) {
      errors.value[field.name].push('Debe incluir al menos un número.');
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(value)) {
      errors.value[field.name].push('Debe incluir al menos un carácter especial.');
    }
  }
};

const formIsValid = computed(() => {
  for (const fieldName in errors.value) {
    if (errors.value[fieldName].length > 0) {
      return false;
    }
    if (!formData.value[fieldName]) {
      return false;
    }
  }
  return true;
});

const handleSubmit = async () => {
  let valid = true;
  props.fields.forEach(field => {
    validateField(field);
    if (errors.value[field.name].length > 0) {
      valid = false;
    }
  });

  if (valid) {
    isSubmitting.value = true;
    try {
      await props.onSubmit(formData.value);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      isSubmitting.value = false;
    }
  } else {
    // Scroll al primer error
    const firstErrorField = document.querySelector('.is-invalid');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
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
/* Estilos mejorados y optimizados */

.form-container {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  margin: 0 auto;
}

.header-title {
  font-size: 1.8rem;
  color: #003366;
  font-weight: 600;
  margin-bottom: 25px;
  position: relative;
}

.header-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 2px;
  background: #003366;
  border-radius: 2px;
}

.form-label {
  font-weight: 500;
  color: #222;
  margin-bottom: 6px;
  display: block;
  font-size: 0.95rem;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.input-transition {
  transition: all 0.3s ease-in-out;
  border: 1.5px solid #e1e1e1;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 0.95rem;
}

.input-transition:focus {
  border-color: #003366;
  box-shadow: 0 0 0 2px rgba(0, 51, 102, 0.15);
  transform: translateY(-1px);
}

.form-control {
  border: 1.5px solid #e1e1e1;
  border-radius: 6px;
  padding: 10px 12px;
  color: #333;
  background-color: #fff;
  width: 100%;
  font-size: 0.95rem;
}

.form-control::placeholder {
  color: #aaa;
  opacity: 0.7;
}

.input-group .form-control {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group-text {
  background: #003366;
  color: #fff;
  border: 1.5px solid #003366;
  border-left: 0;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  cursor: pointer;
  padding: 0 12px;
  display: flex;
  align-items: center;
  transition: background 0.2s ease;
}

.input-group-text:hover {
  background: #004d99;
}

.input-group-text i {
  font-size: 1rem;
}

.is-valid {
  border-color: #28a745 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  padding-right: calc(1.5em + 0.75rem) !important;
}

.is-invalid {
  border-color: #dc3545 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  padding-right: calc(1.5em + 0.75rem) !important;
}

.btn-primary {
  background-color: #003366;
  border: none;
  border-radius: 6px;
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 51, 102, 0.18);
  margin-top: 15px;
}

.btn-primary:hover {
  background-color: #004d99;
  transform: translateY(-1px);
  box-shadow: 0 5px 18px rgba(0, 51, 102, 0.25);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 51, 102, 0.18);
}

.btn-primary:disabled {
  background-color: #7799bb;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Estilos para select personalizado */
.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23003366'%3E%3Cpath d='M8 10.5l-4-4h8l-4 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  padding-right: 35px;
}

.dropdown-container {
  position: relative;
}

/* Estilos para mensajes de error */
.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 4px;
  font-weight: 400;
}

/* Animación para mensajes de error */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Estilos para textarea */
.text-area-field {
  resize: vertical;
  min-height: 100px;
}

/* Media queries para diseño responsive */
@media (max-width: 768px) {
  .form-container {
    padding: 18px;
    width: 95%;
    border-radius: 8px;
  }
  
  .header-title {
    font-size: 1.5rem;
  }
  
  .btn-primary {
    padding: 10px 14px;
  }
}

@media (max-width: 480px) {
  .form-container {
    padding: 12px;
  }
  
  .header-title {
    font-size: 1.3rem;
  }
  
  .form-control, .input-transition {
    padding: 8px 10px;
  }
}
</style>