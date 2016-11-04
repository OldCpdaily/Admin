package com.wisedu.next.admin.controllers

import com.google.inject.Inject
import com.twitter.finatra.http.Controller
import com.wisedu.next.admin.domains._
import com.wisedu.next.admin.services.GroupService

/**
 * GroupController
 *
 * @author croyson
 */
class GroupController extends Controller {

  @Inject var groupService: GroupService = _

  //虚拟组添加
  post("/v2/group/add") { request: GroupAddReq =>
    groupService.addGroup(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("failed", ""))
    }
  }

  //虚拟组编辑
  post("/v2/group/edit") { request: GroupModifyReq =>
    groupService.modifyGroup(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("failed", ""))
    }
  }

  //获取一个虚拟组
  get("/v2/group/:groupId") { request: GroupReq =>
    groupService.getGroupById(request.groupId).map {
      groupResp => response.ok.header("Access-Control-Allow-Origin", "*").json(groupResp)
    }
  }

  //获取虚拟组列表
  get("/v2/groups") { request: GroupsReq =>
    groupService.getGroups(request).map {
      groupListResp => response.ok.header("Access-Control-Allow-Origin", "*").json(groupListResp)
    }
  }
  //删除虚拟组
  post("/v2/group/delete") { request: GroupDeleteReq =>
    groupService.deleteGroups(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("failed", ""))
    }
  }

  //判断是否虚拟组编号是否合法
  post("/v2/group/validGroupId"){ request: GroupValidIdReq =>
    groupService.validGroupId(request).map {
      rst => if (rst)
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("success", ""))
      else
        response.ok.header("Access-Control-Allow-Origin", "*").json(GroupOpResp("failed", ""))
    }
  }

  get("/v2/group/getGroups") { request: GroupCodesReq =>
    groupService.getGroupCodes(request.typeId.getOrElse("")).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

  //获取直播频道的内容
  get("/v2/group/live") { request: GroupLiveReq =>
    groupService.getLives(request).map {
      resp => response.ok.header("Access-Control-Allow-Origin", "*").json(resp)
    }
  }

}
