const palavrasPorContexto = {
    comida: ["PIZZA", "HAMBURGUER", "ARROZ", "FEIJOADA"],
    cidade: ["AEROPORTO", "PARQUE", "SHOPPING", "RUA"],
    cores: ["VERMELHO", "AZUL", "VERDE", "AMARELO"],
    cozinha: ["TALHER", "PRATO", "GARFO", "FACA"],
    natureza: ["ARVORE", "FLOR", "RIO", "MONTANHA"],
    frutas: ["MARACUJA", "BANANA", "LIMAO", "MORANGO"]
};

const contextoEscolhido = 'cores';
const palavras = palavrasPorContexto[contextoEscolhido];
const palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)].toUpperCase();
let palavraAtual = Array(palavraSecreta.length).fill("_");

const quantidadeErrosMaximos = 6;
let quantidadeErrosAtual = 0;

function exibirPalavra() {
    const palavraContainer = document.getElementById('palavra');
    palavraContainer.textContent = palavraAtual.join(" ");
    aplicarConfiguracoes(); // Aplica as configurações de estilo
}

function letraClicada(letra) {
    let acertou = false;
    
    for (let i = 0; i < palavraSecreta.length; i++) {
        if (palavraSecreta[i] === letra) {
            palavraAtual[i] = letra;
            acertou = true;
        }
    }

    if (!acertou) {
        quantidadeErrosAtual++;
        if (quantidadeErrosAtual >= quantidadeErrosMaximos) {
            alert("Você perdeu!");
        } else {
            atualizarImagemErro(quantidadeErrosAtual);
        }
    }
    
    exibirPalavra();
    
    if (!palavraAtual.includes("_")) {
        alert("Você venceu!");
    }

    const botao = document.querySelector(`button[onclick="letraClicada('${letra}')"]`);
    botao.disabled = true;
    botao.style.color = 'white';
    botao.style.backgroundColor = acertou ? 'green' : 'red';
}

function atualizarImagemErro(quantidadeErro) {
    document.getElementById('erro').src = `../img/erros/${quantidadeErro}.png`;
}

// Inicializa o jogo ao carregar a página
window.onload = function() {
    exibirPalavra();
}
