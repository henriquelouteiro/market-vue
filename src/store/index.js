import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    carrinho: [],
  },
  getters: {},
  methods: {},
  mutations: {
    //carrinho
    setCarrinho(state, produto) {
      state.carrinho.push({
        idProduto: produto.id,
        nome: produto.title,
        preco: produto.price,
        url: produto.image,
      });
      localStorage.setItem("carrinho", JSON.stringify(state.carrinho));
    },
    removeCarrinho(state, produto) {
      state.carrinho.splice(produto, 1);
      localStorage.setItem("carrinho", JSON.stringify(state.carrinho));
    },
    clearCarrinho(state) {
      state.carrinho = [];
      localStorage.setItem("carrinho", JSON.stringify(state.carrinho));
    },
  },
  actions: {},
  modules: {},
});
