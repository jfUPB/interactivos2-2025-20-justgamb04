let socket;
let pulseIntensity = 1.0;
let pulseMode = 'single';
let connectionStatus = 'Conectando...';
let pulsesCount = 0;
let bpm = 0;
let lastPulseTimes = [];
let particles = [];
let backgroundWaves = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('p5-container');
  
  // Configurar socket
  socket = io();
  setupSocketEvents();
  
  // Configurar controles
  setupControls();
  
  // Inicializar partículas de fondo
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-0.3, 0.3),
      vy: random(-0.3, 0.3),
      size: random(2, 5),
      alpha: random(30, 100)
    });
  }
  
  // Inicializar ondas de fondo
  for (let i = 0; i < 5; i++) {
    backgroundWaves.push({
      y: random(height),
      amplitude: random(10, 30),
      frequency: random(0.002, 0.005),
      speed: random(0.5, 2),
      alpha: random(20, 50)
    });
  }
  
  // Prevenir comportamientos por defecto en móvil
  canvas.canvas.addEventListener('touchstart', handlePulse, { passive: false });
  canvas.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

function draw() {
  // Fondo con gradiente animado
  drawAnimatedBackground();
  
  // Dibujar ondas de fondo
  drawBackgroundWaves();
  
  // Dibujar partículas ambientales
  drawParticles();
  
  // Dibujar efectos de pulso visuales
  drawPulseEffects();
  
  // Actualizar elementos
  updateParticles();
  updateBPM();
}

function drawAnimatedBackground() {
  // Gradiente base
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let wave = sin(i * 0.01 + millis() * 0.0005) * 0.1;
    let c = lerpColor(
      color(26, 26, 46), 
      color(15, 52, 96), 
      inter + wave
    );
    stroke(c);
    line(0, i, width, i);
  }
}

function drawBackgroundWaves() {
  for (let wave of backgroundWaves) {
    stroke(168, 218, 220, wave.alpha);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let x = 0; x <= width; x += 5) {
      let y = wave.y + sin(x * wave.frequency + millis() * 0.001 * wave.speed) * wave.amplitude;
      vertex(x, y);
    }
    endShape();
    
    // Mover onda lentamente
    wave.y += sin(millis() * 0.0001) * 0.1;
    if (wave.y < -50) wave.y = height + 50;
    if (wave.y > height + 50) wave.y = -50;
  }
}

function drawParticles() {
  noStroke();
  for (let particle of particles) {
    let alpha = particle.alpha + sin(millis() * 0.003 + particle.x * 0.01) * 30;
    fill(255, 255, 255, alpha);
    ellipse(particle.x, particle.y, particle.size);
  }
}

function drawPulseEffects() {
  // Efectos visuales adicionales para pulsos recientes
  let currentTime = millis();
  
  // Dibujar ondas expandiéndose desde el centro
  push();
  translate(width / 2, height / 2);
  noFill();
  
  for (let i = lastPulseTimes.length - 1; i >= 0; i--) {
    let pulseTime = lastPulseTimes[i];
    let age = currentTime - pulseTime.time;
    let maxAge = 3000;
    
    if (age < maxAge) {
      let progress = age / maxAge;
      let radius = progress * 400;
      let alpha = (1 - progress) * 150 * pulseTime.intensity;
      
      stroke(168, 218, 220, alpha);
      strokeWeight(3 * (1 - progress));
      ellipse(0, 0, radius * 2);
      
      // Ondas concéntricas
      if (progress > 0.3) {
        stroke(168, 218, 220, alpha * 0.5);
        strokeWeight(2 * (1 - progress));
        ellipse(0, 0, radius * 2.5);
      }
    } else {
      lastPulseTimes.splice(i, 1);
    }
  }
  
  pop();
}

function updateParticles() {
  for (let particle of particles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Wrap around
    if (particle.x < 0) particle.x = width;
    if (particle.x > width) particle.x = 0;
    if (particle.y < 0) particle.y = height;
    if (particle.y > height) particle.y = 0;
    
    // Movimiento sutil
    particle.vx += (random(-0.1, 0.1) - particle.vx) * 0.1;
    particle.vy += (random(-0.1, 0.1) - particle.vy) * 0.1;
  }
}

function updateBPM() {
  // Limpiar pulsos antiguos (solo los últimos 10 segundos)
  let cutoff = millis() - 10000;
  lastPulseTimes = lastPulseTimes.filter(pulse => pulse.time > cutoff);
  
  // Calcular BPM basado en los últimos pulsos
  if (lastPulseTimes.length > 1) {
    let intervals = [];
    for (let i = 1; i < lastPulseTimes.length; i++) {
      intervals.push(lastPulseTimes[i].time - lastPulseTimes[i-1].time);
    }
    
    if (intervals.length > 0) {
      let avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      bpm = Math.round(60000 / avgInterval);
    }
  } else {
    bpm = 0;
  }
  
  // Actualizar UI
  document.getElementById('bpm-counter').textContent = bpm;
}

function handlePulse(event) {
  event.preventDefault();
  sendPulse();
}

function mousePressed() {
  sendPulse();
}

function sendPulse() {
  // Registrar tiempo del pulso
  let pulseData = {
    time: millis(),
    intensity: pulseIntensity
  };
  lastPulseTimes.push(pulseData);
  
  // Efecto visual local
  createPulseEffect();
  
  // Enviar al servidor
  if (socket && socket.connected) {
    let pulsePayload = {
      intensity: pulseIntensity,
      mode: pulseMode,
      timestamp: Date.now()
    };
    
    socket.emit('pulse', pulsePayload);
    pulsesCount++;
    updateUI();
  }
}

function createPulseEffect() {
  // Efecto en el elemento de la luna
  const moonCore = document.querySelector('.moon-core');
  moonCore.classList.add('pulse-active');
  
  setTimeout(() => {
    moonCore.classList.remove('pulse-active');
  }, 600);
  
  // Crear anillo de pulso
  const pulseRings = document.getElementById('pulse-rings');
  const ring = document.createElement('div');
  ring.className = 'pulse-ring';
  ring.style.animationDuration = (2 / pulseIntensity) + 's';
  pulseRings.appendChild(ring);
  
  // Remover anillo después de la animación
  setTimeout(() => {
    if (ring.parentNode) {
      ring.parentNode.removeChild(ring);
    }
  }, 2000 / pulseIntensity);
  
  // Efecto en partículas
  particles.forEach(particle => {
    let distance = dist(particle.x, particle.y, width/2, height/2);
    let force = map(distance, 0, width/2, pulseIntensity * 2, 0);
    let angle = atan2(particle.y - height/2, particle.x - width/2);
    
    particle.vx += cos(angle) * force * 0.1;
    particle.vy += sin(angle) * force * 0.1;
  });
}

function setupControls() {
  // Control de intensidad
  const intensitySlider = document.getElementById('intensity-slider');
  const intensityValue = document.getElementById('intensity-value');
  
  intensitySlider.addEventListener('input', function() {
    pulseIntensity = parseFloat(this.value);
    intensityValue.textContent = pulseIntensity.toFixed(1);
  });
  
  // Botones de modo
  const modeButtons = document.querySelectorAll('.mode-btn');
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      modeButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      pulseMode = this.dataset.mode;
    });
  });
  
  // Área de pulso principal
  document.getElementById('pulse-area').addEventListener('click', function(e) {
    // Solo si no se hizo clic en controles
    if (e.target === this || e.target.closest('.moon-visualization')) {
      sendPulse();
    }
  });
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
  
  socket.on('newPulse', (pulse) => {
    // Confirmación visual del pulso enviado
    console.log('Pulso confirmado:', pulse);
  });
}

function updateUI() {
  document.getElementById('connection-status').textContent = connectionStatus;
  document.getElementById('connection-status').className = 
    connectionStatus === 'Conectado' ? 'connected' : 'disconnected';
  document.getElementById('pulses-count').textContent = pulsesCount;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Reposicionar partículas
  particles.forEach(particle => {
    if (particle.x > width) particle.x = width - 10;
    if (particle.y > height) particle.y = height - 10;
  });
  
  // Reposicionar ondas
  backgroundWaves.forEach(wave => {
    if (wave.y > height) wave.y = height - 10;
  });
}

// Función para cambios de modo especiales
function setRhythmMode() {
  if (pulseMode === 'rhythm') {
    // Auto-pulso rítmico (opcional)
    setInterval(() => {
      if (pulseMode === 'rhythm') {
        sendPulse();
      }
    }, 60000 / 120); // 120 BPM por defecto
  }
}