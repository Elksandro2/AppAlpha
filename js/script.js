window.onload = function() {
    const tamanhoLetra = localStorage.getItem('tamanhoLetra');
    const textos = document.querySelectorAll('.tamanhoVariavel');
    
    textos.forEach(texto => {
        if (tamanhoLetra === 'maiuscula') {
            texto.style.textTransform = 'uppercase';
        } else if (tamanhoLetra === 'minuscula') {
            texto.style.textTransform = 'lowercase';
        }
    });
}

function mudarLetra() {
    const tamanhoLetra = document.querySelector('input[name="tamanhoLetra"]:checked')?.value;
    
    localStorage.setItem('tamanhoLetra', tamanhoLetra);
    
    const textos = document.querySelectorAll('.tamanhoVariavel');
    
    textos.forEach(texto => {
        if (tamanhoLetra === 'maiuscula') {
            texto.style.textTransform = 'uppercase';
        } else if (tamanhoLetra === 'minuscula') {
            texto.style.textTransform = 'lowercase';
        }
    });
}