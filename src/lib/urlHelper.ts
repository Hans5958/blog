import { BASE_URL } from "@/config"

export default function relativeUrl(absoulteUrl: string) {
	return BASE_URL + absoulteUrl
}