<template>
  <!-- role="main" define el contenido principal para NVDA -->
  <div class="container" role="main">
    <!-- role="tablist" identifica el grupo de pestañas -->
    <div class="tabs" role="tablist">
      <!-- La pestaña de Empleados solo se muestra si currentUserRole no es 2 -->
      <!-- role="tab" y aria-controls vinculan la pestaña al contenido -->
      <button 
        v-if="currentUserRole !== 2"
        class="tab" 
        :class="{ active: activeTab === 'empleados' }" 
        @click="activeTab = 'empleados'"
        role="tab"
        :aria-selected="activeTab === 'empleados' ? 'true' : 'false'"
        aria-controls="empleados-panel"
      >
        Empleados
      </button>
      <button 
        class="tab" 
        :class="{ active: activeTab === 'estudiantes' }" 
        @click="activeTab = 'estudiantes'"
        role="tab"
        :aria-selected="activeTab === 'estudiantes' ? 'true' : 'false'"
        aria-controls="estudiantes-panel"
      >
        Estudiantes
      </button>
    </div>

    <!-- role="tabpanel" identifica el contenido de cada pestaña -->
    <div class="tab-content">
      <div 
        v-if="activeTab === 'empleados'" 
        role="tabpanel" 
        id="empleados-panel" 
        aria-labelledby="empleados-tab"
      >
        <h2>Creación de Empleados</h2>
        <EmpleadoForm />
      </div>
      <div 
        v-if="activeTab === 'estudiantes'" 
        role="tabpanel" 
        id="estudiantes-panel" 
        aria-labelledby="estudiantes-tab"
      >
        <h2>Creación de Estudiantes</h2>
        <EstudianteForm />
      </div>
    </div>
  </div>
</template>

<script>
import EstudianteForm from "@/views/CreateStudent.vue";
import EmpleadoForm from "@/views/CreateEmployee.vue";
import utils from "../utils";

export default {
  data() {
    return {
      currentUserRole: null,
      activeTab: 'estudiantes' // Se asegura que la pestaña inicial sea correcta
    };
  },
  created() {
    try {
      this.currentUserRole = utils.getCurrentUserRole(); // Asegurar llamada correcta
      if (this.currentUserRole !== 2) {
        this.activeTab = 'empleados';
      }
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
    }
  },
  components: {
    EstudianteForm,
    EmpleadoForm
  }
};
</script>


<style scoped>
.container {
  padding: 20px;
  width: 100%;
  margin: 0 auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  background-color: #e9ecef;
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.tab:hover {
  background-color: #007bff;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.tab.active {
  background-color: #007bff;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.tab-content {
  border: 1px solid #dee2e6;
  padding: 20px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
}

h2{
  text-align: center;
}
</style>