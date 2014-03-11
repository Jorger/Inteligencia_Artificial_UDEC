var elementos = ["Piedra", "Papel", "Tijera", "Lagarto", "Spock"];
var puntua = [0 , 0];
function jugar()
{
	var humano = Number($d("jugada_humano").value);
	var pc = Math.floor((Math.random()*5)+1); //Aleatorio entre 1 y 5...
	$d("juega_pc").innerHTML = elementos[pc - 1]; //Mostrará la jugada del PC...
	var txt = "";
	var fun_ejecuta = juego_user_pc(humano, pc);	
	if(fun_ejecuta[0] == 0)
	{
		txt = "Hubo un empate entre: " + elementos[humano - 1] + " y " + elementos[pc - 1];
	}
	else
	{
		if(fun_ejecuta[0] === humano)
		{
			txt = "Gana el Humano";
			puntua[0]++;
			$d("pun_1").innerHTML = puntua[0];
		}
		else
		{
			txt = "Gana el ROBOT";
			puntua[1]++;
			$d("pun_2").innerHTML = puntua[1];
		}
		txt += " Debido a que: " + fun_ejecuta[1];				
	}
	$d("resultado").innerHTML = txt;	

}

function $d(id)
{
	return document.getElementById(id);
}

function juego_user_pc(jugador_1, jugador_2)
{	
	/*
	1 = Piedra
	2 = Papel
	3 = Tijera
	4 = Lagarto
	5 = Spock
	---------------------- Jugadas -------------------------------
 	3 y 2: Ganana 3	: Las tijeras cortan el papel
	2 y 1: Gana 2 	: "value", el papel cubre a la piedra -> 			
 	1 y 4: Gana 1	: la piedra aplasta al lagarto ->
 	4 y 5 : Gana 4	: el lagarto envenena a Spock -> 			
 	5 y 3 : Gana 5	: Spock destroza las tijeras -> 			
 	3 y 4 : Gana 3	: las tijeras decapitan al lagarto -> 	
 	4 y 2 : gana 4	: el lagarto se come el papel -> 			
 	2 y 5 : Gana 2	: el papel refuta a Spock -> 				
 	5 y 1 : Gana 5	: Spock vaporiza la piedra ->  			
 	1 y 3 : Gana 3	: Piedra aplasta las tijeras -> 			
	*/	
	var jugadas = [{"mov" : [3,2], "gana" : 3, "mensaje" : "Las tijeras cortan el papel"}, 
				   {"mov" : [2,1], "gana" : 2, "mensaje" : "El papel cubre a la piedra"}, 
				   {"mov" : [1,4], "gana" : 1, "mensaje" : "La piedra aplasta al lagarto"}, 
				   {"mov" : [4,5], "gana" : 4, "mensaje" : "El lagarto envenena a Spock"},
				   {"mov" : [5,3], "gana" : 5, "mensaje" : "Spock destroza las tijeras"},
				   {"mov" : [3,4], "gana" : 3, "mensaje" : "Las tijeras decapitan al lagarto"},
				   {"mov" : [4,2], "gana" : 4, "mensaje" : "El lagarto se come el papel"},
				   {"mov" : [2,5], "gana" : 2, "mensaje" : "El papel refuta a Spock"},
				   {"mov" : [5,1], "gana" : 5, "mensaje" : "Spock vaporiza la piedra"},
				   {"mov" : [1,3], "gana" : 5, "mensaje" : "Piedra aplasta las tijeras"}
				   ];
	var retorna = [0, 0];
	if(jugador_1 != jugador_2)
	{		
		for(var i in jugadas)
		{			
			if((jugadas[i].mov[0] === jugador_1 && jugadas[i].mov[1] === jugador_2) || (jugadas[i].mov[0] === jugador_2 && jugadas[i].mov[1] === jugador_1))
			{				
				retorna[0] = jugadas[i].gana;
				retorna[1] = jugadas[i].mensaje;
				break;
			}
		}
	}
	return retorna;
}