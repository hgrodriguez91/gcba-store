package com.zelzet.store.core;

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

import org.springframework.stereotype.Service;

import com.google.common.collect.ImmutableMap;
import com.zelzet.api.gateway.client.APIGatewayServiceClientImpl;
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
import com.zelzet.store.core.util.ActivitiesURL;

/**
 * @author lucianorey
 */
@Service(value = "StoreServiceImpl")
public class StoreServiceImpl implements StoreService {

  @Resource
  private APIGatewayServiceClientImpl apiGatewayService;

  @Override
  public HomeResponse getHome(String customerCode, Language language, Currency currency, Integer collectionImgWidth,
      Integer collectionImgHeight, Integer imgWidth, Integer imgHeight, Integer imgWidthPopular,
      Integer imgHeightPopular, Integer imgCount) {
    // call to remote api service.
    HomeResponse response = this.apiGatewayService
        .getHome(customerCode, language, currency, collectionImgWidth, collectionImgHeight, imgWidth, imgHeight,
            imgWidthPopular, imgHeightPopular, imgCount);
    // paths
    response.setRelativePaths(ImmutableMap.<Language, String>builder().put(Language.SPANISH, "/")
        .put(Language.ENGLISH, "/en").put(Language.PORTUGUESE, "/pt").build());

    return response;
  }

  @Override
  public ActivityDetailsResponse getActivity(String activityCode, String customerCode, Language language,
      Currency currency, Integer width, Integer height, Integer widthProvider, Integer heightProvider) {
    // call to remote api service
    ActivityDetailsResponse response = this.apiGatewayService
        .getActivity(activityCode, customerCode, language, currency, width, height, widthProvider, heightProvider);

    String spanishPublicCode = response.getActivity().getPublicCodes().get(Language.SPANISH);
    String englishPublicCode = spanishPublicCode;
    String portuguesePublicCode = spanishPublicCode;

    if (response.getActivity().getPublicCodes().containsKey(Language.ENGLISH)) {
      englishPublicCode = response.getActivity().getPublicCodes().get(Language.ENGLISH);
    }

    if (response.getActivity().getPublicCodes().containsKey(Language.PORTUGUESE)) {
      portuguesePublicCode = response.getActivity().getPublicCodes().get(Language.PORTUGUESE);
    }

    // paths
    response.setRelativePaths(
        ImmutableMap.<Language, String>builder().put(Language.SPANISH, "/actividad/" + spanishPublicCode)
            .put(Language.ENGLISH, "/en/activity/" + englishPublicCode)
            .put(Language.PORTUGUESE, "/pt/atividade/" + portuguesePublicCode).build());

    return response;
  }

  @Override
  public String getCanonicalPublicCode(String publicCode, Language language) {
    return this.apiGatewayService.getCanonicalPublicCode(publicCode, language);
  }

  @Override
  public CanonicalPublicCodesResponse searchCanonicalPublicCodes(String text, Language language) {
    return this.apiGatewayService.searchCanonicalPublicCodes(text, language);
  }

  @Override
  public CheckCapacityResponse checkTimesAndCapacity(String customerCode, CheckCapacityRequest request) {
    return this.apiGatewayService.checkTimesAndCapacity(customerCode, request);
  }

  @Override
  public CheckAvailabilityResponse check(String customerCode, CheckAvailabilityRequest request) {
    return this.apiGatewayService.check(customerCode, request);
  }

  @Override
  public BookingQuoteResponse getBookingQuote(String customerCode, String operationCode, Language language,
      Currency currency, Integer width, Integer height) {
    // call to the remote api service.
    BookingQuoteResponse response =
        this.apiGatewayService.getBookingQuote(customerCode, operationCode, language, currency, width, height);
    // paths
    response.setRelativePaths(ImmutableMap.<Language, String>builder()
        .put(Language.SPANISH, "/checkout/booking/" + operationCode + "/payment")
        .put(Language.ENGLISH, "/en/checkout/booking/" + operationCode + "/payment")
        .put(Language.PORTUGUESE, "/pt/checkout/booking/" + operationCode + "/payment").build());
    return response;
  }

  @Override
  public List<LocationDTO> getStates(String country, Language language) {
    return this.apiGatewayService.getStates(country, language);
  }

  @Override
  public BookingOperationResponse book(String customerCode, String operationCode, BookingOperationRequest request,
      Language language) {
    return this.apiGatewayService.book(customerCode, operationCode, request, language);
  }

  @Override
  public BookingDetailsResponse getBookingDetails(String customerCode, String operationCode, Language language,
      Currency currency, Integer width, Integer height) {
    // call to the remote api service
    BookingDetailsResponse response =
        this.apiGatewayService.getBookingDetails(customerCode, operationCode, language, currency, width, height);
    // paths
    response.setRelativePaths(ImmutableMap.<Language, String>builder()
        .put(Language.SPANISH, "/checkout/booking/" + operationCode + "/details")
        .put(Language.ENGLISH, "/en/checkout/booking/" + operationCode + "/details")
        .put(Language.PORTUGUESE, "/pt/checkout/booking/" + operationCode + "/details").build());
    return response;
  }

  @Override
  public AnonymousResponse anonymous(Language language, Currency currency) {
    return this.apiGatewayService.anonymous(language, currency);
  }

  @Override
  public ActivitiesResponse getActivities(String customerCode, String text, String organizationCode, String category,
      String location, String fromPrice, String toPrice, String collectionCode, Language language, Currency currency,
      Integer width, Integer height, Integer headerImgWidth, Integer headerImgHeight, int pageSize, int pageIndex) {

    // call to the remote service
    ActivitiesResponse response = this.apiGatewayService.getActivities(customerCode, text, organizationCode, category,
        location, fromPrice, toPrice, collectionCode, language, currency, width, height, headerImgWidth,
        headerImgHeight, pageSize, pageIndex);

    // paths
    response
        .setRelativePaths(
            ImmutableMap.<Language, String>builder()
                .put(Language.SPANISH,
                    "/actividades" + ActivitiesURL.listing(Language.SPANISH, response, location, category,
                        collectionCode, text, fromPrice, toPrice, pageSize, pageIndex))
                .put(Language.ENGLISH,
                    "/en/activities" + ActivitiesURL.listing(Language.ENGLISH, response, location, category,
                        collectionCode, text, fromPrice, toPrice, pageSize, pageIndex))
                .put(Language.PORTUGUESE, "/pt/atividades" + ActivitiesURL.listing(Language.PORTUGUESE, response,
                    location, category, collectionCode, text, fromPrice, toPrice, pageSize, pageIndex))
                .build());
    return response;
  }

  @Override
  public void favorite(String customerCode, String activityCode, boolean value) {
    this.apiGatewayService.favorite(customerCode, activityCode, value);
  }

  @Override
  public FavoritesResponse getFavorites(String customerCode, Language language, Currency currency, Integer width,
      Integer height) {
    return this.apiGatewayService.getFavorites(customerCode, language, currency, width, height);
  }

  @Override
  public CustomerProfileResponse getProfile(String customerCode, Language language) {
    return this.apiGatewayService.getProfile(customerCode, language);
  }

  @Override
  public void updateProfile(String customerCode, Language language, CustomerProfileDTO customerProfileDTO) {
    this.apiGatewayService.updateProfile(customerCode, language, customerProfileDTO);
  }

  @Override
  public TripAdvisorWidgetDTO getRatingWidget(String code) {
    return this.apiGatewayService.getRatingWidget(code);
  }

  @Override
  public TripAdvisorWidgetDTO getThumbsUpWidget(String code) {
    return this.apiGatewayService.getThumbsUpWidget(code);
  }

  @Override
  public ActivityBaTourPaginateDTO getActivityBaTours(int pageSize, int pageIndex) {
    throw new UnsupportedOperationException();
  }

  @Override
  public ActivityRatingPaginateDTO getActivityRating(String activityCode, int pageSize, int pageIndex) {
    return this.apiGatewayService.getActivityRating(activityCode, pageSize, pageIndex);
  }
  @Override
  public ActivityQuestionResponse createActivityQuestion(ActivityQuestionDTO request) {
    return this.apiGatewayService.createActivityQuestion(request);
  }
  @Override
  public BookingDTO confirm(String boookingCode, Language language) {
    throw new UnsupportedOperationException();
  }

  @Override
  public BookingDTO invalidate(String bookingCode, Language language) {
    throw new UnsupportedOperationException();
  }

  @Override
  public BookingDTO cancel(String bookingCode, Language language) {
    return this.apiGatewayService.cancel(bookingCode, language);
  }

  @Override
  public ReviewDTO validateReview(String operationCode, Language language) {
    return this.apiGatewayService.validateReview(operationCode, language);
  }

  @Override
  public ActivityReviewCreateResponse createActivityReview(ActivityReviewDTO request) {
    return this.apiGatewayService.createActivityReview(request);
  }

  @Override
  public BookingCancelInfoDTO getBookingCancelInfo(String bookingCode, Language language) {
    return this.apiGatewayService.getBookingCancelInfo(bookingCode, language);
  }

  @Override
  public BookingDTO cancel(String bookingCode, RateCancelRequest request, Language language) {
    return this.apiGatewayService.cancel(bookingCode, request, language);
  }
}
