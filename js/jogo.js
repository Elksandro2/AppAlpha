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
    //palavraContainer.textContent = palavraAtual.join(" ");
    palavraContainer.textContent = palavraAtual.map(letra => letra.toUpperCase()).join(" ");
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

    const botao = document.querySelector(`button[onclick="letraClicada('${letra}')"]`);
    botao.disabled = true;
    botao.style.color = 'white';
    botao.style.backgroundColor = acertou ? 'green' : 'red';

    exibirPalavra();
    
    if (!acertou) {
        quantidadeErrosAtual++;
        if (quantidadeErrosAtual >= quantidadeErrosMaximos) {
            mostrarFeedback("Palavra incorreta, continue tentando!", 'erro');
            proximaRodada();
        } else {
            mostrarFeedback("Letra incorreta, tente novamente!", 'erro');
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
        mostrarFeedback("Parabéns, continue assim!", 'sucesso');
    }

    if (quantidadeDesafiosJogados < quantidadeDesafios) {
        setTimeout(() => {
            resetarBotoesLetras();
            iniciarDesafio();
        },3000);
    } else {
        setTimeout(() => {
            palavrasJogadas = [];
            window.location.href = 'contextos.html';
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
    const letra = event.key.toUpperCase(); // Captura a tecla pressionada

    // Verifica se é uma letra de A a Z
    if (/^[A-Z]$/.test(letra)) {
        // Simula o clique no botão da letra correspondente
        const botao = document.querySelector(`button[onclick="letraClicada('${letra}')"]`);

        if (botao && !botao.disabled) { // Verifica se o botão existe e está habilitado
            botao.click(); // Simula o clique no botão
        }
    }
});

function mostrarFeedback(mensagem, tipo) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.innerHTML = mensagem;

    const feedbackContainer = feedbackElement.parentElement; // Seleciona o contêiner principal (div)
    feedbackContainer.classList.remove('oculto', 'erro');
    feedbackContainer.classList.add('visivel');

    if (tipo === 'erro') {
        feedbackContainer.classList.add('erro');
    } else {
        feedbackContainer.classList.remove('erro');
    }

    // Remove a mensagem após o tempo determinado, exceto se for vitória
    setTimeout(() => {
        feedbackContainer.classList.add('oculto');
        feedbackContainer.classList.remove('visivel');
    }, 3000);
}