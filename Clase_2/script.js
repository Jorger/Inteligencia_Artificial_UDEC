//abcd e fghijklmnopqrstuvwxyz
var cesar = function (tipo, palabra, corrimiento) 
{
	palabra = palabra.toLowerCase();
	var nuevoValAscii = 0;
	var cifrado = "";
	if(tipo === 1)//Cifrado...
	{
		for(var i = 0; i < palabra.length ; i++)
		{
			var val_ascii = palabra.charCodeAt(i);
			if(val_ascii != 32)
			{
				if(val_ascii + corrimiento <= 122) // z
				{
					nuevoValAscii = val_ascii + corrimiento;
				}
				else
				{
					nuevoValAscii = val_ascii;
					for(var c = 1; c <= corrimiento; c++)
					{
						if(nuevoValAscii + 1 > 122)
						{
							nuevoValAscii = 97;
						}
						else
						{
							nuevoValAscii++;
						}
					}
				}
				cifrado += String.fromCharCode(nuevoValAscii);
			}
			else
			{
				cifrado += " ";
			}
		}
	}
	else
	{
		for(var i = 0; i < palabra.length ; i++)
		{
			var val_ascii = palabra.charCodeAt(i);
			if(val_ascii != 32)
			{
				if(val_ascii - corrimiento >= 97) // a
				{
					nuevoValAscii = val_ascii - corrimiento;
				}
				else
				{
					nuevoValAscii = val_ascii;
					for(var c = 1; c <= corrimiento; c++)
					{
						if(nuevoValAscii - 1 < 97)
						{
							nuevoValAscii = 122;
						}
						else
						{
							nuevoValAscii--;
						}
					}
				}
				cifrado += String.fromCharCode(nuevoValAscii);
			}
			else
			{
				cifrado += " ";
			}
		}
	}
	return cifrado;
};