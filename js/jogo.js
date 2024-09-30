let palavraSecreta;
let palavraAtual;

const quantidadeErrosMaximos = 6;
let quantidadeErrosAtual = 0;
const quantidadeDesafios = 5;
let quantidadeDesafiosJogados = 0;

const contextoSelecionado = localStorage.getItem('contextoSelecionado');

if (!contextoSelecionado) {
    alert("Nenhum contexto selecionado. Voltando à página anterior.");
    window.location.href = 'contextos.html'; // Volta à página de seleção se não tiver um contexto
} else{
    iniciarDesafio();
}

function iniciarDesafio(){
    fetch('../repositorio-palavras/desafios.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const contextos = data.contextos;

        // Supondo que você queira sortear uma palavra do contexto "cores" ou "frutas"
        const desafios = contextos.find(contexto => contexto.nome.toLowerCase() === contextoSelecionado.toLowerCase()).desafios;

        // Sortear uma palavra aleatória
        palavraSecreta = desafios[Math.floor(Math.random() * desafios.length)];
        palavraAtual = Array(palavraSecreta.length).fill("_"); // Inicializa a palavra atual

        console.log("Palavra secreta sorteada:", palavraSecreta); // Para verificar
        exibirPalavra(); // Exibe a palavra atualizada

        quantidadeErrosAtual = 0; // Reinicializa os erros para o próximo desafio
        atualizarImagemErro(0); // Zera a imagem de erros
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));
}


function exibirPalavra() {
    const palavraContainer = document.getElementById('palavra');
    palavraContainer.textContent = palavraAtual.join(" ");
    aplicarConfiguracoes(); // Aplica as configurações de estilo
}

function letraClicada(letra) {
    let acertou = false;
    
    for (let i = 0; i < palavraSecreta.length; i++) {
        if (palavraSecreta[i].toLowerCase() === letra.toLowerCase()) {
            palavraAtual[i] = letra;
            acertou = true;
        }
    }

    const botao = document.querySelector(`button[onclick="letraClicada('${letra}')"]`);
    botao.disabled = true;
    botao.style.color = 'white';
    botao.style.backgroundColor = acertou ? 'green' : 'red';

    exibirPalavra();
    
    if (!acertou) {
        quantidadeErrosAtual++;
        if (quantidadeErrosAtual >= quantidadeErrosMaximos) {
            alert("Você perdeu!");
            proximaRodada();
        } else {
            atualizarImagemErro(quantidadeErrosAtual);
        }
    }

    if (!palavraAtual.includes("_")) {
        alert("Você venceu!");
        proximaRodada();
    }
}

function atualizarImagemErro(quantidadeErro) {
    document.getElementById('erro').src = `../img/erros/erro${quantidadeErro}.png`;
}

function proximaRodada() {
    quantidadeDesafiosJogados++;

    if (quantidadeDesafiosJogados < quantidadeDesafios) {
        resetarBotoesLetras();
        iniciarDesafio();
    } else {
        alert("Fim da partida! Todos os desafios foram jogados.");
        window.location.href = 'contextos.html';
    }
}

function resetarBotoesLetras() {
    const botoes = document.querySelectorAll('button[onclick^="letraClicada"]'); // Seleciona todos os botões que chamam 'letraClicada'
    
    botoes.forEach(botao => {
        botao.disabled = false; // Reativa o botão
        botao.style.color = ''; // Reseta a cor para o valor padrão (geralmente herdado ou definido por CSS)
        botao.style.backgroundColor = ''; // Reseta o fundo para o valor padrão
    });
}
