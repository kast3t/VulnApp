export default function TextWithParagraphs(props) {
    const textWithParagraphs = props.text.split("\n").map(str => <p>{str}</p>)

    let htmlWithParagraphs = ""
    Object.values(textWithParagraphs).forEach(paragraph => htmlWithParagraphs += `<p>${paragraph.props.children}</p>`)

    return <div dangerouslySetInnerHTML={{ __html: htmlWithParagraphs }}></div>
}
