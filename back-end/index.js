const api_key = '{{Mailgun_Api_Key}}'
const domain = '{{Mailgun_Domain}}'
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain})
const templete = require('fs').readFileSync('./templete.html').toString()
const express = require('express')
const helmet = require('helmet')
const request = require('request-promise')
const btoa = require('btoa')
const redis = require("redis")
const bodyParser = require('body-parser')
const discord = require('discord.js')
const logger = require('morgan')

const DISCORD = {
  CLIENT_ID: '{{Discord_App_Client_Id}}',
  CLIENT_SECRET: '{{Discord_App_Client_Password}}',
  REDIRECT_URI: '{{Redirect_Uri}}',
  BOT_TOKEN: '{{Discord_App_Bot_Token}}',
  GUILD_ID: '{{Discrod_Guild_Id}}',
  ROLE_ID: '{{Discrod_Guild_Role_Id}}',
  CHANNEL_ID: '{{Discord_Channel_Id}}'
}

const RedisClient1 = redis.createClient()
const RedisClient2 = redis.createClient()
const DiscordClient = new discord.Client()
RedisClient1.select(1)
RedisClient2.select(2)
function sendMail(email, code, purpose) {
  return new Promise((resolve, reject) => {
    const data = {
      from: '끄투코리아 인증 시스템 <auth@kkutu.co.kr>',
      to: email,
      subject: '[끄투코리아] ' + purpose + ' 위한 인증코드가 발급되었습니다. ',
      html: templete.replace('[[CODE]]', code).replace('[[PURPOSE]]', purpose)
    }

    mailgun.messages().send(data, (err, body) => {
      if(err) reject(err)
      resolve(body)
    })
  })
}

function makeCode(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

var KKuTuKoreaDiscord
DiscordClient.on('ready', () => {
  console.log(`Logged in as ${DiscordClient.user.tag}!`)
  KKuTuKoreaDiscord = DiscordClient.guilds.find('id', DISCORD.GUILD_ID)
});

DiscordClient.on('message', msg => {
})
DiscordClient.login(DISCORD.BOT_TOKEN)

const app = express()

const options = {}

options.key = fs.readFileSync('./privatekey.pem')
options.cert = fs.readFileSync('./certificate.pem')
options.ca = fs.readFileSync('./ca.pem')

const httpsServer = https.createServer(options, app)

app.use(logger('dev', {skip: () => {return true}}))
app.use(bodyParser.json())
app.use(helmet())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://auth.kkutu.co.kr')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})
app.get('/discord', (req, res) => {
  const naver_id = req.query.id
  const purpose = '끄투코리아 공식 디스코드 이용을'
  const code = makeCode(6)
  if(!naver_id) return res.sendStatus(400)
  if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/.test(naver_id))) return res.sendStatus(400)
  RedisClient1.set(naver_id, code, 'EX', 60 * 5)
  sendMail(naver_id+'@naver.com', code, purpose)
    .then(body => res.send({code: 200, msg: 'success'}))
    .catch(err => res.status(500).send({code: 500, msg: 'Error occurred during send email.'}))
})
app.post('/discord', (req, res) => {
  const naver_id = req.query.id
  const discord_id = req.body.discord_id
  RedisClient1.get(naver_id, (err, reply) => {
    if(err) return res.status(400).send({code: 400, msg: 'Error occured during verify code.'})
    if(req.body.code === reply){
      RedisClient1.del(naver_id)
      RedisClient2.set(discord_id, JSON.stringify({username: req.body.discord_name, naver_id: naver_id}))
      KKuTuKoreaDiscord.members.find('id', discord_id).addRole(DISCORD.ROLE_ID)
      KKuTuKoreaDiscord.channels.find('id', DISCORD.CHANNEL_ID).send(`<@${discord_id}> ${naver_id} ${discord_id} ${discord_name}`)
      return res.status(200).send({code: 200, msg: 'success'})
    }
    else return res.status(400).send({code: 400, msg: 'The verification code is invalid.'})
  })
})
app.get('/authorizediscord', (req, res) => {
  request({
    method: 'POST',
    url: `https://discordapp.com/api/v6/oauth2/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=${DISCORD.REDIRECT_URI}&scope=identify guilds.join connections`,
    headers: {
      Authorization: `Basic ${btoa(`${DISCORD.CLIENT_ID}:${DISCORD.CLIENT_SECRET}`)}`
    }
  })
  .then(body => {
    body = JSON.parse(body)
    request({
      method: 'GET',
      url: 'https://discordapp.com/api/users/@me',
      headers: {
        Authorization: `${body.token_type} ${body.access_token}`
      }
    })
    .then(user => {
      user = JSON.parse(user)
      request({
        method: 'PUT',
        url: `https://discordapp.com/api/guilds/${DISCORD.GUILD_ID}/members/${user.id}`,
        headers: {
          Authorization: `Bot ${DISCORD.BOT_TOKEN}`
        },
        json: true,
        body: {
          access_token: body.access_token
        }
      }).then(data => {
        res.redirect(`https://auth.kkutu.co.kr/#/?discordID=${user.id}&discordAvatar=${user.avatar}&discordName=${user.username+'%23'+user.discriminator}`)
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
  })
  .catch(err => {
    res.status(500).send(err)
  })
})

app.listen(81)
httpsServer.listen(444)
// sendMail('hjchokj@naver.com', 'Q1W2E3R4', '끄투코리아 공식 디스코드 이용을')
