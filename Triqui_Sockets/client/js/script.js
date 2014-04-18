window.onload = function()
{
	inicio();
}
function inicio()
{
	//Capturar variables de la URL (GET)...
	function getUrlVars() 
	{
    	var vars = {};
    	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) 
    	{
        	vars[key] = value;
    	});
    	return vars;
	}
	var fichaJugador = 0;
	var terminaJuego = false;
	var sala = getUrlVars()["sala"];
	var jugadorInicia = 0;
	//Crear el Socket de conexión al server...
	var serverBaseUrl = "http://localhost:8088";
	var socket = io.connect(serverBaseUrl);
	var sessionId = '';
	var idUsuario = Math.floor((Math.random() * 10000) + 1);
	socket.on('connect', function ()
	{
	    sessionId = socket.socket.sessionid;
	    socket.emit('nuevoUsuario', {id: sessionId, sala: sala, idusuario: idUsuario});
	});
	//Traer a los usuarios que están conectados...
	socket.on('nuevaConexion', function (data)
  	{
  		if(data.num > 2 && data.para == idUsuario)
  		{
  			alert("La partida ya tiene dos usuarios");
  			terminaJuego = true;
  		}
  		else
  		{
	  		for(var i = 0; i < data.participantes.length; i++) 
	  		{
	  			console.log(data.participantes[i].id);
	  			if(data.participantes[i].id === idUsuario)
  				{
  					fichaJugador = data.participantes[i].ficha;
  					if(data.participantes[i].ficha == 1) //Es quien comenzará...
		  			{
		  				nom_div("inicia").innerHTML = "INICIAS TU EL JUEGO";
		  			}
		  			else
		  			{
		  				nom_div("inicia").innerHTML = "ESPERANDO LA JUGADA";
		  				terminaJuego = true;	
		  			}
  				}
	  		}
  		}
  	});

  	socket.on('haceJugada', function (data)
  	{
  		if(data.id != idUsuario)//No es el mismo usuario...
  		{
  			nom_div(data.f+"_"+data.c).innerHTML = txtFichas[data.ficha - 1];
  			terminaJuego = false;
  			nom_div("inicia").innerHTML = "ES TU TURNO!!";
  			procesarJugada(data.ficha);
  		}
  	});
	//Fin de la conexión al Socket...
	var txtFichas = ["X", "O"];
	var puntuaJuego = [0, 0];
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
					//Enviar la jugada del jugador...
  					socket.emit('juega', {sala: sala, id: idUsuario, fila: posClick[0], columna: posClick[1], ficha: fichaJugador});
  					nom_div("inicia").innerHTML = "ESPERANDO LA JUGADA";
  					//Fin de enviar la jugada...
					procesarJugada(fichaJugador);
					terminaJuego = true; //Esperando la próxima jugada...
				}
			});
		}
	}
	/*
	jugador: Humano : 1, PC = 2
	*/
	function procesarJugada(ficha)
	{
		var nomJugador = ["Jugador UNO", "Jugador DOS"];
		var hayTriqui = resaltarTriqui(ficha);
		var quedaTablas = entablas();
		var txtPuntua = "";
		//No hay triqui y además hay espacio
		if(hayTriqui || quedaTablas)
		{
			if(hayTriqui)
			{
				resaltarTriqui(ficha);
				puntuaJuego[ficha - 1]++;
				txtPuntua = "Jugador UNO = "+(puntuaJuego[0])+" - Jugador DOS = " + puntuaJuego[1];
				nom_div("puntuacion").innerHTML = txtPuntua;
				alert("Ha hecho triqui El " + nomJugador[ficha - 1]);
			}
			else
			{
				alert("El juego ha quedao en Tablas");
			}
			terminaJuego = true;			
		}
	}

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
			if(!empatados) // if(empatados == false)
			{
				break;
			}
		}
		return empatados;
	}
}

function nom_div(div)
{
	return document.getElementById(div);
}