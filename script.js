const simuladorForm = document.getElementById('simuladorForm');
const btnCalcular = document.getElementById('btnCalcular');
const btnLimpar = document.getElementById('btnLimpar');
const loadingState = document.getElementById('loadingState');

const resultadoArea = document.getElementById('resultadoArea');
const tabelaResultados = document.getElementById('tabelaResultados');

const resBancaInicial = document.getElementById('resBancaInicial');
const resLucroTotal = document.getElementById('resLucroTotal');
const resBancaFinal = document.getElementById('resBancaFinal');

const TAXA_POR_SESSAO = 0.05; // 5% Fixo

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// Animated counter for numbers
const animateValue = (element, start, end, duration) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = formatCurrency(current);
    }, 16);
};

// Add input validation and real-time feedback
const inputs = document.querySelectorAll('input[type="number"]');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value < 0) {
            input.value = 0;
        }
    });
    
    // Add focus animations
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

const handleCalcular = () => {
    const bancaInicial = parseFloat(document.getElementById('bancaInicial').value) || 0;
    const sessoesPorDia = parseInt(document.getElementById('sessoesPorDia').value) || 0;
    let duracao = parseInt(document.getElementById('duracao').value) || 0;
    const tipoPeriodo = document.getElementById('tipoPeriodo').value;

    if (bancaInicial <= 0 || sessoesPorDia <= 0 || duracao <= 0) {
        // Show error feedback
        btnCalcular.classList.add('animate-shake');
        setTimeout(() => btnCalcular.classList.remove('animate-shake'), 500);
        
        // Alert with style
        const errorMsg = document.createElement('div');
        errorMsg.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in-down';
        errorMsg.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">⚠️</span>
                <div>
                    <p class="font-bold">Valores inválidos!</p>
                    <p class="text-sm">Preencha todos os campos corretamente.</p>
                </div>
            </div>
        `;
        document.body.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 3000);
        return;
    }

    // Show loading state
    resultadoArea.classList.add('hidden');
    loadingState.classList.remove('hidden');
    
    // Change button state
    btnCalcular.disabled = true;
    btnCalcular.querySelector('#btnCalcularText').textContent = '⏳ Calculando...';

    // Simulate calculation delay for effect
    setTimeout(() => {
        if (tipoPeriodo === 'meses') {
            duracao = duracao * 30;
        }

        let bancaAtual = bancaInicial;
        let htmlTabela = ''; 

        for (let dia = 1; dia <= duracao; dia++) {
            htmlTabela += `
                <tr class="day-row bg-gradient-to-r from-red-950/40 to-transparent font-semibold hover:from-red-900/50 transition-all duration-300" data-testid="dia-${dia}-row">
                    <td class="p-4 text-red-100" colspan="5">
                        <div class="flex items-center gap-2">
                            <span class="text-red-400">📅</span>
                            <span>Dia ${dia}</span>
                        </div>
                    </td>
                </tr>
            `;

            for (let sessao = 1; sessao <= sessoesPorDia; sessao++) {
                const bancaInicioSessao = bancaAtual;
                const ganhoSessao = bancaAtual * TAXA_POR_SESSAO;
                bancaAtual += ganhoSessao;

                htmlTabela += `
                    <tr class="hover:bg-red-900/10 transition-all duration-300 border-l-2 border-transparent hover:border-red-500" data-testid="dia-${dia}-sessao-${sessao}-row">
                        <td class="p-4"></td>
                        <td class="p-4 text-sm text-gray-300">
                            <span class="inline-block px-3 py-1 bg-red-950/50 rounded-lg font-medium">Sessão ${sessao}</span>
                        </td>
                        <td class="p-4 text-sm text-gray-300 font-medium">${formatCurrency(bancaInicioSessao)}</td>
                        <td class="p-4 text-sm text-green-400 font-bold">
                            <span class="inline-flex items-center gap-1">
                                <span class="text-green-500">+</span>
                                ${formatCurrency(ganhoSessao)}
                            </span>
                        </td>
                        <td class="p-4 text-sm text-red-400 font-bold">${formatCurrency(bancaAtual)}</td>
                    </tr>
                `;
            }
        }

        tabelaResultados.innerHTML = htmlTabela;

        // Animate the summary values
        animateValue(resBancaInicial, 0, bancaInicial, 1000);
        animateValue(resLucroTotal, 0, bancaAtual - bancaInicial, 1000);
        animateValue(resBancaFinal, 0, bancaAtual, 1000);

        // Hide loading and show results
        loadingState.classList.add('hidden');
        resultadoArea.classList.remove('hidden');
        
        // Reset button
        btnCalcular.disabled = false;
        btnCalcular.querySelector('#btnCalcularText').textContent = '🚀 Calcular Projeção';

        // Smooth scroll to results
        setTimeout(() => {
            resultadoArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Success notification
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in-down';
        successMsg.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">✅</span>
                <div>
                    <p class="font-bold">Projeção calculada!</p>
                    <p class="text-sm">Confira os resultados abaixo.</p>
                </div>
            </div>
        `;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
        
    }, 1500); // Simulate loading time
};

const handleLimpar = () => {
    simuladorForm.reset();
    
    resultadoArea.classList.add('hidden');
    tabelaResultados.innerHTML = '';
    
    // Add clear animation
    const mainCard = document.querySelector('[data-testid="main-card"]');
    mainCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
        mainCard.style.transform = 'scale(1)';
    }, 200);
    
    document.getElementById('bancaInicial').focus();
    
    // Clear notification
    const clearMsg = document.createElement('div');
    clearMsg.className = 'fixed top-4 right-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in-down';
    clearMsg.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">🗑️</span>
            <div>
                <p class="font-bold">Campos limpos!</p>
                <p class="text-sm">Pronto para nova simulação.</p>
            </div>
        </div>
    `;
    document.body.appendChild(clearMsg);
    setTimeout(() => clearMsg.remove(), 2500);
};

// Event Listeners
simuladorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleCalcular();
});

btnLimpar.addEventListener('click', handleLimpar);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Enter to calculate (if form is focused)
    if (e.key === 'Enter' && document.activeElement.tagName === 'INPUT') {
        e.preventDefault();
        handleCalcular();
    }
    
    // Escape to clear
    if (e.key === 'Escape') {
        handleLimpar();
    }
});

// Add parallax effect to glows on mouse move
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    const xPercent = (clientX / innerWidth - 0.5) * 2;
    const yPercent = (clientY / innerHeight - 0.5) * 2;
    
    const glows = document.querySelectorAll('.red-glow');
    glows.forEach((glow, index) => {
        const speed = (index + 1) * 10;
        glow.style.transform = `translate(${xPercent * speed}px, ${yPercent * speed}px)`;
    });
});

// Initial focus animation
window.addEventListener('load', () => {
    document.getElementById('bancaInicial').focus();
});