function gerarId(modeloId, nomeElemento) {
    const id = `${nomeElemento}${modeloId}`
    return id
}

function elementoPorId(modeloId, nomeElemento) {
    return document.getElementById(gerarId(modeloId, nomeElemento))
}

function alterarTipo(modeloId, tipo, caminho) {
    if (tipo === "img") {
        const imgViwer = document.createElement("img")
        imgViwer.className = "imgEspecie"
        imgViwer.src = caminho
        imgViwer.id = gerarId(modeloId, "img")

        const divMidia = elementoPorId(modeloId, "divMidia")
        divMidia.innerHTML = ""
        divMidia.appendChild(imgViwer)

    } else {
        const divMidia = elementoPorId(modeloId, "divMidia")

        const videoPlayer = document.createElement("video")
        videoPlayer.style.width = "100%";
        videoPlayer.style.height = "auto";
        videoPlayer.controls = true;
        videoPlayer.id = gerarId(modeloId, "videoPlayer")

        const source = document.createElement("source");
        source.src = caminho
        source.type = 'video/mp4';
        source.id = gerarId(modeloId, "source")

        videoPlayer.appendChild(source)
        divMidia.innerHTML = ""
        divMidia.appendChild(videoPlayer)
    }
}

async function alterarMidia(modelo, modeloId, direcao) {
    alternarButtons(modeloId, "OFF")
    let diretorio = modelo.src;
    console.log(modelo.src)
    let match = diretorio.match(/\/(\d+)\.(jpg|mp4)$/); // Adaptado para capturar jpg e mp4

    if (match) {
        let index = parseInt(match[1]) + direcao;
        let extensao = match[2]; // Captura a extensão (jpg ou mp4)

        if (index < 1) {
            console.log("Está na primeira mídia.");
            alternarButtons(modeloId, "ON")
            return;
        }

        let novaSrc = diretorio.replace(/\/\d+\.(jpg|mp4)$/, `/${index}.${extensao}`);

        // Verifica se é imagem ou vídeo
        if (extensao === "jpg") {
            let imgTeste = new Image();
            imgTeste.src = novaSrc;

            await new Promise((resolve, reject) => {
                imgTeste.onload = () => {
                    modelo.src = novaSrc;
                    resolve(); // Resolve a promessa quando a imagem carrega
                };
                imgTeste.onerror = () => {
                    console.log("Está na ultima mídia.");
                    alert("Essa é a ultima Imagem")
                    alternarButtons(modeloId, "ON")
                    reject(new Error("Erro ao carregar a imagem.")); // Rejeita a promessa se ocorrer um erro
                    return
                };
            });

        } else if (extensao === "mp4") {
            // Verifica se o arquivo de vídeo existe
            let videoTeste = elementoPorId(modeloId, "videoPlayer");
            const videoTesteSrcBuckap = videoTeste.src
            videoTeste.src = novaSrc;
            let existe = true

            videoTeste.onerror = function () {
                console.log("Erro ao carregar o vídeo:", novaSrc);
                videoTeste.src = videoTesteSrcBuckap
                alert("Essa é o ultimo Vídeo")
                alternarButtons(modeloId, "ON")
                return
            };

            videoTeste.onloadeddata = function () {
                modelo.src = novaSrc; // Atualiza o vídeo se existir
                videoPlayer.load(); // Recarrega o vídeo
                // videoPlayer.play();  Opcional: inicia a reprodução automaticamente
            };

        }
    }
    alternarButtons(modeloId, "ON")
}


async function gerarDivMidia(modeloId, imgLink) {
    // Cria divMidia
    const divMidia = document.createElement("div");
    divMidia.className = "divMidia";
    divMidia.id = gerarId(modeloId, "divMidia");

    // Cria img com o src e o id
    const img = document.createElement("img");
    img.className = "imgEspecie";
    img.id = gerarId(modeloId, "img");

    // Aguarda o carregamento da imagem
    img.src = imgLink; // Define o src antes de esperar
    await new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(); // Resolve a promessa quando a imagem carrega
        };
        img.onerror = () => {
            reject(new Error("Erro ao carregar a imagem.")); // Rejeita a promessa se ocorrer um erro
        };
    });

    // Adiciona img a divMidia
    divMidia.appendChild(img);

    // Retorna divMidia
    return divMidia;
}


function gerarDivControles(modeloId, imgSrc, videoSrc, modeloId) {
    //Criar divControles
    const divControles = document.createElement("div")
    divControles.className = "controles caracteristica"

    //Cria divOpImagem
    const divOpImagem = document.createElement("div")
    divOpImagem.className = "divOpImagem"

    //Cria buttonOpImagem
    const buttonOpImagem = document.createElement("button")
    buttonOpImagem.className = "buttonOpImagem"
    buttonOpImagem.innerHTML = "Imagem"
    buttonOpImagem.id = gerarId(modeloId, "buttonOpImagem")

    //Adiciona o evento click a buttonOpImagem
    buttonOpImagem.addEventListener("click", function () {
        alterarTipo(modeloId, "img", imgSrc)
    })

    //Adiciona buttonOpImagem a divOpImagem
    divOpImagem.appendChild(buttonOpImagem)

    const divOpVideo = document.createElement("div")

    if (videoSrc !== "null") {

        //Cria divOpVideo
        divOpVideo.className = "divOpVideo"

        //Cria buttonOpVideo
        const buttonOpVideo = document.createElement("button")
        buttonOpVideo.className = "buttonOpVideo"
        buttonOpVideo.innerHTML = "Vídeo"
        buttonOpVideo.id = gerarId(modeloId, "buttonOpVideo")

        //Adiciona o evento click a buttonOpVideo
        buttonOpVideo.addEventListener("click", function () {
            alterarTipo(modeloId, "video", videoSrc)
        })

        //Adiciona buttonOpVideo a divOpVideo
        divOpVideo.appendChild(buttonOpVideo)
    } else {
        divOpImagem.className = "divOpImagemSemVideo"
    }

    //Cria divSetas
    const divSetas = document.createElement("div")
    divSetas.className = "setas"

    //Cria buttonSetaEsquerda
    const buttonSetaEsquerda = document.createElement("button")
    buttonSetaEsquerda.className = "buttonSeta-esquerda"
    buttonSetaEsquerda.id = gerarId(modeloId, "buttonSetaEsquerda")

    //Adiciona o evento Click a buttonSetaEsquerda
    buttonSetaEsquerda.addEventListener("click", function () {
        if (elementoPorId(modeloId, "img")) {
            alterarMidia(elementoPorId(modeloId, "img"), modeloId, -1)
        } else {
            alterarMidia(elementoPorId(modeloId, "source"), modeloId, -1)
        }
    })

    //Cria imgSetaEsquerda
    const imgSetaEsquerda = document.createElement("img")
    imgSetaEsquerda.className = "imgSeta"
    imgSetaEsquerda.src = "imgs/modeloCatalogo/seta-esquerda.png"

    //Adiciona imgSetaEsquerda a divSetas
    buttonSetaEsquerda.appendChild(imgSetaEsquerda)

    //Cria buttonSetaDireita
    const buttonSetaDireita = document.createElement("button")
    buttonSetaDireita.className = "buttonSeta-direita"
    buttonSetaDireita.id = gerarId(modeloId, "buttonSetaDireita")

    //Adiciona o evento Click a buttonSetaDireita
    buttonSetaDireita.addEventListener("click", function () {
        if (elementoPorId(modeloId, "img")) {
            alterarMidia(elementoPorId(modeloId, "img"), modeloId, 1)
        } else {
            alterarMidia(elementoPorId(modeloId, "source"), modeloId, 1)
        }
    })

    //Cria imgSetaDireita
    const imgSetaDireita = document.createElement("img")
    imgSetaDireita.className = "imgSeta"
    imgSetaDireita.src = "imgs/modeloCatalogo/seta-direita.png"

    //Adiciona imgSetaDireita a divSetas
    buttonSetaDireita.appendChild(imgSetaDireita)

    //Adiciona buttonSetaEsquerda e buttonSetaDireita a divSetas
    divSetas.appendChild(buttonSetaEsquerda)
    divSetas.appendChild(buttonSetaDireita)

    //Adicionar divOpImagem, divOpVideo e divSetas a divControles
    divControles.appendChild(divOpImagem)
    if (videoSrc !== null) {
        divControles.appendChild(divOpVideo)
    }
    divControles.appendChild(divSetas)

    //Retorna divControles
    return divControles
}

function gerarDivNomeDescr(nomeP, nomeC, descricao) {
    //Div com tudo
    const divNomePCDescri = document.createElement("div")
    divNomePCDescri.className = "nome caracteristica"

    //Detalhes
    const detalhes = document.createElement("details")

    //Sumuario
    const summuary = document.createElement("summary")
    summuary.className = "sumuarioDescri"

    //Nome popula
    const nomePop = document.createElement("p")
    nomePop.className = "nomeP"
    nomePop.innerHTML = nomeP

    //Nome Científico
    const nomeCient = document.createElement("p")
    nomeCient.className = "nomeC"
    nomeCient.innerHTML = nomeC

    //Colocar NomePop e NomeCient no Sumuario
    summuary.appendChild(nomePop)
    summuary.appendChild(nomeCient)

    //Resto de details (descricao)
    const descricaoText = document.createElement("p")
    descricaoText.className = "pDescri"
    descricaoText.innerHTML = descricao

    //Colocar Sumuario e descricaoText em details
    detalhes.appendChild(summuary)
    detalhes.appendChild(descricaoText)

    //Colocar detalhes em divNomePCDescri
    divNomePCDescri.appendChild(detalhes)

    //Retornar divNomePCDescri
    return divNomePCDescri
}

function gerarDivTaxonomia(familia, genero,) {

    //Cria divTaxonomia
    const divTaxonomia = document.createElement("div")
    divTaxonomia.className = "taxonomia"

    //Cria divFamilia
    const divFamilia = document.createElement("div")
    divFamilia.className = "familia caracteristicas"

    //Cria spanFamilia
    const spanFamilia = document.createElement("span")
    spanFamilia.className = "spanTaxo"
    spanFamilia.innerHTML = "Família: "

    //Cria aFamilia
    const aFamilia = document.createElement("a")
    aFamilia.className = "linkSpan"
    aFamilia.innerHTML = familia
    aFamilia.href = `https://pt.wikipedia.org/wiki/${familia}`

    //Invalida aGenero caso não seja identificado
    if (familia === "null") {
        aFamilia.innerHTML = "Não identificado"
        aFamilia.href = ""
        aFamilia.className = "linkSpanInvalido"
    }

    //Cria divGenero
    const divGenero = document.createElement("div")
    divGenero.className = "genero caracteristicas"

    //Cria spanGenero
    const spanGenero = document.createElement("span")
    spanGenero.className = "spanTaxo"
    spanGenero.innerHTML = "Genero: "

    //Cria aGenero
    const aGenero = document.createElement("a")
    aGenero.className = "linkSpan"
    aGenero.innerHTML = genero
    aGenero.href = `https://pt.wikipedia.org/wiki/${genero}`

    //Invalida aGenero caso não seja identificado
    if (genero === "null") {
        aGenero.innerHTML = "Não identificado"
        aGenero.href = ""
        aGenero.className = "linkSpanInvalido"
    }

    //Adiciona spanFamilia e aFamilia a divFamilia
    divFamilia.appendChild(spanFamilia)
    divFamilia.appendChild(aFamilia)

    //Adiciona spanGenero e aGenero a divGenero
    divGenero.appendChild(spanGenero)
    divGenero.appendChild(aGenero)

    //Adiciona divFamilia e divGenero a divTaxonomia
    divTaxonomia.appendChild(divFamilia)
    divTaxonomia.appendChild(divGenero)

    //Retornar divTaxonomia
    return divTaxonomia
}

function gerarDivLocal(localNome, mapsLink) {
    //Criar divLocal
    const divLocal = document.createElement("div")
    divLocal.className = "local caracteristica"

    //Criar span com "Local de coleta: "
    const localColeta = document.createElement("span")
    localColeta.className = "coletaLocal"
    localColeta.innerHTML = "Local de coleta: "

    //Criar pLocal com o nome do local
    const pLocal = document.createElement("p")
    pLocal.className = "pLocal"
    pLocal.innerHTML = localNome

    //Criar divSimboloMaps
    const divSimboloMaps = document.createElement("div")
    divSimboloMaps.className = "divSimboloMaps"

    //Cria aSimboloMaps com o link do local no maps
    const aSimboloMaps = document.createElement("a")
    aSimboloMaps.className = "aSimboloMaps"
    aSimboloMaps.href = mapsLink

    //Criar img com a logo antiga do Maps
    const imgSimboloMaps = document.createElement("img")
    imgSimboloMaps.className = "simboloMaps"
    imgSimboloMaps.src = "imgs/modeloCatalogo/simboloMaps.png"

    //Adiciona imgSimboloMaps ao aSimboloMaps
    aSimboloMaps.appendChild(imgSimboloMaps)

    //Adiciona aSimboloMaps a divSimboloMaps
    divSimboloMaps.appendChild(aSimboloMaps)

    //Adiciona o span, pLocal e divSimboloMaps a divLocal
    divLocal.appendChild(localColeta)
    divLocal.appendChild(pLocal)
    divLocal.appendChild(divSimboloMaps)

    //Retorna divLocal
    return divLocal
}

function alternarButtons(modeloId, modo) {
    const botaoDireito = elementoPorId(modeloId, "buttonSetaDireita")
    const botaoEsquerda = elementoPorId(modeloId, "buttonSetaEsquerda")
    const botaoImagem = elementoPorId(modeloId, "buttonOpImagem")
    const botaoVideo = elementoPorId(modeloId, "buttonOpVideo")

    if (modo === "OFF") {
        botaoDireito.disabled = true
        botaoEsquerda.disabled = true
        botaoImagem.disabled = true
        if (botaoVideo) { botaoVideo.disabled = true }

        botaoDireito.className = "buttonSeta-direitaOFF"
        botaoEsquerda.className = "buttonSeta-esquerdaOFF"
        botaoImagem.className = "buttonOpImagemOFF"
        if (botaoVideo) { botaoVideo.className = "buttonOpVideoOFF" }
    } else if (modo === "ON") {
        botaoDireito.disabled = false
        botaoEsquerda.disabled = false
        botaoImagem.disabled = false
        if (botaoVideo) { botaoVideo.disabled = false }

        botaoDireito.className = "buttonSeta-direita"
        botaoEsquerda.className = "buttonSeta-esquerda"
        botaoImagem.className = "buttonOpImagem"
        if (botaoVideo) { botaoVideo.className = "buttonOpVideo" }
    }
}

async function gerarCatalogo(especie) {
    const todosCatalogos = document.getElementById("todosCatalogos");
    todosCatalogos.innerHTML = ""
    const divGridCatalogo = document.createElement("div");
    divGridCatalogo.className = "catalogoEspecie";

    // Adicionar imagem
    const divMidia = await gerarDivMidia(especie.modeloId, especie.imgSrc);
    divGridCatalogo.appendChild(divMidia);

    // Adiciona controles
    divGridCatalogo.appendChild(gerarDivControles(especie.modeloId, especie.imgSrc, especie.videoSrc, especie.modeloId));

    // Adicionar div com NomeP, NomeC e descricao
    divGridCatalogo.appendChild(gerarDivNomeDescr(especie.nomeP, especie.nomeC, especie.descricao));

    // Adiciona div taxonomia
    divGridCatalogo.appendChild(gerarDivTaxonomia(especie.familia, especie.genero));

    // Adiciona div local
    divGridCatalogo.appendChild(gerarDivLocal(especie.local, especie.localLink));

    // Adicionar o item ao catalogo
    todosCatalogos.appendChild(divGridCatalogo);

    console.log(divGridCatalogo);
}

async function gerarCatalogoNaoIdentificado(especie) {
    const todosCatalogos = document.getElementById("todosCatalogosNaoIdentificado")
    const divGridCatalogo = document.createElement("div")
    divGridCatalogo.className = "catalogoEspecieNaoIdentificado"

    //Adicionar imagem
    const divMidia = await gerarDivMidia(especie.modeloId, especie.imgSrc);
    divGridCatalogo.appendChild(divMidia);

    //Adiciona controles
    divGridCatalogo.appendChild(gerarDivControles(especie.modeloId, especie.imgSrc, especie.videoSrc, especie.modeloId))

    //Adicionar o item ao catalogo
    todosCatalogos.appendChild(divGridCatalogo)
}