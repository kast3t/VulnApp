import * as Yup from 'yup'


export const LoginSchema = Yup.object().shape({
    email: Yup.string().trim()
        .required("Поле не может быть пустым")
        .email("Неверный email"),
    password: Yup.string().trim()
        .required("Поле не может быть пустым"),
})

export const SignupSchema = Yup.object().shape({
    username: Yup.string().trim()
        .required("Поле не может быть пустым")
        .min(5, "Минимум 5 символов"),
    email: Yup.string().trim()
        .required("Поле не может быть пустым")
        .email("Неверный email"),
    password: Yup.string().trim()
        .required("Поле не может быть пустым"),
})

export const AccountUpdateSchema = Yup.object().shape({
    email: Yup.string().trim()
        .email("Неверный email"),
    password: Yup.string().trim()
        .min(1, "Поле не может быть пустым"),
})

export const CommentSchema = Yup.object().shape({
    text: Yup.string().trim()
        .required("Поле не может быть пустым"),
})
