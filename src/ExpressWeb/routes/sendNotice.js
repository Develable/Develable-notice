const express = require('express');
const router = express.Router();

const Discord = require('discord.js');
const dscl = new Discord.Client();

const store = require('store');

const settings = require('./../../settings.json');

router.post('/', async (req, res) => {
    try {
        dscl.login(`${req.body.botToken}`).then(() => {
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
                                if (req.body.embedCheck == 'on') {
                                    let noticeEmbed = new Discord.RichEmbed()
                                        .setColor(settings.embedColor)
                                        .setTitle(`${dscl.user.username} 전체공지`)
                                        .addField('이 봇이 참여된 모든 서버의 공지 채널에 발송되는 공지입니다.', req.body.sendMessage)
                                        .setFooter(`발신자 : ${store.get('userTag')}\n© 2018-2020 화향, Tilto of Develable.`, store.get('userPIURL'));
                                    channel.send(noticeEmbed);
                                } else {
                                    channel.send(req.body.sendMessage);
                                }
                                noticesend = true;
                                break;
                            }
                        }
                        if (noticesend) break;
                    }
                    if (noticesend) break;
                }
            }
        }).then(() => {
            dscl.destroy();
            store.set('sendResult', 'okay');
            res.redirect('/result');
        });
    } catch (err) {
        store.set('sendResult', 'fail');
        res.redirect('/result');
    }
});

module.exports = router;
