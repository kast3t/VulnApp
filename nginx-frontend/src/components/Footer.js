export default function Footer() {
  return (
    <footer className="site-footer" style={{ flex: "0 0 auto" }}>
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <p className="small unselectable" style={{ marginBottom: "0px" }}>
              VulnApp © {(new Date().getFullYear())} | Happy hacking :3
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
