/**
 * @description 技能搜索逻辑模块（从 extension.js 迁移）
 * @param { Searcher } searcher - Searcher 类实例（原 this 上下文）
 * @param { string } result - 搜索关键词
 * @param { { 
 *   lib: any, game: any, get: any, ui: any, 
 *   matchChinese: Function, html: Function,
 *   windowRef: Window, // 全局window引用（用于缓存变量）
 *   qnssSee: Function  // 全局跳转搜索函数
 * } } deps - 依赖对象（全局变量+辅助函数+全局方法）
 */
export default function handleFindSkill(searcher, result, deps) {
  const { lib, game, get, ui, matchChinese, html, windowRef, qnssSee } = deps;
  console.time('findSkill');

  // 1. 提前构建技能描述索引（仅初始化一次，减少重复遍历）
  if (!windowRef.skillDescriptionIndex) {
    windowRef.skillDescriptionIndex = new Map(); // 格式：Map<技能名, { translate: 技能名翻译, info: 技能描述 }>
    for (const skillName in lib.skill) {
      if (['global', 'globalmap', 'storage'].includes(skillName) || typeof lib.skill[skillName] !== 'object') continue;
      const skillTrans = lib.translate[skillName] || '';
      const skillInfo = lib.translate[skillName + '_info'] || '';
      windowRef.skillDescriptionIndex.set(skillName, { translate: skillTrans, info: skillInfo });
    }
  }

  /** @type { { skillName: string, translate: string, info: string }[] }  */
  let skills = [];
  const translateSearcher = result.split(/\s+/).filter(k => k); // 过滤空关键词

  // 2. 按技能名/ID搜索（从索引查询，避免遍历lib.translate）
  for (const [skillName, { translate, info }] of windowRef.skillDescriptionIndex) {
    if (!translate) continue;
    // 匹配规则：技能名包含/技能ID完全匹配
    const isNameMatch = matchChinese(translate, result) || skillName === result;
    if (isNameMatch) {
      skills.push({ skillName, translate, info });
    }
  }

  // 3. 按技能描述搜索（从索引过滤，减少遍历）
  if (translateSearcher.length > 0) {
    const matchedByInfo = [];
    for (const [skillName, { translate, info }] of windowRef.skillDescriptionIndex) {
      if (!info || skills.some(item => item.skillName === skillName)) continue; // 跳过已匹配的技能
      // 多关键词全匹配（优化HTML解析：仅一次解析）
      let pureInfo = '';
      try {
        pureInfo = new DOMParser().parseFromString(info, "text/html").body.innerText;
      } catch {
        pureInfo = info.replace(/<[^>]+>/g, '').trim();
      }
      const isInfoMatch = translateSearcher.every(keyword => pureInfo.includes(keyword));
      if (isInfoMatch) {
        matchedByInfo.push({ skillName, translate, info });
      }
    }

    // 4. 关键词高亮（批量处理，减少循环嵌套）
    const indexs = [];
    matchedByInfo.forEach(item => {
      let info = item.info;
      // 批量替换关键词为高亮标签
      translateSearcher.forEach(keyword => {
        if (!keyword) return;
        // 避免重复高亮（区分HTML标签内外部）
        const regex = new RegExp(`(?![^<]*>)${keyword}`, 'g');
        info = info.replace(regex, `<span style="color: red;">${keyword}</span>`);
      });
      // 加入结果列表并记录高亮索引
      indexs.push(skills.push({ ...item, info }) - 1);
    });
  }

  if (skills.length === 0) {
    console.timeEnd('findSkill');
    return false;
  }

  // 5. 缓存技能拥有者查询结果（减少重复遍历武将包）
  const getSkillOwners = (skillName) => {
    // 初始化全局缓存（挂载在windowRef上，与findCharacter复用）
    if (!windowRef.skillOwnerCache) windowRef.skillOwnerCache = new Map();
    if (windowRef.skillOwnerCache.has(skillName)) return windowRef.skillOwnerCache.get(skillName);
    
    const owners = [];
    // 复用findCharacter创建的有效武将包缓存（避免重复过滤）
    const validPacks = windowRef.validCharacterPacks || (() => {
      const packs = {};
      for (const packName in lib.characterPack) {
        const packData = lib.characterPack[packName];
        if (packData && Object.keys(packData).length > 0) packs[packName] = packData;
      }
      windowRef.validCharacterPacks = packs;
      return packs;
    })();

    for (const packData of Object.values(validPacks)) {
      for (const [charName, charData] of Object.entries(packData)) {
        if (typeof lib.translate[charName] !== 'string') continue;
        const skills = Array.isArray(charData[3]) ? charData[3] : [charData[3]];
        if (skills.includes(skillName)) {
          owners.push(charName);
        }
      }
    }
    windowRef.skillOwnerCache.set(skillName, owners);
    return owners;
  };

  // 6. 合并DOM渲染准备（批量生成HTML片段）
  let lastFragment = document.createDocumentFragment();
  searcher.fragmentList.push(lastFragment);
  searcher.fragmentDataList.push([]);
  const qnssCaption = ui.create.div('.caption.qnssCaption');
  lastFragment.appendChild(qnssCaption);
  qnssCaption.appendChild(game.全能搜索_createSkillText('技能搜索结果', '')); // 复用全局技能文本生成方法

  for (let i = 0; i < skills.length; i++) {
    const { skillName, translate, info } = skills[i];
    const owners = getSkillOwners(skillName); // 从缓存获取技能拥有者
    const skillText = game.全能搜索_createSkillText(skillName, owners[0] || ''); // 兼容无拥有者场景
    const appendHtml = typeof lib.translate[skillName + '_append'] === 'string' ? `${lib.translate[skillName + '_append']}</br>` : '';
    const skillCode = get.stringify(lib.skill[skillName]);

    // 7. 批量生成技能HTML（减少字符串拼接）
    searcher.fragmentDataList[searcher.fragmentList.length - 1].push((fragment) => {
      const caption = ui.create.div('.caption');
      const d = ui.create.div(ui.create.div(ui.create.div('.text.center', caption)), {
        display: 'block',
        left: 'auto',
        textAlign: 'left',
        fontSize: '20px'
      });

      // 一次性插入所有HTML（减少DOM操作）
      d.insertAdjacentHTML('afterbegin', html`
          <li>
              <!-- 技能中文名与ID -->
              <font color="21ffd8">[ ${translate} ]</font>
              <font color=6df95b>[ ${skillName} ]</font></br>
              <!-- 技能描述（含高亮） -->
              <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling)">技能描述</span>：
              <span>${info.replace(/<\/li>/g, '').split('<li>').map((v, i) => i === 0 ? v : (`•${v}`)).join('<br/>')}</span></br>
              ${appendHtml}
              <!-- 技能台词 -->
              ${skillText}
              <!-- 技能拥有者 -->
              <span class="bluetext">技能拥有者</span>：<div id="replaceCharacters"></div></br>
              <!-- 技能代码 -->
              <span class="bluetext">技能代码</span>：
              <a onclick='window.qnssShowCode.call(this)'>点击查看技能代码</a>
          </li>
          <li style="display: none; list-style-type: none;">
              <font color="21ffd8">[ ${translate} ]</font> 技能代码：<br/>
              <!-- 复制按钮 -->
              <button 
                  data-skill-name="${translate}" 
                  data-raw-code="${encodeURIComponent(skillCode)}" 
                  onclick="
                      const rawCode = decodeURIComponent(this.dataset.rawCode); 
                      game.全能搜索_copy(rawCode); 
                      window.showCopySuccess(this.dataset.skillName);
                  " 
                  style="margin-bottom:10px; padding:5px 10px; cursor:pointer; display: inline-block;"
              >
                  复制代码
              </button>
              <!-- 代码高亮 -->
              <pre class="hljs language-javascript" style="user-select:text;-webkit-user-select:text;">
                  ${game.全能搜索_highlight(skillCode)}
              </pre>
          </li>
          </br></br></br>
      `);

      // 处理技能拥有者链接（批量创建，复用全局qnssSee方法）
      const replaceCharacters = d.querySelector("#replaceCharacters");
      if (replaceCharacters) {
        if (owners.length > 0) {
          owners.forEach(charName => {
            const a = document.createElement('a');
            a.classList.add('qnssSee');
            a.style.color = 'white';
            a.setAttribute('onclick', 'window.qnssSee(this)');
            a.innerText = lib.translate[charName] || charName;
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

      fragment.appendChild(caption);
    });

    // 分页逻辑（保留原规则：每9条分一页）
    if (searcher.fragmentDataList[searcher.fragmentList.length - 1].length > 9) {
      lastFragment = document.createDocumentFragment();
      searcher.fragmentList.push(lastFragment);
      searcher.fragmentDataList.push([]);
    }
  }

  console.timeEnd('findSkill');
}
