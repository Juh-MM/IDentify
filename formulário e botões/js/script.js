// === TROCAR ENTRE ABAS ===
    function mostrarAba(id) {
      const abas = document.querySelectorAll(".conteudo-tab");
      abas.forEach(aba => aba.style.display = "none");
  
      const abaSelecionada = document.getElementById(id);
      if (abaSelecionada) {
        abaSelecionada.style.display = "block";
      }
    }
  
    // === EVENTOS DOS BOTÕES DE ABA ===
    document.getElementById("btn-localizacao").addEventListener("click", () => {
      mostrarAba("localizacao");
      setTimeout(() => map.invalidateSize(), 300); // Corrigir tamanho do mapa após exibir aba
    });
  
    document.getElementById("btn-anexos").addEventListener("click", () => {
      mostrarAba("anexos");
    });
  
    document.getElementById("btn-relatorio").addEventListener("click", () => {
      mostrarAba("relatorio");
    });
  
    // === MOSTRAR ABA PADRÃO AO CARREGAR ===
    window.onload = () => {
      mostrarAba("localizacao");
  
      const localizacaoVisivel = window.getComputedStyle(document.getElementById('localizacao')).display !== 'none';
      if (localizacaoVisivel) {
        setTimeout(() => {
          map.invalidateSize();
        }, 300);
      }
    };
  
    // === DROPDOWN PERSONALIZADO ===
    window.toggleDropdown = function () {
      document.getElementById("dropdown").classList.toggle("active");
    };
  
    window.onclick = function (e) {
      if (!e.target.closest('.custom-dropdown')) {
        document.getElementById("dropdown").classList.remove("active");
      }
    };
  
    // === ADICIONAR EVIDÊNCIA (LOCAL) ===
    const inputEvidencia = document.getElementById("inputEvidencia");
    const listaEvidencias = document.getElementById("lista-evidencias");
    const mensagemDiv = document.getElementById("mensagem");
    const tabelaEvidenciasBody = document.querySelector("#tabelaEvidencias tbody");
    const evidenciasLocal = [];
  
    inputEvidencia.addEventListener("change", (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        mensagemDiv.style.display = "none";
  
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = function (e) {
            evidenciasLocal.push({ name: file.name, dataUrl: e.target.result });
  
            // Atualiza dropdown
            const link = document.createElement("a");
            link.textContent = file.name;
            listaEvidencias?.appendChild(link);
            listaEvidencias?.appendChild(document.createElement("br"));
  
            // Atualiza tabela
            if (tabelaEvidenciasBody) {
              const tr = document.createElement("tr");
              tr.innerHTML = `
                <td>${tabelaEvidenciasBody.rows.length + 1}</td>
                <td>${file.name}</td>
                <td><a href="${e.target.result}" download="${file.name}">Download</a></td>
              `;
              tabelaEvidenciasBody.appendChild(tr);
            }
          };
          reader.readAsDataURL(file);
  
          mensagemDiv.style.display = "block";
          mensagemDiv.style.color = "green";
          mensagemDiv.textContent = "Evidência adicionada localmente!";
        });
  
        event.target.value = ''; // Resetar input
      }
    });
  
    // === SALVAR DADOS DO CASO ===
    document.getElementById('btn-salvar-caso').addEventListener('click', () => {
      // Coletar coordenadas do marcador, se existir
      let coordenadas = null;
      if (marker) {
        const latlng = marker.getLatLng();
        coordenadas = {
          latitude: latlng.lat,
          longitude: latlng.lng
        };
      }
  
     // Coletar arquivos adicionados como evidências
    const arquivosAnexos = evidenciasLocal.map(e => ({
      nome: e.name,
      base64: e.dataUrl
    }));

  
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
        coordenadas: coordenadas
        
      };
  
      // Salvar no localStorage
      let casosSalvos = JSON.parse(localStorage.getItem('casos')) || [];
      casosSalvos.push(dados);
      localStorage.setItem('casos', JSON.stringify(casosSalvos));
  
      alert('Dados do caso salvos no localStorage!');
      console.log('Caso salvo:', dados);
    });
  
    
    
    // === INICIALIZAÇÃO DO MAPA COM LEAFLET ===
    const map = L.map('map').setView([-8.0476, -34.8770], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  
    let marker = null;
  
    // === FUNÇÃO PARA OBTER ENDEREÇO VIA NOMINATIM ===
    function buscarEndereco(lat, lng) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const endereco = data.display_name || "Endereço não encontrado";
          document.getElementById('endereco').textContent = endereco;
        })
        .catch(() => {
          document.getElementById('endereco').textContent = "Erro ao buscar endereço";
        });
    }
  
    // === EVENTO DE CLIQUE NO MAPA ===
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

// Buscar endereço com Nominatim
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
    // Clique no mapa
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

const inputRelatorio = document.getElementById("inputRelatorio");
const listaRelatorios = document.getElementById("lista-relatorios");
const relatoriosLocal = [];

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

    event.target.value = ''; // limpa input após seleção
  }
});



