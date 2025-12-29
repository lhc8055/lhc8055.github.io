class IAnCommunity {
    constructor() {
        this.init();
    }

    init() {
        // 初始化组件
        this.initComponents();
        
        // 绑定事件
        this.bindEvents();
        
        // 启动动画
        this.startAnimations();
        
        // 性能优化
        this.optimizePerformance();
    }

    initComponents() {
        // 初始化卡片动画
        this.initCardAnimations();
        
        // 初始化滑动效果
        this.initSwipeGestures();
        
        // 初始化主题
        this.initTheme();
    }

    initCardAnimations() {
        const cards = document.querySelectorAll('.content-card');
        
        cards.forEach((card, index) => {
            // 设置延迟入场
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('card-stagger');
            
            // 添加3D效果
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'perspective(1000px) rotateX(2deg) rotateY(2deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    initSwipeGestures() {
        let startX, startY;
        let isScrolling;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            isScrolling = undefined;
        }, false);
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const x = e.touches[0].pageX;
            const y = e.touches[0].pageY;
            
            const diffX = startX - x;
            const diffY = startY - y;
            
            if (isScrolling === undefined) {
                isScrolling = Math.abs(diffY) > Math.abs(diffX);
            }
            
            if (!isScrolling) {
                e.preventDefault();
                this.handleSwipe(diffX, diffY);
            }
        }, false);
        
        document.addEventListener('touchend', () => {
            startX = null;
            startY = null;
        }, false);
    }

    handleSwipe(diffX, diffY) {
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                this.swipeRight();
            } else {
                this.swipeLeft();
            }
        }
    }

    swipeLeft() {
        // 切换到下一个标签
        const tabs = document.querySelectorAll('.tab-item');
        const activeTab = document.querySelector('.tab-item.active');
        const currentIndex = Array.from(tabs).indexOf(activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        
        this.switchTab(tabs[nextIndex]);
    }

    swipeRight() {
        // 切换到上一个标签
        const tabs = document.querySelectorAll('.tab-item');
        const activeTab = document.querySelector('.tab-item.active');
        const currentIndex = Array.from(tabs).indexOf(activeTab);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        
        this.switchTab(tabs[prevIndex]);
    }

    switchTab(tab) {
        const tabs = document.querySelectorAll('.tab-item');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // 添加切换动画
        this.animateTabSwitch(tab);
    }

    animateTabSwitch(tab) {
        const ripple = document.createElement('div');
        ripple.className = 'tab-ripple';
        
        const rect = tab.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(0, 122, 255, 0.1);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: tabRipple 0.6s ease-out;
            pointer-events: none;
        `;
        
        tab.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    initTheme() {
        // 检测系统主题
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const updateTheme = (isDark) => {
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            
            if (isDark) {
                this.applyDarkTheme();
            } else {
                this.applyLightTheme();
            }
        };
        
        updateTheme(darkModeMediaQuery.matches);
        darkModeMediaQuery.addListener((e) => updateTheme(e.matches));
    }

    applyDarkTheme() {
        document.documentElement.style.setProperty('--ios-primary', '#0A84FF');
        document.documentElement.style.setProperty('--ios-secondary', '#5E5CE6');
        document.documentElement.style.setProperty('--ios-gray-6', '#1C1C1E');
        
        // 更新所有玻璃效果元素
        document.querySelectorAll('.glass-card, .glass-navbar, .glass-tabbar').forEach(el => {
            el.style.background = 'rgba(28, 28, 30, 0.6)';
            el.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            el.style.color = '#FFFFFF';
        });
    }

    applyLightTheme() {
        document.documentElement.style.setProperty('--ios-primary', '#007AFF');
        document.documentElement.style.setProperty('--ios-secondary', '#5856D6');
        document.documentElement.style.setProperty('--ios-gray-6', '#F2F2F7');
        
        document.querySelectorAll('.glass-card, .glass-navbar, .glass-tabbar').forEach(el => {
            el.style.background = 'rgba(255, 255, 255, 0.6)';
            el.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            el.style.color = '#000000';
        });
    }

    bindEvents() {
        // 点赞功能
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLike(btn);
            });
        });
        
        // 评论功能
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleComment(btn);
            });
        });
        
        // 分享功能
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleShare(btn);
            });
        });
        
        // 搜索功能
        const searchBtn = document.querySelector('.fa-search');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.openSearch();
            });
        }
    }

    handleLike(button) {
        const icon = button.querySelector('i');
        const countElement = button.querySelector('span') || button;
        let countText = countElement.textContent || countElement.innerText;
        let count = parseInt(countText.match(/\d+/)?.[0] || 0);
        
        if (button.classList.contains('liked')) {
            button.classList.remove('liked');
            icon.className = 'far fa-heart';
            count--;
        } else {
            button.classList.add('liked');
            icon.className = 'fas fa-heart';
            count++;
            
            // 添加点赞动画
            this.animateLike(button);
        }
        
        countElement.innerHTML = `<i class="${icon.className}"></i> ${count}`;
    }

    animateLike(button) {
        const hearts = ['❤️', '💖', '💗', '💓', '💞'];
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        heart.style.cssText = `
            position: absolute;
            font-size: 24px;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;
        
        const rect = button.getBoundingClientRect();
        heart.style.left = `${rect.left + rect.width / 2}px`;
        heart.style.top = `${rect.top}px`;
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1000);
    }

    handleComment(button) {
        // 显示评论框
        this.showCommentModal();
    }

    handleShare(button) {
        // 显示分享菜单
        this.showShareMenu(button);
    }

    openSearch() {
        const searchModal = document.createElement('div');
        searchModal.className = 'search-modal glass-card';
        searchModal.innerHTML = `
            <div class="search-header">
                <input type="text" placeholder="搜索应用、游戏、用户..." autofocus>
                <button class="close-search"><i class="fas fa-times"></i></button>
            </div>
            <div class="search-results"></div>
        `;
        
        document.querySelector('.modal-layer').appendChild(searchModal);
        this.showModal(searchModal);
    }

    showModal(modal) {
        modal.style.animation = 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        modal.style.opacity = '0';
        
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    }

    startAnimations() {
        // 启动背景动画
        this.animateBackground();
        
        // 启动微交互
        this.startMicroInteractions();
    }

    animateBackground() {
        const layers = document.querySelectorAll('.glass-layer-1, .glass-layer-2, .glass-layer-3');
        
        layers.forEach((layer, index) => {
            layer.animate([
                { transform: 'translate(0, 0) rotate(0deg)' },
                { transform: `translate(${Math.random() * 100}px, ${Math.random() * 100}px) rotate(${Math.random() * 360}deg)` }
            ], {
                duration: 20000 + index * 5000,
                iterations: Infinity,
                direction: 'alternate',
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
        });
    }

    startMicroInteractions() {
        // 添加呼吸光效果到重要元素
        document.querySelectorAll('.nav-title, .banner-title').forEach(el => {
            el.classList.add('breathing-light');
        });
        
        // 添加滚动视差
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(el => {
            const depth = parseFloat(el.dataset.depth) || 0.5;
            const movement = scrolled * depth * 0.5;
            el.style.transform = `translateY(${movement}px)`;
        });
    }

    optimizePerformance() {
        // 使用will-change优化动画性能
        const animatedElements = document.querySelectorAll('.glass-card, .action-btn, .tab-item');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
        
        // 限制动画帧率
        this.throttleAnimations();
    }

    throttleAnimations() {
        let ticking = false;
        
        const updateOnScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', updateOnScroll, { passive: true });
    }
}

// 添加CSS动画
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .floating-heart {
        animation: floatUp 1s ease-out forwards;
    }
    
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
    
    .tab-ripple {
        animation: tabRipple 0.6s ease-out;
    }
    
    @keyframes tabRipple {
        to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
    
    .search-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        width: 90%;
        max-width: 400px;
        z-index: 10000;
        animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    .liked {
        color: #FF2D55 !important;
    }
    
    .modal-layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        z-index: 9999;
        display: none;
    }
    
    .modal-layer.active {
        display: block;
    }
`;

document.head.appendChild(additionalStyles);

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.iAnCommunity = new IAnCommunity();
    
    // 添加加载动画
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '1';
    });
});
