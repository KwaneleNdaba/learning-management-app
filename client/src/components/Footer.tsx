import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <div className='footer'>
      <p className=""> &copy; 2025 LSM. ALL Rights Reserved.</p>
        <div className="footer_links">
        {
            ["About", "Privacy Policy", "Licensing", "Contact"].map((item, index) =>(
                <Link
                key={index}
                href={item}
                className='footer__link'
                >
                    {item}
                </Link>
            ))
        }
        </div>
    </div>
  )
}

export default Footer
