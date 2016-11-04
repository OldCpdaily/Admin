package com.wisedu.next.admin.services

import javax.inject.{Inject, Singleton}

import com.wisedu.next.services.GroupFeedsBaseService

@Singleton
class GroupFeedsService {

  @Inject var groupFeedsBaseService: GroupFeedsBaseService = _
  @Inject var sysCodeService: SysCodeService = _


}