import type { RehypePlugin } from "@astrojs/markdown-remark"
import { visit } from "unist-util-visit"
import type { Element } from "hast"

export const prettyImages: RehypePlugin<[]> = () => (tree) => {
	visit(tree, "element", (node: Element, index, parent) => {
		// Paragraph wrapping a single image (<p><img/></p>)
		if (node.tagName === "p") {
			// Filter out non-semantic whitespace nodes created by markdown formatting
			const nonTextChildren = node.children.filter(
				(child) => !(child.type === "text" && child.value.trim() === "")
			)

			if (nonTextChildren.length !== 1) return

			const target = nonTextChildren[0]
			if (
				target.type !== "element" ||
				(target.tagName !== "img" && target.tagName !== "astro-image")
			) return

			const alt = target.properties?.alt as string | undefined

			// Transform <p> into <figure>
			node.tagName = "figure"
			node.children = [target]

			if (alt && alt.trim() !== "") {
				node.children.push({
					type: "element",
					tagName: "figcaption",
					properties: {},
					children: [{ type: "text", value: alt }],
				})
			}
			return
		}

		// Standalone <img> not inside <p> or <figure>
		if (node.tagName === "img" && parent?.type === "element" && parent.tagName !== "figure") {
			const alt = node.properties?.alt as string | undefined
			const imgCopy = { ...node }

			node.tagName = "figure"
			node.properties = {}
			node.children = [imgCopy]

			if (alt && alt.trim() !== "") {
				node.children.push({
					type: "element",
					tagName: "figcaption",
					properties: {},
					children: [{ type: "text", value: alt }],
				})
			}
		}
	})
}