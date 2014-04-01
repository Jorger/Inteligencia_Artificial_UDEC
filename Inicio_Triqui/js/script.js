window.onload = function()
{
	inicio();
}

var debug = "";

function inicio()
{
	var fichaJugador = 1;
	var txtFichas = ["X", "O"];
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
	//Hacer referencia a los elemenros del escenario...
	for(var i = 1; i <= 3; i++)
	{
		for(var c = 1; c <= 3; c++)
		{
			divTabla = i + "_" + c;
			nom_div(divTabla).addEventListener('click', function(event)
			{
				console.log(divTabla);
				var posClick = event.target.id.split("_");
				//Validar si está libre la celda...
				var valCelda = nom_div(posClick[0]+"_"+posClick[1]).innerHTML;
				if(valCelda == "")
				{
					nom_div(posClick[0]+"_"+posClick[1]).innerHTML = txtFichas[fichaJugador - 1];
					nom_div("seleJugada").disabled = true;
					revisarTriqui(fichaJugador);
				}
			});
		}
	}

	function revisarTriqui(ficha)
	{
		var cont = 0;
		var estriqui = false;
		var d = i = c = 0;
		var valCampo = 0;
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
					}
					else
					{
						valCampo = nom_div(c+"_"+i).innerHTML;
					}
					if(valCampo === txtFichas[ficha - 1])
					{
						cont++;
					}
				}
				if(cont == 3)
				{
					//alert("Triqui...");
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
					}
					else
					{
						valCampo = nom_div(i+"_"+c).innerHTML;
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
		return estriqui;
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