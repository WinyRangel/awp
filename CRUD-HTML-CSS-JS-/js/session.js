function almacenarDatos() {

    let habitacion = document.getElementById("habitacion").value;
    let tipo = document.getElementById("tipo").value;
    let descripcion = document.getElementById("descripcion").value;
    let estado = document.getElementById("estado").value;

    let habitaciones = JSON.parse(sessionStorage.getItem("habitaciones")) || [];

    const nuevaHabitacion = {
        habitacion: habitacion,
        tipo: tipo,
        descripcion: descripcion,
        estado: estado
    };

    //Guarfar el array 
    habitaciones.push(nuevaHabitacion);
     sessionStorage.setItem("habitaciones", JSON.stringify(habitaciones));

    document.getElementById("habitacion-form").reset();//para limpiar

    //Actualizar tabla
    mostrarHabitaciones();
}

function mostrarHabitaciones() {
    let habitaciones = JSON.parse(sessionStorage.getItem("habitaciones")) || [];

    let tablaCuerpo = document.getElementById("habitaciones-lista");
    tablaCuerpo.innerHTML = "";

    habitaciones.forEach(function (habitacion) {
        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${habitacion.habitacion}</td>
            <td>${habitacion.tipo}</td>
            <td>${habitacion.descripcion}</td>
            <td>${habitacion.estado}</td>
        `;

        tablaCuerpo.appendChild(fila);
    });
}

document.addEventListener("DOMContentLoaded", mostrarHabitaciones);
document.getElementById("habitacion-form").addEventListener("submit", almacenarDatos);
