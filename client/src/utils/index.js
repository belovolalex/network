export const dictionary = {
  ru: {
    messages: {
      email: 'введите корректный email',
      required: 'поле обязательное для заполнения',
      alpha: 'вводите только буквы',
      min: 'минимальная длина 6 символов'
    }
  }
}

export function headers() {
  return {
    headers: {
      'Authorization' : localStorage.getItem('token')
    }
  }
}

// export const API_PORT = '3000'
// export const API_URL = `http://localhost:${API_PORT}/api`
export const API_URL = `/api`