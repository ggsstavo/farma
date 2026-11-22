// ============================================================
//  CONFIGURAÇÃO DA FARMÁCIA  —  edite aqui e rode:  npm run build
//  Tudo que está marcado com "TROQUE" é exemplo e deve ser
//  substituído pelos dados reais da sua farmácia.
// ============================================================
export const site = {
  name: 'Farma Vida',                                   // TROQUE
  legalName: 'Farma Vida Drogaria Ltda',                // TROQUE
  tagline: 'Sua saúde em boas mãos',
  domain: 'https://www.farmavida.com.br',               // TROQUE (sem barra no final)

  // WhatsApp: só números, com 55 + DDD + número. Ex.: 5511987654321
  whatsapp: '5511999999999',                            // TROQUE
  phoneDisplay: '(11) 99999-9999',                      // TROQUE
  phoneTel: '+5511999999999',                           // TROQUE
  email: 'contato@farmavida.com.br',                    // TROQUE

  address: {                                            // TROQUE
    street: 'Rua das Palmeiras, 123',
    district: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zip: '01000-000',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rua+das+Palmeiras+123+Sao+Paulo', // TROQUE

  // Horários (usados na página de contato e nos dados estruturados do Google)
  hours: [
    { label: 'Segunda a sábado', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '21:00' },
    { label: 'Domingos e feriados', days: ['Sunday'], opens: '09:00', closes: '18:00' },
  ],

  facebook: 'https://www.facebook.com/farmavida',       // TROQUE
  instagram: 'https://www.instagram.com/farmavida',     // TROQUE
  googleReviews: 'https://search.google.com/local/writereview?placeid=SEU_PLACE_ID', // TROQUE (ou apague o link no build.mjs)

  // Dados legais obrigatórios no rodapé de farmácias (ANVISA / CRF)
  cnpj: '00.000.000/0001-00',                           // TROQUE
  afe: '0.00000.0',                                     // TROQUE (Autorização de Funcionamento)
  pharmacist: 'Nome do(a) Farmacêutico(a)',             // TROQUE
  crf: 'CRF-SP 00000',                                  // TROQUE

  freeShippingFrom: 99,                                 // frete grátis a partir de R$ (TROQUE ou remova do texto)
  year: 2026,
};
