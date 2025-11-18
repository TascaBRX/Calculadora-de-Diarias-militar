const tabelaDiarias = {
  A: { capital_principal: 800.0, outras_capitais: 700.0, demais_locais: 650.0 },
  B: { capital_principal: 600.0, outras_capitais: 515.0, demais_locais: 455.0 },
  C: { capital_principal: 510.0, outras_capitais: 450.0, demais_locais: 395.0 },
  D: { capital_principal: 425.0, outras_capitais: 380.0, demais_locais: 335.0 },
  E: { capital_principal: 425.0, outras_capitais: 380.0, demais_locais: 335.0 },
  F: { capital_principal: 355.0, outras_capitais: 315.0, demais_locais: 280.0 },
  G: { capital_principal: 355.0, outras_capitais: 315.0, demais_locais: 280.0 },
};

// Elementos
const postoSelect = document.getElementById("posto");
const localidadeSelect = document.getElementById("localidade");
const dataInicioInput = document.getElementById("data-inicio");
const dataTerminoInput = document.getElementById("data-termino");
const meiaDiariaCheck = document.getElementById("meia-diaria-check"); // Checkbox
const calcularBtn = document.getElementById("calcular-btn");

// Elementos de Resultado
const resValorBase = document.getElementById("res-valor-base");
const resDiasCompletos = document.getElementById("res-dias-completos");
const resMeiasDiarias = document.getElementById("res-meias-diarias");
const resTotalDiarias = document.getElementById("res-total-diarias");
const resValorFinal = document.getElementById("res-valor-final");

calcularBtn.addEventListener("click", () => {
  const posto = postoSelect.value;
  const localidade = localidadeSelect.value;

  if (
    !posto ||
    !localidade ||
    !dataInicioInput.value ||
    !dataTerminoInput.value
  ) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const dataInicio = new Date(dataInicioInput.value + "T00:00:00");
  const dataTermino = new Date(dataTerminoInput.value + "T00:00:00");

  if (dataTermino < dataInicio) {
    alert("A data de término deve ser igual ou posterior à data de início.");
    return;
  }

  let diasInteiras = 0;
  let meiasDiarias = 0;

  // Calcula a diferença exata em dias corridos
  const diffEmMilissegundos = dataTermino.getTime() - dataInicio.getTime();
  // Total de dias envolvidos na missão (ex: seg a qua = 2 pernoites + 1 dia = 3 dias envolvidos logicamente para contagem de retorno)
  // Na lógica anterior usávamos pernoites. Vamos simplificar:

  // Se Inicio == Termino -> 1 dia de evento.
  // Se Inicio != Termino -> diffDias representa pernoites.
  const pernoites = Math.round(diffEmMilissegundos / (1000 * 60 * 60 * 24));

  // --- LÓGICA DE CÁLCULO ---

  if (meiaDiariaCheck.checked) {
    // CASO 1: Usuário marcou que recebe MEIA diária em TODOS os dias
    // Nesse caso, não existem diárias completas.
    // Se a missão tem pernoites (ex: 2 dias), o militar recebe meio dia na ida, meio dia na volta, etc.
    // O total de "eventos" de diária é pernoites + 1 (o dia do retorno).
    diasInteiras = 0;
    meiasDiarias = pernoites + 1;
  } else {
    // CASO 2: Padrão (Integral + Meia no retorno)
    if (pernoites === 0) {
      // Missão bate-volta no mesmo dia
      diasInteiras = 0;
      meiasDiarias = 1;
    } else {
      // Missão com pernoite
      diasInteiras = pernoites; // Dias cheios
      meiasDiarias = 1; // Dia do retorno
    }
  }

  const totalDiariasEquivalentes = diasInteiras + meiasDiarias * 0.5;
  const valorDiariaBase = tabelaDiarias[posto][localidade];
  const valorTotal = totalDiariasEquivalentes * valorDiariaBase;

  // --- EXIBIÇÃO DOS RESULTADOS ---

  // Formatação Moeda
  const formatoMoeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  resValorBase.textContent = formatoMoeda(valorDiariaBase);
  resDiasCompletos.textContent = diasInteiras;
  resMeiasDiarias.textContent = meiasDiarias;
  resTotalDiarias.textContent =
    totalDiariasEquivalentes.toLocaleString("pt-BR"); // Ex: 2,5
  resValorFinal.textContent = formatoMoeda(valorTotal);
});
