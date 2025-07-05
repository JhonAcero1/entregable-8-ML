let modelo;
let tokenizer;

async function cargarModelo() {
    modelo = await tf.loadGraphModel('modelo_tfjs/model.json');

     
    tokenizer = {
        "me": 1, "encanta": 2, "este": 3, "día": 4, "qué": 5, "feliz": 6, "estoy": 7,
        "todo": 8, "es": 9, "maravilloso": 10, "siento": 11, "genial": 12,
        "odio": 13, "esto": 14, "muy": 15, "triste": 16, "terrible": 17, "fatal": 18,
        "contento": 19, "hoy": 20, "gran": 21, "gusta": 22, "mucho": 23, "fantástico": 24,
        "va": 25, "bien": 26, "motivado": 27, "emocionado": 28, "por": 29, "el": 30, "futuro": 31,
        "alegría": 32, "saliendo": 33, "mejor": 34, "ha": 35, "pasado": 36, "agradecido": 37,
        "sale": 38, "mal": 39, "deprimido": 40, "desastre": 41, "quiero": 42, "hacer": 43,
        "nada": 44, "fracaso": 45, "agotado": 46, "tiene": 47, "sentido": 48, "nada": 49,
        "solo": 50, "horrible": 51, "frustrado": 52
    };
}

function textToSequence(text) {
    const words = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(/\s+/);
    let sequence = words.map(word => tokenizer[word] || 0);
    const maxLen = 8;  
    while (sequence.length < maxLen) sequence.push(0);
    return sequence.slice(0, maxLen);
}

async function analizar() {
    const frase = document.getElementById('texto').value;
    const sequence = textToSequence(frase);
    const input = tf.tensor([sequence], [1, sequence.length]);

    const pred = modelo.predict(input);
    const resultado = (await pred.data())[0];

    let sentimiento = resultado > 0.5 ? "Positivo" : "Negativo";
    let confianza = (resultado > 0.5 ? resultado : 1 - resultado) * 100;
    confianza = confianza.toFixed(2);

    document.getElementById('resultado').innerText = `Sentimiento: ${sentimiento} (Confianza: ${confianza}%)`;
}

// Cargar el modelo al abrir la web
cargarModelo();
