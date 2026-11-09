(function () {
  "use strict";

  function getCurrentHttpUrl() {
    try {
      var currentUrl = new URL(window.location.href);
      if (currentUrl.protocol !== "http:" && currentUrl.protocol !== "https:") {
        return null;
      }
      return currentUrl.href;
    } catch (error) {
      return null;
    }
  }

  function getWhatsAppUrl(message, url) {
    try {
      var shareUrl = new URL("https://wa.me/");
      shareUrl.searchParams.set("text", message + " " + url);
      return shareUrl.protocol === "https:" && shareUrl.hostname === "wa.me"
        ? shareUrl.href
        : null;
    } catch (error) {
      return null;
    }
  }

  function copyLink(url, status) {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
      status.textContent = "Não foi possível abrir o WhatsApp. Copie o endereço da página para compartilhar.";
      return;
    }

    try {
      navigator.clipboard.writeText(url).then(
        function () {
          status.textContent = "WhatsApp indisponível. Link copiado para compartilhar.";
        },
        function () {
          status.textContent = "Não foi possível abrir o WhatsApp nem copiar o link. Copie o endereço da página.";
        }
      );
    } catch (error) {
      status.textContent = "Não foi possível abrir o WhatsApp nem copiar o link. Copie o endereço da página.";
    }
  }

  function openWhatsApp(message, url, status) {
    var whatsappUrl = getWhatsAppUrl(message, url);
    if (!whatsappUrl) {
      copyLink(url, status);
      return;
    }

    var whatsappWindow;
    try {
      whatsappWindow = window.open(whatsappUrl, "_blank");
    } catch (error) {
      whatsappWindow = null;
    }
    if (whatsappWindow) {
      whatsappWindow.opener = null;
      status.textContent = "WhatsApp aberto para você compartilhar o evento.";
      return;
    }

    copyLink(url, status);
  }

  function init() {
    var heroContent = document.querySelector(".hero__content");
    if (!heroContent || document.querySelector(".event-share")) {
      return;
    }

    var container = document.createElement("div");
    container.className = "event-share";

    var button = document.createElement("button");
    button.className = "event-share__button";
    button.type = "button";
    button.setAttribute("aria-label", "Compartilhar o link do Retiro Fiat");
    button.innerHTML =
      '<svg class="event-share__icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">' +
      '<path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v7h14v-7" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg><span>Compartilhar evento</span>";

    var status = document.createElement("p");
    status.className = "event-share__status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    container.appendChild(button);
    container.appendChild(status);

    var countdown = heroContent.querySelector(".countdown");
    if (countdown && countdown.nextSibling) {
      heroContent.insertBefore(container, countdown.nextSibling);
    } else {
      heroContent.appendChild(container);
    }

    button.addEventListener("click", function () {
      var url = getCurrentHttpUrl();
      if (!url) {
        status.textContent = "O link só pode ser compartilhado quando esta página estiver publicada em um endereço web.";
        return;
      }

      var title = document.title || "Retiro Fiat 2026";
      var message = "Compartilhe o Retiro Fiat 2026:";
      var shareData = { title: title, text: message, url: url };

      if (typeof navigator.share === "function") {
        var canShare = true;
        try {
          canShare = typeof navigator.canShare !== "function" || navigator.canShare(shareData);
        } catch (error) {
          canShare = false;
        }
        if (canShare) {
          try {
            navigator.share(shareData).then(
              function () {
                status.textContent = "Link compartilhado.";
              },
              function (error) {
                if (error && error.name === "AbortError") {
                  status.textContent = "Compartilhamento cancelado.";
                  return;
                }
                openWhatsApp(message, url, status);
              }
            );
            return;
          } catch (error) {
            openWhatsApp(message, url, status);
            return;
          }
        }
      }

      openWhatsApp(message, url, status);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
