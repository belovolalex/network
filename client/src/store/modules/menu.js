export default {
  namespaced: true,
  state: {
    list: [
      {
        title: 'Моя страница ',
        icon: 'icon-home2',
        url: '/'
      },
      {
        title: 'Друзья ',
        icon: 'icon-user',
        url: '/friends'
      },
      {
        title: 'Сообщения ',
        icon: 'icon-bubbles2',
        url: '/messages'
      }
    ]
  }
}