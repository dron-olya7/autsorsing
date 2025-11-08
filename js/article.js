document.addEventListener("DOMContentLoaded", () => {
  const articles = document.querySelectorAll(".article");
  const fullTexts = document.querySelectorAll(".full-width-text");

  articles.forEach(article => {
    article.addEventListener("click", (e) => {

      const id = article.dataset.article;
      const fullText = document.querySelector(`.full-width-text[data-for="${id}"]`);

      const isOpen = article.classList.contains("expanded");

      // закрываем все
      articles.forEach(a => a.classList.remove("expanded"));
      fullTexts.forEach(t => t.classList.remove("active"));

      // если это не было открыто — открыть
      if (!isOpen) {
        article.classList.add("expanded");
        fullText.classList.add("active");
      }
    });
  });
});
