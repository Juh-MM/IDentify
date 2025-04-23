console.log("Script novocaso.js carregado");

// Remover a declaração de "map" de dentro do initMap, pois já foi declarada no escopo global
let map;
let marker; // marcador do mapa

document.addEventListener("DOMContentLoaded", function () {

  // === TROCAR ENTRE ABAS ===
  function mostrarAba(id) {
    const abas = document.querySelectorAll(".conteudo-tab");
    abas.forEach(aba => aba.style.display = "none");

    const abaSelecionada = document.getElementById(id);
    if (abaSelecionada) {
      abaSelecionada.style.display = "block";
    }
  }

  // === DROPDOWN PERSONALIZADO ===
  window.toggleDropdown = function () {
    document.getElementById("dropdown").classList.toggle("active");
  };

  window.onclick = function (e) {
    if (!e.target.closest('.custom-dropdown')) {
      document.getElementById("dropdown").classList.remove("active");
    }
  };

  // === BUSCAR ENDEREÇO COM NOMINATIM ===
  function buscarEndereco(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("endereco").textContent = data.display_name || "Endereço não encontrado";
      })
      .catch(() => {
        document.getElementById("endereco").textContent = "Erro ao buscar endereço";
      });
  }

  // === VARIÁVEIS GLOBAIS ===
  const inputEvidencia = document.getElementById("inputEvidencia");
  const listaEvidencias = document.getElementById("lista-evidencias");
  const mensagemDiv = document.getElementById("mensagem");
  const tabelaEvidenciasBody = document.querySelector("#tabelaEvidencias tbody");
  const evidenciasLocal = [];

  const inputRelatorio = document.getElementById("inputRelatorio");
  const listaRelatorios = document.getElementById("lista-relatorios");
  const relatoriosLocal = [];

  // === MAPA ===
  function initMap() {
    map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

  // === EVENTOS DE INTERFACE ===
  document.getElementById("btn-localizacao").addEventListener("click", () => {
    console.log("Botão Localização clicado");
    mostrarAba("localizacao");
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 300);
  });

  document.getElementById("btn-anexos").addEventListener("click", () => {
    console.log("Botão Anexos clicado");
    mostrarAba("anexos");
  });

  document.getElementById("btn-relatorio").addEventListener("click", () => {
    console.log("Botão Relatório clicado");
    mostrarAba("relatorio");
  });

  document.getElementById('btn-salvar-caso').addEventListener('click', () => {
    const coordenadas = marker ? {
      latitude: marker.getLatLng().lat,
      longitude: marker.getLatLng().lng
    } : null;

    const dados = {
      titulo: document.getElementById('titulo').value,
      codigo: document.getElementById('codigo').value,
      perito: document.getElementById('perito').value,
      status: document.getElementById('status').value,
      dataOcorrencia: document.getElementById('data-ocorrencia').value,
      dataEmissao: document.getElementById('data-emissao').value,
      local: document.getElementById('local').value,
      evidencias: evidenciasLocal.map(e => e.name),
      relatorios: relatoriosLocal.map(r => ({
        nome: r.name,
        base64: r.dataUrl
      })),
      coordenadas
    };

    let casosSalvos = JSON.parse(localStorage.getItem('casos')) || [];
    casosSalvos.push(dados);
    localStorage.setItem('casos', JSON.stringify(casosSalvos));

    alert('Dados do caso salvos no localStorage!');
    console.log('Caso salvo:', dados);
  });

  // === EVIDÊNCIAS ===
  inputEvidencia.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      mensagemDiv.style.display = "none";

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
          evidenciasLocal.push({ name: file.name, dataUrl: e.target.result });

          const link = document.createElement("a");
          link.textContent = file.name;
          listaEvidencias?.appendChild(link);
          listaEvidencias?.appendChild(document.createElement("br"));

          if (tabelaEvidenciasBody) {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${tabelaEvidenciasBody.rows.length + 1}</td>
              <td>${file.name}</td>
              <td><a href="${e.target.result}" download="${file.name}">Download</a></td>
            `;
            tabelaEvidenciasBody.appendChild(tr);
          }

          mensagemDiv.style.display = "block";
          mensagemDiv.style.color = "#123458";
          mensagemDiv.textContent = "Evidência adicionada!";
        };
        reader.readAsDataURL(file);
      });

      event.target.value = ''; // Reset input
    }
  });

  // === RELATÓRIOS ===
  inputRelatorio.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
          relatoriosLocal.push({ name: file.name, dataUrl: e.target.result });

          const link = document.createElement("a");
          link.href = e.target.result;
          link.textContent = file.name;
          link.target = "_blank";
          listaRelatorios.appendChild(link);
        };
        reader.readAsDataURL(file);
      });

      event.target.value = '';
    }
  });

  // === CLIQUE NO MAPA ===
  if (typeof map !== "undefined" && map !== null) {
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const customIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          shadowSize: [41, 41]
        });

        marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      }

      buscarEndereco(lat, lng);
    });
  }

  // === MOSTRAR ABA PADRÃO ===
  window.onload = () => {
    mostrarAba("localizacao");

    const localizacaoVisivel = window.getComputedStyle(document.getElementById('localizacao')).display !== 'none';
    if (localizacaoVisivel) {
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);
    }
  };

  // Inicializando o mapa
  initMap();

});