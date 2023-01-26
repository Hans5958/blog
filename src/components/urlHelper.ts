import { BASE_URL } from "../config.js"

export default function relativeUrl(absoulteUrl: string) {
	return BASE_URL + absoulteUrl
}