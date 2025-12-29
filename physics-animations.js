class PhysicsAnimation {
    constructor() {
        this.items = [];
        this.animating = false;
        this.init();
    }

    init() {
        // 监听所有可动画元素
        document.querySelectorAll('[data-origin]').forEach(el => {
            this.items.push({
                element: el,
                origin: el.dataset.origin || 'center',
                animated: false
            });
        });

        // 初始化观察者
        this.initObserver();
        
        // 初始化物理引擎
        this.initPhysics();
        
        // 添加点击涟漪效果
        this.addRippleEffects();
    }

    initObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateIn(entry.target);
                } else {
                    this.animateOut(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        this.items.forEach(item => {
            observer.observe(item.element);
        });
    }

    animateIn(element) {
        const origin = element.dataset.origin || 'center';
        const depth = parseFloat(element.dataset.depth) || 0.5;
        
        // 设置初始状态
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(origin, depth);
        element.style.willChange = 'transform, opacity';
        
        // 动画开始
        requestAnimationFrame(() => {
            element.style.transition = `
                transform 0.6s ${this.getEasing(depth)},
                opacity 0.4s ease-out
            `;
            
            element.style.opacity = '1';
            element.style.transform = 'translate3d(0, 0, 0) scale(1)';
            
            // 添加微妙的反弹效果
            if (depth > 0.3) {
                this.addBounceEffect(element);
            }
        });
    }

    animateOut(element) {
        const origin = element.dataset.origin || 'center';
        const depth = parseFloat(element.dataset.depth) || 0.5;
        
        element.style.transition = `
            transform 0.3s ${this.getEasing(depth)},
            opacity 0.3s ease-in
        `;
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(origin, depth);
    }

    getInitialTransform(origin, depth) {
        const scale = 1 - (depth * 0.1);
        const translateZ = -depth * 50;
        
        switch(origin) {
            case 'top':
                return `translate3d(0, -30px, ${translateZ}px) scale(${scale})`;
            case 'bottom':
                return `translate3d(0, 30px, ${translateZ}px) scale(${scale})`;
            case 'left':
                return `translate3d(-30px, 0, ${translateZ}px) scale(${scale})`;
            case 'right':
                return `translate3d(30px, 0, ${translateZ}px) scale(${scale})`;
            default:
                return `translate3d(0, 0, ${translateZ}px) scale(${scale})`;
        }
    }

    getEasing(depth) {
        // 根据深度调整缓动曲线
        if (depth > 0.8) {
            return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
        } else if (depth > 0.5) {
            return 'cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            return 'cubic-bezier(0.42, 0, 0.58, 1)';
        }
    }

    addBounceEffect(element) {
        const originalTransform = element.style.transform;
        
        // 轻微反弹动画
        element.animate([
            { transform: originalTransform },
            { transform: originalTransform + ' scale(1.02)' },
            { transform: originalTransform }
        ], {
            duration: 400,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        });
    }

    initPhysics() {
        // 添加鼠标跟随物理效果
        document.addEventListener('mousemove', (e) => {
            if (this.animating) return;
            
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            this.items.forEach(item => {
                if (item.element.classList.contains('parallax-element')) {
                    this.applyParallax(item.element, mouseX, mouseY);
                }
            });
        });
    }

    applyParallax(element, mouseX, mouseY) {
        const depth = parseFloat(element.dataset.depth) || 0.5;
        const moveX = (mouseX - 0.5) * 20 * depth;
        const moveY = (mouseY - 0.5) * 20 * depth;
        
        element.style.transform = `
            translate3d(${moveX}px, ${moveY}px, 0)
            rotateX(${moveY * 0.5}deg)
            rotateY(${moveX * 0.5}deg)
        `;
    }

    addRippleEffects() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.touch-feedback, .action-btn, .tab-item');
            
            if (target) {
                this.createRipple(e, target);
            }
        }, true);
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// 添加CSS ripple动画
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 初始化物理动画系统
document.addEventListener('DOMContentLoaded', () => {
    window.physicsAnimations = new PhysicsAnimation();
});