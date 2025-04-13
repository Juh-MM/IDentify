// Gráfico de Similaridade (Doughnut)
const ctxSimilaridade = document.getElementById('graficoSimilaridade').getContext('2d');
new Chart(ctxSimilaridade, {
  type: 'doughnut',
  data: {
    labels: ['Similaridade', 'Diferença'],
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
      legend: {
        position: 'bottom'
      }
    }
  }
});

// Gráfico de Casos Concluídos vs Não Concluídos (Bar)
const ctxCasos = document.getElementById('graficoCasos').getContext('2d');
const graficoCasos = new Chart(ctxCasos, {
  type: 'bar', // Tipo de gráfico (barras)
  data: {
    labels: ['Concluídos', 'Não Concluídos'], // Labels para as barras
    datasets: [{
      label: 'Casos',
      data: [1, 5], // Dados para casos concluídos e não concluídos
      backgroundColor: ['#4CAF50', '#FF6347'], // Cor das barras (verde para concluídos, vermelho para não concluídos)
      borderColor: ['#388E3C', '#C62828'], // Cor das bordas das barras
      borderWidth: 80
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Não mostra a legenda
      },
      tooltip: {
        enabled: true, // Habilita a tooltip que aparece quando você passa o mouse sobre as barras
      }
    },
    scales: {
      x: {
        beginAtZero: true // Garante que a escala comece no zero
      }
    }
  }
});
