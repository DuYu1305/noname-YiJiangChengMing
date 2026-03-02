/// <reference path="./typings/index.d.ts" />
/// <reference path="./typings/highlight.d.ts" />
/**
 * @typedef { {name?: string, fileName?: string, documentation?: string, type?: string, constructors?: DocEntry[], parameters?: DocEntry[], returnType?: string, instanceMembers?: DocEntry[], staticMembers?: DocEntry[]} } DocEntry
 */
import { lib, game, ui, get, ai, _status } from '../../noname.js';
import { loadModeReady, loadModeData, hook, restore } from './hook.js';
import showCodeHelpDialog from './js/dbcss.js';
import renderSkillTutorial from './js/jiaocheng.js';
import daibangCodeHelpFindSkill from './js/daibang.js'; 
import handleFindCharacter from './js/casting.js';
import handleFindCode from './js/skillxun.js';
import handleFindSkill from './js/skilledness.js';
import bendikuozhan from './js/bendikuozhan.js';

export const type = 'extension';

/**
 * @type { () => importExtensionConfig }
 */
export default () => {
	return {
        name: "全能搜索",
        editable: false,
        async content(config, pack) {
            if (Array.isArray(lib.arenaReady)) {
                lib.arenaReady.push(loadModeData);
            } else {
                loadModeData();
            }
            await import('./polyfill.js');

            // 配置加入hljs
            /**
             * @type { { default: import('highlight.js').HLJSApi } }
             */
            const { default: hljs } = await import('./highlight.min.js');
            hljs.configure({
                languages: ['javaScript'],
            });
            game.全能搜索_highlight = (text = 'undefined') => hljs.highlightAuto(text).value;

            // 引入全局api描述
            /**
             * @type { DocEntry[] | undefined }
             */
            let description;
            
            /********************************************************************************************* */
            // 中文搜索优化辅助函数：提取纯文本并处理特殊字符
            const getPureText = (html) => {
                if (!html || typeof html !== 'string') return '';
                try {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    return doc.body.textContent || '';
                } catch (e) {
                    // 解析失败时直接清理HTML标签
                    return html.replace(/<[^>]+>/g, '').trim();
                }
            };

            // 增强的中文匹配函数：支持模糊匹配和全角半角兼容
            const matchChinese = (source, target) => {
                if (!source || !target) return false;
                // 统一转换为小写并处理全角半角
                const normalize = (str) => str.toLowerCase()
                    .replace(/[\uff01-\uff5e]/g, c => String.fromCharCode(c.charCodeAt(0) - 65248))
                    .replace(/\s+/g, '');
                
                const normalizedSource = normalize(getPureText(source));
                const normalizedTarget = normalize(target);
                
                // 支持空格分隔的多关键词匹配
                const keywords = normalizedTarget.split(/\s+/).filter(k => k);
                return keywords.every(k => normalizedSource.includes(k));
            };
            
            //向【诗笺】致敬，斗胆增加一点功能。下面是更改的内容。
            get.qnssAllDerivation = function (skill, step) {
                step = step || 0;
                if (step >= 2) return [];
                const skillobj = lib.skill[skill];
                if (!skillobj) return [];
                let subSkillList = [];
                //添加技能中derivation,group和global中的技能
                const arr = ['derivation', 'group', 'global'];
                arr.forEach((i) => {
                    if (skillobj[i]) {
                        if (typeof skillobj[i] == 'string') {
                            subSkillList.add(skillobj[i]);
                        } else if (Array.isArray(skillobj[i])) {
                            subSkillList.addArray(skillobj[i]);
                        }
                    }
                });

                const reg = /(addTempSkill|addSkill|addAdditionalSkill)\((['"])([\w]+)\2/g;
                let str = get.stringify(skillobj);
                for (let match of str.matchAll(reg)) {
                    if (match && match[3]) subSkillList.add(match[3]);
                }
                for (let s of subSkillList) {
                    subSkillList.addArray(get.qnssAllDerivation(s, step + 1));
                }
                return subSkillList;
            };

            /******************************************************************************************** */

            // 移除武将卡牌搜索器扩展
            // game.removeExtension("武将卡牌搜索器", false);

            let layoutPath = lib.assetURL + 'extension/全能搜索/';

            // 加入分页插件
            const { Pagination } = await import('../../noname/util/pagination.js').catch(() => import('./SimplePagination.js'));

            // html语法高亮
            const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

            //加入css
            lib.init.css(layoutPath, 'css/extension');
            ui.qnssEditorCss = lib.init.css(layoutPath, `css/${game.getExtensionConfig('全能搜索', 'css') ? game.getExtensionConfig('全能搜索', 'css').slice(0, -4) : 'vs2015.min'}`);

            const css = ['a11y-dark.min.css', 'an-old-hope.min.css', 'atom-one-dark.min.css', 'extension.css', 'felipec.min.css', 'gml.min.css', 'vs2015.min.css'];
            ui.qnssChangeEditorCss = (name) => {
                if (css.includes(`${name}.min.css`) || css.includes(name)) {
                    ui.qnssEditorCss && ui.qnssEditorCss.remove();
                    if (!name.endsWith('.min.css')) name = name + '.min.css';
                    ui.qnssEditorCss = lib.init.css(layoutPath, `css/${name.slice(0, -4)}`);
                }
            };
            // 设置全局的跳转搜索功能
            window.qnssSee = function (a) {
                _status.全能搜索_Searcher.tujianBegin(_status.全能搜索_Searcher.content, a ? a.innerText : undefined, false, true);
            };
            // 显示/关闭代码
            window.qnssShowCode = function (type) {
    // 统一获取代码容器（修复普通搜索的选择逻辑）
    let codeContainer;
    if (type === "技能" || !type) {
        // 处理普通技能和默认情况
        codeContainer = this.nextElementSibling?.classList.contains('skillCodeContainer') 
            ? this.nextElementSibling
            : this.parentNode.nextElementSibling;
    } else {
        // 处理其他类型
        codeContainer = this.nextElementSibling;
    }

    // 切换显示状态
    const display = codeContainer.style.display;
    codeContainer.style.display = (display === "none" || display === "") ? "block" : "none";
    
    // 更新按钮文本
    const action = (display === "block") ? "查看" : "关闭";
    this.innerHTML = `点击${action}${type || '技能'}代码`;
};


            window.qnssPlayCardAudio = function (sex, cardName, nature) {
                let audioinfo = lib.card[cardName].audio;
                if (cardName == 'sha' && ['fire', 'thunder', 'ice'].includes(nature)) {
                    game.playAudio('card', sex, `sha_${nature}`);
                } else {
                    if (typeof audioinfo == 'string') {
                        if (audioinfo.indexOf('ext:') == 0) game.playAudio('..', 'extension', audioinfo.slice(4), `${cardName}_male`);
                        else game.playAudio('card', sex, audioinfo);
                    }
                    else {
                        game.playAudio('card', sex, cardName);
                    }
                }
            };

            window.qnssPlayDieAudio = function (charName) {
                try {
                    game.tryDieAudio({ name: charName })
                } catch {
                    let findInExt = false;
                    // @ts-ignore
                    Object.keys(lib.characterPack).forEach(key => {
                        // 扩展自带的武将包
                        if (key.includes("mode_extension_")) {
                            if (charName in lib.characterPack[key] && lib.character[charName] == lib.characterPack[key][charName]) {
                                // @ts-ignore
                                findInExt = key.slice(15);
                            }
                        }
                        // 扩展自定义的武将包
                        if (lib.config.extensions.includes(lib.translate[key + "_character_config"])) {
                            if (charName in lib.characterPack[key] && lib.character[charName] == lib.characterPack[key][charName]) {
                                // @ts-ignore
                                findInExt = lib.translate[key + "_character_config"];
                            }
                        }
                    });
                    if (findInExt) {
                        // @ts-ignore
                        game.playAudio("..", "extension", findInExt, charName, function () {
                            // @ts-ignore
                            window.qnssFindDieAudio(findInExt, charName)
                        });
                    } else if (lib.character[charName] && lib.character[charName][4].includes("die_audio")) {
                        // @ts-ignore
                        game.playAudio("die", charName, function () {
                            game.alert("该武将没有阵亡语音");
                        });
                    } else {
                        // @ts-ignore
                        game.playAudio("die", charName, function () {
                            // @ts-ignore
                            game.playAudio("die", charName.slice(charName.indexOf("_") + 1), function () {
                                game.alert("该武将没有阵亡语音");
                            });
                        });
                    }
                }
            };

            window.qnssFindDieAudio = function (ext, charName) {
                if (lib.skill["_ansory@method_die.audio"]) {
                    const info = lib.character[charName];
                    if (info && Array.isArray(info[4])) {
                        const dieTags = info[4].filter(tag => /^die:/.test(tag));
                        if (dieTags.length > 0) {
                            const dieTag = dieTags[0];
                            const matchResult = dieTag.match(/^die:(?:ext:(.+?)\/)?(.+)$/);
                            if (matchResult != null) {
                                const extensionName = matchResult[1], path = matchResult[2];
                                if (extensionName) {
                                    game.playAudio("..", "extension", extensionName, path);
                                } else {
                                    game.playAudio("..", path);
                                }
                                return;
                            }
                        }
                    }
                }
                
                const r = new RegExp(`game.playAudio\\(['"]..['"],\\s*['"]extension['"],\\s*['"]` + ext + `\\S*['"],\\s*\\S+\\)`);
                const player = ui.create.player().init(charName);
                const dieAudioSkills = Object.keys(lib.skill).filter(v => {
                    if (!v.startsWith('_')) return false;
                    const info = lib.skill[v];
                    if (typeof info.trigger != 'object' || typeof info.content != 'function') return false;
                    for (const t in info.trigger) {
                        if (['global', 'player'].includes(t)) {
                            if (!Array.isArray(info.trigger[t])) info.trigger[t] = [info.trigger[t]];
                            if (!info.trigger[t].some(v => v.startsWith('die'))) return false;
                        }
                    }
                    if (typeof info.filter == 'function') {
                        try {
                            // @ts-ignore
                            if (info.filter({ player }, player) == false) return false;
                        } catch (e) {
                            return false;
                        }
                    }
                    if (r.test(info.content.toString()) == false) return false;
                    return true;
                });
                if (!dieAudioSkills.length) {
                    game.alert("该武将没有阵亡语音");
                } else {
                    const dieAudioSkillsPromise = dieAudioSkills.map(skill => {
                        return new Promise((resolve, reject) => {
                            // @ts-ignore
                            const toString = lib.skill[skill].content.toString();
                            const match = toString.match(r);
                            if (!match) reject();
                            // @ts-ignore
                            let evalArgs = match[0];
                            evalArgs = evalArgs.slice(0, evalArgs.lastIndexOf(',') + 1) + '\'' + player.name + '\'' + ', (e) => { reject(e); });';
                            // console.log(evalArgs);
                            eval(evalArgs);
                            // audio的onerror是异步触发的
                            setTimeout(() => {
                                resolve(null);
                            }, 100);
                        });
                    });
                    Promise.allSettled(dieAudioSkillsPromise).then(result => {
                        if (result.every(v => v.status == 'rejected')) {
                            game.alert("该武将没有阵亡语音");
                        }
                    });
                }
            };

            /** 
             * @description 双击复制
             * @param target 要复制的目标
             * */
            game.全能搜索_copy = function (target) {
                function error() {
                    // target可写
                    target.setAttribute('contenteditable', true);
                    // 自动选中文字
                    // @ts-ignore
                    if (document.body.createTextRange) {
                        // @ts-ignore
                        const range = document.body.createTextRange();
                        range.moveToElementText(target);
                        range.select();
                    } else if (window.getSelection) {
                        const selection = window.getSelection();
                        const range = document.createRange();
                        range.selectNodeContents(target);
                        // @ts-ignore
                        selection.removeAllRanges();
                        // @ts-ignore
                        selection.addRange(range);
                    } else {
                        // 选中失败
                        return;
                    }
                    typeof target.focus == 'function' && target.focus();
                    let contextmenuEvent = new Event("contextmenu", { "bubbles": false, "cancelable": false });
                    target.dispatchEvent(contextmenuEvent);
                }
                if (!target) return;
                let text;
                if (typeof target == "string") {
                    text = target;
                } else {
                    text = (target.toString() == "[object Text]" ? target.textContent : target.innerText);
                }
                if (!text) return;
                if (!navigator.clipboard) {
                    //alert('此版本不支持写入剪切板');
                    return error();
                };
                // @ts-ignore
                navigator.clipboard.writeText(text).then(e => {
                    game.alert("复制成功！\n" + text);
                }).catch(error);
            };

            game.全能搜索_createWaveText = (text, style) => {
                const div = document.createElement('div');
                div.classList.add('qnssWave');
                div.innerText = text;
                div.dataset.text = text;
                if (typeof style == 'object') {
                    div.css(style);
                }
                return div;
            };

            game.全能搜索_createSkillText = (skill, charName) => {
                let skillText = '<span class="bluetext">技能台词&nbsp</span></br>';

                const skillTextMap = game.parseSkillTextMap?.(skill, charName ? { name: charName } : null).filter(v => v.text) || [];

                skillTextMap.forEach((v, i) => {
                    skillText += html`
                        <span>${i + 1}:</span>
                        <span>${v.text}</span>
                        <img src='${layoutPath}img/qhly_pic_playaudiobutton.png' alt='点击播放技能语音' onclick='game.playAudio("${v.file}")' style='position: absolute; width: 100px; margin: 0; padding: 0;' />
                        </br>
                    `;
                });

                if (skillTextMap.length == 0) {
                    skillText = html`
                        <span class="bluetext">技能语音&nbsp</span>
                        <img src='${layoutPath}img/qhly_pic_playaudiobutton.png' alt='点击播放技能语音' onclick='game.trySkillAudio("${skill}", {name:"${charName}"}, true)' style='position: absolute; width: 100px; margin: 0; padding: 0;' />
                        </br>
                    `;
                }
                return skillText;
            };

            game.全能搜索_createDieText = (charName) => {
                let dieText = '<span class="bluetext">阵亡台词&nbsp</span></br>';

                const dieTextMap = game.parseDieTextMap?.(charName).filter(v => v.text) || [];

                dieTextMap.forEach((v, i) => {
                    dieText += html`
                        <span>${i + 1}:</span>
                        <span>${v.text}</span>
                        <img src='${layoutPath}img/qhly_pic_playaudiobutton.png' alt='点击播放阵亡语音' onclick='game.playAudio("${v.file}")' style='position: absolute; width: 100px; margin: 0; padding: 0;' />
                        </br>
                    `;
                });

                if (dieTextMap.length == 0) {
                    dieText = html`
                        <span class="bluetext">阵亡语音&nbsp</span>
                        <img src='${layoutPath}img/qhly_pic_playaudiobutton.png' alt='点击播放阵亡语音' onclick='window.qnssPlayDieAudio("${charName}");'style='position: absolute; width: 100px; margin: 0; padding: 0;' />
                        </br>
                    `;
                }
                return dieText;
            };
         // 替换原来的普通函数定义，改为全局挂载
window.showCopySuccess = function(skillName) {
    // 移除已存在的提示框
    const oldToast = document.querySelector('.copy-toast');
    if (oldToast) oldToast.remove();
    
    // 创建半透明遮罩层（点击任何地方关闭）
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.backgroundColor = 'rgba(0,0,0,0.3)';
    mask.style.zIndex = '9999';
    mask.style.display = 'flex';
    mask.style.alignItems = 'center';
    mask.style.justifyContent = 'center';
    mask.onclick = () => mask.remove(); // 点击遮罩关闭
    
    // 创建提示框
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.style.padding = '20px 40px';
    toast.style.backgroundColor = 'white';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '18px';
    toast.style.color = '#333';
    toast.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    toast.style.zIndex = '10000';
    toast.style.userSelect = 'none';
    toast.innerText = `复制成功：[${skillName}]`;
    toast.onclick = (e) => {
        e.stopPropagation(); // 防止点击提示框本身触发遮罩关闭
    };
    
    mask.appendChild(toast);
    document.body.appendChild(mask);
    
    // 3秒后自动关闭
    setTimeout(() => mask.remove(), 3000);
};


// 优化复制函数（替换原有）
game.全能搜索_copy = function (target) {
    function error() {
        target.setAttribute('contenteditable', true);
        if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(target);
            range.select();
        } else if (window.getSelection) {
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(target);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            return;
        }
        typeof target.focus == 'function' && target.focus();
        let contextmenuEvent = new Event("contextmenu", { "bubbles": false, "cancelable": false });
        target.dispatchEvent(contextmenuEvent);
    }
    if (!target) return;
    let text;
    if (typeof target == "string") {
        text = target;
    } else {
        text = (target.toString() == "[object Text]" ? target.textContent : target.innerText);
    }
    if (!text) return;
    if (!navigator.clipboard) {
        return error();
    };
    navigator.clipboard.writeText(text).catch(error);
};
            const qnssVariable = { player: null, card: null, lib, game, ui, get, ai, _status };

            /** 搜索器类 */
            class Searcher {
                // [Symbol.toStringTag] = "Searcher"
                //构造方法
                constructor(target) {
                    hook();
                    /** @type {string} 原先的背景图片 **/
                    this.Image = ui.background.style.backgroundImage;

                    if (game.getExtensionConfig('全能搜索', 'backgroundImage') === undefined) {
                        game.saveExtensionConfig('全能搜索', 'backgroundImage', 'none');
                    }
                    if (game.getExtensionConfig('全能搜索', 'backgroundImage') !== 'none') {
                        if (game.getExtensionConfig('全能搜索', 'backgroundImage') == '随机') {
                            ui.background.setBackgroundImage("extension/全能搜索/img/" + ['相爱相杀', 'picture'].randomGet() + ".png");
                        } else {
                            ui.background.setBackgroundImage("extension/全能搜索/img/" + game.getExtensionConfig('全能搜索', 'backgroundImage'));
                        }
                    }
                    
                    
                    //添加技能关键词索引初始化（仅执行一次）
        // 检查是否已初始化索引
        if (!window.skillKeywordIndex) {
            window.skillKeywordIndex = new Map(); // 格式: Map<关键词, Set<技能ID>>
            // 遍历所有技能构建索引
            Object.keys(lib.skill).forEach(skillId => {
                const skill = lib.skill[skillId];
                // 过滤无效技能
                if (['global', 'globalmap', 'storage'].includes(skillId) || typeof skill !== 'object') {
                    return;
                }
                // 提取技能描述文本
                const skillInfo = lib.translate[skillId + '_info'] || '';
                const skillName = lib.translate[skillId] || skillId;
                const rawText = (skillInfo + ' ' + skillName).toLowerCase();
                // 拆分关键词（过滤单字）
                const keywords = rawText.split(/[\s,，.。;；、]+/).filter(k => k.length > 1);
                // 加入索引
                keywords.forEach(keyword => {
                    if (!window.skillKeywordIndex.has(keyword)) {
                        window.skillKeywordIndex.set(keyword, new Set());
                    }
                    window.skillKeywordIndex.get(keyword).add(skillId);
                });
            });
        }

                    /** @type {HTMLDivElement} */
                    this.manual = ui.create.div('.Searcher');
                    /** @type {HTMLDivElement} */
                    this.menu = ui.create.div('.menu', this.manual);
                    /** @type {HTMLInputElement} */
                    this.input = this.menu.appendChild(document.createElement('input'));

                    this.input.addEventListener('animationend', function (e) {
                        if (e.animationName == 'qnssWrong') this.classList.remove('qnssWrong');
                    });

                    /**
                     * @description 搜索历史
                     * @type {string[]}
                     *  */
                    this.searchList = game.getExtensionConfig('全能搜索', 'searchList') || [];
                    /**
                     * @description 搜索历史, 用于和武将界面联动。该config不随“清空历史”而清空
                     * @type {string[]}
                     *  */
                    this.tsymqSearchList = game.getExtensionConfig('全能搜索', 'tsymqSearchList') || [];
                    /** @type {HTMLUListElement} */
                    this.ul = this.menu.appendChild(document.createElement('ul'));

                    this.hoverLi = null;
                    
                    this.search = ui.create.div('.search', this.menu, '搜索');
                    this.clear = ui.create.div('.clear', this.menu, '清空历史', this.clearDataList.bind(this));
                    
                    this.codeHelp = ui.create.div('.codeHelp', this.menu, '代码帮助', () => {
    this.showCodeHelpDialog();
});
                    this.close = ui.create.div('.close', this.menu, '关闭');
                    this.oldDialog = _status.event.dialog || ui.dialog;
                    this.dialog = ui.create.dialog();
                    // 防止国战dialog.filterButton报错
                    ui.dialog = this.oldDialog;
                    this.content = this.manual.appendChild(this.dialog);
                    // 选择搜索方式
                    this.searcherModule = game.getExtensionConfig('全能搜索', 'searcherModule') || ['findCharacter', 'findCard', 'findSkill', 'findCode'];
                    game.saveExtensionConfig('全能搜索', 'searcherModule', this.searcherModule);
                    this.chooseModuleDiv = ui.create.div('.chooseModule', this.menu, '搜索模式', function (e) {
                        // 解决chrome109废弃event.path的问题
                        if (e.target != this) return;
                        this.firstElementChild.classList.toggle('hover');
                    });

                    /** @type { HTMLUListElement }  */
                    const cm = ui.create.node('ul.list', this.chooseModuleDiv);
                    for (const arr of [['findCharacter', '搜索武将'], ['findCard', '搜索卡牌'], ['findSkill', '搜索技能'], ['findCode', '搜索代码']]) {
                        const key = arr[0];
                        const value = arr[1];
                        const li = ui.create.node('li');
                        cm.appendChild(li);
                        const input = ui.create.node('input');
                        input.type = 'checkbox';
                        input.value = key;
                        input.checked = this.searcherModule.includes(key);
                        input.addEventListener('change', () => {
                            if (input.checked) {
                                this.searcherModule.add(key);
                            } else {
                                this.searcherModule.remove(key);
                            }
                            game.saveExtensionConfig('全能搜索', 'searcherModule', this.searcherModule);
                        });
                        this[key + 'Input'] = input;
                        li.appendChild(input);
                        li.appendChild(ui.create.node('span', value));
                    }
                    
                    // 技能教程按钮
                    //主事件
this.skillTutorialDiv = ui.create.div('.chooseSkillTutorial', this.menu, '技能教程');
this.skillTutorialDiv.addEventListener('click', () => {
  this.showSkillTutorial();
});
                    
               
// 技能类型单选配置
this.selectedSkillType = game.getExtensionConfig('全能搜索', 'selectedSkillType') || '';
game.saveExtensionConfig('全能搜索', 'selectedSkillType', this.selectedSkillType);
// 按钮初始文本显示选中的类型或默认文字
this.skillTypeText = ui.create.node('span');
this.skillTypeText.innerText = this.selectedSkillType || '搜索类型';

// 下拉菜单容器（单选按钮的父级）
this.skillTypeMenu = ui.create.node('ul');
this.skillTypeMenu.className = 'skillTypeMenu'; // 初始隐藏，通过CSS控制

// 组装按钮：div > span（显示文本） + ul（下拉菜单）
this.chooseSkillTypeDiv = ui.create.div('.chooseSkillType', this.menu);
this.chooseSkillTypeDiv.appendChild(this.skillTypeText);
this.chooseSkillTypeDiv.appendChild(this.skillTypeMenu);

// 点击事件：允许点击按钮内部任意位置
this.chooseSkillTypeDiv.addEventListener('click', (e) => {
  // 核心：只要点击发生在按钮容器内（包括子元素），就触发下拉
  if (this.chooseSkillTypeDiv.contains(e.target)) {
    this.skillTypeMenu.classList.toggle('hover');
  }
});
// 新增：点击外部区域关闭下拉菜单（优化体验）
document.addEventListener('click', (e) => {
  if (
    !this.chooseSkillTypeDiv.contains(e.target) && 
    this.skillTypeMenu.classList.contains('hover')
  ) {
    this.skillTypeMenu.classList.remove('hover');
  }
});

// 技能类型列表
const skillTypes = [
  ['无', '无'], 
  ['主公技', '主公技'], 
  ['觉醒技', '觉醒技'], 
  ['锁定技', '锁定技'], 
  ['衍生技', '衍生技'], 
  ['状态技', '状态技'], 
  ['限定技', '限定技']
];


for (const arr of skillTypes) {  
  const key = arr[0];  
  const value = arr[1];  
  const li = ui.create.node('li');  


  const input = ui.create.node('input');  

  input.type = 'radio';  
  input.name = 'skillType';  
  input.value = key;  
  input.checked = (this.selectedSkillType === key);  

  const self = this;  
  input.addEventListener('change', function() {  
    self.selectedSkillType = this.checked ? this.value : '';  
    game.saveExtensionConfig('全能搜索', 'selectedSkillType', self.selectedSkillType);  
    self.skillTypeText.innerText = self.selectedSkillType || '搜索类型';  
    self.skillTypeMenu.classList.remove('hover');  
  });  

  this['skillType_' + key + 'Input'] = input;  
  li.appendChild(input);  
  li.appendChild(ui.create.node('span', value));  
  this.skillTypeMenu.appendChild(li);  
}  

// 搜索类型按钮
                    // 暂停游戏 
                    game.pause2();
                    // 复制时会触发window.onkeydown
                    this.keydownFun = window.onkeydown;
                    window.onkeydown = null;

                    this.ul.setAttribute('id', '全能搜索_datalist');

                    /** 提示这些 */
                    let alwaysShow = this.searchList.slice(0).sort();
                    this.alwaysShow = alwaysShow;

                    /** 显示ul */
                    let showUl = () => {
                        if (this.ul.hasChildNodes()) {
                            this.ul.style.display = '';
                        }
                    };

                    let getDescription = (result, descriptionArray, data) => {
                        if (get.objtype(result) == 'object') {
                            // @ts-ignore
                            return result.description || result[qnssDescriptionSymbol];
                        } else if (result && result.description) {
                            return result.description;
                        } else if (typeof result == 'string') {
                            return result;
                        } else {
                            const last = descriptionArray.slice(0, -1).reduce((previous, current) => {
                                if (previous && previous[current]) {
                                    return previous[current];
                                }
                            }, lib.description);
                            // @ts-ignore
                            if (last && last[qnssKeySymbol]) {
                                // @ts-ignore
                                if (typeof last[qnssKeySymbol] == 'string') {
                                    // @ts-ignore
                                    return last[qnssKeySymbol];
                                }
                                // @ts-ignore
                                else if (typeof last[qnssKeySymbol] == 'function') {
                                    // @ts-ignore
                                    return last[qnssKeySymbol](data);
                                }
                            }
                        }
                    }

                    let createLi = (data) => {
                        let li = document.createElement('li');
                        li.innerText = data;

                        // 去掉最后一个元素的数组
                        const descriptionArray = data.split('.');
                        // 结果变量
                        const result = descriptionArray.reduce((previous, current) => {
                            if (previous && previous[current]) {
                                return previous[current];
                            }
                        }, lib.description);

                        const description = getDescription(result, descriptionArray, data);
                        if (description) {
                            // 添加注释
                            let descriptionDiv = document.createElement('div');
                            descriptionDiv.className = 'description';
                            // @ts-ignore
                            descriptionDiv.description = description;
                            // 单机图标或者右键/长按
                            descriptionDiv.onclick = li.oncontextmenu = (e) => {
                                e.stopPropagation();
                                li.dispatchEvent(new CustomEvent('onmouseover'));
                            }
                            li.appendChild(descriptionDiv);
                        }

                        li.addEventListener('click', () => {
                            this.input.value = li.innerText;
                            this.input.dispatchEvent(new CustomEvent('changeInput'));
                            this.ul.style.display = 'none';
                        });

                        li.addEventListener('mouseover', (e) => {
                            if (e.clientX && e.clientY) {
                                const hoverElement = document.elementFromPoint(e.clientX, e.clientY);
                                // @ts-ignore
                                if (hoverElement == this.ul.descriptionDiv) return;
                            }
                            if (this.hoverLi == li) return;
                            else if (this.hoverLi) {
                                // @ts-ignore
                                if (this.ul.descriptionDiv) {
                                    // @ts-ignore
                                    this.ul.descriptionDiv.remove();
                                    // @ts-ignore
                                    delete this.ul.descriptionDiv;
                                }
                                this.hoverLi.classList.remove('hover');
                            }
                            this.hoverLi = li;
                            li.classList.add('hover');
                            const descriptionDiv = li.querySelector('.description');
                            if (descriptionDiv) {
                                // @ts-ignore
                                const description = descriptionDiv.description;
                                const css = li.getBoundingClientRect();
                                const ulCss = this.ul.getBoundingClientRect();
                                /**@type DOMRect */
                                const uiCss = ui.window.getBoundingClientRect();

                                let showDescriptionDiv = document.createElement('div');
                                showDescriptionDiv.className = 'showDescription';
                                showDescriptionDiv.innerHTML = `
									<span style="margin: 15px;">${li.innerText}:</span>
									<br>
									<span style="margin: 15px;">${description}</span>
								`;
                                // @ts-ignore
                                showDescriptionDiv.li = li;
                                showDescriptionDiv.style.position = 'absolute';
                                showDescriptionDiv.style.zIndex = '1001';
                                this.manual.appendChild(showDescriptionDiv);

                                const divCss = showDescriptionDiv.getBoundingClientRect();

                                // 左右边框共占2px
                                // 如果宽度足够
                                if (css.right + divCss.width + 2 <= uiCss.width) {
                                    showDescriptionDiv.style.top = css.top + 'px';
                                    showDescriptionDiv.style.left = ulCss.right + 1 + 'px';
                                } else {
                                    // 如果左边宽度够放
                                    if (css.left > divCss.width + 2) {
                                        showDescriptionDiv.style.top = css.top + 'px';
                                        showDescriptionDiv.style.left = ulCss.left - divCss.width - 1 + 'px';
                                    } else {
                                        // 不能的话，只能放右边了, 然后高度下调
                                        showDescriptionDiv.style.top = css.top + 50 + 'px';
                                        showDescriptionDiv.style.left = uiCss.width - divCss.width - 7 + 'px';
                                    }
                                }
                                // @ts-ignore
                                this.ul.descriptionDiv = showDescriptionDiv;
                            }
                        });

                        li.addEventListener('mouseleave', (e) => {
                            // @ts-ignore
                            if (this.ul.descriptionDiv) {
                                if (e.clientX && e.clientY) {
                                    const hoverElement = document.elementFromPoint(e.clientX, e.clientY);
                                    // @ts-ignore
                                    if (hoverElement == this.ul.descriptionDiv) return;
                                }
                                // @ts-ignore
                                this.ul.descriptionDiv.remove();
                                // @ts-ignore
                                delete this.ul.descriptionDiv;
                            }
                            if (this.hoverLi == li) {
                                this.hoverLi = null;
                            }
                            li.classList.remove('hover');
                        });

                        return li;
                    }

                    /** 重新设置ul的子元素 */
                    let updateDescription = () => {
                        while (this.ul.hasChildNodes()) {
                            // @ts-ignore
                            this.ul.removeChild(this.ul.firstChild);
                        }
                        if (!this.input.value) return;
                        this.alwaysShow.sort();
                        for (let data of this.alwaysShow.filter(data => {
                            // 优化中文前缀匹配
                            return matchChinese(data, this.input.value) && this.input.value !== data;
                        })) {
                            if (!this.searchList.includes(data) && !lib.skill[data]) {
                                continue;
                            }
                            this.ul.appendChild(createLi(data));
                        }
                        showUl();
                    }

                    /** 添加提示 */
                    let addOptions = (value, array) => {
                        for (const key of array) {
                            // 最多显示30条信息
                            if (this.ul.childElementCount >= 30) return;
                            if (this.searchList.includes(value + key)) {
                                continue;
                            } else if (!this.input.value) {
                                continue;
                            } else if (!matchChinese(value + key, this.input.value)) {
                                continue;
                            }
                            if (alwaysShow.add(value + key) != false) {
                                alwaysShow.sort();
                                const li = createLi(value + key);
                                let index = alwaysShow.indexOf(value + key);
                                this.ul.insertBefore(li, this.ul.childNodes[index]);
                                showUl();
                            }
                        }
                    };

                    /** 清除提示 */
                    let clearOptions = () => {
                        alwaysShow = this.searchList.slice(0).sort();
                        updateDescription();
                    };

                    this.clearOptions = clearOptions;

                    // 初始化
                    updateDescription();
                    this.ul.style.display = 'none';

                    // 选择一个下拉框的值后，清空
                    this.input.addEventListener('changeInput', () => {
                        // @ts-ignore
                        if (this.ul.descriptionDiv) {
                            // @ts-ignore
                            this.ul.descriptionDiv.remove();
                            // @ts-ignore
                            delete this.ul.descriptionDiv;
                        }
                        clearOptions();
                    });

                    //获得焦点
                    this.input.onfocus = showUl;

                    //按下回车键开始搜索
                    //并且停止冒泡
                    this.input.onkeyup = e => {
                        e.stopPropagation();
                        if (e.key == 'Enter') {
                            //回车
                            this.ul.style.display = 'none';
                            if (this.hoverLi) {
                                this.input.value = this.hoverLi.innerText;
                                delete this.hoverLi;
                                this.input.dispatchEvent(new CustomEvent('changeInput'));
                                this.ul.style.display = 'none';
                                while (this.ul.hasChildNodes()) {
                                    // @ts-ignore
                                    this.ul.removeChild(this.ul.firstChild);
                                }
                            }
                            // @ts-ignore
                            if (this.ul.descriptionDiv) {
                                // @ts-ignore
                                this.ul.descriptionDiv.remove();
                                // @ts-ignore
                                delete this.ul.descriptionDiv;
                            }
                            this.tujianBegin(this.content, this.input.value, true);
                        } else if (e.key == 'ArrowUp') {
                            //上一个
                            if (!this.ul.hasChildNodes()) return;
                            e.preventDefault();
                            if (!this.hoverLi || !this.hoverLi.previousSibling) {
                                this.hoverLi && this.hoverLi.classList.remove('hover');
                                this.hoverLi = this.ul.lastChild;
                                this.hoverLi.classList.add('hover');
                            } else {
                                this.hoverLi.classList.remove('hover');
                                this.hoverLi = this.hoverLi.previousSibling;
                                this.hoverLi.classList.add('hover');
                            }
                            if (this.hoverLi) {
                                this.hoverLi.dispatchEvent(new CustomEvent('mouseover'));
                            }
                            this.input.setSelectionRange(-1, -1);
                        } else if (e.key == 'ArrowDown') {
                            //下一个
                            if (!this.ul.hasChildNodes()) return;
                            e.preventDefault();
                            if (!this.hoverLi || !this.hoverLi.nextSibling) {
                                this.hoverLi && this.hoverLi.classList.remove('hover');
                                this.hoverLi = this.ul.firstChild;
                                this.hoverLi.classList.add('hover');
                            } else {
                                this.hoverLi.classList.remove('hover');
                                this.hoverLi = this.hoverLi.nextSibling;
                                this.hoverLi.classList.add('hover');
                            }
                            if (this.hoverLi) {
                                this.hoverLi.dispatchEvent(new CustomEvent('mouseover'));
                            }
                            this.input.setSelectionRange(-1, -1);
                        } else if (e.key == 'Tab') {
                            if (!this.ul.hasChildNodes()) return;
                            const li = this.hoverLi || this.ul.firstChild;
                            this.input.dispatchEvent(new CustomEvent('changeInput'));
                            this.input.value = li.innerText;
                            if (this.hoverLi) {
                                delete this.hoverLi;
                            }
                            this.ul.style.display = 'none';
                            while (this.ul.hasChildNodes()) {
                                // @ts-ignore
                                this.ul.removeChild(this.ul.firstChild);
                            }
                        } else {
                            // 关于搜索代码的判断
                            const value = this.input.value;
                            const variableKeys = Object.keys(qnssVariable);
                            let key;
                            if (value) {
                                key = variableKeys.find(current => {
                                    return value.startsWith(current + '.') || current.startsWith(value)
                                });
                            }
                            if (!key) {
                                clearOptions();
                                if (this.input.value.length > 0) {
                                    for (const item of this.searchList) {
                                        if (matchChinese(item, this.input.value) && this.input.value !== item) {
                                            this.alwaysShow.add(item);
                                            break;
                                        }
                                    }

                                    // 添加技能id的提示
                                    const skillNames = Object.keys(lib.skill).filter(key => 
                                        typeof lib.skill[key] == 'object' && 
                                        matchChinese(key, this.input.value) && 
                                        this.input.value !== key
                                    );
                                    skillNames.forEach(key => {
                                        this.alwaysShow.add(key);
                                    });
                                }
                                return updateDescription();
                            }
                            if (!qnssVariable.player && !qnssVariable.card) {
                                // @ts-ignore
                                qnssVariable.player = ui.create.player().init('sunce');
                                // @ts-ignore
                                qnssVariable.card = game.createCard('sha');
                            }
                            // 清空ul
                            clearOptions();
                            if (value === key + '.') {
                                // 结果添加到ul
                                addOptions(value, Object.keys(qnssVariable[key]).sort());
                            } else {
                                // 去掉最后一个元素的数组
                                const exceptLast = value.split('.').slice(0, -1);
                                // 只取最后一个 . 之前的字符串
                                const str = exceptLast.join('.');
                                // 结果变量
                                const result = exceptLast.reduce((previous, current) => {
                                    if (previous && previous[current]) {
                                        return previous[current];
                                    }
                                }, qnssVariable);
                                if (result) {
                                    const keys = Object.keys(result);
                                    // 最后一个 . 之后的字符串
                                    const last = value.split('.').slice(-1);
                                    // 结果添加到ul
                                    // @ts-ignore
                                    addOptions(str ? (str + '.') : '', keys.filter(i => i.startsWith(last)).sort());
                                }
                            }
                        }
                    };

                    // 使tab补全而不移动焦点
                    this.input.onkeydown = e => {
                        e.stopPropagation();
                        if (e.code == "Tab") {
                            e.returnValue = false;
                        }
                    };

                    this.content.classList.remove('nobutton');
                    this.content.classList.add('content');
                    this.content.classList.add('fixed');
                    this.content.style.transform = '';
                    this.content.style.opacity = '';
                    this.content.style.height = '';

                    //搜索按钮
                    this.search.addEventListener('click', () => {
                        this.tujianBegin(this.content, this.input.value, true);
                        this.ul.style.display = 'none';
                    });

                    this.close.addEventListener('click', () => this.closeDialog());

                    ui.arena.classList.remove('menupaused');
                    ui.arena.hide();
                    ui.system.hide();
                    ui.menuContainer && ui.menuContainer.hide();
                    ui.window.appendChild(this.manual);

                    /** @type { DocumentFragment[] } */
                    this.fragmentList = [];
                    /** @type { Function[] [] } 无名杀的武将转换为字符串太费劲，不如变成函数 */
                    this.fragmentDataList = [
                        // [fun1, fun2]
                    ];

                    /** @type { HTMLDivElement } */
                    this.page = ui.create.div('.pagination', this.dialog.content);

                    // @ts-ignore
                    const slp = new Pagination({
                        container: '.pagination',
                        onPageChange: state => {
                            this.updatePage(state.pageNumber);
                        }
                    });
                    this.slp = slp;

                    // 定义一个方法用来渲染容器
                    this.updatePage = page => {
                        this.clearDialog(this.dialog);
                        const fragment = this.fragmentList[page - 1];
                        // @ts-ignore
                        if (!fragment.loadDom) {
                            // @ts-ignore
                            fragment.loadDom = true;
                            const data = this.fragmentDataList[page - 1];
                            data.forEach(fun => fun(fragment));
                        }
                        this.dialog.content.appendChild(fragment.cloneNode(true));
                        // @ts-ignore
                        if (slp.state.totalPageCount != this.fragmentList.length) {
                            slp.setTotalPageCount(this.fragmentList.length);
                        }
                    }

                    if (typeof target == 'string') {
                        this.input.value = target;
                        this.search.click();
                    }
                }
                /** 关闭dialog */
                closeDialog() {
                    restore();
                    //不是开发者模式删除全局变量
                    if (!lib.config.dev) {
                        // @ts-ignore
                        delete window.cheat;
                        // @ts-ignore
                        delete window.game;
                        // @ts-ignore
                        delete window.ui;
                        // @ts-ignore
                        delete window.get;
                        // @ts-ignore
                        delete window.ai;
                        // @ts-ignore
                        delete window.lib;
                        // @ts-ignore
                        delete window._status;
                    }
                    this.manual.remove();
                    ui.arena.show();
                    ui.system.show();
                    ui.background.style.backgroundImage = this.Image;
                    ui.arena.classList.add('menupaused');
                    ui.menuContainer.show();
                    if (ui.dialog) ui.dialog.show();
                    _status.全能搜索_Searcher = null;
                    window.onkeydown = this.keydownFun;
                    lib.qnssOnClose.forEach(fun => {
                        fun();
                    });
                }
                /** 清除dialog内容 */
                clearDialog(dialog) {
                    dialog.content.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: 'smooth'
                    });
                    Array.from(dialog.content.childNodes)
                        .filter(v => v != this.page)
                        .forEach(e => dialog.content.removeChild(e));
                }
                
                
                /** 寻找角色 */
findCharacter(result) {
     const deps = {
       lib: lib,
       game: game,
       get: get,
       ui: ui,
       matchChinese: matchChinese,
       html: html 
     };
     return handleFindCharacter(this, result, deps);
   }

                
                
                /** 寻找卡牌 */
                findCard(result) {
                    console.time('findCard');
                    /** 
                    * @type { ({ packName: string, packTranslate: string, cardName: string, cardData: ExCardData, nature?: string })[] }
                    */
                    let name = [];

                    if (['leisha', 'huosha', 'icesha', 'kamisha', 'cisha'].includes(result)) {
                        let nature;
                        switch (result) {
                            case 'leisha':
                                nature = 'thunder';
                                break;
                            case 'huosha':
                                nature = 'fire';
                                break;
                            case 'icesha':
                                nature = 'ice';
                                break;
                            case 'kamisha':
                                nature = 'kami';
                                break;
                            case 'cisha':
                                nature = 'stab';
                        }
                        name.push({
                            packName: 'standard',
                            packTranslate: lib.translate['standard_card_config'],
                            cardName: 'sha',
                            cardData: lib.card['sha'],
                            nature
                        });
                    } else if (['雷杀', '火杀', '冰杀', '神杀', '刺杀'].includes(result)) {
                        let nature;
                        switch (result) {
                            case '雷杀':
                                nature = 'thunder';
                                break;
                            case '火杀':
                                nature = 'fire';
                                break;
                            case '冰杀':
                                nature = 'ice';
                                break;
                            case '神杀':
                                nature = 'kami';
                                break;
                            case '刺杀':
                                nature = 'stab';
                        }
                        name.push({
                            packName: 'standard',
                            packTranslate: lib.translate['standard_card_config'],
                            cardName: 'sha',
                            cardData: lib.card['sha'],
                            nature
                        });
                    } else if (['杀', 'sha'].includes(result)) {
                        [undefined, 'thunder', 'fire', 'ice', 'kami', 'stab'].forEach(nature => {
                            name.push({
                                packName: 'standard',
                                packTranslate: lib.translate['standard_card_config'],
                                cardName: 'sha',
                                cardData: lib.card['sha'],
                                nature
                            });
                        });
                    } else {
                        for (const packName in lib.cardPack) {
                            for (const cardName of lib.cardPack[packName]) {
                                const push = () => {
                                    name.push({
                                        packName,
                                        packTranslate: lib.translate[packName + '_card_config'],
                                        cardName,
                                        cardData: lib.card[cardName]
                                    });
                                };
                                try {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(cardName, "text/html");
                                    if (doc.body.innerText.includes(result)) {
                                        push();
                                        continue;
                                    }
                                } catch (error) {
                                    if (cardName.includes(result)) {
                                        push();
                                        continue;
                                    }
                                }
                                if (typeof lib.translate[cardName] == 'string') {
                                    try {
                                        const parser = new DOMParser();
                                        const doc = parser.parseFromString(lib.translate[cardName], "text/html");
                                        if (doc.body.innerText.includes(result)) {
                                            push();
                                            continue;
                                        }
                                    } catch (error) {
                                        if (lib.translate[cardName].includes(result)) {
                                            push();
                                            continue;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (name.length == 0) {
                        console.timeEnd('findCard');
                        return false;
                    }

                    let lastFragment = document.createDocumentFragment();
                    this.fragmentList.push(lastFragment);
                    this.fragmentDataList.push([]);

                    const qnssCaption = ui.create.div('.caption.qnssCaption');
                    lastFragment.appendChild(qnssCaption);

                    qnssCaption.appendChild(game.全能搜索_createWaveText('卡牌搜索结果'));

                    /*
                    const content = this.dialog.content;

                    qnssCaption.appendChild(ui.create.div(hide ? '.qnssArrowDown' : '.qnssArrowUp').listen(function () {
                        const show = this.classList.contains('qnssArrowDown');

                        this.classList.toggle('qnssArrowUp');
                        this.classList.toggle('qnssArrowDown');

                        const captionList = Array.from(document.querySelectorAll('.caption.qnssCaption')).filter(v => v != this.parentElement);
                        const child = Array.from(content.childNodes);
                        // @ts-ignore
                        const begin = child.indexOf(this.parentElement);
                        const endList = captionList.map(v => child.indexOf(v)).filter(v => v > begin);
                        const end = endList.length == 0 ? child.length : Math.min.apply(null, endList);
                        child.forEach((v, i) => {
                            if (i > begin && i < end) {
                                // @ts-ignore
                                v.style.display = (show ? '' : 'none');
                            }
                        });
                    }));
                    */

                    for (const data of name) {
                        const cardPack = data.packName;
                        const packTranslate = data.packTranslate;
                        const cardName = data.cardName;
                        const cardData = data.cardData;
                        const nature = data.nature;
                        /** 获取图片地址 */
                        const getImageUrl = ($0) => {
                            if (!($0 instanceof HTMLElement)) return null;
                            // 也获取十周年UI的
                            const backgroundImage = $0.style.backgroundImage.length > 0 ? 
                                $0.style.backgroundImage :
                                $0.firstElementChild.style.backgroundImage;
                            return backgroundImage.split(',').map(v => {
                                if (v.includes('url')) {
                                    const urlMatch = v.match(/url\((['"])(.*?)\1\)/);
                                    if (urlMatch && urlMatch.length === 3) {
                                        return urlMatch[2]; // 返回 URL 地址
                                    }
                                }
                                return null;
                            }).filter(v => {
                                return typeof v == "string";
                            })[0];
                        };

                        /*
                        this.dialog.addSmall([
                            [{
                                name: data.cardName,
                                nature: data.nature
                            }], 'vcard'
                        ]);
                        */

                        this.fragmentDataList[this.fragmentList.length - 1].push((lastFragment) => {
                            const buttons = ui.create.div('.buttons');
                            buttons.classList.add('smallzoom');
                            this.dialog.buttons = this.dialog.buttons.concat(ui.create.buttons([{
                                name: data.cardName,
                                nature: data.nature
                            }], 'vcard', buttons, false));

                            lastFragment.appendChild(buttons);

                            const caption = ui.create.div('.caption');

                            const d = ui.create.div(ui.create.div(ui.create.div('.text.center', caption)), {
                                display: 'block',
                                left: 'auto',
                                textAlign: 'left',
                                fontSize: '20px'
                            });

                            d.insertAdjacentHTML('afterbegin', html`
                                </br>
                                <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling.nextElementSibling)">卡牌名称</span>
                                <span>${lib.translate[cardName]}</span>
                                <font color=6df95b>[ </font>
                                <font color=6df95b>${cardName}</font>
                                <font color=6df95b> ]</font>
                                </br>

                                <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling.nextElementSibling)">卡牌类别</span>
                                <span>${cardData.type ? lib.translate[cardData.type] : '无'}</span>
                                <font color=6df95b>[ </font>
                                <font color=6df95b>${cardData.type ? lib.translate[cardData.type] : '无'}</font>
                                <font color=6df95b> ]</font>
                                </br>
                                
                                <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextSibling)">卡牌效果</span>${nature ? lib.card.sha.cardPrompt({ name: 'sha', nature }) : lib.translate[cardName + '_info']}
                                </br>
                                
                                <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling)">所在卡牌包</span>${packTranslate || '无'}
                                <font color=6df95b>[ </font>
                                <font color=6df95b>${cardPack || '无'}</font>
                                <font color=6df95b> ]</font>
                                </br>

                                <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling)">图片地址&nbsp</span><span>${getImageUrl(buttons.firstElementChild)}</span>
                                </br>

                                ${cardData.derivation ? (
                                    '<span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling)">卡牌来源</span>' + lib.translate[cardData.derivation] +
                                    '<font color="6df95b">[ </font>' +
                                    '<font color="6df95b">' + cardData.derivation + '</font>' +
                                    '<font color="6df95b"> ]</font>' +
                                    '</br>'
                                ) : ''
                                }

                                <span class="bluetext">卡牌语音（男）</span>
                                <img src='${layoutPath}img/qhly_pic_playaudiobutton.png' alt='卡牌语音（男）' onclick="window.qnssPlayCardAudio('male', '${cardName}', '${nature}');" style='position: absolute; width: 100px; margin: 0; padding: 0;' />
                                </br>

                                <span class="bluetext">卡牌语音（女）</span>：
                                <img src='${layoutPath}img/qhly_pic_playaudiobutton.png' alt='卡牌语音（女）' onclick="window.qnssPlayCardAudio('female', '${cardName}', '${nature}');" style='position: absolute; width: 100px; margin: 0; padding: 0;' />
                                </br>

                                <span class="bluetext">卡牌代码</span>
                                <span style="color: white;" onclick='window.qnssShowCode.call(this, "${lib.translate[cardName]}")'>点击查看${lib.translate[cardName]}代码</span>
                                
                                <span style="display: none;">
                                    </br>
                                    <font color="21ffd8">[ ${lib.translate[cardName]} ] </font>卡牌代码：</br>
                                    <pre class="hljs language-javascript" style="user-select:text;-webkit-user-select:text;">${game.全能搜索_highlight(get.stringify(cardData))}</pre>
                                </span>
                                
                                </br></br></br>
                            `);

                            lastFragment.appendChild(caption);
                        });

                        if (this.fragmentDataList[this.fragmentList.length - 1].length > 9) {
                            lastFragment = document.createDocumentFragment();
                            this.fragmentList.push(lastFragment);
                            this.fragmentDataList.push([]);
                        }
                    }

                    console.timeEnd('findCard');
                }
                
                
                /** 寻找技能 */
findSkill(result) {
     const deps = {
       lib: lib,
       game: game,
       get: get,
       ui: ui,
       matchChinese: matchChinese, 
       html: html,                  
       windowRef: window,           
       qnssSee: window.qnssSee      
     };
     return handleFindSkill(this, result, deps);
   }
   
             /** 寻找代码 */
findCode(result) {
     const deps = {
       lib: lib,
       game: game,
       get: get,
       ui: ui,
       qnssVariable: qnssVariable, 
       description: description,  
       matchChinese: matchChinese, 
       html: html                  
     };
     return handleFindCode(this, result, deps);
   };
            
                /** 将内容加入到下拉框 */
                addToDataList(data) {
                    if (this.searchList.add(data) !== false) {
                        game.saveExtensionConfig('全能搜索', 'searchList', this.searchList);
                    }
                    if (this.tsymqSearchList.add(data) !== false) {
                        game.saveExtensionConfig('全能搜索', 'tsymqSearchList', [...new Set(this.tsymqSearchList)]);
                    }
                    //输入框失去焦点
                    this.input.blur();
                }
                /** 清除历史搜索内容 */
                clearDataList() {
                    this.searchList = [];
                    this.clearOptions();
                    game.saveExtensionConfig('全能搜索', 'searchList', this.searchList);
                    game.alert("搜索历史已清空");
                }
                
            
            
            /** 显示代码帮助对话框 */
showCodeHelpDialog() {
     const globalObj = {
         lib: lib,
         game: game,
         ui: ui,
         _status: _status,
         get: get
     };
     showCodeHelpDialog(this, layoutPath, globalObj);
 }




// 分离普通搜索和代码帮助的findSkill实现
findSkill(result) {
    console.time('findSkill');
    
    if (_status.当前搜索关键词 && _status.当前搜索关键词.length) {
        this.codeHelpFindSkill(result);
        return;
    }
    
    // 普通搜索逻辑（完整保留技能拥有者和台词）
    /** @type { { skillName: string, translate: string, info: string }[] }  */
    let skills = [];
    for (let skillName in lib.skill) {
        if (['global', 'globalmap', 'storage'].includes(skillName) || typeof lib.skill[skillName] != 'object') continue;
    
        // 中文包含的，或者英文id对应的
        // 考虑html标签
        if (typeof lib.translate[skillName] == 'string') {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(lib.translate[skillName], "text/html");
                if (doc.body.innerText.includes(result) || skillName === result) {
                    skills.push({
                        skillName,
                        translate: lib.translate[skillName],
                        info: lib.translate[skillName + '_info'] || '无',
                    });
                }
            } catch (error) {
                if (lib.translate[skillName].includes(result) || skillName === result) {
                    skills.push({
                        skillName,
                        translate: lib.translate[skillName],
                        info: lib.translate[skillName + '_info'] || '无',
                    });
                }
            }
        }
    }
    
    // 按描述搜索
    const indexs = [];
    const translateSearcher = result.split(/\s+/);
    if (translateSearcher.length > 0) {
        let translates = Object.keys(lib.translate).filter(v => typeof lib.translate[v] == 'string' && v.endsWith('_info') && lib.skill[v.slice(0, -5)]).map(v => ({ name: v, translate: lib.translate[v] }));
        translates = translates.filter(v => translateSearcher.every(s => {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(v.translate, "text/html");
                return doc.body.innerText.includes(s);
            } catch (error) {
                return v.translate.includes(s);
            }
        }));
        translates.forEach(v => {
            let index = -1;
            let translate = v.translate;
            for (const str of translateSearcher) {
                translate = translate.slice(index == -1 ? 0 : index);
                const index2 = translate.indexOf(str);
                if (index2 != -1) {
                    index += index2;
                }
                else return;
            }
            indexs.push(skills.push({
                skillName: v.name.slice(0, -5),
                translate: lib.translate[v.name.slice(0, -5)],
                info: v.translate,
            }) - 1);
        });
    }
    
    if (skills.length == 0) {
        console.timeEnd('findSkill');
        return false;
    }
    
    let lastFragment = document.createDocumentFragment();
    this.fragmentList.push(lastFragment);
    this.fragmentDataList.push([]);
    const qnssCaption = ui.create.div('.caption.qnssCaption');
    lastFragment.appendChild(qnssCaption);
    qnssCaption.appendChild(game.全能搜索_createWaveText('技能搜索结果'));
    
    for (let i = 0; i < skills.length; i++) {
        const skill = skills[i];
        const skillName = skill.skillName;
        const translate = skill.translate;
        let info = skill.info;
        
        // 关键字高亮
        if (indexs.includes(i)) {
            let index = -1;
            let translate = info;
            for (const str of translateSearcher) {
                translate = info.slice(index == -1 ? 0 : index);
                const index2 = translate.indexOf(str);
                if (index2 != -1) {
                    const insert = `<span style="color: red;">${str}</span>`;
                    const addIndex = index2 + (index == -1 ? 0 : index);
                    info = info.slice(0, addIndex) + insert + info.slice(addIndex + str.length);
                    index += index2 + insert.length;
                }
                else break;
            }
        }
        
        // 技能拥有者收集（完整保留）
        let name = [];
        for (const packName in lib.characterPack) {
            for (const characterName in lib.characterPack[packName]) {
                if (typeof lib.translate[characterName] !== 'string') continue;
                const characterData = lib.characterPack[packName][characterName];
                
                const skillField = characterData?.[3] || [];
                const skills = Array.isArray(skillField) ? skillField : [skillField];
                if (skills.includes(skillName)) {
                    name.push(characterName);
                }
            }
        }
        
        this.fragmentDataList[this.fragmentList.length - 1].push((lastFragment) => {
            const caption = ui.create.div('.caption');
            const d = ui.create.div(ui.create.div(ui.create.div('.text.center', caption)), {
                display: 'block',
                left: 'auto',
                textAlign: 'left',
                fontSize: '20px'
            });
            
            // 技能台词生成（完整保留）
            let skillText = game.全能搜索_createSkillText(skillName, name[0]);
            
            d.insertAdjacentHTML('afterbegin', html`
                <li>
                    <!-- 技能中文名 -->
                    <font color="21ffd8">[ ${translate} ]</font>
                    <!-- 技能id -->
                    <font color=6df95b>[ ${skillName} ]</font></br>
                    <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling)">技能描述</span>：<span>${info.replace(/<\/li>/g, '').split('<li>').map((v, i) => i == 0 ? v : ('•' + v)).join('<br/>')}</span></br>
                    ${typeof lib.translate[skill + '_append'] == 'string' ? (lib.translate[skill + '_append'] + '</br>') : ''}
                    ${skillText}
                    <span class="bluetext">技能拥有者</span>：<div id="replaceCharacters"></div></br>
                    <span class="bluetext">技能代码</span>：
                    <a onclick='window.qnssShowCode.call(this)'>点击查看技能代码</a>
                </li>
                <li style="display: none; list-style-type: none;">
                    <font color="21ffd8">[ ${translate} ]</font> 技能代码：<br/>
                    <button 
                        data-skill-name="${translate}" 
                        data-raw-code="${encodeURIComponent(get.stringify(lib.skill[skillName]))}" 
                        onclick="
                            const rawCode = decodeURIComponent(this.dataset.rawCode); 
                            game.全能搜索_copy(rawCode); 
                            window.showCopySuccess(this.dataset.skillName);
                        " 
                        style="margin-bottom:10px; padding:5px 10px; cursor:pointer; display: inline-block;"
                    >
                        复制代码
                    </button>
                    <pre class="hljs language-javascript" style="user-select:text;-webkit-user-select:text;">
                        ${game.全能搜索_highlight(get.stringify(lib.skill[skillName]))}
                    </pre>
                </li>
                </br></br></br>
            `);
            
            const replaceCharacters = d.querySelector("#replaceCharacters");
            if (replaceCharacters) {
                if (name.length > 0) {
                    name.map(name => {
                        const a = document.createElement('a');
                        a.classList.add('qnssSee');
                        a.style.color = 'white';
                        a.setAttribute('onclick', 'window.qnssSee(this)');
                        a.innerText = lib.translate[name];
                        return a;
                    }).forEach(a => {
                        replaceCharacters.insertAdjacentElement('afterend', a);
                        replaceCharacters.insertAdjacentHTML('afterend', '&nbsp&nbsp');
                    });
                } else {
                    const span = document.createElement('span');
                    span.innerText = '无';
                    replaceCharacters.insertAdjacentElement('afterend', span);
                }
                replaceCharacters.remove();
            }
            
            lastFragment.appendChild(caption);
        });
        
        if (this.fragmentDataList[this.fragmentList.length - 1].length > 9) {
            lastFragment = document.createDocumentFragment();
            this.fragmentList.push(lastFragment);
            this.fragmentDataList.push([]);
        }
    }
    
    console.timeEnd('findSkill');
}

// 代码帮助单独的实现
codeHelpFindSkill(result) {
     const globalObj = {
         lib: lib,
         game: game,
         _status: _status,
         get: get,
         ui: ui 
     };
     daibangCodeHelpFindSkill(this, globalObj, result);
 }
           
/** 显示技能教程 */
showSkillTutorial() {
renderSkillTutorial(this, {
ui: ui,
game: game,
get: get,
_status: _status
});
}


            
            

                /**
                 * 展示
                 * @param { Library.element.Dialog } dialog 
                 * @param { string } result 
                 * @param { boolean } [canAddToDataList] 
                 * @param { boolean } [notCheckKey] 
                 * @returns 
                 */
                // 增加第5个参数 isCodeHelp，用于区分是否为代码帮助搜索
tujianBegin(dialog, result, canAddToDataList, notCheckKey, isCodeHelp = false) {
    // 仅在「非代码帮助搜索」时清空关键词，保留代码帮助的分类关键词
    if (!isCodeHelp) { 
        _status.当前搜索关键词 = null;
    }
    
    // 主要函数放在window里
    lib.cheat.i();
    this.clearDialog(dialog);
    this.fragmentList = [];
    this.fragmentDataList = [];
    if (result === "" || result === null || result === undefined) return game.alert("请输入名称");
    game.saveExtensionConfig('全能搜索', 'searchList', this.searchList);
    this.dialog.buttons = [];
    console.log('------------------------');
    
    // 若选中搜索类型且不是“无”，则自动添加前缀
    if (this.selectedSkillType && this.selectedSkillType !== '无') {
        result = `${this.selectedSkillType} ${result}`;
    }
    console.log('搜索内容: ' + result);
    const containsKey = key => notCheckKey || this.searcherModule.includes(key);
    let resultCharacter = containsKey('findCharacter') ? this.findCharacter(result) : false;
    let resultCard = containsKey('findCard') ? this.findCard(result) : false;
    let resultSKill = containsKey('findSkill') ? this.findSkill(result) : false;
    let resultCode = containsKey('findCode') ? this.findCode(result) : false;
    if ([resultCharacter, resultCard, resultSKill, resultCode].every(v => v == false)) {
        this.input.blur();
        this.input.classList.add('qnssWrong');
        game.alert(`没有符合条件的武将，卡牌，技能或代码!(搜索内容："${result}")`);
        this.clearDialog(dialog);
        return;
    }
    // 只搜索到代码的，不加入搜索历史
    if (![resultCharacter, resultCard, resultSKill].every(v => v === false)) {
        // 搜索的字大于1 或 搜索内容不包括技能且单字为汉字
        if (result.length > 1 || (resultSKill === false && /[\u4e00-\u9fa5]+/.test(result))) {
            canAddToDataList && this.addToDataList(result);
        }
    }
    // 添加技能id的搜索提示后，this.alwaysShow的元素就过多了
    this.alwaysShow = this.searchList.slice(0).sort();
    // console.log(this.fragmentList);
    if (this.fragmentList.length) {
        this.updatePage(1);
    }
}
            }

            window.诗笺_manual = {
                show(target) {
                    if (!loadModeReady) {
                        game.alert('其他模式的数据未加载完成，请稍后再进行搜索');
                        return;
                    }
                    lib.qnssOnCreate.forEach(fun => {
                        fun();
                    });
                    if (!_status.全能搜索_Searcher) {
                        _status.全能搜索_Searcher = new Searcher(target);
                    } else if (_status.全能搜索_Searcher.constructor === Searcher) {
                        // @ts-ignore
                        _status.全能搜索_Searcher.tujianBegin(_status.全能搜索_Searcher.content, target);
                    } else {
                        delete _status.全能搜索_Searcher;
                        _status.全能搜索_Searcher = new Searcher(target);
                    }
                }
            };

            if (!Array.isArray(lib.qnssOnCreate)) lib.qnssOnCreate = [];
            if (!Array.isArray(lib.qnssOnClose)) lib.qnssOnClose = [];

            const getSystem = setInterval(() => {
                if (ui.system1 || ui.system2) {
                    // @ts-ignore
                    clearInterval(getSystem);
                    ui.Searcher = ui.create.system('全能搜索', function () {
                        if (!loadModeReady) {
                            game.alert('其他模式的数据未加载完成，请稍后再进行搜索');
                        }
                        else {
                            window.诗笺_manual.show();
                        }
                    });
                }
            }, 500);
        },
        precontent() {},
        help: {},
        config: {
            version: {
                nopointer: true,
                clear: true,
                name: "扩展版本: v4.5<br>更新日期: 2025-09-16",
            },
            css: {
                clear: true,
                'name': '更换代码高亮样式',
                'init': 'vs2015.min.css',
                'item': {
                    'a11y-dark.min.css': 'a11y-dark',
                    'an-old-hope.min.css': 'an-old-hope',
                    'atom-one-dark.min.css': 'atom-one-dark',
                    'felipec.min.css': 'felipec',
                    'gml.min.css': 'gml',
                    'vs2015.min.css': 'vs2015'
                },
                onclick(item) {
                    game.saveExtensionConfig('全能搜索', 'css', item);
                    ui.qnssChangeEditorCss(item)
                }
            },
            background: {
                'name': '搜索界面背景图片',
                'init': '相爱相杀.png',
                'item': {
                    '相爱相杀.png': '相爱相杀.png',
                    'picture.png': 'picture.png',
                    '随机': '随机',
                    'none': '本体默认背景'
                },
                onclick(item) {
                    game.saveExtensionConfig('全能搜索', 'backgroundImage', item);
                }
            },
            "loadUpdateContent": {
                clear: true,
                name: '<span style="text-decoration: underline;">点击显示本扩展更新内容<span>',
                intro: '本扩展历史更新内容',
                onclick: function () {
                    if (_status.qnssUpdateContent) return false;
                    _status.qnssUpdateContent = true;

                    let oReq = new XMLHttpRequest();

                    oReq.addEventListener("load", function () {
                        let layer = ui.create.div(ui.window, '.updateContent');
                        let close = ui.create.div(layer, '.updateContentClose', () => {
                            delete _status.qnssUpdateContent;
                            layer.remove();
                        });
                        let content = ui.create.div(layer, {
                            width: '100%',
                            height: '100%',
                            innerHTML: this.responseText,
                        });
                    });

                    oReq.addEventListener("error", err => {
                        delete _status.qnssUpdateContent;
                        console.error("获取历史更新内容失败", err);
                        alert("获取历史更新内容失败");
                    });

                    oReq.open("GET", lib.assetURL + 'extension/全能搜索/updateContent');
                    oReq.send();
                },
            },
            "Searcher": {
                "name": "<span style='text-decoration: underline;'>点击此处进行搜索</span>",
                "clear": true,
                onclick: function () {
                    if (window.诗笺_manual) {
                        window.诗笺_manual.show();
                    } else {
                        alert('请开启此扩展');
                    }
                },
            }
        },
        package: {
    intro: '【武将卡牌搜索器】的重命名版本。',
    author: `
        <span class='bluetext' style='color: #ff3333; text-shadow: 0 0 6px rgba(255, 51, 51, 0.6);'>原作者：诗笺</span><br>
        <span class='bluetext'>二创：一寒</span><br>  <!-- 与原作者左对齐，无缩进 -->
        <span class='bluetext' style='margin-left: 2em;'>bug反馈联系方式</span><br>
        <span class='bluetext' style='margin-left: 2em;'>2119694965</span><br>
        <span class='bluetext' style='color: #ffd700; text-shadow: 0 0 4px rgba(255, 215, 0, 0.8);'>【本扩展完全免费，收费的都是大猪蹄子切勿相信私聊】</span>  <!-- 左起无缩进 -->
    `.replace(/\s+/g, ' ').trim(),
    version: "4.4",
}

    }
};

//致敬诗笺大佬，由新人“一寒”冒昧修改一些部分
//后续若大佬同意，我可以站着大佬肩上继续优化！
//由诗笺大佬同意二创后进行二创，求喷子先看完，再喷。。。