"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockImoveis = void 0;
// Função auxiliar para gerar fotos para um imóvel
var generatePhotos = function (imovelIndex, count) {
    if (count === void 0) { count = 10; }
    var photos = [];
    var basePhotoId = 200 + imovelIndex * 10;
    for (var i = 0; i < count; i++) {
        photos.push("https://picsum.photos/id/".concat(basePhotoId + i, "/1024/768"));
    }
    return photos;
};
exports.mockImoveis = __spreadArray([
    // Lançamentos
    {
        id: "49578",
        titulo: "Lançamento de Luxo no Belvedere",
        descricao: "Um empreendimento exclusivo com design arrojado e infraestrutura completa. Unidades de 3 e 4 suítes com vista definitiva.",
        preco: 2800000,
        valorCondominio: 1500,
        valorIptu: 7000,
        quartos: 4,
        suites: 4,
        banheiros: 5,
        vagas: 4,
        area: 210,
        finalidade: "Comprar", // CORRETO
        tipo: "apartamento",
        emDestaque: true,
        status: "Ativo",
        dataCadastro: "2025-06-19",
        endereco: {
            rua: "Av. Celso Guedes",
            numero: "100",
            bairro: "Belvedere",
            cidade: "Belo Horizonte",
            estado: "MG",
            cep: "30320-570",
        },
        caracteristicasImovel: {
            aceitaPermuta: false,
            churrasqueira: true,
            closet: true,
            naPlanta: true,
        },
        caracteristicasEdificio: {
            piscina: true,
            academia: true,
            salaoDeJogos: true,
            tipoPortaria: "24h",
        },
        proprietario: {
            nome: "Construtora Alfa",
            contato: "5531999990001",
            horarioContato: "Comercial",
        },
        fotos: generatePhotos(0),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        id: "49579",
        titulo: "Casa em Condomínio - Vila da Serra",
        descricao: "Casa moderna em condomínio fechado com segurança 24h. Acabamento de alto padrão e área de lazer privativa.",
        preco: 3500000,
        valorCondominio: 2000,
        valorIptu: 9000,
        quartos: 4,
        suites: 3,
        banheiros: 5,
        vagas: 5,
        area: 450,
        finalidade: "Comprar", // CORRETO
        tipo: "casa-condominio",
        emDestaque: true,
        status: "Ativo",
        dataCadastro: "2025-06-18",
        endereco: {
            rua: "Alameda da Serra",
            numero: "500",
            bairro: "Vila da Serra",
            cidade: "Nova Lima",
            estado: "MG",
            cep: "34006-050",
        },
        caracteristicasImovel: {
            aceitaPermuta: true,
            churrasqueira: true,
            closet: true,
            dce: true,
            lavabo: true,
        },
        caracteristicasEdificio: {
            quadraDeTenis: true,
            academia: true,
            tipoPortaria: "24h",
        },
        proprietario: {
            nome: "Família Medeiros",
            contato: "5531999990002",
            horarioContato: "A combinar",
        },
        fotos: generatePhotos(1),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    }
], Array.from({ length: 18 }, function (_, i) {
    var index = i + 2;
    var bairros = [
        "Savassi",
        "Lourdes",
        "Buritis",
        "Castelo",
        "Anchieta",
        "Sion",
        "Centro",
        "Pampulha",
    ];
    var tipos = ["apartamento", "casa", "cobertura", "loja", "terreno"];
    var imovelTipo = tipos[index % tipos.length];
    // 👇 GARANTIMOS QUE A FINALIDADE É DO TIPO CORRETO 👇
    var finalidadeImovel = index % 3 === 0 ? "Alugar" : "Comprar";
    var portariaTypes = [
        "Nenhuma",
        "24h",
        "Virtual",
        "Diurna",
        "Noturna",
    ];
    var statusPermitidos = [
        "Ativo",
        "Vendido",
        "Inativo",
    ];
    return {
        id: "".concat(49580 + index - 2),
        titulo: "".concat(imovelTipo.charAt(0).toUpperCase() + imovelTipo.slice(1), " ").concat(finalidadeImovel === "Alugar" ? "para Alugar" : "", " no Bairro ").concat(bairros[index % bairros.length]),
        descricao: "Descri\u00E7\u00E3o padr\u00E3o para o im\u00F3vel de c\u00F3digo ".concat(49580 + index - 2, ". \u00D3tima localiza\u00E7\u00E3o e acabamento."),
        preco: finalidadeImovel === "Alugar"
            ? 2500 + index * 150
            : 700000 + index * 45000,
        valorCondominio: imovelTipo === "apartamento" ? 400 + index * 20 : 0,
        valorIptu: 1500 + index * 80,
        quartos: imovelTipo === "apartamento" ||
            imovelTipo === "casa" ||
            imovelTipo === "cobertura"
            ? 2 + (index % 3)
            : 0,
        suites: imovelTipo === "apartamento" ||
            imovelTipo === "casa" ||
            imovelTipo === "cobertura"
            ? 1 + (index % 2)
            : 0,
        banheiros: imovelTipo === "apartamento" ||
            imovelTipo === "casa" ||
            imovelTipo === "cobertura"
            ? 2 + (index % 2)
            : 1,
        vagas: imovelTipo === "apartamento" ||
            imovelTipo === "casa" ||
            imovelTipo === "cobertura"
            ? 1 + (index % 3)
            : 0,
        area: 80 + index * 12,
        finalidade: finalidadeImovel, // Usando a variável com o tipo correto
        tipo: imovelTipo,
        emDestaque: index < 6,
        status: statusPermitidos[index % statusPermitidos.length],
        dataCadastro: "2025-06-".concat((17 - index > 0 ? 17 - index : 1)
            .toString()
            .padStart(2, "0")),
        endereco: {
            rua: "Rua de Teste, ".concat(index),
            numero: "".concat(100 + index),
            bairro: bairros[index % bairros.length],
            cidade: "Belo Horizonte",
            estado: "MG",
            cep: "30000-000",
        },
        caracteristicasImovel: {
            churrasqueira: index % 3 === 0,
            mobiliado: index % 4 === 0,
        },
        caracteristicasEdificio: {
            academia: index % 2 === 0,
            portaoEletronico: true,
            tipoPortaria: portariaTypes[index % portariaTypes.length],
        },
        proprietario: {
            nome: "Propriet\u00E1rio ".concat(index),
            contato: "55319999910".concat(index.toString().padStart(2, "0")),
            horarioContato: "Comercial",
        },
        fotos: generatePhotos(index),
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    };
}), true);
