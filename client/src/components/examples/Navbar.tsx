import Navbar from '../Navbar'

export default function NavbarExample() {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="pt-20 px-6">
        <p className="text-muted-foreground">Scroll down to see the navbar change on scroll</p>
      </div>
    </div>
  )
}
