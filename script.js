const PHONE = "51987654321"; // +51 Perú

// Modelos (edítalos cuando quieras)
const PRODUCTS = [
  {
    id: "GDC-001",
    name: "Polo Hincha Negro (Clásico)",
    cat: "Hincha",
    price: 49,
    badge: "Nuevo",
    colors: ["#111111", "#ffffff", "#9ca3af"],
    desc: "Diseño para hinchas. Personaliza con nombre y número.",
  },
  {
    id: "GDC-002",
    name: "Polo Personalizado (Texto + Número)",
    cat: "Personalizados",
    price: 55,
    badge: "Top",
    colors: ["#111111", "#2563eb", "#dc2626"],
    desc: "Ideal para regalos o grupos. Añade frase, nombre o número.",
  },
  {
    id: "GDC-003",
    name: "Polo Empresa (Logo simple)",
    cat: "Empresa",
    price: 59,
    badge: "Pro",
    colors: ["#111111", "#ffffff", "#0ea5e9"],
    desc: "Para negocios y equipos. Coordinación por WhatsApp.",
  },
  {
    id: "GDC-004",
    name: "Polo Mayorista (desde 10 und.)",
    cat: "Mayorista",
    price: 39,
    badge: "Mayor",
    colors: ["#111111", "#ffffff"],
    desc: "Precio referencial por volumen. Consultar cantidades.",
  },
  {
    id: "GDC-005",
    name: "Polo Ofertas (stock limitado)",
    cat: "Ofertas",
    price: 35,
    badge: "Oferta",
    colors: ["#111111", "#f59e0b"],
    desc: "Modelos en promo. Pregunta disponibilidad.",
  },
];

const state = {
  cat: "Todos",
  q: "",
  sort: "reco",
  list: [...PRODUCTS],
  selected: null,
};

const $grid = document.getElementById("grid");
const $count = document.getElementById("count");
const $q = document.getElementById("q");
const $sort = document.getElementById("sort");
const $clear = document.getElementById("clear");

// Menú móvil
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

// Chips categoría
document.querySelectorAll(".chip").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    state.cat = btn.dataset.cat || "Todos";
    render();
  });
});

// Buscar
$q.addEventListener("input", (e) => {
  state.q = e.target.value.trim().toLowerCase();
  render();
});

// Ordenar
$sort.addEventListener("change", (e) => {
  state.sort = e.target.value;
  render();
});

$clear.addEventListener("click", () => {
  state.cat = "Todos";
  state.q = "";
  state.sort = "reco";
  $q.value = "";
  document.querySelectorAll(".chip").forEach(b => b.classList.remove("is-active"));
  document.querySelector('.chip[data-cat="Todos"]').classList.add("is-active");
  render();
});

function sortList(list){
  const out = [...list];
  if (state.sort === "price_asc") out.sort((a,b)=>a.price-b.price);
  if (state.sort === "price_desc") out.sort((a,b)=>b.price-a.price);
  if (state.sort === "new") out.sort((a,b)=> (b.badge === "Nuevo") - (a.badge === "Nuevo"));
  // "reco": como viene
  return out;
}

function filterList(){
  let list = [...PRODUCTS];
  if (state.cat !== "Todos") list = list.filter(p => p.cat === state.cat);
  if (state.q) {
    list = list.filter(p =>
      (p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(state.q)
    );
  }
  return sortList(list);
}

function colorDots(colors){
  return `<div class="colors">${
    colors.map(c => `<span class="dot" style="background:${c}" title="${c}"></span>`).join("")
  }</div>`;
}

function card(p){
  return `
    <article class="card">
      <div class="thumb" role="img" aria-label="Sin imagen">SIN FOTO</div>
      <div class="card__body">
        <h3 class="card__title">${escapeHtml(p.name)}</h3>
        <div class="card__meta">
          <span class="price">S/ ${p.price}</span>
          <span class="badge">${escapeHtml(p.badge)}</span>
        </div>
        ${colorDots(p.colors)}
        <p class="tiny muted">${escapeHtml(p.cat)} • ${escapeHtml(p.id)}</p>
      </div>
      <div class="card__actions">
        <button class="btn" data-open="${p.id}">Ver / Pedir</button>
      </div>
    </article>
  `;
}

function render(){
  const list = filterList();
  state.list = list;
  $count.textContent = String(list.length);

  $grid.innerHTML = list.map(card).join("");

  document.querySelectorAll("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.open));
  });
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

/* Modal */
const modal = document.getElementById("modal");
const mCat = document.getElementById("mCat");
const mTitle = document.getElementById("mTitle");
const mDesc = document.getElementById("mDesc");
const mPrice = document.getElementById("mPrice");
const mBadge = document.getElementById("mBadge");
const mColor = document.getElementById("mColor");
const mSize = document.getElementById("mSize");
const mCustom = document.getElementById("mCustom");
const mWhatsApp = document.getElementById("mWhatsApp");

function openModal(id){
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  state.selected = p;

  mCat.textContent = p.cat.toUpperCase();
  mTitle.textContent = p.name;
  mDesc.textContent = p.desc;
  mPrice.textContent = `S/ ${p.price}`;
  mBadge.textContent = p.badge;

  mColor.innerHTML = p.colors.map((c, i) => {
    const label = i === 0 ? "Negro/Principal" : `Color ${i+1}`;
    return `<option value="${c}">${label}</option>`;
  }).join("");

  mCustom.value = "";
  modal.showModal();
}

mWhatsApp.addEventListener("click", () => {
  const p = state.selected;
  if (!p) return;

  const size = mSize.value;
  const color = mColor.value;
  const custom = mCustom.value.trim();

  const text =
`Hola, quiero pedir:
- Modelo: ${p.name} (${p.id})
- Categoría: ${p.cat}
- Talla: ${size}
- Color: ${color}
${custom ? `- Personalización: ${custom}\n` : ""}¿Me confirmas precio final y entrega en Lima?`;

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});

/* Modal ayuda */
const help = document.getElementById("help");
document.getElementById("openHelp").addEventListener("click", () => help.showModal());

// Init
render();
