'use strict';
window.qhly_import(function (lib, game, ui, get, ai, _status) {
    lib.qhly_skinShare = {
        xin_baosanniang: { //鲍三娘
            name: 'baosanniang',
            skills: {
                decadewuniang: 'newwuniang',
                decadexushen: 'newxushen',
                decadezhennan: 'newzhennan',
            },
        },
        sy_baosanniang: { //鲍三娘
            name: 'baosanniang',
            skills: {
                meiyong: 'newwuniang',
                rexushen: 'newxushen',
                rezhennan: 'newzhennan',
                new_rewusheng: 'new_rewusheng',
                redangxian: 'oldangxian',
            },
        },
        ol_baosanniang: { //鲍三娘
            name: 'baosanniang',
            skills: {
                olwuniang: 'newwuniang',
                olxushen: 'newxushen',
                olzhennan: 'newzhennan',
            },
        },
        re_baosanniang: { //鲍三娘
            name: 'baosanniang',
            skills: {
                mbshuyong: 'newwuniang',
                mbxushen: 'newxushen',
                mbzhennan: 'newzhennan',
                new_rewusheng: 'new_rewusheng',
                redangxian: 'oldangxian',
                rezhiman: 'rezhiman',
            },
        },
        tw_baoxin: { //鲍信
            name: 'baoxin',
            skills: {
                twmutao: 'mutao',
                twyimou: 'yimou',
            },
        },
        std_baoxin: { //鲍信
            name: 'baoxin',
            skills: {
                stdmutao: 'mutao',
                stdyimou: 'yimou',
            },
        },
        sp_bianfuren: { //卞夫人
            name: 'ol_bianfuren',
            skills: {
                spwanwei: 'fuwei',
                spyuejian: 'yuejian',
            },
        },
        tw_bianfuren: { //卞夫人
            name: 'ol_bianfuren',
            skills: {
                twwanwei: 'fuwei',
                twyuejian: 'yuejian',
            },
        },
        dc_bulianshi: { //步练师
            name: 'bulianshi',
            skills: {
                dcanxu: 'old_anxu',
                dczhuiyi: 'zhuiyi',
            },
        },
        re_bulianshi: { //步练师
            name: 'bulianshi',
            skills: {
                reanxu: 'old_anxu',
                zhuiyi: 'zhuiyi',
            },
        },
        old_bulianshi: { //步练师
            name: 'bulianshi',
            skills: {
                anxu: 'old_anxu',
                zhuiyi: 'zhuiyi',
            },
        },
        re_caifuren: { //蔡夫人
            name: 'caifuren',
            skills: {
                reqieting: 'qieting',
                rexianzhou: 'xianzhou',
            },
        },
        ol_caifuren: { //蔡夫人
            name: 'caifuren',
            skills: {
                olqieting: 'qieting',
                xianzhou: 'xianzhou',
            },
        },
        xin_caifuren: { //蔡夫人
            name: 'caifuren',
            skills: {
                xinqieting: 'qieting',
                xianzhou: 'xianzhou',
            },
        },
        ol_caiwenji: { //蔡文姬
            name: 'caiwenji',
            skills: {
                olbeige: 'beige',
                duanchang: 'duanchang',
            },
        },
        re_caiwenji: { //蔡文姬
            name: 'caiwenji',
            skills: {
                rebeige: 'beige',
                duanchang: 'duanchang',
            },
        },
        re_caiyong: { //蔡邕
            name: 'caiyong',
            skills: {
                rebizhuan: 'bizhuan',
                retongbo: 'tongbo',
            },
        },
        re_caocao: { //曹操
            name: 'caocao',
            skills: {
                new_rejianxiong: 'jianxiong',
                rehujia: 'hujia',
            },
        },
        sb_caocao: { //曹操
            name: 'caocao',
            skills: {
                sbjianxiong: 'jianxiong',
                sbhujia: 'hujia',
                sbqingzheng: 'sbqingzheng', 
            },
        },
        ol_caochong: { //曹冲
            name: 'caochong',
            skills: {
                olchengxiang: 'chengxiang',
                olrenxin: 'renxin',
            },
        },
        re_caochong: { //曹冲
            name: 'caochong',
            skills: {
                rechengxiang: 'chengxiang',
                renxin: 'renxin',
            },
        },
        old_caochong: { //曹冲
            name: 'caochong',
            skills: {
                oldchengxiang: 'chengxiang',
                oldrenxin: 'renxin',
            },
        },
        dc_caochun: { //曹纯
            name: 'caochun',
            skills: {
                xinshanjia: 'olshanjia',
            },
        },
        mb_caohong: { //曹洪
            name: 'caohong',
            skills: {
                mbyuanhu: 'yuanhu',
            },
        },
        re_caopi: { //曹丕
            name: 'caopi',
            skills: {
                rexingshang: 'xingshang',
                refangzhu: 'fangzhu',
                songwei: 'songwei',
            },
        },
        sb_caopi: { //曹丕
            name: 'caopi',
            skills: {
                sbxingshang: 'xingshang',
                sbfangzhu: 'fangzhu',
                sbsongwei: 'songwei',
            },
        },
        tw_sb_caopi: { //曹丕
            name: 'caopi',
            skills: {
                twxingshang: 'xingshang',
                twfangzhu: 'fangzhu',
                twsongwei: 'songwei',
            },
        },
        gz_caopi: { //曹丕
            name: 'caopi',
            skills: {
                gz_xingshang: 'xingshang',
                gz_fangzhu: 'fangzhu',
            },
        },
        sb_caoren: { //曹仁
            name: 'caoren',
            skills: {
                sbjushou: 'xinjushou',
                sbjiewei: 'xinjiewei',
            },
        },
        re_caorui: { //曹叡
            name: 'caorui',
            skills: {
                huituo: 'huituo',
                remingjian: 'mingjian',
                xingshuai: 'xingshuai',
            },
        },
        re_caoxiu: { //曹休
            name: 'caoxiu',
            skills: {
                qianju: 'qianju',
                reqingxi: 'qingxi',
            },
        },
        xin_caoxiu: { //曹休
            name: 'caoxiu',
            skills: {
                qianju: 'qianju',
                xinqingxi: 'qingxi',
            },
        },
        ol_caozhang: { //曹彰
            name: 'caozhang',
            skills: {
                oljiangchi: 'new_jiangchi',
            },
        },
        re_caozhang: { //曹彰
            name: 'caozhang',
            skills: {
                xinjiangchi: 'new_jiangchi',
            },
        },
        xin_caozhang: { //曹彰
            name: 'caozhang',
            skills: {
                rejiangchi: 'new_jiangchi',
            },
        },
        gz_caozhen: { //曹真
            name: 'caozhen',
            skills: {
                gzsidi: 'xinsidi',
            },
        },
        re_caozhen: { //曹真
            name: 'caozhen',
            skills: {
                residi: 'xinsidi',
            },
        },
        old_caozhen: { //曹真
            name: 'caozhen',
            skills: {
                sidi: 'xinsidi',
            },
        },
        xin_caozhen: { //曹真
            name: 'caozhen',
            skills: {
                mbsidi: 'xinsidi',
            },
        },
        ol_caozhi: { //曹植
            name: 'caozhi',
            skills: {
                reluoying: 'luoying',
                reluoying_judge: 'luoying_judge',
                reluoying_discard: 'luoying_discard',
                oljiushi: 'jiushi',
                oljiushi_use: 'jiushi1',
            },
        },
        dc_caozhi: { //曹植
            name: 'caozhi',
            skills: {
                reluoying: 'luoying',
                reluoying_judge: 'luoying_judge',
                reluoying_discard: 'luoying_discard',
                dcjiushi: 'jiushi',
                dcjiushi_use: 'jiushi1',
            },
        },
        re_caozhi: { //曹植
            name: 'caozhi',
            skills: {
                reluoying: 'luoying',
                reluoying_judge: 'luoying_judge',
                reluoying_discard: 'luoying_discard',
                rejiushi: 'jiushi',
                rejiushi1: 'jiushi1',
                chengzhang: 'chengzhang',
            },
        },
        old_chendao: {//陈到
            name: 'chendao',
            skills: {
                drlt_wanglie: 'dcwanglie',
            },
        },
        gz_chendao: {//陈到
            name: 'chendao',
            skills: {
                drlt_wanglie: 'dcwanglie',
            },
        },
        sp_chendong: { //陈董
            name: 'chendong',
            skills: {
                spyilie: 'dcduanxie',
                spfenming: 'fenming',
            },
        },
        sb_chengong: { //陈宫
            name: 'chengong',
            skills: {
                twmingce: 'mingce',
                sbzhichi: 'zhichi',
            },
        },
        re_chengong: { //陈宫
            name: 'chengong',
            skills: {
                remingce: 'mingce',
                zhichi: 'zhichi',
            },
        },
        ol_chengpu: { //程普
            name: 'chengpu',
            skills: {
                dclihuo: 'lihuo',
                olchunlao: 'chunlao',
            },
        },
        re_chengpu: { //程普
            name: 'chengpu',
            skills: {
                ollihuo: 'lihuo',
                rechunlao: 'chunlao',
            },
        },
        xin_chengpu: { //程普
            name: 'chengpu',
            skills: {
                relihuo: 'lihuo',
                chunlao: 'chunlao',
            },
        },
        tw_chengpu: { //程普
            name: 'chengpu',
            skills: {
                twlihuo: 'lihuo',
                twchunlao: 'chunlao',
            },
        },
        dc_chenqun: { //陈群
            name: 'chenqun',
            skills: {
                repindi: 'pindi',
                dcfaen: 'faen',
            },
        },
        re_chenqun: { //陈群
            name: 'chenqun',
            skills: {
                redingpin: 'pindi',
                refaen: 'faen',
            },
        },
        re_chunyuqiong: { //淳于琼
            name: 'chunyuqiong',
            skills: {
                recangchu: 'cangchu',
                reshishou: 'sushou',
                reliangying: 'skill', 
            },
        },
        gz_cuimao: { //崔琰毛玠
            name: 'cuimao',
            skills: {
                gzzhengbi: 'zhengbi',
                gzfengying: 'fengying',
            },
        },
        gz_daqiao: { //大乔
            name: 'daqiao',
            skills: {
                guose: 'guose',
                liuli: 'liuli',
            },
        },
        sb_daqiao: { //大乔
            name: 'daqiao',
            skills: {
                sbguose: 'guose',
                sbliuli: 'liuli',
            },
        },
        re_daqiao: { //大乔
            name: 'daqiao',
            skills: {
                reguose: 'guose',
                liuli: 'liuli',
            },
        },
        tw_daxiaoqiao: { //大乔小乔
            name: 'daxiaoqiao',
            skills: {
                twxingwu: 'new_xingwu',
                tianxiang: 'oltianxiang',
                liuli: 'liuli',
            },
        },
        dc_daxiaoqiao: { //大乔小乔
            name: 'daxiaoqiao',
            skills: {
                dcxingwu: 'new_xingwu',
                retianxiang: 'oltianxiang',
                liuli: 'liuli',
            },
        },
        ol_dengai: { //邓艾
            name: 'dengai',
            skills: {
                oltuntian: 'tuntian',
                olzaoxian: 'zaoxian',
                jixi: 'jixi',
            },
        },
        re_dengai: { //邓艾
            name: 'dengai',
            skills: {
                retuntian: 'tuntian',
                zaoxian: 'zaoxian',
                jixi: 'jixi',
            },
        },
        pot_dengai: { //邓艾
            name: 'dengai',
            skills: {
                pottuntian: 'tuntian',
                potzaoxian: 'zaoxian',
                potjixi: 'jixi',
            },
        },
        tw_dengzhi: { //邓芝
            name: 'dengzhi',
            skills: {
                twjimeng: 'jimeng',
                shuaiyan: 'shuaiyan',
            },
        },
        gz_dianwei: { //典韦
            name: 'dianwei',
            skills: {
                reqiangxi: 'qiangxi',
            },
        },
        ol_dianwei: { //典韦
            name: 'dianwei',
            skills: {
                olqiangxi: 'qiangxi',
                olninge: 'skill', 
            },
        },
        re_dianwei: { //典韦
            name: 'dianwei',
            skills: {
                reqiangxi: 'qiangxi',
            },
        },
        sb_diaochan: { //貂蝉
            name: 'diaochan',
            skills: {
                sbbiyue: 'biyue',
                sblijian: 'lijian',
            },
        },
        re_diaochan: { //貂蝉
            name: 'diaochan',
            skills: {
                rebiyue: 'biyue',
                lijian: 'lijian',
            },
        },
        ol_dingshangwan: { //丁尚涴
            name: 'dingshangwan',
            skills: {
                olfengyan: 'dcfengyan',
                olfudao: 'dcfudao',
            },
        },
        re_dongbai: { //董白
            name: 'dongbai',
            skills: {
                relianzhu: 'lianzhu',
                rexiahui: 'xiahui',
            },
        },
        ol_dongzhuo: { //董卓
            name: 'dongzhuo',
            skills: {
                oljiuchi: 'jiuchi',
                roulin: 'roulin',
                olbaonue: 'baonue',
                benghuai: 'benghuai',
            },
        },
        re_dongzhuo: { //董卓
            name: 'dongzhuo',
            skills: {
                rejiuchi: 'jiuchi',
                roulin: 'roulin',
                baonue: 'baonue',
                benghuai: 'benghuai',
            },
        },
        re_duji: { //杜畿
            name: 'duji',
            skills: {
                reandong: 'xinfu_andong',
                reyingshi: 'xinfu_yingshi',
            },
        },
        tw_fanchou: { //樊稠
            name: 'fanchou',
            skills: {
                twxingluan: 'xinxingluan',
            },
        },
        ol_fazheng: { //法正
            name: 'fazheng',
            skills: {
                olenyuan: 'enyuan',
                olxuanhuo: 'xuanhuo',
            },
        },
        xin_fazheng: { //法正
            name: 'fazheng',
            skills: {
                xinenyuan: 'enyuan',
                xinxuanhuo: 'xuanhuo',
            },
        },
        sb_fazheng: { //法正
            name: 'fazheng',
            skills: {
                sbenyuan: 'enyuan',
                sbxuanhuo: 'xuanhuo',
            },
        },
        re_fazheng: { //法正
            name: 'fazheng',
            skills: {
                reenyuan: 'enyuan',
                rexuanhuo: 'xuanhuo',
            },
        },
        tw_re_fazheng: { //法正
            name: 'fazheng',
            skills: {
                twenyuan: 'enyuan',
                twxuanhuo: 'xuanhuo',
            },
        },
        gz_fazheng: { //法正
            name: 'fazheng',
            skills: {
                gzenyuan: 'enyuan',
                gzxuanhuo: 'xuanhuo',
            },
        },
        gz_fengxi: { //冯熙
            name: 'fengxi',
            skills: {
                gzyusui: 'yusui',
                gzboyan: 'boyan',
            },
        },
        old_fuhuanghou: { //伏皇后
            name: 'fuhuanghou',
            skills: {
                oldqiuyuan: 'qiuyuan',
                oldzhuikong: 'zhuikong',
            },
        },
        std_fuhuanghou: { //伏皇后
            name: 'fuhuanghou',
            skills: {
                stdqiuyuan: 'qiuyuan',
                stdzhuikong: 'zhuikong',
            },
        },
        ol_fuhuanghou: { //伏皇后
            name: 'fuhuanghou',
            skills: {
                olqiuyuan: 'qiuyuan',
                rezhuikong: 'zhuikong',
            },
        },
        re_fuhuanghou: { //伏皇后
            name: 'fuhuanghou',
            skills: {
                reqiuyuan: 'qiuyuan',
                rezhuikong: 'zhuikong',
            },
        },
        tw_fuhuanghou: { //伏皇后
            name: 'fuhuanghou',
            skills: {
                xinqiuyuan: 'qiuyuan',
                rezhuikong: 'zhuikong',
            },
        },
        xin_fuhuanghou: { //伏皇后
            name: 'fuhuanghou',
            skills: {
                xinqiuyuan: 'qiuyuan',
                xinzhuikong: 'zhuikong',
            },
        },
        tw_furong: { //傅肜
            name: 'furong',
            skills: {
                twxuewei: 'xuewei',
                twliechi: 'liechi',
            },
        },
        tw_fuwan: { //伏完
            name: 'fuwan',
            skills: {
                twmoukui: 'dcmoukui',
            },
        },
        gz_fuwan: { //伏完
            name: 'fuwan',
            skills: {
                gzmoukui: 'dcmoukui',
            },
        },
        dc_ganfuren: { //甘夫人
            name: 'ganfuren',
            skills: {
                dcshushen: 'stdshushen',
                dcshenzhi: 'shenzhi',
            },
        },
        gz_ganfuren: { //甘夫人
            name: 'ganfuren',
            skills: {
                gzshushen: 'dcshushen',
                shenzhi: 'dcshenzhi',
            },
        },
        re_ganning: { //甘宁
            name: 'ganning',
            skills: {
                qixi: 'qixi',
                fenwei: 'fenwei', 
            },
        },
        sb_ganning: { //甘宁
            name: 'ganning',
            skills: {
                sbqixi: 'qixi',
                sbfengwei: 'fenwei', 
            },
        },
        old_gaoshun: { //高顺
            name: 'gaoshun',
            skills: {
                xianzhen: 'xinxianzhen',
                jinjiu: 'jinjiu',
            },
        },
        ol_gaoshun: { //高顺
            name: 'gaoshun',
            skills: {
                olxianzhen: 'xinxianzhen',
                decadejinjiu: 'jinjiu',
            },
        },
        xin_gaoshun: { //高顺
            name: 'gaoshun',
            skills: {
                decadexianzhen: 'xinxianzhen',
                decadejinjiu: 'jinjiu',
            },
        },
        sb_gaoshun: { //高顺
            name: 'gaoshun',
            skills: {
                sbxianzhen: 'xinxianzhen',
                sbjinjiu: 'jinjiu',
            },
        },
        re_gaoshun: { //高顺
            name: 'gaoshun',
            skills: {
                rexianzhen: 'xinxianzhen',
                rejinjiu: 'jinjiu',
            },
        },
        std_gongsunyuan: { //公孙渊
            name: 'gongsunyuan',
            skills: {
                stdhuaiyi: 'huaiyi',
            },
        },
        re_gongsunyuan: { //公孙渊
            name: 'gongsunyuan',
            skills: {
                rehuaiyi: 'huaiyi',
            },
        },
        dc_gongsunzan: { //公孙瓒
            name: 'gongsunzan',
            skills: {
                dcyicong: 'reyicong',
                dcqiaomeng: 'qiaomeng', 
            },
        },
        re_gongsunzan: { //公孙瓒
            name: 'gongsunzan',
            skills: {
                reyicong: 'reyicong',
                reqiaomeng: 'qiaomeng', 
            },
        },
        xin_gongsunzan: { //公孙瓒
            name: 'gongsunzan',
            skills: {
                xinyicong: 'reyicong',
                qiaomeng: 'qiaomeng', 
            },
        },
        sb_gongsunzan: { //公孙瓒
            name: 'gongsunzan',
            skills: {
                sbyicong: 'reyicong',
                sbqiaomeng: 'qiaomeng', 
            },
        },
        re_guanping: { //关平
            name: 'guanping',
            skills: {
                relongyin: 'longyin',
                jiezhong: 'jiezhong', 
            },
        },
        old_guanqiujian: { //毌丘俭
            name: 'guanqiujian',
            skills: {
                drlt_zhengrong: 'zhengrong',
                drlt_hongju: 'hongju',
                drlt_qingce: 'qingce',
            },
        },
        re_guanqiujian: { //毌丘俭
            name: 'guanqiujian',
            skills: {
                rezhengrong: 'zhengrong',
                rehongju: 'hongju',
                reqingce: 'qingce',
            },
        },
        tw_guanqiujian: { //毌丘俭
            name: 'guanqiujian',
            skills: {
                twzhengrong: 'zhengrong',
                twhongju: 'hongju',
                twqingce: 'qingce',
            },
        },
        gz_guanqiujian: { //毌丘俭
            name: 'guanqiujian',
            skills: {
                gzzhengrong: 'zhengrong',
                gzhongju: 'hongju',
            },
        },
        dc_guansuo: { //关索
            name: 'guansuo',
            skills: {
                xinzhengnan: 'zhengnan',
                xiefang: 'xiefang',
                new_rewusheng: 'new_rewusheng',
                xindangxian: 'oldangxian',
                rezhiman: 'rezhiman',
            },
        },
        old_guanyinping: { //关银屏
            name: 'guanyinping',
            skills: {
                oldhuxiao: 'huxiao',
                xueji_old: 'xueji',
                oldwuji: 'wuji',
            },
        },
        mb_guanyinping: { //关银屏
            name: 'guanyinping',
            skills: {
                mbhuxiao: 'huxiao',
                mbxuehen: 'xueji',
                mbwuji: 'wuji',
            },
        },
        old_guanyu: { //关羽
            name: 'guanyu',
            skills: {
                wusheng: 'wusheng',
                yijue: 'yijue',
            },
        },
        sb_guanyu: { //关羽
            name: 'guanyu',
            skills: {
                sbwusheng: 'wusheng',
                sbyijue: 'yijue',
            },
        },
        re_guanyu: { //关羽
            name: 'guanyu',
            skills: {
                new_rewusheng: 'wusheng',
                new_yijue: 'yijue',
            },
        },
        dc_jsp_guanyu: { //关羽
            name: 'jsp_guanyu',
            skills: {
                new_rewusheng: 'new_rewusheng',
                dcdanji: 'danji',
                dcnuchen: 'dcnuchen', 
            },
        },
        gz_guanyu: { //关羽
            name: 'guanyu',
            skills: {
                new_rewusheng: 'wusheng',
            },
        },
        ol_guanzhang: { //关兴张苞
            name: 'guanzhang',
            skills: {
                olfuhun: 'fuhun',
                new_rewusheng: 'new_rewusheng',
                olpaoxiao: 'olpaoxiao',
            },
        },
        old_guanzhang: { //关兴张苞
            name: 'guanzhang',
            skills: {
                old_fuhun: 'fuhun',
                wusheng: 'new_rewusheng',
                paoxiao: 'olpaoxiao',
            },
        },
        re_guanzhang: { //关兴张苞
            name: 'guanzhang',
            skills: {
                fuhun: 'fuhun',
                new_rewusheng: 'new_rewusheng',
                olpaoxiao: 'olpaoxiao',
            },
        },
        ol_guohuai: { //郭淮
            name: 'guohuai',
            skills: {
                oljingce: 'rejingce',
            },
        },
        re_guohuai: { //郭淮
            name: 'guohuai',
            skills: {
                decadejingce: 'rejingce',
            },
        },
        xin_guohuai: { //郭淮
            name: 'guohuai',
            skills: {
                mobilejingce: 'rejingce',
            },
        },
        std_guohuanghou: { //郭皇后
            name: 'guohuanghou',
            skills: {
                stdjiaozhao: 'jiaozhao',
                stddanxin: 'danxin',
            },
        },
        re_guohuanghou: { //郭皇后
            name: 'guohuanghou',
            skills: {
                rejiaozhao: 'jiaozhao',
                redanxin: 'danxin',
            },
        },
        ol_guohuanghou: { //郭皇后
            name: 'guohuanghou',
            skills: {
                oljiaozhao: 'jiaozhao',
                oldanxin: 'danxin',
            },
        },
        sb_guojia: { //郭嘉
            name: 'guojia',
            skills: {
                sbtiandu: 'tiandu',
                sbyiji: 'yiji',
            },
        },
        re_guojia: { //郭嘉
            name: 'guojia',
            skills: {
                tiandu: 'tiandu',
                new_reyiji: 'yiji',
            },
        },
        gz_guojia: { //郭嘉
            name: 'guojia',
            skills: {
                tiandu: 'tiandu',
                gz_yiji: 'yiji',
            },
        },
        re_guotufengji: { //郭图逢纪
            name: 'guotufengji',
            skills: {
                rejigong: 'jigong',
                shifei: 'shifei',
            },
        },
        re_guyong: { //顾雍
            name: 'guyong',
            skills: {
                reshenxing: 'shenxing',
                rebingyi: 'olbingyi',
            },
        },
        xin_guyong: { //顾雍
            name: 'guyong',
            skills: {
                xinshenxing: 'shenxing',
                xinbingyi: 'olbingyi',
            },
        },
        tw_guyong: { //顾雍
            name: 'guyong',
            skills: {
                twgyshenxing: 'shenxing',
                twbingyi: 'olbingyi',
            },
        },
        old_handang: { //韩当
            name: 'handang',
            skills: {
                oldgongji: 'gongji',
                oldjiefan: 'jiefan',
            },
        },
        sb_handang: { //韩当
            name: 'handang',
            skills: {
                sbgongqi: 'gongji',
                sbjiefan: 'jiefan',
            },
        },
        xin_handang: { //韩当
            name: 'handang',
            skills: {
                xingongji: 'gongji',
                xinjiefan: 'jiefan',
            },
        },
        re_handang: { //韩当
            name: 'handang',
            skills: {
                regongji: 'gongji',
                jiefan: 'jiefan',
            },
        },
        tw_handang: { //韩当
            name: 'handang',
            skills: {
                twgongji: 'gongji',
                twjiefan: 'jiefan',
            },
        },
        re_hanhaoshihuan: { //韩浩史涣
            name: 'hanhaoshihuan',
            skills: {
                reshenduan: 'shenduan',
                reyonglve: 'yonglve',
            },
        },
        re_hansui: { //韩遂
            name: 'hansui',
            skills: {
                spniluan: 'olniluan',
                spweiwu: 'olxiaoxi',
            },
        },
        xin_hansui: { //韩遂
            name: 'hansui',
            skills: {
                xinniluan: 'olniluan',
                olxiaoxi_hansui: 'olxiaoxi',
            },
        },
        re_hejin: { //何进
            name: 'hejin',
            skills: {
                spmouzhu: 'mouzhu',
                spyanhuo: 'olyanhuo',
            },
        },
        tw_hejin: { //何进
            name: 'hejin',
            skills: {
                twmouzhu: 'mouzhu',
                twyanhuo: 'olyanhuo',
            },
        },
        gz_hetaihou: { //何太后
            name: 'hetaihou',
            skills: {
                zhendu: 'zhendu',
                qiluan: 'qiluan',
            },
        },
        old_huangfusong: { //皇甫嵩
            name: 'huangfusong',
            skills: {
                xinfenyue: 'fenyue',
            },
        },
        re_huanggai: { //黄盖
            name: 'huanggai',
            skills: {
                rekurou: 'kurou',
                zhaxiang: 'zhaxiang',
            },
        },
        sb_huanggai: { //黄盖
            name: 'huanggai',
            skills: {
                sbkurou: 'kurou',
                sbzhaxiang: 'zhaxiang',
            },
        },
        old_huanghao: { //黄皓
            name: 'huanghao',
            skills: {
                oldqinqing: 'qinqing',
                oldhuisheng: 'huisheng',
            },
        },
        dc_huanghao: { //黄皓
            name: 'huanghao',
            skills: {
                dcqinqing: 'qinqing',
                huisheng: 'huisheng',
                dccunwei: 'dccunwei', 
            },
        },
        sb_huangyueying: { //黄月英
            name: 'huangyueying',
            skills: {
                sbjizhi: 'jizhi',
                sbqicai: 'qicai',
            },
        },
        re_huangyueying: { //黄月英
            name: 'huangyueying',
            skills: {
                rejizhi: 'jizhi',
                reqicai: 'qicai',
            },
        },
        junk_huangyueying: { //黄月英
            name: 'huangyueying',
            skills: {
                junkjizhi: 'jizhi',
                junkqicai: 'qicai',
            },
        },
        gz_huangyueying: { //黄月英
            name: 'huangyueying',
            skills: {
                jizhi: 'jizhi',
                qicai: 'qicai',
            },
        },
        re_jsp_huangyueying: { //黄月英
            name: 'jsp_huangyueying',
            skills: {
                rejiqiao: 'jiqiao',
                reqicai: 'reqicai',
                relinglong: 'linglong', 
            },
        },
        re_huangzhong: { //黄忠
            name: 'huangzhong',
            skills: {
                xinliegong: 'liegong',
            },
        },
        sb_huangzhong: { //黄忠
            name: 'huangzhong',
            skills: {
                sbliegong: 'liegong',
            },
        },
        ol_huangzhong: { //黄忠
            name: 'huangzhong',
            skills: {
                xinliegong: 'liegong',
            },
        },
        gz_huangzhong: { //黄忠
            name: 'huangzhong',
            skills: {
                gzliegong: 'liegong',
            },
        },
        old_huatuo: { //华佗
            name: 'huatuo',
            skills: {
                chulao: 'qingnang',
                jijiu: 'jijiu',
            },
        },
        re_huatuo: { //华佗
            name: 'huatuo',
            skills: {
                new_reqingnang: 'qingnang',
                jijiu: 'jijiu',
            },
        },
        gz_huatuo: { //华佗
            name: 'huatuo',
            skills: {
                new_chuli: 'qingnang',
                jijiu: 'jijiu',
            },
        },
        gz_huaxin: { //华歆
            name: 'huaxin',
            skills: {
                wanggui: 'spwanggui',
                fakexibing: 'xibing',
            },
        },
        ol_huaxiong: { //华雄
            name: 'huaxiong',
            skills: {
                new_reyaowu: 'yaowu',
            },
        },
        re_huaxiong: { //华雄
            name: 'huaxiong',
            skills: {
                reyaowu: 'yaowu',
                shizhan: 'shizhan',
            },
        },
        dc_hujinding: { //胡金定
            name: 'hujinding',
            skills: {
                dcdeshi: 'renshi',
                dcwuyuan: 'wuyuan',
            },
        },
        old_jiakui: { //贾逵
            name: 'jiakui',
            skills: {
                zhongzuo: 'zhongzuo',
                wanlan: 'xinwanlan',
            },
        },
        gz_jiangfei: { //蒋琬费祎
            name: 'jiangfei',
            skills: {
                shengxi: 'dcshengxi',
                gzshoucheng: 'dcshoucheng',
            },
        },
        gz_jianggan: { //蒋干
            name: 'jianggan',
            skills: {
                weicheng: 'weicheng',
                daoshu: 'daoshu',
            },
        },
        gz_jiangqing: { //蒋钦
            name: 'dc_jiangqing',
            skills: {
                gzshangyi: 'dcshangyi',
                niaoxiang: 'dcniaoxiang',
            },
        },
        ol_jiangwei: { //姜维
            name: 'jiangwei',
            skills: {
                oltiaoxin: 'tiaoxin',
                olzhiji: 'zhiji',
                reguanxing: 'reguanxing',
            },
        },
        re_jiangwei: { //姜维
            name: 'jiangwei',
            skills: {
                retiaoxin: 'tiaoxin',
                zhiji: 'zhiji',
                reguanxing: 'reguanxing',
            },
        },
        gz_jiangwei: { //姜维
            name: 'sb_jiangwei',
            skills: {
                tiaoxin: 'sbtiaoxin',
                yizhi: 'sbzhiji',
                kanpo: 'kanpo',
                tianfu: 'tianfu',
            },
        },
        ol_jianyong: { //简雍
            name: 'jianyong',
            skills: {
                olqiaoshui: 'qiaoshui',
                jyzongshi: 'jyzongshi',
            },
        },
        re_jianyong: { //简雍
            name: 'jianyong',
            skills: {
                reqiaoshui: 'qiaoshui',
                jyzongshi: 'jyzongshi',
            },
        },
        xin_jianyong: { //简雍
            name: 'jianyong',
            skills: {
                xinqiaoshui: 'qiaoshui',
                xinjyzongshi: 'jyzongshi',
            },
        },
        dc_sp_jiaxu: { //贾诩
            name: 'sp_jiaxu',
            skills: {
                zhenlue: 'zhenlue',
                dcjianshu: 'jianshu',
                dcyongdi: 'yongdi',
            },
        },
        sb_jiaxu: { //贾诩
            name: 'jiaxu',
            skills: {
                sbluanwu: 'luanwu',
                sbwansha: 'wansha',
                sbweimu: 'weimu',
            },
        },
        re_jiaxu: { //贾诩
            name: 'jiaxu',
            skills: {
                reluanwu: 'luanwu',
                rewansha: 'wansha',
                reweimu: 'weimu',
            },
        },
        gz_jiaxu: { //贾诩
            name: 'jiaxu',
            skills: {
                luanwu: 'luanwu',
                wansha: 'wansha',
                gzweimu: 'weimu',
            },
        },
        dc_jikang: { //嵇康
            name: 'jikang',
            skills: {
                new_qingxian: 'qingxian',
                dcjuexiang: 'juexiang',
            },
        },
        re_jikang: { //嵇康
            name: 'jikang',
            skills: {
                new_qingxian: 'qingxian',
                new_juexiang: 'juexiang',
            },
        },
        tw_jiling: { //纪灵
            name: 'jiling',
            skills: {
                twshuangren: 'shuangren',
            },
        },
        gz_jiling: { //纪灵
            name: 'jiling',
            skills: {
                shuangren: 'shuangren',
            },
        },
        re_jushou: { //沮授
            name: 'yj_jushou',
            skills: {
                dcjianying: 'jianying',
                dcshibei: 'shibei',
            },
        },
        xin_jushou: { //沮授
            name: 'yj_jushou',
            skills: {
                xinjianying: 'jianying',
                shibei: 'shibei',
                xinjianying_draw: 'jianying',
            },
        },
        re_kanze: { //阚泽
            name: 'kanze',
            skills: {
                xiashu: 'xiashu',
                rekuanshi: 'kuanshi',
            },
        },
        sp_kongrong: { //孔融
            name: 'kongrong',
            skills: {
                xinmingshi: 'zymingshi',
                xinlirang: 'lirang',
            },
        },
        dc_kongrong: { //孔融
            name: 'kongrong',
            skills: {
                dckrmingshi: 'zymingshi',
                lirang: 'lirang',
            },
        },
        std_kongrong: { //孔融
            name: 'kongrong',
            skills: {
                stdlirang: 'lirang',
            },
        },
        gz_kongrong: { //孔融
            name: 'kongrong',
            skills: {
                gz_mingshi: 'zymingshi',
                lirang: 'lirang',
            },
        },
        ol_liaohua: { //廖化
            name: 'liaohua',
            skills: {
                oldangxian: 'dangxian',
                olfuli: 'fuli',
            },
        },
        re_liaohua: { //廖化
            name: 'liaohua',
            skills: {
                xindangxian: 'dangxian',
                xinfuli: 'fuli',
            },
        },
        xin_liaohua: { //廖化
            name: 'liaohua',
            skills: {
                redangxian: 'dangxian',
                refuli: 'fuli',
            },
        },
        gz_liaohua: { //廖化
            name: 'liaohua',
            skills: {
                gzdangxian: 'dangxian',
            },
        },
        re_lidian: { //李典
            name: 'old_re_lidian',
            skills: {
                xunxun: 'xunxun',
                xinwangxi: 'wangxi',
            },
        },
        gz_re_lidian: { //李典
            name: 'old_re_lidian',
            skills: {
                xunxun: 'xunxun',
                wangxi: 'wangxi',
            },
        },
        dc_lifeng: { //李丰
            name: 'lifeng',
            skills: {
                dctunchu: 'tunchu',
                dcshuliang: 'shuliang',
            },
        },
        gz_lifeng: { //李丰
            name: 'lifeng',
            skills: {
                tunchu: 'tunchu',
                shuliang: 'shuliang',
            },
        },
        gz_liqueguosi: { //李傕郭汜
            name: 'liqueguosi',
            skills: {
                gzxiongsuan: 'xiongsuan',
            },
        },
        gz_lingcao: { //凌操
            name: 'lingcao',
            skills: {
                gzdujin: 'dujin',
            },
        },
        old_lingju: { //灵雎
            name: 'lingju',
            skills: {
                jieyuan: 'jieyuan',
                jieyuan_more: 'jieyuan_more',
                jieyuan_less: 'jieyuan_less',
                fenxin_old: 'fenxin',
            },
        },
        old_lingtong: { //凌统
            name: 'lingtong',
            skills: {
                oldxuanfeng: 'xuanfeng',
            },
        },
        ol_lingtong: { //凌统
            name: 'lingtong',
            skills: {
                olxuanfeng: 'xuanfeng',
            },
        },
        xin_lingtong: { //凌统
            name: 'lingtong',
            skills: {
                decadexuanfeng: 'xuanfeng',
                yongjin: 'yongjin', 
            },
        },
        re_lingtong: { //凌统
            name: 'lingtong',
            skills: {
                rexuanfeng: 'xuanfeng',
            },
        },
        gz_lingtong: { //凌统
            name: 'lingtong',
            skills: {
                xuanlve: 'xuanfeng',
                yongjin: 'yongjin', 
            },
        },
        re_liru: { //李儒
            name: 'liru',
            skills: {
                rejuece: 'juece',
                remieji: 'mieji',
                xinfencheng: 'fencheng',
            },
        },
        ol_liru: { //李儒
            name: 'liru',
            skills: {
                oljuece: 'juece',
                olmieji: 'mieji',
                dcfencheng: 'fencheng',
            },
        },
        xin_liru: { //李儒
            name: 'liru',
            skills: {
                xinjuece: 'juece',
                xinmieji: 'mieji',
                xinfencheng: 'fencheng',
            },
        },
        dc_liru: { //李儒
            name: 'liru',
            skills: {
                xinjuece: 'juece',
                dcmieji: 'mieji',
                dcfencheng: 'fencheng',
            },
        },
        gz_ol_lisu: { //李肃
            name: 'ol_lisu',
            skills: {
                qiaoyan: 'qiaoyan',
                xianzhu: 'xianzhu',
            },
        },
        sb_liubei: { //刘备
            name: 'liubei',
            skills: {
                sbrende: 'rende',
                sbjijiang: 'jijiang',
                sbzhangwu: 'sbzhangwu', 
            },
        },
        re_liubei: { //刘备
            name: 'liubei',
            skills: {
                rerende: 'rende',
                rejijiang: 'jijiang',
            },
        },
        oldre_liubiao: { //刘表
            name: 'liubiao',
            skills: {
                zishou: 'rezishou',
                zongshi: 'zongshi',
            },
        },
        old_liubiao: { //刘表
            name: 'liubiao',
            skills: {
                oldzishou: 'rezishou',
                zongshi: 'zongshi',
            },
        },
        std_liubiao: { //刘表
            name: 'liubiao',
            skills: {
                stdzishou: 'rezishou',
                zongshi: 'zongshi',
            },
        },
        ol_liubiao: { //刘表
            name: 'liubiao',
            skills: {
                olzishou: 'rezishou',
                olzongshi: 'zongshi',
            },
        },
        sb_liubiao: { //刘表
            name: 'liubiao',
            skills: {
                sbzishou: 'rezishou',
                sbzongshi: 'zongshi',
            },
        },
        xin_liubiao: { //刘表
            name: 'liubiao',
            skills: {
                decadezishou: 'rezishou',
                decadezongshi: 'zongshi',
            },
        },
        re_liubiao: { //刘表
            name: 'liubiao',
            skills: {
                zishou: 'rezishou',
                rezongshi: 'zongshi',
            },
        },
        std_liuchen: { //刘谌
            name: 'liuchen',
            skills: {
                stdzhanjue: 'zhanjue',
                stdqinwang: 'qinwang',
            },
        },
        re_liuchen: { //刘谌
            name: 'liuchen',
            skills: {
                rezhanjue: 'zhanjue',
                reqinwang: 'qinwang',
            },
        },
        re_liufeng: { //刘封
            name: 'liufeng',
            skills: {
                rexiansi: 'xiansi',
            },
        },
        gz_liuqi: { //刘琦
            name: 'sp_liuqi',
            skills: {
                gzwenji: 'rewenji',
                gztunjiang: 'sptunjiang',
            },
        },
        ol_liushan: { //刘禅
            name: 'liushan',
            skills: {
                xiangle: 'xiangle',
                olfangquan: 'fangquan',
                olruoyu: 'ruoyu',
            },
        },
        re_liushan: { //刘禅
            name: 'liushan',
            skills: {
                xiangle: 'xiangle',
                refangquan: 'fangquan',
                ruoyu: 'ruoyu',
            },
        },
        gz_liushan: { //刘禅
            name: 'liushan',
            skills: {
                xiangle: 'xiangle',
                fangquan: 'fangquan',
                ruoyu: 'ruoyu',
            },
        },
        std_liuxie: { //刘协
            name: 'liuxie',
            skills: {
                stdtianming: 'tianming',
                stdmizhao: 'mizhao',
            },
        },
        jsrg_liuyan: { //刘焉
            name: 'liuyan',
            skills: {
                jsrgtushe: 'xinfu_tushe',
                xinfu_limu: 'xinfu_limu',
            },
        },
        ol_liuyu: { //刘虞
            name: 'liuyu',
            skills: {
                xinzhige: 'zhige',
                xinzongzuo: 'zongzuo',
            },
        },
        re_liuzan: { //留赞
            name: 'liuzan',
            skills: {
                refenyin: 'fenyin',
                liji: 'liji', 
            },
        },
        std_liuzan: { //留赞
            name: 'liuzan',
            skills: {
                std_fenyin: 'fenyin',
            },
        },
        ol_lusu: { //鲁肃
            name: 're_lusu',
            skills: {
                olhaoshi: 'haoshi',
                oldimeng: 'dimeng',
            },
        },
        pot_lusu: { //鲁肃
            name: 're_lusu',
            skills: {
                pothaoshi: 'haoshi',
                potdimeng: 'dimeng',
            },
        },
        gz_re_lusu: { //鲁肃
            name: 're_lusu',
            skills: {
                haoshi: 'haoshi',
                dimeng: 'dimeng',
            },
        },
        sb_luxun: { //陆逊
            name: 'luxun',
            skills: {
                sbqianxun: 'qianxun',
                sblianying: 'lianying',
            },
        },
        re_luxun: { //陆逊
            name: 'luxun',
            skills: {
                reqianxun: 'qianxun',
                relianying: 'lianying',
            },
        },
        gz_luyusheng: { //陆郁生
            name: 'luyusheng',
            skills: {
                fakezhente: 'zhente',
                fakezhiwei: 'zhiwei',
            },
        },
        sb_yl_luzhi: { //卢植
            name: 'yl_luzhi',
            skills: {
                sbmingren: 'nzry_mingren',
                sbzhenliang: 'nzry_zhenliang',
            },
        },
        tw_yl_luzhi: { //卢植
            name: 'yl_luzhi',
            skills: {
                twmingren: 'nzry_mingren',
                twzhenliang: 'nzry_zhenliang',
            },
        },
        re_lvbu: { //吕布
            name: 'lvbu',
            skills: {
                wushuang: 'wushuang',
                new_liyu: 'new_liyu',
            },
        },
        sb_lvbu: { //吕布
            name: 'lvbu',
            skills: {
                sbwushuang: 'wushuang',
                sbliyu: 'new_liyu',
            },
        },
        gz_lvbu: { //吕布
            name: 'lvbu',
            skills: {
                gzwushuang: 'wushuang',
            },
        },
        gz_lvfan: { //吕范
            name: 'lvfan',
            skills: {
                gzdiaodu_backports: 'diaodu',
                gzdiancai: 'diancai',
            },
        },
        gz_lvlingqi: { //吕玲绮
            name: 'lvlingqi',
            skills: {
                guowu: 'guowu',
                gzzhuangrong: 'zhuangrong',
                gzshenwei: 'llqshenwei',
                gzwushuang: 'wushuang',
            },
        },
        lvmeng: { //吕蒙
            name: 're_lvmeng',
            skills: {
                keji: 'keji',
            },
        },
        re_machao: { //马超
            name: 'machao',
            skills: {
                retieji: 'tieji',
            },
        },
        two_dc_sp_machao: { //马超
            name: 'sp_machao',
            skills: {
                dc_olshichou: 'ol_shichou',
            },
        },
        one_dc_sp_machao: { //马超
            name: 'sp_machao',
            skills: {
                onedcspshichou: 'ol_shichou',
            },
        },
        dc_sp_machao: { //马超
            name: 'sp_machao',
            skills: {
                twodcspshichou: 'ol_shichou',
            },
        },
        gz_machao: { //马超
            name: 'machao',
            skills: {
                new_tieji: 'tieji',
            },
        },
        madai: { //马岱
            name: 'old_madai',
            skills: {
                oldqianxi: 'qianxi',
            },
        },
        ol_madai: { //马岱
            name: 'old_madai',
            skills: {
                olqianxi: 'qianxi',
            },
        },
        tw_madai: { //马岱
            name: 'old_madai',
            skills: {
                twqianxi: 'qianxi',
            },
        },
        re_madai: { //马岱
            name: 'old_madai',
            skills: {
                reqianxi: 'qianxi',
            },
        },
        gz_madai: { //马岱
            name: 'old_madai',
            skills: {
                qianxi: 'qianxi',
            },
        },
        old_majun: { //马钧
            name: 'majun',
            skills: {
                xinfu_jingxie: 'xinfu_jingxie',
                xinfu_qiaosi: 'qiaosi',
            },
        },
        ol_maliang: { //马良
            name: 'maliang',
            skills: {
                zishu: 'zishu',
                xinyingyuan: 'yingyuan',
            },
        },
        std_maliang: { //马良
            name: 'old_maliang',
            skills: {
                stdxiemu: 'xiemu',
                stdnaman: 'naman',
            },
        },
        gz_maliang: { //马良
            name: 'old_maliang',
            skills: {
                xiemu: 'xiemu',
                naman: 'naman',
            },
        },
        re_manchong: { //满宠
            name: 'manchong',
            skills: {
                rejunxing: 'junxing',
                yuce: 'yuce',
            },
        },
        xin_masu: { //马谡
            name: 're_masu',
            skills: {
                olsanyao: 'resanyao',
                rezhiman: 'rezhiman',
            },
        },
        gz_masu: { //马谡
            name: 're_masu',
            skills: {
                gzzhiman: 'rezhiman',
            },
        },
        tw_mazhong: { //马忠
            name: 'mazhong',
            skills: {
                twfuman: 'fuman',
            },
        },
        re_mazhong: { //马忠
            name: 'mazhong',
            skills: {
                refuman: 'fuman',
            },
        },
        gz_mazhong: { //马忠
            name: 'mazhong',
            skills: {
                twfuman: 'fuman',
            },
        },
        sb_menghuo: { //孟获
            name: 'menghuo',
            skills: {
                sbhuoshou: 'huoshou',
                sbzaiqi: 'zaiqixx',
            },
        },
        re_menghuo: { //孟获
            name: 'menghuo',
            skills: {
                rehuoshou: 'huoshou',
                rezaiqi: 'zaiqixx',
            },
        },
        dc_sp_menghuo: { //孟获
            name: 'sp_menghuo',
            skills: {
                dcmanwang: 'spmanwang',
                dcpanqin: 'sppanqin',
            },
        },
        jd_sb_menghuo: { //孟获
            name: 'menghuo',
            skills: {
                jdsbhuoshou: 'huoshou',
                jdsbzaiqi: 'zaiqixx',
            },
        },
        gz_menghuo: { //孟获
            name: 'menghuo',
            skills: {
                huoshou: 'huoshou',
                rezaiqi: 'zaiqixx',
            },
        },
        dc_mifuren: { //糜夫人
            name: 'mifuren',
            skills: {
                dcguixiu: 'guixiu',
                dccunsi: 'cunsi',
                dcyongjue: 'yongjue',
            },
        },
        gz_mifuren: { //糜夫人
            name: 'mifuren',
            skills: {
                gzguixiu: 'guixiu',
                gzcunsi: 'cunsi',
                gzyongjue: 'yongjue',
            },
        },
        re_miheng: { //祢衡
            name: 'miheng',
            skills: {
                rekuangcai: 'kuangcai',
                reshejian: 'shejian',
            },
        },
        scl_miheng: { //祢衡
            name: 'miheng',
            skills: {
                scls_kuangcai: 'kuangcai',
                scls_shejian: 'shejian',
            },
        },
        gz_miheng: { //祢衡
            name: 'miheng',
            skills: {
                fakekuangcai: 'kuangcai',
                gzshejian: 'shejian',
            },
        },
        niujin: { //牛金
            name: 'niujin',
            skills: {
                olcuorui: 'olcuorui',
                liewei: 'liewei',
            },
        },
        re_niujin: { //牛金
            name: 'niujin',
            skills: {
                recuorui: 'olcuorui',
                reliewei: 'liewei',
            },
        },
        tw_niujin: { //牛金
            name: 'niujin',
            skills: {
                twcuorui: 'olcuorui',
                teliewei: 'liewei',
            },
        },
        std_panfeng: { //潘凤
            name: 'panfeng',
            skills: {
                stdkuangfu: 'kuangfu',
            },
        },
        re_panfeng: { //潘凤
            name: 'panfeng',
            skills: {
                xinkuangfu: 'kuangfu',
            },
        },
        gz_panfeng: { //潘凤
            name: 'panfeng',
            skills: {
                gzkuangfu: 'kuangfu',
            },
        },
        ol_pangde: { //庞德
            name: 're_pangde',
            skills: {
                rejianchu: 'jianchu',
            },
        },
        sb_pangtong: { //庞统
            name: 'pangtong',
            skills: {
                sblianhuan: 'lianhuan',
                sbniepan: 'oldniepan',
            },
        },
        re_pangtong: { //庞统
            name: 'pangtong',
            skills: {
                xinlianhuan: 'lianhuan',
                niepan: 'oldniepan',
            },
        },
        gz_pangtong: { //庞统
            name: 'pangtong',
            skills: {
                lianhuan: 'lianhuan',
                oldniepan: 'oldniepan',
            },
        },
        gz_re_panshu: { //潘淑
            name: 're_panshu',
            skills: {
                gzyaner: 'yaner',
                zhiren: 'zhiren',
            },
        },
        re_panzhangmazhong: { //潘璋马忠
            name: 'panzhangmazhong',
            skills: {
                reduodao: 'duodao',
                reanjian: 'anjian',
            },
        },
        xin_panzhangmazhong: { //潘璋马忠
            name: 'panzhangmazhong',
            skills: {
                xinduodao: 'duodao',
                xinanjian: 'anjian',
            },
        },
        tw_qiaogong: { //桥公
            name: 'qiaogong',
            skills: {
                twyizhu: 'yizhu',
                twluanchou: 'luanchou',
                twgonghuan: 'gonghuan',
            },
        },
        tw_qiaozhou: { //谯周
            name: 'qiaozhou',
            skills: {
                zhiming: 'zhiming',
                twxingbu: 'xingbu',
            },
        },
        re_quancong: { //全琮
            name: 'quancong',
            skills: {
                xinyaoming: 'yaoming',
            },
        },
        xin_quancong: { //全琮
            name: 'quancong',
            skills: {
                sbyaoming: 'yaoming',
            },
        },
        old_quancong: { //全琮
            name: 'quancong',
            skills: {
                zhenshan: 'yaoming',
            },
        },
        re_quyi: { //麴义
            name: 'quyi',
            skills: {
                refuqi: 'fuqi',
                jiaozi: 'jiaozi',
            },
        },
        std_quyi: { //麴义
            name: 'quyi',
            skills: {
                stdfuqi: 'fuqi',
                stdjiaozi: 'jiaozi',
            },
        },
        gz_shamoke: { //沙摩柯
            name: 'shamoke',
            skills: {
                gzjili: 'gzjili',
            },
        },
        dc_zhaoyun: { //神赵云
            name: 'shen_zhaoyun',
            skills: {
                dclonghun: 'relonghun',
                boss_juejing: 'xinjuejing',
            },
        },
        old_shen_zhaoyun: { //神赵云
            name: 'shen_zhaoyun',
            skills: {
                oldlonghun: 'relonghun',
                oldjuejing: 'xinjuejing',
            },
        },
        boss_zhaoyun: { //神赵云
            name: 'shen_zhaoyun',
            skills: {
                xinlonghun: 'relonghun',
                boss_juejing: 'xinjuejing',
            },
        },
        wn_shen_machao: { //神马超
            name: 'shen_machao',
            skills: {
                wn_qiangshu: 'shouli',
                wn_yuma: 'hengwu',
            },
        },
        ps_shen_machao: { //神马超
            name: 'shen_machao',
            skills: {
                psshouli: 'shouli',
                pshengwu: 'hengwu',
                psshouli_init: 'shouli_init',
            },
        },
        xin_simayi: { //神司马懿
            name: 'shen_simayi',
            skills: {
                xinrenjie: 'renjie',
                xinlianpo: 'lianpo',
                xinbaiyin: 'sbaiyin',
                xinjilve: 'jilue',
                reguicai: 'jilue_guicai',
                fangzhu: 'jilue_fangzhu',
                rejizhi: 'jilue_jizhi',
                rezhiheng: 'jilue_zhiheng',
                rewansha: 'jilue_wansha',
            },
        },
        junk_zhangjiao: { //神张角
            name: 'shen_zhangjiao',
            skills: {
                yizhao: 'yizhao',
                junksijun: 'sijun',
                tianjie: 'tianjie',
            },
        },
        ol_zhangliao: { //神张辽
            name: 'shen_zhangliao',
            skills: {
                olduorui: 'drlt_duorui',
                olzhiti: 'drlt_zhiti',
            },
        },
        old_shixie: { //士燮
            name: 'shixie',
            skills: {
                biluan: 'olbiluan',
                lixia: 'relixia',
            },
        },
        dc_shixie: { //士燮
            name: 'shixie',
            skills: {
                rebiluan: 'olbiluan',
                ollixia: 'relixia',
            },
        },
        gz_shixie: { //士燮
            name: 'shixie',
            skills: {
                gzbiluan: 'olbiluan',
                gzlixia: 'relixia',
            },
        },
        re_simalang: { //司马朗
            name: 'simalang',
            skills: {
                rejunbing: 'junbing',
                requji: 'quji',
            },
        },
        re_simayi: { //司马懿
            name: 'simayi',
            skills: {
                refankui: 'fankui',
                reguicai: 'guicai',
            },
        },
        gz_simayi: { //司马懿
            name: 'simayi',
            skills: {
                fankui: 'fankui',
                guicai: 'guicai',
            },
        },
        jsrg_simazhao: { //司马昭
            name: 'mb_simazhao',
            skills: {
                jsrgdangyi: 'mbdangyi',
                jsrgxiezheng: 'mbxiezheng',
                jsrgzhaoxiong: 'mbzhaoxiong',
                jsrgweisi: 'mbweisi',
                jsrgqiantun: 'mbqiantun', 
            },
        },
        jin_jsrg_simazhao: { //司马昭
            name: 'mb_simazhao',
            skills: {
                jsrgdangyi: 'mbdangyi',
                jsrgxiezheng: 'mbxiezheng',
                jsrgzhaoxiong: 'mbzhaoxiong',
                jsrgweisi: 'mbweisi',
                jsrgqiantun: 'mbqiantun', 
            },
        },
        gz_simazhou: { //司马伷
            name: 'simazhou',
            skills: {
                caiwang: 'recaiwang',
                gznaxiang: 'naxiang',
            },
        },
        gz_xf_sufei: { //苏飞
            name: 'xf_sufei',
            skills: {
                gzlianpian: 'xinfu_lianpian',
            },
        },
        sb_sunce: { //孙策
            name: 'sunce',
            skills: {
                sbjiang: 'jiang',
                sbhunzi: 'hunzi',
                sbzhiba: 'zhiba',
                sbyingzi: 'reyingzi',
                gzyinghun: 'gzyinghun',
            },
        },
        re_sunben: { //孙策
            name: 'sunce',
            skills: {
                jiang: 'jiang',
                rehunzi: 'hunzi',
                zhiba: 'zhiba',
                reyingzi: 'reyingzi',
                gzyinghun: 'gzyinghun',
            },
        },
        re_sunce: { //孙策
            name: 'sunce',
            skills: {
                oljiang: 'jiang',
                olhunzi: 'hunzi',
                olzhiba: 'zhiba',
                reyingzi: 'reyingzi',
                gzyinghun: 'gzyinghun',
            },
        },
        re_sundeng: { //孙登
            name: 'sundeng',
            skills: {
                rekuangbi: 'kuangbi',
            },
        },
        std_sunhao: { //孙浩
            name: 'sunhao',
            skills: {
                stdcanshi: 'recanshi',
                chouhai: 'rechouhai',
                guiming: 'guiming',
            },
        },
        gz_sunjian: { //孙坚
            name: 're_sunjian',
            skills: {
                yinghun: 'gzyinghun',
            },
        },
        xin_sunliang: { //孙亮
            name: 'sunliang',
            skills: {
                xinkuizhu: 'nzry_kuizhu',
                xinzhizheng: 'nzry_zhizheng',
                xinlijun: 'nzry_lijun',
            },
        },
        ol_sunluban: { //孙鲁班
            name: 'sunluban',
            skills: {
                olzenhui: 'chanhui',
                oljiaojin: 'jiaojin',
            },
        },
        re_sunluban: { //孙鲁班
            name: 'sunluban',
            skills: {
                rechanhui: 'chanhui',
                rejiaojin: 'jiaojin',
            },
        },
        xin_sunluban: { //孙鲁班
            name: 'sunluban',
            skills: {
                xinzenhui: 'chanhui',
                xinjiaojin: 'jiaojin',
            },
        },
        tw_sunluban: { //孙鲁班
            name: 'sunluban',
            skills: {
                twzenhui: 'chanhui',
                xinjiaojin: 'jiaojin',
            },
        },
        std_sunluyu: { //孙鲁育
            name: 'sunluyu',
            skills: {
                stdmeibu: 'new_meibu',
                stdmumu: 'new_mumu',
            },
        },
        re_sunluyu: { //孙鲁育
            name: 'sunluyu',
            skills: {
                remeibu: 'new_meibu',
                remumu: 'new_mumu',
                rezhixi: 'new_zhixi',
            },
        },
        mb_sunluyu: { //孙鲁育
            name: 'sunluyu',
            skills: {
                mbmeibu: 'new_meibu',
                mbmumu: 'new_mumu',
                mbzhixi: 'new_zhixi',
            },
        },
        dc_sunquan: { //孙权
            name: 'sunquan',
            skills: {
                dczhiheng: 'zhiheng',
            },
        },
        re_sunquan: { //孙权
            name: 'sunquan',
            skills: {
                rezhiheng: 'zhiheng',
                rejiuyuan: 'jiuyuan',
            },
        },
        gz_sunquan: { //孙权
            name: 'sunquan',
            skills: {
                gzzhiheng: 'zhiheng',
            },
        },
        re_sunshangxiang: { //孙尚香
            name: 'sunshangxiang',
            skills: {
                xiaoji: 'xiaoji',
                rejieyin: 'jieyin',
            },
        },
        gz_sunshangxiang: { //孙尚香
            name: 'sunshangxiang',
            skills: {
                gz_xiaoji: 'xiaoji',
                jieyin: 'jieyin',
            },
        },
        ol_sunxiu: { //孙休
            name: 'sunxiu',
            skills: {
                reyanzhu: 'yanzhu',
                rexingxue: 'xingxue',
                xinzhaofu: 'xinzhaofu',
            },
        },
        re_sunxiu: { //孙休
            name: 'sunxiu',
            skills: {
                reyanzhu: 'yanzhu',
                rexingxue: 'xingxue',
                zhaofu: 'xinzhaofu',
            },
        },
        xin_sunxiu: { //孙休
            name: 'sunxiu',
            skills: {
                mobileyanzhu: 'yanzhu',
                mobilexingxue: 'xingxue',
                zhaofu: 'xinzhaofu',
            },
        },
        std_sunyi: { //孙翊
            name: 'sunyi',
            skills: {
                stdzaoli: 'zaoli',
            },
        },
        tw_sunyi: { //孙翊
            name: 'sunyi',
            skills: {
                tw_zaoli: 'zaoli',
            },
        },
        re_sp_taishici: { //太史慈
            name: 'sp_taishici',
            skills: {
                rejixu: 'xinfu_jixu',
            },
        },
        gz_re_taishici: { //太史慈
            name: 're_taishici',
            skills: {
                tianyi: 'tianyi',
                fakehanzhan: 'hanzhan',
            },
        },
        xf_tangzi: { //唐咨
            name: 'tangzi',
            skills: {
                xinfu_xingzhao: 'xingzhao',
                xz_xunxun: 'xz_xunxun', 
            },
        },
        gz_tangzi: { //唐咨
            name: 'tangzi',
            skills: {
                gzxingzhao: 'xingzhao',
            },
        },
        std_taoqian: { //陶谦
            name: 'taoqian',
            skills: {
                stdyirang: 'yirang',
            },
        },
        re_taoqian: { //陶谦
            name: 'taoqian',
            skills: {
                zhaohuo: 'zhaohuo',
                reyixiang: 'yixiang',
                reyirang: 'yirang',
            },
        },
        dc_tengfanglan: { //滕芳兰
            name: 'tengfanglan',
            skills: {
                dcluochong: 'luochong',
                dcaichen: 'aichen',
            },
        },
        gz_tengyin: { //滕胤
            name: 'tengyin',
            skills: {
                gzchenjian: 'chenjian',
                gzxixiu: 'xixiu',
            },
        },
        gz_wangji: { //王基
            name: 'wangji',
            skills: {
                gzqizhi: 'qizhi',
                gzjinqu: 'jinqu',
            },
        },
        wanglang: { //王朗
            name: 'wanglang',
            skills: {
                regushe: 'regushe',
                rejici: 'rejici',
            },
        },
        old_wanglang: { //王朗
            name: 'wanglang',
            skills: {
                gushe: 'regushe',
                jici: 'rejici',
            },
        },
        std_wanglang: { //王朗
            name: 'wanglang',
            skills: {
                stdgushe: 'regushe',
                stdjici: 'rejici',
            },
        },
        ol_wanglang: { //王朗
            name: 'wanglang',
            skills: {
                gushe: 'regushe',
                olrejici: 'rejici',
            },
        },
        tw_wangling: { //王凌
            name: 'wangling',
            skills: {
                twxingqi: 'xingqi',
                twzifu: 'xinzifu',
                twmibei: 'mibei',
                twmouli: 'xinmouli',
            },
        },
        old_wangyi: { //王异
            name: 'wangyi',
            skills: {
                oldzhenlie: 'zhenlie',
                oldmiji: 'miji',
            },
        },
        ol_wangyi: { //王异
            name: 'wangyi',
            skills: {
                olzhenlie: 'zhenlie',
                olmiji: 'miji',
            },
        },
        re_wangyi: { //王异
            name: 'wangyi',
            skills: {
                zhenlie: 'zhenlie',
                miji: 'miji',
            },
        },
        gz_wangyi: { //王异
            name: 'wangyi',
            skills: {
                zhenlie: 'zhenlie',
                miji: 'miji',
            },
        },
        std_wangyuanji: { //王元姬
            name: 'wangyuanji',
            skills: {
                stdqianchong: 'xinfu_qianchong',
                stdshangjian: 'xinfu_shangjian',
            },
        },
        gz_jin_wangyuanji: { //王元姬
            name: 'jin_wangyuanji',
            skills: {
                fakeshiren: 'shiren',
                fakeyanxi: 'yanxi',
            },
        },
        old_wangyun: { //王允
            name: 'wangyun',
            skills: {
                wylianji: 'xinlianji',
                moucheng: 'xinmoucheng',
                jingong: 'xinjingong',
            },
        },
        re_wangyun: { //王允
            name: 'wangyun',
            skills: {
                relianji: 'xinlianji',
                remoucheng: 'xinmoucheng',
                jingong: 'xinjingong',
            },
        },
        dc_wangyun: { //王允
            name: 'wangyun',
            skills: {
                dclianji: 'xinlianji',
                dcmoucheng: 'xinmoucheng',
                xinjingong: 'xinjingong',
            },
        },
        gz_weiguan: { //卫瓘
            name: 'weiguan',
            skills: {
                zhongyun: 'zhongyun',
                shenpin: 'shenpin',
            },
        },
        re_weiwenzhugezhi: { //卫温诸葛直
            name: 'weiwenzhugezhi',
            skills: {
                refuhai: 'xinfu_fuhai',
            },
        },
        jsrg_weiwenzhugezhi: { //卫温诸葛直
            name: 'weiwenzhugezhi',
            skills: {
                jsrgfuhai: 'xinfu_fuhai',
            },
        },
        re_weiyan: { //魏延
            name: 'weiyan',
            skills: {
                xinkuanggu: 'kuanggu',
                qimou: 'qimou',
            },
        },
        ol_weiyan: { //魏延
            name: 'weiyan',
            skills: {
                xinkuanggu: 'kuanggu',
                reqimou: 'qimou',
            },
        },
        gz_weiyan: { //魏延
            name: 'weiyan',
            skills: {
                gz_kuanggu: 'kuanggu',
            },
        },
        gz_ol_weiyan: { //魏延
            name: 'weiyan',
            skills: {
                xinkuanggu: 'kuanggu',
                reqimou: 'qimou',
            },
        },
        gz_pot_weiyan: { //魏延
            name: 'weiyan',
            skills: {
                gz_new_kuanggu: 'kuanggu',
            },
        },
        re_wenpin: { //文聘
            name: 'wenpin',
            skills: {
                rezhenwei: 'zhenwei',
            },
        },
        xin_wuban: { //吴班
            name: 'wuban',
            skills: {
                xinjintao: 'jintao',
            },
        },
        xin_wuguotai: { //吴国太
            name: 'wuguotai',
            skills: {
                xinganlu: 'ganlu',
                xinbuyi: 'buyi',
            },
        },
        ol_wuguotai: { //吴国太
            name: 'wuguotai',
            skills: {
                olganlu: 'ganlu',
                olbuyi: 'buyi',
            },
        },
        re_wuguotai: { //吴国太
            name: 'wuguotai',
            skills: {
                reganlu: 'ganlu',
                buyi: 'buyi',
            },
        },
        gz_wuguotai: { //吴国太
            name: 'wuguotai',
            skills: {
                ganlu: 'ganlu',
                gzbuyi: 'buyi',
            },
        },
        ol_wujing: { //吴景
            name: 'wujing',
            skills: {
                heji: 'heji',
                olliubing: 'liubing',
            },
        },
        re_wuyi: { //吴懿
            name: 'wuyi',
            skills: {
                xinbenxi: 'olbenxi',
            },
        },
        xin_wuyi: { //吴懿
            name: 'wuyi',
            skills: {
                sbbenxi: 'olbenxi',
            },
        },
        old_wuyi: { //吴懿
            name: 'wuyi',
            skills: {
                benxi: 'olbenxi',
            },
        },
        dc_wuyi: { //吴懿
            name: 'wuyi',
            skills: {
                dcbenxi: 'olbenxi',
            },
        },
        dc_xiahouba: { //夏侯霸
            name: 'xiahouba',
            skills: {
                rebaobian: 'rebaobian',
                olpaoxiao: 'olpaoxiao',
                tiaoxin: 'oltiaoxin',
                xinshensu: 'xinshensu',
            },
        },
        xiahoudun: { //夏侯惇
            name: 'xiahoudun',
            skills: {
                ganglie: 'ganglie',
            },
        },
        re_xiahoudun: { //夏侯惇
            name: 'xiahoudun',
            skills: {
                reganglie: 'ganglie',
                new_qingjian: 'qingjian', 
            },
        },
        xin_xiahoudun: { //夏侯惇
            name: 'xiahoudun',
            skills: {
                reganglie: 'ganglie',
                xinqingjian: 'qingjian', 
            },
        },
        sb_xiahoudun: { //夏侯惇
            name: 'xiahoudun',
            skills: {
                sbganglie: 'ganglie',
                sbqingjian: 'qingjian', 
            },
        },
        re_xiahoushi: { //夏侯氏
            name: 'xiahoushi',
            skills: {
                reqiaoshi: 'qiaoshi',
                reyanyu: 'yanyu',
            },
        },
        sb_xiahoushi: { //夏侯氏
            name: 'xiahoushi',
            skills: {
                sbqiaoshi: 'qiaoshi',
                sbyanyu: 'yanyu',
            },
        },
        gz_xiahouyuan: { //夏侯渊
            name: 'xiahouyuan',
            skills: {
                gz_shensu: 'shensu',
            },
        },
        re_xiahouyuan: { //夏侯渊
            name: 'xiahouyuan',
            skills: {
                xinshensu: 'shensu',
            },
        },
        dc_xiangchong: { //向宠
            name: 'xiangchong',
            skills: {
                dcguying: 'guying',
                dcmuzhen: 'muzhen',
            },
        },
        sb_xiaoqiao: { //小乔
            name: 'xiaoqiao',
            skills: {
                sbtianxiang: 'retianxiang',
                xinhongyan: 'hongyan',
            },
        },
        re_xiaoqiao: { //小乔
            name: 'xiaoqiao',
            skills: {
                retianxiang: 'retianxiang',
                xinhongyan: 'hongyan',
            },
        },
        old_xiaoqiao: { //小乔
            name: 'xiaoqiao',
            skills: {
                tianxiang: 'retianxiang',
                hongyan: 'hongyan',
            },
        },
        gz_xiaoqiao: { //小乔
            name: 'xiaoqiao',
            skills: {
                gz_tianxiang: 'retianxiang',
                gz_hongyan: 'hongyan',
            },
        },
        ol_xiaoqiao: { //小乔
            name: 'xiaoqiao',
            skills: {
                oltianxiang: 'retianxiang',
                olhongyan: 'hongyan',
                piaoling: 'piaoling', 
            },
        },
        sp_xinpi: { //辛毗
            name: 'xinpi',
            skills: {
                spchijie: 'xpchijie',
                spyinju: 'yinju',
            },
        },
        gz_xinxianying: { //辛宪英
            name: 'xinxianying',
            skills: {
                gz_caishi: 'caishi',
            },
        },
        ol_xinxianying: { //辛宪英
            name: 'xinxianying',
            skills: {
                xinzhongjian: 'zhongjian',
                xincaishi: 'caishi',
            },
        },
        re_xinxianying: { //辛宪英
            name: 'xinxianying',
            skills: {
                rezhongjian: 'zhongjian',
                recaishi: 'caishi',
            },
        },
        std_xuezong: { //薛综
            name: 'xuezong',
            skills: {
                stdfunan: 'funan',
                stdxunjie: 'xinjiexun',
            },
        },
        mb_xuezong: { //薛综
            name: 'xuezong',
            skills: {
                mbfunan: 'funan',
                mbjiexun: 'xinjiexun',
            },
        },
        tw_xuezong: { //薛综
            name: 'xuezong',
            skills: {
                funan: 'funan',
                twjiexun: 'xinjiexun',
            },
        },
        re_xugong: { //许贡
            name: 'xugong',
            skills: {
                rebiaozhao: 'biaozhao',
                yechou: 'yechou',
            },
        },
        jsrg_xugong: { //许贡
            name: 'xugong',
            skills: {
                jsrgbiaozhao: 'biaozhao',
                jsrgyechou: 'yechou',
            },
        },
        gz_re_xugong: { //许贡
            name: 'xugong',
            skills: {
                gzbiaozhao: 'biaozhao',
                gzyechou: 'yechou',
            },
        },
        re_xuhuang: { //徐晃
            name: 'xuhuang',
            skills: {
                duanliang: 'gzduanliang',
                jiezi: 'jiezi',
            },
        },
        ol_xuhuang: { //徐晃
            name: 'xuhuang',
            skills: {
                olduanliang: 'gzduanliang',
                oljiezi: 'jiezi',
            },
        },
        gz_xuhuang: { //徐晃
            name: 'xuhuang',
            skills: {
                new_duanliang: 'gzduanliang',
            },
        },
        tw_xunchen: { //荀谌
            name: 'sp_xunchen',
            skills: {
                twweipo: 'mjweipo',
                twmouzhi: 'mjmouzhi',
                mjchenshi: 'mjchenshi', 
            },
        },
        gz_re_xunchen: { //荀谌
            name: 're_xunchen',
            skills: {
                gzfenglve: 'refenglve',
                gzanyong: 'anyong',
            },
        },
        re_xunyou: { //荀攸
            name: 'xunyou',
            skills: {
                reqice: 'qice',
                rezhiyu: 'zhiyu',
            },
        },
        ol_xunyu: { //荀彧
            name: 'xunyu',
            skills: {
                quhu: 'quhu',
                oljieming: 'jieming',
            },
        },
        sb_xunyu: { //荀彧
            name: 'xunyu',
            skills: {
                sbquhu: 'quhu',
                sbjieming: 'jieming',
            },
        },
        re_xunyu: { //荀彧
            name: 'xunyu',
            skills: {
                quhu: 'quhu',
                rejieming: 'jieming',
            },
        },
        gz_xunyu: { //荀彧
            name: 'xunyu',
            skills: {
                quhu: 'quhu',
                gzjieming: 'jieming',
            },
        },
        gz_xurong: { //徐荣
            name: 'xurong',
            skills: {
                gzxionghuo: 'xinfu_xionghuo',
            },
        },
        jsrg_xushao: { //许劭
            name: 'xushao',
            skills: {
                sbpingjian: 'pingjian',
            },
        },
        xin_xusheng: { //徐盛
            name: 'xusheng',
            skills: {
                decadepojun: 'xinpojun',
            },
        },
        old_xusheng: { //徐盛
            name: 'xusheng',
            skills: {
                pojun: 'xinpojun',
            },
        },
        re_xusheng: { //徐盛
            name: 'xusheng',
            skills: {
                repojun: 'xinpojun',
            },
        },
        drag_xusheng: { //徐盛
            name: 'xusheng',
            skills: {
                dragpojun: 'xinpojun',
            },
        },
        gz_re_xusheng: { //徐盛
            name: 'xusheng',
            skills: {
                repojun: 'xinpojun',
            },
        },
        xin_xushu: { //徐庶
            name: 'xushu',
            skills: {
                xinwuyan: 'xswuyan',
                xinjujian: 'jujian',
            },
        },
        dc_xushu: { //徐庶
            name: 're_xushu',
            skills: {
                rezhuhai: 'zhuhai',
                rejianyan: 'jianyan',
                xsqianxin: 'qianxin', 
            },
        },
        std_xushu: { //徐庶
            name: 'xushu',
            skills: {
                stdwuyan: 'xswuyan',
                stdjujian: 'jujian',
            },
        },
        junk_xuyou: { //许攸
            name: 'xuyou',
            skills: {
                nzry_chenglve: 'nzry_chenglve',
                junkshicai: 'nzry_shicai',
                nzry_cunmu: 'nzry_cunmu',
            },
        },
        gz_xuyou: { //许攸
            name: 'xuyou',
            skills: {
                gzchenglve: 'nzry_chenglve',
                gzshicai: 'nzry_shicai',
            },
        },
        gz_re_xuzhu: { //许褚
            name: 'xuzhu',
            skills: {
                new_reluoyi: 'luoyi',
            },
        },
        re_xuzhu: { //许褚
            name: 'xuzhu',
            skills: {
                new_reluoyi: 'luoyi',
            },
        },
        gz_xuzhu: { //许褚
            name: 'xuzhu',
            skills: {
                gz_luoyi: 'luoyi',
            },
        },
        gz_yanbaihu: { //严虎
            name: 'yanbaihu',
            skills: {
                gzzhidao: 'zhidao',
                gzyjili: 'jili',
            },
        },
        std_yangbiao: { //杨彪
            name: 'yangbiao',
            skills: {
                stdrangjie: 'rangjie',
                stdyizheng: 'yizheng',
            },
        },
        gz_yangwan: { //杨婉
            name: 'yangwan',
            skills: {
                gzyouyan: 'youyan',
                gzzhuihuan: 'zhuihuan',
            },
        },
        gz_yangxiu: { //杨修
            name: 'yangxiu',
            skills: {
                gzjilei: 'jilei',
                gzdanlao: 'danlao',
            },
        },
        old_yangyan: { //杨艳
            name: 'yangyan',
            skills: {
                xuanbei: 'xinxuanbei',
                xianwan: 'xianwan',
            },
        },
        gz_yangyan: { //杨艳
            name: 'yangyan',
            skills: {
                gzxuanbei: 'xinxuanbei',
                xianwan: 'xianwan',
            },
        },
        tw_yangyi: { //杨仪
            name: 'yangyi',
            skills: {
                duoduan: 'duoduan',
                twgongsun: 'gongsun',
            },
        },
        ol_yanwen: { //颜良文丑
            name: 'yanwen',
            skills: {
                olshuangxiong: 'shuangxiong',
            },
        },
        re_yanwen: { //颜良文丑
            name: 'yanwen',
            skills: {
                reshuangxiong: 'shuangxiong',
            },
        },
        gz_ol_yanwen: { //颜良文丑
            name: 'yanwen',
            skills: {
                olshuangxiong: 'shuangxiong',
            },
        },
        gz_yanwen: { //颜良文丑
            name: 'yanwen',
            skills: {
                gz_shuangxiong: 'shuangxiong',
            },
        },
        tw_yanxiang: { //阎象
            name: 'yanxiang',
            skills: {
                twkujian: 'kujian',
                twruilian: 'ruilian',
            },
        },
        ol_yuanshao: { //袁绍
            name: 're_yuanshao',
            skills: {
                olluanji: 'luanji',
                olxueyi: 'xueyi',
            },
        },
        sb_yuanshao: { //袁绍
            name: 're_yuanshao',
            skills: {
                sbluanji: 'luanji',
                sbxueyi: 'xueyi',
            },
        },
        xin_yuanshao: { //袁绍
            name: 're_yuanshao',
            skills: {
                reluanji: 'luanji',
                xueyi: 'xueyi',
            },
        },
        gz_re_yuanshao: { //袁绍
            name: 're_yuanshao',
            skills: {
                gz_luanji: 'luanji',
            },
        },
        ol_yuanshu: { //袁术
            name: 're_yuanshu',
            skills: {
                rewangzun: 'wangzun',
                retongji: 'tongji',
            },
        },
        yl_yuanshu: { //袁术
            name: 'yuanshu',
            skills: {
                drlt_yongsi: 'yongsi',
                drlt_weidi: 'weidi',
            },
        },
        gz_yuanshu: { //袁术
            name: 'yuanshu',
            skills: {
                gzyongsi: 'yongsi',
                gzweidi: 'weidi',
            },
        },
        old_yuanshu: { //袁术
            name: 'yuanshu',
            skills: {
                xinyongsi: 'yongsi',
                yjixi: 'weidi',
                rewangzun: 'wangzun',
            },
        },
        gz_yl_yuanshu: { //袁术
            name: 'yuanshu',
            skills: {
                gz_new_yongsi: 'yongsi',
                gz_new_weidi: 'weidi',
            },
        },
        yuantanyuanxiyuanshang: { //袁谭袁熙袁尚
            name: 'yuantanyuanshang',
            skills: {
                dcneifa: 'neifa',
            },
        },
        ol_yufan: { //虞翻
            name: 'yufan',
            skills: {
                olzongxuan: 'zongxuan',
                olzhiyan: 'zhiyan',
            },
        },
        xin_yufan: { //虞翻
            name: 'yufan',
            skills: {
                xinzongxuan: 'zongxuan',
                xinzhiyan: 'zhiyan',
            },
        },
        re_yufan: { //虞翻
            name: 'yufan',
            skills: {
                rezongxuan: 'zongxuan',
                zhiyan: 'zhiyan',
            },
        },
        std_yufan: { //虞翻
            name: 'yufan',
            skills: {
                stdzongxuan: 'zongxuan',
                stdzhiyan: 'zhiyan',
            },
        },
        yuji: { //于吉
            name: 're_yuji',
            skills: {
                old_guhuo: 'xinfu_guhuo',
            },
        },
        xin_yuji: { //于吉
            name: 're_yuji',
            skills: {
                reguhuo: 'xinfu_guhuo',
                rechanyuan: 'chanyuan',
            },
        },
        old_zhangbao: { //张宝
            name: 'zhangbao',
            skills: {
                old_zhoufu: 'rezhoufu',
                old_yingbing: 'reyingbing',
            },
        },
        re_zhangbao: { //张宝
            name: 'zhangbao',
            skills: {
                xinzhoufu: 'rezhoufu',
                xinyingbing: 'reyingbing',
            },
        },
        ol_zhangchangpu: { //张昌蒲
            name: 'zhangchangpu',
            skills: {
                yanjiao: 'yanjiao',
                olxingshen: 'xingshen',
            },
        },
        ol_zhangchunhua: { //张春华
            name: 'zhangchunhua',
            skills: {
                jueqing: 'jueqing',
                shangshi: 'shangshi',
                oljianmie: 'oljianmie',
            },
        },
        re_zhangchunhua: { //张春华
            name: 'zhangchunhua',
            skills: {
                rejueqing: 'jueqing',
                shangshi: 'shangshi',
            },
        },
        xin_zhangfei: { //张飞
            name: 're_zhangfei',
            skills: {
                new_repaoxiao: 'olpaoxiao',
                liyong: 'oltishen',
            },
        },
        old_zhangfei: { //张飞
            name: 're_zhangfei',
            skills: {
                new_repaoxiao: 'olpaoxiao',
                new_tishen: 'oltishen',
            },
        },
        gz_zhangfei: { //张飞
            name: 'zhangfei',
            skills: {
                gz_paoxiao: 'paoxiao',
            },
        },
        re_zhanghe: { //张郃
            name: 'zhanghe',
            skills: {
                reqiaobian: 'qiaobian',
            },
        },
        sb_zhanghe: { //张郃
            name: 'zhanghe',
            skills: {
                sbqiaobian: 'qiaobian',
            },
        },
        tw_yj_zhanghe: { //张郃
            name: 'yj_zhanghe',
            skills: {
                zhilve: 'xinzhilve',
            },
        },
        gz_zhanghe: { //张郃
            name: 'zhanghe',
            skills: {
                gz_qiaobian: 'qiaobian',
            },
        },
        gz_yj_zhanghe: { //张郃
            name: 'yj_zhanghe',
            skills: {
                gz_zhilve: 'xinzhilve',
            },
        },
        re_zhangjiao: { //张角
            name: 'zhangjiao',
            skills: {
                xinleiji: 'leiji',
                xinguidao: 'guidao',
                xinhuangtian: 'huangtian',
            },
        },
        sb_zhangjiao: { //张角
            name: 'zhangjiao',
            skills: {
                sbleiji: 'leiji',
                sbguidao: 'guidao',
                sbhuangtian: 'huangtian',
            },
        },
        sp_zhangjiao: { //张角
            name: 'zhangjiao',
            skills: {
                releiji: 'leiji',
                guidao: 'guidao',
                huangtian: 'huangtian',
            },
        },
        gz_re_zhangjiao: { //张角
            name: 'zhangjiao',
            skills: {
                xinleiji: 'leiji',
                xinguidao: 'guidao',
            },
        },
        gz_zhangjiao: { //张角
            name: 'zhangjiao',
            skills: {
                leiji: 'leiji',
                guidao: 'guidao',
            },
        },
        re_zhangliang: { //张梁
            name: 'zhangliang',
            skills: {
                xinfu_jijun: 'old_jijun',
                xinfu_fangtong: 'old_fangtong',
            },
        },
        xin_zhangliang: { //张梁
            name: 'zhangliang',
            skills: {
                rejijun: 'old_jijun',
                refangtong: 'old_fangtong',
            },
        },
        re_zhangliao: { //张辽
            name: 'zhangliao',
            skills: {
                new_retuxi: 'tuxi',
            },
        },
        gz_zhangliao: { //张辽
            name: 'zhangliao',
            skills: {
                gz_tuxi: 'tuxi',
            },
        },
        x_dc_zhangqiying: { //张琪瑛
            name: 'zhangqiying',
            skills: {
                x_dc_falu: 'xinfu_falu',
                x_dc_dianhua: 'xinfu_dianhua',
                x_dc_zhenyi: 'zhenyi',
            },
        },
        y_dc_zhangqiying: { //张琪瑛
            name: 'zhangqiying',
            skills: {
                y_dc_falu: 'xinfu_falu',
                y_dc_dianhua: 'xinfu_dianhua',
                y_dc_zhenyi: 'zhenyi',
            },
        },
        re_zhangsong: { //张松
            name: 'zhangsong',
            skills: {
                qiangzhi: 'qiangzhi',
                rexiantu: 'xiantu',
            },
        },
        gz_zhangsong: { //张松
            name: 'zhangsong',
            skills: {
                qiangzhi: 'qiangzhi',
                xiantu: 'xiantu',
            },
        },
        old_zhangxingcai: { //张星彩
            name: 'zhangxingcai',
            skills: {
                oldshenxian: 'shenxian',
                qiangwu: 'qiangwu',
            },
        },
        gz_zhangxingcai: { //张星彩
            name: 'zhangxingcai',
            skills: {
                shenxian: 'shenxian',
                gz_qiangwu: 'qiangwu',
            },
        },
        gz_zhangxiu: { //张绣
            name: 'zhangxiu',
            skills: {
                gzcongjian: 'drlt_congjian',
                gzfudi: 'gzfudi',
            },
        },
        re_zhangyi: { //张嶷
            name: 'zhangyi',
            skills: {
                rewurong: 'wurong',
                reshizhi: 'shizhi',
            },
        },
        xin_zhangyi: { //张嶷
            name: 'zhangyi',
            skills: {
                xinwurong: 'wurong',
                shizhi: 'shizhi',
            },
        },
        old_zhangyì: { //张翼
            name: 'zhangyì',
            skills: {
                zhiyi: 'rezhiyi',
            },
        },
        std_zhangyì: { //张翼
            name: 'zhangyì',
            skills: {
                stdzhiyi: 'rezhiyi',
            },
        },
        ol_zhangzhang: { //张昭张纮
            name: 'zhangzhang',
            skills: {
                olzhijian: 'zhijian',
                olguzheng: 'guzheng',
            },
        },
        re_zhangzhang: { //张昭张纮
            name: 'zhangzhang',
            skills: {
                rezhijian: 'zhijian',
                guzheng: 'guzheng',
            },
        },
        gz_zhangzhang: { //张昭张纮
            name: 'zhangzhang',
            skills: {
                zhijian: 'zhijian',
                guzheng: 'guzheng',
            },
        },
        dc_zhaoxiang: { //赵襄
            name: 'zhaoxiang',
            skills: {
                refanghun: 'fanghun',
                refuhan: 'fuhan',
            },
        },
        gz_zhaoyun: { //赵云
            name: 're_zhaoyun',
            skills: {
                gz_longdan: 'longdan',
            },
        },
        old_zhaoyun: { //赵云
            name: 're_zhaoyun',
            skills: {
                longdan: 'ollongdan',
                new_yajiao: 'olyajiao',
            },
        },
        jsrg_zhaoyun: { //赵云
            name: 'ol_jsrg_zhaoyun',
            skills: {
                jsrglonglin: 'ollonglin',
                jsrgzhendan: 'olzhendan',
            },
        },
        re_zhenji: { //甄姬
            name: 'zhenji',
            skills: {
                reluoshen: 'luoshen',
                qingguo: 'qingguo',
            },
        },
        sb_zhenji: { //甄姬
            name: 'zhenji',
            skills: {
                sbluoshen: 'luoshen',
                qingguo: 'qingguo',
            },
        },
        xin_zhonghui: { //钟会
            name: 'zhonghui',
            skills: {
                xinquanji: 'quanji',
                xinzili: 'zili',
                xinpaiyi: 'paiyi',
            },
        },
        re_zhonghui: { //钟会
            name: 'zhonghui',
            skills: {
                requanji: 'quanji',
                zili: 'zili',
                paiyi: 'paiyi',
            },
        },
        gz_zhonghui: { //钟会
            name: 'zhonghui',
            skills: {
                fakequanji: 'quanji',
                fakepaiyi: 'paiyi',
            },
        },
        re_zhongyao: { //钟繇
            name: 'zhongyao',
            skills: {
                rehuomo: 'huomo',
                zuoding: 'zuoding',
            },
        },
        re_zhoucang: { //周仓
            name: 'zhoucang',
            skills: {
                rezhongyong: 'xinzhongyong',
            },
        },
        xin_zhoucang: { //周仓
            name: 'zhoucang',
            skills: {
                mobilezhongyong: 'xinzhongyong',
            },
        },
        xin_zhoutai: { //周泰
            name: 'zhoutai',
            skills: {
                buqu: 'buqu',
                new_fenji: 'fenji',
            },
        },
        old_zhoutai: { //周泰
            name: 'zhoutai',
            skills: {
                gzbuqu: 'buqu',
            },
        },
        gz_zhoutai: { //周泰
            name: 'zhoutai',
            skills: {
                buqu: 'buqu',
                new_fenji: 'fenji',
            },
        },
        re_zhouyu: { //周瑜
            name: 'zhouyu',
            skills: {
                reyingzi: 'yingzi',
                refanjian: 'fanjian',
            },
        },
        sb_zhouyu: { //周瑜
            name: 'zhouyu',
            skills: {
                sbyingzi: 'yingzi',
                sbfanjian: 'fanjian',
            },
        },
        re_zhugedan: { //诸葛诞
            name: 'zhugedan',
            skills: {
                regongao: 'gongao',
                rejuyi: 'juyi',
                benghuai: 'benghuai',
                reweizhong: 'weizhong',
            },
        },
        gz_zhugedan: { //诸葛诞
            name: 'zhugedan',
            skills: {
                gz_gongao: 'gongao',
            },
        },
        tw_zhugeguo: { //诸葛果
            name: 'zhugeguo',
            skills: {
                twqirang: 'qirang',
                twyuhua: 'yuhua',
            },
        },
        sb_zhugejin: { //诸葛瑾
            name: 'zhugejin',
            skills: {
                sbhuanshi: 'huanshi',
                sbhongyuan: 'olhongyuan',
                sbmingzhe: 'olmingzhe',
            },
        },
        re_zhugeliang: { //诸葛亮
            name: 'zhugeliang',
            skills: {
                reguanxing: 'guanxing',
                kongcheng: 'kongcheng',
            },
        },
        gz_zhugeliang: { //诸葛亮
            name: 'zhugeliang',
            skills: {
                guanxing: 'guanxing',
                gz_kongcheng: 'kongcheng',
            },
        },
        re_sp_zhugeliang: { //诸葛亮
            name: 'sp_zhugeliang',
            skills: {
                bazhen: 'bazhen',
                rehuoji: 'huoji',
                rekanpo: 'kanpo',
            },
        },
        sb_sp_zhugeliang: { //诸葛亮
            name: 'sp_zhugeliang',
            skills: {
                sbhuoji: 'huoji',
                sbkanpo: 'kanpo',
            },
        },
        gz_sp_zhugeliang: { //诸葛亮
            name: 'sp_zhugeliang',
            skills: {
                bazhen: 'bazhen',
                huoji: 'huoji',
                kanpo: 'kanpo',
            },
        },
        old_zhugezhan: { //诸葛瞻
            name: 'zhugezhan',
            skills: {
                old_zuilun: 'xinfu_zuilun',
                old_fuyin: 'xinfu_fuyin',
            },
        },
        re_zhuhuan: { //朱桓
            name: 'zhuhuan',
            skills: {
                refenli: 'fenli',
                repingkou: 'pingkou',
            },
        },
        xin_zhuhuan: { //朱桓
            name: 'zhuhuan',
            skills: {
                fenli: 'fenli',
                xinpingkou: 'pingkou',
            },
        },
        dc_zhuling: { //朱灵
            name: 'zhuling',
            skills: {
                dczhanyi: 'xinzhanyi',
            },
        },
        re_zhuran: { //朱然
            name: 'zhuran',
            skills: {
                xindanshou: 'danshou',
            },
        },
        xin_zhuran: { //朱然
            name: 'zhuran',
            skills: {
                mobiledanshou: 'danshou',
            },
        },
        old_zhuran: { //朱然
            name: 'zhuran',
            skills: {
                olddanshou: 'danshou',
            },
        },
        gz_xin_zhuran: { //朱然
            name: 'zhuran',
            skills: {
                fakedanshou: 'danshou',
            },
        },
        re_zhurong: { //祝融
            name: 'zhurong',
            skills: {
                juxiang: 'juxiang',
                relieren: 'lieren',
            },
        },
        sb_zhurong: { //祝融
            name: 'zhurong',
            skills: {
                sbjuxiang: 'juxiang',
                sblieren: 'lieren',
            },
        },
        ol_zhurong: { //祝融
            name: 'zhurong',
            skills: {
                juxiang: 'juxiang',
                lieren: 'lieren',
                changbiao: 'changbiao',
            },
        },
        gz_zhurong: { //祝融
            name: 'zhurong',
            skills: {
                juxiang: 'juxiang',
                lieren: 'lieren',
            },
        },
        zhuzhi: { //朱治
            name: 'zhuzhi',
            skills: {
                anguo: 'xinanguo',
            },
        },
        xin_zhuzhi: { //朱治
            name: 'zhuzhi',
            skills: {
                sbanguo: 'xinanguo',
            },
        },
        re_zhuzhi: { //朱治
            name: 'zhuzhi',
            skills: {
                reanguo: 'xinanguo',
            },
        },
        old_zhuzhi: { //朱治
            name: 'zhuzhi',
            skills: {
                anguo: 'xinanguo',
            },
        },
        tw_zhuzhi: { //朱治
            name: 'zhuzhi',
            skills: {
                twanguo: 'xinanguo',
            },
        },
        tw_zongyu: { //宗预
            name: 'sp_zongyu',
            skills: {
                twzhibian: 'zhibian',
                twyuyan: 'yuyan',
            },
        },
        std_zoushi: { //邹氏
            name: 'zoushi',
            skills: {
                stdhuoshui: 'huoshui',
                stdqingcheng: 'qingcheng',
            },
        },
        re_zoushi: { //邹氏
            name: 'zoushi',
            skills: {
                rehuoshui: 'huoshui',
                reqingcheng: 'qingcheng',
            },
        },
        gz_zoushi: { //邹氏
            name: 'zoushi',
            skills: {
                gz_huoshui: 'huoshui',
                gz_qingcheng: 'qingcheng',
            },
        },
        old_zuoci: { //左慈
            name: 'zuoci',
            skills: {
                gz_huashen: 'huashen',
                gz_xinsheng: 'xinsheng',
            },
        },
        re_zuoci: { //左慈
            name: 'zuoci',
            skills: {
                rehuashen: 'huashen',
                rexinsheng: 'xinsheng',
            },
        },
    }
});