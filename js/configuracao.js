window.onload = function() {
    aplicarConfiguracoes();
}

function mudarLetra() {
    const tamanhoLetra = document.querySelector('input[name="tamanhoLetra"]:checked')?.value;
    const tipoLetra = document.querySelector('input[name="tipoLetra"]:checked')?.value;
    
    localStorage.setItem('tamanhoLetra', tamanhoLetra);
    localStorage.setItem('tipoLetra', tipoLetra);

    aplicarConfiguracoes();
}

function aplicarConfiguracoes() {
    const tamanhoLetra = localStorage.getItem('tamanhoLetra');
    const tipoLetra = localStorage.getItem('tipoLetra');
    const textos = document.querySelectorAll('.letraVariavel');
    
    textos.forEach(texto => {
        if (tamanhoLetra === 'maiuscula') {
            texto.style.textTransform = 'uppercase';
        } else if (tamanhoLetra === 'minuscula') {
            texto.style.textTransform = 'lowercase';
        }

        if (tipoLetra === 'cursiva') {
            texto.classList.add('fonte-cursiva');
        } else {
            texto.classList.remove('fonte-cursiva');
        }
    });
}
