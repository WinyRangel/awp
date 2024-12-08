function almacenarDatos() {
    let habitacion = document.getElementById("habitacion").value;
    let tipo = document.getElementById("tipo").value;
    let descripcion = document.getElementById("descripcion").value;
    let estado = document.getElementById("estado").value;

    let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

    const nuevaHabitacion = {
        habitacion: habitacion,
        tipo: tipo,
        descripcion: descripcion,
        estado: estado
    };

    // Si hay un id seleccionado, actualizamos el registro, si no, lo agregamos nuevo
    if (window.editarIndex !== undefined) {
        habitaciones[window.editarIndex] = nuevaHabitacion;
        window.editarIndex = undefined; 
    } else {
        habitaciones.push(nuevaHabitacion);
    }

    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
    document.getElementById("habitacion-form").reset();
    mostrarHabitaciones();
}

function mostrarHabitaciones() {
    let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];

    let tablaCuerpo = document.getElementById("habitaciones-lista");
    tablaCuerpo.innerHTML = "";

    habitaciones.forEach(function (habitacion, index) {
        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${habitacion.habitacion}</td>
            <td>${habitacion.tipo}</td>
            <td>${habitacion.descripcion}</td>
            <td>${habitacion.estado}</td>
            <td>
                <button class="btn btn-warning" onclick="editarHabitacion(${index})">Actualizar</button>
                <button class="btn btn-danger" onclick="eliminarHabitacion(${index})">Eliminar</button>
            </td>
        `;

        tablaCuerpo.appendChild(fila);
    });
}

function editarHabitacion(index) {
    let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
    let habitacion = habitaciones[index];

    document.getElementById("habitacion").value = habitacion.habitacion;
    document.getElementById("tipo").value = habitacion.tipo;
    document.getElementById("descripcion").value = habitacion.descripcion;
    document.getElementById("estado").value = habitacion.estado;

    window.editarIndex = index;
}

function eliminarHabitacion(index) {
    let habitaciones = JSON.parse(localStorage.getItem("habitaciones")) || [];
    habitaciones.splice(index, 1);
    localStorage.setItem("habitaciones", JSON.stringify(habitaciones));
    mostrarHabitaciones();
}

document.addEventListener("DOMContentLoaded", mostrarHabitaciones);
document.getElementById("habitacion-form").addEventListener("submit", almacenarDatos);
