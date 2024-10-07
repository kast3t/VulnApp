import { useSelector } from "react-redux"

export const useIsAuth = () => {
    const isAuth = useSelector((state) => state.user.isAuth)
    const isLoading = useSelector((state) => state.user.isLoading)

    return [isAuth, isLoading]
}
