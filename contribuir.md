---
title: "Contribuir"
nav_exclude: true
search_exclude: true
---

# Contribuir com este estudo

<p id="contribuir-contexto" class="contribute-context"></p>

<form id="form-contribuir" novalidate>
  <div class="campo">
    <label for="tipo">O que você deseja fazer?</label>
    <select id="tipo" name="tipo" required>
      <option value="" disabled selected>Escolha uma opção</option>
      <option>Fazer uma pergunta</option>
      <option>Sugerir uma fonte</option>
      <option>Complementar um estudo</option>
      <option>Sugerir uma correção</option>
      <option>Sugerir um novo tema</option>
    </select>
  </div>

  <div class="campo">
    <label for="contribuicao">Sua pergunta ou contribuição</label>
    <textarea id="contribuicao" name="contribuicao" rows="6" maxlength="4000" required
      placeholder="Escreva com o máximo de contexto que puder."></textarea>
  </div>

  <div class="campo">
    <label for="fonte">Fonte ou referência (opcional)</label>
    <input type="text" id="fonte" name="fonte" maxlength="500"
      placeholder="Livro, autor, vídeo, artigo, link...">
  </div>

  <div class="campo">
    <label for="nome">Como você gostaria de ser identificado? (opcional)</label>
    <input type="text" id="nome" name="nome" maxlength="100" placeholder="Seu nome, ou deixe em branco">
  </div>

  <div id="turnstile-widget" class="cf-turnstile" data-sitekey="TURNSTILE_SITE_KEY_AQUI"></div>

  <input type="hidden" id="pagina" name="pagina">
  <input type="hidden" id="paginaUrl" name="paginaUrl">

  <button type="submit" class="contribute-link" id="btn-enviar">Enviar contribuição</button>

  <p id="contribuir-status" role="status"></p>
</form>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script src="{{ '/assets/js/contribuicao.js' | relative_url }}"></script>
