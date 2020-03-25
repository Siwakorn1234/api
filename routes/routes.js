var Math = require("../js/Math.js");
var appRouter = function (app) {
  app.get('/', function (req, res) {
    res.send('<h1>FumerAPI is now.</h1>')
  });

  // Bisection-Method
  app.post("/api/Bisection-Method/", function (req, res) {
    var expression = req.body.eq;
    var xl = req.body.xl;
    var xr = req.body.xr;
    if (xl > xr) {
      res.status(400).send("inputXL < inputXR");
    } else {
      bisection();
    }
    function bisection() {
      var aws = [];
      aws.push({
        eq: expression,
        xl: xl,
        xr: xr
      });
      var findErr = 0.00001;
      // var xmOld = xr;
      var xm = 0;
      var xmOld = 0;
      var n = 0;
      var check = 0.0;
      var errPer = 0;
      do {
        if (xl != xr) {
          xm = (parseFloat(xl) + parseFloat(xr)) / 2;
          check = Math.abs(xm - xmOld);
        } else {
          check = 0;
        }
        if (n > 0) {
          errPer = Math.abs(((xm - xmOld) / xm) * 100);
        }

        aws.push({
          n: n,
          xl: xl,
          xr: xr,
          xm: xm,
          errPer: errPer
        });
        n++;

        if (funcal(xm) * funcal(xr) < 0) {
          xl = xm;
        } else {
          xr = xm;
        }
        xmOld = xm;
      } while (check > findErr);
      res.status(200).send(aws);
    }

    function funcal(X) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }
  });

  // False position Method
  app.post("/api/False-position-Method/", function (req, res) {
    var expression = req.body.eq;
    var xl = req.body.xl;
    var xr = req.body.xr;
    if (xl > xr) {
      res.status(400).send("inputXL < inputXR");
    } else {
      methodFalse();
    }
    function methodFalse() {
      var aws = [];
      aws.push({
        eq: expression,
        xl: xl,
        xr: xr
      });
      var xmOld = xr;
      var xm = 0;
      var n = 0;
      var errPer = 50;
      var check = parseFloat(0.000000);
      do {
        var fxR = funcal(xr).toFixed(8);
        var fxL = funcal(xl).toFixed(8);
        xm = xl * fxR - xr * fxL / (fxR - fxL)

        if (n > 0) {
          var errPer = Math.abs((xm - xmOld) / xm) * 100.0
        }
        aws.push({
          n: n,
          xl: xl,
          xr: xr,
          xm: xm,
          errPer: errPer
        });
        n++;


        if (funcal(xm) * funcal(xr) < 0) {
          xl = xm;
        } else {
          xr = xm
        }
        xmOld = xm
      } while (errPer > 0.0000001);
      res.status(200).send(aws);
    }

    function funcal(X) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }
  });

  // Newton raphson Method
  app.post("/api/Newton-raphson-Method/", function (req, res) {
    var expression = req.body.eq;
    var xIn = req.body.x;
    NewRaphson();

    function NewRaphson() {
      var aws = [];
      aws.push({
        eq: expression,
        x: xIn,
      });

      var expressionDiff = (Math.derivative(expression, 'x')).toString();
      var x = 0;
      var xOld = xIn;
      var n = 0;
      var check = parseFloat(0.00000000);

      do {
        x = xOld - (funcal(xOld, expression) / funcal(xOld, expressionDiff));
        check = Math.abs(x - xOld)
        if (n > 0) {
          var errPer = ((x - xOld) / x) * 100
        } else {
          errPer = "undefined"
        }
        aws.push({
          n: n,
          x: x,
          errPer: errPer
        });
        n++;

        xOld = x;
      } while (check > 0.00001 && n < 100);
      res.status(200).send(aws);
    }

    function funcal(X, expression) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }
  });

  // One-point iteration Method
  app.post("/api/One-point-iteration-Method/", function (req, res) {
    var expression = req.body.eq;
    var xIn = req.body.x;
    OnePoint();

    function OnePoint() {
      var aws = [];
      aws.push({
        eq: expression,
        x: xIn,
      });

      var x = xIn;
      var xOld = 0;
      var n = 0;
      var check = parseFloat(0.000000);

      do {
        x = funcal(x);
        check = Math.abs((x - xOld) / x);

        if (n > 0) {
          var errPer = Math.abs(((x - xOld) / x) * 100)
        } else {
          errPer = "undefined"
        }

        aws.push({
          n: n,
          xOLD: xOld,
          xNEW: x,
          errPer: errPer
        });

        n++;

        xOld = x;
      } while (check > 0.00001 && n != 0);
      res.status(200).send(aws);
    }

    function funcal(X) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }
  });

  // Secant-Method
  app.post("/api/Secant-Method/", function (req, res) {
    var expression = req.body.eq;
    var x0In = req.body.x0;
    var x1In = req.body.x1;
    Secant();

    function Secant() {
      var aws = [];
      aws.push({
        eq: expression,
        x0: x0In,
        x1: x1In,
      });
      var x0 = x0In;
      var x1 = x1In;
      var xNew = 0;
      var n = 0;
      var check = parseFloat(0.000000);

      do {

        xNew = x1 - funcal(x1) * ((x1 - x0) / (funcal(x1) - funcal(x0)));
        check = Math.abs((xNew - x1) / xNew).toFixed(8);

        if (n > 0) {
          var errPer = Math.abs(((xNew - x1) / xNew) * 100).toFixed(8)
        } else {
          errPer = "undefined"
        }

        aws.push({
          n: n,
          xNEW: xNew,
          errPer: errPer
        });

        n++;

        x0 = x1;
        x1 = xNew;

      } while (check > 0.00001 && n < 100);
      res.status(200).send(aws);
    }

    function funcal(X) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }
  });

  // First Forward
  app.post("/api/First-Forward/", function (req, res) {
    var expression = req.body.eq;
    var xIn = req.body.x;
    var hIn = req.body.h;
    var dIn = req.body.d;
    FirstForward();

    function FirstForward() {
      var aws = [];
      aws.push({
        eq: expression,
        x: xIn,
        h: hIn,
        d: dIn
      });

      h = parseFloat(hIn);
      x = parseFloat(xIn);
      n = parseInt(dIn);
      var pascals = pascalsTriangle(n + 1);
      var result = 0;
      var realdiff = 0;
      var resultY = [];

      for (i = 0; i < n + 1; i++) {
        //                  -,+,-               4,6,4           x-i*h (เพื่มทีละ h)
        result = result + Math.pow(-1, i) * pascals[n][i] * funcal(x + (n - 1 - i) * h, expression);
        if (i > 0) {
          resultTemp = result;
          resultTemp = resultTemp / Math.pow(h, n);
          resultY[i] = resultTemp;
          resultY[i - 2] = result + Math.pow(-1, i) * pascals[n][i] * funcal(x + (n - 1 - i) * h, expression);
        }
      }

      result = result / Math.pow(h, n);
      resultY.push(result);
      realdiff = difffuncal(x, n, expression);
      errPer = Math.abs(result - realdiff);

      aws.push({
        result: result,
        real: realdiff,
        errPer: errPer
      });
      res.status(200).send(aws);
    }

    //สร้าง Pascal's Triangle
    function pascalsTriangle(num) {
      var pascal = [];
      //Each for() loop here sets up one array, and they are then combined into a new, 2D Array.
      for (var c = 0; c < num; c++) {
        pascal[c] = new Array(c + 1);
        for (var d = 0; d < c + 1; d++) {
          if (d === 0 || d === c) {
            //This function handles a special case scenario in which the border numbers of the triangle will always equal 1.
            pascal[c][d] = 1;
          } else {
            //This Mathematical function allows the adjacent values above a coordinate to be added together.
            pascal[c][d] = pascal[c - 1][d - 1] + pascal[c - 1][d];
          }
        }
      }
      return pascal;
    }

    // แก้สมาการ X
    function funcal(X, expression) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }

    function difffuncal(X, n, expression) {
      var ans = expression;
      for (i = 0; i < n; i++) {
        ans = Math.derivative(ans, 'x').toString();
      }
      expr = Math.compile(ans);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }
  });

  // Backward
  app.post("/api/Backward/", function (req, res) {
    var expression = req.body.eq;
    var xIn = req.body.x;
    var hIn = req.body.h;
    var dIn = req.body.d;
    FirstForward();

    function FirstForward() {
      var aws = [];
      aws.push({
        eq: expression,
        x: xIn,
        h: hIn,
        d: dIn
      });

      n = parseInt(dIn);
      h = parseFloat(hIn);
      x = parseFloat(xIn);
      var pascals = pascalsTriangle(n + 1);
      var result = 0;
      var error = 0;
      var realdiff = 0;

      for (i = 0; i < n + 1; i++) {
        console.log(result);
        //                  -,+,-               4,6,4           x-i*h (เพื่มทีละ h)
        result = result + Math.pow(-1, i) * pascals[n][i] * funcal(x - i * h, expression);
      }
      result = result / Math.pow(h, n);
      realdiff = difffuncal(x, n, expression);
      error = Math.abs(result - realdiff);

      aws.push({
        result: result,
        real: realdiff,
        errPer: error
      });
      res.status(200).send(aws);

    }

    //สร้าง Pascal's Triangle
    function pascalsTriangle(num) {
      var pascal = [];
      //Each for() loop here sets up one array, and they are then combined into a new, 2D Array.
      for (var c = 0; c < num; c++) {
        pascal[c] = new Array(c + 1);
        for (var d = 0; d < c + 1; d++) {
          if (d === 0 || d === c) {
            //This function handles a special case scenario in which the border numbers of the triangle will always equal 1.
            pascal[c][d] = 1;
          } else {
            //This Mathematical function allows the adjacent values above a coordinate to be added together.
            pascal[c][d] = pascal[c - 1][d - 1] + pascal[c - 1][d];
          }
        }
      }
      return pascal;
    }



    // แก้สมาการ X
    function funcal(X, expression) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }

    function difffuncal(X, n, expression) {
      var ans = expression;
      for (i = 0; i < n; i++) {
        ans = Math.derivative(ans, 'x').toString();
      }
      expr = Math.compile(ans);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }

  });

  // Central
  app.post("/api/Central/", function (req, res) {
    var expression = req.body.eq;
    var xIn = req.body.x;
    var hIn = req.body.h;
    var dIn = req.body.d;
    FirstForward();

    function FirstForward() {
      var aws = [];
      aws.push({
        eq: expression,
        x: xIn,
        h: hIn,
        d: dIn
      });

      n = parseInt(dIn);
      h = parseFloat(hIn);
      x = parseFloat(xIn);

      var pascals = pascalsTriangle(n + 1);
      var result = 0;
      var error = 0;
      var realdiff = 0;

      if (n % 2 == 0) {
        for (i = 0; i < n + 1; i++) {
          result = result + Math.pow(-1, i) * pascals[n][i] * funcal(x + (n / 2 - i) * h, expression);
        }
        result = result / Math.pow(h, n);
      } else {
        for (i = 0; i < n + 1; i++) {
          if (i < n / 2) {
            //                  -,+,-               4,6,4           xi+2,xi+1
            result = result + Math.pow(-1, i) * pascals[n - 1][i] * funcal(x + ((n + 1) / 2 - i) * h,
              expression);
          } else {
            //                  -,+,-               4,6,4           x-i*h (เพื่มทีละ h)
            result = result + Math.pow(-1, i) * pascals[n - 1][n - i] * funcal(x + ((n + 1) / 2 - i - 1) * h,
              expression);
          }
        }
        // 2h,h^2,2h^3,h^4
        result = result / (Math.pow(h, n) * 2);
      }


      realdiff = difffuncal(x, n, expression);
      error = Math.abs(result - realdiff);

      aws.push({
        result: result,
        real: realdiff,
        error: error
      });
      res.status(200).send(aws);
    }

    //สร้าง Pascal's Triangle
    function pascalsTriangle(num) {
      var pascal = [];
      //Each for() loop here sets up one array, and they are then combined into a new, 2D Array.
      for (var c = 0; c < num; c++) {
        pascal[c] = new Array(c + 1);
        for (var d = 0; d < c + 1; d++) {
          if (d === 0 || d === c) {
            //This function handles a special case scenario in which the border numbers of the triangle will always equal 1.
            pascal[c][d] = 1;
          } else {
            //This Mathematical function allows the adjacent values above a coordinate to be added together.
            pascal[c][d] = pascal[c - 1][d - 1] + pascal[c - 1][d];
          }
        }
      }
      return pascal;
    }

    // แก้สมาการ X
    function funcal(X, expression) {
      expr = Math.compile(expression);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }

    function difffuncal(X, n, expression) {
      var ans = expression;
      for (i = 0; i < n; i++) {
        ans = Math.derivative(ans, 'x').toString();
      }
      expr = Math.compile(ans);
      let scope = {
        x: parseFloat(X)
      };
      return expr.eval(scope);
    }

  });


}; // var appRouter = function (app) {
module.exports = appRouter;
