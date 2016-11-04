package com.wisedu.next.admin.domains

import java.util.UUID

import org.joda.time.DateTime

case class GetUpdatesResp( user_name: String, user_img_url: String,
                          user_college: String, user_depart: String, user_grade: String, likes: Long, content: String,
                          user_sex: String, cTime: DateTime, sub_update_num: Long, img_url: String,  isAnonymousUpdate: Int)



case class FeedUpdateInfo(update_id: UUID, feed_id: UUID, user_id: UUID, content: String, c_time: DateTime,
                             like_num: Long, unlike_num: Long, p_update_id: UUID, update_level: Int, img_urls: String )

case class FeedUpdateResp(status: String, errorMsg: String,datas:Option[GetUpdatesResp])
