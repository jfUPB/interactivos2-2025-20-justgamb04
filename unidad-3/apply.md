# Unidad 3


## 🛠 Fase: Apply

Implementé un sistema de control remoto con máquina de estados que permite modificar las visuales de manera remota.

1. **Servidor (`server.js`)**

   * Se mantuvo la comunicación con Socket.IO.
   * Se agregó la lógica de manejo de eventos de cambio de estado, que transmite desde el móvil (control remoto) hacia el desktop (visuales).

2. **Aplicación de Control Remoto (`remote.html`)**

   * Se implementaron botones para cambiar de estado (`Estado 1`, `Estado 2`, `Estado 3`).
   * Cada botón envía un mensaje al servidor indicando el nuevo estado y los parámetros simulados.
   * Por ejemplo: brillo, color o velocidad.

3. **Aplicación de Visuales (`visuals.html`)**

   * Se implementó la máquina de estados: al recibir un estado desde el servidor, cambia la visualización.
   * En cada estado se muestra de manera sencilla la información recibida (por ejemplo: cambia el fondo de color, textos y parámetros).
   * Esto simula cómo en la siguiente unidad se podrán integrar visuales más complejas.

4. **Pruebas de funcionamiento**

   * Se ejecutó el servidor con `node server.js`.
   * Se abrió desktop en `http://localhost:3000/visuals.html`.
   * Se abrió mobile en `http://localhost:3000/remote.html`.
   * Al presionar botones en el móvil, los cambios de estado se reflejaron en tiempo real en el desktop.


## Código del servidor (`server.js`)

```js
// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir carpeta public y también la carpeta visuals (para cargar visuals.js desde el navegador)
app.use(express.static(path.join(__dirname, "public")));
app.use("/visuals", express.static(path.join(__dirname, "visuals")));

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Reenvío genérico de datos simulados (desktop/mobile) si los usas
  socket.on("data", (payload) => {
    console.log("data:", payload);
    io.emit("data", payload); // broadcast a todos (incluye Visuals si quiere escuchar)
  });

  // >>> Eventos del CONTROL REMOTO <<<
  // Cambiar estado + parámetros hacia Visuals
  socket.on("control:changeState", (payload) => {
    // payload = { state: "idle" | "bars" | "circle", params: {...} }
    console.log("control:changeState:", payload);
    io.emit("visuals:updateState", payload); // Visuals escucha esto
  });

  // (Opcional) Solo actualizar parámetros sin cambiar estado
  socket.on("control:updateParams", (params) => {
    console.log("control:updateParams:", params);
    io.emit("visuals:updateParams", params);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```

## Código del control remoto (`remote.html`)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Control Remoto</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 24px auto; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
    button { padding: 10px 16px; border-radius: 10px; border: 1px solid #ddd; cursor: pointer; }
    button.active { background: #222; color: #fff; }
    .card { border: 1px solid #e5e5e5; border-radius: 14px; padding: 16px; }
    label { display: block; font-size: 14px; margin-top: 8px; }
    input[type="range"] { width: 100%; }
    .small { color:#666; font-size:12px; }
  </style>
</head>
<body>
  <h1> Control Remoto</h1>

  <div class="card">
    <h3>Estado</h3>
    <div class="row">
      <button id="btnIdle">Idle</button>
      <button id="btnBars">Bars</button>
      <button id="btnCircle">Circle</button>
    </div>
    <div class="small">Cambia el estado de la app de Visuals en tiempo real.</div>
  </div>

  <div class="card" style="margin-top:16px;">
    <h3>Parámetros</h3>
    <label>Level <span id="levelVal">50</span></label>
    <input id="level" type="range" min="0" max="100" value="50" />

    <label>Speed <span id="speedVal">1.5</span></label>
    <input id="speed" type="range" step="0.1" min="0" max="5" value="1.5" />

    <label>Color</label>
    <input id="color" type="color" value="#00ccff" />
  </div>

  <p class="small">Abre también <code>/visuals.html</code> para ver el efecto.</p>

  <script src="/socket.io/socket.io.js"></script>
  <script>
    const socket = io();
    const stateButtons = {
      idle: document.getElementById("btnIdle"),
      bars: document.getElementById("btnBars"),
      circle: document.getElementById("btnCircle"),
    };

    let currentState = "idle";
    let params = {
      level: 50,
      speed: 1.5,
      color: "#00ccff",
    };

    // Helpers UI
    function markActive() {
      Object.values(stateButtons).forEach(b => b.classList.remove("active"));
      stateButtons[currentState].classList.add("active");
    }
    function send() {
      socket.emit("control:changeState", { state: currentState, params });
    }

    // Botones de estado
    stateButtons.idle.onclick = () => { currentState = "idle"; markActive(); send(); };
    stateButtons.bars.onclick = () => { currentState = "bars"; markActive(); send(); };
    stateButtons.circle.onclick = () => { currentState = "circle"; markActive(); send(); };

    // Sliders / color
    const $level = document.getElementById("level");
    const $levelVal = document.getElementById("levelVal");
    $level.oninput = () => { params.level = +$level.value; $levelVal.textContent = params.level; send(); };

    const $speed = document.getElementById("speed");
    const $speedVal = document.getElementById("speedVal");
    $speed.oninput = () => { params.speed = +$speed.value; $speedVal.textContent = params.speed.toFixed(1); send(); };

    const $color = document.getElementById("color");
    $color.oninput = () => { params.color = $color.value; send(); };

    // Estado inicial
    markActive();
    send();
  </script>
</body>
</html>
```

## Código de la aplicación de visuales (`visuals.html`)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Visuals</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin:0; background:#0b0b0b; color:#eaeaea; font-family: system-ui, sans-serif; }
    header { padding: 12px 16px; border-bottom: 1px solid #222; display:flex; justify-content:space-between; align-items:center; }
    .pill { background:#161616; padding:6px 10px; border-radius:999px; font-size:12px; color:#9ad; }
    canvas { display:block; width:100vw; height:calc(100vh - 52px); }
  </style>
</head>
<body>
  <header>
    <div>🎨 Visuals</div>
    <div id="status" class="pill">Estado: cargando…</div>
  </header>
  <canvas id="scene"></canvas>

  <script src="/socket.io/socket.io.js"></script>
  <script src="/visuals/visuals.js"></script>
</body>
</html>
```
## (`visuals\visuals.js`)

```js
// visuals/visuals.js (para navegador)
const socket = io();

// Canvas setup
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 52; // header
}
window.addEventListener("resize", resize);
resize();

// Estado global
let state = "idle"; // 'idle' | 'bars' | 'circle'
let params = { level: 50, speed: 1.5, color: "#00ccff" };
let t = 0;

// UI status
const $status = document.getElementById("status");
function setStatus() {
  $status.textContent = `Estado: ${state} | level=${params.level} speed=${params.speed.toFixed(1)} color=${params.color}`;
}

// Render helpers
function clear() {
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function hexToRgb(hex) {
  const v = hex.replace("#",""); 
  const bigint = parseInt(v, 16);
  return { r: (bigint>>16)&255, g: (bigint>>8)&255, b: bigint&255 };
}

function renderIdle() {
  ctx.fillStyle = "#888";
  ctx.font = "24px system-ui, sans-serif";
  ctx.fillText("Idle — esperando instrucciones…", 24, 40);
}

function renderBars() {
  const n = 16;
  const pad = 8;
  const w = (canvas.width - pad*(n+1)) / n;
  const rgb = hexToRgb(params.color);
  for (let i=0; i<n; i++) {
    const phase = i / n;
    const h = (0.15 + 0.85 * (params.level/100) * (0.5 + 0.5*Math.sin(t*params.speed + phase*6.28))) * (canvas.height-60);
    const x = pad + i*(w+pad);
    const y = canvas.height - h - 20;
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`;
    ctx.fillRect(x, y, w, h);
  }
}

function renderCircle() {
  const rgb = hexToRgb(params.color);
  const base = Math.min(canvas.width, canvas.height) * 0.15;
  const r = base + (params.level/100) * base * (0.5 + 0.5*Math.sin(t*params.speed));
  ctx.beginPath();
  ctx.arc(canvas.width/2, canvas.height/2, r, 0, Math.PI*2);
  ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`;
  ctx.fill();
}

function loop() {
  clear();
  if (state === "idle") renderIdle();
  if (state === "bars") renderBars();
  if (state === "circle") renderCircle();
  t += 0.016;
  requestAnimationFrame(loop);
}
loop();

// === Socket listeners ===

// Recibe estado + parámetros desde el control remoto
socket.on("visuals:updateState", (payload) => {
  if (payload?.state) state = payload.state;
  if (payload?.params) params = { ...params, ...payload.params };
  setStatus();
});

// (Opcional) Solo parámetros
socket.on("visuals:updateParams", (p) => {
  params = { ...params, ...p };
  setStatus();
});

// (Opcional) Si quieres ver datos de desktop/mobile reenviados por el server:
socket.on("data", (payload) => {
  // Podrías usarlos en el render si quieres
  // console.log("data broadcast:", payload);
});
```


##  Video de funcionamiento

https://youtu.be/DE-25dsIm8E?si=j7aV_UaOHLZTMSYj


