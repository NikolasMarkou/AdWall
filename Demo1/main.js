$(function() {	
	var maxRows = 1;
	var maxCols = 1;
	var period = 1000;
	var maxContent = 10;
	var minAdBlocks = 1;
	var maxAdBlocks = maxRows * maxCols;
	var fadeOutTime = 1000;
	var wallContainer = $("#adWall");
	var wall = new freewall("#adWall");
	var adBlockTemplate = "<div class='adBlock' style='width:{{ width }}px; height:{{ height }}px;'>{{ content }}</div>";
	var twitterTemplate = $("#twitter-ad").html();
	var animationSlideUpFlag = false;
	var animationSlideLeftFlag = false;
	var animationRotateFlag = false;
	var colors = [
		"rgb(255, 255, 255)",
	];

	var adTwitter = [
		{ stream : "@TheMall", user : "#grx" , message : "This place is awesome" },
		{ stream : "@TheBar", user : "#nikolas", message : "This place is great" },
		{ stream : "@TheRestaurant", user : "#george", message : "The chef rocks"},
		{ stream : "@ThePub", user : "#pampos", message : "Den tin palepsa" } 
	
	];

	      _.templateSettings = {
		interpolate : /\{\{([\s\S]+?)\}\}/g
	      };

	var setRandomContent = function(noElements){
		var html = '';
		for (var i = 0; i < noElements; i++) {
			var width = wallContainer.width() / maxCols;
			var height = wallContainer.height() / maxRows ;
			html += _.template(
				adBlockTemplate, 
				{ 
					width : width, 
					height : height,
					color : colors[Math.round(Math.random()*colors.length)%colors.length],
					content : _.template(twitterTemplate,adTwitter[Math.round(Math.random()*adTwitter.length)%adTwitter.length])
				}
			);
		}
		return html;
	}

	$("#adWall").html(setRandomContent(maxAdBlocks));
	
	wall.reset({
		delay : 0,
		gutterX: 0,
		gutterY: 0,
		animate: true,
		selector:'.adBlock',
		cellH: wallContainer.height() / maxRows,
		cellW: wallContainer.width() / maxCols,
		onResize: function() {
			wall.fitZone(wallContainer.width(), wallContainer.height());
		}
	});

	/* Fit blocks in window */
	wall.fitZone(wallContainer.width(), wallContainer.height());
	wall.refresh(wallContainer.width(), wallContainer.height());

	var resetWall = function(){
		// empty wall
		$(".adBlock").remove();
		//
		wall.reset({
			cellH: wallContainer.height() / maxCols,
			cellW: wallContainer.width() / maxRows,
		});
		// fill in with new elements
		for (var i = 0 ; i < maxRows * maxCols ; i++){
			wall.appendBlock(
				_.template(
					adBlockTemplate, 
					{ 
						width : wallContainer.width() /  maxCols, 
						height : wallContainer.height() / maxRows, 
						color : colors[Math.floor(Math.random()*colors.length)%colors.length],
						content : _.template(twitterTemplate,adTwitter[Math.round(Math.random()*adTwitter.length)%adTwitter.length])
					}
				)
			);
		}
		wall.fitZone(wallContainer.width(), wallContainer.height());
		wall.refresh(wallContainer.width(), wallContainer.height());
	}	

	/* Interval function */
	var intervalFunction = function(){
		// Get a random element 
		var randomElements = $(".adBlock:visible").get().sort(
			function(){return Math.round(Math.random())}).slice(0,1);

		$(randomElements).animate(  
			{rotation: 180 },
			{
				duration: fadeOutTime,
				step: function(now, fx) {
					if (animationSlideUpFlag){
						$(this).css({"height" : 0});
					}
					if (animationSlideLeftFlag){
						$(this).css({"width" : 0});
					}
					if (animationRotateFlag){
						$(this).css({"transform": "rotate("+now+"deg)"});
					}
				},
				complete : function(){
					$(this).html(
						_.template(
							adBlockTemplate, 
							{ 
								width : wallContainer.width() / maxCols, 
								height : wallContainer.height() / maxRows, 
								content : _.template(twitterTemplate,adTwitter[Math.round(Math.random()*adTwitter.length)%adTwitter.length])
							}
						)
					);
					$(this).fadeIn();
				}
			}
		);
	}; 

	// periodically remove an element and create a new one 
	var interval = setInterval(
		intervalFunction, 
		period
	);

	// instantiate timer slider object
	$("#timerSlider").slider({
		range: "min",
		value: period / 1000,
		min: 1,
		step: 1,
		max: 60,
		change: function( event, ui){
			$( "#timerValue" ).html( ui.value );
			period = ui.value * 1000;
			clearTimeout(interval);
			setInterval(intervalFunction, period);
		},
		slide: function( event, ui ) {
			$( "#timerValue" ).html( ui.value );
			period = ui.value * 1000;					
		}
	});
	$("#timerValue").html($("#timerSlider").slider("value"));	

	// instantiate fadeOut slider object
	$("#fadeOutSlider").slider({
		range: "min",
		value: fadeOutTime,
		min: 100,
		step: 100,
		max: 2000,
		change: function( event, ui){
			$( "#fadeOutValue" ).html( ui.value );
			fadeOutTime = ui.value;
		},
		slide: function( event, ui ) {
			$( "#fadeOutValue" ).html( ui.value );
			fadeOutTime = ui.value;					
		}
	});
	$("#fadeOutValue").html($("#fadeOutSlider").slider("value"));	

	// instantiate max rows slider object
	$("#rowsSlider").slider({
		range: "min",
		value: maxRows,
		min: 1,
		step: 1,
		max: 5,
		change: function( event, ui){
			$( "#rowsValue" ).html( ui.value );
			maxRows = ui.value;
			resetWall();
		},
		slide: function( event, ui ) {
			$( "#rowsValue" ).html( ui.value );
			maxRows = ui.value;						
		}
	});
	$("#rowsValue").html($("#rowsSlider").slider("value"));	

	// instantiate max cols slider object
	$("#colsSlider").slider({
		range: "min",
		value: maxCols,
		min: 1,
		step: 1,
		max: 5,
		change: function( event, ui){
			$( "#colsValue" ).html( ui.value );
			maxCols = ui.value;
			resetWall();
		},
		slide: function( event, ui ) {
			$( "#colsValue" ).html( ui.value );
			maxCols = ui.value;						
		}
	});
	$("#colsValue").html($("#colsSlider").slider("value"));	

	// set radio buttons control events
	$('input[type=checkbox][name=animation]').change(function() {
	        if (this.value == "slideup") {
			animationSlideUpFlag = $(this).is(':checked');
		}
		else if (this.value == "slideleft") {
			animationSlideLeftFlag = $(this).is(':checked');
		}
		else if (this.value == "rotate") {
			animationRotateFlag = $(this).is(':checked');
		}
	});

	$('input[type=checkbox][name=animation]').prop('checked', false);
});

