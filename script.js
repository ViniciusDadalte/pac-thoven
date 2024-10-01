const beethoven = document.getElementById('beethoven');
const ghosts = document.querySelectorAll('.ghost');
const points = document.querySelectorAll('.point');
const powerUp = document.getElementById('powerup');
const walls = document.querySelectorAll('.wall');

let beethovenX = 10;
let beethovenY = 10;
let powerUpActive = false;
let ghostsDefeated = 0; // Contador de fantasmas derrotados
const totalGhosts = ghosts.length; // Total de fantasmas
const gameArea = {
  width: 500,
  height: 500,
};

// Movimento do Beethoven
document.addEventListener('keydown', (e) => {
  const prevX = beethovenX;
  const prevY = beethovenY;

  switch (e.key) {
    case 'ArrowUp':
      if (beethovenY > 0) beethovenY -= 10;
      break;
    case 'ArrowDown':
      if (beethovenY < gameArea.height - 40) beethovenY += 10;
      break;
    case 'ArrowLeft':
      if (beethovenX > 0) beethovenX -= 10;
      break;
    case 'ArrowRight':
      if (beethovenX < gameArea.width - 40) beethovenX += 10;
      break;
  }

  if (!checkCollisionWithWalls(beethovenX, beethovenY)) {
    beethoven.style.top = beethovenY + 'px';
    beethoven.style.left = beethovenX + 'px';
  } else {
    // Reverte se colidir com a parede
    beethovenX = prevX;
    beethovenY = prevY;
  }

  checkCollisionWithPoints();
  checkCollisionWithPowerUp();
  checkCollisionWithGhosts();
});

// Verifica se Beethoven colide com paredes
function checkCollisionWithWalls(x, y) {
  let collision = false;
  walls.forEach((wall) => {
    const wallRect = wall.getBoundingClientRect();
    const beethovenRect = beethoven.getBoundingClientRect();

    if (
      beethovenRect.left + x < wallRect.right &&
      beethovenRect.right + x > wallRect.left &&
      beethovenRect.top + y < wallRect.bottom &&
      beethovenRect.bottom + y > wallRect.top
    ) {
      collision = true;
    }
  });
  return collision;
}

// Verifica se Beethoven colide com pontos
function checkCollisionWithPoints() {
  points.forEach((point) => {
    const pointX = parseInt(point.style.left);
    const pointY = parseInt(point.style.top);

    if (Math.abs(beethovenX - pointX) < 20 && Math.abs(beethovenY - pointY) < 20) {
      point.style.display = 'none'; // Remove ponto ao coletar
    }
  });
}

// Verifica se Beethoven colide com o Power Up
function checkCollisionWithPowerUp() {
  const powerUpX = parseInt(powerUp.style.left);
  const powerUpY = parseInt(powerUp.style.top);

  if (Math.abs(beethovenX - powerUpX) < 30 && Math.abs(beethovenY - powerUpY) < 30) {
    powerUp.style.display = 'none';
    powerUpActive = true;
    setTimeout(() => {
      powerUpActive = false; // O efeito dura 10 segundos
    }, 10000);
  }
}

// Movimento dos fantasmas
function moveGhosts() {
  ghosts.forEach((ghost) => {
    const ghostX = parseInt(ghost.style.left);
    const ghostY = parseInt(ghost.style.top);
    const dx = beethovenX - ghostX;
    const dy = beethovenY - ghostY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    ghost.style.left = ghostX + (dx / dist) * 2 + 'px';
    ghost.style.top = ghostY + (dy / dist) * 2 + 'px';
  });

  setTimeout(moveGhosts, 100);
}

// Verifica se Beethoven colide com fantasmas
function checkCollisionWithGhosts() {
  ghosts.forEach((ghost) => {
    const ghostX = parseInt(ghost.style.left);
    const ghostY = parseInt(ghost.style.top);

    if (Math.abs(beethovenX - ghostX) < 40 && Math.abs(beethovenY - ghostY) < 40) {
      if (powerUpActive) {
        ghost.style.display = 'none'; // Fantasma morre
        ghostsDefeated++; // Incrementa o contador de fantasmas derrotados
        checkVictory(); // Verifica se o jogador ganhou
      } else {
        alert('Você foi pego pelo fantasma!');
        resetGame();
      }
    }
  });
}

// Verifica se o jogador ganhou
function checkVictory() {
  if (ghostsDefeated === totalGhosts) {
    alert('Parabéns! Você derrotou o fantasma!');
    resetGame();
  }
}

function resetGame() {
  beethovenX = 10;
  beethovenY = 10;
  ghostsDefeated = 0; // Reseta o contador de fantasmas derrotados
  ghosts.forEach((ghost) => {
    ghost.style.display = 'block';
  });
  powerUp.style.display = 'block';
  points.forEach((point) => {
    point.style.display = 'block';
  });
}

moveGhosts(); // Inicia o movimento dos fantasmas
