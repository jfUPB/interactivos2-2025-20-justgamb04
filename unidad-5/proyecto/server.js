const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir archivos estáticos
app.use(express.static('public'));

// Estado global del sistema
let systemState = {
  moon: {
    x: 0,
    y: 0,
    baseRadius: 100,
    currentRadius: 100,
    pulseIntensity: 0
  },
  roots: [],
  drawings: [],
  strokeWeight: 5,
  pulses: []
};

// Rutas para cada cliente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/visuales/index.html'));
});

app.get('/mobile1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/clientem1/index.html'));
});

app.get('/mobile2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/clientem2/index.html'));
});

app.get('/desktop1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/cliented1/index.html'));
});

app.get('/remoto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/remoto/index.html'));
});

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  // Enviar estado inicial al nuevo cliente
  socket.emit('systemState', systemState);

  // Mobile1 - Crear raíces
  socket.on('createRoot', (data) => {
    const newRoot = {
      id: Date.now() + Math.random(),
      startX: data.x,
      startY: data.y,
      segments: [{x: data.x, y: data.y}],
      growth: 0,
      maxGrowth: Math.random() * 200 + 100,
      branches: []
    };
    
    systemState.roots.push(newRoot);
    io.emit('newRoot', newRoot);
  });

  // Mobile2 - Cambiar grosor de trazos
  socket.on('changeStroke', (data) => {
    systemState.strokeWeight = Math.max(1, Math.min(20, data.weight));
    io.emit('strokeChanged', { weight: systemState.strokeWeight });
  });

  // Desktop1 - Dibujos internos
  socket.on('drawInside', (data) => {
    const drawing = {
      id: Date.now() + Math.random(),
      points: data.points,
      color: data.color || '#ffffff'
    };
    
    systemState.drawings.push(drawing);
    io.emit('newDrawing', drawing);
  });

  // Remoto - Pulsaciones
  socket.on('pulse', (data) => {
    const pulse = {
      id: Date.now(),
      intensity: data.intensity || 1,
      timestamp: Date.now()
    };
    
    systemState.pulses.push(pulse);
    systemState.moon.pulseIntensity = Math.min(2, systemState.moon.pulseIntensity + 0.3);
    
    io.emit('newPulse', pulse);
    
    // Limpiar pulsos antiguos
    systemState.pulses = systemState.pulses.filter(p => Date.now() - p.timestamp < 2000);
  });

  // Limpiar datos cuando se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Actualización del sistema cada frame
setInterval(() => {
  // Actualizar crecimiento de raíces
  systemState.roots.forEach(root => {
    if (root.growth < root.maxGrowth) {
      root.growth += 2;
      
      // Añadir nuevos segmentos
      if (root.growth % 10 === 0) {
        const lastSegment = root.segments[root.segments.length - 1];
        const angle = Math.random() * Math.PI * 2;
        const length = Math.random() * 15 + 5;
        
        root.segments.push({
          x: lastSegment.x + Math.cos(angle) * length,
          y: lastSegment.y + Math.sin(angle) * length
        });
        
        // Crear ramas ocasionalmente
        if (Math.random() < 0.1 && root.branches.length < 3) {
          const branchAngle = angle + (Math.random() - 0.5) * Math.PI;
          root.branches.push({
            startX: lastSegment.x,
            startY: lastSegment.y,
            angle: branchAngle,
            length: Math.random() * 50 + 20
          });
        }
      }
    }
  });
  
  // Actualizar pulsaciones de la luna
  if (systemState.moon.pulseIntensity > 0) {
    systemState.moon.currentRadius = systemState.moon.baseRadius + 
      Math.sin(Date.now() * 0.01) * systemState.moon.pulseIntensity * 20;
    systemState.moon.pulseIntensity *= 0.98; // Decay
  } else {
    systemState.moon.currentRadius = systemState.moon.baseRadius;
  }
  
  // Limpiar raíces muy antiguas (opcional)
  if (systemState.roots.length > 100) {
    systemState.roots.splice(0, systemState.roots.length - 100);
  }
  
  // Enviar estado actualizado
  io.emit('systemUpdate', systemState);
}, 50); // 20 FPS

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Visuales principales: http://localhost:${PORT}/`);
  console.log(`Mobile1 (raíces): http://localhost:${PORT}/mobile1`);
  console.log(`Mobile2 (grosor): http://localhost:${PORT}/mobile2`);
  console.log(`Desktop1 (dibujo): http://localhost:${PORT}/desktop1`);
  console.log(`Remoto (pulsos): http://localhost:${PORT}/remoto`);
});