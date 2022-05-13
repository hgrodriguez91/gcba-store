package com.zelzet.store.webapp.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.zelzet.store.webapp.annotation.CurrencyParam;
import com.zelzet.store.webapp.util.ArgumentResolverUtils;

/**
 * @author lucianorey
 */
public class CurrencyResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.hasParameterAnnotation(CurrencyParam.class);
  }

  @Override
  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
    CurrencyParam annotation = parameter.getParameterAnnotation(CurrencyParam.class);
    return ArgumentResolverUtils.findCurrency(webRequest, annotation.storeInCookie());
  }

}
