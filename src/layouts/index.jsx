import SiteHeader from './header'
import SiteFooter from './footer'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <div>
            {/* header */}
            <SiteHeader />

            {/* content */}
            <Outlet />

            {/* footer */}
            <SiteFooter />
        </div>
    )
}

export default Layout
