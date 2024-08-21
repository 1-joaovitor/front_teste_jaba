// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'bx:home-circle',
    },
    {
      title: 'Second Page',
      path: '/second-page',
      icon: 'bx:envelope',
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Access Control',
      icon: 'bx:shield',
    },
    {
      path: '/products',
      action: 'read',
      subject: 'acl-page',
      title: 'Produtos',
      icon: 'bx:box',
    },
    {
      path: '/categories',
      action: 'read',
      subject: 'acl-page',
      title: 'Categorias',
      icon: 'bx:category',
    }
  ]
}

export default navigation
