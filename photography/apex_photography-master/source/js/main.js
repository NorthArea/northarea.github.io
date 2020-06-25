// Animate Smooth Scroll
(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

})(jQuery); // End of use strict

/*!
 * Lightbox v2.10.0
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright 2007, 2018 Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 *
 * @preserve
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.lightbox = factory(root.jQuery);
    }
}(this, function ($) {

  function Lightbox(options) {
    this.album = [];
    this.currentImageIndex = void 0;
    this.init();

    // options
    this.options = $.extend({}, this.constructor.defaults);
    this.option(options);
  }

  // Descriptions of all options available on the demo site:
  // http://lokeshdhakar.com/projects/lightbox2/index.html#options
  Lightbox.defaults = {
    albumLabel: 'Image %1 of %2',
    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 600,
    fitImagesInViewport: true,
    imageFadeDuration: 600,
    // maxWidth: 800,
    // maxHeight: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    disableScrolling: false,
    /*
    Sanitize Title
    If the caption data is trusted, for example you are hardcoding it in, then leave this to false.
    This will free you to add html tags, such as links, in the caption.

    If the caption data is user submitted or from some other untrusted source, then set this to true
    to prevent xss and other injection attacks.
     */
    sanitizeTitle: false
  };

  Lightbox.prototype.option = function(options) {
    $.extend(this.options, options);
  };

  Lightbox.prototype.imageCountLabel = function(currentImageNum, totalImages) {
    return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
  };

  Lightbox.prototype.init = function() {
    var self = this;
    // Both enable and build methods require the body tag to be in the DOM.
    $(document).ready(function() {
      self.enable();
      self.build();
    });
  };

  // Loop through anchors and areamaps looking for either data-lightbox attributes or rel attributes
  // that contain 'lightbox'. When these are clicked, start lightbox.
  Lightbox.prototype.enable = function() {
    var self = this;
    $('body').on('click', 'a[rel^=lightbox], area[rel^=lightbox], a[data-lightbox], area[data-lightbox]', function(event) {
      self.start($(event.currentTarget));
      return false;
    });
  };

  // Build html for the lightbox and the overlay.
  // Attach event handlers to the new DOM elements. click click click
  Lightbox.prototype.build = function() {
    if ($('#lightbox').length > 0) {
        return;
    }

    var self = this;
    $('<div id="lightboxOverlay" class="lightboxOverlay"></div><div id="lightbox" class="lightbox"><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,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" /><div class="lb-nav"><a class="lb-prev" href="" ></a><a class="lb-next" href="" ></a></div><div class="lb-loader"><a class="lb-cancel"></a></div></div></div><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close"></a></div></div></div></div>').appendTo($('body'));

    // Cache jQuery objects
    this.$lightbox       = $('#lightbox');
    this.$overlay        = $('#lightboxOverlay');
    this.$outerContainer = this.$lightbox.find('.lb-outerContainer');
    this.$container      = this.$lightbox.find('.lb-container');
    this.$image          = this.$lightbox.find('.lb-image');
    this.$nav            = this.$lightbox.find('.lb-nav');

    // Store css values for future lookup
    this.containerPadding = {
      top: parseInt(this.$container.css('padding-top'), 10),
      right: parseInt(this.$container.css('padding-right'), 10),
      bottom: parseInt(this.$container.css('padding-bottom'), 10),
      left: parseInt(this.$container.css('padding-left'), 10)
    };

    this.imageBorderWidth = {
      top: parseInt(this.$image.css('border-top-width'), 10),
      right: parseInt(this.$image.css('border-right-width'), 10),
      bottom: parseInt(this.$image.css('border-bottom-width'), 10),
      left: parseInt(this.$image.css('border-left-width'), 10)
    };

    // Attach event handlers to the newly minted DOM elements
    this.$overlay.hide().on('click', function() {
      self.end();
      return false;
    });

    this.$lightbox.hide().on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox') {
        self.end();
      }
      return false;
    });

    this.$outerContainer.on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox') {
        self.end();
      }
      return false;
    });

    this.$lightbox.find('.lb-prev').on('click', function() {
      if (self.currentImageIndex === 0) {
        self.changeImage(self.album.length - 1);
      } else {
        self.changeImage(self.currentImageIndex - 1);
      }
      return false;
    });

    this.$lightbox.find('.lb-next').on('click', function() {
      if (self.currentImageIndex === self.album.length - 1) {
        self.changeImage(0);
      } else {
        self.changeImage(self.currentImageIndex + 1);
      }
      return false;
    });

    /*
      Show context menu for image on right-click

      There is a div containing the navigation that spans the entire image and lives above of it. If
      you right-click, you are right clicking this div and not the image. This prevents users from
      saving the image or using other context menu actions with the image.

      To fix this, when we detect the right mouse button is pressed down, but not yet clicked, we
      set pointer-events to none on the nav div. This is so that the upcoming right-click event on
      the next mouseup will bubble down to the image. Once the right-click/contextmenu event occurs
      we set the pointer events back to auto for the nav div so it can capture hover and left-click
      events as usual.
     */
    this.$nav.on('mousedown', function(event) {
      if (event.which === 3) {
        self.$nav.css('pointer-events', 'none');

        self.$lightbox.one('contextmenu', function() {
          setTimeout(function() {
              this.$nav.css('pointer-events', 'auto');
          }.bind(self), 0);
        });
      }
    });


    this.$lightbox.find('.lb-loader, .lb-close').on('click', function() {
      self.end();
      return false;
    });
  };

  // Show overlay and lightbox. If the image is part of a set, add siblings to album array.
  Lightbox.prototype.start = function($link) {
    var self    = this;
    var $window = $(window);

    $window.on('resize', $.proxy(this.sizeOverlay, this));

    $('select, object, embed').css({
      visibility: 'hidden'
    });

    this.sizeOverlay();

    this.album = [];
    var imageNumber = 0;

    function addToAlbum($link) {
      self.album.push({
        alt: $link.attr('data-alt'),
        link: $link.attr('href'),
        title: $link.attr('data-title') || $link.attr('title')
      });
    }

    // Support both data-lightbox attribute and rel attribute implementations
    var dataLightboxValue = $link.attr('data-lightbox');
    var $links;

    if (dataLightboxValue) {
      $links = $($link.prop('tagName') + '[data-lightbox="' + dataLightboxValue + '"]');
      for (var i = 0; i < $links.length; i = ++i) {
        addToAlbum($($links[i]));
        if ($links[i] === $link[0]) {
          imageNumber = i;
        }
      }
    } else {
      if ($link.attr('rel') === 'lightbox') {
        // If image is not part of a set
        addToAlbum($link);
      } else {
        // If image is part of a set
        $links = $($link.prop('tagName') + '[rel="' + $link.attr('rel') + '"]');
        for (var j = 0; j < $links.length; j = ++j) {
          addToAlbum($($links[j]));
          if ($links[j] === $link[0]) {
            imageNumber = j;
          }
        }
      }
    }

    // Position Lightbox
    var top  = $window.scrollTop() + this.options.positionFromTop;
    var left = $window.scrollLeft();
    this.$lightbox.css({
      top: top + 'px',
      left: left + 'px'
    }).fadeIn(this.options.fadeDuration);

    // Disable scrolling of the page while open
    if (this.options.disableScrolling) {
      $('html').addClass('lb-disable-scrolling');
    }

    this.changeImage(imageNumber);
  };

  // Hide most UI elements in preparation for the animated resizing of the lightbox.
  Lightbox.prototype.changeImage = function(imageNumber) {
    var self = this;

    this.disableKeyboardNav();
    var $image = this.$lightbox.find('.lb-image');

    this.$overlay.fadeIn(this.options.fadeDuration);

    $('.lb-loader').fadeIn('slow');
    this.$lightbox.find('.lb-image, .lb-nav, .lb-prev, .lb-next, .lb-dataContainer, .lb-numbers, .lb-caption').hide();

    this.$outerContainer.addClass('animating');

    // When image to show is preloaded, we send the width and height to sizeContainer()
    var preloader = new Image();
    preloader.onload = function() {
      var $preloader;
      var imageHeight;
      var imageWidth;
      var maxImageHeight;
      var maxImageWidth;
      var windowHeight;
      var windowWidth;

      $image.attr({
        'alt': self.album[imageNumber].alt,
        'src': self.album[imageNumber].link
      });

      $preloader = $(preloader);

      $image.width(preloader.width);
      $image.height(preloader.height);

      if (self.options.fitImagesInViewport) {
        // Fit image inside the viewport.
        // Take into account the border around the image and an additional 10px gutter on each side.

        windowWidth    = $(window).width();
        windowHeight   = $(window).height();
        maxImageWidth  = windowWidth - self.containerPadding.left - self.containerPadding.right - self.imageBorderWidth.left - self.imageBorderWidth.right - 20;
        maxImageHeight = windowHeight - self.containerPadding.top - self.containerPadding.bottom - self.imageBorderWidth.top - self.imageBorderWidth.bottom - 120;

        // Check if image size is larger then maxWidth|maxHeight in settings
        if (self.options.maxWidth && self.options.maxWidth < maxImageWidth) {
          maxImageWidth = self.options.maxWidth;
        }
        if (self.options.maxHeight && self.options.maxHeight < maxImageWidth) {
          maxImageHeight = self.options.maxHeight;
        }

        // Is the current image's width or height is greater than the maxImageWidth or maxImageHeight
        // option than we need to size down while maintaining the aspect ratio.
        if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
          if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
            imageWidth  = maxImageWidth;
            imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          } else {
            imageHeight = maxImageHeight;
            imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
            $image.width(imageWidth);
            $image.height(imageHeight);
          }
        }
      }
      self.sizeContainer($image.width(), $image.height());
    };

    preloader.src          = this.album[imageNumber].link;
    this.currentImageIndex = imageNumber;
  };

  // Stretch overlay to fit the viewport
  Lightbox.prototype.sizeOverlay = function() {
    this.$overlay
      .width($(document).width())
      .height($(document).height());
  };

  // Animate the size of the lightbox to fit the image we are showing
  Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight) {
    var self = this;

    var oldWidth  = this.$outerContainer.outerWidth();
    var oldHeight = this.$outerContainer.outerHeight();
    var newWidth  = imageWidth + this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
    var newHeight = imageHeight + this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;

    function postResize() {
      self.$lightbox.find('.lb-dataContainer').width(newWidth);
      self.$lightbox.find('.lb-prevLink').height(newHeight);
      self.$lightbox.find('.lb-nextLink').height(newHeight);
      self.showImage();
    }

    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.$outerContainer.animate({
        width: newWidth,
        height: newHeight
      }, this.options.resizeDuration, 'swing', function() {
        postResize();
      });
    } else {
      postResize();
    }
  };

  // Display the image and its details and begin preload neighboring images.
  Lightbox.prototype.showImage = function() {
    this.$lightbox.find('.lb-loader').stop(true).hide();
    this.$lightbox.find('.lb-image').fadeIn(this.options.imageFadeDuration);

    this.updateNav();
    this.updateDetails();
    this.preloadNeighboringImages();
    this.enableKeyboardNav();
  };

  // Display previous and next navigation if appropriate.
  Lightbox.prototype.updateNav = function() {
    // Check to see if the browser supports touch events. If so, we take the conservative approach
    // and assume that mouse hover events are not supported and always show prev/next navigation
    // arrows in image sets.
    var alwaysShowNav = false;
    try {
      document.createEvent('TouchEvent');
      alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
    } catch (e) {}

    this.$lightbox.find('.lb-nav').show();

    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        if (alwaysShowNav) {
          this.$lightbox.find('.lb-prev, .lb-next').css('opacity', '1');
        }
        this.$lightbox.find('.lb-prev, .lb-next').show();
      } else {
        if (this.currentImageIndex > 0) {
          this.$lightbox.find('.lb-prev').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-prev').css('opacity', '1');
          }
        }
        if (this.currentImageIndex < this.album.length - 1) {
          this.$lightbox.find('.lb-next').show();
          if (alwaysShowNav) {
            this.$lightbox.find('.lb-next').css('opacity', '1');
          }
        }
      }
    }
  };

  // Display caption, image number, and closing button.
  Lightbox.prototype.updateDetails = function() {
    var self = this;

    // Enable anchor clicks in the injected caption html.
    // Thanks Nate Wright for the fix. @https://github.com/NateWr
    if (typeof this.album[this.currentImageIndex].title !== 'undefined' &&
      this.album[this.currentImageIndex].title !== '') {
      var $caption = this.$lightbox.find('.lb-caption');
      if (this.options.sanitizeTitle) {
        $caption.text(this.album[this.currentImageIndex].title);
      } else {
        $caption.html(this.album[this.currentImageIndex].title);
      }
      $caption.fadeIn('fast')
        .find('a').on('click', function(event) {
          if ($(this).attr('target') !== undefined) {
            window.open($(this).attr('href'), $(this).attr('target'));
          } else {
            location.href = $(this).attr('href');
          }
        });
    }

    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
      this.$lightbox.find('.lb-number').text(labelText).fadeIn('fast');
    } else {
      this.$lightbox.find('.lb-number').hide();
    }

    this.$outerContainer.removeClass('animating');

    this.$lightbox.find('.lb-dataContainer').fadeIn(this.options.resizeDuration, function() {
      return self.sizeOverlay();
    });
  };

  // Preload previous and next images in set.
  Lightbox.prototype.preloadNeighboringImages = function() {
    if (this.album.length > this.currentImageIndex + 1) {
      var preloadNext = new Image();
      preloadNext.src = this.album[this.currentImageIndex + 1].link;
    }
    if (this.currentImageIndex > 0) {
      var preloadPrev = new Image();
      preloadPrev.src = this.album[this.currentImageIndex - 1].link;
    }
  };

  Lightbox.prototype.enableKeyboardNav = function() {
    $(document).on('keyup.keyboard', $.proxy(this.keyboardAction, this));
  };

  Lightbox.prototype.disableKeyboardNav = function() {
    $(document).off('.keyboard');
  };

  Lightbox.prototype.keyboardAction = function(event) {
    var KEYCODE_ESC        = 27;
    var KEYCODE_LEFTARROW  = 37;
    var KEYCODE_RIGHTARROW = 39;

    var keycode = event.keyCode;
    var key     = String.fromCharCode(keycode).toLowerCase();
    if (keycode === KEYCODE_ESC || key.match(/x|o|c/)) {
      this.end();
    } else if (key === 'p' || keycode === KEYCODE_LEFTARROW) {
      if (this.currentImageIndex !== 0) {
        this.changeImage(this.currentImageIndex - 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(this.album.length - 1);
      }
    } else if (key === 'n' || keycode === KEYCODE_RIGHTARROW) {
      if (this.currentImageIndex !== this.album.length - 1) {
        this.changeImage(this.currentImageIndex + 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(0);
      }
    }
  };

  // Closing time. :-(
  Lightbox.prototype.end = function() {
    this.disableKeyboardNav();
    $(window).off('resize', this.sizeOverlay);
    this.$lightbox.fadeOut(this.options.fadeDuration);
    this.$overlay.fadeOut(this.options.fadeDuration);
    $('select, object, embed').css({
      visibility: 'visible'
    });
    if (this.options.disableScrolling) {
      $('html').removeClass('lb-disable-scrolling');
    }
  };

  return new Lightbox();
}));

$(document).ready(function() {

  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.scrollup').fadeIn();
    }
    else {
      $('.scrollup').fadeOut();
    }
  });
})
