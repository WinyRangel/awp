if(navigator.serviceWorker){
    navigator.serviceWorker.register("/sw.js")
}

let form = document.querySelector("#empleados-form");
let tabla = document.querySelector("#empleados-lista tbody");
let listaDatos = [];

const nuevoId = () => {
    let ultimoRegistro = listaDatos[ listaDatos.length - 1];
    if(ultimoRegistro){
        return ultimoRegistro.id + 1;
    }else{
        return 1;
    }
}

form.onsubmit = (evento) => {
    evento.preventDefault();
    let fd = new FormData(form);
    let datos = Object.fromEntries(fd.entries());
    let tipoOperacion = form.dataset.type;
    if(tipoOperacion === "add"){
        datos.id = nuevoId();
        datos.enviado = false;
        registrarTareaSync(datos);
    } else {
        datos.id = parseInt(form.dataset.id);
        editarEmpleado(datos, generarTabla);
    }
    form.reset();
}

const registrarTareaSync = (datos) => {
    guardarEmpleado(datos, () => {
        generarTabla();
        if("SyncManager" in window){
            navigator.serviceWorker.ready.then(swRegistrado => {
                return swRegistrado.sync.register("sync-info-empleados")
            });
        }
    });
}

const generarFila = ({id, nombre, numControl, cargo, fechaIngreso, enviado}) => {
    let tr = document.createElement("tr");

    // numControl
    let td = document.createElement("td");
    td.textContent = numControl;
    tr.appendChild(td);

    // nombre
    td = document.createElement("td");
    td.textContent = nombre;
    tr.appendChild(td);

    // titulo
    td = document.createElement("td");
    td.textContent = cargo;
    tr.appendChild(td);

    // fechaPrestamo
    td = document.createElement("td");
    td.textContent = fechaIngreso;
    tr.appendChild(td);

    // enviado
    td = document.createElement("td");
    td.textContent = enviado ? "Si" : "No";
    tr.appendChild(td);

    // boton editar
    td = document.createElement("td");
    let button = document.createElement("button");
    button.textContent = "Editar";
    button.className = "btn btn-info";
    button.onclick = () => {
        editarRegistro(id);
    }
    td.appendChild(button);
    tr.appendChild(td);

    // boton eliminar
    td = document.createElement("td");
    button = document.createElement("button");
    button.textContent = "Eliminar";
    button.className = "btn btn-danger";
    button.onclick = () => {
        eliminarEmpleado(id, generarTabla);
    }
    td.appendChild(button);
    tr.appendChild(td);

    return tr;
}

const generarTabla = () => {
    listarEmpleados((datos) => {
        listaDatos = datos;
        tabla.innerHTML = "";
        datos.forEach(registro => {
            tabla.appendChild(generarFila(registro));
        });
        form.dataset.type = "add";
        form.querySelector("button").textContent = "Guardar";
    });
}

const editarRegistro = (id) => {
    listarPorId(id, ({id, nombre, numControl, cargo, fechaIngreso})=> {
        form.querySelector("#numControl").value = numControl;
        form.querySelector("#nombre").value = nombre;
        form.querySelector("#cargo").value = cargo;
        form.querySelector("#fechaIngreso").value = fechaIngreso;
        form.dataset.id = id;
        form.dataset.type = "update";

        form.querySelector("button").textContent = "Actualizar";
    });
}

function limpiarDatos() {
    // Limpiar los campos del formulario
    document.getElementById("numControl").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("cargo").value = "";
    document.getElementById("fechaIngreso").value = "";
}

abrirBd(generarTabla);

const canal = new BroadcastChannel("sw-messages");
canal.addEventListener("message", evento =>  {
    generarTabla();
});