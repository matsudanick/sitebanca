// ==================== NAVEGAÇÃO ====================
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('block');
    });
    
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active', 'bg-zinc-900', 'border-red-600', 'text-white');
        el.classList.add('border-zinc-800', 'text-gray-400');
    });

    const selected = document.getElementById(`content-${tabName}`);
    if (selected) {
        selected.classList.remove('hidden');
        selected.classList.add('block');
        selected.style.animation = 'none';
        selected.offsetHeight; /* trigger reflow */
        selected.style.animation = null; 
    }
    
    const btn = document.getElementById(`tab-${tabName}`);
    if (btn) {
        btn.classList.add('active');
        btn.classList.remove('border-zinc-800', 'text-gray-400');
    }
}

// ==================== FORMATADORES ====================
const formatMoney = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// ==================== CALCULADORA GALE ====================
function calcularGale() {
    const input = document.getElementById('galeInput');
    const entrada = parseFloat(input.value);
    
    if(!entrada || entrada <= 0) {
        input.classList.add('border-red-500', 'animate-pulse');
        setTimeout(() => input.classList.remove('border-red-500', 'animate-pulse'), 500);
        return;
    }

    const gale1 = entrada * 2;
    const gale2 = gale1 * 2;

    document.getElementById('valEntrada').innerText = formatMoney(entrada);
    document.getElementById('valGale1').innerText = formatMoney(gale1);
    document.getElementById('valGale2').innerText = formatMoney(gale2);
    
    const resultArea = document.getElementById('galeResult');
    resultArea.classList.remove('hidden');
    resultArea.classList.add('animate-fade-in-down');
}

// ==================== SIMULADOR CORE ====================
const simuladorForm = document.getElementById('simuladorForm');

if (simuladorForm) {
    simuladorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Coleta de Dados
        const bancaInicial = parseFloat(document.getElementById('bancaInicial').value);
        const percentualMeta = parseFloat(document.getElementById('perfilRisco').value); // 0.10, 0.15 ou 0.05
        const sessoesPorDia = parseInt(document.getElementById('sessoesDia').value);
        let duracao = parseInt(document.getElementById('duracao').value);

        // Validações
        if (bancaInicial < 50) {
            alert("⚠️ Atenção: recomenda-se banca mínima de R$150 para ter margem de segurança no Gale.");
        }
        if (sessoesPorDia < 1) {
            alert("Defina pelo menos 1 sessão por dia.");
            return;
        }

        // 2. Cálculos
        let bancaAtual = bancaInicial;
        let htmlTabela = '';
        
        // Juros compostos diários baseados na meta
        
        for (let dia = 1; dia <= duracao; dia++) {
            
            // Meta do dia = Banca Atual * % Escolhida
            let metaDoDia = bancaAtual * percentualMeta;
            
            // Meta por Sessão = Meta do Dia / Numero de Sessões
            let metaPorSessao = metaDoDia / sessoesPorDia;

            let bancaAnterior = bancaAtual;
            bancaAtual += metaDoDia;

            htmlTabela += `
                <tr class="hover:bg-zinc-900 transition-colors border-b border-zinc-800/50 group">
                    <td class="p-4 text-gray-300 font-medium group-hover:text-white">
                        <span class="bg-zinc-800 text-xs px-2 py-1 rounded text-gray-400">Dia ${dia}</span>
                    </td>
                    <td class="p-4 text-gray-400">${formatMoney(bancaAnterior)}</td>
                    
                    <td class="p-4 text-center bg-red-900/5 border-x border-zinc-800/50">
                        <div class="flex flex-col items-center">
                            <span class="text-red-300 font-bold text-sm">${formatMoney(metaPorSessao)}</span>
                            <span class="text-[10px] text-red-500/60 uppercase tracking-wide">em ${sessoesPorDia} Sessões</span>
                        </div>
                    </td>
                    
                    <td class="p-4 text-right text-white font-bold text-lg">${formatMoney(bancaAtual)}</td>
                </tr>
            `;
        }

        // 3. Renderização
        document.getElementById('tabelaResultados').innerHTML = htmlTabela;
        
        // Resumo com animação
        animateValue(document.getElementById('resMetaDiaria'), 0, bancaInicial * percentualMeta, 1000);
        animateValue(document.getElementById('resLucroTotal'), 0, bancaAtual - bancaInicial, 1500);
        animateValue(document.getElementById('resBancaFinal'), 0, bancaAtual, 1500);

        // Mostrar Resultados
        const area = document.getElementById('resultadoArea');
        area.classList.remove('hidden');
        
        // Scroll
        setTimeout(() => {
            area.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}

// Animação de Números
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        obj.innerHTML = formatMoney(value);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Inicialização
window.addEventListener('load', () => {
    switchTab('simulador');
    const inputInit = document.getElementById('bancaInicial');
    if(inputInit) inputInit.focus();
});