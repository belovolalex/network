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

// export const API_PORT = '3000'
// export const API_URL = `http://localhost:${API_PORT}/api`
export const API_URL = `/api`