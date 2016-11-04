package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.SysCodeService

/**
 * SysCodeController
 *
 * @author croyson
 */
class SysCodeController extends Controller {

  @Inject var sysCodeService: SysCodeService = _

  //码表数据添加
  post("/v2/syscode/add") { request: SysCodeAddReq =>
    sysCodeService.addSysCode(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("failed", ""))
    }
  }

  //码表编辑
  post("/v2/syscode/edit") { request: SysCodeModifyReq =>
    sysCodeService.updateSysCode(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("failed", ""))
    }
  }

  //获取一个码表数据
  get("/v2/syscode") { request: SysCodeReq =>
    sysCodeService.getSysCode(request: SysCodeReq).map {
      sysCodeOneResp => response.ok.header("Access-Control-Allow-Origin", "*").json(sysCodeOneResp)
    }
  }

  //获取列表
  get("/v2/syscodes") { request: SysCodesReq =>
    sysCodeService.getSysCodes(request).map {
      sysCodesListResp => response.ok.header("Access-Control-Allow-Origin", "*").json(sysCodesListResp)
    }
  }
  //删除
  post("/v2/syscode/delete") { request: SysCodeDeleteReq =>
    sysCodeService.delSysCode(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("failed", ""))
    }
  }

  //判断是否虚拟组编号是否合法
  get("/v2/syscode/validType") { request: SysCodeValidReq =>
    sysCodeService.validSysCode(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(SysCodeOpResp("failed", ""))
    }
  }

  //获取某一类型下的所有信息 (一般用做下拉框)
  get("/v2/syscodes/:typeId") { request: SysCodeByTypeReq =>
    sysCodeService.getSysCodesByType(request).map {
      sysCodeOneTypeResp => response.ok.header("Access-Control-Allow-Origin", "*").json(sysCodeOneTypeResp)
    }
  }


}
