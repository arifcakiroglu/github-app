export default [
  {
    path: '/',
    name: 'login',
    component: require('components/login')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: require('components/dashboard')
  },
  {
    path: '*',
    redirect: '/'
  }
]
