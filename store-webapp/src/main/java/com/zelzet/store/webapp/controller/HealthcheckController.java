package com.zelzet.store.webapp.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author lucianorey
 */
@RestController
public class HealthcheckController {

  @RequestMapping(value = "/healthcheck", method = RequestMethod.GET)
  @ResponseStatus(value = HttpStatus.OK)
  public String healthcheck() {
    return "success";
  }

}
