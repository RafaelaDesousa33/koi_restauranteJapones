const filters = document.querySelectorAll(".filter");
const menuCards = document.querySelectorAll(".menu-card");

const cart = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");

const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

const addButtons = document.querySelectorAll(".add-btn");

const whatsappBtn = document.getElementById("whatsappBtn");

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

const toast = document.getElementById("toast");

const reservationForm = document.getElementById("reservationForm");

/* CARRINHO */

let cartProducts = [];

/* FILTROS */

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((btn) => {
      btn.classList.remove("active");
    });

    filter.classList.add("active");

    const category = filter.dataset.filter;

    menuCards.forEach((card) => {
      if (category === "todos" || card.dataset.category === category) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

/* ABRIR CARRINHO */

function openCartPanel() {
  cart.classList.add("active");
  cartOverlay.classList.add("active");

  document.body.style.overflow = "hidden";
}

/* FECHAR CARRINHO */

function closeCartPanel() {
  cart.classList.remove("active");
  cartOverlay.classList.remove("active");

  document.body.style.overflow = "";
}

openCart.addEventListener("click", openCartPanel);

closeCart.addEventListener("click", closeCartPanel);

cartOverlay.addEventListener("click", closeCartPanel);

/* ADICIONAR PRODUTO */

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    const existingProduct = cartProducts.find(
      (product) => product.name === name,
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cartProducts.push({
        name,
        price,
        quantity: 1,
      });
    }

    updateCart();

    showToast();
  });
});

/* ATUALIZAR CARRINHO */

function updateCart() {
  if (cartProducts.length === 0) {
    cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fas fa-shopping-bag"></i>

                <h3>Seu carrinho está vazio</h3>

                <p>
                    Adicione alguns pratos especiais
                    para começar seu pedido.
                </p>

            </div>

        `;

    cartTotal.textContent = "R$ 0,00";
    cartCount.textContent = "0";

    return;
  }

  cartItems.innerHTML = "";

  cartProducts.forEach((product, index) => {
    const item = document.createElement("div");

    item.classList.add("cart-item");

    item.innerHTML = `

            <div>

                <h4>${product.name}</h4>

                <p class="cart-item-price">
                    ${formatPrice(product.price)}
                </p>

                <div class="quantity-control">

                    <button
                        class="decrease"
                        data-index="${index}"
                    >
                        -
                    </button>

                    <span>${product.quantity}</span>

                    <button
                        class="increase"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>

            </div>

            <button
                class="remove-item"
                data-index="${index}"
            >
                <i class="fas fa-trash"></i>
            </button>

        `;

    cartItems.appendChild(item);
  });

  const total = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const totalItems = cartProducts.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  cartTotal.textContent = formatPrice(total);

  cartCount.textContent = totalItems;

  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;

      cartProducts[index].quantity++;

      updateCart();
    });
  });

  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;

      cartProducts[index].quantity--;

      if (cartProducts[index].quantity <= 0) {
        cartProducts.splice(index, 1);
      }

      updateCart();
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.index;

      cartProducts.splice(index, 1);

      updateCart();
    });
  });
}

/* FORMATAR PREÇO */

function formatPrice(price) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/* WHATSAPP */

whatsappBtn.addEventListener("click", () => {
  if (cartProducts.length === 0) {
    alert(
      "Seu carrinho está vazio. Adicione algum produto antes de fazer o pedido.",
    );

    return;
  }

  let message = "Olá! Gostaria de fazer o seguinte pedido:%0A%0A";

  cartProducts.forEach((product) => {
    message += `• ${product.name} x${product.quantity} - ${formatPrice(
      product.price * product.quantity,
    )}%0A`;
  });

  const total = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  message += `%0A*Total: ${formatPrice(total)}*`;

  const phone = "5511999999999";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
});

/* TOAST */

function showToast() {
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* MENU MOBILE */

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});

/* FECHAR MENU AO CLICAR */

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
  });
});

/* RESERVA */

reservationForm.addEventListener("submit", (event) => {
  event.preventDefault();

  alert("Sua solicitação de reserva foi enviada com sucesso!");

  reservationForm.reset();
});
