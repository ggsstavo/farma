// ============================================================
//  DETALHES DE CADA PRODUTO (página do produto)
//  hl   : 4 destaques curtos (benefícios / diferenciais)
//  who  : "Indicado para" – frase curta
//  use  : modo de uso resumido (sempre remete ao rótulo/bula)
//  Textos de exemplo: revise com o fabricante / bula antes de publicar.
//  Evite prometer cura ou resultados de saúde (regras da Anvisa).
// ============================================================
const BULA = 'Siga as orientações do rótulo ou da bula e, em caso de dúvida, consulte um profissional de saúde.';
export const details = {
  'vitamina-c-1000': { hl: ['1000 mg por comprimido', '60 comprimidos: rende ao longo de semanas', 'Fácil de incluir na rotina diária', 'Contribui para o bem-estar do dia a dia'], who: 'Quem quer reforçar a rotina de vitaminas.', use: 'Tome conforme a recomendação do rótulo. ' + BULA },
  'multivitaminico-a-z': { hl: ['Vitaminas e minerais em uma única cápsula', '60 cápsulas por frasco', 'Praticidade: um produto, vários nutrientes', 'Ideal para quem tem rotina corrida'], who: 'Quem busca praticidade para complementar a alimentação.', use: 'Tome conforme a recomendação do rótulo. ' + BULA },
  'omega-3-1000': { hl: ['1000 mg por cápsula', 'Fonte de EPA e DHA', '60 cápsulas por frasco', 'Cápsulas fáceis de engolir'], who: 'Quem quer incluir ômega 3 na rotina.', use: 'Tome conforme a recomendação do rótulo. ' + BULA },
  'colageno-hidrolisado': { hl: ['Pote de 300 g que rende muitas porções', 'Em pó: dissolve em água ou suco', 'Prático de preparar em segundos', 'Fácil de levar para o trabalho ou viagens'], who: 'Quem gosta de praticidade no preparo.', use: 'Dissolva a porção indicada no rótulo em água ou suco. ' + BULA },
  'vitamina-d3-2000': { hl: ['2000 UI por cápsula', '60 cápsulas por frasco', 'Contribui para a saúde dos ossos', 'Apoio para a imunidade'], who: 'Quem quer complementar a vitamina D da rotina.', use: 'Tome conforme a recomendação do rótulo. ' + BULA },
  'protetor-solar-fps50': { hl: ['FPS 50 com proteção UVA/UVB', 'Toque seco: não deixa a pele pegajosa', 'Frasco de 200 ml: rende para a família toda', 'Uso diário, na praia ou na cidade'], who: 'Toda a família, no dia a dia e no lazer.', use: 'Aplique generosamente antes da exposição ao sol e reaplique conforme indicação do rótulo.' },
  'hidratante-facial': { hl: ['Com ácido hialurônico', 'Textura leve, de rápida absorção', 'Para usar de manhã e à noite', 'Pote de 50 g'], who: 'Quem quer hidratar o rosto com textura leve.', use: 'Aplique sobre o rosto limpo, conforme o rótulo.' },
  'protetor-labial-fps30': { hl: ['FPS 30 para os lábios', 'Hidrata e protege do ressecamento', 'Pequeno: cabe no bolso ou na bolsa', 'Bisnaga de 10 g'], who: 'Quem sente os lábios ressecados ou se expõe ao sol.', use: 'Aplique sempre que necessário, conforme o rótulo.' },
  'alcool-em-gel-70': { hl: ['Álcool 70% para higienização das mãos', 'Frasco com pump: dosagem prática', '500 g: dura bastante', 'Ideal para casa, trabalho e carro'], who: 'Quem precisa higienizar as mãos fora de casa.', use: 'Aplique nas mãos e esfregue até secar. Uso externo. Mantenha longe de chamas e fora do alcance de crianças.' },
  'shampoo-anticaspa': { hl: ['Limpeza profunda do couro cabeludo', 'Sensação de frescor', 'Frasco de 400 ml', 'Uso regular, conforme o rótulo'], who: 'Quem sofre com caspa e quer cuidar do couro cabeludo.', use: 'Aplique no cabelo molhado, massageie e enxágue, conforme o rótulo.' },
  'creme-dental-clareador': { hl: ['Proteção anticáries', 'Ajuda a deixar o sorriso mais brilhante', 'Hálito fresco', 'Tubo de 90 g'], who: 'Quem quer cuidar do sorriso no dia a dia.', use: 'Escove os dentes após as refeições, conforme o rótulo.' },
  'fralda-descartavel-m': { hl: ['Miolo super absorvente', 'Toque macio para a pele do bebê', '40 unidades por pacote', 'Tamanho M'], who: 'Bebês que usam o tamanho M (confira a faixa de peso na embalagem).', use: 'Troque com frequência e confira o ajuste da embalagem.' },
  'lenco-umedecido-100': { hl: ['Suave e sem álcool', '100 unidades por pacote', 'Ideal para trocas e para a bolsa do bebê', 'Praticidade na limpeza do dia a dia'], who: 'Mamães e papais que querem praticidade nas trocas.', use: 'Use para limpeza externa, conforme o rótulo.' },
  'termometro-digital': { hl: ['Leitura rápida', 'Sinal sonoro ao finalizar a medição', 'Fácil de usar e de guardar', 'Para toda a família'], who: 'Quem quer ter um termômetro sempre à mão em casa.', use: 'Siga o manual de instruções do produto.' },
  'medidor-pressao-braco': { hl: ['Medição automática no braço', 'Com memória das últimas medições', 'Tela de leitura fácil', 'Praticidade para acompanhar em casa'], who: 'Quem acompanha a pressão arterial em casa (com orientação do seu médico).', use: 'Siga o manual do aparelho. Ele não substitui consulta médica.' },
  'paracetamol-750': { hl: ['Medicamento isento de prescrição', '750 mg por comprimido', 'Caixa com 20 comprimidos', 'Leia a bula antes de usar'], who: 'Conforme indicação da bula.', use: 'Use apenas conforme a bula. ' + BULA },
  'soro-fisiologico-500': { hl: ['Solução estéril 0,9%', 'Frasco de 500 ml', 'Para higiene nasal e ocular', 'Leia a bula antes de usar'], who: 'Conforme indicação da bula.', use: 'Use apenas conforme a bula. ' + BULA },
};
