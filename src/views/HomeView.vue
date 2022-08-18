<template>
  <div>


    <main class="container">
      <div class="conteudo-main">
        <div
          class="container conteudo-header d-flex justify-content-between align-items-center border-bottom"
        >
          <div>
            <h2>Market</h2>
            <p>Shop the best products.</p>
          </div>

          <div class="action-produto">
            <strong v-b-toggle.sidebar-right
              >{{ total | numeroPreco }} <b-icon icon="cart"></b-icon
            ></strong>
          </div>

          <b-sidebar id="sidebar-right" title="Cart" right shadow width="400px">
            <div class="px-3 py-2">
              <div class="d-flex justify-content-between align-items-center">
                <h6>All Products</h6>
                <b-button
                  @click="$store.commit('clearCarrinho')"
                  variant="outline-danger"
                  size="sm"
                  class="btn-sm mb-2"
                >
                  Clear
                </b-button>
              </div>

              <ul class="card-lateral-container">
                <li
                  v-for="(produto, index) in $store.state.carrinho"
                  :key="index"
                  class="card-lateral-main"
                >
                  <div class="card-lateral">
                    <img :src="produto.url" :alt="produto.nome" />
                  </div>
                  <div>
                    <p class="overflow-hidden card-lateral-nome">
                      {{ produto.nome }}
                    </p>
                    <div>{{ produto.preco | numeroPreco }}</div>
                  </div>

                  <b-iconstack
                    @click="actionCarrinho(produto, 0)"
                    class="action-produto"
                  >
                    <b-icon icon="trash"></b-icon>
                  </b-iconstack>
                </li>
              </ul>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <h6>Total:</h6>
                <strong>{{ total | numeroPreco }}</strong>
              </div>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <h6>Tax 5%:</h6>
                <strong>{{ (total * 0.05) | numeroPreco }}</strong>
              </div>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <h6>Shipping:</h6>
                <strong>Free</strong>
              </div>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <div></div>
                <router-link to="/store" style="width:100%;">
                  <b-button variant="success" class="buttom-buy">
                    Next <b-icon icon="arrow-right"
                  /></b-button>
                </router-link>
              </div>
            </div>
          </b-sidebar>
        </div>

        <b-overlay :show="show" class="container">
          <div
            class="container conteudo-header mobile-search d-flex justify-content-between align-items-center"
          >
            <div>
              <h3 v-if="!search" class="h3">All Products</h3>
              <h3 v-else class="h3">
                Search Results: <span class="search-text">{{ search }}</span>
              </h3>
            </div>

            <div class="action-produto">
              <b-input-group class="">
                <b-form-input
                  placeholder="Search..."
                  class="search-input"
                  v-model="search"
                />
              </b-input-group>
            </div>
          </div>

          <div class="card-container container">
            <div
              v-for="(produto, index) in produtoFiltrado"
              :key="index"
              class="card"
            >
              <CardProdutos
                :produto="produto"
                :isFavorito="produtoFavorito(produto.id)"
                :onCarrinho="produtoCarrinho(produto.id)"
                @tFavorito="actionFavorito($event)"
                @tCarrinho="actionCarrinho($event)"
              />
            </div>
          </div>
        </b-overlay>
      </div>
    </main>
    <div class="alerta" :class="{ ativo: alertaAtivo }">
      <p class="alerta_mensagem">{{ mensagemAlerta }}</p>
    </div>
  </div>
</template>

<script>

import CardProdutos from "@/components/CardProdutos.vue";

export default {
  name: "HomeView",
  components: {
    CardProdutos,
  },
  
  data() {
    return {
      produtos: [],
      show: false,
      carrinho: [],
      favorito: [],
      mensagemAlerta: "",
      alertaAtivo: false,
      search: "",
    };
  },
  watch: {
    favoritado() {
      this.produtoFavorito();
    },
    adicionado() {
      this.produtoCarrinho();
    },
    remove(index) {
      this.$store.state.carrinho.splice(index, 1);
    },
    url() {
      this.getProdutos();
    },
    favorito() {
      window.localStorage.favorito = JSON.stringify(this.favorito);
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.$store.state.carrinho);
    },
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
  computed: {
    produtoFiltrado() {
      if (!this.search) return this.produtos;
      return this.produtos.filter((produto) => {
        return produto.title.toLowerCase().includes(this.search.toLowerCase());
      });
    },
    total() {
      return this.$store.state.carrinho.reduce((total, produto) => {
        return total + produto.preco;
      }, 0);
    },
  },

  methods: {
    comprarProduto() {
      this.$store.state.carrinho = [];
      this.notificacao("🎉 Products purchased successfully 🎉");
    },
    produtoCarrinho(id) {
      let aux = this.$store.state.carrinho.find((carrinho) => {
        return carrinho.idProduto == id;
      });
      return aux ? true : false;
    },
    produtoFavorito(id) {
      let aux = this.favorito.find((favorito) => {
        return favorito.idProduto == id;
      });
      return aux ? true : false;
    },
    getProdutos() {
      this.show = true;
      fetch("https://fakestoreapi.com/products")
        .then((r) => r.json())
        .then((r) => {
          this.produtos = r;
          this.show = false;
        });
    },
    checarLocalStorage() {
      if (window.localStorage.favorito)
        this.favorito = JSON.parse(window.localStorage.favorito);
    },

    posicaoFavorito(id) {
      return this.favorito.findIndex((produto) => {
        return produto.idProduto == id;
      });
    },
    actionFavorito(event) {
      if (event.action == 1) this.adicionarFavorito(event.produto_id);
      else this.removerFavorito(event.produto_id);
    },

    actionCarrinho(event) {
      if (event.action == 1) {
        this.$store.commit("setCarrinho", event.produto);
        this.notificacao(`${event.produto.title} added to cart.`);
      } else {
        this.$store.commit("removeCarrinho", event.produto);
        this.notificacao(`${event.produto.title} removed.`);
      }
    },

    removerFavorito(id) {
      let position = this.posicaoFavorito(id);
      if (position > -1) this.favorito.splice(position, 1);
    },
    notificacao(msg) {
      this.mensagemAlerta = msg;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 2000);
    },
    adicionarFavorito(id) {
      this.favorito.push({
        idProduto: id,
      });
    },
  },
  mounted() {
    this.getProdutos();
    this.checarLocalStorage();
  },
};
</script>

<style scoped>
.buttom-buy {
  width: 100%;
  border-radius: 15px;
  font-weight: 700;
}
/* CARD LATERAL */
.card-lateral-nome {
  height: 20px;
  font-weight: 500;
}

.card-lateral-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.card-lateral-main {
  display: grid;
  grid-template-columns: 50px 1fr 10px;
  gap: 5px;
  align-items: center;
  justify-content: center;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 10px;
  border-radius: 0.25rem;
}
.card-lateral {
  width: 50px;
  height: 50px;
}

.card-lateral img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
/* ALERTA */

.alerta {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: 100%;
  text-align: center;
  display: none;
}

.alerta.ativo {
  display: block;
  animation: fadeInDown 0.3s forwards;
}

.alerta_mensagem {
  background: #ffffff;
  display: inline-block;
  padding: 20px 40px;
  border: 2px solid black;
  box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1), 0px 4px 10px rgba(0, 0, 0, 0.2);
}
/*Conteudo */

.conteudo-main {
  border-radius: 20px;
  background: #ffffff;
  padding: 1rem;
  margin: 0 15px;
}

.conteudo-header {
  padding: 20px 0;
}

/* search */
.search-text {
  text-transform: capitalize;
  font-size: 1.2rem;
}

.search-input {
  width: 25ch;
}
/* CARD */

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}

.card {
  border-radius: 35px;
}

/* BOTOES */

.input-group {
  flex-wrap: nowrap;
}

@media screen and (max-width: 600px) {
  .mobile-search {
    flex-direction: column-reverse;
    gap: 1rem;
  }
}
</style>
