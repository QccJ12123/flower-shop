// 共享的Vue组件和功能
const FlowerVueComponents = {
    // FAQ组件 - 用于展开/折叠常见问题
    FAQComponent: {
        template: `
            <div class="faq-item" :class="{ active: isActive }">
                <div class="faq-question" @click="toggle">
                    <h4>{{ question }}</h4>
                    <div class="faq-toggle">{{ isActive ? '−' : '+' }}</div>
                </div>
                <div class="faq-answer">
                    <p>{{ answer }}</p>
                </div>
            </div>
        `,
        props: ['question', 'answer'],
        data() {
            return {
                isActive: false
            };
        },
        methods: {
            toggle() {
                this.isActive = !this.isActive;
            }
        }
    },
    
    // 季节卡片组件
    SeasonCardComponent: {
        template: `
            <div class="season-card">
                <div class="season-header" :class="seasonClass">
                    <h4>{{ seasonName }}养护</h4>
                    <div class="season-icon">{{ seasonIcon }}</div>
                </div>
                <div class="season-content">
                    <img :src="getImageUrl(imageName, seasonName + '花卉')" :alt="seasonName + '花卉'">
                    <ul>
                        <li v-for="tip in tips" :key="tip">{{ tip }}</li>
                    </ul>
                </div>
            </div>
        `,
        props: ['seasonName', 'seasonClass', 'seasonIcon', 'imageName', 'tips'],
        methods: {
            getImageUrl(imageName, altText) {
                // 这里使用占位图片，实际项目中可以替换为真实图片
                const colors = {
                    '春季花卉': '55efc4', '夏季花卉': '74b9ff', 
                    '秋季花卉': 'e17055', '冬季花卉': 'a29bfe'
                };
                const color = colors[altText] || '2d5016';
                return `https://via.placeholder.com/300x200/${color}/ffffff?text=${encodeURIComponent(altText)}`;
            }
        }
    }
};

// 图片错误处理函数
function handleMissingImage(img) {
    const altText = img.alt || '花卉图片';
    const placeholderColors = {
        '光照管理': 'fdcb6e', '浇水技巧': '74b9ff', '土壤选择': '00b894',
        '春季花卉': '55efc4', '夏季花卉': '74b9ff', '秋季花卉': 'e17055', 
        '冬季花卉': 'a29bfe', '玫瑰': 'ff6b6b', '郁金香': '74b9ff', 
        '百合': 'a29bfe', '兰花': '55efc4', '牡丹': 'fd79a8', 
        '向日葵': 'fdcb6e', '康乃馨': 'e17055', '茉莉': '00cec9',
        '我们的使命': '2d5016', '联系我们': '6c5ce7'
    };
    const color = placeholderColors[altText] || '2d5016';
    img.src = `https://via.placeholder.com/600x400/${color}/ffffff?text=${encodeURIComponent(altText)}`;
}

// 初始化图片处理
function initImageHandling() {
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete || img.naturalHeight === 0) {
                handleMissingImage(img);
            }
            img.addEventListener('error', function() {
                handleMissingImage(this);
            });
        });
    });
}

// 导出共享功能
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FlowerVueComponents, handleMissingImage, initImageHandling };
} else {
    window.FlowerVueComponents = FlowerVueComponents;
    window.handleMissingImage = handleMissingImage;
    window.initImageHandling = initImageHandling;
}