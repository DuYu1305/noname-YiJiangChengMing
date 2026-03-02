export default function handleFindCharacter(searcher, result, deps) {
  const { lib, game, get, ui, matchChinese, html } = deps;
  console.time('findCharacter');
  const validPacks = {};
  for (const packName in lib.characterPack) {
    const packData = lib.characterPack[packName];
    if (!packData || Object.keys(packData).length === 0) continue;
    validPacks[packName] = packData;
  }
  let name = [];
  for (const packName in validPacks) {
    const packData = validPacks[packName];
    for (const characterName in packData) {
      if (typeof lib.translate[characterName] !== 'string') continue;
      const characterData = packData[characterName];
      const charNameCN = lib.translate[characterName];
      const charIntro = get.characterIntro(charNameCN) || '';
      const isMatch = matchChinese(charNameCN, result) || 
                    matchChinese(charIntro, result) ||
                    characterName.endsWith(result);
      if (isMatch) {
        name.push({
          packName,
          packTranslate: lib.translate[packName + '_character_config'] || '未知包',
          characterName,
          characterData
        });
      }
    }
  }
  (function () {
    if (!name.length) {
      const reg = /武将(\d+)-(\d+)/g;
      const match = reg.exec(result);
      if (!match) return;
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      const maxLength = Object.keys(lib.character).length;
      if (start <= end && start > 0) {
        let list = Object.keys(lib.character).slice(start - 1, Math.min(end, maxLength));
        for (let j of list) {
          let packName = Object.keys(validPacks).find(pack => j in validPacks[pack]);
          if (!packName) continue;
          name.push({
            characterName: j,
            packName: packName,
            characterData: lib.character[j],
            packTranslate: lib.translate[packName + '_character_config'] || '未知包'
          });
        }
        game.alert(`共有${maxLength}个武将，第${start}个到第${end}个`);
      }
    }
  })();
  if (name.length === 0) {
    console.timeEnd('findCharacter');
    return false;
  }
  const derivationCache = new Map();
  const getCachedDerivation = (skill) => {
    if (derivationCache.has(skill)) return derivationCache.get(skill);
    let derivation;
    try {
      derivation = get.qnssAllDerivation(skill) || [];
    } catch {
      derivation = lib.skill[skill]?.derivation || [];
      if (!Array.isArray(derivation)) derivation = [derivation];
    }
    derivationCache.set(skill, derivation.filter(Boolean));
    return derivationCache.get(skill);
  };
  let lastFragment = document.createDocumentFragment();
  searcher.fragmentList.push(lastFragment);
  searcher.fragmentDataList.push([]);
  const qnssCaption = ui.create.div('.caption.qnssCaption');
  lastFragment.appendChild(qnssCaption);
  qnssCaption.appendChild(game.全能搜索_createWaveText('武将搜索结果'));
  const getImageUrl = ($0) => {
    if (!($0 instanceof HTMLElement)) return '未知地址';
    return $0.style.backgroundImage.split(',').map(v => {
      if (v.includes('url')) {
        const urlMatch = v.match(/url\((['"])(.*?)\1\)/);
        return urlMatch?.[2] || null;
      }
      return null;
    }).filter(v => 
      typeof v === "string" && 
      !v.includes(`image/character/default_silhouette_male.jpg`) && 
      !v.includes(`image/character/default_silhouette_female.jpg`)
    )[0] || '未知地址';
  };
  for (const data of name) {
    const { characterData: character, characterName: charName, packName, packTranslate } = data;
    const skills = Array.isArray(character[3]) ? character[3] : [];
    let skillstr = '';
    let skillDerivation = [];
    const skillHtmls = [];
    for (const skill of skills) {
      if (!lib.skill[skill] || !lib.translate[skill]) continue;
      const derivation = getCachedDerivation(skill);
      if (derivation.length > 0) skillDerivation.push(...derivation);
      const skillText = game.全能搜索_createSkillText(skill, charName);
      const skillInfo = (lib.translate[skill + '_info'] || '无技能描述')
        .replace(/<\/li>/g, '')
        .split('<li>')
        .map((v, i) => i === 0 ? v : (`•${v}`))
        .join('<br/>');
      const appendHtml = typeof lib.translate[skill + '_append'] === 'string' 
        ? `${lib.translate[skill + '_append']}</br>` 
        : '';
      const skillCode = get.stringify(lib.skill[skill]);
      skillHtmls.push(html`<li>
        <font color="21ffd8" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling)">[ ${lib.translate[skill]} ]</font>
        <font color=6df95b>[${skill}]</font>
        </br>
        <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextSibling)">技能描述&nbsp</span><span>${skillInfo}</span>
        </br>
        ${appendHtml}
        ${skillText}
        <span class="bluetext">技能代码&nbsp</span>
        <a onclick='window.qnssShowCode.call(this, "技能")'>点击查看技能代码</a>
        <div class="skillCodeContainer" style="display: none; margin-top: 10px;">
            <button 
                data-skill-name="${lib.translate[skill]}" 
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
            <font color="21ffd8">[ ${lib.translate[skill]} ]</font> 技能代码：<br/>
            <pre class="hljs language-javascript" style="user-select:text;-webkit-user-select:text;">
                ${game.全能搜索_highlight(skillCode)}
            </pre>
        </div>
      </li>`);
    }
    skillstr = skillHtmls.join('');
    let skillDerivationstr = '';
    if (skillDerivation.length > 0) {
      const derivationHtmls = [];
      for (const derivation of [...new Set(skillDerivation)]) {
        if (!lib.skill[derivation] || !lib.translate[derivation]) continue;
        const skillText = game.全能搜索_createSkillText(derivation, charName);
        const skillInfo = (lib.translate[derivation + '_info'] || '无')
          .replace(/<\/li>/g, '')
          .split('<li>')
          .map((v, i) => i === 0 ? v : (`•${v}`))
          .join('<br/>');
        const appendHtml = typeof lib.translate[derivation + '_append'] === 'string' 
          ? `${lib.translate[derivation + '_append']}</br>` 
          : '';
        const skillCode = get.stringify(lib.skill[derivation]);
        derivationHtmls.push(html`<li>
          <font color="21ffd8" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling)">[ ${lib.translate[derivation]} ]</font>
          <font color=6df95b>[${derivation}]</font></br>
          <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextSibling)">技能描述&nbsp</span><span>${skillInfo}</span></br>
          ${appendHtml}
          ${skillText}
          <span class="bluetext">技能代码&nbsp</span>
          <a onclick='window.qnssShowCode.call(this)'>点击查看技能代码</a>
        </li>
        <li style="display: none; list-style-type: none;">
          <font color="21ffd8">[ ${lib.translate[derivation]} ] </font>技能代码：</br>
          <pre class="hljs language-javascript" style="user-select:text;-webkit-user-select:text;">${game.全能搜索_highlight(skillCode)}</pre>
        </li>`);
      }
      skillDerivationstr = derivationHtmls.join('');
    } else {
      skillDerivationstr = '无';
    }
    searcher.fragmentDataList[searcher.fragmentList.length - 1].push((fragment) => {
      const buttons = ui.create.div('.buttons');
      buttons.classList.add('smallzoom');
      searcher.dialog.buttons = searcher.dialog.buttons.concat(
        ui.create.buttons([charName], 'character', buttons, false)
      );
      const charButtons = buttons.querySelectorAll('.button.character');
      charButtons.forEach(btn => {
        btn.style.width = '200px';    
        btn.style.height = '260px';   
        btn.style.margin = '20px';     
        btn.classList.add('hero-card-border'); 
        const originalBgImage = btn.style.backgroundImage;
        btn.style.backgroundImage = `${getComputedStyle(document.documentElement).getPropertyValue('--hero-card-gradient')}, ${originalBgImage}`;
        btn.style.backgroundRepeat = 'no-repeat';
        const nameElem = btn.querySelector('.name');
        if (nameElem) {
          nameElem.style.fontSize = '45px';       
          nameElem.style.top = '10px';            
          nameElem.style.left = '5px';            
          nameElem.style.textShadow = '0 2px 6px rgba(0,0,0,0.6)';
        }
        const hpElem = btn.querySelector('.hp');
        if (hpElem) {
          hpElem.style.fontSize = '30px';        
          hpElem.style.bottom = '10px';          
          hpElem.style.right = '10px';           
          hpElem.style.textShadow = '0 2px 6px rgba(0,0,0,0.6)';
        }
      });
      fragment.appendChild(buttons);
      const caption = ui.create.div('.caption');
      const d = ui.create.div(ui.create.div(ui.create.div('.text.center', caption)), {
        display: 'block',
        left: 'auto',
        textAlign: 'left',
        fontSize: '25px'
      });
      const dieText = game.全能搜索_createDieText(charName);
      const charIntro = get.characterIntro(charName) || '无武将简介';
      const charTitle = get.colorspan(lib.characterTitle[charName] || "暂无称号");
      const gender = lib.translate[character[0]] || '未知';
      const force = lib.translate[character[1]] || '未知';
      const maxHp = character[2] || '未知';
      const imgUrl = getImageUrl(buttons.firstElementChild);
      d.insertAdjacentHTML('afterbegin', html`
   </br>
   <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling)">武将信息&nbsp</span>
   <span>${charIntro}</span>
   </br>
   <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling.nextElementSibling)">所在武将包&nbsp</span>
   <span>${packTranslate}</span>
   <font color=6df95b>[${packName}]</font>
   </br>
   <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling)">武将名称&nbsp</span>
   ${lib.translate[charName]}
   <font color=6df95b>[${charName}]</font>
   </br>
   <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling)">武将称号&nbsp</span>
   <span>${charTitle}</span>
   </br>
   <span class="bluetext">武将性别&nbsp</span><span>${gender}</span>
   </br>
   <!-- 关键修改：给阵营文字和标识加内联样式，控制大小 -->
   <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling.nextElementSibling.nextElementSibling)">武将势力&nbsp</span>
   <span style="fontSize: 38px;">${force}</span> <!-- 阵营名称（如“魏”），调整28px为需要的大小 -->
   <font color=6df95b style="fontSize: 28px;">[${character[1]}]</font> <!-- 阵营标识（如[wei]），与名称大小一致 -->
   </br>
   <span class="bluetext">体力上限&nbsp</span><span>${maxHp}</span>
   </br>
   <span class="bluetext" ondblclick="game.全能搜索_copy(this.nextElementSibling)">图片地址&nbsp</span><span>${imgUrl}</span>
   </br>
   ${dieText}
   <span class="bluetext">武将技能</span>${skillstr}
   </br>
   <span class="bluetext">武将衍生技</span><span>${skillDerivationstr}</span>
   </br></br></br>
 `);
      fragment.appendChild(caption);
    });
    if (searcher.fragmentDataList[searcher.fragmentList.length - 1].length > 9) {
      lastFragment = document.createDocumentFragment();
      searcher.fragmentList.push(lastFragment);
      searcher.fragmentDataList.push([]);
    }
  }
  console.timeEnd('findCharacter');
}
