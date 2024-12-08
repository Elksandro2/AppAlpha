window.onload = function() {
    aplicarConfiguracoes();
}

const VISUALIZAR = document.getElementById('visualizar-letras');

function salvarConfiguracoes() {
    const TAMANHO_LETRA = document.querySelector('input[name="tamanhoLetra"]:checked')?.value;
    const TIPO_LETRA = document.querySelector('input[name="tipoLetra"]:checked')?.value;
    
    localStorage.setItem('tamanhoLetra', TAMANHO_LETRA);
    localStorage.setItem('tipoLetra', TIPO_LETRA);

    aplicarConfiguracoes();
    
    window.location.href = 'index.html';
}

function aplicarConfiguracoes() {  
    const TAMANHO_LETRA = localStorage.getItem('tamanhoLetra');
    const TIPO_LETRA = localStorage.getItem('tipoLetra');

    const LETRAS = document.querySelectorAll('.letraVariavel');
    LETRAS.forEach(letra => {
        if (TAMANHO_LETRA === 'maiuscula') {
            letra.style.textTransform = 'uppercase';
        } else if (TAMANHO_LETRA === 'minuscula') {
            letra.style.textTransform = 'lowercase';
        }

        if (TIPO_LETRA === 'cursiva') {
            letra.classList.add('fonte-cursiva');
        } else {
            letra.classList.remove('fonte-cursiva');
        }
    });

    // Marcar os botões de rádio correspondentes
    if (TAMANHO_LETRA) {
        document.querySelector(`input[name="tamanhoLetra"][value="${TAMANHO_LETRA}"]`).checked = true;
    }
    if (TIPO_LETRA) {
        document.querySelector(`input[name="tipoLetra"][value="${TIPO_LETRA}"]`).checked = true;
    }
}

function letraMaiuscula() {
    VISUALIZAR.style.textTransform = 'uppercase';
}

function letraMinuscula() {
    VISUALIZAR.style.textTransform = 'lowercase';
}

function letraCursiva() {
    VISUALIZAR.classList.add('fonte-cursiva');
}

function letraBastao() {
    VISUALIZAR.classList.remove('fonte-cursiva');
}