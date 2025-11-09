// --- Referências aos Elementos do DOM ---
// O script é carregado no final do body, então os elementos já existem.
const simuladorForm = document.getElementById('simuladorForm');
const btnCalcular = document.getElementById('btnCalcular');
const btnLimpar = document.getElementById('btnLimpar');

const resultadoArea = document.getElementById('resultadoArea');
const tabelaResultados = document.getElementById('tabelaResultados');

// Spans do Resumo
const resBancaInicial = document.getElementById('resBancaInicial');
const resLucroTotal = document.getElementById('resLucroTotal');
const resBancaFinal = document.getElementById('resBancaFinal');

// --- Constantes ---
const TAXA_POR_SESSAO = 0.05; // 5% Fixo

// --- Formatador de Moeda (R$) ---
const formatCurrency = (value) => {
    // Formata o valor como moeda brasileira (BRL)
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// --- Função Principal: handleCalcular ---
const handleCalcular = () => {
    // 1. Obter Inputs
    // Usa || 0 para garantir que o valor seja um número, mesmo se o campo estiver vazio
    const bancaInicial = parseFloat(document.getElementById('bancaInicial').value) || 0;
    const sessoesPorDia = parseInt(document.getElementById('sessoesPorDia').value) || 0;
    let duracao = parseInt(document.getElementById('duracao').value) || 0;
    const tipoPeriodo = document.getElementById('tipoPeriodo').value;

    // 2. Validação Simples
    if (bancaInicial <= 0 || sessoesPorDia <= 0 || duracao <= 0) {
        console.error("Valores inválidos ou incompletos.");
        return;
    }

    // 3. Normalizar Duração
    // Converte meses em dias (assumindo 30 dias por mês)
    if (tipoPeriodo === 'meses') {
        duracao = duracao * 30;
    }

    // 4. Inicializar Simulação
    let bancaAtual = bancaInicial;
    let htmlTabela = ''; // Variável para construir o HTML da tabela

    // 5. Loop da Simulação (Dias e Sessões)
    for (let dia = 1; dia <= duracao; dia++) {
        
        // Adiciona uma linha de cabeçalho para o Dia
        htmlTabela += `
            <tr class="bg-gray-700/60 font-medium">
                <td class="p-3 text-white" colspan="5">
                    Dia ${dia}
                </td>
            </tr>
        `;

        // Loop interno para as sessões
        for (let sessao = 1; sessao <= sessoesPorDia; sessao++) {
            
            const bancaInicioSessao = bancaAtual;
            // Cálculo dos Juros Compostos
            const ganhoSessao = bancaAtual * TAXA_POR_SESSAO;
            bancaAtual += ganhoSessao;

            // Adiciona a linha da sessão na tabela
            htmlTabela += `
                <tr class="hover:bg-gray-700/40 transition-colors duration-150">
                    <td class="p-3"></td> <!-- Coluna vazia para alinhar com 'Dia' -->
                    <td class="p-3 text-sm text-gray-300">${sessao}</td>
                    <td class="p-3 text-sm text-gray-300">${formatCurrency(bancaInicioSessao)}</td>
                    <td class="p-3 text-sm text-green-400 font-medium">+ ${formatCurrency(ganhoSessao)}</td>
                    <td class="p-3 text-sm text-white font-medium">${formatCurrency(bancaAtual)}</td>
                </tr>
            `;
        }
    }

    // 6. Atualizar a UI (Resultados)
    
    // Injeta o HTML na tabela
    tabelaResultados.innerHTML = htmlTabela;

    // Atualiza o Resumo
    resBancaInicial.textContent = formatCurrency(bancaInicial);
    resLucroTotal.textContent = formatCurrency(bancaAtual - bancaInicial);
    resBancaFinal.textContent = formatCurrency(bancaAtual);

    // Exibe a área de resultados
    resultadoArea.classList.remove('hidden');

    // Rola a tela suavemente para mostrar os resultados
    resultadoArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// --- Função: handleLimpar ---
const handleLimpar = () => {
    // Reseta todos os campos do formulário
    simuladorForm.reset();
    
    // Oculta a área de resultados
    resultadoArea.classList.add('hidden');
    tabelaResultados.innerHTML = '';
    
    // Foca no primeiro input para usabilidade
    document.getElementById('bancaInicial').focus();
};

// --- Event Listeners ---

// Listener para o Submit do Formulário (botão "Calcular Projeção")
simuladorForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o comportamento padrão de submit (recarregar a página)
    handleCalcular();
});

// Listener para o Botão Limpar
btnLimpar.addEventListener('click', handleLimpar);