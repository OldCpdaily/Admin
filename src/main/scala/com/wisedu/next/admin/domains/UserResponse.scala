package com.wisedu.next.admin.domains

case class UserInfo(userId:String)
//获取一条标签
case class UserResp(status: String, errorMsg: String,datas:Option[UserInfo])

//获取标签列表
case class UserItem(userId:String,userAlice:String,userName:String,isAnonymousUser:String,userStatus:String,
                    userTag:String,sex:String,mobile:String,
                    school:String,academy:String,registerTime:String,lastLoginTime:String)
case class UserList(pageNumber:Int,totalSize:Int,pageSize:Int,rows:Seq[UserItem])
case class UserData(userList:UserList)
case class UserListResp(code: String,datas:UserData)
