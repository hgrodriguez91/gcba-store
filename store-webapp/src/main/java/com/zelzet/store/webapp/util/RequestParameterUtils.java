package com.zelzet.store.webapp.util;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

/**
 * @author lucianorey
 */
public final class RequestParameterUtils {

  private RequestParameterUtils() {}

  public static String getParameter(HttpServletRequest request, String parameterName) {
    Enumeration<?> enumeration = request.getParameterNames();
    while (enumeration.hasMoreElements()) {
      if (enumeration.nextElement().toString().equalsIgnoreCase(parameterName)) {
        return request.getParameter(parameterName);
      }
    }
    return null;
  }

}
