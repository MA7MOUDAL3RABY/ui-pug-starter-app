(function () {
	'use strict';

	$(document).ready(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 10) {
				$('.app-header').addClass('sticky-header');
			} else {
				$('.app-header').removeClass('sticky-header');
			}
		});
	});

})();

var app2 = (function () {
  'use strict';

  var supportsCSSText = getComputedStyle(document.body).cssText !== "";

  function copyCSS(elem, origElem, log) {

    var computedStyle = getComputedStyle(origElem);

    if(supportsCSSText) {
      elem.style.cssText = computedStyle.cssText;

    } else {

      // Really, Firefox?
      for(var prop in computedStyle) {
        if(isNaN(parseInt(prop, 10)) && typeof computedStyle[prop] !== 'function' && !(/^(cssText|length|parentRule)$/).test(prop)) {
          elem.style[prop] = computedStyle[prop];
        }
      }

    }

  }

  function inlineStyles(elem, origElem) {

    var children = elem.querySelectorAll('*');
    var origChildren = origElem.querySelectorAll('*');

    // copy the current style to the clone
    copyCSS(elem, origElem);

    // collect all nodes within the element, copy the current style to the clone
    Array.prototype.forEach.call(children, function(child, i) {
      copyCSS(child, origChildren[i]);
    });

    // strip margins from the outer element
    elem.style.margin = elem.style.marginLeft = elem.style.marginTop = elem.style.marginBottom = elem.style.marginRight = '';

  }

  function inlineImages(elem, cb) {
    var imgs = elem.querySelectorAll('img');
    var pending = 0;
    function makePend(img) {
      pending++;

      return function(src) {
        img.src = src;

        if (--pending) {
          cb();
        }
      };
    }

    function waitForLoad(img, cb) {
      if (img.complete) {
        cb();
      } else {
        img.onload = cb;
        img.onerror = cb;
      }
    }

    if (imgs.length > 0) {
      imgs.forEach(function(img) {
        var pend = makePend(img);

        waitForLoad(img, function() {
          var canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;

          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

          var dataURL = canvas.toDataURL();
          pend(dataURL);
        });
      });
    } else {
      cb();
    }
  }

  var domvas = function(origElem, cb) {
    if (typeof origElem === 'string') {
      var divElem = document.createElement('div');
      divElem.innerHTML = origElem;
      origElem = divElem;
    }

    var elem = origElem.cloneNode(true);

    // inline all CSS (ugh..)
    inlineStyles(elem, origElem);

    // inline all images
    inlineImages(elem, function() {
      // unfortunately, SVG can only eat well formed XHTML
      elem.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

      // serialize the DOM node to a String
      var serialized = new XMLSerializer().serializeToString(elem);

      // Create well formed data URL with our DOM string wrapped in SVG
      var svgDataUri = "data:image/svg+xml," +
        "<svg xmlns='http://www.w3.org/2000/svg' width='" + origElem.offsetWidth + "' height='" + origElem.offsetHeight + "'>" +
          "<foreignObject width='100%' height='100%'>" +
          serialized +
          "</foreignObject>" +
        "</svg>";
      var svgImg = new Image();
      svgImg.src = svgDataUri;

      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.drawImage(svgImg, 0, 0, svgImg.width, svgImg.height);
      var canvasImg = new Image();
      canvasImg.src = canvas.toDataURL();
      canvasImg.onload = function() {
        cb(canvasImg);
      };
    });
  };

  var img = domvas;

  //  ===============================    Function dsadasdadas ======================


  // create a rendered image of the DOM element with id 'my-element' and attach it to the end of the document
  img($('#my-element')[0], function (img) {
  	document.body.appendChild(img);
  });

  // create a rendered <h1> as an image and open the result in a new window
  img($('<h1>Please render this heading</h1>')[0], function (img) {
  	window.open(img.src, '_blank');
  });
  //  ===============================    Function dsadasdadas ======================

  var app_2 = {

  };

  return app_2;

})();
