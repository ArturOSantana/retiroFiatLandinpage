"use strict";

(() => {
  const section = document.querySelector(".packing");
  if (!section) return;

  const button = document.createElement("button");
  button.className = "packing-poster-button";
  button.type = "button";
  button.setAttribute("aria-label", "Criar e compartilhar uma arte com a lista do que levar e deixar em casa");
  button.innerHTML = '<span class="packing-poster-button__seal" aria-hidden="true">F</span><span>Uma arte pra mala <small>Compartilhe a lista no WhatsApp</small></span><span aria-hidden="true">↗</span>';

  const status = document.createElement("p");
  status.className = "packing-poster-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");

  const actions = document.createElement("div");
  actions.className = "packing-poster-actions";
  actions.append(button, status);
  section.querySelector(".section-heading").append(actions);

  const paper = "#f8ecd4";
  const ink = "#321519";
  const wine = "#5a0c18";
  const gold = "#d9b45a";
  const families = [
    { title: "01   ESPIRITUAL", items: ["Bíblia · terço"] },
    { title: "02   ROUPAS", items: ["Roupas confortáveis para 3 dias · uma muda extra", "Pijama · agasalho · chinelo · tênis", "Uma roupa velha que possa sujar", "Roupa modesta para Missa e pregações"] },
    { title: "03   HIGIENE", items: ["Toalha de banho · sabonete · xampu", "Escova e pasta de dente · desodorante", "Papel higiênico · itens de higiene pessoal", "Protetor solar · repelente"] },
    { title: "04   PARA DORMIR", items: ["Roupa de cama · travesseiro · cobertor"] },
    { title: "05   SAÚDE", items: ["Cartão do plano de saúde, se tiver"] },
    { title: "06   OUTROS", items: ["Garrafinha de água · sacola para roupa suja", "Dinheiro apenas para terços e materiais vendidos pela comunidade que vai pregar"] },
  ];
  const leaveAtHome = [
    "Celular, caixa de som, fones e videogames",
    "Bebidas alcoólicas, cigarro, vape e drogas",
    "Objetos cortantes ou perigosos",
    "Comida e doces por conta própria",
    "Objetos de valor: joias, relógios caros e eletrônicos",
    "Roupas curtas, decotadas, transparentes ou com mensagens inadequadas",
    "Baralho, jogos e outras distrações",
  ];

  function roundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let line = "";
    let lines = 0;
    for (const word of text.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        ctx.fillText(line, x, y + lines * lineHeight);
        line = word;
        lines += 1;
      } else {
        line = candidate;
      }
    }
    if (line) {
      ctx.fillText(line, x, y + lines * lineHeight);
      lines += 1;
    }
    return lines * lineHeight;
  }

  function drawArtwork(ctx, canvas, image) {
    const ratio = Math.max(canvas.width / image.width, 500 / image.height);
    const width = image.width * ratio;
    const height = image.height * ratio;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, 500);
    ctx.clip();
    ctx.drawImage(image, (canvas.width - width) / 2, (500 - height) / 2, width, height);
    const shade = ctx.createLinearGradient(0, 0, 0, 500);
    shade.addColorStop(0, "rgba(42,5,8,.13)");
    shade.addColorStop(.55, "rgba(42,5,8,.08)");
    shade.addColorStop(1, "rgba(42,5,8,.92)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, canvas.width, 500);
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, canvas.width - 52, 448);

    ctx.fillStyle = "#f8ecd4";
    ctx.textAlign = "left";
    ctx.font = "600 21px 'Instrument Sans', Arial, sans-serif";
    ctx.fillText("RETIRO  ·  GRUPO DE JOVENS", 66, 397);
    ctx.fillStyle = gold;
    ctx.font = "600 19px 'Instrument Sans', Arial, sans-serif";
    ctx.fillText("20, 21 E 22 DE NOVEMBRO  ·  2026", 66, 433);
    ctx.textAlign = "right";
    ctx.font = "italic 20px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("Lc 1,38", canvas.width - 66, 433);
    ctx.textAlign = "left";
    ctx.restore();
  }

  function drawChecklist(ctx, left, top) {
    let y = top;
    for (const family of families) {
      ctx.fillStyle = wine;
      ctx.font = "700 24px 'Instrument Sans', Arial, sans-serif";
      ctx.fillText(family.title, left, y);
      y += 17;
      for (const text of family.items) {
        ctx.beginPath();
        ctx.arc(left + 7, y + 10, 5, 0, Math.PI * 2);
        ctx.fillStyle = gold;
        ctx.fill();
        ctx.fillStyle = ink;
        ctx.font = "500 26px 'Instrument Sans', Arial, sans-serif";
        const height = wrapText(ctx, text, left + 23, y + 18, 555, 33);
        y += height + 7;
      }
      y += 13;
    }
    return y;
  }

  function drawStayHome(ctx, left, top, width) {
    let y = top;
    ctx.fillStyle = wine;
    ctx.font = "700 23px 'Instrument Sans', Arial, sans-serif";
    ctx.fillText("FICA EM CASA", left, y);
    y += 18;

    for (const text of leaveAtHome) {
      ctx.beginPath();
      ctx.arc(left + 10, y + 10, 10, 0, Math.PI * 2);
      ctx.strokeStyle = wine;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(left + 6, y + 6);
      ctx.lineTo(left + 14, y + 14);
      ctx.moveTo(left + 14, y + 6);
      ctx.lineTo(left + 6, y + 14);
      ctx.stroke();

      ctx.fillStyle = ink;
      ctx.font = "500 24px 'Instrument Sans', Arial, sans-serif";
      const height = wrapText(ctx, text, left + 30, y + 19, width - 34, 31);
      y += Math.max(height, 29) + 17;
    }
    return y;
  }

  function drawPoster(image) {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível criar a arte neste navegador.");

    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawArtwork(ctx, canvas, image);

    ctx.fillStyle = wine;
    ctx.font = "500 57px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText("O que vai na mala", 60, 574);
    ctx.fillStyle = "#765d4c";
    ctx.font = "400 23px 'Instrument Sans', Arial, sans-serif";
    ctx.fillText("Um encontro pra viver por inteiro. Leve só o que soma.", 63, 615);

    const left = 64;
    const top = 679;
    const columnWidth = 610;
    const gap = 34;
    const right = left + columnWidth + gap;
    const endLeft = drawChecklist(ctx, left, top);
    const endRight = drawStayHome(ctx, right, top, 300);
    const footerY = Math.max(endLeft, endRight) + 30;

    ctx.strokeStyle = "#c8b18e";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, footerY - 30);
    ctx.lineTo(canvas.width - 60, footerY - 30);
    ctx.stroke();
    ctx.fillStyle = wine;
    ctx.font = "500 25px 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("“Faça-se em mim segundo a tua palavra.”  ·  Lucas 1,38", canvas.width / 2, footerY + 13);
    ctx.fillStyle = "#765d4c";
    ctx.font = "600 15px 'Instrument Sans', Arial, sans-serif";
    ctx.fillText("PARÓQUIA SANTA TEREZINHA DO MENINO JESUS  ·  FEITO PELA PASCOM", canvas.width / 2, footerY + 45);
    ctx.textAlign = "left";
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Não foi possível preparar a imagem para compartilhar."));
      }, "image/png");
    });
  }

  async function loadArtwork() {
    const image = document.querySelector(".hero__art");
    if (!image) throw new Error("A arte oficial do retiro não foi encontrada.");
    if (!image.complete) await image.decode();
    if (!image.naturalWidth) throw new Error("A arte oficial do retiro não pôde ser carregada.");
    return image;
  }

  function downloadImage(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "retiro-fiat-lista-da-mala.png";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function sharePoster() {
    button.disabled = true;
    status.textContent = "Preparando a arte…";
    try {
      await document.fonts.ready;
      const image = await loadArtwork();
      const blob = await drawPoster(image);
      const file = new File([blob], "retiro-fiat-lista-da-mala.png", { type: "image/png" });
      const shareData = {
        title: "Retiro Fiat 2026 — lista da mala",
        text: "O que levar e o que deixar em casa no Retiro Fiat. Faça-se! 20, 21 e 22 de novembro.",
        url: window.location.href,
        files: [file],
      };

      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share(shareData);
        status.textContent = "Arte compartilhada!";
      } else {
        downloadImage(blob);
        const message = `${shareData.text}\n\n${shareData.url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
        status.textContent = "Arte baixada. Anexe a imagem à conversa do WhatsApp.";
      }
    } catch (error) {
      if (error.name === "AbortError") {
        status.textContent = "Compartilhamento cancelado.";
      } else {
        console.error("Não foi possível criar ou compartilhar a arte da lista.", error);
        status.textContent = "Não foi possível criar a arte. Tente novamente.";
      }
    } finally {
      button.disabled = false;
    }
  }

  button.addEventListener("click", sharePoster);
})();
