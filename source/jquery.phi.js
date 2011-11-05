(function ($) {

	// the golden ratio
	var PHI = (1 + Math.sqrt(5)) / 2;

	// how to align the inner rectangles
	var alignments = {
		top: {
			alsoAlign: "left",
			margin: 0
		},
		right: {
			alsoAlign: "top",
			margin: 0
		},
		bottom: {
			alsoAlign: "right",
			margin: 0
		},
		left: {
			alsoAlign: "bottom",
			margin: 0
		}
	};

	var alignOrder = ["top", "right", "bottom", "left"];

	$.fn.phi = function (content) {

		return this.each(function () {

			var $container = $(this);
			$container.css("position", "relative");

			// remove any elements from the container
			$container.empty();

			// fill as much of the container as possible
			var width = $(this).width();
			var height = $(this).height();

			// resize the outermost rectangle to fit the golden ratio
			if (width / height > PHI) {
				width = height * PHI;
			}
			else if (width / height < PHI) {
				height = width / PHI;
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

			// Draw one square for each piece of content.
			// Except for the last piece, for which we'll draw a whole rectangle
			for (var i = 0; i < content.length; i++) {

				var alignmentName = alignOrder[i % alignOrder.length];
				var alignment = alignments[alignmentName];

				var availableSpace = i % 2 === 0 ? width : height;

				// length of the edge of the next square
				var length = availableSpace / PHI;

				// create the next square
				var $rect = $("<div/>")
					.append(content[i])
					.css("position", "absolute")
					.css(alignmentName, alignment.margin + "px")
					.css(alignment.alsoAlign, alignments[alignment.alsoAlign].margin)
					.width(length)
					.height(length)
					.appendTo($outer);

				// adjust for borders and padding
				var contentWidth = $(content[i]).outerWidth();
				var contentHeight = $(content[i]).outerHeight();
				var wdiff = contentWidth - length;
				var hdiff = contentHeight - length;
				$rect.width(length - wdiff);
				$rect.height(length - hdiff);


				// update the parameters for the next iteration
				if (i % 2 == 0) {
					width -= length;
				}
				else {
					height -= length;
				}
				alignments[alignment.alsoAlign].margin += length;
			}
		});

	};


})(jQuery);