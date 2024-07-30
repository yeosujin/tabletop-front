import { Outlet } from 'react-router-dom'
import ConsumerHeader from './header'

const ConsumerLayout = () => {
    return (
        <div>
            <ConsumerHeader />
            <Outlet />
        </div>
    )
}

export default ConsumerLayout
