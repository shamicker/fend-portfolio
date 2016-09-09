/**
 * grunt-respimg
 * https://github.com/nwtn/grunt-respimg
 *
 * Copyright (c) 2015 David Newton
 * Licensed under the MIT license.
 *
 * Automatically resizes image assets
 *
 * Portions borrowed liberally from:
 *    <https://github.com/andismith/grunt-responsive-images>, and
 *    <https://github.com/dbushell/grunt-svg2png>, and
 *    <https://github.com/JamieMason/grunt-imageoptim>, and
 *    <https://github.com/sindresorhus/grunt-svgmin>
 *
 * @author David Newton (http://twitter.com/newtron)
 * @version 1.1.0
 */

(function() {
	'use strict';

	var async =		require('async'),
		fs =		require('fs'),
		resemble =	require('node-resemble');

	var compareImages = function(data, assetExpected, assetGenerated) {
		if (data.dimensionDifference.width !== 0) {
			console.error('Difference in width');
			return false;
		}

		if (data.dimensionDifference.height !== 0) {
			console.error('Difference in height');
			return false;
		}

		if (data.misMatchPercentage !== '0.00') {
			console.error('Difference in image content');
			return false;
		}

		var fileSizeRatio = assetExpected.length / assetGenerated.length;
		if (fileSizeRatio < 0.9 || fileSizeRatio > 1.1) {
			console.error('Difference in file size');
			return false;
		}

		return true;
	}


	// List of tests to be run
	//
	// TODO: add more tests
	exports.respimg = {
		default: function(test) {
			var assetExpected,
				assetGenerated,
				diff;

			async.series([

				// 1A-1-w320.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/raster/1A-1-w320.jpg');
					assetGenerated = fs.readFileSync('test/generated/default/raster/1A-1-w320.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1A-1-w320.jpg: images don’t match');
						callback();
					});
				},

				// 1A-1-w640.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/raster/1A-1-w640.jpg');
					assetGenerated = fs.readFileSync('test/generated/default/raster/1A-1-w640.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1A-1-w640.jpg: images don’t match');
						callback();
					});
				},

				// 1A-1-w1280.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/raster/1A-1-w1280.jpg');
					assetGenerated = fs.readFileSync('test/generated/default/raster/1A-1-w1280.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1A-1-w1280.jpg: images don’t match');
						callback();
					});
				},

				// 3C-2-w320.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/raster/3C-2-w320.png');
					assetGenerated = fs.readFileSync('test/generated/default/raster/3C-2-w320.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '3C-2-w320.png: images don’t match');
						callback();
					});
				},

				// 3C-2-w640.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/raster/3C-2-w640.png');
					assetGenerated = fs.readFileSync('test/generated/default/raster/3C-2-w640.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '3C-2-w640.png: images don’t match');
						callback();
					});
				},

				// 3C-2-w1280.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/raster/3C-2-w1280.png');
					assetGenerated = fs.readFileSync('test/generated/default/raster/3C-2-w1280.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '3C-2-w1280.png: images don’t match');
						callback();
					});
				},

				// icon-w320.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/svg/icon-w320.png');
					assetGenerated = fs.readFileSync('test/generated/default/svg/icon-w320.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), 'icon-w320.png: images don’t match');
						callback();
					});
				},

				// icon-w640.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/svg/icon-w640.png');
					assetGenerated = fs.readFileSync('test/generated/default/svg/icon-w640.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), 'icon-w640.png: images don’t match');
						callback();
					});
				},

				// icon-w1280.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/svg/icon-w1280.png');
					assetGenerated = fs.readFileSync('test/generated/default/svg/icon-w1280.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), 'icon-w1280.png: images don’t match');
						callback();
					});
				},

				// icon.svg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/svg/icon.svg', 'utf-8');
					assetGenerated = fs.readFileSync('test/generated/default/svg/icon.svg', 'utf-8');
					test.ok(assetExpected === assetGenerated, 'icon.svg: images don’t match');
					callback();
				},

				// 1748-5908-8-108-w320.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/pdf/1748-5908-8-108-w320.png');
					assetGenerated = fs.readFileSync('test/generated/default/pdf/1748-5908-8-108-w320.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1748-5908-8-108-w320.png: images don’t match');
						callback();
					});
				},

				// 1748-5908-8-108-w640.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/pdf/1748-5908-8-108-w640.png');
					assetGenerated = fs.readFileSync('test/generated/default/pdf/1748-5908-8-108-w640.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1748-5908-8-108-w640.png: images don’t match');
						callback();
					});
				},

				// 1748-5908-8-108-w1280.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/default/pdf/1748-5908-8-108-w1280.png');
					assetGenerated = fs.readFileSync('test/generated/default/pdf/1748-5908-8-108-w1280.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1748-5908-8-108-w1280.png: images don’t match');
						callback();
					});
				},
			],

			function(err, results) {
				test.done();
			});
		},

		nooptim: function(test) {
			var assetExpected,
				assetGenerated,
				diff;

			async.series([

				// 1A-1-w320.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/raster/1A-1-w320.jpg');
					assetGenerated = fs.readFileSync('test/generated/nooptim/raster/1A-1-w320.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1A-1-w320.jpg: images don’t match');
						callback();
					});
				},

				// 1A-1-w640.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/raster/1A-1-w640.jpg');
					assetGenerated = fs.readFileSync('test/generated/nooptim/raster/1A-1-w640.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1A-1-w640.jpg: images don’t match');
						callback();
					});
				},

				// 1A-1-w1280.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/raster/1A-1-w1280.jpg');
					assetGenerated = fs.readFileSync('test/generated/nooptim/raster/1A-1-w1280.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1A-1-w1280.jpg: images don’t match');
						callback();
					});
				},

				// 3C-2-w320.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/raster/3C-2-w320.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/raster/3C-2-w320.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '3C-2-w320.png: images don’t match');
						callback();
					});
				},

				// 3C-2-w640.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/raster/3C-2-w640.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/raster/3C-2-w640.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '3C-2-w640.png: images don’t match');
						callback();
					});
				},

				// 3C-2-w1280.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/raster/3C-2-w1280.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/raster/3C-2-w1280.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '3C-2-w1280.png: images don’t match');
						callback();
					});
				},

				// icon-w320.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/svg/icon-w320.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/svg/icon-w320.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), 'icon-w320.png: images don’t match');
						callback();
					});
				},

				// icon-w640.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/svg/icon-w640.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/svg/icon-w640.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), 'icon-w640.png: images don’t match');
						callback();
					});
				},

				// icon-w1280.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/svg/icon-w1280.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/svg/icon-w1280.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), 'icon-w1280.png: images don’t match');
						callback();
					});
				},

				// icon.svg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/svg/icon.svg', 'utf-8');
					assetGenerated = fs.readFileSync('test/generated/nooptim/svg/icon.svg', 'utf-8');
					test.ok(assetExpected === assetGenerated, 'icon.svg: images don’t match');
					callback();
				},

				// 1748-5908-8-108-w320.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/pdf/1748-5908-8-108-w320.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/pdf/1748-5908-8-108-w320.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1748-5908-8-108-w320.png: images don’t match');
						callback();
					});
				},

				// 1748-5908-8-108-w640.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/pdf/1748-5908-8-108-w640.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/pdf/1748-5908-8-108-w640.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1748-5908-8-108-w640.png: images don’t match');
						callback();
					});
				},

				// 1748-5908-8-108-w1280.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/nooptim/pdf/1748-5908-8-108-w1280.png');
					assetGenerated = fs.readFileSync('test/generated/nooptim/pdf/1748-5908-8-108-w1280.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1748-5908-8-108-w1280.png: images don’t match');
						callback();
					});
				},
			],

			function(err, results) {
				test.done();
			});
		},

		widthAsDir: function(test) {
			var assetExpected,
				assetGenerated,
				diff;

			async.series([

				// 320/1A-1.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/raster/320/1A-1.jpg');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/raster/320/1A-1.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '320/1A-1.jpg: images don’t match');
						callback();
					});
				},

				// 640/1A-1.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/raster/640/1A-1.jpg');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/raster/640/1A-1.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '640/1A-1.jpg: images don’t match');
						callback();
					});
				},

				// 1280/1A-1.jpg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/raster/1280/1A-1.jpg');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/raster/1280/1A-1.jpg');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1280/1A-1.jpg: images don’t match');
						callback();
					});
				},

				// 320/3C-2.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/raster/320/3C-2.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/raster/320/3C-2.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '320/3C-2.png: images don’t match');
						callback();
					});
				},

				// 640/3C-2.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/raster/640/3C-2.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/raster/640/3C-2.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '640/3C-2.png: images don’t match');
						callback();
					});
				},

				// 1280/3C-2.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/raster/1280/3C-2.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/raster/1280/3C-2.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1280/3C-2.png: images don’t match');
						callback();
					});
				},

				// 320/icon.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/svg/320/icon.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/svg/320/icon.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '320/icon.png: images don’t match');
						callback();
					});
				},

				// 640/icon.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/svg/640/icon.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/svg/640/icon.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '640/icon.png: images don’t match');
						callback();
					});
				},

				// 1280/icon.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/svg/1280/icon.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/svg/1280/icon.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1280/icon.png: images don’t match');
						callback();
					});
				},

				// icon.svg
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/svg/icon.svg', 'utf-8');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/svg/icon.svg', 'utf-8');
					test.ok(assetExpected === assetGenerated, 'icon.svg: images don’t match');
					callback();
				},

				// 320/1748-5908-8-108.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/pdf/320/1748-5908-8-108.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/pdf/320/1748-5908-8-108.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '320/1748-5908-8-108.png: images don’t match');
						callback();
					});
				},

				// 640/1748-5908-8-108.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/pdf/640/1748-5908-8-108.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/pdf/640/1748-5908-8-108.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '640/1748-5908-8-108.png: images don’t match');
						callback();
					});
				},

				// 1280/1748-5908-8-108.png
				function(callback) {
					assetExpected = fs.readFileSync('test/expected/widthAsDir/pdf/1280/1748-5908-8-108.png');
					assetGenerated = fs.readFileSync('test/generated/widthAsDir/pdf/1280/1748-5908-8-108.png');
					diff = resemble(assetExpected).compareTo(assetGenerated).onComplete(function(data) {
						test.ok(compareImages(data, assetExpected, assetGenerated), '1280/1748-5908-8-108.png: images don’t match');
						callback();
					});
				},
			],

			function(err, results) {
				test.done();
			});
		}
	};
}());
