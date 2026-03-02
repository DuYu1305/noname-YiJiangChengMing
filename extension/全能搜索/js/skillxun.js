/**
 * @description 代码搜索逻辑模块（从 extension.js 迁移）
 * @param { Searcher } searcher - Searcher 类实例（原 this 上下文）
 * @param { string } result - 搜索关键词
 * @param { { 
 *   lib: any, game: any, get: any, ui: any, 
 *   qnssVariable: any, description: DocEntry[] | undefined,
 *   matchChinese: Function, html: Function 
 * } } deps - 依赖对象（全局变量+辅助函数）
 */
export default function handleFindCode(searcher, result, deps) {
  const { lib, game, get, ui, qnssVariable, description, matchChinese, html } = deps;
  console.time('findCode');
  const variableKeys = Object.keys(qnssVariable);
  let key = null;

  // 1. 提前过滤无效输入（含括号、空值），直接返回
  if (!result || result.includes('(') || result.includes(')')) {
    console.error('寻找代码功能，不能寻找带有小括号的代码（防止执行函数）');
    console.timeEnd('findCode');
    return false;
  }

  // 2. 快速匹配变量前缀（减少循环次数）
  key = variableKeys.find(variable => 
    result.startsWith(variable + '.') || result === variable
  );
  if (!key) {
    console.timeEnd('findCode');
    return false;
  }

  // 3. 提前初始化player/card（仅一次，避免重复创建）
  if (!qnssVariable.player) qnssVariable.player = ui.create.player().init('sunce');
  if (!qnssVariable.card) qnssVariable.card = game.createCard('sha');

  // 4. 缓存变量路径解析结果（避免重复reduce）
  const pathSegments = result.split('.');
  const exceptLast = pathSegments.slice(0, -1);
  const lastSegment = pathSegments.at(-1);
  // 优化reduce：提前终止无效路径
  const exceptResult = exceptLast.reduce((prev, curr) => {
    if (!prev || !Object.prototype.hasOwnProperty.call(prev, curr)) {
      return null; // 路径无效，直接返回null
    }
    return prev[curr];
  }, qnssVariable);
  if (!exceptResult || !Object.prototype.hasOwnProperty.call(exceptResult, lastSegment)) {
    console.timeEnd('findCode');
    return false;
  }
  const obj = exceptResult[lastSegment];

  // 5. 优化stringify：减少递归层级，提前处理常见类型
  const stringify = (obj) => {
    if (obj === undefined) return 'undefined';
    if (obj === null) return 'null';
    if (typeof obj === 'function' || get.objtype(obj) === 'object') {
      return get.stringify(obj, 2); // 保留原格式化逻辑
    }
    if (Array.isArray(obj)) {
      return `[${obj.map(item => stringify(item)).join(', ')}]`;
    }
    if (obj instanceof DOMTokenList) {
      return JSON.stringify(Array.from(obj));
    }
    // 基础类型直接序列化
    return typeof obj === 'string' ? `"${obj}"` : String(obj);
  };

  // 6. 注释生成：减少循环嵌套，提前过滤无效注释
  let descriptionStr = '';
  if (Array.isArray(description) && exceptLast.length > 0) {
    // 缓存初始变量与注释匹配结果
    let localVariable = qnssVariable[exceptLast[0]];
    let localDescription = description.find(desc => {
      if (desc.name === 'default') {
        return desc.instanceMembers?.every(({ name }) => Object.hasOwn(localVariable, name)) || false;
      }
      if (typeof localVariable !== 'function') {
        return desc.name === localVariable?.constructor?.name;
      }
      return desc.name === localVariable.name;
    });

    // 优化路径遍历：提前终止无效路径
    if (localVariable && localDescription) {
      for (const segment of pathSegments.slice(1)) {
        const prevVariable = localVariable;
        localVariable = localVariable[segment];
        if (localVariable === undefined) break;

        // 优先从当前注释的instanceMembers查找
        if (localDescription.instanceMembers) {
          localDescription = localDescription.instanceMembers.find(desc => desc.name === segment);
        } else {
          // fallback：查找前序变量的注释
          const prevDesc = description.find(desc => {
            if (desc.name === 'default') {
              return desc.instanceMembers?.every(({ name }) => Object.hasOwn(prevVariable, name)) || false;
            }
            if (typeof prevVariable !== 'function') {
              return desc.name === prevVariable?.constructor?.name;
            }
            return desc.name === prevVariable.name;
          });
          localDescription = prevDesc?.instanceMembers?.find(desc => desc.name === segment);
        }
        if (!localDescription) break;
      }
    }

    // 生成注释HTML（合并字符串，减少拼接次数）
    if (localVariable === obj && localDescription) {
      const isFunc = typeof obj === 'function';
      const commentParts = [
        `<span>`,
        `${isFunc ? '函数' : '变量'}描述: ${localDescription.documentation || '无'}</br>`,
        `${isFunc ? '函数返回值' : '变量'}类型: ${localDescription.type || '未知'}</br>`
      ];

      // 函数参数表（批量生成）
      if (isFunc && Array.isArray(localDescription.parameters) && localDescription.parameters.length > 0) {
        const borderStyle = 'style="border: 1px solid #000000"';
        commentParts.push(`函数参数: </br>`);
        commentParts.push(`<table style="border-collapse: collapse">`);
        commentParts.push(`<thead><tr><<th scope="col" ${borderStyle}>参数名称</</th><<th scope="col" ${borderStyle}>参数类型</</th><<th scope="col" ${borderStyle}>参数描述</</th></tr></thead>`);
        commentParts.push(`<tbody>`);
        localDescription.parameters.forEach(({ name, type, documentation }) => {
          commentParts.push(`<tr><td ${borderStyle}>${name}</td><td ${borderStyle}>${type}</td><td ${borderStyle}>${documentation || '无'}</td></tr>`);
        });
        commentParts.push(`</tbody></table>`);
      }
      commentParts.push(`</span>`);
      descriptionStr = commentParts.join('');
    }
  }

  // 7. 合并DOM创建：一次性生成片段，减少操作
  let lastFragment = document.createDocumentFragment();
  searcher.fragmentList.push(lastFragment);
  searcher.fragmentDataList.push([]);

  // 标题容器（仅创建一次）
  const qnssCaption = ui.create.div('.caption.qnssCaption');
  qnssCaption.appendChild(game.全能搜索_createWaveText('代码搜索结果'));
  lastFragment.appendChild(qnssCaption);

  // 代码结果渲染（合并HTML插入）
  searcher.fragmentDataList[searcher.fragmentList.length - 1].push((fragment) => {
    const caption = ui.create.div('.caption');
    const d = ui.create.div(ui.create.div(ui.create.div('.text.center', caption)), {
      display: 'block',
      left: 'auto',
      textAlign: 'left',
      fontSize: '20px'
    });

    // 一次性插入所有HTML（减少DOM重绘）
    const codeStr = stringify(obj);
    d.insertAdjacentHTML('afterbegin', html`
        <li>
            <font color="21ffd8">[ ${result} ] </font>搜索结果：</br>
            ${descriptionStr}
            <pre class="hljs language-javascript" style="user-select:text;-webkit-user-select:text;">
                ${'// ' + result + '的源代码: </br>'}${game.全能搜索_highlight(codeStr)}
            </pre>
            <!-- 新增复制代码按钮（保留原功能） -->
            <button 
                data-code-name="${result}" 
                data-raw-code="${encodeURIComponent(codeStr)}" 
                onclick="
                    const rawCode = decodeURIComponent(this.dataset.rawCode); 
                    game.全能搜索_copy(rawCode); 
                    window.showCopySuccess(this.dataset.codeName);
                " 
                style="margin-top:10px; padding:5px 10px; cursor:pointer; display: inline-block;"
            >
                复制代码
            </button>
        </li>
    `);
    fragment.appendChild(caption);
  });

  // 分页逻辑（保留原规则）
  if (searcher.fragmentDataList[searcher.fragmentList.length - 1].length > 9) {
    lastFragment = document.createDocumentFragment();
    searcher.fragmentList.push(lastFragment);
  }

  console.timeEnd('findCode');
}
