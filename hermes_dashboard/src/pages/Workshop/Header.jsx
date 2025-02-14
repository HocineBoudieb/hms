import React from "react"
import { PropTypes } from "prop-types"

export default function Header({ title }) {
  return (
    <div className="top-0 left-0 absolute flex justify-center items-center bg-primary w-full h-[55px]">
      <h1 className="font-bold text-white text-4xl uppercase">{title}</h1>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}
