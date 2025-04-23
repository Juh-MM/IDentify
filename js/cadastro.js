let passoAtual = 1;
let dados = {};

function mostrarPasso(n) {
  for (let i = 1; i <= 3; i++) {
    const passo = document.getElementById(`passo${i}`);
    passo.style.display = i === n ? 'block' : 'none';
  }
  passoAtual = n;
}

document.addEventListener('DOMContentLoaded', () => {
  // Próximo do passo 1 → passo 2
  document.getElementById('btnProximo1').addEventListener('click', () => {
    const cargo = document.getElementById('cargo').value;
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const email = document.getElementById('email').value;

    if (!cargo || !nome || !cpf || !email) {
      alert('Preencha todos os campos.');
      return;
    }

    dados = { cargo, nome, cpf, email };
    mostrarPasso(2);
  });

  // Voltar do passo 2 → passo 1
  document.getElementById('btnVoltar1').addEventListener('click', () => {
    mostrarPasso(1);
  });

  // Próximo do passo 2 → passo 3
  document.getElementById('btnProximo2').addEventListener('click', () => {
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmarSenha').value;

    if (!senha || senha !== confirmar) {
      alert('As senhas não coincidem.');
      return;
    }

    dados.senha = senha;
    mostrarPasso(3);
  });

  // Voltar do passo 3 → passo 2
  document.getElementById('btnVoltar2').addEventListener('click', () => {
    mostrarPasso(2);
  });

  // Finalizar envio
  document.getElementById('cadastroForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const senhaAdmin = document.getElementById('senhaAdmin').value;

    if (!senhaAdmin) {
      alert('Digite a senha do administrador.');
      return;
    }

    dados.senhaAdmin = senhaAdmin;

    // Aqui você pode enviar os dados com fetch/AJAX
    console.log('Cadastro finalizado com dados:', dados);
    alert(`Cadastro finalizado! Bem-vindo(a), ${dados.nome}`);
    // Resetar se quiser
    // document.getElementById('cadastroForm').reset();
    // mostrarPasso(1);
  });
});
