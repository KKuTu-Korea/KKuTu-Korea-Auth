<template>
  <div class="">
    <h3>끄투코리아 공식 디스코드 인증</h3>
    <br>
    <div>
      <img :src="discordAvatar" style="border-radius: 50%;">
      <div>{{discordName}}</div>
    </div>
    <button @click="discordLogin()" v-if="!isDiscordLogined">디스코드 로그인</button><br>
    <div v-if="isDiscordLogined">
      <input v-model="id" placeholder="네이버 아이디">
      <button @click="sendCode()" :disabled="isSentEmail">인증코드 전송{{sendTime?'('+sendTime+'초)':''}}</button>
    </div>
    <div v-if="isDiscordLogined" style="margin-top: 0.5rem;">
      <input v-model="code" placeholder="인증코드">
      <button @click="verifyCode()">인증코드 확인</button>
    </div>
    <div>{{msg}}</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      code: '',
      msg: '',

      avatar: 'https://cdn.discordapp.com/avatars/user_id/user_avatar.png',
      discordID: '',
      discordName: '',
      discordAvatar: '',

      isDiscordLogined: false,
      isSentEmail: false,

      sendInterval: -1,
      sendTime: 0
    }
  },
  methods: {
    discordLogin () {
      location.href='https://discordapp.com/oauth2/authorize?response_type=code&client_id={{Discord_Client_Id}}&scope=identify%20guilds.join&redirect_uri={{Redirect_Uri}}'
    },
    sendCode () {
      this.axios.get(`{{Backend_Url}}/discord?id=${this.id}`).then(res => {
        this.msg = ''
        this.isSentEmail = true
        this.sendTime = 30
        this.sendInterval = setInterval(() => this.sendTime -= 1, 1000)
        setTimeout(() => {this.isSentEmail = false, clearInterval(this.sendInterval), this.sendTime = 0}, 30000)
      }).catch(err => {
        this.msg = err.response.data.msg
      })
    },
    verifyCode () {
      this.axios.post(`{{Backend_Url}}/discord?id=${this.id}`, {code: this.code,discord_id: this.discordID, discord_name: this.discordName}).then(res => {
        this.msg = ''
        this.$router.push('/success')
      }).catch(err => {
        this.msg = err.response.data.msg
      })
    }
  },
  mounted () {
    this.isDiscordLogined = this.$route.query.discordID != undefined
    if(this.isDiscordLogined) {
      this.discordID = this.$route.query.discordID
      this.discordName = this.$route.query.discordName
      this.discordAvatar = `https://cdn.discordapp.com/avatars/${this.discordID}/${this.$route.query.discordAvatar}.png?size=64`
    }
  }
}
</script>

<style lang="scss" module>
</style>
