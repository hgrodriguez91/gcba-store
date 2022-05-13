package com.zelzet.store.webapp.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.zelzet.commons.data.type.Currency;

/**
 * This is the annotation to bind the {@link Currency}
 * 
 * @author lucianorey
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrencyParam {

  boolean storeInCookie() default true;

}
