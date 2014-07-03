var vows = require('vows'),
assert = require('assert');
suite = vows.describe('jStat.distribution');

require('./env.js');

suite.addBatch({
  'beta pdf': {
    'topic' : function() {
      return jStat;
    },
    'check pdf calculation' : function(jStat) {
      // Non-log form of the Beta pdf
      var pdf = function pdf(x, alpha, beta) {
        return (x > 1 || x < 0) ? 0 : ((Math.pow(x, alpha - 1)
            * Math.pow(1 - x, beta - 1))
            / jStat.betafn(alpha, beta));
      };

      var tol = 0.0000001;
      var args = [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1];
      var arg;

      for (var i=0; i < args.length; i++) {
        arg = args[i];
        assert.epsilon(tol, jStat.beta.pdf(arg, 0.1, 0.1), pdf(arg, 0.1, 0.1));
        assert.epsilon(tol, jStat.beta.pdf(arg, 1, 1), pdf(arg, 1, 1));
        assert.epsilon(tol, jStat.beta.pdf(arg, 10, 50), pdf(arg, 10, 50));

        // Show that the log form of the pdf performs
        // better for large parameter values
        assert(!isNaN(jStat.beta.pdf(arg, 1000, 5000)),
               'New Beta pdf is NaN for large parameter values.');
        assert(isNaN(pdf(arg, 1000, 5000)),
               'Old Beta pdf is not NaN for large parameter values.');
      }
    }
  },
  'gamma pdf': {
    'topic': function() {
      return jStat;
    },
    'check instance and static pdf method': function (jStat) {
      var shape = 5;
      var scale = 1;
      var gamma = jStat.gamma(shape, scale);
      var xValues = [-1, 0, 1];
      var x;
      for (var i = 0; i < xValues.length; i++) {
        x = xValues[i];
        pStatic = jStat.gamma.pdf(x, shape, scale);
        pInstance = gamma.pdf(x);
        if (isNaN(pStatic)) {
          assert(isNaN(pInstance));
        } else {
          assert(pStatic === pInstance,
                 'Gamma pdf evaluated at ' + x + ' should be equal for instance and static methods.');
        }
      }
    }

  }
});

suite.export(module);
