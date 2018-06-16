<template>
  <div id="KKuTuKoreaAuth">
    <router-view/>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
@import url(https://fonts.googleapis.com/css?family=Nanum+Gothic);
#KKuTuKoreaAuth {
  font-family: 'Nanum Gothic', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
input {
  width: 10rem;
  border-radius: 0.2rem;
  border: 0.05rem solid #ccc;
  padding: 0.3rem 0.5rem;
  font: 400 0.75rem 'Nanum Gotic';
}
button {
  width: 8rem;
  border-radius: 0.2rem;
  border: 0.05rem solid #ccc;
  padding: 0.3rem 0.5rem;
  font: 400 0.75rem 'Nanum Gotic';
}
</style>
