// ==================== NAVEGAÇÃO ====================
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('block');
    });
    
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active', 'border-red-600', 'text-white', 'bg-zinc-900');
        el.classList.add('border-zinc-800', 'text-gray-400');
    });

    const selected = document.getElementById(`content-${tabName}`);
    if (selected) {
        selected.classList.remove('hidden');
        selected.classList.add('block');
        selected.style.animation = 'none';
        selected.offsetHeight; 
        selected.style.animation = null; 
    }
    
    const btn = document.getElementById(`tab-${tabName}`);
    if (btn) {
        btn.classList.add('active', 'border-red-600', 'text-white', 'bg-zinc-900');
        btn.classList.remove('border-zinc-800', 'text-gray-400');
    }
}

// ==================== HELPERS ====================
const formatMoney = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
    resultArea.classList.add('grid');
    resultArea.classList.add('animate-fade-in-down');
}

// ==================== SIMULADOR ====================
const simuladorForm = document.getElementById('simuladorForm');

if (simuladorForm) {
    simuladorForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Dados
        const bancaInicial = parseFloat(document.getElementById('bancaInicial').value);
        const percentualMeta = parseFloat(document.getElementById('perfilRisco').value);
        const sessoesPorDia = parseInt(document.getElementById('sessoesDia').value);
        let duracao = parseInt(document.getElementById('duracao').value);

        // Validação
        if (!bancaInicial || bancaInicial < 20) {
            alert("Atenção: Banca muito baixa. Recomendamos iniciar com R$50,00.");
            return;
        }
        if (!sessoesPorDia || sessoesPorDia < 1) {
            alert("Defina pelo menos 1 sessão por dia.");
            return;
        }

        // Cálculo
        let bancaAtual = bancaInicial;
        let htmlTabela = '';
        
        for (let dia = 1; dia <= duracao; dia++) {
            let metaDoDia = bancaAtual * percentualMeta;
            let metaPorSessao = metaDoDia / sessoesPorDia;
            let bancaAnterior = bancaAtual;
            bancaAtual += metaDoDia;

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
                                por sessão (x${sessoesPorDia})
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

        document.getElementById('tabelaResultados').innerHTML = htmlTabela;
        animateValue(document.getElementById('resLucroTotal'), 0, bancaAtual - bancaInicial, 1500);
        animateValue(document.getElementById('resBancaFinal'), 0, bancaAtual, 1500);

        const area = document.getElementById('resultadoArea');
        area.classList.remove('hidden');
        setTimeout(() => { area.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 150);
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        obj.innerHTML = formatMoney(value);
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

window.addEventListener('load', () => { switchTab('simulador'); });