export default function debug(msg: any = null) {
  if (import.meta.env.VITE_DEBUG) {
    console.log(msg);
  }
}
