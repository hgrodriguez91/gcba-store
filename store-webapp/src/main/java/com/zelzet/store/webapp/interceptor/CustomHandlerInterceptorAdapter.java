package com.zelzet.store.webapp.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import org.springframework.web.servlet.view.RedirectView;

import com.zelzet.store.webapp.util.ArgumentResolverUtils;

/**
 * @author lucianorey
 */
public class CustomHandlerInterceptorAdapter extends HandlerInterceptorAdapter {

  /**
   * Language attribute name that will be added into the modelmap.
   */
  private static final String LANG = "language";
  /**
   * Name to check that the request is not a redirect.
   */
  private static final String REDIRECT = "redirect";

  @Override
  public void postHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler,
      final ModelAndView modelAndView) throws Exception {
    if (modelAndView != null
        && (!(modelAndView.getView() instanceof RedirectView) && !modelAndView.getViewName().startsWith(REDIRECT))) {
      modelAndView.getModelMap().addAttribute(LANG,
          ArgumentResolverUtils.findLanguage(request, response, false, false).getCode());
    }
  }

}
