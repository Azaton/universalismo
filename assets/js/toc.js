// Gera a navegação "Nesta página" (Table of Contents) a partir dos h2/h3
// do conteúdo da página. Ver commands/site/02-implementar-table-of-contents.md.
//
// Não roda em páginas com poucas seções (critério de aceite: "páginas sem
// subseções relevantes não exibem um TOC vazio"). Depende de
// heading_anchors: true (_config.yml), que já garante id em cada heading.
(function () {
  "use strict";

  var MIN_HEADINGS = 2;

  function buildToc(content) {
    var headings = content.querySelectorAll("h2[id], h3[id]");
    if (headings.length < MIN_HEADINGS) return null;

    var nav = document.createElement("nav");
    nav.id = "site-toc";
    nav.setAttribute("aria-label", "Nesta página");

    var title = document.createElement("p");
    title.className = "site-toc-title";
    title.textContent = "Nesta página";
    nav.appendChild(title);

    var list = document.createElement("ul");
    nav.appendChild(list);

    headings.forEach(function (heading) {
      var item = document.createElement("li");
      item.className = "site-toc-" + heading.tagName.toLowerCase();

      var link = document.createElement("a");
      link.href = "#" + heading.id;
      link.textContent = heading.textContent.trim();
      item.appendChild(link);
      list.appendChild(item);
    });

    return nav;
  }

  function init() {
    var content = document.getElementById("main-content");
    if (!content) return;

    var toc = buildToc(content);
    if (!toc) return;

    // O CSS só reserva a coluna direita para o TOC quando esta classe está
    // presente, para páginas sem TOC não ficarem com espaço vazio à direita.
    document.body.classList.add("has-site-toc");
    document.body.appendChild(toc);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
