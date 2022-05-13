package com.zelzet.store.webapp.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.zelzet.store.webapp.annotation.LanguageParam;
import com.zelzet.store.webapp.util.ArgumentResolverUtils;

/**
 * @author lucianorey
 */
public class LanguageResolver implements HandlerMethodArgumentResolver {

  @Override
  public boolean supportsParameter(MethodParameter parameter) {
    return parameter.hasParameterAnnotation(LanguageParam.class);
  }

  @Override
  public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
      NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
    LanguageParam annotation = parameter.getParameterAnnotation(LanguageParam.class);
    return ArgumentResolverUtils.findLanguage(webRequest, annotation.useFallbackMethods(), annotation.storeInCookie());
  }

}
