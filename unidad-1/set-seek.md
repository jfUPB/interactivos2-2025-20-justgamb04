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

¡Con gusto! Aquí tienes toda la **Bitácora de la Actividad 03** completa, clara y lista para entregar, incluyendo el análisis, tu experimento y el **código funcional corregido**.

---

## Actividad 03

 **Ejemplo original analizado:**
[P\_2\_2\_4\_01 – Circle Packing (Generative Design)](http://www.generative-gestaltung.de/2/sketches/?01_P/P_2_2_4_01)

 **Mi versión modificada del experimento en p5.js:**
(https://editor.p5js.org/just_gamb04/sketches/8E9nN87Lq)
### Análisis de funcionamiento

El ejemplo original está basado en un sistema de **agregación por difusión limitada**, donde los círculos se colocan uno al lado del otro siguiendo reglas simples, creando estructuras visuales orgánicas. Cada círculo nuevo se genera alrededor del anterior más cercano, y este proceso se repite hasta llegar a un número máximo de círculos.

Este enfoque es muy útil para explorar conceptos como crecimiento, conexión y ocupación del espacio.

### Modificaciones realizadas

Para hacer el ejemplo más interactivo y visualmente atractivo, modifiqué la lógica para que:

1. **Los círculos se generen alrededor del mouse**, en vez de en posiciones aleatorias del canvas.
2. **Los colores sean aleatorios en modo HSB** con transparencia, dando una estética más viva y dinámica.
3. **Los círculos crezcan progresivamente** hasta tocar el borde del lienzo o a otro círculo.
4. **El sketch se reinicie automáticamente** una vez que se alcanza un número determinado de círculos (`maxCircles`), creando una animación cíclica continua.

### Aplicación al proyecto del curso

Este tipo de sistema generativo tiene mucho potencial para el diseño de **experiencias inmersivas e interactivas**. La lógica de generación autónoma puede ser aplicada para visualizar datos de los participantes, representar actividad en un espacio físico o digital, o simplemente como fondo visual reactivo en tiempo real.

Imagino usar este tipo de código como base para instalaciones donde los movimientos del público (detectados por sensores, cámaras o micrófonos) generen formas en tiempo real, conectando a los usuarios con la visualidad del sistema de forma directa y colectiva.


### Código modificado en p5.js

```javascript
let circles = [];
let maxCircles = 500; // cantidad máxima antes de reiniciar
let attempts = 10;

function setup() {
  createCanvas(800, 800);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
}

function draw() {
  let count = 0;
  while (count < 5) {
    let newCircle = createCircle(mouseX, mouseY);
    if (newCircle !== null) {
      circles.push(newCircle);
      count++;
    } else {
      break; // Si no encuentra espacio, detiene el intento
    }
  }

  for (let c of circles) {
    if (c.growing) {
      if (c.edges() || c.hasCollided(circles)) {
        c.growing = false;
      } else {
        c.radius += 0.5;
      }
    }
    c.display();
  }

  // Reinicia automáticamente cuando llega al máximo definido
  if (circles.length >= maxCircles) {
    resetSketch();
  }
}

function createCircle(x, y) {
  for (let i = 0; i < attempts; i++) {
    let posX = x + random(-50, 50);
    let posY = y + random(-50, 50);
    let newCircle = new Circle(posX, posY);
    if (!newCircle.hasCollided(circles)) {
      return newCircle;
    }
  }
  return null;
}

class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.growing = true;
    this.col = color(random(360), 80, 100, 60); // HSB color con transparencia
  }

  hasCollided(others) {
    for (let other of others) {
      let d = dist(this.x, this.y, other.x, other.y);
      if (d < this.radius + other.radius + 2) {
        return true;
      }
    }
    return false;
  }

  edges() {
    return (
      this.x + this.radius > width ||
      this.x - this.radius < 0 ||
      this.y + this.radius > height ||
      this.y - this.radius < 0
    );
  }

  display() {
    fill(this.col);
    ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

function resetSketch() {
  circles = [];
  background(0);
}
```

### Conclusión del experimento

Este ejercicio me permitió entender cómo usar código para crear visuales emergentes a partir de reglas simples, pero con resultados ricos y expresivos. Me pareció especialmente interesante cómo se puede combinar estética, lógica algorítmica e interacción del usuario para generar algo vivo. Creo que este tipo de herramientas serán clave para los proyectos colectivos del curso, donde lo visual responde activamente a la acción del público.

