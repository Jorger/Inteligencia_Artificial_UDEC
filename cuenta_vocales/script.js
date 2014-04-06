window.onload = function()
{
	var vocalesFrase = function(palabra, acentos, ordenar)
	{
		var vocales = [["a", 0, /[àáâä]/], 
					   ["e", 0, /[èéêë]/], 
					   ["i", 0, /[ìíîï]/], 
					   ["o", 0, /[òóôö]/], 
					   ["u", 0, /[ùúûü]/]]; 
		var letra = "";
		for(var i = 0; i < palabra.length; i++)
		{
			letra = palabra.charAt(i).toLowerCase();
			//Primero eliminar los acentos del caso...
			if(acentos)
			{
				vocales.forEach(function(v)
				{
					letra = letra.replace(v[2], v[0]);
				});
			}
			vocales.forEach(function(v)
			{
				if(letra === v[0])
				{
					v[1]++;
					return false;
				}
			});
		}
		//Ordenar los resultados...
		if(ordenar != 0)
		{
			vocales = vocales.sort(function(a,b)
			{
 				if(ordenar == 1)
 				{
 					return a[1] < b[1]; //Mayor a menor...
 				}
 				else
 				{
 					return a[1] > b[1]; //Menor a mayor...
 				}
 			});
		}
		var txt = "La frase compuesta por <b>"+palabra.length+"</b> carácteres, contiene ";
		txt += "las siguientes vocales: <ol>";
		var clase = "";
		for(var i in vocales)
		{
			clase = "";
			if(vocales[i][1] != 0)
			{
				clase = "encuentra";
			}
			txt += "<li class = 'fuente "+(clase)+"'>" + vocales[i][0] + " = " + vocales[i][1] + "</li>";
		}
		txt += "</0l>";
		nom_div("conteo").innerHTML = txt;
	}
	nom_div("texto").onkeyup = function(e)
	{
		var tipoOrdena = Number(nom_div("opcOrdenar").value);
		vocalesFrase(this.value, nom_div("conAcentos").checked, tipoOrdena);
	}

	nom_div("conAcentos").addEventListener('change', function(event)
	{
		var tipoOrdena = Number(nom_div("opcOrdenar").value);
		vocalesFrase(nom_div("texto").value, this.checked, tipoOrdena);
	});

	nom_div("opcOrdenar").addEventListener('change', function(event)
	{
		var tipoOrdena = Number(this.value);
		vocalesFrase(nom_div("texto").value, nom_div("conAcentos").checked, tipoOrdena);
	});

	//Función auxiliar...
	function nom_div(div)
	{
		return document.getElementById(div);
	}
}