import { useOutletContext } from 'react-router-dom'

const MenuPage = () => {
    const outletprops = useOutletContext()
    console.log(outletprops)

    return <div>menu page</div>
}

export default MenuPage
