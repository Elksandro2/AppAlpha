let palavraSecreta;
let palavraAtual;

const COR_LETRA_INCORRETA = "#d1b200";
const COR_PALAVRA_INCORRETA = "#dc3545";
const COR_PALAVRA_CERTA = "#14862f";

let letrasErradas = 0;
let letrasTotaisJogadas = 0;

const QUANTIDADE_ERROS_MAXIMOS = 6;
let quantidadeErrosAtual = 0;
const QUANTIDADE_DESAFIOS = 5;
let quantidadeDesafiosJogados = 0;

const CONTEXTO_SELECIONADO = localStorage.getItem('contextoSelecionado');

if (!CONTEXTO_SELECIONADO) {
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
        const CONTEXTOS = data.contextos;
        const CONTEXTO_ATUAL = CONTEXTOS.find(contexto => contexto.nome.toLowerCase() === CONTEXTO_SELECIONADO.toLowerCase());
        
        if (!CONTEXTO_ATUAL) {
            alert("Contexto não encontrado.");
            window.location.href = 'contextos.html';
            return;
        }

        document.getElementById('contexto-atual').innerHTML = CONTEXTO_ATUAL.nome.toUpperCase();

        let desafioSelecionado;
        
        do {
            desafioSelecionado = CONTEXTO_ATUAL.desafios[Math.floor(Math.random() * CONTEXTO_ATUAL.desafios.length)];
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
    const PALAVRA_CONTAINER = document.getElementById('palavra');
    PALAVRA_CONTAINER.textContent = palavraAtual.join(" ").toUpperCase();
    aplicarConfiguracoes();
}

function letraClicada(letra) {
    let acertou = false;
    
    for (let i = 0; i < palavraSecreta.length; i++) {
        const LETRA_NORMALIZADA_PALAVRA = palavraSecreta[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const LETRA_NORMALIZADA_CLICADA = letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        if (LETRA_NORMALIZADA_PALAVRA === LETRA_NORMALIZADA_CLICADA) {
            palavraAtual[i] = palavraSecreta[i];
            acertou = true;
        }
    }

    letrasTotaisJogadas++;

    const BOTAO = document.querySelector(`button[onclick="letraClicada('${letra}')"]`);
    BOTAO.disabled = true;
    BOTAO.style.color = 'white';
    BOTAO.style.backgroundColor = acertou ? 'green' : 'red';

    exibirPalavra();
    
    if (!acertou) {
        letrasErradas++;
        quantidadeErrosAtual++;
        if (quantidadeErrosAtual >= QUANTIDADE_ERROS_MAXIMOS) {
            mostrarFeedback("Palavra incorreta!", 'palavraIncorreta');
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
    desabilitarBotoes();

    quantidadeDesafiosJogados++;

    if (quantidadeErrosAtual < QUANTIDADE_ERROS_MAXIMOS) {
        mostrarFeedback("Parabéns!", 'palavraCerta');
    }

    if (quantidadeDesafiosJogados < QUANTIDADE_DESAFIOS) {
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
    const BOTOES = document.querySelectorAll('button[onclick^="letraClicada"]');
    
    BOTOES.forEach(botao => {
        botao.disabled = false;
        botao.style.color = '';
        botao.style.backgroundColor = ''; 
    });
}

document.addEventListener('keydown', function(event) {
    // Verifica se o foco está no campo de input de texto
    const IS_INPUT_FOCUSED = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';

    // Só processa as teclas se o foco não estiver em um input
    if (!IS_INPUT_FOCUSED) {
        const LETRA = event.key.toUpperCase(); // Captura a tecla pressionada

        // Verifica se é uma letra de A a Z
        if (/^[A-Z]$/.test(LETRA)) {
            // Simula o clique no botão da letra correspondente
            const BOTAO = document.querySelector(`button[onclick="letraClicada('${LETRA}')"]`);

            if (BOTAO && !BOTAO.disabled) { // Verifica se o botão existe e está habilitado
                BOTAO.click(); // Simula o clique no botão
            }
        }
    }
});

function mostrarFeedback(mensagem, tipo) {
    const FEEDBACK_ELEMENTO = document.getElementById('feedback');
    FEEDBACK_ELEMENTO.innerHTML = mensagem;

    const FEEDBACK_CONTAINER = FEEDBACK_ELEMENTO.parentElement;

    FEEDBACK_CONTAINER.style.display = 'block';

    if (tipo === 'letraIncorreta') {
        FEEDBACK_CONTAINER.style.backgroundColor = COR_LETRA_INCORRETA;
    } else if (tipo === 'palavraIncorreta') {
        FEEDBACK_CONTAINER.style.backgroundColor = COR_PALAVRA_INCORRETA;
    } else {
        FEEDBACK_CONTAINER.style.backgroundColor = COR_PALAVRA_CERTA;
    }

    // Remove a mensagem após o tempo determinado
    setTimeout(() => {
        FEEDBACK_CONTAINER.style.display = 'none';
    }, 5000);
}

function finalizarPartida() {
    desabilitarBotoes();

    const PONTUACAO = calcularPontuacao();

    document.getElementById('pontuacao-jogador').innerHTML = "Sua pontuação: " + PONTUACAO;

    const NOME_FORM = document.querySelector('.recuperar-nome');
    NOME_FORM.style.display = 'block';

    // Adiciona um listener para o envio do nome
    const FORM = document.querySelector('.recuperar-nome form');
    FORM.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o comportamento padrão de recarregar a página

        const NOME_JOGADOR = document.getElementById('nomeJogador').value;

        if (NOME_JOGADOR) {
            let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

            ranking.push({ nome: NOME_JOGADOR, pontuacao: PONTUACAO });
            ranking.sort((a, b) => b.pontuacao - a.pontuacao);

            // Mantém apenas o Top 5
            ranking = ranking.slice(0, 5);
            
            localStorage.setItem("ranking", JSON.stringify(ranking));

            NOME_FORM.style.display = 'none';

            // Redireciona para a página de contextos após o nome ser salvo
            setTimeout(() => {
                if (ranking.some(jogador => jogador.nome === NOME_JOGADOR)){
                    window.location.href = "ranking.html";
                } else {
                    window.location.href = "contextos.html";
                }
            }, 1000);
        } else {
            alert("Por favor, insira um nome antes de confirmar.");
        }
    });
}

function calcularPontuacao() {
    const ACERTOS = letrasTotaisJogadas - letrasErradas;
    
    if (ACERTOS > 0) {
        pontuacao = (ACERTOS / letrasTotaisJogadas) * 100;
        return parseFloat(pontuacao.toFixed(2));
    }
    
    return 0;
}

function desabilitarBotoes() {
    const BOTOES = document.querySelectorAll('button[onclick^="letraClicada"]');
    
    BOTOES.forEach(botao => {
        botao.disabled = true;
    });
}

function exibirOcultarBotoes() {
    const BOTOES = document.querySelectorAll('.hamburguer-botoes');

    BOTOES.forEach(botao => {
        if (botao.style.display == "block") {
            botao.style.display = "none";
        } else {
            botao.style.display = "block";
        }
    });
}

let urlDestino;

function mostrarConfirmacaoSairTela(texto, url) {
    const CONFIRMAR = document.querySelector('.confirmacao-sair-tela');
    CONFIRMAR.style.display = "block";
    
    const PARAGRAFO = document.getElementById('texto-confirmacao');
    PARAGRAFO.innerHTML = texto;
    
    urlDestino = url;
}

function esconderConfirmacaoSairTela() {
    const CONFIRMAR = document.querySelector('.confirmacao-sair-tela');
    CONFIRMAR.style.display = "none";
}

function redirecionar() {
    if (urlDestino) {
        window.location.href = urlDestino;
    }
}

