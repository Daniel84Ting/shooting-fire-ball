const canvas = document.querySelector('canvas');
if (canvas.getContext) {
  const ctx = canvas.getContext('2d');

  canvas.width = 1300;
  canvas.height = 500;

  const scorePoint = document.querySelector('#scorePoint');
  const startGameBtn = document.querySelector('#startGameBtn');
  const ContainerModal = document.querySelector('#ContainerModal');
  const scoreNum = document.querySelector('#scoreNum');

  class Character {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    jump() {
      if (character.classList != 'animate') {
        character.classList.add('animate');
      }

      setTimeout(function () {
        character.classList.remove('animate');
      }, 500);
    }
  }

  class Projectile {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      this.draw();
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }
  class FireBall {
    constructor(x, y, radius, color, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.velocity = velocity;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      this.draw();
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }

  const x = 500;
  const y = 380;

  let character = new Character(x, y, 30, 'rgba(255,255,255,0.1');
  let projectiles = [];
  let fireballs = [];

  function initiate() {
    character = new Character(x, y, 30, 'rgba(255,255,255,0.1');
    projectiles = [];
    fireballs = [];
    score = 0;
    scorePoint.innerHTML = score;
    scoreNum.innerHTML = score;
  }

  function spawnFireball() {
    setInterval(() => {
      const radius = 20;
      const x = canvas.width;
      const y = Math.random() * canvas.height;
      const color = 'yellow';
      const angle = Math.atan2(canvas.height - y, canvas.width / 6 - x);
      const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };
      fireballs.push(new FireBall(x, y, radius, color, velocity));
    }, 1000);
  }
  let jokes;
  let animationId;
  let score = 0;
  function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    character.draw();
    projectiles.forEach((projectile, index) => {
      projectile.update();
      // remove from edges of screen //
      if (
        projectile.x + projectile.radius < 0 ||
        projectile.x - projectile.radius > canvas.width ||
        projectile.y + projectile.radius < 0 ||
        projectile.y - projectile.radius > canvas.height
      ) {
        setTimeout(() => {
          projectiles.splice(index, 1);
        }, 0);
      }
    });
    fireballs.forEach((fireball, index) => {
      fireball.update();
      const distance = Math.hypot(
        character.x - fireball.x,
        character.y - fireball.y,
      );
      // Game Over //
      if (distance - fireball.radius - character.radius < 1) {
        // console.log('Game over');
        cancelAnimationFrame(animationId);
        ContainerModal.style.display = 'flex';
        scoreNum.innerHTML = score;
      }

      projectiles.forEach((projectile, projectileIndex) => {
        const distance = Math.hypot(
          projectile.x - fireball.x,
          projectile.y - fireball.y,
        );
        // console.log(distance);

        // when gun shoot the fireball //
        if (distance - fireball.radius - projectile.radius < 1) {
          // increase player score //
          score += 100;
          scorePoint.innerHTML = score;
          // console.log(score);

          setTimeout(() => {
            fireballs.splice(index, 1);
            projectiles.splice(projectileIndex, 1);
          }, 0);
        }
      });
    });
  }

  addEventListener('click', (event) => {
    const angle = Math.atan2(
      event.clientY - character.y - 220,
      event.clientX - character.x,
    );
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    projectiles.push(new Projectile(500, 380, 5, 'red', velocity));
  });
  startGameBtn.addEventListener('click', (Event) => {
    initiate();
    animate();
    spawnFireball();
    ContainerModal.style.display = 'none';
  });
  addEventListener('keypress', (Event) => {
    if (Event.code === 'Space') {
      character.jump();
    }
  });
}

$(() => {
  $.ajax({
    url: 'https://official-joke-api.appspot.com/jokes/random',
  }).then(
    (data) => {
      $('#jokes').html(data.setup);
      $('#punchline').html(data.punchline);
    },
    () => {
      console.log('bad');
    },
  );
});
