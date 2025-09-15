import Header from "../components/Header/Header"
import HeroSlider from "../components/HeroSlider/HeroSlider"
import AboutUs from "../components/AboutUs/AboutUs"
import Products from "../components/Products/Products"
import Testimonials from "../components/Testimonials/Testimonials"
import Counters from "../components/Counters/Counters"
import PaymentMethods from "../components/PaymentMethods/PaymentMethods"
import CatalogDownload from "../components/CatalogDownload/CatalogDownload"
import ContactForm from "../components/ContactForm/ContactForm"
import FAQ from "../components/FAQ/FAQ"
import ComparisonTable from "../components/ComparisonTable/ComparisonTable"
import Footer from "../components/Footer/Footer"

const LandingPage = () => {
  return (
    <>
      <Header />
      <HeroSlider />
      <AboutUs />
      <Products />
      <Testimonials />
      <Counters />
      <CatalogDownload />
      <ComparisonTable />
      <FAQ />
      <PaymentMethods />
      <ContactForm />
      <Footer />
    </>
  )
}

export default LandingPage
