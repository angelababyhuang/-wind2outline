/**
 * 知识大纲管理与回顾系统 - 主页面脚本
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const outlinesContainer = document.getElementById('outlines-container');
    const outlineModal = document.getElementById('outline-modal');
    const closeBtn = outlineModal.querySelector('.close-btn');
    const saveOutlineBtn = document.getElementById('save-outline-btn');
    const cancelOutlineBtn = document.getElementById('cancel-outline-btn');
    const outlineTitleInput = document.getElementById('outline-title');
    const outlineDescriptionInput = document.getElementById('outline-description');
    const manageBtn = document.getElementById('manage-btn');
    
    let currentOutlineId = null;
    
    // 初始化页面
    init();
    
    function init() {
        // 加载并显示所有大纲
        renderOutlines();
        
        // 绑定事件
        closeBtn.addEventListener('click', closeModal);
        saveOutlineBtn.addEventListener('click', saveOutline);
        cancelOutlineBtn.addEventListener('click', closeModal);
        manageBtn.addEventListener('click', showManageOutlines);
        
        // 点击页面其他区域关闭模态框
        window.addEventListener('click', function(e) {
            if (e.target === outlineModal) {
                closeModal();
            }
        });
    }
    
    /**
     * 渲染所有大纲卡片
     */
    function renderOutlines() {
        const outlines = outlineStorage.getAllOutlines();
        
        if (outlines.length === 0) {
            outlinesContainer.innerHTML = '<p class="no-outlines-message">您还没有创建任何大纲。</p>';
            return;
        }
        
        outlinesContainer.innerHTML = '';
        
        outlines.forEach(outline => {
            const card = createOutlineCard(outline);
            outlinesContainer.appendChild(card);
        });
    }
    
    /**
     * 创建大纲卡片元素
     * @param {Object} outline 大纲对象
     * @returns {HTMLElement} 大纲卡片元素
     */
    function createOutlineCard(outline) {
        const card = document.createElement('div');
        card.className = 'outline-card';
        card.dataset.id = outline.id;
        
        const createdDate = new Date(outline.createdAt).toLocaleDateString();
        
        card.innerHTML = `
            <h3>${outline.title}</h3>
            <p>${outline.description || '无描述'}</p>
            <div class="outline-meta">创建于: ${createdDate}</div>
            <div class="outline-card-actions">
                <button class="btn btn-sm edit-btn">编辑</button>
                <button class="btn btn-sm review-btn">回顾</button>
                <button class="btn btn-sm btn-secondary delete-btn">删除</button>
            </div>
        `;
        
        // 绑定卡片按钮事件
        const editBtn = card.querySelector('.edit-btn');
        const reviewBtn = card.querySelector('.review-btn');
        const deleteBtn = card.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => {
            window.location.href = `outlineeditor.html?id=${outline.id}`;
        });
        
        reviewBtn.addEventListener('click', () => {
            window.location.href = `review.html?id=${outline.id}`;
        });
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('确定要删除这个大纲吗？此操作不可撤销。')) {
                outlineStorage.deleteOutline(outline.id);
                renderOutlines();
            }
        });
        
        return card;
    }
    
    /**
     * 打开大纲详情模态框
     * @param {string|null} outlineId 大纲ID，为null时表示新建大纲
     */
    function openOutlineModal(outlineId = null) {
        currentOutlineId = outlineId;
        
        if (outlineId) {
            // 编辑现有大纲
            const outline = outlineStorage.getOutlineById(outlineId);
            if (outline) {
                outlineTitleInput.value = outline.title;
                outlineDescriptionInput.value = outline.description || '';
            }
        } else {
            // 新建大纲
            outlineTitleInput.value = '';
            outlineDescriptionInput.value = '';
        }
        
        outlineModal.classList.add('show');
        outlineTitleInput.focus();
    }
    
    /**
     * 关闭大纲详情模态框
     */
    function closeModal() {
        outlineModal.classList.remove('show');
        currentOutlineId = null;
    }
    
    /**
     * 保存大纲信息
     */
    function saveOutline() {
        const title = outlineTitleInput.value.trim();
        const description = outlineDescriptionInput.value.trim();
        
        if (!title) {
            alert('请输入大纲标题');
            outlineTitleInput.focus();
            return;
        }
        
        if (currentOutlineId) {
            // 更新现有大纲
            outlineStorage.updateOutline(currentOutlineId, { title, description });
        } else {
            // 创建新大纲
            const newOutlineId = outlineStorage.addOutline({ title, description, content: [] });
            // 创建后直接跳转到编辑页面
            window.location.href = `outlineeditor.html?id=${newOutlineId}`;
            return;
        }
        
        closeModal();
        renderOutlines();
    }
    
    /**
     * 显示大纲管理界面
     */
    function showManageOutlines() {
        // 在当前页面显示管理界面，或者打开新建大纲模态框
        openOutlineModal();
    }
});
