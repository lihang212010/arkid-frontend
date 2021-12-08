export const NOTICE_API = [
  {
    path: '/api/v1/tenant/{parent_lookup_tenant}/notice/',
    method: 'get',
    description: '通知'
  },
  {
    path: '/api/v1/tenant/{parent_lookup_tenant}/ticket/',
    method: 'get',
    description: '待办'
  },
  {
    path: '/api/v1/tenant/{parent_lookup_tenant}/announcement/',
    method: 'get',
    description: '公告'
  }
]