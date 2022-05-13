package com.zelzet.store.webapp.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.context.request.NativeWebRequest;

import com.google.common.base.Strings;
import com.zelzet.commons.data.type.Currency;
import com.zelzet.commons.data.type.Language;

/**
 * @author lucianorey
 */
public final class ArgumentResolverUtils {

  /**
   * Key for the language cookie or request param.
   */
  public static final String LANGUAGE = "language";
  /**
   * Key for the currency cookie or request param.
   */
  public static final String CURRENCY = "currency";

  /**
   * This is the default language when a new customer has not set one.
   */
  private static final Language DEFAULT_LANGUAGE = Language.SPANISH;
  /**
   * This is the default currency when a new customer has not set one.
   */
  private static final Currency DEFAULT_CURRENCY = Currency.ARS;

  private ArgumentResolverUtils() {}

  public static Currency findCurrency(NativeWebRequest webRequest, boolean storeInCookie) {
    HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
    HttpServletResponse response = webRequest.getNativeResponse(HttpServletResponse.class);

    Currency currency = null;

    // first, we need to get the currency value from the request params.
    String paramValue = RequestParameterUtils.getParameter(request, CURRENCY);
    if (!Strings.isNullOrEmpty(paramValue)) {
      currency = ArgumentResolverUtils.findCurrency(paramValue);
    }

    // second attempt, we try to get the currency from the cookies.
    if (currency == null) {
      Cookie cookie = CookieUtils.getCookie(request, CURRENCY);
      if (cookie != null) {
        return ArgumentResolverUtils.findCurrency(cookie.getValue());
      }
    }

    if (currency == null) {
      currency = DEFAULT_CURRENCY;
    }

    if (storeInCookie) {
      // add cookie in the response.
      response.addCookie(CookieUtils.createCookie(request, CURRENCY, currency.name()));
    }

    return currency;
  }

  public static Language findLanguage(NativeWebRequest webRequest, boolean useFallbackMethods, boolean storeInCookie) {
    HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
    HttpServletResponse response = webRequest.getNativeResponse(HttpServletResponse.class);
    return ArgumentResolverUtils.findLanguage(request, response, useFallbackMethods, storeInCookie);
  }

  public static Language findLanguage(HttpServletRequest request, HttpServletResponse response,
      boolean useFallbackMethods, boolean storeInCookie) {

    Language language = null;

    // try to get the language from the uri. This is the main option to define the current language of the customer.
    String value = PathVariableUtils.getValue(request, LANGUAGE);
    if (!Strings.isNullOrEmpty(value)) {
      language = ArgumentResolverUtils.findLanguage(value);
    } else {
      if (!useFallbackMethods) {
        language = DEFAULT_LANGUAGE;
      }
    }

    if (useFallbackMethods && language == null) {
      // try to get the language from the request params.
      String paramValue = RequestParameterUtils.getParameter(request, LANGUAGE);
      if (!Strings.isNullOrEmpty(paramValue)) {
        language = ArgumentResolverUtils.findLanguage(paramValue);
      }
    }

    if (useFallbackMethods && language == null) {
      // try to get the language from the cookies.
      Cookie cookie = CookieUtils.getCookie(request, LANGUAGE);
      if (cookie != null) {
        return ArgumentResolverUtils.findLanguage(cookie.getValue());
      }
    }

    if (useFallbackMethods && language == null) {
      language = DEFAULT_LANGUAGE;
    }

    if (storeInCookie) {
      // add cookie in the response.
      response.addCookie(CookieUtils.createCookie(request, LANGUAGE, language.getCode()));
    }

    return language;
  }

  // --- Private implementation

  private static Language findLanguage(String value) {
    for (Language language : Language.values()) {
      if (language.getCode().equals(value) || language.name().equals(value)) {
        return language;
      }
    }
    return null;
  }

  private static Currency findCurrency(String value) {
    for (Currency currency : Currency.values()) {
      if (currency.getCode().equals(value) || currency.name().equals(value)) {
        return currency;
      }
    }
    return null;
  }

}
