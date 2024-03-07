import { defineEventHandler, toWebHandler, createApp, readMultipartFormData, readBody } from "https://esm.sh/h3@latest";
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

export const app = createApp();
app.use(defineEventHandler(async (event) => {
  /**
   * The user can upload two types of photos:
   *    - Using a multipart form with the field name `photo` and the header `Content-Type: multipart/form-data`
   *    - Using a base64 encoded string with the field name `photo`, `uuid`, and the `format`. Also the header `Content-Type: application/json`
   */
  let photoBuffer, filename, mimeType
  if (event.headers.get('Content-Type') === 'application/json') {
    const body = await readBody(event)
    if (!body.photo || !body.uuid || !body.format) {
      return new Response('The field `photo`, `uuid` and `format` are required. Got ' + JSON.stringify(body), { status: 400 })
    }
    photoBuffer = Buffer.from(body.photo, 'base64')
    filename = `${body.uuid}.${body.format}`
    mimeType = `image/${body.format}`
  } else if (event.headers.get('Content-Type')?.startsWith('multipart/form-data')) {
    const form = await readMultipartFormData(event)
    const photo = form?.find(f => f.name === 'photo')
    if (!photo || !photo.filename || !photo.type)
      return new Response('The field `photo`, `filename` and `type` are required' + JSON.stringify(photo), { status: 400 })

    photoBuffer = photo.data
    filename = photo.filename
    mimeType = photo.type
  } else {
    return new Response('The field `photo` is required. Use `Content-Type: application/json` or `Content-Type: multipart/form-data`. Got `Content-Type`: ' + event.headers.get('Content-Type'), { status: 400 })
  }

  const url = Deno.env.get('SUPABASE_URL')
  const apikey = Deno.env.get('SUPABASE_ANON_KEY')
  const email = Deno.env.get('DB_AUTH_EMAIL')
  const password = Deno.env.get('DB_AUTH_PASSWORD')

  if (!url || !apikey || !email || !password) {
    return new Response(`Missing environment variables ${JSON.stringify({ url, apikey, email, password })}`, { status: 500 })
  }

  const client = createClient(url, apikey)
  const { error: errorUser } = await client.auth.signInWithPassword({ email, password })
  if (errorUser)
    return new Response(`Error signing in. ${JSON.stringify(errorUser)}`, { status: 500 })

  console.log('Image conversion and resizing successful.');
  const bucket = client.storage.from('locations-photo')

  const { data: signedUrl, error: errorSignedUrl } = await bucket.createSignedUploadUrl(filename)
  if (errorSignedUrl)
    return new Response(`Error creating signed url. ${JSON.stringify(errorSignedUrl)}`, { status: 500 })

  const { data, error } = await bucket.uploadToSignedUrl(filename, signedUrl.token, photoBuffer, { contentType: mimeType })
  if (error)
    return new Response(`Error updating image. ${JSON.stringify(error)}`, { status: 500 })

  return new Response(JSON.stringify({ data }), { headers: { 'Content-Type': 'text/plain' } })
}));

// @ts-ignore I don't know why TS is complaining about this
// https://h3.unjs.io/adapters/deno
Deno.serve(toWebHandler(app));


