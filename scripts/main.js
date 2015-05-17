require.config({
  urlArgs: 'bust=' + (new Date()).getTime()
});

require(
  [
    'jquery',
    'pointfield'
  ],
  function(
    $,
    PointField
  ) {
    console.log("The PointField constructor looks like:\n", PointField);
    
    function randomInitialPoint() {
      var point = {
        x: 3.5 + Math.random(),
        y: 3.5 + Math.random()
      };

      return point;
    }

    function randomInitialPointField(howManyPoints) {
      var points = [];
      var pointField = null;
      var i;

      for (i = 0; i < howManyPoints; i++) {
        points.push(randomInitialPoint());
      }
      pointField = PointField.create({
        points: points,
        deltas: new Array(howManyPoints)
      });
      return pointField
    }

/*
    var pointField = PointField({
      points: [
        {x: 0.1, y: 3.6},
        {x: 3.7, y: 3.7},
        {x: 4.02, y: 4.4}
      ],
      deltas: new Array(3)
    });
*/
    function getParameterByName(name) {
      var regex = null;
      var results = null;

      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
      results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }


    var n = getParameterByName('n');
    var howManyPoints = ( n ) ? Number(n) : 3;

    var pointField = randomInitialPointField(howManyPoints);
    console.log("The initial point field looks like:\n", JSON.stringify(pointField));
    $('#point-field').append(pointField.display());
    
    var updateInterval = setInterval(function() {
      var howManyChanged = pointField.tick();
console.log("Inside updateInterval, got howManyChanged:\n", howManyChanged);
      if (howManyChanged) {
        $('#point-field').html(pointField.display());
      } else {
        stop();
      }
    }, 10);

    function stop() {
      console.log("Inside stop function, got called\n");
      clearInterval(updateInterval);
      $('#stopped').text('STOPPED');
    }

    $('#stop').click(stop);
    
  }
);
