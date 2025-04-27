import React, { useState } from 'react';
import supabase from './services/client';


function calcularEdad(fechaNacimiento) {
  // Dividir la fecha en día, mes y año
  const [dia, mes, año] = fechaNacimiento.split('/').map(Number);

  // Crear un objeto Date con la fecha de nacimiento
  const fechaNac = new Date(año, mes - 1, dia); // Los meses en JavaScript van de 0 a 11

  // Obtener la fecha actual
  const fechaActual = new Date();

  // Calcular la diferencia de años
  let edad = fechaActual.getFullYear() - fechaNac.getFullYear();

  // Ajustar la edad si el cumpleaños aún no ha ocurrido este año
  if (fechaActual.getMonth() < fechaNac.getMonth() || 
      (fechaActual.getMonth() === fechaNac.getMonth() && fechaActual.getDate() < fechaNac.getDate())) {
      edad--;
  }

  return edad;
}
function App() {
  // const { state } = useLocation();
  // const { user } = state || {};
  const [curp, setCurp] = useState("");
  const [nulo, setNulo] = useState("");
  const [seccion, setSeccion] = useState("");
  const [ubt, setUbt] = useState("");
  const [pb, setPb] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleError = (err) => {
    console.error(err);
  };

  const CURP_REGEX = /^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}[A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]{1}\d{1}$/;


  const handleRegister = async () => {
    if (!CURP_REGEX.test(curp)) {
      console.log("El CURP no es válido:", curp);
      alert("El CURP ingresado no es válido. Verifica que tenga el formato correcto.");
      return;
    }
    try {
    const { data, error } = await supabase.from("afiliados").insert(
      {
        curp: curp,
        seccion: seccion,
        ubt: ubt,
        pb: pb,
        telefono: telefono,
       
        // estado,
        // numero_estado: numeroEstado,
        // seccion,
      },
    );

    if (error) {
      console.error("Error al registrar:", error);
      alert(error.code=== 23505 ? "":"REGISTRO DUPLICADO");
      setCurp("");
    } else {
      alert("Registro exitoso");
      setCurp("");
      setPb("");
      setUbt("");
      setTelefono("");
      setSeccion("");

    }}catch (error) {
      console.error("Error inesperado:", error);
      // setMessage("Ocurrió un error al enviar el reporte.");
    }
  };
 

  return (
    <div className='bg-gradient-to-r from-red-600 via-gray-400 to-red-600 flex items-center justify-center h-auto'>
      <div className='w-[540px] bg-gradient-to-r from-red-950 via-red-950 to-red-950 rounded-xl p-4 my-40'>
      
      <form onSubmit={handleRegister} className="space-y-4">
      
      <div>
      
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
           
          
          <div className="sm:col-span-2">
            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-red-50">
              CURP:
            </label>
            <div className="mt-2.5">
              <input 
              type="text"
              placeholder="CURP"
              value={curp}
              onChange={(e) => setCurp(e.target.value.trim().toUpperCase())}
              className='block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
              required/>
              {/* <p>{calcularEdad(fechaNacimiento)}</p> */}
              
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm/6 font-semibold text-red-50">
              SECCIÓN:
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                placeholder="SECCIÓN"
                value={seccion}
                onChange={(e) => setSeccion(e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label  className="block text-sm/6 font-semibold text-red-50">
              PROMOTOR@:
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                placeholder="PROMOTOR@"
                value={pb}
                onChange={(e) => setPb(e.target.value.toUpperCase())}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600"
                required
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label  className="block text-sm/6 font-semibold text-red-50">
              TELÉFONO:
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                placeholder="NÚMERO TELEFÓNICO"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-purple-600"
                required
              />
            </div>
          </div>

        </div>

        
        <div className="mt-10">
        <button 
        className="block w-full rounded-md bg-rose-800 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        type="submit"
        /*onClick={handleRegister}*/>
          AFILIAR</button>
        </div>
        
      </div>
      </form>
      
      </div>
    </div>
    
  );
};

export default App;