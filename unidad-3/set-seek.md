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
