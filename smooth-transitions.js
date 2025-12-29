class SmoothTransitions {
    constructor() {
        this.currentPage = null;
        this.isTransitioning = false;
        this.history = [];
        this.init();
    }

    init() {
        // 拦截所有内部链接点击
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });

        // 处理后退按钮
        document.getElementById('navBack')?.addEventListener('click', () => {
            this.goBack();
        });

        // 初始化页面
        this.currentPage = document.querySelector('.content-area');
        this.history.push({
            element: this.currentPage,
            scrollY: 0
        });

        // 添加页面过渡样式
        this.addTransitionStyles();
    }

    navigate(target) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const oldPage = this.currentPage;
        const oldScroll = window.scrollY;

        // 保存当前页面状态
        this.history.push({
            element: oldPage,
            scrollY: oldScroll
        });

        // 创建新页面
        const newPage = this.createPage(target);
        this.currentPage = newPage;

        // 执行过渡动画
        this.transitionPages(oldPage, newPage, 'forward');
    }

    goBack() {
        if (this.isTransitioning || this.history.length <= 1) return;
        this.isTransitioning = true;

        const oldPage = this.currentPage;
        const lastState = this.history.pop();
        const newPage = lastState.element;

        this.currentPage = newPage;

        // 执行返回动画
        this.transitionPages(oldPage, newPage, 'backward', lastState.scrollY);
    }

    createPage(target) {
        // 这里应该根据target创建实际的新页面内容
        // 为演示目的，我们克隆当前页面并修改
        const newPage = this.currentPage.cloneNode(true);
        newPage.id = `page-${Date.now()}`;
        newPage.style.position = 'absolute';
        newPage.style.top = '0';
        newPage.style.left = '0';
        newPage.style.width = '100%';
        
        document.querySelector('.app-container').appendChild(newPage);
        return newPage;
    }

    transitionPages(oldPage, newPage, direction, scrollTo = 0) {
        const container = document.querySelector('.app-container');
        
        // 设置动画起始状态
        if (direction === 'forward') {
            newPage.style.transform = 'translateX(100%)';
            newPage.style.opacity = '0.7';
        } else {
            newPage.style.transform = 'translateX(-30%)';
            newPage.style.opacity = '0.7';
            oldPage.style.transform = 'translateX(100%)';
        }

        // 触发动画
        requestAnimationFrame(() => {
            oldPage.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            newPage.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

            if (direction === 'forward') {
                oldPage.style.transform = 'translateX(-30%) scale(0.95)';
                oldPage.style.opacity = '0.7';
                newPage.style.transform = 'translateX(0)';
                newPage.style.opacity = '1';
            } else {
                newPage.style.transform = 'translateX(0)';
                newPage.style.opacity = '1';
            }

            // 恢复滚动位置
            window.scrollTo(0, scrollTo);

            // 动画结束
            setTimeout(() => {
                oldPage.style.display = 'none';
                newPage.style.position = 'relative';
                newPage.style.transform = 'none';
                
                // 触发子元素动画
                this.animatePageContent(newPage);
                
                this.isTransitioning = false;
            }, 400);
        });
    }

    animatePageContent(page) {
        const elements = page.querySelectorAll('[data-origin]:not(.animated)');
        
        elements.forEach((el, index) => {
            el.classList.add('animated');
            
            setTimeout(() => {
                el.style.animation = `fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s forwards`;
                el.style.opacity = '0';
                
                // 添加交互动画
                this.addInteractionAnimations(el);
            }, 50);
        });
    }

    addInteractionAnimations(element) {
        // 悬停效果
        element.addEventListener('mouseenter', () => {
            if (element.classList.contains('hover-lift')) {
                element.style.transform = 'translateY(-8px) scale(1.02)';
                element.style.boxShadow = `
                    0 20px 40px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.2) inset
                `;
            }
        });

        element.addEventListener('mouseleave', () => {
            if (element.classList.contains('hover-lift')) {
                element.style.transform = 'translateY(0) scale(1)';
                element.style.boxShadow = '';
            }
        });

        // 点击效果
        element.addEventListener('mousedown', () => {
            element.style.transform = 'scale(0.98)';
        });

        element.addEventListener('mouseup', () => {
            element.style.transform = '';
        });
    }

    addTransitionStyles() {
        const styles = `
            .page-transition {
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform, opacity;
            }
            
            .page-enter {
                animation: slideInRight 0.4s forwards;
            }
            
            .page-exit {
                animation: slideOutLeft 0.4s forwards;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0.7;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutLeft {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-30%);
                    opacity: 0.7;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// 初始化平滑过渡
document.addEventListener('DOMContentLoaded', () => {
    window.smoothTransitions = new SmoothTransitions();
});