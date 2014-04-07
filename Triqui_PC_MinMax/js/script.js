window.onload = function()
{
	inicio();
}
function inicio()
{
	var fichaJugador = 1;
	var txtFichas = ["X", "O"];
	var terminaJuego = false;
	var puntuaJuego = [0, 0];
	var turnos = 0;
	var vectorMinMAX = []; //Para Guardar los posibles movimientos MinMax
	var primerMovimiento = true; //Para índicar si es el primer movimiento para arrojarlo al azar...
	var conMinMax = 1; // Si se aplicará el algortimo MinMax al Juego...

	var creaEscenario = function()
	{
		var txt = "<table id = 'chess_board' cellpadding = '0' cellspacing = '0'>";
		var divTabla = "";
		var cont = 0;
		for(var i = 1; i <= 3; i++)
		{
			txt += "<tr>";
			for(var c = 1; c <= 3; c++)
			{
				divTabla = i + "_" + c;
				txt += "<td id = '"+(divTabla)+"'></td>";
				vectorMinMAX[cont] = 0;
				cont++;
			}
			txt += "</tr>";
		}
		txt += "</table>";
		return txt;
	}
	nom_div("escenario").innerHTML = creaEscenario();

	var limpiaEscenario = function()
	{
		terminaJuego = false;
		primerMovimiento = true;
		var cont = 0;
		for(i = 1; i <= 3; i++)
		{
			for(c = 1; c <= 3; c++)
			{
				nom_div(i+"_"+c).style.color = "black";
				nom_div(i+"_"+c).style.fontSize="60px";
				nom_div(i+"_"+c).innerHTML = "";
				vectorMinMAX[cont] = 0;
				cont++;
			}
		}
		if(turnos % 2 == 0)
		{
			nom_div("inicia").innerHTML = "Inicia el PC";
			juegaPC();
		}
		else
		{
			nom_div("inicia").innerHTML = "Inicia el Humano";
			nom_div("seleJugada").disabled = false;
		}
		turnos++;
	}

	nom_div("iniJuego").addEventListener('click', function(event)
	{
		limpiaEscenario();
	});

	//Hacer referencia a los elemenros del escenario...
	for(var i = 1; i <= 3; i++)
	{
		for(var c = 1; c <= 3; c++)
		{
			divTabla = i + "_" + c;
			nom_div(divTabla).addEventListener('click', function(event)
			{
				var posClick = event.target.id.split("_");
				//Validar si está libre la celda...
				var valCelda = nom_div(posClick[0]+"_"+posClick[1]).innerHTML;
				if(valCelda == "" && !terminaJuego)
				{
					nom_div(posClick[0]+"_"+posClick[1]).innerHTML = txtFichas[fichaJugador - 1];
					//Almacenar el movimiento en el vector de minMax...
					posMinMax(Number(posClick[0]), Number(posClick[1]), 1);
					nom_div("seleJugada").disabled = true;
					procesarJugada(fichaJugador, 1);
				}
			});
		}
	}

	function posMinMax(fila, columna, jugador)
	{
		var ind = 0;
		if(fila == 1)
		{
			ind = columna;
		}
		else
		{
			if(fila == 2)
			{
				ind = columna + 3;
			}
			else
			{
				ind = columna + 6;	
			}
		}
		vectorMinMAX[ind - 1] = jugador;
	}
	/*
	jugador: Humano : 1, PC = 2
	*/
	function procesarJugada(fichaJugador, jugador)
	{
		var nomJugador = ["Humano", "PC"];
		var hayTriqui = revisarTriqui(jugador);
		var quedaTablas = entablas();
		var txtPuntua = "";
		//No hay triqui y además hay espacio
		if(!hayTriqui && !quedaTablas)
		{
			if(jugador == 1)
			{
				if(primerMovimiento || conMinMax == 2)
				{
					juegaPC();
				}
				else
				{
					//Se inicia el proceso de MIN-MAX
					movimientoPC();
				}
			}
		}
		else
		{
			if(hayTriqui)
			{
				resaltarTriqui(fichaJugador);
				puntuaJuego[jugador - 1]++;
				txtPuntua = "Humano = "+(puntuaJuego[0])+" - PC = " + puntuaJuego[1];
				nom_div("puntuacion").innerHTML = txtPuntua;
				alert("Ha hecho triqui El " + nomJugador[jugador - 1]);
			}
			else
			{
				alert("El juego ha quedao en Tablas");
			}
			terminaJuego = true;			
		}
	}

	//Funciones MIN-MAX...
	function movimientoPC()
	{
		var posicion = 0;
		var aux, mejor = -9999;
		for (var i = 0; i < 9;i++)
		{
			if (vectorMinMAX[i] == 0)
			{
				vectorMinMAX[i] = 2; //Juega el PC...	
				aux = Min();
				if (aux > mejor)
				{
					mejor = aux;
					posicion = i;
				}
				vectorMinMAX[i] = 0; //Se reestablece el escenario...
			}
		}
		//Poner la jugada del PC...
		var fila = columna = 0;
		var posTablero = posicion + 1;
		if(posTablero <= 3)
		{
			fila = 1;
			columna = posTablero;
		}
		else
		{
			if(posTablero <= 6)
			{
				fila = 2;
				columna = posTablero - 3;
			}
			else
			{
				fila = 3;
				columna = posTablero - 6;
			}
		}
		var fichaPC = 1;
		if(fichaJugador == 1)
		{
			fichaPC = 2;
		}
		nom_div(fila+"_"+columna).innerHTML = txtFichas[fichaPC - 1];
		vectorMinMAX[posicion] = 2;
		procesarJugada(fichaPC, 2);
	}

	function Min()
	{
		//Primer saber si el PC haría Triqui...
		if(revisarTriqui(2)) return 1;
		if(entablas()) return 0;
		var aux, mejor = 9999;
		for (var i=0;i<9;i++)
		{
			if (vectorMinMAX[i] == 0)
			{
				vectorMinMAX[i] = 1; //Juega el HUMANO...	
				aux = Max();
				if (aux < mejor)
				{
					mejor = aux;
				}
				vectorMinMAX[i] = 0;
			}
		}
		return mejor;
	}

	function Max()
	{
		if(revisarTriqui(1)) return -1;
		if(entablas()) return 0;
		var aux, mejor = -9999;
		for (var i=0;i<9;i++)
		{
			if (vectorMinMAX[i] == 0)
			{
				vectorMinMAX[i] = 2; //Juega el PC...	
				aux = Min();
				if (aux > mejor)
				{
					mejor = aux;
				}
				vectorMinMAX[i] = 0;
			}
		}
		return mejor;
	};
	//Fin de Funciones MIN-MAX...
	function resaltarTriqui(ficha)
	{
		var cont = 0;
		var estriqui = false;
		var d = i = c = 0;
		var valCampo = 0;
		var celdasTriqui = []; //Guardará las celdas del triqui...
		//Horizontal y verticial...
		for(d = 1; d <= 2; d++)
		{
			for(i = 1; i <= 3; i++)
			{
				cont = 0;
				for(c = 1; c <= 3; c++)
				{
					if(d == 1)//Horizontales...
					{
						valCampo = nom_div(i+"_"+c).innerHTML;
						celdasTriqui[cont] = i + "_" + c;
					}
					else
					{
						valCampo = nom_div(c+"_"+i).innerHTML;
						celdasTriqui[cont] = c + "_" + i;
					}
					if(valCampo === txtFichas[ficha - 1])
					{
						cont++;
					}
				}
				if(cont == 3)
				{
					estriqui = true;
					break;
				}
			}
			if(estriqui == true)
			{
				break;
			}
		}
		//Valida las diagonales...
		if(estriqui == false) // if(!estriqui)
		{
			//Buscar las diagonales...
			for(d = 1; d <= 2; d++)
			{
				cont = 0;
				for(i = 1, c = 3; i <= 3; i++, c--)
				{
					if(d == 1)//Diaginal de izquierda a derecha...
					{
						valCampo = nom_div(i+"_"+i).innerHTML;
						celdasTriqui[cont] = i + "_" + i;
					}
					else
					{
						valCampo = nom_div(i+"_"+c).innerHTML;
						celdasTriqui[cont] = i + "_" + c;
					}
					if(valCampo === txtFichas[ficha - 1])
					{
						cont++;
					}
				}
				if(cont == 3)
				{
					estriqui = true;
					break;
				}
			}
		}
		if(estriqui)
		{
			//Resaltar el triqui...
			var parDatos = "";
			var celda = "";
			for(i = 1; i <= 3; i++)
			{
				for(c = 1; c <= 3; c++)
				{
					celda = nom_div(i+"_"+c);
					for(d = 0; d < 3; d++)
					{
						parDatos = celdasTriqui[d].split("_");
						if(Number(parDatos[0]) == i && Number(parDatos[1]) == c)
						{
							celda.style.color = "red";
							celda.style.fontSize="80px";
							break;
						}
						else
						{
							celda.style.color = "gray";
							celda.style.fontSize="30px";
						} 
					}
				}
			}
		}
	}



	function revisarTriqui(ficha)
	{
		//HORIZONTAL
		var estriqui = (vectorMinMAX[0] == ficha && vectorMinMAX[1] == ficha && vectorMinMAX[2]==ficha);
		estriqui = estriqui || (vectorMinMAX[3] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[5]==ficha);
		estriqui = estriqui || (vectorMinMAX[6] == ficha && vectorMinMAX[7] == ficha && vectorMinMAX[8]==ficha);
		//VERTICALES
		estriqui = estriqui || (vectorMinMAX[0] == ficha && vectorMinMAX[3] == ficha && vectorMinMAX[6]==ficha);
		estriqui = estriqui || (vectorMinMAX[1] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[7]==ficha);
		estriqui = estriqui || (vectorMinMAX[2] == ficha && vectorMinMAX[5] == ficha && vectorMinMAX[8]==ficha);
		//DIAGONAlES
		estriqui = estriqui || (vectorMinMAX[0] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[8]==ficha);
		estriqui = estriqui || (vectorMinMAX[2] == ficha && vectorMinMAX[4] == ficha && vectorMinMAX[6]==ficha);
		return estriqui;
	}

	function entablas()
	{
		var empatados = true;
		for(var i = 0; i < vectorMinMAX.length; i++)
		{
			if(vectorMinMAX[i] == 0)
			{
				empatados = false;
				break;
			}
		}
		return empatados;
	}

	function juegaPC()
	{
		//Determinar la ficha que le corresponde al PC en 
		//función a la que tiene el juagdor...
		var fila = 0;
		var columna = 0;
		var pc = 0;
		var fichaPC = 1;
		var valCampo = "";
		if(fichaJugador == 1)
		{
			fichaPC = 2;
		}
		do
		{
			pc = Math.floor((Math.random() * 9) + 1);
			//Buscar si la posición que ha arrojado el juagdor no está ocupada...
			if(pc <= 3)
			{
				fila = 1;
				columna = pc;
			}
			else
			{
				if(pc <= 6)
				{
					fila = 2;
					columna = pc - 3;
				}
				else
				{
					fila = 3;
					columna = pc - 6;	
				}
			}
			if(nom_div(fila+"_"+columna).innerHTML == "")
			{
				//El espacio está libre...
				nom_div(fila+"_"+columna).innerHTML = txtFichas[fichaPC - 1];
				posMinMax(fila, columna, 2);
				procesarJugada(fichaPC, 2);
				primerMovimiento = false;
				break;
			}
		}while(1);
	}

	nom_div("seleJugada").addEventListener('change', function(event)
	{
		fichaJugador = Number(this.value);
	});

	nom_div("seleIA").addEventListener('change', function(event)
	{
		conMinMax = Number(this.value);
	});
	
	function nom_div(div)
	{
		return document.getElementById(div);
	}	
}