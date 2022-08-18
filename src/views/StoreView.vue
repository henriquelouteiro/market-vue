<template>
  <div>
    <main class="container">
      <div class="conteudo-main">
        <div class="aling-center mb-3">
          <router-link to="/"> Home</router-link>
        </div>

        <div>
          <b-form @submit.prevent="onSubmit" class="border-top mb-3 mt-3">
            <b-form-group
              id="input-group-1"
              label="Email address:"
              label-for="input-1"
              description="We'll never share your email with anyone else."
            >
              <b-form-input
                id="input-1"
                v-model="form.email"
                type="email"
                placeholder="Enter email"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Full Name:"
              label-for="input-2"
            >
              <b-form-input
                id="input-2"
                v-model="form.name"
                placeholder="Enter name"
                required
              ></b-form-input>
            </b-form-group>

            <b-form-group
              id="input-group-3"
              label="Payment method:"
              label-for="input-3"
            >
              <b-form-select
                id="input-3"
                v-model="form.metodoPagamento"
                :options="metodosPagamento"
                required
              ></b-form-select>
            </b-form-group>
            <div class="d-flex flex-row-reverse">
              <b-button type="submit" variant="success">Pay</b-button>
              <router-link to="/">
                <b-button type="reset" variant="primary" class="mr-3"
                  >Return</b-button
                ></router-link
              >
            </div>
          </b-form>
        </div>

        <div
          class="py-3 d-flex justify-content-between align-items-center mt-3 border-top"
        >
          <h6>Total:</h6>
          <strong>{{ total | numeroPreco }}</strong>
        </div>
        <div
          class="container border-top conteudo-header d-flex justify-content-between align-items-center border-bottom"
        >
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
                @click="$store.commit('removeCarrinho', produto)"
                class="action-produto"
              >
                <b-icon icon="trash"></b-icon>
              </b-iconstack>
            </li>
          </ul>
        </div>
      </div>
    </main>
    <div class="alerta" :class="{ ativo: alertaAtivo }">
      <p class="alerta_mensagem">{{ mensagemAlerta }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",

  created() {
    document.title = "Market";
  },
  data() {
    return {
      form: {
        email: "",
        name: "",
        metodoPagamento: null,
      },
      metodosPagamento: [{ text: "Select One", value: null }, "Pix", "Card"],
      produtos: [],
      carrinho: [],
      favorito: [],
      mensagemAlerta: "",
      alertaAtivo: false,
    };
  },
  watch: {
    url() {
      this.getProdutos();
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
    total() {
      return this.$store.state.carrinho.reduce((total, produto) => {
        return total + produto.preco;
      }, 0);
    },
  },

  methods: {
    onSubmit() {
      this.form.metodoPagamento = null;
      this.form.email = "";
      this.form.name = "";
      this.$store.commit("clearCarrinho");
      this.notificacao("🎉 Products purchased successfully 🎉");
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

    notificacao(msg) {
      this.mensagemAlerta = msg;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 2000);
    },
  },
  mounted() {
    this.getProdutos();
  },
};
</script>

<style scoped>
.btn {
  border-radius: 20px;
}

/* CARD LATERAL */
.card-lateral-nome {
  height: 37px;
  font-weight: 500;
  font-size: 1.2rem;
}

.card-lateral-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.card-lateral-main {
  display: grid;
  grid-template-columns: 100px 1fr 30px;
  gap: 5px;
  align-items: center;
  justify-content: center;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 10px;
  border-radius: 0.25rem;
}
.card-lateral {
  width: 100px;
  height: 100px;
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

@media screen and (max-width: 600px) {
  .card-lateral-nome {
    font-size: 1rem;
    height: 45px;
  }
  .card-lateral {
    width: 70px;
    height: 70px;
  }
}
</style>
