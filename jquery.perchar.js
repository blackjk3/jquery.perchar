(function($){
	
	// Control functions
	//
	
	$.fn.animatePrechar = function(duration, easing, letterDelay) {
		$.each($(this).children(), function(index, value){
		  var that = $(this);
		  setTimeout(
			  function() {
			  	that.animatePreCharWithCss(duration,easing);
			  }, index*letterDelay*1000);
    	});
	};
	
	// Animation setup functions
	//
	
	$.fn.perchar = function(start, stop, method){
		$this = $(this);
		$this.lettering(method);
		
		$.each($this.children(), function(index, value){
			addStyle($this.attr('id'), value, start, stop);
		});
	};
	
	$.fn.perchar.style = {};
	
	$.fn.animatePreCharWithCss = function(speed, easing, callback) {
	   var optall = jQuery.speed(speed, easing, callback);  
  
	   var easings = {
	    bounce: 'cubic-bezier(0.0, 0.35, .5, 1.3)', 
	    linear: 'linear',
	    swing: 'ease-in-out',
	  };
	  
	  optall.easing = optall.easing || "swing";
	  optall.easing = easings[optall.easing] ? easings[optall.easing] : optall.easing;
  
	  // TODO: just animate the properties we're changing 
	  this.css({
	  	'-moz-transition': 'all ' + optall.duration + 's ' + optall.easing,
	       '-o-transition': 'all ' + optall.duration + 's ' + optall.easing,
	  '-webkit-transition': 'all ' + optall.duration + 's ' + optall.easing,
	      '-ms-transition': 'all ' + optall.duration + 's ' + optall.easing,
	          'transition': 'all ' + optall.duration + 's ' + optall.easing,  
	  });
  
  	  this.addClass('transition');

	  // Reset the transition when done.
	  var self = this;
	  var timeoutId = setTimeout(function() {    
	   
	    self.css({
		  	'-moz-transition': 'none',
		       '-o-transition': 'none',
		  '-webkit-transition': 'none',
		      '-ms-transition': 'none',
		          'transition': 'none',  
		});
	    
		 if(jQuery.isFunction(optall.complete))
	      optall.complete.apply(self);
	  	}, optall.duration*1000);
	 }

	//
	// Init the style tag that we are going to use to generate each style.
	//
	
	function initPerchar() {
		var head = document.getElementsByTagName('head')[0];
    	$.fn.perchar.style = document.createElement('style');
    	$.fn.perchar.style.type = 'text/css';
		head.appendChild($.fn.perchar.style);
	}
	
	initPerchar();
	
	//
	// Add styles
	//
	
	function addStyle(id, value, start, stop){
		var $value = $(value); 
		var	klass = '#' + id + ' .' + $value.attr('class');
		
		if($value.html() === " ") { $value.html('&nbsp;'); }
		
		start = start.replace( /\$\{([^\}]*)\}/g, processReplace);		
		stop = stop.replace( /\$\{([^\}]*)\}/g, processReplace);
		
		addRule(klass, start);
		addRule(klass+'.transition', stop);
		
	};
	
	function processReplace(a){
		var str = a.replace( /\$\{([^\}]*)\}/g, "$1");
		return new Function("return " + str)();
	}
	
	function addRule(ident, style) {
		if($.fn.perchar.style.sheet.insertRule) {
			// Do this the WC3 way.
			$.fn.perchar.style.sheet.insertRule(ident + ' {' + style + '}',$.fn.perchar.style.sheet.cssRules.length);
		} else {
			// MS way.
			$.fn.perchar.style.sheet.addRule(ident, style);
		}
	};
	
	/*
		Combining with the jquery.lettering plugin.
		jquery.lettering code below.	
	*/
	function injector(t, splitter, klass, after) {
		
		var a = t.text().split(splitter), inject = '';
		if (a.length) {
			$(a).each(function(i, item) {
				inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
				if(klass === "word"){
					inject += '<span>&nbsp;</span>'+after;
				}
			});	
			t.empty().append(inject);
		}
	}
	
	$.fn.lettering = function( method ) {
		// Method calling logic
		if ( method && methods[method] ) {
			return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
		} else if ( method === 'letters' || ! method ) {
			return methods.init.apply( this, [].slice.call( arguments, 0 ) ); // always pass an array
		}
		$.error( 'Method ' +  method + ' does not exist on jQuery.lettering' );
		return this;
	};

	var methods = {
		init : function() {

			return this.each(function() {
				injector($(this), '', 'char', '');
			});

		},

		words : function() {

			return this.each(function() {
				injector($(this), ' ', 'word', ' ');
			});

		},

		lines : function() {

			return this.each(function() {
				var r = "eefec303079ad17405c889e092e105b0";
				// Because it's hard to split a <br/> tag consistently across browsers,
				// (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash 
				// (of the word "split").  If you're trying to use this plugin on that 
				// md5 hash string, it will fail because you're being ridiculous.
				injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
			});

		}
	};

})(jQuery);