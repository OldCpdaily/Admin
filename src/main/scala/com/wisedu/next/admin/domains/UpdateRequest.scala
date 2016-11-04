package com.wisedu.next.admin.domains

import com.twitter.finagle.http.Request
import com.twitter.finatra.request._

case class GetUpdatesRequest(@RouteParam feed_id: String, @QueryParam limits: Int = 5, @QueryParam offset: Int = 0)

case class GetUpdatesResponse(updates: Seq[GetUpdatesResp])


case class GetFeedUpdateRequest(@RequestInject request: Request, @RouteParam updateId: String)