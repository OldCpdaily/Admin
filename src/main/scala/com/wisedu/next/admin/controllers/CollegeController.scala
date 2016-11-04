package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.CollegeService

/**
 * CollegeController
 *
 * @author croyson
 */
class CollegeController extends Controller {

  @Inject var collegeService: CollegeService = _

  //获取所有
  get("/v2/college/getColleges") { request: CollegeNamesReq =>
    collegeService.getCollegeCodes(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  // 学校添加
  post("/v2/college/add") { request: CollegeAddReq =>
    collegeService.addCollege(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(CollegeOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(CollegeOpResp("failed", ""))
    }
  }

  //学校编辑
  post("/v2/college/edit") { request: CollegeModifyReq =>
    collegeService.modifyCollege(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(CollegeOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(CollegeOpResp("failed", ""))
    }
  }

  //获取一个学校
  get("/v2/college/:collegeId") { request: CollegeReq =>
    collegeService.getCollege(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  //获取学校列表
  get("/v2/colleges") { request: CollegesReq =>
    collegeService.getColleges(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
  //删除
  post("/v2/college/delete") { request: CollegeDeleteReq =>
    collegeService.deleteColleges(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(CollegeOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(CollegeOpResp("failed", ""))
    }
  }
}
