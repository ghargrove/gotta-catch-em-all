import React from 'react'

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** Render a number as a currency */
export const Currency: React.FC<{ children: number }> = (props) => {
  const { children } = props

  return <React.Fragment>{formatter.format(children)}</React.Fragment>
}