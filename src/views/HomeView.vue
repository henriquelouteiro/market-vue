<template>
  <div class="container">
    <div class="card-container container">
      <div v-for="(produto, index) in produtos" :key="index" class="card">
        <div class="card-body">
          <div class="h2 mb-0">
            <b-icon
              icon="heart-fill"
              class="rounded p-2 icon-heart-bg action-produto"
              variant="danger"
            ></b-icon>
          </div>

          <div class="card-container-img">
            <img :src="produto.image" alt="Card image cap" />
          </div>

          <div class="card-container-titulo">
            <p>{{ produto.title }}</p>
          </div>

          <div class="card-container-titulo d-flex justify-content-between">
            <div class="d-flex flex-column">
              <span>Price:</span>
              <strong>{{ produto.price | numeroPreco}}</strong>
            </div>
            <div class="h2 mb-0">
              <b-iconstack @click="testando()" class="action-produto icon-plus-bg">
                <b-icon stacked icon="plus"></b-icon>
              </b-iconstack>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
  data() {
    return {
      produtos: [],
    };
  },
  methods: {
    getProdutos() {
      fetch("https://fakestoreapi.com/products")
        .then((r) => r.json())
        .then((r) => {
          this.produtos = r;
          console.log(this.produtos);
        });
    },
    testando() {
      console.log("testando");
    },
  },
  mounted() {
    this.getProdutos();
  },
};
</script>

<style scoped>
/* CARD */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  padding: 1rem;
  gap: 1rem;
}

.card {
  border-radius: 35px;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-container-img {
  height: 150px;
}
.card-container-img img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.card-container-titulo p {
  font-size: 15px;
  font-weight: 500;
}

/* BOTOES */
.action-produto{
  cursor: pointer;
}

/* ICONS */
.icon-heart-bg {
  
  background: rgb(255, 192, 192);
}

.icon-plus-bg {
  border-radius: 10px;
  background: rgb(192, 192, 192);
}
</style>
