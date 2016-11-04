package com.wisedu.next.admin

import com.twitter.finatra.http.HttpServer
import com.twitter.finatra.http.filters.CommonFilters
import com.twitter.finatra.http.routing.HttpRouter
import com.twitter.finatra.json.modules.FinatraJacksonModule
import com.twitter.finatra.json.utils.CamelCasePropertyNamingStrategy
import com.wisedu.next.admin.controllers._
import com.wisedu.next.admin.filters.AdminUserFilters
import com.wisedu.next.modules.{VarnishHttpClientModule, DataBaseModule, ExHttpClientModule, JPushHttpClientModule}

object NextServerMain extends NextServer

class NextServer extends HttpServer {

  override val modules = Seq(DataBaseModule, ExHttpClientModule, JPushHttpClientModule,VarnishHttpClientModule)

  override def jacksonModule = CustomJacksonModule

  override def configureHttp(router: HttpRouter) {
    router
      .filter[CommonFilters]
      .add[OptionController]
      .add[AdminUserFilters,RawlerExcController]
      .add[AuthController]
      .add[FeedController]
      .add[GroupController]
      .add[MediaController]
      .add[AdminUserFilters,SysCodeController]
      .add[AdminUserFilters,TagController]
      .add[AdminUserFilters,CollegeController]
      .add[FeedLotteryDrawController]
      .add[AdminUserFilters,UpdateController]
      .add[AdminUserFilters,UserController]
      .add[AdminUserFilters,PushController]
      .add[CircleController]
      .add[AdminUserFilters,StaticsController]
  }

}

object CustomJacksonModule extends FinatraJacksonModule {
  override val propertyNamingStrategy = CamelCasePropertyNamingStrategy
}