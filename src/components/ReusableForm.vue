<template>
  <div>
    <h3 class="text-center header-title">{{ title }}</h3>
    <form @submit.prevent="handleSubmit" class="form-container">
      <div v-for="(field, index) in formFields" :key="index" class="mb-3">
        <label :for="field.id" class="form-label">{{ field.label }}</label>
        
        <!-- Campo de contraseña con toggle de visibilidad -->
        <div class="input-group" v-if="field.type === 'password'">
          <input
            :type="showPasswordState[field.name] ? 'text' : 'password'"
            class="form-control"
            :id="field.name"
            v-model="formData[field.name]"
            :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
            :placeholder="field.placeholder"
            @blur="validateField(field)"
            required
            autocomplete="new-password"
          />
          <span class="input-group-text" @click="togglePasswordVisibility(field)">
            <i :class="showPasswordState[field.name] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
          </span>
        </div>

        <!-- Campos de texto y email -->
        <input
          v-if="field.type === 'text' || field.type === 'email'"
          :type="field.type"
          class="form-control"
          :id="field.name"
          v-model="formData[field.name]"
          :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
          :placeholder="field.placeholder"
          @blur="validateField(field)"
          required
          autocomplete="new-password"
        />
        
        <!-- Campo select -->
        <div v-if="field.type === 'select'" class="dropdown-container">
          <select
            v-model="formData[field.name]"
            :id="field.name"
            class="form-control custom-select"
            @blur="validateField(field)"
            required
          >
            <option v-for="option in field.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <span class="dropdown-arrow"></span>
        </div>

        <!-- Campo de textarea -->
        <textarea rows="8"
          v-if="field.type === 'text-area'"
          class="form-control text-area-field"
          :id="field.name"
          v-model="formData[field.name]"
          :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
          :placeholder="field.placeholder"
          @blur="validateField(field)"
          required
        ></textarea>

        <!-- Campo de fecha -->
        <input
          v-if="field.type === 'date'"
          type="date"
          class="form-control"
          :id="field.name"
          v-model="formData[field.name]"
          :class="{'is-invalid': errors[field.name].length > 0, 'is-valid': formData[field.name] && errors[field.name].length === 0}"
          @blur="validateField(field)"
          required
        />
              
        <!-- Mostrar mensajes de error -->
        <div v-if="errors[field.name] && errors[field.name].length" class="invalid-feedback d-block">
          <div v-for="(error, index) in errors[field.name]" :key="index">{{ error }}</div>
        </div> 
      </div>
  
      <!-- Botón de envío -->
      <button type="submit" class="btn btn-primary w-100">{{ submitButtonText }}</button>
      
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

const handleSubmit = () => {
  let valid = true;
  props.fields.forEach(field => {
    validateField(field);
    if (errors.value[field.name].length > 0) {
      valid = false;
    }
  });

  if (valid) {
    props.onSubmit(formData.value);
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
/* Estilos mejorados para un aspecto moderno y agradable */

.form-container {
  background: #fff;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 25px ;
  border-radius: 10px;
}

.header-title {
  font-size: 1.8rem;
  color: #003366;
  font-weight: 700;
  margin-bottom: 20px;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
  display: block;
}

.form-control {
  border: 2px solid #003366;
  border-radius: 5px;
  padding: 10px 15px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0, 86, 179, 0.5);
}

.input-group .form-control {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-group-text {
  background: #003366;
  color: #fff;
  border: 2px solid #003366;
  border-left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  padding: 10px;
  transition: background 0.3s ease;
}

.input-group-text:hover {
  background: #0056b3;
}

.btn-primary {
  background-color: #003366;
  border: none;
  border-radius: 5px;
  padding: 12px;
  font-size: 1.1rem;
  transition: background 0.3s ease;
  margin-top: 15px;
}

.btn-primary:hover {
  background-color: #002244;
}

.is-valid {
  border-color: #28a745;
}

.is-invalid {
  border-color: red;
}

/* Estilos para select personalizado */
.custom-select {
  appearance: none;
  padding-right: 30px;
  background: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22currentColor%22%3E%3Cpath d=%22M5 7l5 5 5-5%22/%3E%3C/svg%3E') no-repeat right 10px center/12px 12px;
  border: 2px solid #003366;
  border-radius: 5px;
  padding: 10px 15px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-select:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0, 86, 179, 0.5);
}

.dropdown-container {
  position: relative;
}

.dropdown-arrow {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  pointer-events: none;
}
</style>
