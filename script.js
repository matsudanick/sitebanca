// ==================== NAVEGAÇÃO ====================
function switchTab(tabName) {
    // Esconde tudo
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('block');
    });
    
    // Reseta botões
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active', 'bg-zinc-900', 'border-red-600', 'text-white');
        el.classList.add('border-zinc-800', 'text-gray-400');
    });

    // Mostra selecionado
    const selected = document.getElementById(`content-${tabName}`);
    if (selected) {
        selected.classList.remove('hidden');
        selected.classList.add('block');
        
        // Re-trigger animation
        selected.style.animation = 'none';
        selected.offsetHeight; /* trigger reflow */
        selected.style.animation = null; 
    }
    
    // Ativa botão
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
        const taxaRisco = parseFloat(document.getElementById('perfilRisco').value); // 0.05 ou 0.10
        const winsPorDia = parseInt(document.getElementById('entradasDia').value);
        const sessoesPorDia = parseInt(document.getElementById('sessoesDia').value);
        let duracao = parseInt(document.getElementById('duracao').value);
        const tipoPeriodo = document.getElementById('tipoPeriodo').value;

        // Ajuste de Meses
        if (tipoPeriodo === 'meses') duracao *= 30;

        // Validações de Segurança
        if (bancaInicial < 50) {
            alert("⚠️ Atenção Jogador: Bancas abaixo de R$50,00 possuem risco crítico de quebra. Recomendamos iniciar com R$150,00.");
        }
        if (sessoesPorDia > winsPorDia) {
            alert("⚠️ Erro de Lógica: Você não pode ter mais sessões do que vitórias. Aumente seus wins ou diminua as sessões.");
            return;
        }

        // 2. Cálculos Iniciais
        let bancaAtual = bancaInicial;
        let htmlTabela = '';
        
        // Mão Fixa (Baseada na banca inicial para não expor demais no começo)
        const maoFixaInicial = bancaInicial * taxaRisco;

        // 3. Loop de Projeção
        for (let dia = 1; dia <= duracao; dia++) {
            
            // Recalcula entrada com base na banca atual (Juros Compostos)
            let valorEntrada = bancaAtual * taxaRisco;
            
            // Lucro Bruto do Dia (Entrada * Wins)
            let lucroDia = valorEntrada * winsPorDia;
            
            // Meta por Sessão
            let metaPorSessao = lucroDia / sessoesPorDia;

            let bancaAnterior = bancaAtual;
            bancaAtual += lucroDia;

            htmlTabela += `
                <tr class="hover:bg-zinc-900 transition-colors border-b border-zinc-800/50 group">
                    <td class="p-4 text-gray-300 font-medium group-hover:text-white">
                        <span class="bg-zinc-800 text-xs px-2 py-1 rounded text-gray-400">Dia ${dia}</span>
                    </td>
                    <td class="p-4 text-gray-400">${formatMoney(bancaAnterior)}</td>
                    
                    <td class="p-4 text-center bg-red-900/5 border-x border-zinc-800/50">
                        <div class="flex flex-col items-center">
                            <span class="text-red-300 font-bold text-sm">${formatMoney(metaPorSessao)}</span>
                            <span class="text-[10px] text-red-500/60 uppercase tracking-wide">x${sessoesPorDia} Sessões</span>
                        </div>
                    </td>
                    
                    <td class="p-4 text-right text-green-500 font-medium">+${formatMoney(lucroDia)}</td>
                    <td class="p-4 text-right text-white font-bold text-lg">${formatMoney(bancaAtual)}</td>
                </tr>
            `;
        }

        // 4. Renderização
        document.getElementById('tabelaResultados').innerHTML = htmlTabela;
        
        // Cards de Resumo
        animateValue(document.getElementById('resMaoFixa'), 0, maoFixaInicial, 1000);
        animateValue(document.getElementById('resLucroTotal'), 0, bancaAtual - bancaInicial, 1500);
        animateValue(document.getElementById('resBancaFinal'), 0, bancaAtual, 1500);

        // Mostrar Resultados
        const area = document.getElementById('resultadoArea');
        area.classList.remove('hidden');
        
        // Scroll suave
        setTimeout(() => {
            area.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    });
}

// Função de Animação de Números
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
    switchTab('simulador'); // Abre no simulador
});