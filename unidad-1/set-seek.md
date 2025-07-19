# Unidad 1

## 🔎 Fase: Set + Seek

## Actividad 01

**¿Qué es el diseño generativo?**
El diseño generativo es un método creativo que usa la programación para generar resultados visuales mediante unas reglas definidas. En lugar de construir manualmente cada parte del diseño, se crea un sistema que produce múltiples soluciones posibles. Es como diseñar un proceso en vez de un solo objeto final.

**¿Qué es el arte generativo?**
Es una forma de creación artística que utiliza un código para generar imágenes, sonidos o experiencias visuales. Nosotros definimos el conjunto de instrucciones, y a partir de eso, el sistema produce obras de arte que pueden llegar ser distintas cada vez. 

**¿Cuál es la diferencia?**
La diferencia principal diría yo que está en el proceso creativo. En el arte y diseño tradicional, la persona creadora tiene control total sobre cada decisión visual. En cambio, en el arte y diseño generativo, se diseña un sistema que produce múltiples resultados, metiéndo la aleatoriedad y la autonomía de la máquina. Esto cambia el rol del creador: ya no se trata tanto de crear una pieza única, sino de establecer las condiciones para que muchas versiones surjan de manera automatizada o semi-automática.

**¿Qué posibilidades crees que esto puede ofrecer a tu perfil profesional?**
Creo que el diseño y arte generativo pueden ampliar mucho mi forma de pensar la creatividad. Me interesa especialmente cómo estas herramientas permiten experimentar con grandes volúmenes de ideas visuales en poco tiempo, o crear sistemas que respondan al entorno, al usuario o a datos en tiempo real. Desde un punto de vista profesional, me parece que puede ser muy útil en áreas como el diseño interactivo, la visualización de datos, el arte digital, e incluso en brandin. 



---

## Actividad 02

**Antes de lo que hemos discutido, ¿qué pensabas que hacía un Ingeniero en Diseño de Entretenimiento Digital con énfasis en experiencias interactivas?**
Antes de estas discusiones y ejemplos, mi idea del rol de un ingeniero en diseño de entretenimiento digital era más limitada. Pensaba principalmente en el desarrollo de videojuegos, animaciones o aplicaciones interactivas, con un enfoque técnico y estético. Lo veía como alguien que programaba experiencias visuales o interactivas atractivas, combinando arte digital y tecnología. Sin embargo, ahora veo que se trata de crear sistemas de interacción que involucran emociones, narrativa, inmersión y, sobre todo, participación activa del usuario.

**¿Qué potencial le ves al diseño e implementación de experiencias inmersivas colectivas?**
Veo un enorme potencial en las experiencias inmersivas colectivas. Nos permiten romper con los formatos tradicionales de consumo cultural (como ver una película o jugar un juego en solitario) y nos invitan a vivir el contenido de manera compartida y activa. Estas experiencias generan conexiones más profundas  y emociones entre las personas, ya que el público no solo observa, sino que forma parte de la narrativa. Además, combinando tecnología como sensores, proyecciones, sonido espacial o realidad aumentada, se pueden diseñar entornos que cambian según cómo interactúe la gente, creando momentos únicos, irrepetible y muy significativos; haciendo que cada usuario viva la experiencia de manera unica. 

**Nosotros estamos definiendo en TIEMPO REAL una nueva forma de expresión, una nueva forma de interactuar de manera colectiva. Estamos diseñando nuevas maneras de contar historias e interactuar con ellas. ¿Cómo te ves profesionalmente en este escenario?**
Me emociona mucho ser parte de este momento. Profesionalmente, me imagino participando en proyectos donde el límite entre arte, tecnología y experiencia se disuelve. Quiero aprender a crear entornos interactivos que respondan al movimiento, al sonido o a las emociones de las personas. Me veo diseñando experiencias inmersivas que combinen narrativas no lineales, interacción colectiva y visuales generativas. Siento que en este campo no solo se trata de entretener, sino también de provocar reflexión, conexión y nuevas formas de comunicación.


---

## Actividad 03

**Experimento seleccionado:**
[https://editor.p5js.org/generative-design/sketches/ByZZgqcqpk4](http://www.generative-gestaltung.de/2)

**Mi versión modificada:**
https://editor.p5js.org/just_gamb04/sketches/NWedwU2du

### ¿Cómo funciona?

Genera un comportamiento visual que recorre la pantalla dejando un rastro circular. El número de movimientos que realiza por cada ciclo se controla con la posición del mouse en el eje X. A mayor valor en X (mayor posición en la derecha), mayor número de repeticiones, lo que da la sensación de mayor velocidad de dibujo.
El trazo se forma con base en estas decisiones aleatorias, entonces, cada ejecución produce una composición distinta.

### ¿Qué parámetro modifiqué?

Decidí modificar el parámetro `diameter`, que controla el tamaño de los círculos. Lo vinculé a la posición vertical del mouse (`mouseY`) utilizando la función `map()`, para que el tamaño de los trazos se pueda ajustar en tiempo real dependiendo de la altura del cursor.
También cambié el color del trazo a un azul claro (`fill(0, 150, 255, 50)`).

### ¿Cómo podría servir esto para el proyecto del curso?

Este tipo de lógica generativa puede ser útil en el desarrollo de experiencias inmersivas que respondan al comportamiento de los usuarios. Me interesa cómo un sistema aparentemente simple puede producir resultados complejos y visualmente ricos. En el contexto de una instalación colectiva, podríamos usar este tipo de agentes para visualizar en tiempo real los movimientos del público, entradas sonoras, o datos captados por sensores, generando patrones visuales únicos e irrepetibles. 
Mi idea del proyecto del curso va muy ligado a la interacción con las emociones del usuario, por lo que me serviría poder aliniar esto a otros parámetros como la frecuencia cardíaca, temperatura, entre otras cosas para determinar el color, fuerza de trazo y velocidad de dibujo.

### Código completo (versión modificada)

```javascript
// P_2_2_1_01 MODIFICADO
//
// Generative Gestaltung – Creative Coding im Web
// Versión modificada por estudiante para la Actividad 03

'use strict';

var NORTH = 0;
var NORTHEAST = 1;
var EAST = 2;
var SOUTHEAST = 3;
var SOUTH = 4;
var SOUTHWEST = 5;
var WEST = 6;
var NORTHWEST = 7;
var direction;

var stepSize = 1;
var diameter = 1;

var posX;
var posY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  fill(0, 40);
  posX = width / 2;
  posY = height / 2;
  background(255); // Fondo blanco para mejorar contraste
}

function draw() {
  // El diámetro depende de la posición vertical del mouse
  diameter = map(mouseY, 0, height, 1, 20);
  // Color azul con transparencia
  fill(0, 150, 255, 50);

  for (var i = 0; i <= mouseX; i++) {
    direction = int(random(0, 8));

    if (direction == NORTH) {
      posY -= stepSize;
    } else if (direction == NORTHEAST) {
      posX += stepSize;
      posY -= stepSize;
    } else if (direction == EAST) {
      posX += stepSize;
    } else if (direction == SOUTHEAST) {
      posX += stepSize;
      posY += stepSize;
    } else if (direction == SOUTH) {
      posY += stepSize;
    } else if (direction == SOUTHWEST) {
      posX -= stepSize;
      posY += stepSize;
    } else if (direction == WEST) {
      posX -= stepSize;
    } else if (direction == NORTHWEST) {
      posX -= stepSize;
      posY -= stepSize;
    }

    if (posX > width) posX = 0;
    if (posX < 0) posX = width;
    if (posY < 0) posY = height;
    if (posY > height) posY = 0;

    ellipse(posX + stepSize / 2, posY + stepSize / 2, diameter, diameter);
  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('generative_sketch', 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    clear();
    background(255); // Fondo blanco al limpiar
  }
}
```

---

## Actividad 04

**Mi sketch en p5.js:**
https://editor.p5js.org/just_gamb04/sketches/YGGfc9Vl9

### ¿Qué hace el experimento?

Genera figuras geométricas como el círculo, cuadrado o triángulo, con características aleatorias pero controladas por la posición del mouse. Solo se dibuja un tipo de figura a la vez, y este tipo puede cambiar al hacer clic.

### Documentación de los cambios realizados

#### 1. **Generación básica de figuras aleatorias**

Primero escribí un `for` que dibuja varias figuras por cuadro. La cantidad es aleatoria, y cada forma tiene una posición, color y tamaño también aleatorios. Usé `ellipse()`, `rect()` y `triangle()`.

```javascript
let shapeType = 0;
```

#### 2. **Control de cantidad con `mouseX`**

Modifiqué la cantidad de formas generadas en cada `draw()` en función de la posición horizontal del mouse.

```javascript
let cantidad = int(map(mouseX, 0, width, 1, 20));
```

Esto permitió que mover el cursor hacia la derecha aumente la velocidad de dibujo.

#### 3. **Control de tamaño con `mouseY`**

Después agregué un mapeo de la posición vertical del mouse (`mouseY`) para ajustar el tamaño de las formas.

```javascript
let size = map(mouseY, 0, height, 10, 100);
```

#### 4. **Posicionamiento basado en el cursor**

Las figuras ya no se generan en todo el canvas, sino cerca del cursor, con un poco de aleatoriedad para que no estén exactamente en el mismo punto.

```javascript
let offsetX = random(-20, 20);
let offsetY = random(-20, 20);
let x = mouseX + offsetX;
let y = mouseY + offsetY;
```

#### 5. **Control de figura activa con clic**

Por último, implementé la lógica para que el usuario pueda alternar entre formas geométricas con solo hacer clic.

```javascript
function mousePressed() {
  shapeType = (shapeType + 1) % 3;
}
```

Cada clic cambia el tipo de figura entre:
0 = círculo, 1 = cuadrado, 2 = triángulo


#### 6. **Teclas para guardar o limpiar**

Agregué funciones básicas para guardar la imagen (`S`) y limpiar la pantalla (`Backspace` o `Delete`).

```javascript
function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('forma_unica_controlada', 'png');
  if (keyCode === BACKSPACE || keyCode === DELETE) {
    background(255);
  }
}
```

### Código final completo

```javascript
let shapeType = 0; // 0 = círculo, 1 = cuadrado, 2 = triángulo

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(255);
}

function draw() {
  let cantidad = int(map(mouseX, 0, width, 1, 20));
  let size = map(mouseY, 0, height, 10, 100);

  for (let i = 0; i < cantidad; i++) {
    fill(random(255), random(255), random(255), 150);

    let offsetX = random(-20, 20);
    let offsetY = random(-20, 20);
    let x = mouseX + offsetX;
    let y = mouseY + offsetY;

    if (shapeType == 0) {
      ellipse(x, y, size, size);
    } else if (shapeType == 1) {
      rect(x, y, size, size);
    } else if (shapeType == 2) {
      triangle(
        x, y,
        x + size, y,
        x + size / 2, y - size
      );
    }
  }
}

function mousePressed() {
  shapeType = (shapeType + 1) % 3;
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('forma_unica_controlada', 'png');
  if (keyCode === BACKSPACE || keyCode === DELETE) {
    background(255);
  }
}
```

### Reflexión final

Este experimento me ayudó a comprender cómo diseñar experiencias generativas interactivas, donde el usuario tiene control sobre lo que ocurre en pantalla. Me parece muy útil como base para instalaciones en las que el público pueda "dibujar" con su cuerpo, el sonido o incluso dispositivos táctiles.

