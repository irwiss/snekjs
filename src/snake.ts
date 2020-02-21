interface SnekPart {
    x: number;
    y: number;
    el: HTMLElement;
}

enum SnekDirection { Invalid, Up, Left, Down, Right }

let map: SnekMap;

class SnekMap {
    readonly size: number = 24;
    readonly fieldSize: number = 600 / 24;
    foodX: number;
    foodY: number;
    map: HTMLElement;
    food: HTMLElement;
    snek: SnekPart[] = [];
    direction: SnekDirection = SnekDirection.Invalid;
    prevDirection: SnekDirection = SnekDirection.Invalid;
    timer: number;
    
    constructor() {
        let snekMap = document.getElementById('snek');
        if (snekMap != null) {
            this.map = snekMap;
        }

        let foodEl = document.getElementById('food');
        if (foodEl != null) {
            this.food = foodEl;
        }

        this.die();

        window.onkeydown = this.handle_input;
    }

    private move() {
        let self = map;
        if (self.direction == SnekDirection.Invalid) { return; }
       
        let tail = self.snek.pop();
        let head = self.snek[0];
        if (tail == null) return;
        self.snek.unshift(tail);

        let oldTailX = tail.x; // for handling growth
        let oldTailY = tail.y;

        switch (self.direction) {
            case SnekDirection.Left:
                tail.x = head.x - 1; tail.y = head.y;
                break;
            case SnekDirection.Up:
                tail.x = head.x; tail.y = head.y - 1;
                break;
            case SnekDirection.Right:
                tail.x = head.x + 1; tail.y = head.y;
                break;
            case SnekDirection.Down:
                tail.x = head.x; tail.y = head.y + 1;
                break;
        }
        self.prevDirection = self.direction;
        
        head.el.innerHTML = '=';
        tail.el.innerHTML = 'H';

        if (tail.x < 0) { tail.x = self.fieldSize - 1; }
        if (tail.y < 0) { tail.y = self.fieldSize - 1; }
        if (tail.x > self.fieldSize - 1) { tail.x = 0; }
        if (tail.y > self.fieldSize - 1) { tail.y = 0; }

        if (tail.x == self.foodX && tail.y == self.foodY) {
            self.randomFood();
            let el = document.createElement("div");

            let p = {
                x: oldTailX,
                y: oldTailY,
                el: el
            };

            el.className = 'snekpart';
            el.innerHTML = '=';
            
            self.map.appendChild(el);
            self.snek.push(p);
        }

        let tail2 = tail;
        let snekReversed = self.snek.slice().reverse();
        let intersection = snekReversed.find(p => p.x == tail2.x && p.y == tail2.y);
        
        if (intersection != tail) {
            self.die();
        }

        self.drawSnek();
        self.setSpeed(200 - self.snek.length * 2);
    }

    private die() {
        this.prevDirection  = SnekDirection.Invalid;
        this.direction = SnekDirection.Invalid;
        this.randomFood();
        this.initSnek();
        this.drawSnek();
        this.setSpeed(200);
    }

    private setSpeed(speed: number) {
        clearInterval(this.timer);
        this.timer = setInterval(this.move, speed);
    }

    private handle_input(ev: KeyboardEvent) {
        switch (ev.keyCode) {
            case 38: // up arrow
            case 87: // w
                if (map.prevDirection != SnekDirection.Down) {
                    map.direction =  SnekDirection.Up;
                }
                break;
            case 40: // down arrow
            case 83: // s
                if (map.prevDirection != SnekDirection.Up) {
                    map.direction = SnekDirection.Down;
                }
                break;
            case 37: // left arrow
            case 65: // a
                if (map.prevDirection != SnekDirection.Right) {
                    map.direction = SnekDirection.Left;
                }
                break;
            case 39: // right arrow
            case 68: // d
                if (map.prevDirection != SnekDirection.Left && map.prevDirection != SnekDirection.Invalid) {
                    map.direction = SnekDirection.Right;
                }
                break;
        }
    }

    public initSnek() {
        for (let i = 0; i < this.snek.length; i++) {
            this.snek[i].el.remove();
        }
        this.snek = [];

        for (let i = 0; i < 3; i++) {
            let el = document.createElement("div");

            let p = {
                x: Math.floor(600 / 24 / 2) + i,
                y: Math.floor(600 / 24 / 2),
                el: el
            };
    
            el.className = 'snekpart';
            el.innerHTML = i == 0 ? 'H' : '=';
            
            this.map.appendChild(el);
            this.snek.push(p);
        }
    }

    private calcPosition(x: number, y: number): {x: number, y: number} {
        let rect = this.map.getBoundingClientRect();
        return { 
            x: rect.left + x * this.size,
            y: rect.top + y * this.size
        };
    }

    private movePart(p: SnekPart) {
        let pos = this.calcPosition(p.x, p.y);
        p.el.style.left = pos.x + 'px';
        p.el.style.top = pos.y + 'px';
    }

    public drawSnek() {
        for (let i = 0; i < this.snek.length; i++) {
            const p = this.snek[i];

            this.movePart(p);
        }
    }

    public randomFood() {
        do {
            this.foodX = Math.floor(Math.random() * this.fieldSize);
            this.foodY = Math.floor(Math.random() * this.fieldSize); 
        } while (this.snek.find(p => p.x == this.foodX && p.y == this.foodY) != null);

        let pos = this.calcPosition(this.foodX, this.foodY);
        this.food.style.top = pos.y + 'px';
        this.food.style.left = pos.x + 'px';
    }
}

window.onload = function() {
    map = new SnekMap();
}
