//JSON.stringify(globaltmp)
window.onload = function()
{
	inicia();
}

function inicia()
{
	mundoGenera = {
		dimensiones : 0, 
		posAvismos : [], 
		posWumpus : [], 
		posOro: [], 
		posAventurero : 0
	}
	var celdas = 4;
	var personajeUbicado = false;
	var elementoSelecciona = 0;
	var imgElementos = ["personaje", "avismo", "oro", "wumpus", "borrar"];
	function crea_escenario ()
	{
		var txt = "<table id='chess_board' cellpadding = '0' cellspacing='0'>";
		var nom_id = "";
		var estilo = "basemundo piso";
		for(var i = 0; i < celdas; i++)
		{
			txt += "<tr>";
			for(var c = 0; c < celdas; c++)
			{
				nom_id = "d_" + i + "_" + c;
				txt += "<td id = '"+(nom_id)+"' class = '"+(estilo)+"'></td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		return txt;
	}
	var dibujaEscena = function()
	{
		mundoGenera.posAvismos = [];
		mundoGenera.posWumpus = [];
		mundoGenera.posOro = [];
		mundoGenera.posAventurero = 0;
		personajeUbicado = false;
		var anchoEscena = 0;
		var dimensionesElementos = 64;
		nom_div("escenario").innerHTML = crea_escenario();
		mundoGenera.dimensiones = celdas; //Guardar las dimensiones del mundo...
		//Para las acciones del elemento cuando se hace Click...
		for(var i = 0; i < celdas; i++)
		{
			for(var c = 0; c < celdas; c++)
			{
				nom_id = "d_" + i + "_" + c;
				nom_div(nom_id).addEventListener('click', function(event)
				{
					if(elementoSelecciona != 0)
					{
						var posCelda = event.target.id;
						var numElemento = posCelda.split("_");
						var fila = Number(numElemento[1]);
						var col = Number(numElemento[2]);
						var ocupado = false;
						var nomOcupa = 0;
						console.log("elemento Selecciona: " + elementoSelecciona);
						console.log("Fila: " + fila + " Columna: " + col);	
						//Saber si en la posición donde pondrá el objeto hay algo...
						if(mundoGenera.posAventurero[0] == fila && mundoGenera.posAventurero[0] == col)
						{
							ocupado = true;
						}
						else
						{
							var comparaCeldas = ["posAvismos", "posOro", "posWumpus"];
							for(var i in comparaCeldas)
							{
								for(var c in mundoGenera[comparaCeldas[i]])
								{
									if(mundoGenera[comparaCeldas[i]][c][0] == fila && mundoGenera[comparaCeldas[i]][c][1] == col)
									{
										ocupado = true;
										if(i == 0)
										{
											nomOcupa = c;
										}
										break;
									}
								}
								if(ocupado)
								{
									break;
								}
							}
						}
						console.log("Valor de ocupado es: " + ocupado);
						if (!ocupado)
						{
							if(elementoSelecciona == 1)//Aventurero...
							{
								//Se creará un DIV dinámicamente...
								if(!personajeUbicado)
								{
									var iDiv = document.createElement('div');
									iDiv.id = 'personaje';
									iDiv.className = 'personaje basepersonaje front_1';
									nom_div("escenario").appendChild(iDiv);
									var posX = col * 64;
									var posY = fila * 64;
									var perHtml = nom_div("personaje");
									perHtml.style.top = posY + "px";
									perHtml.style.left = posX + "px";
									mundoGenera.posAventurero = [fila, col];
									personajeUbicado = true;
									perHtml.addEventListener('click', function(event)
									{
										//console.log("Seleccionado: " + elementoSelecciona);
										if(elementoSelecciona == 5)
										{
											nom_div("personaje").remove();
											personajeUbicado = false;
											mundoGenera.posAventurero = [];
										}
									});
								}
							}
							else
							{
								//Avismos...
								if(elementoSelecciona == 2)
								{
									nom_div(posCelda).setAttribute("class", "basemundo avismo");
									mundoGenera.posAvismos.push([fila, col]);
								}
								else
								{
									//Ubicar el oro o al Wumpus...
									if(elementoSelecciona == 3 || elementoSelecciona == 4)
									{
										var iDiv = document.createElement('div');
										var nomDiv = "oro";
										var cantiElemento = mundoGenera.posOro.length;
										if(elementoSelecciona == 4)
										{
											nomDiv = "wumpus";
											cantiElemento = mundoGenera.posWumpus.length;
										}
										iDiv.id = nomDiv + "_" + cantiElemento;
										iDiv.className = "basemundo " + nomDiv + " basewumpus";
										nom_div("escenario").appendChild(iDiv);
										var posX = col * 64;
										var posY = fila * 64;
										var nomHtml = nom_div(nomDiv+"_"+cantiElemento);
										nomHtml.style.top = posY + "px";
										nomHtml.style.left = posX + "px";
										if(elementoSelecciona == 3)
										{
											mundoGenera.posOro.push([fila, col]);
										}
										else
										{
											mundoGenera.posWumpus.push([fila, col]);
										}
										nomHtml.addEventListener('click', function(event)
										{
											if(elementoSelecciona == 5)
											{
												var elementoSel = event.target.id;
												var parElemento = elementoSel.split("_");
												if(parElemento[0] === "oro")
												{
													if(mundoGenera.posOro.length > 1)
													{
														mundoGenera.posOro.splice(Number(parElemento[1]), 1);
													}
													else
													{
														mundoGenera.posOro = [];
													}
												}
												else
												{
													if(mundoGenera.posWumpus.length > 1)
													{
														mundoGenera.posWumpus.splice(Number(parElemento[1]), 1);
													}
													else
													{
														mundoGenera.posWumpus = [];
													}
												}
												nom_div(elementoSel).remove();
											}
										});
									}
								}
							}
						}
						else
						{
							//Opción de borrar elemento...
							if(elementoSelecciona == 5)
							{
								//console.log("Ocupado por: " + nomOcupa);
								nom_div(posCelda).setAttribute("class", "basemundo piso");
								mundoGenera.posAvismos.splice(nomOcupa, 1);
								//console.log("Pos Celda: " + nomOcupa);
								

								//mundoGenera.posAvismos.push([fila, col]);
							}
						}
					}
				});
			}
		}
		anchoEscena = celdas * dimensionesElementos;
		nom_div("escenario").style.width = anchoEscena + "px";
	    nom_div("escenario").style.height = anchoEscena + "px";	
	}

	var dibujaElementos = function()
	{
		var txt = "";
		var opciones = ["avismo", "oro", "wumpus"];
		var cont = 2;
		//Primero el personaje...
		txt += "<div id = 'elemento_1' class = 'personaje basepersonaje front_1' style = 'cursor:pointer;'></div>";
		for(var i in opciones)
		{
			txt += "<div id = 'elemento_"+(cont)+"' class = 'basemundo "+(opciones[i])+"' style = 'cursor:pointer;'></div>";
			cont++;
		}
		txt += "<div id = 'elemento_"+(cont)+"' class = 'borrador' style = 'cursor:pointer;'></div>";
		return txt;
		//Dibujar los elementos que se deberán poner en el escenario...
	}
	dibujaEscena();
	nom_div("elementos").innerHTML = dibujaElementos();
	//Para adicionar la acciones...
	for(var i = 1; i <= 5; i++)
	{
		nom_div("elemento_" + i).addEventListener('click', function(event)
		{
			var cursorBody = document.getElementsByTagName("body")[0];
			//cursor: url('borrar.png'), move;
			var numElemento = event.target.id.split("_");
			cursorBody.style.cursor = "url('imgeditor/"+(imgElementos[numElemento[1] - 1])+".png'), auto";
			console.log("Num: " + numElemento[1]);
			if(Number(numElemento[1]) == 1) //El personaje...
			{
				if(!personajeUbicado)
				{
					elementoSelecciona = Number(numElemento[1]);
				}
			}
			else
			{
				elementoSelecciona = Number(numElemento[1]);
			}
		});
	}
    //Cambiar el valor de las dimensiones del escenario...
    nom_div("dimensiones").addEventListener('change', function(event)
    {
        celdas = this.value;
        dibujaEscena();
    });

	function nom_div(div)
	{
		return document.getElementById(div);
	}
}