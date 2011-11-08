(function ($) {

	// The golden ratio
	var PHI = (1 + Math.sqrt(5)) / 2;

	// defaults
	var defaults = {
		alignOrder: ["top", "right", "bottom", "left"]
	};

	//// Utility functions ////

	function cssValue($element, styleName) {
		return parseInt($element.css(styleName), 10);
	}

	function outerSize($element, side) {
		return cssValue($element, "margin-" + side) +
				cssValue($element, "border-" + side + "-width") +
				cssValue($element, "padding-" + side);
	}

	function hasPosition($element, side) {
		// TODO: Better way to detect?
		return $element.attr("style").match(side);
	}

	function repositionSide($element, side) {

		if (hasPosition($element, side)) {
			//	console.log("has " + side);
			var outer = outerSize($element, side);
			//console.log("adjusting " + side + ": " + outer);
			$element.css(side, cssValue($element, side) + outer + "px");
		}
	}

	/**
	* Adjusts the size and position of the element to account for padding,
	* borders, and margin, which aren't normally accounted for
	* when sizing elements.
	*/
	function adjustForOuterSize($element) {
		var wdiff = $element.outerWidth(true) - $element.width();
		var hdiff = $element.outerHeight(true) - $element.height();
		$element.width($element.width() - wdiff);
		$element.height($element.height() - hdiff);

		console.log("adjusted for wdiff " + wdiff + " and hdiff " + hdiff);

		//		for (var i = 0; i < defaults.alignOrder.length; i++) {
		//			repositionSide($element, defaults.alignOrder[i]);
		//		}
	}

	// Plug it in
	$.fn.phi = function (content, options) {

		// Default settings
		var settings = {
			alignOrder: defaults.alignOrder.slice(),
			cssClasses: ["yellow", "purple", "orange", "blue", "red", "grayish-yellow", "medium-gray"],
			drawRectangleLast: true,
			autoResize: true
		};

		// Apply user settings
		if (options) {
			$.extend(settings, options);
		}

		// The guts
		function phiify($container) {

			// fill as much of the container as possible
			var width = $container.width();
			var height = $container.height();

			// size the outermost rectangle to fit the golden ratio
			if (width / height > PHI) {
				width = Math.round(height * PHI);
			}
			else if (width / height < PHI) {
				height = Math.round(width / PHI);
			}

			// create the outermost rectangle
			var $outer = $("<div/>")
				.css({
					"position": "relative",
					"margin": "auto"
				})
				.width(width)
				.height(height)
				.appendTo($container);

			// adjust for borders, padding, and margins
			adjustForOuterSize($outer);

			// Keep track of where to draw the next retangle
			var alignments = {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			};
			var previousAlign = null;
			var color = 0;

			// Draw one square for each piece of content.
			// Except for the last piece, for which we'll draw a whole rectangle
			for (var i = 0; i < content.length; i++) {

				var alignmentName = settings.alignOrder[i % settings.alignOrder.length];
				var alignment = alignments[alignmentName];
				if (!previousAlign) {
					previousAlign = settings.alignOrder[settings.alignOrder.length - 1];
				}

				var availableSpace = i % 2 === 0 ? width : height;

				// length of the edge of the next square
				var length = Math.round(availableSpace / PHI);
				var w = length;
				var h = length;

				// extend either the width or height on the last iteration, depending on the orientation
				// to draw a full rectangle in the final position
				if (i === content.length - 1 && settings.drawRectangleLast) {
					w = i % 2 === 0 ? availableSpace : length;
					h = i % 2 !== 0 ? availableSpace : length;
				}

				// create the next square
				var $rect = $("<div/>")
					.append(content[i])
					.css("position", "absolute")
					.css(alignmentName, alignment + "px")
					.css(previousAlign, alignments[previousAlign])
					.addClass(settings.cssClasses[color % settings.cssClasses.length])
					.width(w)
					.height(h)
					.appendTo($outer);

				// adjust for borders, padding, and margins
				adjustForOuterSize($(content[i]));
				
				// update the parameters for the next iteration
				if (i % 2 == 0) {
					width -= length;
				}
				else {
					height -= length;
				}
				alignments[previousAlign] += length;
				color++;
				previousAlign = alignmentName;
			}
		}

		// Enable chaining
		return this.each(function () {

			// Run jPhi on each container
			phiify($(this));

			// Dynamically resize
			if (settings.autoResize) {
				var $self = $(this);
				$(window).resize(function () {

					$self.empty();
					phiify($self);
				});
			}
		});

	};


})(jQuery);