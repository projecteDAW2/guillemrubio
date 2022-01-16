
document.addEventListener("DOMContentLoaded", () => {
  //Funcion para cargar paginas html dentro de mi html.
  function load(url, element) {
    req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);

    element.innerHTML = req.responseText;
  }

  load("start.html", document.getElementById("partederechajugeo"));

  //obtenemos las referencias del DOM
  const startButton = document.querySelector("#button");
  const width = 20;
  let posicionActualJugador = 270; // sera mi posicion de salida
  let vidas = 3;
  let jugando = false;

  const audioRescatado = new Audio("./audio/rescatado.wav");
  const musicaFondo = new Audio("./audio/melodiaPrincipal.ogg");
  const musicaGameOver = new Audio("./audio/gameOver.ogg");
  const musicaSalenVidas = new Audio("./audio/salenVidas.mp3");
  const musicaPierdeVida = new Audio("./audio/pierdeVida.mp3");
  const corazon1 = document.querySelector(".vida1");
  const corazon2 = document.querySelector(".vida2");
  const corazon3 = document.querySelector(".vida3");
  const temporizador = document.querySelector(".tiempo");
  const containerPrincipal = document.querySelector(".containerPrincipal");
  const containerTitulo = document.querySelector(".containerTitulo");
  const flash = document.querySelector(".flash");
  const letrasEnter = document.querySelector(".textoEnter");
  let puntuacion= 1000;
 const btnSalir=document.querySelector("#btnSalir");
  /*
    @menuPrincipal
    Con esto pasaremos a ver el primer menu del juego.Letras del titulo bajando y una funcion para darle a enter
    y pasar al siguiente sub menu.
    Ponemos tambien la musica de fondo a sonar.

    */


  function pressEnter(e) {
    switch (e.keyCode) {
      //ENTER
      case 13:      
          console.log("Tecla enter");
          containerTitulo.style.opacity = "0%";
          flash.style.animation = " flash 0.3s forwards";
          containerPrincipal.style.opacity = "100%";
          letrasEnter.style.opacity = "0%";
          musicaFondo.loop = true;
          musicaFondo.play();
       
        break;
    }
  }



    document.addEventListener("keydown", pressEnter);
  


  //load("./partesHTML/start.html", document.getElementById("partederechajugeo"));

  startButton.addEventListener("click", () => {
    let seconds = 120;
    let second = 0;

    let interval = setInterval(function () {
      temporizador.firstChild.data = seconds - second;
      if (second >= seconds) {
        vidas = 0;
        clearInterval(interval);
      }

      second++;
    }, 1000);
    /*
        Mi grid esta dividida en 20 columnas y 20 filas. empezando a contar desde 0 hasta 279, en total son 280 casillas.
        */
    load(
      "tablero.html",
      document.getElementById("partederechajugeo")
    );
    

    //load("./partesHTML/navBar.html", document.getElementById("navBar"));
    const cuadricula = document.querySelectorAll(".grid div");
    const fuegoDerecha = document.querySelectorAll(".fuego-derecha");
    const fuegoIzquierda = document.querySelectorAll(".fuego-izquierda");
    const troncoderecha = document.querySelectorAll(".log-derecha");
    const troncodizquierda = document.querySelectorAll(".log-izquierda");
    const ouch = document.querySelector(".ouch");
    const ouch2 = document.querySelector(".ouch2");
    let musicaCorazones = true;

    //animamos los corazones de abajo arriba y suena la musica de la salida de lso corazones
    temporizador.style.animation = "posicionarTemporizador 2s 1";
    temporizador.style.rigth = "110px";
    temporizador.style.opacity = "100%";
    corazon1.style.animation = "posicionarCorazon1 2s 1";
    corazon1.style.top = "180px";
    corazon2.style.animation = "posicionarCorazon2 2.5s 1";
    corazon2.style.top = "292px";
    corazon3.style.animation = "posicionarCorazon3 3s 1";
    corazon3.style.top = "404px";

    //hacemso que solo suene una vez el efecto de salida de corazones.
    if (musicaCorazones) {
      musicaSalenVidas.play();
      musicaCorazones = false;
    }

    jugando = true;
    function movimientoplayer(e) {
      cuadricula[posicionActualJugador].classList.remove("player");

      switch (e.keyCode) {
        //izquierda
        case 37:
          if (posicionActualJugador % width !== 0) {
            posicionActualJugador -= 1;
          }
          console.log("posicion actual del jugador: " + posicionActualJugador);
          break;
        //Arriba
        case 38:
          if (posicionActualJugador - width >= 0) {
            posicionActualJugador -= 20;
          }

          console.log("posicion actual del jugador: " + posicionActualJugador);
          break;
        //Derrecha
        case 39:
          if (posicionActualJugador % width < width - 1) {
            posicionActualJugador += 1;
          }

          console.log("posicion actual del jugador: " + posicionActualJugador);
          break;
        //Abajo
        case 40:
          if (posicionActualJugador >= 260 && posicionActualJugador <= 280) {
            console.log(
              "Estas en la primera linea, no se epuede tirar mas abajo."
            );
            console.log(
              "posicion actual del jugador: " + posicionActualJugador
            );
          } else {
            if (posicionActualJugador + width < width * width)
              posicionActualJugador += 20;
            console.log(
              "posicion actual del jugador: " + posicionActualJugador
            );
          }
          break;
      }
      cuadricula[posicionActualJugador].classList.add("player");
      pierde();
      gana();
    }

    //movimiento fuego
    function autoMoveFuegos() {
      fuegoIzquierda.forEach((fuegoIzquierda) =>
        moverFuegoizquierda(fuegoIzquierda)
      );
      fuegoDerecha.forEach((fuegoDerecha) => moverFuegoderecha(fuegoDerecha));
    }
    //movimiento tronco
    function autoMoveTroncoDerecha() {
      troncoderecha.forEach((troncoderecha) =>
        moverTroncoDerecha(troncoderecha)
      );
    }

    function automoverTroncoIzquierda() {
      troncodizquierda.forEach((troncodizquierda) =>
        moverTroncoIzquierda(troncodizquierda)
      );
    }

    function moverTroncoIzquierda(troncodizquierda) {
      switch (true) {
        case troncodizquierda.classList.contains("l5"):
          troncodizquierda.classList.remove("l5");
          troncodizquierda.classList.add("l4");

          break;
        case troncodizquierda.classList.contains("l1"):
          troncodizquierda.classList.remove("l1");
          troncodizquierda.classList.add("l5");

          break;
        case troncodizquierda.classList.contains("l2"):
          troncodizquierda.classList.remove("l2");
          troncodizquierda.classList.add("l1");

          break;
        case troncodizquierda.classList.contains("l3"):
          troncodizquierda.classList.remove("l3");
          troncodizquierda.classList.add("l2");

          break;
        case troncodizquierda.classList.contains("l4"):
          troncodizquierda.classList.remove("l4");
          troncodizquierda.classList.add("l3");

          break;
      }
    }

    function moverTroncoDerecha(troncoderecha) {
      switch (true) {
        case troncoderecha.classList.contains("l5"):
          troncoderecha.classList.remove("l5");
          troncoderecha.classList.add("l1");
          break;
        case troncoderecha.classList.contains("l1"):
          troncoderecha.classList.remove("l1");
          troncoderecha.classList.add("l2");
          break;
        case troncoderecha.classList.contains("l2"):
          troncoderecha.classList.remove("l2");
          troncoderecha.classList.add("l3");
          break;
        case troncoderecha.classList.contains("l3"):
          troncoderecha.classList.remove("l3");
          troncoderecha.classList.add("l4");
          break;
        case troncoderecha.classList.contains("l4"):
          troncoderecha.classList.remove("l4");
          troncoderecha.classList.add("l5");
          break;
      }
    }

    function moverFuegoizquierda(fuegoIzquierda) {
      pierde();
      switch (true) {
        case fuegoIzquierda.classList.contains("c0"):
          fuegoIzquierda.classList.remove("c0");
          fuegoIzquierda.classList.add("c2");
          break;
        case fuegoIzquierda.classList.contains("c2"):
          fuegoIzquierda.classList.remove("c2");
          fuegoIzquierda.classList.add("c3");
          break;
        case fuegoIzquierda.classList.contains("c3"):
          fuegoIzquierda.classList.remove("c3");
          fuegoIzquierda.classList.add("c4");
          break;
        case fuegoIzquierda.classList.contains("c4"):
          fuegoIzquierda.classList.remove("c4");
          fuegoIzquierda.classList.add("c0");
          break;
      }
    }

    function moverFuegoderecha(fuegoDerecha) {
      pierde();
      switch (true) {
        case fuegoDerecha.classList.contains("c0"):
          fuegoDerecha.classList.remove("c0");
          fuegoDerecha.classList.add("c4");
          break;
        case fuegoDerecha.classList.contains("c2"):
          fuegoDerecha.classList.remove("c2");
          fuegoDerecha.classList.add("c0");
          break;
        case fuegoDerecha.classList.contains("c3"):
          fuegoDerecha.classList.remove("c3");
          fuegoDerecha.classList.add("c2");
          break;
        case fuegoDerecha.classList.contains("c4"):
          fuegoDerecha.classList.remove("c4");
          fuegoDerecha.classList.add("c3");
          break;
      }
    }

    let modulosRecuperados = 0;
    let dawRecuperado = false;
    let damRecuperado = false;
    let marketingRecuperado = false;
    let turismoRecuperado = false;

    function gana() {
      if (
        cuadricula[58].classList.contains("player") &&
        damRecuperado === false
      ) {
        cuadricula[58].classList.remove("moduloDAM");
        damRecuperado = true;
        modulosRecuperados++;
        audioRescatado.play();
      }
      if (
        cuadricula[51].classList.contains("player") &&
        dawRecuperado === false
      ) {
        cuadricula[51].classList.remove("moduloDAW");
        dawRecuperado = true;
        modulosRecuperados++;
        audioRescatado.play();
      }
      if (
        cuadricula[124].classList.contains("player") &&
        marketingRecuperado === false
      ) {
        cuadricula[124].classList.remove("moduloMRK");
        marketingRecuperado = true;
        modulosRecuperados++;
        audioRescatado.play();
      }

      if (
        cuadricula[198].classList.contains("player") &&
        turismoRecuperado === false
      ) {
        cuadricula[198].classList.remove("moduloTURISMO");
        turismoRecuperado = true;
        modulosRecuperados++;
        audioRescatado.play();
      }

      if (modulosRecuperados === 4) {

        puntuacion-=second;//contra mas segundos ha gastado mas puntos le quito
        console.log("GANAS tu puntuacion es: "+puntuacion)
  
        document.cookie="puntuacion="+puntuacion;
        load(
          "ganar.html",
          document.getElementById("partederechajugeo")
        );
        musicaFondo.pause();

        clearInterval(interval);

        cuadricula[posicionActualJugador].classList.remove("player");

        document.removeEventListener("keydown", movimientoplayer);
        const btnJugar2 = document.getElementById("btnVolverJugar2");
        btnJugar2.addEventListener("click", () => {
          location.reload();
        });
      }
    }

    function pierde() {
      if (
        cuadricula[posicionActualJugador].classList.contains("c1") ||
        cuadricula[posicionActualJugador].classList.contains("l1") ||
        cuadricula[posicionActualJugador].classList.contains("l2") ||
        cuadricula[posicionActualJugador].classList.contains("m1") ||
        cuadricula[posicionActualJugador].classList.contains("c0")
      ) {
        // result.innerHTML = 'PIERDES'
        cuadricula[posicionActualJugador].classList.remove("player");
        //cuadricula[posicionActualJugador].classList.add('c4')

        vidas--;

        // load("tablero.html", document.getElementById("partederechajugeo"));

        posicionActualJugador = 270;
        cuadricula[270].classList.add("player");

        if (vidas < 1) {

    
          load(
            "gameOver.html",
            document.getElementById("partederechajugeo")
          );
          temporizador.style.opacity = "0%";
          const btnVolverJugar = document.querySelector("#btnVolverJugar");
          musicaFondo.pause();
          musicaGameOver.play();

          btnVolverJugar.addEventListener("click", () => {
            location.reload();
          });
        }

        //cuadricula[270].classList.add('player')
        //clearInterval(timeId)
        //timerId = 30
        //document.removeEventListener('keydown', movimientoplayer)
        if (vidas === 2) {
          ouch.style.animation = "animationOuch 1.5s forwards";
          musicaPierdeVida.play();
          console.log("vidas 2");
          corazon3.style.animation = "moverCorazon 2s 1";
          corazon3.style.opacity = "0%";
          puntuacion-=150;
        } else if (vidas === 1) {
          ouch2.style.animation = "animationOuch 1.5s forwards";

          ouch.style.animation.play;
          musicaPierdeVida.play();
          console.log("vidas 1");
          corazon2.style.animation = "moverCorazon 2s 1";
          corazon2.style.opacity = "0%";
          puntuacion-=150;
        } else {
          ouch.style.animation = "ouch 1s forwards";
          musicaPierdeVida.play();
          console.log("vidas 0");
          corazon1.style.animation = "moverCorazon 2s 1";
          corazon1.style.opacity = "0%";
        }
      }
    }

    function movimientoTroncoDerecha() {
      if (posicionActualJugador >= 140 && posicionActualJugador < 159) {
        cuadricula[posicionActualJugador].classList.remove("player");
        posicionActualJugador += 1;
        cuadricula[posicionActualJugador].classList.add("player");
      }
    }

    function movimientoTroncoIzquierda() {
      if (posicionActualJugador >= 161 && posicionActualJugador <= 180) {
        cuadricula[posicionActualJugador].classList.remove("player");
        posicionActualJugador -= 1;
        console.log("posicion actual del jugador: " + posicionActualJugador);
        cuadricula[posicionActualJugador].classList.add("player");
      }
    }

    function movimientoPlayerSlider() {
      if (posicionActualJugador >= 81 && posicionActualJugador < 99) {
        cuadricula[posicionActualJugador].classList.remove("player");
        posicionActualJugador += 1;
        console.log("posicion actual del jugador: " + posicionActualJugador);
        cuadricula[posicionActualJugador].classList.add("player");
      }
    }

    //Colocamos la classe .player en l aposicion inicial de salida
    cuadricula[posicionActualJugador].classList.add("player");

    if (jugando) {
      let idFuego = setInterval(autoMoveFuegos, 400);
      console.log("idFuego " + idFuego);

      let idAutomoverTroncoDerecha = setInterval(autoMoveTroncoDerecha, 300);
      let idMovimientoTroncoDerecha = setInterval(movimientoTroncoDerecha, 300);

      let idAutomoverTroncoIzquierda = setInterval(
        automoverTroncoIzquierda,
        300
      );
      let idMovimientoTroncoIzquierda = setInterval(
        movimientoTroncoIzquierda,
        300
      );

      //let idAutomoverSlider = setInterval(automoverSlider, 80)
      let idMovimientoPlayerSlider = setInterval(movimientoPlayerSlider, 80);
      document.addEventListener("keydown", movimientoplayer);
    }
  });
});




