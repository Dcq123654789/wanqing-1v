import { useLaunch } from '@tarojs/taro'
import { useUserStore } from '@/store/userStore'
import './app.scss'

function App(props: any) {
  useLaunch(() => {
    console.log('App launched.')

    // 初始化认证状态，从本地存储恢复登录信息
    const userStore = useUserStore.getState()
    userStore.initializeAuth()
  })

  return (
    <>
      {props.children}
    </>
  )
}

export default App
