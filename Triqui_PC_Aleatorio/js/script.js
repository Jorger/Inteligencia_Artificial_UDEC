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
	var creaEscenario = function()
	{
		var txt = "<table id = 'chess_board' cellpadding = '0' cellspacing = '0'>";
		var divTabla = "";
		for(var i = 1; i <= 3; i++)
		{
			txt += "<tr>";
			for(var c = 1; c <= 3; c++)
			{
				divTabla = i + "_" + c;
				txt += "<td id = '"+(divTabla)+"'></td>";
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
		for(i = 1; i <= 3; i++)
		{
			for(c = 1; c <= 3; c++)
			{
				nom_div(i+"_"+c).style.color = "black";
				nom_div(i+"_"+c).style.fontSize="60px";
				nom_div(i+"_"+c).innerHTML = "";
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
					nom_div("seleJugada").disabled = true;
					procesarJugada(fichaJugador, 1);
				}
			});
		}
	}
	/*
	jugador: Humano : 1, PC = 2
	*/
	function procesarJugada(fichaJugador, jugador)
	{
		var nomJugador = ["Humano", "PC"];
		var hayTriqui = revisarTriqui(fichaJugador);
		var quedaTablas = entablas();
		var txtPuntua = "";
		//No hay triqui y además hay espacio
		if(!hayTriqui && !quedaTablas)
		{
			if(jugador == 1)
			{
				juegaPC();
			}
		}
		else
		{
			if(hayTriqui)
			{
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

	function revisarTriqui(ficha)
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
		return estriqui;
	}

	function entablas()
	{
		var empatados = true;
		for(i = 1; i <= 3; i++)
		{
			for(c = 1; c <= 3; c++)
			{
				if(nom_div(i+"_"+c).innerHTML == "")
				{
					empatados = false;
					break;
				}
			}
			if(!empatados)
			{
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
				procesarJugada(fichaPC, 2);
				break;
			}
		}while(1);
	}

	nom_div("seleJugada").addEventListener('change', function(event)
	{
		fichaJugador = Number(this.value);
	});
}

function nom_div(div)
{
	return document.getElementById(div);
}