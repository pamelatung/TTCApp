var ttcApp = {};

ttcApp.timeArrive = {};
ttcApp.pieceTime = {};

ttcApp.init = function() {
	$('form.inputBox').on('submit', function(e) {
		e.preventDefault();
		var street1 = $(this).find('#street1').val();
		var street2 = $(this).find('#street2').val();
		$('#schedule').empty();
		ttcApp.getVehicle(street1, street2);
	}); // END form submission function
}; // END ttc init function

ttcApp.initWeather = function() {
	ttcApp.getWeather();
}; // END weather init function

ttcApp.getWeather = function() {
	$.ajax('http://api.wunderground.com/api/e557b57c67f18214/conditions/q/Ontario/Toronto.json', {
		type: 'GET',
		dataType: 'jsonp',
		success: ttcApp.weatherConditions
	}); // END weather ajax call
}; // END .getWeather function

ttcApp.getVehicle = function(street1, street2) {
	$.ajax({
	    url: 'http://myttc.ca/vehicles/near/' + street1 + '_' + street2 + '.json',
	    type: 'GET',
	    data: {
	      format: 'jsonp'
	    },
	    dataType: 'jsonp',
	    success: function(result){
	      ttcApp.parseData(result.vehicles);
	      ttcApp.animate(result.vehicles);
	    } // END success function
	}); // END ajax call
}; // END .getVehicle function

ttcApp.weatherConditions = function(response) {
	var tempData = response.current_observation;
	console.log(tempData);

	// Weather announcement conditional statements
	if (tempData.weather === "Clear" || tempData.weather === "Sunny") {

		$('h1.announce').html('It is a beautiful sunny day');
		$('body').css('background', 'url(images/backgrounds/sunny-3.jpg)');

	} else if (tempData.weather === "Partly Cloudy" || tempData.weather === "Mostly Sunny" || tempData.weather === "Scattered Clouds") {

		$('h1.announce').html('There are some clouds in the sky but you can still see the sun');
		$('body').css('background', 'url(images/backgrounds/part-cloud.jpg)');

	} else if (tempData.weather === "Mostly Cloudy" || tempData.weather === "Partly Sunny") {

		$('h1.announce').html('The sky is mostly cloudy with a little sun');
		$('body').css('background', 'url(images/backgrounds/part-cloud.jpg)');

	}	else if (tempData.weather === "Cloudy" || tempData.weather === "Overcast") {

		$('h1.announce').html('It is ' + tempData.weather + ' outside');
		$('body').css('background', 'url(images/backgrounds/cloudy.jpg)');

	} else if (tempData.weather === "Rain" || tempData.weather === "Thunderstorms") {

		$('h1.announce').html('The forecast shows that there will be ' + tempData.weather + ' today');
		$('h3.advice').html('Do not leave home without an umbrella');
		$('body').css('background', 'url(images/backgrounds/rain.jpg)');

	} else if(tempData.weather === "Snow" || tempData.weather === "Flurries" || tempData.weather === "Hail" || tempData.weather === "Sleet") {

		$('h1.announce').html('The forecast shows that there will be ' + tempData.weather + ' today');
		$('h3.advice').html('Be careful on the roads, and stay warm');
		$('body').css('background', 'url(images/backgrounds/snow.jpg)');

	} else {

		$('h1.announce').html('Take a look outside your window to see the weather');
		$('body').css('background', 'url(images/backgrounds/sunny-3.jpg)');

	}; // END weather announcement

	// Weather statistics
	var weather = $('<p>').addClass('readout').html('Weather: ' + tempData.weather);
	var temp_c = $('<p>').addClass('readout').html('Current Temperature: ' + tempData.temp_c + '&deg;');
	var temp_feels = $('<p>').addClass('readout').html('Feels like: ' + tempData.feelslike_c + '&deg;');
	var humidity = $('<p>').addClass('readout').html('Humidity: ' + tempData.relative_humidity);
	$('#weather').append(weather, temp_c, temp_feels, humidity);
}; // END .weatherConditions function

ttcApp.parseData = function(data) {
	console.log(data);
	$.each(data, function(i, piece) {

		var distanceNum = Math.round(piece.distance);
		var velocityNum = Math.round(piece.velocity);
		ttcApp.timeArrive = ((piece.distance / piece.velocity) * 0.06).toFixed(2);

		var vehicle = $('<h3>').text(piece.long_name);
		var distance = $('<p>').addClass('ttcInfo').text('Distance from you: ' + distanceNum + ' m');
		var velocity = $('<p>').addClass('ttcInfo').text('Speed: ' + velocityNum + ' km/h');
		var timeIntro = $('<span>').addClass('ttcInfo').text('Time until arrival: ');			// Time statement
		var timeActual = $('<span>').addClass('time').text(ttcApp.timeArrive + ' minutes.');		// ttcApp.timeArrive, also to be used later in animation function
		var timeTogether = $('<p>').addClass('ttcInfo').append(timeIntro, timeActual);					// Append statement & time
		// console.log(ttcApp.timeArrive);
		var info = $('<div>').addClass('piece').append(vehicle, distance, velocity, timeTogether);

		var tri1 = $('<div>').addClass('tri1');
		var tri2 = $('<div>').addClass('tri2');
		var tri3 = $('<div>').addClass('tri3');
		var tri4 = $('<div>').addClass('tri4');
		var tri5 = $('<div>').addClass('tri5');
		var tri6 = $('<div>').addClass('tri6');
		var tri7 = $('<div>').addClass('tri7');
		var tri8 = $('<div>').addClass('tri8');
		var tri9 = $('<div>').addClass('tri9');
		var tri10 = $('<div>').addClass('tri10');
		var tri11 = $('<div>').addClass('tri11');
		var trianglediv = $('.piece').append(tri1, tri2, tri3, tri4, tri5, tri6, tri7, tri8,tri9,tri10,tri11);

		$('#schedule').append(info, trianglediv); // Append vehicle information, triangles

		var type = piece.type;
		// CONDITIONAL STATEMENTS - VEHICLE TYPE
		if (type === "CLRV" || type === "ALRV") {
			$('.piece').addClass('streetcar');
		} else if (type === "6carHT") {
			$('.piece').addClass('subway');
		} else if (type === "LF" || type === "Lift") {
			$('.piece').addClass('bus');
		}; // END CONDITIONAL STATEMENTS - VEHICLE TYPE
	}); // end each loop
}; // end .parseData function


ttcApp.animate = function(data) {
	$('.piece').on('click', function() {
		var storeTime = $(this).find('.time').text();
		console.log(storeTime);
		$(this).animate({  });
		$(this).animate({ opacity: '0' }, 1000);
		$(this).children('.tri1, .tri2, .tri3, .tri4, .tri5, .tri6, .tri7, .tri8, .tri9, .tri10, .tri11').show();
		$(this).children('.tri1').animate({ top:'-800px', left: '-800px' },2400);
		$(this).children('.tri2').animate({ top:'-800px', left: '-800px' },2400);
		$(this).children('.tri3').animate({ top:'-800px', left: '-500px' },2400);
		$(this).children('.tri4').animate({ top:'-800px', left: '0px' },2400);
		$(this).children('.tri5').animate({ top:'-800px', left: '500px' },2400);
		$(this).children('.tri6').animate({ top:'0px', left: '500px' },2400);
		$(this).children('.tri7').animate({ top:'-800px', left: '200px' },2400);
		$(this).children('.tri8').animate({ top:'-800px', left: '-300px' },2400);
		$(this).children('.tri9').animate({ top:'-800px', left: '-800px' },2400);
		$(this).children('.tri10').animate({ top:'-800px', left: '-1500px' },2400);
		$(this).children('.tri11').animate({ top:'-800px', left: '-1700px' },2400);
	});  // END on-click event function
}  // END .animate function

$(function() {
	ttcApp.init();
	ttcApp.initWeather();
});







