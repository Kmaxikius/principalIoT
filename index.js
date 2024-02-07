// Importamos lo necesario desde firebase.js
import {
    saveData,
    getDataChanged_collection,
    deleteData,
    getData,
    getDataCollection,
    cambiarNombreDocumento,
    updateData
} from "./firebase.js";

const formulario = document.getElementById('formulario');
const coleccion = 'IoT';
const contenedor = document.getElementById('container');
const botonDocumento = document.getElementById('obtenerDocumento');


// Función para mostrar los datos en el contenedor
const mostrarDatos = async (datos) => {
    contenedor.innerHTML = '';
    datos.forEach(doc => {
        const data = doc.data();
        const id = doc.id;
        contenedor.innerHTML += `
            <div>
                <h2>${data.nombre} : ${doc.id}</h2>
                <h3>Sensores:</h3>
                
                    ${mostrarDispositivos(data.sensores,id)}
                <h3>Ejecutores:</h3>
                    ${mostrarDispositivos(data.ejecutores,doc.id)}
                <button onclick="agregarEjecutor('${id}')">Agregar Ejecutor</button>
                <button onclick="agregarSensor('${id}')">Agregar Sensor</button>
                <button onclick="eliminar('${id}')">Eliminar</button>
                <button onclick="modificar('${id}')">Modificar</button>
            </div>
        `;
    });
}
// Función para mostrar los dispositivos 

const mostrarDispositivos = (dispositivos,id) => {
    let html = '';
    
    dispositivos.forEach(dispositivo => {
        html += `
                <div>
                    <p>Nombre: ${dispositivo.nombreEje} id: ${dispositivo.idDispo}</p>
                    <p>Estado: ${dispositivo.estado}</p>
                    <button onclick="eliminarDispositivo('${dispositivo.idDispo}','${id}','${dispositivo.tipo}')">Eliminar</button>
                    <button onclick="modificarDispositivo('${dispositivo.idDispo}','${id}','${dispositivo.tipo}')">Modificar</button>
                   
                    
                </div>
        `;
    });
    return html;
}

botonDocumento.addEventListener('click', async () => {
    await getDataChanged_collection(coleccion, mostrarDatos);
});

// Función para añadir una Sala  
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = formulario['nombreSala'].value;
    const fecha = new Date().toLocaleString();
        await saveData(coleccion, {
        nombre,
        fecha,
        ejecutores: [],
        sensores: []
    });
    formulario.reset();
}
);

// Función para agregar un ejecutor
window.agregarEjecutor = async (id) => {
    const nombreEje = prompt('Ingrese el nombre del ejecutor');
    //generar un id aleatorio para el ejecutor
    const idDispo = Math.random().toString(36).substr(2, 9);
    const tipo = "ejecutor"
    if (nombreEje) {
        const ejecutor = { nombreEje, estado: "No_definido" ,idDispo, tipo};
        const docData = await getData(id, coleccion);
        await updateData(id, coleccion, { ejecutores: [...docData.data().ejecutores, ejecutor] });
    }
  
}

// Función para agregar un sensor
window.agregarSensor = async (id) => {
    const nombreEje = prompt('Ingrese el nombre del sensor');
    const idDispo = Math.random().toString(36).substr(2, 9);
    const tipo = "sensor"
    if (nombreEje) {
        const sensor = { nombreEje, estado: "No_definido" ,idDispo, tipo};
        const docData = await getData(id, coleccion);
        await updateData(id, coleccion, { sensores: [...docData.data().sensores, sensor] });
    }
}

// Función para eliminar un documento
window.eliminar = async (id) => {
    if (confirm('¿Está seguro de eliminar el documento?')) {
        await deleteData(id, coleccion);
    }
}

// Función para eliminar un dispositivo
window.eliminarDispositivo = async (idDispo, id, tipo) => {
    if(confirm('¿Está seguro de eliminar el dispositivo?')){
     if(tipo == "ejecutor"){
        const docData = await getData(id, coleccion);
        const ejecutores = docData.data().ejecutores.filter(ejecutor => ejecutor.idDispo !== idDispo);
        await updateData(id, coleccion, { ejecutores });
    }else{
        const docData = await getData(id, coleccion);
        const sensores = docData.data().sensores.filter(sensor => sensor.idDispo !== idDispo);
        await updateData(id, coleccion, { sensores });
    }
    
    
    }
}

// Función para modificar un dispositivo
window.modificarDispositivo = async (idDispo, id, tipo) => {
    if(tipo == "ejecutor"){
        const docData = await getData(id, coleccion);
        const ejecutores = docData.data().ejecutores.map(ejecutor => {
            if(ejecutor.idDispo === idDispo){
                ejecutor.estado = !ejecutor.estado;
            }
            return ejecutor;
        });
        await updateData(id, coleccion, { ejecutores });
    }else{
        const docData = await getData(id, coleccion);
        const sensores = docData.data().sensores.map(sensor => {
            if(sensor.idDispo === idDispo){
                sensor.estado = prompt('Ingrese el nuevo valor del sensor');
            }
            return sensor;
        });
        await updateData(id, coleccion, { sensores });
    }
}

// Función para modificar un documento
window.modificar = async (id) => {
    const nombre = prompt('Ingrese el nuevo nombre del documento');
    if (nombre) {
        await cambiarNombreDocumento(coleccion, id, nombre);
    }
}







