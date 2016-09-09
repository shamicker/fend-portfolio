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
 *		<https://github.com/andismith/grunt-responsive-images>, and
 *		<https://github.com/dbushell/grunt-svg2png>, and
 *		<https://github.com/JamieMason/grunt-imageoptim>, and
 *		<https://github.com/sindresorhus/grunt-svgmin>
 *
 * @author David Newton (http://twitter.com/newtron)
 * @version 1.1.0
 */

'use strict';

module.exports = function(grunt) {

	var async =				require('async'),
		childProcess =		require('child_process'),
		fs =				require('fs-extra'),
		im =				require('node-imagemagick'),
		path =				require('path'),
		phantomjs =			require('phantomjs'),
		q =					require('q'),
		SVGO =				require('svgo'),

		cpSpawn =			childProcess.spawn,
		binPaths =			{
			image_optim:		[
									'/usr/local/sbin/image_optim',
									'/usr/local/bin/image_optim',
									'/usr/sbin/image_optim',
									'/usr/bin/image_optim',
									'/sbin/image_optim',
									'/bin/image_optim'
								].map(function(dir) {
									return path.resolve(__dirname, dir);
								}),
			picopt:				[
									'/usr/local/sbin/picopt',
									'/usr/local/bin/picopt',
									'/usr/sbin/picopt',
									'/usr/bin/picopt',
									'/sbin/picopt',
									'/bin/picopt'
								].map(function(dir) {
									return path.resolve(__dirname, dir);
								}),
			imageOptim:			[
									'../node_modules/imageoptim-cli/bin',
									'../../imageoptim-cli/bin'
								].map(function(dir) {
									return path.resolve(__dirname, dir);
								})
		},

		DEFAULT_OPTIONS = {
			// options: Activate, Associate, Background, Copy, Deactivate, Disassociate, Extract, Off, On, Opaque, Remove, Set, Shape, Transparent
			alpha :						null,

			// options: an ImageMagick-compatible color (see http://www.imagemagick.org/script/color.php)
			background :				null,

			// options: CMY, CMYK, Gray, HCL, HCLp, HSB, HSI, HSL, HSV, HWB, Lab, LCHab, LCHuv, LMS, Log, Luv, OHTA, Rec601YCbCr, Rec709YCbCr, RGB, scRGB, sRGB, Transparent, xyY, XYZ, YCbCr, YCC, YDbDr, YIQ, YPbPr, YUV
			colorspace :				'sRGB',

			// options: FloydSteinberg, None, plus, Riemersma
			dither :					'None',

			// options: Bartlett, Bessel, Blackman, Bohman, Box, Catrom, Cosine, Cubic, Gaussian, Hamming, Hann, Hanning, Hermite, Jinc, Kaiser, Lagrange, Lanczos, Lanczos2, Lanczos2Sharp, LanczosRadius, LanczosSharp, Mitchell, Parzen, Point, Quadratic, Robidoux, RobidouxSharp, Sinc, SincFast, Spline, Triangle, Welch, Welsh
			filter :					'Triangle',

			// options: (float)
			filterSupport :				2,

			// options: GIF, JPEG, line, none, partition, plane, PNG
			interlace :					'none',

			// options: off, on
			jpegFancyUpsampling :		'off',

			// options for each: true, false
			optimize :		{
				svg:					false,	// deprecated
				rasterInput:			false,	// deprecated
				rasterOutput:			false,	// deprecated

				input: {
					svgo:				0,
					image_optim:		0,
					imageOptim:			0,
					picopt:				0
				},

				output: {
					svgo:				3,
					image_optim:		1,
					imageOptim:			1,
					picopt:				1
				}
			},

			// options: (int) 0–9
			pngCompressionFilter :		5,

			// options: (int) 0–9
			pngCompressionLevel :		9,

			// options: (int) 0–9
			pngCompressionStrategy :	1,

			// options: “all”, “date”, “none”, or the name(s) of chunk(s) to be excluded (see http://www.imagemagick.org/script/command-line-options.php#define)
			pngExcludeChunk :			'all',

			// options: true, false
			// note that “false” is equivalent to “null”; actually passing “false” behaves the same as passing “true”
			pngPreserveColormap :		null,

			// options: (int)
			posterize :					136,

			// options: (int) 0–100
			quality :					82,

			// options: adaptive, distort, geometry, interpolative, liquid, resize, sample, scale, thumbnail
			resizeFunction :			'thumbnail',

			// options: true, false
			// note that “false” is equivalent to “null”
			// no-optim default: true
			strip :						null,

			// see https://github.com/sindresorhus/grunt-svgmin/blob/master/readme.md and https://github.com/svg/svgo/tree/master/plugins
			svgoPlugins :	[
				{
					removeUnknownsAndDefaults :	false
				}
			],

			// options: each one is a (float)
			// no-optim default: 0.25x0.25+8+0.065
			unsharp : {
				radius :				0.25,
				sigma :					0.08,
				gain :					8.3,
				threshold :				0.045
			},

			// options: true, false
			widthAsDir :				false,

			// options: (int)s
			widths : [
										320,
										640,
										1280
			]
		},





		/**
		 * Check if a directory exists, and create it if it doesn’t.
		 *
		 * @private
		 * @param   {string}          dirPath   The path we want to check
		 */
		checkDirectoryExists = function(dirPath) {
			if (!grunt.file.isDir(dirPath)) {
				grunt.file.mkdir(dirPath);
			}
		},


		/**
		 * Gets the destination path
		 *
		 * @private
		 * @param   {string}          srcPath   The source path
		 * @param   {string}          dstPath   The destination path
		 * @param   {int}             width
		 * @param   {Object}          options   Options
		 * @return                    The complete path and filename
		 */
		getDestination = function(srcPath, dstPath, width, options) {
			var baseName =	'',
				dirName =	'',
				extName =	'';

			extName = path.extname(dstPath);
			baseName = path.basename(srcPath, extName); // filename without extension
			dirName = path.dirname(dstPath);

			if (width === false) {
				checkDirectoryExists(path.join(dirName));
				return path.join(dirName, baseName + extName);
			} else if (options.widthAsDir) {
				dirName = dirName + '/' + width + '/';
				checkDirectoryExists(path.join(dirName));
				return path.join(dirName, baseName + extName);
			} else {
				checkDirectoryExists(path.join(dirName));
				return path.join(dirName, baseName + '-w' + width + extName);
			}
		},


		/**
		 * Ensure the image optimization binaries are accessible
		 * @return {String}
		 */
		getPathToBin = function(bin) {
			return binPaths[bin].filter(function(binPath) {
				return grunt.file.exists(binPath);
			})[0];
		},


		/**
		 * Determine if the file is an animated GIF
		 *
		 * @private
		 * @param   {Object}          data      The image data
		 * @param   {string}          dstPath   The destination path
		 */
		isAnimatedGif = function(data, dstPath) {
			// GIF87 cannot be animated.
			// data.delay and scene can identify an animation GIF
			if (data.format.toUpperCase() === 'GIF' && data.delay && data.scene) {
				grunt.verbose.warn(dstPath + ' is animated - skipping');
				return true;
			}
		},


		/**
		 * @param  {String[]}  files             Array of paths to files
		 * @param  {String}    binPath           Path to image_optim binary
		 * @return {Promise}
		 */
		optimizeImage_optim = function(files, binPath) {
			var image_optim,
				deferred = q.defer(),
				errorMessage = 'image_optim exited with a failure status',
				ymlPath = path.resolve(__dirname, 'lib/i_o.yml'),
				exts = ['.gif', '.jpeg', '.jpg', '.png', '.svg'];

			for (var i = 0; i < files.length; i++) {
				if (exts.indexOf(path.extname(files[i]).toLowerCase()) === -1) {
					files.splice(i, 1);
					i--;
				}
			}

			image_optim = cpSpawn(binPath, ['--config-paths', ymlPath].concat(files), {});

			image_optim.stdout.on('data', function(message) {
				grunt.verbose.ok(String(message.toString('utf8') || '').replace(/\n+$/, ''));
			});

			image_optim.stderr.on('data', function(data) {
				grunt.verbose.ok(data.toString('utf8'));
			});

			image_optim.on('exit', function(code, signal) {
				code === 0 ? deferred.resolve(true) : deferred.reject(new Error(errorMessage));
			});

			image_optim.stdin.setEncoding('utf8');

			return deferred.promise;
		},


		/**
		 * @param  {String[]}  files             Array of paths to files
		 * @param  {String}    binPath           Path to imageOptim binary
		 * @return {Promise}
		 */
		optimizeImageOptim = function(files, binPath) {
			var imageOptimCli,
				deferred = q.defer(),
				errorMessage = 'ImageOptim-CLI exited with a failure status';

			imageOptimCli = cpSpawn('./imageOptim', ['--quit'], {
				cwd: binPath
			});

			imageOptimCli.stdout.on('data', function(message) {
				grunt.verbose.ok(String(message || '').replace(/\n+$/, ''));
			});

			imageOptimCli.on('exit', function(code) {
				return code === 0 ? deferred.resolve(true) : deferred.reject(new Error(errorMessage));
			});

			imageOptimCli.stdin.setEncoding('utf8');
			imageOptimCli.stdin.end(files.join('\n') + '\n');

			return deferred.promise;
		},


		/**
		 * @param  {String[]}  files             Array of paths to files
		 * @param  {String}    binPath           Path to picopt binary
		 * @return {Promise}
		 */
		optimizePicopt = function(files, binPath) {
			var picopt,
				deferred = q.defer(),
				errorMessage = 'picopt exited with a failure status';

			picopt = cpSpawn(binPath, files, {});

			picopt.stdout.on('data', function(message) {
				grunt.verbose.ok(String(message || '').replace(/\n+$/, ''));
			});

			picopt.stderr.on('data', function(data) {
				grunt.verbose.ok(data.toString('utf8'));
			});

			picopt.on('exit', function(code, signal) {
				return code === 0 ? deferred.resolve(true) : deferred.reject(new Error(errorMessage));
			});

			picopt.stdin.setEncoding('utf8');

			return deferred.promise;
		},


		/**
		 * @param  {String[]}  files             Array of paths to files
		 * @param  {Object}    options           Options
		 * @return {Promise}
		 */
		optimizeSVGO = function(file, options) {
			// setup the promise and SVGO
			var deferred =	q.defer(),
				svgo =		new SVGO({ plugins : options.svgoPlugins });

			// bail if it’s not an SVG
			var extName = path.extname(file.dest).toLowerCase();
			if (extName !== '.svg') {
				deferred.resolve(false);
				return deferred.promise;
			}

			// get the path and load the SVG
			var	srcPath = file.src[0],
				srcSvg = grunt.file.read(srcPath);

			// optimize the SVG
			svgo.optimize(srcSvg, function(result) {
				if (result.error) {

					// if there’s an error, fail
					deferred.reject('Error parsing SVG:', result.error)

				} else {

					// calculate the savings
					var saved = srcSvg.length - result.data.length,
						percentage = saved / srcSvg.length * 100;

					// write the file and resolve the promise
					grunt.file.write(file.dest, result.data);
					deferred.resolve(srcPath + ' (saved ' + saved + ' bytes — ' + Math.round(percentage) + '%)');
				}
			});

			return deferred.promise;
		},


		/**
		 * Resize the image
		 *
		 * @private
		 * @param   {string}          srcPath   The source path
		 * @param   {string}          dstPath   The destination path
		 * @param   {Object}          options   Options
		 * @param   {int}             width     Width
		 */
		resizeImage = function(srcPath, dstPath, options, width) {
			var deferred = q.defer();

			// determine the image type by looking at the file extension
			// TODO: do this better, maybe with something like <https://github.com/mscdex/mmmagic>
			var extName = path.extname(dstPath).toLowerCase();

			// if it’s an SVG, generate a PNG using PhantomJS
			if (extName === '.svg') {
				deferred = resizeSVG(deferred, srcPath, dstPath, width);

			// if it’s a PDF, generate a PNG using ImageMagick
			} else if (extName === '.pdf') {
				deferred = resizePDF(deferred, srcPath, dstPath, options, width);

			// all other images get loaded into ImageMagick
			} else {
				deferred = resizeRaster(deferred, srcPath, dstPath, extName, options, width);

			}

			return deferred.promise;
		},


		/**
		 * Resize a PDF
		 *
		 * @private
		 * @param   {Object}          deferred  The deferred promise
		 * @param   {string}          srcPath   The source path
		 * @param   {string}          dstPath   The destination path
		 * @param   {Object}          options   Options
		 * @param   {int}             width     Width
		 */
		resizePDF = function(deferred, srcPath, dstPath, options, width) {

			// make the destination file a PNG
			dstPath = dstPath.replace(/\.pdf$/i, '.png');

			// get properties about the image
			im.identify(srcPath, function(error, data) {

				// figure out 2x density
				var pdfWidth = data.width,
					pdfResolution = parseInt(new String(data.resolution).split('x')[0], 10),
					density = width / pdfWidth * pdfResolution * 2;

				// render
				var args = [
					'-density',
					density,
					srcPath + '[0]',
					dstPath
				];

				im.convert(args, function(err, stdout, stderr) {
					// bail if there’s an error
					if (err) {
						grunt.fail.warn(err);
						return deferred.reject(err);
					}

					// resize to final width using standard IM stuff
					return resizeRaster(deferred, dstPath, dstPath, '.png', options, width);
				});

			});

			return deferred;

		},


		/**
		 * Resize a raster image
		 *
		 * @private
		 * @param   {Object}          deferred  The deferred promise
		 * @param   {string}          srcPath   The source path
		 * @param   {string}          dstPath   The destination path
		 * @param   {string}          extName   File extension
		 * @param   {Object}          options   Options
		 * @param   {int}             width     Width
		 */
		resizeRaster = function(deferred, srcPath, dstPath, extName, options, width) {

			// get properties about the image
			im.identify(srcPath, function(error, data) {

				// bail if there’s an error
				if (error) {
					grunt.fail.warn(error);
					return deferred.reject(error);
				}

				// bail if it’s an animated GIF
				if (extName === '.gif') {
					if (isAnimatedGif(data, dstPath)) {
						return deferred.resolve(false);
					}
				}

				var args = [srcPath];

				// set the resize filter
				if (options.filter !== null) {
					args.push('-filter');
					args.push(options.filter);
				}

				// set the filter support
				if (options.filterSupport !== null) {
					args.push('-define');
					args.push('filter:support=' + options.filterSupport);
				}

				// set the resize function
				if (options.resizeFunction !== null) {
					args.push('-' + options.resizeFunction);
					if (options.resizeFunction === 'Distort') {
						args.push('Resize');
					}
				}

				// set the width
				args.push(width);

				// set the unsharp mask
				if (options.unsharp.radius !== null &&
					options.unsharp.sigma !== null &&
					options.unsharp.gain !== null &&
					options.unsharp.threshold !== null) {
					args.push('-unsharp');
					args.push(options.unsharp.radius + 'x' + options.unsharp.sigma + '+' + options.unsharp.gain + '+' + options.unsharp.threshold);
				} else if (options.unsharp.radius !== null &&
					options.unsharp.sigma !== null &&
					options.unsharp.gain !== null) {
					args.push('-unsharp');
					args.push(options.unsharp.radius + 'x' + options.unsharp.sigma + '+' + options.unsharp.gain);
				} else if (options.unsharp.radius !== null &&
					options.unsharp.sigma !== null) {
					args.push('-unsharp');
					args.push(options.unsharp.radius + 'x' + options.unsharp.sigma);
				} else if (options.unsharp.radius !== null) {
					args.push('-unsharp');
					args.push(options.unsharp.radius);
				}

				// set the dither
				if (options.dither !== null) {
					if (options.dither === 'plus') {
						args.push('+dither');
					} else {
						args.push('-dither');
						args.push(options.dither);
					}
				}

				// set posterize
				if (options.posterize !== null) {
					args.push('-posterize');
					args.push(options.posterize);
				}

				// set background
				if (options.background !== null) {
					args.push('-background');
					args.push(options.background);
				}

				// set alpha
				if (options.alpha !== null) {
					args.push('-alpha');
					args.push(options.alpha);
				}

				// set the quality
				if (options.quality !== null) {
					args.push('-quality');
					args.push(options.quality);
				}

				// set pngPreserveColormap
				if (options.pngPreserveColormap === true) {
					args.push('-define');
					args.push('png:preserve-colormap=true');
				}

				// set jpegFancyUpsampling
				if (options.jpegFancyUpsampling !== null) {
					args.push('-define');
					args.push('jpeg:fancy-upsampling=' + options.jpegFancyUpsampling);
				}

				// set pngCompressionFilter
				if (options.pngCompressionFilter !== null) {
					args.push('-define');
					args.push('png:compression-filter=' + options.pngCompressionFilter);
				}

				// set pngCompressionLevel
				if (options.pngCompressionLevel !== null) {
					args.push('-define');
					args.push('png:compression-level=' + options.pngCompressionLevel);
				}

				// set pngCompressionStrategy
				if (options.pngCompressionStrategy !== null) {
					args.push('-define');
					args.push('png:compression-strategy=' + options.pngCompressionStrategy);
				}

				// set pngExcludeChunk
				if (options.pngExcludeChunk !== null) {
					args.push('-define');
					args.push('png:exclude-chunk=' + options.pngExcludeChunk);
				}

				// set interlace
				if (options.interlace !== null) {
					args.push('-interlace');
					args.push(options.interlace);
				}

				// colorspace
				if (options.colorspace !== null) {
					args.push('-colorspace');
					args.push(options.colorspace);
				}

				// set strip
				if (options.strip === true) {
					args.push('-strip');
				}

				// add output filename
				args.push(dstPath);

				// do the resizing
				im.convert(args, function(err, stdout, stderr) {
					// bail if there’s an error
					if (err) {
						grunt.fail.warn(error);
						return deferred.reject(error);
					}

					// output info about the saved image
					grunt.verbose.ok('Resized image: ' + srcPath + ' resized to ' + width + 'px wide, saved to ' + dstPath);
					return deferred.resolve(true);
				});
			});

			return deferred;

		},


		/**
		 * Resize an SVG image
		 *
		 * @private
		 * @param   {Object}          deferred  The deferred promise
		 * @param   {string}          srcPath   The source path
		 * @param   {string}          dstPath   The destination path
		 * @param   {int}             width     Width
		 */
		resizeSVG = function(deferred, srcPath, dstPath, width) {

			// make the destination file a PNG
			dstPath = dstPath.replace(/\.svg$/i, '.png');

			// spawn a phantomjs instance to show the SVG and render the output as an image
			var spawn = grunt.util.spawn(
				{
					cmd :	phantomjs.path,
					args :	[
							path.resolve(__dirname, 'lib/svg2png.js'),
							srcPath,
							dstPath,
							width
					]
				},
				function doneFunction(error, result, code) {
					if (error) {
						return deferred.reject();
					}
				}
			);

			// once phantomjs is done it will output a status
			// we capture this and use it to verify that the render was successful
			spawn.stdout.on('data', function(buffer) {
				try {
					var result = JSON.parse(buffer.toString());
					if (result.status) {

						// TODO: send these through ImageMagick to make them not huge?

						grunt.verbose.ok('Resized image: ' + srcPath + ' resized to ' + width + 'px wide, saved to ' + dstPath);
						return deferred.resolve(true);
					} else {
						return deferred.reject();
					}
				} catch (error) {
					grunt.fail.warn(error);
					return deferred.reject(error);
				}
			});

			return deferred;

		},


		validateAlpha = function(alpha) {
			var whitelist = [null, 'Activate', 'Associate', 'Background', 'Copy', 'Deactivate', 'Disassociate', 'Extract', 'Off', 'On', 'Opaque', 'Remove', 'Set', 'Shape', 'Transparent'];
			return validateWhitelist(whitelist, alpha, 'alpha');
		},


		/**
		 * Checks for a valid array, and that there are items in the array.
		 *
		 * @private
		 * @param   {object}          obj       The object to check
		 * @return  {boolean}         Whether it is a valid array with items.
		 */
		validateArray = function(obj) {
			return (Array.isArray(obj) && obj.length > 0);
		},


		validateBackground = function(background) {
			// TODO: this is pretty complex… need to figure out a good way to validate
			return true;
		},


		validateColorspace = function(colorspace) {
			var whitelist = [null, 'CMY', 'CMYK', 'Gray', 'HCL', 'HCLp', 'HSB', 'HSI', 'HSL', 'HSV', 'HWB', 'Lab', 'LCHab', 'LCHuv', 'LMS', 'Log', 'Luv', 'OHTA', 'Rec601YCbCr', 'Rec709YCbCr', 'RGB', 'scRGB', 'sRGB', 'Transparent', 'xyY', 'XYZ', 'YCbCr', 'YCC', 'YDbDr', 'YIQ', 'YPbPr', 'YUV'];
			return validateWhitelist(whitelist, colorspace, 'colorspace');
		},


		validateDither = function(dither) {
			var whitelist = [null, 'FloydSteinberg', 'None', 'plus', 'Riemersma'];
			return validateWhitelist(whitelist, dither, 'dither');
		},


		validateFilter = function(filter) {
			var whitelist = [null, 'Bartlett', 'Bessel', 'Blackman', 'Bohman', 'Box', 'Catrom', 'Cosine', 'Cubic', 'Gaussian', 'Hamming', 'Hann', 'Hanning', 'Hermite', 'Jinc', 'Kaiser', 'Lagrange', 'Lanczos', 'Lanczos2', 'Lanczos2Sharp', 'LanczosRadius', 'LanczosSharp', 'Mitchell', 'Parzen', 'Point', 'Quadratic', 'Robidoux', 'RobidouxSharp', 'Sinc', 'SincFast', 'Spline', 'Triangle', 'Welch', 'Welsh'];
			return validateWhitelist(whitelist, filter, 'filter');
		},


		validateFilterSupport = function(filterSupport) {
			if (filterSupport !== null && !validateFloat(filterSupport)) {
				grunt.fail.fatal('Invalid value for filterSupport: ' + filterSupport);
				return false;
			}
			return true;
		},


		validateFloat = function(float) {
			return (typeof float === 'number' && float >= 0);
		},


		validateInteger = function(int) {
			return (typeof int === 'number' && (int % 1) === 0 && int >= 0);
		},


		validateInterlace = function(interlace) {
			var whitelist = [null, 'GIF', 'JPEG', 'line', 'none', 'partition', 'plane', 'PNG'];
			return validateWhitelist(whitelist, interlace, 'interlace');
		},


		validateJpegFancyUpsampling = function(jpegFancyUpsampling) {
			var whitelist = [null, 'off', 'on'];
			return validateWhitelist(whitelist, jpegFancyUpsampling, 'jpegFancyUpsampling');
		},


		validateOptimize = function(optimize) {
			// setting it to false is equivalent to zeroes e’rywhere
			if (optimize === false) {
				optimize = {
					input: {
						svgo:				0,
						image_optim:		0,
						picopt:				0,
						imageOptim:			0
					},
					output: {
						svgo:				0,
						image_optim:		0,
						picopt:				0,
						imageOptim:			0
					}
				};
				return optimize;
			}

			// validate parent and children
			if (optimize === null || typeof(optimize) !== 'object') {
				grunt.fail.fatal('Invalid value for optimize: ' + optimize);
				return false;
			}

			// recreate defaults if a deprecated parent has been passed
			if (optimize.input === null || typeof(optimize.input) !== 'object') {
				optimize.input = {
					svgo:				0,
					image_optim:		0,
					picopt:				0,
					imageOptim:			0
				};
			}
			if (optimize.output === null || typeof(optimize.output) !== 'object') {
				optimize.output = {
					svgo:				3,
					image_optim:		1,
					picopt:				1,
					imageOptim:			1
				}
			}

			// validate grandchildren
			if (optimize.input.svgo !== parseInt(optimize.input.svgo, 10) || optimize.input.svgo < 0) {
				grunt.fail.fatal('Invalid value for optimize.input.svgo: ' + optimize.input.svgo);
				return false;
			}
			if (optimize.input.image_optim !== parseInt(optimize.input.image_optim, 10) || optimize.input.image_optim < 0) {
				grunt.fail.fatal('Invalid value for optimize.input.image_optim: ' + optimize.input.image_optim);
				return false;
			}
			if (optimize.input.picopt !== parseInt(optimize.input.picopt, 10) || optimize.input.picopt < 0) {
				grunt.fail.fatal('Invalid value for optimize.input.picopt: ' + optimize.input.picopt);
				return false;
			}
			if (optimize.input.imageOptim !== parseInt(optimize.input.imageOptim, 10) || optimize.input.imageOptim < 0) {
				grunt.fail.fatal('Invalid value for optimize.imageOptim: ' + optimize.imageOptim);
				return false;
			}
			if (optimize.output.svgo !== parseInt(optimize.output.svgo, 10) || optimize.output.svgo < 0) {
				grunt.fail.fatal('Invalid value for optimize.output.svgo: ' + optimize.output.svgo);
				return false;
			}
			if (optimize.output.image_optim !== parseInt(optimize.output.image_optim, 10) || optimize.output.image_optim < 0) {
				grunt.fail.fatal('Invalid value for optimize.output.image_optim: ' + optimize.image_optim);
				return false;
			}
			if (optimize.output.picopt !== parseInt(optimize.output.picopt, 10) || optimize.output.picopt < 0) {
				grunt.fail.fatal('Invalid value for optimize.picopt: ' + optimize.picopt);
				return false;
			}
			if (optimize.output.imageOptim !== parseInt(optimize.output.imageOptim, 10) || optimize.output.imageOptim < 0) {
				grunt.fail.fatal('Invalid value for optimize.imageOptim: ' + optimize.imageOptim);
				return false;
			}

			// convert deprecated settings
			if (optimize.svg === true || optimize.svg === 1) {
				optimize.input.svgo = 1;
				optimize.svg = null;
			}
			if (optimize.rasterInput === true || optimize.rasterInput === 1) {
				optimize.input.imageOptim = 1;
				optimize.rasterInput = null;
			}
			if (optimize.rasterOutput === true || optimize.rasterOutput === 1) {
				optimize.output.imageOptim = 1;
				optimize.rasterOutput = null;
			}

			// return the options object with this new converted monstrosity
			return optimize;
		},


		validatePngCompressionFilter = function(pngCompressionFilter) {
			var whitelist = [null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			return validateWhitelist(whitelist, pngCompressionFilter, 'pngCompressionFilter');
		},


		validatePngCompressionLevel = function(pngCompressionLevel) {
			var whitelist = [null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			return validateWhitelist(whitelist, pngCompressionLevel, 'pngCompressionLevel');
		},


		validatePngCompressionStrategy = function(pngCompressionStrategy) {
			var whitelist = [null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
			return validateWhitelist(whitelist, pngCompressionStrategy, 'pngCompressionStrategy');
		},


		validatePngExcludeChunk = function(pngExcludeChunk) {
			var whitelist = ['all', 'bkgd', 'chrm', 'date', 'exif', 'gama', 'gama', 'iccp', 'itxt', 'none', 'offs', 'phys', 'srgb', 'text', 'trns', 'vpag', 'zccp', 'ztxt'],
				exclude,
				valid = true;

			if (pngExcludeChunk) {
				exclude = pngExcludeChunk.split(',');
			}

			if (pngExcludeChunk === null) {
				return true;
			}

			var chunk;
			for (var i in exclude) {
				chunk = exclude[i];
				if (chunk.trim) {
					chunk = chunk.trim()
				}
				valid = valid * validateWhitelist(whitelist, chunk, 'validatePngExcludeChunk');
			}

			return valid;
		},


		validatePngPreserveColormap = function(pngPreserveColormap) {
			var whitelist = [null, true, false];
			return validateWhitelist(whitelist, pngPreserveColormap, 'pngPreserveColormap');
		},


		validatePosterize = function(posterize) {
			if (posterize !== null && !validateInteger(posterize)) {
				grunt.fail.fatal('Invalid value for posterize: ' + posterize);
				return false;
			}
			return true;
		},


		/**
		 * Checks for a valid quality
		 *
		 * @private
		 * @param   {int}             quality     The quality, a value from 0–100
		 * @return  {boolean}         Whether the quality is valid.
		 */
		validateQuality = function(quality) {
			if ((quality !== null && !validateInteger(quality)) || quality > 100) {
				grunt.fail.fatal('Invalid value for quality: ' + quality);
				return false;
			}
			return true;
		},


		validateResizeFunction = function(resizeFunction) {
			var whitelist = [null, 'adaptive', 'distort', 'geometry', 'interpolative', 'liquid', 'resize', 'sample', 'scale', 'thumbnail'];
			return validateWhitelist(whitelist, resizeFunction, 'resizeFunction');
		},


		/**
		 * Check that there is only one source file in compact/files object format.
		 *
		 * @private
		 * @param   {object}          files         The files object
		 */
		validateSource = function(files) {
			// more than 1 source.
			if (files.src.length > 1) {
				return grunt.fail.warn('Unable to resize more than one image in compact or files object format.\n'+
				'For multiple files please use the files array format.\nSee http://gruntjs.com/configuring-tasks');
			}
		},


		validateStrip = function(strip) {
			var whitelist = [null, true, false];
			return validateWhitelist(whitelist, strip, 'strip');
		},


		validateSvgoPlugins = function(svgoPlugins) {
			var whitelist = [true, false];

			if (!validateArray(svgoPlugins)) {
				grunt.fail.fatal('Invalid value for svgoPlugins: ' + svgoPlugins);
				return false;
			}

			var i, j, obj, val;
			for (i in svgoPlugins) {
				obj = svgoPlugins[i];
				if (obj === null || typeof(obj) !== 'object') {
					grunt.fail.fatal('Invalid value for svgoPlugins[' + i + ']: ' + obj);
					return false;
				}

				for (j in obj) {
					val = obj[j];
					if (!validateWhitelist(whitelist, val, 'svgoPlugins[' + i + '].' + j)) {
						return false;
					}
				}
			}

			return true;
		},


		/**
		 * Check the target has been set up properly in Grunt.
		 * Graceful handling of https://github.com/andismith/grunt-responsive-images/issues/2
		 *
		 * @private
		 * @param   {object}          files         The files object
		 */
		validateTarget = function(files) {
			var test;
			try {
				test = files.src;
			} catch (exception) {
				grunt.fail.fatal('Unable to read configuration.\n' +
				'Have you specified a target? See: http://gruntjs.com/configuring-tasks');
			}
		},


		validateUnsharp = function(unsharp) {
			if (unsharp === null || typeof(unsharp) !== 'object') {
				grunt.fail.fatal('Invalid value for unsharp: ' + unsharp);
				return false;
			}
			if (!validateFloat(unsharp.radius)) {
				grunt.fail.fatal('Invalid value for unsharp.radius: ' + unsharp.radius);
				return false;
			}
			if (!validateFloat(unsharp.sigma)) {
				grunt.fail.fatal('Invalid value for unsharp.sigma: ' + unsharp.sigma);
				return false;
			}
			if (!validateFloat(unsharp.gain)) {
				grunt.fail.fatal('Invalid value for unsharp.gain: ' + unsharp.gain);
				return false;
			}
			if (!validateFloat(unsharp.threshold)) {
				grunt.fail.fatal('Invalid value for unsharp.threshold: ' + unsharp.threshold);
				return false;
			}
			return true;
		},


		validateWhitelist = function(whitelist, value, name) {
			if (whitelist.indexOf(value) === -1) {
				grunt.fail.fatal('Invalid value for ' + name + ': ' + value);
				return false;
			}
			return true;
		},


		validateWidthAsDir = function(widthAsDir) {
			var whitelist = [true, false];
			return validateWhitelist(whitelist, widthAsDir, 'widthAsDir');
		},


		/**
		 * Checks for valid widths
		 *
		 * @private
		 * @param   {int}             widths     The width as a number of pixels
		 * @return  {boolean}         Whether the sizes are valid.
		 */
		validateWidths = function(widths) {
			if (!validateArray(widths)) {
				grunt.fail.fatal('Invalid value for widths: ' + widths);
				return false;
			}

			var i, width;
			for (i in widths) {
				width = widths[i];

				if (!validateInteger(width)) {
					grunt.fail.fatal('Invalid value for width: ' + width);
					return false;
				}
			}

			return true;
		};





	// let’s get this party started
	grunt.registerMultiTask('respimg', 'Automatically resizes image assets.', function() {
		var task = this;

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options(DEFAULT_OPTIONS);

		// change some default options if we’re not optimizing images
		if (
			!options.optimize ||
			!options.optimize.output ||
			(
				!options.optimize.output.image_optim &&
				!options.optimize.output.picopt &&
				!options.optimize.output.imageOptim
			)
		) {
			DEFAULT_OPTIONS.strip =						true;
			DEFAULT_OPTIONS.unsharp.sigma =				0.25;
			DEFAULT_OPTIONS.unsharp.gain =				8;
			DEFAULT_OPTIONS.unsharp.threshold =			0.065;
			options = this.options(DEFAULT_OPTIONS);
		}

		grunt.verbose.writeln('Real options: ');
		grunt.verbose.ok(JSON.stringify(options));

		// now some setup
		var done =				this.async(),
			i =					0,
			series =			[],
			task =				this,
			promise =			q(),
			promise2 =			q(),
			binPath =			{
				image_optim:		getPathToBin('image_optim'),
				picopt:				getPathToBin('picopt'),
				imageOptim:			getPathToBin('imageOptim')
			},
			outputFiles = 		[],
			totalSaved =		0;

		async.series([

			// do some validation
			function(callback) {
				// tell the user what we’re doing
				grunt.verbose.writeln('Validating options…');

				// make sure alpha is valid
				if (!validateAlpha(options.alpha)) {
					return grunt.fail.fatal('Invalid `alpha` option');
				}
				grunt.verbose.writeln('`alpha` option OK');

				// make sure background is valid
				if (!validateBackground(options.background)) {
					return grunt.fail.fatal('Invalid `background` option');
				}
				grunt.verbose.writeln('`background` option OK');

				// make sure colorspace is valid
				if (!validateColorspace(options.colorspace)) {
					return grunt.fail.fatal('Invalid `colorspace` option');
				}
				grunt.verbose.writeln('`colorspace` option OK');

				// make sure dither is valid
				if (!validateDither(options.dither)) {
					return grunt.fail.fatal('Invalid `dither` option');
				}
				grunt.verbose.writeln('`dither` option OK');

				// make sure filter is valid
				if (!validateFilter(options.filter)) {
					return grunt.fail.fatal('Invalid `filter` option');
				}
				grunt.verbose.writeln('`filter` option OK');

				// make sure filterSupport is valid
				if (!validateFilterSupport(options.filterSupport)) {
					return grunt.fail.fatal('Invalid `filterSupport` option');
				}
				grunt.verbose.writeln('`filterSupport` option OK');

				// make sure interlace is valid
				if (!validateInterlace(options.interlace)) {
					return grunt.fail.fatal('Invalid `interlace` option');
				}
				grunt.verbose.writeln('`interlace` option OK');

				// make sure jpegFancyUpsampling is valid
				if (!validateJpegFancyUpsampling(options.jpegFancyUpsampling)) {
					return grunt.fail.fatal('Invalid `jpegFancyUpsampling` option');
				}
				grunt.verbose.writeln('`jpegFancyUpsampling` option OK');

				// make sure optimize is valid
				var optimize = validateOptimize(options.optimize)
				if (!optimize) {
					return grunt.fail.fatal('Invalid `optimize` option');
				} else {
					options.optimize = optimize;
				}
				grunt.verbose.writeln('`optimize` option OK');

				// make sure image_optim is available
				if ((options.optimize.input.image_optim > 0 || options.optimize.output.image_optim > 0) && !binPath.image_optim) {
					return grunt.fail.fatal('Unable to locate image_optim.');
				} else if (options.optimize.input.image_optim > 0 || options.optimize.output.image_optim > 0) {
					grunt.verbose.writeln('image_optim located');
				} else {
					grunt.verbose.writeln('image_optim not needed');
				}

				// make sure picopt is available
				if ((options.optimize.input.picopt > 0 || options.optimize.output.picopt > 0) && !binPath.picopt) {
					return grunt.fail.fatal('Unable to locate picopt.');
				} else if (options.optimize.input.picopt > 0 || options.optimize.output.picopt > 0) {
					grunt.verbose.writeln('picopt located');
				} else {
					grunt.verbose.writeln('picopt not needed');
				}

				// make sure ImageOptim is available
				if ((options.optimize.input.imageOptim > 0 || options.optimize.output.imageOptim > 0) && !binPath.imageOptim) {
					return grunt.fail.fatal('Unable to locate ImageOptim-CLI.');
				} else if (options.optimize.input.imageOptim > 0 || options.optimize.output.imageOptim > 0) {
					grunt.verbose.writeln('ImageOptim-CLI located');
				} else {
					grunt.verbose.writeln('ImageOptim-CLI not needed');
				}

				// make sure pngCompressionFilter is valid
				if (!validatePngCompressionFilter(options.pngCompressionFilter)) {
					return grunt.fail.fatal('Invalid `pngCompressionFilter` option');
				}
				grunt.verbose.writeln('`pngCompressionFilter` option OK');

				// make sure pngCompressionLevel is valid
				if (!validatePngCompressionLevel(options.pngCompressionLevel)) {
					return grunt.fail.fatal('Invalid `pngCompressionLevel` option');
				}
				grunt.verbose.writeln('`pngCompressionLevel` option OK');

				// make sure pngCompressionStrategy is valid
				if (!validatePngCompressionStrategy(options.pngCompressionStrategy)) {
					return grunt.fail.fatal('Invalid `pngCompressionStrategy` option');
				}
				grunt.verbose.writeln('`pngCompressionStrategy` option OK');

				// make sure pngExcludeChunk is valid
				if (!validatePngExcludeChunk(options.pngExcludeChunk)) {
					return grunt.fail.fatal('Invalid `pngExcludeChunk` option');
				}
				grunt.verbose.writeln('`pngExcludeChunk` option OK');

				// make sure pngPreserveColormap is valid
				if (!validatePngPreserveColormap(options.pngPreserveColormap)) {
					return grunt.fail.fatal('Invalid `pngPreserveColormap` option');
				}
				grunt.verbose.writeln('`pngPreserveColormap` option OK');

				// make sure posterize is valid
				if (!validatePosterize(options.posterize)) {
					return grunt.fail.fatal('Invalid `posterize` option');
				}
				grunt.verbose.writeln('`posterize` option OK');

				// make sure quality is valid
				if (!validateQuality(options.quality)) {
					return grunt.fail.fatal('Invalid `quality` option');
				}
				grunt.verbose.writeln('`quality` option OK');

				// make sure resizeFunction is valid
				if (!validateResizeFunction(options.resizeFunction)) {
					return grunt.fail.fatal('Invalid `resizeFunction` option');
				}
				grunt.verbose.writeln('`resizeFunction` option OK');

				// make sure strip is valid
				if (!validateStrip(options.strip)) {
					return grunt.fail.fatal('Invalid `strip` option');
				}
				grunt.verbose.writeln('`strip` option OK');

				// make sure svgoPlugins is valid
				if (!validateSvgoPlugins(options.svgoPlugins)) {
					return grunt.fail.fatal('Invalid `svgoPlugins` option');
				}
				grunt.verbose.writeln('`svgoPlugins` option OK');

				// make sure unsharp is valid
				if (!validateUnsharp(options.unsharp)) {
					return grunt.fail.fatal('Invalid `unsharp` option');
				}
				grunt.verbose.writeln('`unsharp` option OK');

				// make sure widthAsDir is valid
				if (!validateWidthAsDir(options.widthAsDir)) {
					return grunt.fail.fatal('Invalid `widthAsDir` option');
				}
				grunt.verbose.writeln('`pngPreserveColormap` option OK');

				// make sure the widths are valid
				if (!validateWidths(options.widths)) {
					return grunt.fail.fatal('Invalid `widths` option');
				}
				grunt.verbose.writeln('`widths` option OK');

				// make sure there are images to resize
				if (task.files.length === 0) {
					return grunt.fail.fatal('No valid source files were found.');
				}
				grunt.verbose.writeln('Source files found');

				// loop through each input
				async.each(task.files, function(file, callback2) {
					// make sure we have a valid target and source
					validateTarget(file);
					validateSource(file);
					callback2();
				}, callback);
			},

			// optimize inputs - SVGO
			function(callback) {

				// optimize as many times as the user wants
				async.timesSeries(options.optimize.input.svgo, function(i, next) {

					// tell the user that we’re optimizing
					grunt.log.writeln('Optimizing inputs with SVGO (pass ' + (i + 1) + ' of ' + options.optimize.input.svgo + ')…');

					// asynchronously loop through the files
					async.each(task.files, function(file, callback2) {

						// create a promise to optimize the SVGs
						promise = optimizeSVGO(file, options);

						// when that promise is finished, print the results onscreen
						// (if we’re being verbose)
						// and continue onwards
						promise.done(function(results) {
							if (results) {
								grunt.verbose.ok(results);
							}
							callback2(null);
						});

					}, next);

				}, callback);

			},

			// optimize inputs - image_optim
			function(callback) {

				// build a list of individual files
				var rasterFiles =	[];
				task.files.forEach(function(file) {
					if (!grunt.file.isDir(file.src[0]) && path.extname(file.dest).toLowerCase() !== '.svg') {
						rasterFiles.push(file.src[0]);
					}
				});

				// if there’s anything to optimize…
				if (rasterFiles.length > 0) {

					// get absolute paths to the stuff we’re optimizing
					var rasterFilesResolved = rasterFiles.map(function(dir) {
						return path.resolve(__dirname, '../' + dir);
					});

					// optimize as many times as the user wants
					async.timesSeries(options.optimize.input.image_optim, function(i, next) {

						// let the user know that we’re optimizing inputs
						grunt.log.writeln('Optimizing inputs with image_optim (pass ' + (i + 1) + ' of ' + options.optimize.input.image_optim + ')…');

						// do the optimizations (with promises)
						optimizeImage_optim(rasterFilesResolved, binPath.image_optim).then(function() {
							next();
						});

					}, callback);

				} else {
					callback(null);
				}

			},

			// optimize inputs - picopt
			function(callback) {

				// build a list of individual files
				var rasterFiles =	[];
				task.files.forEach(function(file) {
					if (!grunt.file.isDir(file.src[0]) && path.extname(file.dest).toLowerCase() !== '.svg') {
						rasterFiles.push(file.src[0]);
					}
				});

				// if there’s anything to optimize…
				if (rasterFiles.length > 0) {

					// get absolute paths to the stuff we’re optimizing
					var rasterFilesResolved = rasterFiles.map(function(dir) {
						return path.resolve(__dirname, '../' + dir);
					});

					// optimize as many times as the user wants
					async.timesSeries(options.optimize.input.picopt, function(i, next) {

						// let the user know that we’re optimizing inputs
						grunt.log.writeln('Optimizing inputs with picopt (pass ' + (i + 1) + ' of ' + options.optimize.input.picopt + ')…');

						// do the optimizations (with promises)
						optimizePicopt(rasterFilesResolved, binPath.picopt).then(function() {
							next();
						});

					}, callback);

				} else {
					callback(null);
				}

			},

			// optimize inputs - ImageOptim
			function(callback) {

				// build a list of individual files
				var rasterFiles =	[];
				task.files.forEach(function(file) {
					if (!grunt.file.isDir(file.src[0]) && path.extname(file.dest).toLowerCase() !== '.svg') {
						rasterFiles.push(file.src[0]);
					}
				});

				// if there’s anything to optimize…
				if (rasterFiles.length > 0) {

					// get absolute paths to the stuff we’re optimizing
					var rasterFilesResolved = rasterFiles.map(function(dir) {
						return path.resolve(__dirname, '../' + dir);
					});

					// optimize as many times as the user wants
					async.timesSeries(options.optimize.input.imageOptim, function(i, next) {

						// let the user know that we’re optimizing inputs
						grunt.log.writeln('Optimizing inputs with ImageOptim (pass ' + (i + 1) + ' of ' + options.optimize.input.imageOptim + ')…');

						// do the optimizations (with promises)
						optimizeImageOptim(rasterFilesResolved, binPath.imageOptim).then(function() {
							next();
						});

					}, callback);

				} else {
					callback(null);
				}

			},

			// copy SVGs and PDFs
			function(callback) {
				async.each(task.files, function(file, callback2) {
					var srcPath = file.src[0],
						extName = path.extname(srcPath).toLowerCase();

					// if it’s an SVG or a PDF, copy the file to the output dir
					if (extName === '.svg' || extName === '.pdf') {
						var dstPath = getDestination(srcPath, file.dest, false, options);
						fs.copy(srcPath, dstPath, function(err){
							if (err) {
								grunt.fail.fatal(err);
							}

							outputFiles.push(dstPath);
							callback2(null);
						});
					} else {
						callback2(null);
					}

				}, callback);
			},

			// resize images
			function(callback) {

				// tell the user what we’re doing
				grunt.log.writeln('Resizing images…');

				// loop through each output width
				async.each(options.widths, function(width, callback2) {

					// loop through each input
					async.each(task.files, function(file, callback3) {

						// set the source and destination
						var srcPath =	file.src[0],
							dstPath =	getDestination(srcPath, file.dest, width, options);

						// process the image with a promise
						var promise2 = q();
						promise2 = resizeImage(srcPath, dstPath, options, width);

						// once the image has been processed
						promise2.done(function(results) {

							if (results) {

								var extName = path.extname(srcPath).toLowerCase();

								// if it’s an SVG or a PDF, make sure we record that the output was a PNG
								if (extName === '.svg' || extName === '.pdf') {
									dstPath = dstPath.replace(/\.svg$/i, '.png');
									dstPath = dstPath.replace(/\.pdf$/i, '.png');
									extName = '.png';
								}

								// record the output path for optimization
								outputFiles.push(dstPath);
							}

							callback3(null);

						});

					}, callback2);

				}, callback);

			},

			// optimize outputs - SVGO
			function(callback) {

				// optimize as many times as the user wants
				async.timesSeries(options.optimize.output.svgo, function(i, next) {

					// tell the user that we’re optimizing
					grunt.log.writeln('Optimizing outputs with SVGO (pass ' + (i + 1) + ' of ' + options.optimize.output.svgo + ')…');

					// asynchronously loop through the files
					async.each(outputFiles, function(file, callback2) {

						// create a promise to optimize the SVGs
						promise = optimizeSVGO(file, options);

						// when that promise is finished, print the results onscreen
						// (if we’re being verbose)
						// and continue onwards
						promise.done(function(results) {
							if (results) {
								grunt.verbose.ok(results);
							}
							callback2(null);
						});

					}, next);

				}, callback);

			},

			// optimize outputs - image_optim
			function(callback) {

				// if there’s anything to optimize…
				if (outputFiles.length > 0) {

					// get absolute paths to the stuff we’re optimizing
					var outputFilesResolved = outputFiles.map(function(dir) {
						return path.resolve(__dirname, '../' + dir);
					});

					// optimize as many times as the user wants
					async.timesSeries(options.optimize.output.image_optim, function(i, next) {

						// let the user know that we’re optimizing inputs
						grunt.log.writeln('Optimizing outputs with image_optim (pass ' + (i + 1) + ' of ' + options.optimize.output.image_optim + ')…');

						// do the optimizations (with promises)
						optimizeImage_optim(outputFilesResolved, binPath.image_optim).then(function() {
							next();
						});

					}, callback);

				} else {
					callback(null);
				}

			},

			// optimize outputs - picopt
			function(callback) {

				// if there’s anything to optimize…
				if (outputFiles.length > 0) {

					// get absolute paths to the stuff we’re optimizing
					var outputFilesResolved = outputFiles.map(function(dir) {
						return path.resolve(__dirname, '../' + dir);
					});

					// optimize as many times as the user wants
					async.timesSeries(options.optimize.output.picopt, function(i, next) {

						// let the user know that we’re optimizing inputs
						grunt.log.writeln('Optimizing outputs with picopt (pass ' + (i + 1) + ' of ' + options.optimize.output.picopt + ')…');

						// do the optimizations (with promises)
						optimizePicopt(outputFilesResolved, binPath.picopt).then(function() {
							next();
						});

					}, callback);

				} else {
					callback(null);
				}

			},

			// optimize outputs - ImageOptim
			function(callback) {

				// if there’s anything to optimize…
				if (outputFiles.length > 0) {

					// get absolute paths to the stuff we’re optimizing
					var outputFilesResolved = outputFiles.map(function(dir) {
						return path.resolve(__dirname, '../' + dir);
					});

					// optimize as many times as the user wants
					async.timesSeries(options.optimize.output.imageOptim, function(i, next) {

						// let the user know that we’re optimizing inputs
						grunt.log.writeln('Optimizing outputs with ImageOptim (pass ' + (i + 1) + ' of ' + options.optimize.output.imageOptim + ')…');

						// do the optimizations (with promises)
						optimizeImageOptim(outputFilesResolved, binPath.imageOptim).then(function() {
							next();
						});

					}, callback);

				} else {
					callback(null);
				}

			}

		],

		function(err, results) {
			done();
		});
	});
};
