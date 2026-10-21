const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "reservas.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const initialGifts = [
  { id: 1, name: "Jogo de panelas inox", category: "Panelas e utensílios", image: "/images/jogo-panelas.jpg", description: "Para preparar muitas receitas juntos." },
  { id: 2, name: "Frigideira antiaderente", category: "Panelas e utensílios", image: "/images/frigideira.jpg", description: "Praticidade para o dia a dia." },
  { id: 3, name: "Jogo de pratos rasos", category: "Mesa posta", image: "/images/jogo-pratos-rasos.jpg", description: "Para receber a família e os amigos." },
  { id: 25, name: "Jogo de pratos fundos", category: "Mesa posta", image: "/images/jogo-pratos-fundos.jpg", description: "Para receber a família e os amigos." },
  { id: 4, name: "Jogo de talheres", category: "Mesa posta", image: "/images/talheres.jpg", description: "Um conjunto para nossas refeições." },
  { id: 5, name: "Copos", category: "Mesa posta", image: "/images/copos.jpg", description: "Copos para o cotidiano e visitas." },
  { id: 6, name: "Jogo de xícaras", category: "Mesa posta", image: "/images/xicaras.jpg", description: "Para nossos cafés da manhã." },
  { id: 7, name: "Liquidificador", category: "Eletrodomésticos", image: "/images/liquidificador.jpg", description: "Para sucos, vitaminas e receitas." },
  { id: 8, name: "Mixer 3 em 1", category: "Eletrodomésticos", image: "/images/mixer.jpg", description: "Para bolos e sobremesas." },
  { id: 9, name: "Concha", category: "Panelas e utensílios", image: "/images/concha.jpg", description: "Mais praticidade na cozinha." },
  { id: 10, name: "Sanduicheira", category: "Eletrodomésticos", image: "/images/sanduicheira.jpg", description: "Para lanches rápidos." },
  { id: 11, name: "Fouet de silicone", category: "Panelas e utensílios", image: "/images/Fouet-silicone.jpg", description: "Indispensável na cozinha" },
  { id: 12, name: "Tábua de corte", category: "Panelas e utensílios", image: "/images/tabua.jpg", description: "Uma ajudante para preparar ingredientes." },
  { id: 13, name: "Pipoqueira", category: "Panelas e utensílios", image: "/images/pipoqueira.jpg", description: "Para as noites de cinema em casa." },
  { id: 26, name: "Faca de legumes", category: "Panelas e utensílios", image: "/images/faca-legumes.jpg", description: "Facas para diferentes preparos." },
  { id: 27, name: "Faca de desossar", category: "Panelas e utensílios", image: "/images/faca-desossar.jpg", description: "Facas para diferentes preparos." },
  { id: 28, name: "Faca de queijo", category: "Panelas e utensílios", image: "/images/faca-queijo.jpg", description: "Facas para diferentes preparos." },
  { id: 14, name: "Ralador de inox", category: "Panelas e utensílios", image: "/images/ralador.jpg", description: "Indispensável na cozinha" },
  { id: 29, name: "Descanso de talher", category: "Panelas e utensílios", image: "/images/descanso-talher.jpg", description: "Indispensável na cozinha" },
  { id: 15, name: "Potes herméticos", category: "Organização", image: "/images/potes-hermeticos.jpg", description: "Para guardar alimentos." },
  { id: 30, name: "Colher de pau", category: "Panelas e utensílios", image: "/images/colher-pau.jpg", description: "Indispensável na cozinha" },
  { id: 31, name: "Zester", category: "Panelas e utensílios", image: "/images/zester.jpg", description: "Praticidade na cozinha" },
  { id: 32, name: "Descanso de panela", category: "Panelas e utensílios", image: "/images/descanso-panela.jpg", description: "Indispensável na cozinha." },
  { id: 34, name: "Boleira", category: "Panelas e utensílios", image: "/images/Boleira.jpg", description: "Boleira com tampa." },
  { id: 33, name: "Espatula de bolo", category: "Panelas e utensílios", image: "/images/espatula-bolo.jpg", description: "Para o dia a dia e ocasiões especiais." },
  { id: 35, name: "Forma de gelo", category: "Panelas e utensílios", image: "/images/forma-gelo.jpg", description: "Para pretparar bebidas refrescantes" },
  { id: 36, name: "Porta ovos", category: "Panelas e utensílios", image: "/images/porta-ovos.jpg", description: "Indispensável na cozinha." },
  { id: 16, name: "Jarra", category: "Mesa posta", image: "/images/jarra.jpg", description: "Para servir água e sucos." },
  { id: 17, name: "Assadeira de inox grande", category: "Panelas e utensílios", image: "/images/assadeira-grande.jpg", description: "Para receitas de forno." },
  { id: 37, name: "Assadeira de inox pequena", category: "Panelas e utensílios", image: "/images/assadeira-pequena.jpg", description: "Para receitas de forno." },
  { id: 18, name: "Jogo de caneca", category: "Mesa posta", image: "/images/caneca.jpg", description: "Para o café da manhã" },
  { id: 19, name: "Pão duro", category: "Panelas e utensílios", image: "/images/pao-duro.jpg", description: "Utensílios para cozinhar." },
  { id: 20, name: "Pincel de silicone", category: "Panelas e utensílios", image: "/images/pincel.jpg", description: "Um item essencial para a cozinha." },
  { id: 38, name: "Colher de silicone", category: "Panelas e utensílios", image: "/images/colher-silicone.jpg", description: "Um item essencial para a cozinha." },
  { id: 39, name: "Colher de arroz de inox", category: "Panelas e utensílios", image: "/images/colher-inox.jpg", description: "Um item essencial para a cozinha." },
  { id: 41, name: "Saleiro e pimenteiro", category: "Organização", image: "/images/saleiro.jpg", description: "Um item essencial para a cozinha." },
  { id: 40, name: "Tigelas de sobremesa", category: "Mesa posta", image: "/images/tigela-sobremesa.jpg", description: "Para receber a família e os amigos." },
  { id: 42, name: "Organizador de talheres", category: "Organização", image: "/images/organizador-talher.jpg", description: "Organização para o dia a dia." },
  { id: 22, name: "Lixeira de cozinha", category: "Organização", image: "/images/lixeira.jpg", description: "Organização para o dia a dia." },
  { id: 23, name: "bowl de inox", category: "Panelas e utensílios", image: "/images/bowl-inox.jpg", description: "Indispensável na cozinha." },
  { id: 43, name: "Leiteira", category: "Panelas e utensílios", image: "/images/leiteira.jpg", description: "Praticidade para o dia a dia." },
  { id: 44, name: "Refratatio pequeno", category: "Mesa posta", image: "/images/refratario-medio.jpg", description: "Um item essencial para a cozinha." },
  { id: 45, name: "Refratatio medio", category: "Mesa posta", image: "/images/refratario-medio.jpg", description: "Um item essencial para a cozinha." },
  { id: 46, name: "Refratatio grande", category: "Mesa posta", image: "/images/refratario-medio.jpg", description: "Um item essencial para a cozinha." },
  { id: 59, name: "Jogo americano", category: "Mesa posta", image: "/images/jogo-americano.jpg", description: "Para receber a família e os amigos." },
  { id: 47, name: "Escorredor de macarrão", category: "Panelas e utensílios", image: "/images/escorredor-macarrao.jpg", description: "Praticidade para o dia a dia." },
  { id: 48, name: "Peneira", category: "Panelas e utensílios", image: "/images/peneira.jpg", description: "Praticidade para o dia a dia." },
  { id: 49, name: "Descascador", category: "Panelas e utensílios", image: "/images/descascador.jpg", description: "Praticidade para o dia a dia." },
  { id: 50, name: "Pegador", category: "Panelas e utensílios", image: "/images/pegador.jpg", description: "Praticidade para o dia a dia." },
  { id: 51, name: "Abridor de latas", category: "Panelas e utensílios", image: "/images/abridor-lata.jpg", description: "Praticidade para o dia a dia." },
  { id: 52, name: "Saca-rolhas", category: "Panelas e utensílios", image: "/images/saca-rolhas.jpg", description: "Praticidade para o dia a dia." },
  { id: 53, name: "Pegador de massas", category: "Panelas e utensílios", image: "/images/pegador-massa.jpg", description: "Praticidade para o dia a dia." },
  { id: 54, name: "Luva Termica", category: "Panelas e utensílios", image: "/images/luva-termica.jpg", description: "Praticidade para o dia a dia." },
  { id: 55, name: "Garrafa termica", category: "Panelas e utensílios", image: "/images/garrafa-termica.jpg", description: "Praticidade para o dia a dia." },
  { id: 56, name: "Saladeira", category: "Panelas e utensílios", image: "/images/saladeira.jpg", description: "Praticidade para o dia a dia." },
  { id: 57, name: "Jogo de bowls individuais", category: "Organização", image: "/images/bowls-individuais.jpg", description: "Praticidade para o dia a dia." },
  { id: 60, name: "Jogo de potes para alimentos", category: "Organização", image: "/images/pote-alimentos.jpg", description: "Praticidade para o dia a dia." },
  { id: 61, name: "Jogo de potes para temperos", category: "Organização", image: "/images/pote-tempeiro.jpg", description: "Praticidade para o dia a dia." },
  { id: 62, name: "Fruteira", category: "Organização", image: "/images/fruteira.jpg", description: "Praticidade para o dia a dia." },
  { id: 63, name: "Bacia grande com tampa", category: "Organização", image: "/images/bacia-grande.jpg", description: "Praticidade para o dia a dia." },
  { id: 64, name: "Ferro de passar", category: "Eletrodomésticos", image: "/images/ferro-passar.jpg", description: "Praticidade para o dia a dia." },
  { id: 65, name: "Aspirador de pó", category: "Eletrodomésticos", image: "/images/aspirador.jpg", description: "Praticidade para o dia a dia." },
  ];

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      return { reservations: Array.isArray(parsed.reservations) ? parsed.reservations : [] };
    }
  } catch (error) {
    console.error("Não foi possível ler reservas.json:", error.message);
  }
  return { reservations: [] };
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

app.get("/api/gifts", (req, res) => {
  const data = readData();
  const gifts = initialGifts.map(gift => {
    const reservation = data.reservations.find(item => item.giftId === gift.id);
    return {
      ...gift,
      reserved: Boolean(reservation),
      reservedBy: reservation ? reservation.name : null
    };
  });
  res.json(gifts);
});

app.post("/api/reservations", (req, res) => {
  const giftId = Number(req.body.giftId);
  const name = String(req.body.name || "").trim();

  if (!Number.isInteger(giftId) || !name || name.length > 80) {
    return res.status(400).json({ error: "Informe um nome válido para reservar o presente." });
  }
  if (!initialGifts.some(gift => gift.id === giftId)) {
    return res.status(404).json({ error: "Presente não encontrado." });
  }

  const data = readData();
  if (data.reservations.some(item => item.giftId === giftId)) {
    return res.status(409).json({ error: "Esse presente já foi escolhido por outra pessoa." });
  }

  data.reservations.push({ giftId, name, reservedAt: new Date().toISOString() });
  writeData(data);
  res.status(201).json({ ok: true });
});

// O convidado pode cancelar informando o mesmo nome usado na reserva.
app.post("/api/reservations/:giftId/cancel", (req, res) => {
  const giftId = Number(req.params.giftId);
  const name = String(req.body.name || "").trim();
  if (!name) return res.status(400).json({ error: "Informe o nome usado na reserva." });

  const data = readData();
  const index = data.reservations.findIndex(item => item.giftId === giftId);
  if (index === -1) return res.status(404).json({ error: "Não encontramos uma reserva para esse presente." });

  const savedName = String(data.reservations[index].name || "").trim().toLocaleLowerCase("pt-BR");
  if (savedName !== name.toLocaleLowerCase("pt-BR")) {
    return res.status(403).json({ error: "O nome não corresponde ao informado na reserva." });
  }

  data.reservations.splice(index, 1);
  writeData(data);
  res.json({ ok: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Chá de panela de Estêvão & Clara disponível em http://localhost:${PORT}`);
});
