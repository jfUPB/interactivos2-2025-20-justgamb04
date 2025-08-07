# Unidad 2


## 🛠 Fase: Apply


## **Título del Proyecto:**

**Ícaro – Vuelo y Caída en Tiempo Real**

## Canción seleccionada:

["Ícaro" – Nerón Arkano]([https://open.spotify.com/intl-es/track/4RaP2ouejO3rWYvvxteXY5?si=aa3b99e3b38e4b42](https://open.spotify.com/intl-es/track/4RaP2ouejO3rWYvvxteXY5?si=338eb16e32804a9d))

## Interpretación de la canción:

“Ícaro” interpreta una lucha interna y vulnerabilidad emocional, mezclando metáforas sobre la caída, el desgaste personal y la búsqueda de un sentido en medio del dolor. esta letra combina momentos de introspección con imágenes de batalla emocional, llevando a los oyentes a un viaje de vuelo y caída constante (de ahí el nombre de la canción). 

## Concepto Raíz:

Esta experiencia busca recrear el vuelo y la caída de Ícaro como una metáfora visual y sonora de la lucha humana contra sus propios límites. El espacio escénico se transformará en un cielo digital en constante cambio, donde la voz y el movimiento del artista controlarán corrientes de luz y partículas que representan plumas y fuego. El objetivo es que el público sienta que está dentro del viaje: la elevación, la tensión, la caída y la transformación final. Las visuales deberán ser orgánicas, respondiendo directamente a la energía de la interpretación, para que cada presentación sea única e irrepetible. La emoción clave es transmitir que incluso en la caída hay belleza.

## Inputs:

1. **Voz de Nerón (micrófono en tiempo real):**

   * Amplitud (0–1) para medir intensidad emocional.
   * Frecuencia dominante (Hz) para determinar la paleta de colores.

2. **Movimiento de Nerón en el escenario (cámara Kinect):**

   * Coordenadas (X, Y) para desplazar el centro de gravedad visual.

3. **Detección de BPM y golpes del beat (análisis de audio):**

   * Sincroniza efectos con cada golpe rítmico.

4. **Palabras enviadas por el público (app móvil):**

   * Analizadas por polaridad emocional (+ positivo / - negativo).

## **Process:**

El sistema generativo procesará los inputs en tiempo real y los traducirá a outputs visuales dinámicos.

### 1. **Simulación atmosférica dinámica**

* **Datos:** amplitud de voz, frecuencia dominante.
* **Condiciones:**

  * Amplitud > 0.7 → partículas aceleran al doble, dispersión alta.
  * Amplitud < 0.3 → partículas se desaceleran y flotan suavemente.
  * Frecuencia < 250 Hz → paleta fría (azul/morado).
  * Frecuencia > 500 Hz → paleta cálida (dorado/plateado).
* **Parámetros:**

  * `VelocidadPartículas = map(amplitud, 0, 1, 0.5, 3)`
  * `ColorHue = map(frecuencia, 100, 1000, 200°, 50°)`

### 2. **Deformación gravitatoria**

* **Idea visual:** Imagínate que alrededor de Nerón, proyectado en el escenario, hay una especie de burbuja invisible que distorsiona el espacio, como si fuera un lente de aumento que dobla la luz y arrastra las partículas hacia él.
* **Cómo funciona:**

  * La **posición de Nerón** en el escenario (coordenadas X, Y obtenidas con Kinect) define el centro del campo gravitatorio.
  * La **intensidad de su voz** (amplitud) determina el tamaño de ese campo.
  * Si canta con fuerza (amplitud alta), el campo se expande y distorsiona más elementos.
  * Si canta suave (amplitud baja), el campo es pequeño y apenas altera lo que está alrededor.
* **Qué se ve:** Las partículas o textos que pasen cerca de esa “zona” cambian su trayectoria, se curvan, giran, como si estuvieran atrapadas por una fuerza invisible que las atrae o repele. Esto hace que el espacio visual parezca vivo y responda físicamente a la performance.

* **Datos:** posición (X, Y) y amplitud de voz.
* **Condiciones:**

  * Movimiento desplaza centro del campo gravitatorio.
  * Amplitud > 0.6 → radio de distorsión aumenta al 50% del canvas.
* **Parámetros:**

  * `RadioDistorsión = map(amplitud, 0, 1, 50px, 300px)`
  * `IntensidadDistorsión = sin(frameCount / 20) * (amplitud * 2)`

### 3. **Resonancia visual con el beat**

* **Datos:** BPM (beats per minute) y tiempo desde último golpe.
* **Condiciones:**

  * En cada golpe → onda expansiva que aumenta tamaño de partículas cercanas al artista.
  * BPM > promedio +20% → expansión doble e incremento de saturación.
* **Parámetros:**

  * `RadioOnda = map(tiempoDesdeGolpe, 0, 300, 200px, 0px)`
  * `EscalaPartícula = 1 + sin(frameCount / 5) * (BPM / 60)`

### 4. **Integración semántica del texto del público**

* **Datos:** palabras y polaridad emocional.
* **Condiciones:**

  * Positivo → ascienden, iluminadas, transformadas en plumas doradas.
  * Negativo → caen, se fragmentan, generan sombras.
* **Parámetros:**

  * `VelocidadAscenso = map(polaridad, 0, 1, 0, 2)`
  * `VelocidadDescenso = map(polaridad, -1, 0, 2, 0)`
  * `OpacidadTexto = 255 (positivo) / 120 (negativo)`

## **Outputs:**

* **Visuales atmosféricos:** nubes de partículas que cambian de color, velocidad y forma según la voz.
* **Efectos de distorsión:** curvaturas y deformaciones que siguen los movimientos del artista.
* **Ondas expansivas:** pulsos visuales sincronizados con el beat que dan sensación de respiración al escenario.
* **Proyecciones de palabras:** texto flotante que se transforma en plumas o fragmentos oscuros según su polaridad.
* **Transformación final:** cierre en tonos cálidos que simboliza la trascendencia del vuelo y la aceptación de la caída.

### **Letra de Ícaro – Nerón Arkano**

**Ya sé que llevo mucho tiempo en esta puesta la razón que no razóna y el cora que no demuestra**
(Input: amplitud de voz baja, tono grave) → (Process: partículas lentas, paleta azulada) → (Output: ambiente oscuro, movimiento visual denso y pesado)

**jugando a la vida estable, insuperable perdido por fuera Por dentro el intachable**
(Input: voz con picos de intensidad moderada) → (Process: deformación gravitatoria ligera) → (Output: distorsión suave del entorno, dando sensación de inestabilidad)

**ya ni sé, que es lo que yo busco en el espejo el reflejo de un suicida que el sueño se le hace viejo**
(Input: amplitud baja + palabras negativas) → (Process: texto detectado como negativo, caen lentamente) → (Output: palabras flotantes que se fragmentan al tocar el suelo)

**un hombre pendejo que no recibe consejos y que ignora la vida por ver volar los azulejos**
(Input: amplitud alta en “volar”) → (Process: incremento de velocidad de partículas + cambio de dirección ascendente) → (Output: ráfaga de partículas que suben en espiral)

**A su lejos el futuro se marchita brilla la oscuridad la soledad lo necesita**
(Input: tono grave sostenido) → (Process: color shift hacia morado) → (Output: oscurecimiento gradual del escenario)

**me llama al futuro y ya no sé qué significa**
(Input: pausa en la voz) → (Process: ralentización global de movimiento) → (Output: partículas suspendidas como en cámara lenta)

**sólo hay piedras pa tropiezos que camino más complica**
(Input: golpe en beat en “piedras” y “tropiezos”) → (Process: ondas expansivas sincronizadas) → (Output: temblor visual desde el suelo hacia arriba)

**y sólo fuego a ser feliz en la baraja del destino**
(Input: amplitud alta + frecuencia alta) → (Process: cambio a paleta cálida, partículas con efecto de fuego) → (Output: resplandor anaranjado que crece alrededor del artista)

**a cobija arme bajo el brillo de la luna**
(Input: amplitud media + tono medio) → (Process: partículas con brillo puntual) → (Output: chispas blancas dispersas)

**no creer en los adioses repentinos y a querer florecer y echar raíz sobre una duna**
(Input: amplitud estable) → (Process: trayectoria de partículas curva y lenta) → (Output: simulación de raíces extendiéndose en el suelo visual)

**Todo lo que tengo es un pañuelo donde cargo mis lágrimas más preciadas**
(Input: tono grave + amplitud baja) → (Process: partículas más densas y lentas) → (Output: sensación de peso y tristeza en el ambiente)

**que se esconden bajo el dolor más pequeño y rompen el seño de la más fuerte mirada**
(Input: palabras negativas) → (Process: fragmentación de texto en pantalla) → (Output: letras que se rompen como vidrio)

**todo lo que entregó no lo tengo y tengo lo que nadie más quisiera**
(Input: amplitud media) → (Process: partículas flotando en círculos cerrados) → (Output: sensación visual de encierro)

**un corazón ya derrotado por el ego Y un sin fin de sueños en mi triste billetera**
(Input: voz baja + palabra “triste”) → (Process: caída de partículas oscuras) → (Output: lluvia lenta de cenizas)

**Ya no sé porque me sigo desgastando y trabajando por un sueño que parece una mentira**
(Input: amplitud variable) → (Process: oscilación de velocidad) → (Output: alternancia rápida entre partículas lentas y rápidas)

**convencer al resto de que no estas fracasando si es del barco caronte me tiene bajo la mira**
(Input: tono grave) → (Process: color shift hacia negro y rojo) → (Output: ambiente tenso y amenazante)

**mira... la vida es un acertijo al sujeto el verbo llanto le acompaña de prefijo**
(Input: beat marcado) → (Process: pulsos de luz por cada golpe) → (Output: flashes sincronizados)

**con el tintero soy sincero y sigo me quimeras si el dolor que me condena es el mismo que me libera**
(Input: amplitud alta en “libera”) → (Process: apertura de partículas hacia fuera) → (Output: efecto de liberación visual)

**y fuera de tanta pesadilla vivo una muletilla soy un diamante en bruto que no brilla**
(Input: amplitud baja + palabras negativas) → (Process: reducción de brillo global) → (Output: escenario más oscuro)

**y ya vivo en la alcantarilla las sirenas me acribillan y me llevan a morir sobre la orilla**
(Input: frecuencia baja) → (Process: partículas arrastradas hacia abajo) → (Output: efecto de caída constante)

**chillán a sonrisas que me millán que me clavas sus cuchillas pero llevo ya agonizando 8 millas**
(Input: amplitud alta + beat marcado) → (Process: ráfagas rápidas de partículas) → (Output: efecto de ataque visual)

**mi llanto me tumba de rodillas deja en coma mis comillas la sombras del recuerdo no se rastrillan**
(Input: amplitud baja final) → (Process: desvanecimiento global) → (Output: cierre visual tenue y difuso)


