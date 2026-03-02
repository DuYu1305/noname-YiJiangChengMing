import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function xinzhangyi() {
  window._XINZHANGYI = {
    mouyi_zhangyi: {
			name: "../../../无名美化/animation/xinzhangyi/SS_zhangni_sb_jineng",
			scale: 0.8,
		},
  };
  Object.assign(lib.skill.xinwurong, {
    content: function () {
      'step 0';
      player.chooseToDuiben(target)
        .set("title", "谋弈")
        .set("namelist", ["反抗", "归顺", "镇压", "安抚"])
        .set("translationList", [`对方选择镇压：${get.translation(player)}对你造成1点伤害，然后其摸1张牌<br>对方选择安抚：${get.translation(player)}受到1点伤害，然后其摸2张牌`, `对方选择镇压：${get.translation(player)}获得你1张牌，然后其交给你2张牌<br>对方选择安抚：你须交给${get.translation(player)}两张牌（若你牌数不足2张，则改为其令你跳过你下个摸牌阶段）`, `对方选择反抗：你对${get.translation(target)}造成1点伤害，然后你摸1张牌<br>对方选择归顺：你获得${get.translation(target)}1张牌，然后你交给其2张牌`, `对方选择反抗：你受到1点伤害，然后你摸2张牌<br>对方选择归顺：${get.translation(target)}须交给你两张牌（若其牌数不足两张，则改为令其跳过其下个摸牌阶段）`])
        .set("ai", button => 1 + Math.random());
      dcdAnim.loadSpine(window._XINZHANGYI.mouyi_zhangyi.name, "skel");
      'step 1';
      var action;
      if (result.bool) {
        if (result.player == 'db_def1') {
          action = 'play3';
          window._XINZHANGYI.mouyi_zhangyi.action = action;
          game.playAudio(`../../extension/无名美化/audio/mouyi/effect_jizhitu_tiequantongzhi_1.mp3`);
          //game.playAudio('../audio/skill/sbduanliang2.mp3');
          dcdAnim.playSpine(window._XINZHANGYI.mouyi_zhangyi, {
            speed: 0.8,
            scale: 1,
            x: [0, 0.5],
            y: [0, 0.5],
          });
          game.delay(3.5);
          target.damage();
          player.draw();
          event.finish();
        } else {
          action = 'play2';
          window._XINZHANGYI.mouyi_zhangyi.action = action;
          game.playAudio(`../../extension/无名美化/audio/mouyi/effect_jizhitu_hanmanyijia_1.mp3`);
          //game.playAudio('../audio/skill/sbduanliang2.mp3');
          dcdAnim.playSpine(window._XINZHANGYI.mouyi_zhangyi, {
            speed: 0.8,
            scale: 1,
            x: [0, 0.5],
            y: [0, 0.5],
          });
          game.delay(3.5);
          var cards = target.getCards('he');
          if (cards.length < 2) {
            target.skip('phaseDraw');
            target.addTempSkill('xinwurong_skip', { player: 'phaseDrawSkipped' });
            event.finish();
          }
          else if (cards.length == 2) event._result = { bool: true, cards: cards };
          else target.chooseCard('怃戎：交给' + get.translation(player) + '两张牌', 2, true, 'he');
        };
      } else {
        if (result.player == 'db_def1') {
          action = 'play4';
          window._XINZHANGYI.mouyi_zhangyi.action = action;
          game.playAudio(`../../extension/无名美化/audio/mouyi/effect_jizhitu_xianzubiyou_1.mp3`);
          //game.playAudio('../audio/skill/sbduanliang2.mp3');
          dcdAnim.playSpine(window._XINZHANGYI.mouyi_zhangyi, {
            speed: 0.8,
            scale: 1,
            x: [0, 0.5],
            y: [0, 0.5],
          });
          game.delay(3.5);
          player.gainPlayerCard(target, 'he', true);
          event.goto(3);
        } else {
          action = 'play1';
          window._XINZHANGYI.mouyi_zhangyi.action = action;
          game.playAudio(`../../extension/无名美化/audio/mouyi/effect_jizhitu_manzujiegan_1.mp3`);
          //game.playAudio('../audio/skill/sbduanliang2.mp3');
          dcdAnim.playSpine(window._XINZHANGYI.mouyi_zhangyi, {
            speed: 0.8,
            scale: 1,
            x: [0, 0.5],
            y: [0, 0.5],
          });
          game.delay(3.5);
          player.damage();
          player.draw(2);
          event.finish();
        };
      };
      'step 2';
      if (result.bool) player.gain(result.cards, target, 'giveAuto');
      event.finish();
      'step 3';
      var cards = player.getCards('he');
      if (!cards.length) event.finish();
      else if (cards.length <= 2) event._result = { bool: true, cards: cards };
      else player.chooseCard('怃戎：交给' + get.translation(target) + '两张牌', 2, true, 'he');
      'step 4';
      if (result.bool) target.gain(result.cards, player, 'giveAuto');
    },
  });
}
