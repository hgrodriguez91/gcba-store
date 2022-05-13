package com.zelzet.store.webapp.util;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import com.google.common.base.Strings;

/**
 * @author lucianorey
 */
public class CookieUtils {

  /**
   * This is the cookie's path.
   */
  private static final String COOKIE_PATH = "/";
  /**
   * Maximum age that is set to the cookies.
   */
  private static final int MAX_AGE_DEFAULT = 31536000;

  /**
   * @param request {@link HttpServletRequest}
   * @param name
   * @param value
   * 
   * @return {@link Cookie}
   */
  public static Cookie createCookie(HttpServletRequest request, String name, String value) {
    return createCookie(request, name, value, MAX_AGE_DEFAULT);
  }

  /**
   * @param request {@link HttpServletRequest}
   * @param name
   * @param value
   * @param maxAge
   * 
   * @return {@link Cookie}
   */
  public static Cookie createCookie(HttpServletRequest request, String name, String value, int maxAge) {
    Cookie cookie = new Cookie(name, value);
    String domain = !Strings.isNullOrEmpty(request.getHeader("Host")) ? request.getHeader("Host") : "";
    cookie.setDomain(domain.contains(":") ? domain.substring(0, domain.indexOf(":")) : domain);
    cookie.setPath(COOKIE_PATH);
    cookie.setMaxAge(maxAge);
    return cookie;
  }

  /**
   * @param request {@link HttpServletRequest}
   * @param cookieName to find the cookie
   * 
   * @return {@link Cookie} or null
   */
  public static Cookie getCookie(HttpServletRequest request, String cookieName) {
    if (request == null || request.getCookies() == null) {
      return null;
    }

    for (Cookie cookie : request.getCookies()) {
      if (cookie.getName().equalsIgnoreCase(cookieName)) {
        return cookie;
      }
    }

    return null;
  }

}
