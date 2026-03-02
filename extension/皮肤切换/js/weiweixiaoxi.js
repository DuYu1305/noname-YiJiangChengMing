export function modifyDecadeUIContent(lib, skinSwitch) {
    function overrides(dest, src) {
        if (!src) return
        for (let key in src) {
            dest[key] = src[key];
        }
    }

    function getSkinInfo(newName) {
        if (!newName) return null
        let [key, skinName] = newName.split('/')
        let dskins = decadeUI.dynamicSkin
        return key && skinName && dskins[key] && dskins[key][skinName] ? dskins[key][skinName] : null
    }

    function handleTransform(player, isPrimary, effs, special, options = {}) {
        let { huanfuEffect, isOrigin, trans, transform, updateAudio = false, avatar } = options
        if (!transform && !trans) {
            transform = effs.transform
        }
        if (!transform && !trans) return null

        if (!trans) {
            if (Array.isArray(transform)) {
                transform = transform[0]
            }
            if (!transform || !(transform in special)) return null
            trans = special[transform]
        }

        if (!trans) return null

        let audio = trans.audio
        let dskins = decadeUI.dynamicSkin
        let effect = huanfuEffect || effs.effect

        if (trans.group && options.currentGroup && trans.group !== options.currentGroup) {
            console.log('势力不匹配，跳过变身:', {
                requiredGroup: trans.group,
                currentGroup: options.currentGroup
            });
            return null
        }

        let newName = trans.name
        if (newName) {
            let dInfo = getSkinInfo(newName)
            if (dInfo) {
                if (updateAudio) {
                    dInfo = Object.assign({}, dInfo)
                    dInfo.audio = trans.audio
                    dInfo._needUpdateAudio = true
                    if (avatar && avatar.audio) {
                        dInfo._originalAudio = avatar.audio
                    }
                }
                skinSwitch.dynamic.transformDst(player, isPrimary, dInfo, { huanfuEffect: effect, isOrigin })
                if (updateAudio && trans.audio) {
                    setTimeout(() => {
                        skinSwitch.reloadAudioForSkin(player, isPrimary, trans.audio)
                    }, 1000)
                }
                return { audio, trans }
            } else {
                return null
            }
        } else {
            if (updateAudio) {
                trans = Object.assign({}, trans)
                trans._needUpdateAudio = true
            }
            skinSwitch.dynamic.transformDst(player, isPrimary, trans, { huanfuEffect: effect, isOrigin })
            if (updateAudio && trans.audio) {
                setTimeout(() => {
                    skinSwitch.reloadAudioForSkin(player, isPrimary, trans.audio)
                }, 1000)
            }
            return { audio, trans }
        }
    }

    function handleEffectPlay(player, effs, special, audioRef) {
        let effectPlay = effs.play
        if (!effectPlay) return
        let eff = special[effectPlay]
        if (!eff) return

        if (!eff.x) eff.x = [0, 0.5]
        if (!eff.y) eff.y = [0, 0.5]
        setTimeout(() => {
            skinSwitch.chukuangWorkerApi.playEffect(eff)
        }, (eff.delay || 0) * 1000)

        if (!audioRef.audio && eff.audio) {
            audioRef.audio = eff.audio
        }
    }

    function playAudioSafe(audio, conditionAudio, path) {
        if (!audio) audio = conditionAudio
        if (audio) {
            let audioPath = path || skinSwitch.dcdPath || 'extension'
            let audioFolder = path === 'extension' ? '十周年UI' : ''
            game.playAudio('..', audioPath, audioFolder ? `${audioFolder}/assets/dynamic` : 'assets/dynamic', audio)
        }
    }

    const pfqhHelpers = {
        handleTransform,
        handleEffectPlay,
        playAudioSafe,
        getSkinInfo
    }
    window.__pfqh_helpers = pfqhHelpers

    skinSwitch.checkTeshuAction = function(player, skillName) {
        if (!player.doubleAvatar) {
            let teshu = player.dynamic.primary && player.dynamic.primary.player && player.dynamic.primary.player.teshu
            if (typeof teshu === 'object' && teshu !== null) {
                if (teshu.whitelist) {
                    if (teshu.whitelist.includes(skillName)) {
                        skinSwitch.chukuangWorkerApi.chukuangAction(player, 'TeShu')
                    }
                } else {
                    skinSwitch.chukuangWorkerApi.chukuangAction(player, 'TeShu')
                }
            } else {
                skinSwitch.chukuangWorkerApi.chukuangAction(player, 'TeShu')
            }
        } else {
            skinSwitch.chukuangWorkerApi.chukuangAction(player, 'TeShu')
        }
    }

    let Player = {};
    if (lib.config[skinSwitch.decadeKey.dynamicSkin]) {
        if (self.OffscreenCanvas === undefined) {
            alert("您的设备环境不支持新版手杀动皮效果，请更换更好的设备或者不使用此版本的手杀动皮效果");
            return
        } else {
            // 技能
            lib.skill._tsx = {
                trigger: {
                    player: ["logSkillBegin", "useSkillBegin"],
                },
                silent: true,
                charlotte: true,
                forced: true,
                priority: 2022,
                filter(event, player) {
                    return player.dynamic
                },
                async content(event, trigger, player) {
                    let name = trigger.skill
                    if (game.phaseNumber > 0 || (game.phaseNumber === 0 && event.player && event.player.isAlive())) {
                        if (name.indexOf("_") !== 0 && skinSwitch.filterSkills.indexOf(name) === -1 || event.player.skills.indexOf(name) !== -1) {
                            if (event.player.isAlive() && event.player.dynamic.primary && !event.player.GongJi) {
                                skinSwitch.checkTeshuAction(event.player, name)
                            }
                            let skillInfo = get.info(name)
                            if (skillInfo) {
                                let h = window.__pfqh_helpers || pfqhHelpers
                                let specailEvent = (player, triggerName) => {
                                    let res = skinSwitch.dynamic.getSpecial(player, triggerName)
                                    res.forEach(r => {
                                        const { avatar, special, effs, isPrimary } = r
                                        let pName = isPrimary ? player.name : player.name2
                                        let cha = lib.character[pName]
                                        if (!cha || !cha[3]) return
                                        if (!cha[3].includes(name)) {
                                            if (!cha[3].includes(name.slice(0, name.lastIndexOf('_'))))
                                                return
                                        }
                                        let audioRef = { audio: null }
                                        let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                                            huanfuEffect: effs.effect
                                        })
                                        if (transformResult) {
                                            audioRef.audio = transformResult.audio
                                        }
                                        h.handleEffectPlay(player, special.condition[triggerName], special, audioRef)
                                        h.playAudioSafe(audioRef.audio, special.condition[triggerName].audio, 'extension')
                                    })
                                }
                                let res = skinSwitch.dynamic.getSpecial(event.player, name)
                                res.forEach(r => {
                                    let { avatar, isPrimary } = r
                                    let special = avatar.special
                                    if (!special) return;
                                    let effs = special.condition[name]
                                    let audioRef = { audio: null }
                                    let h = window.__pfqh_helpers || pfqhHelpers
                                    let transformResult = h.handleTransform(event.player, isPrimary, effs, special, {
                                        huanfuEffect: effs.effect
                                    })
                                    if (transformResult && transformResult.trans) {
                                        if (transformResult.trans.name) {
                                            let dInfo = h.getSkinInfo(transformResult.trans.name)
                                            if (dInfo) {
                                                dInfo.audio = transformResult.trans.audio
                                            }
                                        }
                                        audioRef.audio = transformResult.audio
                                    }
                                    h.handleEffectPlay(event.player, effs, special, audioRef)
                                })
                                if (skillInfo.juexingji) {
                                    specailEvent(event.player, 'juexingji')
                                }
                                if (skillInfo.limited) {
                                    specailEvent(event.player, 'xiandingji')
                                }
                                // 检查使命技
                                if (name.endsWith('_fail')) {
                                    let parentSkill = name.slice(0, name.length - 5)
                                    let parentSkillInfo = get.info(parentSkill)
                                    if (parentSkillInfo && parentSkillInfo.dutySkill) {
                                        specailEvent(event.player, 'shimingjiFail')
                                    }
                                } else if (name.endsWith('_achieve')) {
                                    let parentSkill = name.slice(0, name.length - 8)
                                    let parentSkillInfo = get.info(parentSkill)
                                    if (parentSkillInfo && parentSkillInfo.dutySkill) {
                                        specailEvent(event.player, 'shimingjiSuccess')
                                    }
                                }

                            }

                        }
                    }
                }
            }
            if (lib.element && lib.element.player && lib.element.player.$changeZhuanhuanji) {
                var originchangeZhuanhuanji = lib.element.player.$changeZhuanhuanji;
                lib.element.player.$changeZhuanhuanji = function (skill) {
                    originchangeZhuanhuanji.apply(this, arguments);
                    if (!get.is.zhuanhuanji(skill, this)) return;
                    if (!this.dynamic) return;
                    let res = skinSwitch.dynamic.getSpecial(this, 'zhuanhuanji')
                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r
                        let pName = isPrimary ? this.name : this.name2
                        let cha = lib.character[pName]
                        if (!cha || !cha[3] || !cha[3].includes(skill)) {
                            return
                        }
                        let mark = this.node.xSkillMarks.querySelector('[data-id="' + skill + '"]')
                        if (!mark) return
                        let isYin = mark.classList.contains("yin")
                        let transform = effs.transform
                        if (!transform) return
                        const originSkin = isPrimary ? this.originSkin : this.originSkin2
                        if (!originSkin) return
                        let h = window.__pfqh_helpers || pfqhHelpers
                        let audioRef = { audio: null }
                        setTimeout(() => {
                            if (isYin) {
                                skinSwitch.dynamic.transformDst(this, isPrimary, originSkin, { huanfuEffect: effs.effect, isOrigin: true })
                            } else {
                                let transformResult = h.handleTransform(this, isPrimary, effs, special, {
                                    huanfuEffect: effs.effect,
                                    transform
                                })
                                if (transformResult) {
                                    audioRef.audio = transformResult.audio
                                }
                            }
                        }, 50)
                        h.handleEffectPlay(this, special.condition.zhuanhuanji, special, audioRef)
                        h.playAudioSafe(audioRef.audio, special.condition.zhuanhuanji.audio)
                    })
                };
            }
            lib.skill._gj = {
                trigger: { player: ['useCardBefore', 'useCard1', 'useCard2'] },
                forced: true,
                filter: function (event, player) {
                    if (player.isUnseen()) return false;
                    if (!player.dynamic) return false;
                    if (!lib.config[skinSwitch.configKey.allowNonCurrentPhaseAttack] && _status.currentPhase != player) return false;
                    if (event.card.name == "huogong") return false;
                    if (event.card.cards && Array.isArray(event.card.cards) && event.card.cards.length > 0) {
                        let originalCard = event.card.cards[0];
                        if (originalCard && originalCard.name && originalCard.name !== event.card.name) {
                            return false;
                        }
                    }
                    let type = get.type(event.card);
                    return ((type == 'basic' || type == 'trick') && get.tag(event.card, 'damage') > 0)
                },
                content: function () {
                    // player.GongJi = true;
                    // 判定当前是否可以攻击, 可能是国战有隐藏武将
                    let res = skinSwitch.dynamic.checkCanBeAction(player);
                    if (!res || !res.dynamic) return player.GongJi = false;
                    else {
                        // 添加指示线功能, 加载攻击指示线骨骼, 直接使用十周年ani来进行播放
                        let dy = (player.dynamic.primary && player.dynamic.primary.player && player.dynamic.primary.player.zhishixian) || (player.dynamic.deputy && player.dynamic.deputy.player && player.dynamic.deputy.player.zhishixian)
                        let args = null

                        let getArgs = (filterPlayers = []) => {
                            if (dy != null) {
                                if (event.triggername !== 'useCardBefore' && event._trigger.targets.length < 2) {
                                    return
                                }
                                let hand = decadeUI.boundsCaches.hand;
                                let x1, y1

                                args = {
                                    hand: null,  // 手牌区域
                                    attack: {},  // 攻击方坐标
                                    targets: [],  // 攻击目标坐标
                                    bodySize: {
                                        bodyWidth: decadeUI.get.bodySize().width,
                                        bodyHeight: decadeUI.get.bodySize().height
                                    }
                                }

                                player.checkBoundsCache(true);
                                if (player === game.me) {
                                    hand.check();
                                    x1 = hand.x + hand.width / 2;
                                    y1 = hand.y;
                                    args.hand = {
                                        x1: x1,
                                        y1: y1
                                    }
                                }
                                // 攻击方的位置
                                args.attack = player.getBoundingClientRect()

                                // 计算当前角色和其他角色的角度. 参考十周年ui的指示线
                                for (let p of event._trigger.targets) {
                                    if (filterPlayers.includes(p)) continue
                                    p.checkBoundsCache(true);
                                    args.targets.push({
                                        boundRect: p.getBoundingClientRect(),
                                    })
                                }
                            }
                        }

                        // 记忆上次的攻击事件, useCard, useCard1, useCard2,会短时间内连续触发. 这样先过滤掉

                        let timeDelta = player.__lastGongji ? new Date().getTime() - player.__lastGongji.t : 10000
                        // 间隔极短的连续攻击忽略不计
                        if (timeDelta < 20) return

                        if (timeDelta >= 200) {
                            if (/*timeDelta <= 350 &&*/ event.triggername !== 'useCardBefore') {
                                if (player.__lastGongji && event._trigger.targets.length <= player.__lastGongji.tLen) {
                                    return
                                }
                            }
                            getArgs()
                            skinSwitch.chukuangWorkerApi.chukuangAction(player, 'GongJi', args ? { attackArgs: args, triggername: event.triggername } : {});
                            player.__lastGongji = {
                                t: new Date().getTime(),
                                tLen: event._trigger.targets.length,
                            }
                        } else {
                            if (event.triggername !== 'useCardBefore') {
                                if (event._trigger.targets.length <= player.__lastGongji.tLen) {
                                    return
                                }
                                getArgs()
                                if (args) {
                                    skinSwitch.chukuangWorkerApi.chukuangAction(player, 'GongJi', { attackArgs: args, triggername: event.triggername })
                                    player.__lastGongji = {
                                        t: new Date().getTime(),
                                        tLen: event._trigger.targets.length,
                                    }
                                }
                            }
                        }


                    }
                }
            }
            lib.skill._ts = {
                trigger: {
                    player: ['useSkillBefore']
                },
                forced: true,
                filter: function (event, player) {
                    return player.isAlive() && player.dynamic;
                },
                content(event, trigger, player) {
                    // 检查限定技
                    let skillType = ''
                    let triggerSkill = event.getTrigger().skill
                    if (triggerSkill && triggerSkill[0] === '_') return

                    let skillInfo = get.info(triggerSkill)
                    let dskins = decadeUI.dynamicSkin
                    if (skillInfo) {
                        if (skillInfo.limited) {
                            let res = skinSwitch.dynamic.getSpecial(player, 'xiandingji')
                            res.forEach(r => {
                                const { avatar, special, effs, isPrimary } = r
                                let pName = isPrimary ? player.name : player.name2
                                let cha = lib.character[pName]
                                if (!cha || !cha[3] || !cha[3].includes(triggerSkill)) {
                                    return
                                }
                                let h = window.__pfqh_helpers || pfqhHelpers
                                let audioRef = { audio: null }
                                let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                                    huanfuEffect: effs.effect
                                })
                                if (transformResult) {
                                    audioRef.audio = transformResult.audio
                                }
                                h.handleEffectPlay(player, special.condition.xiandingji, special, audioRef)
                                h.playAudioSafe(audioRef.audio, special.condition.xiandingji.audio)
                            })
                        } else if (skillInfo.dutySkill) {
                            skillType = 'shimingji';
                        }
                    }

                    skinSwitch.checkTeshuAction(player, triggerSkill)
                }
            }

            lib.skill._playAudioToQueue = {
                trigger: { player: ['useCardBefore', 'respondBefore'] },
                forced: true,
                filter: function (event, player) {
                    if (player.isUnseen()) return false;
                    if (!player.dynamic) return false;
                    return player.dynamic.primary && player.dynamic.primary.player && player.dynamic.primary.player.audio
                },
                content: function () {
                    let id = player.dynamic.id
                    let skinId = player.dynamic.primary.id
                    if (!skinSwitch.audioPlayQueue) {
                        skinSwitch.audioPlayQueue = []
                    }
                    // 添加到队列中, 每次播放音频, 检查当前队列是否有待替换的语音需要进行播放
                    let card = event.getTrigger().card
                    let cardName
                    if (card.name == 'sha' && (card.nature == 'fire' || card.nature == 'thunder' || card.nature == 'ice' || card.nature == 'stab')) {
                        cardName = card.name + '_' + card.nature
                    } else {
                        cardName = card.name
                    }

                    skinSwitch.audioPlayQueue.push({
                        'card': cardName,
                        'id': id,
                        'skinId': skinId,
                        'time': new Date().getTime()
                    })

                }
            }

            // 回合开始,,播放出场动画, 暂时不考虑双将模式
            lib.skill._checkDcdChuChang = {
                trigger: {
                    global: "phaseBefore",
                },
                forced: true,
                filter: function (event, player) {
                    return game.players.length > 1  /*&&player.phaseNumber===0*/ && player === event.player && !player.doubleAvatar && player.dynamic && player.dynamic.primary && player.dynamic.primary.player && player.dynamic.primary.player.chuchang
                },
                content: function () {
                    skinSwitch.chukuangWorkerApi.chukuangAction(player, 'chuchang')
                }
            };
            lib.skill._checkDcdShan = {
                trigger: {
                    player: 'useCard'
                },
                forced: true,
                filter: function (event, player) {
                    // 打出闪时
                    return event.card.name === 'shan' && player.dynamic && (player.dynamic.primary && player.dynamic.primary.player.shizhounian || player.dynamic.deputy && player.dynamic.deputy.player.shizhounian)
                },
                content: function () {
                    let avatar = player.dynamic.primary && player.dynamic.primary.player.shizhounian ? player.dynamic.primary : player.dynamic.deputy
                    if (!avatar) return
                    let currentSkinName = lib.config[skinSwitch.configKey.dynamicSkin] && lib.config[skinSwitch.configKey.dynamicSkin][player.name]
                    if (!currentSkinName && avatar.skinName) {
                        currentSkinName = avatar.skinName
                    }
                    let skinConfig = null
                    if (window.decadeUI && window.decadeUI.dynamicSkin && player.name && currentSkinName && window.decadeUI.dynamicSkin[player.name] && window.decadeUI.dynamicSkin[player.name][currentSkinName]) {
                        skinConfig = window.decadeUI.dynamicSkin[player.name][currentSkinName]
                    }
                    let huanshashan = skinConfig && skinConfig.huanshashan
                    if (huanshashan && huanshashan.name) {
                        let isPrimary = player.dynamic.primary && player.dynamic.primary.player.shizhounian
                        skinSwitch.rendererOnMessage.addListener(player, 'hideAllNodeEnd', function () {
                            let shanActionName = huanshashan.action || 'play'
                            let shanVersion = huanshashan.version || '3.6'
                            let shanActionParams = {
                                name: huanshashan.name,
                                action: shanActionName,
                                json: huanshashan.json || false,
                                version: shanVersion,
                                scale: huanshashan.scale,
                                x: huanshashan.x,
                                y: huanshashan.y,
                                showTime: huanshashan.showTime || huanshashan.duration,
                                speed: huanshashan.speed
                            }
                            let res = skinSwitch.dynamic.checkCanBeAction(player)
                            if (res && res.dynamic) {
                                let pp = skinSwitch.getCoordinate(player, true)
                                let me = player === game.me
                                player.dynamic.renderer.postMessage({
                                    message: 'ACTION',
                                    id: player.dynamic.id,
                                    action: 'shan',
                                    skinID: res.dynamic.id,
                                    isDouble: res.isDouble,
                                    deputy: res.deputy,
                                    needHide: res.needHide,
                                    me: me,
                                    direction: me ? false : skinSwitch.getDirection(player),
                                    player: pp,
                                    selfPhase: _status.currentPhase === player,
                                    shanAction: shanActionParams
                                })
                            }
                            if (skinSwitch.rendererOnMessage.dynamicEvents[player.dynamic.id] && skinSwitch.rendererOnMessage.dynamicEvents[player.dynamic.id]['hideAllNodeEnd']) {
                                delete skinSwitch.rendererOnMessage.dynamicEvents[player.dynamic.id]['hideAllNodeEnd']
                            }
                        })
                        player.dynamic.renderer.postMessage({
                            message: 'hideAllNode',
                            id: player.dynamic.id,
                            isPrimary: isPrimary,
                            skinId: avatar.id
                        })
                    } else {
                        let shanAction = (skinConfig && skinConfig.daijishan) || (skinConfig && skinConfig.shan) || avatar.player.shan || 'play3'
                        skinSwitch.postMsgApi.action(player, shanAction, avatar)
                    }
                }
            }
            lib.skill._checkDcdwuxie = {
                trigger: {
                    player: 'useCard'
                },
                forced: true,
                filter: function (event, player) {
                    // 打出无懈时
                    return event.card.name === 'wuxie' && player.dynamic && (player.dynamic.primary && player.dynamic.primary.player.hudong || player.dynamic.deputy && player.dynamic.deputy.player.hudong)
                },
                content: function () {
                    // 如果是双将, 优先使用主将的hudong参数
                    if (player.dynamic.primary && player.dynamic.primary.player.hudong) {
                        skinSwitch.chukuangWorkerApi.chukuangAction(player, 'HuDong')
                    } else if (player.dynamic.deputy && player.dynamic.deputy.player.hudong) {
                        skinSwitch.chukuangWorkerApi.chukuangAction(player, 'HuDong', null, 'fu')
                    }
                }
            }

            // 游戏开始时检查所有角色的圆弧组别是否正确
            lib.skill._fix_yh = {
                trigger: {
                    global: 'gameStart'
                },
                forced: true,
                filter: function (event, player) {
                    return !(lib.config[skinSwitch.decadeKey.newDecadeStyle] === "on")
                },
                content: function () {
                    skinSwitch.skinSwitchCheckYH(player)
                }
            }

            // 不知道怎么合并, 在回合开始和回合结束, 检测Player的group变化
            lib.skill._fix_phase_yh = {
                trigger: {
                    player: ['phaseBegin', 'phaseEnd']
                },
                forced: true,
                filter: function (event, player) {
                    return !(lib.config[skinSwitch.decadeKey.newDecadeStyle] === "on")
                },
                content: function () {
                    skinSwitch.skinSwitchCheckYH(player)
                }
            }

            // 回合计数变身触发
            lib.skill._pfqh_check_roundCount = {
                trigger: {
                    player: "phaseBegin",
                },
                silent: true,
                charlotte: true,
                forced: true,
                priority: 2022,
                filter(event, player) {
                    return player.dynamic && player.isAlive();
                },
                content: function () {
                    // 获取与回合计数相关的特殊效果
                    let res = skinSwitch.dynamic.getSpecial(player, 'roundCount');
                    if (res && res.length > 0) {
                        res.forEach(r => {
                            const { avatar, special, effs, isPrimary } = r;
                            // 检查是否达到回合数触发条件
                            if (effs && effs.rounds && player.phaseNumber === effs.rounds) {
                                let audioRef = { audio: null };
                                let transform = effs.transform;
                                if (transform) {
                                    let newSkin = null;
                                    if (Array.isArray(transform)) {
                                        for (let i = 0; i < transform.length; i++) {
                                            newSkin = special[transform[i]];
                                            if (newSkin) break;
                                        }
                                    } else {
                                        newSkin = special[transform];
                                    }
                                    if (newSkin) {
                                        if (newSkin.audio) audioRef.audio = newSkin.audio;
                                        if (newSkin.name) {
                                            skinSwitch.dynamic.bianshen(player, newSkin.name, isPrimary);
                                            if (newSkin.effect) {
                                                setTimeout(() => {
                                                    if (typeof newSkin.effect === "string") {
                                                        skinSwitch.chukuangWorkerApi.playEffect({
                                                            name: `../../../皮肤切换/effects/${newSkin.effect}/${newSkin.effect}`,
                                                            version: "4.0"
                                                        });
                                                    }
                                                }, 300);
                                            }
                                        }
                                    }
                                }
                                let h = window.__pfqh_helpers || pfqhHelpers
                                h.handleEffectPlay(player, effs, special, audioRef);
                                h.playAudioSafe(audioRef.audio, effs.audio);
                            }
                        });
                    }
                }
            };

            lib.skill._check_die_yh = {
                trigger: {
                    player: "dieBefore",
                },
                silent: true,
                charlotte: true,
                forced: true,
                filter(event, player) {
                    return player.dynamic
                },
                content: function () {
                    let skinYh = player.getElementsByClassName("skinYh");
                    if (skinYh.length > 0) {
                        player.removeChild(skinYh[0]);
                    }
                }
            }

            // 添加游戏开始时重新应用保存的动皮参数的技能
            lib.skill._pfqh_reapply_saved_params = {
                trigger: {
                    global: 'gameStart'
                },
                forced: true,
                silent: true,
                priority: 100, // 高优先级确保在其他技能之前执行
                content: function () {
                    // 多次尝试应用参数，确保成功
                    let applyParams = () => {
                        console.log('=== 尝试应用保存的动皮参数 ===');
                        console.log('当前保存的参数:', window.skinSwitch ? skinSwitch.saveSkinParams : 'skinSwitch不存在');
                        console.log('十周年UI状态:', window.decadeUI ? '已加载' : '未加载');

                        if (window.skinSwitch && typeof skinSwitch.updateDecadeDynamicSkin === 'function' && window.decadeUI) {
                            skinSwitch.updateDecadeDynamicSkin();
                            console.log('已重新应用保存的动皮参数');

                            // 输出应用后的结果
                            if (decadeUI.dynamicSkin) {
                                console.log('应用后的dynamicSkin:', decadeUI.dynamicSkin);
                            }
                            return true;
                        } else {
                            console.warn('条件不满足，跳过应用');
                            return false;
                        }
                    };

                    // 立即尝试一次
                    if (!applyParams()) {
                        // 如果失败，延迟500ms再试
                        setTimeout(() => {
                            if (!applyParams()) {
                                // 如果还失败，再延迟1000ms试一次
                                setTimeout(() => {
                                    if (!applyParams()) {
                                        // 最后再延迟2000ms试一次
                                        setTimeout(applyParams, 2000);
                                    }
                                }, 1000);
                            }
                        }, 500);
                    }
                }
            }

            // 添加角色初始化时重新应用保存的动皮参数的技能
            lib.skill._pfqh_reapply_on_init = {
                trigger: {
                    player: 'enterGame'
                },
                forced: true,
                silent: true,
                priority: -100, // 低优先级，确保在角色完全初始化后执行
                filter: function (event, player) {
                    return player.dynamic && player.dynamic.primary;
                },
                content: function () {
                    // 延迟执行，确保角色完全初始化
                    setTimeout(() => {
                        console.log('=== 角色初始化完成，重新应用保存的动皮参数 ===', player.name);
                        if (window.skinSwitch && typeof skinSwitch.updateDecadeDynamicSkin === 'function' && window.decadeUI) {
                            skinSwitch.updateDecadeDynamicSkin();
                            console.log('角色初始化时已重新应用保存的动皮参数');
                        }
                    }, 200);
                }
            }

            // 不知道怎么合并, 在回合开始和回合结束, 检测Player的group变化
            lib.skill._fix_phase_yh = {
                trigger: {
                    player: ['phaseBegin', 'phaseEnd']
                },
                forced: true,
                filter: function (event, player) {
                    return !(lib.config[skinSwitch.decadeKey.newDecadeStyle] === "on")
                },
                content: function () {
                    skinSwitch.skinSwitchCheckYH(player)
                }
            }

            // 回合计数变身触发
            lib.skill._pfqh_check_roundCount = {
                trigger: {
                    player: "phaseBegin",
                },
                silent: true,
                charlotte: true,
                forced: true,
                priority: 2022,
                filter(event, player) {
                    return player.dynamic && player.isAlive();
                },
                content: function () {
                    // 获取与回合计数相关的特殊效果
                    let res = skinSwitch.dynamic.getSpecial(player, 'roundCount');
                    if (res && res.length > 0) {
                        res.forEach(r => {
                            const { avatar, special, effs, isPrimary } = r;
                            // 检查是否达到回合数触发条件
                            if (effs && effs.rounds && player.phaseNumber === effs.rounds) {
                                let audioRef = { audio: null };
                                let transform = effs.transform;
                                if (transform) {
                                    let newSkin = null;
                                    if (Array.isArray(transform)) {
                                        for (let i = 0; i < transform.length; i++) {
                                            newSkin = special[transform[i]];
                                            if (newSkin) break;
                                        }
                                    } else {
                                        newSkin = special[transform];
                                    }
                                    if (newSkin) {
                                        if (newSkin.audio) audioRef.audio = newSkin.audio;
                                        if (newSkin.name) {
                                            skinSwitch.dynamic.bianshen(player, newSkin.name, isPrimary);
                                            if (newSkin.effect) {
                                                setTimeout(() => {
                                                    if (typeof newSkin.effect === "string") {
                                                        skinSwitch.chukuangWorkerApi.playEffect({
                                                            name: `../../../皮肤切换/effects/${newSkin.effect}/${newSkin.effect}`,
                                                            version: "4.0"
                                                        });
                                                    }
                                                }, 300);
                                            }
                                        }
                                    }
                                }
                                let h = window.__pfqh_helpers || pfqhHelpers
                                h.handleEffectPlay(player, effs, special, audioRef);
                                h.playAudioSafe(audioRef.audio, effs.audio);
                            }
                        });
                    }
                }
            };

            lib.skill._check_die_yh = {
                trigger: {
                    player: "dieBefore",
                },
                silent: true,
                charlotte: true,
                forced: true,
                filter(event, player) {
                    return player.dynamic
                },
                content: function () {
                    let skinYh = player.getElementsByClassName("skinYh");
                    if (skinYh.length > 0) {
                        player.removeChild(skinYh[0]);
                    }
                }
            }

            // 血量变化时, 触发变身
            lib.skill._pfqh_check_hp_change = {
                trigger: {
                    player: ['changeHp'],
                },
                silent: true,
                charlotte: true,
                forced: true,
                filter(event, player) {
                    // 只有动皮可以进行过滤.
                    return player.dynamic
                },
                content: function () {
                    let h = window.__pfqh_helpers || pfqhHelpers
                    // 获取有配置了special的角色
                    let res = skinSwitch.dynamic.getSpecial(player, 'lowhp')
                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r
                        // 默认回复血量不变回来, 和十周年保持一致
                        if (event.getTrigger().num > 0 && !effs.recover) {
                            return
                        }
                        let hp = player.hp
                        if (isPrimary && player._primaryLowestHp == null) {
                            player._primaryLowestHp = hp + 1000
                        }
                        if (!isPrimary && player._deputyLowestHp == null) {
                            player._deputyLowestHp = hp + 1000
                        }
                        if (!effs.recover) {
                            if ((isPrimary && hp >= player._primaryLowestHp) || (!isPrimary && hp >= player._deputyLowestHp))
                                return // 排除救助回来, 然后继续重复变身
                        }
                        if (isPrimary) {
                            player._primaryLowestHp = hp
                        } else {
                            player._deputyLowestHp = hp
                        }
                        let audioRef = { audio: null }
                        let lowhpTransform = effs.transform
                        if (!lowhpTransform || lowhpTransform.length === 0) return

                        const originSkin = isPrimary ? player.originSkin : player.originSkin2
                        let transList = []
                        if (lowhpTransform) {
                            for (let transName of lowhpTransform) {
                                let set = special[transName]
                                if (set && set.hp) {
                                    transList.push(set)
                                }
                            }
                        }
                        transList.sort((a, b) => { return a.hp - b.hp })
                        let index = -1
                        for (let i = 0; i < transList.length; i++) {
                            if (hp <= transList[i].hp) {
                                index = i
                                break
                            }
                        }

                        if (index === -1) {
                            if (!originSkin.skin) originSkin.skin = 'default'
                            skinSwitch.dynamic.transformDst(player, isPrimary, originSkin, { huanfuEffect: effs.effect, isOrigin: true })
                        } else {
                            let trans = transList[index]
                            let h = window.__pfqh_helpers || pfqhHelpers
                            let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                                huanfuEffect: effs.effect,
                                trans,
                                updateAudio: true,
                                avatar
                            })
                            if (transformResult) {
                                audioRef.audio = transformResult.audio
                                let dInfo = h.getSkinInfo(trans.name)
                                if (dInfo && dInfo.name !== player.dynamic[isPrimary ? 'primary' : 'deputy'].name) {
                                    h.handleEffectPlay(player, special.condition.lowhp, special, audioRef)
                                    h.playAudioSafe(audioRef.audio, special.condition.lowhp.audio, 'extension')
                                }
                            }
                        }
                    })
                }

            }

            // 检测受到伤害次数并且变身或者播放特效, 只有达到指定的次数才播放
            lib.skill._pfqh_check_damage_times = {
                trigger: {
                    player: ['damage'],
                },
                silent: true,
                charlotte: true,
                forced: true,
                filter(event, player) {
                    // 只有动皮可以进行过滤.
                    return player.dynamic
                },
                content: function () {
                    let h = window.__pfqh_helpers || pfqhHelpers
                    // 获取有配置了special的角色
                    if (player.__damage_times == null) {
                        player.__damage_times = 1
                    } else {
                        player.__damage_times++
                    }
                    let res = skinSwitch.dynamic.getSpecial(player, 'damageTimes')
                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r
                        // 获取低血量的配置
                        let transforms = effs.transform || []

                        // const originSkin = isPrimary ? player.originSkin : player.originSkin2

                        let transList = []
                        for (let transName of transforms) {
                            // 获取配置里的设置.
                            let set = special[transName]
                            if (set && set.times) {
                                transList.push(set)
                            }
                        }
                        transList.sort((a, b) => { return a.times - b.times })
                        let times = player.__damage_times
                        // 找到合适的符合当前血量的区间.
                        let index = -1
                        for (let i = 0; i < transList.length; i++) {
                            if (times === transList[i].times) {
                                index = i
                                break
                            }
                            if (times < transList[i].times) {
                                break
                            }
                        }
                        if (index !== -1) {
                            let trans = transList[index]
                            let audioRef = { audio: null }
                            let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                                huanfuEffect: effs.effect,
                                trans,
                                updateAudio: true,
                                avatar
                            })
                            if (transformResult) {
                                audioRef.audio = transformResult.audio
                                let dInfo = h.getSkinInfo(trans.name)
                                if (dInfo && dInfo.name !== avatar.name) {
                                    h.handleEffectPlay(player, effs, special, audioRef)
                                    h.playAudioSafe(audioRef.audio, special.condition.damageTimes.audio, 'extension')
                                }
                            }
                        }
                    })
                }

            }

            // 检测受到伤害变身或者播放特效
            lib.skill._pfqh_check_damage = {
                trigger: {
                    player: ['damage'],
                },
                silent: true,
                charlotte: true,
                forced: true,
                filter(event, player) {
                    // 只有动皮可以进行过滤.
                    return player.dynamic
                },
                content: function () {
                    let h = window.__pfqh_helpers || pfqhHelpers
                    let res = skinSwitch.dynamic.getSpecial(player, 'damage')

                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r
                        let pName = isPrimary ? player.name : player.name2
                        let key = isPrimary ? 'damagePrimaryTransform' : 'damageDeputyTransform'
                        if (player[key]) return
                        let audioRef = { audio: null }
                        let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                            huanfuEffect: effs.effect,
                            updateAudio: true,
                            avatar
                        })
                        if (transformResult) {
                            audioRef.audio = transformResult.audio
                        }
                        h.handleEffectPlay(player, effs, special, audioRef)
                        h.playAudioSafe(audioRef.audio, special.condition.damage.audio)
                    })
                }

            }
            // 检测造成伤害累计值并且变身或者播放特效, 只有达到指定的伤害值才播放
            lib.skill._pfqh_check_inflict_damage = {
                trigger: {
                    source: ['damage'],
                },
                silent: true,
                charlotte: true,
                forced: true,
                filter(event, player) {
                    return player.dynamic;
                },
                content: function () {
                    let h = window.__pfqh_helpers || pfqhHelpers
                    let damageValue = event.num || 1;
                    if (player.__inflict_damage == null) {
                        player.__inflict_damage = damageValue;
                    } else {
                        player.__inflict_damage += damageValue;
                    }
                    let res = skinSwitch.dynamic.getSpecial(player, 'inflictDamage')
                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r
                        let transforms = effs.transform
                        if (typeof transforms === 'string') {
                            transforms = [transforms]
                        }
                        transforms = transforms || []
                        let transList = []
                        for (let transName of transforms) {
                            let set = special[transName]
                            if (set && set.damage) {
                                transList.push(set)
                            }
                        }
                        transList.sort((a, b) => { return a.damage - b.damage })
                        let totalDamage = player.__inflict_damage
                        let index = -1
                        for (let i = transList.length - 1; i >= 0; i--) {
                            if (totalDamage >= transList[i].damage) {
                                let key = isPrimary ? '__inflict_damage_transformed_' : '__inflict_damage_transformed2_'
                                let transformKey = key + transList[i].damage
                                if (!player[transformKey]) {
                                    index = i
                                    player[transformKey] = true
                                    break
                                }
                            }
                        }
                        if (index !== -1) {
                            let trans = transList[index]
                            let audioRef = { audio: null }
                            let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                                huanfuEffect: effs.effect,
                                trans,
                                updateAudio: true,
                                avatar
                            })
                            if (transformResult) {
                                audioRef.audio = transformResult.audio
                                let dInfo = h.getSkinInfo(trans.name)
                                if (dInfo && dInfo.name !== avatar.name) {
                                    h.handleEffectPlay(player, effs, special, audioRef)
                                    h.playAudioSafe(audioRef.audio, special.condition.inflictDamage.audio, 'extension')
                                }
                            }
                        }
                    })
                }
            }

            // 击杀
            lib.skill._pfqh_check_jisha = {
                trigger: {
                    source: "dieBegin",
                },
                silent: true,
                charlotte: true,
                forced: true,
                priority: 2022,
                filter(event, player) {
                    return player.dynamic
                },
                content: function () {
                    let h = window.__pfqh_helpers || pfqhHelpers
                    let res = skinSwitch.dynamic.getSpecial(player, 'jisha')
                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r
                        let audioRef = { audio: null }
                        let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                            huanfuEffect: effs.effect,
                            updateAudio: true,
                            avatar
                        })
                        if (transformResult) {
                            audioRef.audio = transformResult.audio
                        }
                        h.handleEffectPlay(player, effs, special, audioRef)
                        h.playAudioSafe(audioRef.audio, special.condition.jisha.audio)
                    })
                }
            }
            // 改变势力
            lib.skill._pfqh_check_changeGroup = {
                trigger: {
                    global: 'gameStart'
                },
                silent: true,
                charlotte: true,
                forced: true,
                priority: 2022,
                filter(event, player) {
                    return player.dynamic;
                },
                content: function () {
                    let h = window.__pfqh_helpers || pfqhHelpers
                    let res = skinSwitch.dynamic.getSpecial(player, 'changeGroup');
                    // 接口传不过来呜呜呜，再写一遍
                    var groupMap = {
                        'wei': ['wei'],
                        'shu': ['shu'],
                        'wu': ['wu'],
                        'qun': ['qun']
                    };
                    function getFirstGroupType(characterName) {
                        var group = get.groupnature(lib.character[characterName]);
                        for (var type in groupMap) {
                            if (groupMap[type].some(function (keyword) { return group.startsWith(keyword); })) {
                                return type;
                            }
                        }
                        return null;
                    }
                    var playerGroupType = getFirstGroupType(player.name);
                    var currentPlayerGroupType = player.group;
                    if (currentPlayerGroupType !== playerGroupType) {

                        // 检查是否执行过换肤操作
                        res.forEach(r => {
                            const { avatar, special, effs, isPrimary } = r;
                            let audioRef = { audio: null };
                            let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                                huanfuEffect: effs.effect,
                                currentGroup: currentPlayerGroupType
                            });
                            if (transformResult) {
                                audioRef.audio = transformResult.audio;
                            }
                            h.handleEffectPlay(player, effs, special, audioRef);
                            h.playAudioSafe(audioRef.audio, special.condition.changeGroup.audio);
                        });
                    }
                }
            };
            // 回合开始变身
            lib.skill._pfqh_check_phaseBegin = {
                trigger: {
                    player: 'phaseBegin'
                },
                silent: true,
                charlotte: true,
                forced: true,
                priority: 2022,
                filter(event, player) {
                    return player.dynamic;
                },
                content: function () {
                    let h = window.__pfqh_helpers || pfqhHelpers
                    let res = skinSwitch.dynamic.getSpecial(player, 'phaseBegin');
                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r;
                        let audioRef = { audio: null };
                        let transformResult = h.handleTransform(player, isPrimary, effs, special, {
                            huanfuEffect: effs.effect
                        });
                        if (transformResult) {
                            audioRef.audio = transformResult.audio;
                        }
                        h.handleEffectPlay(player, effs, special, audioRef);
                        h.playAudioSafe(audioRef.audio, special.condition.phaseBegin.audio);
                    });
                }
            };

            // 回合结束变身
            lib.skill._pfqh_check_phaseEnd = {
                trigger: {
                    player: 'phaseEnd'
                },
                silent: true,
                charlotte: true,
                forced: true,
                priority: 2022,
                filter(event, player) {
                    return player.dynamic;
                },
                content: function () {
                    let res = skinSwitch.dynamic.getSpecial(player, 'phaseEnd');
                    res.forEach(r => {
                        const { avatar, special, effs, isPrimary } = r;
                        let audio;

                        let tryTransform = () => {
                            let transform = effs.transform;
                            if (!transform || !(transform in special)) return;
                            let trans = special[transform];

                            let dskins = decadeUI.dynamicSkin;
                            // 播放转换的骨骼
                            let newName = trans.name;
                            if (newName) {
                                // 分割名字, 获取骨骼, 与当前角色的骨骼的名字比较,是否是同名
                                let [key, skinName] = newName.split('/');
                                let dInfo = key && skinName && dskins[key] && dskins[key][skinName];
                                if (dInfo) {
                                    skinSwitch.dynamic.transformDst(player, isPrimary, dInfo, { huanfuEffect: effs.effect });
                                }
                            } else {
                                skinSwitch.dynamic.transformDst(player, isPrimary, trans, { huanfuEffect: effs.effect });
                            }
                            audio = trans.audio;
                        };

                        let tryEffectPlay = () => {
                            // 检查是否有播放特效
                            let effectPlay = effs.play;
                            if (effectPlay) {
                                let eff = special[effectPlay];
                                if (eff) {
                                    if (!eff.x) eff.x = [0, 0.5];
                                    if (!eff.y) eff.y = [0, 0.5];
                                    setTimeout(() => {
                                        skinSwitch.chukuangWorkerApi.playEffect(eff);
                                    }, (eff.delay || 0) * 1000);
                                    if (!audio) audio = eff.audio;
                                }
                            }
                        };
                        tryTransform();
                        tryEffectPlay();

                        if (!audio) audio = special.condition.phaseEnd.audio;
                        if (audio) {
                            game.playAudio('..', skinSwitch.dcdPath, 'assets/dynamic', audio);
                        }

                    });
                }
            };

            // 先初步进行初始化
            if (!lib.config['extension_千幻聆音_enable'] || lib.config['extension_千幻聆音_qhly_decadeCloseDynamic'] || !(lib.config.qhly_currentViewSkin === 'decade' || lib.config.qhly_currentViewSkin === 'shousha')) {
                overrides(lib.element.player, Player)
            }
        }
        let retryOverride = function (times, timer) {
            if (times < 0) return
            if (!window.decadeUI || !lib.skill._decadeUI_usecardBegin) {
                console.log(`第${times}次尝试`)
                let ti = setTimeout(() => {
                    retryOverride(times - 1, ti)
                }, 10)
            } else {
                overrides(lib.element.player, Player)
                console.log('替换十周年UI player成功')
                // 为当前的每一个player更换init方法
                for (let i = 0; i < game.players.length; i++) {
                    game.players[i].playDynamic = Player.playDynamic;
                }

                if (timer) {
                    clearTimeout(timer)
                }
            }
        }
        // 如果千幻聆音没有开启动皮, 或者选择的UI套装不是十周年或者手杀, 初始化
        if (!lib.config['extension_千幻聆音_enable'] || lib.config['extension_千幻聆音_qhly_decadeCloseDynamic'] || !(lib.config.qhly_currentViewSkin === 'decade' || lib.config.qhly_currentViewSkin === 'shousha')) {
            retryOverride(20)
        }
    }
    // ======== 替换结束 ========
}