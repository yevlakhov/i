'use strict';

angular.module('appBoilerPlate', ['ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui.scroll',
  'ngMessages',
  'ui.uploader',
  'ui.event',
  'ui.select',
  'angularMoment',
  'ngClipboard',
  'ngJsonEditor',
  'dialogs.main',
  'pascalprecht.translate',
  'dialogs.default-translations',
  'textAngular',
  'iGovMarkers',
  'autocompleteService',
  'datepickerService',
  'iGovTable']);

angular.module('documents', ['appBoilerPlate']);
angular.module('auth', ['appBoilerPlate']);
angular.module('journal', ['appBoilerPlate']);
angular.module('order', ['appBoilerPlate']);
angular.module('about', ['appBoilerPlate']);
angular.module('feedback', ['appBoilerPlate']);

angular.module('app', [
  'documents',
  'auth',
  'journal',
  'order',
  'about',
  'feedback',
  '404',
]).config(function ($urlRouterProvider, $locationProvider, datepickerConfig, datepickerPopupConfig) {
  // $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  datepickerConfig.datepickerMode = 'year';
  datepickerConfig.formatMonthTitle = 'yyyy';
  datepickerConfig.formatYearTitle = 'Рік';
  datepickerConfig.formatDayTitle = 'MMM yyyy';
  datepickerConfig.formatDay = 'd';
  datepickerConfig.formatMonth = 'MMM';
  datepickerConfig.startingDay = 1;
  datepickerPopupConfig.clearText = 'Очистити';
}).run(function ($rootScope, $state, statesRepository, $location) {
  $rootScope.state = $state;
  window.state = $state;
  $rootScope.profile = {
    isKyivCity: !!statesRepository.isKyivCity()
  };
  if (window.location.hostname.search('localhost') != -1) {
    $rootScope.clientIDRed = 8443;
    $rootScope.myAuthServer = 'id.kitsoft.kiev.ua';
  } else if (window.location.hostname.search('central.es') != -1) {
    $rootScope.clientIDRed = 8933;
    $rootScope.myAuthServer = 'id.kyivcity.gov.ua';
  } else if (window.location.hostname.search('test3.es') != -1) {
    $rootScope.clientIDRed = 8922;
    $rootScope.myAuthServer = 'id.kyivcity.gov.ua';
  } else if (window.location.hostname == "poslugy.kyivcity.gov.ua") {
    $rootScope.clientIDRed = 8911;
    $rootScope.myAuthServer = 'id.kyivcity.gov.ua';
    // $rootScope.myAuthServer = 'id.kitsoft.kiev.ua';
  } else {
    $rootScope.clientIDRed = 8433;
    $rootScope.myAuthServer = 'id.kitsoft.kiev.ua';
  }
  $rootScope.loginPathRedirect = window.location.protocol + "//" + window.location.host + "/auth/myOAuth&state=" + window.location.pathname
  $rootScope.share = function (type) {
    var myLink;
    switch (type){
      case 'facebook':
        myLink = 'http://www.facebook.com/share.php?u='+encodeURIComponent(window.location.href);break;
      case 'twitter':
        myLink = 'http://twitter.com/home?status='+encodeURIComponent(window.location.href);break;
      case 'link':
        myLink = 'https://www.linkedin.com/shareArticle?mini=true&url='+encodeURIComponent(window.location.href)+'&title=&summary=&source=';break;
      case 'google':
        myLink = 'https://plus.google.com/share?url='+encodeURIComponent(window.location.href);break;
    }
    window.open(myLink, "connectWindow", "width=800,height=600,scrollbars=yes");
  }
  $rootScope.isLowVision = false;
  if(window.localStorage.getItem('lowvision')){
    $rootScope.isLowVision = true;
  }
  $rootScope.LowVision = function () {
    if(window.localStorage.getItem('lowvision')){
      window.localStorage.removeItem('lowvision');
      $rootScope.isLowVision = false;
    }else{
      window.localStorage.setItem('lowvision',1);
      $rootScope.isLowVision = true;
    }
  }
  $rootScope.currentYear = new Date().getFullYear();
  $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams, error) {
    $rootScope.loginPathRedirect = window.location.protocol + "//" + window.location.host + "/auth/myOAuth&state=" + $location.$$path
  });
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    if (error && error.data) {
      console.error('stateChangeError', error);
      $rootScope.state.go('404');
      // alert("Невідома помилка: " + ertor.data);
    } else {
      console.error('stateChangeError', error);
      if (error != 'Пользователь не авторизован')$rootScope.state.go('404');
      else $rootScope.state.go('index.service.general', {id: window.location.pathname.split("/")[2]});
      // alert("Невідома помилка: " + error);
    }
  });

  $rootScope.serviceNotFound = false;

  $rootScope.isCookiesAccept = function () {
    $rootScope.cookieAccept = true;
    window.localStorage.setItem("cookieAccept", true);
  }
  $rootScope.cookieAccept = false;
  if (window.localStorage.getItem("cookieAccept")) {
    $rootScope.cookieAccept = true;
  }

  $rootScope.customSearchApadtive = function () {

    var search = $('.js-search'),
      icon = $('.js-search-icon'),
      toggleSearch = $('.js-search-container');

    //Search toggle

    $(icon).toggleClass("in");
    $(toggleSearch).slideToggle();

    /*$(window).resize(function () {
      $(toggleSearch).hide();

      if ($(icon).hasClass('in')) {
        $(icon).removeClass('in');
        return;
      }
    });*/
  };

  $(document).on('click', 'a.js-service-about-btn', function () {

    $('div.js-service-about-container').slideToggle();

  });

  //fix breadcrumbs

  $(window).scroll(function () {

    var wScroll = $(this).scrollTop(),
      newsCrumb = $('.js-news-crumb'),
      socialShare = $('.js-social-share');

    if (wScroll > 145) {
      $(newsCrumb).addClass('fix-crumb');
      $(newsCrumb).next().css('marginTop', '71px');
    } else {
      $(newsCrumb).removeClass('fix-crumb');
      $(newsCrumb).next().css('marginTop', '0');
    }

  });

  // Scroll to top

  $(document).ready(function () {

    //Check to see if the window is top if not then display button

    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('.scrollToTop').fadeIn();
      } else {
        $('.scrollToTop').fadeOut();
      }
    });

    //Click event to scroll to top

    $('.scrollToTop').click(function () {
      $('html, body').animate({scrollTop: 0}, 800);
      return false;
    });

  });


  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }


  function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
      var d = new Date();
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
      options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }
    document.cookie = updatedCookie;
  }

  function deleteCookie(name, value) {
    setCookie(name, value, {
      expires: -1,
      path: "/"
    });
  }

  window.cookiesFunc = {
    get: getCookie,
    set: setCookie,
    delete: deleteCookie
  }
  jQuery.fn.liTextLength = function (options) {
    // настройки по умолчанию
    var o = jQuery.extend({
      length: 150,                                    //Видимое кол-во символов
      afterLength: '...',                                //Текст после видимого содержания
      fullText: true,                                    //Добавить ссылку для отображения скрытого текста
      moreText: '<br>полный&nbsp;текст',                //Текст ссылки до показа скрытого содержания
      lessText: '<br>скрыть&nbsp;полный&nbsp;текст'    //Текст ссылки после показа скрытого содержания
    }, options);
    return this.each(function () {
      var
        $el = $(this),
        elText = $.trim($el.text()),
        elLength = elText.length;
      if (elLength > o.length) {
        var
          textSlice = $.trim(elText.substr(0, o.length)),
          textSliced = $.trim(elText.substr(o.length));
        if (textSlice.length < o.length) {
          var
            textVisible = textSlice,
            textHidden = $.trim(elText.substr(o.length));
        } else {
          var
            arrSlice = textSlice.split(' '),
            popped = arrSlice.pop(),
            textVisible = arrSlice.join(' ') + ' ',
            textHidden = popped + textSliced + ' ';
        }
        var
          $elTextHidden = $('<span>').addClass('elTextHidden').html(textHidden),
          $afterLength = $('<span>').addClass('afterLength').html(o.afterLength + ' '),
          $more = $('<span>').addClass('more').html(o.moreText);
        $el.text(textVisible).append($afterLength).append($elTextHidden);
        var displayStyle = $elTextHidden.css('display');
        $elTextHidden.hide();
        if (o.fullText) {
          $el.append($more);
          $more.click(function () {
            if ($elTextHidden.is(':hidden')) {
              $elTextHidden.css({display: displayStyle});
              $more.html(o.lessText);
              $afterLength.hide();
            } else {
              $elTextHidden.hide();
              $more.html(o.moreText);
              $afterLength.show();
            }
            return false;
          });
        } else {
          $elTextHidden.remove();
        }
      }
    });
  }
});
