package com.wisedu.next.admin.domains

import com.twitter.finagle.http.Request
import com.twitter.finatra.request.{RequestInject, RouteParam}


//图片上传request
case class ImageUpdateRequest(@RequestInject request: Request, @RouteParam name: Option[String])