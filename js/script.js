
// Função para mudar o conteudo do main
function carregarPagina(pagina) {
  fetch(pagina)
    .then(response => response.text())
    .then(html => {
      const main = document.getElementById('main');
      main.innerHTML = html;

      // Pega todos os scripts dentro do HTML injetado
      const scripts = main.querySelectorAll("script");
      scripts.forEach(oldScript => {
        const newScript = document.createElement("script");
        // Copia atributos e conteúdo
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript); // Executa o script
      });
    });
}

// Carregar a página home como padrão ao iniciar
window.onload = function() {
  carregarPagina('home.html');
};



document.addEventListener("DOMContentLoaded", function () {
  // === GRÁFICO DE SIMILARIDADE (DOUGHNUT) ===
  const ctxSimilaridade = document.getElementById('graficoSimilaridade')?.getContext('2d');
  if (ctxSimilaridade) {
    new Chart(ctxSimilaridade, {
      type: 'doughnut',
      data: {
        labels: ['Similares', 'Não similares'],
        datasets: [{
          label: '95% Similaridade',
          data: [95, 5],
          backgroundColor: ['#123458', '#d4c9be'],
          borderWidth: 1
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // === GRÁFICO DE CASOS CONCLUÍDOS (BARRAS) ===
  const ctxCasos = document.getElementById('graficoCasos')?.getContext('2d');
  if (ctxCasos) {
    new Chart(ctxCasos, {
      type: 'bar',
      data: {
        labels: ['Concluídos', 'Não Concluídos'],
        datasets: [{
          label: 'Casos',
          data: [1, 5],
          backgroundColor: ['#4CAF50', '#FF6347'],
          borderColor: ['#388E3C', '#C62828'],
          borderWidth: 80
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }
});
