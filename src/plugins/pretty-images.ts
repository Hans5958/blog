// Adapted from JuanM04/portfolio
// https://github.com/JuanM04/portfolio/blob/main/src/plugins/better-images.ts

import type { RehypePlugin } from "@astrojs/markdown-remark"
import { visit } from "unist-util-visit"

export const prettyImages: RehypePlugin<[]> = () => tree => {
	visit(tree, "element", (node, _index, parent) => {

		let alt

		if (node.tagName === "p") {

			if (node.children.length !== 1) return
			const children = node.children[0]
			if (children.name !== "__AstroImage__" && children.tagName !== "img") return
			node.tagName = "figure"

			alt = children?.properties?.alt || children?.attributes?.filter(entry => entry.name === 'alt')?.[0]?.value

		} else if (node.tagName === "img") {
			if (parent && parent.type === "element" && parent.tagName === "figure") return

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
