package com.wisedu.next.admin.services

import java.io.File
import javax.inject.{Inject, Singleton}

import com.twitter.finatra.annotations.Flag
import com.twitter.finatra.json.FinatraObjectMapper
import com.twitter.util._
import com.wisedu.next.admin.domains.{RawlerCmdObj, RawlerExcReq, RawlerExcRequest}
import com.wisedu.next.annotations.NewSqlDatabase
import com.wisedu.next.models.AppDatabase

import scala.sys.process._

@Singleton
class RawlerFunctions {

  @Inject
  @Flag("local.doc.root") var filePath: String = _
  @Inject
  @NewSqlDatabase var appDatabase: AppDatabase = _
  @Inject var objectMapper: FinatraObjectMapper = _

  def execWxRawler(rawlerExcRequest: RawlerExcRequest): Future[Unit] = {
    Future {
      val dat = objectMapper.parse[RawlerExcReq](rawlerExcRequest.data)
      var cmd: String = "python next_crawler_wx/app/run_get_articles.py "

      for (p <- dat.params) {
        cmd += " --c " + objectMapper.writeValueAsString(RawlerCmdObj(p.wxId, p.id, dat.index, dat.limit, "asserts/WechatImgs/default.png"))
      }
      Process(cmd, new File(filePath + "Next-Crawler/")).run()


    }
  }

  def execWxRawlerKill(rawlerExcRequest: RawlerExcRequest): Future[Unit] = {
    Future {
      val serIds = rawlerExcRequest.data.split(",")
      for (serId <- serIds) {
        val cmdStr: String = "python next_crawler_wx/process_kill.py --id " + serId
        Process(cmdStr, new File(filePath + "Next-Crawler/")).run()
      }
    }
  }

  //python next_crawler_wx/app/run_get_articles.py --c '{"wxid":"nanxishe", "id":"498b565c-c8c7-3c42-9cbc-899b3e6a6185","index":0, "limit":5, "defaultImg":"asserts/WechatImgs/default.png"}'
  def execWxRawlerAll(): Future[Unit] = {
    appDatabase.services.collServices("", "0", "", 1000, 0).map {
      services => {
        var cmd = "python  next_crawler_wx/app/run_get_articles.py "
        services.map {
          service => cmd += " --c " +
            objectMapper.writeValueAsString(RawlerCmdObj(service.srcId, service.serId, 0, 5, "asserts/WechatImgs/default.png"))
        }
        Process(cmd, new File(filePath + "Next-Crawler/")).run()
      }
    }
  }

  def getWxRawlersStatus(): Future[Boolean] = {
    appDatabase.serviceCrawlers.collServiceCrawlers().map {
      serviceCrawlers => serviceCrawlers.filter(serviceCrawler => serviceCrawler.crawlers.getOrElse("get_wechat_articles", "").equals("抓取中"))
    }.map {
      serviceCrawlers => if (serviceCrawlers.nonEmpty) true else false
    }
  }
}
