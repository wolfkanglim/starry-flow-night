const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function start(){

     ctx.fillStyle = '#fff';
     ctx.strokeStyle = 'white';
     ctx.lineWidth = Math.random() * 3 + 0.2;

     class Particle {
          constructor(canvas){
               this.canvas = canvas;
               this.x = Math.floor(Math.random() * this.canvas.width);
               this.y = Math.floor(Math.random() * this.canvas.height);
               this.speedX;
               this.speedY;
               this.speedModifier = Math.random() * 3 - 1.5;
               this.history = [{x: this.x, y: this.y}];
               this.maxLength = Math.floor(Math.random() * 550 + 50);
               this.angle = 0;
               this.timer = this.maxLength * 2;
               this.colors = ['#75d5fd', '#b76cfd', '#ff2291', '#011ffd', '#e83500', '#ff1493', '#fff3f1', '#9d72ff'];
               this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
          }
          draw(context){
               context.fillStyle = this.color;
               context.fillRect(this.x, this.y, 2, 2);
               context.strokeStyle = this.color;
               context.beginPath();
               context.moveTo(this.history[0].x, this.history[0].y);
               for(let i = 0; i < this.history.length; i++){
                    context.lineTo(this.history[i].x, this.history[i].y);
               }
               
               context.stroke();
          }
          update(){
               this.timer--;
               if(this.timer > 1){
                         //get index of each cell to get angle
                    let x = Math.floor(this.x/this.canvas.cellSize);
                    let y = Math.floor(this.y/this.canvas.cellSize);
                    let index = y * this.canvas.cols + x;
                    this.angle = this.canvas.flowField[index];
                    this.speedX = Math.cos(this.angle) * 0.5;
                    this.speedY = Math.sin(this.angle) * 0.5;
                    this.x += this.speedX * this.speedModifier;
                    this.y += this.speedY * this.speedModifier;
                    //this.angle += 0.5;
                    // this.x += this.speedX + Math.sin(this.angle) * 3;
                    // this.y += this.speedY + Math.cos(this.angle) * 4;
                    this.history.push({x: this.x, y: this.y});
                    if(this.history.length > this.maxLength){ 
                         this.history.shift();
                    }
               
               } else if(this.history > 1){
                    this.history.shift();
               } else {
                    this.reset();
               }
          }
          reset(){
               this.x = Math.floor(Math.random() * this.canvas.width);
               this.y = Math.floor(Math.random() * this.canvas.height);
               this.history = [{x: this.x, y: this.y}];
               this.timer = this.maxLength * 2;
          }
     };

     class Effect {
          constructor(canvas){
               this.canvas = canvas;
               this.width = this.canvas.width;
               this.height = this.canvas.height;
               this.particles = [];
               this.numberOfParticles = 1440;
               this.cellSize = 30;
               this.rows;
               this.cols;
               this.flowField = [];
               // this.curve = 2;
               // this.zoom = 0.1;
               this.curve = Math.random() * 2 + 0.1;
               this.zoom = Math.random() * 1 + 0.1;
               this.init();
               
          }
          init(){
               this.rows = Math.floor(this.height/this.cellSize);
               this.cols = Math.floor(this.width/this.cellSize);
               for(let y = 0; y < this.rows; y++){
                    for(let x = 0; x < this.cols; x++){
                         let angle = (Math.sin(y * this.zoom) + Math.cos(x * this.zoom)) * this.curve;
                         this.flowField.push(angle);
                    }
               }
               for(let i = 0; i < this.numberOfParticles; i++){
                    this.particles.push(new Particle(this));
               }
          }
          render(context){
               this.particles.forEach(particle => {
                    particle.draw(context);
                    particle.update()
               })
          }
     };

     const effect = new Effect(canvas);

     function animate(){
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          effect.render(ctx);
          requestAnimationFrame(animate);
     };

     animate();

};

window.addEventListener('click', start);
