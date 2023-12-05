import React from 'react'
import { Link } from 'react-router-dom';
import useBreadCrumb from 'use-react-router-breadcrumbs';
import icons from '../ultils/icons';

const { MdNavigateNext } = icons;
const Breadcrumb = ({ title, category }) => {
    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title },
    ]
    console.log({ title, category });
    const breadcrumb = useBreadCrumb(routes);
    // console.log(breadcrumb);
    return (
        <div className='text-sm gap-1 flex items-center'>
            {breadcrumb?.filter(item => !item.match.route === false).map(({ match, breadcrumb }, index, self) => (
                <Link Link key={match.pathname} className='flex hover:text-main gap-1 items-center' to={match.pathname} >
                    <span className='capitalize'>{breadcrumb}</span>
                    {index === self.length - 1 ? '' : <MdNavigateNext className='inline-block' size={14} />}
                </Link>
            ))
            }
        </div >
    )
}

export default Breadcrumb