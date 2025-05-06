const mensajes = [
    {
      remitente: "desconocido@extraño.com",
      asunto: "¡Gana un premio ahora!",
      tipo: "malo",
      contenido: '<p><a href="#" class="enlace-premio">Haz clic aquí para reclamar tu premio 🤑</a></p>',
      accion: "errores"
    },
    {
      remitente: "amigo.infancia@email.com",
      asunto: "¡Mira esta foto épica!",
      tipo: "bueno",
      contenido: '<img id="imagen-rayo" src="../imagenes/rayo.jpg" class="imagen-rayo oculto">',
    },
    {
      remitente: "spam@publicidad.com",
      asunto: "¡Hazte rico de inmediato! 💰",
      tipo: "spam",
      contenido: '<p>¡Invierte aquí!</p>',
    },
    {
      remitente: "dggt@multas.gob.es",
      asunto: "Pago urgente de multa 🚨",
      tipo: "malo",
      contenido: '<p><a href="#" class="enlace-multa">Pagar ahora</a></p>',
      accion: "animacion-multa"
    },
    {
      remitente: "hacker@peligro.com",
      asunto: "¡Tu PC ha sido hackeado! 💀",
      tipo: "nefasto",
      contenido: '<p><a href="#" class="enlace-hack">Ver detalles</a></p>',
      accion: "animacion-hack"
    },
    {
      remitente: "spam@ofertas.com",
      asunto: "¡50% de descuento en todo! 🛒",
      tipo: "spam",
      contenido: '<p>Aprovecha la oferta ahora</p>',
    },
    {
      remitente: "amigo2@confianza.com",
      asunto: "¿Jugamos esta tarde? 🎮",
      tipo: "bueno",
      contenido: "<p>¡Hola! ¿Jugamos un rato después del cole?</p>",
    },
    {
      remitente: "extra@correo.com",
      asunto: "¡Sorteo misterioso! 🧐",
      tipo: "malo",
      contenido: '<p><a href="#" class="enlace-premio">Participa ahora</a></p>',
      accion: "errores"
    }
  ];
  
  const listaMensajes = document.getElementById("lista-mensajes");
  const listaSpam = document.getElementById("lista-spam");
  const listaEliminados = document.getElementById("lista-eliminados");
  const contenidoMensaje = document.getElementById("contenido-mensaje");
  const detalleMensaje = document.getElementById("detalle-mensaje");
  const ventanasDiv = document.getElementById("ventanas");
  
  const bandejaSpam = [];
  const bandejaEliminados = [];
  
  mensajes.forEach((msg, index) => {
    const item = document.createElement("div");
    item.className = "mensaje-lista";
    item.innerHTML = `<strong>${msg.remitente}</strong><br>${msg.asunto}`;
    item.dataset.index = index;
    item.addEventListener("click", () => mostrarMensaje(index));
    listaMensajes.appendChild(item);
  });
  
  function mostrarMensaje(index) {
    const msg = mensajes[index];
    contenidoMensaje.classList.remove("oculto");
  
    detalleMensaje.innerHTML = `
      <p><strong>Remitente:</strong> ${msg.remitente}</p>
      <p><strong>Asunto:</strong> ${msg.asunto}</p>
      ${msg.contenido}
      <br>
      <button class="boton-marcar-leido" onclick="marcarComoLeido(${index})">✔ Marcar como Leído</button>
      <button class="boton-spam" onclick="moverASpam(${index})">🚫 Spam</button>
      <button class="boton-eliminar" onclick="moverAEliminados(${index})">🗑 Eliminar</button>
    `;
  
    if (msg.accion === "errores") {
      const enlace = document.querySelector(".enlace-premio");
      if (enlace) enlace.addEventListener("click", () => lanzarVentanasErrores());
    }
  
    if (msg.accion === "animacion-multa") {
      const enlaceMulta = document.querySelector(".enlace-multa");
      if (enlaceMulta) enlaceMulta.addEventListener("click", () => lanzarAnimacionMulta());
    }
  
    if (msg.accion === "animacion-hack") {
      const enlaceHack = document.querySelector(".enlace-hack");
      if (enlaceHack) enlaceHack.addEventListener("click", () => lanzarAnimacionHack());
    }
  }
  
  function lanzarVentanasErrores() {
    const cantidadVentanas = 100;
    let contador = 0;
  
    const intervalo = setInterval(() => {
      if (contador >= cantidadVentanas) {
        clearInterval(intervalo);
        return;
      }
  
      const ventana = document.createElement("div");
      ventana.classList.add("ventana-error");
      ventana.innerHTML = `<span>⚠️</span><p>Error #${contador + 1}: Sistema comprometido</p>`;
      ventana.style.left = `${Math.random() * 90}%`;
      ventana.style.top = `${Math.random() * 90}%`;
  
      ventana.addEventListener("click", () => ventana.remove());
      ventanasDiv.appendChild(ventana);
  
      contador++;
    }, 30);
  }
  
  function lanzarAnimacionMulta() {
    const fondoRojo = document.createElement("div");
    fondoRojo.classList.add("fondo-alerta");
    fondoRojo.innerHTML = `
      <div class="contenido-alerta">
        <h1>🚔 DGGT - MULTA POR EXCESO DE VELOCIDAD 🚨</h1>
        <p>Gracias por pagar JJAJAJAJ.</p>
        <p style="font-size: 24px; font-weight: bold;">JAJAJA te estafé: 999,99 €</p>
        <p style="color: yellow;">ID de multa: DGGT-983244XKD</p>
      </div>
    `;
    document.body.appendChild(fondoRojo);
    setTimeout(() => fondoRojo.remove(), 6000);
  }
  
  function lanzarAnimacionHack() {
    const terminal = document.createElement("div");
    terminal.classList.add("terminal-hack");
    terminal.innerHTML = `
      <div class="pantalla-terminal">
        <pre id="texto-hackeo"></pre>
      </div>
    `;
    document.body.appendChild(terminal);
  
    const textos = [
      "root@server:~$ sudo nmap -sV 192.168.0.1",
      "Scanning...",
      "Port 22: Open [SSH]",
      "Port 80: Open [HTTP]",
      "Injecting payload...",
      "Access granted!",
      "Downloading datos_personales.zip...",
      "🔥 CONTRASEÑAS ROBADAS 🔥",
      "root@server:~$ exit"
    ];
  
    let i = 0;
    const pre = terminal.querySelector("#texto-hackeo");
    const intervalo = setInterval(() => {
      if (i < textos.length) {
        pre.innerHTML += textos[i] + "\n";
        i++;
      } else {
        clearInterval(intervalo);
        setTimeout(() => terminal.remove(), 5000);
      }
    }, 500);
  }
  
  function marcarComoLeido(index) {
    const item = listaMensajes.children[index];
    if (item) item.classList.add("leido");
    contenidoMensaje.classList.add("oculto");
  }
  
  function moverASpam(index) {
    bandejaSpam.push(mensajes[index]);
    mensajes.splice(index, 1);
    actualizarMensajes();
    contenidoMensaje.classList.add("oculto");
  }
  
  function moverAEliminados(index) {
    bandejaEliminados.push(mensajes[index]);
    mensajes.splice(index, 1);
    actualizarMensajes();
    contenidoMensaje.classList.add("oculto");
  }
  
  function actualizarMensajes() {
    listaMensajes.innerHTML = "";
    listaSpam.innerHTML = "";
    listaEliminados.innerHTML = "";
  
    mensajes.forEach((msg, index) => {
      const item = document.createElement("div");
      item.className = "mensaje-lista";
      item.innerHTML = `<strong>${msg.remitente}</strong><br>${msg.asunto}`;
      item.dataset.index = index;
      item.addEventListener("click", () => mostrarMensaje(index));
      listaMensajes.appendChild(item);
    });
  
    bandejaSpam.forEach((msg) => {
      const item = document.createElement("div");
      item.className = "mensaje-lista";
      item.innerHTML = `<strong>${msg.remitente}</strong><br>${msg.asunto}`;
      listaSpam.appendChild(item);
    });
  
    bandejaEliminados.forEach((msg) => {
      const item = document.createElement("div");
      item.className = "mensaje-lista";
      item.innerHTML = `<strong>${msg.remitente}</strong><br>${msg.asunto}`;
      listaEliminados.appendChild(item);
    });
  }
  // Variables para controlar los mensajes y el botón
let mensajesInteractuados = 0;
const totalMensajes = 2;  // Cambiar esto por el total de mensajes en tu bandeja

// Función que se llama cuando se interactúa con un mensaje
function interactuarConMensaje(id) {
  // Marca el mensaje como leído o interactuado (por ejemplo, tachándolo)
  document.getElementById('message' + id).style.textDecoration = 'line-through'; // Ejemplo visual de interacción

  // Aumenta el contador de mensajes interactuados
  mensajesInteractuados++;

  // Si todos los mensajes han sido interactuados, habilitar el botón
  if (mensajesInteractuados === totalMensajes) {
    document.getElementById('continue-btn').disabled = false;
    // Habilita el botón solo después de haber interactuado con todos los mensajes
  }
}

// Si el usuario intenta hacer clic en el botón antes de que esté habilitado, evitar que funcione
document.getElementById('continue-btn').addEventListener('click', function(event) {
  if (this.disabled) {
    event.preventDefault();  // Evita que se navegue cuando el botón esté deshabilitado
    alert('Debes interactuar con todos los mensajes primero.');
  }
});


  