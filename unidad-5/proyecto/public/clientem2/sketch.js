let socket;
let currentThickness = 5;
let connectionStatus = 'Conectando...';
let changesCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Configurar socket
    socket = io();
    setupSocketEvents();
    
    // Elementos DOM
    const thicknessSlider = document.getElementById('thickness-slider');
    const thicknessValue = document.getElementById('thickness-value');
    const linePreview = document.getElementById('line-preview');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const animatedRoot = document.querySelector('.animated-root');
    
    // Event listeners
    thicknessSlider.addEventListener('input', function() {
        currentThickness = parseFloat(this.value);
        updateThickness();
    });
    
    // Botones preset
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = parseFloat(this.dataset.value);
            thicknessSlider.value = value;
            currentThickness = value;
            updateThickness();
            
            // Actualizar botones activos
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Inicializar
    updateThickness();
});

function updateThickness() {
    // Actualizar valor mostrado
    document.getElementById('thickness-value').textContent = currentThickness;
    
    // Actualizar preview visual
    const linePreview = document.getElementById('line-preview');
    linePreview.style.setProperty('--line-height', currentThickness + 'px');
    
    // Actualizar línea de preview con CSS
    const afterElement = `
        .line-preview::after {
            height: ${currentThickness}px !important;
        }
    `;
    
    // Remover estilo anterior y añadir nuevo
    const existingStyle = document.getElementById('dynamic-preview-style');
    if (existingStyle) existingStyle.remove();
    
    const style = document.createElement('style');
    style.id = 'dynamic-preview-style';
    style.textContent = afterElement;
    document.head.appendChild(style);
    
    // Actualizar animación de raíz
    const animatedRoot = document.querySelector('.animated-root');
    if (animatedRoot) {
        animatedRoot.style.width = Math.max(2, currentThickness) + 'px';
        
        // Ajustar intensidad del color basado en grosor
        const intensity = Math.min(1, currentThickness / 10);
        animatedRoot.style.background = `linear-gradient(to top, 
            rgba(139, 69, 19, ${0.7 + intensity * 0.3}), 
            rgba(160, 82, 45, ${0.8 + intensity * 0.2}))`;
    }
    
    // Enviar al servidor
    if (socket && socket.connected) {
        socket.emit('changeStroke', { weight: currentThickness });
        changesCount++;
        updateUI();
    }
    
    // Efecto de feedback visual
    createThicknessEffect();
}

function createThicknessEffect() {
    // Crear efecto visual temporal para mostrar el cambio
    const growthAnimation = document.getElementById('growth-animation');
    
    // Añadir clase de efecto
    growthAnimation.classList.add('thickness-change');
    
    // Remover clase después de animación
    setTimeout(() => {
        growthAnimation.classList.remove('thickness-change');
    }, 600);
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
    
    socket.on('strokeChanged', (data) => {
        // Confirmación del servidor
        console.log('Cambio de grosor confirmado:', data.weight);
    });
}

function updateUI() {
    document.getElementById('connection-status').textContent = connectionStatus;
    document.getElementById('connection-status').className = 
        connectionStatus === 'Conectado' ? 'connected' : 'disconnected';
    document.getElementById('changes-count').textContent = `Cambios: ${changesCount}`;
}

// Agregar estilos CSS dinámicos para efectos
const additionalStyles = `
    .thickness-change .animated-root {
        animation: thicknessChange 0.6s ease-in-out !important;
    }
    
    @keyframes thicknessChange {
        0% { 
            transform: translateX(-50%) scale(1); 
            filter: brightness(1);
        }
        50% { 
            transform: translateX(-50%) scale(1.1); 
            filter: brightness(1.3);
        }
        100% { 
            transform: translateX(-50%) scale(1); 
            filter: brightness(1);
        }
    }
    
    .growth-animation {
        transition: all 0.3s ease;
    }
    
    .preset-btn:active {
        transform: translateY(0) scale(0.95);
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);