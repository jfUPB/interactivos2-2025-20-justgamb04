# Unidad 3

## 🔎 Fase: Set + Seek

# Actividad 1

##  Diagrama de bloques

El siguiente diagrama muestra cómo fluyen los datos desde el cliente móvil, pasando por el servidor, y llegando al cliente de escritorio.

<img width="799" height="213" alt="image" src="https://github.com/user-attachments/assets/95f59167-76e0-4c82-a597-96cb85fc5abd" />

## Descripción

### Conexión inicial

* El **servidor Node.js** corre en el puerto `3000` y sirve los archivos desde la carpeta `public`.
* Cuando un **cliente móvil** o un **cliente de escritorio** abre la aplicación en el navegador, se establece una conexión con el servidor mediante **Socket.IO**.
* El servidor imprime en consola: `"New client connected"`.

### Envío de datos desde el cliente

* Los clientes (móvil o escritorio) generan datos, por ejemplo:

  ```js
  socket.emit('message', data);
  ```
* Este `data` puede ser texto, valores de sensores (móvil), interacciones de mouse/teclado (escritorio), o cualquier evento definido.

### Recepción en el servidor

* El servidor escucha:

  ```js
  socket.on('message', (message) => {
      console.log(`Received message => ${message}`);
      socket.broadcast.emit('message', message);
  });
  ```
* Aquí el servidor:

  1. **Recibe** el mensaje.
  2. Lo imprime en consola.
  3. Lo **reenvía a todos los demás clientes conectados**, excepto al que lo envió, usando `broadcast`.

### Redistribución hacia los clientes

* Los demás clientes reciben el evento `'message'` y lo procesan según su propia lógica.

### Desconexión

* Cuando un cliente se desconecta, el servidor registra:

  ```js
  console.log('Client disconnected');
  ```
* De esta forma, mantiene actualizado el estado de la red de usuarios conectados.

### Conclusiones

* La aplicación **no genera visuales directamente en el servidor**.
* El servidor actúa como puente de comunicación: recibe mensajes de un cliente y los transmite a los demás en tiempo real.
* Los clientes (móvil y escritorio) son los que contienen la lógica para transformar los datos en interacción o visuales.
* Este enfoque modular facilita el desarrollo de sistemas donde múltiples usuarios pueden influir en lo que ocurre en pantalla, por ejemplo, en un concierto con visuales generativas.


# Actividad 2

## Codigos

### server.js

```javascript
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos de la carpeta public
app.use(express.static("public"));

// Conexión con los clientes
io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Escuchar datos que vengan del móvil
  socket.on("dataFromMobile", (data) => {
    console.log("Datos recibidos del móvil:", data);

    // Reenviar esos datos a todos los demás clientes (desktop + visuals)
    socket.broadcast.emit("dataFromClient", data);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
```


### Desktop

#### sketch.js
```html
let socket;
let circleX = 200;
let circleY = 200;
const port = 3000;


function setup() {
    createCanvas(300, 400);
    background(220);

    //let socketUrl = 'http://localhost:3000';
    socket = io(); 

    // Evento de conexión exitosa
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    // Recibir mensaje del servidor
    socket.on('message', (data) => {
        console.log(`Received message: ${data}`);
        try {
            let parsedData = JSON.parse(data);
            if (parsedData && parsedData.type === 'touch') {
                circleX = parsedData.x;
                circleY = parsedData.y;
            }
        } catch (e) {
            console.error("Error parsing received JSON:", e);
        }
    });    

    // Evento de desconexión
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO error:', error);
    });
}

function draw() {
    background(220);
    fill(255, 0, 0);
    ellipse(circleX, circleY, 50, 50);
}
```
<img width="631" height="493" alt="image" src="https://github.com/user-attachments/assets/d369b45b-1034-43b3-84f2-edd6990e60e3" />

### Mobile 

<img width="585" height="593" alt="image" src="https://github.com/user-attachments/assets/33c42251-684e-4c5d-a6f3-f8805d658466" />

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cliente Móvil</title>
  <script src="/socket.io/socket.io.js"></script>
</head>
<body>
  <h1> Cliente Móvil</h1>
  <button onclick="enviarDato()">Enviar dato</button>

  <script>
    const socket = io();
    socket.on("connect", () => console.log("Mobile conectado:", socket.id));

    function enviarDato() {
      const data = {
        source: "mobile",
        value: Math.random().toFixed(4),
        ts: Date.now()
      };
      console.log("Mobile envía:", data);
      socket.emit("dataFromClient", data);
      alert("Dato enviado");
    }
  </script>
</body>
</html>
```


### Visuals

<img width="746" height="348" alt="image" src="https://github.com/user-attachments/assets/2f7e85aa-1bb1-4bc8-bac3-41fd069fdc4d" />



## Video

