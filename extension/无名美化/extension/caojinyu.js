import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function caojinyu() {
  Object.assign(lib.skill.yuqi, {
    intro: {
      content: function (storage, player) {
        var info = lib.skill.yuqi.getInfo(player);
        return '<div class="text center">距离：' + info[0] + '<br>观看牌堆顶：' + info[1] + '<br>给别人：' + info[2] + '<br>给自己：' + info[3] + '</div>'
      },
    },
  });
  Object.assign(lib.skill.shanshen, {
    content: function () {
      "step 0";
      event.goon = !player.hasAllHistory("sourceDamage", function (evt) {
        return evt.player == trigger.player;
      });
      var info = lib.skill.yuqi.getInfo(player);
      event.list = ["距离", "观看牌堆", "交给别人", "交给自己"];
      var list = event.list.filter((i) => {
        return info[event.list.map((item) => item).indexOf(i)] < 5;
      });
      if (list.length)
        player
          .chooseControl(list, "cancel2")
          .set("prompt", get.prompt("shanshen"))
          .set(
            "prompt2",
            "令距离[" +
              info[0] +
              "],观看牌堆顶[" +
              info[1] +
              "]张牌,[" +
              info[2] +
              "]张交给受伤角色,[" +
              info[3] +
              "]张交给自己中的一个数字+2" +
              (event.goon ? "并回复1点体力" : "")
          )
          .set("ai", function () {
            var player = _status.event.player,
              info = lib.skill.yuqi.getInfo(player);
            if (
              info[0] < info[3] &&
              game.countPlayer(function (current) {
                return get.distance(player, current) <= info[0];
              }) < Math.min(3, game.countPlayer()) &&
              info[0] < 5
            )
              return "距离";
            if (info[3] < info[1] - 1 && info[3] < 5) return "交给自己";
            if (info[1] < 5 && info[1] < 5) return "观看牌堆";
            if (
              info[0] < 5 &&
              game.hasPlayer(function (current) {
                return (
                  current != player && get.distance(player, current) > info[0]
                );
              })
            )
              return "距离";
            if (info[2] < 5) return "交给别人";
            return "cancel2";
          });
      else event.finish();
      "step 1";
      if (result.control != "cancel2") {
        player.logSkill("shanshen", trigger.player);
        var num = event.list.map((item) => item).indexOf(result.control);
        var list = lib.skill.yuqi.getInfo(player);
        list[num] = Math.min(5, list[num] + 2);
        game.log(player, "将", result.control, "数字改为", "#y" + list[num]);
        player.markSkill("yuqi");
        if (event.goon) player.recover();
      }
    },
  });
  //娴静标记
  Object.assign(lib.skill.xianjing, {
    content: function () {
      "step 0";
      event.list = ["距离", "观看牌堆", "交给别人", "交给自己"];
      var info = lib.skill.yuqi.getInfo(player);
      var list = event.list.filter((i) => {
        return info[event.list.map((item) => item).indexOf(i)] < 5;
      });
      if (list.length)
        player
          .chooseControl(list, "cancel2")
          .set("prompt", get.prompt("xianjing"))
          .set(
            "prompt2",
            "令距离[" +
              info[0] +
              "],观看牌堆顶[" +
              info[1] +
              "]张牌,[" +
              info[2] +
              "]张交给受伤角色,[" +
              info[3] +
              "]张交给自己中的一个数字+1"
          )
          .set("ai", function () {
            var player = _status.event.player,
              info = lib.skill.yuqi.getInfo(player);
            if (
              info[0] < info[3] &&
              game.countPlayer(function (current) {
                return get.distance(player, current) <= info[0];
              }) < Math.min(3, game.countPlayer()) &&
              info[0] < 5
            )
              return "距离";
            if (info[3] < info[1] - 1 && info[3] < 5) return "交给自己";
            if (info[1] < 5 && info[1] < 5) return "观看牌堆";
            if (
              info[0] < 5 &&
              game.hasPlayer(function (current) {
                return (
                  current != player && get.distance(player, current) > info[0]
                );
              })
            )
              return "距离";
            if (info[2] < 5) return "交给别人";
            return "cancel2";
          });
      else event.finish();
      "step 1";
      if (result.control != "cancel2") {
        player.logSkill("xianjing");
        var num = event.list.map((item) => item).indexOf(result.control);
        var list = lib.skill.yuqi.getInfo(player);
        list[num] = Math.min(5, list[num] + 1);
        game.log(player, "将", result.control, "数字改为", "#y" + list[num]);
        player.markSkill("yuqi");
        if (player.isDamaged()) event.finish();
      } else event.finish();
      "step 2";
      var info = lib.skill.yuqi.getInfo(player);
      var list = event.list.filter((i) => {
        return info[event.list.map((item) => item).indexOf(i)] < 5;
      });
      if (list.length)
        player
          .chooseControl(list, "cancel2")
          .set("prompt", get.prompt("xianjing"))
          .set(
            "prompt2",
            "令距离[" +
              info[0] +
              "],观看牌堆顶[" +
              info[1] +
              "]张牌,[" +
              info[2] +
              "]张交给受伤角色,[" +
              info[3] +
              "]张交给自己中的一个数字+1"
          )
          .set("ai", function () {
            var player = _status.event.player,
              info = lib.skill.yuqi.getInfo(player);
            if (
              info[0] < info[3] &&
              game.countPlayer(function (current) {
                return get.distance(player, current) <= info[0];
              }) < Math.min(3, game.countPlayer()) &&
              info[0] < 5
            )
              return "距离";
            if (info[3] < info[1] - 1 && info[3] < 5) return "交给自己";
            if (info[1] < 5 && info[1] < 5) return "观看牌堆";
            if (
              info[0] < 5 &&
              game.hasPlayer(function (current) {
                return (
                  current != player && get.distance(player, current) > info[0]
                );
              })
            )
              return "距离";
            if (info[2] < 5) return "交给别人";
            return "cancel2";
          });
      else event.finish();
      "step 3";
      if (result.control != "cancel2") {
        var num = event.list.map((item) => item).indexOf(result.control);
        var list = lib.skill.yuqi.getInfo(player);
        list[num] = Math.min(5, list[num] + 1);
        game.log(player, "将", result.control, "数字改为", "#y" + list[num]);
        player.markSkill("yuqi");
      }
    },
  });
}
