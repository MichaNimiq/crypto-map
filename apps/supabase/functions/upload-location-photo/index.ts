// Deno.serve(async (req) => {
// const { name } = await req.json()
// const data = {
//   message: `Hello ${name}!`,
// }
// console.log('req', req)
// return new Response('Hello world' + name)

// return new Response(JSON.stringify({ data: 'ho' }), { headers: { 'Content-Type': 'application/json' } })
// })
import { defineEventHandler, toWebHandler, createApp, readMultipartFormData, readBody } from "https://esm.sh/h3@latest";
// import sharp from 'https://esm.sh/sharp@0.33.2'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { request } from "http";

export const app = createApp();
app.use(defineEventHandler(async (event) => {

  /**
   * The user can upload two types of photos:
   *    - Using a multipart form with the field name `photo` and the header `Content-Type: multipart/form-data`
   *    - Using a base64 encoded string with the field name `photo`, `uuid`, and the `format`. Also the header `Content-Type: application/json`
   */
  let photoBuffer, filename
  if (event.headers.get('Content-Type') === 'application/json') {
    const body = await readBody(event)
    if (!body.photo || !body.uuid || !body.format) {
      return new Response('The field `photo`, `uuid` and `format` are required. Got ' + JSON.stringify(body), { status: 400 })
    }
    photoBuffer = Buffer.from(body.photo, 'base64')
    filename = `${body.uuid}.${body.format}`
  } else if (event.headers.get('Content-Type')?.startsWith('multipart/form-data')) {
    const form = await readMultipartFormData(event)
    const photo = form?.find(f => f.name === 'photo')
    if (!photo || !photo.filename)
      return new Response('The field `photo` and `filename` are required', { status: 400 })

    photoBuffer = photo.data
    filename = photo.filename
  } else {Missing environment variables
    return new Response('The field `photo` is required. Use `Content-Type: application/json` or `Content-Type: multipart/form-data`. Got `Content-Type`: ' + event.headers.get('Content-Type'), { status: 400 })
  }

  const url = Deno.env.get('SUPABASE_URL')
  const apikey = Deno.env.get('SUPABASE_ANON_KEY')
  const email = Deno.env.get('DB_AUTH_EMAIL')
  const password = Deno.env.get('DB_AUTH_PASSWORD')

  if (!url || !apikey || !email || !password) {
    return new Response('Missing environment variables', { status: 500 })
  }

  const client = createClient(url, apikey)
  console.log('Image conversion and resizing successful.');
  const bucket = client.storage.from('locations-photo')

  const { data, error } = await bucket.update(filename, photoBuffer)
  if (error)
    return new Response('Error updating image', { status: 500 })


  return new Response(JSON.stringify({ data }), { headers: { 'Content-Type': 'text/plain' } })
}));

// @ts-ignore I don't know why TS is complaining about this
// https://h3.unjs.io/adapters/deno
Deno.serve(toWebHandler(app));


