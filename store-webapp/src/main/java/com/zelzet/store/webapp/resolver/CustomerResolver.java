package com.zelzet.store.webapp.resolver;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.zelzet.api.gateway.common.customer.AnonymousResponse;
import com.zelzet.commons.data.type.Currency;
import com.zelzet.commons.data.type.Language;
import com.zelzet.store.core.StoreService;
import com.zelzet.store.webapp.annotation.CustomerParam;
import com.zelzet.store.webapp.util.ArgumentResolverUtils;
import com.zelzet.store.webapp.util.CookieUtils;

/**
 * @author lucianorey
 */
public class CustomerResolver implements HandlerMethodArgumentResolver {

  /**
   * Key for the customer's code that as a cookie.
   */
  public static final String CUSTOMER_CODE = "_customer_code";

  @Resource
  private StoreService storeService;

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.hasParameterAnnotation(CustomerParam.class);
  }

  @Override
  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

    CustomerParam annotation = parameter.getParameterAnnotation(CustomerParam.class);

    HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);

    // try to get the customer code from the cookies.
    Cookie cookie = CookieUtils.getCookie(request, CUSTOMER_CODE);
    if (cookie != null) {
      return cookie.getValue();
    }

    // get the customer values.
    Currency currency = ArgumentResolverUtils.findCurrency(webRequest, false);
    Language language = ArgumentResolverUtils.findLanguage(webRequest, false, false);

    // call to remote service to create a new customer and track him.
    AnonymousResponse anonymousResponse = this.storeService.anonymous(language, currency);

    if (annotation.storeInCookie()) {
      HttpServletResponse response = webRequest.getNativeResponse(HttpServletResponse.class);
      // add new cookie with the customer code.
      Cookie customerCodeCookie = CookieUtils.createCookie(request, CUSTOMER_CODE, anonymousResponse.getCustomerCode());
      response.addCookie(customerCodeCookie);
    }

    return anonymousResponse.getCustomerCode();
  }

}
