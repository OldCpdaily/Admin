package com.wisedu.next.admin.filters

import javax.inject.Inject

import com.twitter.finagle.http.{Request, Response}
import com.twitter.finagle.{Service, SimpleFilter}
import com.twitter.finatra.http.response.ResponseBuilder
import com.twitter.util.Future
import com.wisedu.next.admin.services.AdminUserService

case class InjectAdminUser(userId: String)

class AdminUserFilters extends SimpleFilter[Request, Response] {
  @Inject var responseBuilder: ResponseBuilder = _
  @Inject var adminUserService: AdminUserService = _

  override def apply(request: Request, service: Service[Request, Response]): Future[Response] = {
    if (request.uri.contains(".css") || request.uri.contains(".js")
      || request.uri.contains(".jpg") || request.uri.contains(".png")) {
      service(request)
    } else {
      request.cookies.get("Authorization") match {
        case Some(auth) => adminUserService.getByTokens(auth.value).flatMap {
          case Some(token) => {
            AdminUserContext.setUser(request, token.userId)
            service(request)
          }
          case None =>
            Future {
              responseBuilder.ok.file("html/login.html")
            }
        }
        case None => Future {
          responseBuilder.ok.file("html/login.html")
        }
      }
    }
  }
}

object AdminUserContext {
  private val UserField = Request.Schema.newField[InjectAdminUser]()

  implicit class UserContextSyntax(val request: Request) extends AnyVal {
    def user: InjectAdminUser = request.ctx(UserField)
  }

  private[admin] def setUser(request: Request, userId: String): Unit = {
    val user = InjectAdminUser(userId)
    request.ctx.update(UserField, user)
  }
}
