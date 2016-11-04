package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.twitter.finagle.http.Method
import com.twitter.finatra.httpclient.{HttpClient, RequestBuilder}
import com.twitter.util.Future
import com.wisedu.next.annotations.VarnishHttpClient


@Singleton
class VarnishService {
  @Inject
  @VarnishHttpClient var varnishHttpClient: HttpClient = _

  def purgeVarnish(url: String): Future[Boolean] = {

    varnishHttpClient.execute(RequestBuilder.create(Method("PURGE"), url)).map {
      ret => if (ret.status.code == 200) {
        true
      } else {
        false
      }
    }
  }

}