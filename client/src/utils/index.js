export const dictionary = {
  en: {
    messages: {
      email: 'enter a valid email',
      required: 'this field is required',
      alpha: 'enter only letters',
      min: 'min length 6 characters'
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

export const API_URL = `/api`