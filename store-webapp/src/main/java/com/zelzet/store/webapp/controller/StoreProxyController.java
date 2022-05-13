package com.zelzet.store.webapp.controller;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

import com.zelzet.api.gateway.common.booking.BookingCancelInfoDTO;
import com.zelzet.api.gateway.common.booking.RateCancelRequest;
import com.zelzet.api.gateway.common.details.ActivityBaTourPaginateDTO;
import com.zelzet.api.gateway.common.details.ActivityRatingPaginateDTO;
import com.zelzet.api.gateway.common.question.ActivityQuestionDTO;
import com.zelzet.api.gateway.common.question.ActivityQuestionResponse;
import com.zelzet.api.gateway.common.review.ActivityReviewCreateResponse;
import com.zelzet.api.gateway.common.review.ActivityReviewDTO;
import com.zelzet.api.gateway.common.review.ReviewDTO;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.zelzet.api.gateway.api.APIGatewayService;
import com.zelzet.api.gateway.common.booking.BookingDTO;
import com.zelzet.api.gateway.common.checkout.BookingDetailsResponse;
import com.zelzet.api.gateway.common.checkout.BookingOperationRequest;
import com.zelzet.api.gateway.common.checkout.BookingOperationResponse;
import com.zelzet.api.gateway.common.checkout.BookingQuoteResponse;
import com.zelzet.api.gateway.common.checkout.CheckAvailabilityRequest;
import com.zelzet.api.gateway.common.checkout.CheckAvailabilityResponse;
import com.zelzet.api.gateway.common.checkout.CheckCapacityRequest;
import com.zelzet.api.gateway.common.checkout.CheckCapacityResponse;
import com.zelzet.api.gateway.common.customer.AnonymousResponse;
import com.zelzet.api.gateway.common.customer.CustomerProfileDTO;
import com.zelzet.api.gateway.common.customer.CustomerProfileResponse;
import com.zelzet.api.gateway.common.details.ActivityDetailsResponse;
import com.zelzet.api.gateway.common.details.TripAdvisorWidgetDTO;
import com.zelzet.api.gateway.common.home.HomeResponse;
import com.zelzet.api.gateway.common.listing.CanonicalPublicCodesResponse;
import com.zelzet.api.gateway.common.listing.activity.ActivitiesResponse;
import com.zelzet.api.gateway.common.listing.favorites.FavoritesResponse;
import com.zelzet.commons.data.dto.LocationDTO;
import com.zelzet.commons.data.type.Currency;
import com.zelzet.commons.data.type.Language;
import com.zelzet.commons.web.mvc.controller.AbstractRestController;
import com.zelzet.store.core.StoreService;
import com.zelzet.store.webapp.annotation.CurrencyParam;
import com.zelzet.store.webapp.annotation.CustomerParam;
import com.zelzet.store.webapp.annotation.LanguageParam;

/**
 * @author lucianorey
 */
@RestController
@RequestMapping(value = "/data", produces = APPLICATION_JSON_VALUE)
public class StoreProxyController extends AbstractRestController implements APIGatewayService {

  @Resource(name = "StoreServiceImpl")
  private StoreService storeService;

  @RequestMapping(value = "/home", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public HomeResponse getHome(@CustomerParam(storeInCookie = false) String customerCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language,
      @CurrencyParam(storeInCookie = false) Currency currency,
      @RequestParam(required = false) Integer collectionImgWidth,
      @RequestParam(required = false) Integer collectionImgHeight,
      @RequestParam(required = false) Integer imgWidth,
      @RequestParam(required = false) Integer imgHeight,
      @RequestParam(required = false) Integer imgWidthPopular,
      @RequestParam(required = false) Integer imgHeightPopular,
      @RequestParam(required = false) Integer imgCount) {
    return this.storeService
        .getHome(customerCode, language, currency, collectionImgWidth, collectionImgHeight, imgWidth, imgHeight,
            imgWidthPopular, imgHeightPopular, null);
  }

  @RequestMapping(value = "/activities", method = RequestMethod.GET)
  @Override
  public ActivitiesResponse getActivities(@CustomerParam(storeInCookie = false) String customerCode,
      @RequestParam(required = false) String text,
      @RequestParam(value = "organizationCode", required = false) String organizationCode,
      @RequestParam(required = false) String category, @RequestParam(required = false) String location,
      @RequestParam(required = false) String fromPrice, @RequestParam(required = false) String toPrice,
      @RequestParam(required = false) String collectionCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language,
      @CurrencyParam(storeInCookie = false) Currency currency, @RequestParam(required = false) Integer imgWidth,
      @RequestParam(required = false) Integer imgHeight, @RequestParam(required = false) Integer headerImgWidth,
      @RequestParam(required = false) Integer headerImgHeight, @RequestParam(required = false) int pageSize,
      @RequestParam(required = false) int pageIndex) {
    return this.storeService.getActivities(customerCode, text, organizationCode, category, location, fromPrice, toPrice,
        collectionCode, language, currency, imgWidth, imgHeight, headerImgWidth, headerImgHeight, pageSize, pageIndex);
  }

  @RequestMapping(value = "/activities/{activityCode}", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public ActivityDetailsResponse getActivity(@PathVariable String activityCode,
      @CustomerParam(storeInCookie = false) String customerCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language,
      @CurrencyParam(storeInCookie = false) Currency currency,
      @RequestParam(required = false) Integer imgWidth,
      @RequestParam(required = false) Integer imgHeight,
      @RequestParam(required = false) Integer imgWidthProvider,
      @RequestParam(required = false) Integer imgHeightProvider) {
    return this.storeService
        .getActivity(activityCode, customerCode, language, currency, imgWidth, imgHeight, imgWidthProvider,
            imgHeightProvider);
  }

  @Override
  public String getCanonicalPublicCode(String publicCode, Language language) {
    throw new UnsupportedOperationException("The method is unsupported.");
  }

  @Override
  public CanonicalPublicCodesResponse searchCanonicalPublicCodes(String text, Language language) {
    throw new UnsupportedOperationException("The method is unsupported.");
  }

  @RequestMapping(value = "/activities/{activityCode}/favorite/{value}", method = RequestMethod.POST)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public void favorite(@CustomerParam(storeInCookie = false) String customerCode, @PathVariable String activityCode,
      @PathVariable boolean value) {
    this.storeService.favorite(customerCode, activityCode, value);
  }

  @RequestMapping(value = "/activities/favorites", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public FavoritesResponse getFavorites(@CustomerParam(storeInCookie = false) String customerCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language,
      @CurrencyParam(storeInCookie = false) Currency currency, @RequestParam(required = false) Integer imgWidth,
      @RequestParam(required = false) Integer imgHeight) {
    return this.storeService.getFavorites(customerCode, language, currency, imgWidth, imgHeight);
  }

  @RequestMapping(value = "/activities/question", method = POST, consumes = APPLICATION_JSON_VALUE)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public ActivityQuestionResponse createActivityQuestion(@RequestBody ActivityQuestionDTO request) {
    return this.storeService.createActivityQuestion(request);
  }
  // --- checkout

  @Override
  @RequestMapping(value = "/checkout/check-capacity", method = POST, consumes = APPLICATION_JSON_VALUE)
  @ResponseStatus(value = HttpStatus.OK)
  public CheckCapacityResponse checkTimesAndCapacity(@CustomerParam(storeInCookie = false) String customerCode,
      @RequestBody CheckCapacityRequest request) {
    return this.storeService.checkTimesAndCapacity(customerCode, request);
  };

  @RequestMapping(value = "/checkout/check-availability", method = POST, consumes = APPLICATION_JSON_VALUE)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public CheckAvailabilityResponse check(@CustomerParam(storeInCookie = false) String customerCode,
      @RequestBody CheckAvailabilityRequest request) {
    return this.storeService.check(customerCode, request);
  }

  @RequestMapping(value = "/checkout/{operationCode}/quote", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public BookingQuoteResponse getBookingQuote(@CustomerParam(storeInCookie = false) String customerCode,
      @PathVariable String operationCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language,
      @CurrencyParam(storeInCookie = false) Currency currency, @RequestParam(required = false) Integer imgWidth,
      @RequestParam(required = false) Integer imgHeight) {
    return this.storeService.getBookingQuote(customerCode, operationCode, language, currency, imgWidth, imgHeight);
  }

  @RequestMapping(value = "/checkout/states/{country}/", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public List<LocationDTO> getStates(@PathVariable String country,
      @LanguageParam(useFallbackMethods = true) Language language) {
    return this.storeService.getStates(country, language);
  }

  @RequestMapping(value = "/checkout/{operationCode}/booking", method = POST, consumes = APPLICATION_JSON_VALUE)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public BookingOperationResponse book(@CustomerParam(storeInCookie = false) String customerCode,
      @PathVariable String operationCode, @RequestBody BookingOperationRequest request,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language) {
    return this.storeService.book(customerCode, operationCode, request, language);
  }

  @RequestMapping(value = "/checkout/{operationCode}/booking", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public BookingDetailsResponse getBookingDetails(@CustomerParam(storeInCookie = false) String customerCode,
      @PathVariable String operationCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language,
      @CurrencyParam(storeInCookie = false) Currency currency, @RequestParam(required = false) Integer imgWidth,
      @RequestParam(required = false) Integer imgHeight) {
    return this.storeService.getBookingDetails(customerCode, operationCode, language, currency, imgWidth, imgHeight);
  }

  // --- Customer

  @RequestMapping(value = "/profile", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public CustomerProfileResponse getProfile(@CustomerParam(storeInCookie = false) String customerCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language) {
    return this.storeService.getProfile(customerCode, language);
  }

  @RequestMapping(value = "/profile", method = PUT)
  @Override
  public void updateProfile(@CustomerParam(storeInCookie = false) String customerCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language,
      @RequestBody CustomerProfileDTO customerProfileDTO) {
    this.storeService.updateProfile(customerCode, language, customerProfileDTO);
  }

  // --- Bookings

  @RequestMapping(value = "/bookings/{bookingCode}/cancel", method = PUT)
  @Override
  public BookingDTO cancel(@PathVariable String bookingCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language) {
    return this.storeService.cancel(bookingCode, language);
  }

  @RequestMapping(value = "/bookings/{operationCode}/review", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public ReviewDTO validateReview(@PathVariable String operationCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language) {
    return this.storeService.validateReview(operationCode, language);
  }

  @RequestMapping(value = "/bookings/review", method = POST, consumes = APPLICATION_JSON_VALUE)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public ActivityReviewCreateResponse createActivityReview(@RequestBody ActivityReviewDTO request) {
    return this.storeService.createActivityReview(request);
  }

  @RequestMapping(value = "/bookings/{bookingCode}/cancel", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public BookingCancelInfoDTO getBookingCancelInfo(@PathVariable String bookingCode,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false)Language language) {
    return this.storeService.getBookingCancelInfo(bookingCode, language);
  }

  @RequestMapping(value = "/bookings/{bookingCode}/cancel", method = RequestMethod.POST, consumes = APPLICATION_JSON_VALUE)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public BookingDTO cancel(@PathVariable String bookingCode, @RequestBody RateCancelRequest request,
      @LanguageParam(useFallbackMethods = true, storeInCookie = false) Language language) {
    return this.storeService.cancel(bookingCode, request, language);
  }

  // --- Unsupported

  @Override
  public AnonymousResponse anonymous(Language language, Currency currency) {
    throw new UnsupportedOperationException();
  }

  @Override
  public TripAdvisorWidgetDTO getRatingWidget(String activityCode) {
    throw new UnsupportedOperationException();
  }

  @Override
  public TripAdvisorWidgetDTO getThumbsUpWidget(String activityCode) {
    throw new UnsupportedOperationException();
  }

  @Override
  public ActivityBaTourPaginateDTO getActivityBaTours(int pageSize, int pageIndex) {
    throw new UnsupportedOperationException();
  }

  @RequestMapping(value = "/activities/rating", method = GET)
  @ResponseStatus(value = HttpStatus.OK)
  @Override
  public ActivityRatingPaginateDTO getActivityRating(@RequestParam(value = "activity_code") String activityCode,
      @RequestParam(value = "page_size") int pageSize, @RequestParam(value = "page_index") int pageIndex) {
    return this.storeService.getActivityRating(activityCode, pageSize, pageIndex);
  }

  @Override
  public BookingDTO confirm(String boookingCode, Language language) {
    throw new UnsupportedOperationException();
  }

  @Override
  public BookingDTO invalidate(String bookingCode, Language language) {
    throw new UnsupportedOperationException();
  }

}
