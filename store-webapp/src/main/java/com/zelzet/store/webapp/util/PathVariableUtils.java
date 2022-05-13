package com.zelzet.store.webapp.util;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.HandlerMapping;

/**
 * @author lucianorey
 */
public final class PathVariableUtils {

  private PathVariableUtils() {}

  @SuppressWarnings("unchecked")
  public static String getValue(HttpServletRequest request, String name) {
    Map<String, String> map =
        (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
    if (map == null || !map.containsKey(name)) {
      return null;
    }
    return map.get(name);
  }

}
