import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export function initxuanjiangjiemianCss() {
    lib.init.css(lib.assetURL + "extension/美化补充/css", "xuanjiangjiemian");
}
export function xuanjiangjiemian() {
    const isDoudizhuCasualMode = function() {
        if (lib.config.mode != "doudizhu") return false;
        const subMode = (_status && _status.mode) || (lib.configOL && lib.configOL.doudizhu_mode) || get.config("doudizhu_mode");
        return subMode == "normal";
    };
    const doudizhuSeatClasses = ["huanle-ddz-2-xia", "huanle-ddz-3-xia", "huanle-ddz-3-shang", "huanle-ddz-zhu-center"];
    const clearDoudizhuSeatClasses = function() {
        if (!game || !game.players) return;
        let targets = game.players.slice(0);
        if (game.dead && game.dead.length) targets = targets.concat(game.dead);
        targets.forEach(target => {
            if (!target || !target.classList) return;
            doudizhuSeatClasses.forEach(cls => target.classList.remove(cls));
        });
    };
    const applyDoudizhuSeatClasses = function() {
        if (!game || !game.me || !game.zhu) {
            clearDoudizhuSeatClasses();
            return;
        }
        var xia = game.me.nextSeat || game.me.next;
        var shang = game.me.previousSeat || game.me.previous;
        if (!xia || !shang) {
            clearDoudizhuSeatClasses();
            return;
        }
        clearDoudizhuSeatClasses();
        if (shang == game.zhu) {
            xia.classList.add("huanle-ddz-2-xia");
            game.zhu.classList.add("huanle-ddz-zhu-center");
        } else if (xia == game.zhu) {
            xia.classList.add("huanle-ddz-3-xia");
            shang.classList.add("huanle-ddz-3-shang");
            game.zhu.classList.add("huanle-ddz-zhu-center");
        }
    };
    if (!window._mhbcDoudizhuSeatLayoutSyncInited) {
        window._mhbcDoudizhuSeatLayoutSyncInited = true;
        window._mhbcDoudizhuSeatLayoutSyncTimer = setInterval(function() {
            if (!lib || !lib.config) return;
            var enabled = lib.config.extension_美化补充_doudizhuxuanjiangjiemian && lib.config.extension_美化补充_doudizhuxuanjiangjiemian != "off";
            if (!enabled || lib.config.mode != "doudizhu" || !isDoudizhuCasualMode()) {
                clearDoudizhuSeatClasses();
                return;
            }
            applyDoudizhuSeatClasses();
        }, 200);
    }
    // 转译双势力
    get.groupnature2 = function(infoitem) {
        var group = infoitem[1];
        if (infoitem[4] && infoitem[4][0] && infoitem[4][0].toString().indexOf('double') != -1) {
            let doublegroup = infoitem[4][0].toString().split(':').slice(1);
            group = doublegroup[0] + doublegroup[1];
        };
        return group;
    };
    // 斗地主选将界面（仅休闲模式）
    if (
        lib.config.extension_美化补充_doudizhuxuanjiangjiemian &&
        lib.config.extension_美化补充_doudizhuxuanjiangjiemian == "shousha" &&
        isDoudizhuCasualMode()
    ) {
        if (lib.config.mode == 'doudizhu') {
            // 直接检索手杀的斗地主豆子
            game.initHuanledou = function() {
                var bElement = document.getElementById('message-container');
                if (!bElement) {
                    var bElement = ui.create.div("#message-container", ui.window);
                    bElement.style.cssText = `
                        position: fixed;
                        left: 0;
                        top: 0;
                        right: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        z-index: 3001;
                        text-shadow: none;
                    `;
                };
                var text = ui.create.div();
                text.classList.add("message-container-text");
                text.style.cssText = `
                    display: none;
                    position: absolute;
                    top: -3.5px;
                    left: 70px;
                    color: white;
                    font-size: 16.5px;
                    font-family: 'shousha';
                    font-weight: 450;
                    text-shadow: rgb(43, 31, 25) -1.7px 0px 2.5px, rgb(43, 31, 25) 0px -1.7px 2.5px, rgb(43, 31, 25) 1.7px 0px 2.5px, rgb(43, 31, 25) 0px 1.7px 2.5px;
                    z-index: 8;
                `;
                text.innerText = `本场叫价`;
                bElement.insertAdjacentElement('afterend', text);
                var icon = ui.create.div();
                icon.classList.add("message-container-icon");
                icon.style.cssText = `
                    display: none;
                    position: absolute;
                    width: 53px;
                    height: 42px;
                    scale: 0.6;
                    top: -15.5px;
                    left: 130px;
                    background-size: 100% 100%;
                    z-index: 8;
                `;
                icon.setBackgroundImage(lib.assetURL + "extension/美化补充/image/xuanjiangjiemian/huanledou_icon.png");
                bElement.insertAdjacentElement('afterend', icon);
                var douzi = ui.create.div();
                douzi.classList.add("message-container-douzi");
                douzi.style.cssText = `
                    display: none;
                    position: absolute;
                    top: -6px;
                    color: gold;
                    left: 176px;
                    font-size: 21px;
                    font-family: 'shousha';
                    font-weight: 900;
                    text-shadow: rgb(43 31 25) -1.7px 0px 2.5px, rgb(43 31 25) 0px -1.7px 2.5px, rgb(43 31 25) 1.7px 0px 2.5px, rgb(43 31 25) 0px 1.7px 2.5px;
                    z-index: 8;
                `;
                douzi.innerText = `100`;
                bElement.insertAdjacentElement('afterend', douzi);
            };
            game.showHuanledou = function() {
                try {
                    var bElement = document.getElementById('message-container');
                    if (!bElement) return;
                    var douzi = bElement.nextElementSibling;
                    if (douzi) douzi.style.display = "block";
                    var icon = bElement.nextElementSibling.nextElementSibling;
                    if (icon) icon.style.display = "block";
                    var text = bElement.nextElementSibling.nextElementSibling.nextElementSibling;
                    if (text) text.style.display = "block";
                } catch(error) {    };
            };
            game.jiaojia = function(a) {
                try {
                    var adiv = document.getElementById('arena');
                    if (!adiv) return;
                    var bElement = document.getElementById('message-container');
                    if (!bElement) return;
                    var nextElement = bElement.nextElementSibling;
                    if (nextElement && nextElement.innerText && typeof nextElement.innerText == 'string' && nextElement.innerText.indexOf('00') != -1) nextElement.innerText = a;
                } catch(error) {    };
            };
            game.dizhudou = function() {
                try {
                    var adiv = document.body;
                    if (!adiv) return;
                    var bElement = document.getElementById('statusbg');
                    if (!bElement) return;
                    var nextElement = bElement.nextElementSibling;
                    var nextElement1 = nextElement.nextElementSibling;
                    if (tipshow) tipshow.style.zIndex = 6;
                    if (nextElement && nextElement.innerText && typeof nextElement.innerText == 'string' && nextElement.innerText.indexOf('本场') != -1) {
                        nextElement.style.zIndex = 6;
                        if (nextElement.innerText == '本场叫价') nextElement.innerText = '本场底注';
                        else nextElement.innerText = '本场叫价';
                        return;
                    };
                    if (nextElement1 && nextElement1.innerText && typeof nextElement1.innerText == 'string' && nextElement1.innerText.indexOf('本场') != -1) {
                        nextElement1.style.zIndex = 6;
                        if (nextElement1.innerText == '本场叫价') nextElement1.innerText = '本场底注';
                        else nextElement1.innerText = '本场叫价';
                        return;
                    };
                } catch(error) {    };
            };
            window.dizhuqiangdu = { // 地主强度
                '5星':  ['re_xusheng','th_nanhualaoxian','shen_machao','shen_guojia','wanglang','xushao','re_liuzan','caojinyu','re_sunyi','zhangxuan','shen_zhangfei','dc_zhouxuān'],
                '4星': ['luotong','zhouchu','sunhanhua','th_sunhanhua','zerong','th_zhengxuan','shen_ganning','guanning','guozhao','zhouyi','puyuan','tenggongzhu','wufan','dukui','dc_luotong','th_lukai','re_fengfangnv','fengfang','jiakui','wolongfengchu','jin_zhouchu','yangbiao','quyi','ol_wangrong','dc_wangchang','db_wenyang','shen_zhangjiao'],
                '3星': ['ol_weiyan','re_zhonghui','xin_zhonghui','caoying','wangyuanji','qiaozhou','liuzan','xuyou','liuzhang','zhanglu','re_quyi','lijue','xurong','yj_ganning','shen_xunyu','caoshuang','zhaoxiang','caomao','re_nanhualaoxian','re_panshu','wangchang','miheng','re_pangdegong','re_wuyi','lvlingqi','zhangfen','guanhai','panshu','liubian','yuantanyuanshang','sb_zhouyu','jin_wangyuanji','shen_guanyu','sp_machao','wenyang','liangxing','re_wangyi','xin_caozhen','sp_maojie','caochun','zhugezhan','sb_huangzhong','zhanghu','shen_jiangwei','dongxie','niufu','yangzhi','dc_liuye','luyi','qinglang','sb_zhangfei','shen_sunce','tw_guohuai','clan_wuxian','dc_yanghu','zhujianping','zhaoang','caochong','sp_caiwenji','zhangyì','lvdai','yj_ganning','yj_xuhuang','mou_zhangfei'],
                '3星半': ['wangji','mou_xuhuang','sp_cuiyan','re_caocao','xin_lingtong','re_guojia','re_xunyu','re_dengai','re_zhangchunhua','zhonghui','caochong','feiyi','re_guanyu','maliang','zhangyì','zhouqun','lifeng','tw_jiangqing','re_huanggai','re_sunquan','re_sunce','zhoufang','yanjun','lingcao','beimihu','sp_yanghu','zhangzhongjing','sp_huangfusong','re_zuoci','re_caiwenji','xin_jushou','re_liru','caojie','sp_diaochan','sp_liuqi','shenpei','zhangji','liuyan','gongsunkang','liucheng','fanyufeng','yj_xuhuang','yj_huangzhong','dingshangwan','tw_shen_lvmeng','shamoke','shen_zhugeliang','shen_luxun','shen_taishici','ol_pangde','ol_jiangwei','re_zhuran','pangdegong','re_zhanghe','huaman','re_huaxiong','sb_huanggai','qinghegongzhu','re_lvbu','sp_zhaoyun','shen_zhangliao','yangyan','bianxi','wanniangongzhu','tengfanglan','xiahoujie','ol_yangyi','zhugeke','sb_sunquan','ol_maliang','sb_machao','sb_zhangjiao'],
            };
            game.chooseCharacterHuanle = function() { // 修改欢乐斗地主选将函数，包括但不限于进度条，倍率，左上角数字变化等
                ui.background.style.zIndex = '6';
                var next = game.createEvent('chooseCharacter', false);
                next.setContent(function() {
                    "step 0";
                    game.no_continue_game = true;
                    lib.init.onfree();
                    game.initHuanledou();
                    game.jiaojia(100);
                    game.dizhudou();
                    "step 1";
                    ui.arena.classList.add('choose-character');
                    // if (true) {
                    //     for (var i in lib.skill) {
                    //         if (lib.skill[i].changeSeat) {
                    //             lib.skill[i] = {};
                    //             if (lib.translate[i + '_info']) {
                    //                 lib.translate[i + '_info'] = '此模式下不可用';
                    //             }
                    //         }
                    //     }
                    // }
                    game.no_continue_game = true;
                    var i;
                    event.list = [];
                    event.list2 = [];
                    var list4 = [];
                    if (!event.map) event.map = {};
                    for (i in lib.characterReplace) {
                        var ix = lib.characterReplace[i];
                        for (var j = 0; j < ix.length; j++) {
                            if (lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                        };
                        if (ix.length) {
                            var name = ix.randomGet();
                            event.list.push(name);
                            if (game.recommendDizhu.contains(name)) event.list2.push(name);
                            list4.addArray(ix);
                        };
                    };
                    for (i in lib.character) {
                        if (list4.includes(i) || lib.filter.characterDisabled(i)) continue;
                        event.list.push(i);
                        if (game.recommendDizhu.contains(i)) event.list2.push(i);
                    };
                    event.list.randomSort();
                    _status.characterlist = event.list.slice(0);

                    event.controls = ['不叫', '一倍', '两倍', '三倍'];
                    for (var player of game.players) {
                        var id = player.playerid;
                        if (!event.map[id]) event.map[id] = [];
                        event.map[id].addArray(event.list2.randomRemove(1));
                        event.list.removeArray(event.map[id]);
                        event.map[id].addArray(event.list.randomRemove(4 - event.map[id].length));
                        event.list2.removeArray(event.map[id]);
                    };
                    event.listk = event.map[game.me.playerid].slice(0, 3);
                    event.dialog = ui.create.newdialog('', [event.listk, 'character'], '#chooseable');
                    for (let i = 0; i < event.listk.length; i++) {
                        for (j in window.dizhuqiangdu) {
                            if (window.dizhuqiangdu[j].indexOf(event.listk[i]) != -1) {
                                let k = ui.create.div('.dizhuqiangdu', ui.dialog.buttons[i]);
                                k.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/dizhuqiangdu/' + j + '.png');
                                break;
                            };
                        };
                    };
                    let zhuanshu = ui.create.div('.zhuanshu');
                    ui.create.div('.zhuanshubiao', zhuanshu);
                    zhuanshu.classList.add('button');
                    zhuanshu.classList.add('character');
                    let zhuanshu2 = ui.create.div('.zhuanshu');
                    ui.create.div('.zhuanshubiao', zhuanshu2);
                    zhuanshu2.classList.add('button');
                    zhuanshu2.classList.add('character');
                    let buts = ui.dialog.content.querySelector('.buttons');
                    if (buts) buts.appendChild(zhuanshu);
                    if (buts) buts.appendChild(zhuanshu2);
                    event.start = game.players.randomGet();
                    event.current = event.start;
                    game.delay(5);
                    ui.dizhutip = ui.create.div('.dizhutip', ui.arena);
                    ui.nmjindutiao = ui.create.div('.nmjindutiao', ui.arena);
                    ui.nmjindutiaox = ui.create.div('.nmjindutiaox', ui.nmjindutiao);
                    "step 2";
                    event.current.classList.add('glow_phase');
                    ui.nmjindutiaox.remove();
                    delete ui.nmjindutiaox;
                    ui.nmjindutiaox = ui.create.div('.nmjindutiaox', ui.nmjindutiao);
                    if (event.current == game.me) {
                        ui.dizhutip.innerHTML = '请选择押注倍数，叫3倍直接成为地主';
                    } else {
                        ui.dizhutip.innerHTML = '正在等待其他人压注';
                        game.delay(2);
                    };
                    event.current.chooseControl(event.controls).set('ai', function() {
                        return _status.event.getParent().controls.randomGet();
                    }).setContent(function() {
                        "step 0";
                        if (event.controls.length == 0) {
                            event.finish();
                            return;
                        };
                        if (event.isMine()) {
                            event.controlbars = [];
                            for (var i = 0; i < event.controls.length; i++) {
                                let cl = ui.create.control([event.controls[i]]);
                                cl.classList.add('dou');
                                cl.childNodes[0].setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/' + cl.innerText + '.png');
                                event.controlbars.push(cl);
                            };
                            game.pause();
                            game.countChoose();
                            event.choosing = true;
                        } else if (event.isOnline()) {
                            event.send();
                        } else {
                            event.result = 'ai';
                        };
                        "step 1";
                        if (event.result == 'ai') {
                            event.result = {};
                            if (event.ai) {
                                var result = event.ai(event.getParent(), player);
                                if (typeof result == 'number') event.result.control = event.controls[result];
                                else event.result.control = result;
                            } else event.result.control = event.controls[event.choice];
                        };
                        event.result.index = event.controls.indexOf(event.result.control);
                        event.choosing = false;
                        _status.imchoosing = false;
                        if (event.controlbar) event.controlbar.close();
                        if (event.controlbars) {
                            for (var i = 0; i < event.controlbars.length; i++) {
                                event.controlbars[i].close();
                            };
                        };
                        event.resume();
                    });
                    "step 3";
                    event.current.classList.remove('glow_phase');
                    event.current._control = result.control;
                    event.current.chat(result.control);
                    if (result.control == '三倍') {
                        game.jiaojia(300);
                        game.zhu = event.current;
                        return;
                    } else if (result.control != '不叫') {
                        event.controls.splice(0, event.controls.indexOf(result.control) + 1);
                        event.controls.unshift('不叫');
                        event.tempDizhu = event.current;
                        if (result.control == '两倍') game.jiaojia(200);
                    };
                    event.current = event.current.next;
                    if (event.current == event.start) {
                        game.zhu = event.tempDizhu || event.start.previous;
                    } else event.goto(2);
                    if (event.current == event.start.previous && !event.tempDizhu) event.controls.remove('不叫');
                    "step 4";
                    for (var player of game.players) {
                        player.identity = player == game.zhu ? 'zhu': 'fan';
                        player.showIdentity();
                    };
                    event.dialog.close();
                    event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
                    "step 5";
                    ui.nmjindutiaox.remove();
                    delete ui.nmjindutiaox;
                    if (true) {
                        //手动修改进入时的布局
                        var xia = game.me.nextSeat || game.me.next;
                        var shang = game.me.previousSeat || game.me.previous;
                        if (shang == game.zhu) {//二号位
                            xia.classList.add('huanle-ddz-2-xia');
                            game.zhu.classList.add('huanle-ddz-zhu-center');
                        } else if (xia == game.zhu) {//三号位
                            xia.classList.add('huanle-ddz-3-xia');
                            shang.classList.add('huanle-ddz-3-shang');
                            game.zhu.classList.add('huanle-ddz-zhu-center');
                        }
                    }
                    ui.nmjindutiaox = ui.create.div('.nmjindutiaox', ui.nmjindutiao);
                    if (game.me == game.zhu) event.listc = event.map[game.me.playerid].slice(0, 5);
                    else event.listc = event.map[game.me.playerid].slice(0, 3);
                    var dialog = ui.create.dialog('可选武将', 'hidden', [event.listc, 'characterx']);
                    if (game.me == game.zhu) {
                        for (let i = 0; i < dialog.buttons.length; i++) {
                            for (j in window.dizhuqiangdu) {
                                if (window.dizhuqiangdu[j].indexOf(event.listc[i]) != -1) {
                                    if (!dialog.buttons[i].qiangdu) dialog.buttons[i].qiangdu = ui.create.div('.dizhuqiangdu', dialog.buttons[i]);
                                    dialog.buttons[i].qiangdu.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/dizhuqiangdu/' + j + '.png');
                                    break;
                                } else {
                                    if (dialog.buttons[i].qiangdu) dialog.buttons[i].qiangdu.remove();
                                    delete dialog.buttons[i].qiangdu;
                                };
                            };
                        };
                        for (let t = 0; t < dialog.buttons.length; t++) {
                            if (dialog.buttons[t].node.replaceButton) dialog.buttons[t].node.replaceButton.addEventListener(lib.config.touchscreen ? 'touchend': 'click', function() {
                                for (j in window.dizhuqiangdu) {
                                    if (window.dizhuqiangdu[j].indexOf(dialog.buttons[t].link) != -1) {
                                        if (!dialog.buttons[t].qiangdu) dialog.buttons[t].qiangdu = ui.create.div('.dizhuqiangdu', dialog.buttons[t]);
                                        dialog.buttons[t].qiangdu.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/dizhuqiangdu/' + j + '.png');
                                        break;
                                    } else {
                                        if (dialog.buttons[t].qiangdu) dialog.buttons[t].qiangdu.remove();
                                        delete dialog.buttons[t].qiangdu;
                                    };
                                };
                            });
                        };
                    };
                    dialog.classList.add('noupdate');
                    dialog.id = 'identitychoose';
                    dialog.style.transform = "translate(0px, 0px)";
                    dialog.classList.add('doudizhuxuan');
                    game.me.chooseButton(dialog, true);
                    var dcs = document.getElementById("dui-controls");
                    if (dcs) dcs.style.scale = '0';
                    ui.weizhitip = ui.create.div('.weizhitip', ui.arena);
                    if (!ui.hjk) ui.hjk = ui.create.div('.hjk', document.body);
                    ui.create.div('', ui.hjk).innerHTML = '可换将次数 ' + `<span style='color:white;font-size:24px;font-weight: 900;'>${10}</span>`;
                    ui.create.div('', ui.hjk).innerHTML = '免费换将 ' + `<span style='color:white;font-size:24px;font-weight: 900;'>${3}</span>`;
                    var num;
                    if (game.me.identity == "zhu") {
                        num = "<span style='color:orange;font-size:24px;'>第一个️</span>";
                        ui.weizhitip.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/1hao.png');
                    };
                    if (game.me.getPrevious().identity == "zhu") {
                        num = "<span style='color:green;font-size:24px;'>第二个️</span>";
                        ui.weizhitip.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/2hao.png');
                    };
                    if (game.me.getNext().identity == "zhu") {
                        num = "<span style='color:green;font-size:24px;'>第三个️</span>";
                        ui.weizhitip.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/3hao.png');
                    };
                    ui.dizhutip.innerHTML = "你是" + num + "行动，请选择你的武将";
                    game.dizhudou();
                    // jiaojia.innerText = "本场叫价";
                    // 选将提示并将左上角从底注改为叫价
                    "step 6";
                    event.rename = result.links[0];
                    var name = event.rename;
                    if (get.is.double(name)) {
                        game.me._groupChosen = true;
                        var list = get.is.double(name, true);
                    } else if (lib.character[name][1] == 'shen' && !lib.character[name][4].includes('hiddenSkill')) {
                        var list = lib.group.slice(0);
                        list.remove('shen');
                    };
                    if (list) {
                        if (ui.weizhitip) ui.weizhitip.style.display = "none";
                        var dialog = ui.create.newdialog('#choosegroup', '选择国籍<img src=' + lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/arrow.png' + ' style=width:30px;height:25px;margin-bottom:5px;left:2px;/>', [list, 'vcard']);
                        event.next1 = game.createEvent('chooseGroup');
                        event.next1.dialog = dialog;
                        event.next1.setContent(function() {
                            game.me.chooseButton(1, event.dialog, true).set('newconfirm1', true);
                        });
                        ui.dizhutip.innerHTML = "<span style='font-size:20px;color:#ebc914;;'>请选择你要变成的势力️</span>";
                        ui.dizhutip.style.bottom = '110px';
                        ui.nmjindutiao.style.bottom = '140px';
                        for (var i in dialog.buttons) { // 势力图片
                            var dd = dialog.buttons[i];
                            if (!dd) continue;
                            dd.style.width = '130px';
                            dd.style.height = '130px';
                            dd.style['border-radius'] = '100%';
                            dd.style['background-size'] = "100% 100%";
                            dd.style.margin = '15px';
                            dd.classList.add('none');
                            dd.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/group/' + dd.name + '.png');
                            dd.style.setProperty("box-shadow", "unset", "important");
                            // 清除多余字符
                            let cardReplaceConfig = false;
                            try {
                                cardReplaceConfig = game.getExtensionConfig('美化补充', 'cardReplace');
                            } catch (error) {   };
                            if (!cardReplaceConfig || cardReplaceConfig == "off") {
                                dd.innerHTML = "";
                            } else {
                                var background = dd.querySelector('.background');
                                if (background) background.style['font-size'] = "0px";
                                var topname = dd.querySelector('.top-name');
                                if (topname) topname.style['scale'] = "0";
                                var suitnum = dd.querySelector('.suit-num');
                                if (suitnum) suitnum.style['scale'] = "0";
                                var judgemark = dd.querySelector('.judge-mark');
                                if (judgemark) {
                                    var judge = judgemark.querySelector('.judge');
                                    if (judge) judge.style['font-size'] = "0px";
                                };
                            };
                        };
                    };
                    "step 7";
                    if (event.next1) event.group = event.next1._result.links[0][2];
                    game.me.init(event.rename);
                    ui.nmjindutiao.remove();
                    delete ui.nmjindutiao;
                    ui.nmjindutiaox.remove();
                    delete ui.nmjindutiaox;
                    // if (ui.weizhitip) ui.weizhitip.remove();
                    // delete ui.weizhitip;
                    if (ui.dizhutip) ui.dizhutip.remove();
                    delete ui.dizhutip;
                    if (ui.hjk) ui.hjk.remove();
                    delete ui.hjk;
                    for (var player of game.players) {
                        if (player != game.me) {
                            player.init(event.map[player.playerid].randomGet());
                            if (player.group == 'shen') {
                                player.group = lib.group.slice(0).remove('shen').randomGet();
                                player.node.name.dataset.nature = get.groupnature(player.group);
                            };
                        };
                    };
                    game.zhu.hp++;
                    game.zhu.maxHp++;
                    game.zhu.update();
                    "step 8";
                    if (event.group) {
                        game.me.group = event.group;
                        game.me.node.name.dataset.nature = get.groupnature(game.me.group);
                        game.me.update();
                    };
                    for (var i = 0; i < game.players.length; i++) {
                        _status.characterlist.remove(game.players[i].name1);
                        _status.characterlist.remove(game.players[i].name2);
                    };
                    "step 9";
                    if (ui.weizhitip) ui.weizhitip.style.display = "block";
                    var ski = document.querySelector(".skill-control");
                    if (ski) ski.style.display = "none";
                    if (!waitDialog) var waitDialog = ui.create.div(".waitothers", ui.arena);
                    event.next1 = game.createEvent('waitothers');
                    event.next1.dialog = waitDialog;
                    if (!waitwujiangkuang) var waitwujiangkuang = ui.create.div('.waitwujiangkuang', waitDialog);
                    var group = get.groupnature2(lib.character[event.rename]);
                    waitwujiangkuang.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/kuang/name2_' + group + '.png');
                    if (!waitname) var waitname = ui.create.div('.waitname', waitwujiangkuang);
                    if (!waitname) var waitname = ui.create.div('.waitname', waitwujiangkuang);
                    if (game.me.classList.contains('unseen')) {
                        const names = {
                            'jin_zhangchunhua': '张春华',
                            'jin_yanghuiyu': '羊徽瑜',
                            'xuangongzhu': '宣公主',
                            'jin_simayi': '司马懿',
                            'jin_wangyuanji': '王元姬',
                            'jin_simazhao': '司马昭',
                            'jin_xiahouhui': '夏侯徽',
                            'jin_simashi': '司马师',
                        };
                        const chosenName = names[event.rename];
                        if (chosenName) {
                            waitname.insertAdjacentHTML("afterbegin", chosenName);
                        };
                    } else {
                        waitname.innerHTML = get.translation(game.me.name);
                    };
                    waitname.dataset.nature = get.groupnature2(game.me);
                    if (!waithpwrap) var waithpwrap = ui.create.div('.hp-wrap', waitwujiangkuang);
                    if (!waithp && waithpwrap) var waithp = ui.create.div('.hp', waitwujiangkuang, waithpwrap);
                    var hpNode = waithp;
                    var infoitem = lib.character[event.rename];
                    var hp = get.infoHp(infoitem[2]), maxHp = get.infoMaxHp(infoitem[2]), hujia = get.infoHujia(infoitem[2]);
                    if (maxHp > 5 || (hujia && maxHp > 3)) {
                        hpNode.innerHTML = (isNaN(hp) ? '×' : (hp == Infinity ? '∞' : hp)) + '<br>' + '\\' + '<br>' + (isNaN(maxHp) ? '×' : (maxHp == Infinity ? '∞' : maxHp)) + '<div class="morehp"></div>';
                        if(hujia) hpNode.innerHTML += '<div class="morehujia">' + hujia + '</div>';
                        hpNode.classList.add('textstyle');
                    } else {
                        hpNode.innerHTML = '';
                        hpNode.classList.remove('textstyle');
                        while (maxHp > hpNode.childNodes.length) ui.create.div(hpNode);
                        for (var i = 0; i < Math.max(0, maxHp); i++) {
                            var index = i;
                            if (i < hp) {
                                hpNode.childNodes[index].classList.remove('lost');
                            } else {
                                hpNode.childNodes[index].classList.add('lost');
                            };
                        };
                    };
                    if (hp > Math.round(maxHp / 2) || hp === maxHp) {
                        hpNode.dataset.condition = 'high';
                    } else if (hp > Math.floor(maxHp / 3)) {
                        hpNode.dataset.condition = 'mid';
                    } else {
                        hpNode.dataset.condition = 'low';
                    };
                    if (!waitwujiang) var waitwujiang = ui.create.div('.waitwujiang', waitwujiangkuang);
                    waitwujiang.style.backgroundImage = game.me.node.avatar.style.backgroundImage;
                    if (!skillsarea) var skillsarea = ui.create.div('.skillsarea', waitDialog);
                    skillsarea.innerHTML = '<div></div>';
                    lib.setScroll(skillsarea.firstChild);
                    var oSkills = game.me.skills;
                    if (game.me.classList.contains('unseen')) {
                        game.me.removeSkill('g_hidden_ai');
                        for (var i of game.me.getSkills(lib.character[event.rename])) {
                            oSkills.add(i);
                        };
                    };
                    if (oSkills.length) {
                        oSkills.forEach(function(name) {
                            var imgSrc = lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/';
                            var skillHtml = '<div data-color>' + get.translation(name) + '</div>' + '<div>' + get.skillInfoTranslation(name, player) + '<br></div>';
                            if (!game.me.skills.contains(name) || (game.me.awakenedSkills.contains(name) && !lib.skill[name].limited)) {
                                ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                            } else if (get.info(name).enable) {
                                ui.create.div('.xskill', '<img src=' + imgSrc + 'zhudong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                            } else {
                                ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                            };
                        });
                    };
                    if (!waittip) var waittip = ui.create.div('.junbatip', waitDialog);
                    if (!waittipyy) var waittipyy = ui.create.div('.junbatipyy', waitDialog);
                    waittip.style.bottom = "-76px";
                    waittipyy.style.bottom = "-76px";
                    waittip.innerHTML = "";
                    waittipyy.innerHTML = "";
                    waittip.style.animation = 'none';
                    waittipyy.style.animation = 'none';
                    if (!waitjindutiao) var waitjindutiao = ui.create.div('.waitjindutiao', waitDialog);
                    waitjindutiao.style.bottom = "-94px";
                    if (!waitjindutiaox) var waitjindutiaox = ui.create.div('.waitjindutiaox', waitDialog);
                    waitjindutiaox.style.bottom = "-93.8px";
                    waitjindutiaox.style.animation = 'waitxiaoshi 5s linear'; // 这里和下方定时器同步
                    var dizhutip = ui.create.div('.dizhutip', waitDialog);
                    dizhutip.style.bottom = "-74px";
                    dizhutip.innerHTML = "请等待其他玩家选择武将";
                    if (!waitbtn) var waitbtn = ui.create.div('.waitbtn', waitDialog);
                    waitbtn.innerHTML = "点击查看简要攻略";
                    event.next1.setContent(function() {
                        game.me.chooseButton(event.dialog, true).set('noconfirm', true);
                        var waitbtn = event.dialog.getElementsByClassName('waitbtn')[0];
                        var clicked = false;
                        waitbtn.addEventListener('click', function() {
                            clicked = true;
                            game.playAudio('../extension/美化补充/image/xuanjiangjiemian/audio/TinyButton.mp3');
                            clearTimeout(timer);
                            if (ui.weizhitip) ui.weizhitip.remove();
                            delete ui.weizhitip;
                            event.dialog.remove();
                            game.resume();
                        });
                        if (!clicked) {
                            var timer = setTimeout(() => {
                                game.resume();
                                if (ui.weizhitip) ui.weizhitip.remove();
                                delete ui.weizhitip;
                                event.dialog.remove();
                            }, 5000); // 这里控制等待时长，1000 = 1秒
                        };
                    });
                    "step 10";
                    ui.background.style.zIndex = '-2';
                    game.showHuanledou();
                    var ski = document.querySelector(".skill-control");
                    if (ski) ski.style.display = "inline-block";
                    var dcs = document.getElementById("dui-controls");
                    if (dcs) dcs.style.scale = '1';
                    setTimeout(function() {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                });
            };
        };
    } else if (
        lib.config.extension_美化补充_doudizhuxuanjiangjiemian &&
        lib.config.extension_美化补充_doudizhuxuanjiangjiemian == "onlyshoushabuju" &&
        isDoudizhuCasualMode()
    ) {
        game.chooseCharacterHuanle = function () {
            var next = game.createEvent("chooseCharacter");
            next.setContent(function () {
                "step 0";
                ui.arena.classList.add("choose-character");
                game.no_continue_game = true;
                var i;
                event.list = [];
                event.list2 = [];
                var list4 = [];
                if (!event.map) event.map = {};
                for (i in lib.characterReplace) {
                    var ix = lib.characterReplace[i];
                    for (var j = 0; j < ix.length; j++) {
                        if (lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                    }
                    if (ix.length) {
                        var name = ix.randomGet();
                        event.list.push(name);
                        if (game.recommendDizhu.includes(name)) event.list2.push(name);
                        list4.addArray(ix);
                    }
                }
                for (i in lib.character) {
                    if (list4.includes(i) || lib.filter.characterDisabled(i)) continue;
                    event.list.push(i);
                    if (game.recommendDizhu.includes(i)) event.list2.push(i);
                }
                event.list.randomSort();
                _status.characterlist = event.list.slice(0);
                event.controls = ["不叫", "叫地主"];
                for (var player of game.players) {
                    var id = player.playerid;
                    if (!event.map[id]) event.map[id] = [];
                    event.map[id].addArray(event.list2.randomRemove(1));
                    event.list.removeArray(event.map[id]);
                    event.map[id].addArray(event.list.randomRemove(4 - event.map[id].length));
                    event.list2.removeArray(event.map[id]);
                }
                event.dialog = ui.create.dialog("你的选将框", [event.map[game.me.playerid], "character"]);
                event.start = game.players.randomGet();
                event.current = event.start;
                lib.init.onfree();
                game.delay(2.5);
                "step 1";
                event.current.chooseControl(event.controls).set("ai", function () {
                    return Math.random() > 0.5 ? "不叫" : "叫地主";
                });
                if (event.current == game.me) {
                    event.dialog.content.childNodes[0].innerHTML = "是否抢地主？";
                }
                "step 2";
                event.current.chat(result.control);
                if (result.control == "叫地主" || event.current == event.start.next) {
                    game.zhu = result.control == "叫地主" ? event.current : event.current.next;
                    for (var player of game.players) {
                        player.identity = player == game.zhu ? "zhu" : "fan";
                        player.showIdentity();
                    }
                    event.dialog.close();
                    event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
                } else {
                    event.current = event.current.next;
                    event.goto(1);
                    game.delay(1.5);
                }
                "step 3";
                if (true) {
                    //手动修改进入时的布局
                    var xia = game.me.nextSeat || game.me.next;
                    var shang = game.me.previousSeat || game.me.previous;
                    if (shang == game.zhu) {//二号位
                        xia.classList.add('huanle-ddz-2-xia');
                        game.zhu.classList.add('huanle-ddz-zhu-center');
                    } else if (xia == game.zhu) {//三号位
                        xia.classList.add('huanle-ddz-3-xia');
                        shang.classList.add('huanle-ddz-3-shang');
                        game.zhu.classList.add('huanle-ddz-zhu-center');
                    }
                }
                game.me.chooseButton(["请选择你的武将", [event.map[game.me.playerid], "character"]], true);
                "step 4";
                game.me.init(result.links[0]);
                for (var player of game.players) {
                    if (player != game.me) player.init(event.map[player.playerid].randomGet());
                }
                if (!game.zhu.isInitFilter("noZhuHp")) {
                    game.zhu.maxHp++;
                    game.zhu.hp++;
                    game.zhu.update();
                }
                for (var i = 0; i < game.players.length; i++) {
                    _status.characterlist.remove(game.players[i].name1);
                    _status.characterlist.remove(game.players[i].name2);
                }
                setTimeout(function () {
                    ui.arena.classList.remove("choose-character");
                }, 500);
            });
        };
    };
    // 军八选将界面
    if (lib.config.extension_美化补充_junzhengxuanjiangjiemian && lib.config.extension_美化补充_junzhengxuanjiangjiemian == "shousha") {
        if (lib.config.mode == 'identity') {
            game.initShenfenRenwu = function(createSeat, createChoose) {
                game.pause();
                createSeat();
                if (!ui.zhuWait) ui.zhuWait = ui.create.div(".junbawaitbg", ui.arena);
                var zhubg = ui.create.div(".junbazhu", ui.zhuWait);
                var weizhijiang = ui.create.div(".junbazhuwzj", zhubg);
                var zhuinfo = ui.create.div(".junbazhujsjm", ui.zhuWait);
                var junbazhutip = ui.create.div('.dizhutip', ui.zhuWait);
                junbazhutip.style.bottom = "475px";
                junbazhutip.style.left = "4%";
                junbazhutip.style.fontSize = "24px";
                junbazhutip.innerHTML = "主公正在选将<br>请耐心等待";
                var zhugong = ui.create.div('.junbaid', ui.zhuWait);
                zhugong.classList.add("zhu");
                var zhongchen = ui.create.div('.junbaid', ui.zhuWait);
                zhongchen.classList.add("zhong");
                var fanzei = ui.create.div('.junbaid', ui.zhuWait);
                fanzei.classList.add("fan");
                var neijian = ui.create.div('.junbaid', ui.zhuWait);
                neijian.classList.add("nei");
                var nindeshenfen = ui.create.div('.dizhutip', ui.zhuWait);
                nindeshenfen.innerHTML = "您的身份";
                var jibai = ui.create.div('.junbajibai', ui.zhuWait);
                var zaijibai = ui.create.div('.junbazaijibai', ui.zhuWait);
                zaijibai.style.scale = "0";
                var renwutip = ui.create.div('.dizhutip', ui.zhuWait);
                renwutip.style.bottom = "90px";
                renwutip.style.fontSize = "18px";
                if (game.me.identity == "zhu") {
                    zhugong.style.left = "30%";
                    zhugong.style.bottom = "235px";
                    zhongchen.style.left = "30%";
                    zhongchen.style.bottom = "135px";
                    fanzei.style.left = "60%";
                    fanzei.style.bottom = "235px";
                    neijian.style.left = "60%";
                    neijian.style.bottom = "135px";
                    nindeshenfen.style.left = "-16.6%";
                    nindeshenfen.style.bottom = "295px";
                    nindeshenfen.style.fontSize = "16px";
                    jibai.style.left = "41%";
                    jibai.style.bottom = "200px";
                    renwutip.innerHTML = "击败反贼和内奸获取胜利";
                } else if (game.me.identity == "zhong") {
                    zhugong.style.left = "30%";
                    zhugong.style.bottom = "235px";
                    zhongchen.style.left = "30%";
                    zhongchen.style.bottom = "135px";
                    fanzei.style.left = "60%";
                    fanzei.style.bottom = "235px";
                    neijian.style.left = "60%";
                    neijian.style.bottom = "135px";
                    nindeshenfen.style.left = "-16.6%";
                    nindeshenfen.style.bottom = "195px";
                    nindeshenfen.style.fontSize = "16px";
                    jibai.style.left = "41%";
                    jibai.style.bottom = "200px";
                    renwutip.innerHTML = "击败反贼和内奸获取胜利";
                } else if (game.me.identity == "fan") {
                    zhugong.style.left = "60%";
                    zhugong.style.bottom = "235px";
                    zhongchen.style.left = "57.5%";
                    zhongchen.style.bottom = "143px";
                    fanzei.style.left = "30%";
                    fanzei.style.bottom = "185px";
                    neijian.style.left = "65%";
                    neijian.style.bottom = "145px";
                    nindeshenfen.style.left = "-16.6%";
                    nindeshenfen.style.bottom = "245px";
                    nindeshenfen.style.fontSize = "16px";
                    jibai.style.left = "41%";
                    jibai.style.bottom = "200px";
                    renwutip.innerHTML = "全力击败主公，如果内奸和忠臣碍事也可顺手击败";
                } else if (game.me.identity == "nei") {
                    zhugong.style.left = "71%";
                    zhugong.style.bottom = "185px";
                    zhongchen.style.left = "48%";
                    zhongchen.style.bottom = "135px";
                    fanzei.style.left = "48%";
                    fanzei.style.bottom = "235px";
                    neijian.style.left = "22%";
                    neijian.style.bottom = "185px";
                    nindeshenfen.style.left = "-24.6%";
                    nindeshenfen.style.bottom = "245px";
                    nindeshenfen.style.fontSize = "16px";
                    jibai.style.left = "32%";
                    jibai.style.bottom = "200px";
                    zaijibai.style.scale = "1";
                    zaijibai.style.left = "56%";
                    zaijibai.style.bottom = "200px";
                    renwutip.innerHTML = "先击败反贼和忠臣，最后击败主公获取胜利";
                };
                var zhutip = ui.create.div('.dizhutip', ui.zhuWait);
                zhutip.style.bottom = "55px";
                zhutip.innerHTML = "请等待主公选将";
                var zhujindutiao = ui.create.div('.nmjindutiao', ui.zhuWait);
                zhujindutiao.style.bottom = "35px";
                var zhujindutiaox = ui.create.div('.nmjindutiaox', zhujindutiao);
                var clicked = false;
                ui.zhuWait.addEventListener("dblclick", () => {
                    clicked = true;
                    if (ui.zhuWait) ui.zhuWait.remove();
                    delete ui.zhuWait;
                    createChoose();
                    game.resume();
                });
                if (!clicked) {
                    setTimeout(function() {
                        if (ui.zhuWait) ui.zhuWait.remove();
                        delete ui.zhuWait;
                        createChoose();
                        game.resume();
                    }, 5000);
                };
            };
            game.chooseCharacter = function() {
                if (_status.mode == 'purple') {
                    game.chooseCharacterPurple();
                    return;
                };
                ui.background.style.zIndex = '6';
                var next = game.createEvent('chooseCharacter', false);
                next.showConfig = true;
                next.addPlayer = function(player) {
                    var list = lib.config.mode_config.identity.identity[game.players.length - 3].slice(0);
                    var list2 = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                    for (var i = 0; i < list.length; i++) list2.remove(list[i]);
                    player.identity = list2[0];
                    player.setIdentity('cai');
                };
                next.removePlayer = function() {
                    return game.players.randomGet(game.me, game.zhu);
                };
                next.ai = function(player, list, list2, back) {
                    if (_status.brawl && _status.brawl.chooseCharacterAi) {
                        if (_status.brawl.chooseCharacterAi(player, list, list2, back) !== false) {
                            return;
                        };
                    };
                    if (_status.event.zhongmode) {
                        var listc = list.slice(0, 2);
                        for (var i = 0; i < listc.length; i++) {
                            var listx = lib.characterReplace[listc[i]];
                            if (listx && listx.length) listc[i] = listx.randomGet();
                        };
                        if (get.config('double_character')) {
                            player.init(listc[0], listc[1]);
                        } else {
                            player.init(listc[0]);
                        };
                        if (player.identity == 'mingzhong') {
                            player.hp++;
                            player.maxHp++;
                            player.update();
                        };
                    } else if (player.identity == 'zhu') {
                        list2.randomSort();
                        var choice, choice2;
                        if (!_status.event.zhongmode && Math.random() - 0.8 < 0 && list2.length) {
                            choice = list2[0];
                            choice2 = list[0];
                            if (choice2 == choice) {
                                choice2 = list[1];
                            };
                        } else {
                            choice = list[0];
                            choice2 = list[1];
                        };
                        if (lib.characterReplace[choice] && lib.characterReplace[choice].length) choice = lib.characterReplace[choice].randomGet();
                        if (lib.characterReplace[choice2] && lib.characterReplace[choice2].length) choice2 = lib.characterReplace[choice2].randomGet();
                        if (get.config('double_character')) {
                            player.init(choice, choice2);
                        } else {
                            player.init(choice);
                        };
                        if (game.players.length > 4) {
                            player.hp++;
                            player.maxHp++;
                            player.update();
                        };
                    } else if (player.identity == 'zhong' && (Math.random() < 0.5 || ['sunliang', 'key_akane'].includes(game.zhu.name))) {
                        var listc = list.slice(0);
                        for (var i = 0; i < listc.length; i++) {
                            var listx = lib.characterReplace[listc[i]];
                            if (listx && listx.length) listc[i] = listx.randomGet();
                        };
                        var choice = 0;
                        for (var i = 0; i < listc.length; i++) {
                            if (lib.character[listc[i]][1] == game.zhu.group) {
                                choice = i;
                                break;
                            };
                        };
                        if (get.config('double_character')) {
                            player.init(listc[choice], listc[choice == 0 ? choice + 1 : choice - 1]);
                        } else {
                            player.init(listc[choice]);
                        };
                    } else {
                        var listc = list.slice(0, 2);
                        for (var i = 0; i < listc.length; i++) {
                            var listx = lib.characterReplace[listc[i]];
                            if (listx && listx.length) listc[i] = listx.randomGet();
                        };
                        if (get.config('double_character')) {
                            player.init(listc[0], listc[1]);
                        } else {
                            player.init(listc[0]);
                        };
                    };
                    if (back) {
                        list.remove(get.sourceCharacter(player.name1));
                        list.remove(get.sourceCharacter(player.name2));
                        for (var i = 0; i < list.length; i++) {
                            back.push(list[i]);
                        };
                    };
                    if (typeof lib.config.test_game == 'string' && player == game.me.next) {
                        player.init(lib.config.test_game);
                    };
                    if (get.is.double(player.name1)) {
                        player._groupChosen = true;
                        player.group = get.is.double(player.name1, true).randomGet();
                        player.node.name.dataset.nature = get.groupnature(player.group);
                    } else if (get.config('choose_group') && player.group == 'shen' && !player.isUnseen(0)) {
                        var list = lib.group.slice(0);
                        list.remove('shen');
                        if (list.length) player.group = function() {
                            if (_status.mode != 'zhong' && game.zhu && game.zhu.group) {
                                if (['re_zhangjiao', 'liubei', 're_liubei', 'caocao', 're_caocao', 'sunquan', 're_sunquan', 'zhangjiao', 'sp_zhangjiao', 'caopi', 're_caopi', 'liuchen', 'caorui', 'sunliang', 'sunxiu', 'sunce', 're_sunben', 'ol_liushan', 're_liushan', 'key_akane', 'dongzhuo', 're_dongzhuo', 'ol_dongzhuo', 'jin_simashi', 'caomao'].includes(game.zhu.name)) return game.zhu.group;
                                if (game.zhu.name == 'yl_yuanshu') {
                                    if (player.identity == 'zhong') list.remove('qun');
                                    else return 'qun';
                                };
                                if (['sunhao', 'xin_yuanshao', 're_yuanshao', 're_sunce', 'ol_yuanshao', 'yuanshu', 'jin_simazhao', 'liubian'].includes(game.zhu.name)) {
                                    if (player.identity != 'zhong') list.remove(game.zhu.group);
                                    else return game.zhu.group;
                                };
                            };
                            return list.randomGet();
                        } ();
                    };
                    //这里重写一下设置双将
                    player.node.name.dataset.nature = get.groupnature(player.group);
                    //这里是主公
                    player.node.name.dataset.nature2 = get.groupnature2(player);
                };
                next.setContent(function() {
                    "step 0";
                    lib.init.onfree();
                    ui.arena.classList.add('choose-character');
                    //从choose-character往下修改background的图层
                    "step 1";
                    var i;
                    var list;
                    var list2 = [];
                    var list3 = [];
                    var list4 = [];
                    var identityList;
                    var chosen = lib.config.continue_name || [];
                    game.saveConfig('continue_name');
                    event.chosen = chosen;
                    if (_status.mode == 'zhong') {
                        event.zhongmode = true;
                        identityList = ['zhu', 'zhong', 'mingzhong', 'nei', 'fan', 'fan', 'fan', 'fan'];
                    } else {
                        identityList = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
                        if (get.config('double_nei')) {
                            switch (get.playerNumber()) {
                            case 8:
                                identityList.remove('fan');
                                identityList.push('nei');
                                break;
                            case 7:
                                identityList.remove('zhong');
                                identityList.push('nei');
                                break;
                            case 6:
                                identityList.remove('fan');
                                identityList.push('nei');
                                break;
                            case 5:
                                identityList.remove('fan');
                                identityList.push('nei');
                                break;
                            case 4:
                                identityList.remove('zhong');
                                identityList.push('nei');
                                break;
                            case 3:
                                identityList.remove('fan');
                                identityList.push('nei');
                                break;
                            };
                        };
                    };
                    var addSetting = function(dialog) {
                        dialog.add('选择身份').classList.add('add-setting');
                        var table = document.createElement('div');
                        table.classList.add('add-setting');
                        table.style.margin = '0';
                        table.style.width = '100%';
                        table.style.position = 'relative';
                        var listi;
                        if (event.zhongmode) {
                            listi = ['random', 'zhu', 'mingzhong', 'zhong', 'nei', 'fan'];
                        } else {
                            listi = ['random', 'zhu', 'zhong', 'nei', 'fan'];
                        };
                        for (var i = 0; i < listi.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.link = listi[i];
                            if (td.link === game.me.identity) {
                                td.classList.add('bluebg');
                            };
                            table.appendChild(td);
                            td.innerHTML = '<span>' + get.translation(listi[i] + '2') + '</span>';
                            td.addEventListener(lib.config.touchscreen ? 'touchend': 'click', function() {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                _status.tempNoButton = true;
                                setTimeout(function() {
                                    _status.tempNoButton = false;
                                }, 500);
                                var link = this.link;
                                if (game.zhu) {
                                    if (link != 'random') {
                                        _status.event.parent.fixedseat = get.distance(game.me, game.zhu, 'absolute');
                                    };
                                    if (game.zhu.name) game.zhu.uninit();
                                    delete game.zhu.isZhu;
                                    delete game.zhu.identityShown;
                                };
                                var current = this.parentNode.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                };
                                current = seats.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                };
                                if (link == 'random') {
                                    if (event.zhongmode) {
                                        link = ['zhu', 'zhong', 'nei', 'fan', 'mingzhong'].randomGet();
                                    } else {
                                        link = ['zhu', 'zhong', 'nei', 'fan'].randomGet();
                                    };
                                    for (var i = 0; i < this.parentNode.childElementCount; i++) {
                                        if (this.parentNode.childNodes[i].link == link) {
                                            this.parentNode.childNodes[i].classList.add('bluebg');
                                        };
                                    };
                                } else {
                                    this.classList.add('bluebg');
                                };
                                num = get.config('choice_' + link);
                                if (event.zhongmode) {
                                    num = 6;
                                    if (link == 'zhu' || link == 'nei' || link == 'mingzhong') {
                                        num = 8;
                                    };
                                };
                                _status.event.parent.swapnodialog = function(dialog, list) {
                                    var buttons = ui.create.div('.buttons');
                                    var node = dialog.buttons[0].parentNode;
                                    dialog.buttons = ui.create.buttons(list, 'characterx', buttons);
                                    dialog.content.insertBefore(buttons, node);
                                    buttons.animate('start');
                                    node.remove();
                                    game.uncheck();
                                    game.check();
                                    for (var i = 0; i < seats.childElementCount; i++) {
                                        if (get.distance(game.zhu, game.me, 'absolute') === seats.childNodes[i].link) {
                                            seats.childNodes[i].classList.add('bluebg');
                                        };
                                    };
                                };
                                _status.event = _status.event.parent;
                                _status.event.step = 0;
                                _status.event.identity = link;
                                if (link != (event.zhongmode ? 'mingzhong': 'zhu')) {
                                    seats.previousSibling.style.display = '';
                                    seats.style.display = '';
                                } else {
                                    seats.previousSibling.style.display = 'none';
                                    seats.style.display = 'none';
                                };
                                game.junbaupdate();
                                game.resume();
                            });
                        };
                        dialog.content.appendChild(table);
                        dialog.add('选择座位').classList.add('add-setting');
                        var seats = document.createElement('div');
                        seats.classList.add('add-setting');
                        seats.style.margin = '0';
                        seats.style.width = '100%';
                        seats.style.position = 'relative';
                        for (var i = 2; i <= game.players.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.innerHTML = get.cnNumber(i, true);
                            td.link = i - 1;
                            seats.appendChild(td);
                            if (get.distance(game.zhu, game.me, 'absolute') === i - 1) {
                                td.classList.add('bluebg');
                            };
                            td.addEventListener(lib.config.touchscreen ? 'touchend': 'click', function() {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                if (get.distance(game.zhu, game.me, 'absolute') == this.link) return;
                                var current = this.parentNode.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                };
                                this.classList.add('bluebg');
                                for (var i = 0; i < game.players.length; i++) {
                                    if (get.distance(game.players[i], game.me, 'absolute') == this.link) {
                                        game.swapSeat(game.zhu, game.players[i], false);
                                        game.junbaupdate();
                                        return;
                                    };
                                };
                            });
                        };
                        dialog.content.appendChild(seats);
                        if (game.me == game.zhu) {
                            seats.previousSibling.style.display = 'none';
                            seats.style.display = 'none';
                        };
                        dialog.add(ui.create.div('.placeholder.add-setting'));
                        dialog.add(ui.create.div('.placeholder.add-setting'));
                        if (get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
                    };
                    var removeSetting = function() {
                        var dialog = _status.event.dialog;
                        if (dialog) {
                            dialog.style.height = '';
                            delete dialog._scrollset;
                            var list = Array.from(dialog.querySelectorAll('.add-setting'));
                            while (list.length) {
                                list.shift().remove();
                            };
                            ui.update();
                        };
                    };
                    event.addSetting = addSetting;
                    event.removeSetting = removeSetting;
                    event.list = [];
                    identityList.randomSort();
                    if (event.identity) {
                        identityList.remove(event.identity);
                        identityList.unshift(event.identity);
                        if (event.fixedseat) {
                            var zhuIdentity = (_status.mode == 'zhong') ? 'mingzhong': 'zhu';
                            if (zhuIdentity != event.identity) {
                                identityList.remove(zhuIdentity);
                                identityList.splice(event.fixedseat, 0, zhuIdentity);
                            };
                            delete event.fixedseat;
                        };
                        delete event.identity;
                    } else if (_status.mode != 'zhong' && (!_status.brawl || !_status.brawl.identityShown)) {
                        var ban_identity = [];
                        ban_identity.push(get.config('ban_identity') || 'off');
                        if (ban_identity[0] != 'off') {
                            ban_identity.push(get.config('ban_identity2') || 'off');
                            if (ban_identity[1] != 'off') {
                                ban_identity.push(get.config('ban_identity3') || 'off');
                            };
                        };
                        ban_identity.remove('off');
                        if (ban_identity.length) {
                            var identityList2 = identityList.slice(0);
                            for (var i = 0; i < ban_identity.length; i++) {
                                while (identityList2.remove(ban_identity[i]));
                            };
                            ban_identity = identityList2.randomGet();
                            identityList.remove(ban_identity);
                            identityList.splice(game.players.indexOf(game.me), 0, ban_identity);
                        };
                    };
                    for (i = 0; i < game.players.length; i++) {
                        if (_status.brawl && _status.brawl.identityShown) {
                            if (game.players[i].identity == 'zhu') game.zhu = game.players[i];
                            game.players[i].identityShown = true;
                        } else {
                            game.players[i].node.identity.classList.add('guessing');
                            game.players[i].identity = identityList[i];
                            game.players[i].setIdentity('cai');
                            if (event.zhongmode) {
                                if (identityList[i] == 'mingzhong') {
                                    game.zhu = game.players[i];
                                } else if (identityList[i] == 'zhu') {
                                    game.zhu2 = game.players[i];
                                };
                            } else {
                                if (identityList[i] == 'zhu') {
                                    game.zhu = game.players[i];
                                };
                            };
                            game.players[i].identityShown = false;
                        };
                    };
                    if (get.config('special_identity') && !event.zhongmode && game.players.length == 8) {
                        for (var i = 0; i < game.players.length; i++) {
                            delete game.players[i].special_identity;
                        };
                        event.special_identity = [];
                        var zhongs = game.filterPlayer(function(current) {
                            return current.identity == 'zhong';
                        });
                        var fans = game.filterPlayer(function(current) {
                            return current.identity == 'fan';
                        });
                        if (fans.length >= 1) {
                            fans.randomRemove().special_identity = 'identity_zeishou';
                            event.special_identity.push('identity_zeishou');
                        };
                        if (zhongs.length > 1) {
                            zhongs.randomRemove().special_identity = 'identity_dajiang';
                            zhongs.randomRemove().special_identity = 'identity_junshi';
                            event.special_identity.push('identity_dajiang');
                            event.special_identity.push('identity_junshi');
                        } else if (zhongs.length == 1) {
                            if (Math.random() < 0.5) {
                                zhongs.randomRemove().special_identity = 'identity_dajiang';
                                event.special_identity.push('identity_dajiang');
                            } else {
                                zhongs.randomRemove().special_identity = 'identity_junshi';
                                event.special_identity.push('identity_junshi');
                            };
                        };
                    };
                    if (!game.zhu) {
                        game.zhu = game.me;
                    } else {
                        game.zhu.setIdentity();
                        game.zhu.identityShown = true;
                        game.zhu.isZhu = (game.zhu.identity == 'zhu');
                        game.zhu.node.identity.classList.remove('guessing');
                        game.me.setIdentity();
                        game.me.node.identity.classList.remove('guessing');
                    };
                    //选将框分配
                    for (i in lib.characterReplace) {
                        var ix = lib.characterReplace[i];
                        for (var j = 0; j < ix.length; j++) {
                            if (chosen.contains(ix[j]) || lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                        };
                        if (ix.length) {
                            event.list.push(i);
                            list4.addArray(ix);
                            var bool = false;
                            for (var j of ix) {
                                if (lib.character[j][4] && lib.character[j][4].includes('zhu')) {
                                    bool = true;
                                    break;
                                };
                            } (bool ? list2: list3).push(i);
                        };
                    };
                    for (i in lib.character) {
                        if (list4.includes(i)) continue;
                        if (chosen.contains(i)) continue;
                        if (lib.filter.characterDisabled(i)) continue;
                        event.list.push(i);
                        list4.push(i);
                        if (lib.character[i][4] && lib.character[i][4].includes('zhu')) {
                            list2.push(i);
                        } else {
                            list3.push(i);
                        };
                    };
                    var getZhuList = function() {
                        var limit_zhu = get.config('limit_zhu');
                        if (!limit_zhu || limit_zhu == 'off') return list2.slice(0).sort(lib.sort.character);
                        if (limit_zhu != 'group') {
                            var num = (parseInt(limit_zhu) || 6);
                            return list2.randomGets(num).sort(lib.sort.character);
                        };
                        var getGroup = function(name) {
                            if (lib.characterReplace[name]) return lib.character[lib.characterReplace[name][0]][1];
                            return lib.character[name][1];
                        };
                        var list2x = list2.slice(0);
                        list2x.randomSort();
                        for (var i = 0; i < list2x.length; i++) {
                            for (var j = i + 1; j < list2x.length; j++) {
                                if (getGroup(list2x[i]) == getGroup(list2x[j])) {
                                    list2x.splice(j--, 1);
                                };
                            };
                        };
                        list2x.sort(lib.sort.character);
                        return list2x;
                    };
                    event.list.randomSort();
                    _status.characterlist = list4.slice(0).randomSort();
                    list3.randomSort();
                    if (_status.brawl && _status.brawl.chooseCharacterFilter) {
                        _status.brawl.chooseCharacterFilter(event.list, getZhuList(), list3);
                    };
                    var num = get.config('choice_' + game.me.identity);
                    if (event.zhongmode) {
                        num = 6;
                        if (game.me.identity == 'zhu' || game.me.identity == 'nei' || game.me.identity == 'mingzhong') {
                            num = 8;
                        };
                    };
                    if (game.zhu != game.me) {
                        event.ai(game.zhu, event.list, getZhuList());
                        event.list.remove(get.sourceCharacter(game.zhu.name1));
                        event.list.remove(get.sourceCharacter(game.zhu.name2));
                        if (_status.brawl && _status.brawl.chooseCharacter) {
                            list = _status.brawl.chooseCharacter(event.list, num);
                            if (list === false || list === 'nozhu') {
                                list = event.list.slice(0, num);
                            };
                        } else {
                            list = event.list.slice(0, num);
                        };
                    } else {
                        if (_status.brawl && _status.brawl.chooseCharacter) {
                            list = _status.brawl.chooseCharacter(getZhuList(), list3, num);
                            if (list === false) {
                                if (event.zhongmode) {
                                    list = list3.slice(0, 6);
                                } else {
                                    list = getZhuList().concat(list3.slice(0, num));
                                };
                            } else if (list === 'nozhu') {
                                list = event.list.slice(0, num);
                            };
                        } else {
                            if (event.zhongmode) {
                                list = list3.slice(0, 8);
                            } else {
                                list = getZhuList().concat(list3.slice(0, num));
                            };
                        };
                    };
                    // 座位图
                    var createSeat = function() {
                        if (!ui.dialogg) ui.dialogg = ui.create.div(".junbaseat", ui.arena);
                        else ui.dialogg.style.display = "inline-block";
                        function getSplitPoints(n = 8, m = 2) {
                            const st = -84.2;
                            const ed = -5;
                            const res = [{
                                "right": "1px",
                                "bottom": "1px",
                            }];
                            function f(x) {
                                const a = 2.100457524823321e-8;
                                const b = 0.000005620824336545385;
                                const c = 0.0005809739486264832;
                                const d = 0.029107626186307245;
                                const e = 0.7079834657619672;
                                const f = 6.659977419400599;
                                const g = 58.89288188791412;
                                const y = a * Math.pow(x, 6) + b * Math.pow(x, 5) + c * Math.pow(x, 4) + d * Math.pow(x, 3) + e * Math.pow(x, 2) + f * x + g;
                                res.push({
                                    "right": Math.abs(x).toFixed(m) + "%",
                                    "bottom": Math.abs(y).toFixed(m) + "%",
                                });
                            };
                            if (n < 5) {
                                n = n - 1;
                                const tp = (st - ed) / n;
                                for (let i = 1; i <= n; i++) f(ed + i * tp);
                            } else {
                                n = n - 1;
                                const tp = (st - ed) / (n - 1);
                                for (let i = 0; i < n; i++) f(ed + i * tp);
                            };
                            return res;
                        };
                        var nk = game.players.length;
                        var points = getSplitPoints(nk);
                        if (!ui.dialoggk) {
                            ui.dialoggk = [];
                            /*dialogg是右上角*/
                            for (i = 0; i < nk; i++) {
                                var k = ui.create.div('.num', ui.dialogg);
                                k.style.right = points[i]["right"];
                                k.style.bottom = points[i]["bottom"];
                                ui.dialoggk.push(k);
                                if (i == 0) k.classList.add(game.me.identity);
                                var numk = get.distance(game.zhu, game.players[i], 'absolute') + 1;
                                k.innerHTML = "<img src='" + lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/seat_' + numk + '.png' + "' style='position:relative;width:12px;height:12px;bottom:-18px;left:4px;'/>";
                                if (game.players[i] == game.zhu) k.classList.add('zhu');
                            };
                        };
                        if (ui.dialoggk && ui.dialoggk.length) {
                            for (i = 0; i < nk; i++) {
                                var k = ui.dialoggk[i];
                                k.className = 'num';
                                k.style.right = points[i]["right"];
                                k.style.bottom = points[i]["bottom"];
                                if (i == 0) k.classList.add(game.me.identity);
                                var numk = get.distance(game.zhu, game.players[i], 'absolute') + 1;
                                k.innerHTML = "<img src='" + lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/seat_' + numk + '.png' + "' style='position:relative;width:12px;height:12px;bottom:-18px;left:4px;'/>";
                                if (game.players[i] == game.zhu) k.classList.add('zhu');
                            };
                        };
                        if (!ui.metip) ui.metip = ui.create.div('.metip', ui.dialogg);
                        if (game.me.identity == 'zhu') ui.metip.innerHTML = "<span style='color:red;'>我(主公)</span>";
                        if (game.me.identity == 'zhong') ui.metip.innerHTML = "<span style='color:#BFAF58;'>我(忠臣️)</span>";
                        if (game.me.identity == 'nei') ui.metip.innerHTML = "<span style='color:#87CEFA;'>我(内奸)️</span>";
                        if (game.me.identity == 'fan') ui.metip.innerHTML = "<span style='color:#5D7C48;'>我(反贼️)</span>";
                    };
                    // 选将
                    var createChoose = function() {
                        delete event.swapnochoose;
                        var dialog;
                        if (event.swapnodialog) {
                            dialog = ui.dialog;
                            event.swapnodialog(dialog, list);
                            delete event.swapnodialog;
                        } else {
                            var str = '可选武将';
                            if (_status.brawl && _status.brawl.chooseCharacterStr) {
                                str = _status.brawl.chooseCharacterStr;
                            };
                            dialog = ui.create.dialog(str, 'hidden', [list, 'characterx']);
                            dialog.classList.add('noupdate');
                            dialog.id = 'identitychoose';
                            dialog.style.transform = "translate(0px, 0px)";
                            var dcs = document.getElementById("dui-controls");
                            if (dcs) dcs.style.scale = '0';
                            if (!_status.brawl || !_status.brawl.noAddSetting) {
                                if (get.config('change_identity')) {
                                    addSetting(dialog);
                                };
                            };
                            game.junbaupdate = function() {
                                setTimeout(function() {
                                    createSeat();
                                    // 顶部主公信息
                                    if (game.me.identity != 'zhu') {
                                        if (!ui.dialogk) ui.dialogk = ui.create.div(".junbazhu", ui.arena);
                                        /*ui.dialogk是中间主公提示*/
                                        if (!ui.leftPane) ui.leftPane = ui.create.div('.left', ui.dialogk);
                                        if (!game.zhu.classList.contains('unseen')) {
                                            setTimeout(() => {
                                                if (!game.zhu.classList.contains('unseen')) {
                                                    ui.leftPane.style.backgroundImage = game.zhu.node.avatar.style.backgroundImage;
                                                };
                                            }, 1);
                                        };
                                        //删除背景图
                                        if (game.zhu.classList.contains('unseen')) ui.leftPane.style.backgroundImage = '';
                                        if (!ui.biankuang) ui.biankuang = ui.create.div('.biankuangname', ui.dialogk);
                                        ui.biankuang.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/kuang/name2_' + game.zhu.group + '.png');
                                        if (!ui.biao) ui.biao = ui.create.div('.biao', ui.leftPane)
                                        if (!ui.zhuover) ui.zhuover = ui.create.div('.zhuover', ui.dialogk);
                                        if (!ui.namek) ui.namek = ui.create.div('.name', ui.biankuang);
                                        ui.namek.innerHTML = get.translation(game.zhu.name);
                                        ui.namek.dataset.nature = get.groupnature2(game.zhu);
                                        if (!ui.zhuhpWrap) ui.zhuhpWrap = ui.create.div('.hp-wrap', ui.biankuang);
                                        if (!ui.zhuhp && ui.zhuhpWrap) ui.zhuhp = ui.create.div('.hp', ui.biankuang, ui.zhuhpWrap);
                                        if (!game.zhu.classList.contains('unseen')) {
                                            var hpNode = ui.zhuhp;
                                            var infoitem = lib.character[game.zhu.name];
                                            var hp = get.infoHp(infoitem[2]),
                                            maxHp = get.infoMaxHp(infoitem[2]),
                                            hujia = get.infoHujia(infoitem[2]);
                                            if (maxHp > 5 || (hujia && maxHp > 3)) {
                                                hpNode.innerHTML = (isNaN(hp) ? '×': (hp == Infinity ? '∞': hp)) + '<br>' + '/' + '<br>' + (isNaN(maxHp) ? '×': (maxHp == Infinity ? '∞': maxHp)) + '<div class="morehp"></div>';
                                                if (hujia) hpNode.innerHTML += '<div class="morehujia">' + hujia + '</div>';
                                                hpNode.classList.add('textstyle');
                                            } else {
                                                hpNode.innerHTML = '';
                                                hpNode.classList.remove('textstyle');
                                                while (maxHp > hpNode.childNodes.length) ui.create.div(hpNode);
                                                for (var i = 0; i < Math.max(0, maxHp); i++) {
                                                    var index = i;
                                                    if (i < hp) {
                                                        hpNode.childNodes[index].classList.remove('lost');
                                                    } else {
                                                        hpNode.childNodes[index].classList.add('lost');
                                                    };
                                                };
                                            };
                                            if (hp > Math.round(maxHp / 2) || hp === maxHp) {
                                                hpNode.dataset.condition = 'high';
                                            } else if (hp > Math.floor(maxHp / 3)) {
                                                hpNode.dataset.condition = 'mid';
                                            } else {
                                                hpNode.dataset.condition = 'low';
                                            };
                                        } else {
                                            if (ui.zhuhpWrap) ui.zhuhpWrap.remove();
                                            delete ui.zhuhpWrap;
                                            if (ui.zhuhp) ui.zhuhp.remove();
                                            delete ui.zhuhp;
                                        };
                                        if (!ui.rightPane) ui.rightPane = ui.create.div('.right', ui.dialogk);
                                        ui.rightPane.innerHTML = '<div></div>';
                                        lib.setScroll(ui.rightPane.firstChild);
                                        if (!game.zhu.classList.contains('unseen')) {
                                            var oSkills = game.zhu.skills;
                                            if (oSkills.length) {
                                                oSkills.forEach(function(name) {
                                                    ui.create.div('.xskill', '<div data-color>【' + get.translation(name) + '】</div>' + '<div>' + get.skillInfoTranslation(name, player) + '</div>', ui.rightPane.firstChild);
                                                });
                                            };
                                        };
                                    } else {
                                        if (ui.dialogk) ui.dialogk.remove();
                                        delete ui.dialogk;
                                        if (ui.leftPane) ui.leftPane.remove();
                                        delete ui.leftPane;
                                        if (ui.biankuang) ui.biankuang.remove();
                                        delete ui.biankuang;
                                        if (ui.biao) ui.biao.remove();
                                        delete ui.biao;
                                        if (ui.zhuover) ui.zhuover.remove();
                                        delete ui.zhuover;
                                        if (ui.namek) ui.namek.remove();
                                        delete ui.namek;
                                        if (ui.zhuhpWrap) ui.zhuhpWrap.remove();
                                        delete ui.zhuhpWrap;
                                        if (ui.zhuhp) ui.zhuhp.remove();
                                        delete ui.zhuhp;
                                        if (ui.rightPane) ui.rightPane.remove();
                                        delete ui.rightPane;
                                        // if (ui.dialogg) ui.dialogg.remove();
                                        // delete ui.dialogg;
                                        if (ui.dialogg) ui.dialogg.style.display = "none";
                                        // if (ui.metip) ui.metip.remove();
                                        // delete ui.metip;
                                        if (ui.metip) ui.metip.style.display = "none";
                                        if (ui.dialoggk) delete ui.dialoggk;
                                    };
                                    if (!ui.dizhutip) ui.dizhutip = ui.create.div('.dizhutip', ui.arena);
                                    ui.dizhutip.style.bottom = "55px";
                                    if (!ui.nmjindutiao) ui.nmjindutiao = ui.create.div('.nmjindutiao', ui.arena);
                                    ui.nmjindutiao.style.bottom = "35px";
                                    if (!ui.nmjindutiaox) ui.nmjindutiaox = ui.create.div('.nmjindutiaox', ui.nmjindutiao);
                                    var meidentity;
                                    if (game.me.identity == 'zhu') meidentity = "<span style='color:red;font-size:24px;'>主公️</span>";
                                    if (game.me.identity == 'zhong') meidentity = "<span style='color:#E9D670;font-size:24px;'>忠臣️</span>";
                                    if (game.me.identity == 'nei') meidentity = "<span style='color:#87CEFA;font-size:24px;'>内奸️</span>";
                                    if (game.me.identity == 'fan') meidentity = "<span style='color:#BAC58C;font-size:24px;'>反贼️</span>";
                                    ui.dizhutip.innerHTML = "你的身份是" + meidentity + "，请选择你的武将";
                                    //添加自由选将到选将框
                                    if (ui.cheat2 && ui.dialog) ui.dialog.content.querySelector('.buttons').insertBefore(ui.cheat2, ui.dialog.content.querySelector('.buttons').firstChild)
                                }, 1);
                            };
                            if (!ui.hjk) ui.hjk = ui.create.div('.hjk', document.body);
                            ui.create.div('', ui.hjk).innerHTML = '可换将次数 ' + `<span style='color:white;font-size:24px;font-weight: 900;'>${10}</span>`;
                            ui.create.div('', ui.hjk).innerHTML = '免费换将 ' + `<span style='color:white;font-size:24px;font-weight: 900;'>${3}</span>`;
                            game.junbaupdate();
                        };
                        if (game.me.special_identity) {
                            dialog.setCaption('选择角色（' + get.translation(game.me.special_identity) + '）');
                            game.me.node.identity.firstChild.innerHTML = get.translation(game.me.special_identity + '_bg');
                        } else {
                            dialog.setCaption('可选武将');
                            game.me.setIdentity();
                        };
                        if (!event.chosen.length) {
                            game.me.chooseButton(dialog, true).set('onfree', true).selectButton = function() {
                                if (_status.brawl && _status.brawl.doubleCharacter) return 2;
                                return get.config('double_character') ? 2 : 1
                            };
                        } else {
                            lib.init.onfree();
                        };
                        ui.create.cheat = function() {
                            _status.createControl = ui.cheat2;
                            ui.cheat = ui.create.control('更换', function() {
                                if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
                                    return;
                                };
                                if (game.changeCoin) {
                                    game.changeCoin( - 3);
                                };
                                if (game.zhu != game.me) {
                                    event.list.randomSort();
                                    if (_status.brawl && _status.brawl.chooseCharacter) {
                                        list = _status.brawl.chooseCharacter(event.list, num);
                                        if (list === false || list === 'nozhu') {
                                            list = event.list.slice(0, num);
                                        };
                                    } else {
                                        list = event.list.slice(0, num);
                                    };
                                } else {
                                    getZhuList().sort(lib.sort.character);
                                    list3.randomSort();
                                    if (_status.brawl && _status.brawl.chooseCharacter) {
                                        list = _status.brawl.chooseCharacter(getZhuList(), list3, num);
                                        if (list === false) {
                                            if (event.zhongmode) {
                                                list = list3.slice(0, 6);
                                            } else {
                                                list = getZhuList().concat(list3.slice(0, num));
                                            };
                                        } else if (list === 'nozhu') {
                                            event.list.randomSort();
                                            list = event.list.slice(0, num);
                                        };
                                    } else {
                                        if (event.zhongmode) {
                                            list = list3.slice(0, 6);
                                        } else {
                                            list = getZhuList().concat(list3.slice(0, num));
                                        };
                                    };
                                };
                                var buttons = ui.create.div('.buttons');
                                var node = _status.event.dialog.buttons[0].parentNode;
                                _status.event.dialog.buttons = ui.create.buttons(list, 'characterx', buttons);
                                _status.event.dialog.content.insertBefore(buttons, node);
                                buttons.animate('start');
                                node.remove();
                                game.uncheck();
                                game.check();
                            });
                            ui.cheat.id = "identityHuan";
                            delete _status.createControl;
                        };
                        if (lib.onfree) {
                            lib.onfree.push(function() {
                                event.dialogxx = ui.create.characterDialog('heightset');
                                if (ui.cheat2) {
                                    ui.cheat2.animate('controlpressdownx', 500);
                                    ui.cheat2.classList.remove('disabled');
                                };
                            });
                        } else {
                            event.dialogxx = ui.create.characterDialog('heightset');
                        };
                        ui.create.cheat2 = function() {
                            ui.cheat2 = ui.create.control('', function() {
                                let that = this;
                                if (this.dialog == _status.event.dialog) {
                                    if (game.changeCoin) {
                                        game.changeCoin(50);
                                    };
                                    this.dialog.close();
                                    _status.event.dialog = this.backup;
                                    this.backup.open();
                                    delete this.backup;
                                    if (ui.xuanback) ui.xuanback.remove();
                                    delete ui.xuanback;
                                    game.uncheck();
                                    game.check();
                                    if (ui.cheat) {
                                        ui.cheat.animate('controlpressdownx', 500);
                                        ui.cheat.classList.remove('disabled');
                                    };
                                } else {
                                    if (game.changeCoin) {
                                        game.changeCoin( - 10);
                                    };
                                    this.backup = _status.event.dialog;
                                    _status.event.dialog.close();
                                    _status.event.dialog = _status.event.parent.dialogxx;
                                    this.dialog = _status.event.dialog;
                                    if (!ui.xuanback) ui.xuanback = ui.create.div('.xuanback', document.body);
                                    ui.xuanback.onclick = function() {
                                        if (that.dialog == _status.event.dialog) {
                                            if (game.changeCoin) {
                                                game.changeCoin(50);
                                            };
                                            that.dialog.close();
                                            _status.event.dialog = that.backup;
                                            that.backup.open();
                                            delete that.backup;
                                            if (ui.xuanback) ui.xuanback.remove();
                                            delete ui.xuanback;
                                            game.uncheck();
                                            game.check();
                                            if (ui.cheat) {
                                                ui.cheat.animate('controlpressdownx', 500);
                                                ui.cheat.classList.remove('disabled');
                                            };
                                        };
                                    };
                                    this.dialog.open();
                                    game.uncheck();
                                    game.check();
                                    if (ui.cheat) {
                                        ui.cheat.classList.add('disabled');
                                    };
                                };
                            });
                            ui.cheat2.id = "identityXuan";
                            ui.cheat2.classList.add('button');
                            ui.cheat2.classList.add('character');
                            dialog.content.querySelector('.buttons').insertBefore(ui.cheat2, dialog.content.querySelector('.buttons').firstChild);
                            if (lib.onfree) {
                                ui.cheat2.classList.add('disabled');
                            };
                        };
                        if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
                            if (!ui.cheat && get.config('change_choice')) ui.create.cheat();
                            if (!ui.cheat2 && get.config('free_choose')) ui.create.cheat2();
                        };
                    };
                    // 等待主公
                    if (game.initShenfenRenwu && game.me.identity != "zhu") game.initShenfenRenwu(createSeat, createChoose);
                    else createChoose();
                    delete game.initShenfenRenwu; // 保证只弹一次
                    "step 2";
                    if (ui.dialogk) ui.dialogk.remove();
                    delete ui.dialogk;
                    if (ui.leftPane) ui.leftPane.remove();
                    delete ui.leftPane;
                    if (ui.biankuang) ui.biankuang.remove();
                    delete ui.biankuang;
                    if (ui.biao) ui.biao.remove();
                    delete ui.biao;
                    if (ui.zhuover) ui.zhuover.remove();
                    delete ui.zhuover;
                    if (ui.namek) ui.namek.remove();
                    delete ui.namek;
                    if (ui.zhuhp) ui.zhuhp.remove();
                    delete ui.zhuhp;
                    if (ui.rightPane) ui.rightPane.remove();
                    delete ui.rightPane;
                    // if (ui.dialogg) ui.dialogg.remove();
                    // delete ui.dialogg;
                    if (ui.dialogg) ui.dialogg.style.display = "none";
                    // if (ui.metip) ui.metip.remove();
                    // delete ui.metip;
                    if (ui.metip) ui.metip.style.display = "none";
                    if (ui.dialoggk) delete ui.dialoggk;
                    if (ui.xuanback) ui.xuanback.remove();
                    delete ui.xuanback;
                    if (ui.hjk) ui.hjk.remove();
                    delete ui.hjk;
                    if (ui.cheat) {
                        ui.cheat.close();
                        delete ui.cheat;
                    };
                    if (ui.cheat2) {
                        ui.cheat2.close();
                        delete ui.cheat2;
                    };
                    if (event.chosen.length) {
                        event.choosed = event.chosen;
                    } else if (event.modchosen) {
                        if (event.modchosen[0] == 'random') event.modchosen[0] = result.buttons[0].link;
                        else event.modchosen[1] = result.buttons[0].link;
                        event.choosed = event.modchosen;
                    } else if (result.buttons.length == 2) {
                        event.choosed = [result.buttons[0].link, result.buttons[1].link];
                        game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
                    } else {
                        event.choosed = [result.buttons[0].link];
                        game.addRecentCharacter(result.buttons[0].link);
                    };
                    event.rename = event.choosed[0];
                    var name = event.rename;
                    if (get.is.double(name)) {
                        game.me._groupChosen = true;
                        var list = get.is.double(name, true);
                    } else if (lib.character[name][1] == 'shen' && !lib.character[name][4].includes('hiddenSkill') && get.config('choose_group')) {
                        var list = lib.group.slice(0);
                        list.remove('shen');
                    };
                    if (list) {
                        var dialog = ui.create.newdialog('#choosegroup', '选择国籍<img src=' + lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/arrow.png' + ' style=width:30px;height:25px;margin-bottom:5px;left:2px;/>', [list, 'vcard']);
                        event.next1 = game.createEvent('chooseGroup');
                        event.next1.dialog = dialog;
                        event.next1.setContent(function() {
                            game.me.chooseButton(1, event.dialog, true).set('newconfirm1', true);
                        });
                        ui.dizhutip.innerHTML = "<span style='font-size:20px;color:#ebc914;;'>请选择你要变成的势力️</span>";
                        ui.dizhutip.style.bottom = '110px';
                        ui.nmjindutiao.style.bottom = '140px';
                        for (var i in dialog.buttons) { // 势力图片
                            var dd = dialog.buttons[i];
                            if (!dd) continue;
                            dd.style.width = '130px';
                            dd.style.height = '130px';
                            dd.style['border-radius'] = '100%';
                            dd.style['background-size'] = "100% 100%";
                            dd.style.margin = '15px';
                            dd.classList.add('none');
                            dd.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/group/' + dd.name + '.png');
                            dd.style.setProperty("box-shadow", "unset", "important");
                            // 清除多余字符
                            let cardReplaceConfig = false;
                            try {
                                cardReplaceConfig = game.getExtensionConfig('美化补充', 'cardReplace');
                            } catch (error) {   };
                            if (!cardReplaceConfig || cardReplaceConfig == "off") {
                                dd.innerHTML = "";
                            } else {
                                var background = dd.querySelector('.background');
                                if (background) background.style['font-size'] = "0px";
                                var topname = dd.querySelector('.top-name');
                                if (topname) topname.style['scale'] = "0";
                                var suitnum = dd.querySelector('.suit-num');
                                if (suitnum) suitnum.style['scale'] = "0";
                                var judgemark = dd.querySelector('.judge-mark');
                                if (judgemark) {
                                    var judge = judgemark.querySelector('.judge');
                                    if (judge) judge.style['font-size'] = "0px";
                                };
                            };
                        };
                    };
                    "step 3";
                    if (event.next1) event.group = event.next1._result.links[0][2];
                    delete event.next1;
                    if (event.choosed.length == 2) {
                        game.me.init(event.rename, event.choosed[1]);
                    } else {
                        game.me.init(event.rename);
                    };
                    ui.nmjindutiao.remove();
                    delete ui.nmjindutiao;
                    ui.dizhutip.remove();
                    delete ui.dizhutip;
                    ui.nmjindutiaox.remove();
                    delete ui.nmjindutiaox;
                    event.list.remove(get.sourceCharacter(game.me.name1));
                    event.list.remove(get.sourceCharacter(game.me.name2));
                    if (game.me == game.zhu && game.players.length > 4) {
                        game.me.hp++;
                        game.me.maxHp++;
                        game.me.update();
                    };
                    for (var i = 0; i < game.players.length; i++) {
                        if (game.players[i] != game.zhu && game.players[i] != game.me) {
                            event.list.randomSort();
                            event.ai(game.players[i], event.list.splice(0, get.config('choice_' + game.players[i].identity)), null, event.list)
                        };
                    };
                    "step 4";
                    if (event.group) {
                        game.me.group = event.group;
                        console.log(game.me.group);
                        game.me.node.name.dataset.nature = get.groupnature(game.me.group);
                        game.me.update();
                    };
                    for (var i = 0; i < game.players.length; i++) {
                        _status.characterlist.remove(game.players[i].name);
                        _status.characterlist.remove(game.players[i].name1);
                        _status.characterlist.remove(game.players[i].name2);
                    };
                    "step 5";
                    if (ui.dialogg) ui.dialogg.style.display = "inline-block";
                    if (ui.metip) ui.metip.style.display = "inline-block";
                    var ski = document.querySelector(".skill-control");
                    if (ski) ski.style.display = "none";
                    if (!waitDialog) var waitDialog = ui.create.div(".waitothers", ui.arena);
                    event.next1 = game.createEvent('waitothers');
                    event.next1.dialog = waitDialog;
                    if (!waitwujiangkuang) var waitwujiangkuang = ui.create.div('.waitwujiangkuang', waitDialog);
                    var group = get.groupnature2(lib.character[event.rename]);
                    waitwujiangkuang.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/kuang/name2_' + group + '.png');
                    if (!waitname) var waitname = ui.create.div('.waitname', waitwujiangkuang);
                    if (game.me.classList.contains('unseen')) {
                        const names = {
                            'jin_zhangchunhua': '张春华',
                            'jin_yanghuiyu': '羊徽瑜',
                            'xuangongzhu': '宣公主',
                            'jin_simayi': '司马懿',
                            'jin_wangyuanji': '王元姬',
                            'jin_simazhao': '司马昭',
                            'jin_xiahouhui': '夏侯徽',
                            'jin_simashi': '司马师',
                        };
                        const chosenName = names[event.rename];
                        if (chosenName) {
                            waitname.insertAdjacentHTML("afterbegin", chosenName);
                        };
                    } else {
                        waitname.innerHTML = get.translation(game.me.name);
                    };
                    waitname.dataset.nature = get.groupnature2(game.me);
                    if (!waithpwrap) var waithpwrap = ui.create.div('.hp-wrap', waitwujiangkuang);
                    if (!waithp && waithpwrap) var waithp = ui.create.div('.hp', waitwujiangkuang, waithpwrap);
                    var hpNode = waithp;
                    var infoitem = lib.character[event.rename];
                    var hp = get.infoHp(infoitem[2]), maxHp = get.infoMaxHp(infoitem[2]), hujia = get.infoHujia(infoitem[2]);
                    if (maxHp > 5 || (hujia && maxHp > 3)) {
                        hpNode.innerHTML = (isNaN(hp) ? '×' : (hp == Infinity ? '∞' : hp)) + '<br>' + '\\' + '<br>' + (isNaN(maxHp) ? '×' : (maxHp == Infinity ? '∞' : maxHp)) + '<div class="morehp"></div>';
                        if(hujia) hpNode.innerHTML += '<div class="morehujia">' + hujia + '</div>';
                        hpNode.classList.add('textstyle');
                    } else {
                        hpNode.innerHTML = '';
                        hpNode.classList.remove('textstyle');
                        while (maxHp > hpNode.childNodes.length) ui.create.div(hpNode);
                        for (var i = 0; i < Math.max(0, maxHp); i++) {
                            var index = i;
                            if (i < hp) {
                                hpNode.childNodes[index].classList.remove('lost');
                            } else {
                                hpNode.childNodes[index].classList.add('lost');
                            };
                        };
                    };
                    if (hp > Math.round(maxHp / 2) || hp === maxHp) {
                        hpNode.dataset.condition = 'high';
                    } else if (hp > Math.floor(maxHp / 3)) {
                        hpNode.dataset.condition = 'mid';
                    } else {
                        hpNode.dataset.condition = 'low';
                    };
                    if (!waitwujiang) var waitwujiang = ui.create.div('.waitwujiang', waitwujiangkuang);
                    waitwujiang.style.backgroundImage = game.me.node.avatar.style.backgroundImage;
                    if (!skillsarea) var skillsarea = ui.create.div('.skillsarea', waitDialog);
                    skillsarea.innerHTML = '<div></div>';
                    lib.setScroll(skillsarea.firstChild);
                    var oSkills = game.me.skills;
                    if (game.me.classList.contains('unseen')) {
                        game.me.removeSkill('g_hidden_ai');
                        for (var i of game.me.getSkills(lib.character[event.rename])) {
                            oSkills.add(i);
                        };
                    };
                    if (oSkills.length) {
                        oSkills.forEach(function(name) {
                            var imgSrc = lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/';
                            var skillHtml = '<div data-color>' + get.translation(name) + '</div>' + '<div>' + get.skillInfoTranslation(name, player) + '<br></div>';
                            if (!game.me.skills.contains(name) || (game.me.awakenedSkills.contains(name) && !lib.skill[name].limited)) {
                                ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                            } else if (get.info(name).enable) {
                                ui.create.div('.xskill', '<img src=' + imgSrc + 'zhudong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                            } else {
                                ui.create.div('.xskill', '<img src=' + imgSrc + 'beidong.png style=width:36.5px;height:36.5px;left:0px;margin-bottom:-10px;margin-right:-2px;/>' + skillHtml, skillsarea.firstChild);
                            };
                        });
                    };
                    if (!waittip) var waittip = ui.create.div('.junbatip', waitDialog);
                    if (!waittipyy) var waittipyy = ui.create.div('.junbatipyy', waitDialog);
                    waittip.style.bottom = "-76px";
                    waittipyy.style.bottom = "-76px";
                    waittip.innerHTML = "";
                    waittipyy.innerHTML = "";
                    waittip.style.animation = 'none';
                    waittipyy.style.animation = 'none';
                    if (!waitjindutiao) var waitjindutiao = ui.create.div('.waitjindutiao', waitDialog);
                    waitjindutiao.style.bottom = "-94px";
                    if (!waitjindutiaox) var waitjindutiaox = ui.create.div('.waitjindutiaox', waitDialog);
                    waitjindutiaox.style.bottom = "-93.8px";
                    waitjindutiaox.style.animation = 'waitxiaoshi 5s linear'; // 这里和下方定时器同步
                    var dizhutip = ui.create.div('.dizhutip', waitDialog);
                    dizhutip.style.bottom = "-74px";
                    dizhutip.innerHTML = "请等待其他玩家选择武将";
                    if (!waitbtn) var waitbtn = ui.create.div('.waitbtn', waitDialog);
                    waitbtn.innerHTML = "点击查看简要攻略";
                    event.next1.setContent(function() {
                        game.me.chooseButton(event.dialog, true).set('noconfirm', true);
                        var waitbtn = event.dialog.getElementsByClassName('waitbtn')[0];
                        var clicked = false;
                        waitbtn.addEventListener('click', function() {
                            clicked = true;
                            game.playAudio('../extension/美化补充/image/xuanjiangjiemian/audio/TinyButton.mp3');
                            clearTimeout(timer);
                            if (ui.dialogg) ui.dialogg.remove();
                            delete ui.dialogg;
                            if (ui.metip) ui.metip.remove();
                            delete ui.metip;
                            event.dialog.remove();
                            game.resume();
                        });
                        if (!clicked) {
                            var timer = setTimeout(() => {
                                game.resume();
                                if (ui.dialogg) ui.dialogg.remove();
                                delete ui.dialogg;
                                if (ui.metip) ui.metip.remove();
                                delete ui.metip;
                                event.dialog.remove();
                            }, 5000); // 这里控制等待时长，1000 = 1秒
                        };
                    });
                    "step 6";
                    setTimeout(function() {
                        ui.arena.classList.remove('choose-character');
                    }, 500);
                    ui.background.style.zIndex = '-2';
                    var ski = document.querySelector(".skill-control");
                    if (ski) ski.style.display = "inline-block";
                    var dcs = document.getElementById("dui-controls");
                    if (dcs) dcs.style.scale = '1';
                    if (event.special_identity) {
                        for (var i = 0; i < event.special_identity.length; i++) {
                            game.zhu.addSkill(event.special_identity[i]);
                        };
                    };
                });
            };
        };
    };
    // 22对决选将界面
    if (lib.config.extension_美化补充_duijuexuanjiangjiemian && lib.config.extension_美化补充_duijuexuanjiangjiemian == "shousha") {
        if (lib.config.mode == 'versus' && get.config('versus_mode') == 'two') {
            lib.game.chooseCharacterTwo = function() {
                ui.background.style.zIndex = '6';
                var next = game.createEvent("chooseCharacter");
                next.showConfig = true;
                next.setContent(function() {
                    "step 0";
                    game.no_continue_game = true;
                    lib.init.onfree();
                    "step 1";
                    ui.arena.classList.add("choose-character");
                    // if (true) { // 修改部分，修改换位技能
                    //     for (var i in lib.skill) {
                    //         if (lib.skill[i].changeSeat) {
                    //             lib.skill[i] = {};
                    //             if (lib.translate[i + '_info']) {
                    //                 lib.translate[i + '_info'] = '此模式下不可用';
                    //             }
                    //         }
                    //     }
                    // }
                    game.no_continue_game = true;

                    var bool = Math.random() < 0.5;
                    var bool2 = Math.random() < 0.5;
                    var ref = game.players[0];
    
                    ref.side = bool;
                    ref.next.side = bool2;
                    ref.next.next.side = !bool;
                    ref.previous.side = !bool2;
    
                    var firstChoose = game.players.randomGet();
                    if (firstChoose.next.side == firstChoose.side) {
                        firstChoose = firstChoose.next;
                    }
                    _status.firstAct = firstChoose;
                    for (var i = 0; i < 4; i++) {
                        firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
                        firstChoose = firstChoose.next;
                    }
    
                    for (var i = 0; i < game.players.length; i++) {
                        if (game.players[i].side == game.me.side) {
                            game.players[i].node.identity.firstChild.innerHTML = "友";
                        } else {
                            game.players[i].node.identity.firstChild.innerHTML = "敌";
                        }
                        game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
                    }
                    "step 2";
                    //22选将框分配
                    var list = [];
                    var list4 = [];
                    for (i in lib.characterReplace) {
                        var ix = lib.characterReplace[i];
                        for (var j = 0; j < ix.length; j++) {
                            if (lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                        }
                        if (ix.length) {
                            list.push(i);
                            list4.addArray(ix);
                        }
                    }
                    for (i in lib.character) {
                        if (!list4.includes(i) && !lib.filter.characterDisabled(i)) {
                            list.push(i);
                            list4.push(i);
                        }
                    }
                    var choose = [];
                    event.list = list;
                    _status.characterlist = list4;
    
                    if (true) { // 修改部分，修改22布局
                        var one = _status.firstAct;
                        //手动修改进入时的布局
                        var xia = game.me.nextSeat || game.me.next;
                        var xxia = xia && (xia.nextSeat || xia.next);
                        var shang = game.me.previousSeat || game.me.previous;
                        if (game.me == _status.firstAct) {//主一号位
                            xia.classList.add('two-versus-1-xia');
                            xxia.classList.add('two-versus-1-xxia');
                            // ui.create.div('.game_friend_gua', shang);
                            // ui.create.div('.game_friend_gua', game.me);
                            // ui.create.div('.game_enemy_gua', xia);
                            // ui.create.div('.game_enemy_gua', xxia);
                            // var cksp = ui.create.div('.chakanshoupai', shang);
                            // cksp.onclick = function() {
                            //     if (shang.getCards('h').length > 0) {
                            //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                            //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                            //         popuperContainer.addEventListener('click', event => {
                            //             popuperContainer.delete(200);
                            //             shoupai.delete(200);
                            //         });
                            //     }
                            // }
                        } else if (shang == _status.firstAct) {//主二号位
                            xia.classList.add('two-versus-2-xia');
                            xxia.classList.add('two-versus-2-xxia');
                            // ui.create.div('.game_friend_gua', xia);
                            // ui.create.div('.game_friend_gua', game.me);
                            // ui.create.div('.game_enemy_gua', shang);
                            // ui.create.div('.game_enemy_gua', xxia);
                            // var cksp = ui.create.div('.chakanshoupaix', xia);
                            // cksp.onclick = function() {
                            //     if (xia.getCards('h').length > 0) {
                            //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                            //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                            //         popuperContainer.addEventListener('click', event => {
                            //             popuperContainer.delete(200);
                            //             shoupai.delete(200);
                            //         });
                            //     }
                            // }
                        } else if (xia == _status.firstAct) {//主视角四号位
                            xia.classList.add('two-versus-3-xia');
                            xxia.classList.add('two-versus-3-xxia');
                            // ui.create.div('.game_friend_gua', xia);
                            // ui.create.div('.game_friend_gua', game.me);
                            // ui.create.div('.game_enemy_gua', shang);
                            // ui.create.div('.game_enemy_gua', xxia);
                            // var cksp = ui.create.div('.chakanshoupaix', xia);
                            // cksp.onclick = function() {
                            //     if (xia.getCards('h').length > 0) {
                            //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                            //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                            //         popuperContainer.addEventListener('click', event => {
                            //             popuperContainer.delete(200);
                            //             shoupai.delete(200);
                            //         });
                            //     }
                            // }
                        } else if (xxia == _status.firstAct) {//主视角三号位
                            xia.classList.add('two-versus-4-xia');
                            xxia.classList.add('two-versus-4-xxia');
                            // ui.create.div('.game_friend_gua', shang);
                            // ui.create.div('.game_friend_gua', game.me);
                            // ui.create.div('.game_enemy_gua', xia);
                            // ui.create.div('.game_enemy_gua', xxia);
                            // var cksp = ui.create.div('.chakanshoupai', shang);
                            // cksp.onclick = function() {
                            //     if (shang.getCards('h').length > 0) {
                            //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                            //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                            //         popuperContainer.addEventListener('click', event => {
                            //             popuperContainer.delete(200);
                            //             shoupai.delete(200);
                            //         });
                            //     }
                            // }
                        }
                    }

                    // 座位图
                    var createSeat = function() {
                        if (!ui.dialogg) ui.dialogg = ui.create.div(".junbaseat", ui.arena);
                        else ui.dialogg.style.display = "inline-block";
                        var points = {
                            '1': {
                                '1': {
                                    right: '1px',
                                    bottom: '1px',
                                },
                                '2': {
                                    right: '6.4%',
                                    bottom: '40%',
                                },
                                '3': {
                                    right: '44.8%',
                                    bottom: '60%',
                                },
                                '4': {
                                    right: '84.2%',
                                    bottom: '40%',
                                },
                            },
                            '2': {
                                '2': {
                                    right: '1px',
                                    bottom: '1px',
                                },
                                '3': {
                                    right: '6.4%',
                                    bottom: '40%',
                                },
                                '4': {
                                    right: '44.8%',
                                    bottom: '60%',
                                },
                                '1': {
                                    right: '84.2%',
                                    bottom: '40%',
                                },
                            },
                            '3': {
                                '3': {
                                    right: '1px',
                                    bottom: '1px',
                                },
                                '4': {
                                    right: '6.4%',
                                    bottom: '40%',
                                },
                                '1': {
                                    right: '44.8%',
                                    bottom: '60%',
                                },
                                '2': {
                                    right: '84.2%',
                                    bottom: '40%',
                                },
                            },
                            '4': {
                                '4': {
                                    right: '1px',
                                    bottom: '1px',
                                },
                                '1': {
                                    right: '6.4%',
                                    bottom: '40%',
                                },
                                '2': {
                                    right: '44.8%',
                                    bottom: '60%',
                                },
                                '3': {
                                    right: '84.2%',
                                    bottom: '40%',
                                },
                            },
                        };
                        var nk = game.players.length;
                        var numj = get.distance(_status.firstAct, game.me, "absolute") + 1;
                        if (!ui.dialoggk) {
                            ui.dialoggk = [];
                            /*dialogg是右上角*/
                            for (i = 0; i < nk; i++) {
                                var numk = get.distance(_status.firstAct, game.players[i], "absolute") + 1;
                                var k = ui.create.div('.num', ui.dialogg);
                                k.style.right = points[numj][numk]["right"];
                                k.style.bottom = points[numj][numk]["bottom"];
                                ui.dialoggk.push(k);
                                if (game.players[i].side == game.me.side) k.classList.add("hu");
                                else k.classList.add("long");
                                k.innerHTML = "<img src='" + lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/seat_' + numk + '.png' + "' style='position:relative;width:12px;height:12px;bottom:-18px;left:4px;'/>";
                                var tip = ui.create.div('.dizhutip', k);
                                tip.style.top = '1px';
                                tip.style.fontSize = '16px';
                                tip.innerHTML = k.classList.contains("hu") ? "虎" : "龙";
                            };
                        };
                        if (ui.dialoggk && ui.dialoggk.length) {
                            for (i = 0; i < nk; i++) {
                                var numk = get.distance(_status.firstAct, game.players[i], "absolute") + 1;
                                var k = ui.dialoggk[i];
                                k.className = 'num';
                                k.style.right = points[numj][numk]["right"];
                                k.style.bottom = points[numj][numk]["bottom"];
                                if (game.players[i].side == game.me.side) k.classList.add("hu");
                                else k.classList.add("long");
                                k.innerHTML = "<img src='" + lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/seat_' + numk + '.png' + "' style='position:relative;width:12px;height:12px;bottom:-18px;left:4px;'/>";
                                var tip = ui.create.div('.dizhutip', k);
                                tip.style.top = '1px';
                                tip.style.fontSize = '16px';
                                tip.innerHTML = k.classList.contains("hu") ? "虎" : "龙";
                            };
                        };
                        if (!ui.metip) ui.metip = ui.create.div('.metip', ui.dialogg);
                        ui.metip.innerHTML = "<span style='color:#ADD8E6;'>我(虎)</span>";
                    };
                    createSeat();

                    // 己方玩家选将位置
                    var playerWeizhi = function() {
                        var gp = game.players;
                        gp.sort((a, b) => get.distance(_status.firstAct, a, "absolute") - get.distance(_status.firstAct, b, "absolute"));
                        var np;
                        var pp;
                        for (var i = 0; i < gp.length; i++) {
                            if (gp[i] == game.me) {
                                if (i + 1 < gp.length) np = gp[i + 1];
                                else np = gp[0];
                                if (i > 0) pp = gp[i - 1];
                                else pp = gp[gp.length - 1];
                            };
                        };
                        if (ui['biankuang1']) {
                            ui['biankuang1'].classList.remove('two-versus-zuobian');
                            ui['biankuang1'].classList.remove('two-versus-youbian');
                        };
                        if (ui['biankuang2']) {
                            ui['biankuang2'].classList.remove('two-versus-zuobian');
                            ui['biankuang2'].classList.remove('two-versus-youbian');
                        };
                        if (ui['leftPane1']) {
                            ui['leftPane1'].classList.remove('two-versus-zuobian');
                            ui['leftPane1'].classList.remove('two-versus-youbian');
                        };
                        if (ui['leftPane2']) {
                            ui['leftPane2'].classList.remove('two-versus-zuobian');
                            ui['leftPane2'].classList.remove('two-versus-youbian');
                        };
                        if (np && np.side == game.me.side) {
                            if (ui['biankuang1']) ui['biankuang1'].classList.add('two-versus-youbian');
                            if (ui['biankuang2']) ui['biankuang2'].classList.add('two-versus-zuobian');
                            if (ui['leftPane1']) ui['leftPane1'].classList.add('two-versus-youbian');
                            if (ui['leftPane2']) ui['leftPane2'].classList.add('two-versus-zuobian');
                        } else if (pp && pp.side == game.me.side) {
                            if (ui['biankuang1']) ui['biankuang1'].classList.add('two-versus-zuobian');
                            if (ui['biankuang2']) ui['biankuang2'].classList.add('two-versus-youbian');
                            if (ui['leftPane1']) ui['leftPane1'].classList.add('two-versus-zuobian');
                            if (ui['leftPane2']) ui['leftPane2'].classList.add('two-versus-youbian');
                        };
                    };
                    playerWeizhi();

                    // 玩家面板
                    var getInfoitem = function(target) {
                        var name = target;
                        if (get.itemtype(target) === 'player') name = target.isUnseen(0) ? target.isUnseen(1) ? null : target.name2 : target.name;
                        if (name && typeof name === 'string') {
                            var infoitem = lib.character[name];
                            if (!infoitem) {
                                for (var itemx in lib.characterPack) {
                                    if (lib.characterPack[itemx][name]) {
                                        infoitem = lib.characterPack[itemx][name];
                                        break;
                                    };
                                };
                            };
                            if (infoitem) infoitem.name = name; // 增添玩家name
                            return infoitem;
                        };
                    };
                    var addWujiangKuang = function(target = game.me, position = ui.arena, num = 0, follow = true) {
                        target = getInfoitem(target);
                        if (target) {
                            if (!ui['biankuang' + num]) ui['biankuang' + num] = ui.create.div('.biankuangname', position);
                            if (game.isFileExist(lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/kuang/name2_' + target.group + '.png')) {
                                ui['biankuang' + num].setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/kuang/name2_' + target.group + '.png');
                            } else {
                                ui['biankuang' + num].setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/kuang/name2_unknown.png');
                            };
                            if (!ui['namek' + num]) ui['namek' + num] = ui.create.div('.name', ui['biankuang' + num]);
                            ui['namek' + num].innerHTML = get.translation(target.name);
                            ui['namek' + num].dataset.nature = get.groupnature2(target);
                            if (!ui['zhuhpWrap' + num]) ui['zhuhpWrap' + num] = ui.create.div('.hp-wrap', ui['biankuang' + num]);
                            if (!ui['zhuhp' + num] && ui['zhuhpWrap' + num]) ui['zhuhp' + num] = ui.create.div('.hp', ui['biankuang' + num], ui['zhuhpWrap' + num]);
                            if (!(target.isUnseen && follow)) {
                                var hpNode = ui['zhuhp' + num];
                                var hp = target.hp,
                                maxHp = target.maxHp,
                                hujia = target.hujia;
                                if (maxHp > 5 || (hujia && maxHp > 3)) {
                                    hpNode.innerHTML = (isNaN(hp) ? '×': (hp == Infinity ? '∞': hp)) + '<br>' + '/' + '<br>' + (isNaN(maxHp) ? '×': (maxHp == Infinity ? '∞': maxHp)) + '<div class="morehp"></div>';
                                    if (hujia) hpNode.innerHTML += '<div class="morehujia">' + hujia + '</div>';
                                    hpNode.classList.add('textstyle');
                                } else {
                                    hpNode.innerHTML = '';
                                    hpNode.classList.remove('textstyle');
                                    while (maxHp > hpNode.childNodes.length) ui.create.div(hpNode);
                                    for (var i = 0; i < Math.max(0, maxHp); i++) {
                                        var index = i;
                                        if (i < hp) {
                                            hpNode.childNodes[index].classList.remove('lost');
                                        } else {
                                            hpNode.childNodes[index].classList.add('lost');
                                        };
                                    };
                                };
                                if (hp > Math.round(maxHp / 2) || hp === maxHp) {
                                    hpNode.dataset.condition = 'high';
                                } else if (hp > Math.floor(maxHp / 3)) {
                                    hpNode.dataset.condition = 'mid';
                                } else {
                                    hpNode.dataset.condition = 'low';
                                };
                            } else {
                                if (ui['zhuhpWrap' + num]) ui['zhuhpWrap' + num].remove();
                                delete ui['zhuhpWrap' + num];
                                if (ui['zhuhp' + num]) ui['zhuhp' + num].remove();
                                delete ui['zhuhp' + num];
                            };
                        } else {
                            if (!ui['biankuang' + num]) ui['biankuang' + num] = ui.create.div('.biankuangname', position);
                            ui['biankuang' + num].setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/kuang/name2_unknown.png');
                        };
                    };
                    var removeWujiangKuang = function(num = 0) {
                        if (ui['biankuang' + num]) ui['biankuang' + num].remove();
                        delete ui['biankuang' + num];
                        if (ui['namek' + num]) ui['namek' + num].remove();
                        delete ui['namek' + num];
                        if (ui['zhuhpWrap' + num]) ui['zhuhpWrap' + num].remove();
                        delete ui['zhuhpWrap' + num];
                        if (ui['zhuhp' + num]) ui['zhuhp' + num].remove();
                        delete ui['zhuhp' + num];
                    };
                    var addWujiangPane = function(target = game.me, position = ui.arena, num = 0, follow = true) {
                        target = getInfoitem(target);
                        if (target) {
                            if (!ui['leftPane' + num]) ui['leftPane' + num] = ui.create.div('.left', position);
                            if (!(target.isUnseen && follow)) {
                                setTimeout(() => {
                                    if (!(target.isUnseen && follow)) {
                                        ui['leftPane' + num].setBackground(target.name, 'character');
                                        // ui['leftPane' + num].style.backgroundImage = target.node.avatar.style.backgroundImage;
                                    };
                                }, 1);
                            };
                            if (target.isUnseen && follow) ui['leftPane' + num].style.backgroundImage = '';
                        } else {
                            if (!ui['leftPane' + num]) ui['leftPane' + num] = ui.create.div('.left', position);
                        };
                    };
                    var removeWujiangPane = function(num = 0) {
                        if (ui['leftPane' + num]) ui['leftPane' + num].remove();
                        delete ui['leftPane' + num];
                    };
                    if (!ui.dialogk) ui.dialogk = ui.create.div(".junbazhu", ui.arena);
                    if (ui.dialogk) ui.dialogk.classList.add('two-versus');
                    if (!ui.wujiangdikuang1) {
                        ui.wujiangdikuang1 = ui.create.div('.two-versus-wujiangdikuang', ui.dialogk);
                        ui.wujiangdikuang1.classList.add('two-versus-wujiangdikuang1');
                    };
                    if (!ui.wujiangdikuang2) {
                        ui.wujiangdikuang2 = ui.create.div('.two-versus-wujiangdikuang', ui.dialogk);
                        ui.wujiangdikuang2.classList.add('two-versus-wujiangdikuang2');
                    };
                    addWujiangKuang(false, ui.dialogk, 1, false);
                    addWujiangPane(false, ui.dialogk, 1, false);
                    if (ui['leftPane1']) {
                        ui.weitatuijian = ui.create.div('.two-versus-weitatuijian', ui['leftPane1']);
                        ui.weitatuijianxiaotouxiang = ui.create.div('.two-versus-tuijianxiaotouxiang', ui.weitatuijian);
                        // ui.weitatuijianxiaotouxiang.setBackground(name, 'character');
                        // if (control == 'two-versus-ziji') ui.weitatuijian.classList.remove('selectedxx');
                        // else ui.weitatuijian.classList.add('selectedxx');
                        ui.weitatuijian.addEventListener('click', function() {
                            var caption = document.querySelector('#identitychoose.two-versus>.content-container>.content>.caption:first-child');
                            if (this.classList.contains('selectedxx')) {
                                this.classList.remove('selectedxx');
                                if (caption) {
                                    if (caption.classList.contains('selectedxx')) caption.classList.remove('selectedxx');
                                    caption.innerHTML = `选择武将`;
                                };
                            } else {
                                this.classList.add('selectedxx');
                                for (var i = 0; i < game.players.length; i++) {
                                    var target = game.players[i];
                                    if (target.side == game.me.side) {
                                        var num = get.distance(_status.firstAct, target, "absolute") + 1;
                                        if (caption) {
                                            if (!caption.classList.contains('selectedxx')) caption.classList.add('selectedxx');
                                            caption.innerHTML = `正在给${num}号位推荐武将`;
                                        };
                                        break;
                                    };
                                };
                            };
                            if (control) {
                                if (control == 'two-versus-ziji') control = 'two-versus-duiyou';
                                else if (control == 'two-versus-duiyou') control = 'two-versus-ziji';
                            };
                        });
                    };
                    addWujiangKuang(false, ui.dialogk, 2, false);
                    addWujiangPane(false, ui.dialogk, 2, false);
                    if (ui['leftPane2']) {
                        ui.create.div('.two-versus-zijitabel', ui['leftPane2']);
                        ui.create.div('.two-versus-zhanshizhanji', ui['leftPane2']);
                    };
                    playerWeizhi();

                    ui.yuyin = ui.create.div(".two-versus-yuyin", ui.arena);
                    ui.shengyin = ui.create.div(".two-versus-shengyin", ui.arena);
                    ui.dizhutip = ui.create.div('.dizhutip', ui.arena);
                    ui.dizhutip.innerHTML = '请选择武将';
                    ui.nmjindutiao = ui.create.div('.nmjindutiao', ui.arena);
                    ui.nmjindutiaox = ui.create.div('.nmjindutiaox', ui.nmjindutiao);

                    // 选择位置
                    var addSetting = function (dialog) {
                        dialog.add("选择座位").classList.add("add-setting");
                        var seats = document.createElement("table");
                        seats.classList.add("add-setting");
                        seats.style.margin = "0";
                        seats.style.width = "100%";
                        seats.style.position = "relative";
                        for (var i = 1; i <= game.players.length; i++) {
                            var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
                            td.innerHTML = get.cnNumber(i, true);
                            td.link = i - 1;
                            seats.appendChild(td);
                            if (get.distance(_status.firstAct, game.me, "absolute") === i - 1) {
                                td.classList.add("bluebg");
                            }
                            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                if (get.distance(_status.firstAct, game.me, "absolute") == this.link) return;
                                var current = this.parentNode.querySelector(".bluebg");
                                if (current) {
                                    current.classList.remove("bluebg");
                                }
                                this.classList.add("bluebg");
                                _status.firstAct = game.me;
                                for (var i = 0; i < this.link; i++) {
                                    _status.firstAct = _status.firstAct.previous;
                                }
                                var firstChoose = _status.firstAct;
                                firstChoose.next.side = !firstChoose.side;
                                firstChoose.next.next.side = !firstChoose.side;
                                firstChoose.previous.side = firstChoose.side;
                                for (var i = 0; i < game.players.length; i++) {
                                    if (game.players[i].side == game.me.side) {
                                        game.players[i].node.identity.firstChild.innerHTML = "友";
                                    } else {
                                        game.players[i].node.identity.firstChild.innerHTML = "敌";
                                    }
                                    game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
                                }
                                for (var i = 0; i < 4; i++) {
                                    firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
                                    firstChoose = firstChoose.next;
                                }
    
                                if (true) { // 修改部分，修改22布局
                                    let targets = game.players.concat(game.dead);
                                    //移除标签
                                    targets.forEach(target => {
                                        target.classList.remove('two-versus-1-xia');
                                        target.classList.remove('two-versus-1-xxia');
                                        target.classList.remove('two-versus-2-xia');
                                        target.classList.remove('two-versus-2-xxia');
                                        target.classList.remove('two-versus-3-xia');
                                        target.classList.remove('two-versus-3-xxia');
                                        target.classList.remove('two-versus-4-xia');
                                        target.classList.remove('two-versus-4-xxia');
                                    });
                                    var one = _status.firstAct;//没有用
                                    //再次修改自由选择位置之后的布局
                                    var xia = game.me.nextSeat || game.me.next;
                                    var xxia = xia && (xia.nextSeat || xia.next);
                                    var shang = game.me.previousSeat || game.me.previous;
                                    // var shoupaixx = document.querySelector('.chakanshoupai');
                                    // if (shoupaixx) { shoupaixx.parentNode.removeChild(shoupaixx); }
                                    // var shoupaixxx = document.querySelector('.chakanshoupaix');
                                    // if (shoupaixxx) { shoupaixxx.parentNode.removeChild(shoupaixxx); }
                                    // for (var i = 0; i < 5; i++) {
                                    //     var huduixxx = document.querySelector('.game_friend_gua');
                                    //     if (huduixxx) { huduixxx.parentNode.removeChild(huduixxx); }
                                    //     var longduixxx = document.querySelector('.game_enemy_gua');
                                    //     if (longduixxx) { longduixxx.parentNode.removeChild(longduixxx); }
                                    // }
                                    if (game.me == _status.firstAct) {//主一号位
                                        xia.classList.add('two-versus-1-xia');
                                        xxia.classList.add('two-versus-1-xxia');
                                        // ui.create.div('.game_friend_gua', shang);
                                        // ui.create.div('.game_friend_gua', game.me);
                                        // ui.create.div('.game_enemy_gua', xia);
                                        // ui.create.div('.game_enemy_gua', xxia);
                                        // var cksp = ui.create.div('.chakanshoupai', shang);
                                        // cksp.onclick = function() {
                                        //     if (shang.getCards('h').length > 0) {
                                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                                        //         popuperContainer.addEventListener('click', event => {
                                        //             popuperContainer.delete(200);
                                        //             shoupai.delete(200);
                                        //         });
                                        //     }
                                        // }
                                    } else if (shang == _status.firstAct) {//主二号位
                                        xia.classList.add('two-versus-2-xia');
                                        xxia.classList.add('two-versus-2-xxia');
                                        // ui.create.div('.game_friend_gua', xia);
                                        // ui.create.div('.game_friend_gua', game.me);
                                        // ui.create.div('.game_enemy_gua', shang);
                                        // ui.create.div('.game_enemy_gua', xxia);
                                        // var cksp = ui.create.div('.chakanshoupaix', xia);
                                        // cksp.onclick = function() {
                                        //     if (xia.getCards('h').length > 0) {
                                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                                        //         popuperContainer.addEventListener('click', event => {
                                        //             popuperContainer.delete(200);
                                        //             shoupai.delete(200);
                                        //         });
                                        //     }
                                        // }
                                    } else if (xia == _status.firstAct) {//主视角四号位
                                        xia.classList.add('two-versus-3-xia');
                                        xxia.classList.add('two-versus-3-xxia');
                                        // ui.create.div('.game_friend_gua', xia);
                                        // ui.create.div('.game_friend_gua', game.me);
                                        // ui.create.div('.game_enemy_gua', shang);
                                        // ui.create.div('.game_enemy_gua', xxia);
                                        // var cksp = ui.create.div('.chakanshoupaix', xia);
                                        // cksp.onclick = function() {
                                        //     if (xia.getCards('h').length > 0) {
                                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                                        //         popuperContainer.addEventListener('click', event => {
                                        //             popuperContainer.delete(200);
                                        //             shoupai.delete(200);
                                        //         });
                                        //     }
                                        // }
                                    } else if (xxia == _status.firstAct) {//主视角三号位
                                        xia.classList.add('two-versus-4-xia');
                                        xxia.classList.add('two-versus-4-xxia');
                                        // ui.create.div('.game_friend_gua', shang);
                                        // ui.create.div('.game_friend_gua', game.me);
                                        // ui.create.div('.game_enemy_gua', xia);
                                        // ui.create.div('.game_enemy_gua', xxia);
                                        // var cksp = ui.create.div('.chakanshoupai', shang);
                                        // cksp.onclick = function() {
                                        //     if (shang.getCards('h').length > 0) {
                                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                                        //         popuperContainer.addEventListener('click', event => {
                                        //             popuperContainer.delete(200);
                                        //             shoupai.delete(200);
                                        //         });
                                        //     }
                                        // }
                                    }
                                }
                                createSeat();
                                playerWeizhi();
                            });
                        }
                        dialog.content.appendChild(seats);
                        if (game.me == game.zhu) {
                            seats.previousSibling.style.display = "none";
                            seats.style.display = "none";
                        }
    
                        dialog.add(ui.create.div(".placeholder.add-setting"));
                        dialog.add(ui.create.div(".placeholder.add-setting"));
                        if (get.is.phoneLayout()) dialog.add(ui.create.div(".placeholder.add-setting"));
                    };
                    var removeSetting = function () {
                        var dialog = _status.event.dialog;
                        if (dialog) {
                            dialog.style.height = "";
                            delete dialog._scrollset;
                            var list = Array.from(dialog.querySelectorAll(".add-setting"));
                            while (list.length) {
                                list.shift().remove();
                            }
                            ui.update();
                        }
                    };
                    event.addSetting = addSetting;
                    event.removeSetting = removeSetting;
    
                    var characterChoice;
                    if (_status.brawl && _status.brawl.chooseCharacter) {
                        characterChoice = _status.brawl.chooseCharacter(list, game.me);
                    } else {
                        // characterChoice = list.randomGets(7);
                        characterChoice = list.randomGets(10);
                    }
                    var basenum = 1;
                    var basestr = "选择角色";
                    if (get.config("two_assign")) {
                        basenum = 2;
                        basestr = "选择你和队友的角色";
                        event.two_assign = true;
                    }
                    // if (get.config("replace_character_two")) {
                    //     basestr += "（含一名替补角色）";
                    //     _status.replacetwo = true;
                    //     game.additionaldead = [];
                    //     basenum *= 2;
                    // }
                    // var dialog = ui.create.dialog(basestr, [characterChoice, "characterx"]);
                    // game.me.chooseButton(true, dialog, basenum).set("onfree", true);
                    // if (!_status.brawl || !_status.brawl.noAddSetting) {
                    //     if (get.config("change_identity")) {
                    //         addSetting(dialog);
                    //     }
                    // }
                    delete event.swapnochoose;
                    var dialog;
                    if (event.swapnodialog) {
                        dialog = ui.dialog;
                        event.swapnodialog(dialog, characterChoice);
                        delete event.swapnodialog;
                    } else {
                        var str = '选择武将';
                        if (_status.brawl && _status.brawl.chooseCharacterStr) {
                            str = _status.brawl.chooseCharacterStr;
                        };
                        dialog = ui.create.dialog(str, 'hidden', [characterChoice, 'characterx']);
                        dialog.classList.add('noupdate');
                        dialog.id = 'identitychoose';
                        dialog.classList.add('two-versus');
                        dialog.style.transform = "translate(0px, 16px)";
                        var dcs = document.getElementById("dui-controls");
                        if (dcs) dcs.style.scale = '0';
                        if (!_status.brawl || !_status.brawl.noAddSetting) {
                            if (get.config("change_identity")) {
                                addSetting(dialog);
                            };
                        };
                    };
                    dialog.setCaption('选择武将');
                    var clearUI = function() {
                        if (ui.dialogg) ui.dialogg.remove();
                        delete ui.dialogg;
                        if (ui.dialogk) ui.dialogk.remove();
                        delete ui.dialogk;
                        if (ui.dialoggk) ui.dialoggk.remove();
                        delete ui.dialoggk;
                        if (ui.metip) ui.metip.remove();
                        delete ui.metip;
                        if (ui.wujiangdikuang1) ui.wujiangdikuang1.remove();
                        delete ui.wujiangdikuang1;
                        if (ui.wujiangdikuang2) ui.wujiangdikuang2.remove();
                        delete ui.wujiangdikuang2;
                        if (ui['biankuang1']) ui['biankuang1'].remove();
                        delete ui['biankuang1'];
                        if (ui['biankuang2']) ui['biankuang2'].remove();
                        delete ui['biankuang2'];
                        if (ui['leftPane1']) ui['leftPane1'].remove();
                        delete ui['leftPane1'];
                        if (ui['leftPane2']) ui['leftPane2'].remove();
                        delete ui['leftPane2'];
                        if (ui['namek1']) ui['namek1'].remove();
                        delete ui['namek1'];
                        if (ui['namek2']) ui['namek2'].remove();
                        delete ui['namek2'];
                        if (ui['zhuhpWrap1']) ui['zhuhpWrap1'].remove();
                        delete ui['zhuhpWrap1'];
                        if (ui['zhuhpWrap2']) ui['zhuhpWrap2'].remove();
                        delete ui['zhuhpWrap2'];
                        if (ui['zhuhp1']) ui['zhuhp1'].remove();
                        delete ui['zhuhp1'];
                        if (ui['zhuhp2']) ui['zhuhp2'].remove();
                        delete ui['zhuhp2'];
                        if (ui.weitatuijian) ui.weitatuijian.remove();
                        delete ui.weitatuijian;
                        if (ui.weitatuijianxiaotouxiang) ui.weitatuijianxiaotouxiang.remove();
                        delete ui.weitatuijianxiaotouxiang;
                        if (ui.yuyin) ui.yuyin.remove();
                        delete ui.yuyin;
                        if (ui.shengyin) ui.shengyin.remove();
                        delete ui.shengyin;
                        if (ui.dizhutip) ui.dizhutip.remove();
                        delete ui.dizhutip;
                        if (ui.nmjindutiao) ui.nmjindutiao.remove();
                        delete ui.nmjindutiao;
                        if (ui.nmjindutiaox) ui.nmjindutiaox.remove();
                        delete ui.nmjindutiaox;
                        if (ui.duiyoutuijian) ui.duiyoutuijian.remove();
                        delete ui.duiyoutuijian;
                        if (ui.duiyoutuijianxiaotouxiang) ui.duiyoutuijianxiaotouxiang.remove();
                        delete ui.duiyoutuijianxiaotouxiang;
                        if (ui.zuhetuijianBg) ui.zuhetuijianBg.remove();
                        delete ui.zuhetuijianBg;
                        if (ui.zijiunselect) ui.zijiunselect.remove();
                        delete ui.zijiunselect;
                        if (ui.duiyouselected) ui.duiyouselected.remove();
                        delete ui.duiyouselected;
                    };
                    var updateAvtar = function(name = false, num = 2) {
                        if (!name) return;
                        if (num == 1) {
                            removeWujiangKuang(1);
                            addWujiangKuang(name, ui.dialogk, 1, false);
                            removeWujiangPane(1);
                            addWujiangPane(name, ui.dialogk, 1, false);
                            if (ui['leftPane1']) {
                                ui.weitatuijian = ui.create.div('.two-versus-weitatuijian', ui['leftPane1']);
                                ui.weitatuijianxiaotouxiang = ui.create.div('.two-versus-tuijianxiaotouxiang', ui.weitatuijian);
                                ui.weitatuijianxiaotouxiang.setBackground(name, 'character');
                                if (control == 'two-versus-ziji') ui.weitatuijian.classList.remove('selectedxx');
                                else ui.weitatuijian.classList.add('selectedxx');
                                ui.weitatuijian.addEventListener('click', function() {
                                    var caption = document.querySelector('#identitychoose.two-versus>.content-container>.content>.caption:first-child');
                                    if (this.classList.contains('selectedxx')) {
                                        this.classList.remove('selectedxx');
                                        if (caption) {
                                            if (caption.classList.contains('selectedxx')) caption.classList.remove('selectedxx');
                                            caption.innerHTML = `选择武将`;
                                        };
                                    } else {
                                        this.classList.add('selectedxx');
                                        for (var i = 0; i < game.players.length; i++) {
                                            var target = game.players[i];
                                            if (target != game.me && target.side == game.me.side) {
                                                var num = get.distance(_status.firstAct, target, "absolute") + 1;
                                                if (caption) {
                                                    if (!caption.classList.contains('selectedxx')) caption.classList.add('selectedxx');
                                                    caption.innerHTML = `正在给${num}号位推荐武将`;
                                                };
                                                break;
                                            };
                                        };
                                    };
                                    if (control) {
                                        if (control == 'two-versus-ziji') control = 'two-versus-duiyou';
                                        else if (control == 'two-versus-duiyou') control = 'two-versus-ziji';
                                    };
                                });
                                ui.duiyouselected = ui.create.div('.two-versus-duiyou-selected', ui['leftPane1']);
                            };
                            if (ui.weitatuijian) {
                                var clickEvt = new MouseEvent('click', {
                                    'view': window,
                                    'bubbles': true,
                                    'cancelable': true
                                });
                                ui.weitatuijian.dispatchEvent(clickEvt);
                            };
                        };
                        if (num == 2) {
                            removeWujiangKuang(2);
                            addWujiangKuang(name, ui.dialogk, 2, false);
                            removeWujiangPane(2);
                            addWujiangPane(name, ui.dialogk, 2, false);
                            if (ui['leftPane2']) {
                                ui.create.div('.two-versus-zijitabel', ui['leftPane2']);
                                ui.create.div('.two-versus-zhanshizhanji', ui['leftPane2']);
                                if (duiyoutuijian) {
                                    ui.duiyoutuijian = ui.create.div('.two-versus-duiyoutuijian', ui['leftPane2']);
                                    ui.duiyoutuijianxiaotouxiang = ui.create.div('.two-versus-tuijianxiaotouxiang', ui.duiyoutuijian);
                                    ui.duiyoutuijianxiaotouxiang.setBackground(duiyoutuijian.getAttribute('data-name'), 'character');
                                    var buhuiBg = ui.create.div('.two-versus-buhuiBg', ui.duiyoutuijian);
                                    var buhui = ui.create.div('.two-versus-buhui', buhuiBg);
                                    var wenzi = ui.create.div('.dizhutip', buhui);
                                    wenzi.classList.add('two-versus-buhuiwenzi');
                                    wenzi.innerHTML = '不会';
                                };
                                ui.zijiunselect = ui.create.div('.two-versus-ziji-unselect', ui['leftPane2']);
                                ui.zijiunselect.addEventListener('click', function() {
                                    if (!event._result) return;
                                    event._result.links = event.zuhetuijian.map(target => {
                                        if (target) return target.getAttribute('data-name');
                                        return false;
                                    });
                                    var dialog = ui.dialogj;
                                    if (dialog && dialog.buttons) {
                                        var ziji = false;
                                        var duiyou = false;
                                        for (var i in dialog.buttons) {
                                            var dd = dialog.buttons[i];
                                            if (!dd) continue;
                                            if (dd.classList.contains('two-versus-ziji')) ziji = dd;
                                            if (dd.classList.contains('two-versus-duiyou')) duiyou = dd;
                                        };
                                        if (ziji) {
                                            var val = ziji.getAttribute('data-name') || false;
                                            if (val) event._result.links[0] = val;
                                        };
                                        if (duiyou) {
                                            var val = duiyou.getAttribute('data-name') || false;
                                            if (val) event._result.links[1] = val;
                                        };
                                    };
                                    if (dialog) {
                                        dialog.close();
                                        dialog.remove();
                                    };
                                    dialog = null;
                                    clearUI();
                                    game.resume();
                                });
                            };
                        };
                        playerWeizhi();
                    };
                    var control = 'two-versus-ziji';
                    event._result = {
                        links: [],
                    };
                    var duiyoutuijian = false;
                    event.zuhetuijian = [];
                    var hasGongxiang = false;
                    var hasShenglv = false;
                    for (var i in dialog.buttons) {
                        var dd = dialog.buttons[i];
                        if (!dd) continue;
                        dd.classList.add('two-versus');
                        dd.style.width = '95px';
                        dd.style.height = '95px';
                        dd.style['margin-left'] = '0px';
                        dd.classList.add('none');
                        dd.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/game_arena_selectchar_bg.png');
                        dd.style.setProperty("box-shadow", "unset", "important");
                        dd.innerHTML = '';
                        var xiaotouxiang = ui.create.div('.two-versus-xiaotouxiang', dd);
                        xiaotouxiang.setBackground(characterChoice[i], 'character');
                        var xiaotouxiangname = ui.create.div('.two-versus-xiaotouxiangname', xiaotouxiang);
                        xiaotouxiangname.innerHTML = get.translation(characterChoice[i]);
                        var xuanzekuang = ui.create.div('.two-versus-xuanzekuang', dd);
                        dd.setAttribute('data-name', characterChoice[i]);
                        if (!hasGongxiang && Math.random() < 0.1) {
                            var gongxiang = ui.create.div('.two-versus-gongxiang', dd);
                            hasGongxiang = true;
                        };
                        if (!hasShenglv && Math.random() < 0.1) {
                            var shenglv = ui.create.div('.two-versus-22shenglv', dd);
                            hasShenglv = true;
                        };
                        dd.addEventListener('click', function() {
                            var target = this;
                            if (target.classList.contains(control == 'two-versus-ziji' ? 'two-versus-duiyou' : 'two-versus-ziji')) return;
                            for (var j in dialog.buttons) {
                                var ddx = dialog.buttons[j];
                                if (!ddx) continue;
                                var gongxiang = ddx.querySelector('.two-versus-gongxiang');
                                if (gongxiang) gongxiang.style.display = 'inline-block';
                                var shenglv = ddx.querySelector('.two-versus-22shenglv');
                                if (shenglv) shenglv.style.display = 'inline-block';
                                if (ddx.classList.contains(control == 'two-versus-ziji' ? 'two-versus-ziji' : 'two-versus-duiyou')) ddx.classList.remove(control == 'two-versus-ziji' ? 'two-versus-ziji' : 'two-versus-duiyou');
                                if (!ddx.classList.contains(control == 'two-versus-ziji' ? 'two-versus-duiyou' : 'two-versus-ziji')) ddx.classList.remove('selected');
                            };
                            if (!target.classList.contains('selected')) target.classList.add('selected');
                            if (!target.classList.contains(control == 'two-versus-ziji' ? 'two-versus-ziji' : 'two-versus-duiyou')) target.classList.add(control == 'two-versus-ziji' ? 'two-versus-ziji' : 'two-versus-duiyou');
                            var name = target.getAttribute('data-name') || false;
                            var gongxiang = this.querySelector('.two-versus-gongxiang');
                            if (gongxiang) gongxiang.style.display = 'none';
                            var shenglv = this.querySelector('.two-versus-22shenglv');
                            if (shenglv) shenglv.style.display = 'none';
                            var num = control == 'two-versus-ziji' ? 2 : 1;
                            updateAvtar(name, num);
                        });
                    };
                    ui.dialogj = dialog;
                    ui.dialogj.open();
                    if (true) {
                        var targets = [];
                        for (var i in dialog.buttons) {
                            var dd = dialog.buttons[i];
                            if (!dd) continue;
                            if (dd.classList.contains('two-versus-ziji')) continue;
                            if (dd.classList.contains('two-versus-duiyou')) continue;
                            targets.push(dd);
                        };
                        if (Math.random() < 0.1) {
                            duiyoutuijian = targets.randomGet();
                            if (ui['leftPane2']) {
                                if (duiyoutuijian) {
                                    ui.duiyoutuijian = ui.create.div('.two-versus-duiyoutuijian', ui['leftPane2']);
                                    ui.duiyoutuijianxiaotouxiang = ui.create.div('.two-versus-tuijianxiaotouxiang', ui.duiyoutuijian);
                                    ui.duiyoutuijianxiaotouxiang.setBackground(duiyoutuijian.getAttribute('data-name'), 'character');
                                    var buhuiBg = ui.create.div('.two-versus-buhuiBg', ui.duiyoutuijian);
                                    var buhui = ui.create.div('.two-versus-buhui', buhuiBg);
                                    var wenzi = ui.create.div('.dizhutip', buhui);
                                    wenzi.classList.add('two-versus-buhuiwenzi');
                                    wenzi.innerHTML = '不会';
                                };
                            };
                        };
                        if (true) {
                            event.zuhetuijian = targets.randomGets(2);
                            if (event.zuhetuijian && event.zuhetuijian.length == 2) {
                                ui.zuhetuijianBg = ui.create.div('.two-versus-zuhetuijianBg', ui.arena);
                                var wenzi = ui.create.div('.dizhutip', ui.zuhetuijianBg);
                                wenzi.classList.add('two-versus-zuhetuijian');
                                wenzi.innerHTML = '组合推荐';
                                var k1 = ui.create.div('.two-versus-zijikuang', ui.zuhetuijianBg);
                                var t1 = ui.create.div('.two-versus-zuhexiaotouxiang', k1);
                                t1.setBackground(event.zuhetuijian[0].getAttribute('data-name'), 'character');
                                var b1 = ui.create.div('.num', k1);
                                b1.classList.add('hu');
                                var w1 = ui.create.div('.dizhutip', b1);
                                w1.innerHTML = '自己';
                                var k2 = ui.create.div('.two-versus-duiyoukuang', ui.zuhetuijianBg);
                                var t2 = ui.create.div('.two-versus-zuhexiaotouxiang', k2);
                                t2.setBackground(event.zuhetuijian[1].getAttribute('data-name'), 'character');
                                var b2 = ui.create.div('.num', k2);
                                b2.classList.add('hu');
                                var w2 = ui.create.div('.dizhutip', b2);
                                w2.innerHTML = '队友';
                            };
                            if (targets && targets.length) {
                                var oControl = control;
                                control = 'two-versus-duiyou';
                                var clickEvt = new MouseEvent('click', {
                                    'view': window,
                                    'bubbles': true,
                                    'cancelable': true
                                });
                                var target = targets.randomGet();
                                target.dispatchEvent(clickEvt);
                                control = oControl;
                            };
                        };
                    };
                    game.pause();

                    // ui.create.cheat = function () {
                    //     _status.createControl = ui.cheat2;
                    //     ui.cheat = ui.create.control("更换", function () {
                    //         if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
                    //             return;
                    //         }
                    //         if (game.changeCoin) {
                    //             game.changeCoin(-3);
                    //         }
                    //         var buttons = ui.create.div(".buttons");
                    //         var node = _status.event.dialog.buttons[0].parentNode;
                    //         _status.event.dialog.buttons = ui.create.buttons(list.randomGets(7), "characterx", buttons);
                    //         _status.event.dialog.content.insertBefore(buttons, node);
                    //         buttons.addTempClass("start");
                    //         node.remove();
                    //         game.uncheck();
                    //         game.check();
                    //     });
                    //     delete _status.createControl;
                    // };
                    // if (lib.onfree) {
                    //     lib.onfree.push(function () {
                    //         event.dialogxx = ui.create.characterDialog("heightset");
                    //         if (ui.cheat2) {
                    //             ui.cheat2.addTempClass("controlpressdownx", 500);
                    //             ui.cheat2.classList.remove("disabled");
                    //         }
                    //     });
                    // } else {
                        event.dialogxx = ui.create.characterDialog("heightset");
                    // }
                    // ui.create.cheat2 = function () {
                    //     ui.cheat2 = ui.create.control("自由选将", function () {
                    //         if (this.dialog == _status.event.dialog) {
                    //             if (game.changeCoin) {
                    //                 game.changeCoin(10);
                    //             }
                    //             this.dialog.close();
                    //             _status.event.dialog = this.backup;
                    //             this.backup.open();
                    //             delete this.backup;
                    //             game.uncheck();
                    //             game.check();
                    //             if (ui.cheat) {
                    //                 ui.cheat.addTempClass("controlpressdownx", 500);
                    //                 ui.cheat.classList.remove("disabled");
                    //             }
                    //         } else {
                    //             if (game.changeCoin) {
                    //                 game.changeCoin(-10);
                    //             }
                    //             this.backup = _status.event.dialog;
                    //             _status.event.dialog.close();
                    //             _status.event.dialog = _status.event.parent.dialogxx;
                    //             this.dialog = _status.event.dialog;
                    //             this.dialog.open();
                    //             game.uncheck();
                    //             game.check();
                    //             if (ui.cheat) {
                    //                 ui.cheat.classList.add("disabled");
                    //             }
                    //         }
                    //     });
                    //     ui.cheat2.classList.add("disabled");
                    // };
                    // if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
                        // if (!ui.cheat && get.config("change_choice")) {
                        //     ui.create.cheat();
                        // }
                        // if (!ui.cheat2 && get.config("free_choose")) {
                        //     ui.create.cheat2();
                        // }
                    // }
                    "step 3";
                    event.rename = result.links[0];
                    var name = event.rename;
                    if (get.is.double(name)) {
                        game.me._groupChosen = true;
                        var list = get.is.double(name, true);
                    } else if (lib.character[name][1] == 'shen' && !lib.character[name][4].includes('hiddenSkill')) {
                        var list = lib.group.slice(0);
                        list.remove('shen');
                    };
                    if (list) {
                        var dialog = ui.create.newdialog('#choosegroup', '选择国籍<img src=' + lib.assetURL + 'extension/美化补充/image/xuanjiangjiemian/arrow.png' + ' style=width:30px;height:25px;margin-bottom:5px;left:2px;/>', [list, 'vcard']);
                        event.next1 = game.createEvent('chooseGroup');
                        event.next1.dialog = dialog;
                        event.next1.setContent(function() {
                            game.me.chooseButton(1, event.dialog, true).set('newconfirm1', true);
                        });
                        if (!ui.dizhutip) ui.dizhutip = ui.create.div('.dizhutip', ui.arena);
                        ui.dizhutip.innerHTML = "<span style='font-size:20px;color:#ebc914;;'>请选择你要变成的势力️</span>";
                        ui.dizhutip.style.bottom = '110px';
                        if (!ui.nmjindutiao) ui.nmjindutiao = ui.create.div('.nmjindutiao', ui.arena);
                        if (!ui.nmjindutiaox) ui.nmjindutiaox = ui.create.div('.nmjindutiaox', ui.nmjindutiao);
                        ui.nmjindutiao.style.bottom = '140px';
                        for (var i in dialog.buttons) { // 势力图片
                            var dd = dialog.buttons[i];
                            if (!dd) continue;
                            dd.style.width = '130px';
                            dd.style.height = '130px';
                            dd.style['border-radius'] = '100%';
                            dd.style['background-size'] = "100% 100%";
                            dd.style.margin = '15px';
                            dd.classList.add('none');
                            dd.setBackgroundImage('extension/美化补充/image/xuanjiangjiemian/group/' + dd.name + '.png');
                            dd.style.setProperty("box-shadow", "unset", "important");
                            // 清除多余字符
                            let cardReplaceConfig = false;
                            try {
                                cardReplaceConfig = game.getExtensionConfig('美化补充', 'cardReplace');
                            } catch (error) {   };
                            if (!cardReplaceConfig || cardReplaceConfig == "off") {
                                dd.innerHTML = "";
                            } else {
                                var background = dd.querySelector('.background');
                                if (background) background.style['font-size'] = "0px";
                                var topname = dd.querySelector('.top-name');
                                if (topname) topname.style['scale'] = "0";
                                var suitnum = dd.querySelector('.suit-num');
                                if (suitnum) suitnum.style['scale'] = "0";
                                var judgemark = dd.querySelector('.judge-mark');
                                if (judgemark) {
                                    var judge = judgemark.querySelector('.judge');
                                    if (judge) judge.style['font-size'] = "0px";
                                };
                            };
                        };
                    };
                    "step 4";
                    if (event.next1) event.group = event.next1._result.links[0][2];
                    delete event.next1;
                    if (ui.dizhutip) ui.dizhutip.remove();
                    delete ui.dizhutip;
                    if (ui.nmjindutiao) ui.nmjindutiao.remove();
                    delete ui.nmjindutiao;
                    if (ui.nmjindutiaox) ui.nmjindutiaox.remove();
                    delete ui.nmjindutiaox;
                    "step 5";
                    // if (ui.cheat) {
                    //     ui.cheat.close();
                    //     delete ui.cheat;
                    // }
                    // if (ui.cheat2) {
                    //     ui.cheat2.close();
                    //     delete ui.cheat2;
                    // }
                    for (var i = 0; i < result.links.length; i++) {
                        game.addRecentCharacter(result.links[i]);
                    }
                    game.me.init(result.links[0]);
                    // if (_status.replacetwo) {
                    //     game.me.replacetwo = result.links[1];
                    // }
                    event.list.remove(game.me.name1);
                    for (var i = 0; i < game.players.length; i++) {
                        if (game.players[i] != game.me) {
                            if (_status.brawl && _status.brawl.chooseCharacter) {
                                var list = _status.brawl.chooseCharacter(event.list, game.players[i]);
                                // game.players[i].init(list.randomGet());
                                if (game.players[i].side == game.me.side) game.players[i].init(result.links[1]);
                                else game.players[i].init(list.randomGet());
                                event.list.remove(game.players[i].name1);
                                // if (_status.replacetwo) {
                                //     game.players[i].replacetwo = list.randomGet(game.players[i].name1);
                                //     event.list.remove(game.players[i].replacetwo);
                                // }
                            } else {
                                if (event.two_assign && game.players[i].side == game.me.side) {
                                    // if (_status.replacetwo) {
                                    //     game.players[i].init(result.links[2]);
                                    //     game.players[i].replacetwo = result.links[3];
                                    // } else {
                                        game.players[i].init(result.links[1]);
                                    // }
                                } else {
                                    var name = event.list.randomRemove();
                                    if (lib.characterReplace[name] && lib.characterReplace[name].length) name = lib.characterReplace[name].randomGet();
                                    // game.players[i].init(name);
                                    if (game.players[i].side == game.me.side) game.players[i].init(result.links[1]);
                                    else game.players[i].init(name);
                                    // if (_status.replacetwo) {
                                    //     var name2 = event.list.randomRemove();
                                    //     if (lib.characterReplace[name2] && lib.characterReplace[name2].length) name2 = lib.characterReplace[name2].randomGet();
                                    //     game.players[i].replacetwo = name2;
                                    // }
                                }
                            }
                        }
                    }
                    if (event.group) {
                        game.me.group = event.group;
                        game.me.node.name.dataset.nature = get.groupnature(game.me.group);
                        game.me.update();
                    };
                    for (var i = 0; i < game.players.length; i++) {
                        _status.characterlist.remove(game.players[i].name1);
                        // _status.characterlist.remove(game.players[i].replacetwo);
                    }
                    "step 6";
                    ui.background.style.zIndex = '-2';
                    var dcs = document.getElementById("dui-controls");
                    if (dcs) dcs.style.scale = '1';
                    setTimeout(function () {
                        ui.arena.classList.remove("choose-character");
                    }, 500);
                    if (get.config("olfeiyang_four")) {
                        var target = _status.firstAct.previous;
                        if (target.isIn()) target.addSkill("olfeiyang");
                    }
                    game.addGlobalSkill("versus_viewHandcard");
                    if (get.config("two_phaseswap")) {
                        game.addGlobalSkill("autoswap");
                        if (lib.config.show_handcardbutton) {
                            ui.versushs = ui.create.system("手牌", null, true);
                            lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
                        }
                    }
                });
            };
        };
    } else if (
        lib.config.extension_美化补充_duijuexuanjiangjiemian &&
        lib.config.extension_美化补充_duijuexuanjiangjiemian == "onlyshoushabuju" &&
        lib.config.extension_一将成名_choosechar
    ) {
        console.warn("[美化补充] 检测到“ 一将成名-选将美化 ”已开启，已跳过“对决选将-仅手杀布局”以避免覆盖。");
        // 兼容模式：保留一将成名完整选将，仅同步座位布局类
        if (window._mhbcVersusSeatAdjustTimer) {
            clearInterval(window._mhbcVersusSeatAdjustTimer);
            window._mhbcVersusSeatAdjustTimer = null;
        }
        var _oldSeatAdjustPanel = document.getElementById("mhbc-versus-seat-adjust");
        if (_oldSeatAdjustPanel) _oldSeatAdjustPanel.remove();
        if (!window._mhbcVersusSeatLayoutSyncInited) {
            window._mhbcVersusSeatLayoutSyncInited = true;
            const posClasses = [
                "two-versus-1-xia",
                "two-versus-1-xxia",
                "two-versus-2-xia",
                "two-versus-2-xxia",
                "two-versus-3-xia",
                "two-versus-3-xxia",
                "two-versus-4-xia",
                "two-versus-4-xxia",
            ];
            const removeLayoutClasses = function() {
                if (!game || !game.players) return;
                let targets = game.players.slice(0);
                if (game.dead && game.dead.length) {
                    targets = targets.concat(game.dead);
                }
                targets.forEach(target => {
                    if (!target || !target.classList) return;
                    posClasses.forEach(cls => target.classList.remove(cls));
                });
            };
            const applyLayoutClasses = function() {
                if (!game || !game.me || !_status || !_status.firstAct) {
                    removeLayoutClasses();
                    return;
                }
                var xia = game.me.nextSeat || game.me.next;
                var xxia = xia && (xia.nextSeat || xia.next);
                var shang = game.me.previousSeat || game.me.previous;
                if (!xia || !xxia || !shang) {
                    removeLayoutClasses();
                    return;
                }
                removeLayoutClasses();
                if (game.me == _status.firstAct) {
                    xia.classList.add("two-versus-1-xia");
                    xxia.classList.add("two-versus-1-xxia");
                } else if (shang == _status.firstAct) {
                    xia.classList.add("two-versus-2-xia");
                    xxia.classList.add("two-versus-2-xxia");
                } else if (xia == _status.firstAct) {
                    xia.classList.add("two-versus-3-xia");
                    xxia.classList.add("two-versus-3-xxia");
                } else if (xxia == _status.firstAct) {
                    xia.classList.add("two-versus-4-xia");
                    xxia.classList.add("two-versus-4-xxia");
                }
            };
            const syncLayoutClasses = function() {
                if (!lib || !lib.config || lib.config.mode != "versus") return;
                applyLayoutClasses();
            };
            if (!window._mhbcVersusSeatLayoutSyncTimer) {
                window._mhbcVersusSeatLayoutSyncTimer = setInterval(syncLayoutClasses, 200);
            }
        }
    } else if (lib.config.extension_美化补充_duijuexuanjiangjiemian && lib.config.extension_美化补充_duijuexuanjiangjiemian == "onlyshoushabuju") {
        lib.game.chooseCharacterTwo = function() {
            var next = game.createEvent("chooseCharacter");
            next.showConfig = true;
            next.setContent(function() {
                "step 0";
                ui.arena.classList.add("choose-character");
                // if (true) { // 修改部分，修改换位技能
                //     for (var i in lib.skill) {
                //         if (lib.skill[i].changeSeat) {
                //             lib.skill[i] = {};
                //             if (lib.translate[i + '_info']) {
                //                 lib.translate[i + '_info'] = '此模式下不可用';
                //             }
                //         }
                //     }
                // }
                var bool = Math.random() < 0.5;
                var bool2 = Math.random() < 0.5;
                var ref = game.players[0];

                ref.side = bool;
                ref.next.side = bool2;
                ref.next.next.side = !bool;
                ref.previous.side = !bool2;

                var firstChoose = game.players.randomGet();
                if (firstChoose.next.side == firstChoose.side) {
                    firstChoose = firstChoose.next;
                }
                _status.firstAct = firstChoose;
                for (var i = 0; i < 4; i++) {
                    firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
                    firstChoose = firstChoose.next;
                }

                for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i].side == game.me.side) {
                        game.players[i].node.identity.firstChild.innerHTML = "友";
                    } else {
                        game.players[i].node.identity.firstChild.innerHTML = "敌";
                    }
                    game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
                }
                //22选将框分配
                var list = [];
                var list4 = [];
                for (i in lib.characterReplace) {
                    var ix = lib.characterReplace[i];
                    for (var j = 0; j < ix.length; j++) {
                        if (lib.filter.characterDisabled(ix[j])) ix.splice(j--, 1);
                    }
                    if (ix.length) {
                        list.push(i);
                        list4.addArray(ix);
                    }
                }
                for (i in lib.character) {
                    if (!list4.includes(i) && !lib.filter.characterDisabled(i)) {
                        list.push(i);
                        list4.push(i);
                    }
                }
                var choose = [];
                event.list = list;
                _status.characterlist = list4;

                if (true) { // 修改部分，修改22布局
                    var one = _status.firstAct;
                    //手动修改进入时的布局
                    var xia = game.me.nextSeat || game.me.next;
                    var xxia = xia && (xia.nextSeat || xia.next);
                    var shang = game.me.previousSeat || game.me.previous;
                    if (game.me == _status.firstAct) {//主一号位
                        xia.classList.add('two-versus-1-xia');
                        xxia.classList.add('two-versus-1-xxia');
                        // ui.create.div('.game_friend_gua', shang);
                        // ui.create.div('.game_friend_gua', game.me);
                        // ui.create.div('.game_enemy_gua', xia);
                        // ui.create.div('.game_enemy_gua', xxia);
                        // var cksp = ui.create.div('.chakanshoupai', shang);
                        // cksp.onclick = function() {
                        //     if (shang.getCards('h').length > 0) {
                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                        //         popuperContainer.addEventListener('click', event => {
                        //             popuperContainer.delete(200);
                        //             shoupai.delete(200);
                        //         });
                        //     }
                        // }
                    } else if (shang == _status.firstAct) {//主二号位
                        xia.classList.add('two-versus-2-xia');
                        xxia.classList.add('two-versus-2-xxia');
                        // ui.create.div('.game_friend_gua', xia);
                        // ui.create.div('.game_friend_gua', game.me);
                        // ui.create.div('.game_enemy_gua', shang);
                        // ui.create.div('.game_enemy_gua', xxia);
                        // var cksp = ui.create.div('.chakanshoupaix', xia);
                        // cksp.onclick = function() {
                        //     if (xia.getCards('h').length > 0) {
                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                        //         popuperContainer.addEventListener('click', event => {
                        //             popuperContainer.delete(200);
                        //             shoupai.delete(200);
                        //         });
                        //     }
                        // }
                    } else if (xia == _status.firstAct) {//主视角四号位
                        xia.classList.add('two-versus-3-xia');
                        xxia.classList.add('two-versus-3-xxia');
                        // ui.create.div('.game_friend_gua', xia);
                        // ui.create.div('.game_friend_gua', game.me);
                        // ui.create.div('.game_enemy_gua', shang);
                        // ui.create.div('.game_enemy_gua', xxia);
                        // var cksp = ui.create.div('.chakanshoupaix', xia);
                        // cksp.onclick = function() {
                        //     if (xia.getCards('h').length > 0) {
                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                        //         popuperContainer.addEventListener('click', event => {
                        //             popuperContainer.delete(200);
                        //             shoupai.delete(200);
                        //         });
                        //     }
                        // }
                    } else if (xxia == _status.firstAct) {//主视角三号位
                        xia.classList.add('two-versus-4-xia');
                        xxia.classList.add('two-versus-4-xxia');
                        // ui.create.div('.game_friend_gua', shang);
                        // ui.create.div('.game_friend_gua', game.me);
                        // ui.create.div('.game_enemy_gua', xia);
                        // ui.create.div('.game_enemy_gua', xxia);
                        // var cksp = ui.create.div('.chakanshoupai', shang);
                        // cksp.onclick = function() {
                        //     if (shang.getCards('h').length > 0) {
                        //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                        //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                        //         popuperContainer.addEventListener('click', event => {
                        //             popuperContainer.delete(200);
                        //             shoupai.delete(200);
                        //         });
                        //     }
                        // }
                    }
                }

                var addSetting = function (dialog) {
                    dialog.add("选择座位").classList.add("add-setting");
                    var seats = document.createElement("table");
                    seats.classList.add("add-setting");
                    seats.style.margin = "0";
                    seats.style.width = "100%";
                    seats.style.position = "relative";
                    for (var i = 1; i <= game.players.length; i++) {
                        var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
                        td.innerHTML = get.cnNumber(i, true);
                        td.link = i - 1;
                        seats.appendChild(td);
                        if (get.distance(_status.firstAct, game.me, "absolute") === i - 1) {
                            td.classList.add("bluebg");
                        }
                        td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
                            if (_status.dragged) return;
                            if (_status.justdragged) return;
                            if (get.distance(_status.firstAct, game.me, "absolute") == this.link) return;
                            var current = this.parentNode.querySelector(".bluebg");
                            if (current) {
                                current.classList.remove("bluebg");
                            }
                            this.classList.add("bluebg");
                            _status.firstAct = game.me;
                            for (var i = 0; i < this.link; i++) {
                                _status.firstAct = _status.firstAct.previous;
                            }
                            var firstChoose = _status.firstAct;
                            firstChoose.next.side = !firstChoose.side;
                            firstChoose.next.next.side = !firstChoose.side;
                            firstChoose.previous.side = firstChoose.side;
                            for (var i = 0; i < game.players.length; i++) {
                                if (game.players[i].side == game.me.side) {
                                    game.players[i].node.identity.firstChild.innerHTML = "友";
                                } else {
                                    game.players[i].node.identity.firstChild.innerHTML = "敌";
                                }
                                game.players[i].node.identity.dataset.color = game.players[i].side + "zhu";
                            }
                            for (var i = 0; i < 4; i++) {
                                firstChoose.node.name.innerHTML = get.verticalStr(get.cnNumber(i + 1, true) + "号位");
                                firstChoose = firstChoose.next;
                            }

                            if (true) { // 修改部分，修改22布局
                                let targets = game.players.concat(game.dead);
                                //移除标签
                                targets.forEach(target => {
                                    target.classList.remove('two-versus-1-xia');
                                    target.classList.remove('two-versus-1-xxia');
                                    target.classList.remove('two-versus-2-xia');
                                    target.classList.remove('two-versus-2-xxia');
                                    target.classList.remove('two-versus-3-xia');
                                    target.classList.remove('two-versus-3-xxia');
                                    target.classList.remove('two-versus-4-xia');
                                    target.classList.remove('two-versus-4-xxia');
                                });
                                var one = _status.firstAct;//没有用
                                //再次修改自由选择位置之后的布局
                                var xia = game.me.nextSeat || game.me.next;
                                var xxia = xia && (xia.nextSeat || xia.next);
                                var shang = game.me.previousSeat || game.me.previous;
                                // var shoupaixx = document.querySelector('.chakanshoupai');
                                // if (shoupaixx) { shoupaixx.parentNode.removeChild(shoupaixx); }
                                // var shoupaixxx = document.querySelector('.chakanshoupaix');
                                // if (shoupaixxx) { shoupaixxx.parentNode.removeChild(shoupaixxx); }
                                // for (var i = 0; i < 5; i++) {
                                //     var huduixxx = document.querySelector('.game_friend_gua');
                                //     if (huduixxx) { huduixxx.parentNode.removeChild(huduixxx); }
                                //     var longduixxx = document.querySelector('.game_enemy_gua');
                                //     if (longduixxx) { longduixxx.parentNode.removeChild(longduixxx); }
                                // }
                                if (game.me == _status.firstAct) {//主一号位
                                    xia.classList.add('two-versus-1-xia');
                                    xxia.classList.add('two-versus-1-xxia');
                                    // ui.create.div('.game_friend_gua', shang);
                                    // ui.create.div('.game_friend_gua', game.me);
                                    // ui.create.div('.game_enemy_gua', xia);
                                    // ui.create.div('.game_enemy_gua', xxia);
                                    // var cksp = ui.create.div('.chakanshoupai', shang);
                                    // cksp.onclick = function() {
                                    //     if (shang.getCards('h').length > 0) {
                                    //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                    //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                                    //         popuperContainer.addEventListener('click', event => {
                                    //             popuperContainer.delete(200);
                                    //             shoupai.delete(200);
                                    //         });
                                    //     }
                                    // }
                                } else if (shang == _status.firstAct) {//主二号位
                                    xia.classList.add('two-versus-2-xia');
                                    xxia.classList.add('two-versus-2-xxia');
                                    // ui.create.div('.game_friend_gua', xia);
                                    // ui.create.div('.game_friend_gua', game.me);
                                    // ui.create.div('.game_enemy_gua', shang);
                                    // ui.create.div('.game_enemy_gua', xxia);
                                    // var cksp = ui.create.div('.chakanshoupaix', xia);
                                    // cksp.onclick = function() {
                                    //     if (xia.getCards('h').length > 0) {
                                    //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                    //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                                    //         popuperContainer.addEventListener('click', event => {
                                    //             popuperContainer.delete(200);
                                    //             shoupai.delete(200);
                                    //         });
                                    //     }
                                    // }
                                } else if (xia == _status.firstAct) {//主视角四号位
                                    xia.classList.add('two-versus-3-xia');
                                    xxia.classList.add('two-versus-3-xxia');
                                    // ui.create.div('.game_friend_gua', xia);
                                    // ui.create.div('.game_friend_gua', game.me);
                                    // ui.create.div('.game_enemy_gua', shang);
                                    // ui.create.div('.game_enemy_gua', xxia);
                                    // var cksp = ui.create.div('.chakanshoupaix', xia);
                                    // cksp.onclick = function() {
                                    //     if (xia.getCards('h').length > 0) {
                                    //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                    //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', xia.getCards('h'));
                                    //         popuperContainer.addEventListener('click', event => {
                                    //             popuperContainer.delete(200);
                                    //             shoupai.delete(200);
                                    //         });
                                    //     }
                                    // }
                                } else if (xxia == _status.firstAct) {//主视角三号位
                                    xia.classList.add('two-versus-4-xia');
                                    xxia.classList.add('two-versus-4-xxia');
                                    // ui.create.div('.game_friend_gua', shang);
                                    // ui.create.div('.game_friend_gua', game.me);
                                    // ui.create.div('.game_enemy_gua', xia);
                                    // ui.create.div('.game_enemy_gua', xxia);
                                    // var cksp = ui.create.div('.chakanshoupai', shang);
                                    // cksp.onclick = function() {
                                    //     if (shang.getCards('h').length > 0) {
                                    //         var popuperContainer = ui.create.div('.popup-container', ui.window);
                                    //         var shoupai = ui.create.dialog('<font color=\"#f1d977\",font size=5px,font family=HYZLSJ,font weight=bolder,top=-10px,>队友手牌<img src=' + lib.assetURL + 'extension/2v2美化/image/' + 'arrow.png' + ' style=position:relative;width:30px;height:25px;margin-bottom:-5px;left:2px;/>', shang.getCards('h'));
                                    //         popuperContainer.addEventListener('click', event => {
                                    //             popuperContainer.delete(200);
                                    //             shoupai.delete(200);
                                    //         });
                                    //     }
                                    // }
                                }
                            }
                        });
                    }
                    dialog.content.appendChild(seats);
                    if (game.me == game.zhu) {
                        seats.previousSibling.style.display = "none";
                        seats.style.display = "none";
                    }

                    dialog.add(ui.create.div(".placeholder.add-setting"));
                    dialog.add(ui.create.div(".placeholder.add-setting"));
                    if (get.is.phoneLayout()) dialog.add(ui.create.div(".placeholder.add-setting"));
                };
				var removeSetting = function () {
                    var dialog = _status.event.dialog;
                    if (dialog) {
                        dialog.style.height = "";
                        delete dialog._scrollset;
                        var list = Array.from(dialog.querySelectorAll(".add-setting"));
                        while (list.length) {
                            list.shift().remove();
                        }
                        ui.update();
                    }
                };
                event.addSetting = addSetting;
                event.removeSetting = removeSetting;

                var characterChoice;
                if (_status.brawl && _status.brawl.chooseCharacter) {
                    characterChoice = _status.brawl.chooseCharacter(list, game.me);
                } else {
                    characterChoice = list.randomGets(7);
                }
                var basenum = 1;
                var basestr = "选择角色";
                if (get.config("two_assign")) {
                    basenum = 2;
                    basestr = "选择你和队友的角色";
                    event.two_assign = true;
                }
                if (get.config("replace_character_two")) {
                    basestr += "（含一名替补角色）";
                    _status.replacetwo = true;
                    game.additionaldead = [];
                    basenum *= 2;
                }
                var dialog = ui.create.dialog(basestr, [characterChoice, "characterx"]);
                game.me.chooseButton(true, dialog, basenum).set("onfree", true);
                if (!_status.brawl || !_status.brawl.noAddSetting) {
                    if (get.config("change_identity")) {
                        addSetting(dialog);
                    }
                }

                ui.create.cheat = function () {
                    _status.createControl = ui.cheat2;
                    ui.cheat = ui.create.control("更换", function () {
                        if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
                            return;
                        }
                        if (game.changeCoin) {
                            game.changeCoin(-3);
                        }
                        var buttons = ui.create.div(".buttons");
                        var node = _status.event.dialog.buttons[0].parentNode;
                        _status.event.dialog.buttons = ui.create.buttons(list.randomGets(7), "characterx", buttons);
                        _status.event.dialog.content.insertBefore(buttons, node);
                        buttons.addTempClass("start");
                        node.remove();
                        game.uncheck();
                        game.check();
                    });
                    delete _status.createControl;
                };
                if (lib.onfree) {
                    lib.onfree.push(function () {
                        event.dialogxx = ui.create.characterDialog("heightset");
                        if (ui.cheat2) {
                            ui.cheat2.addTempClass("controlpressdownx", 500);
                            ui.cheat2.classList.remove("disabled");
                        }
                    });
                } else {
                    event.dialogxx = ui.create.characterDialog("heightset");
                }
                ui.create.cheat2 = function () {
                    ui.cheat2 = ui.create.control("自由选将", function () {
                        if (this.dialog == _status.event.dialog) {
                            if (game.changeCoin) {
                                game.changeCoin(10);
                            }
                            this.dialog.close();
                            _status.event.dialog = this.backup;
                            this.backup.open();
                            delete this.backup;
                            game.uncheck();
                            game.check();
                            if (ui.cheat) {
                                ui.cheat.addTempClass("controlpressdownx", 500);
                                ui.cheat.classList.remove("disabled");
                            }
                        } else {
                            if (game.changeCoin) {
                                game.changeCoin(-10);
                            }
                            this.backup = _status.event.dialog;
                            _status.event.dialog.close();
                            _status.event.dialog = _status.event.parent.dialogxx;
                            this.dialog = _status.event.dialog;
                            this.dialog.open();
                            game.uncheck();
                            game.check();
                            if (ui.cheat) {
                                ui.cheat.classList.add("disabled");
                            }
                        }
                    });
                    ui.cheat2.classList.add("disabled");
                };
                if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
                    if (!ui.cheat && get.config("change_choice")) {
                        ui.create.cheat();
                    }
                    if (!ui.cheat2 && get.config("free_choose")) {
                        ui.create.cheat2();
                    }
                }
                "step 1";
                if (ui.cheat) {
                    ui.cheat.close();
                    delete ui.cheat;
                }
                if (ui.cheat2) {
                    ui.cheat2.close();
                    delete ui.cheat2;
                }
                for (var i = 0; i < result.links.length; i++) {
                    game.addRecentCharacter(result.links[i]);
                }
                game.me.init(result.links[0]);
                if (_status.replacetwo) {
                    game.me.replacetwo = result.links[1];
                }
                event.list.remove(game.me.name1);
                for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i] != game.me) {
                        if (_status.brawl && _status.brawl.chooseCharacter) {
                            var list = _status.brawl.chooseCharacter(event.list, game.players[i]);
                            game.players[i].init(list.randomGet());
                            event.list.remove(game.players[i].name1);
                            if (_status.replacetwo) {
                                game.players[i].replacetwo = list.randomGet(game.players[i].name1);
                                event.list.remove(game.players[i].replacetwo);
                            }
                        } else {
                            if (event.two_assign && game.players[i].side == game.me.side) {
                                if (_status.replacetwo) {
                                    game.players[i].init(result.links[2]);
                                    game.players[i].replacetwo = result.links[3];
                                } else {
                                    game.players[i].init(result.links[1]);
                                }
                            } else {
                                var name = event.list.randomRemove();
                                if (lib.characterReplace[name] && lib.characterReplace[name].length) name = lib.characterReplace[name].randomGet();
                                game.players[i].init(name);
                                if (_status.replacetwo) {
                                    var name2 = event.list.randomRemove();
                                    if (lib.characterReplace[name2] && lib.characterReplace[name2].length) name2 = lib.characterReplace[name2].randomGet();
                                    game.players[i].replacetwo = name2;
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < game.players.length; i++) {
                    _status.characterlist.remove(game.players[i].name1);
                    _status.characterlist.remove(game.players[i].replacetwo);
                }
                setTimeout(function () {
                    ui.arena.classList.remove("choose-character");
                }, 500);
                if (get.config("olfeiyang_four")) {
                    var target = _status.firstAct.previous;
                    if (target.isIn()) target.addSkill("olfeiyang");
                }
                game.addGlobalSkill("versus_viewHandcard");
                if (get.config("two_phaseswap")) {
                    game.addGlobalSkill("autoswap");
                    if (lib.config.show_handcardbutton) {
                        ui.versushs = ui.create.system("手牌", null, true);
                        lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
                    }
                }
            });
        };
    };
}

