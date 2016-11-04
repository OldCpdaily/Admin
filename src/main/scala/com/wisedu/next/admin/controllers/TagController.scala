package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.TagService

/**
 * TagController
 *
 * @author croyson
 */
class TagController extends Controller {

  @Inject var tagService: TagService = _

  // 标签添加
  post("/v2/tag/add") { request: TagAddReq =>
    tagService.addTag(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("failed", ""))
    }
  }

  //标签编辑
  post("/v2/tag/edit") { request: TagModifyReq =>
    tagService.modifyTag(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("failed", ""))
    }
  }

  //获取一个标签
  get("/v2/tag/:tagId") { request: TagReq =>
    tagService.getTag(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  //获取标签列表
  get("/v2/tags") { request: TagsReq =>
    tagService.getTags(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
  //删除
  post("/v2/tag/delete") { request: TagDeleteReq =>
    tagService.deleteTags(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("failed", ""))
    }
  }

  //验证标签
  post("/v2/tag/validTagId") { request: TagValidIdReq =>
    tagService.validTagId(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(TagOpResp("failed", ""))
    }
  }

  //获取所有
  get("/v2/tag/getTags") { request: TagsGetReq =>
    tagService.getTagCodes(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }
}
