export default function Loading(props) {
  const size = props.size ? props.size + "rem" : "25rem"

  return (
    <section className="site-section">
      <div class="d-flex justify-content-center">
        <div class="spinner-border" style={{ color: "black", width: size, height: size }} role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </section>
  )
}
