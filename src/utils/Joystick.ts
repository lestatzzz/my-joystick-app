interface JoystickConfig {
    lockAxis?: 'x' | 'y' | null;
    baseImage: string;
    stickImage: string;
    baseRadius: number;
    stickRadius: number;
    onMove: (delta: { x: number; y: number }) => void;
    onEnd?: () => void;
}

export class Joystick {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private config: JoystickConfig;
    
    private center = { x: 0, y: 0 };
    private currentPos = { x: 0, y: 0 };
    private isDragging = false;
    private touchId: number | null = null;
    private baseImage: HTMLImageElement;
    private stickImage: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement, config: JoystickConfig) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.config = config;
        
        // 初始化尺寸
        this.center = { 
            x: canvas.width / 2, 
            y: canvas.height / 2 
        };
        this.currentPos = { ...this.center };

        // 加载图片
        this.baseImage = new Image();
        this.stickImage = new Image();
        this.baseImage.src = config.baseImage;
        this.stickImage.src = config.stickImage;
        this.baseImage.onload = () => this.draw();
        this.stickImage.onload = () => this.draw();

        this.bindEvents();
    }

    private bindEvents() {
        this.canvas.addEventListener('mousedown', this.handleStart);
        this.canvas.addEventListener('mousemove', this.handleMove);
        this.canvas.addEventListener('mouseup', this.handleEnd);
        this.canvas.addEventListener('touchstart', this.handleStart);
        this.canvas.addEventListener('touchmove', this.handleMove);
        this.canvas.addEventListener('touchend', this.handleEnd);
    }

    private handleStart = (e: MouseEvent | TouchEvent) => {
        if (e instanceof TouchEvent) {
            for (const touch of e.touches) {
                const pos = this.getMousePos(touch);
                if (this.distance(pos, this.currentPos) < this.config.stickRadius && !this.touchId) {
                    this.touchId = touch.identifier;
                    this.isDragging = true;
                    break;
                }
            }
            return;
        }

        const pos = this.getMousePos(e);
        if (this.distance(pos, this.currentPos) < this.config.stickRadius) {
            this.isDragging = true;
        }
    };

    private handleMove = (e: MouseEvent | TouchEvent) => {
        if (!this.isDragging) return;
        e.preventDefault();

        let pos: { x: number; y: number };
        if (e instanceof TouchEvent) {
            const touch = Array.from(e.touches).find(t => t.identifier === this.touchId);
            if (!touch) return;
            pos = this.getMousePos(touch);
        } else {
            pos = this.getMousePos(e);
        }

        const delta = {
            x: pos.x - this.center.x,
            y: pos.y - this.center.y
        };

        const dist = Math.min(this.distance(pos, this.center), this.config.baseRadius);

        const angle = Math.atan2(delta.y, delta.x);
        switch (this.config.lockAxis) {
            case 'x':
                this.currentPos = {
                    x: this.center.x + (delta.x > 0 ? dist : -dist),
                    y: this.center.y
                };
                break;
            case 'y':
                this.currentPos = {
                    x: this.center.x,
                    y: this.center.y + (delta.y > 0 ? dist : -dist)
                };
                break;
            default:
                this.currentPos = {
                    x: this.center.x + Math.cos(angle) * dist,
                    y: this.center.y + Math.sin(angle) * dist
                };
        }

        this.draw();
        this.config.onMove({
            x: (this.currentPos.x - this.center.x) / this.config.baseRadius,
            y: (this.currentPos.y - this.center.y) / this.config.baseRadius
        });
    };

    private handleEnd = () => {
        this.isDragging = false;
        this.touchId = null;
        this.currentPos = { ...this.center };
        this.draw();
        this.config.onEnd?.();
    };

    private draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制底座
        if (this.baseImage.complete) {
            this.ctx.drawImage(
                this.baseImage,
                this.center.x - this.baseImage.width / 2,
                this.center.y - this.baseImage.height / 2
            );
        }

        // 绘制摇杆头
        if (this.stickImage.complete) {
            this.ctx.drawImage(
                this.stickImage,
                this.currentPos.x - this.stickImage.width / 2,
                this.currentPos.y - this.stickImage.height / 2
            );
        }
    }

    private getMousePos(e: MouseEvent | Touch): { x: number; y: number } {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    private distance(a: { x: number; y: number }, b: { x: number; y: number }) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    destroy() {
        this.canvas.removeEventListener('mousedown', this.handleStart);
        this.canvas.removeEventListener('mousemove', this.handleMove);
        this.canvas.removeEventListener('mouseup', this.handleEnd);
        this.canvas.removeEventListener('touchstart', this.handleStart);
        this.canvas.removeEventListener('touchmove', this.handleMove);
        this.canvas.removeEventListener('touchend', this.handleEnd);
    }
} 