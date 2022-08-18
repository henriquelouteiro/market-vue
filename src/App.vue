<template>
  <div>
    <NavBarMarket />
    <router-view/>
    </div>
</template>

<script>
import NavBarMarket from "@/components/NavBarMarket.vue";
export default {
  name: 'app',
  components: {
    NavBarMarket,
  },
  methods:{
    checarLocalStorage() {
      if (window.localStorage.carrinho)
        this.$store.state.carrinho = JSON.parse(window.localStorage.carrinho);
    },
  },
  created() {
    document.title = "Market";
  },
  mounted() {
    this.checarLocalStorage();
  }
}
</script>


<style>
body, h1, h2, ul, li, p {
  padding: 0px;
  margin: 0px;
}

ul {
  list-style: none;
}

* {
  box-sizing: border-box;
}

body {
  background: #78afaf;
}

#app {
  padding: 0 80px;
}

.container { 
  max-width: 900px;
  padding: 20px 0;
  margin: 0 auto;
}
</style>
