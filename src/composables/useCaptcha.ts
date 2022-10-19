const recapthaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export function useCaptcha() {
  async function captchaOk() {
    const token = await grecaptcha.execute(recapthaKey, { action: "submit" })
    // TODO Check token 
    console.log(token)
    return true
    // grecaptcha.ready(async function () {
    // })
  }

  return {
    captchaOk
  }
}