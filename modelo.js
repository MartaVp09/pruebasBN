function Juego(){
	this.partidas=[];
	this.usuarios={};  //array asociativo [clave][objeto]
	
	this.agregarUsuario=function(nick){
		let res={"nick":-1};
		if(!this.usuarios[nick]){
			this.usuarios[nick]=new Usuario(nick, this)
			res={"nick":nick};
			console.log("Nuevo usuario: "+nick);
		}
		return res;
	}
	this.eliminarUsuario=function(nick){
		delete this.usuarios[nick];	
		console.log("El usuario "+nick+" ha salido del juego.")
	}
	this.eliminarPartida=function(index){
		console.log("Partida "+this.partidas[index].codigo+" eliminada.");
		delete this.partidas[index];	
	}

	this.obtenerPartida=function(codigo){
		return this.partidas[codigo];
    }
	this.obtenerUsuario=function(nick){
		if(this.usuarios[nick]){
			return this.usuarios[nick];
		}
	}

	this.jugadorCreaPartida=function(nick){
		let usr = this.usuarios[nick];  //juego.obtenerUsuario(nick)
		let res = {"codigo":-1};
		let codigo;

		if (usr){
			codigo = usr.crearPartida();
			res={"codigo":codigo};
		}

		return res;
	}
	
	this.crearPartida=function(user){
		//obtener código único
		//crear partida con propietario nick
		//devolver el código
		let codigo=Date.now();
		this.partidas[codigo]=new Partida(codigo,user);
		return codigo;
	}
	
	this.unirseAPartida=function(codigo,user){
		let res=-1;
		if (this.partidas[codigo]){
			res=this.partidas[codigo].agregarJugador(user);
		}else{
			console.log("La partida no existe");
		}
		return res;
	}

	this.jugadorSeUneAPartida=function(nick, codigo){
		let usr=this.usuarios[nick];
		let res={"codigo":-1};
		let valor;

		if (usr){
			valor = this.unirseAPartida(codigo, usr);
			res={"codigo":valor};
		}
		return res;
	}
	
	this.salir=function(nick){
		let res={"codigo":-1};
		this.eliminarUsuario(nick);
		for (let key in this.partidas){
			if(this.partidas[key].owner.nick==nick){
				res={"codigo":this.partidas[key].codigo};
				this.eliminarPartida(key);
			}
		}
		return res;
	}
	
	this.obtenerPartidas=function(){
		//return this.partidas;
		let lista=[];
		for (let key in this.partidas){
			lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
		}
		return lista;
	}
	
	this.obtenerPartidasDisponibles=function(){
		//devolver solo las partidas sin completar
		let lista=[];
		for (let key in this.partidas){
			if(this.partidas[key].jugadores.length<2){
				lista.push({"codigo":key,"owner":this.partidas[key].owner.nick});
			}
		}
		return lista;
	}
}

function Usuario(nick, juego){
	this.nick=nick;
	this.juego=juego;
	this.tableroPropio;
	this.tableroRival;
	this.partida;
	this.flota=[]; //podría ser asociativo

	this.crearPartida=function(){
		return this.juego.crearPartida(this);
	}
	this.unirseAPartida=function(codigo){
		this.juego.unirseAPartida(codigo,this);	
	}
	//Inicializa los tableros
	this.inicializarTablero=function(dim){
		this.tableroPropio=new Tablero(dim);
		this.tableroRival=new Tablero(dim);
	}
	this.inicializarFlota=function(){
		//this.flota.push(new Barco("b2",2));
		//this.flota.push(new Barco("b4",4));
		this.flota["b2"]=new Barco("b2",2);
		this.flota["b4"]=new Barco("b4",4);
		//otros barcos; 1, 2, 3, ...
	}
	this.colocarBarco=function(nombre,x,y){
		//comprobar fase (¿En que fase puedo colocar barcos?-->Desplegando)
		if(partida.fase=="desplegando"){
			let barco=this.flota[nombre];
			this.tableroPropio.colocarBarco(barco,x,y);
		}
		// coloca el barco de nombre en la casilla x,y del tablero propio

	}

	//Método que comprueba si todos los barcos están desplegados para iniciar el juego
	this.todosDesplegados=function(){
		for(var key in this.flota){
			if(!this.flota[key].desplegado){
				return false
			}
		}
		return true
	}
	this.barcosDesplegados=function(){
		this.partida.barcosDesplegados();
	}
	this.disparar=function(x,y){
		this.partida.disparar(this.nick,x,y);
	}
	this.meDisparan=function(x,y){
		this.tableroPropio.meDisparan(x,y);
	}
	this.obtenerEstado=function(x,y){
		return this.tableroPropio.obtenerEstado(x,y);
	}
	this.marcarEstado=function(estado,x,y){
		this.tableroRival.marcarEstado(estado,x,y);
		if(estado=="agua"){
			this.partida.cambiarTurno(this.nick);
		}
	}
	this.flotaHundida=function(){
		for(var key in this.flota){
			if(this.flota[key].estado!="hundido"){
				return false
			}
		}
		return true
	}
}

function Partida(codigo, user){
	this.codigo=codigo;
	this.owner=user;
	this.jugadores=[];
	this.fase='inicial'; 		//new Inicial()
	this.maxJugadores=2;
	
	this.agregarJugador=function(usr){
		let res=this.codigo;
		if (this.hayHueco()){
			this.jugadores.push(usr);
			console.log("El usuario "+usr.nick+" se une a la partida "+this.codigo)
			usr.partida=this;
			usr.inicializarTablero(5);
			this.comprobarFase();
			usr.inicializarFlota();
		}
		else{
			res=-1;
			console.log("La partida está completa")
		}
		return res;
	}

	this.esJugando=function(){
        return this.fase=="jugando";
    }

	this.comprobarFase=function(){
		if(!this.hayHueco()){
			this.fase='desplegando';
		}
	}
	
	this.hayHueco=function(){
		return (this.jugadores.length<this.maxJugadores);
	}

	this.agregarJugador(this.owner);
	
	this.flotasDesplegadas=function(){
		for(i=0;i<this.jugadores.length;i++){
			if(!this.jugadores[i].todosDesplegados()){
				return false;
			}
		}
		return true;
	}
	this.barcosDesplegados=function(){
		if(this.flotasDesplegadas()){
			this.fase="jugando";
			this.asignarTurnoInicial();
		}
	}
	this.asignarTurnoInicial=function(){
		this.turno=this.jugadores[0];
	}
	this.cambiarTurno=function(nick){
		this.turno=this.obtenerRival(nick);
	}
	this.obtenerRival=function(nick){
		let rival;
		for(i=0;i<this.jugadores.length;i++){
			if(this.jugadores[i].nick!=nick){
				rival=this.jugadores[i];
			}
		}
		return rival;
	}
	this.obtenerJugador=function(nick){
		let jugador;
		for(i=0;i<this.jugadores.length;i++){
			if(this.jugadores[i].nick==nick){
				jugador=this.jugadores[i];
			}
		}
		return jugador;
	}

	this.disparar=function(nick,x,y){
		let atacante=this.obtenerJugador(nick);
		//Chequear el turno
		if(this.turno.nick==atacante.nick){
			let atacado=this.obtenerRival(nick);
			atacado.meDisparan(x,y);
			let estado=atacado.obtenerEstado(x,y);
			atacante.marcarEstado(estado,x,y);
			this.comprobarFin(atacado);
		}
		else{
			console.log("No es tu turno");
		}
		
	}
	this.comprobarFin=function(jugador){
		if(jugador.flotaHundida()){
			this.fase="final";
			console.log("Fin de la partida.");
			console.log("Ganador: "+this.turno.nick);
		}
	}
	
}

function Tablero(size){
	this.size=size;
	this.casillas;

	this.crearTablero=function(tam){
		this.casillas=new Array(tam);
		for(x=0;x<tam;x++){
			this.casillas[x]=new Array(tam);
			for(y=0;y<tam;y++){
				this.casillas[x][y]=new Casilla(x,y);
			}
		}
	}
	this.colocarBarco=function(barco,x,y){
		if(this.casillasLibres(x,y,barco.tam)){
			for(i=x;i<barco.tam;i++){
				this.casillas[i][y].contiene=barco;
			}
			barco.desplegado=true;
		}
	}

	this.casillasLibres=function(x,y,tam){
		for(i=x;i<tam;i++){
			let contiene=this.casillas[i][y].contiene;
			if(!contiene.esAgua()){
				return false;
			}
		}
		return true;
	}
	this.meDisparan=function(x,y){
		this.casillas[x][y].contiene.meDisparan();
	}
	this.obtenerEstado=function(x,y){
		return this.casillas[x][y].contiene.obtenerEstado();
	}
	this.marcarEstado=function(estado,x,y){
		this.casillas[x][y].contiene=estado;
	}
	this.crearTablero(size);

}

function Casilla(x, y){
	this.x=x;
	this.y=y;
	this.contiene=new Agua();
}

function Barco(nombre, tam){
	this.nombre=nombre;
	this.tam=tam;
	this.orientacion; //horizontal, vertical ...
	this.desplegado=false;
	this.estado="intacto";
	this.disparos=0;
	this.esAgua=function(){
		return false
	}
	this.meDisparan=function(){
		this.disparos++;
		if(this.disparos<this.tam){
			this.estado="tocado";
			console.log("!TOCADO!");
		}
		else{
			this.estado="hundido";
			console.log("!HUNDIDOOOO!");
		}
	}
	this.obtenerEstado=function(){
		return this.estado;
	}
}

function Agua(){
	this.nombre="Agua";
	this.esAgua=function(){
		return true
	}
	this.meDisparan=function(){
		console.log("Agua");
	}
	this.obtenerEstado=function(){
		return "agua";
	}

}


