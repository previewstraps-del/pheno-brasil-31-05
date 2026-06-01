import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =====================================================
   FIREBASE
===================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyAJTlL-4piG67VOM_y480dhyib2qaF3Bso",
  authDomain: "phenobrasil.firebaseapp.com",
  projectId: "phenobrasil",
  storageBucket: "phenobrasil.firebasestorage.app",
  messagingSenderId: "825755980394",
  appId: "1:825755980394:web:caad888821d128fb133013"
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);

/* =====================================================
   HELPERS
===================================================== */

function safeElement(id) {
  return document.getElementById(id);
}

function updateCartBadges() {

  const total = JSON.parse(
    localStorage.getItem('pheno_cart') || '[]'
  ).reduce((sum, item) => sum + item.qty, 0);

  document.querySelectorAll('.cart-badge').forEach(badge => {

    badge.textContent = total;

    badge.classList.toggle(
      'visible',
      total > 0
    );

  });

}

function showToast(message) {

  const toast = safeElement('toast');

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);

}

/* =====================================================
   GLOBAL
===================================================== */

window.mostrarBreeders = (event) => {

  event.preventDefault();

  const path = window.location.pathname;

  if (
    path.endsWith("index.html") ||
    path === "/" ||
    path === "/index.html"
  ) {

    console.log("Abrindo modal de Breeders...");

    alert("Abrindo seletor de Breeders!");

  } else {

    location.href = 'breeders.html';

  }

};

/* =====================================================
   NAV
===================================================== */

export function renderNav(activeLink = '') {

  const links = [

    {
      label: 'Inicio',
      href: 'index.html'
    },

    {
      label: 'Breeders',
      href: 'breeders.html'
    },

    {
      label: 'Colecionaveis',
      href: 'sementes.html',
      dropdown: [

        {
          icon: '🌿',
          label: 'Breeders',
          sub: 'Conheça quem cultiva',
          href: 'breeders.html',
          onclick: 'window.mostrarBreeders(event)'
        },

        {
          icon: '🧬',
          label: 'Tipos de Sementes',
          sub: 'Fem, Auto, Regular...',
          href: '#'
        },

        {
          icon: '🔬',
          label: 'Canabinoides',
          sub: 'THC, CBD e mais',
          href: '#'
        }

      ]
    },

    {
      label: 'Sobre',
      href: 'sobre.html'
    },

    {
      label: 'Contato',
      href: 'contato.html'
    },

    {
      label: 'Loja',
      href: 'loja.html'
    }

  ];

  const navItems = links.map(link => {

    const active =
      activeLink === link.label
        ? 'active'
        : '';

    const onclickAttr =
      link.onclick
        ? `onclick="${link.onclick}"`
        : '';

    if (link.dropdown) {

      const dropdownItems = link.dropdown.map(item => {

        const dropOnclick =
          item.onclick
            ? `onclick="${item.onclick}"`
            : '';

        return `
          <a href="${item.href}" ${dropOnclick}>
            ${item.icon} ${item.label}
            <span class="dropdown-sub">
              ${item.sub}
            </span>
          </a>
        `;

      }).join('');

      return `
        <li>
          <a href="${link.href}" class="${active}">
            ${link.label}
            <span class="arrow">▼</span>
          </a>

          <div class="dropdown">
            ${dropdownItems}
          </div>
        </li>
      `;
    }

    return `
      <li>
        <a
          href="${link.href}"
          class="${active}"
          ${onclickAttr}
        >
          ${link.label}
        </a>
      </li>
    `;

  }).join('');

  document.body.insertAdjacentHTML(
    'afterbegin',
    `
   

    <div class="topbar">
  <span>🌱 Sementes premium de coleção — Breeders brasileiros</span>
  <div id="auth-top-links"></div>
  </div>
  <nav>
</div>

      <div
        class="nav-logo"
        onclick="location.href='index.html'"
      >
        <h2>
          PHENO
          <span style="color:var(--gold)">
            BRASIL
          </span>
        </h2>
      </div>

      <ul class="nav-center">
        ${navItems}
      </ul>

      <div
        class="nav-right"
        id="auth-nav-btn"
      ></div>

    </nav>

    <!-- MODAL LOGIN -->

    <div
      class="modal-overlay"
      id="modal-overlay"
    >

      <div class="modal">

        <button
          class="modal-close"
          onclick="window.closeModal()"
        >
          &times;
        </button>

        <h2>
          Efetuar
          <span style="color:var(--gold)">
            Login
          </span>
        </h2>

        <form onsubmit="window.fazerLogin(event)">

          <div class="form-group">

            <label>E-mail</label>

            <input
              type="email"
              id="email-login"
              placeholder="seu@email.com"
              required
            >

          </div>

          <div class="form-group">

            <label>Senha</label>

            <input
              type="password"
              id="pass-login"
              placeholder="••••••••"
              required
            >

          </div>

          <button
            type="submit"
            class="form-submit"
          >
            Entrar
          </button>

        </form>

      </div>

    </div>

    <!-- CARRINHO -->

    <div
      class="cart-backdrop"
      id="cart-backdrop"
      onclick="window.fecharCarrinho()"
    ></div>

    <div
      class="cart-drawer"
      id="cart-drawer"
    >

      <div class="cart-header">

        <h3>
          🛒 Seu Carrinho
        </h3>

        <button
          class="cart-close-btn"
          onclick="window.fecharCarrinho()"
        >
          &times;
        </button>

      </div>

      <div
        class="cart-items"
        id="cart-items"
      ></div>

      <div
        class="cart-footer"
        id="cart-footer"
        style="display:none"
      >

        <div class="cart-total-row">

          <span class="cart-total-label">
            Total
          </span>

          <span
            class="cart-total-value"
            id="cart-total"
          >
            R$ 0,00
          </span>

        </div>

        <button
          class="checkout-btn"
          onclick="window.finalizarPedido()"
        >
          Finalizar Pedido
        </button>

        <button
          class="clear-cart-btn"
          onclick="window.limparCarrinho()"
        >
          Esvaziar carrinho
        </button>

      </div>

    </div>

    <div
      class="toast"
      id="toast"
    ></div>
    `
  );

}

/* =====================================================
   CART
===================================================== */

export function initCarrinho() {

  let carrinho = JSON.parse(
    localStorage.getItem('pheno_cart') || '[]'
  );

  const salvar = () => {

    localStorage.setItem(
      'pheno_cart',
      JSON.stringify(carrinho)
    );

  };

  const render = () => {

    const container =
      safeElement('cart-items');

    const footer =
      safeElement('cart-footer');

    if (!container || !footer) return;

    if (!carrinho.length) {

      container.innerHTML = `

        <div class="cart-empty">

          <div class="cart-empty-icon">
            🌿
          </div>

          <p>
            Carrinho vazio.<br>
            Adicione genéticas da vitrine!
          </p>

        </div>

      `;

      footer.style.display = 'none';

      return;

    }

    let total = 0;

    container.innerHTML = '';

    carrinho.forEach((item, idx) => {

      total += item.price * item.qty;

      const div = document.createElement('div');

      div.className = 'cart-item';

      div.innerHTML = `

        <img
          class="cart-item-img"
          src="${item.image || ''}"
          alt="${item.name}"
        >

        <div>

          <div class="cart-item-name">
            ${item.name}
          </div>

          <div class="cart-item-sub">
            ${item.type}
          </div>

          <div class="cart-item-price">
            R$ ${(item.price * item.qty)
              .toFixed(2)
              .replace('.', ',')}
          </div>

        </div>

        <div class="cart-item-controls">

          <div class="qty-controls">

            <button
              class="qty-btn"
              onclick="window.mudarQty(${idx},-1)"
            >
              −
            </button>

            <span class="qty-num">
              ${item.qty}
            </span>

            <button
              class="qty-btn"
              onclick="window.mudarQty(${idx},1)"
            >
              +
            </button>

          </div>

          <button
            class="remove-btn"
            onclick="window.removerItem(${idx})"
          >
            remover
          </button>

        </div>

      `;

      container.appendChild(div);

    });

    const totalElement =
      safeElement('cart-total');

    if (totalElement) {

      totalElement.textContent =
        'R$ ' +
        total.toFixed(2).replace('.', ',');

    }

    footer.style.display = 'block';

    updateCartBadges();

  };

  window.abrirCarrinho = () => {

    render();

    const drawer =
      safeElement('cart-drawer');

    const backdrop =
      safeElement('cart-backdrop');

    if (drawer) {
      drawer.classList.add('open');
    }

    if (backdrop) {
      backdrop.classList.add('open');
    }

  };

  window.fecharCarrinho = () => {

    const drawer =
      safeElement('cart-drawer');

    const backdrop =
      safeElement('cart-backdrop');

    if (drawer) {
      drawer.classList.remove('open');
    }

    if (backdrop) {
      backdrop.classList.remove('open');
    }

  };

  window.mudarQty = (idx, delta) => {

    carrinho[idx].qty += delta;

    if (carrinho[idx].qty <= 0) {
      carrinho.splice(idx, 1);
    }

    salvar();

    render();

    updateCartBadges();

  };

  window.removerItem = (idx) => {

    const nome = carrinho[idx].name;

    carrinho.splice(idx, 1);

    salvar();

    render();

    updateCartBadges();

    showToast(`${nome} removido`);

  };

  window.limparCarrinho = () => {

    carrinho = [];

    salvar();

    render();

    updateCartBadges();

  };

  window.finalizarPedido = () => {

    alert('Em breve: checkout!');

  };

  window.adicionarAoCarrinho = (
    id,
    name,
    type,
    price,
    image
  ) => {

    const existing = carrinho.findIndex(
      item => item.id === id
    );

    if (existing > -1) {

      carrinho[existing].qty++;

      showToast(`+1  ${name} adicionado!✅`);

    } else {

      carrinho.push({
        id,
        name,
        type,
        price,
        image,
        qty: 1
      });

      showToast(`✅ ${name} adicionado!`);

    }

    salvar();

    updateCartBadges();

    const button = document.querySelector(
      `[data-product-id="${id}"]`
    );

    if (button) {

      button.textContent =
        '✓ Adicionado';

      button.classList.add('added');

      setTimeout(() => {

        button.textContent =
          '+ Carrinho';

        button.classList.remove('added');

      }, 1500);

    }

  };

  updateCartBadges();

}

/* =====================================================
   AUTH
===================================================== */

export function initAuth() {

  const buildLogged = (isAdmin) => {

    const url =
      isAdmin
        ? 'admin.html'
        : 'breeder-dashboard.html';

    const name =
      isAdmin
        ? 'Painel Admin'
        : 'Meu Painel';

    return `

      <button
        class="nav-btn primary"
        onclick="location.href='${url}'"
      >
        ${name}
      </button>

      <button
        class="nav-btn"
        onclick="window.fazerLogout()"
      >
        Sair
      </button>

      <button
        class="cart-nav-btn"
        onclick="window.abrirCarrinho()"
      >
        🛒
        <span class="cart-badge"></span>
      </button>

    `;
  };

  const buildGuest = () => `

    <button
      class="nav-btn"
      onclick="window.openModal()"
    >
      Entrar
    </button>

    <button
      class="cart-nav-btn"
      onclick="window.abrirCarrinho()"
    >
      🛒
      <span class="cart-badge"></span>
    </button>

  `;

  onAuthStateChanged(auth, async (user) => {

    const topLinks =
      safeElement('auth-top-links');

    const navBtn =
      safeElement('auth-nav-btn');

    if (user) {

      let isAdmin =
        user.email === 'admin@phenobrasil.com';

      if (!isAdmin) {

        try {

          const userData = (
            await getDoc(
              doc(db, "users", user.uid)
            )
          ).data();

          if (
            userData?.role === 'admin' ||
            userData?.tipo === 'admin'
          ) {
            isAdmin = true;
          }

        } catch (_) {}

      }

      if (topLinks) {

        topLinks.innerHTML = `
          <span style="color:var(--gold)">
            Conectado: ${user.email}
          </span>
        `;

      }

      if (navBtn) {

        navBtn.innerHTML =
          buildLogged(isAdmin);

      }

    } else {

      if (topLinks) {

        topLinks.innerHTML = `
          <a onclick="window.openModal()">
            Entrar / Login
          </a>
        `;

      }

      if (navBtn) {

        navBtn.innerHTML =
          buildGuest();

      }

    }

    updateCartBadges();

  });

  window.openModal = () => {

    const modal =
      safeElement('modal-overlay');

    if (modal) {
      modal.style.display = 'flex';
    }

  };

  window.closeModal = () => {

    const modal =
      safeElement('modal-overlay');

    if (modal) {
      modal.style.display = 'none';
    }

  };

  window.fazerLogin = async (e) => {

    e.preventDefault();

    const emailInput =
      safeElement('email-login');

    const passInput =
      safeElement('pass-login');

    if (!emailInput || !passInput) {
      return;
    }

    const email =
      emailInput.value.trim();

    const senha =
      passInput.value;

    try {

      const cred =
        await signInWithEmailAndPassword(
          auth,
          email,
          senha
        );

      window.closeModal();

      if (
        email === 'admin@phenobrasil.com'
      ) {

        location.href = 'admin.html';

        return;

      }

      const userData = (
        await getDoc(
          doc(db, "users", cred.user.uid)
        )
      ).data();

      if (
        userData?.role === 'admin' ||
        userData?.tipo === 'admin'
      ) {

        location.href = 'admin.html';

        return;

      }

      location.href =
        'breeder-dashboard.html';

    } catch (err) {

      alert(
        "Credenciais inválidas: " +
        err.message
      );

    }

  };

  window.fazerLogout = async () => {

    try {

      await signOut(auth);

      location.reload();

    } catch (_) {}

  };

}