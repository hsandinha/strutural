// seed.js
import admin from 'firebase-admin';
// Esta é a forma moderna de importar um arquivo JSON
import serviceAccount from './serviceAccountKey.json' with { type: 'json' };

// Para evitar problemas de importação, copiamos os dados mock diretamente para cá
const mockImoveis = [
  {
    id: "49578",
    titulo: "Lançamento de Luxo no Belvedere",
    descricao: "Um empreendimento exclusivo com design arrojado e infraestrutura completa.",
    preco: 2800000, valorCondominio: 1500, valorIptu: 7000,
    quartos: 4, suites: 4, banheiros: 5, vagas: 4, area: 210,
    finalidade: "Comprar", tipo: "apartamento", emDestaque: true, status: "Ativo", dataCadastro: "2025-06-25",
    endereco: { rua: "Av. Celso Guedes", numero: "100", bairro: "Belvedere", cidade: "Belo Horizonte", estado: "MG", cep: "30320-570" },
    caracteristicasImovel: { aceitaPermuta: false, churrasqueira: true, closet: true, naPlanta: true },
    caracteristicasEdificio: { piscina: true, academia: true, salaoDeJogos: true, portaria24h: true, tipoPortaria: '24h' },
    proprietario: { nome: "Construtora Alfa", contato: "5531999990001", horarioContato: "Comercial" },
    fotos: Array.from({ length: 10 }, (_, i) => `https://picsum.photos/id/${200 + i}/1024/768`),
  },
  {
    id: "49579",
    titulo: "Casa em Condomínio - Vila da Serra",
    descricao: "Casa moderna em condomínio fechado com segurança 24h.",
    preco: 3500000, valorCondominio: 2000, valorIptu: 9000,
    quartos: 4, suites: 3, banheiros: 5, vagas: 5, area: 450,
    finalidade: "Comprar", tipo: "casa-condominio", emDestaque: true, status: "Ativo", dataCadastro: "2025-06-24",
    endereco: { rua: "Alameda da Serra", numero: "500", bairro: "Vila da Serra", cidade: "Nova Lima", estado: "MG", cep: "34006-050" },
    caracteristicasImovel: { aceitaPermuta: true, churrasqueira: true, closet: true, dce: true, lavabo: true },
    caracteristicasEdificio: { quadraDeTenis: true, academia: true, portaria24h: true, tipoPortaria: '24h' },
    proprietario: { nome: "Família Medeiros", contato: "5531999990002", horarioContato: "A combinar" },
    fotos: Array.from({ length: 10 }, (_, i) => `https://picsum.photos/id/${210 + i}/1024/768`),
  },
  // Você pode adicionar mais imóveis aqui se quiser
];

// Inicializa o app Firebase com permissões de administrador
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const seedDatabase = async () => {
  console.log("Iniciando o povoamento do banco de dados...");
  
  const imoveisCollection = db.collection('imoveis');

  for (const imovel of mockImoveis) {
    try {
      // Cria um documento com o ID do imóvel
      await imoveisCollection.doc(imovel.id).set(imovel);
      console.log(`✅ Imóvel "${imovel.titulo}" (Cód: ${imovel.id}) salvo com sucesso!`);
    } catch (error) {
      console.error(`❌ Erro ao salvar o imóvel ${imovel.id}:`, error);
    }
  }

  console.log("\n🚀 Povoamento do banco de dados concluído!");
  process.exit(0);
};

seedDatabase();