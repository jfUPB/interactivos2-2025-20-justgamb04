let socket;
let roots = [];
let previewRoots = [];
let touchEffects = [];
let connectionStatus = 'Conectando...';
let rootsCount = 0;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 160);
  canvas.parent('p5-container');
  
  // Configurar socket
  socket = io();
  setupSocketEvents();
  
  // Prevenir comportamiento por defecto en móvil
  canvas.canvas.addEventListener('touchstart', handleTouch, { passive: false });
  canvas.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

function draw() {
  // Fondo con patrón orgánico
  drawBackground();
  
  // Dibujar raíces de vista previa
  drawPreviewRoots();
  
  // Dibujar efectos táctiles
  drawTouchEffects();
  
  // Dibujar instrucciones visuales
  drawVisualHints();
  
  updateEffects();
}

function drawBackground() {
  // Gradiente verde orgánico
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(45, 80, 22), color(74, 124, 89), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  // Patrón sutil de líneas orgánicas
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  for (let i = 0; i < width; i += 50) {
    let waveY = sin(i * 0.01 + millis() * 0.001) * 20;
    line(i, 0, i, height + waveY);
  }
}

function drawPreviewRoots() {
  stroke(144, 238, 144, 150);
  strokeWeight(3);
  strokeCap(ROUND);
  noFill();
  
  for (let i = previewRoots.length - 1; i >= 0; i--) {
    let root = previewRoots[i];
    
    // Dibujar segmentos de la raíz
    beginShape();
    for (let segment of root.segments) {
      vertex(segment.x, segment.y);
    }
    endShape();
    
    // Actualizar crecimiento
    if (root.segments.length < root.maxSegments) {
      let lastSegment = root.segments[root.segments.length - 1];
      let angle = root.angle + (noise(millis() * 0.01, root.id) - 0.5) * 0.3;
      let nextX = lastSegment.x + cos(angle) * root.segmentLength;
      let nextY = lastSegment.y + sin(angle) * root.segmentLength;
      
      root.segments.push({ x: nextX, y: nextY });
      root.angle = angle;
    } else {
      // Remover raíz completada
      previewRoots.splice(i, 1);
    }
  }
}

function drawTouchEffects() {
  for (let i = touchEffects.length - 1; i >= 0; i--) {
    let effect = touchEffects[i];
    let age = millis() - effect.startTime;
    let maxAge = 1000;
    
    if (age < maxAge) {
      let progress = age / maxAge;
      let alpha = (1 - progress) * 255;
      let size = progress * 80 + 10;
      
      noFill();
      stroke(144, 238, 144, alpha);
      strokeWeight(2);
      ellipse(effect.x, effect.y, size);
      
      // Ondas concéntricas
      if (progress > 0.3) {
        stroke(144, 238, 144, alpha * 0.5);
        ellipse(effect.x, effect.y, size * 1.5);
      }
    } else {
      touchEffects.splice(i, 1);
    }
  }
}

function drawVisualHints() {
  // Indicadores sutiles de interactividad
  fill(255, 255, 255, 100 + sin(millis() * 0.005) * 50);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  
  if (previewRoots.length === 0 && rootsCount === 0) {
    text("Toca aquí para crear una raíz 🌱", width / 2, height / 2);
    
    // Círculo pulsante
    fill(144, 238, 144, 50 + sin(millis() * 0.01) * 30);
    ellipse(width / 2, height / 2 + 30, 60 + sin(millis() * 0.01) * 10);
  }
}

function updateEffects() {
  // Limpiar efectos antiguos
  touchEffects = touchEffects.filter(effect => millis() - effect.startTime < 1000);
}

function handleTouch(event) {
  event.preventDefault();
  
  if (event.touches.length > 0) {
    let touch = event.touches[0];
    let rect = event.target.getBoundingClientRect();
    let x = touch.clientX - rect.left;
    let y = touch.clientY - rect.top;
    
    createRoot(x, y);
  }
}

function mousePressed() {
  // También funciona con mouse para testing
  createRoot(mouseX, mouseY);
}

function createRoot(x, y) {
  // Crear efecto táctil
  touchEffects.push({
    x: x,
    y: y,
    startTime: millis()
  });
  
  // Crear raíz de vista previa
  let rootPreview = {
    id: random(1000),
    segments: [{ x: x, y: y }],
    angle: random(TWO_PI),
    segmentLength: random(8, 15),
    maxSegments: random(15, 30)
  };
  previewRoots.push(rootPreview);
  
  // Enviar al servidor
  socket.emit('createRoot', { 
    x: x, 
    y: y,
    timestamp: millis()
  });
  
  rootsCount++;
  updateUI();
}

function setupSocketEvents() {
  socket.on('connect', () => {
    connectionStatus = 'Conectado';
    updateUI();
  });
  
  socket.on('disconnect', () => {
    connectionStatus = 'Desconectado';
    updateUI();
  });
  
  socket.on('newRoot', (root) => {
    // Confirmar que la raíz fue recibida
    console.log('Nueva raíz confirmada:', root.id);
  });
}

function updateUI() {
  document.getElementById('connection-status').textContent = connectionStatus;
  document.getElementById('connection-status').className = 
    connectionStatus === 'Conectado' ? 'connected' : 'disconnected';
  document.getElementById('roots-count').textContent = `Raíces: ${rootsCount}`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 160);
}
