$(function() {	
	var maxRows = 3;
	var maxCols = 3;
	var period = 2000;
	var maxContent = 10;
	var minAdBlocks = 1;
	var maxAdBlocks = 10;
	var fadeOutTime = 1000;
	var wallContainer = $("#adWall");
	var wall = new freewall("#adWall");
	var adBlockTemplate = "<div class='adBlock' style='width:<%= width %>px; height:<%= height %>px; background-color:<%= color %>'><%= content %></div>";
	var colors = [
		"rgb(135, 0, 0)",
		"rgb(0, 106, 63)",
		"rgb(211, 84, 0)",
		"rgb(192, 57, 43)",
		"rgb(39, 174, 96)",
		"rgb(142, 68, 173)",
		"rgb(243, 156, 18)",
		"rgb(41, 128, 185)",
		"rgb(192, 57, 43)",
		"rgb(39, 14, 96)",
		"rgb(14, 68, 173)",
		"rgb(243, 156, 180)",
		"rgb(123, 100, 122)",
	];

	var adContent = [
		_.template("<div class='adText'><%= content %> </div>", { content : "This is a sexy ad"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "Short ad"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "Nobody reads text anyway, direct neural stimulation is the future"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "UTF8 is the new ASCII"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "L1 is the new L2"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "Twitter is full of bots"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "Facebook is full of dead pets"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "NSA ML algorithms are classifying your email"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "Google knows best"}),
	];

	var setRandomContent = function(noElements){
		var html = '';
		for (var i = 0; i < noElements; i++) {
			var width = (Math.random()+1) * wallContainer.width()/maxCols;
			var height = (Math.random()+1) * wallContainer.height()/maxRows;
			html += _.template(
				adBlockTemplate, 
				{ 
					width : width, 
					height : height,
					color : colors[Math.round(Math.random()*colors.length)%colors.length],
					content : adContent[Math.round(Math.random()*adContent.length)%adContent.length]
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
		cellH: wallContainer.height() / maxCols,
		cellW: wallContainer.width() / maxRows,
		onResize: function() {
			wall.fitZone(wallContainer.width(), wallContainer.height());
		}
	});

	/* Fit blocks in window */
	wall.fitZone(wallContainer.width(), wallContainer.height());
	
	var resetWall = function(){
		// empty wall
		$(".adBlock").remove();
		//
		wall.reset({
			cellH: wallContainer.height() / maxCols,
			cellW: wallContainer.width() / maxRows,
		});
		// fill in with new elements
		for (var i = 0 ; i < (maxRows * maxCols)/2 ; i++){
			wall.appendBlock(
				_.template(
					adBlockTemplate, 
					{ 
						width : Math.round(Math.random()+1) * wallContainer.width()/(maxCols+1), 
						height : Math.round(Math.random()+1) * wallContainer.height()/(maxRows+1), 
						color : colors[Math.floor(Math.random()*colors.length)%colors.length],
						content : adContent[Math.floor(Math.random()*adContent.length)%adContent.length], 
					}
				)
			);
		}
		wall.fitZone(wallContainer.width(), wallContainer.height());
	}	

	/* Interval function */
	var intervalFunction = function(){
		// Get a random element 
		var randomElements = $(".adBlock").filter(function(){return $(this).width()>0;}).get().sort(
			function(){return Math.round(Math.random())}).slice(0,1);

		$.when($(randomElements).fadeOut(fadeOutTime)).then(function() {
			var noNewElements = randomElements.length;
			// Add new elements
			for (var i = 0 ; i < noNewElements ; i++){
				wall.appendBlock(
					_.template(
						adBlockTemplate, 
						{ 
							width : Math.round(Math.random()+1) * wallContainer.width()/(maxCols+1), 
							height : Math.round(Math.random()+1) * wallContainer.height()/(maxRows+1), 
							color : colors[Math.floor(Math.random()*colors.length)%colors.length],
							content : adContent[Math.floor(Math.random()*adContent.length)%adContent.length], 
						}
					)
				);
			}
			$(randomElements).remove();
			// reorder AdWall 
			wall.refresh(wallContainer.width(), wallContainer.height());
		});
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
});

