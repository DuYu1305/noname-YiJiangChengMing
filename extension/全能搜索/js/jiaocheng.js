
export default function renderSkillTutorial(searcher, globalObj) {
  
  const { ui, game, _status, get } = globalObj;

  
  _status.当前搜索关键词 = ['触发技教学', '主动技教学', '暂未更新'];
  searcher.clearDialog(searcher.dialog);
  searcher.fragmentList = [];
  searcher.fragmentDataList = [];
  searcher.dialog.buttons = [];

  
  let lastFragment = document.createDocumentFragment();
  searcher.fragmentList.push(lastFragment);
  searcher.fragmentDataList.push([]);
  const qnssCaption = ui.create.div('.caption.qnssCaption');
  lastFragment.appendChild(qnssCaption);
  qnssCaption.appendChild(game.全能搜索_createWaveText('技能教程'));

  
  searcher.fragmentDataList[searcher.fragmentList.length - 1].push((lastFragment) => {
    const caption = ui.create.div('.caption');
    const d = ui.create.div(ui.create.div(ui.create.div('.text.center', caption)), {
      display: 'block',
      left: 'auto',
      textAlign: 'left',
      fontSize: '16px',
      color: '#fff'
    });

    // ---------------------- 触发技教学板块 ----------------------
    d.insertAdjacentHTML('beforeend', `
      <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
        <div class="group-title" 
             onclick="window.toggleKeywordGroup(this, 'trigger_skill')"
             style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
        >
          触发技教学 <span class="toggle-icon">+</span>
        </div>
        <div id="trigger_skill" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
          <div class="section">
            <h3>一：触发时机</h3>
            
            <!-- 触1.1 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触1.1］</strong></p>
              <p>技能描述：你的回合结束时，你摸一张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{//技能的触发时机
    //触发视角：player：拥有技能的角色
    //触发条件：phaseEnd：回合结束
    player:"phaseEnd"
  },
  content:function(){//技能的效果内容，注意非异步写法下，这里不能填写任何参数
    //效果执行角色：player：拥有技能的角色
    //执行的效果：draw：摸牌（括号里面可以填写数字，表示摸牌数量，不写的时候默认为1）
    player.draw();
  },
  "_priority":0,//技能的优先级，数字越大优先级越高，默认0
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 触1.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触1.2］</strong></p>
              <p>技能描述：你的回合开始时与回合结束时，你摸一张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{//技能的触发时机
    //触发视角：player：拥有技能的角色
    //触发条件：phaseEnd：回合结束，phaseBegin：回合开始
    player:["phaseEnd","phaseBegin"],
  },
  content:function(){//技能的效果内容
    player.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">二：触发视角</h3>
            
            <!-- 触2.1 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触2.1］</strong></p>
              <p>技能描述：你的回合开始与结束时；每个角色的出牌阶段开始时；你造成伤害后；你被任意角色使用卡牌指定为目标后；你摸一张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{//技能的触发时机
    //触发视角：player：拥有技能的角色
    player:["phaseEnd","phaseBegin"],
    //触发视角：global：全局(全体玩家)
    global:"phaseUseBegin",
    //触发视角：source：（你为）来源角色
    source:"damageSource",
    //触发视角：target：（你为）目标角色
    target:"useCardToTargeted",
  },
  content:function(){//技能的效果内容
    player.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">三：使用条件</h3>
            
            <!-- 触3.1 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触3.1］</strong></p>
              <p>技能描述：你的回合开始与结束时；如果你的手牌数小于4，你可以摸2张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{//技能的触发时机
    player:["phaseEnd","phaseBegin"],
  },
  //filter函数：筛选符合条件的情况，返回true可发动
  filter:function(event,player,name){
    //countCards("h")：获取手牌数量
    if(player.countCards("h") >= 4 )return false;
    return true;
  },
  content:function(){//技能的效果内容
    player.draw(2);
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">四：技能组与衍生技能</h3>
            
            <!-- 触4.1 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触4.1］</strong></p>
              <p>技能描述：你的回合开始时，你可以摸1张牌。你的回合结束时，你可以摸3张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{
    player:["phaseBegin","phaseEnd"],
  },
  content:function(){
    //判断触发时机，执行不同效果
    if(event.triggername=="phaseBegin"){
      player.draw();
    }
    if(event.triggername=="phaseEnd"){
      player.draw(3);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 触4.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触4.2］</strong></p>
              <p>技能描述：你的回合开始时，你可以摸3张牌。你的回合结束时，你可以摸1张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  //group：子技能组，拥有此技能即拥有组内技能
  group:["cy_rmcfj4_2_Begin","cy_rmcfj4_2_End"],
  //subSkill：子技能效果
  subSkill:{
    "Begin":{
      trigger:{player:"phaseBegin"},
      content:function(){player.draw(3);},
      sourceSkill: "cy_rmcfj4_2",//衍生技能来源
    },
    "End":{
      trigger:{player:"phaseEnd"},
      content:function(){player.draw();},
      sourceSkill: "cy_rmcfj4_2",
    },
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 触4.3 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触4.3］</strong></p>
              <p>技能描述：游戏开始时，你获得〖武圣〗</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger: {
    global: "phaseBefore",//常规游戏开始时
    player: "enterGame",//特殊模式/中途加入时
  },
  filter(event, player, name) {
    //判断是否有其他角色 + 是否为第0轮
    return game.hasPlayer(current => current !== player) && (event.name != "phase" || game.phaseNumber == 0);
  },
  derivation:["wusheng"],//衍生技能
  content(){
    player.addSkill("wusheng");//添加武圣技能
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 触4.4 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触4.4］</strong></p>
              <p>技能描述：你拥有技能〖制衡〗〖仁德〗〖奸雄〗</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  group:["zhiheng","rende","jianxiong"],//直接配置拥有的技能组
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">五：标记系统</h3>
            
            <!-- 触5.1 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触5.1］</strong></p>
              <p>技能描述：每轮限3次，每当有角色使用牌后，你可以摸1张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  group:["cy_rmcfj5_1_mark"],//子技能：每轮清空标记
  trigger: {global: "useCardEnd"},//全场使用牌后触发
  filter: function(event, player) {
    return player.countMark("cy_rmcfj5_1") < 3;//限3次
  },
  content: function() {
    player.draw();
    player.addMark("cy_rmcfj5_1",1);//添加标记
  },
  mark: true,//显示标记
  marktext: "五",//标记显示文本
  intro:{
    name:"触发技教学",
    content:function(storage,player){
      return "本轮已使用" + player.countMark("cy_rmcfj5_1") + "次技能";
    }     
  },
  subSkill:{
    "mark":{
      forced: true,//强制发动
      trigger: {global: "roundStart"},//每轮开始时
      content: function() {
        player.clearMark("cy_rmcfj5_1");//清空标记
      },
    },
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 触5.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［触5.2］</strong></p>
              <p>技能描述：每轮限3次，每当有角色使用牌后，你可以摸1张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger: {global: "useCardEnd"},
  filter: function(event, player) {
    return player.countMark("cy_rmcfj5_2_used") < 3;
  },
  content: function() {
    player.draw();
    //添加临时技能（至本轮结束）
    player.addTempSkill("cy_rmcfj5_2_used", "roundStart");
    player.addMark("cy_rmcfj5_2_used",1);
  },
  subSkill:{
    "used":{
      onremove: true,//失去技能时清空存储
      charlotte: true,//状态技标记
      sub: true,//子技能标记
      sourceSkill: "cy_rmcfj5_2", 
      mark: true,
      marktext: "使",
      intro:{
        name:"触发技教学五二",
        content:function(storage,player){
          return "本轮已使用" + player.countMark("cy_rmcfj5_2_used") + "次技能";
        }     
      },
    },
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

// ---------------------- 主动技教学板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'active_skill')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      主动技教学 <span class="toggle-icon">+</span>
    </div>
    <div id="active_skill" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：出牌阶段使用</h3>
        
        <!-- 主1.1 -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［主1.1］</strong></p>
          <p>技能描述：出牌阶段，你可以摸1张牌。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  //enable：主动发动时机（phaseUse=出牌阶段）
  enable: "phaseUse",
  content: function() {
    player.draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">二：主动技选择角色</h3>
        
        <!-- 主2.1 -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［主2.1］</strong></p>
          <p>技能描述：出牌阶段，你可以选择至多两名其他角色，令其摸1张牌。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  //filterTarget：限制目标角色（不能是自己）
  filterTarget(card, player, target) {
    return player != target;
  },
  //selectTarget：目标数量（1-2名）
  selectTarget:[1,2],
  content: function() {
    target.draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主2.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［主2.2］</strong></p>
              <p>技能描述：出牌阶段，你可以对所有手牌数为0的其他角色各造成1点伤害。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterTarget(card, player, target) {
    //目标条件：手牌0 + 不是自己
    return target.countCards("h") == 0 && target != player;
  },
  selectTarget:-1,//默认选择所有符合条件的目标
  filter(event, player){
    //必须有符合条件的目标才能发动
    return game.hasPlayer(current => current.countCards("h") == 0 && current != player);
  },
  content: function() {
    //造成1点伤害（来源为player）
    target.damage(1,player);
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">三：主动技选择卡牌</h3>
        
        <!-- 主3.1 -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［主3.1］</strong></p>
          <p>技能描述：出牌阶段，你可以弃置一张手牌，摸两张牌。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  //对选择的卡牌没有额外条件
  filterCard: true,
  //可以选择的卡牌范围，h表示手牌，e表示装备区的牌
  position: "he",
  //需要选择1张卡牌才能发动技能
  selectCard:1,
  //content中没有对选择的card进行处理，则默认是弃置选择的牌
  content: function() {
    player.draw(2);
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主3.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［主3.2］</strong></p>
              <p>技能描述：出牌阶段，你可以弃置一张手牌，对一名其他角色造成1点伤害。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterCard: true,
  position:"he",
  selectCard:1,
  filterTarget(card, player, target) {
    return player != target;
  },
  selectTarget:1,
  content: function() {
    target.damage(1,player);
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主3.3 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［主3.3］</strong></p>
              <p>技能描述：出牌阶段，你可以选择一张手牌，交给一名其他角色，并令其摸1张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterCard: true,
  position:"he",
  selectCard:1,
  filterTarget(card, player, target) {
    return player != target;
  },
  selectTarget:1,
  //表示该技能不会默认将选择的卡牌给弃置
  discard:false,
  //表示该技能不会默认将选择的卡牌失去到游戏外
  lose:false,
  content: function() {
    //使用give函数，将选择的卡牌交给target
    player.give(cards, target);
    target.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">四：技能使用次数</h3>
        
        <!-- 主4.1 -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［主4.1］</strong></p>
          <p>技能描述：出牌阶段限两次，你可以摸一张牌。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  //因为技能中存在enable: "phaseUse",因此usable控制的效果是：出牌阶段限X次
  usable:2,
  content: function() {
    player.draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主4.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［主4.2］</strong></p>
              <p>技能描述：每回合限两次，每当有角色使用牌后，你可以摸一张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger: {
    global: "useCardEnd",
  },
  //因为技能中不存在enable: "phaseUse",因此usable控制的效果是：每回合限X次
  usable:2,
  content: function() {
    player.draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主4.3 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［主4.3］</strong></p>
              <p>技能描述：每轮限一次，出牌阶段，你可以摸3张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  //每轮限1次
  round:1,
  content: function() {
    player.draw(3);
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主4.4 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［主4.4］</strong></p>
              <p>技能描述：每2轮限一次，出牌阶段，你可以摸9张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  //每2轮限1次
  round:2,
  content: function() {
    player.draw(9);
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">五：转化牌入门</h3>
        
        <!-- 主5.1 -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［主5.1］</strong></p>
          <p>技能描述：你可以将一张红色牌当作【杀】使用或打出。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  //技能是主动发动的，可以在“选择牌使用”或“选择牌打出”的时候去使用
  //chooseToUse：选择牌使用
  //chooseToRespond：选择牌打出
  enable: ["chooseToRespond","chooseToUse"],
  filterCard(card, player) {
    //限制选择的牌必须是红色的
    return get.color(card) == "red";
  },
  position: "he",
  selectCard:1,
  //viewAs：在主动技中，可以不放在content函数中，而是独立使用
  //在这里，viewAs表示将选择到的牌当作一张id为“sha”的牌来使用
  viewAs: {
    name: "sha",
  },
  //只有满足了viewAsFilter的条件，技能的点击按钮才会出现
  viewAsFilter(player) {
    if (!player.countCards("he", { color: "red" })) {
      return false;
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 主5.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［主5.2］</strong></p>
              <p>技能描述：你可以将至少2张，至多3张牌当作【无中生有】使用。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: ["chooseToRespond","chooseToUse"],
  filterCard:true,
  position:"he",
  selectCard:[2,3],
  viewAs: {
    name: "wuzhong",
  },
  viewAsFilter(player) {
    return player.countCards("he") >= 2;
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    
    
    // ---------------------- 技能标签教学板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'skill_tag')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      技能标签教学 <span class="toggle-icon">+</span>
    </div>
    <div id="skill_tag" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：锁定与强制触发</h3>
        
        <!-- 锁1（cy_sdqz1） -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［锁1］</strong></p>
          <p>技能描述：锁定技：你的回合结束时，你“可以”摸一张牌。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{
    player:"phaseEnd"
  },
  locked:true,//只写了locked为true
  //表示这是一个 “不强制发动” 的 “锁定技”
  content:function(){
    player.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 锁2（cy_sdqz2） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［锁2］</strong></p>
              <p>技能描述：锁定技：你的回合结束时，你“必须”摸一张牌（这个“必须”其实一般技能描述不会写，会简略写 你摸一张牌）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{
    player:"phaseEnd"
  },
  forced:true,//只写了forced为true
  //表示这是一个 “强制发动” 的 “锁定技”
  content:function(){
    player.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 锁3（cy_sdqz3） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［锁3］</strong></p>
              <p>技能描述：你的回合结束时，你“必须”摸一张牌（这个“必须”其实一般技能描述不会写，会简略写 你摸一张牌）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{
    player:"phaseEnd"
  },
  forced:true,//forced为true，强制发动
  locked:false,//locked为false，非锁定技
  //表示这是一个 “强制发动” 的 “非锁定技”
  content:function(){
    player.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">二：限定技类型</h3>
            
            <!-- 限1（cy_xdjn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［限1］</strong></p>
              <p>技能描述：限定技：出牌阶段，你摸一张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  limited:true,//限定技标签
  unique:true,//特殊技标签
  content(){
    //awakenSkill的效果是将技能记录下来，同时让这个技能失效
    player.awakenSkill("cy_xdjn1");
    player.draw(1);
  }, 
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">三：使命技类型</h3>
            
            <!-- 使1（cy_smjn） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［使1］</strong></p>
              <p>技能描述：使命技：①使命：你的回合结束时，如果你未受伤，你摸一张牌②失败：当你进入濒死状态时，你失去一点体力上限。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  //使命技标签
  dutySkill: true,
  group:["cy_smjn_achieve","cy_smjn_fail"],//子技能组（完成/失败）
  subSkill:{
    achieve:{//使命完成子技能
      trigger:{
        player:"phaseEnd"
      },
      forced: true,//强制发动
      filter(event,player,name){
        //isDamaged()用于判断一个角色是否受伤，利用！取反就是判断是否未受伤
        return !player.isDamaged();
      },
      content:function(){
        //手动log使命的相关信息
        game.log(player, "成功完成使命");
        player.awakenSkill("cy_smjn");//使命完成后技能失效
        player.draw();
      },
      sub: true,
      sourceSkill: "cy_smjn",
    },
    fail:{//使命失败子技能
      trigger: {
        player: "dying",//触发时机：进入濒死状态
      },
      forced: true,
      content() {
        //手动log使命的相关信息
        game.log(player, "使命失败");
        player.awakenSkill("cy_smjn");//使命失败后技能失效
        player.loseMaxHp();//失去1点体力上限
      },
      sub: true,
      sourceSkill: "cy_smjn",
    },
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">四：转换技类型</h3>
            
            <!-- 转1（cy_zhjn） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［转1］</strong></p>
              <p>技能描述：转换技：出牌阶段，阴：你获得一点护甲，阳：你摸一张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  //转换技标签
  zhuanhuanji: true,
  mark: true,//显示标记
  //这个太极图标建议直接复制粘贴
  marktext: "☯",
  intro: {
    content: function (storage, player) {
      //根据技能储存的storage为true或是false，显示不同描述
      var str = "转换技。出牌阶段，你";
      if (storage) return str + "摸一张牌";
      return str + "获得一点护甲";
    },
  },
  content(){
    //如果storage为false（阴），触发获得护甲的效果
    if(!player.storage.cy_zhjn){
      //获得一点护甲
      player.changeHujia(1);
    }else{
      //如果storage为true（阳），触发摸牌的效果
      player.draw();
    }
    //该函数内置了对storage的修改：true↔false切换
    player.changeZhuanhuanji("cy_zhjn");
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    
    // ---------------------- 异步与选择板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'async_choice')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      异步与选择 <span class="toggle-icon">+</span>
    </div>
    <div id="async_choice" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：异步主动技</h3>
        
        <!-- 异主1（cy_etecjn1） -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［异主1］</strong></p>
          <p>技能描述：出牌阶段，你可以选择一张手牌，交给一名其他角色，并令其摸1张牌（旧写法）。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterCard: true,
  position:"h",
  selectCard:1,
  filterTarget(card, player, target) {
    return player != target;
  },
  selectTarget:1,
  discard:false,
  lose:false,
  content() {
    //在旧写法，content内不能有任何参数
    //在旧写法，我们使用cards与target来表示选择的牌与目标角色
    player.give(cards, target);
    target.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 异主2（cy_etecjn2） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［异主2］</strong></p>
              <p>技能描述：出牌阶段，你可以选择一张手牌，交给一名其他角色，并令其摸1张牌（异步新写法）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterCard: true,
  position:"h",
  selectCard:1,
  filterTarget(card, player, target) {
    return player != target;
  },
  selectTarget:1,
  discard:false,
  lose:false,
  //在异步新写法，content内应该要固定有3个参数：event（当前技能事件）, trigger（触发事件）, player（技能角色）
  async content(event, trigger, player) {
    //在异步新写法，我们使用event.cards与event.target来表示选择的牌与目标角色
    player.give(event.cards, event.target);
    event.target.draw();
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">二：await的意义</h3>
            
            <!-- a1（cy_awaitjn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［a1］</strong></p>
              <p>技能描述：出牌阶段，摸1张牌，如果你的手牌数在3以上，则获得1点护甲。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  async content(event,trigger,player){
    //这里我们不使用await，来看看会发生什么样的事情
    player.draw(1);
    //由于在上面摸牌的时候没有使用await，因此实际上角色状态并没有更新
    //因此下面的手牌数量判断，实际上判断的是你摸牌之前的手牌数量
    //这就会导致：如果一开始你的手牌数量不在3以上，即使你因为上面的摸牌，使得手牌数量达到了3以上，也无法触发获得护甲的效果
    if(player.countCards("h") >= 3){
      player.changeHujia(1);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- a2（cy_awaitjn2） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［a2］</strong></p>
              <p>技能描述：出牌阶段，摸1张牌，“然后”，如果你的手牌数在3以上，则获得1点护甲。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  async content(event,trigger,player){
    //这里我们使用了await，那么后续的所有代码都会去等待这一步代码：执行完毕 且 结算完毕（产生了状态更新后），后续的代码才会去执行
    await player.draw(1);
    //由于上面的代码已经 “结算完毕”，所以这里判断手牌数是否在3以上的时候，是会把摸牌之后的那一张牌记录在内的
    //所以，假如你原本有2张牌，因为这个技能先摸的1张牌达到了3张手牌，也可以触发获得护甲的效果
    if(player.countCards("h") >= 3){
      await player.changeHujia(1);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">三：异步的选择</h3>
            
            <!-- 选1（cy_choosejn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［选1］</strong></p>
              <p>技能描述：你的回合开始时，你可以选择一名其他角色，交给其一张手牌，然后摸两张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger: {
    player: "phaseBegin",
  },
  filter(event, player){
    return player.countCards("h") >= 1;
  },
  async content(event, trigger, player){
    var result1 = await player
      .chooseCard(//函数效果：选择卡牌
        1,//选择的卡牌数量为1，这里与主动技框架类似，可以用数组
        "h",//可供选择的卡牌区域
      )//下面用到了set方式来填充参数，好处在于可以更加清晰的了解到参数的对应值
      .set("prompt", "请选择一张牌交给其他角色")
      .forResult();//将结果输出赋值
    if (result1.bool) {//如果在前面选择了卡牌，则进行目标选择
      var result2 = await player
        .chooseTarget(//函数效果：选择目标角色
          1,
          //选择角色的限制函数
          function (card, player, target) {
            return target != player;
          },
        )
        .set("prompt", "请选择一名其他角色来接收你选择的牌")
        .forResult();
      if (result2.bool) {//如果在前面也选择了目标角色，则执行后续
        //这里需要注意，因为chooseCard与chooseTarget的结果都是数组，像这里我们只选择一个目标角色，就应该用结果数组中的第一个元素来表示我们选择的目标角色
        await player.give(result1.cards, result2.targets[0]);
        await player.draw(2);
      }
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">四：cost教学</h3>
            
            <!-- c1（cy_costjn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［c1］</strong></p>
              <p>技能描述：每回合限两次，你使用牌后，可以选择一名角色，令其摸1张牌（不用cost，发动后不选择角色，会浪费技能次数）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{
    player:"useCardEnd",
  },
  usable:2,
  async content(event,trigger,player){
    //注意，这里并没有强制性要求你必须选择一名角色，所以你可以不选择
    //但是由于已经进入了技能的content了，所以即使你不选择任何角色，没有让任何角色摸牌，你仍然算作执行了一次技能
    //因此仍然会占据 “每回合限两次” 的次数
    var result = await player.chooseTarget({
      prompt:"选择一名角色令其摸1张牌",
      selectTarget:1,
    }).forResult();
    if(result.bool){
      result.targets[0].draw(1);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- c2（cy_costjn2） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［c2］</strong></p>
              <p>技能描述：每回合限两次，你使用牌后，可以选择一名角色，令其摸1张牌（不用cost，发动后如果不选择角色，则手动减少一次技能发动次数）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{
    player:"useCardEnd",
  },
  usable:2,
  async content(event,trigger,player){
    var result = await player.chooseTarget({
      prompt:"选择一名角色令其摸1张牌",
      selectTarget:1,
    }).forResult();
    if(result.bool){
      result.targets[0].draw(1);
    }
    //如果前面选择角色的时候，没有返回结果（相当于我们选择了“取消”），则手动减少一次技能的发动次数，这个减少次数的写法是基于usable的内置写法而决定的
    else{player.storage.counttrigger.cy_costjn2--;}
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- c3（cy_costjn3） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［c3］</strong></p>
              <p>技能描述：每回合限两次，你使用牌后，可以选择一名角色，令其摸1张牌（使用cost，发动后不选择角色，不浪费技能次数）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{
    player:"useCardEnd",
  },
  usable:2,
  //将选择目标的部分写在cost里面，这样让玩家在选择目标的时候，实际上并没有进入content之中
  //即使你没有选择目标，也不占用每回合限两次的技能使用次数
  async cost(event, trigger, player) {
    var result = await player.chooseTarget({
      prompt:"选择一名角色令其摸1张牌",
      selectTarget:1,
    }).forResult();
    //如果有选择结果，则将选择结果赋值给技能事件
    if(result.bool){event.result = result;}
  },
  async content(event,trigger,player){
    //使用了cost后，我们需要使用事件中的属性来调用cost中的选择结果
    event.targets[0].draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- c4（cy_costjn4） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［c4］</strong></p>
              <p>技能描述：每个回合开始时，你可以选择令当前回合角色（1）摸一张牌（2）获得一点护甲。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger: {
    global: "phaseBegin",
  },
  async cost(event, trigger, player) {
    const choiceList = ['令'+ get.translation(trigger.player) +'摸一张牌','令'+ get.translation(trigger.player) +'获得一点护甲',];
    const choices = ['选项一','选项二','cancel2'];
    const { result } = await player
      .chooseControl()
      .set('controls', choices)
      .set('choiceList', choiceList)
      .set('prompt','c4：请选择其中一项')
    event.result = {
      //只有在没有选择“cancel2”（即：取消）的时候，才会返回true，从而继续执行content
      bool: result.control !== "cancel2",
      //将选择的结果定义给cost_data
      cost_data: result.control,
    }
  },
  async content(event, trigger, player) {
    if (event.cost_data == '选项一'){
      await trigger.player.draw(1);
    }else if(event.cost_data == '选项二'){
      await trigger.player.changeHujia(1);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);


// ---------------------- 印牌类技能板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'card_create_skill')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      印牌类技能 <span class="toggle-icon">+</span>
    </div>
    <div id="card_create_skill" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：印牌基础</h3>
        
        <!-- 印1（cy_useCard1） -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［印1］</strong></p>
          <p>技能描述：当你受到伤害后，你可以视为对伤害来源使用一张花色为“方块”的火杀。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger:{//技能时机：你受到伤害后
    player:"damageEnd",
  },
  filter:function(event,player){
    return event.source;//技能条件：存在伤害来源
  },
  async content(event,trigger,player){
    //由于未传入cards数组作为实体牌参数，本次使用牌为“视为使用”的“虚拟牌”
    await player.useCard(
      {//将object类型参数传入，作为“视为使用的牌”
        name:"sha",//使用的牌的名字
        nature:"fire",//使用的牌的属性（仅“杀”需设置）
        suit:"diamond",//使用的牌的花色（颜色需通过花色设置，不可直接设）
        isCard:true,//表示使用的牌是非转化牌  
      },
      trigger.source,//设定使用牌的目标为：伤害来源
    )
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 印2（cy_viewAs1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［印2］</strong></p>
              <p>技能描述：出牌阶段，如果你的当前体力值大于2，则你可以视为使用一张“决斗”。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:"chooseToUse",//主动技释放时机：你选择使用牌的时候
  //以下两个标签作用：无法选择任何卡牌作为实体牌（默认选牌但无可选牌）
  filterCard:() => false,//表示该技能无法选择任何卡牌
  selectCard:-1,//表示该技能选择卡牌的过程是默认的
  viewAsFilter:function (player) {
    //类似filter函数，限制viewAs技能按钮的显示时机：当前体力值>2
    return player.hp > 2;//限制条件  
  },
  viewAs:{
    name:"juedou",//视为使用的牌名
    isCard:true,//标记为非转化牌
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 印3（cy_chooseUseTarget1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［印3］</strong></p>
              <p>技能描述：出牌阶段，你可以视为使用一张杀，你以此法使用的牌无距离限制且可以额外选择一个目标，造成的伤害+1且造成伤害后，你回复1点体力。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  group:["cy_chooseUseTarget1_buff"],//子技能组（伤害+1&回复体力）
  enable:"chooseToUse",
  mod:{
    //目标选择逻辑：若使用的牌是“杀”且含指定storage，额外增加1个目标
    selectTarget:function(card,player,range){
      if(card.name=='sha' && card.storage && card.storage.cy_chooseUseTarget1) range[1] += 1;
    },
  },
  filter(event, player) {
    //条件限制：仅当前事件允许使用【杀】时，技能可发动
    if (event.filterCard({ name: "sha", isCard: true }, player, event)) {
      return true;
    }
    return false;
  },
  async content(event,trigger,player){
    player.chooseUseTarget({
      name:"sha",//视为使用的牌名
      isCard:true,//标记为非转化牌
      //为视为使用的卡牌添加storage属性，用于触发mod中的目标增加逻辑
      storage:{cy_chooseUseTarget1:true}
    },false,"nodistance");//设置无距离限制
  },
  subSkill:{
    "buff":{//伤害+1&回复体力的子技能
      trigger:{//时机：你造成伤害后
        source:"damageBegin1",
      },
      forced:true,//强制执行标签
      filter:function(event,player){
        //4个条件需同时满足：存在触发卡牌、卡牌是“杀”、含指定storage、storage属性为true
        return (event.card && event.card.name == 'sha' && event.card.storage && event.card.storage.cy_chooseUseTarget1);
      },
      async content(event,trigger,player){
        trigger.num++;//伤害+1
        await player.recover();//回复1点体力
      },
    },
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">二：多印技能（可视为使用多种牌）</h3>
            
            <!-- 多印（cy_duozhuanhua1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［多印］</strong></p>
              <p>技能描述：每回合限三次，你可以视为使用一张基本牌或者普通锦囊牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:["chooseToUse","chooseToRespond"],//可在“使用牌”“打出牌”时发动
  usable:3,//每回合限3次
  filter:function(event,player){
    //条件：需是当前事件中可使用的牌（遍历游戏牌堆判断）
    for (var name of lib.inpile){
      if(event.filterCard({name:name,isCard:true},player,event))return true;
    }
  },
  chooseButton:{//前置选择：确定要印的牌名
    dialog:function(event,player){//创建选择对话框
      var list=[];//储存可选择的卡牌选项
      for(var i=0;i<lib.inpile.length;i++){//遍历游戏牌堆，筛选可使用的牌
        var name=lib.inpile[i];
        if(name=='sha'){//若为“杀”，需包含普通杀和带属性的杀
          if(event.filterCard({name:name},player,event)) list.push(['基本','','sha']);
          for(var j of lib.inpile_nature){//遍历所有属性（火、雷等）
            if(event.filterCard({name:name,nature:j},player,event)) list.push(['基本','','sha',j]);
          }
        }
        //筛选普通锦囊牌（trick类型）并加入选项
        else if(get.type2(name)=='trick'&&event.filterCard({name:name},player,event)) list.push(['锦囊','',name]);
        //筛选基本牌（basic类型）并加入选项
        else if(get.type(name)=='basic'&&event.filterCard({name:name},player,event)) list.push(['基本','',name]);
      }
      //创建对话框：标题+可选择的卡牌列表
      return ui.create.dialog('多印：请选择要使用的牌',[list,'vcard']);
    },
    filter:function(button,player){
      //条件：需满足父事件需求（如响应锦囊时只能印“无懈可击”）
      return _status.event.getParent().filterCard({name:button.link[2]},player,_status.event.getParent());
    },
    backup:function(links,player){//执行印牌逻辑
      return {
        filterCard:()=> false,//无法选择实体牌
        selectCard:-1,//默认选牌流程
        popname:true,//用牌时显示牌名
        //viewAs实现印牌效果：按选择结果设置牌名、属性
        viewAs:{name:links[0][2],nature:links[0][3],isCard:true,},
      }
    },
    prompt:function(links,player){//提示语句：显示视为使用的牌
      return '视为使用了'+(get.translation(links[0][3])||'')+get.translation(links[0][2])+'卡牌';
    },
  },
  hiddenCard:function(player,name){
    //判断是否可打出/使用目标牌：即使手牌没有，也视为有“隐藏牌”可响应
    if(!lib.inpile.includes(name)) return false;
    var type=get.type2(name);
    return ["basic", "trick"].includes(type);//仅支持基本牌、普通锦囊牌
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">三：获取牌基础（从牌堆/弃牌堆/其他区域拿牌）</h3>
            
            <!-- 牌1（cy_cardPile1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［牌1］</strong></p>
              <p>技能描述：出牌阶段，你可以从牌堆或弃牌堆中获得一张“杀”与一张点数为6的卡牌，从弃牌堆中获得一张锦囊牌，从所有玩家的区域中获得所有的装备牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:"phaseUse",
  async content(event,trigger,player){
    var cards = [];//储存要获得的所有卡牌
    //1. 从牌堆获取1张“杀”
    var card1 = get.cardPile("sha");
    if(card1){cards.push(card1)};
    //2. 从牌堆获取1张点数为6的牌（排除与card1重复的牌）
    var card2 = get.cardPile(function(card){return get.number(card)==6 && card != card1});
    if(card2){cards.push(card2)};
    //3. 从弃牌堆获取1张锦囊牌（trick类型）
    var card3 = get.discardPile(function(card){return get.type(card)=='trick'});
    if(card3){cards.push(card3)};
    //4. 从所有玩家区域（手牌+装备+判定区）获取所有装备牌
    var region = game.players.map(current => current.getCards('hej'));//获取所有玩家的“hej”区域牌
    region = region.flat();//将二维数组扁平化（如[[1],[2,3]]→[1,2,3]）
    for(var i=0;i<region.length;i++){//遍历区域牌，筛选装备牌
      if(get.type(region[i])=="equip"){
        cards.push(region[i]);
      }
    }
    //将所有获取的牌加入手牌
    if(cards.length){player.gain(cards,"gain2","log");}
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 牌2（cy_cardsGotoPile1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［牌2］</strong></p>
              <p>技能描述：出牌阶段，你从游戏外获得一张点数为4的杀，花色为红色的决斗，一张乐不思蜀，装备一张银月枪，然后将200张“洞烛先机”加入牌库，将1张“火杀”加入弃牌堆。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:"phaseUse",
  async content(event,trigger,player){
    var cards = [];//储存要获得的卡牌
    //1. 广播同步：将缺失的卡牌名加入游戏牌堆列表
    game.broadcastAll(function () {
      if (!lib.inpile.includes("sha")) {lib.inpile.add("sha");}
      if (!lib.inpile.includes("juedou")) {lib.inpile.add("juedou");}
      if (!lib.inpile.includes("lebu")) {lib.inpile.add("lebu");}
      if (!lib.inpile.includes("yinyueqiang")) {lib.inpile.add("yinyueqiang");}
      if (!lib.inpile.includes("dongzhuxianji")) {lib.inpile.add("dongzhuxianji");}
    });
    //2. 从游戏外创建指定卡牌
    var card1 = game.createCard({name:"sha",number:"6"});//点数6的杀
    var card2 = game.createCard({name:"juedou",suit:"red"});//红色决斗
    var card3 = game.createCard({name:"lebu"});//乐不思蜀
    var card4 = game.createCard({name:"yinyueqiang"});//银月枪
    var card5 = [];//储存200张洞烛先机
    for(var i=0;i<200;i++){//循环创建200张洞烛先机
      card5.push(game.createCard("dongzhuxianji"));
    };
    var card6 = game.createCard({name:"sha",nature:"fire"});//火杀
    //3. 获得指定卡牌并装备银月枪
    cards.push(card1,card2,card3);
    player.gain(cards);//获得卡牌（手牌）
    player.equip(card4);//装备银月枪
    //4. 将200张洞烛先机随机加入牌库
    game.cardsGotoPile(card5, () => {
      return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
    });
    //5. 将火杀随机加入弃牌堆
    game.cardsDiscard(card6,() => {
      return ui.discardPile.childNodes[get.rand(0, ui.discardPile.childNodes.length - 1)];
    });
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);



    
    // ---------------------- choose类函数板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'choose_function')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      choose类函数 <span class="toggle-icon">+</span>
    </div>
    <div id="choose_function" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：dialog对话框</h3>
        
        <!-- d1（cy_dialogjn1） -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［d1］</strong></p>
          <p>技能描述：出牌阶段，选择一名角色与一张卡牌，然后选择（1）令其获得该卡牌（2）弃置该牌对其造成一点伤害（不写dialog）。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterCard: true,
  position:"he",
  selectCard:1,
  filterTarget(card, player, target) {
    return player != target;
  },
  selectTarget:1,
  discard:false,
  lose:false,
  async content(event, trigger, player) {
    //这里没有去手搓一个dialog对话框出来，因此在技能发动的时候，没有对话框提示，只有纯粹的文本提示
    var result = await player
        .chooseBool(
          "是否令" + get.translation(event.target) + "获得" + get.translation(event.cards) + "？否则弃置此牌对其造成1点伤害",
        )
        .forResult();
    if (result.bool) {
      await event.target.gain(event.cards, "gain2");
    }else{
      await player.discard(event.cards);
      await event.target.damage(1,player);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- d2（cy_dialogjn2） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［d2］</strong></p>
              <p>技能描述：出牌阶段，选择一名角色与一张卡牌，然后选择（1）令其获得该卡牌（2）弃置该牌对其造成一点伤害（手写dialog）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterCard: true,
  position:"he",
  selectCard:1,
  filterTarget(card, player, target) {
    return player != target;
  },
  selectTarget:1,
  discard:false,
  lose:false,
  async content(event, trigger, player) {
    //由于chooseBool方法的dialog可以支持直接传入数组，所以我们可以直接定义一个数组传入使用
    var dialog = [
        '是否令' + get.translation(event.target) + '获得此牌？否则弃置此牌对其造成1点伤害',
        //对event.cards进行UI化处理，处理方式为 'vcard'，卡牌
        //注意，进行处理的时候，需要保证前面是卡牌对象构成的 “数组”
        [event.cards, 'vcard'], 
        //对event.target.names进行UI化处理，处理方式为 'character'，角色
        //注意使用该处理方式的时候，该数组中的第一项应该为对应的角色id（即：name）所构成的 “数组”（因此多写了个[]）
        [[event.target.name] ,'character']
      ];
    var result = await player
        .chooseBool()
        .set('createDialog',dialog)
        .forResult();
    if (result.bool) {
      await event.target.gain(event.cards, "gain2");
    }else{
      await player.discard(event.cards);
      await event.target.damage(1,player);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">二：多项选择其一（chooseControl）</h3>
            
            <!-- 选1（cy_choosecontroljn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［选1］</strong></p>
              <p>技能描述：出牌阶段，你选择一项（1）摸一张牌（2）获得一点护甲（无法取消，无完整提示）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:"phaseUse",
  async content(event,trigger,player){
    const choices = ['摸一张牌','获得一点护甲'];
    var result = await player
        .chooseControl()
        .set('controls',choices)//利用set方法传入我们的选项数组
        .forResult();
    if(result.control=="摸一张牌"){
      await player.draw();
    }else if(result.control=="获得一点护甲"){
      await player.changeHujia(1);
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 选6（cy_choosecontroljn6） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［选6］</strong></p>
              <p>技能描述：出牌阶段，你可以选择一项（1）摸一张牌（2）弃置1张牌，摸2张牌（3）弃置2张牌，摸4张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:"phaseUse",
  async content(event,trigger,player){
    //构造选择界面的按钮名称，以及对应的按钮效果解释，注意一一对应
    const choiceList = ['摸1张牌','弃置1张牌，摸2张牌','弃置2张牌，摸4张牌',];
    const choices = ['选项一','选项二','选项三','cancel2',];
    if(player.countCards('he') == 0){//检测条件，如果没有牌（选项二需要弃置1张牌）
      //从选项的解释列表中，将对应项添加一个变为灰色的视觉效果
      //注意，数组的排列顺序是从0开始的，所以这里的索引是1而不是0
      choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
      //从选项的按钮中，将“选项二”的按钮移除，使其无法选择
      choices.remove('选项二');
    };
    if(player.countCards('he') <= 1){//同上类似，如果牌的数量小于2（选项三需要弃置2张牌）
      choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "</span>";
      choices.remove('选项三');
    };
    //进行选择函数，返回选择结果
    var result = await player
        .chooseControl()
        .set('controls', choices)
        .set('choiceList', choiceList)
        .set('prompt','选6：请选择其中一项')
        .forResult();
    if (result.control == '选项一'){
      await player.draw();
    }
    else if (result.control == '选项二'){
      await player.chooseToDiscard(true,'he');
      await player.draw(2);
    }
    else if (result.control == '选项三'){
      await player.chooseToDiscard(true,2,'he');
      await player.draw(4);
    }
    else if (result.control == 'cancel2'){
      return;
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">三：选择卡牌分类（chooseToMove）</h3>
            
            <!-- 分1（cy_choosetomovejn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［分1］</strong></p>
              <p>技能描述：出牌阶段，你可以观看牌堆顶与牌堆底各5张牌，然后包括你的手牌在内，将所有的这些牌任意调度到牌堆顶或牌堆底，或置入你的手牌区。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:"phaseUse",
  async content(event,trigger,player){
    const cards1 = get.cards(5);//获取牌堆顶的5张牌
    const cards2 = get.bottomCards(5);//获取牌堆底的5张牌
    const cards3 = player.getCards("h");//获取技能拥有者的手牌
    const lose_list = [];//创建一个空数组，用来储存在本次事件中，各个角色失去的牌
    lose_list.push([player,cards3]);//将技能拥有者的手牌置入数组lose_list中，并且记录对应的角色
    game.cardsGotoOrdering(cards1,cards2);//将牌堆顶的5张牌与牌堆底的5张牌置入处理区
    await game//利用loseAsync方法，将lose_list数组中的牌置入处理区（因为手牌与牌堆中的牌不一样，要用另外的方法来处理）
        .loseAsync({
          lose_list: lose_list,//被处理的牌
        })
    .setContent("chooseToCompareLose");//处理用到的方法函数
    var result = await player.chooseToMove()//使用chooseToMove方法构建对话窗口，让玩家选择移动哪些牌
        .set("list",[["牌堆顶",cards1],["牌堆底",cards2],["你的手牌",cards3]])//将对应的牌分别填入对话窗口
        .set("prompt","移动这些牌，将这些牌置于牌堆顶或牌堆底，或置入你的手牌区。")//提示语句
        .forResult();
    if(result){
      var top = result.moved[0];//将最后结果的第一行中包含的牌定义为top数组
      var bottom = result.moved[1];//将最后结果的第二行中包含的牌定义为bottom数组
      var hand = result.moved[2];//将最后结果的第三行中包含的牌定义为hand数组
      top.reverse();//将top数组倒置，否则插回牌堆时会变成“右在上、左在下”，不符合常规
      //将top数组与bottom数组放回牌堆，此段逻辑直接复用即可
      game.cardsGotoPile(top.concat(bottom), ["top_cards", top], function (event, card) {
        if (event.top_cards.includes(card)) return ui.cardPile.firstChild;
        return null;
      });
      const gain_list = [];//创建空数组，储存本次事件中各角色获得的牌
      if(hand.length){//将hand数组中的牌加入gain_list，记录对应角色
        gain_list.push([player,hand])
      }
      //将gain_list数组中的牌加入对应角色的手牌
      game.loseAsync({
        gain_list:gain_list,//处理的牌
        giver:player,//处理的对应角色
        animate:"gain2",//处理的动画方式
      }).setContent("gaincardMultiple");//处理用到的方法函数
    }
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">四：多项选择多项（chooseButton）</h3>
            
            <!-- B1（cy_choosebuttonjn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［B1］</strong></p>
              <p>技能描述：出牌阶段，你可以选择以下的至多两项依次执行（1）弃置1张牌，摸2张牌（2）获得1点护甲（3）回复1点体力（4）摸1张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable:"phaseUse",
  async content(event,trigger,player){
    var result = await player
        .chooseButton(
          //注意方括号的数量和位置，层级不可错
          [
            "教程技能：请选择至多两项：",//提示性语句
            [
              [
                [0,"弃置1张牌，摸2张牌"],
                [1,"获得1点护甲"],
                [2,"回复1点体力"],
                [3,"摸1张牌"],
              ],
            "textbutton",]
          ]
        ).set("forced", true)//必须选择，无法取消（不加则可取消）
        .set("selectButton", [1, 2])//可选择1-2项
        .set("filterButton", function (button) {//过滤选项，设置选择条件
          if(button.link == 0){//选项0需满足：手牌+装备牌>0
            return player.countCards("he") > 0;
          }
          //其他选项无限制
          return true;
        }).forResult();
    if(result.bool){
      //将选择的结果按升序排序（例如 [2,0] → [0,2]）
      const choices = result.links.sort((a, b) => a - b);
      for (const num of choices){
        //遍历结果，执行对应效果
        switch(num){
          case 0:
            await player.chooseToDiscard(true,1,'he');
            await player.draw(2);
            break;
          case 1:
            await player.changeHujia(1);
            break;
          case 2:
            await player.recover();
            break;
          case 3:
            await player.draw();
            break;
        }
      }
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">五：实时选择过滤（complexChoose）</h3>
            
            <!-- 实1（cy_complexchoosejn1） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［实1］</strong></p>
              <p>技能描述：出牌阶段，你可以弃置任意不同花色的手牌，并选择至多等同于选择的牌数量的不同势力的角色，然后令这些角色各摸一张牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  //每次选择后重新过滤卡牌的选择
  complexCard:true,
  //每次选择后重新过滤目标角色的选择
  complexTarget:true,
  position: "he",
  //如果不加这个标签，则主动技会默认对每个选择的目标跑一次content
  multitarget:true,
  //控制指示线，选择多个目标时，所有指示线均由你出发
  multiline:true,
  //选择至少1张牌，至多无上限张牌
  selectCard: [1,Infinity],
  //选择卡牌的过滤条件
  filterCard(card, player) {
    //如果尚未选择卡牌，则所有卡牌都可以选择
    if (!ui.selected.cards.length) {
      return true;
    }
    //要求被选择的卡牌，花色不能与已选卡牌花色相同（实现“不同花色”要求）
    return !ui.selected.cards.some(cardx => get.suit(cardx, player) == get.suit(card, player));
  },
  //选择目标的数量（等于已选卡牌数量）
  selectTarget(){
    var num = ui.selected.cards.length;
    return [1,num]
  },
  //选择目标的过滤条件
  filterTarget(card, player, target) {
    //如果尚未选择目标，则所有角色都可以选择
    if (!ui.selected.targets.length) {
      return true;
    }
    //只能选择势力与已选目标势力不同的角色（实现“不同势力”要求）
    return !ui.selected.targets.some(targetx => targetx.group == target.group);
  },
  async content(event,trigger,player){
    //遍历循环event.targets，令每个被选择的目标角色摸一张牌
    for(var i = 0; i < event.targets.length ; i++){
      await event.targets[i].draw();
    }
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    
    
    // ---------------------- 其他入门基础教学板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'other_basic')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      其他入门基础教学 <span class="toggle-icon">+</span>
    </div>
    <div id="other_basic" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：storage教学</h3>
        
        <!-- 入1.1 -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［入1.1］</strong></p>
          <p>技能描述：每局游戏每名角色限一次，出牌阶段，你可以令一名角色摸3张牌。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  init(player){//技能的初始化部分
    //设置本技能对应的storage是一个空数组，之后用来存放被本技能指定为目标的角色
    player.storage.cy_rmqtj1_1 = [];
  },
  enable: "phaseUse",
  filterTarget(card, player, target) {
    //限制目标选择：只能选择不在本技能的storage数组中的角色
    return !player.storage.cy_rmqtj1_1.includes(target);
  },
  selectTarget:1,
  content: function() {
    //将选择的目标添加到本技能的storage数组中
    player.markAuto("cy_rmqtj1_1",target);
    //也可以使用：player.storage.cy_rmqtj1_1.push(target);即传统的向数组添加元素的办法
    target.draw(3);
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 入1.2 -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［入1.2］</strong></p>
              <p>技能描述：出牌阶段，你可以选择一名其他角色，本回合内你对其使用牌无距离限制与次数限制。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  filterTarget(card, player, target) {
    //如果player不存在对应的storage，则所有其他角色均可选择
    if(!player.storage.cy_rmqtj1_2_effect)return target != player;
    //限制目标选择：只能选择不在本技能的storage数组中的角色
    //注意这里的storage并没有用主技能对应的id，而是用的子技能对应的id
    //这样可以配合onremove: true,方便自我清空storage
    return !player.storage.cy_rmqtj1_2_effect.includes(target) && target != player;
  },
  selectTarget:1,
  content: function() {
    //如果自身没有技能“cy_rmqtj1_2_effect”，则直到本回合结束前，获得一个临时的技能“cy_rmqtj1_2_effect”
    if(!player.hasSkill("cy_rmqtj1_2_effect")){
      player.addTempSkill("cy_rmqtj1_2_effect");
    }
    //将选择的目标添加到技能“cy_rmqtj1_2_effect”的storage数组中
    player.markAuto("cy_rmqtj1_2_effect", target);
  },
  subSkill:{
    effect:{
      //该标签用以在失去该技能的时候自动清空所有储存（即storage）
      onremove: true,
      //该标签表示该技能是状态技
      charlotte:true,
      mod: {
        //如果目标角色在技能“cy_rmqtj1_2_effect”的storage数组中，则你对该角色使用牌无次数限制
        cardUsableTarget(card, player, target) {
          if (player.getStorage("cy_rmqtj1_2_effect").includes(target)) {
            return true;
          }
        },
        //如果目标角色在技能“cy_rmqtj1_2_effect”的storage数组中，则你对该角色使用牌无距离限制
        targetInRange(card, player, target) {
          if (player.getStorage("cy_rmqtj1_2_effect").includes(target)) {
            return true;
          }
        },
      },
      sub: true,
      sourceSkill: "cy_rmqtj1_2",
    },
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <h3 style="margin-top: 20px;">二：配音教学</h3>
            
            <!-- 配音（cy_wjpy） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［配音］</strong></p>
              <p>技能描述：出牌阶段，你可以摸1张牌（音频文件用的是〖闭月〗的音频，但是实际上并不是直接调用本体的〖闭月〗配音）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  audio:"ext:苍宇教学模板/audio/skill:2",
  content: function() {
    //备注，因为懒得找音频文件了，所以该技能的配音文件用的是【闭月】的配音文件
    player.draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 本体配音（cy_wjpybt） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［本体配音］</strong></p>
              <p>技能描述：出牌阶段，你可以摸1张牌（本技能调用本体的〖英姿〗技能配音）。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  audio:["yingzi","yingzi"],
  content: function() {
    player.draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    
    
    // ---------------------- 其他函数板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'other_function')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      其他函数 <span class="toggle-icon">+</span>
    </div>
    <div id="other_function" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：history函数（记录技能/卡牌使用历史）</h3>
        
        <!-- 历1（cy_historyjn1） -->
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
          <p><strong>［历1］</strong></p>
          <p>技能描述：出牌阶段，摸X张牌，然后随机弃置Y张牌，X为你本局游戏使用该技能的次数，Y为你本回合使用该技能的次数。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            技能教程 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  enable: "phaseUse",
  async content(event,trigger,player){
    //getHistory：获取“当前回合”的指定历史记录（此处为使用该技能的次数）
    var num1 = player.getHistory("useSkill", evt => evt.skill == "cy_historyjn1").length;
    //getAllHistory：获取“整局游戏”的指定历史记录（此处为使用该技能的次数）
    var num2 = player.getAllHistory("useSkill", evt => evt.skill == "cy_historyjn1").length;
    await player.draw(num2); // 摸X张牌（X=本局使用次数）
    await player.randomDiscard(num1); // 随机弃Y张牌（Y=本回合使用次数）
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 历2（cy_historyjn2） -->
            <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #008080; background: rgba(0,0,0,0.3);">
              <p><strong>［历2］</strong></p>
              <p>技能描述：每局游戏每个体力数值限一次，当你使用或打出牌后，如果你的当前体力值不低于1，摸等同于你当前体力值的牌。</p>
              <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
                技能教程 [点击展开]
                <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
{
  trigger: {
    player: ["useCardAfter","respondAfter"], // 触发时机：使用牌后、打出牌后
  },  
  filter: function (event, player) {
    const hp = player.getHp(); // 获取当前体力值
    if (hp <= 0) return false; // 体力≤0时不发动
    // 筛选条件：整局游戏中，当前体力值未被记录过（实现“每个体力数值限一次”）
    return !player
      .getAllHistory("custom", evt => evt.cy_historyjn2_num) // 获取带指定标记的custom历史
      .map(evt => evt.cy_historyjn2_num) // 提取历史中的体力值
      .includes(hp); // 判断当前体力值是否已存在于历史中
  },      
  async content(event,trigger,player){
    // 向custom历史记录中添加标记，记录当前体力值
    player.getHistory("custom").push({
      cy_historyjn2_num: player.getHp(),
    });
    const hp = player.getHp();
    await player.draw(hp); // 摸等同于当前体力值的牌
  },
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    
    
d.insertAdjacentHTML('beforeend', `
<!-- 技能例子-->
<div id="skillExampleBtnContainer" style="
  position: absolute; 
  top: -20px; 
  left: 35px; 
  z-index: 999; 
">
  <!-- 技能例子弹出按钮（控制整个例子区域显示/隐藏） -->
  <button onclick="window.toggleSkillExample()" style="
    padding: 8px 30px; 
    background: transparent; 
    color: #00FFFF; 
    border: 1px solid #00FFFF; 
    border-radius: 8px; 
    cursor: pointer; 
    font-size: 15px; 
    line-height: 1.2; 
    font-weight: normal;
  ">
    技能例子
  </button>
</div>
<!-- 技能例子内容（默认隐藏，点击上方按钮弹出） -->
<div id="skillExampleContent" class="keyword-group" style="display: none; margin: 12px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden; position: relative; z-index: 998;">
  <!-- 标题栏：与其他折叠组标题样式一致 -->
  <div class="group-title" style="padding: 5px 12px; background: #008080; font-weight: normal; color: #fff; border-bottom: 1px solid #00FFFF; font-size: 12px; line-height: 1.5;">
          【制衡】&【绮琴】技能示例
  </div>
  <!-- 内容区-->
  <div class="group-content" style="padding: 8px; background: rgba(0,0,0,0.7); font-size: 14px; line-height: 1.5;">
    <div class="section">
      <!-- 【制衡】技能示例 -->
      <div class="example" style="display: block; margin: 10px 0; padding: 8px; border-left: none; background: rgba(0,0,0,0.3);">
        <p><strong>【制衡】技能描述</strong></p>
        <p>出牌阶段限一次，你可以弃置任意一张牌，然后摸等量的牌。</p>
        <!-- 展开/收起代码按钮（点击直接切换状态，无需划到最下） -->
        <button onclick="window.toggleSkillCode('zhihengCode')" style="
          margin-top: 8px; 
          padding: 5px 15px; 
          background: transparent; 
          color: #00FFFF; 
          border: 1px solid #00FFFF; 
          border-radius: 4px; 
          cursor: pointer; 
          font-size: 14px; 
          line-height: 1.5;
        ">
          展开代码
        </button>
        <!-- 代码内容（默认隐藏） -->
        <div id="zhihengCode" class="tutorial-content" style="display: none; margin: 8px; padding: 8px; background: rgba(0,0,0,0.8); border-radius: 4px; font-size: 13px; line-height: 1.4;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto; margin: 0; padding: 6px; background: transparent;">
//以下是本人粗逻辑思维：例子【制衡】
skill={
       audio: 2,// 技能配音配置
    audioname: ["gz_jun_sunquan"],// 特定角色专属配音标识如：角色+"ID"
    
    "audioname2": {
        "xin_simayi": "jilue_zhiheng",
    },// 其他扩展角色也一样：角色"xin_simayi"（如“新司马懿”）使用此技能时，调用“jilue_zhiheng”标识对应的专属配音
    
    mod: {    // mod被动效果：调整AI选择装备的决策优先级（仅影响AI行为，不主动触发技能效果）
        // AI选择装备时的优先级计算函数（AI判断是否选择某装备时触发）
        // 参数说明：
        // - player：当前持有装备的角色对象
        // - card：待选择的装备牌对象
        // - num：装备原有的选择优先级数值
        
        aiOrder(player, card, num) {
                  // 过滤无效情况：优先级≤0、非卡牌、非装备牌，直接返回原优先级
            if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") return num;
                // 获取玩家当前对应部位的已装备牌（如选武器时，获取当前武器）
            let eq = player.getEquip(get.subtype(card));
               // 比较新装备与现有装备的价值差：若差值＜max(1.2, 6-玩家当前体力)，返回0（AI放弃选择该装备）
            if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) return 0;
        },
    },
      // 锁定技标签：false（非锁定技，需玩家手动点击发动，不强制触发）
    locked: false,
     // 技能主动发动时机："phaseUse"（仅在玩家的出牌阶段点击发动）
    enable: "phaseUse",
    // 每回合发动次数限制：1次（每回合仅能主动发动1次，不可重复使用）
    usable: 1,
    // 可选择牌的区域："he"（仅允许从手牌区（h）+装备区（e）选择牌）
    position: "he",
    // 选牌过滤条件：true（无额外限制，所有符合区域的牌均可被选择）
    filterCard: true,
    // 选择牌数量范围：[1, Infinity]（最少选择1张牌，最多无上限，支持弃置任意张符合条件的牌）
    selectCard: [1,Infinity],
    // 技能发动提示文本：玩家选择牌时显示，告知技能效果“弃置任意张牌并摸等量的牌”
    prompt: "弃置任意张牌并摸等量的牌",
    
    
    // AI选牌判断逻辑（决定AI优先选择哪些牌发动技能）
    // 参数card：待AI判断是否选择的牌对象
    check(card) {
        // 获取当前触发技能事件的角色（即技能发动者）
        let player = _status.event.player;
        // 若牌处于装备区（position="e"），进一步判断装备类型
        if (get.position(card) == "e") {
            // 获取装备的子类型（如equip2=防具、equip3=防御马等）
            let subs = get.subtypes(card);
            // 若为防具（equip2）或防御马（equip3），返回“玩家当前体力 - 牌价值”作为AI选牌依据
            if (subs.includes("equip2") || subs.includes("equip3")) return player.getHp() - get.value(card);
        }
        // 非指定装备/手牌时，返回“6 - 牌价值”作为依据（牌价值越低，返回值越高，AI越优先选择）
        return 6 - get.value(card);
    },
    // 技能核心效果（异步执行，处理技能发动后的实际逻辑）
    // 参数说明：
    // - event：技能事件对象，含玩家选择的牌列表（event.cards）
    // - trigger：技能触发相关数据对象
    // - player：技能发动者角色对象
    async content(event, trigger, player) {
        // 核心效果：玩家摸取与弃置牌数量相等的牌（event.cards.length为弃置牌总数）
        player.draw(event.cards.length);
    },
    
    
    // AI行为配置（控制AI是否发动技能、选择目标等决策）
    ai: {
        // 技能发动优先级：1（数值越大，AI越优先发动，参考卡牌优先级：拆9、顺7、杀4）
        order: 1,
        // AI收益判断：
        // - result.player: 1（对技能发动者的收益值为1，正收益，AI倾向主动发动）
        result: {
            player: 1,
        },
        // 技能嘲讽值：1.5（数值越大，AI控制的敌方越容易优先攻击该技能持有者，默认嘲讽值为1）
        threaten: 1.5,
    },
    // 技能内部触发优先级：0（多技能同时机触发时，数值越大越先执行，默认0）
    "_priority": 0,
}
</pre>
                  <!-- 保留底部收起按钮，满足两种收起方式 -->
                  <div style="text-align: center; margin-top: 8px;">
                    <span onclick="window.hideSkillCode('zhihengCode')" style="color: #00FFFF; cursor: pointer; text-decoration: underline; font-size: 14px;">
                      点击收起代码
                    </span>
                  </div>
                </div>
              </div>

      <!-- 【绮琴】技能示例 -->
      <div class="example" style="display: block; margin: 10px 0; padding: 8px; border-left: none; background: rgba(0,0,0,0.3);">
        <p><strong>【绮琴】技能描述</strong></p>
        <p>游戏开始时，你将所有的手牌标记为“琴”，你的琴牌不作为手牌上限，准备阶段你获得全部弃牌堆内的“琴”牌。</p>
        <!-- 展开/收起代码按钮（点击直接切换状态，无需划到最下） -->
        <button onclick="window.toggleSkillCode('qiqinCode')" style="
          margin-top: 8px; 
          padding: 5px 15px; 
          background: transparent; 
          color: #00FFFF; 
          border: 1px solid #00FFFF; 
          border-radius: 4px; 
          cursor: pointer; 
          font-size: 14px; 
          line-height: 1.5;
        ">
          展开代码
        </button>
        <!-- 代码内容（默认隐藏） -->
        <div id="qiqinCode" class="tutorial-content" style="display: none; margin: 8px; padding: 8px; background: rgba(0,0,0,0.8); border-radius: 4px; font-size: 13px; line-height: 1.4;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto; margin: 0; padding: 6px; background: transparent;">
skill={
    // 配音配置：技能发动时配音路径
    audio: 2,
    // 配音角色关联模板：［ID］
    audioname: ["yue_daqiao"],
    // 触发时机场景
    trigger: {
        global: "phaseBefore", // 全局触发：任意角色回合开始前（影响所有角色）
        player: "enterGame"   // 个人触发：当前技能拥有者进入游戏时（仅技能持有者触发）
    },
    // 触发条件过滤：限制技能仅在特定条件下生效
    filter: function (event, player) {
        // 条件1：若触发事件类型不是"phase"（回合相关事件），则生效；
        // 条件2：若为回合事件，则仅在游戏第0阶段（初始阶段）生效，否则后续回合重复触发卡死。
        return event.name != "phase" || game.phaseNumber == 0;
    },
    // 锁定技标记：true表示技能为锁定技，强制触发，无需玩家手动选择是否发动
    forced: true,
    // 技能核心效果执行：玩家进入游戏或特定时机触发
    content: function () {
        // 1. 获取当前技能持有者的所有手牌（"h"代表手牌区）
        let cards = player.getCards("h");
        // 2. 给获取到的手牌添加专属标记"dcqiqin_tag"，用于后续mod效果识别（标记牌的属性）
        player.addGaintag(cards, "dcqiqin_tag");
        // 3. 自动标记管理：将带"dcqiqin_tag"的牌与"dcqiqin"技能关联，便于后续追踪和操作
        player.markAuto("dcqiqin", cards);
    },
    // 技能组关联：将当前技能归入"dcqiqin_restore"技能组，与子技能"restore"联动
    group: "dcqiqin_restore",
    // 子技能配置：技能的分支效果，包含标记管理和恢复效果
    subSkill: {
        // 子技能-标记管理（基础配置，无具体触发逻辑，仅用于属性关联）
        tag: {
            sub: true,               // 子技能标识：true表示该模块为子技能
            sourceSkill: "dcqiqin",  // 关联主技能：指定子技能归属的主技能ID
            "_priority": 0,          // 子技能优先级：0为默认，数值越大优先级越高
        },
        // 子技能-牌恢复效果（核心子技能，负责回收标记牌）
        restore: {
            audio: "dcqiqin",        // 子技能专属配音：使用"dcqiqin"对应的配音文件
            audioname: ["yue_daqiao"],// 子技能配音角色：与主技能一致，确保角色配音统一
            // 子技能触发时机：技能持有者的准备阶段开始时（phaseZhunbeiBegin对应准备阶段）
            trigger: {
                player: "phaseZhunbeiBegin",
            },
            // 子技能触发条件：判断场上是否存在可恢复的牌
            filter: function (event, player) {
                // 1. 获取所有存活角色（game.players）和阵亡角色（game.dead），组成目标列表
                const targets = game.players.slice().concat(game.dead);
                // 2. 检查目标列表中是否有角色的"dcqiqin"存储区（storage）内，存在D区（"d"标识）的牌
                return targets.some(target => target.getStorage("dcqiqin").filterInD("d").length);
            },
            // 子技能锁定技：强制触发，无需手动选择
            forced: true,
            // 子技能核心效果：回收标记牌并交给技能持有者
            content: function () {
                // 1. 获取所有存活+阵亡角色，确保无遗漏可回收的牌
                const targets = game.players.slice().concat(game.dead);
                // 2. 遍历所有目标，收集其"dcqiqin"存储区D区内的所有牌，合并为一个牌组
                const cards = targets.reduce((list, target) => list.addArray(target.getStorage("dcqiqin").filterInD("d")), []);
                // 3. 技能持有者获得收集到的牌，使用"gain2"动画类型，并给牌添加专属标记
                player.gain(cards, "gain2").gaintag.add("dcqiqin_tag");
            },
            sub: true,               // 子技能标识
            sourceSkill: "dcqiqin",  // 关联主技能
            "_priority": 0,          // 子技能优先级
        },
    },
    // mod被动效果：技能的被动属性修改，无需触发，持续生效
    mod: {
        // 被动效果1：带"dcqiqin_tag"的牌不计入手牌上限
        ignoredHandcard: function (card, player) {
            // 判断牌是否带有专属标记，是则返回true（不计入手牌上限）
            if (card.hasGaintag("dcqiqin_tag")) return true;
        },
        // 被动效果2：弃牌阶段（phaseDiscard）时，带"dcqiqin_tag"的牌不可被弃置
        cardDiscardable: function (card, player, name) {
            // 条件1：当前阶段为弃牌阶段；条件2：牌带有专属标记；满足则返回false（不可弃置）
            if (name == "phaseDiscard" && card.hasGaintag("dcqiqin_tag")) return false;
        },
    },
    // 主技能优先级：0为默认，数值越大，同时机下技能发动优先级越高
    "_priority": 0,
}
</pre>
                  <p style="margin-top: 8px; color: #fff; font-size: 13px;">
                    <strong>注意：</strong>若你想把标记显示为自定义文字或符号，需在文件下方的<code>translate: { }</code>内定义，示例：<code>"mohua_mei": "初魔"</code> 或 <code>"mei_xintu": "信徒"</code>
                  </p>
                  <!-- 保留底部收起按钮，满足两种收起方式 -->
                  <div style="text-align: center; margin-top: 8px;">
                    <span onclick="window.hideSkillCode('qiqinCode')" style="color: #00FFFF; cursor: pointer; text-decoration: underline; font-size: 14px;">
                      点击收起代码
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`);



    
    
    

    //<!--  ---------------------- 常见技能错误区 ---------------------- -->
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'common_mistakes')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      常见技能错误区 <span class="toggle-icon">+</span>
    </div>
    <div id="common_mistakes" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <h3>一：触发视角混淆（高频错误）</h3>
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #FF4500; background: rgba(0,0,0,0.3);">
          <p><strong>错误现象</strong>：技能描述“你造成伤害后摸1张牌”，实际触发时不生效或触发时机错误。</p>
          <p><strong>错误原因</strong>：混淆「source」和「target」视角——造成伤害时，“你”是伤害来源，应使用「source」视角，却误写为「target」（「target」仅用于“你被选为目标”场景）。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            错误写法 vs 正确写法 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
// 错误写法：用target视角监听“造成伤害”（仅“被选为目标”用target）
{
  trigger: {
    target: "damageSource" // 错误：target视角不对应“造成伤害”场景
  },
  content: function() {
    player.draw();
  }
}

// 正确写法：用source视角监听“造成伤害”
{
  trigger: {
    source: "damageSource" // 正确：source视角对应“你为来源”的场景（如造成伤害）
  },
  content: function() {
    player.draw();
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">二：异步函数遗漏「await」（逻辑错误）</h3>
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #FF4500; background: rgba(0,0,0,0.3);">
          <p><strong>错误现象</strong>：技能“摸1张牌后，手牌≥3则获护甲”，摸牌后手牌达标却不触发护甲（如原2张牌摸1张后为3张，仍不触发）。</p>
          <p><strong>错误原因</strong>：异步content函数中，执行「draw()」「recover()」等状态修改操作时，未加「await」，导致后续代码用“修改前的旧状态”判断。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            错误写法 vs 正确写法 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
// 错误写法：未加await，draw()未结算就判断手牌数
async content(event, trigger, player) {
  player.draw(1); // 错误：无await，状态未更新
  if (player.countCards("h") >= 3) { // 用的是摸牌前的手牌数（如原2张，仍判断为2）
    player.changeHujia(1);
  }
}

// 正确写法：加await等待状态结算
async content(event, trigger, player) {
  await player.draw(1); // 正确：等待摸牌结算，状态更新
  if (player.countCards("h") >= 3) { // 用摸牌后的新状态（2+1=3，触发护甲）
    await player.changeHujia(1);
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">三：filter函数未正确返回布尔值（触发失效）</h3>
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #FF4500; background: rgba(0,0,0,0.3);">
          <p><strong>错误现象</strong>：技能加了filter条件（如“手牌＜4才能发动”），但实际无论手牌多少都能触发/都不能触发。</p>
          <p><strong>错误原因</strong>：filter函数遗漏「return true/false」，或逻辑写反（如“手牌≥4返回true”却想限制手牌＜4）。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            错误写法 vs 正确写法 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
// 错误写法1：遗漏return，filter默认返回undefined（视为false，技能不触发）
filter: function(event, player) {
  player.countCards("h") < 4; // 错误：没写return
}

// 错误写法2：逻辑写反（手牌≥4返回true，与需求相反）
filter: function(event, player) {
  if (player.countCards("h") >= 4) return true; // 错误：想限制“手牌＜4”，却写反条件
  return false;
}

// 正确写法：明确返回布尔值，逻辑与需求一致
filter: function(event, player) {
  if (player.countCards("h") >= 4) return false; // 手牌≥4时不发动
  return true; // 手牌＜4时发动
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">四：storage未初始化（数据报错）</h3>
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #FF4500; background: rgba(0,0,0,0.3);">
          <p><strong>错误现象</strong>：技能用storage存目标角色（如“每名角色限一次”），控制台报错「Cannot read property 'push' of undefined」。</p>
          <p><strong>错误原因</strong>：未在init函数中初始化storage为数组/对象，直接调用「player.storage.xxx.push()」导致报错。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            错误写法 vs 正确写法 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
// 错误写法：未初始化storage，直接push
{
  // 遗漏init函数，storage.cy_limitTarget未定义
  enable: "phaseUse",
  filterTarget: function(card, player, target) {
    return !player.storage.cy_limitTarget.includes(target); // 错误：storage未初始化，无法调用includes
  },
  content: function() {
    player.storage.cy_limitTarget.push(target); // 错误：Cannot push to undefined
  }
}

// 正确写法：在init中初始化storage为数组
{
  init: function(player) {
    player.storage.cy_limitTarget = []; // 正确：初始化空数组
  },
  enable: "phaseUse",
  filterTarget: function(card, player, target) {
    return !player.storage.cy_limitTarget.includes(target); // 正常调用
  },
  content: function() {
    player.storage.cy_limitTarget.push(target); // 正常push
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">五：配音路径/文件名错误（无声音）</h3>
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #FF4500; background: rgba(0,0,0,0.3);">
          <p><strong>错误现象</strong>：技能加了audio配置，但发动时无配音，控制台无报错或提示“音频文件不存在”。</p>
          <p><strong>错误原因</strong>：1. 扩展内配音未写「ext:扩展名:」前缀；2. 文件名不是“技能ID+数字”（如技能ID为cy_mo，配音应为cy_mo1.mp3）；3. 路径写错（如文件夹名拼写错误）。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            错误写法 vs 正确写法 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
// 错误写法1：扩展内配音遗漏ext:前缀（默认找本体audio文件夹，找不到）
{
  enable: "phaseUse",
  audio: "cy_mo:2" // 错误：扩展内配音需写ext:扩展名:
}

// 错误写法2：文件名不匹配（技能ID为cy_mo，配音名写mo1.mp3，不匹配）
{
  enable: "phaseUse",
  audio: "ext:myExt:2" // 错误：配音文件应为cy_mo1.mp3，却写mo1.mp3
}

// 正确写法：扩展内配音加前缀，文件名与技能ID一致
{
  enable: "phaseUse",
  audio: "ext:myExt:2" // 正确：扩展名为myExt，配音文件为cy_mo1.mp3、cy_mo2.mp3
}

// 正确写法2：调用本体配音（无需ext前缀，直接写技能ID）
{
  enable: "phaseUse",
  audio: ["yingzi", "yingzi"] // 正确：调用本体“英姿”技能配音
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>

        <h3 style="margin-top: 20px;">六：mod技能参数混淆（效果异常）</h3>
        <div class="example" style="display: block; margin: 15px 0; padding: 10px; border-left: 3px solid #FF4500; background: rgba(0,0,0,0.3);">
          <p><strong>错误现象</strong>：想做“攻击距离+1”（如马术），却变成“防御距离+1”；或想限制“不能弃置杀”，却限制了“不能使用杀”。</p>
          <p><strong>错误原因</strong>：混淆mod函数参数——1. 「globalFrom」（进攻距离）和「globalTo」（防御距离）搞反；2. 「cardDiscardable」（弃置限制）和「cardEnabled」（使用限制）搞混。</p>
          <div class="tutorial-toggle" onclick="window.toggleTutorial(this)" style="margin-top: 5px; color: #00FFFF; cursor: pointer;">
            错误写法 vs 正确写法 [点击展开]
            <div class="tutorial-content" style="display: none; margin: 10px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 4px;">
<pre class="hljs language-javascript" style="user-select: text; -webkit-user-select: text; pointer-events: auto;">
// 错误写法1：想加进攻距离，却用了globalTo（防御距离）
mod: {
  globalTo: function(from, to, distance) { // 错误：globalTo是防御距离
    return distance - 1; // 实际效果：别人对你的距离+1（防御距离+1）
  }
}

// 正确写法1：进攻距离+1用globalFrom
mod: {
  globalFrom: function(from, to, distance) { // 正确：globalFrom是进攻距离
    return distance - 1; // 效果：你对别人的距离-1（即进攻距离+1）
  }
}

// 错误写法2：想限制“不能弃置杀”，却用了cardEnabled（使用限制）
mod: {
  cardEnabled: function(card, player) { // 错误：cardEnabled是使用限制
    if (card.name == "sha") return false; // 实际效果：不能使用杀
  }
}

// 正确写法2：限制弃置杀用cardDiscardable
mod: {
  cardDiscardable: function(card, player) { // 正确：cardDiscardable是弃置限制
    if (card.name == "sha") return false; // 效果：不能弃置杀
  }
}
</pre>
                  <div style="text-align: center; margin-top: 10px;">
                    <span onclick="window.toggleTutorial(this.closest('.tutorial-toggle'))" style="color: #00FFFF; cursor: pointer; text-decoration: underline;">
                      点击文本收起［长按复制］
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

// ---------------------- 暂未更新板块 ----------------------
d.insertAdjacentHTML('beforeend', `
  <div class="keyword-group" style="margin: 15px 0; border: 2px solid #333; border-radius: 8px; overflow: hidden;">
    <div class="group-title" 
         onclick="window.toggleKeywordGroup(this, 'unupdated')"
         style="padding: 8px 12px; background: #2F4F4F; cursor: pointer; font-weight: bold; color: #fff; border-bottom: 1px solid #008080;"
    >
      暂未更新 <span class="toggle-icon">+</span>
    </div>
    <div id="unupdated" class="group-content" style="display: none; padding: 10px; background: rgba(0,0,0,0.7);">
      <div class="section">
        <p>等待苍宇佬更新中…</p>
      </div>
    </div>
  </div>
`);


    lastFragment.appendChild(caption);
  });

// 4. 工具函数挂载到window（确保HTML能调用）
window.toggleKeywordGroup = function(element, groupId) {
  const content = document.getElementById(groupId);
  const icon = element.querySelector('.toggle-icon');
  if (!content || !icon) return;
  // 切换显示状态
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
  icon.textContent = content.style.display === 'block' ? '-' : '+';
};

window.toggleTutorial = function(element) {
  if (!element) return;
  const content = element.querySelector('.tutorial-content');
  const textNode = element.childNodes[0];
  if (!content || !textNode) return;
  // 切换教程内容显示
  if (content.style.display === 'none') {
    content.style.display = 'block';
    textNode.textContent = '技能教程 [点击关闭]';
  } else {
    content.style.display = 'none';
    textNode.textContent = '技能教程 [点击展开]';
  }
};

// 控制整个技能例子区域的显示/隐藏
window.toggleSkillExample = function() {
  const content = document.getElementById('skillExampleContent');
  if (!content) return;
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
};

// 新增：切换代码显示/隐藏（点击“展开代码”按钮即可收起，无需划到最下）
window.toggleSkillCode = function(codeId) {
  const codeContent = document.getElementById(codeId);
  const btn = document.querySelector(`[onclick="window.toggleSkillCode('${codeId}')"]`);
  if (!codeContent || !btn) return;
  
  // 切换代码块显示状态
  if (codeContent.style.display === 'none') {
    codeContent.style.display = 'block';
    btn.textContent = '收起代码'; // 按钮文本同步切换
  } else {
    codeContent.style.display = 'none';
    btn.textContent = '展开代码'; // 按钮文本同步切换
  }
};

// 保留：底部“点击收起代码”的单独收起功能
window.hideSkillCode = function(codeId) {
  const codeContent = document.getElementById(codeId);
  const btn = document.querySelector(`[onclick="window.toggleSkillCode('${codeId}')"]`);
  if (!codeContent || !btn) return;
  
  codeContent.style.display = 'none';
  btn.textContent = '展开代码'; // 同步更新上方按钮文本
};

// 修复重复定义的toggleSkillExample函数（删除重复逻辑）
// 5. 代码高亮初始化（兼容原逻辑）
setTimeout(() => {
  if (window.highlightCodeBlocks && typeof window.highlightCodeBlocks === 'function') {
    window.highlightCodeBlocks();
  }
}, 100);

// 6. 更新分页（复用Searcher实例方法）
if (searcher.fragmentList.length > 0 && searcher.updatePage) {
  searcher.updatePage(1);
}
}