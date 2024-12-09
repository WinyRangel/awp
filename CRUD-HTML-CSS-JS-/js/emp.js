const almacen = "almacenHotel";
let db = null;

const abrirBd = (callback = null) => {
    let baseDatos = indexedDB.open("empleados", 1);
    baseDatos.onsuccess = (evento) => {
        console.log("BD creada");
        db = evento.target.result;
        if (callback) callback();
    };
    baseDatos.onupgradeneeded = (evento) => {
        console.log("BD actualizada");
        db = evento.target.result;
        db.createObjectStore(almacen, { keyPath: "id" });
    };
};

const obtenerAlmacen = (tipoTransaccion) => {
    let transaccion = db.transaction(almacen, tipoTransaccion);
    return transaccion.objectStore(almacen);
};

const guardarEmpleado = (empleado, onsuccess = null) => {
    let almacen = obtenerAlmacen("readwrite");
    let guardar = almacen.add(empleado);
    guardar.onsuccess = onsuccess;
};

const listarEmpleados = (onsuccess = null) => {
    let almacen = obtenerAlmacen("readonly");
    let respuesta = almacen.getAll();
    respuesta.onsuccess = (evento) => {
        let lista = evento.target.result;
        if (onsuccess) onsuccess(lista);
    };
};

const listarPorId = (id, onsuccess = null) => {
    let almacen = obtenerAlmacen("readonly");
    let respuesta = almacen.get(id);
    respuesta.onsuccess = (e) => {
        let registro = e.target.result;
        if(onsuccess) onsuccess(registro);
    }
}

const editarEmpleado = (empleadoActualizado, onsuccess = null) => {
    let almacen = obtenerAlmacen("readwrite");
    let respuesta = almacen.put(empleadoActualizado);
    respuesta.onsuccess = onsuccess;
};

const eliminarEmpleado = (id, onsuccess = null) => {
    let almacen = obtenerAlmacen("readwrite");
    let respuesta = almacen.delete(id);
    respuesta.onsuccess = onsuccess;
};
