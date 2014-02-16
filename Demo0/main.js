$(function() {	
	var maxRows = 2;
	var maxCols = 2;
	var period = 3000;
	var maxContent = 10;
	var minAdBlocks = 1;
	var maxAdBlocks = 10;
	var fadeOutTime = 1000;
	var wallContainer = $("#adWall");
	var wall = new freewall("#adWall");
	var adBlockTemplate = "<div class='adBlock' style='width:<%= width %>px; height:<%= height %>px; background-color:<%= color %>'><%= content %></div>";
	var animationSlideUpFlag = false;
	var animationSlideLeftFlag = false;
	var animationRotateFlag = false;
	var colors = [
		/*
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
		*/
		"rgb(210,51,110)",
		"rgb(210,51,110)",
        	"rgb(157,199,254)",
        	"rgb(254,203,129)",
        	"rgb(155,215,158)"
	];

	var adContent = [
		_.template("<div class='adText <%= bgclass %>'><span class='adHead'><%=chead %></span><span class='adContent'><%= content %></span><span class='adFooter'><%= cfoot %></span></div>", { content : "Starbucks just gave me a free drink and I don't know why. All I have to say is, @Starbucks, I love you! #coffee #Starbucks", chead: "‏@BradBrad1016", cfoot: "‏3 minutes ago via Twitter" , bgclass: "twitter" }),	
		_.template("<div class='adText <%= bgclass %>'><span class='adHead'><%= chead %></span><span class='adContent'><%= content %></span><span class='adFooter'><%= cfoot %></span></div>", { content : "You need to add FB feeds too!", chead : "‏Mark Zuck", cfoot : "‏just now via Foursquare" , bgclass: "" }),	
		_.template("<div class='adText'><span class='adHead'><%= chead %></span><%= content %> </div>", { content : "UTF8 is the new ASCII", chead : "‏Mark Zuck"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "L1 is the new L2"}),
		_.template("<div class='adText'><%= content %> </div>", { content : "Twitter is full of bots"}),
		_.template("<div class='adText <%= bgclass %>'><span class='adHead'><%= chead %></span><span class='adContent'><%= content %></span><span class='adFooter'><%= cfoot %></span></div>", { content : "I am becoming the mayor here!", chead : "Arxwn", cfoot : "‏just now via Instagram" , bgclass: "insta" }),	
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
						width : Math.round(Math.random()+1) * wallContainer.width()/(maxCols+1), 
						height : Math.round(Math.random()+1) * wallContainer.height()/(maxRows+1), 
						color : colors[Math.floor(Math.random()*colors.length)%colors.length],
						content : adContent[Math.floor(Math.random()*adContent.length)%adContent.length], 
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
		var noNewElements = randomElements.length;

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
					$(this).css({"opacity" : 0.0});
				},
				complete : function(){
					$(this).remove();
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
					// reorder AdWall 
					wall.refresh(wallContainer.width(), wallContainer.height());
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

