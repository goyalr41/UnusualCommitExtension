/*
HeatColor, by Josh Nathanson
A plugin for jQuery
See copyright at end of file
Complete documentation at http://www.jnathanson.com/blog/client/jquery/heatcolor/index.cfm
*/

jQuery.fn.heatcolor = function( valueFunction, options ) {
	
	var settings = {
					elementFunction : function() { return jQuery(this); },
					minval : 0,
					maxval : 0,
					lightness : 0.75,
					colorStyle : 'roygbiv',
					reverseOrder : false
	};
	
	if( options ) {
		jQuery.extend( settings, options );
	};
	
	// helper functions
	var helpers = {
		
		findcolor : function(curval, mn, mx) {
	
			// value between 1 and 0
			var position = (curval - mn) / (mx - mn); 
			
			// this adds 0.5 at the top to get red, and limits the bottom at x= 1.7 to get purple
			var shft = settings.colorStyle == 'roygbiv'
				? 0.5*position + 1.7*(1-position)
				: position + 0.2 + 5.5*(1-position);
			
			// scale will be multiplied by the cos(x) + 1 
			// (value from 0 to 2) so it comes up to a max of 255
			var scale = 128;
			
			// period is 2Pi
			var period = 2*Math.PI;
			
			// x is place along x axis of cosine wave
			var x = shft + position * period;
			
			// shift to negative if greentored
			x = settings.colorStyle != 'roygbiv'
				? -x
				: x;
				
			var r = this.process( Math.floor((Math.cos(x) + 1) * scale) );
			var g = this.process( Math.floor((Math.cos(x+Math.PI/2) + 1) * scale) );
			var b = this.process( Math.floor((Math.cos(x+Math.PI) + 1) * scale) );
			
			return '#' + r + g + b;
		
		},
	
		process: function( num ) {
			
			// adjust lightness
			var n = Math.floor( num + settings.lightness * (256 - num));
			
			// turn to hex
			var s = n.toString(16);
			
			// if no first char, prepend 0
			s = s.length == 1 ? '0' + s : s;
			
			return s;		
		},
	
		setMaxAndMin : function( els ) {
			
			var vals = [];
			els.each(function() {
				vals.push( valueFunction.apply( jQuery(this) ) );
			});			
			vals = vals.sort( function(a,b) { return a - b; } );
			settings.maxval = !settings.reverseOrder
								? vals[vals.length-1]
								: vals[0]; 
			settings.minval = !settings.reverseOrder
								? vals[0]
								: vals[vals.length-1]; 
		}
		
	}; // close helper functions
	
	if ( !settings.minval && !settings.maxval )
		helpers.setMaxAndMin( jQuery(this) );
	else
		if ( settings.reverseOrder ) {
			var temp = settings.minval;
			settings.minval = settings.maxval;
			settings.maxval = temp;
		}
	
	jQuery(this).each(function() {
		// iterate over jQuery object (array of elements)
		
		var el = jQuery(this); // current element
		
		// get the value to find in range
		var curval = valueFunction.apply( el );

		// get current color
		var curcolor = helpers.findcolor( curval, settings.minval, settings.maxval );
				
		// find the element to color
		var elToColor = settings.elementFunction.apply( el );
		
		// color it
		if ( elToColor[0].nodeType == 1 )
			elToColor.css( "background-color", curcolor );
		else if ( elToColor[0].nodeType == 3 )
			elToColor.css( "color", curcolor );
				
	});
	
	return (this);
	
}

/*
+-----------------------------------------------------------------------+
| Copyright (c) 2007 Josh Nathanson                  |
| All rights reserved.                                                  |
|                                                                       |
| Redistribution and use in source and binary forms, with or without    |
| modification, are permitted provided that the following conditions    |
| are met:                                                              |
|                                                                       |
| o Redistributions of source code must retain the above copyright      |
|   notice, this list of conditions and the following disclaimer.       |
| o Redistributions in binary form must reproduce the above copyright   |
|   notice, this list of conditions and the following disclaimer in the |
|   documentation and/or other materials provided with the distribution.|
|                                                                       |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS   |
| "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT     |
| LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR |
| A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT  |
| OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, |
| SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT      |
| LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, |
| DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY |
| THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT   |
| (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE |
| OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  |
|                                                                       |
+-----------------------------------------------------------------------+
*/