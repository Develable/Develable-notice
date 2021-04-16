const express = require('express');
const router = express.Router();

const Discord = require('discord.js');
const dscl = new Discord.Client();

const settings = require('./../../../settings.json');

router.post('/', async (req, res) => {
    if (req.body.APIPW != settings.APIPW) {
        let result = {
            status: "fail",
            error: 'permission denied',
            message: req.body.message
        };
        res.send(result.toString());
        return;
    }
    try {
        dscl.login(`${req.body.token}`).then(() => {
            let guilds = dscl.guilds;
            for (const guild of guilds) {
                let channels = guild[1].channels;
                let noticesend = false;
                for (const imsichannel of channels) {
                    let channel = imsichannel[1];
                    for (const okword of settings.allow_keywords) {
                        if (channel.name.indexOf(okword) != -1) {
                            for (const noword of settings.warn_keywords) {
                                if (channel.name.indexOf(noword) != -1) break;
                                if (req.body.embed == 'true') {
                                    let noticeEmbed = new Discord.RichEmbed()
                                        .setColor(settings.embedColor)
                                        .setTitle(`${dscl.user.username} 전체공지`)
                                        .addField('이 봇이 참여된 모든 서버의 공지 채널에 발송되는 공지입니다.', req.body.message)
                                        .setFooter(`발신자 : ${req.body.userTag}\n© 2018-2020 화향, Tilto of Develable.`, req.body.userProfileURL);
                                    channel.send(noticeEmbed);
                                    noticesend = true;
                                    break;
                                } else {
                                    channel.send(req.body.message);
                                    noticesend = true;
                                    break;
                                }
                            }
                        }
                        if (noticesend) break;
                    }
                    if (noticesend) break;
                }
            }
        }).then(() => { // success
            let result = {
                status: "success",
                user: `${dscl.user.username}#${dscl.user.discriminator} (${dscl.user.id})`,
                message: req.body.message
            }; // 여기에 적으면 내가 변환할게
            dscl.destroy();
            res.send(result.toString());
        });
    } catch (err) { // fail
        let result = {
            status: "fail",
            error: err,
            message: req.body.message
        };
        res.send(result.toString());
    }
});

module.exports = router;
