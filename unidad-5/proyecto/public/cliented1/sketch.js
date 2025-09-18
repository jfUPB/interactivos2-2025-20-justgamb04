let socket;
let moon = {
  x: 0,
  y: 0,
  radius: 150
};
let currentDrawing = [];
let allDrawings = [];
let isDrawing = false;
let currentColor = '#ffffff';
let brushSize = 5;
let connectionStatus = 'Conectando...';
let drawingsCount = 0;

function setup() {
  let canvas = createCanvas(windowWidth - 300, windowHeight - 70);
  canvas.parent('p5-container');
  
  // Configurar la luna en el centro
  moon.x = width / 2;
  moon.y = height / 2;
  
  // Configurar socket
  socket = io();
  setupSocketEvents();
  
  // Configurar controles
  setupControls();
}

function draw() {
  // Fondo nocturno
  drawBackground();
  
  // Dibujar luna de fondo
  drawMoonBackground();
  
  // Dibujar todos los dibujos
  drawAllArtwork();
  
  // Dibujar dibujo actual (preview)
  drawCurrentPath();
  
  // Dibujar cursor personalizado
  drawCustomCursor();
}

function drawBackground() {
  // Gradiente nocturno
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(26, 26, 46), color(10, 10, 10), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  // Estrellas sutiles
  fill(255, 255, 255, 100);
  noStroke();
  for (let i = 0; i < 30; i++) {
    let x = (noise(i * 100) * width);
    let y = (noise(i * 100 + 1000) * height);
    let size = noise(i * 100 + 2000) * 3 + 1;
    ellipse(x, y, size);
  }
}

function drawMoonBackground() {
  push();
  translate(moon.x, moon.y);
  
  // Resplandor exterior sutil
  for (let r = moon.radius + 30; r > moon.radius; r -= 3) {
    let alpha = map(r, moon.radius, moon.radius + 30, 80, 0);
    fill(168, 218, 220, alpha);
    noStroke();
    ellipse(0, 0, r * 2);
  }
  
  // Luna base
  fill(245, 245, 245, 40);
  stroke(255, 255, 255, 80);
  strokeWeight(1);
  ellipse(0, 0, moon.radius * 2);
  
  pop();
}

function drawAllArtwork() {
  // Crear máscara circular para limitar dibujos
  push();
  
  for (let drawing of allDrawings) {
    if (drawing.points && drawing.points.length > 1) {
      stroke(drawing.color);
      strokeWeight(drawing.brushSize || 3);
      strokeCap(ROUND);
      strokeJoin(ROUND);
      noFill();
      
      beginShape();
      for (let point of drawing.points) {
        // Solo dibujar si está dentro de la luna
        let dist = sqrt(pow(point.x - moon.x, 2) + pow(point.y - moon.y, 2));
        if (dist <= moon.radius) {
          vertex(point.x, point.y);
        }
      }
      endShape();
    }
  }
  
  pop();
}

function drawCurrentPath() {
  if (currentDrawing.length > 1) {
    stroke(currentColor);
    strokeWeight(brushSize);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();
    
    beginShape();
    for (let point of currentDrawing) {
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function drawCustomCursor() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    // Verificar si está dentro de la luna
    let dist = sqrt(pow(mouseX - moon.x, 2) + pow(mouseY - moon.y, 2));
    let isInside = dist <= moon.radius;
    
    push();
    translate(mouseX, mouseY);
    
    // Cursor circular
    noFill();
    stroke(isInside ? currentColor : color(255, 100, 100));
    strokeWeight(2);
    ellipse(0, 0, brushSize * 2);
    
    // Cruz central
    stroke(255, 255, 255, 150);
    strokeWeight(1);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    
    pop();
  }
}

function mousePressed() {
  let dist = sqrt(pow(mouseX - moon.x, 2) + pow(mouseY - moon.y, 2));
  if (dist <= moon.radius) {
    isDrawing = true;
    currentDrawing = [{ x: mouseX, y: mouseY }];
    
    // Ocultar guía
    let moonGuide = document.getElementById('moon-guide');
    moonGuide.classList.add('hidden');
  }
}

function mouseDragged() {
  if (isDrawing) {
    let dist = sqrt(pow(mouseX - moon.x, 2) + pow(mouseY - moon.y, 2));
    if (dist <= moon.radius) {
      currentDrawing.push({ x: mouseX, y: mouseY });
    }
  }
}

function mouseReleased() {
  if (isDrawing && currentDrawing.length > 1) {
    // Crear objeto de dibujo
    let drawing = {
      id: Date.now() + Math.random(),
      points: [...currentDrawing],
      color: currentColor,
      brushSize: brushSize,
      timestamp: Date.now()
    };
    
    // Añadir a la lista local
    allDrawings.push(drawing);
    drawingsCount++;
    updateUI();
    
    // Enviar al servidor
    socket.emit('drawInside', drawing);
    
    // Limpiar dibujo actual
    currentDrawing = [];
  }
  
  isDrawing = false;
}

function setupControls() {
  // Paleta de colores
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      currentColor = this.dataset.color;
    });
  });
  
  // Control de tamaño de pincel
  const brushSizeSlider = document.getElementById('brush-size');
  const brushValue = document.getElementById('brush-value');
  
  brushSizeSlider.addEventListener('input', function() {
    brushSize = parseInt(this.value);
    brushValue.textContent = brushSize;
  });
  
  // Botón limpiar
  document.getElementById('clear-btn').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que quieres limpiar todos los dibujos?')) {
      allDrawings = [];
      drawingsCount = 0;
      updateUI();
      
      // Mostrar guía de nuevo
      let moonGuide = document.getElementById('moon-guide');
      moonGuide.classList.remove('hidden');
    }
  });
  
  // Botón guardar
  document.getElementById('save-btn').addEventListener('click', function() {
    saveArtwork();
  });
}

function saveArtwork() {
  // Crear un canvas temporal para guardar
  let tempCanvas = createGraphics(moon.radius * 2, moon.radius * 2);
  
  // Fondo lunar
  tempCanvas.fill(245, 245, 245);
  tempCanvas.ellipse(moon.radius, moon.radius, moon.radius * 2);
  
  // Dibujar artwork
  for (let drawing of allDrawings) {
    if (drawing.points && drawing.points.length > 1) {
      tempCanvas.stroke(drawing.color);
      tempCanvas.strokeWeight(drawing.brushSize || 3);
      tempCanvas.strokeCap(ROUND);
      tempCanvas.noFill();
      
      tempCanvas.beginShape();
      for (let point of drawing.points) {
        // Ajustar coordenadas al canvas temporal
        let localX = point.x - moon.x + moon.radius;
        let localY = point.y - moon.y + moon.radius;
        tempCanvas.vertex(localX, localY);
      }
      tempCanvas.endShape();
    }
  }
  
  // Descargar imagen
  tempCanvas.save('luna-artwork-' + Date.now(), 'png');
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
  
  socket.on('newDrawing', (drawing) => {
    // Solo añadir si no es nuestro propio dibujo
    if (!allDrawings.some(d => d.id === drawing.id)) {
      allDrawings.push(drawing);
      updateUI();
    }
  });
}

function updateUI() {
  document.getElementById('connection-status').textContent = connectionStatus;
  document.getElementById('connection-status').className = 
    connectionStatus === 'Conectado' ? 'connected' : 'disconnected';
  document.getElementById('drawings-count').textContent = `Trazos: ${drawingsCount}`;
}

function windowResized() {
  resizeCanvas(windowWidth - 300, windowHeight - 70);
  moon.x = width / 2;
  moon.y = height / 2;
}