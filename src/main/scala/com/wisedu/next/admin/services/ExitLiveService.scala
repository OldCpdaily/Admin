package com.wisedu.next.admin.services

import java.net.URLEncoder
import javax.inject.{Inject, Singleton}

import com.twitter.finatra.json.FinatraObjectMapper
import com.twitter.util.Future
import com.wisedu.next.admin.domains.{LiveCpdailyReq, LiveCpdailyResp}
import com.wisedu.next.services.ExClient

import scala.collection.immutable.HashMap
import scala.collection.mutable.{Map => MutMap}


@Singleton
class ExitLiveService {
  @Inject var exClient: ExClient = _
  @Inject var objectMapper: FinatraObjectMapper =_

  def getLiveUpdates(request:LiveCpdailyReq):Future[Option[LiveCpdailyResp]]={
    val headers = HashMap[String,String]("Content-Type" -> "application/x-www-form-urlencoded;charset=utf-8")
    val params = MutMap("c" -> request.c,
      "a" -> request.a,
      "id" -> request.id.toString)
    val urlParam = paramConvertUrl(params.toMap)
    val formData = MutMap(
      "dataId" -> request.dataId.toString,
      "pageSize" -> request.pageSize.toString,
      "checked" -> request.checked.toString)
    exClient.postForm[LiveCpdailyResp]("/?"+urlParam,headers, paramConvertUrl(formData.toMap))
  }

  def paramConvertUrl(params: Map[String, String]): String = {
    val keys = params.keys.toArray.sorted
    val paramsUrl = new StringBuilder()
    for (key <- keys) {
      val value = params.getOrElse(key, "")
      paramsUrl.append(key).append("=").append(URLEncoder.encode(value, "utf-8")).append("&")
    }

    paramsUrl.substring(0, paramsUrl.length - 1).toString
  }


}