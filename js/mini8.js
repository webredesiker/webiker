document.addEventListener("DOMContentLoaded", function () {
  // ⬇️ Añadir las imágenes de vidas buenas
  const imagenesVida = [
    { src: "../imagenes/unpoco2.png", clase: "imagen1" },
    { src: "../imagenes/casimitad2.png", clase: "imagen2" },
    { src: "../imagenes/amarillo2.png", clase: "imagen3" },
    { src: "../imagenes/rojo2.png", clase: "imagen4" },
    { src: "../imagenes/sinvida2.png", clase: "imagen5" }
  ];

  imagenesVida.forEach((imgData, index) => {
    const img = document.createElement("img");
    img.src = imgData.src;
    img.className = imgData.clase;
    img.alt = `Imagen ${index + 1}`;
    img.id = `imagen${index + 1}`;
    img.style.position = "absolute";
    img.style.top = "136px";
    img.style.left = "-4px";
    img.style.width = "610px";
    img.style.height = "auto";
    img.style.display = "none";
    img.style.zIndex = "5";
    document.body.appendChild(img);
  });

  // ⬇️ Añadir las imágenes de daño (malas)
  const imagenesDanio = [
    { src: "../imagenes/vida-unpoco.png", id: "dano1" },
    { src: "../imagenes/vidaantesmitad.png", id: "dano2" },
    { src: "../imagenes/amarillo.png", id: "dano3" },
    { src: "../imagenes/rojo.png", id: "dano4" },
    { src: "../imagenes/sinvida.png", id: "dano5" }
  ];

  imagenesDanio.forEach((imgData) => {
    const img = document.createElement("img");
    img.src = imgData.src;
    img.id = imgData.id;
    img.style.position = "absolute";
    img.style.top = "437.5px"; // Ajusta la posición y tamaño como quieras
    img.style.left = "1110px";
    img.style.width = "422px";
    img.style.height = "auto";
    img.style.display = "none";
    img.style.zIndex = "6"; // Encima de las otras imágenes
    document.body.appendChild(img);
  });

  let vida = 5;
  let errores = 0; // Para contar cuántos errores ha cometido

  const mensaje = document.createElement("div");
  document.body.appendChild(mensaje);

  const gruposBotones = [
    ['boton1', 'boton2', 'boton3', 'boton4'],
    ['boton5', 'boton6', 'boton7', 'boton8'],
    ['boton9', 'boton10', 'boton11', 'boton12'],
    ['boton13', 'boton14', 'boton15', 'boton16'],
    ['boton17', 'boton18', 'boton19', 'boton20']
  ];

  const botonesBuenos = {
    'boton3': { grupo: 0, imagen: 'imagen1' },
    'boton5': { grupo: 1, imagen: 'imagen2' },
    'boton10': { grupo: 2, imagen: 'imagen3' },
    'boton16': { grupo: 3, imagen: 'imagen4' },
    'boton18': { grupo: 4, imagen: 'imagen5', esFinal: true }
  };

  function mostrarGrupo(grupoIndex) {
    if (grupoIndex >= 0 && grupoIndex < gruposBotones.length) {
      gruposBotones[grupoIndex].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.style.display = 'block';
      });
    }
  }

  function ocultarGrupo(grupoIndex) {
    if (grupoIndex >= 0 && grupoIndex < gruposBotones.length) {
      gruposBotones[grupoIndex].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.style.display = 'none';
      });
    }
  }

  function mostrarImagen(imagenId) {
    const img = document.getElementById(imagenId);
    if (img) img.style.display = 'block';
  }

  function mostrarImagenDanio(errorIndex) {
    const img = document.getElementById('dano' + (errorIndex + 1));
    if (img) img.style.display = 'block';
  }

  // Ocultar todas las imágenes inicialmente
  for (let i = 1; i <= 5; i++) {
    const img = document.getElementById('imagen' + i);
    if (img) img.style.display = 'none';
    const imgDanio = document.getElementById('dano' + i);
    if (imgDanio) imgDanio.style.display = 'none';
  }

  gruposBotones.flat().forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.style.display = 'none';
      btn.addEventListener('click', function () {
        manejarClick(id);
      });
    }
  });

  function manejarClick(botonId) {
    if (botonesBuenos[botonId]) {
      const info = botonesBuenos[botonId];
      ocultarGrupo(info.grupo);
      mostrarImagen(info.imagen);
      if (!info.esFinal) {
        mostrarGrupo(info.grupo + 1);
      } else {
        mensaje.innerText = '';
        mensaje.style.color = 'green';
      }

      // Si es el botón 5, redirigir después de 6 segundos
      if (botonId === 'boton5') {
        setTimeout(() => {
          window.location.href = '../html/intro9.html'; // Redirige a mini9.html después de 6 segundos
        }, 11000); // 6000 milisegundos = 6 segundos
      }
    } else {
      vida--;
      mostrarImagenDanio(errores); // Mostrar la imagen de daño correspondiente
      errores++;
      if (vida <= 0) {
        mensaje.innerText = '';
        mensaje.style.color = 'red';

        // Desactivar todos los botones al perder
        gruposBotones.flat().forEach((id) => {
          const btn = document.getElementById(id);
          if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.5'; // opcional: para indicar que ya no funcionan
            btn.style.cursor = 'not-allowed'; // opcional
          }
        });
      } else {
        mensaje.innerText = ``;
        mensaje.style.color = 'orange';
      }
    }
  }

  mostrarGrupo(0);
});

// Esperamos que el usuario haga clic o toque en cualquier parte de la pantalla
document.body.addEventListener('click', () => {
  // Reproducir la música
  const musica = document.getElementById('sonidoEvento');
  musica.play();
});
