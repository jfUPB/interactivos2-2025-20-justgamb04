let socket;
let systemState = {
  moon: {
    x: 0,
    y: 0,
    baseRadius: 150,
    currentRadius: 150,
    pulseIntensity: 0
  },
  roots: [],
  drawings: [],
  strokeWeight: 5,
  pulses: []
};

let particles = [];
let time = 0;
let connectionStatus = 'Conectando...';

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight - 100);
  canvas.parent('p5-container');
  
  // Configurar la luna en el centro
  systemState.moon.x = width / 2;
  systemState.moon.y = height / 2;
  
  // Configurar socket
  socket = io();
  setupSocketEvents();
  
  // Crear partículas ambientales
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 6),
      alpha: random(50, 150)
    });
  }
  
  // Botón de pantalla completa
  document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
}

function draw() {
  // Fondo con gradiente
  drawBackground();
  
  time += 0.01;
  
  // Dibujar partículas ambientales
  drawParticles();
  
  // Dibujar raíces
  drawRoots();
  
  // Dibujar la luna
  drawMoon();
  
  // Dibujar contenido interno de la luna
  drawMoonContent();
  
  // Dibujar efectos de pulso
  drawPulseEffects();
  
  // Actualizar estado
  updateSystem();
}

function drawBackground() {
  // Gradiente nocturno inspirado en Aurora
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(10, 10, 30), color(22, 33, 62), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

function drawParticles() {
  noStroke();
  for (let particle of particles) {
    fill(255, 255, 255, particle.alpha);
    ellipse(particle.x, particle.y, particle.size);
    
    // Movimiento suave
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Wrap around
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;
    
    // Pulso suave
    particle.alpha = 100 + sin(time * 2 + particle.x * 0.01) * 50;
  }
}

function drawMoon() {
  push();
  translate(systemState.moon.x, systemState.moon.y);
  
  // Resplandor exterior
  for (let r = systemState.moon.currentRadius + 50; r > systemState.moon.currentRadius; r -= 5) {
    let alpha = map(r, systemState.moon.currentRadius, systemState.moon.currentRadius + 50, 150, 0);
    fill(168, 218, 220, alpha);
    noStroke();
    ellipse(0, 0, r * 2);
  }
  
  // Luna principal con textura
  fill(245, 245, 245, 230);
  stroke(255, 255, 255, 100);
  strokeWeight(2);
  ellipse(0, 0, systemState.moon.currentRadius * 2);
  
  // Textura lunar sutil
  fill(220, 220, 220, 50);
  noStroke();
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i;
    let x = cos(angle) * systemState.moon.currentRadius * 0.3;
    let y = sin(angle) * systemState.moon.currentRadius * 0.3;
    ellipse(x, y, random(10, 30));
  }
  
  pop();
}

function drawRoots() {
  stroke(101, 67, 33);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  
  for (let root of systemState.roots) {
    strokeWeight(systemState.strokeWeight);
    
    // Dibujar raíz principal
    beginShape();
    noFill();
    for (let i = 0; i < root.segments.length - 1; i++) {
      let seg1 = root.segments[i];
      let seg2 = root.segments[i + 1];
      
      // Color que se desvanece con la distancia
      let alpha = map(i, 0, root.segments.length, 200, 50);
      stroke(101, 67, 33, alpha);
      
      line(seg1.x, seg1.y, seg2.x, seg2.y);
      
      // Pequeñas hojas ocasionales
      if (i % 5 === 0 && random() < 0.3) {
        push();
        translate(seg2.x, seg2.y);
        rotate(random(TWO_PI));
        fill(34, 139, 34, alpha);
        noStroke();
        ellipse(5, 0, 8, 4);
        pop();
      }
    }
    
    // Dibujar ramas
    for (let branch of root.branches) {
      let endX = branch.startX + cos(branch.angle) * branch.length;
      let endY = branch.startY + sin(branch.angle) * branch.length;
      
      stroke(101, 67, 33, 150);
      strokeWeight(systemState.strokeWeight * 0.6);
      line(branch.startX, branch.startY, endX, endY);
    }
  }
}

function drawMoonContent() {
  push();
  translate(systemState.moon.x, systemState.moon.y);
  
  // Crear máscara circular para dibujos internos
  let moonMask = createGraphics(systemState.moon.currentRadius * 2, systemState.moon.currentRadius * 2);
  moonMask.fill(255);
  moonMask.ellipse(systemState.moon.currentRadius, systemState.moon.currentRadius, systemState.moon.currentRadius * 2);
  
  // Dibujar contenido interno
  for (let drawing of systemState.drawings) {
    stroke(drawing.color);
    strokeWeight(3);
    strokeCap(ROUND);
    noFill();
    
    beginShape();
    for (let point of drawing.points) {
      // Verificar si el punto está dentro de la luna
      let dist = sqrt(pow(point.x - systemState.moon.x, 2) + pow(point.y - systemState.moon.y, 2));
      if (dist <= systemState.moon.currentRadius) {
        vertex(point.x - systemState.moon.x, point.y - systemState.moon.y);
      }
    }
    endShape();
  }
  
  pop();
}

function drawPulseEffects() {
  // Ondas de pulso
  for (let pulse of systemState.pulses) {
    let age = millis() - pulse.timestamp;
    let maxAge = 2000;
    
    if (age < maxAge) {
      let progress = age / maxAge;
      let radius = progress * 300;
      let alpha = (1 - progress) * 150 * pulse.intensity;
      
      push();
      translate(systemState.moon.x, systemState.moon.y);
      noFill();
      stroke(168, 218, 220, alpha);
      strokeWeight(3 * (1 - progress));
      ellipse(0, 0, radius * 2);
      pop();
    }
  }
}

function updateSystem() {
  // Actualizar pulsación de la luna
  if (systemState.moon.pulseIntensity > 0) {
    systemState.moon.currentRadius = systemState.moon.baseRadius + 
      sin(millis() * 0.01) * systemState.moon.pulseIntensity * 30;
  }
}

function setupSocketEvents() {
  socket.on('connect', () => {
    connectionStatus = 'Conectado';
    document.getElementById('connection-status').textContent = connectionStatus;
    document.getElementById('connection-status').className = 'connected';
  });
  
  socket.on('disconnect', () => {
    connectionStatus = 'Desconectado';
    document.getElementById('connection-status').textContent = connectionStatus;
    document.getElementById('connection-status').className = 'disconnected';
  });
  
  socket.on('systemState', (state) => {
    systemState = state;
    systemState.moon.x = width / 2;
    systemState.moon.y = height / 2;
  });
  
  socket.on('newRoot', (root) => {
    systemState.roots.push(root);
  });
  
  socket.on('strokeChanged', (data) => {
    systemState.strokeWeight = data.weight;
  });
  
  socket.on('newDrawing', (drawing) => {
    systemState.drawings.push(drawing);
  });
  
  socket.on('newPulse', (pulse) => {
    systemState.pulses.push(pulse);
    systemState.moon.pulseIntensity = Math.min(2, systemState.moon.pulseIntensity + 0.3);
  });
  
  socket.on('systemUpdate', (state) => {
    systemState = state;
    systemState.moon.x = width / 2;
    systemState.moon.y = height / 2;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 100);
  systemState.moon.x = width / 2;
  systemState.moon.y = height / 2;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}