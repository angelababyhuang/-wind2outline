/**
 * 知识大纲存储管理模块
 * 负责大纲数据的本地存储和检索
 */
class OutlineStorage {
    constructor() {
        this.STORAGE_KEY = 'knowledge_outlines';
        this.outlines = this.loadOutlines();
    }

    /**
     * 加载所有保存的大纲
     * @returns {Array} 大纲数组
     */
    loadOutlines() {
        const storedOutlines = localStorage.getItem(this.STORAGE_KEY);
        return storedOutlines ? JSON.parse(storedOutlines) : [];
    }

    /**
     * 保存所有大纲到本地存储
     */
    saveOutlines() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.outlines));
    }

    /**
     * 获取所有大纲
     * @returns {Array} 大纲数组
     */
    getAllOutlines() {
        return this.outlines;
    }

    /**
     * 根据ID获取大纲
     * @param {string} id 大纲ID
     * @returns {Object|null} 大纲对象或null
     */
    getOutlineById(id) {
        return this.outlines.find(outline => outline.id === id) || null;
    }
    
    /**
     * 检查标题是否已存在
     * @param {string} title 大纲标题
     * @param {string} excludeId 排除的大纲ID（用于编辑时检查）
     * @returns {boolean} 标题是否已存在
     */
    isTitleExists(title, excludeId = null) {
        return this.outlines.some(outline => 
            outline.title === title && (!excludeId || outline.id !== excludeId)
        );
    }

    /**
     * 添加新大纲
     * @param {Object} outline 大纲对象
     * @returns {string} 新大纲的ID
     */
    addOutline(outline) {
        const id = Date.now().toString();
        const newOutline = {
            id,
            title: outline.title || '未命名大纲',
            description: outline.description || '',
            content: outline.content || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.outlines.push(newOutline);
        this.saveOutlines();
        return id;
    }

    /**
     * 更新现有大纲
     * @param {string} id 大纲ID
     * @param {Object} updates 更新的字段
     * @returns {boolean} 是否更新成功
     */
    updateOutline(id, updates) {
        const index = this.outlines.findIndex(outline => outline.id === id);
        if (index === -1) return false;
        
        this.outlines[index] = {
            ...this.outlines[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this.saveOutlines();
        return true;
    }

    /**
     * 删除大纲
     * @param {string} id 大纲ID
     * @returns {boolean} 是否删除成功
     */
    deleteOutline(id) {
        const initialLength = this.outlines.length;
        this.outlines = this.outlines.filter(outline => outline.id !== id);
        
        if (this.outlines.length !== initialLength) {
            this.saveOutlines();
            return true;
        }
        return false;
    }

    /**
     * 将大纲内容从编辑器格式转换为存储格式
     * @param {Array} editorLines 编辑器中的行数组
     * @returns {Array} 存储格式的大纲内容
     */
    static convertFromEditor(editorLines) {
        return editorLines.map(line => {
            return {
                content: line.getAttribute('data-content') || '',
                level: parseInt(line.getAttribute('data-level')) || 0
            };
        }).filter(item => item.content.trim() !== '');
    }

    /**
     * 将存储格式的大纲内容转换为编辑器格式
     * @param {Array} storedContent 存储格式的大纲内容
     * @returns {Array} 编辑器格式的HTML元素数组
     */
    static convertToEditor(storedContent) {
        return storedContent.map(item => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line';
            lineDiv.setAttribute('data-content', item.content);
            lineDiv.setAttribute('data-level', item.level);
            
            const contentDiv = document.createElement('div');
            contentDiv.className = `line-content level-${item.level}`;
            
            // 这里不计算编号，因为编辑器会重新计算
            contentDiv.innerHTML = `<span class="outline-number">1.</span><span class="outline-content">${item.content}</span>`;
            
            lineDiv.appendChild(contentDiv);
            return lineDiv;
        });
    }
}

// 导出存储实例
const outlineStorage = new OutlineStorage();
