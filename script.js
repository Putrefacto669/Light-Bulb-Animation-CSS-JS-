const bulbs = document.querySelectorAll(".bulb");
const clickSound = new Audio("Click.mp3");
clickSound.volume = 0.4;

/* ====== INICIALIZACIÓN ====== */
const hour = new Date().getHours();
const isDayTime = hour >= 6 && hour < 18;
const body = document.body;
const particlesContainer = document.createElement('div');
particlesContainer.className = 'particles';
document.body.appendChild(particlesContainer);

// Configurar modo inicial
body.classList.add(isDayTime ? "day" : "night");
body.classList.remove(isDayTime ? "night" : "day");

// Estado
let activeBulbs = new Set();
let allBulbsOn = false;
let autoMode = true;

/* ====== ELEMENTOS DE UI ====== */
function updateUI() {
  document.getElementById('currentTime').textContent = 
    new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  
  document.getElementById('currentMode').textContent = 
    autoMode ? 'Modo Automático' : 'Modo Manual';
  
  document.getElementById('activeBulbs').textContent = 
    `${activeBulbs.size}/3`;
  
  // Actualizar íconos de modo
  const dayIcon = document.querySelector('.day-icon');
  const nightIcon = document.querySelector('.night-icon');
  
  if (body.classList.contains('day')) {
    dayIcon.style.display = 'inline';
    nightIcon.style.display = 'none';
  } else {
    dayIcon.style.display = 'none';
    nightIcon.style.display = 'inline';
  }
}

/* ====== SISTEMA DE PARTÍCULAS ====== */
function createParticle(x, y, color) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 10 + 5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.backgroundColor = color;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  particlesContainer.appendChild(particle);
  
  // Animación
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 3 + 2;
  const dx = Math.cos(angle) * speed;
  const dy = Math.sin(angle) * speed;
  
  let opacity = 0.6;
  let currentSize = size;
  
  function animate() {
    opacity -= 0.02;
    currentSize *= 0.95;
    
    particle.style.opacity = opacity;
    particle.style.transform = `translate(${dx * 10}px, ${dy * 10}px) scale(${currentSize / size})`;
    
    if (opacity > 0 && currentSize > 1) {
      requestAnimationFrame(animate);
    } else {
      particle.remove();
    }
  }
  
  animate();
}

/* ====== FUNCIONES PRINCIPALES ====== */
function toggleBulb(bulb) {
  clickSound.currentTime = 0;
  clickSound.play().catch(e => console.log("Audio no cargado automáticamente"));
  
  const isActive = bulb.classList.contains('on');
  
  if (isActive) {
    // Apagar
    bulb.classList.remove('on', 'swing', 'idle');
    bulb.querySelector('.cord').classList.remove('swing');
    activeBulbs.delete(bulb);
    
    // Crear partículas al apagar
    const rect = bulb.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      createParticle(
        rect.left + rect.width / 2,
        rect.top + 340,
        bulb.classList.contains('yellow') ? '#FFD700' : 
        bulb.classList.contains('blue') ? '#00D4FF' : '#FF69B4'
      );
    }
  } else {
    // Encender
    bulb.classList.add('on', 'swing');
    bulb.querySelector('.cord').classList.add('swing');
    activeBulbs.add(bulb);
    
    // Crear partículas al encender
    const rect = bulb.getBoundingClientRect();
    for (let i = 0; i < 15; i++) {
      createParticle(
        rect.left + rect.width / 2,
        rect.top + 340,
        bulb.classList.contains('yellow') ? '#FFFF00' : 
        bulb.classList.contains('blue') ? '#00FFFF' : '#FF1493'
      );
    }
    
    // Balanceo infinito después del swing inicial
    setTimeout(() => {
      bulb.classList.remove('swing');
      bulb.classList.add('idle');
    }, 1200);
  }
  
  // Actualizar fondo si hay bombillos activos
  updateBackground();
  updateUI();
}

function toggleAllBulbs() {
  clickSound.currentTime = 0;
  clickSound.play();
  
  allBulbsOn = !allBulbsOn;
  
  if (allBulbsOn) {
    // Encender todos
    bulbs.forEach(bulb => {
      bulb.classList.add('on');
      bulb.classList.remove('idle');
      activeBulbs.add(bulb);
      
      if (bulb === bulbs[0]) {
        bulb.classList.add('swing');
        bulb.querySelector('.cord').classList.add('swing');
        setTimeout(() => {
          bulb.classList.remove('swing');
          bulb.classList.add('idle');
        }, 1200);
      } else {
        bulb.classList.add('idle');
      }
    });
    
    // Efecto de partículas masivo
    bulbs.forEach((bulb, index) => {
      setTimeout(() => {
        const rect = bulb.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
          createParticle(
            rect.left + rect.width / 2,
            rect.top + 340,
            bulb.classList.contains('yellow') ? '#FFFF00' : 
            bulb.classList.contains('blue') ? '#00FFFF' : '#FF1493'
          );
        }
      }, index * 200);
    });
  } else {
    // Apagar todos
    bulbs.forEach(bulb => {
      bulb.classList.remove('on', 'swing', 'idle');
      bulb.querySelector('.cord').classList.remove('swing');
    });
    activeBulbs.clear();
    
    // Efecto de partículas al apagar
    bulbs.forEach(bulb => {
      const rect = bulb.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        createParticle(
          rect.left + rect.width / 2,
          rect.top + 340,
          '#888888'
        );
      }
    });
  }
  
  updateBackground();
  updateUI();
}

function updateBackground() {
  if (activeBulbs.size === 0) {
    // Restaurar fondo según modo
    body.style.background = body.classList.contains('day') 
      ? 'linear-gradient(135deg, #f2f2f2 0%, #e6e6e6 100%)' 
      : 'linear-gradient(135deg, #111 0%, #222 100%)';
  } else {
    // Crear gradiente con colores activos
    const activeColors = Array.from(activeBulbs).map(bulb => 
      bulb.classList.contains('yellow') ? '#fef9c3' :
      bulb.classList.contains('blue') ? '#cceeff' : '#ffd6f5'
    );
    
    if (activeColors.length === 1) {
      body.style.background = activeColors[0];
    } else {
      const gradient = activeColors.map((color, i) => 
        `${color} ${(i / activeColors.length) * 100}%, ${color} ${((i + 1) / activeColors.length) * 100}%`
      ).join(', ');
      body.style.background = `linear-gradient(135deg, ${gradient})`;
    }
  }
}

function toggleDayNight() {
  clickSound.currentTime = 0;
  clickSound.play();
  
  autoMode = false;
  body.classList.toggle('day');
  body.classList.toggle('night');
  
  // Actualizar fondo si no hay bombillos activos
  if (activeBulbs.size === 0) {
    updateBackground();
  }
  
  updateUI();
}

function resetAll() {
  clickSound.currentTime = 0;
  clickSound.play();
  
  bulbs.forEach(bulb => {
    bulb.classList.remove('on', 'swing', 'idle');
    bulb.querySelector('.cord').classList.remove('swing');
  });
  activeBulbs.clear();
  allBulbsOn = false;
  updateBackground();
  updateUI();
}

/* ====== EVENT LISTENERS ====== */
bulbs.forEach((bulb, index) => {
  bulb.addEventListener('click', () => toggleBulb(bulb));
  
  // Efecto hover
  bulb.addEventListener('mouseenter', () => {
    if (!bulb.classList.contains('on')) {
      bulb.style.transform = 'translateY(-8px)';
    }
  });
  
  bulb.addEventListener('mouseleave', () => {
    if (!bulb.classList.contains('on')) {
      bulb.style.transform = 'translateY(0)';
    }
  });
});

/* ====== CONTROLES DE TECLADO ====== */
document.addEventListener('keydown', (e) => {
  switch(e.key.toLowerCase()) {
    case ' ':
    case 'enter':
      e.preventDefault();
      toggleDayNight();
      break;
    case '1':
    case '2':
    case '3':
      const index = parseInt(e.key) - 1;
      if (bulbs[index]) toggleBulb(bulbs[index]);
      break;
    case 'a':
      toggleAllBulbs();
      break;
    case 'escape':
      resetAll();
      break;
    case 'm':
      autoMode = !autoMode;
      updateUI();
      break;
  }
});

/* ====== CREAR CONTROLES ====== */
function createControls() {
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.innerHTML = `
    <button id="toggleMode">
      <i class="fas fa-sun-moon"></i> Día/Noche (Espacio)
    </button>
    <button id="toggleAll">
      <i class="fas fa-lightbulb"></i> Todos (A)
    </button>
    <button id="reset">
      <i class="fas fa-power-off"></i> Apagar (Esc)
    </button>
  `;
  
  document.body.appendChild(controls);
  
  document.getElementById('toggleMode').addEventListener('click', toggleDayNight);
  document.getElementById('toggleAll').addEventListener('click', toggleAllBulbs);
  document.getElementById('reset').addEventListener('click', resetAll);
}

/* ====== INICIALIZAR ====== */
document.addEventListener('DOMContentLoaded', () => {
  createControls();
  updateUI();
  
  // Actualizar reloj cada minuto
  setInterval(updateUI, 60000);
  
  // Auto-activar un bombillo al inicio (efecto de bienvenida)
  setTimeout(() => {
    if (activeBulbs.size === 0) {
      toggleBulb(bulbs[1]); // Activar el bombillo del medio
    }
  }, 1000);
  
  console.log('✨ Sistema de Bombillos Mejorado ✨');
  console.log('Controles:');
  console.log('- Click en bombillos: encender/apagar');
  console.log('- Espacio: alternar día/noche');
  console.log('- 1,2,3: bombillos específicos');
  console.log('- A: todos los bombillos');
  console.log('- Esc: apagar todo');
  console.log('- M: alternar modo automático/manual');
});

/* ====== AUTO-MODO (OPCIONAL) ====== */
setInterval(() => {
  if (autoMode) {
    const currentHour = new Date().getHours();
    const shouldBeDay = currentHour >= 6 && currentHour < 18;
    const isCurrentlyDay = body.classList.contains('day');
    
    if (shouldBeDay !== isCurrentlyDay) {
      body.classList.toggle('day');
      body.classList.toggle('night');
      if (activeBulbs.size === 0) updateBackground();
      updateUI();
    }
  }
}, 60000); // Verificar cada minuto
