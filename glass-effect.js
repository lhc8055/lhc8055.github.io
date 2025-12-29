class GlassEffect {
    constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // 监听鼠标移动
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateGlassEffects();
        });

        // 监听设备方向（用于移动设备）
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                this.handleDeviceOrientation(e);
            });
        }

        // 初始化玻璃效果
        this.createDynamicGlass();
        this.updateGlassEffects();
    }

    createDynamicGlass() {
        // 创建动态玻璃层
        const layers = 3;
        for (let i = 0; i < layers; i++) {
            this.createGlassLayer(i);
        }

        // 添加CSS变量
        this.updateCSSVariables();
    }

    createGlassLayer(index) {
        const layer = document.createElement('div');
        layer.className = `dynamic-glass-layer layer-${index}`;
        layer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -${index + 1};
            background: radial-gradient(
                circle at ${this.getRandomPosition()},
                rgba(${this.getRandomColor()}, 0.15) 0%,
                transparent 50%
            );
            filter: blur(${40 + index * 20}px);
            opacity: ${0.2 + index * 0.1};
            mix-blend-mode: overlay;
            transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        document.querySelector('.liquid-background').appendChild(layer);

        // 添加浮动动画
        this.animateGlassLayer(layer, index);
    }

    animateGlassLayer(layer, index) {
        let x = 0;
        let y = 0;
        let targetX = this.getRandomPosition();
        let targetY = this.getRandomPosition();

        const animate = () => {
            x += (targetX - x) * 0.01;
            y += (targetY - y) * 0.01;

            layer.style.background = `radial-gradient(
                circle at ${x}% ${y}%,
                rgba(${this.getRandomColor()}, 0.15) 0%,
                transparent 50%
            )`;

            // 随机改变目标位置
            if (Math.random() < 0.005) {
                targetX = this.getRandomPosition();
                targetY = this.getRandomPosition();
            }

            requestAnimationFrame(animate);
        };

        animate();
    }

    updateGlassEffects() {
        const elements = document.querySelectorAll('.glass-card, .glass-navbar, .glass-tabbar');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = this.mouseX - centerX;
            const deltaY = this.mouseY - centerY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 300;
            
            if (distance < maxDistance) {
                const intensity = 1 - (distance / maxDistance);
                this.applyGlassDistortion(element, deltaX, deltaY, intensity);
            } else {
                this.resetGlassDistortion(element);
            }
        });
    }

    applyGlassDistortion(element, deltaX, deltaY, intensity) {
        const depth = parseFloat(element.dataset.depth) || 0.5;
        const moveX = (deltaX / window.innerWidth) * 20 * intensity * depth;
        const moveY = (deltaY / window.innerHeight) * 20 * intensity * depth;
        
        element.style.transform = `
            perspective(1000px)
            rotateX(${moveY * 0.5}deg)
            rotateY(${moveX * -0.5}deg)
            translateZ(${intensity * 10 * depth}px)
        `;
        
        // 添加光泽效果
        const lightX = 50 + (moveX * 5);
        const lightY = 50 + (moveY * 5);
        
        element.style.background = `
            radial-gradient(
                circle at ${lightX}% ${lightY}%,
                rgba(255, 255, 255, ${0.2 + intensity * 0.2}) 0%,
                rgba(255, 255, 255, ${0.1 + intensity * 0.1}) 70%,
                transparent 100%
            ),
            rgba(255, 255, 255, 0.6)
        `;
    }

    resetGlassDistortion(element) {
        element.style.transform = '';
        element.style.background = 'rgba(255, 255, 255, 0.6)';
    }

    handleDeviceOrientation(e) {
        const beta = e.beta || 0; // 前后倾斜
        const gamma = e.gamma || 0; // 左右倾斜
        
        const tiltX = (gamma / 90) * 10;
        const tiltY = (beta / 90) * 10;
        
        document.documentElement.style.setProperty('--tilt-x', `${tiltX}deg`);
        document.documentElement.style.setProperty('--tilt-y', `${tiltY}deg`);
    }

    updateCSSVariables() {
        const hue = (Date.now() / 10000) % 360;
        document.documentElement.style.setProperty('--dynamic-hue', `${hue}`);
    }

    getRandomPosition() {
        return Math.random() * 100;
    }

    getRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        return `${hue}, 100%, 70%`;
    }
}

// 初始化玻璃效果
document.addEventListener('DOMContentLoaded', () => {
    window.glassEffect = new GlassEffect();
});