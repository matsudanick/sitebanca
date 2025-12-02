// --- Lógica de Navegação entre Abas ---
function switchTab(tabName) {
    // Esconder todos os conteúdos
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('block'));
    
    // Remover classe active dos botões
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('active', 'bg-red-900/20', 'border-red-600', 'text-white');
        el.classList.add('border-transparent', 'text-gray-400');
    });

    // Mostrar aba selecionada
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    document.getElementById(`content-${tabName}`).classList.add('block');
    
    // Ativar botão
    const btn = document.getElementById(`tab-${tabName}`);
    btn.classList.add('active', 'bg-red-900/20', 'border-red-600', 'text-white');
    btn.classList.remove('border-transparent', 'text-gray-400');
}

// --- Calculadora de Martingale (Gale) ---
function calcularGale() {
    const entrada = parseFloat(document.getElementById('galeInput').value);
    
    if(!entrada || entrada <= 0) {
        alert("Digite um valor de entrada válido!");
        return;
    }

    const gale1 = entrada * 2;
    const gale2 = gale1 * 2;

    document.getElementById('valEntrada').textContent = formatMoney(entrada);
    document.getElementById('valGale1').textContent = formatMoney(gale1);
    document.getElementById('valGale2').textContent = formatMoney(gale2);
    
    document.getElementById('galeResult').classList.remove('hidden');
}

// --- Simulador de Banca (Lógica Financeira) ---
const form = document.getElementById('simuladorForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Inputs
    const bancaInicial = parseFloat(document.getElementById('bancaInicial').value);
    const taxaRisco = parseFloat(document.getElementById('perfilRisco').value); // 0.05 ou 0.10
    const entradasDia = parseInt(document.getElementById('entradasDia').value);
    let duracao = parseInt(document.getElementById('duracao').value);
    const tipoPeriodo = document.getElementById('tipoPeriodo').value;

    if (tipoPeriodo === 'meses') duracao *= 30;

    // Validação básica baseada no vídeo
    if (bancaInicial < 50) {
        alert("Atenção: A banca mínima recomendada é R$50,00 (Ideal: R$150,00).");
    }

    // Cálculo da Mão Fixa (Baseado no vídeo: % da banca inicial)
    // No vídeo ela diz: "Mão fixa = Porcentagem x Banca". 
    // Opção conservadora: Se a banca cresce, a mão fixa aumenta? 
    // O simulador geralmente assume Juros Compostos (mão fixa atualizada diariamente).
    
    let bancaAtual = bancaInicial;
    let html = '';

    // Loop dos Dias
    for (let dia = 1; dia <= duracao; dia++) {
        // Cálculo do valor da entrada para o dia (Juros Compostos Diários)
        // Valor da entrada = Banca Atual * Taxa de Risco (ex: 5%)
        let valorEntrada = bancaAtual * taxaRisco;
        
        // Lucro do dia: Supondo que você acerte a meta (Ex: 3 a 5 wins líquidos)
        // No vídeo ela diz para parar com a meta batida. 
        // Vamos supor que a "Meta" seja ganhar o valor de 'entradasDia' vezes o valor da entrada.
        // Ex: 5 entradas de R$7.50 = Lucro de R$37.50
        
        let lucroDia = valorEntrada * entradasDia; 
        
        // Atualiza a banca
        let bancaAnterior = bancaAtual;
        bancaAtual += lucroDia;

        html += `
            <tr class="hover:bg-red-900/10 transition-colors border-b border-red-900/10">
                <td class="p-4 font-bold text-red-400">Dia ${dia}</td>
                <td class="p-4 text-gray-300">${formatMoney(bancaAnterior)}</td>
                <td class="p-4 text-green-400 font-medium">+${formatMoney(lucroDia)} <span class="text-xs text-gray-500">(${entradasDia} wins)</span></td>
                <td class="p-4 text-right font-bold text-white">${formatMoney(bancaAtual)}</td>
            </tr>
        `;
    }

    // Renderizar
    document.getElementById('tabelaResultados').innerHTML = html;
    document.getElementById('resBancaFinal').innerText = formatMoney(bancaAtual);
    document.getElementById('resLucroTotal').innerText = formatMoney(bancaAtual - bancaInicial);
    
    // Mostra qual seria a mão inicial recomendada
    document.getElementById('resMaoFixa').innerText = formatMoney(bancaInicial * taxaRisco);

    // Mostrar área de resultado
    document.getElementById('resultadoArea').classList.remove('hidden');
    document.getElementById('resultadoArea').scrollIntoView({ behavior: 'smooth' });
});

// Helper de Formatação
function formatMoney(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}