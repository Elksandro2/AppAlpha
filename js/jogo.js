let palavraSecreta;
let palavraAtual;

const corLetraIncorreta = "#d1b200";
const corPalavraIncorreta = "#dc3545";
const corPalavraCerta = "#14862f";

let letrasErradas = 0;
let letrasTotaisJogadas = 0;

const quantidadeErrosMaximos = 6;
let quantidadeErrosAtual = 0;
const quantidadeDesafios = 5;
let quantidadeDesafiosJogados = 0;

const contextoSelecionado = localStorage.getItem('contextoSelecionado');

if (!contextoSelecionado) {
    alert("Nenhum contexto selecionado. Voltando à página anterior.");
    window.location.href = 'contextos.html';
} else{
    iniciarDesafio();
}

let palavrasJogadas = [];

function iniciarDesafio() {
    fetch('repositorio-palavras/desafios.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const contextos = data.contextos;
        const contextoAtual = contextos.find(contexto => contexto.nome.toLowerCase() === contextoSelecionado.toLowerCase());
        
        if (!contextoAtual) {
            alert("Contexto não encontrado.");
            window.location.href = 'contextos.html';
            return;
        }

        document.getElementById('contexto-atual').innerHTML = contextoAtual.nome.toUpperCase();

        let desafioSelecionado;
        
        do {
            desafioSelecionado = contextoAtual.desafios[Math.floor(Math.random() * contextoAtual.desafios.length)];
            palavraSecreta = desafioSelecionado.nome;
        } while (palavrasJogadas.includes(palavraSecreta));

        if (!palavrasJogadas.includes(palavraSecreta)) {
            palavrasJogadas.push(palavraSecreta);
        }

        palavraAtual = Array(palavraSecreta.length).fill("_");

        document.getElementById('imagem-desafio').src = desafioSelecionado.imagem;
        document.getElementById('imagem-desafio').onerror = function() {
            this.src = "/img/erros/imagemIndisponivel.jpg";
        };

        console.log("Palavra secreta sorteada:", palavraSecreta);
        exibirPalavra();

        quantidadeErrosAtual = 0;
        atualizarImagemErro(0);
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));
}

function exibirPalavra() {
    const palavraContainer = document.getElementById('palavra');
    palavraContainer.textContent = palavraAtual.join(" ");
    aplicarConfiguracoes();
}

function letraClicada(letra) {
    let acertou = false;
    
    for (let i = 0; i < palavraSecreta.length; i++) {
        const letraNormalizadaPalavra = palavraSecreta[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const letraNormalizadaClicada = letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        if (letraNormalizadaPalavra === letraNormalizadaClicada) {
            palavraAtual[i] = palavraSecreta[i];
            acertou = true;
        }
    }

    letrasTotaisJogadas++;

    const botao = document.querySelector(`button[onclick="letraClicada('${letra}')"]`);
    botao.disabled = true;
    botao.style.color = 'white';
    botao.style.backgroundColor = acertou ? 'green' : 'red';

    exibirPalavra();
    
    if (!acertou) {
        letrasErradas++;
        quantidadeErrosAtual++;
        if (quantidadeErrosAtual >= quantidadeErrosMaximos) {
            mostrarFeedback("Palavra incorreta, continue tentando!", 'palavraIncorreta');
            proximaRodada();
        } else {
            mostrarFeedback("Letra incorreta, tente novamente!", 'letraIncorreta');
            atualizarImagemErro(quantidadeErrosAtual);
        }
    }

    if (!palavraAtual.includes("_")) {
        proximaRodada();
    }
}

function atualizarImagemErro(quantidadeErro) {
    document.getElementById('erro').src = `./img/erros/erro${quantidadeErro}.png`;
}

function proximaRodada() {
    quantidadeDesafiosJogados++;

    if (quantidadeErrosAtual < quantidadeErrosMaximos) {
        mostrarFeedback("Parabéns!", 'palavraCerta');
    }

    if (quantidadeDesafiosJogados < quantidadeDesafios) {
        setTimeout(() => {
            resetarBotoesLetras();
            iniciarDesafio();
        },3000);
    } else {
        setTimeout(() => {
            palavrasJogadas = [];
            finalizarPartida();
        }, 3000);
    }
}

function resetarBotoesLetras() {
    const botoes = document.querySelectorAll('button[onclick^="letraClicada"]');
    
    botoes.forEach(botao => {
        botao.disabled = false;
        botao.style.color = '';
        botao.style.backgroundColor = ''; 
    });
}

document.addEventListener('keydown', function(event) {
    // Verifica se o foco está no campo de input de texto
    const isInputFocused = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';

    // Só processa as teclas se o foco não estiver em um input
    if (!isInputFocused) {
        const letra = event.key.toUpperCase(); // Captura a tecla pressionada

        // Verifica se é uma letra de A a Z
        if (/^[A-Z]$/.test(letra)) {
            // Simula o clique no botão da letra correspondente
            const botao = document.querySelector(`button[onclick="letraClicada('${letra}')"]`);

            if (botao && !botao.disabled) { // Verifica se o botão existe e está habilitado
                botao.click(); // Simula o clique no botão
            }
        }
    }
});

function mostrarFeedback(mensagem, tipo) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.innerHTML = mensagem;

    const feedbackContainer = feedbackElement.parentElement;

    feedbackContainer.style.display = 'block';

    if (tipo === 'letraIncorreta') {
        feedbackContainer.style.backgroundColor = corLetraIncorreta;
    } else if (tipo === 'palavraIncorreta') {
        feedbackContainer.style.backgroundColor = corPalavraIncorreta;
    } else {
        feedbackContainer.style.backgroundColor = corPalavraCerta;
    }

    // Remove a mensagem após o tempo determinado
    setTimeout(() => {
        feedbackContainer.style.display = 'none';
    }, 3000);
}

function finalizarPartida() {
    const pontuacao = calcularPontuacao();

    document.getElementById('pontuacao-jogador').innerHTML = "Sua pontuação: " + pontuacao;

    const nomeForm = document.querySelector('.recuperar-nome');
    nomeForm.style.display = 'block';  // Mostra a caixa de nome

    // Adiciona um listener para o envio do nome
    const form = document.querySelector('.recuperar-nome form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o comportamento padrão de recarregar a página

        const nomeJogador = document.getElementById('nomeJogador').value;

        if (nomeJogador) {
            let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

            ranking.push({ nome: nomeJogador, pontuacao: pontuacao });
            ranking.sort((a, b) => b.pontuacao - a.pontuacao);

            // Mantém apenas o Top 5
            ranking = ranking.slice(0, 5);

            localStorage.setItem("ranking", JSON.stringify(ranking));

            nomeForm.style.display = 'none';

            // Redireciona para a página de contextos após o nome ser salvo
            setTimeout(() => {
                window.location.href = 'contextos.html';
            }, 1000);
        } else {
            alert("Por favor, insira um nome antes de confirmar.");
        }
    });
}

function atualizarRankingNaPagina(ranking) {
    const tabela = document.querySelector(".tabela");

    // Limpa o conteúdo da tabela e adiciona o cabeçalho
    tabela.innerHTML = `
        <tr>
            <th>COLOCAÇÃO</th>
            <th>NOME</th>
            <th>PONTUAÇÃO</th>
        </tr>
    `;

    // Preenche a tabela com os dados do ranking
    for (let i = 0; i < 5; i++) {
        const jogador = ranking[i] || { nome: "-", pontuacao: "-" }; //caso não tenha os 5 jogadores
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${i + 1}°</td>
            <td>${jogador.nome}</td>
            <td>${jogador.pontuacao}</td>
        `;
        tabela.appendChild(linha);
    }
}

// Carrega o ranking ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    const ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    atualizarRankingNaPagina(ranking);
});

function calcularPontuacao() {
    const acertos = letrasTotaisJogadas - letrasErradas;
    const tentativas = letrasTotaisJogadas;
    let pontuacao = 0;
    
    if (acertos > 0){
        pontuacao = (acertos / tentativas) * 100;
    }

    return parseFloat(pontuacao.toFixed(2));
}