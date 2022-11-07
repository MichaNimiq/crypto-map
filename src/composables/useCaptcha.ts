const recapthaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export function useCaptcha() {
  async function getToken() {
    // @ts-ignore
    const token = await grecaptcha.execute(recapthaKey, { action: "submit" })
    return token
  }

  const loadRecaptcha = () => {
    console.log("Loading recaptcha")
    const script = document.createElement("script");

    script.src = `https://www.google.com/recaptcha/api.js?render=${recapthaKey}`;
    script.id = 'recaptcha-script';
    script.async = true;

    document.body.append(script);
  }

  const removeRecaptcha = () => {
    const script = document.getElementById('recaptcha-script');
    if (script) {
      script.remove();
    }

    const recaptchaElems = document.getElementsByClassName('grecaptcha-badge');
    if (recaptchaElems.length) {
      recaptchaElems[0].remove();
    }
  }


  return {
    getToken,
    loadRecaptcha,
    removeRecaptcha
  }
}