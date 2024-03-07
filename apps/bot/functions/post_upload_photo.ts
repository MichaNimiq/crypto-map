import {
  DefineFunction,
  SlackFunction,
} from 'https://deno.land/x/deno_slack_sdk@2.2.0/mod.ts'
import { getDbAuthUserArgs } from '../util/db-args.ts'

export const PostUploadPhoto = DefineFunction({
  callback_id: 'post_uploadPhoto',
  title: 'Post upload photo',
  description: 'Uploads a photo to the database',
  source_file: 'functions/post_upload_photo.ts',
  input_parameters: {
    properties: {
      uuid: {
        type: 'string',
        description: 'UUID of the location',
      },
      photo: {
        type: 'string',
        description: 'Photo of the location',
      },
    },
    required: ['uuid', 'photo'],
  }
})

export default SlackFunction(
  PostUploadPhoto,
  async ({ env, inputs }) => {
    // TODO
    const fnUrl = env.SUPABASE_UPLOAD_PHOTO_FUNCTION
    if (!fnUrl)
      return { error: 'No edge function defined' }

    const { apikey, authToken } = await getDbAuthUserArgs(env, false)

    if (!authToken)
      return { error: 'No token' }

    // eslint-disable-next-line no-console
    console.log(`POST ${fnUrl}`)

    const { uuid, photo } = inputs
    const body = JSON.stringify({ uuid, photo })
    const headers = { Authorization: `Bearer ${authToken}`, apikey }

    // The function takes more than 15 seconds to run, so we cannot wait for it
    const res = await fetch(fnUrl, { method: 'POST', body, headers }).catch(error => `Error POST ${fnUrl}: ${error}`)
    if (!res || typeof res === 'string') return { error: 'No response. ' + res }

    console.log(`Updated photo to Supabase Storage`)
    console.log(res)
    console.log(await res.json())
    return { outputs: {} }
  },
)
