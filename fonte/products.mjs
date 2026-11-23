// ============================================================
//  CATÁLOGO  —  preços e textos são EXEMPLOS. Troque pelos reais.
//  msg: mensagem que abre no WhatsApp ({preco} vira o preço atual).
//  best: 1, 2, 3 = os três "mais vendidos" mostrados na página inicial.
//  old: preço "de" (só use se for real — Código de Defesa do Consumidor).
// ============================================================
export const categories = [
  { id: 'vitaminas', name: 'Vitaminas e Suplementos', icon: 'capsules' },
  { id: 'dermo', name: 'Pele e Proteção Solar', icon: 'sun' },
  { id: 'higiene', name: 'Higiene e Cuidados', icon: 'pump-soap' },
  { id: 'bebe', name: 'Bebê e Mamãe', icon: 'baby' },
  { id: 'aparelhos', name: 'Saúde em Casa', icon: 'heart-pulse' },
  { id: 'mip', name: 'Medicamentos sem receita', icon: 'pills' },
];

export const products = [
  // ---------- Vitaminas e Suplementos ----------
  {
    slug: 'vitamina-c-1000', cat: 'vitaminas', best: 1,
    name: 'Vitamina C 1000 mg', size: 'Frasco com 60 comprimidos',
    short: 'Apoio diário para a imunidade e a disposição.',
    price: 39.9, old: 49.9, type: 'bottle', c: '#ff9f1c', d: '#e07b00',
    msg: 'Olá! 👋 Tenho interesse em comprar a *Vitamina C 1000 mg (60 comprimidos)* por {preco}. Ainda tem disponível? Qual o prazo de entrega para o meu endereço?',
  },
  {
    slug: 'multivitaminico-a-z', cat: 'vitaminas',
    name: 'Multivitamínico A–Z', size: 'Frasco com 60 cápsulas',
    short: 'Vitaminas e minerais essenciais em uma única cápsula.',
    price: 54.9, old: null, type: 'bottle', c: '#2fbf71', d: '#1f8f52',
    msg: 'Oi, tudo bem? Quero cuidar melhor da minha rotina e me interessei pelo *Multivitamínico A–Z (60 cápsulas)* por {preco}. Pode me passar a disponibilidade e as formas de pagamento?',
  },
  {
    slug: 'omega-3-1000', cat: 'vitaminas',
    name: 'Ômega 3 1000 mg', size: 'Frasco com 60 cápsulas',
    short: 'Fonte de EPA e DHA para o dia a dia.',
    price: 59.9, old: 74.9, type: 'bottle', c: '#2d9cdb', d: '#1d6fa8',
    msg: 'Olá! Vi o *Ômega 3 1000 mg (60 cápsulas)* no site por {preco} e quero garantir o meu. Pode separar uma unidade para mim e me explicar como funciona a entrega?',
  },
  {
    slug: 'colageno-hidrolisado', cat: 'vitaminas', best: 3,
    name: 'Colágeno Hidrolisado em pó', size: 'Pote de 300 g',
    short: 'Fácil de preparar: dissolva em água ou suco.',
    price: 69.9, old: 89.9, type: 'jar', c: '#f26b8a', d: '#c24464',
    msg: 'Olá! 😊 Gostaria de comprar o *Colágeno Hidrolisado em pó (300 g)* por {preco}. Quais sabores vocês têm disponíveis? Pode me ajudar a finalizar o pedido?',
  },
  {
    slug: 'vitamina-d3-2000', cat: 'vitaminas',
    name: 'Vitamina D3 2000 UI', size: 'Frasco com 60 cápsulas',
    short: 'Contribui para a saúde dos ossos e da imunidade.',
    price: 44.9, old: 59.9, type: 'bottle', c: '#ffc933', d: '#d9a000',
    msg: 'Oi! Tenho interesse na *Vitamina D3 2000 UI (60 cápsulas)* por {preco}. Pode me orientar sobre a melhor forma de tomar e confirmar se está em estoque?',
  },

  // ---------- Pele e Proteção Solar ----------
  {
    slug: 'protetor-solar-fps50', cat: 'dermo', best: 2,
    name: 'Protetor Solar FPS 50', size: 'Frasco de 200 ml',
    short: 'Proteção UVA/UVB, toque seco e não deixa a pele pegajosa.',
    price: 49.9, old: 64.9, type: 'tube', c: '#ffb020', d: '#e58a00',
    msg: 'Olá! ☀️ Quero comprar o *Protetor Solar FPS 50 (200 ml)* por {preco} para a família toda. Tem em estoque? Consegue entregar ainda hoje?',
  },
  {
    slug: 'hidratante-facial', cat: 'dermo',
    name: 'Hidratante Facial com Ácido Hialurônico', size: 'Pote de 50 g',
    short: 'Hidratação leve para usar de manhã e à noite.',
    price: 79.9, old: null, type: 'jar', c: '#7aa7ff', d: '#4a78d6',
    msg: 'Oi! Me interessei pelo *Hidratante Facial com Ácido Hialurônico (50 g)* por {preco}. Pode me indicar se serve para o meu tipo de pele e confirmar a disponibilidade?',
  },
  {
    slug: 'protetor-labial-fps30', cat: 'dermo',
    name: 'Protetor Labial FPS 30', size: 'Bisnaga de 10 g',
    short: 'Hidrata e protege os lábios do sol e do ressecamento.',
    price: 19.9, old: null, type: 'tube', c: '#ff7aa2', d: '#d84a78',
    msg: 'Olá! Quero levar o *Protetor Labial FPS 30* por {preco}. Se eu pedir mais alguma coisa, vocês entregam tudo junto?',
  },

  // ---------- Higiene e Cuidados ----------
  {
    slug: 'alcool-em-gel-70', cat: 'higiene',
    name: 'Álcool em Gel 70%', size: 'Frasco com pump de 500 g',
    short: 'Higienização prática das mãos, onde você estiver.',
    price: 12.9, old: null, type: 'pump', c: '#4cc9f0', d: '#1b9acb',
    msg: 'Olá! Preciso do *Álcool em Gel 70% (500 g)* por {preco}. Tem em estoque? Se eu levar mais de uma unidade, existe condição especial?',
  },
  {
    slug: 'shampoo-anticaspa', cat: 'higiene',
    name: 'Shampoo Anticaspa', size: 'Frasco de 400 ml',
    short: 'Limpeza profunda do couro cabeludo, com sensação de frescor.',
    price: 32.9, old: 39.9, type: 'pump', c: '#8e6bd6', d: '#6544b0',
    msg: 'Oi! Tenho interesse no *Shampoo Anticaspa (400 ml)* por {preco}. Pode me confirmar se está disponível e quanto fica a entrega?',
  },
  {
    slug: 'creme-dental-clareador', cat: 'higiene',
    name: 'Creme Dental Clareador', size: 'Tubo de 90 g',
    short: 'Proteção anticáries e sorriso mais brilhante no dia a dia.',
    price: 14.9, old: null, type: 'tube', c: '#3ac7b5', d: '#1c9a8a',
    msg: 'Olá! Quero comprar o *Creme Dental Clareador (90 g)* por {preco}. Pode me passar o valor com a entrega e as formas de pagamento?',
  },

  // ---------- Bebê e Mamãe ----------
  {
    slug: 'fralda-descartavel-m', cat: 'bebe',
    name: 'Fralda Descartável Tamanho M', size: 'Pacote com 40 unidades',
    short: 'Miolo super absorvente e toque macio para a pele do bebê.',
    price: 49.9, old: 54.9, type: 'pack', c: '#59b8ff', d: '#2d86d6',
    msg: 'Olá! 👶 Quero comprar a *Fralda Descartável Tamanho M (40 unidades)* por {preco}. Tem o tamanho M em estoque? Quanto tempo leva para chegar?',
  },
  {
    slug: 'lenco-umedecido-100', cat: 'bebe',
    name: 'Lenço Umedecido', size: 'Pacote com 100 unidades',
    short: 'Suave e sem álcool, ideal para trocas e para a bolsa do bebê.',
    price: 16.9, old: null, type: 'wipes', c: '#ff9ec4', d: '#d66a97',
    msg: 'Oi! Quero comprar o *Lenço Umedecido (100 unidades)* por {preco}. Se eu levar junto com as fraldas, vocês conseguem um preço melhor?',
  },

  // ---------- Saúde em Casa ----------
  {
    slug: 'termometro-digital', cat: 'aparelhos',
    name: 'Termômetro Digital', size: 'Leitura rápida com sinal sonoro',
    short: 'Medição rápida e prática para toda a família.',
    price: 34.9, old: 44.9, type: 'thermo', c: '#33c2a1', d: '#1f947a',
    msg: 'Olá! Tenho interesse no *Termômetro Digital* por {preco}. Ele vem com garantia? Tem pronta entrega?',
  },
  {
    slug: 'medidor-pressao-braco', cat: 'aparelhos',
    name: 'Medidor de Pressão Digital de Braço', size: 'Automático, com memória',
    short: 'Acompanhe a pressão arterial com praticidade em casa.',
    price: 139.9, old: 169.9, type: 'device', c: '#8fa7ff', d: '#5c75d8',
    msg: 'Oi! Quero comprar o *Medidor de Pressão Digital de Braço* por {preco}. Pode me explicar como funciona a garantia e a entrega?',
  },

  // ---------- Medicamentos isentos de prescrição (MIP) ----------
  {
    slug: 'paracetamol-750', cat: 'mip',
    name: 'Paracetamol 750 mg', size: 'Caixa com 20 comprimidos',
    short: 'Medicamento isento de prescrição. Leia a bula.',
    price: 11.9, old: null, type: 'box', c: '#2f80ed', d: '#1b5bb8',
    msg: 'Olá! Tenho interesse no *Paracetamol 750 mg (20 comprimidos)* por {preco}. Pode me orientar sobre a posologia correta e confirmar a disponibilidade?',
  },
  {
    slug: 'soro-fisiologico-500', cat: 'mip',
    name: 'Soro Fisiológico 0,9%', size: 'Frasco de 500 ml',
    short: 'Solução estéril para higiene nasal e ocular. Leia a bula.',
    price: 9.9, old: null, type: 'bottle', c: '#5ec4ee', d: '#2a93bf',
    msg: 'Olá! Preciso do *Soro Fisiológico 0,9% (500 ml)* por {preco}. Tem em estoque e consegue entregar hoje?',
  },
];
