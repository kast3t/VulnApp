export default function Error(props) {
  return (
    <section className="site-section unselectable">
      <h1 style={{ fontSize: "16rem" }} className="text-center display-1">{props.error_code}</h1>
      <h1 style={{ fontSize: "6rem" }} className="text-center display-1">{props.error_msg}</h1>
    </section>
  )
}
