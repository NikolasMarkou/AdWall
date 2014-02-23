$(function() {	
	var index = 0;
	var period = 1000;
	var fadeOutTime = 1000;
	var wallContainer = $("#adWall");
	var twitterTemplate = $("#twitter-ad").html();
	var twitterContentTemplate = $("#tweet-content-template").html();

	var adTwitter = [
		{ stream : "@TheMall", user : "#grx"     , message : "This place is awesome" },
		{ stream : "@TheMall", user : "#nikolas" , message : "This place is great" },
		{ stream : "@TheMall", user : "#george"  , message : "The chef rocks"},
		{ stream : "@TheMall", user : "#pampos"  , message : "Den tin palepsa" } 
	
	];

	_.templateSettings = {
		interpolate : /\{\{([\s\S]+?)\}\}/g
	};

	// Create the li elements to scroll on

	var htmlContent = "";
	for (index = 0 ; index < adTwitter.length ; index++)
	{
		htmlContent += "<li>" + _.template(twitterContentTemplate, adTwitter[index]) + "</li>";
	}
	htmlContent = "<ul>" + htmlContent + "</ul>";

	wallContainer.html(_.template(twitterTemplate, adTwitter[0]));
	$(".jcarousel").html(htmlContent);
	$(".jcarousel").jcarousel({
		wrap: 'circular'
	});
/*
	// Interval function 
	var intervalFunction = function(){
		index = (index + 1) % adTwitter.length;
		wallContainer.find(".tweet-content").animate(
			{'opacity': 0, 'rotation' : 360}, 1000, function () {
			$(this).html(_.template(twitterContentTemplate, adTwitter[index]));
		}).animate({'opacity': 1}, 1000);

		//wallContainer.find(".tweet-content").html(_.template(twitterContentTemplate, adTwitter[index]));
	}; 
*/

	// periodically remove an element and create a new one 
	var interval = setInterval(
		function(){
			var instance = $('.jcarousel').data('jcarousel');
			instance.scroll('+=1');
		}, 
		period
	);
});

