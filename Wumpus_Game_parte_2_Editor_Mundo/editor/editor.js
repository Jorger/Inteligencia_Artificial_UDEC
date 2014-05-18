window.onload = function()
{
	inicia();
}

function inicia()
{
	var celdas = 4;
	function crea_escenario ()
	{
		var txt = "<table id='chess_board' cellpadding = '0' cellspacing='0'>";
		var nom_div = "";
		var estilo = "basemundo piso";
		for(var i = 0; i < celdas; i++)
		{
			txt += "<tr>";
			for(var c = 0; c < celdas; c++)
			{
				nom_div = "d_" + i + "_" + c;
				txt += "<td id = '"+(nom_div)+"' "+(estilo)+"></td>";
			}
			txt += "</tr>";
		}
		txt += "</table>";
		return txt;
	}
	nom_div("escenario").innerHTML = crea_escenario();
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}