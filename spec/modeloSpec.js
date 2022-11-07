describe("El juego...", function () {
	var miJuego;
	var user1, user2;

	beforeEach(function () {
		miJuego = new Juego();
		miJuego.agregarUsuario("pepe");
		miJuego.agregarUsuario("luis");
		res = miJuego.jugadorCreaPartida("pepe");
		miJuego.jugadorSeUneAPartida("luis", res.codigo);
		user1 = miJuego.obtenerUsuario("pepe");
		user2 = miJuego.obtenerUsuario("luis");
		partida = miJuego.obtenerPartida(res.codigo);
	});

	it("inicialmente", function () {
		expect(user1.nick).toEqual("pepe");
		expect(user2.nick).toEqual("luis");
	});

	it("Comprobar que los usuarios están en la partida", function () {
		expect(partida.jugadores[0].nick).toEqual(user2.nick);
		expect(partida.jugadores[1].nick).toEqual(user2.nick);
	});

	it("Comprobar que cada usuario tiene 2 tableros de 5x5", function () {
		expect(user1.tableroPropio).toBeDefined();
		expect(user2.tableroPropio).toBeDefined();
		expect(user1.tableroRival).toBeDefined();
		expect(user2.tableroRival).toBeDefined();


		expect(user1.tableroPropio.casillas.length).toEqual(5);
		expect(user2.tableroPropio.casillas.length).toEqual(5);

		//habría que recorrer las 5 columnas
		expect(user1.tableroPropio.casillas[0].length).toEqual(5);
		expect(user1.tableroRival.casillas[0].length).toEqual(5);
		expect(user2.tableroPropio.casillas[0].length).toEqual(5);
		expect(user2.tableroRival.casillas[0].length).toEqual(5);

		//habría que recorrer todo el tablero
		expect(user1.tableroPropio.casillas[0][0].contiene.nombre).toEqual("Agua");
	});

	it("Los dos jugadores tienen flota (2 barcos, tam 2 y 4", function () {
		expect(user1.flota).toBeDefined();
		expect(user2.flota).toBeDefined();
	
		expect(user1.flota.length).toEqual(2);
		expect(user2.flota.length).toEqual(4);
	});

	//que contienen agua (esAgua())
	//comprobar que cada usuario tiene 1 flota de 2 barcos
	//de tamaño 4 y 2
	//comprobar que la partida esta en fase jugando

});
