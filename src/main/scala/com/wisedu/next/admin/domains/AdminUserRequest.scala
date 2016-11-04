package com.wisedu.next.admin.domains

import com.twitter.finatra.request.RouteParam


case class PostAdminUserAuthRequest(@RouteParam userId: String,@RouteParam password: String)

