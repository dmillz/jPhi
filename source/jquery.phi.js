(function ($) {

	// The golden ratio
	var PHI = (1 + Math.sqrt(5)) / 2;

	// Utility functions

	function adjustForOuterSize($element) {
		var wdiff = $element.outerWidth() - $element.width();
		var hdiff = $element.outerHeight() - $element.height();
		$element.width($element.width() - wdiff);
		$element.height($element.height() - hdiff);
	}

	// Plug it in
	$.fn.phi = function (content, options) {

		// Keep track of where to draw the next retangle
		var _alignments = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};

		// Default settings
		var settings = {
			alignOrder: ["top", "right", "bottom", "left"],
			cssClasses: ["yellow", "purple", "orange", "blue", "red", "grayish-yellow", "medium-gray"]
		};

		return this.each(function () {

			// Apply user settings
			if (options) {
				$.extend(settings, options);
			}

			var $container = $(this);

			// fill as much of the container as possible
			var width = $(this).width();
			var height = $(this).height();

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

			var previousAlign = null;
			var color = 0;

			// Draw one square for each piece of content.
			// Except for the last piece, for which we'll draw a whole rectangle
			for (var i = 0; i < content.length; i++) {

				var alignmentName = settings.alignOrder[i % settings.alignOrder.length];
				var alignment = _alignments[alignmentName];
				if (!previousAlign) {
					previousAlign = settings.alignOrder[settings.alignOrder.length - 1];
				}

				var availableSpace = i % 2 === 0 ? width : height;

				// length of the edge of the next square
				var length = Math.round(availableSpace / PHI);

				// create the next square
				var $rect = $("<div/>")
					.append(content[i])
					.css("position", "absolute")
					.css(alignmentName, alignment + "px")
					.css(previousAlign, _alignments[previousAlign])
					.addClass(settings.cssClasses[color % settings.cssClasses.length])
					.width(length)
					.height(length)
					.appendTo($outer);

				// adjust for borders, padding, and margins
				adjustForOuterSize($rect);

				// update the parameters for the next iteration
				if (i % 2 == 0) {
					width -= length;
				}
				else {
					height -= length;
				}
				_alignments[previousAlign] += length;
				color++;
				previousAlign = alignmentName;
			}
		});

	};


})(jQuery);