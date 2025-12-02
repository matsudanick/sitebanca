// ==================== SISTEMA DE NAVEGAÇÃO ====================
function switchTab(tabName) {
    // Esconde todos os conteúdos
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('block');
    });
    
    // Reseta estilo dos botões
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active', 'border-red-600', 'text-white', 'bg-zinc-900');
        el.classList.add('border-zinc-800', 'text-gray-400');
        // Resetar ícones para cor padrão (cinza) se necessário, mas o CSS já trata
    });

    // Mostra o conteúdo selecionado com animação resetada
    const selected = document.getElementById(`content-${tabName}`);
    if (selected) {
        selected.classList.remove('hidden');
        selected.classList.add('block');
        
        // Truque para reiniciar a animação CSS
        selected.style.animation = 'none';
        selected.offsetHeight; /* trigger reflow */
        selected.style.animation = null; 
    }
    
    // Ativa o botão clicado
    const btn = document.getElementById(`tab-${tabName}`);
    if (btn) {
        btn.classList.add('active', 'border-red-600', 'text-white', 'bg-zinc-900');
        btn.classList.remove('border-zinc-800', 'text-gray-400');
    }
}

// ==================== FORMATADORES ====================
const formatMoney = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// ==================== CALCULADORA DE GALE ====================
function calcularGale() {
    const input = document.getElementById('galeInput');
    const entrada = parseFloat(input.value);
    
    if(!entrada || entrada <= 0) {
        // Feedback visual de erro
        input.classList.add('border-red-500', 'animate-pulse');
        setTimeout(() => input.classList.remove('border-red-500', 'animate-pulse'), 500);
        return;
    }

    // Lógica do Sniper: Gale 1 (2x) e Gale 2 (4x da entrada inicial)
    const gale1 = entrada * 2;
    const gale2 = gale1 * 2;

    document.getElementById('valEntrada').innerText = formatMoney(entrada);
    document.getElementById('valGale1').innerText = formatMoney(gale1);
    document.getElementById('valGale2').innerText = formatMoney(gale2);
    
    // Mostra resultados
    const resultArea = document.getElementById('galeResult');
    resultArea.classList.remove('hidden');
    resultArea.classList.add('grid'); // Usa grid do Tailwind
    resultArea.classList.add('animate-fade-in-down');
}

// ==================== SIMULADOR DE META ====================
const simuladorForm = document.getElementById('simuladorForm');

if (simuladorForm) {
    simuladorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Coleta de Dados
        const bancaInicial = parseFloat(document.getElementById('bancaInicial').value);
        const percentualMeta = parseFloat(document.getElementById('perfilRisco').value);
        const sessoesPorDia = parseInt(document.getElementById('sessoesDia').value);
        let duracao = parseInt(document.getElementById('duracao').value);

        // Validações de Segurança
        if (!bancaInicial || bancaInicial < 20) {
            alert("Atenção: Banca muito baixa. O risco de quebra é alto. Recomendamos iniciar com pelo menos R$50.");
            return;
        }
        if (!sessoesPorDia || sessoesPorDia < 1) {
            alert("Defina pelo menos 1 sessão por dia.");
            return;
        }

        // 2. Cálculos
        let bancaAtual = bancaInicial;
        let htmlTabela = '';
        
        // Loop de projeção
        for (let dia = 1; dia <= duracao; dia++) {
            
            // Cálculo da Meta Diária (Juros Compostos: baseada na banca atual)
            let metaDoDia = bancaAtual * percentualMeta;
            
            // DETALHE SOLICITADO: Quanto fazer por sessão?
            let metaPorSessao = metaDoDia / sessoesPorDia;

            let bancaAnterior = bancaAtual;
            bancaAtual += metaDoDia;

            // Construção da linha da tabela
            htmlTabela += `
                <tr class="hover:bg-zinc-900 transition-colors border-b border-zinc-800/50 group">
                    <td class="p-3 pl-4 text-gray-300 font-medium text-xs border-r border-zinc-800/30">
                        Dia <span class="text-white font-bold">${dia}</span>
                    </td>
                    
                    <td class="p-3 text-gray-500 text-xs font-mono border-r border-zinc-800/30">
                        ${formatMoney(bancaAnterior)}
                    </td>
                    
                    <td class="p-3 text-center bg-red-500/5 border-x border-red-500/10 relative group-hover:bg-red-500/10 transition-colors">
                        <div class="flex flex-col items-center justify-center h-full">
                            <span class="text-red-400 font-bold text-xs shadow-red-500/20 drop-shadow-sm">
                                + ${formatMoney(metaPorSessao)}
                            </span>
                            <span class="text-[8px] text-gray-500 uppercase tracking-wider mt-0.5 scale-90">
                                por sessão
                            </span>
                        </div>
                    </td>
                    
                    <td class="p-3 pr-4 text-right">
                        <div class="flex flex-col items-end">
                            <span class="text-white font-bold text-xs">${formatMoney(bancaAtual)}</span>
                            <span class="text-[8px] text-green-500/80 font-medium mt-0.5">
                                (+${formatMoney(metaDoDia)})
                            </span>
                        </div>
                    </td>
                </tr>
            `;
        }

        // 3. Renderização na Tela
        const tabelaBody = document.getElementById('tabelaResultados');
        tabelaBody.innerHTML = htmlTabela;
        
        // Atualiza Cards de Resumo com Animação
        animateValue(document.getElementById('resLucroTotal'), 0, bancaAtual - bancaInicial, 1500);
        animateValue(document.getElementById('resBancaFinal'), 0, bancaAtual, 1500);

        // Mostra a área de resultados
        const area = document.getElementById('resultadoArea');
        area.classList.remove('hidden');
        
        // Scroll suave até o resultado (melhor UX mobile)
        setTimeout(() => {
            area.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    });
}

// Helper: Animação de Contagem de Números
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

// Inicialização: Abre a aba do simulador por padrão
window.addEventListener('load', () => {
    switchTab('simulador');
});