import request from '@/utils/request'

// 查询互助交友列表
export function listFriends(query) {
  return request({
    url: '/help/friends/list',
    method: 'get',
    params: query
  })
}

// 查询互助交友详细
export function getFriends(helpId) {
  return request({
    url: '/help/friends/' + helpId,
    method: 'get'
  })
}

// 新增互助交友
export function addFriends(data) {
  return request({
    url: '/help/friends',
    method: 'post',
    data: data
  })
}

// 修改互助交友
export function updateFriends(data) {
  return request({
    url: '/help/friends',
    method: 'put',
    data: data
  })
}

// 删除互助交友
export function delFriends(helpId) {
  return request({
    url: '/help/friends/' + helpId,
    method: 'delete'
  })
}
