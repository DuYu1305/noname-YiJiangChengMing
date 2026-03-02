'use strict';
window.qhly_import(function (lib, game, ui, get, ai, _status) {
    lib.qhly_skinChange = {
        mb_caomao: {
            枭龙破渊: {
                source: 'mbjuejin',
                recover: false,
                audio: '枭龙破渊2/',
                image: 'mb_caomao/枭龙破渊2.jpg',               
            }
        },
        mb_simazhao: {
            昭威淮南: {
                source: 'mbzhaoxiong',
                recover: false,
                audio: '昭威淮南2/',
                image: 'mb_simazhao/昭威淮南2.jpg',               
            }
        },
        jsrg_simazhao: {
            昭威淮南: {
                source: 'jsrgzhaoxiong',
                recover: false,
                audio: '昭威淮南2/',
                image: 'mb_simazhao/昭威淮南2.jpg',               
            }
        },
        huaman: {
            百兽啸林: {
                source: 'hp_2',
                recover: true,
                audio: '百兽啸林2/',
                image: 'huaman/百兽啸林2.jpg',               
            }
        },
        ol_sb_dongzhuo: {
            踞京问鼎: {
                source: 'olxiongni',
                recover: false,
                audio: '踞京问鼎2/',
                image: 'ol_sb_dongzhuo/踞京问鼎2.jpg',               
            },
            踞京问鼎2: {
                source: 'olfengshang',
                recover: false,
                audio: '踞京问鼎3/',
                image: 'ol_sb_dongzhuo/踞京问鼎3.jpg',               
            },
            踞京问鼎3: {
                source: 'olfengshang',
                recover: false,
                audio: '踞京问鼎/',
                image: 'ol_sb_dongzhuo/踞京问鼎.jpg',               
            }
        },
        guansuo: {
            龙战玄黄: {
                source: 'hp_2',
                recover: true,
                audio: '龙战玄黄2/',
                image: 'guansuo/龙战玄黄2.jpg',               
            }
        },
        dc_guansuo: {
            龙战玄黄: {
                source: 'hp_2',
                recover: true,
                audio: '龙战玄黄2/',
                image: 'guansuo/龙战玄黄2.jpg',               
            }
        },
        dc_liuye :{
            焚焰天征: {
                recover: true,
                source: 'phaseBegin',
                audio: '焚焰天征2/',
                image: 'dc_liuye/焚焰天征2.jpg',   
            },
            焚焰天征2: {
                source: 'phaseEnd',
                audio: '焚焰天征/',   
                recover: true,
                image: 'dc_liuye/焚焰天征.jpg',    
            },
        },
        sunce: {
            傲凌绝顶: {
                cardaudio: true,
                source: 'hunzi',
                audio: '傲凌绝顶3/',
                image: 'sunce/傲凌绝顶3.jpg',
            }
        },
        sunce: {
            傲凌绝顶2: {
                cardaudio: true,
                source: 'hunzi',
                audio: '傲凌绝顶4/',
                image: 'sunce/傲凌绝顶4.jpg',
            }
        },
        re_sunben: {
            傲凌绝顶: {
                cardaudio: true,
                source: 'rehunzi',
                audio: '傲凌绝顶3/',
                image: 'sunce/傲凌绝顶3.jpg',
            }
        },
        re_sunben: {
            傲凌绝顶2: {
                cardaudio: true,
                source: 'rehunzi',
                audio: '傲凌绝顶4/',
                image: 'sunce/傲凌绝顶4.jpg',
            }
        },
        re_sunce: {
            傲凌绝顶: {
                cardaudio: true,
                source: 'olhunzi',
                audio: '傲凌绝顶3/',
                image: 'sunce/傲凌绝顶3.jpg',
            }
        },
        re_sunce: {
            傲凌绝顶2: {
                cardaudio: true,
                source: 'olhunzi',
                audio: '傲凌绝顶4/',
                image: 'sunce/傲凌绝顶4.jpg',
            }
        },
        sb_sunce: {
            傲凌绝顶: {
                cardaudio: true,
                source: 'sbhunzi',
                audio: '傲凌绝顶3/',
                image: 'sunce/傲凌绝顶3.jpg',
            }
        },
        sb_sunce: {
            傲凌绝顶2: {
                cardaudio: true,
                source: 'sbhunzi',
                audio: '傲凌绝顶4/',
                image: 'sunce/傲凌绝顶4.jpg',
            }
        },
        sunce: {
            枕戈秣力: {
                cardaudio: true,
                source: 'hunzi',
                audio: '枕戈秣力2/',
                image: 'sunce/枕戈秣力2.jpg',
            }
        },
        re_sunben: {
            枕戈秣力: {
                cardaudio: true,
                source: 'rehunzi',
                audio: '枕戈秣力2/',
                image: 'sunce/枕戈秣力2.jpg',
            }
        },
        re_sunce: {
            枕戈秣力: {
                cardaudio: true,
                source: 'olhunzi',
                audio: '枕戈秣力2/',
                image: 'sunce/枕戈秣力2.jpg',
            }
        },
        sb_sunce: {
            枕戈秣力: {
                cardaudio: true,
                source: 'sbhunzi',
                audio: '枕戈秣力2/',
                image: 'sunce/枕戈秣力2.jpg',
            }
        },
        guanyu: {
            圣垂千古: {
                source: 'damageTimes_4', 
                recover: true,
                cardaudio: true,  
                audio: '圣垂千古2/',
                image: 'guanyu/圣垂千古2.jpg',
            },
        },
        re_guanyu: {
            圣垂千古: {
                source: 'damageTimes_4', 
                recover: true,
                cardaudio: true,  
                audio: '圣垂千古2/',
                image: 'guanyu/圣垂千古2.jpg',
            },
        },
        sb_guanyu: {
            圣垂千古: {
                source: 'damageTimes_4', 
                recover: true,
                cardaudio: true,  
                audio: '圣垂千古2/',
                image: 'guanyu/圣垂千古2.jpg',
            },
        },
        zerong :{
            一念佛魔2: {
                source: 'phaseEnd',
                audio: '一念佛魔/',   
                recover: true,          
                image: 'zerong/一念佛魔.jpg',
            },
            一念佛魔: {
                recover: true,
                source: 'phaseBegin',
                audio: '一念佛魔2/',
                image: 'zerong/一念佛魔2.jpg',   
            }
        },
        caochun: {
            虎啸龙渊: {
                source: 'hp_2',
				recover: true,
                audio: '虎啸龙渊2/',
                image: 'caochun/虎啸龙渊2.jpg',               
            }
        },
        dc_caochun: {
            虎啸龙渊: {
                source: 'hp_2',
				recover: true,
                audio: '虎啸龙渊2/',
                image: 'caochun/虎啸龙渊2.jpg',               
            }
        },
        zhangqiying: {
            九州春回: {
                source: 'hp_2',
				recover: true,
                audio: '九州春回2/',
                image: 'zhangqiying/九州春回2.jpg',               
            }
        },
        x_dc_zhangqiying: {
            九州春回: {
                source: 'hp_2',
				recover: true,
                audio: '九州春回2/',
                image: 'zhangqiying/九州春回2.jpg',               
            }
        },
        y_dc_zhangqiying: {
            九州春回: {
                source: 'hp_2',
				recover: true,
                audio: '九州春回2/',
                image: 'zhangqiying/九州春回2.jpg',               
            }
        },
        caoying: {
            长夜临曦: {
                source: 'hp_2',
				recover: true,
                audio: '长夜临曦2/',
                image: 'caoying/长夜临曦2.jpg',               
            }
        },
        zhangxuan: {
            青鸾霓凰: {
                source: 'tongli',
				recover: true,
                audio: '青鸾霓凰2/',
                image: 'zhangxuan/青鸾霓凰2.jpg',               
            },
            青鸾霓凰2: {
                source: 'phaseEnd',
                recover: true,
                audio: '青鸾霓凰/',
                image: 'zhangxuan/青鸾霓凰.jpg',
            },
        },
        xurong: {
            怒燎横空: {
                source: 'hp_2',
				recover: true,
                audio: '怒燎横空2/',
                image: 'xurong/怒燎横空2.jpg',               
            }
        },
        zhaoxiang: {
            月痕芳影: {
                source: 'fuhan',
				recover: true,
                audio: '月痕芳影2/',
                image: 'zhaoxiang/月痕芳影2.jpg',               
            }
        },
        dc_zhaoxiang: {
            月痕芳影: {
                source: 're_fuhan',
				recover: true,
                audio: '月痕芳影2/',
                image: 'dc_zhaoxiang/月痕芳影2.jpg',               
            }
        },
        re_baosanniang: {
            凤舞龙翔: {
                source: 'mbxushen',
				recover: true,
                audio: '凤舞龙翔2/',
                image: 'baosanniang/凤舞龙翔2.jpg',               
            }
        },
        baosanniang: {
            凤舞龙翔: {
                source: 'newxushen',
                recover: true,
                audio: '凤舞龙翔2/',
                image: 'baosanniang/凤舞龙翔2.jpg',               
            }
        },
        xin_baosanniang: {
            凤舞龙翔: {
                source: 'decadexushen',
                recover: true,
                audio: '凤舞龙翔2/',
                image: 'baosanniang/凤舞龙翔2.jpg',               
            }
        },
        ol_baosanniang: {
            凤舞龙翔: {
                source: 'olxushen',
                recover: true,
                audio: '凤舞龙翔2/',
                image: 'baosanniang/凤舞龙翔2.jpg',               
            }
        },
        sy_baosanniang: {
            凤舞龙翔: {
                source: 'rexushen',
                recover: true,
                audio: '凤舞龙翔2/',
                image: 'baosanniang/凤舞龙翔2.jpg',               
            }
        },
        shen_zhaoyun: {
            百战金甲: {
                source: 'hp_1',
				recover: true,
                audio: '百战金甲2/',
                image: 'shen_zhaoyun/百战金甲2.jpg',               
            }
        },
        shen_zhaoyun: {
            烈甲雄兵: {
                source: 'hp_1',
				recover: true,
				audio: '',
                image: 'shen_zhaoyun/烈甲雄兵2.jpg',               
            }
        },
        shen_zhaoyun: {
            腾云飞雨: {
                source: 'hp_1',
				recover: true,
				audio: '',
                image: 'shen_zhaoyun/腾云飞雨2.jpg',               
            }
        },
        shen_caocao: {
            晷月皓冕: {
                source: 'hp_2',
                recover: true,
                audio: '晷月皓冕2/',
                image: 'shen_caocao/晷月皓冕2.jpg',               
            }
        },
        sp_ol_caocao: {
            高殿置酒: {
                source: 'spolaige',
                audio: '高殿置酒2/',
                image: 'sp_ol__caocao/高殿置酒2.jpg',               
            }
        },
        shen_luxun: {
            炎泽濯战: {
                source: 'nzry_dinghuo',
                audio: '',
                image: 'shen_luxun/炎泽濯战2.jpg',               
            }
        },
        ol_xunyu: {
            书剑定远: {
                source: 'hp_2',
				recover: true,
                audio: '书剑定远2/',
                image: 'xunyu/书剑定远2.jpg',               
            }
        },
        xunyu: {
            书剑定远: {
                source: 'hp_2',
				recover: true,
                //phase: true,                                         加上此行会让回血换肤效果在当前回合结束才触发
                audio: '书剑定远2/',
                image: 'xunyu/书剑定远2.jpg',               
            }
        },
        re_xunyu: {
            书剑定远: {
                source: 'hp_2',
				recover: true,
                audio: '书剑定远2/',
                image: 'xunyu/书剑定远2.jpg',               
            }
        },
        sb_xunyu: {
            书剑定远: {
                source: 'hp_2',
				recover: true,
                audio: '书剑定远2/',
                image: 'xunyu/书剑定远2.jpg',               
            }
        },
        caoxiancaohua: {
            锦瑟良缘: {
                source: 'liangyuan',
                recover: true,
                audio: '锦瑟良缘2/',
                image: 'caoxiancaohua/锦瑟良缘2.jpg',               
            }
        },
        yj_sb_guojia: {         
            陌雪初晴: {        
                source: 'xianmou',      
                audio: '陌雪初晴2/',   
                image: 'yj_sb_guojia/陌雪初晴2.jpg',             
            }
        },
        dc_sb_simayi: {         
            隐龙如晦: {        
                source: 'dcsbquanmou',
                recover: true,      
                audio: '隐龙如晦2/',   
                image: 'dc_sb_simayi/隐龙如晦2.jpg',             
            }
        },
        dc_sb_zhouyu: {         
            江山如画: {        
                source: 'dcsbyingmou',
                recover: true,      
                audio: '江山如画2/',   
                image: 'dc_sb_zhouyu/江山如画2.jpg',             
            }
        },
        shen_guojia: {
            倚星折月: {
                cardaudio: true,
                source: 'stianyi',
                audio: '倚星折月2/',
                image: 'shen_guojia/倚星折月2.jpg',
            }
        },
        zhonghui: {
            潜蛟觊天: {
                cardaudio: true,
                source: 'zili',
                audio: '潜蛟觊天2/',
                image: 'zhonghui/潜蛟觊天2.jpg',
            }
        },
        xin_zhonghui: {
            潜蛟觊天: {
                cardaudio: true,
                source: 'xinzili',
                audio: '潜蛟觊天2/',
                image: 'zhonghui/潜蛟觊天2.jpg',
            }
        },
        re_zhonghui: {
            潜蛟觊天: {
                cardaudio: true,
                source: 'zili',
                audio: '潜蛟觊天2/',
                image: 'zhonghui/潜蛟觊天2.jpg',
            }
        },
        sp_duyu: {
            弼朝博虬: {
                cardaudio: true,
                source: 'spsanchen',
                audio: '弼朝博虬2/',
                image: 'sp_duyu/弼朝博虬2.jpg',
            }
        },
        xuyou: {
            附势而为: {
                source: 'nzry_chenglve',
                recover: true,
                audio: '附势而为2/',
                image: 'xuyou/附势而为2.jpg',               
            }
        },
        wolongfengchu: {
            凤宇龙翔: {
                source: 'luanfeng',
                audio: '凤宇龙翔2/',
                image: 'wolongfengchu/凤宇龙翔2.jpg',               
            }
        },
        ol_sb_yuanshao: {
            劲锋凌人: {
                source: 'olsbshenli',
                audio: '劲锋凌人2/',
                image: 'ol_sb_yuanshao/劲锋凌人2.jpg',               
            },
            劲锋凌人2: {
                source: 'olsbhetao',
                audio: '劲锋凌人/',
                image: 'ol_sb_yuanshao/劲锋凌人.jpg',               
            }
        },
        zhangxingcai: {
            天下知秋: {
                source: 'hp_2',
                recover: true,
                audio: '天下知秋2/',
                image: 'zhangxingcai/天下知秋2.jpg',               
            }
        },
        old_zhangxingcai: {
            天下知秋: {
                source: 'hp_2',
                recover: true,
                audio: '天下知秋2/',
                image: 'zhangxingcai/天下知秋2.jpg',               
            }
        },
        // db_wenyang: {
            // 破宇开天吴: {
                // source: 'changeGroup',
                // group: 'wu',
                // audio: '破宇开天吴/',
                // image: 'db_wenyang/破宇开天吴.jpg',          
            // }
        // },
        // db_wenyang: {
            // 破宇开天魏: {
                // source: 'changeGroup',
                // group: 'wei',
                // audio: '破宇开天魏/',
                // image: 'db_wenyang/破宇开天魏.jpg',          
            // }
        // },
    }
});