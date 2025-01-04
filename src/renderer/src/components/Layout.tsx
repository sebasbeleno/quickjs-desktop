import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
     {/*  <div className="w-full flex flex-row">
        <div className="w-28 "></div>
        <div>
          <div className="w-16">
            <span className="text-xs">index.js</span>
          </div>
        </div>
      </div> */}
      {children}
    </div>
  )
}

export default Layout
