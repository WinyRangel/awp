const CACHE_NAME = "crud-hotel-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/js/bd.js",
  "/js/crud.js",
  "/styles/style.css",
  "/images/logo.png",
  "/images/habitacion.jpeg",   
  "/images/habitacion2.jpeg",  
  "/images/habitacion4.jpeg",  
  "/images/habitacion5.jpeg",  
  "/images/hab6.jpeg",   
  "/js/empl.js",   
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

self.addEventListener("fetch", (event) => {
  //para imagenes
  if (event.request.url.includes('/images/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // Para cualquier otra solicitud
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});


// Sincronización de datos en segundo plano
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-info-personas") {
    event.waitUntil(
      listarPersonas((personas) => {
        personas.forEach((persona) => {
          if (!persona.enviado) {
            fetch("/agregarPersona", {
              method: "POST",
              body: JSON.stringify(persona),
              headers: { "Content-Type": "application/json" },
            })
              .then((response) => {
                if (response.ok) {
                  persona.enviado = true;
                  editarPersona(persona);
                  const channel = new BroadcastChannel("sw-messages");
                  channel.postMessage({ title: "Tabla Actualizada" });
                }
              })
              .catch((error) => console.error("Sincronización fallida", error));
          }
        });
      })
    );
  }
});

self.addEventListener("sync", evento => {
  if(evento.tag == "sync-info-empleados"){
      evento.waitUntil(
          listarEmpleados(empleados => {
              empleados.forEach(empleado => {
                  if(empleado.enviado){
                      return;
                  }
                  fetch("/agregarEmpleado", {
                      method: "POST",
                      body: JSON.stringify(empleado),
                      headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json"
                      }
                  })
                  .then( respuesta => {
                      empleado.enviado = true;
                      editarEmpleado(empleado);
                      const canal = new BroadcastChannel("sw-messages");
                      canal.postMessage({title: "generarTabla"});
                  })
                  .catch(error => {
                      console.log("Fallo al sincronizar:", error);
                  })
              })
          })
      )
  }
})



// Notificaciones Push
self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/images/logo.png",
  });
});
