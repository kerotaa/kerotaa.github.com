(function() {
  (function($, window) {
    var $body, $htmlBody, $window, KRTNavi;

    $window = $(window);
    $body = $(document.body);
    $htmlBody = $('html,body');
    KRTNavi = (function() {
      function KRTNavi(_config) {
        var $style, $target, _checkScrollPosition, _isFixed, _returnToPagetop, _targetBottom, _targetHeight, _toggleClass, _toggleMenu;

        $target = $(_config.target);
        _targetHeight = $target.outerHeight();
        _targetBottom = _targetHeight + $target.offset().top;
        _isFixed = false;
        $style = $.parseHTML('<style>body.' + _config.className + '{margin-top:' + _targetHeight + 'px}</style>');
        $body.append($style);
        _checkScrollPosition = function() {
          return $window.scrollTop() > _targetBottom;
        };
        _toggleClass = function() {
          var check;

          check = _checkScrollPosition();
          if (!_isFixed && check) {
            $body.addClass(_config.className);
            _isFixed = true;
          } else if (_isFixed && !check) {
            $body.removeClass(_config.className).removeClass('open-site-menu');
            _isFixed = false;
          }
        };
        $window.on('scroll.krtnavi,resize.krtnavi', $.throttle(150, _toggleClass));
        _returnToPagetop = function(event) {
          event.preventDefault();
          return $htmlBody.animate({
            scrollTop: 0
          }, 300);
        };
        $(_config.returnButton, $target).on('click', _returnToPagetop);
        _toggleMenu = function(event) {
          event.preventDefault();
          return $body.toggleClass('open-site-menu');
        };
        $(_config.menuButton, $target).on('click', _toggleMenu);
      }

      return KRTNavi;

    })();
    return $(function() {
      var settings;

      settings = {
        target: '#site-header',
        menuButton: '.site-toggle-menu',
        returnButton: '.site-return',
        className: 'nav-fixed'
      };
      return new KRTNavi(settings);
    });
  })(jQuery, window);

}).call(this);
