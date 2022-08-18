<template>
  <div class="card-body">
    <div class="h2 mb-0">
      <b-icon
        v-if="isFavorito"
        icon="heart-fill"
        class="rounded p-2 icon-heart-bg action-produto"
        variant="danger"
        @click="toggleFavorito(produto.id,0)"
      />
      <b-icon
        v-else
        icon="suit-heart"
        class="rounded p-2 icon-unheart-bg action-produto"
        @click="toggleFavorito(produto.id,1)"
      />
    </div>

    <div class="card-container-img">
      <img :src="produto.image" alt="Card image cap" />
    </div>

    <div class="card-container-titulo">
      <p class="overflow-hidden">{{ produto.title }}</p>
    </div>

    <div class="card-container-titulo d-flex justify-content-between">
      <div class="d-flex flex-column">
        <span>Price:</span>
        <strong>{{ produto.price | numeroPreco }}</strong>
      </div>
      <div class="h2 mb-0">
        <b-iconstack
          v-if="!onCarrinho"
          @click="toggleCarrinho(produto,1)"
          class="action-produto icon-plus-bg"
        >
          <b-icon stacked icon="plus"></b-icon>
        </b-iconstack>
        <b-iconstack
          v-else
          @click="toggleCarrinho(produto,0)"
          class="action-produto icon-check-bg"
        >
          <b-icon stacked icon="check"></b-icon>
        </b-iconstack>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    produto: {
      type: Object,
      required: true,
    },
    isFavorito: {
      type: Boolean,
      required: true,
    },
    onCarrinho: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    toggleFavorito(id,action) {
      let data = {
        produto_id:id,
        action: action
      };
      this.$emit("tFavorito", data);
    },
    toggleCarrinho(produto,action) {
      let data = {
        produto:produto,
        action: action
      };
      this.$emit("tCarrinho", data);
    },
  },
  name: "CardProdutos",
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
  },
};
</script>

<style >
/* CARD */

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.card {
  border-radius: 35px;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
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
  height: 73px;
  font-size: 15px;
  font-weight: 500;
}

/* ICONS */

.icon-check-bg {
  border-radius: 10px;
  background: rgb(58, 255, 84);
  color: #ffffff;
}

.icon-unheart-bg {
  background: rgb(230, 230, 230);
}
.icon-heart-bg {
  background: rgb(255, 192, 192);
}

.icon-plus-bg {
  border-radius: 10px;
  background: rgb(192, 192, 192);
}
</style>