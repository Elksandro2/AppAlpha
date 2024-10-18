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
            alert("Você perdeu!");
            proximaRodada();
        } else {
            atualizarImagemErro(quantidadeErrosAtual);
        }
    }

    if (!palavraAtual.includes("_")) {
        proximaRodada();
    }
}

function atualizarImagemErro(quantidadeErro) {
    document.getElementById('erro').src = `../img/erros/erro${quantidadeErro}.png`;
}

function proximaRodada() {
    quantidadeDesafiosJogados++;

    if (quantidadeDesafiosJogados < quantidadeDesafios) {
        setTimeout(() => {
            resetarBotoesLetras();
            iniciarDesafio();
        },1000); // Aguardar 1 segundo (1000 milissegundos)
    } else {
        setTimeout(() => {
            alert("Fim da partida! Todos os desafios foram jogados.");
            palavrasJogadas = [];
            window.location.href = 'contextos.html';
        }, 2000);
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
