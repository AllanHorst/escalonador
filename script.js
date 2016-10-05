angular.module('myApp', [])

.controller('myController', function($scope) {

	$scope.limpar = function() {
		$scope.listaTotalEspera = []
		$scope.listaOrdem = []
		$scope.listaValores = []
		$scope.valor = null;
		$scope.quantum = null;
		$scope.calculado = false;
	}

	$scope.clicar = function() {
		if ($scope.valor == null || $scope.valor <= 0 || $scope.quantum == null) {
			alert('Preencha os campos')
			return;
		}
		$scope.calculado = true;

		$scope.listaTotalEspera = []
		$scope.listaOrdem = []
		$scope.listaValores = []

		var num = '';
		var id = 1;
		for (var i = 0; i < $scope.valor.length; i++) {
			if ($scope.valor[i] != ';') {
				num += $scope.valor[i]
				if (i < $scope.valor.length - 1) {
					continue;
				}
			}

			$scope.listaValores.push({
				id: id,
				valor: parseInt(num)
			});
			num = '';
			id++;
		}
		$scope.listaOrdem = $scope.ordenar($scope.listaValores, parseInt($scope.quantum));
	}

	$scope.listaTotalEspera = [];

	$scope.ordenar = function(listaProcesso, quantum) {
		var lista = angular.copy(listaProcesso);

		var temValor = true;
		var ciclo = 0;
		var listaOrdem = []

		while(temValor) {
			for (var i = 0; i < lista.length; i++) {
				if (lista[i].valor == 0) {
					continue;
				}
				var obj = {};
				if (lista[i].valor >= quantum) {
					lista[i].valor -= quantum;
					obj.cicloIni = ciclo;
					ciclo += quantum;
					obj.cicloFim = ciclo;
				} else {
					obj.cicloIni = ciclo;
					ciclo += lista[i].valor
					lista[i].valor -= lista[i].valor
					obj.cicloFim = ciclo;
				}

				obj.id = i + 1;
				obj.valor = lista[i].valor;
				ultimo = obterUltimoCiclo(listaOrdem, obj.id)
				somarTotal(obj.cicloIni - ultimo, obj.id);
				listaOrdem.push(obj);

			}

			temValor = false;
			for (var i = 0; i < lista.length; i++) {
				if (lista[i].valor > 0) {
					temValor = true;
					break;
				}
			}
		}
		console.log(listaOrdem)
		return listaOrdem;
	}

	function obterUltimoCiclo(lista, id) {
		var ultimo = null;
		for (var i = 0; i < lista.length; i++) {
			if (lista[i].id == id) {
				ultimo = lista[i].cicloFim
			}
		}

		return ultimo;
	}

	$scope.obterTotal = function(id) {
		for (var i = 0; i < $scope.listaTotalEspera.length; i++) {
			let item = $scope.listaTotalEspera[i]
			if (item.id == id) {
				return item.valor;
			}
		}
	}

	$scope.calcularMedia = function() {
		var soma = 0;
		var totalItens = $scope.listaTotalEspera.length;
		for (var i = 0; i < totalItens; i++) {
			let item = $scope.listaTotalEspera[i]
			soma += item.valor;
		}	

		return soma / totalItens;
	}

	function somarTotal(valor, id) {
		var encontrou = false;
		for (var i = 0; i < $scope.listaTotalEspera.length; i++) {
			let item = $scope.listaTotalEspera[i]
			if (item.id == id) {
				encontrou = true;
				$scope.listaTotalEspera[i].valor += valor
			}
		}

		if (!encontrou) {
			$scope.listaTotalEspera.push({
				'id': id,
				'valor': valor
			})
		}

	}

	$scope.calcularTempoFila = function() {
		var soma = 0;
		for (var i = 0; i < $scope.listaTotalEspera.length; i++) {
			let item = $scope.listaTotalEspera[i]
			soma += item.valor;
		}
		
		for (var i = 0; i < $scope.listaValores.length; i++) {
			let item = $scope.listaValores[i]
			soma += item.valor;
		}
		return soma;
	}

	$scope.limpar()
})
