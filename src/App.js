import React, { useState } from 'react';
import supabase from './services/client';

function App() {
  const [formData, setFormData] = useState({
    curp: "",
    seccion: "",
    ubt: "",
    pb: "",
    telefono: "",
    afiliador: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Expresiones regulares para validación
  const CURP_REGEX = /^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}[A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]{1}\d{1}$/;
  const SECCION_REGEX = /^\d{1,4}$/;
  const TELEFONO_REGEX = /^\d{10}$/;

  const validateForm = () => {
    const newErrors = {};
    
    if (!CURP_REGEX.test(formData.curp)) {
      newErrors.curp = "El CURP no es válido";
    }
    
    if (!SECCION_REGEX.test(formData.seccion)) {
      newErrors.seccion = "La sección debe ser un número de 1 a 4 dígitos";
    }
    
    if (!formData.pb.trim()) {
      newErrors.pb = "El nombre del promotor es requerido";
    }
    
    if (!TELEFONO_REGEX.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 10 dígitos";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limpieza de datos según el campo
    let cleanedValue = value;
    if (name === 'curp') cleanedValue = value.trim().toUpperCase();
    if (name === 'telefono') cleanedValue = value.replace(/\D/g, ''); // Solo números
    if (name === 'seccion') cleanedValue = value.replace(/\D/g, ''); // Solo números
    
    setFormData(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.from("afiliados").insert([{
        curp: formData.curp,
        seccion: formData.seccion,
        ubt: formData.ubt,
        pb: formData.pb,
        telefono: formData.telefono,
        afiliador: formData.afiliador
      }]);

      if (error) {
        if (error.code === '23505') {
          setErrors({ curp: "Este CURP ya está registrado" });
        } else {
          throw error;
        }
      } else {
        setSuccessMessage("Afiliación exitosa");
        // Limpiar formulario
        setFormData({
          curp: "",
          seccion: "",
          ubt: "",
          pb: "",
          telefono: "",
          afiliador: ""

        });
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      setErrors({ submit: "Ocurrió un error al procesar la afiliación" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-red-600 via-gray-400 to-red-600 flex items-center justify-center py-10'>
      <div className='w-full max-w-md bg-gradient-to-r from-red-950 via-red-950 to-red-950 rounded-xl p-6 shadow-lg'>
        <h1 className="text-2xl font-bold text-center text-red-50 mb-6">FORMULARIO DE AFILIACIÓN</h1>
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
            {successMessage}
          </div>
        )}
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-center">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo CURP */}
          <div>
            <label htmlFor="curp" className="block text-sm font-semibold text-red-50 mb-1">
              CURP *
            </label>
            <input
              id="curp"
              name="curp"
              type="text"
              placeholder="Ingresa tu CURP"
              value={formData.curp}
              onChange={handleChange}
              maxLength={18}
              className={`w-full rounded-md px-3.5 py-2 text-gray-900 ${errors.curp ? 'border-2 border-red-500' : 'border border-gray-300'}`}
              required
            />
            {errors.curp && <p className="mt-1 text-sm text-red-300">{errors.curp}</p>}
          </div>
          
          <div>
            <label htmlFor="ubt" className="block text-sm font-semibold text-red-50 mb-1">
              NOMBRE COMPLETO *
            </label>
            <input
              id="ubt"
              name="ubt"
              type="text"
              placeholder="NOMBRE COMPLETO"
              value={formData.ubt.toUpperCase()}
              onChange={handleChange}
              className="w-full rounded-md px-3.5 py-2 text-gray-900 border border-gray-300"
              required
            />
          </div>

          {/* Campo SECCIÓN */}
          <div>
            <label htmlFor="seccion" className="block text-sm font-semibold text-red-50 mb-1">
              SECCIÓN *
            </label>
            <input
              id="seccion"
              name="seccion"
              type="text"
              placeholder="Número de sección"
              value={formData.seccion}
              onChange={handleChange}
              maxLength={4}
              className={`w-full rounded-md px-3.5 py-2 text-gray-900 ${errors.seccion ? 'border-2 border-red-500' : 'border border-gray-300'}`}
              required
            />
            {errors.seccion && <p className="mt-1 text-sm text-red-300">{errors.seccion}</p>}
          </div>
          
          {/* Campo PROMOTOR */}
          <div>
            <label htmlFor="pb" className="block text-sm font-semibold text-red-50 mb-1">
              PROMOTOR(A) *
            </label>
            <input
              id="pb"
              name="pb"
              type="text"
              placeholder="Nombre del promotor"
              value={formData.pb.toUpperCase()}
              onChange={handleChange}
              className={`w-full rounded-md px-3.5 py-2 text-gray-900 ${errors.pb ? 'border-2 border-red-500' : 'border border-gray-300'}`}
              required
            />
            {errors.pb && <p className="mt-1 text-sm text-red-300">{errors.pb}</p>}
          </div>

          <div>
            <label htmlFor="pb" className="block text-sm font-semibold text-red-50 mb-1">
              AFILIADO POR*
            </label>
            <input
              id="afiliador"
              name="afiliador"
              type="text"
              placeholder="Nombre del afiliador@"
              value={formData.afiliador.toUpperCase()}
              onChange={handleChange}
              className={`w-full rounded-md px-3.5 py-2 text-gray-900 ${errors.afiliador ? 'border-2 border-red-500' : 'border border-gray-300'}`}
              required
            />
            {errors.pb && <p className="mt-1 text-sm text-red-300">{errors.afiliador}</p>}
          </div>
          
          {/* Campo TELÉFONO */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-semibold text-red-50 mb-1">
              TELÉFONO *
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="10 dígitos sin espacios"
              value={formData.telefono}
              onChange={handleChange}
              maxLength={10}
              className={`w-full rounded-md px-3.5 py-2 text-gray-900 ${errors.telefono ? 'border-2 border-red-500' : 'border border-gray-300'}`}
              required
            />
            {errors.telefono && <p className="mt-1 text-sm text-red-300">{errors.telefono}</p>}
          </div>
          
          {/* Campo UBT (opcional) */}
          
          
          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 
                ${isSubmitting ? 'bg-rose-600 opacity-70 cursor-not-allowed' : 'bg-rose-800 hover:bg-rose-700 focus-visible:outline-rose-600'}`}
            >
              {isSubmitting ? 'PROCESANDO...' : 'AFILIAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;