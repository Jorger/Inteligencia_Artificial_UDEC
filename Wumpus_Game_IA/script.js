var debug;
window.onload = function()
{
	mundosWumpus = [
		{
			dimensiones: 6,
			posAvismos: [[1,5], [3,1], [3,4], [5,4], [0,4]],
			posWumpus: [[1,2]],
			posOro: [[0,3]], 
			posAventurero: [4, 4], 
			tiempo : 120, 
			vidas : 5
		}
	];

	//mundosWumpus = [{"dimensiones":"7","posAvismos":[[3,3],[1,5],[2,0],[6,3],[3,1],[0,3],[4,5],[2,6]],"posWumpus":[[1,1]],"posOro":[[5,5]],"posAventurero":[5,0]}];

	percepciones = [];
	visitados = [];


	var llevaOro = false; //Lleva el oro...
	var wumpusMuere = false;
	var numFlechas = 0;

	var muere = 0;
	var mundo = 0;
	var numCeldas = 0;
	var dimensionesElementos = 64; //Dimensiones de los elementos del mundo
	direccion = 0;
	var caminar = false;
	var animaMovimiento = false;
	//Calcular el ancho del escenario...
	var anchoEscena = 0;
	//límites de la escena...
	var maxEscena = 0;
	//var txtDirecciones = ["Izquierda", "Arriba", "Derecha", "Abajo"];
	var direcciones = ["left", "top", "right", "front"];
	var posRevisa = [[0, -1], [-1, 0], [0, 1], [1, 0]];
	var paso = 1;
	posPersonaje = []; //Posición...
	iniciaJuego(1);

	function guardaPercepcion (fila, columna, tipo)
	{
		//Primero saber si la percepción ya estaba guardada y es la misma...
		var existe = false;
		var fueVisitado = false;
		for(var i in percepciones)
		{
			if(percepciones[i].fila === fila && percepciones[i].columna === columna && percepciones[i].tipo === tipo)
			{
				existe = true;
				break;
			}
		}
		if(!existe)
		{
			percepciones.push({
				fila : fila, 
				columna : columna, 
				tipo : tipo, 
				visitado : 1
			});
		}
		for(var i in visitados)
		{
			if(visitados[i].fila == fila && visitados[i].columna == columna)
			{
				fueVisitado = true;
				break;
			}
		}
		if(!fueVisitado)
		{
			visitados.push({
				fila : fila, 
				columna : columna
			});
		}
	}

	function iniciaJuego(numMundo)
	{
		mundo = numMundo - 1;
		numFlechas = mundosWumpus[mundo].posWumpus.length;
		nom_div("numflecha").innerHTML = numFlechas + " Disponible(s)";
		numCeldas = mundosWumpus[mundo].dimensiones;
		console.log("La cantidad de celdas es: " + numCeldas);
		nom_div("escenario").innerHTML = crea_escenario(numCeldas);
		anchoEscena = numCeldas * dimensionesElementos;
		//límites de la escena...
		maxEscena = anchoEscena - dimensionesElementos;
		nom_div("escenario").style.width = anchoEscena + "px";
	    nom_div("escenario").style.height = anchoEscena + "px";
	    //Poner al personaje en el escenario...
		var posX = mundosWumpus[mundo].posAventurero[1] * 64;
		var posY = mundosWumpus[mundo].posAventurero[0] * 64;
		nom_div("personaje").setAttribute("class", "basepersonaje front_1");
		nom_div("personaje").style.top = posY + "px";
		nom_div("personaje").style.left = posX + "px";		
		posPersonaje[0] = mundosWumpus[numMundo - 1].posAventurero[0];
		posPersonaje[1] = mundosWumpus[numMundo - 1].posAventurero[1];
		percePersonaje();
		movimientoPersonaje();
	}

	//Establecerá los movimientos que pueda hacer el personaje...
	function movimientoPersonaje()
	{
		//Buscar la percepción que tiene el personaje...
		var txtPercibe = ["Ok", "Viento", "Hedor", "Viento y hedor", "Avismo", "Wumpus"];
		/*
		Tipo:
		0 = Ok
		1 = Viento..
		2 = Hedor
		3 y 2 = Viento y hedor...
		4 = Avismo
		5 = Wumpus...
		*/
		var perceTiene = 0;
		for(var i in percepciones)
		{
			if(percepciones[i].fila === posPersonaje[0] && percepciones[i].columna === posPersonaje[1])
			{
				perceTiene = percepciones[i].tipo;
				break;
			}
		}
		//console.log("El personaje percibe: " + txtPercibe[perceTiene]);
		var posTmp = [0, 0];
		var conoce = 0;
		var tienePercepcion = false;
		var percibePos = [];
		for(var i in posRevisa)
		{
			posTmp[0] = posPersonaje[0] + posRevisa[i][0];//Fila...
			posTmp[1] = posPersonaje[1] + posRevisa[i][1];//Columna...
			conoce = 0;
			if((posTmp[0] >= 0 && posTmp[0] < numCeldas) && (posTmp[1] >= 0 && posTmp[1] < numCeldas))
			{
				for(var c in percepciones)
				{
					//console.log(percepciones[c].fila + " === " + posTmp[0] + " && " + percepciones[c].columna + " === " + posTmp[1]);
					if(percepciones[c].fila === posTmp[0] && percepciones[c].columna === posTmp[1])
					{
						conoce = percepciones[c].tipo;
						tienePercepcion = true;
						break;
					}
				}
				percibePos.push({
					mueve: true, 
					percibe : conoce
				});
			}
			else
			{
				percibePos.push({
					mueve: false, 
					percibe : 0
				});
			}
		}
		var movimiento = 0;
		if(!tienePercepcion)
		{
			//Se deberá obtener un valor aleatorio...
			do
			{
				movimiento = Math.floor((Math.random()* 4) + 1);
				//Saber si al posición se puede mover...
				if(percibePos[movimiento - 1].mueve)
				{
					break;
				}
			}while(1);
			caminar = true;
			direccion = movimiento - 1;
		}
		else
		{
			var visitado = false;
			var encuentraRuta = false;
			var posiBlesMovimientos = [];
			var matarWumous = false;
			for(var i in percibePos)
			{
				if(percibePos[i].mueve && percibePos[i].percibe == 5)
				{
					direccion = movimiento;
					matarWumous = true;
				}
				if(!matarWumous)
				{
					visitado = false;
					if(percibePos[i].mueve && percibePos[i].percibe <= 3)
					{
						posTmp[0] = posPersonaje[0] + posRevisa[movimiento][0];
						posTmp[1] = posPersonaje[1] + posRevisa[movimiento][1];
						for(var c in visitados)
						{
							if(visitados[c].fila === posTmp[0] && visitados[c].columna === posTmp[1])
							{
								visitado = true;
								break;
							}
						}
						if(!visitado)
						{
							//direccion = movimiento;
							posiBlesMovimientos.push(movimiento);
							encuentraRuta = true;
							//break;
						}
					}
				}
				else
				{
					break;
				}
				movimiento++;
			}
			if(!matarWumous)
			{
				//console.log("Sale acá y en valor de encuentraRuta es: " + encuentraRuta);
				if(!encuentraRuta)
				{
					//console.log("Ingresa acá...");
					do
					{
						movimiento = Math.floor((Math.random()* 4) + 1);
						//console.log("MOV: " + movimiento + " - mueve: " + percibePos[movimiento - 1].mueve + " - percibe: " + percibePos[movimiento - 1].percibe);
						//Saber si al posición se puede mover...
						if(percibePos[movimiento - 1].mueve == true && percibePos[movimiento - 1].percibe <= 3)
						{
							break;
						}
					}while(1);
					direccion = movimiento - 1;
				}
				else
				{
					posiBlesMovimientos.sort();
					direccion = posiBlesMovimientos[0];
				}
				caminar = true;
			}
			else
			{
				disparaFlecha();
			}
		}
	}

	

	function percePersonaje()
	{
		//Revisar si hay avismos y wumpus cercanos...
		var hayAvismo = false;
		var hayWumpus = false;
		var posTmp = [0, 0];
		var estilo = "piso";
		var txtPercibe = "No hay peligro en la cercanías";
		
		var numWumpus = 0;
		var posY = 0;
		var posX = 0;

		var tieneOro = false;
		var caeWumpusMuerto = false;

		//Guadar la posción de la percepción...
		/*
		var filaPercibe = 0;
		var colPercibe = 0;
		*/

		/*Saber si el personaje muere por que hay 
		caído en un avismo o por qué ha caído en la casilla del wumpus.
		Además verificar si ha tomado el ORO..
		*/
		for(var opc = 1; opc <= 2; opc++)
		{
			for(var i in posRevisa)
			{
				if(opc == 1)//Saber si muere...
				{
					posTmp[0] = posPersonaje[0];
					posTmp[1] = posPersonaje[1];
				}
				else
				{
					posTmp[0] = posPersonaje[0] + posRevisa[i][0];//4
					posTmp[1] = posPersonaje[1] + posRevisa[i][1];//0
				}
				if((posTmp[0] >= 0 && posTmp[0] < numCeldas) && (posTmp[1] >= 0 && posTmp[1] < numCeldas))
				{
					//Buscar en el array de Avismos...
					//console.log(posTmp);
					//mundo
					for(var c in mundosWumpus[mundo].posAvismos)
					{
						if(posTmp[0] == mundosWumpus[mundo].posAvismos[c][0] && posTmp[1] == mundosWumpus[mundo].posAvismos[c][1])
						{
							if(opc == 1)
							{
								muere = 1;//Avismo...
							}
							else
							{
								hayAvismo = true;
							}
							break;
						}
						//console.log("Avismo: " + mundosWumpus[mundo].posAvismos[c]);
					}
					//Saber si hay Wumpus cercano...
					if(muere == 0)
					{
						for(var c in mundosWumpus[mundo].posWumpus)
						{
							if(posTmp[0] == mundosWumpus[mundo].posWumpus[c][0] && posTmp[1] == mundosWumpus[mundo].posWumpus[c][1])
							{
								if(opc == 1)
								{
									if(!wumpusMuere)
									{
										muere = 2;
									}
									else
									{
										caeWumpusMuerto = true;
									}
									numWumpus = c; //El número del Wumpus..
								}
								else
								{
									hayWumpus = true;
								}
								break;
							}
							//console.log("Wumpus: " + mundosWumpus[mundo].posWumpus[c]);
						}
					}
					if(muere == 0 && opc == 1)
					{
						for(var c in mundosWumpus[mundo].posOro)
						{
							if(posTmp[0] == mundosWumpus[mundo].posOro[c][0] && posTmp[1] == mundosWumpus[mundo].posOro[c][1])
							{
								llevaOro = tieneOro = true;
								break;
							}
						}
					}
				}
			}
			if(muere != 0)
			{
				//console.log("Muere...");
				break;
			}
		}
		if(muere == 0)
		{
			var tipoPercibe = 0;
			if(hayAvismo && hayWumpus)
			{
				estilo = "viento_hedor";
				txtPercibe = "<b>Hay Hedor y viento está el Wumpus o un avismo cerca</b>";
				tipoPercibe = 3;
			}
			else
			{
				if(hayAvismo)
				{
					estilo = "viento";
					txtPercibe = "<b><font color = 'green'>Hay viento, existe un avismo cercano</font></b>";
					tipoPercibe = 1;
				}
				else
				{
					if(hayWumpus)
					{
						estilo = "hedor";
						txtPercibe = "<b><font color = 'red'>Hay Hedor, el Wumpus está cerca<font></b>";
						tipoPercibe = 2;
					}
				}
			}
			if(tieneOro)
			{
				var posY = mundosWumpus[mundo].posOro[0][0] * 64;
				var posX = mundosWumpus[mundo].posOro[0][1] * 64;
				nom_div("oro_0").setAttribute("class", "brillo basewumpus");
				nom_div("oro_0").style.top = posY + "px";
				nom_div("oro_0").style.left = posX + "px";
				txtPercibe += " <b><font color = 'yellow'>Tienes el oro...<font></b>";
				nom_div("numgold").innerHTML = "Cargados = 1 - Entregados = 0";	
				tieneOro = false;
			}
			if(caeWumpusMuerto)
			{
				var posY = mundosWumpus[mundo].posWumpus[numWumpus][0] * 64;
				var posX = mundosWumpus[mundo].posWumpus[numWumpus][1] * 64;
				console.log("Valo numWumpus es: " + numWumpus);
				nom_div("w_" + numWumpus).setAttribute("class", "muerto basewumpus");
				nom_div("w_" + numWumpus).style.top = posY + "px";
				nom_div("w_" + numWumpus).style.left = posX + "px";
			}
			//Guadar la percepción...
			//console.log(filaPercibe, colPercibe, tipoPercibe);
		}
		else
		{
			//audios("Star.mp3");
			if(llevaOro)
			{
				var posY = mundosWumpus[mundo].posOro[0][0] * 64;
				var posX = mundosWumpus[mundo].posOro[0][1] * 64;
				nom_div("oro_0").setAttribute("class", "basemundo oro basewumpus");
				nom_div("oro_0").style.top = posY + "px";
				nom_div("oro_0").style.left = posX + "px";
				nom_div("numgold").innerHTML = "Cargados = 0 - Entregados = 0";
				llevaOro = false;
			}

			//Posicionar al personaje en el punto de inicio de nuevo...
			if(muere == 1)//Avismo..
			{
				estilo = "avismo";
				tipoPercibe = 4;
				txtPercibe = " <b><font color = 'blue'>El aventurero a muerto, cayó en un avismo...<font></b>";
			}
			else
			{
				estilo = "piso";
				tipoPercibe = 5;
				txtPercibe = "<b><font color = 'blue'>El aventurero a muerto, el Wumpus lo ha deborado<font></b>";
				//Ubicar el div del Wumpus...
				var posY = mundosWumpus[mundo].posWumpus[numWumpus][0] * 64;
				var posX = mundosWumpus[mundo].posWumpus[numWumpus][1] * 64;
				console.log("Valo numWumpus es: " + numWumpus);
				nom_div("w_" + numWumpus).setAttribute("class", "basemundo wumpus basewumpus");
				nom_div("w_" + numWumpus).style.top = posY + "px";
				nom_div("w_" + numWumpus).style.left = posX + "px";
			}
		}
		nom_div("percibe").innerHTML += txtPercibe + "<br>";
		nom_div("percibe").scrollTop = "10000";
		var posCelda = "d_" + posPersonaje[0] + "_" + posPersonaje[1];
		nom_div(posCelda).setAttribute("class", "basemundo " + estilo);
		guardaPercepcion(posPersonaje[0], posPersonaje[1], tipoPercibe);
	}

	function crea_escenario (celdas)
	{
		var txt = "<table id='chess_board' cellpadding='0' cellspacing='0'>";
		var nom_div = "";
		var i = 0;
		//var estilo = "";
		for(i = 0; i < celdas; i++)
		{
			txt += "<tr>";
			for(var c = 0; c < celdas; c++)
			{
				nom_div = "d_" + i + "_" + c;
				txt += "<td id = '"+(nom_div)+"'></td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		txt += "<div id = 'personaje'></div>";
		//Para crear la cantidad de Wumpus solicitada...
		for(i = 0; i < mundosWumpus[mundo].posWumpus.length; i++)
		{
			txt += "<div id = 'w_"+i+"'></div>";
		}
		for(i = 0; i < mundosWumpus[mundo].posOro.length; i++)
		{
			txt += "<div id = 'oro_"+i+"'></div>";
		}
		//Para ubicar el oro...
		return txt;
	}

	var numPos = [];
	setInterval(function()
	{
		if(caminar)
		{
			nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_" + paso);
			paso++;
			var posX = parseInt(nom_div("personaje").style.left);
			var posY = parseInt(nom_div("personaje").style.top);
			switch(direccion)
			{
				case 0: posX -= 16; break;
				case 1: posY -= 16; break;
				case 2: posX += 16; break;
				case 3: posY += 16; break;
			}
			if((posX >= 0 && posX <= maxEscena) && (posY >= 0 && posY <= maxEscena))
			{
				nom_div("personaje").style.left = posX + "px";
				nom_div("personaje").style.top = posY + "px";
			}
			if(paso >= 5)
			{
				paso = 1;
				caminar = false;
				nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
				numPos[0] = posPersonaje[0] + posRevisa[direccion][0];
				numPos[1] = posPersonaje[1] + posRevisa[direccion][1];
				if((numPos[0] >= 0 && numPos[0] < numCeldas) && (numPos[1] >= 0 && numPos[1] < numCeldas))
				{
					posPersonaje[0] += posRevisa[direccion][0];
					posPersonaje[1] += posRevisa[direccion][1];
				}
				if(muere != 0)
				{
					visitados = []; //Reinicia los visitados anteriomente...
					//audios("muere.mp3");
					posY = mundosWumpus[mundo].posAventurero[0] * 64;
					posX = mundosWumpus[mundo].posAventurero[1] * 64;
					//nom_div("personaje").setAttribute("class", "basepersonaje front_1");
					nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
					nom_div("personaje").style.top = posY + "px";
					nom_div("personaje").style.left = posX + "px";
					//console.log("Pos es: " + mundosWumpus[mundo].posAventurero);		
					posPersonaje[0] = mundosWumpus[mundo].posAventurero[0];
					posPersonaje[1] = mundosWumpus[mundo].posAventurero[1];
					muere = 0;
				}
				percePersonaje(); //Buscar la percepción del persoje...
				movimientoPersonaje();
				/*
				if(!caminar)
				{
					animaMovimiento = false;
					nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
				}
				*/
			}
		}
	}, 100);

	function disparaFlecha()
	{
		var txtPercibe = "No tienes flechas disponibles :(";
		var muere = false;
		var posWumpusMuere = 0;
		if(numFlechas > 0)
		{
			//console.log("Pos personaje: " + posPersonaje);
			//posPersonaje[0] = fila
			//posPersonaje[0] = columna
			//console.log("Pos Wumpus");
			for(var i = 0; i < mundosWumpus[mundo].posWumpus.length; i++)
			{
				//console.log(mundosWumpus[0].posWumpus[i]);
				posWumpusMuere = i;
				if(direccion == 0 || direccion == 2)//Izquierda, Derecha...
				{
					if(posPersonaje[0] === mundosWumpus[mundo].posWumpus[i][0])
					{
						//console.log("Está en la misma fila...");
						if(direccion == 0)//Izquierda...
						{
							if(mundosWumpus[mundo].posWumpus[i][1] < posPersonaje[1])
							{
								muere = true;
							}
						}
						else
						{
							if(mundosWumpus[mundo].posWumpus[i][1] > posPersonaje[1])
							{
								muere = true;
							}
						}
					}
				}
				else
				{
					//Arriba, abajo...
					if(posPersonaje[1] === mundosWumpus[mundo].posWumpus[i][1])
					{
						if(direccion == 1)//Arriba...
						{
							if(mundosWumpus[mundo].posWumpus[i][0] < posPersonaje[0])
							{
								muere = true;
							}
						}
						else
						{
							if(mundosWumpus[mundo].posWumpus[i][0] > posPersonaje[0])
							{
								muere = true;
							}
						}
						//console.log("Está en la misma Columna...");
					}
				}
				if(muere)
				{
					wumpusMuere = true;
					audios("grito.mp3");
					txtPercibe = "Haz asesinado al Wumpus :)";
					var filaWumpus = mundosWumpus[mundo].posWumpus[posWumpusMuere][0];
					var colWumpus = mundosWumpus[mundo].posWumpus[posWumpusMuere][1];
					var elementoWumpus = nom_div("d_" + filaWumpus + "_" + colWumpus).className;
					if(elementoWumpus != "")
					{
						nom_div("w_" + posWumpusMuere).setAttribute("class", "muerto basewumpus");
					}
					break;
				}
			}
			numFlechas--;
			nom_div("numflecha").innerHTML = numFlechas + " Disponible(s)";
		}
		nom_div("percibe").innerHTML += txtPercibe + "<br>";
		nom_div("percibe").scrollTop = "10000";
		//percePersonaje(); //Buscar la percepción del persoje...
		movimientoPersonaje();
	}

	
	function audios(audio)
	{
		var txt = "<audio autoplay>";
		txt += "<source src = '"+(audio)+"' type = 'audio/mpeg'></audio>";
		nom_div("sonido").innerHTML = txt;
	}

	var presionado = false;
	window.onkeydown = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which;
		if(!presionado)
		{
			if(code >= 37 && code <= 40)
			{
				direccion = code - 37;
				nom_div("personaje").setAttribute("class", "basepersonaje " + direcciones[direccion] + "_1");
			}
			else
			{
				if(code == 65)
				{
					if(caminar == false && animaMovimiento == false)
					{
						animaMovimiento = caminar = true;
					}
				}
				else
				{
					if(code == 83)//Tecla "s"...
					{
						disparaFlecha();
						//audios("grito.mp3");
					}
				}
			}
			presionado = true;
		}
	}
	window.onkeyup = function(e)
	{
		var code = e.keyCode ? e.keyCode : e.which;
		if(presionado)
		{
			if(code == 65)
			{
				if(caminar == true)
				{
					caminar = false;
				}
			}
			presionado = false;
		}
	}
}

function nom_div(div)
{
	return document.getElementById(div);
}