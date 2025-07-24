# Unidad 1

## 🛠 Fase: Apply

## Etapa 1 - Seleccionar

**Ejemplo seleccionado:**
[Generative Design – P\_2\_1\_1\_01](http://www.generative-gestaltung.de/2/sketches/?01_P/P_2_1_1_01)

---

## Etapa 2 – Descripción

**¿Qué hace este sketch exactamente?**

Este sketch genera una cuadrícula de líneas diagonales que van de la esquina inferior izquierda a la superior derecha y de inferior derecha a superior izquierda. Las líneas por lo que se puede ver, su grosor es determinado por la posición del mouse, el movimiento en Y (`mouseY`) determina el grosor de las que van desde la esquina inferior izquierda a la superior derecha y la posicion del mouse en x (`mouseX`) las otras.
También se logra notar que al hacer clic izquierdo, el patrón de las lineas cambia de manera aleatorea, nunca es el mismo patrón.
Además, al presionar ciertas teclas (por ejemplo la `s`) se puede guardar una imagen del resultado, y con la tecla `delete` se limpia la pantalla.

---

### **Etapa 3 – Análisis**
El código genera una cuadrícula de 20 x 20 (`tileCount = 20`) y dentro de cada celda se dibuja una línea diagonal. El comportamiento aleatorio se controla con una semilla (`actRandomSeed`), mantiene el mismo "patrón" de líneas hasta que se haga clic izquierdo.

#### Hay dos tipos de líneas posibles:
De la esquina inferior izquierda a la superior derecha y De la esquina inferior derecha a la superior izquierda. La variable `toggle` es la encargada de decidir, de forma aleatoria, cuál de esas dos líneas se dibuja en cada celda. Se genera con `int(random(0, 2))`, lo que significa que tendrá un valor de 0 o 1.

El `mouseX` y el `mouseY` controlan el grosor (`strokeWeight`) de las líneas, pero lo hacen de forma diferenciada:
Si el `toggle` es 0 (es decir, si se dibuja una línea de la esquina inferior derecha a la superior izquierda), el grosor de esa línea depende del valor de `mouseX`.
Si el `toggle` es 1 (línea de la esquina inferior izquierda a la superior derecha), el grosor depende de `mouseY`. Dando parte del control al usuario, pues al mover el mouse modifica visualmente el patrón, pero no cambia la estructura (las líneas se mantienen en el mismo lugar hasta que se hace clic).

Mirando el codigo, logré notar que había opciones con las teclas 1, 2 y 3:

```javascript
function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  if (key == '1') actStrokeCap = ROUND;
  if (key == '2') actStrokeCap = SQUARE;
  if (key == '3') actStrokeCap = PROJECT;
}
```

Con estas, se puede cambiar la forma en que terminan las líneas con las teclas 1, 2 o 3 (`ROUND`, `SQUARE`, `PROJECT`). cambia el estilo visual del trazo.

---

### **Etapa 4 – Convertir**

#### Cambios que hice:

1. **Modifiqué el tamaño de la cuadrícula**

   ```javascript
   var tileCount = 40;
   ```

   Quería ver cómo se comporta el patrón con más divisiones. El resultado fue un patrón más denso, casi como una textura. Esto me permitió entender mejor cómo cada línea individual afecta al todo.

   
3. **Agregué color a las líneas**
   Esto no estaba en el código original, pero quería ver si el color le daba otra dimensión visual al patrón.

   ```javascript
   stroke(random(100, 255), random(100, 255), random(100, 255));
   ```

   El color es completamente aleatorio por ahora. Esto le da un estilo más dinámico y menos formal al patrón.

4. **Aumenté el rango de `strokeWeight`**
   Cambié la división del `mouseX / 20` por algo más sensible:

   ```javascript
   strokeWeight(map(mouseX, 0, width, 1, 10));
   ```

Así tengo más control sobre el grosor según el ancho. También lo hice con `mouseY`.

quedando el codigo así: 


```javascript
// P_2_1_1_01 - Modificado en Etapa 4: Convertir

'use strict';

var tileCount = 40; // Más divisiones para un patrón más denso
var actRandomSeed = 0;
var actStrokeCap;

function setup() {
  createCanvas(600, 600);
  actStrokeCap = ROUND;
}

function draw() {
  background(255); // Fondo blanco para más limpieza visual
  strokeCap(actStrokeCap);

  randomSeed(actRandomSeed);

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {

      var posX = width / tileCount * gridX;
      var posY = height / tileCount * gridY;

      var toggle = int(random(0, 2));

      // Color aleatorio en cada línea
      stroke(random(100, 255), random(100, 255), random(100, 255));

      if (toggle == 0) {
        strokeWeight(map(mouseX, 0, width, 1, 10));
        line(posX, posY, posX + width / tileCount, posY + height / tileCount);
      } else {
        strokeWeight(map(mouseY, 0, height, 1, 10));
        line(posX, posY + width / tileCount, posX + height / tileCount, posY);
      }
    }
  }
}

function mousePressed() {
  actRandomSeed = random(100000); // Cambia la semilla aleatoria
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == '1') actStrokeCap = ROUND;
  if (key == '2') actStrokeCap = SQUARE;
  if (key == '3') actStrokeCap = PROJECT;
}
```


aqui se pueden notar todos los cambios:
<img width="1284" height="548" alt="image" src="https://github.com/user-attachments/assets/7c5b9f84-34d3-4d91-90f9-beeb1e22c70f" />
https://editor.p5js.org/just_gamb04/sketches/VoSivHzuX

---

## Etapa 5 - Explorar

## Version de explore

https://editor.p5js.org/just_gamb04/sketches/d6scQI8wh

##  Cambios

### 1. Introducción de `noise()` para alterar la posición inicial de cada línea:

```js
let offsetX = map(noise(gridX * 0.1, gridY * 0.1, frameCount * 0.01), 0, 1, -10, 10);
let offsetY = map(noise(gridY * 0.1, gridX * 0.1, frameCount * 0.01), 0, 1, -10, 10);
```

Esto hace que las líneas tiemblen o se "organicen" de forma más natural.

### 2. Animación con `frameCount`:

```js
strokeWeight((mouseX + sin(frameCount * 0.05) * 50) / 40);
```

Esto permite que el grosor varíe en el tiempo, generando movimiento visual.

<img width="592" height="456" alt="image" src="https://github.com/user-attachments/assets/019afa69-f614-4521-b89b-b370c36c866d" />


###  3. Cambio de color dinámico y aleatorio:

```js
stroke(random(100, 255), random(100, 255), random(100, 255), 150);
```
<img width="1147" height="590" alt="image" src="https://github.com/user-attachments/assets/ed8decc2-8993-4fbb-afe8-2dbd7f823726" />

## Código modificado
```js
'use strict';

var tileCount = 20;
var actRandomSeed = 0;
var actStrokeCap;

function setup() {
  createCanvas(600, 600);
  colorMode(RGB);
  actStrokeCap = ROUND;
}

function draw() {
  clear();
  strokeCap(actStrokeCap);
  randomSeed(actRandomSeed);

  let stepSize = width / tileCount;

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {

      let posX = stepSize * gridX;
      let posY = stepSize * gridY;

      // Offsets generados con noise
      let offsetX = map(noise(gridX * 0.1, gridY * 0.1, frameCount * 0.01), 0, 1, -10, 10);
      let offsetY = map(noise(gridY * 0.1, gridX * 0.1, frameCount * 0.01), 0, 1, -10, 10);

      let toggle = int(random(0, 3));

      stroke(random(100, 255), random(100, 255), random(100, 255), 150);

      if (toggle == 0) {
        strokeWeight((mouseX + sin(frameCount * 0.05) * 50) / 40);
        line(posX + offsetX, posY + offsetY, posX + stepSize + offsetX, posY + stepSize + offsetY);
      }

      if (toggle == 1) {
        strokeWeight((mouseY + cos(frameCount * 0.05) * 50) / 40);
        line(posX + offsetX, posY + stepSize + offsetY, posX + stepSize + offsetX, posY + offsetY);
      }

      if (toggle == 2) {
        strokeWeight(1);
        noFill();
        curve(posX, posY, posX, posY, posX + stepSize + offsetX, posY + stepSize + offsetY, posX + 10, posY + 10);
      }
    }
  }
}

function mousePressed() {
  actRandomSeed = random(100000);
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == '1') actStrokeCap = ROUND;
  if (key == '2') actStrokeCap = SQUARE;
  if (key == '3') actStrokeCap = PROJECT;
}
```

---

##  Etapa 6 - Tinker

### Cambios realizados 

### Estilos de linea

implementé tres estilos de lineas distintos que se activan dependiendo de la posicion del mouse en X.

#### 1. Estilo 1:
<img width="1300" height="554" alt="image" src="https://github.com/user-attachments/assets/4ca7ce58-9678-4313-95f2-b53f15cb3aaf" />

Cuando el mouse está en la parte izquierda, se dibujan líneas diagonales tradicionales similares al patrón original, pero con peso variable y desplazamiento.

```js
if (toggle == 0) {
  strokeWeight(map(mouseX, 0, width, 0.5, 5));
  line(posX, posY, posX + stepSize + shapeOffsetX, posY + stepSize + shapeOffsetY);
}
```

#### 2. Estilo 2:
<img width="1284" height="603" alt="image" src="https://github.com/user-attachments/assets/802d69d9-f1bb-4ed4-8b0e-3ca96c8fc1fc" />

Cuando el mouse está en el centro, se invierte la dirección de la línea diagonal.
```js
else if (toggle == 1) {
  strokeWeight(map(mouseY, 0, height, 0.5, 5));
  line(posX, posY + stepSize + shapeOffsetY, posX + stepSize + shapeOffsetX, posY);
}
```

#### 3. Estilo 3:
<img width="1291" height="595" alt="image" src="https://github.com/user-attachments/assets/f7fae02e-550e-44ea-a646-0dab8b9b32de" />

Cuando el mouse se encuentra en el último tercio (derecha), se generan curvas suaves que aportan **organicidad** al patrón y lo alejan completamente del diseño original de líneas rectas.

```js
else if (toggle == 2) {
  strokeWeight(1.5 + sin(frameCount * 0.1 + gridX + gridY) * 1.5);
  curve(
    posX - 20, posY + 20,
    posX, posY,
    posX + stepSize + shapeOffsetX, posY + stepSize + shapeOffsetY,
    posX + 30, posY - 30
  );
}
```

Estos tres modos se seleccionan con esto:

```js
let toggle;
if (mouseX < width / 3) toggle = 0;
else if (mouseX < 2 * width / 3) toggle = 1;
else toggle = 2;
```


### Desplazamiento constante

Agregué dos variables `offsetX` y `offsetY` que modifican continuamente la posición del patrón, generando un efecto de movimiento.

```js
let offsetX = 0;
let offsetY = 0;
let dirX = 0;
let dirY = 1; // Dirección inicial: abajo
```

En cada frame se actualizan estas variables:

```js
offsetX += dirX;
offsetY += dirY;
```

### **Control de dirección con el teclado**

Redefiní las teclas `1`, `2`, `3` y `4` para cambiar la dirección del desplazamiento envés de que cambie los bordes:

```js
if (key == '1') { dirX = 0; dirY = 1; }    // abajo  
if (key == '2') { dirX = 0; dirY = -1; }   // arriba  
if (key == '3') { dirX = 1; dirY = 0; }    // derecha  
if (key == '4') { dirX = -1; dirY = 0; }   // izquierda  
```
<img width="1297" height="593" alt="image" src="https://github.com/user-attachments/assets/6c2548dc-a85b-4fad-8c0a-b9cf0fd1e2b8" />
<img width="1304" height="600" alt="image" src="https://github.com/user-attachments/assets/69105d04-8a53-46fc-bbdc-de0903cf7b7c" />



### **Reaparición infinita del patrón**

Al inicio el patrón al desplazarlo, no volvía a aparecer, por lo que para evitrar esto y que se quede la pantalla vacía. usé `modulo (%)` para envolver las posiciones haciendo que parezca infinito:
```js
let posX = (baseX + width) % width;
let posY = (baseY + height) % height;
```

### Ondas y curvas

Añadí ondas usando `sin()` y `cos()` para simular un movimiento orgánico como si fueran olas:

```js
let waveX = sin(frameCount * 0.01 + gridX) * 10;
let waveY = cos(frameCount * 0.01 + gridY) * 10;
```

```js
curve(
  posX - 20, posY + 20,
  posX, posY,
  posX + stepSize + shapeOffsetX, posY + stepSize + shapeOffsetY,
  posX + 30, posY - 30
);
```

### distintos colores

Puse que con `colorMode(HSB)` el patron de lineas tuviera colores dependientes del tiempo y la posición:

```js
colorMode(HSB, 360, 100, 100, 100);

stroke(
  map(gridX, 0, tileCount, 100, 255),
  map(gridY, 0, tileCount, 100, 255),
  map(sin(frameCount * 0.01), -1, 1, 100, 255),
  100
);
```
## Versión reconstruida

https://editor.p5js.org/just_gamb04/sketches/3xys16hU6

##  Código completo 

```js
'use strict';

let tileCount = 20;
let actStrokeCap;
let actRandomSeed = 0;

let offsetX = 0;
let offsetY = 0;
let dirX = 0;
let dirY = 1; // Dirección inicial: abajo

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 100);
  actStrokeCap = ROUND;
  strokeCap(actStrokeCap);
  noFill();
}

function draw() {
  clear();
  randomSeed(actRandomSeed);

  let stepSize = width / tileCount;

  offsetX += dirX;
  offsetY += dirY;

  for (let gridY = 0; gridY < tileCount; gridY++) {
    for (let gridX = 0; gridX < tileCount; gridX++) {

      let waveX = sin(frameCount * 0.01 + gridX) * 10;
      let waveY = cos(frameCount * 0.01 + gridY) * 10;

      let baseX = (gridX * stepSize + offsetX + waveX) % width;
      let baseY = (gridY * stepSize + offsetY + waveY) % height;

      let posX = (baseX + width) % width;
      let posY = (baseY + height) % height;

      let shapeOffsetX = random(-10, 10);
      let shapeOffsetY = random(-10, 10);

      stroke(
        map(gridX, 0, tileCount, 100, 255),
        map(gridY, 0, tileCount, 100, 255),
        map(sin(frameCount * 0.01), -1, 1, 100, 255),
        100
      );

      let toggle;
      if (mouseX < width / 3) toggle = 0;
      else if (mouseX < 2 * width / 3) toggle = 1;
      else toggle = 2;

      if (toggle == 0) {
        strokeWeight(map(mouseX, 0, width, 0.5, 5));
        line(posX, posY, posX + stepSize + shapeOffsetX, posY + stepSize + shapeOffsetY);
      } else if (toggle == 1) {
        strokeWeight(map(mouseY, 0, height, 0.5, 5));
        line(posX, posY + stepSize + shapeOffsetY, posX + stepSize + shapeOffsetX, posY);
      } else if (toggle == 2) {
        strokeWeight(1.5 + sin(frameCount * 0.1 + gridX + gridY) * 1.5);
        curve(
          posX - 20, posY + 20,
          posX, posY,
          posX + stepSize + shapeOffsetX, posY + stepSize + shapeOffsetY,
          posX + 30, posY - 30
        );
      }
    }
  }
}

function mousePressed() {
  actRandomSeed = random(100000); // Cambia aleatoriedad
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  // Direcciones de desplazamiento
  if (key == '1') { dirX = 0; dirY = 1; }    // abajo
  if (key == '2') { dirX = 0; dirY = -1; }   // arriba
  if (key == '3') { dirX = 1; dirY = 0; }    // derecha
  if (key == '4') { dirX = -1; dirY = 0; }   // izquierda
}
```

---

### Etapa 7 – Reflect

Siendo sincero, desde el inicio de esta actividad quise llevar el ejemplo base en una dirección mucho más viva. Mi objetivo fue que la generación visual se sintiera como algo vivo.
Por eso comencé a experimentar con el movimiento. Quería que las líneas se desplazaran, que parecieran latir y moverse. Esa fue la principal razón por la que implementé desplazamientos continuos, direcciones variables controladas por el usuario, y también una reaparición infinita que hiciera la ilusión de que el sistema es ifnito. 
No quería quedarme con una estética monocromática y estática. La emoción humana es color, es movimiento, es vibración. En ese sentido, los colores que varían aleatoriamente y se combinan con las líneas curvas, rectas e invertidas aportan a el objetivo de que se sienta vivo.
Yo quiero explorar y diseñar para crear imágenes que puedan traducir emociones humanas. Y para mí, una emoción no puede ser una figura estática en blanco y negro. Una emoción se expresa en fluctuaciones, intensidad, ritmo y movimiento, eso es lo que traté de lograr en este código. 
Esta etapa me enseñó que el diseño generativo no solo tiene que ver con estética o repetición visual, sino que pudo darme un buen acercamiento para tener la capacidad de representar conceptos abstractos, como la emoción, a través de formas en movimiento. Siento que esto fue un primer paso hacia esa dirección.


