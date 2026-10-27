/* ==========================================================
   EcoAnouar — script.js
   ========================================================== */

/* ----------------------------------------------------------
   CONFIGURATION — à compléter avec les vraies infos
   ---------------------------------------------------------- */
const CONFIG = {
  // Format international SANS "+", espaces ni 0 initial. Ex : "2126XXXXXXXX"
  WHATSAPP_NUMBER: "212634686048",              // 06 34 68 60 48
  INSTAGRAM_URL: "https://www.instagram.com/ecoanouar/",   // ex : "https://www.instagram.com/ecoanouar/"
  TIKTOK_URL: "https://www.tiktok.com/@ecoanouar23",         // ex : "https://www.tiktok.com/@ecoanouar"
  EMAIL: "anouarzourgane@gmail.com",                   // ex : "contact@ecoanouar.ma"
};

const isSet = (value) => Boolean(value) && !value.includes("PLACEHOLDER");

document.documentElement.classList.remove("no-js");

/* ----------------------------------------------------------
   Toast (retour visuel)
   ---------------------------------------------------------- */
const toastEl = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 3500);
}

/* ----------------------------------------------------------
   WhatsApp
   ---------------------------------------------------------- */
function buildWhatsAppUrl(text) {
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function openWhatsApp(text) {
  if (!isSet(CONFIG.WHATSAPP_NUMBER)) {
    showToast("Le numéro WhatsApp n'est pas encore configuré.");
    console.info("[EcoAnouar] Message WhatsApp préparé :\n" + text);
    return false;
  }
  window.open(buildWhatsAppUrl(text), "_blank", "noopener");
  return true;
}

function initWhatsAppLinks() {
  const defaultText = "Salam Anowar, je voudrais avoir des informations sur les cours de soutien.";

  document.querySelectorAll("[data-wa]").forEach((link) => {
    const subject = link.dataset.subject;
    const text = subject
      ? `Salam Anowar, je voudrais demander un cours de ${subject}.`
      : link.dataset.waText || defaultText;

    if (isSet(CONFIG.WHATSAPP_NUMBER)) {
      link.href = buildWhatsAppUrl(text);
      link.target = "_blank";
      link.rel = "noopener";
    }

    link.addEventListener("click", (e) => {
      if (!isSet(CONFIG.WHATSAPP_NUMBER)) {
        e.preventDefault();
        openWhatsApp(text);
      }
    });
  });
}

/* ----------------------------------------------------------
   Liens réseaux sociaux / email
   ---------------------------------------------------------- */
function initSocialLinks() {
  const map = {
    instagram: { url: CONFIG.INSTAGRAM_URL, label: "Le lien Instagram" },
    tiktok: { url: CONFIG.TIKTOK_URL, label: "Le lien TikTok" },
    email: { url: isSet(CONFIG.EMAIL) ? `mailto:${CONFIG.EMAIL}` : CONFIG.EMAIL, label: "L'adresse email" },
  };

  document.querySelectorAll("[data-link]").forEach((link) => {
    const item = map[link.dataset.link];
    if (!item) return;

    if (isSet(item.url)) {
      link.href = item.url;
    } else {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        showToast(`${item.label} sera bientôt disponible.`);
      });
    }
  });

  const emailLabel = document.querySelector("[data-email-label]");
  if (emailLabel && isSet(CONFIG.EMAIL)) emailLabel.textContent = CONFIG.EMAIL;
}

/* ----------------------------------------------------------
   Navigation mobile + navbar au scroll + lien actif
   ---------------------------------------------------------- */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    menu.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("is-open") && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Lien actif selon la section visible
  const links = [...document.querySelectorAll(".nav__link")];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }
}

/* ----------------------------------------------------------
   Animations d'apparition
   ---------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* ----------------------------------------------------------
   Formulaire d'inscription
   ---------------------------------------------------------- */
function populateSubjects(group) {
  // Les cases viennent des cartes "Matières" → une seule liste à maintenir
  const names = [...document.querySelectorAll(".subject-card [data-subject]")].map((el) => el.dataset.subject);
  names.push("Autre (préciser dans le message)");
  names.forEach((name) => {
    const label = document.createElement("label");
    label.className = "subject-option";
    label.innerHTML = '<input type="checkbox" name="subject"><span><i class="fa-solid fa-check" aria-hidden="true"></i></span>';
    label.querySelector("input").value = name;
    label.querySelector("span").append(" " + name);
    group.appendChild(label);
  });
}

function initForm() {
  const form = document.getElementById("inscription");
  if (!form) return;

  const nameInput = form.fullName;
  const subjectGroup = document.getElementById("subjectGroup");
  const levelInputs = form.querySelectorAll('input[name="level"]');
  populateSubjects(subjectGroup);
  const subjectInputs = subjectGroup.querySelectorAll('input[name="subject"]');
  const selectedSubjects = () => [...subjectInputs].filter((i) => i.checked).map((i) => i.value);

  const setFieldState = (fieldEl, errorEl, message) => {
    fieldEl.classList.toggle("has-error", Boolean(message));
    fieldEl.classList.toggle("is-valid", !message);
    errorEl.textContent = message || "";
  };

  const validators = {
    name() {
      const v = nameInput.value.trim();
      let msg = "";
      if (!v) msg = "Indique ton nom et prénom.";
      else if (v.length < 3) msg = "Ton nom semble trop court.";
      else if (!/^[\p{L}\s'’-]+$/u.test(v)) msg = "Utilise uniquement des lettres.";
      setFieldState(nameInput.closest(".field"), document.getElementById("fullNameError"), msg);
      nameInput.setAttribute("aria-invalid", String(Boolean(msg)));
      return !msg;
    },
    level() {
      const checked = form.querySelector('input[name="level"]:checked');
      const msg = checked ? "" : "Choisis ton semestre.";
      setFieldState(levelInputs[0].closest(".field"), document.getElementById("levelError"), msg);
      return !msg;
    },
    subject() {
      const msg = selectedSubjects().length ? "" : "Choisis au moins une matière.";
      setFieldState(document.getElementById("subjectField"), document.getElementById("subjectError"), msg);
      return !msg;
    },
  };

  // Validation en direct après la première interaction
  nameInput.addEventListener("blur", validators.name);
  nameInput.addEventListener("input", () => { if (nameInput.closest(".field").classList.contains("has-error")) validators.name(); });
  levelInputs.forEach((r) => r.addEventListener("change", validators.level));
  subjectInputs.forEach((c) => c.addEventListener("change", validators.subject));

  // Pré-remplir la matière depuis une carte (clic "Demander un cours" sans numéro configuré)
  document.querySelectorAll(".subject-card [data-subject]").forEach((link) => {
    link.addEventListener("click", () => {
      const box = [...subjectInputs].find((i) => i.value === link.dataset.subject);
      if (box) box.checked = true;
      validators.subject();
      if (!isSet(CONFIG.WHATSAPP_NUMBER)) form.scrollIntoView({ behavior: "smooth" });
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const results = [validators.name(), validators.level(), validators.subject()];
    if (results.includes(false)) {
      const firstError = form.querySelector(".has-error input");
      if (firstError) firstError.focus();
      showToast("Merci de compléter les champs obligatoires.");
      return;
    }

    const level = form.querySelector('input[name="level"]:checked').value;
    const message = form.message.value.trim();
    const lines = [
      "Salam Anowar 👋, je souhaite m'inscrire aux cours de soutien.",
      "",
      `• Nom et prénom : ${nameInput.value.trim()}`,
      `• Niveau : ${level}`,
      `• Matière(s) : ${selectedSubjects().join(", ")}`,
    ];
    if (message) lines.push(`• Message : ${message}`);

    if (openWhatsApp(lines.join("\n"))) {
      showToast("WhatsApp s'ouvre… il ne reste qu'à envoyer !");
      form.reset();
      form.querySelectorAll(".field").forEach((f) => f.classList.remove("is-valid", "has-error"));
    }
  });
}

/* ----------------------------------------------------------
   Init
   ---------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
initNavigation();
initWhatsAppLinks();
initSocialLinks();
initForm();
initReveal();
