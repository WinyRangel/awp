let baseDatos = indexedDB.open(" personasWdmr ", 1);

const almacen = "almacenWdmr";

let db = null;

const abrirBd = (callback = null ) => {
    let baseDatos = indexedDB.open("personasWdmr", 1)
    baseDatos.onsuccess = (evento) => {
       console.log("Base de datos creada");
        db = evento.target.result;
        if(callback) callback();
    }
        baseDatos.onupgradeneeded = (evento) =>{
        console.log("BD actualizada");
        db = evento.target.result;
        db.createObjectStore(almacen, {keyPath:"id"});
    }
} 

const obtenerAlmacen = (tipoTransaccion) => {
    let transaccion = db.transaction(almacen, tipoTransaccion);
    return transaccion.objectStore(almacen);
}

const guardarPersona = (persona, onsuccess = null)=>{
    let almacen = obtenerAlmacen("readwrite");
    let guardar = almacen.add(persona);
    guardar.onsuccess = onsuccess
}

const listarPersonas = (onsuccess = null) =>{
    let almacen = obtenerAlmacen("readonly");
    let respuesta = almacen.getAll();
    respuesta.onsuccess = (evento) => { 
        let lista = evento.target.result;
        if(onsuccess) onsuccess(lista);
    }
}

const listarPorId = (id, onsuccess = null)=>{
    let almacem = obtenerAlmacen("readonly");
    let respuesta = almacem.get(id);
    respuesta.onsuccess = (e) => {
        let registro = e.target.result;
        if(onsuccess) onsuccess(registro);
    }   
}
const editarPersona = (personaActualizado, onsuccess = null) =>{
    let almacem = obtenerAlmacen("readwrite");
    let respuesta = almacem.put(personaActualizado);

    respuesta.onsuccess = onsuccess;
}

const eliminarPersona = (id, onsuccess = null ) => {
    let almacen = obtenerAlmacen("readwrite");
    let respuesta = almacen.delete(id);
    respuesta.onsuccess = onsuccess;
}

