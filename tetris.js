const canvas = document.getElementById('tetris');
const contexto = canvas.getContext('2d');
contexto.scale(30, 30);

const pecas = [
    [[1, 1, 1, 1]],
    [[1, 1, 1], [0, 1]],
    [[1, 1, 1], [1, 0]],
    [[1, 1], [1, 1]],
    [[0, 1, 1], [1, 1]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 0], [0, 1, 1]]
];

let tabuleiro = Array.from({ length: 19 }, () => Array(10).fill(0));
let pecaAtual = pegarPecaAleatoria();
let posicaoPeca = { x: 3, y: 0 };
let intervaloQueda = 500;
let tempoQueda = 0;

const imagemFundo = new Image();
imagemFundo.src = 'imagem/foto.jpg';

function desenharBackground(){
    ctx.drawImage(imagemFundo, 300,568, canvas.width, canvas.height)
}

function pegarPecaAleatoria() {
    return pecas[Math.floor(Math.random() * pecas.length)];
}

function desenharPeca(peca, deslocamento) {
    peca.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor) {
                contexto.fillStyle = 'blue';
                contexto.fillRect(x + deslocamento.x, y + deslocamento.y, 1, 1);
            }
        });
    });
}

function limparCanvas() {
    contexto.clearRect(0, 0, canvas.width, canvas.height);
}

function desenharTabuleiro() {
    tabuleiro.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor) {
                contexto.fillStyle = 'gray';
                contexto.fillRect(x, y, 1, 1);
            }
        });
    });
}

function colidir(tabuleiro, peca, deslocamento) {
    for (let y = 0; y < peca.length; y++) {
        for (let x = 0; x < peca[y].length; x++) {
            if (peca[y][x] !== 0) {
                const tabuleiroX = x + deslocamento.x;
                const tabuleiroY = y + deslocamento.y;
                if (tabuleiroX < 0 || tabuleiroX >= tabuleiro[0].length || tabuleiroY >= tabuleiro.length || (tabuleiroY >= 0 && tabuleiro[tabuleiroY][tabuleiroX] !== 0)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function mesclar(tabuleiro, peca, deslocamento) {
    peca.forEach((linha, y) => {
        linha.forEach((valor, x) => {
            if (valor) {
                tabuleiro[y + deslocamento.y][x + deslocamento.x] = valor;
            }
        });
    });
}

function removerLinhasCompletas() {
    outer: for (let y = tabuleiro.length - 1; y >= 0; y--) {
        for (let x = 0; x < tabuleiro[y].length; x++) {
            if (tabuleiro[y][x] === 0) {
                continue outer;
            }
        }
        tabuleiro.splice(y, 1);
        tabuleiro.unshift(Array(10).fill(0));
    }
}

function rotacionar(peca) {
    const novaPeca = peca[0].map((valor, indice) => peca.map(linha => linha[indice]).reverse());
    if (!colidir(tabuleiro, novaPeca, posicaoPeca)) {
        pecaAtual = novaPeca;
    }
}

function desenhar() {
    limparCanvas();
    contexto.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height); // Desenha a imagem de fundo
    desenharTabuleiro();
    desenharPeca(pecaAtual, posicaoPeca);
    if (Date.now() - tempoQueda > intervaloQueda) {
        posicaoPeca.y++;
        if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
            posicaoPeca.y--;
            mesclar(tabuleiro, pecaAtual, posicaoPeca);
            removerLinhasCompletas();
            pecaAtual = pegarPecaAleatoria();
            posicaoPeca = { x: 3, y: 0 };
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                alert('Você perdeu! :(');
                tabuleiro = Array.from({ length: 20 }, () => Array(10).fill(0));
            }
        }
        tempoQueda = Date.now();
    }
    requestAnimationFrame(desenhar);
}

document.addEventListener('keydown', (evento) => {
    switch (evento.key) {
        case 'ArrowLeft':
            posicaoPeca.x--;
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                posicaoPeca.x++;
            }
            break;
        case 'ArrowRight':
            posicaoPeca.x++;
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                posicaoPeca.x--;
            }
            break;
        case 'ArrowDown':
            posicaoPeca.y++;
            if (colidir(tabuleiro, pecaAtual, posicaoPeca)) {
                posicaoPeca.y--;
            }
            break;
        case 'ArrowUp':
            rotacionar(pecaAtual);
            break;
    }
});

imagemFundo.onload = function() {
    desenhar();
};
