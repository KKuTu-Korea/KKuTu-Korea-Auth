# KKuTu Korea Auth
> 기상천외한 끝말잇기를 웹게임으로! 끄투코리아

[끄투코리아](https://kkutu.co.kr)
[디스코드](https://kkutu.co.kr/discord)
[네이버 카페](http://cafe.naver.com/kkutukorea)
[페이스북](https://fb.com/kkutukorea)
[유튜브](https://www.youtube.com/%EB%81%84%ED%88%AC%EC%BD%94%EB%A6%AC%EC%95%84)

해당 레포지토리는 끄투코리아의 공식 디스코드 이용을 위한 이메일 인증 시스템 입니다.

## 사용법

* 디스코드 APP 등록이 필요합니다.
* 이메일 전송을 위하여 mailgun을 사용합니다.

### back-end
back-end는 Node.js로 이루어져 있으며 주로 Express, Discord.js 를 사용합니다.
기본 포트는 HTTP 81, HTTPS 444 입니다.

``` bash
# 폴더 진입
cd ./back-end

# 라이브러리 설치
npm i

# 서버 시작
node index.js
```
### front-end
front-end는 Vue.js로 이루어져 있으며 Webpack을 사용합니다.
권장 포트는 HTTP 80, HTTPS 443 입니다.
빌드한 파일들을 웹서버에 올려두시면 됩니다. 빌드된 파일은 ```dist```에 있습니다.

``` bash
# 폴더 진입
cd ./front-end

# 라이브러리 설치
npm i

# 테스트 서버 (http://localhost:8080)
npm run dev

# 빌드
npm run build
```


## 참고사항

**끄투코리아**는 AGPL 라이센스의 따라 소스를 공개하고 있습니다.
그에 따라 이 소스코드를 이용하신 분은 AGPL 라이센스를 따르셔야 합니다.
