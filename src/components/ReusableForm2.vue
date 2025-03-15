<template>
    <div>
      <h3 class="text-center header-title">{{ title }}</h3>
      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="form-grid">
          <div 
            v-for="(field, index) in formFields" 
            :key="index" 
            class="form-field"
          >
            <label :for="field.id" class="form-label">{{ field.label }}</label>
            
            <!-- Campo de contraseña con toggle -->
            <div v-if="field.type === 'password'" class="input-group">
              <input
                :type="showPasswordState[field.name] ? 'text' : 'password'"
                class="form-control"
                :id="field.name"
                v-model="formData[field.name]"
                :class="{
                  'is-invalid': errors[field.name]?.length > 0, 
                  'is-valid': formData[field.name] && errors[field.name]?.length === 0
                }"
                :placeholder="field.placeholder"
                @blur="validateField(field)"
                required
                autocomplete="new-password"
              />
              <span class="input-group-text" @click="togglePasswordVisibility(field)">
                <i :class="showPasswordState[field.name] ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </span>
            </div>
  
            <!-- Campos de texto/email -->
            <input
              v-else-if="field.type === 'text' || field.type === 'email'"
              :type="field.type"
              class="form-control"
              :id="field.name"
              v-model="formData[field.name]"
              :class="{
                'is-invalid': errors[field.name]?.length > 0, 
                'is-valid': formData[field.name] && errors[field.name]?.length === 0
              }"
              :placeholder="field.placeholder"
              @blur="validateField(field)"
              required
            />
  
            <!-- Select con ícono de flecha -->
            <div v-else-if="field.type === 'select'" class="dropdown-container">
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
              <!-- Ícono de flecha -->
              <span class="dropdown-arrow">
                <i class="bi bi-caret-down-fill"></i>
              </span>
            </div>
  
            <!-- Campo de textarea -->
            <textarea rows="8"
              v-if="field.type === 'text-area'"
              class="form-control text-area-field"
              :id="field.name"
              v-model="formData[field.name]"
              :class="{
                'is-invalid': errors[field.name]?.length > 0, 
                'is-valid': formData[field.name] && errors[field.name]?.length === 0
              }"
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
              :class="{
                'is-invalid': errors[field.name]?.length > 0, 
                'is-valid': formData[field.name] && errors[field.name]?.length === 0
              }"
              @blur="validateField(field)"
              required
            />
  
            <!-- Mensajes de error -->
            <div v-if="errors[field.name]?.length" class="invalid-feedback d-block">
              <div v-for="(error, idx) in errors[field.name]" :key="idx">{{ error }}</div>
            </div>
          </div>
        </div>
  
        <button type="submit" class="btn btn-primary">{{ submitButtonText }}</button>
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
    } 
    else if (field.type === 'password' && value) {
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
      if (errors.value[field.name]?.length > 0) {
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
  .form-container {
    background: #fff;
    padding: 25px;
    border-radius: 10px;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .header-title {
    font-size: 1.8rem;
    color: #003366;
    font-weight: 700;
    margin-bottom: 25px;
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
  }
  
  .form-label {
    font-weight: 600;
    color: #003366;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  .form-control {
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }
  
  /* Efecto focus */
  .form-control:focus {
    border-color: #003366;
    box-shadow: 0 0 8px rgba(0, 51, 102, 0.2);
  }
  
  /* Icono de contraseña */
  .input-group-text {
    background: #003366;
    border-color: #003366;
    padding: 0 15px;
    cursor: pointer;
    color: #fff;
  }
  
  /* Botón principal */
  .btn-primary {
    background: #003366;
    padding: 12px 25px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 100%;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    background: #002244;
    transform: translateY(-1px);
  }
  
  /* Mensajes de error */
  .invalid-feedback {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 0.25rem;
  }
  
  .is-invalid {
    border-color: #dc3545 !important;
  }
  
  .is-valid {
    border-color: #28a745 !important;
  }
  
  /* Ajustes responsivos */
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .form-container {
      padding: 20px;
      margin: 0 15px;
    }
    
    .header-title {
      font-size: 1.5rem;
    }
  }
  
  /* Estilos para el select personalizado */
  .dropdown-container {
    position: relative;
  }
  
  .custom-select {
    /* Oculta la flecha nativa */
    appearance: none;
    -webkit-appearance: none;
    background-color: #fff;
    padding-right: 2.5rem; /* deja espacio para el ícono */
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
  </style>