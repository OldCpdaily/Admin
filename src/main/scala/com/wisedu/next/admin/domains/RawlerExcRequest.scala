package com.wisedu.next.admin.domains

import com.twitter.finatra.request.FormParam

case class RawlerExcRe(id: String, wxId: String)

case class RawlerExcReq(params: Seq[RawlerExcRe], url: String = "none", index: Int = 0, isfirst: Boolean = false, limit: Int = 5, tag: String = "none", img: String = "")

case class RawlerExcRequest(@FormParam data: String)
//python next_crawler_wx/app/run_get_articles.py --c '{"wxid":"nanxishe", "id":"498b565c-c8c7-3c42-9cbc-899b3e6a6185","index":0, "limit":5, "defaultImg":"asserts/WechatImgs/default.png"}'

case class RawlerCmdObj(wxid: String,id: String, index: Int, limit: Int,defaultImg: String)

