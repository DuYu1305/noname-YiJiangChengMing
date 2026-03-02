// js/dbcss.js
/**
 * 显示代码帮助对话框（抽离自 extension.js）
 * @param {Searcher} searcher - Searcher 类实例（用于调用 tujianBegin 等方法）
 * @param {string} layoutPath - 资源路径（用于加载帮助图片）
 * @param {Object} globalObj - 全局依赖对象（game、ui、_status）
 */
export default function showCodeHelpDialog(searcher, layoutPath, globalObj) {
    const { game, ui, _status } = globalObj;

    // 1. 基础UI（保留原有结构）
    const mask = ui.create.div('.mask', ui.window);
    mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    // 添加帮助图片（使用传递的 layoutPath 路径）
    const helpImg = document.createElement('img');
    helpImg.src = `${layoutPath}img/bangzhu.png`; // 拼接图片路径
    helpImg.className = 'code-help-image'; // 用于定位的类名
    mask.appendChild(helpImg);

    const dialog = ui.create.div('.code-help-dialog', mask);
    dialog.style.cssText = `
        width: 360px;
        background: #fff;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        text-align: center;
    `;
    dialog.innerHTML = `
        <div style="margin-bottom: 16px; margin-top: -70px;"> 
            <input 
                type="text" 
                id="skillDesc" 
                style="width: 270px; 
                       padding: 10px; 
                       border: 1px solid #ccc; 
                       border-radius: 4px; 
                       font-size: 14px; 
                       box-sizing: border-box; 
                       margin-left:-130px;"
                placeholder="输入：请简洁的说明需要的技能…"
                maxlength="65"
            >
        </div>
        <div style="
            margin-top: -24px;
            margin-left: -120px;
            font-size: 15px;
            color: #000;
            text-shadow: 
                -1px -1px 0 #fff,
                1px -1px 0 #fff,
                -1px 1px 0 #fff,
                1px 1px 0 #fff;
            text-align: center;
            line-height: 1.6;
            margin-bottom: 12px;
        ">
            寒寒温柔提示：<br>
            若加载时间过长，考虑缩短一下字数嗷。
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            <button id="submitBtn" style="
                width: 140px;
                padding: 9px 0;
                text-align: center;
                background: #ffffff;
                color: #000;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 0px;
                margin-top: 50px;
            ">
                提交
            </button>
          <button id="cancelBtn" style="
    width: 140px;
    padding: 9px 0;
    text-align: center;
    background: #f9f9f9;
    color: #333;
    border: 3px solid #D4AF37; /* 边框加粗至3px（比原2px更粗） */
    border-radius: 4px;
    cursor: pointer;
    margin-left: 70px;
    margin-top: 49px;
    box-shadow: 0 2px 4px rgba(212, 175, 55, 0.2);
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
">
    取消
</button>

<style>
/* 悬停状态：保持3px粗边框，颜色高亮 */
#cancelBtn:hover {
    border: 3px solid #FFD700; /* 边框宽度同步加粗 */
    box-shadow: 0 3px 6px rgba(212, 175, 55, 0.4);
    background: #fdfdfd;
}

/* 点击状态：保持3px粗边框，颜色暗化 */
#cancelBtn:active {
    border: 3px solid #B8860B; /* 边框宽度统一 */
    box-shadow: inset 0 2px 4px rgba(212, 175, 55, 0.3);
    background: #f0f0f0;
}
</style>

        </div>
    `;

    // 2. 关键词字典（用户自定义，保留全量）
    //增加关键字增大搜索量，但依旧6个关键字限制。
    const keywordDict = [
        // 时机
        '回合开始前', '回合开始时', '回合结束后',
        '摸牌阶段前', '摸牌阶段时', '摸牌阶段后',
        '弃牌阶段前', '弃牌阶段时', '弃牌阶段后',
        '受到伤害前', '受到伤害时', '受到伤害后',
        '判定前', '判定时', '判定后',
        '失去体力前', '失去体力时', '失去体力后','回合结束后','回合结束前','回合结束时','展示','初始','每回合外','游戏开始后','每轮开始时','结束阶段时','卡牌生效前','出牌结算后','死亡时','复活时','武将牌翻面时','武将牌横置时','获得卡牌时','失去牌时','使用装备时','杀命中后','杀未命中时','拼点时','重铸牌','观星','交换手牌','交换装备','增加装备栏','废除装备栏','恢复装备栏','改变势力','改变性别','进入混乱状态','跳过阶段','增加标记','移除标记','清空标记','计数标记','获得护甲','失去护甲','改变体力','改变体力上限','发动技能','失去技能','临时获得技能','封印技能','解除封印','播放技能动画','播放配音','视为某牌','转化牌','上家','下家','存活角色','已死亡角色','同势力角色','不同势力角色','同性别角色','不同性别角色','攻击范围内角色','攻击范围外角色','延时锦囊牌','火属性牌','雷属性牌','无属性牌','红色牌','黑色牌','武器牌','防具牌','防御马','进攻马','宝物牌','坐骑牌','辎区牌','处理区牌','弃牌区牌','游戏外区域牌','拼点开始时','拼点结束后','使用杀时','使用闪时','使用桃时','使用酒时','使用决斗时','使用南蛮入侵时','使用万箭齐发时','被铁索连环时','铁索连环重置时','觉醒时','限定技发动时','转换技发动时','使命技发动时','隐匿技发动时','蓄力技发动时','状态技生效时','锁定技生效时','主公技发动时','全局技生效时','摸牌至x张','弃牌至x张','随机摸牌','随机弃牌','指定区域摸牌','指定区域弃牌','展示手牌','展示装备','观看手牌','观看装备','移动牌','置入弃牌堆','从弃牌堆获得','从牌堆底摸牌','牌堆顶摸牌','公开摸牌','暗置摸牌','造成x点伤害','造成属性伤害','防止伤害','伤害+X','伤害-X','回复x点体力','体力流失x点','体力上限+x','体力上限-x','手牌上限+x','手牌上限-x','无法使用牌','无法打出牌','无法弃置牌','无法获得牌','无法失去牌','强制使用牌','强制弃置牌','强制获得牌','强制失去牌','无距离限制','距离+x','距离-x','攻击距离+x','攻击距离-x','防御距离+x','防御距离-x','无视防具','无视距离','技能不可被封印','技能可被封印','技能永久生效','技能临时生效','技能持续x回合','技能持续至回合结束','技能持续至死亡','成为杀的目标时','成为锦囊的目标时','成为装备的目标时','使用牌指定目标时','成为牌的目标后','使用牌后','打出牌后','弃置其他角色的牌','获得其他角色的牌','失去其他角色的牌','交给其他角色牌','从其他角色获得牌','其他角色获得你的牌','其他角色失去你的牌','其他角色弃置你的牌','其他角色使用牌对你时','其他角色打出牌对你时',
        
        // 操作
        '判定', '摸牌', '弃牌','成为目标','标记','失去体力', '回复体力','打出','使用',
        '摸一张牌','摸x张牌','失去一点体力','失去x点体力','选项','选择','其他势力','展示',
        '弃置','废除','拼点','议会','点数','减一点体力上限','减x点体力上限','手牌上限',
        '体力上限','封印技能','删除','获得技能','回合外','回合内','指定','每轮结束',
        '每轮开始','手牌区','装备区','判定区','造成伤害', '获得牌', '失去牌', '翻面', '横置','指定','受到伤害时','受到伤害前','受到伤害后','伤害来源',"技能失效","失效","移除","响应","不可响应",
        
        // 角色
        '所有角色', '所有其他角色', '当前玩家', '目标角色', '自己',"其他角色",
        
        // 卡牌
        '红桃', '黑桃', '方块', '梅花', '基本牌', '锦囊牌', '装备牌'
    ];

    // 3. 折叠控制（保留逻辑）
    window.toggleKeywordGroup = function(element) {
        const content = element.nextElementSibling;
        const keyword = element.innerText.match(/［(.*?)］/)[1];
        if (content.style.display === 'none') {
            content.style.display = 'block';
            element.innerText = `收起相关［${keyword}］技能`;
        } else {
            content.style.display = 'none';
            element.innerText = `参考相关［${keyword}］技能展开`;
        }
    };

    // 4. 提交事件（强化关键词提取 + 调试日志）
    //提交按钮事件（添加骨架屏）
    dialog.querySelector('#submitBtn').addEventListener('click', () => {
        const input = dialog.querySelector('#skillDesc').value.trim();
        if (!input) {
            game.alert('请输入技能描述');
            return;
        }
        if (input.length > 80) {
            game.alert('输入不能超过80字');
            return;
        }
        // 提取关键词：长关键词优先，最多6个
        const extracted = [];
        const inputLower = input.toLowerCase();
        const sortedKeywords = [...keywordDict].sort((a, b) => b.length - a.length);
        
        sortedKeywords.forEach(keyword => {
            if (inputLower.includes(keyword.toLowerCase()) && !extracted.includes(keyword)) {
                extracted.push(keyword);
                if (extracted.length >= 6) return;
            }
        });
        const searchStr = extracted.map(k => k.replace('所有人', '所有角色')).join(' ');
        
        // 显示骨架屏（优化用户体验）
        mask.innerHTML = `
            <div style="text-align: center; color:white; font-size:18px; margin-bottom: 20px;">
                正在搜索请稍等...
            </div>
            <div style="width: 80%; margin: 0 auto;">
                ${extracted.map(keyword => `
                    <div style="
                        background: #444;
                        height: 40px;
                        margin: 10px 0;
                        border-radius: 4px;
                        animation: skeleton-loading 1.5s linear infinite alternate;
                    ">
                        <div style="
                            width: 30%;
                            height: 100%;
                            background: #666;
                            border-radius: 4px 0 0 4px;
                        "></div>
                    </div>
                `).join('')}
            </div>
            <style>
                @keyframes skeleton-loading {
                    0% { background-color: #444; }
                    100% { background-color: #666; }
                }
            </style>
        `;
        
        // 0.5秒后执行搜索（调用 Searcher 实例的 tujianBegin 方法）
        setTimeout(() => {
            mask.remove();
            _status.当前搜索关键词 = extracted;
            searcher.tujianBegin(searcher.content, searchStr, true, false, true);
        }, 500);
    });

    // 5. 取消事件（保留）
    dialog.querySelector('#cancelBtn').addEventListener('click', () => {
        mask.remove();
    });
}
