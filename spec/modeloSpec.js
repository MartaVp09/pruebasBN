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

	it("Comprobamos los nick de los usuarios", function () {
		expect(user1.nick).toEqual("pepe");
		expect(user2.nick).toEqual("luis");
	});

	it("Comprobamos que los usuarios están en la partida", function () {
		expect(partida.jugadores[0].nick).toEqual(user1.nick);
		expect(partida.jugadores[1].nick).toEqual(user2.nick);
	});

	it("Comprobamos que cada usuario tiene 2 tableros de 5x5", function () {
		expect(user1.tableroPropio).toBeDefined();
		expect(user2.tableroPropio).toBeDefined();
		expect(user1.tableroRival).toBeDefined();
		expect(user2.tableroRival).toBeDefined();


		expect(user1.tableroPropio.casillas.length).toEqual(5);
		expect(user2.tableroPropio.casillas.length).toEqual(5);

		expect(user1.tableroPropio.casillas[0].length).toEqual(5);
		expect(user1.tableroRival.casillas[0].length).toEqual(5);
		expect(user2.tableroPropio.casillas[0].length).toEqual(5);
		expect(user2.tableroRival.casillas[0].length).toEqual(5);

		//habría que recorrer todo el tablero
		expect(user1.tableroPropio.casillas[0][0].contiene.esAgua()).toBeTrue();
	});

	it("Los dos jugadores tienen flota (2 barcos, tam 2 y 4", function () {
		expect(user1.flota).toBeDefined();
		expect(user2.flota).toBeDefined();

		expect(Object.keys(user1.flota).length).toEqual(2);
		expect(Object.keys(user2.flota).length).toEqual(2);

		expect(user1.flota["b2"].tam).toEqual(2);
		expect(user1.flota["b4"].tam).toEqual(4);
	});

	it("Comprobamos que la partida está en fase desplegando", function () {
		expect(partida.esJugando()).toBeFalse();
		expect(partida.esDesplegando()).toBeTrue();
	});

	describe("A jugar", function () {

		beforeEach(function () {
			user1.colocarBarco("b2", 0, 0); // [0 0] [1 0]
			user1.colocarBarco("b4", 0, 1); // [0 1] [1 1] [2 1] [3 1]
			user1.barcosDesplegados();
			user2.colocarBarco("b2", 0, 0);
			user2.colocarBarco("b4", 0, 1);
			user2.barcosDesplegados();
		});

		it("Comprobar que las flotas están desplegadas", function () {
			expect(user1.todosDesplegados()).toBeTrue();
			expect(user2.todosDesplegados()).toBeTrue();
		});

		it("Comprobar el cambio de turno", function () {
			user1.disparar(3, 0);	//Agua -> Cambio de turno
			expect(partida.turno.nick).toEqual(user2.nick);
		});

		it("Comprobar jugada que Pepe gana", function () {
			user1.disparar(0, 0);	//Tocado
			user1.disparar(1, 0);	//Hundido

			user1.disparar(0, 1);	//Tocado
			user1.disparar(1, 1);	//Tocado
			user1.disparar(2, 1);	//Tocado
			user1.disparar(3, 1);	//Hundido

			expect(partida.esFinal()).toBeTrue();
			expect(partida.turno.nick).toEqual(user1.nick);
		});

		it("Comprobar que no deja disparar sin turno", function () {
			user1.disparar(0, 0);	//Tocado
			user1.disparar(1, 0);	//Hundido

			user2.disparar(0, 0);	//Debería tocar pero no es su turno

			expect(user1.tableroPropio.casillas[0][0].contiene.estado).toEqual("intacto");
			expect(partida.turno.nick).toEqual(user1.nick);
		});

	});

});

