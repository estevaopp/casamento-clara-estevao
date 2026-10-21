const giftGrid = document.querySelector("#gift-grid");
const searchInput = document.querySelector("#search");
const categoryFilter = document.querySelector("#category-filter");
const statusFilter = document.querySelector("#status-filter");
const giftCount = document.querySelector("#gift-count");
const progressFill = document.querySelector("#progress-fill");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#reserve-dialog");
const reserveForm = document.querySelector("#reserve-form");
const guestName = document.querySelector("#guest-name");
const dialogGiftName = document.querySelector("#dialog-gift-name");
const formError = document.querySelector("#form-error");

let gifts = [];
let selectedGiftId = null;

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

async function loadGifts() {
  try {
    const response = await fetch("/api/gifts");
    if (!response.ok) throw new Error("Falha ao carregar a lista.");
    gifts = await response.json();
    fillCategories();
    renderGifts();
  } catch (error) {
    giftGrid.innerHTML = `<div class="loading-state">Não foi possível carregar a lista. Atualize a página para tentar novamente.</div>`;
  }
}

function fillCategories() {
  const current = categoryFilter.value;
  const categories = [...new Set(gifts.map(gift => gift.category))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  categoryFilter.innerHTML = '<option value="">Todas as categorias</option>' +
    categories.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  categoryFilter.value = categories.includes(current) ? current : "";
}

function renderGifts() {
  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const category = categoryFilter.value;
  const status = statusFilter.value;

  const filtered = gifts.filter(gift => {
    const matchesTerm = `${gift.name} ${gift.description} ${gift.category}`.toLocaleLowerCase("pt-BR").includes(term);
    const matchesCategory = !category || gift.category === category;
    const matchesStatus = status === "all" || (status === "available" && !gift.reserved) || (status === "reserved" && gift.reserved);
    return matchesTerm && matchesCategory && matchesStatus;
  });

  const reservedCount = gifts.filter(gift => gift.reserved).length;
  giftCount.textContent = `${reservedCount} de ${gifts.length} escolhidos`;
  progressFill.style.width = gifts.length ? `${(reservedCount / gifts.length) * 100}%` : "0%";
  emptyState.hidden = filtered.length > 0;

  giftGrid.innerHTML = filtered.map(gift => `
    <article class="gift-card ${gift.reserved ? "is-reserved" : ""}">
      <div class="gift-top">
        ${gift.image
          ? `<img class="gift-image" src="${escapeHTML(gift.image)}" alt="${escapeHTML(gift.name)}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false;">`
          : `<div class="gift-emoji"></div>`
        }
        <span class="category-tag">${escapeHTML(gift.category)}</span>
      </div>
      <div class="gift-body">
        <h3>${escapeHTML(gift.name)}</h3>
        <p>${escapeHTML(gift.description)}</p>
        ${gift.reserved
          ? `<div class="reserved-label"><span>✓</span> Presente escolhido</div>
             <button class="choose-button cancel-button" data-cancel="${gift.id}">Cancelar reserva</button>`
          : `<button class="choose-button" data-id="${gift.id}">Vou presentear <span>→</span></button>`
        }
      </div>
    </article>
  `).join("");

  giftGrid.querySelectorAll("[data-id]").forEach(button => {
    button.addEventListener("click", () => openReserveDialog(Number(button.dataset.id)));
  });
  giftGrid.querySelectorAll("[data-cancel]").forEach(button => {
    button.addEventListener("click", () => cancelReservation(Number(button.dataset.cancel)));
  });
}

function openReserveDialog(id) {
  const gift = gifts.find(item => item.id === id);
  if (!gift || gift.reserved) return;
  selectedGiftId = id;
  dialogGiftName.textContent = gift.name;
  formError.textContent = "";
  guestName.value = "";
  dialog.showModal();
  guestName.focus();
}

document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());

reserveForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (!selectedGiftId) return;
  const name = guestName.value.trim();
  if (!name) return;

  const submitButton = reserveForm.querySelector(".submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "Salvando...";
  formError.textContent = "";

  try {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ giftId: selectedGiftId, name })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Não foi possível reservar.");
    dialog.close();
    await loadGifts();
    alert("Reserva confirmada! Obrigado pelo carinho 💛");
  } catch (error) {
    formError.textContent = error.message;
    await loadGifts();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Confirmar reserva";
  }
});

async function cancelReservation(id) {
  const gift = gifts.find(item => item.id === id);
  if (!gift) return;
  const name = prompt(`Para cancelar "${gift.name}", digite o mesmo nome usado na reserva:`);
  if (name === null) return;
  if (!name.trim()) {
    alert("Digite o nome usado na reserva.");
    return;
  }

  try {
    const response = await fetch(`/api/reservations/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Não foi possível cancelar a reserva.");
    await loadGifts();
    alert("Reserva cancelada. O presente está disponível novamente.");
  } catch (error) {
    alert(error.message);
  }
}

searchInput.addEventListener("input", renderGifts);
categoryFilter.addEventListener("change", renderGifts);
statusFilter.addEventListener("change", renderGifts);

loadGifts();
