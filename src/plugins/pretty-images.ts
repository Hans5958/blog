// Adapted from JuanM04/portfolio
// https://github.com/JuanM04/portfolio/blob/main/src/plugins/better-images.ts

import type { RehypePlugin } from "@astrojs/markdown-remark"
import { visit } from "unist-util-visit"

export const betterImages: RehypePlugin<[]> = () => tree => {
	visit(tree, "element", (node, _index, parent) => {

		let alt

		// console.log(node.tagName, parent?.type, node)

		if (node.tagName === "p") {

			if (node.children.length !== 1) return
			const children = node.children[0]
			if (children.name !== "__AstroImage__" && children.tagName !== "img") return
			node.tagName = "figure"

			alt = children?.properties?.alt || children?.attributes?.filter(entry => entry.name === 'alt')?.[0]?.value

		} else if (node.tagName === "img") {
			console.log("img!", parent?.type)

			if (parent && parent.type === "element" && parent.tagName === "figure") return

			console.log("img!")

			const imgNode = structuredClone(node)

			node.tagName = "figure"
			node.properties = {}
			node.children = []

			node.children.push({
				...imgNode,
				type: "element",
			})

			alt = node.properties?.alt

		} else return

		if (alt) {
			node.children.push({
				type: "element",
				tagName: "figcaption",
				properties: {},
				children: [{ type: "text", value: alt }],
			})
		}



	})
}
