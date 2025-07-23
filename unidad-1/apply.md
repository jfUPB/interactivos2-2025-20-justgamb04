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


Aquí tienes la **Etapa 4 – Convertir (Convert)** del método de deconstrucción/reconstrucción, redactada como un estudiante de Ingeniería en Diseño de Entretenimiento Digital:

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

Así tengo más control sobre el grosor según el ancho del canvas. También hice lo mismo con `mouseY`.

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

###  3. Cambio de color dinámico y aleatorio:

```js
stroke(random(100, 255), random(100, 255), random(100, 255), 150);
```

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

