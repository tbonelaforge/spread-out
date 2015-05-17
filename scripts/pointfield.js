define(
  [
    'underscore'
  ],
  function(
    _
  ) {
    
    var C = 0.6;
    var ratio = 0.4;
    var R = ratio * C;
    var DPI = 75;
    var pixelR = R * DPI;
    var widthInInches = 8;
    var heightInInches = 8;
    var widthInPixels = widthInInches * DPI;
    var heightInPixels = heightInInches * DPI;
    var tolerance = 0.001;

    function vectorLength(vector) {
      return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    }

    function normalizeVector(vector) {
      var length = vectorLength(vector);

      return multiplyVector(vector, 1 / length);
    }

    function multiplyVector(vector, scalar) {
      var product = {
        x: vector.x * scalar,
        y: vector.y * scalar
      };

      return product;
    }

    function addVector(vectorA, vectorB) {
      var sum = {
        x: vectorA.x + vectorB.x,
        y: vectorA.y + vectorB.y
      };

      return sum;
    }

    function boundVector(v) {
      var boundedVector = {
        x: v.x,
        y: v.y
      };
      if (v.x - R < 0) {
        boundedVector.x = R;
      }
      if (v.x + R > widthInInches) {
        boundedVector.x = widthInInches - R;
      }
      if (v.y - R < 0) {
        boundedVector.y = R;
      }
      if (v.y + R > heightInInches) {
        boundedVector.y = heightInInches - R;
      }
      return boundedVector;
    }

    function equalVector(vectorA, vectorB) {
      if (Math.abs(vectorA.x - vectorB.x) > tolerance) {
        return false;
      }
      if (Math.abs(vectorA.y - vectorB.y) > tolerance) {
        return false;
      }
      return true;
    }

    function PointField(options) {
console.log("Inside PointField constructor, the options are:\n", options);
      var instance = Object.create(PointField.prototype);

      _.extend(instance, {
        points: options.points || [],
        deltas: options.deltas || [],
        forceFactor: 1 / Math.pow(options.points.length, 1 / 5)
      });
console.log("Inside PointField constructor, about to return instance:\n", instance);
      return instance;
    }
    
    _.extend(PointField.prototype, {
      // Return the number of points that moved.
      tick: function() {
        var self = this;
console.log("the self is:\n", self);
        var i;
        var changed;
        var count = 0;
        var delta;
        var howMuchForce;

        for (i = 0; i < self.points.length; i++) {
//          changed = self.setDelta(i);
          self.setDelta(i);
//          if (changed) {
//            count += 1;
//          }
        }
        for (i = 0; i < self.points.length; i++) {
//          self.points[i] = addVector(self.points[i], self.deltas[i]);
          if (self.tryToMovePoint(i)) {
            count += 1;
          }
        }
        return count;
      },

      setDelta: function(i) {
        var self = this;
        var j;
        var direction;
        var distance;
        var force;
        var changed = false;


        self.deltas[i] = { x : 0, y: 0 };
        for (j = 0; j < self.points.length; j++) {
          if (j === i) {
            continue;
          }
          direction = self.subtractPoints(i, j);
          distance = vectorLength(direction);
          if (distance < C) {
            changed = true;
            force = (C - distance) * self.forceFactor;
            component = normalizeVector(direction);
            component = multiplyVector(component, force);
            self.deltas[i] = addVector(self.deltas[i], component);
          }
        }
        self.addLeftWallForce(i);
        self.addRightWallForce(i);
        self.addTopWallForce(i);
        self.addBottomWallForce(i);
        self.addCentralForce(i);
        return changed;
      },

      addLeftWallForce: function(i) {
        var self = this;
        var point = self.points[i];
        var component = { x: 0, y: 0 };
        var distance = null;
        var force = null;

        distance = point.x - C;
        if (distance < 0) {
          force = -distance;
          component.x = force;
          self.deltas[i] = addVector(self.deltas[i], component);
        }
      },

      addRightWallForce: function(i) {
        var self = this;
        var point = self.points[i];
        var component = { x: 0, y: 0 };
        var distance = null;
        var force = null;

        distance = widthInInches - C - point.x;
        if (distance < 0) {
          force = distance
          component.x = force;
          self.deltas[i] = addVector(self.deltas[i], component);
        }
      },

      addTopWallForce: function(i) {
        var self = this;
        var point = self.points[i];
        var component = { x: 0, y: 0 };
        var distance = null;
        var force = null;

        distance = heightInInches - C - point.y;
        if (distance < 0) {
          component.y = distance;
          self.deltas[i] = addVector(self.deltas[i], component);
        }
      },

      addBottomWallForce: function(i) {
        var self = this;
        var point = self.points[i];
        var component = { x: 0, y: 0 };
        var distance = null;
        var force = null;

        distance = point.y - C;
        if (distance < 0) {
          force = -distance;
          component.y = force;
          self.deltas[i] = addVector(self.deltas[i], component);
        }
      },

      addCentralForce: function(i) {
        var self = this;
        var point = self.points[i];
//        var component = { x: 0, y: 0 };
        var halfWidth = widthInInches / 2;
        var halfHeight = heightInInches / 2;
        var distance = null;
        var force = null;
        var component = null;

        var direction = addVector({x: -halfWidth, y: -halfHeight}, self.points[i]);
        var distance = vectorLength(direction);

        if (distance + C > Math.min(halfWidth, halfHeight)) {
          component = multiplyVector(direction, -10 * tolerance);
          self.deltas[i] = addVector(self.deltas[i], component);
        }
      },

      tryToMovePoint: function(i) {
        var self = this;
        var originalPoint = self.points[i];
        var delta = self.deltas[i];
//        var newPoint = boundVector(addVector(originalPoint, delta));
        var newPoint = addVector(originalPoint, delta);
        var changed = true;

        if (equalVector(newPoint, originalPoint)) {
          changed = false;
        }
        self.points[i] = newPoint;
        return changed;
      },

      subtractPoints: function(i, j) {
        var self = this;
        var vectorA = self.points[i];
        var vectorB = multiplyVector(self.points[j], -1);

        return addVector(vectorA, vectorB);
      },

      display: function() {
        var self = this;
        var html = '<svg height="' + heightInPixels + '"' + 
                        ' width="' + widthInPixels + '">';
        var i;
        var circle;

        for (i = 0; i < self.points.length; i++) {
          circle = self.getCircleDisplay(i);
          html += circle;
        }
        html += '</svg>';
        return html;
      },

      circleTemplate: _.template('<circle cx="<%= x %>" cy="<%= y %>" r="<%= r %>" fill="red" />'),

      getCircleDisplay: function(i) {
        var self = this;
        var pixelX = self.points[i].x * DPI;
        var pixelY = heightInPixels - self.points[i].y * DPI;
        var circleDisplay = self.circleTemplate({
          x: pixelX,
          y: pixelY,
          r: pixelR
        });

        return circleDisplay;
      }
    });

    _.extend(PointField, {
      create: function(options) {
        return this(options);
      }
    });

    return PointField;
  }
);
