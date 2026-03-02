// daibang.js
/**
 * 代码帮助模式的技能搜索实现（抽离自 extension.js）
 * @param {Searcher} searcher - Searcher 类实例（含 fragmentList、updatePage 等方法）
 * @param {Object} globalObj - 全局依赖对象（lib、game、_status、get）
 * @param {string} result - 搜索关键词
 */
export default function codeHelpFindSkill(searcher, globalObj, result) {
    const { lib, game, _status, get } = globalObj;
    // 确保全局技能缓存存在
    if (!window.skillCache) {
        window.skillCache = new Map();
    }
    console.log(`代码帮助搜索词：${result}，原始关键词：`, _status.当前搜索关键词);
    console.time('搜索总耗时');
    
    const keywords = _status.当前搜索关键词;
    /** @type { { skillName: string, translate: string, info: string, rawInfo: string, rawSkillData: object }[] } */
    let allSkills = [];
    // 用于缓存已处理的技能数据
    window.skillCache = new Map();
    // 标记是否正在加载中
    let isLoading = true;
    // 1. 先快速创建分类框架（优先展示给用户）
    const createCategoryFrames = () => {
        let lastFragment = document.createDocumentFragment();
        searcher.fragmentList.push(lastFragment);
        searcher.fragmentDataList.push([]);
        const qnssCaption = ui.create.div('.caption.qnssCaption');
        lastFragment.appendChild(qnssCaption);
        qnssCaption.appendChild(game.全能搜索_createWaveText('技能搜索结果（代码帮助）'));
        searcher.fragmentDataList[searcher.fragmentList.length - 1].push((lastFragment) => {
            const caption = ui.create.div('.caption');
            const d = ui.create.div(ui.create.div(ui.create.div('.text.center', caption)), {
                display: 'block',
                left: 'auto',
                textAlign: 'left',
                fontSize: '18px', // 标题区域文字加大
                color: '#fff' // 标题区域字体白色（适配黑色背景）
            });
            // 先创建所有关键词分组框架（无实际内容）
            keywords.forEach(keyword => {
                const groupId = `group_${keyword.replace(/\s+/g, '_')}`;
                d.insertAdjacentHTML('beforeend', `
                    <div class="keyword-group" style="
                        margin: 10px 0; 
                        border: 1px solid #666;
                        border-radius: 4px; 
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">
                        <div class="group-title" 
                             onclick="window.toggleKeywordGroup(this, '${groupId}', '${keyword}')"
                             style="
                                 padding: 10px 15px; 
                                 background: #222;
                                 cursor: pointer; 
                                 font-weight: bold;
                                 color: #fff;
                                 border-bottom: 1px solid #666;
                                 font-size: 18px; // 分组标题文字加大
                             "
                        >
                            参考相关［${keyword}］技能展开 <span class="loading-status">(加载中...)</span>
                        </div>
                        <div id="${groupId}" class="group-content" style="display: none; padding: 15px; color: #fff; background: #000; font-size: 18px;">
                            <div class="loading-indicator" style="color: #fff; font-size: 18px;">点击展开加载内容...</div>
                        </div>
                    </div>
                `);
            });
            lastFragment.appendChild(caption);
        });
        // 分页框架初始化
        if (searcher.fragmentDataList[searcher.fragmentList.length - 1].length > 9) {
            lastFragment = document.createDocumentFragment();
            searcher.fragmentList.push(lastFragment);
            searcher.fragmentDataList.push([]);
        }
        // 立即更新分页显示
        if (searcher.fragmentList.length) {
            searcher.updatePage(1);
        }
    };
    // 2. 后台异步收集技能数据（不阻塞UI）
    const collectSkillData = () => {
        return new Promise(resolve => {
            // 使用setTimeout分批次处理，避免长时间阻塞
            const processBatch = (index = 0, batchSize = 50) => {
                const skillNames = Object.keys(lib.skill);
                const endIndex = Math.min(index + batchSize, skillNames.length);
                
                for (let i = index; i < endIndex; i++) {
                    const skillName = skillNames[i];
                    if (['global', 'globalmap', 'storage'].includes(skillName) || typeof lib.skill[skillName] !== 'object') {
                        continue;
                    }
                    const skillTranslate = lib.translate[skillName] || skillName;
                    const skillInfo = lib.translate[skillName + '_info'] || skillTranslate || '';
                    let rawInfo = skillInfo.trim();
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(skillInfo, "text/html");
                        rawInfo = doc.body.innerText.trim();
                    } catch (error) {}
                    const skillData = {
                        skillName,
                        translate: skillTranslate,
                        info: skillInfo,
                        rawInfo: rawInfo,
                        rawSkillData: lib.skill[skillName]
                    };
                    allSkills.push(skillData);
                    window.skillCache.set(skillName, skillData);
                }
                // 未处理完则继续下一批
                if (endIndex < skillNames.length) {
                    setTimeout(() => processBatch(endIndex, batchSize), 0);
                } else {
                    // 去重处理
                    allSkills = allSkills.filter((skill, index, self) => 
                        index === self.findIndex(s => s.skillName === skill.skillName)
                    );
                    resolve();
                }
            };
            processBatch();
        });
    };
    // 3. 异步为每个分组匹配技能（边加载边更新UI）
    const matchSkillsForGroups = async () => {
        const groupMap = new Map();
        // 初始化分组
        keywords.forEach(keyword => groupMap.set(keyword, []));
        // 分关键词处理，每处理完一个关键词就更新UI
        for (const keyword of keywords) {
            // 仅处理已加载的技能数据（实时更新）
            const matched = allSkills.filter(skill => 
                skill.rawInfo.toLowerCase().includes(keyword.toLowerCase()) ||
                skill.translate.toLowerCase().includes(keyword.toLowerCase())
            );
            groupMap.set(keyword, matched);
            // 更新当前关键词分组的状态和数量
            const groupId = `group_${keyword.replace(/\s+/g, '_')}`;
            const titleElem = document.querySelector(`#${groupId} .group-title .loading-status`);
            if (titleElem) {
                titleElem.textContent = `(已找到 ${matched.length} 个技能)`;
            }
            // 给UI一点呼吸时间
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return groupMap;
    };
    // 4. 初始化分组内容异步加载逻辑
    const initGroupLoading = (groupMap) => {
        // 全局展开/收起函数
        window.toggleKeywordGroup = function(element, groupId, keyword) {
            const content = document.getElementById(groupId);
            if (!content) return;
            // 首次展开时加载内容
            if (content.style.display === 'none' && content.querySelector('.loading-indicator')) {
                content.style.display = 'block';
                element.innerHTML = `收起相关［${keyword}］技能 <span class="loading-status">(加载中...)</span>`;
                content.innerHTML = '<div class="loading-indicator" style="color: #fff; font-size: 18px;">正在加载技能列表...</div>';
                // 异步加载当前分组内容
                setTimeout(() => {
                    const groupSkills = groupMap.get(keyword) || [];
                    const ul = document.createElement('ul');
                    ul.style.paddingLeft = '0'; // 清除默认列表内边距
                    
                    // 分批次渲染技能项（每次渲染10个）
                    const renderBatch = (start = 0, batchSize = 10) => {
                        const end = Math.min(start + batchSize, groupSkills.length);
                        for (let i = start; i < end; i++) {
                            const skill = groupSkills[i];
                            const li = document.createElement('li');
                            // 技能项样式：加大间隔、白色字体、黑色背景
                            li.style.cssText = `
                                margin: 20px 0; 
                                padding: 15px; 
                                list-style: none; 
                                background: #111; 
                                border-radius: 4px;
                                font-size: 18px;
                            `;
                            // 技能项内容：添加淡绿色分隔线、加大文字
                            li.innerHTML = `
                                <div style="margin-bottom: 10px;">
                                    <font color="21ffd8" style="font-size: 20px;">[ ${skill.translate} ]</font>
                                    <font color="#6df95b" style="font-size: 18px; margin-left: 10px;">[ ${skill.skillName} ]</font>
                                </div>
                                <div style="margin: 12px 0; line-height: 1.6;">
                                    <span class="bluetext" style="color: #00ffff; font-size: 19px;">技能描述&nbsp</span>
                                    <span style="font-size: 18px;">${skill.info.replace(/<\/li>/g, '').split('<li>').map((v, i) => i === 0 ? v : `•${v}`).join('<br><br>')}</span>
                                </div>
                                <div style="margin: 12px 0;">
                                    <span class="bluetext" style="color: #00ffff; font-size: 19px;">技能代码&nbsp</span>
                                    <a onclick='window.qnssShowCode.call(this, "${skill.skillName}")' style="color: #00ccff; font-size: 18px; text-decoration: underline;">点击查看技能代码</a>
                                </div>
                                <!-- 技能代码容器 -->
                                <li id="code_${skill.skillName}" style="display: none; list-style-type: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0,255,0,0.2);">
                                    <div style="margin-bottom: 12px;">
                                        <font color="21ffd8" style="font-size: 19px;">[ ${skill.translate} ]</font> 技能代码：
                                    </div>
                                    <!-- 复制按钮 -->
                                    <button 
                                        data-skill-name="${skill.translate}" 
                                        data-skill-id="${skill.skillName}"
                                        onclick="
                                            const skill = window.skillCache.get(this.dataset.skillId);
                                            const rawCode = get.stringify(skill.rawSkillData);
                                            game.全能搜索_copy(rawCode); 
                                            window.showCopySuccess(this.dataset.skillName);
                                        " 
                                        style="margin-bottom: 15px; padding: 8px 16px; cursor: pointer; display: inline-block; background: #222; color: #fff; border: 1px solid #00ff00; border-radius: 4px; font-size: 18px;"
                                    >
                                        复制代码
                                    </button>
                                    <!-- 代码块：加大字体、适配黑色背景 -->
                                    <pre class="hljs language-javascript" style="user-select:text; background: #1a1a1a; padding: 15px; border-radius: 4px; font-size: 16px; line-height: 1.5;"></pre>
                                </li>
                                <!-- 技能间淡绿色分隔线（最后一个技能不显示） -->
                                ${i < groupSkills.length - 1 ? '<hr style="border: none; border-top: 1px solid rgba(0,255,0,0.3); margin-top: 25px;"/>' : ''}
                            `;
                            ul.appendChild(li);
                        }
                        content.innerHTML = '';
                        content.appendChild(ul);
                        // 更新加载状态
                        const statusElem = element.querySelector('.loading-status');
                        if (statusElem) {
                            statusElem.textContent = `(${end}/${groupSkills.length})`;
                        }
                        // 未渲染完则继续
                        if (end < groupSkills.length) {
                            requestAnimationFrame(() => renderBatch(end, batchSize));
                        } else {
                            if (statusElem) {
                                statusElem.textContent = `(${groupSkills.length})`;
                            }
                        }
                    };
                    // 开始渲染当前分组
                    renderBatch();
                }, 0);
            } else {
                // 已加载内容直接切换显示状态
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                element.innerHTML = content.style.display === 'none' 
                    ? `参考相关［${keyword}］技能展开 <span class="loading-status">(${groupMap.get(keyword)?.length || 0})</span>`
                    : `收起相关［${keyword}］技能 <span class="loading-status">(${groupMap.get(keyword)?.length || 0})</span>`;
            }
        };
        // 全局统一的qnssShowCode函数（替换原有定义）
        window.qnssShowCode = function(typeOrSkillName) {
            let codeContainer;
            // 代码帮助模式（通过技能ID定位）
            if (typeof typeOrSkillName === 'string' && !['技能', '卡牌'].includes(typeOrSkillName)) {
                codeContainer = document.getElementById(`code_${typeOrSkillName}`);
            } 
            // 普通搜索模式（通过相邻元素定位）
            else {
                codeContainer = this.nextElementSibling?.classList.contains('skillCodeContainer') 
                    ? this.nextElementSibling
                    : this.parentNode.nextElementSibling;
            }
            if (!codeContainer) return;
            
            // 切换显示状态
            const display = codeContainer.style.display;
            codeContainer.style.display = (display === "none" || display === "") ? "block" : "none";
            
            // 代码帮助模式下的高亮处理
            if (codeContainer.style.display === "block" && !codeContainer.dataset.highlighted) {
                const skillName = typeOrSkillName;
                if (skillName && window.skillCache) {
                    const skill = window.skillCache.get(skillName);
                    if (skill) {
                        setTimeout(() => {
                            const pre = codeContainer.querySelector('pre');
                            pre.innerHTML = game.全能搜索_highlight(get.stringify(skill.rawSkillData));
                            codeContainer.dataset.highlighted = 'true';
                        }, 0);
                    }
                }
            }
            
            // 更新按钮文本
            const action = (display === "block") ? "查看" : "关闭";
            const typeText = typeof typeOrSkillName === 'string' && ['技能', '卡牌'].includes(typeOrSkillName) 
                ? typeOrSkillName 
                : '技能';
            this.innerHTML = `点击${action}${typeText}代码`;
        };
    };
    // 执行流程：先显示框架 -> 后台加载数据 -> 逐步更新内容
    (async () => {
        // 1. 立即显示分类框架（用户先看到结构）
        createCategoryFrames();
        
        // 2. 后台异步收集数据
        await collectSkillData();
        
        // 3. 匹配分组技能并实时更新UI
        const groupMap = await matchSkillsForGroups();
        
        // 4. 初始化交互逻辑
        initGroupLoading(groupMap);
        
        // 5. 标记加载完成
        isLoading = false;
        document.querySelectorAll('.loading-status').forEach(elem => {
            if (elem.textContent.includes('加载中')) {
                elem.textContent = '(加载完成)';
            }
        });
        console.timeEnd('搜索总耗时');
    })();
}
