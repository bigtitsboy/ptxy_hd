import request from '@/utils/request'

// 查询租房列表
export function listRent(query) {
  return request({
    url: '/house/rent/list',
    method: 'get',
    params: query
  })
}

// 查询租房详细
export function getRent(houseId) {
  return request({
    url: '/house/rent/' + houseId,
    method: 'get'
  })
}

// 新增租房
export function addRent(data) {
  return request({
    url: '/house/rent',
    method: 'post',
    data: data
  })
}

// 修改租房
export function updateRent(data) {
  return request({
    url: '/house/rent',
    method: 'put',
    data: data
  })
}

// 删除租房
export function delRent(houseId) {
  return request({
    url: '/house/rent/' + houseId,
    method: 'delete'
  })
}
