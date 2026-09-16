// 主要功能实现 - 优化版本
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，初始化功能...');
    
    // 图片功能
    initializeImageFallback();
    
    // 导航激活状态
    initializeNavigation();
    
    // FAQ功能
    initializeFAQ();
    
    // 平滑滚动
    initializeSmoothScroll();
    
    // 购物车相关功能
    initializeCartFeatures();
    
    // 调试信息
    console.log('所有功能初始化完成');
});

// 图片回退处理
function initializeImageFallback() {
    // 处理花卉图片错误 - 通用版本
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG' && e.target.classList.contains('flower-img')) {
            const img = e.target;
            const flowerName = img.alt || '花卉';
            const placeholderColors = {
                '玫瑰': 'ff6b6b', '郁金香': '74b9ff', '百合': 'a29bfe', 
                '兰花': '55efc4', '牡丹': 'fd79a8', '向日葵': 'fdcb6e',
                '康乃馨': 'e17055', '茉莉': '00cec9'
            };
            const color = placeholderColors[flowerName] || '2d5016';
            
            // 使用SVG占位图
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="300" height="200">
                    <rect width="100%" height="100%" fill="#${color}"/>
                    <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                          fill="white" font-family="Arial, sans-serif" font-size="20">
                        ${flowerName}
                    </text>
                </svg>
            `;
            img.src = 'data:image/svg+xml;base64,' + btoa(svg);
        }
    }, true);
}

// 导航初始化
function initializeNavigation() {
    // 根据当前页面高亮导航
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage.includes(href.replace('.html', '')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// FAQ功能初始化
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = this.parentElement.classList.contains('active');
                
                // 关闭所有其他FAQ
                document.querySelectorAll('.faq-item').forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // 切换当前FAQ
                if (!isActive) {
                    this.parentElement.classList.add('active');
                }
            });
        }
    });
}

// 平滑滚动初始化
function initializeSmoothScroll() {
    // 为所有锚点链接添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 只处理页面内锚点
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// 购物车相关功能
function initializeCartFeatures() {
    // 全局购物车事件监听
    window.addEventListener('storage', function(e) {
        if (e.key === 'flowerCart') {
            updateAllCartCounts();
        }
    });
    
    // 初始更新购物车数量
    setTimeout(updateAllCartCounts, 100);
}

// 更新所有购物车数量显示
function updateAllCartCounts() {
    const savedCart = localStorage.getItem('flowerCart');
    let cartCount = 0;
    
    if (savedCart) {
        try {
            const cartItems = JSON.parse(savedCart);
            cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
        } catch (e) {
            cartCount = 0;
        }
    }
    
    // 更新导航栏购物车
    const navCartCounts = document.querySelectorAll('.cart-count');
    navCartCounts.forEach(element => {
        if (cartCount > 0) {
            element.textContent = cartCount;
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    });
}

// 显示购物车通知
function showCartNotification(flowerName, flowerImage, cartCount) {
    const notification = document.getElementById('cartNotification');
    if (!notification) return;
    
    // 更新通知内容
    const nameElement = notification.querySelector('.cart-notification-info h5');
    const countElement = notification.querySelector('.cart-notification-info p');
    const imageElement = notification.querySelector('.cart-notification-image img');
    
    if (nameElement) nameElement.textContent = `${flowerName} 已加入购物车`;
    if (countElement) countElement.textContent = `购物车已有 ${cartCount} 件商品`;
    if (imageElement) {
        imageElement.src = flowerImage;
        imageElement.alt = flowerName;
    }
    
    // 显示通知
    notification.classList.add('show');
    
    // 5秒后自动关闭
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}

// 关闭购物车通知
function closeCartNotification() {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// 全局辅助函数
window.showCartNotification = showCartNotification;
window.closeCartNotification = closeCartNotification;