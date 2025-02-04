export interface JoystickConfig {
  radius?: number;
  lockX?: boolean;
  lockY?: boolean;
  throttleTime?: number;
  deadZone?: number;
  onMove?: (data: JoystickData) => void;
}

export interface JoystickData {
  x: number;
  y: number;
  angle: number;
  distance: number;
}

export class VirtualJoystick {
  private element: HTMLElement;
  private currentX = 0;
  private currentY = 0;
  private isActive = false;
  private config: Required<JoystickConfig>;
  
  constructor(element: HTMLElement, config: JoystickConfig = {}) {
    this.element = element;
    this.config = {
      radius: 50,
      lockX: false,
      lockY: false,
      throttleTime: 50,
      deadZone: 0.1,
      onMove: () => {},
      ...config
    };

    this.initEvents();
  }

  private getPosition(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.element.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2
    };
  }

  private handleMove = this.throttle((e: MouseEvent | TouchEvent) => {
    if (!this.isActive) return;

    let { x, y } = this.getPosition(e);
    const { radius, lockX, lockY } = this.config;
    
    // 应用方向锁定
    if (lockX) y = 0;
    if (lockY) x = 0;

    // 限制在圆形区域内
    const distance = Math.min(Math.sqrt(x*x + y*y), radius);
    const angle = Math.atan2(y, x);
    
    this.currentX = lockY ? 0 : Math.cos(angle) * distance;
    this.currentY = lockX ? 0 : Math.sin(angle) * distance;

    this.config.onMove?.(this.getOutputData());
  });

  private getOutputData(): JoystickData {
    const { radius, deadZone } = this.config;
    let normalizedX = this.currentX / radius;
    let normalizedY = this.currentY / radius;
    
    // 应用死区处理
    const rawDistance = Math.sqrt(normalizedX**2 + normalizedY**2);
    if (rawDistance < deadZone) {
      normalizedX = 0;
      normalizedY = 0;
    }

    // 限制精度到两位小数
    return {
      x: Number(normalizedX.toFixed(2)),
      y: Number(normalizedY.toFixed(2)),
      angle: Number(Math.atan2(normalizedY, normalizedX).toFixed(2)),
      distance: Number(Math.min(rawDistance, 1).toFixed(2))
    };
  }

  private initEvents() {
    const start = (e: Event) => {
      this.isActive = true;
      this.handleMove(e as MouseEvent | TouchEvent);
    };

    // 鼠标事件
    this.element.addEventListener('mousedown', start);
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('mouseup', this.reset);

    // 触摸事件
    this.element.addEventListener('touchstart', start);
    document.addEventListener('touchmove', this.handleMove);
    document.addEventListener('touchend', this.reset);
  }

  private reset = () => {
    this.isActive = false;
    this.currentX = 0;
    this.currentY = 0;
    this.config.onMove?.(this.getOutputData());
  };

  private throttle(fn: Function) {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= this.config.throttleTime) {
        fn(...args);
        lastCall = now;
      }
    };
  }

  destroy() {
    // 清理鼠标事件
    this.element.removeEventListener('mousedown', this.startHandler);
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('mouseup', this.reset);

    // 清理触摸事件
    this.element.removeEventListener('touchstart', this.startHandler);
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('touchend', this.reset);
  }

  // 提取事件处理函数为类属性以便移除
  private startHandler = (e: Event) => {
    this.isActive = true;
    this.handleMove(e as MouseEvent | TouchEvent);
  };
} 