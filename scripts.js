
// Get appropriate icon class
function getIcon(icon) {
  var darkSkyIcons = {
    "clear-day": "wi wi-day-sunny",
    "clear-night":"wi wi-night-clear",
    "rain": "wi wi-rain",
    "snow": "wi wi-snow",
    "sleet": "wi wi-sleet",
    "wind": "wi wi-wind",
    "fog": "wi wi-fog",
    "cloudy": "wi wi-cloudy",
    "partly-cloudy-day": "wi wi-day-cloudy", 
    "partly-cloudy-night": "wi wi-night-alt-cloudy",
    "unknown": "wi wi-day-sunny"
  };

  return darkSkyIcons[icon];
}

// Get appropriate background color
function getColor(icon) {
  var colors = {
    "clear-day": "#ff9a00",
    "clear-night": "#111",
    "rain": "#005580",
    "snow": "#464e74",
    "sleet": "#464e74",
    "wind": "#005580",
    "fog": "#4b595e",
    "cloudy": "#5e738b",
    "partly-cloudy-day": "#3781a3", 
    "partly-cloudy-night": "#333",
    "unknown": "#00564d"
  };

  return colors[icon];
}

// Main function
$(document).ready(function() {

  var lat;
  var long;

  // Get user's coords
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      console.log(lat);
      console.log(long);

      // Dark Sky API
      var api = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/b5afb3409bb31409cd1deb30efcd3ebb/" + lat + "," + long + "?units=si";

      $.getJSON(api, function(data) {
        console.log(data);

        // Get location data
        var rawLocation = data.timezone.split("/");
        var city = rawLocation[1];
        var country = rawLocation[0].slice(0,2).toUpperCase();
        var location = city + ", " + country;

        // Get temperature data in all units
        var celsius = Math.round(data.currently.temperature, -1);
        var farenheit = Math.round(data.currently.temperature * 9/5 + 32, -1);
        var maxCelsius = Math.round(data.daily.data[0].temperatureMax, -1);
        var maxFarenheit = Math.round(data.daily.data[0].temperatureMax * 9/5 + 32, -1);
        var minCelsius = Math.round(data.daily.data[0].temperatureMin, -1);
        var minFarenheit = Math.round(data.daily.data[0].temperatureMin * 9/5 + 32, -1);
        var apparentCelsius = Math.round(data.currently.apparentTemperature, -1);
        var apparentFarenheit = Math.round(data.currently.apparentTemperature * 9/5 + 32, -1);

        // Get summary and icon
        var description = data.currently.summary;
        var icon = data.currently.icon;
        var mainIcon = getIcon(icon);
        var background = getColor(icon);

        // Get wind, cloud, rain, humidity and summary
        var windSpeed = data.currently.windSpeed;
        var humidity = Math.round(data.currently.humidity * 100, 0);
        var rainProb = Math.round(data.currently.precipProbability * 100, 0);
        var cloudCover = Math.round(data.currently.cloudCover * 100, 0);
        var dewPointCelsius = Math.round(data.currently.dewPoint, -1);
        var dewPointFarenheit = Math.round(data.currently.dewPoint * 9/5 + 32, -1);
        var summary = data.daily.summary;

        // Fade out and then back in once information is ready to go
        $(".container").fadeTo("slow", 0, function() {
          $("#loading").css("display", "none");
          $("body").css("color", "#fff");
          $("#dark-sky").css("opacity", "1");
          
          $("#location").html(location);
          $("#temp").html(celsius + "&deg;");
          $("#description").html(description);
          $("#main-icon").addClass(mainIcon);

          $("#wind-speed").html(windSpeed + " m/s");
          $("#max").html(maxCelsius + "&deg;");
          $("#min").html(minCelsius + "&deg;");
          $("#humidity").html(humidity + "%");
          
          $("#apparent-temp").html("Feels Like: " + apparentCelsius + "&deg;");
          $("#rain-prob").html("Chance of Rain: " + rainProb + "%");
          $("#dew-point").html("Dew Point: " + dewPointCelsius + "&deg;");
          $("#cloud-cover").html("Cloud Cover: " + cloudCover + "%");
          $("#forecast").html(summary);

          $("body").animate({backgroundColor: background}, "slow");
          $(".container").fadeTo("slow", 1);

          // Switch to Celsius
          $("#celsius").on('click', function() {
            if ($("#farenheit").hasClass("active")) {
              $("#farenheit").removeClass("active");
              $("#celsius").addClass("active");
              $("#temp").html(celsius + "&deg;");
              $("#max").html(maxCelsius + "&deg;");
              $("#min").html(minCelsius + "&deg;");
              $("#apparent-temp").html("Feels Like: " + apparentCelsius + "&deg;");
              $("#dew-point").html("Dew Point: " + dewPointCelsius + "&deg;");
            }
          });

          // Switch to Farenheit
          $("#farenheit").on('click', function() {
            if ($("#celsius").hasClass("active")) {
              $("#celsius").removeClass("active");
              $("#farenheit").addClass("active");
              $("#temp").html(farenheit + "&deg;");
              $("#max").html(maxFarenheit + "&deg;");
              $("#min").html(minFarenheit + "&deg;");
              $("#apparent-temp").html("Feels Like: " + apparentFarenheit + "&deg;");
              $("#dew-point").html("Dew Point: " + dewPointFarenheit + "&deg;");
            }
          });

        });
        
      });
    });
  }
});