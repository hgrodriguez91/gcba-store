package com.zelzet.store.core.util;

import org.springframework.web.util.UriComponentsBuilder;

import com.google.common.base.Strings;
import com.zelzet.api.gateway.common.listing.activity.ActivitiesResponse;
import com.zelzet.commons.data.type.Language;

/**
 * @author lucianorey
 */
public final class ActivitiesURL {

  private ActivitiesURL() {}

  public static String listing(Language language, ActivitiesResponse response, String location, String category,
      String collection, String text, String fromPrice, String toPrice, int pageSize, int pageIndex) {
    UriComponentsBuilder builder = UriComponentsBuilder.newInstance();
    if (!Strings.isNullOrEmpty(collection)) {
      builder.path("/" + response.getCollectionPublicCodes().get(language));
    } else {
      if (!Strings.isNullOrEmpty(location)) {
        builder.path("/" + location);
      }
      if (!Strings.isNullOrEmpty(category)) {
        builder.path("/" + response.getCategoryAppliedFilter().getPublicCodes().get(language));
      }
      if (!Strings.isNullOrEmpty(text)) {
        builder.queryParam("s", text);
      }
    }

    if (!Strings.isNullOrEmpty(fromPrice)) {
      builder.queryParam("fromPrice", fromPrice);
    }
    if (!Strings.isNullOrEmpty(toPrice)) {
      builder.queryParam("toPrice", toPrice);
    }
    builder.queryParam("pageSize", pageSize);
    builder.queryParam("pageIndex", pageIndex);

    return builder.build().toString();
  }

}
