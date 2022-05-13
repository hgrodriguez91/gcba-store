package com.zelzet.store.webapp.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import com.google.common.base.Strings;
import com.zelzet.api.gateway.common.details.TripAdvisorWidgetDTO;
import com.zelzet.api.gateway.common.listing.CanonicalPublicCodesResponse;
import com.zelzet.commons.data.type.Currency;
import com.zelzet.commons.data.type.Language;
import com.zelzet.store.core.StoreService;
import com.zelzet.store.webapp.annotation.CurrencyParam;
import com.zelzet.store.webapp.annotation.CustomerParam;
import com.zelzet.store.webapp.annotation.LanguageParam;

/**
 * @author lucianorey
 */
@Controller
@RequestMapping(value = {"/", "/{language:en|pt}"}, method = RequestMethod.GET)
public class StoreViewController {

  @Resource(name = "StoreServiceImpl")
  private StoreService storeService;


  @RequestMapping(method = RequestMethod.GET)
  public String showHome(@CustomerParam String customerCode, @LanguageParam Language language,
      @CurrencyParam Currency currency, ModelMap model) {

    Map<String, String> homeTitle = new HashMap<String, String>();
    homeTitle.put("es", "Tours en Buenos Aires, qué hacer en Buenos Aires, actividades, excursiones, tarifas, gratis | BA.tours");
    homeTitle.put("en", "Buenos Aires tours, what to do in Buenos Aires, city tours, free tours | BA.tours");
    homeTitle.put("pt", "Tours em Buenos Aires, o que fazer em Buenos Aires, atividades, passeio, excursão | BA.tours");
    Map<String, String> homeDescription = new HashMap<String, String>();
    homeDescription.put("es", "Tienda oficial de tours en Buenos Aires, actividades, excursiones y paseos. Podés reservar online tus tickets.");
    homeDescription.put("en", "Buenos Aires official store for tours, activities and excursions. You can book your tickets online.");
    homeDescription.put("pt", "Loja oficial Tours em Buenos Aires, atividades, excursões e passeios. Você pode reservar os seus bilhetes online.");

    model.addAttribute("pageTitle", homeTitle.get(language.getCode()));
    model.addAttribute("pageDescription", homeDescription.get(language.getCode()));
    return "home";
  }

  @RequestMapping(value = "/{activitiesPath:activities|actividades|atividades}", method = RequestMethod.GET)
  public ModelAndView showActivityListing(@PathVariable String activitiesPath, ModelMap model, @RequestParam(
      value = "s", required = false) String searchText, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency) {

    CanonicalPublicCodesResponse publicCodesResponse =
        (Strings.isNullOrEmpty(searchText)) ? null : this.storeService.searchCanonicalPublicCodes(searchText, language);

    if (publicCodesResponse != null
        && (!Strings.isNullOrEmpty(publicCodesResponse.getCategoryPublicCode()) || !Strings
            .isNullOrEmpty(publicCodesResponse.getLocationPublicCode()))) {
      StringBuilder sb = new StringBuilder("/");
      if (!language.equals(Language.SPANISH)) {
        sb.append(language.getCode());
        sb.append("/");
      }
      sb.append(activitiesPath);
      if (!Strings.isNullOrEmpty(publicCodesResponse.getLocationPublicCode())) {
        sb.append("/");
        sb.append(publicCodesResponse.getLocationPublicCode());
      }
      if (!Strings.isNullOrEmpty(publicCodesResponse.getCategoryPublicCode())) {
        sb.append("/");
        sb.append(publicCodesResponse.getCategoryPublicCode());
      }
      RedirectView rv = new RedirectView(sb.toString(), true);
      rv.setStatusCode(HttpStatus.TEMPORARY_REDIRECT);
      rv.setPropagateQueryParams(true);
      return new ModelAndView(rv, model);
    }
    return new ModelAndView("activity-listing", model);
  }

  @RequestMapping(value = "/{activitiesPath:activities|actividades|atividades}/{filterValue:[a-z0-9-]+}",
      method = RequestMethod.GET)
  public String showActivityListing(@PathVariable String activitiesPath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency, @PathVariable String filterValue) {
    return "activity-listing";
  }

  @RequestMapping(
      value = "/{activitiesPath:activities|actividades|atividades}/{parentLocation:[a-z0-9-]+}_{childLocation:[a-z0-9-]+}/{category:[a-z0-9-]+}",
      method = RequestMethod.GET)
  public String activitiesByChildLocationAndCategory(@PathVariable String activitiesPath,
      @CustomerParam String customerCode, @LanguageParam Language language, @CurrencyParam Currency currency,
      @PathVariable String parentLocation, @PathVariable String childLocation, @PathVariable String category) {
    return "activity-listing";
  }

  @RequestMapping(
      value = "/{activitiesPath:activities|actividades|atividades}/{parentLocation:[a-z0-9-]+}_{childLocation:[a-z0-9-]+}",
      method = RequestMethod.GET)
  public String activitiesByChildLocation(@PathVariable String activitiesPath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency, @PathVariable String parentLocation,
      @PathVariable String childLocation) {
    return "activity-listing";
  }

  @RequestMapping(
      value = "/{activitiesPath:activities|actividades|atividades}/{parentLocation:[a-z0-9-]+}/{category:[a-z0-9-]+}",
      method = RequestMethod.GET)
  public String activitiesByLocationAndCategory(@PathVariable String activitiesPath,
      @CustomerParam String customerCode, @LanguageParam Language language, @CurrencyParam Currency currency,
      @PathVariable String parentLocation, @PathVariable String category) {
    return "activity-listing";
  }

  @RequestMapping(value = "/{activityPath:activity|actividad|atividade}/{code}", method = RequestMethod.GET)
  public ModelAndView showActivityDetails(HttpServletResponse response, ModelMap model,
      @PathVariable String activityPath, @CustomerParam String customerCode, @LanguageParam Language language,
      @CurrencyParam Currency currency, @PathVariable String code) {

    if (!((language == Language.SPANISH && activityPath.equalsIgnoreCase("actividad"))
        || (language == Language.ENGLISH && activityPath.equalsIgnoreCase("activity")) || (language == Language.PORTUGUESE && activityPath
        .equalsIgnoreCase("atividade")))) {
      // we need to redirect because uri doesn't match the language and activityPath.
      String redirectPath =
          (language == Language.SPANISH) ? "actividad" : ((language == Language.ENGLISH) ? "activity" : "atividade");
      RedirectView rv =
          new RedirectView(((language == Language.SPANISH) ? "" : ("/" + language.getCode().toLowerCase())) + "/"
              + redirectPath + "/" + code, true);
      rv.setStatusCode(HttpStatus.MOVED_PERMANENTLY);
      return new ModelAndView(rv, model);
    }

    // search the canonical public code.
    String canonicalPublicCode = this.storeService.getCanonicalPublicCode(code, language);

    if (code.equals(canonicalPublicCode)) {
      // it's ok the uri.
      return new ModelAndView("activity-details");
    } else if (!Strings.isNullOrEmpty(canonicalPublicCode)) {
      RedirectView rv = new RedirectView("/" + activityPath + "/" + canonicalPublicCode, true);
      rv.setStatusCode(HttpStatus.MOVED_PERMANENTLY);
      return new ModelAndView(rv, model);
    } else {
      response.setStatus(HttpStatus.NOT_FOUND.value());
      return new ModelAndView("activity-details", model);
    }
  }

  /**
   * This is a helper method to get the tripadvisor widget of an activity.
   */
  @RequestMapping(value = "/{activityPath:activity|actividad|atividade}/{code}/tripadvisor-rating",
      method = RequestMethod.GET)
  public String showActivityTripadvisorRatingWidget(@PathVariable String activityPath, @PathVariable String code,
      ModelMap model, @LanguageParam Language language) {
    TripAdvisorWidgetDTO widget = storeService.getRatingWidget(code);
    if (widget != null && widget.getContent() != null) {
      model.addAttribute("widget", widget.getContent());
    }
    return "activity-details-tripadvisor-widget";
  }

  /**
   * This is a helper method to get the tripadvisor widget of an activity.
   */
  @RequestMapping(value = "/{activityPath:activity|actividad|atividade}/{code}/tripadvisor-thumbs-up",
      method = RequestMethod.GET)
  public String showActivityTripadvisorThumbsUpWidget(@PathVariable String activityPath, @PathVariable String code,
      ModelMap model, @LanguageParam Language language) {
    TripAdvisorWidgetDTO widget = storeService.getThumbsUpWidget(code);
    if (widget != null && widget.getContent() != null) {
      model.addAttribute("widget", widget.getContent());
    }
    return "activity-details-tripadvisor-widget";
  }

  // --- Checkout Views

  @RequestMapping(value = "/checkout/booking/{operationCode}/payment", method = RequestMethod.GET)
  public String showBookingPaymentPage(@PathVariable String operationCode, @LanguageParam Language language) {
    return "booking-payment";
  }

  @RequestMapping(value = "/checkout/booking/{operationCode}/details", method = RequestMethod.GET)
  public String showBookingDetailsPage(@CustomerParam String customerCode, @LanguageParam Language language,
      @CurrencyParam Currency currency, @PathVariable String operationCode) {
    return "booking-details";
  }

  // --- Favorite views

  @RequestMapping(value = "/{favoritesPath:favorites|favoritos}", method = RequestMethod.GET)
  public String showFavorites(@PathVariable String favoritesPath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency) {
    return "activity-listing";
  }

  // --- Profile view

  @RequestMapping(value = "/{profilePath:profile|perfil}", method = RequestMethod.GET)
  public String showProfile(@PathVariable String profilePath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency) {
    return "profile";
  }

  // --- Bookings view

  @RequestMapping(value = "/booking/{bookingCode}/cancel", method = RequestMethod.GET)
  public String showCancelBooking(@PathVariable String bookingCode) {
    return "cancel-booking";
  }

  // --- Static content views
  //review
  @RequestMapping(value = "/booking/{operationCode}/review", method = RequestMethod.GET)
  public String showReviewBooking(@PathVariable String operationCode) {
    return "booking-review";
  }

  @RequestMapping(value = "/booking/{operationCode}/review/details", method = RequestMethod.GET)
  public String showReviewDetailBooking(@PathVariable String operationCode,@LanguageParam Language language) {
    return "booking-review-details";
  }

  @RequestMapping(value = "/{faqPath:preguntas-frecuentes|faq|perguntas-frequentes}", method = RequestMethod.GET)
  public String showFAQ(@CustomerParam String customerCode, @LanguageParam Language language,
      @CurrencyParam Currency currency) {
    return "faq";
  }

  @RequestMapping(value = "/{aboutPath:about-us|acerca-de-nosotros|sobre-nos}", method = RequestMethod.GET)
  public String showAboutUs(@PathVariable String aboutPath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency) {
    return "about-us";
  }

  @RequestMapping(value = "/{howWorksPath:how-it-works|como-funciona}", method = RequestMethod.GET)
  public String showHowItWorks(@PathVariable String howWorksPath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency) {
    return "how-it-works";
  }

  @RequestMapping(value = "/{howToPublishPath:how-to-publish|como-publicar|como-publicar}", method = RequestMethod.GET)
  public String showHowToPublish(@PathVariable String howToPublishPath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency) {
    return "how-to-publish";
  }

  @RequestMapping(value = "/{termsAndConditionsPath:terms-and-conditions|terminos-y-condiciones|termos-e-condicoes}",
      method = RequestMethod.GET)
  public String showTermsAndConditions(@PathVariable String termsAndConditionsPath, @CustomerParam String customerCode,
      @LanguageParam Language language, @CurrencyParam Currency currency) {
    return "terms-and-conditions";
  }

}
