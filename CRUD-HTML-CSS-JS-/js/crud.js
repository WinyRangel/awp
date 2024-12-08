const CACHE_NAME = "crud-hotel-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/js/bd.js",
  "/js/crud.js",
  "/styles/style.css",
  "/images/logo.png",
];

let form = document.querySelector("#personas-form");
let tabla = document.querySelector("#personas-lista tbody");
let listaDatos = [];
const nuevoId = () =>{
    let ultimoRegistro = listaDatos[ listaDatos.length -1 ];
    if(ultimoRegistro){
        return ultimoRegistro.id + 1;
    } else {
        return 1;
    }
}
form.onsubmit = (evento) => {
    evento.preventDefault();
    let fd = new FormData(form);
    let datos = Object.fromEntries(fd.entries());
    let tipoOperacion = form.dataset.type;

    if (tipoOperacion === "add") {
        datos.id = nuevoId();
        datos.enviado = false;
        guardarPersona(datos, generarTabla);
        registrarTareaSync(datos);
    } else {
        datos.id = parseInt(form.dataset.id);
        editarPersona(datos, generarTabla);
    }
    form.reset();
};

const registrarTareaSync = (datos) => {
    guardarPersona(datos, () => {
        generarTabla();
        if ("SyncManager" in window) {
            navigator.serviceWorker.ready.then((swRegistrado) => {
                return swRegistrado.sync.register("sync-info-personas");
            });
        }
    });
};

const generarFila = ({id,nom,ape, pais, enviado}) => {
    let tr = document.createElement("tr");
    //Nom
    let td = document.createElement("td");
    td.textContent = nom;
    tr.appendChild(td);
    //Ape
    td = document.createElement("td");
    td.textContent = ape;
    tr.appendChild(td);
    //Pais
    td = document.createElement("td");
    td.textContent = pais;
    tr.appendChild(td);
    //Enviado
    td = document.createElement("td");
    td.textContent = enviado ? "Si" : "No";
    tr.appendChild(td);

    //Editar
    td = document.createElement("td");
    let button = document.createElement("button");
    button.textContent = "Editar";
    button.className = "btn btn-info";
    button.onclick= ( ) =>{
        editarRegistro(id);
    }
    td.appendChild(button);
    tr.appendChild(td);
   
   
    //Eliminar
    td = document.createElement("td");
    button = document.createElement("button");
    button.textContent = "Eliminar";
    button.className = "btn btn-danger";
    button.onclick = () => {
        eliminarPersona(id, generarTabla);
    }
    td.appendChild(button);
    tr.appendChild(td);

    return tr;

}

const generarTabla = () =>{
    listarPersonas((datos) =>{
        listaDatos = datos;
        tabla.innerHTML = "";
        datos.forEach(registro => {
            tabla.appendChild(generarFila(registro));
        });
        form.dataset.type = "add";
        form.querySelector("button").textContent = "Guadar";
    });
}


const editarRegistro = (id) => {
    listarPorId(id, ({ id, nom, ape, pais }) => {
        form.querySelector("#nom").value = nom;
        form.querySelector("#ape").value = ape;
        form.querySelector("#pais").value = pais;
        form.dataset.id = id;
        form.dataset.type = "update";
        form.querySelector("button").textContent = "Actualizar";
    });
};

abrirBd(generarTabla);
const canal = new BroadcastChannel("sw-messages");
canal.addEventListener("message", () => {
    generarTabla();
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      console.log("Service Worker registrado: ", reg);
    });
  
    // Solicitar permiso para notificaciones
    if ("Notification" in window && "PushManager" in window) {
      Notification.requestPermission().then((result) => {
        if (result === "granted") {
          console.log("Permiso para notificaciones otorgado.");
        } else {
          console.error("Permiso para notificaciones denegado.");
        }
      });
    }
  }
  
  const btnCamera = document.createElement("button");
  btnCamera.textContent = "Abrir Cámara";
  btnCamera.className = "btn btn-secondary";
  btnCamera.onclick = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        document.body.appendChild(video);
      })
      .catch((error) => console.error("No se pudo acceder a la cámara", error));
  };
  document.body.appendChild(btnCamera);
  