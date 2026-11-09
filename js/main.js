"use strict";

const retreatDeparture = new Date("2026-11-20T20:00:00-03:00");
const countdown = document.querySelector("#countdown");
const checklist = [...document.querySelectorAll(".packing-group input[type='checkbox']")];
const countLabel = document.querySelector("#packing-count");
const progressBar = document.querySelector("#packing-progress");
const registration = document.querySelector("#inscricao");
const mobileCta = document.querySelector(".mobile-cta");
const vesselLiquid = document.querySelector("#vessel-liquid");
const pixButton = document.querySelector("#copy-pix");
const pixStatus = document.querySelector("#pix-status");
const pixKey = document.querySelector("#pix-key");
const storageKey = "retiro-fiat-mala-v1";

function updateCountdown() {
  const difference = retreatDeparture.getTime() - Date.now();
  if (difference <= 0) {
    countdown.textContent = "A saída é hoje — nos encontramos às 19h!";
    return;
  }

  const days = Math.ceil(difference / 86400000);
  countdown.textContent = `Faltam ${days} ${days === 1 ? "dia" : "dias"} para a saída`;
}

function updatePackingProgress() {
  const checked = checklist.filter((item) => item.checked).length;
  countLabel.textContent = `${checked} de ${checklist.length} itens`;
  progressBar.style.width = `${(checked / checklist.length) * 100}%`;
  progressBar.parentElement.setAttribute("aria-label", `${checked} de ${checklist.length} itens conferidos`);
}

function loadPackingList() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) {
      checklist.forEach((item) => {
        item.checked = saved.includes(item.dataset.item);
      });
    }
  } catch (error) {
    console.warn("Não foi possível carregar a lista da mala salva neste aparelho.", error);
  }
  updatePackingProgress();
}

function savePackingList() {
  try {
    const checked = checklist.filter((item) => item.checked).map((item) => item.dataset.item);
    localStorage.setItem(storageKey, JSON.stringify(checked));
  } catch (error) {
    console.warn("Não foi possível salvar a lista da mala neste aparelho.", error);
  }
  updatePackingProgress();
}

function updateVesselFill() {
  const start = document.querySelector(".arrival").offsetTop;
  const finish = registration.offsetTop;
  const distance = Math.max(1, finish - start);
  const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
  const top = 205 - progress * 155;
  vesselLiquid.setAttribute("d", `M20 ${top} Q90 ${top - 4} 160 ${top} V210 H20 Z`);
}

function updateMobileCta(entries) {
  mobileCta.classList.toggle("is-hidden", entries[0].isIntersecting);
}

async function copyPixKey() {
  const value = pixKey.textContent.trim();
  pixStatus.textContent = "";
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = value;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      document.body.append(temporaryInput);
      temporaryInput.select();
      const copied = document.execCommand("copy");
      temporaryInput.remove();
      if (!copied) throw new Error("O navegador não conseguiu copiar a chave Pix.");
    }
    pixStatus.textContent = "Chave copiada!";
  } catch (error) {
    console.error("Não foi possível copiar a chave Pix.", error);
    pixStatus.textContent = "Não foi possível copiar. Selecione a chave e copie.";
  }
}

updateCountdown();
window.setInterval(updateCountdown, 60000);
loadPackingList();
checklist.forEach((item) => item.addEventListener("change", savePackingList));
pixButton.addEventListener("click", copyPixKey);

if ("IntersectionObserver" in window) {
  const registrationObserver = new IntersectionObserver(updateMobileCta, { threshold: 0.12 });
  registrationObserver.observe(registration);
} else {
  mobileCta.classList.remove("is-hidden");
}

updateVesselFill();
window.addEventListener("scroll", updateVesselFill, { passive: true });
window.addEventListener("resize", updateVesselFill);
