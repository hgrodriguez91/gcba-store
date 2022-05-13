package com.zelzet.store.webapp.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.zelzet.commons.data.type.Language;

/**
 * This is the annotation to bind the {@link Language}
 * 
 * @author lucianorey
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface LanguageParam {

  boolean useFallbackMethods() default false;

  boolean storeInCookie() default true;

}
