var ttcApp = {};

var timeSort = [];

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
	var weather = tempData.weather;
	console.log(tempData);

	var drizzle = /drizzle/;
	var rain = /rain/;
	var thunderstorms = /thunderstorms/;
	var snow = /snow/;
	var ice = /ice/;
	var fog = /fog/;
	var hail = /hail/;
	var freezing = /freezing/;
	var overcast = /overcast/;

	// Weather announcement conditional statements
	if (weather === "Clear") {
		$('h1.announce').html('It is a beautiful sunny day');
		$('body').css('background', 'url(images/backgrounds/sunny-3.jpg)');

	} else if (weather === "Partly Cloudy" || weather === "Scattered Clouds") {
		$('h1.announce').html('There are some clouds in the sky but you can still see the sun');
		$('body').css('background', 'url(images/backgrounds/part-cloud.jpg)');

	} else if (weather === "Mostly Cloudy") {
		$('h1.announce').html('It is ' + weather + ' with a little sun');
		$('body').css('background', 'url(images/backgrounds/part-cloud.jpg)');

	}	else if (weather === "Cloudy") {
		$('h1.announce').html('It is ' + weather + ' outside');
		$('body').css('background', 'url(images/backgrounds/cloudy.jpg)');

	} else if (overcast) {
		$('h1.announce').html('It is ' + weather + ' outside');
		$('body').css('background', 'url(images/backgrounds/cloudy.jpg)');

	} else if (drizzle) {
		$('h1.announce').html('There is some ' + weather + ' outside');
		$('body').css('background', 'url(images/backgrounds/rain.jpg)');

	} else if (fog || weather === 'Haze' || weather === 'Mist') {
		$('h1.announce').html('There is ' + weather + ' outside so pay attention to traffic');
		$('body').css('background', 'url(images/backgrounds/rain.jpg)');

	} else if (rain) {
		$('h1.announce').html('The forecast says there will be ' + weather + ' today');
		$('body').css('background', 'url(images/backgrounds/rain.jpg)');

	} else if (thunderstorms) {
		$('h1.announce').html('There will be ' + weather + ' today so bring an umbrella');
		$('body').css('background', 'url(images/backgrounds/rain.jpg)');

	} else if (snow || weather === 'Squalls') {	
		$('h1.announce').html('There will be ' + weather + ' today so stay warm');
		$('body').css('background', 'url(images/backgrounds/snow.jpg)');

	} else if (ice || freezing || hail) {
		$('h1.announce').html('There will be ' + weather + ' today so be careful on the roads');
		$('body').css('background', 'url(images/backgrounds/snow.jpg)');

	} else {
		$('h1.announce').html('Take a look outside your window');
		$('body').css('background', 'url(images/backgrounds/sunny-3.jpg)');
	}; // END weather announcement

	// Weather statistics
	var weather = $('<p>').addClass('readout').html('Weather: ' + tempData.weather);
	var temp_c = $('<p>').addClass('readout').html('Current Temperature: ' + tempData.temp_c + '&deg;');
	var temp_feels = $('<p>').addClass('readout').html('Feels like: ' + tempData.feelslike_c + '&deg;');
	var humidity = $('<p>').addClass('readout').html('Humidity: ' + tempData.relative_humidity);
	$('#weather').append(weather, temp_c, temp_feels, humidity);
}; // END .weatherConditions function


// ADDS TIME PROPERTY TO EACH OBJECT
ttcApp.timeProp = function(data) {
	$.each(data, function(i, piece) {
		piece.eta = ((piece.distance / piece.velocity) * 0.06).toFixed(2);
	});
		// var sorted = sort('eta', data);
		ttcApp.sortResults('eta', data);
}

// FUNCTION CODE TO SORT THE TIME (CALLED IN ttcApp.timeProp)
ttcApp.sortResults = function (prop, arr) {
    prop = prop.split('.');
    var len = prop.length;

    arr.sort(function (a, b) {
        var i = 0;
        while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        } else {
            return 0;
        }
    });
    return arr;
};

ttcApp.parseData = function(data) {

	$.each(data, function(i, piece) {

		ttcApp.timeProp(data);
		console.log(data); // logging the ttc data following timeProp function

		var distanceNum = Math.round(piece.distance);
		var velocityNum = Math.round(piece.velocity);

		var vehicle = $('<h3>').text(piece.long_name);
		var distance = $('<p>').addClass('ttcInfo').text('Distance from you: ' + distanceNum + ' m');
		var velocity = $('<p>').addClass('ttcInfo').text('Speed: ' + velocityNum + ' km/h');
		var time = $('<p>').addClass('ttcInfo').text('Arrival: ' + piece.eta + ' minutes');
		var info = $('<div>').addClass('piece').addClass('piece' + i).append(vehicle, time, distance, velocity);

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

		console.log("Type is: " + type);
		if (type === "CLRV" || type === "ALRV") {
			$('.piece' + i).addClass('streetcar');
		} else if (type === "6carHT") {
			$('.piece' + i).addClass('subway');
		} else if (type === "LF" || type === "Lift") {
			$('.piece' + i).addClass('bus');
		}; // END CONDITIONAL STATEMENTS - VEHICLE TYPE

	}); // end each loop

}; // end .parseData function


ttcApp.animate = function(data) {
	$('.piece').on('click', function() {

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







