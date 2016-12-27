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
    if (window.location.port == "8443")
        $rootScope.clientIDRed = 8443;
    else
        $rootScope.clientIDRed = 8933;
    $rootScope.loginPathRedirect = window.location.protocol + "//" + window.location.host + "/auth/myOAuth&state=" + window.location.pathname

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
            else $rootScope.state.go('index.service.general',{id:window.location.pathname.split("/")[2]});
            // alert("Невідома помилка: " + error);
        }
    });

    $rootScope.serviceNotFound = false;

    $rootScope.isCookiesAccept = function () {
        $rootScope.cookieAccept = true;
        window.localStorage.setItem("cookieAccept",true);
    }
    $rootScope.cookieAccept = false;
    if(window.localStorage.getItem("cookieAccept")){
        $rootScope.cookieAccept = true;
    }

    $rootScope.customSearchApadtive = function () {

        var search       = $('.js-search'),
            icon         = $('.js-search-icon'),
            toggleSearch = $('.js-search-container');

        //Search toggle

        $(icon).toggleClass("in");
        $(toggleSearch).slideToggle();

        $(window).resize(function(){
            $(toggleSearch).hide();

            if ($(icon).hasClass('in')){
                $(icon).removeClass('in');
                return;
            }
        });
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
        get:getCookie,
        set:setCookie,
        delete:deleteCookie
    }

});
