import { useSelector } from "react-redux"

export const useAccount = () => {
    const account = useSelector((state) => state.user.user)

    return account
}
