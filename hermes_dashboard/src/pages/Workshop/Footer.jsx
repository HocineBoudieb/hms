import React from "react"
import { PropTypes } from "prop-types"

export default function Header({ title, children }) {
  return (
    <div className="bottom-0 left-0 absolute flex justify-center items-center bg-gray-600 w-full h-[50px]">
      <h1 className="font-bold text-white text-4xl uppercase">{title}</h1>
      {children}
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}
